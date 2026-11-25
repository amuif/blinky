import { type FaceOptions, renderFace } from "./parts/face.js";
import { type Look, pickTraits } from "./seed/traits.js";

export {
	EYE_LINE,
	type FaceOptions,
	faceParts,
	renderFace,
} from "./parts/face.js";
export {
	BOLD_PALETTES,
	type BoldPalette,
	CHICK_COLORS,
	JELLY_FLAVORS,
	MOCHI_COLORS,
	SOFT_PALETTES,
	type SoftPalette,
} from "./parts/palettes.js";
export { cyrb53, mulberry32 } from "./seed/random.js";
export { LOOKS, type Look, pickTraits, type Traits } from "./seed/traits.js";

/** The character for a seed as a standalone SVG string. Same seed, same face, everywhere. */
export function toSVG(
	seed: string,
	options: FaceOptions & { look?: Look } = {},
): string {
	return renderFace(pickTraits(seed, options.look), options);
}
export {
	BlinkyAvatar,
	blinkTiming,
	parseLook,
	parseSize,
	parseStatus,
	SIZES,
	STATUSES,
	type Status,
} from "./element/avatar.js";
