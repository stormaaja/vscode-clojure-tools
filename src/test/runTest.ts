import * as path from 'path'

import { runTests } from 'vscode-test'

async function main() {
	try {
		const extensionPath = path.resolve(__dirname, "../../")
		const testRunnerPath = path.resolve(__dirname, "./suite")
		await runTests({ extensionPath, testRunnerPath })
	} catch (err) {
		console.error("Failed to run tests")
		process.exit(1)
	}
}

main();
