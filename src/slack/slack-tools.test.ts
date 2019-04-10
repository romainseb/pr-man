import {
	User,
	Role,
	GithubLabel,
	GithubPullRequest,
	Repository
} from "../types"
import { getSlackUsername, isAuthorRole, buildAttachment } from "./slack-tools"

const pr: GithubPullRequest = {
	cursor: "cursorValue",
	node: {
		author: { login: "ghUser1" },
		createdAt: "today",
		labels: {
			edges: [
				{
					node: {
						name: "wip"
					}
				}
			]
		},
		reviews: { edges: [] },
		title: "test",
		url: "http://"
	}
}

const repository: Repository = {
	owner: "talend",
	repository: "ui",
	ignoreLabels: ["work in progress"],
	reviewRequired: 2,
	label: "UI"
}

const user1: User = {
	githubUserName: "ghUser1",
	role: Role.FRONTEND,
	slackUserName: "slackUser1"
}
const user2: User = {
	githubUserName: "ghUser2",
	role: Role.FRONTEND,
	slackUserName: "slackUser2"
}

const label1: GithubLabel = {
	node: { name: "label1" }
}

describe("getSlackUsername", () => {
	it("should return an empty string if the user is not in the list", () => {
		// given
		const githubUserName = "Test"
		// when
		const result = getSlackUsername(githubUserName, [user1, user2])
		// then
		expect(result).toBe("")
	})
	it("should return the slack username if the user is in the list", () => {
		// given
		const githubUserName = "ghUser1"
		// when
		const result = getSlackUsername(githubUserName, [user1, user2])
		// then
		expect(result).toBe("slackUser1")
	})
})

describe("isAuthorRole", () => {
	it("should return the user if it match", () => {
		// given
		const role = Role.FRONTEND
		// when
		const result = isAuthorRole([user1, user2], role)(pr)
		// then
		expect(result).toBe(user1)
	})
	it("should return undefined if the role is not matched", () => {
		// given
		const role = Role.BACKEND
		// when
		const result = isAuthorRole([user1, user2], role)(pr)
		// then
		expect(result).toBeUndefined()
	})
	it("should return undefined if the user is not matched", () => {
		// given
		const role = Role.FRONTEND
		const user3: User = {
			githubUserName: "ghUser3",
			role: Role.FRONTEND,
			slackUserName: "slackUser3"
		}
		// when
		const result = isAuthorRole([user3, user2], role)(pr)
		// then
		expect(result).toBeUndefined()
	})
})

describe("buildAttachment", () => {
	it("should build a attachment string", () => {
		// given
		// when
		const result = buildAttachment(repository)(pr)
		// then
		expect(result).toBe("UI - <http://|test>")
	})
})
