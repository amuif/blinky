import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [svelte()],
	build: {
		rollupOptions: { input: { main: "index.html", styles: "styles.html" } },
	},
});
