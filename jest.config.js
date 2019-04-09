module.exports = {
	collectCoverageFrom: [
		"src/**/*.{ts}",
		"!**/node_modules/**",
		"!**/__snapshots__/**"
	],
	moduleFileExtensions: ["ts", "js", "json", "node"],
	roots: ["<rootDir>/src"],
	// setupFilesAfterEnv: ["<rootDir>/src/test/setupEnzyme.ts"],
	// snapshotSerializers: ["enzyme-to-json/serializer"],
	testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
	transform: {
		"^.+\\.tsx?$": "ts-jest"
	}
}
