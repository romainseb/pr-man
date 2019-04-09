import { getGithubApi, getPrsFromRepository } from "./github"
import { sendPrsToSlack, getSlackApi } from "./slack"

function checkParameters(githubToken: string, slackToken: string) {
	if (!githubToken) {
		throw new Error("There is no github token there")
	}
	if (!slackToken) {
		throw new Error("There is no slack token there")
	}
}

function run(
	configurations: Configuration[],
	githubToken: string,
	slackToken: string
) {
	checkParameters(githubToken, slackToken)
	const githubApi = getGithubApi(githubToken)
	const slackApi = getSlackApi(slackToken)

	configurations.forEach(configuration => {
		Promise.all(
			configuration.repositories.map(repository =>
				getPrsFromRepository(repository, configuration.users, githubApi)
			)
		).then(values => {
			sendPrsToSlack(values, configuration, slackApi)
		})
	})
}

export default {
	run,
	ROLE
}
