import type { Look, Status } from "blinky-avatar";
import type { Component } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

export interface BlinkyProps extends HTMLAttributes<HTMLElement> {
	/** The person's name: the accessible label, and the seed unless `seed` is set. */
	name: string;
	/** A stable id (user id, hashed email). Prefer it over the name so faces survive renames. */
	seed?: string;
	size?: "xs" | "sm" | "md" | "lg" | number;
	status?: Status;
	look?: Look;
	/** Rounded, glossy finish for soft, bold and blob. */
	depth?: boolean;
	/** false turns all motion off. */
	animated?: boolean;
}

export const Blinky: Component<BlinkyProps>;
