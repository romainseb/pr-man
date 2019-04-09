declare enum PullRequestReviewState {
	PENDING = "PENDING",
	COMMENTED = "COMMENTED",
	APPROVED = "APPROVED",
	CHANGES_REQUESTED = "CHANGES_REQUESTED",
	DISMISSED = "DISMISSED"
}

declare enum ROLE {
	BACKEND = "BACKEND",
	FRONTEND = "FRONTEND",
	QA = "QA",
	OPS = "OPS"
}

declare interface Repository {
	owner: string
	repository: string
	ignoreLabels: string[]
	reviewRequired: number
	label: string
}

declare interface User {
	githubUserName: string
	slackUserName: string
	role: ROLE
}

declare interface Configuration {
	slackChannel: string
	users: User[]
	repositories: Repository[]
}
