export function getGQL(owner, name) {
  return `
    {
        repository(owner: "${owner}", name: "${name}") {
          pullRequests(last: 100, states: [OPEN]) {
            edges {
              cursor
              node {
                author {
                  login
                }
                labels(last: 100) {
                  edges {
                    node {
                      name
                    }
                  }
                }
                title
                createdAt
                url
                reviews(last: 100) {
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
    `;
}
