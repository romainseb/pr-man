// @ts-check

import Slack from "slack-node"
import { ROLE } from "../constants"
import {
  buildAttachment,
  buildBlock,
  buildDiscussedAttachment,
  isAuthorRole
} from "./slack-tools"

/**
 * this function return a slack api to use it
 * @param {string} slackToken the slack token obviously
 */
export function getSlackApi(slackToken) {
  return new Slack(slackToken)
}

/**
 * this function send the pr to slack
 * @param {array} repositories the repositories result
 * @param {object} configuration the configuration for the team
 * @param {object} slackApi the salck api
 */
export function sendPrsToSlack(repositories, configuration, slackApi) {
  return new Promise((resolve, reject) => {
    const { users } = configuration
    let frontendPRs = []
    let backendPRs = []
    let qAPRs = []
    let discussedPRs = []
    let approvedPRs = []

    repositories.forEach(repository => {
      frontendPRs = frontendPRs.concat(
        repository.prToReview
          .filter(isAuthorRole(users, ROLE.FRONTEND))
          .map(buildAttachment(repository.repository))
      )
      backendPRs = backendPRs.concat(
        repository.prToReview
          .filter(isAuthorRole(users, ROLE.BACKEND))
          .map(buildAttachment(repository.repository))
      )
      backendPRs = backendPRs.concat(
        repository.prToReview
          .filter(isAuthorRole(users, ROLE.OPS))
          .map(buildAttachment(repository.repository))
      )
      qAPRs = qAPRs.concat(
        repository.prToReview
          .filter(isAuthorRole(users, ROLE.QA))
          .map(buildAttachment(repository.repository))
      )
      discussedPRs = discussedPRs.concat(
        repository.prToDiscuss.map(
          buildDiscussedAttachment(repository.repository, users)
        )
      )
      approvedPRs = approvedPRs.concat(
        repository.prToMerge.map(buildAttachment(repository.repository))
      )
    })

    const attachments = [
      buildBlock("Frontend review required", "#3949AB", frontendPRs),
      buildBlock("Backend review required", "#546E7A", backendPRs),
      buildBlock("QA review required", "#2c3e50", qAPRs),
      buildBlock("Request changes", "#e53935", discussedPRs),
      buildBlock("Ready to merge", "#43A047", approvedPRs)
    ]

    slackApi.api(
      "chat.postMessage",
      {
        channel: configuration.slackChannel,
        text: "",
        username: `PR MAN`,
        link_names: "true",
        icon_emoji: ":butler:",
        // as_user: true,
        attachments: JSON.stringify(attachments)
      },
      (err, response) => {
        if (err) {
          return reject(err)
        }
        return resolve(response)
      }
    )
  })
}
