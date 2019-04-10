import { GitHub } from "github-graphql-api"
import { getGQL } from "./gql"
import { Repository, User, GithubResponse } from "../types"
import {
	filterByUsers,
	filterByLabels,
	getDismissAndApprovedPr
} from "./github-tools"

/**
 * This function return an api initialized
 * @param githubToken github token
 */
export function getGithubApi(githubToken: string) {
	return new GitHub({
		token: githubToken
	})
}

/**
 * This function get pr from a repository & format it
 * @param repository the repository configuration
 * @param users the team
 * @param githubApi the github api
 */
export async function getPrsFromRepository(
	repository: Repository,
	users: User[],
	githubApi: GitHub
) {
	const value = (await githubApi.query(
		getGQL(repository.owner, repository.repository)
	)) as GithubResponse

	const allPrs = value.repository.pullRequests.edges

	const filteredPrs = allPrs
		.filter(filterByUsers(users))
		.filter(filterByLabels(repository.ignoreLabels))

	const [prToReview, prToDiscuss, prToMerge] = getDismissAndApprovedPr(
		filteredPrs,
		repository.reviewRequired
	)

	return {
		repository,
		prToReview,
		prToDiscuss,
		prToMerge
	}
}
