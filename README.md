# PR MAN

This module allow you by setting a little configuration to send on slack some pull request status for your team

## How it works

This module is run by calling the exported runPrMan function

```typescript
import { runPrMan } from "@romainseb/pr-man"
import configurations from "./configurations"

const githubToken = process.env.GITHUB_TOKEN_API
const slackToken = process.env.SLACK_TOKEN_API

runPrMan(configurations, githubToken, slackToken)
```

## How to setup your configuration

The first parameter of runPrMan is a configuration or a list of configurations ( in order to work on multiple teams in one execution )

A configuration is composed by:

- slackChannel : The channel when you want the message to be send ( your slack token should have access to this channel )

- users : a list of users with this format

```typescript
import { Role } from "@romainseb/pr-man"

const users = [
	{
		githubUserName: "romainseb",
		slackUserName: "sromain",
		role: Role.FRONTEND
	}
]
```

- repositories : a list of github repositories

```typescript
import { Role } from "@romainseb/pr-man"

const repositories = [
	{
		owner: "talend",
		repository: "ui",
		ignoreLabels: ["work in progress"],
		reviewRequired: 2,
		label: "UI"
	}
]
```
