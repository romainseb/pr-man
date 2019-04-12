import {
	GithubAuthor,
	GithubLabel,
	GithubLabelNode,
	GithubLabels,
	GithubPullRequest,
	GithubPullRequestNode,
	GithubPullRequests,
	GithubRepository,
	GithubResponse,
	GithubReview,
	GithubReviewNode,
	GithubReviews
} from "./github/gql"

export type Token = string | undefined

export enum PullRequestReviewState {
	PENDING = "PENDING",
	COMMENTED = "COMMENTED",
	APPROVED = "APPROVED",
	CHANGES_REQUESTED = "CHANGES_REQUESTED",
	DISMISSED = "DISMISSED"
}

export enum Role {
	BACKEND = "BACKEND",
	FRONTEND = "FRONTEND",
	QA = "QA",
	OPS = "OPS"
}

export interface RepositoryToReview {
	repository: Repository
	prToReview: GithubPullRequest[]
	prToDiscuss: GithubPullRequest[]
	prToMerge: GithubPullRequest[]
}

export interface Repository {
	owner: string
	repository: string
	ignoreLabels: string[]
	reviewRequired: number
	label: string
}

export interface User {
	githubUserName: string
	slackUserName: string
	role: Role
}

export interface Configuration {
	slackChannel: string
	title?: string
	users: User[]
	repositories: Repository[]
}

export interface Attachment {
	title: string
	color: string
	text: string
}

export enum ExecutionStatus {
	OK = "OK",
	KO = "KO"
}

export type ExecutionResult = {
	status?: ExecutionStatus
	countPullRequestsToReviewFront: number
	countPullRequestsToReviewBack: number
	countPullRequestsToReviewQa: number
	countPullRequestsDiscussed: number
	countPullRequestsReadyToMerge: number
}

export {
	GithubAuthor,
	GithubLabel,
	GithubLabelNode,
	GithubLabels,
	GithubPullRequest,
	GithubPullRequestNode,
	GithubPullRequests,
	GithubRepository,
	GithubResponse,
	GithubReview,
	GithubReviewNode,
	GithubReviews
}
