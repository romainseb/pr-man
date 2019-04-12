import * as Slack from "slack-node"
import {
	Token,
	RepositoryToReview,
	Configuration,
	Role,
	Attachment,
	User,
	ExecutionResult,
	ExecutionStatus
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
export function getSlackApi(slackToken: Token) {
	return new Slack(slackToken)
}

function getAttachmentString(
	repositories: RepositoryToReview[],
	users: User[]
): [string[], string[], string[], string[], string[]] {
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
	return [frontendPRs, backendPRs, qAPRs, discussedPRs, approvedPRs]
}

function getAttachments(
	users: User[],
	frontendPRs: string[],
	backendPRs: string[],
	qAPRs: string[],
	discussedPRs: string[],
	approvedPRs: string[]
): Attachment[] {
	const attachments: Attachment[] = []
	if (usersContainsRole(users, Role.FRONTEND) && frontendPRs.length > 0) {
		attachments.push(
			buildBlock("Frontend review required", "#3949AB", frontendPRs)
		)
	}
	if (usersContainsRole(users, Role.BACKEND) && backendPRs.length > 0) {
		attachments.push(
			buildBlock("Backend review required", "#546E7A", backendPRs)
		)
	}

	if (usersContainsRole(users, Role.QA) && qAPRs.length > 0) {
		attachments.push(buildBlock("QA review required", "#2c3e50", qAPRs))
	}

	if (discussedPRs.length > 0) {
		attachments.push(buildBlock("Request changes", "#e53935", discussedPRs))
	}
	attachments.push(buildBlock("Ready to merge", "#43A047", approvedPRs))
	return attachments
}

export async function callSlack(
	attachments: Attachment[],
	configuration: Configuration,
	preResult: ExecutionResult,
	slackApi: Slack
): Promise<ExecutionResult> {
	return new Promise<ExecutionResult>((resolve, reject) => {
		slackApi.api(
			"chat.postMessage",
			{
				channel: configuration.slackChannel,
				text: configuration.title,
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
					preResult.status = ExecutionStatus.KO
					return reject(preResult)
				}
				preResult.status = ExecutionStatus.OK
				return resolve(preResult)
			}
		)
	})
}

/**
 * this function send the pr to slack
 * @param repositories the repositories result
 * @param configuration the configuration for the team
 * @param slackApi the slack api
 */
export async function sendPrsToSlack(
	repositories: RepositoryToReview[],
	configuration: Configuration,
	slackApi: Slack
): Promise<ExecutionResult> {
	const { users } = configuration
	const [
		frontendPRs,
		backendPRs,
		qAPRs,
		discussedPRs,
		approvedPRs
	] = getAttachmentString(repositories, users)
	const attachments: Attachment[] = getAttachments(
		users,
		frontendPRs,
		backendPRs,
		qAPRs,
		discussedPRs,
		approvedPRs
	)
	const preResult: ExecutionResult = {
		countPullRequestsToReviewFront: frontendPRs.length,
		countPullRequestsToReviewBack: backendPRs.length,
		countPullRequestsToReviewQa: qAPRs.length,
		countPullRequestsDiscussed: discussedPRs.length,
		countPullRequestsReadyToMerge: approvedPRs.length
	}

	return await callSlack(attachments, configuration, preResult, slackApi)
}
