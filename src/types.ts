export type EnvironmentVariable = string | undefined

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
	users: User[]
	repositories: Repository[]
}

export interface Attachment {
	title: string
	color: string
	text: string
}

// GITHUB STUFF

export type GithubResponse = {
	repository: GithubRepository
}

export type GithubRepository = {
	pullRequests: GithubPullRequests
}

export type GithubPullRequests = {
	edges: GithubPullRequest[]
}

export type GithubPullRequest = {
	cursor: string
	node: GithubPullRequestNode
}

export type GithubPullRequestNode = {
	author: GithubAuthor
	title: string
	createdAt: string
	url: string
	labels: GithubLabels
	reviews: GithubReviews
}

export type GithubReviews = {
	edges: GithubReview[]
}

export type GithubReview = {
	node: GithubReviewNode
}

export type GithubReviewNode = {
	state: string
	author: GithubAuthor
}

export type GithubLabels = {
	edges: GithubLabel[]
}

export type GithubLabel = {
	node: GithubLabelNode
}

export type GithubLabelNode = {
	name: string
}

export type GithubAuthor = {
	login: string
}
