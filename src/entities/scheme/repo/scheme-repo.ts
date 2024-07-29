import { Base } from "../../base/base.js";
import { Scheme } from "../scheme.js";

export interface SchemeRepo {
    getSchemesByBase(base: Base): Promise<Scheme[]>;
}