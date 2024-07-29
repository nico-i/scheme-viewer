import { Base } from "../base.js";

export interface BaseRepo {
	getAllBases(): Promise<Base[]>;
}
