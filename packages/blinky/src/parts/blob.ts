// The blob look: a seeded soft silhouette with two little pill eyes.
// Inspired by blobatar (MIT, https://github.com/Alain00/blobatar): superellipse and
// Catmull-Rom bodies, tilted pill eyes. This is a small independent implementation.
import type { BlobTraits } from "../seed/traits.js";
import { shutEyes } from "./eyes.js";
import type { FaceParts } from "./types.js";

const INK = "#1d1b26";
const r2 = (v: number) => String(Math.round(v * 100) / 100);

function rotate(
	cx: number,
	cy: number,
	x: number,
	y: number,
	deg: number,
): string {
	const t = (deg * Math.PI) / 180;
	return `${r2(cx + x * Math.cos(t) - y * Math.sin(t))} ${r2(cy + x * Math.sin(t) + y * Math.cos(t))}`;
}

/** Superellipse |x/a|^n + |y/b|^n = 1 as four cubic Béziers; n=2 is an ellipse, ~4 a squircle. */
export function superellipse(
	cx: number,
	cy: number,
	a: number,
	b: number,
	n: number,
	rot = 0,
): string {
	// Control offset that makes each quadrant pass through the curve's 45° point.
	const k = Math.min(1, (8 * 2 ** (-1 / n) - 4) / 3);
	const pts: [number, number][] = [
		[a, 0],
		[a, b * k],
		[a * k, b],
		[0, b],
		[-a * k, b],
		[-a, b * k],
		[-a, 0],
		[-a, -b * k],
		[-a * k, -b],
		[0, -b],
		[a * k, -b],
		[a, -b * k],
		[a, 0],
	];
	const at = (i: number) => {
		const [x, y] = pts[i] ?? [0, 0];
		return rotate(cx, cy, x, y, rot);
	};
	let d = `M${at(0)}`;
	for (let i = 1; i < 13; i += 3) d += `C${at(i)} ${at(i + 1)} ${at(i + 2)}`;
	return `${d}Z`;
}

/** A wobbly closed curve: radii around a circle joined by a closed Catmull-Rom spline. */
export function organic(
	cx: number,
	cy: number,
	radii: readonly number[],
	rot = 0,
): string {
	const n = radii.length;
	const p = radii.map((r, i) => {
		const t = (i / n) * 2 * Math.PI + (rot * Math.PI) / 180;
		return [cx + r * Math.cos(t), cy + r * Math.sin(t)] as const;
	});
	const pt = (i: number) => p[(i + n) % n] ?? [cx, cy];
	let d = `M${r2(pt(0)[0])} ${r2(pt(0)[1])}`;
	for (let i = 0; i < n; i++) {
		const [x0, y0] = pt(i - 1);
		const [x1, y1] = pt(i);
		const [x2, y2] = pt(i + 1);
		const [x3, y3] = pt(i + 2);
		d +=
			`C${r2(x1 + (x2 - x0) / 6)} ${r2(y1 + (y2 - y0) / 6)} ` +
			`${r2(x2 - (x3 - x1) / 6)} ${r2(y2 - (y3 - y1) / 6)} ${r2(x2)} ${r2(y2)}`;
	}
	return `${d}Z`;
}

function bodyPath(t: BlobTraits): string {
	switch (t.shape) {
		case "round":
			return superellipse(50, 50, 44, 44, 2);
		case "squircle":
			return superellipse(50, 50, 40, 40, 4.2, t.tilt);
		case "capsule":
			return superellipse(50, 50, 45, 30, 2.6, t.tilt / 2);
		default:
			return organic(50, 50, t.radii, t.tilt);
	}
}

/** Body colour from the seeded hue: soft and light so the dark eyes read at 24 px. */
export const blobColor = (hue: number) => `hsl(${hue} 72% 78%)`;

export function blob(t: BlobTraits, depth: boolean): FaceParts {
	const d = bodyPath(t);
	const shade = depth
		? `<defs><clipPath id="bk-clip"><path d="${d}"/></clipPath>` +
			`<radialGradient id="bk-hi" cx=".34" cy=".28" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>` +
			`<radialGradient id="bk-rim" cx=".5" cy=".42" r=".55"><stop offset=".65" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></radialGradient></defs>` +
			`<g clip-path="url(#bk-clip)"><rect width="100" height="100" fill="url(#bk-rim)"/><rect width="100" height="100" fill="url(#bk-hi)"/></g>`
		: "";
	// Eyes sit low (52% line, shared with soft) for baby proportions; each has a sparkle.
	const h = t.shape === "capsule" ? 11 : 13;
	const eye = (cx: number, tilt: number) =>
		`<g transform="rotate(${r2(tilt)} ${r2(cx)} 52)"><rect x="${r2(cx - 3.25)}" y="${r2(52 - h / 2)}" width="6.5" height="${h}" rx="3.25"/>` +
		`<circle cx="${r2(cx - 0.6)}" cy="${r2(52 - h / 2 + 3)}" r="1.4" fill="#fff"/></g>`;
	const blush = (cx: number) =>
		`<ellipse cx="${r2(cx)}" cy="61" rx="5" ry="3" fill="#ffb3c7" opacity=".85"/>`;
	return {
		body: `<g part="body"><path d="${d}" fill="${blobColor(t.hue)}"/>${shade}</g>`,
		features: `<g part="cheeks">${blush(50 - t.eyeGap - 9)}${blush(50 + t.eyeGap + 9)}</g>`,
		eyes: `<g part="eyes" fill="${INK}">${eye(50 - t.eyeGap, t.eyeTilt)}${eye(50 + t.eyeGap, t.eyeTilt)}</g>`,
		closed: shutEyes(t.eyeGap, 54, 4.5, INK, 2.6),
	};
}
