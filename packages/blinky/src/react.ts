// React wrapper: <Blinky name="…" /> renders <blinky-avatar> and registers it once.
import "blinky-avatar";
import { createElement, type HTMLAttributes, type ReactElement } from "react";
import type { Look, Status } from "./index.js";

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

export function Blinky({
	name,
	seed,
	size,
	status,
	look,
	depth,
	animated,
	...rest
}: BlinkyProps): ReactElement {
	// Custom elements get plain attributes: booleans become present/absent, numbers strings.
	return createElement("blinky-avatar", {
		...rest,
		seed: seed ?? name,
		name,
		size: size === undefined ? undefined : String(size),
		status,
		look,
		depth: depth ? "" : undefined,
		animated: animated === false ? "false" : undefined,
	});
}
