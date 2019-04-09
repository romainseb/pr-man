import { User, Role, Repository, GithubPullRequest } from "../types"
/**
 * this function get a slack username from a github login
 * @param {string} githubUsername the github login
 * @param {array} users the slack login
 */
function getSlackUsername(githubUsername: string, users: User[]): string {
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
 * @param {array} users array of users
 * @param {symbol} role the current role we want to filter
 */
export function isAuthorRole(users: User[], role: Role) {
	return (pr: GithubPullRequest) =>
		users.find(
			user => pr.node.author.login === user.githubUserName && user.role === role
		)
}

/**
 * This function build a pr label
 * @param {object} repository the repository description
 */
export function buildAttachment(repository: Repository) {
	return (pr: GithubPullRequest) =>
		`${repository.label} - <${pr.node.url}|${pr.node.title}>`
}

/**
 * This function build a pr link for a discussed pr
 * @param {object} repository the repository description
 * @param {array} users array of users to fetch the name to tell in slack
 */
export function buildDiscussedAttachment(
	repository: Repository,
	users: User[]
) {
	return (pr: GithubPullRequest) =>
		`${buildAttachment(repository)(pr)} @${getSlackUsername(
			pr.node.author.login,
			users
		)}`
}

/**
 * This function build a pr block
 * @param {string} title the block's title
 * @param {string} color the block's color
 * @param {array} prs the block's pr
 */
export function buildBlock(title: string, color: string, prs: string[]) {
	return {
		title,
		text: prs.length > 0 ? prs.join("\n") : "Nothing 🎉",
		color
	}
}

/**
 * this function tell if the users contains a specific role
 * @param {array} users list of users
 * @param {Symbol} role role searched
 */
export function usersContainsRole(users: User[], role: Role) {
	return users.findIndex(user => user.role === role) !== -1
}
