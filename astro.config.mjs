import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";
import { Bases } from "./src/entities/base/base";

const base = `scheme-viewer`;

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind()],
	site: `https://nico-i.github.io`,
	base,
	trailingSlash: `never`,
	redirects: {
		"/": `${base}/${Bases.BASE16}`,
	},
});
