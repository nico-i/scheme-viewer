export enum Bases {
	BASE16 = "base16",
	BASE24 = "base24",
}

export class Base {
	constructor(public readonly name: string) {
		if (!Base.isBase(name)) {
			throw new Error(`Unknown base: ${name}`);
		}
	}

	static isBase(base: Base | string): base is Base {
		return Object.values(Bases).includes(base as Bases);
	}
}
