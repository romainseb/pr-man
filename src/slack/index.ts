import * as Slack from "slack-node"
import {
	buildAttachment,
	buildBlock,
	buildDiscussedAttachment,
	isAuthorRole,
	usersContainsRole
} from "./slack-tools"

/**
 * this function return a slack api to use it
 * @param {string} slackToken the slack token obviously
 */
export function getSlackApi(slackToken: EnvironmentVariable) {
	return new Slack(slackToken)
}

/**
 * this function send the pr to slack
 * @param {array} repositories the repositories result
 * @param {object} configuration the configuration for the team
 * @param {object} slackApi the slack api
 */
export function sendPrsToSlack(
	repositories: RepositoryToReview[],
	configuration: Configuration,
	slackApi: any
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
					.filter(isAuthorRole(users, ROLE.FRONTEND))
					.map(buildAttachment(repository.repository))
			)
			backendPRs = backendPRs.concat(
				repository.prToReview
					.filter(isAuthorRole(users, ROLE.BACKEND))
					.map(buildAttachment(repository.repository))
			)
			backendPRs = backendPRs.concat(
				repository.prToReview
					.filter(isAuthorRole(users, ROLE.OPS))
					.map(buildAttachment(repository.repository))
			)
			qAPRs = qAPRs.concat(
				repository.prToReview
					.filter(isAuthorRole(users, ROLE.QA))
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
		if (usersContainsRole(users, ROLE.FRONTEND)) {
			attachments.push(
				buildBlock("Frontend review required", "#3949AB", frontendPRs)
			)
		}
		if (usersContainsRole(users, ROLE.BACKEND)) {
			attachments.push(
				buildBlock("Backend review required", "#546E7A", backendPRs)
			)
		}

		if (usersContainsRole(users, ROLE.QA)) {
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
