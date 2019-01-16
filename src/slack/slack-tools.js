// @ts-check

/**
 * this function get a slack username from a github login
 * @param {string} githubUsername the github login
 * @param {array} users the slack login
 */
function getSlackUsername(githubUsername, users) {
  return users.find(user => user.githubUserName === githubUsername)
    .slackUserName
}

/**
 * This function check a pr check a user & a role
 * @param {array} users array of users
 * @param {symbol} role the current role we want to filter
 */
export function isAuthorRole(users, role) {
  return pr =>
    users.find(
      user => pr.node.author.login === user.githubUserName && user.role === role
    )
}

/**
 * This function build a pr label
 * @param {object} repository the repository description
 * @param {boolean} noUser tell if we don"t want to show the author name
 */
export function buildAttachment(repository, noUser = false) {
  return pr =>
    `${repository.label} - <${pr.node.url}|${pr.node.title}> ${
      noUser ? "" : " ( " + pr.node.author.login + " ) "
    }`
}

/**
 * This function build a pr link for a discussed pr
 * @param {object} repository the repository description
 * @param {array} users array of users to fetch the name to tell in slack
 */
export function buildDiscussedAttachment(repository, users) {
  return pr =>
    `${buildAttachment(repository, true)(pr)} @${getSlackUsername(
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
export function buildBlock(title, color, prs) {
  return {
    title,
    text: prs.length > 0 ? prs.join("\n") : "Nothing 🎉",
    color
  }
}
