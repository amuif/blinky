import type { HTMLAttributes } from "svelte/elements";

// Lets Svelte type-check <blinky-avatar> attributes.
declare module "svelte/elements" {
	interface SvelteHTMLElements {
		"blinky-avatar": HTMLAttributes<HTMLElement> & {
			seed?: string | undefined;
			name?: string | undefined;
			size?: string | number | undefined;
			status?: "online" | "away" | "offline" | undefined;
			look?: "soft" | "bold" | "blob" | "mochi" | "chick" | "jelly" | undefined;
			depth?: "" | "true" | "false" | undefined;
			animated?: "true" | "false" | undefined;
		};
	}
}
