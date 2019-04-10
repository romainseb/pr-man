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
