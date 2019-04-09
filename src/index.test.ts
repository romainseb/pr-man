import prMan from "./index"

const configurations: Configuration[] = [
	{
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
]

test("should test that PRMan is working", () => {
	it("should run for a given configuration", () => {
		prMan.run(
			configurations,
			process.env.GITHUB_TOKEN_API,
			process.env.SLACK_TOKEN_API
		)
	})
})
