// @ts-check

/**
 * This function return a function to find the index of a user
 * @param {array} users array of users
 */
function getFindIndexOfUser(users) {
  return login => users.findIndex(user => user.githubUserName === login) !== -1
}

/**
 * this function return a filter to know if the passed label is ignored
 * @param {array} ignoredLabels labels ignored for the prs
 */
function isLabelIgnored(ignoredLabels) {
  return label => ignoredLabels.includes(label.node.name)
}

/**
 * this function filter the pr that have as author someone in the list of users
 * @param {array} users list of users
 */
export function filterByUsers(users) {
  return pr => getFindIndexOfUser(users)(pr.node.author.login)
}

/**
 * This function filter some pr to not have labels
 * @param {array} ignoredLabels list of labels
 */
export function filterByLabels(ignoredLabels) {
  return pr =>
    pr.node.labels.edges.findIndex(isLabelIgnored(ignoredLabels)) === -1
}

/**
 * This function remove a login from the array if included
 * @param {array} array a javascript classic array
 * @param {string} login a user's login
 */
function removeFromArray(array, login) {
  if (array.includes(login)) {
    array.splice(array.indexOf(login), 1)
  }
}

/**
 * This function add a user in the array if not included
 * @param {array} array a javascript classic array
 * @param {string} login a user's login
 */
function addInArray(array, login) {
  if (!array.includes(login)) {
    array.push(login)
  }
}

/**
 * This function return an object that list the approved / discussed / ready to review pr
 * @param {array} prs array of pull request
 * @param {number} nbApproval number of approval required to tell it's ready to merge
 */
export function getDismissAndApprovedPr(prs, nbApproval) {
  const prToReview = []
  const prToDiscuss = []
  const prToMerge = []

  prs.forEach(pr => {
    const rejects = []
    const approved = []

    pr.node.reviews.edges.forEach(review => {
      const reviewState = review.node.state
      const author = review.node.author.login
      if (reviewState === "APPROVED") {
        addInArray(approved, author)
        removeFromArray(rejects, author)
      }
      if (reviewState === "CHANGES_REQUESTED") {
        addInArray(rejects, author)
        removeFromArray(approved, author)
      }
      if (reviewState === "DISMISSED") {
        removeFromArray(rejects, author)
        removeFromArray(approved, author)
      }
    })

    if (rejects.length) {
      prToDiscuss.push(pr)
    } else if (approved.length >= nbApproval) {
      prToMerge.push(pr)
    } else {
      prToReview.push(pr)
    }
  })
  return [prToReview, prToDiscuss, prToMerge]
}
