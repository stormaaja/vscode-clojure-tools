'use strict'

import * as vscode from 'vscode'

interface FileRequire {
	ns: string,
	as: string
}

interface FileHeader {
	ns: string,
	requires: FileRequire[]
}

const cljFileRegex = /.*\.clj(?:s|c)?/g

export function isValidFile(filename: string): boolean {
	return filename.match(cljFileRegex) !== null &&
		(filename.indexOf("/src/") > -1 || filename.indexOf("/test/") > -1)
}

const detectNsType = (filename: string): string =>
	filename.indexOf("/src/") > -1 ? "/src/" : "/test/"

const parseNsString = (filename: string, nsType: string): string =>
	filename.substring(
		filename.indexOf(nsType) + nsType.length,
		filename.lastIndexOf(".")
	).replace(/\//g, ".").replace(/_/g, "-")

export function parseHeader(filename: string): FileHeader {
	const nsType = detectNsType(filename)
	const nsString = parseNsString(filename, nsType)
	const header = {
		ns: nsString,
		requires: nsType === "/src/" ? [] : [
			{ns: nsString.replace("-test", ""), as: "sut"},
			{ns: "clojure.test", as: "t"}
		]
	}
	return header
}

const requireToString = (r: FileRequire): string =>
  `[${r.ns} :as ${r.as}]`

const requiresToString = (requires: FileRequire[]): string => {
	if (requires.length > 0) {
		const requiresStr = requires.map(requireToString).join("\n")
		return `\n(:require ${requiresStr})`
	} else {
		return ""
	}
}

const headerToString = (header: FileHeader): string => {
	return `(ns ${header.ns}${requiresToString(header.requires)})\n`
}

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		"cljt.addNamespace", function () {
		let editor = vscode.window.activeTextEditor

		if (editor) {
			const filename = editor.document.fileName
			if (isValidFile(filename)) {
				const header = parseHeader(filename)
				editor.edit(editBuilder => {
					editBuilder.insert(new vscode.Position(0, 0), headerToString(header))
				})
			} else {
				vscode.window.showInformationMessage(
					"Only Clojure(Script) files is supported.")
			}
		}
	})

	context.subscriptions.push(disposable)
}