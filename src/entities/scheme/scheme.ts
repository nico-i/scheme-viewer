import axios from "axios";
import { load } from "js-yaml";
import { Base } from "../base/base.js";

export class Scheme {
	constructor(
		public readonly name: string,
		public readonly author: string,
		public readonly authorURL: string | null,
		public readonly colors: string[],
		public readonly htmlURL: string,
		public readonly downloadURL: string,
		public readonly base: Base,
	) {}

	static async fromJSON(json: unknown): Promise<Scheme> {
		if (typeof json !== "object" || json === null)
			throw new Error("Invalid JSON object");
		if ("name" in json === false || typeof json["name"] !== "string")
			throw new Error("Invalid scheme JSON name");
		if ("html_url" in json === false || typeof json["html_url"] !== "string")
			throw new Error("Invalid scheme JSON html_url");
		if (
			"download_url" in json === false ||
			typeof json["download_url"] !== "string"
		)
			throw new Error("Invalid scheme JSON download_url");
		if ("path" in json === false || typeof json["path"] !== "string")
			throw new Error("Invalid scheme JSON path");

		const { path } = json;
		const base = path.split("/")[0];

		let schemeDef: YamlScheme;

		const data = await axios.get(json.download_url);
		const text = data.data;

		const parsedYaml = load(text);
		if (isValidYamlScheme(parsedYaml) === false) {
			throw new Error("Invalid scheme YAML");
		}
		schemeDef = parsedYaml;

		const match = /\(([^)]+)\)/.exec(schemeDef.author);
		const firstTextInParenthesis = match?.[0];
		const authorSplit = schemeDef.author.split(" ");
		if (firstTextInParenthesis) {
			const authorURLIndex = authorSplit.indexOf(firstTextInParenthesis);
			const authorURL = firstTextInParenthesis.replace("(", "").replace(")", "");
			const author = authorSplit.slice(0, authorURLIndex).join(" ");

			let isValidURL = false;
			try {
				new URL(authorURL);
				isValidURL = true;
			} catch {}

			return new Scheme(
				schemeDef.name,
				author,
				isValidURL ? authorURL : null,
				Object.values(schemeDef.palette),
				json.html_url,
				json.download_url,
				new Base(parsedYaml.system),
			);
		}

		let isAuthorNameURL = false;
		try {
			new URL(schemeDef.author);
			isAuthorNameURL = true;
		} catch {}

		return new Scheme(
			schemeDef.name,
			schemeDef.author,
			isAuthorNameURL ? schemeDef.author : null,
			Object.values(schemeDef.palette),
			json.html_url,
			json.download_url,
			new Base(parsedYaml.system),
		);
	}
}

type YamlScheme = {
	system: string;
	name: string;
	author: string;
	variant: string;
	palette: Record<string, string>;
};

function isValidYamlScheme(json: unknown): json is YamlScheme {
	if (typeof json !== "object" || json === null) return false;
	if ("system" in json === false || typeof json["system"] !== "string")
		return false;
	if ("name" in json === false || typeof json["name"] !== "string") return false;
	if ("author" in json === false || typeof json["author"] !== "string")
		return false;
	if ("variant" in json === false || typeof json["variant"] !== "string")
		return false;
	if ("palette" in json === false || typeof json["palette"] !== "object")
		return false;

	return true;
}
