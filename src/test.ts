import prMan from "./index"

const configuration: Configuration = {
	slackChannel: "#sromain-test",
	users: [
		{
			githubUserName: "romainseb",
			slackUserName: "sromain",
			role: ROLE.FRONTEND
		}
	],
	repositories: [
		{
			owner: "talend",
			repository: "ui",
			ignoreLabels: ["work in progress"],
			reviewRequired: 2,
			label: "UI"
		}
	]
}

const configurations = [configuration]

prMan.run(
	configurations,
	process.env.GITHUB_TOKEN_API,
	process.env.SLACK_TOKEN_API
)
