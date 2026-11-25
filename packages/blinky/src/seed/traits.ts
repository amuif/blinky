import {
	BOLD_PALETTES,
	CHICK_COLORS,
	JELLY_FLAVORS,
	MOCHI_COLORS,
	SOFT_PALETTES,
} from "../parts/palettes.js";
import { cyrb53, mulberry32 } from "./random.js";

export const LOOKS = [
	"soft",
	"bold",
	"blob",
	"mochi",
	"chick",
	"jelly",
] as const;
export type Look = (typeof LOOKS)[number];

// ── soft, bold, blob ─────────────────────────────────────────────────────────────────────
export const SOFT_EYES = ["dots", "ovals", "sleepy"] as const;
export const SOFT_MOUTHS = ["smile", "open", "cat"] as const;
/** Bold eyes are named by where the pupils look. */
export const BOLD_EYES = ["up-left", "up-right", "up", "front"] as const;
export const BOLD_MOUTHS = ["smile", "grin", "cat", "small"] as const;
export const BLOB_SHAPES = ["round", "squircle", "capsule", "organic"] as const;

export interface SoftTraits {
	look: "soft";
	palette: number;
	eyes: (typeof SOFT_EYES)[number];
	mouth: (typeof SOFT_MOUTHS)[number];
	cheeks: boolean;
}
export interface BoldTraits {
	look: "bold";
	palette: number;
	eyes: (typeof BOLD_EYES)[number];
	mouth: (typeof BOLD_MOUTHS)[number];
	nose: boolean;
}
export interface BlobTraits {
	look: "blob";
	/** Body hue in degrees. */
	hue: number;
	shape: (typeof BLOB_SHAPES)[number];
	/** Body tilt in degrees. */
	tilt: number;
	/** Organic outline radii (7 points); only drawn for the organic shape. */
	radii: number[];
	/** Half the distance between the eyes. */
	eyeGap: number;
	eyeTilt: number;
}

// ── mochi, chick, jelly ──────────────────────────────────────────────────────────────────

/** Dot eyes with a sparkle, or happy closed arcs (^ ^). */
export const EYES = ["dots", "happy"] as const;
export const MOCHI_MOUTHS = ["smile", "cat", "none"] as const;
export const JELLY_MOUTHS = ["smile", "cat", "o"] as const;
export const TUFTS = ["curl", "sprout", "trio"] as const;

interface Base {
	color: number;
	eyes: (typeof EYES)[number];
	/** Half the distance between the eyes. */
	eyeGap: number;
}
export interface MochiTraits extends Base {
	look: "mochi";
	mouth: (typeof MOCHI_MOUTHS)[number];
	/** Top of the bun: lower is squishier. */
	top: number;
	/** Half the bun's width. */
	width: number;
}
export interface ChickTraits extends Base {
	look: "chick";
	tuft: (typeof TUFTS)[number];
}
export interface JellyTraits extends Base {
	look: "jelly";
	mouth: (typeof JELLY_MOUTHS)[number];
}
export type Traits =
	| SoftTraits
	| BoldTraits
	| BlobTraits
	| MochiTraits
	| ChickTraits
	| JellyTraits;

// Trait set v1. Never reorder these lists or the pick order below once released:
// that would change existing users' faces. Add a new trait version instead.
export function pickTraits(seed: string, look: Look = "soft"): Traits {
	const rand = mulberry32(cyrb53(seed));
	const pick = <T>(list: readonly T[]): T =>
		list[Math.floor(rand() * list.length)] as T;
	const range = (min: number, max: number) =>
		Math.round((min + rand() * (max - min)) * 10) / 10;
	if (look === "bold") {
		return {
			look,
			palette: Math.floor(rand() * BOLD_PALETTES.length),
			eyes: pick(BOLD_EYES),
			mouth: pick(BOLD_MOUTHS),
			nose: rand() < 0.7,
		};
	}
	if (look === "blob") {
		return {
			look,
			hue: Math.floor(rand() * 360),
			shape: pick(BLOB_SHAPES),
			tilt: range(-12, 12),
			radii: Array.from({ length: 7 }, () => range(38, 46)),
			eyeGap: range(8, 11.5),
			eyeTilt: range(-8, 8),
		};
	}
	if (look === "mochi") {
		return {
			look,
			color: Math.floor(rand() * MOCHI_COLORS.length),
			eyes: pick(EYES),
			eyeGap: range(10.5, 13),
			mouth: pick(MOCHI_MOUTHS),
			top: range(25, 32),
			width: range(35, 39),
		};
	}
	if (look === "chick") {
		return {
			look,
			color: Math.floor(rand() * CHICK_COLORS.length),
			eyes: pick(EYES),
			eyeGap: range(10, 12.5),
			tuft: pick(TUFTS),
		};
	}
	if (look === "jelly") {
		return {
			look,
			color: Math.floor(rand() * JELLY_FLAVORS.length),
			eyes: pick(EYES),
			eyeGap: range(10, 12.5),
			mouth: pick(JELLY_MOUTHS),
		};
	}
	return {
		look,
		palette: Math.floor(rand() * SOFT_PALETTES.length),
		eyes: pick(SOFT_EYES),
		mouth: pick(SOFT_MOUTHS),
		cheeks: rand() < 0.85,
	};
}
