import type { Traits } from "../seed/traits.js";
import { blob } from "./blob.js";
import { bold, soft } from "./classic.js";
import { CUTE_EYE_LINE, chick, jelly, mochi } from "./cute.js";
import type { FaceOptions, FaceParts } from "./types.js";

export type { FaceOptions, FaceParts } from "./types.js";

// All parts are drawn on a 100×100 canvas.
const OPEN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true">`;
const LAYER = OPEN.replace("<svg ", '<svg class="layer" ');

/** Where each look's eyes sit (percent of height); blinks and lids squash around it. */
export const EYE_LINE = {
	soft: 52,
	bold: 42,
	blob: 52,
	...CUTE_EYE_LINE,
} as const;

/** The face as separate SVG fragments (no <svg> wrapper), so the element can layer them. */
export function faceParts(
	traits: Traits,
	options: FaceOptions = {},
): FaceParts {
	// Depth applies to soft, bold and blob; mochi, chick and jelly have their own finish.
	const depth = options.depth ?? false;
	switch (traits.look) {
		case "bold":
			return bold(traits, depth);
		case "blob":
			return blob(traits, depth);
		case "mochi":
			return mochi(traits);
		case "chick":
			return chick(traits);
		case "jelly":
			return jelly(traits);
		default:
			return soft(traits, depth);
	}
}

/** The small "z" shown while away. */
export const Z_MARK = `<path d="M70 14h9l-9 9h9" fill="none" stroke="#3a3542" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;

/** The face as one standalone, static SVG string. */
export function renderFace(traits: Traits, options: FaceOptions = {}): string {
	const f = faceParts(traits, options);
	return `${OPEN}${f.body}${f.features}${f.eyes}${f.over ?? ""}</svg>`;
}

/**
 * The face as stacked HTML layers for the live element. Animated pieces sit on their own
 * HTML layers so the browser animates them on the compositor; transforms on elements
 * inside an SVG would repaint on the main thread every frame.
 */
export function renderLayers(
	traits: Traits,
	options: FaceOptions = {},
): string {
	const f = faceParts(traits, options);
	return (
		`${LAYER}${f.body}</svg>` +
		`<div class="layer face">` +
		`${LAYER}${f.features}</svg>` +
		`<div class="layer lids"><div class="layer blink">${LAYER}${f.eyes}</svg></div></div>` +
		`<div class="layer closed">${LAYER}${f.closed}</svg></div>` +
		(f.over ? `${LAYER}${f.over}</svg>` : "") +
		`</div>` +
		`<div class="layer z">${LAYER}${Z_MARK}</svg></div>`
	);
}
