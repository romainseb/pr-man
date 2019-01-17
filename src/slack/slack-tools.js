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
 */
export function buildAttachment(repository) {
  return pr => `${repository.label} - <${pr.node.url}|${pr.node.title}>`
}

/**
 * This function build a pr link for a discussed pr
 * @param {object} repository the repository description
 * @param {array} users array of users to fetch the name to tell in slack
 */
export function buildDiscussedAttachment(repository, users) {
  return pr =>
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
export function buildBlock(title, color, prs) {
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
export function usersContainsRole(users, role) {
  return users.findIndex(user => user.role === role) !== -1
}
