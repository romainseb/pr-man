const util = require("util")
const childProcess = require("child_process")
const fs = require("fs")

const fs_writeFile = util.promisify(fs.writeFile)
const exec = util.promisify(childProcess.exec)

const package = require("../package.json")
const packageCurrentVersion = package.version
const packageName = package.name

async function writeNpmrcFile() {
  const npmrcToken = process.env.NPMRC_TOKEN
  fs_writeFile("./.npmrc", `//registry.npmjs.org/:_authToken=${npmrcToken}`)
}

async function executeShellCommand(shellCommand, trowError = true) {
  const { stdout, stderr } = await exec(shellCommand)
  if (stderr && trowError) throw stderr
  return stdout
}

async function main() {
  const values = await executeShellCommand(`npm view ${packageName} versions`)
  if (!values.includes(packageCurrentVersion)) {
    console.log(`Write NPMRC file`)
    await writeNpmrcFile()
    console.log(`Publishing ${packageCurrentVersion} version`)
    await executeShellCommand(`yarn publish`)
  } else {
    console.log("No publication : Version already published")
  }
}

main()
