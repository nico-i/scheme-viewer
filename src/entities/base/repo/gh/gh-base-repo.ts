import axios from "axios";
import fs from 'fs';
import { Base } from "../../base.js";
import { BaseRepo } from "../base-repo.js";
import baseFetchCache from './cache/bases.json';

export class GithubBaseRepo implements BaseRepo {
	constructor(public readonly useCache = false, public readonly updateCache = false) {}

	async getAllBases(): Promise<Base[]> {
		let data;

		if(this.useCache) {
			data = baseFetchCache;
		} else {
			data = await axios
			.get<
				{
					type: "dir" | "file";
					name: string;
				}[]
			>("https://api.github.com/repos/tinted-theming/schemes/contents")
			.then((res) => {
				if(this.updateCache){
					fs.writeFileSync("cache/bases.json", JSON.stringify(res.data));
				}
				return res.data
				})
				.catch((err) => {
					console.error(err);
					return baseFetchCache;
				});
			}

        return data
            .filter((item) => item.type === "dir" && item.name.includes("base"))
            .map((item) => new Base(item.name));
    }
}
