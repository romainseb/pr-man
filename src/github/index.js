import GithubGraphQLApi from "node-github-graphql";
import { GITHUB_TOKEN_API } from "../env";
import { getGQL } from "./gql";

const github = new GithubGraphQLApi({
  token: GITHUB_TOKEN_API
});

function findUserByIndex(users) {
  return login => users.findIndex(user => user.githubUserName === login) !== -1;
}

function filterByUsers(users) {
  return pr => findUserByIndex(users)(pr.node.author.login);
}

function isLabelIgnored(ignoredLabels) {
  return label => ignoredLabels.includes(label.node.name);
}

function filterByLabels(ignoredLabels) {
  return pr =>
    pr.node.labels.edges.findIndex(isLabelIgnored(ignoredLabels)) === -1;
}

function removeFromArray(array, value) {
  if (array.includes(value)) {
    array.splice(array.indexOf(value), 1);
  }
}

function addInArray(array, value) {
  if (!array.includes(value)) {
    array.push(value);
  }
}

function getDismissAndApprovedPr(prs, nbApproval) {
  const prToReview = [];
  const prToDiscuss = [];
  const prToMerge = [];

  prs.forEach(pr => {
    const rejects = [];
    const approved = [];

    pr.node.reviews.edges.forEach(review => {
      const reviewState = review.node.state;
      const author = review.node.author.login;
      if (reviewState === "APPROVED") {
        addInArray(approved, author);
        removeFromArray(rejects, author);
      }
      if (reviewState === "CHANGES_REQUESTED") {
        addInArray(rejects, author);
        removeFromArray(approved, author);
      }
      if (reviewState === "DISMISSED") {
        removeFromArray(rejects, author);
        removeFromArray(approved, author);
      }
    });

    if (rejects.length) {
      prToDiscuss.push(pr);
    } else if (approved.length >= nbApproval) {
      prToMerge.push(pr);
    } else {
      prToReview.push(pr);
    }
  });
  return [prToReview, prToDiscuss, prToMerge];
}

export function getPrsFromRepository(repository, users) {
  return new Promise((resolve, reject) => {
    github.query(
      getGQL(repository.owner, repository.repository),
      null,
      (res, err) => {
        if (err) {
          reject(err);
        }
        const allPrs = res.data.repository.pullRequests.edges;
        const filteredPrs = allPrs
          .filter(filterByUsers(users))
          .filter(filterByLabels(repository.ignoreLabels));
        const [prToReview, prToDiscuss, prToMerge] = getDismissAndApprovedPr(
          filteredPrs,
          repository.reviewRequired
        );

        resolve({
          repository,
          prToReview,
          prToDiscuss,
          prToMerge
        });
      }
    );
  });
}
