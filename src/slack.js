import Slack from "slack-node";
import { SLACK_TOKEN_API } from "./env";
import { ROLE } from "./constants";
const slack = new Slack(SLACK_TOKEN_API);

function isAuthorRole(users, role) {
  return pr =>
    users.find(
      user => pr.node.author.login === user.githubUserName && user.role === role
    );
}

function getSlackUsername(githubUsername, users) {
  return users.find(user => user.githubUserName === githubUsername)
    .slackUserName;
}

function buildAttachement(repository, noUser = false) {
  return pr =>
    `${repository.label} - <${pr.node.url}|${pr.node.title}> ${
      noUser ? "" : " ( " + pr.node.author.login + " ) "
    }`;
}

function buildDiscussedAttachement(repository, users) {
  return pr =>
    `${buildAttachement(repository, true)(pr)} @${getSlackUsername(
      pr.node.author.login,
      users
    )}`;
}

function buildBlock(label, color, prs) {
  return {
    title: label,
    text: prs.length > 0 ? prs.join("\n") : "Nothing 🎉",
    color
  };
}

export function sendPrsToSlack(repos, configuration) {
  const { users } = configuration;
  let frontendPRs = [];
  let backendPRs = [];
  let QAPRs = [];
  let discussedPRs = [];
  let approvedPRs = [];

  repos.forEach(repository => {
    frontendPRs = frontendPRs.concat(
      repository.prToReview
        .filter(isAuthorRole(users, ROLE.FRONTEND))
        .map(buildAttachement(repository.repository))
    );
    backendPRs = backendPRs.concat(
      repository.prToReview
        .filter(isAuthorRole(users, ROLE.BACKEND))
        .map(buildAttachement(repository.repository))
    );
    backendPRs = backendPRs.concat(
      repository.prToReview
        .filter(isAuthorRole(users, ROLE.OPS))
        .map(buildAttachement(repository.repository))
    );
    QAPRs = QAPRs.concat(
      repository.prToReview
        .filter(isAuthorRole(users, ROLE.QA))
        .map(buildAttachement(repository.repository))
    );
    discussedPRs = discussedPRs.concat(
      repository.prToDiscuss.map(
        buildDiscussedAttachement(repository.repository, users)
      )
    );
    approvedPRs = approvedPRs.concat(
      repository.prToMerge.map(buildAttachement(repository.repository))
    );
  });

  const attachements = [
    buildBlock("Frontend review required", "#3949AB", frontendPRs),
    buildBlock("Bakend review required", "#546E7A", backendPRs),
    buildBlock("QA review required", "#2c3e50", QAPRs),
    buildBlock("Request changes", "#e53935", discussedPRs),
    buildBlock("Ready to merge", "#43A047", approvedPRs)
  ];

  slack.api(
    "chat.postMessage",
    {
      channel: configuration.slackChannel,
      text: "",
      username: `PR MAN`,
      link_names: "true",
      icon_emoji: ":butler:",
      // as_user: true,
      attachments: JSON.stringify(attachements)
    },
    (err, response) => {
      console.log(err, response);
    }
  );
}
