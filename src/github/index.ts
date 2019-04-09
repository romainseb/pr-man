import GithubGraphQLApi from "node-github-graphql"
import { getGQL } from "./gql"
import {
  filterByUsers,
  filterByLabels,
  getDismissAndApprovedPr
} from "./github-tools"

/**
 * This function return an api initialized
 * @param {string} githubToken github token
 */
export function getGithubApi(githubToken) {
  return new GithubGraphQLApi({
    token: githubToken
  })
}

/**
 * This function get pr from a repository & format it
 * @param {object} repository the repository configuration
 * @param {array} users the team
 * @param {object} githubApi the github api
 */
export function getPrsFromRepository(repository, users, githubApi) {
  return new Promise((resolve, reject) => {
    githubApi.query(
      getGQL(repository.owner, repository.repository),
      null,
      (res, err) => {
        if (err) {
          reject(err)
        }
        const allPrs = res.data.repository.pullRequests.edges
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
      }
    )
  })
}
