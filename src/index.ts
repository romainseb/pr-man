import { EnvironmentVariable, Configuration } from "./types"
import { getGithubApi, getPrsFromRepository } from "./github"
import { sendPrsToSlack, getSlackApi } from "./slack"

function checkParameters(
	githubToken: EnvironmentVariable,
	slackToken: EnvironmentVariable
) {
	if (!githubToken) {
		throw new Error("There is no github token there")
	}
	if (!slackToken) {
		throw new Error("There is no slack token there")
	}
}

function run(
	configurations: Configuration[],
	githubToken: EnvironmentVariable,
	slackToken: EnvironmentVariable
) {
	checkParameters(githubToken, slackToken)
	const githubApi = getGithubApi(githubToken)
	const slackApi = getSlackApi(slackToken)

	if (!githubApi) {
		return
	}

	configurations.forEach(configuration => {
		Promise.all(
			configuration.repositories.map(repository =>
				getPrsFromRepository(repository, configuration.users, githubApi)
			)
		).then((values: any) => {
			sendPrsToSlack(values, configuration, slackApi)
		})
	})
}

export default {
	run
}
