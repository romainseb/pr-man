import { Configuration, Role } from "../src/types"
import { runPrMan } from "../src/index"

const configurations: Configuration[] = [
	{
		slackChannel: "#sromain-test",
		users: [
			{
				githubUserName: "romainseb",
				slackUserName: "sromain",
				role: Role.FRONTEND
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
]

runPrMan.run(
	configurations,
	process.env.GITHUB_TOKEN_API,
	process.env.SLACK_TOKEN_API
)
