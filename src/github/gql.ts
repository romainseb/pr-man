// Currently, the github api set the limit to 100
const MAX_ROWS = 100

/**
 * This function return a graphql request for a given repository
 * @param owner The name of the repository's owner
 * @param name The name of the repository
 */
export function getGQL(owner: string, name: string) {
	return `
    {
        repository(owner: "${owner}", name: "${name}") {
          pullRequests(first: ${MAX_ROWS}, states: [OPEN]) {
            edges {
              cursor
              node {
                author {
                  login
                }
                labels(first: ${MAX_ROWS}) {
                  edges {
                    node {
                      name
                    }
                  }
                }
                title
                createdAt
                url
                reviews(first: ${MAX_ROWS}) {
                  edges {
                    node {
                      author {
                        login
                      }
                      state
                    }
                  }
                }
              }
            }
          }
        }
      }
    `
}

export type GithubResponse = {
	repository: GithubRepository
}

export type GithubRepository = {
	pullRequests: GithubPullRequests
}

export type GithubPullRequests = {
	edges: GithubPullRequest[]
}

export type GithubPullRequest = {
	cursor: string
	node: GithubPullRequestNode
}

export type GithubPullRequestNode = {
	author: GithubAuthor
	title: string
	createdAt: string
	url: string
	labels: GithubLabels
	reviews: GithubReviews
}

export type GithubReviews = {
	edges: GithubReview[]
}

export type GithubReview = {
	node: GithubReviewNode
}

export type GithubReviewNode = {
	state: string
	author: GithubAuthor
}

export type GithubLabels = {
	edges: GithubLabel[]
}

export type GithubLabel = {
	node: GithubLabelNode
}

export type GithubLabelNode = {
	name: string
}

export type GithubAuthor = {
	login: string
}
