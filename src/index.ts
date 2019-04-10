import { EnvironmentVariable, Configuration } from "./types"
import { getGithubApi, getPrsFromRepository } from "./github"
import { sendPrsToSlack, getSlackApi } from "./slack"
export { Role } from "./types"

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

function getConfigurations(
	config: Configuration[] | Configuration
): Configuration[] {
	if (Array.isArray(config)) {
		return config
	}
	return [config]
}

export function runPrMan(
	config: Configuration[] | Configuration,
	githubToken: EnvironmentVariable,
	slackToken: EnvironmentVariable
) {
	checkParameters(githubToken, slackToken)
	const githubApi = getGithubApi(githubToken)
	const slackApi = getSlackApi(slackToken)

	if (!githubApi) {
		return
	}

	getConfigurations(config).forEach(configuration => {
		Promise.all(
			configuration.repositories.map(repository =>
				getPrsFromRepository(repository, configuration.users, githubApi)
			)
		).then((values: any) => {
			sendPrsToSlack(values, configuration, slackApi)
		})
	})
}
