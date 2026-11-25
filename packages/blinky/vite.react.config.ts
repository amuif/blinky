import { defineConfig } from "vite";

// The React wrapper ships separately; react and the element bundle stay external.
export default defineConfig({
	build: {
		lib: { entry: "src/react.ts", formats: ["es"], fileName: () => "react.js" },
		rollupOptions: { external: ["react", "blinky-avatar"] },
		emptyOutDir: false,
		target: "es2022",
	},
});
