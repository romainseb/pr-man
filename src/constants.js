export const PullRequestReviewState = {
  PENDING: "PENDING",
  COMMENTED: "COMMENTED",
  APPROVED: "APPROVED",
  CHANGES_REQUESTED: "CHANGES_REQUESTED",
  DISMISSED: "DISMISSED"
};

export const ROLE = {
  BACKEND: Symbol("BACKEND"),
  FRONTEND: Symbol("FRONTEND"),
  QA: Symbol("QA"),
  OPS: Symbol("OPS")
};
