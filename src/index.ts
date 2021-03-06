import * as Slack from "slack-node"
import {
	Token,
	Configuration,
	RepositoryToReview,
	ExecutionResult
} from "./types"
import { getGithubApi, getPrsFromRepository } from "./github"
import { sendPrsToSlack, getSlackApi } from "./slack"
import GitHub from "github-graphql-api"
export * from "./types"

/**
 * This method check the token to ensure we have all the credentials to do the next steps
 * This check does not look if the token are valid, it only check their existence
 * @param githubToken The token github, it will be checked if it's not empty
 * @param slackToken The slack github, it will be checked if it's not empty
 */
function getTokens(githubToken: Token, slackToken: Token): string[] {
	if (!githubToken) {
		throw new Error("There is no github token there")
	}
	if (!slackToken) {
		throw new Error("There is no slack token there")
	}
	return [githubToken, slackToken]
}

/**
 * This function return an array of Configuration in order to make the process easier
 * @param config The given configuration to run PR Man
 */
function getConfigurations(
	config: Configuration[] | Configuration
): Configuration[] {
	if (Array.isArray(config)) {
		return config
	}
	return [config]
}

/**
 * This function fetch the pull request from github & then call slack to send the message
 * @param config Configuration to pass to have data on github repositories & users
 * @param githubApi the github graphql api
 * @param slackApi the slack api
 */
async function handleConfiguration(
	configuration: Configuration,
	githubApi: GitHub,
	slackApi: Slack
) {
	const repositoriesToReview: RepositoryToReview[] = []

	for (const repository of configuration.repositories) {
		const repositoryToReview = await getPrsFromRepository(
			repository,
			configuration.users,
			githubApi
		)
		repositoriesToReview.push(repositoryToReview)
	}
	return await sendPrsToSlack(repositoriesToReview, configuration, slackApi)
}

/**
 * This function run the script to send the PR to slack
 * @param config Configuration to pass to have data on github repositories & users
 * @param githubTokenOrEmpty Github token to make the graphql calls
 * @param slackTokenOrEmpty Slack token to send the messages to the slack channel
 */
export async function runPrMan(
	config: Configuration[] | Configuration,
	githubTokenOrEmpty: Token,
	slackTokenOrEmpty: Token
): Promise<ExecutionResult[]> {
	const [githubToken, slackToken] = getTokens(
		githubTokenOrEmpty,
		slackTokenOrEmpty
	)
	const configurations = getConfigurations(config)
	const githubApi = getGithubApi(githubToken)
	const slackApi = getSlackApi(slackToken)
	const result: ExecutionResult[] = []

	for (const configuration of configurations) {
		result.push(await handleConfiguration(configuration, githubApi, slackApi))
	}
	return result
}
