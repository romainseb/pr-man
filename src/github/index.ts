import { GitHub } from "github-graphql-api"
import { getGQL } from "./gql"
import { EnvironmentVariable, Repository, User, GithubResponse } from "../types"
import {
	filterByUsers,
	filterByLabels,
	getDismissAndApprovedPr
} from "./github-tools"

/**
 * This function return an api initialized
 * @param {EnvironmentVariable} githubToken github token
 */
export function getGithubApi(githubToken: EnvironmentVariable) {
	if (!githubToken) {
		return null
	}
	return new GitHub({
		token: githubToken
	})
}

/**
 * This function get pr from a repository & format it
 * @param {object} repository the repository configuration
 * @param {array} users the team
 * @param {object} githubApi the github api
 */
export function getPrsFromRepository(
	repository: Repository,
	users: User[],
	githubApi: GitHub
) {
	return new Promise((resolve, reject) => {
		githubApi
			.query(getGQL(repository.owner, repository.repository))
			.then((value: GithubResponse) => {
				if (!value) {
					reject()
				}
				const allPrs = value.repository.pullRequests.edges
				const filteredPrs = allPrs
					.filter(filterByUsers(users))
					.filter(filterByLabels(repository.ignoreLabels))
				const [prToReview, prToDiscuss, prToMerge] = getDismissAndApprovedPr(
					filteredPrs,
					repository.reviewRequired
				)

				resolve({
					repository,
					prToReview,
					prToDiscuss,
					prToMerge
				})
			})
	})
}
