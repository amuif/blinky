import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: ".",
	testMatch: "*.spec.ts",
	timeout: 60_000,
	use: { baseURL: "http://localhost:4173", browserName: "chromium" },
	webServer: {
		command: "vite preview --port 4173 --strictPort",
		port: 4173,
		reuseExistingServer: true,
	},
});
