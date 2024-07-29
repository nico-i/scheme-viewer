/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly UPDATE_CACHE: boolean;
	readonly USE_CACHE: boolean;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
