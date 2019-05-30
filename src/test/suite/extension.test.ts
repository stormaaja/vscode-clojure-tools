import * as assert from 'assert'
import { before } from 'mocha'
import * as vscode from 'vscode'
import * as ext from "../../extension"

suite("Extension Test Suite", () => {
	before(() => {
		vscode.window.showInformationMessage("Start all tests.")
	})

	test("Test file validation", () => {
		assert.equal(ext.isValidFile("/src/valid/file.clj"), true)
		assert.equal(ext.isValidFile("/test/valid/file.clj"), true)
		assert.equal(ext.isValidFile("/non/valid/file.clj"), false)
	})

	test("Test parse src header", () => {
		const header = ext.parseHeader("/src/valid/namespace_tool/core_file.clj")
		assert.equal(header.ns, "valid.namespace-tool.core-file")
		assert.equal(header.requires.length, 0)
	})

	test("Test parse test header", () => {
		const header = ext.parseHeader("/test/valid/namespace_tool/core_file_test.clj")
		assert.equal(header.ns, "valid.namespace-tool.core-file-test")
		assert.equal(header.requires.length, 2)
		assert.equal(header.requires[0].ns, "valid.namespace-tool.core-file")
		assert.equal(header.requires[0].as, "sut")
		assert.equal(header.requires[1].ns, "clojure.test")
		assert.equal(header.requires[1].as, "t")

	})
})