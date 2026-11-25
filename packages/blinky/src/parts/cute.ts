// Mochi, Chick and Jelly: soft character looks with their own built-in finish.
import type { ChickTraits, JellyTraits, MochiTraits } from "../seed/traits.js";
import { shutEyes } from "./eyes.js";
import { CHICK_COLORS, JELLY_FLAVORS, MOCHI_COLORS } from "./palettes.js";
import type { FaceParts } from "./types.js";

const INK = "#3a3542";
const line = (w: number, c = INK) =>
	`fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;

/** Eye line (percent of height) for each of these looks. */
export const CUTE_EYE_LINE = { mochi: 57, chick: 50, jelly: 55 } as const;

type CuteTraits = MochiTraits | ChickTraits | JellyTraits;

function eyes(t: CuteTraits, ink: string, r: number, sparkle: boolean): string {
	const y = CUTE_EYE_LINE[t.look];
	const l = 50 - t.eyeGap;
	const rr = 50 + t.eyeGap;
	if (t.eyes === "happy") {
		const w = r * 1.6;
		return `<path d="M${l - w} ${y + 1}q${w} -${w} ${w * 2} 0M${rr - w} ${y + 1}q${w} -${w} ${w * 2} 0" ${line(2.6, ink)}/>`;
	}
	const shine = sparkle
		? `<circle cx="${l - r * 0.4}" cy="${y - r * 0.4}" r="${r * 0.38}" fill="#fff"/><circle cx="${rr - r * 0.4}" cy="${y - r * 0.4}" r="${r * 0.38}" fill="#fff"/>`
		: "";
	return `<circle cx="${l}" cy="${y}" r="${r}" fill="${ink}"/><circle cx="${rr}" cy="${y}" r="${r}" fill="${ink}"/>${shine}`;
}

const cheeks = (y: number, gap: number, color: string, opacity: number) =>
	`<g part="cheeks" fill="${color}" opacity="${opacity}"><ellipse cx="${50 - gap}" cy="${y}" rx="5.5" ry="3.2"/><ellipse cx="${50 + gap}" cy="${y}" rx="5.5" ry="3.2"/></g>`;

// ── Mochi: a squishy rice-cake bun in milky pastels. ─────────────────────────────────────
const MOCHI_MOUTHS: Record<MochiTraits["mouth"], string> = {
	smile: `<path d="M47 63.5q3 3 6 0" ${line(2.2)}/>`,
	cat: `<path d="M45.5 63q2.25 2.5 4.5 0q2.25 2.5 4.5 0" ${line(2.2)}/>`,
	none: "",
};

export function mochi(t: MochiTraits): FaceParts {
	const c = MOCHI_COLORS[t.color] ?? "#f7f0e8";
	const L = 50 - t.width;
	const R = 50 + t.width;
	return {
		body:
			`<g part="body"><ellipse cx="50" cy="88" rx="${t.width - 6}" ry="4" fill="#000" opacity=".06"/>` +
			`<path d="M${L} 70C${L} 44 ${L + 18} ${t.top} 50 ${t.top}S${R} 44 ${R} 70C${R} 82 ${R - 16} 86 50 86S${L} 82 ${L} 70Z" fill="${c}" stroke="#0000001a" stroke-width="1"/>` +
			`<ellipse cx="${L + 14}" cy="${t.top + 12}" rx="8" ry="4" fill="#fff" opacity=".7" transform="rotate(-20 ${L + 14} ${t.top + 12})"/></g>`,
		features:
			cheeks(65, t.eyeGap + 10, "#f2a7b6", 0.5) +
			`<g part="mouth">${MOCHI_MOUTHS[t.mouth]}</g>`,
		eyes: `<g part="eyes">${eyes(t, INK, 2.8, true)}</g>`,
		closed: shutEyes(t.eyeGap, CUTE_EYE_LINE.mochi, 4, INK, 2.2),
	};
}

// ── Chick: a fluffy round chick with a beak and a tuft. ──────────────────────────────────
const TUFT: Record<ChickTraits["tuft"], string> = {
	curl: `<path d="M48 23q-4-8 2-10" ${line(2.2, "#d9ad3f")}/>`,
	sprout: `<path d="M50 23q-1-6 3-9M50 23q-3-5-7-5" ${line(2.2, "#d9ad3f")}/>`,
	trio: `<path d="M47 23q-4-8 2-10M50 23q2-8 8-7M53 24q6-4 10 0" ${line(2.2, "#d9ad3f")}/>`,
};

export function chick(t: ChickTraits): FaceParts {
	const c = CHICK_COLORS[t.color] ?? "#ffe58a";
	return {
		body:
			`<g part="body">${TUFT[t.tuft]}<circle cx="50" cy="56" r="33" fill="${c}"/>` +
			`<path d="M18 60q-6 6 0 12q4-2 6-6Z M82 60q6 6 0 12q-4-2-6-6Z" fill="${c}" stroke="#00000012"/></g>`,
		features:
			cheeks(59, t.eyeGap + 9, "#ffab9e", 0.55) +
			`<path part="beak" d="M45.5 56L50 60.5L54.5 56Z" fill="#ff9f43" stroke="#ff9f43" stroke-width="1.5" stroke-linejoin="round"/>`,
		eyes: `<g part="eyes">${eyes(t, "#3b2f2a", 3, true)}</g>`,
		closed: shutEyes(t.eyeGap, CUTE_EYE_LINE.chick, 4.2, "#3b2f2a", 2.2),
	};
}

// ── Jelly: a translucent gummy with a glossy streak. ─────────────────────────────────────
const JELLY_MOUTHS: Record<JellyTraits["mouth"], string> = {
	smile: `<path d="M46.5 62q3.5 3 7 0" ${line(2.3, "#3d2d3a")}/>`,
	cat: `<path d="M45 61.5q2.5 2.8 5 0q2.5 2.8 5 0" ${line(2.2, "#3d2d3a")}/>`,
	o: `<ellipse cx="50" cy="63" rx="2.4" ry="2.8" fill="#3d2d3a"/>`,
};

export function jelly(t: JellyTraits): FaceParts {
	const [top, bottom] = JELLY_FLAVORS[t.color] ?? ["#ffd1dc", "#ff7f9e"];
	// Same id for the same flavour, so several inlined static SVGs never disagree.
	const g = `bk-jelly-${t.color}`;
	return {
		body:
			`<g part="body"><defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs>` +
			`<ellipse cx="50" cy="88" rx="28" ry="4" fill="${bottom}" opacity=".25"/>` +
			`<path d="M50 20C72 20 84 36 84 56S72 86 50 86S16 76 16 56S28 20 50 20Z" fill="url(#${g})" opacity=".92"/>` +
			`<path d="M30 34C34 27 42 24 50 24" ${line(5, "#ffffff")} opacity=".7"/><circle cx="66" cy="70" r="3" fill="#fff" opacity=".35"/></g>`,
		features:
			cheeks(62, t.eyeGap + 10, "#ffffff", 0.45) +
			`<g part="mouth">${JELLY_MOUTHS[t.mouth]}</g>`,
		eyes: `<g part="eyes">${eyes(t, "#3d2d3a", 3.4, true)}</g>`,
		closed: shutEyes(t.eyeGap, CUTE_EYE_LINE.jelly, 4.6, "#3d2d3a", 2.3),
	};
}
