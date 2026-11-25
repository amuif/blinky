import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
	// The React wrapper imports the package by name; test it against source, no build needed.
	resolve: {
		alias: [
			{
				find: /^blinky-avatar$/,
				replacement: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
			},
		],
	},
	test: { environment: "happy-dom" },
});
