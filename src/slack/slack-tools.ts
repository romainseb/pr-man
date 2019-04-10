import { User, Role, Repository, GithubPullRequest, Attachment } from "../types"
/**
 * this function get a slack username from a github login
 * @param githubUsername the github login
 * @param users the slack login
 */
export function getSlackUsername(
	githubUsername: string,
	users: User[]
): string {
	const user = users.find(
		(user: User) => user.githubUserName === githubUsername
	)
	if (!user) {
		return ""
	}
	return user.slackUserName
}

/**
 * This function check a pr check a user & a role
 * @param users array of users
 * @param role the current role we want to filter
 */
export function isAuthorRole(
	users: User[],
	role: Role
): (pr: GithubPullRequest) => User | undefined {
	return pr =>
		users.find(
			user => pr.node.author.login === user.githubUserName && user.role === role
		)
}

/**
 * This function build a pr label
 * @param repository the repository description
 */
export function buildAttachment(
	repository: Repository
): (pr: GithubPullRequest) => string {
	return pr => `${repository.label} - <${pr.node.url}|${pr.node.title}>`
}

/**
 * This function build a pr link for a discussed pr
 * @param repository the repository description
 * @param users array of users to fetch the name to tell in slack
 */
export function buildDiscussedAttachment(
	repository: Repository,
	users: User[]
): (pr: GithubPullRequest) => string {
	return pr =>
		`${buildAttachment(repository)(pr)} @${getSlackUsername(
			pr.node.author.login,
			users
		)}`
}

/**
 * This function build a pr block
 * @param title the block's title
 * @param color the block's color
 * @param prs the block's pr
 */
export function buildBlock(
	title: string,
	color: string,
	prs: string[]
): Attachment {
	return {
		title,
		text: prs.length > 0 ? prs.join("\n") : "Nothing 🎉",
		color
	}
}

/**
 * this function tell if the users contains a specific role
 * @param users list of users
 * @param role role searched
 */
export function usersContainsRole(users: User[], role: Role): boolean {
	return users.findIndex(user => user.role === role) !== -1
}
