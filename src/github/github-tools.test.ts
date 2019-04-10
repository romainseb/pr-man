import { User, Role, GithubLabel, GithubPullRequest } from "../types"
import {
	getFindIndexOfUser,
	isLabelIgnored,
	filterByUsers,
	filterByLabels,
	removeFromArray,
	addInArray
} from "./github-tools"

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

describe("getFindIndexOfUser", () => {
	it("should return false if the user is not there", () => {
		// given
		const users = [user1, user2]
		// when
		const result = getFindIndexOfUser(users)("ghUser3")
		// then
		expect(result).toBeFalsy()
	})
	it("should return true if the user is there", () => {
		// given
		const users = [user1, user2]
		// when
		const result = getFindIndexOfUser(users)("ghUser2")
		// then
		expect(result).toBeTruthy()
	})
})

describe("isLabelIgnored", () => {
	it("should return false if the label is not there", () => {
		// given
		// when
		const result = isLabelIgnored(["labelTest", "labelTest2"])(label1)
		// then
		expect(result).toBeFalsy()
	})

	it("should return true if the label is there", () => {
		// given
		// when
		const result = isLabelIgnored(["labelTest", "labelTest2", "label1"])(label1)
		// then
		expect(result).toBeTruthy()
	})
})

describe("filterByUsers", () => {
	it("should return true if the user is in the list", () => {
		// given
		// when
		const result = filterByUsers([user1, user2])(pr)
		// then
		expect(result).toBeTruthy()
	})
	it("should return false if the user is not in the list", () => {
		// given
		// when
		const result = filterByUsers([user2])(pr)
		// then
		expect(result).toBeFalsy()
	})
})

describe("filterByLabels", () => {
	it("should return true if the label is not in ignored list", () => {
		// given
		// when
		const result = filterByLabels(["not"])(pr)
		// then
		expect(result).toBeTruthy()
	})
	it("should return true if the user is in the list", () => {
		// given
		// when
		const result = filterByLabels(["wip"])(pr)
		// then
		expect(result).toBeFalsy()
	})
})

describe("removeFromArray", () => {
	it("should alter the array to remove the given string", () => {
		// given
		const array = ["test1", "test2"]
		// when
		removeFromArray(array, "test1")
		// then
		expect(array).toEqual(["test2"])
	})
	it("should not alter the array to remove the given string if the string is not present", () => {
		// given
		const array = ["test1", "test2"]
		// when
		removeFromArray(array, "test")
		// then
		expect(array).toEqual(["test1", "test2"])
	})
})

describe("addInArray", () => {
	it("should alter the array to add the given string", () => {
		// given
		const array = ["test1", "test2"]
		// when
		addInArray(array, "test")
		// then
		expect(array).toEqual(["test1", "test2", "test"])
	})
	it("should not alter the array to add the given string if the string is it's present", () => {
		// given
		const array = ["test1", "test2"]
		// when
		addInArray(array, "test1")
		// then
		expect(array).toEqual(["test1", "test2"])
	})
})
