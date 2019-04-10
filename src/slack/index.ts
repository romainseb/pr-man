import * as Slack from "slack-node"
import {
	EnvironmentVariable,
	RepositoryToReview,
	Configuration,
	Role
} from "../types"
import {
	buildAttachment,
	buildBlock,
	buildDiscussedAttachment,
	isAuthorRole,
	usersContainsRole
} from "./slack-tools"

/**
 * this function return a slack api to use it
 * @param slackToken the slack token obviously
 */
export function getSlackApi(slackToken: EnvironmentVariable) {
	return new Slack(slackToken)
}

/**
 * this function send the pr to slack
 * @param repositories the repositories result
 * @param configuration the configuration for the team
 * @param slackApi the slack api
 */
export function sendPrsToSlack(
	repositories: RepositoryToReview[],
	configuration: Configuration,
	slackApi: Slack
) {
	return new Promise((resolve, reject) => {
		const { users } = configuration
		let frontendPRs: string[] = []
		let backendPRs: string[] = []
		let qAPRs: string[] = []
		let discussedPRs: string[] = []
		let approvedPRs: string[] = []

		repositories.forEach(repository => {
			frontendPRs = frontendPRs.concat(
				repository.prToReview
					.filter(isAuthorRole(users, Role.FRONTEND))
					.map(buildAttachment(repository.repository))
			)
			backendPRs = backendPRs.concat(
				repository.prToReview
					.filter(isAuthorRole(users, Role.BACKEND))
					.map(buildAttachment(repository.repository))
			)
			backendPRs = backendPRs.concat(
				repository.prToReview
					.filter(isAuthorRole(users, Role.OPS))
					.map(buildAttachment(repository.repository))
			)
			qAPRs = qAPRs.concat(
				repository.prToReview
					.filter(isAuthorRole(users, Role.QA))
					.map(buildAttachment(repository.repository))
			)
			discussedPRs = discussedPRs.concat(
				repository.prToDiscuss.map(
					buildDiscussedAttachment(repository.repository, users)
				)
			)
			approvedPRs = approvedPRs.concat(
				repository.prToMerge.map(buildAttachment(repository.repository))
			)
		})

		const attachments = []
		if (usersContainsRole(users, Role.FRONTEND)) {
			attachments.push(
				buildBlock("Frontend review required", "#3949AB", frontendPRs)
			)
		}
		if (usersContainsRole(users, Role.BACKEND)) {
			attachments.push(
				buildBlock("Backend review required", "#546E7A", backendPRs)
			)
		}

		if (usersContainsRole(users, Role.QA)) {
			attachments.push(buildBlock("QA review required", "#2c3e50", qAPRs))
		}

		attachments.push(buildBlock("Request changes", "#e53935", discussedPRs))
		attachments.push(buildBlock("Ready to merge", "#43A047", approvedPRs))

		slackApi.api(
			"chat.postMessage",
			{
				channel: configuration.slackChannel,
				text: "",
				username: `PR MAN`,
				// eslint-disable-next-line @typescript-eslint/camelcase
				link_names: "true",
				// eslint-disable-next-line @typescript-eslint/camelcase
				icon_emoji: ":butler:",
				// as_user: true,
				attachments: JSON.stringify(attachments)
			},
			(err: any, response: any) => {
				if (err) {
					return reject(err)
				}
				return resolve(response)
			}
		)
	})
}
