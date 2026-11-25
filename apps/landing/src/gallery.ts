import { cyrb53, mulberry32 } from "blinky-avatar";

// Style exploration: ten static directions to choose from. Not wired into the component.
type Rand = () => number;
let uid = 0;
const id = (p: string) => `${p}${++uid}`;
const r2 = (v: number) => Math.round(v * 10) / 10;
const pick = <T>(r: Rand, list: readonly T[]): T =>
	list[Math.floor(r() * list.length)] as T;
const range = (r: Rand, a: number, b: number) => r2(a + r() * (b - a));
const svg = (inner: string) =>
	`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">${inner}</svg>`;

/** Closed Catmull-Rom blob through points around a centre. */
function blob(
	cx: number,
	cy: number,
	rx: number,
	ry: number,
	wobble: number,
	r: Rand,
	n = 7,
): string {
	const pts = Array.from({ length: n }, (_, i) => {
		const t = (i / n) * Math.PI * 2;
		const k = 1 - wobble / 2 + r() * wobble;
		return [cx + Math.cos(t) * rx * k, cy + Math.sin(t) * ry * k] as const;
	});
	const p = (i: number) => pts[(i + n) % n] ?? [cx, cy];
	let d = `M${r2(p(0)[0])} ${r2(p(0)[1])}`;
	for (let i = 0; i < n; i++) {
		const [x0, y0] = p(i - 1);
		const [x1, y1] = p(i);
		const [x2, y2] = p(i + 1);
		const [x3, y3] = p(i + 2);
		d += `C${r2(x1 + (x2 - x0) / 6)} ${r2(y1 + (y2 - y0) / 6)} ${r2(x2 - (x3 - x1) / 6)} ${r2(y2 - (y3 - y1) / 6)} ${r2(x2)} ${r2(y2)}`;
	}
	return `${d}Z`;
}

const INK = "#3a3542";
const line = (w = 2.6, c = INK) =>
	`fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const happyEyes = (y: number, gap: number, w = 6, c = INK) =>
	`<path d="M${50 - gap - w} ${y}q${w} -${w * 0.9} ${w * 2} 0M${50 + gap - w} ${y}q${w} -${w * 0.9} ${w * 2} 0" ${line(2.6, c)}/>`;
const dotEyes = (y: number, gap: number, rad = 3, c = INK) =>
	`<circle cx="${50 - gap}" cy="${y}" r="${rad}" fill="${c}"/><circle cx="${50 + gap}" cy="${y}" r="${rad}" fill="${c}"/>`;
const blush = (y: number, gap: number, c = "#f4a9b8", o = 0.55) =>
	`<g fill="${c}" opacity="${o}"><ellipse cx="${50 - gap}" cy="${y}" rx="5.5" ry="3.2"/><ellipse cx="${50 + gap}" cy="${y}" rx="5.5" ry="3.2"/></g>`;

export interface Style {
	name: string;
	mood: string;
	draw(r: Rand): string;
}

export const STYLES: Style[] = [
	{
		name: "Mochi",
		mood: "Squishy rice-cake buns in milky pastels. Tiny content eyes, barely-there blush.",
		draw(r) {
			const c = pick(r, [
				"#f7f0e8",
				"#f5e3e6",
				"#e8efe1",
				"#e4ecf3",
				"#efe7f4",
				"#f8ecd9",
			]);
			const eyes = r() < 0.5 ? happyEyes(57, 12, 4.5) : dotEyes(56, 12, 2.6);
			const mouth = pick(r, [
				`<path d="M47 63q3 3 6 0" ${line(2.2)}/>`,
				`<path d="M45.5 62.5q2.25 2.5 4.5 0q2.25 2.5 4.5 0" ${line(2.2)}/>`,
				"",
			]);
			return svg(
				`<ellipse cx="50" cy="86" rx="30" ry="4" fill="#000" opacity=".06"/>` +
					`<path d="M12 70C12 44 30 28 50 28S88 44 88 70C88 82 72 86 50 86S12 82 12 70Z" fill="${c}" stroke="#00000010" stroke-width="1"/>` +
					`<ellipse cx="36" cy="40" rx="8" ry="4" fill="#fff" opacity=".7" transform="rotate(-20 36 40)"/>` +
					eyes +
					blush(64, 22, "#f2a7b6", 0.45) +
					mouth,
			);
		},
	},
	{
		name: "Chick",
		mood: "Fluffy round chicks with a tiny beak and a tuft on top. Soft and innocent.",
		draw(r) {
			const c = pick(r, [
				"#ffe58a",
				"#fff1c2",
				"#ffd6b0",
				"#e9e4dc",
				"#ffeaa0",
			]);
			return svg(
				`<path d="M48 22q-4-8 2-10M50 22q2-8 8-7M52 23q6-4 10 0" ${line(2.2, "#e0b84a")}/>` +
					`<circle cx="50" cy="56" r="33" fill="${c}"/>` +
					`<path d="M18 60q-6 6 0 12q4-2 6-6Z M82 60q6 6 0 12q-4-2-6-6Z" fill="${c}" stroke="#00000010"/>` +
					dotEyes(50, 11, 3, "#3b2f2a") +
					`<circle cx="37.8" cy="48.8" r="1" fill="#fff"/><circle cx="59.8" cy="48.8" r="1" fill="#fff"/>` +
					`<path d="M45.5 56L50 60.5L54.5 56Z" fill="#ff9f43" stroke="#ff9f43" stroke-width="1.5" stroke-linejoin="round"/>` +
					blush(59, 20, "#ffab9e", 0.55),
			);
		},
	},
	{
		name: "Jelly",
		mood: "Translucent gummy candies in fruit flavours. Glossy, bouncy, sweet.",
		draw(r) {
			const g = id("jelly");
			const [a, b] = pick(r, [
				["#ffd1dc", "#ff7f9e"],
				["#d8f5b8", "#86cf5b"],
				["#e5d4ff", "#a07ee8"],
				["#ffe2b8", "#ffa64d"],
				["#fff3b0", "#f5cf3b"],
				["#c9efff", "#5fbfe8"],
			]);
			return svg(
				`<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>` +
					`<ellipse cx="50" cy="88" rx="28" ry="4" fill="${b}" opacity=".25"/>` +
					`<path d="M50 20C72 20 84 36 84 56S72 86 50 86S16 76 16 56S28 20 50 20Z" fill="url(#${g})" opacity=".92"/>` +
					`<path d="M30 34C34 27 42 24 50 24" ${line(5, "#ffffff")} opacity=".7"/>` +
					`<circle cx="66" cy="70" r="3" fill="#fff" opacity=".35"/>` +
					dotEyes(55, 11, 3.4, "#3d2d3a") +
					`<circle cx="38" cy="54" r="1.3" fill="#fff"/><circle cx="60" cy="54" r="1.3" fill="#fff"/>` +
					`<path d="M46.5 62q3.5 3 7 0" ${line(2.3, "#3d2d3a")}/>` +
					blush(62, 21, "#ffffff", 0.45),
			);
		},
	},
];

// ── Blob explorations: the blob look's seeded silhouette + pill eyes, in different finishes.
/** Seeded silhouette: a wobbly organic blob, a squat capsule, or a soft squircle-ish bean. */
function silhouette(r: Rand, cy = 54): string {
	const kind = pick(r, ["organic", "capsule", "bean", "round"]);
	if (kind === "capsule") return blob(50, cy, 40, 27, 0.06, r, 8);
	if (kind === "bean") return blob(50, cy, 33, 38, 0.1, r, 7);
	if (kind === "round") return blob(50, cy, 36, 35, 0.05, r, 8);
	return blob(50, cy, 37, 34, 0.2, r, 7);
}
const pill = (
	cx: number,
	cy: number,
	tilt: number,
	h = 12,
	c = INK,
	shine = true,
) =>
	`<g transform="rotate(${tilt} ${cx} ${cy})"><rect x="${cx - 3.2}" y="${cy - h / 2}" width="6.4" height="${h}" rx="3.2" fill="${c}"/>` +
	(shine
		? `<circle cx="${cx - 0.6}" cy="${cy - h / 2 + 3}" r="1.3" fill="#fff"/>`
		: "") +
	"</g>";
const pills = (r: Rand, cy: number, c = INK, h = 12, shine = true) => {
	const gap = range(r, 8, 11);
	const tilt = range(r, -8, 8);
	return (
		pill(50 - gap, cy, tilt, h, c, shine) +
		pill(50 + gap, cy, tilt, h, c, shine)
	);
};
const shadow = (cy = 88, rx = 28) =>
	`<ellipse cx="50" cy="${cy}" rx="${rx}" ry="4" fill="#000" opacity=".07"/>`;

export const BLOBS: Style[] = [
	{
		name: "Blob (current)",
		mood: "The blob look as it is now: flat colour, seeded silhouette, two pill eyes.",
		draw(r) {
			return svg(
				`<path d="${silhouette(r)}" fill="hsl(${Math.floor(r() * 360)} 72% 78%)"/>` +
					pills(r, 54),
			);
		},
	},
	{
		name: "Milky blob",
		mood: "Blob shapes in Mochi's milky pastels, with a soft sheen and gentle blush.",
		draw(r) {
			const c = pick(r, [
				"#f7f0e8",
				"#f5e3e6",
				"#e8efe1",
				"#e4ecf3",
				"#efe7f4",
				"#f8ecd9",
			]);
			return svg(
				shadow() +
					`<path d="${silhouette(r)}" fill="${c}" stroke="#00000012" stroke-width="1"/>` +
					`<ellipse cx="36" cy="36" rx="8" ry="4" fill="#fff" opacity=".75" transform="rotate(-20 36 36)"/>` +
					pills(r, 54, INK, 10) +
					blush(62, 19, "#f2a7b6", 0.45),
			);
		},
	},
	{
		name: "Jelly blob",
		mood: "Blob shapes as translucent gummies: candy gradient, glossy streak.",
		draw(r) {
			const g = id("jb");
			const [a, b] = pick(r, [
				["#ffd1dc", "#ff7f9e"],
				["#d8f5b8", "#86cf5b"],
				["#e5d4ff", "#a07ee8"],
				["#ffe2b8", "#ffa64d"],
				["#c9efff", "#5fbfe8"],
			]);
			return svg(
				`<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>` +
					`<ellipse cx="50" cy="88" rx="26" ry="4" fill="${b}" opacity=".25"/>` +
					`<path d="${silhouette(r)}" fill="url(#${g})" opacity=".92"/>` +
					`<path d="M31 36C35 29 42 26 49 26" ${line(4.5, "#ffffff")} opacity=".65"/>` +
					pills(r, 54, "#3d2d3a") +
					blush(62, 19, "#ffffff", 0.45),
			);
		},
	},
	{
		name: "Fluffy blob",
		mood: "Chick-soft blobs with a fuzzy outline and a little tuft on top.",
		draw(r) {
			const c = pick(r, [
				"#ffe58a",
				"#fff1c2",
				"#ffd6b0",
				"#e9e4dc",
				"#dcebf7",
				"#f3dcef",
			]);
			const fuzz = blob(50, 56, 35, 33, 0.07, r, 22);
			return svg(
				shadow() +
					`<path d="M47 24q-3-7 2-9M50 24q2-7 7-6" ${line(2, "#c9a24a")}/>` +
					`<path d="${fuzz}" fill="${c}" stroke="${c}" stroke-width="3" stroke-dasharray="1.5 2.5" stroke-linecap="round"/>` +
					pills(r, 54, "#3b2f2a", 10) +
					`<path d="M47 61.5L50 64.5L53 61.5Z" fill="#ff9f43"/>` +
					blush(62, 20, "#ffab9e", 0.5),
			);
		},
	},
	{
		name: "Quiet blob",
		mood: "Muted stone and moss tones, small eyes, no blush. The calmest option.",
		draw(r) {
			const c = pick(r, [
				"#a9b9a2",
				"#cbb99e",
				"#bba7a1",
				"#a1b2ba",
				"#c6baa9",
				"#aaa4ba",
			]);
			return svg(
				shadow() +
					`<path d="${silhouette(r)}" fill="${c}"/>` +
					pills(r, 54, "#34322e", 9, false),
			);
		},
	},
	{
		name: "Expressive blob",
		mood: "Same blobs, but each gets a tiny seeded mouth: smile, 'w', 'o' or a sleepy line.",
		draw(r) {
			const mouth = pick(r, [
				`<path d="M46.5 63q3.5 3 7 0" ${line(2.3)}/>`,
				`<path d="M45 62.5q2.5 2.8 5 0q2.5 2.8 5 0" ${line(2.2)}/>`,
				`<ellipse cx="50" cy="64" rx="2.4" ry="2.8" fill="${INK}"/>`,
				`<path d="M47 64h6" ${line(2.2)}/>`,
			]);
			return svg(
				`<path d="${silhouette(r)}" fill="hsl(${Math.floor(r() * 360)} 70% 80%)"/>` +
					pills(r, 53, INK, 11) +
					mouth +
					blush(62, 20, "#ffb3c7", 0.85),
			);
		},
	},
	{
		name: "Dusk blob",
		mood: "Soft two-hue gradients like an evening sky, with white eyes.",
		draw(r) {
			const g = id("db");
			const h = Math.floor(r() * 360);
			const h2 = (h + 30 + Math.floor(r() * 50)) % 360;
			return svg(
				`<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h} 75% 82%)"/><stop offset="1" stop-color="hsl(${h2} 60% 66%)"/></linearGradient></defs>` +
					shadow() +
					`<path d="${silhouette(r)}" fill="url(#${g})"/>` +
					pills(r, 54, "#ffffff", 11, false),
			);
		},
	},
	{
		name: "Outlined blob",
		mood: "A thin hand-drawn outline around flat colour. Clean, like a little sticker.",
		draw(r) {
			const c = pick(r, [
				"#ffc9c9",
				"#ffe0a8",
				"#c9f0d6",
				"#cfe0ff",
				"#e4d4ff",
				"#fff1b8",
			]);
			return svg(
				`<path d="${silhouette(r)}" fill="${c}" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>` +
					pills(r, 54) +
					blush(62, 19, "#ff9fb6", 0.5),
			);
		},
	},
	{
		name: "Blob with feet",
		mood: "Two stubby feet make each blob a tiny character standing there.",
		draw(r) {
			const c = `hsl(${Math.floor(r() * 360)} 65% 78%)`;
			return svg(
				shadow(90, 22) +
					`<ellipse cx="40" cy="84" rx="7" ry="4.5" fill="${c}" stroke="#00000014"/><ellipse cx="60" cy="84" rx="7" ry="4.5" fill="${c}" stroke="#00000014"/>` +
					`<path d="${silhouette(r, 50)}" fill="${c}"/>` +
					pills(r, 50, INK, 11) +
					blush(58, 19, "#ffb3c7", 0.8),
			);
		},
	},
	{
		name: "Tall bean",
		mood: "Upright bean and droplet shapes with low-set eyes. Shy and gentle.",
		draw(r) {
			const c = pick(r, [
				"#ffd6e0",
				"#d6f0e0",
				"#d9e4ff",
				"#fff0c9",
				"#ead9ff",
				"#ffe2cc",
			]);
			const d = blob(50, 56, 26, 38, 0.1, r, 7);
			return svg(
				shadow(92, 20) +
					`<path d="${d}" fill="${c}"/>` +
					pills(r, 64, INK, 9) +
					blush(71, 15, "#ff9fb6", 0.55),
			);
		},
	},
];

export function drawStyle(style: Style, seed: string): string {
	return style.draw(mulberry32(cyrb53(`${style.name}:${seed}`)));
}

export const SEEDS = [
	"Ibrahim Hassen",
	"Selam",
	"Dawit",
	"Hana",
	"Amina",
	"Yonas",
];
