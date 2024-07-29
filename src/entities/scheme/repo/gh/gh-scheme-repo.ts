import axios from "axios";
import fs from "fs";
import { Base, Bases } from "../../../base/base.js";
import { Scheme } from "../../scheme.js";
import { SchemeRepo } from "../scheme-repo.js";
import base16FetchCache from "./cache/base16.json";
import base24FetchCache from "./cache/base24.json";

export class GithubSchemeRepo implements SchemeRepo {
	constructor(
		public readonly useCache = false,
		public readonly updateCache = false,
	) {}

	async getSchemesByBase(base: Base): Promise<Scheme[]> {
		let baseCache: unknown;
		switch (base.name) {
			case Bases.BASE16:
				baseCache = base16FetchCache;
				break;
			case Bases.BASE24:
				baseCache = base24FetchCache;
				break;
			default:
				throw new Error(`Unknown base: ${base.name}`);
		}

		let data;
		if (this.useCache) {
			data = baseCache;
		} else {
			data = await axios
				.get<unknown>(
					`https://api.github.com/repos/tinted-theming/schemes/contents/${base.name}`,
				)
				.then((res) => {
					if (this.updateCache)
						fs.writeFileSync(`cache/${base.name}.json`, JSON.stringify(res.data));
					return res.data;
				})
				.catch((err) => {
					console.error(err);
					return baseCache;
				});
		}

		if (Array.isArray(data) === false) {
			throw new Error("Invalid data, expected array");
		}

		const schemes = data
			.filter((item) => item.type === "file" && item.name.endsWith(".yaml"))
			.map((item) => Scheme.fromJSON(item));

		return Promise.all(schemes);
	}
}
