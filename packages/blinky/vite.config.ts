import { defineConfig } from "vite";

// ESM for bundlers and Node, IIFE (global `Blinky`) for a plain CDN script tag.
export default defineConfig({
	build: {
		lib: {
			entry: "src/index.ts",
			name: "Blinky",
			formats: ["es", "iife"],
			fileName: (format) => (format === "es" ? "blinky.js" : "blinky.iife.js"),
		},
		target: "es2022",
	},
});
