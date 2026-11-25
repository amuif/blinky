// Soft (pastel blob, low-set sparkly eyes) and bold (big outlined googly eyes, button nose).
import type { BoldTraits, SoftTraits } from "../seed/traits.js";
import { shutEyes } from "./eyes.js";
import { BOLD_PALETTES, SOFT_PALETTES } from "./palettes.js";
import type { FaceParts } from "./types.js";

const stroke = (ink: string, w = 3.5) =>
	`fill="none" stroke="${ink}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;

// Depth: a soft top-left highlight and a rim shade turn the flat disc into a rounded body.
export const BODY_DEPTH =
	`<defs><radialGradient id="bk-hi" cx=".34" cy=".28" r=".62"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>` +
	`<radialGradient id="bk-rim" cx=".5" cy=".42" r=".62"><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></radialGradient></defs>` +
	`<circle cx="50" cy="50" r="50" fill="url(#bk-rim)"/><circle cx="50" cy="50" r="50" fill="url(#bk-hi)"/>`;

// ── Soft: pastel blob, low-set big eyes with sparkles, blush. Eye line at 52%. ───────────
// Cute reads from baby proportions: features low on the face, big eyes, small mouth.
const SOFT_INK = "#2b2b3a";
const sparkle = (x: number, y: number, r = 2.2) =>
	`<circle cx="${x - r}" cy="${y - r}" r="${r}" fill="#fff"/><circle cx="${x + r * 0.9}" cy="${y + r * 0.9}" r="${r * 0.45}" fill="#fff"/>`;

const SOFT_EYES: Record<SoftTraits["eyes"], string> = {
	dots: `<circle cx="35" cy="52" r="6.5"/><circle cx="65" cy="52" r="6.5"/>${sparkle(35, 52)}${sparkle(65, 52)}`,
	ovals: `<ellipse cx="35" cy="51" rx="5.5" ry="8"/><ellipse cx="65" cy="51" rx="5.5" ry="8"/>${sparkle(35, 50, 2)}${sparkle(65, 50, 2)}`,
	// Happy closed eyes (^ ^).
	sleepy: `<path d="M29 54q6-6.5 12 0M59 54q6-6.5 12 0" ${stroke(SOFT_INK)}/>`,
};

const SOFT_MOUTHS: Record<SoftTraits["mouth"], string> = {
	smile: `<path d="M45 62q5 4.5 10 0" ${stroke(SOFT_INK, 3.2)}/>`,
	open: `<path d="M45 61h10q0 6.5-5 6.5t-5-6.5z" fill="${SOFT_INK}"/>`,
	cat: `<path d="M43 61.5q3.5 3.5 7 0q3.5 3.5 7 0" ${stroke(SOFT_INK, 3.2)}/>`,
};

export function soft(t: SoftTraits, depth: boolean): FaceParts {
	const p = SOFT_PALETTES[t.palette] ?? SOFT_PALETTES[0];
	if (!p) throw new Error("no palettes defined");
	const cheeks = t.cheeks
		? `<g part="cheeks" fill="${p.cheek}" opacity=".7"><ellipse cx="23" cy="62" rx="7" ry="4.5"/><ellipse cx="77" cy="62" rx="7" ry="4.5"/></g>`
		: "";
	return {
		body:
			`<g part="body"><circle cx="50" cy="50" r="50" fill="${p.shadow}"/><circle cx="50" cy="47" r="47" fill="${p.body}"/>` +
			`${depth ? BODY_DEPTH : ""}</g>`,
		features: `${cheeks}<g part="mouth">${SOFT_MOUTHS[t.mouth]}</g>`,
		eyes: `<g part="eyes" fill="${SOFT_INK}">${SOFT_EYES[t.eyes]}</g>`,
		closed: shutEyes(15, 53, 6.5, SOFT_INK, 3.2),
	};
}

// ── Bold: flat colour, big outlined eyes meeting in the middle, button nose. Eye line at 42%.
const BOLD_INK = "#1f2a2c";
const EYE_R = 16.5;
const EYE_Y = 42;

const GAZE: Record<BoldTraits["eyes"], [number, number]> = {
	"up-left": [-4.5, -4.5],
	"up-right": [4.5, -4.5],
	up: [0, -5.5],
	front: [0, 0.5],
};

const BOLD_EYE_DEPTH = `<defs><radialGradient id="bk-eye" cx=".45" cy=".4" r=".6"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></radialGradient></defs>`;

function boldEye(
	cx: number,
	[dx, dy]: [number, number],
	depth: boolean,
): string {
	const px = cx + dx;
	const py = EYE_Y + dy;
	return (
		`<circle cx="${cx}" cy="${EYE_Y}" r="${EYE_R}" fill="#fff"/>` +
		(depth
			? `<circle cx="${cx}" cy="${EYE_Y}" r="${EYE_R}" fill="url(#bk-eye)"/>`
			: "") +
		`<circle cx="${cx}" cy="${EYE_Y}" r="${EYE_R}" ${stroke(BOLD_INK)}/>` +
		`<circle cx="${px}" cy="${py}" r="10.5" fill="${BOLD_INK}"/>` +
		`<circle cx="${px - 3.4}" cy="${py - 3.4}" r="3.2" fill="#fff"/>` +
		`<circle cx="${px + 3.4}" cy="${py + 3.2}" r="1.4" fill="#fff"/>`
	);
}

const BOLD_MOUTHS: Record<BoldTraits["mouth"], string> = {
	smile: `<path d="M42 70l2.5 1q5.5 5.5 11 0l2.5-1" ${stroke(BOLD_INK)}/>`,
	grin: `<path d="M44 69.5h12q0 7.5-6 7.5t-6-7.5z" fill="${BOLD_INK}"/>`,
	cat: `<path d="M42.5 71q3.75 3.75 7.5 0q3.75 3.75 7.5 0" ${stroke(BOLD_INK)}/>`,
	small: `<path d="M46 72q4 3.5 8 0" ${stroke(BOLD_INK)}/>`,
};

export function bold(t: BoldTraits, depth: boolean): FaceParts {
	const p = BOLD_PALETTES[t.palette] ?? BOLD_PALETTES[0];
	if (!p) throw new Error("no palettes defined");
	const gaze = GAZE[t.eyes];
	const noseShine = depth
		? `<circle cx="48.2" cy="56.2" r="1.6" fill="#fff" opacity=".8"/>`
		: "";
	return {
		body: `<g part="body"><circle cx="50" cy="50" r="50" fill="${p.body}"/>${depth ? BODY_DEPTH : ""}</g>`,
		features:
			`<g part="cheeks" fill="#ffb3c7" opacity=".9"><ellipse cx="18" cy="63" rx="6.5" ry="4"/><ellipse cx="82" cy="63" rx="6.5" ry="4"/></g>` +
			`<g part="mouth">${BOLD_MOUTHS[t.mouth]}</g>`,
		eyes: `<g part="eyes">${depth ? BOLD_EYE_DEPTH : ""}${boldEye(33.5, gaze, depth)}${boldEye(66.5, gaze, depth)}</g>`,
		closed: shutEyes(16.5, EYE_Y, 10, BOLD_INK, 3.5),
		// The button nose sits where the eyes meet, above them.
		over: t.nose
			? `<g part="nose"><circle cx="50" cy="58" r="5.5" fill="${p.nose}" stroke="${BOLD_INK}" stroke-width="3.2"/>${noseShine}</g>`
			: "",
	};
}
