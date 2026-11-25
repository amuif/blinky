import { describe, expect, test } from "vitest";
import { toSVG } from "../index.js";
import {
	BOLD_PALETTES,
	CHICK_COLORS,
	JELLY_FLAVORS,
	MOCHI_COLORS,
	SOFT_PALETTES,
} from "../parts/palettes.js";
import { cyrb53, mulberry32 } from "./random.js";
import {
	BLOB_SHAPES,
	type BlobTraits,
	BOLD_EYES,
	BOLD_MOUTHS,
	type BoldTraits,
	type ChickTraits,
	EYES,
	JELLY_MOUTHS,
	type JellyTraits,
	LOOKS,
	MOCHI_MOUTHS,
	type MochiTraits,
	pickTraits,
	SOFT_EYES,
	SOFT_MOUTHS,
	type SoftTraits,
	TUFTS,
} from "./traits.js";

const seeds = Array.from({ length: 500 }, (_, i) => `user_${i}`);
const distinct = <T>(list: T[], key: (t: T) => unknown) =>
	new Set(list.map(key)).size;

describe("determinism", () => {
	test("same seed gives the same traits and SVG, per look", () => {
		for (const look of LOOKS) {
			for (const s of seeds) {
				expect(pickTraits(s, look)).toEqual(pickTraits(s, look));
				expect(toSVG(s, { look })).toBe(toSVG(s, { look }));
			}
		}
	});

	test("soft is the default look", () => {
		expect(toSVG("user_1")).toBe(toSVG("user_1", { look: "soft" }));
	});

	// Guards trait-version 1: if this changes, existing users' faces changed.
	test("trait set v1 is frozen", () => {
		const fixed = ["user_8f2a", "Ibrahim Hassen", "", "😀"];
		expect(cyrb53("user_8f2a")).toMatchSnapshot();
		for (const look of LOOKS) {
			expect(fixed.map((s) => pickTraits(s, look))).toMatchSnapshot(look);
		}
	});
});

describe("variety", () => {
	test("every soft option is reachable", () => {
		const all = seeds.map((s) => pickTraits(s, "soft") as SoftTraits);
		expect(distinct(all, (t) => t.palette)).toBe(SOFT_PALETTES.length);
		expect(distinct(all, (t) => t.eyes)).toBe(SOFT_EYES.length);
		expect(distinct(all, (t) => t.mouth)).toBe(SOFT_MOUTHS.length);
		expect(distinct(all, (t) => t.cheeks)).toBe(2);
	});

	test("every bold option is reachable", () => {
		const all = seeds.map((s) => pickTraits(s, "bold") as BoldTraits);
		expect(distinct(all, (t) => t.palette)).toBe(BOLD_PALETTES.length);
		expect(distinct(all, (t) => t.eyes)).toBe(BOLD_EYES.length);
		expect(distinct(all, (t) => t.mouth)).toBe(BOLD_MOUTHS.length);
		expect(distinct(all, (t) => t.nose)).toBe(2);
	});

	test("every blob shape is reachable and stays inside the canvas", () => {
		const all = seeds.map((s) => pickTraits(s, "blob") as BlobTraits);
		expect(distinct(all, (t) => t.shape)).toBe(BLOB_SHAPES.length);
		expect(distinct(all, (t) => t.hue)).toBeGreaterThan(200);
		for (const t of all) {
			for (const r of t.radii) expect(r + 50).toBeLessThanOrEqual(100);
		}
	});

	test("every mochi option is reachable", () => {
		const all = seeds.map((s) => pickTraits(s, "mochi") as MochiTraits);
		expect(distinct(all, (t) => t.color)).toBe(MOCHI_COLORS.length);
		expect(distinct(all, (t) => t.eyes)).toBe(EYES.length);
		expect(distinct(all, (t) => t.mouth)).toBe(MOCHI_MOUTHS.length);
		for (const t of all) {
			expect(t.top).toBeGreaterThanOrEqual(25);
			expect(50 + t.width).toBeLessThanOrEqual(100);
		}
	});

	test("every chick option is reachable", () => {
		const all = seeds.map((s) => pickTraits(s, "chick") as ChickTraits);
		expect(distinct(all, (t) => t.color)).toBe(CHICK_COLORS.length);
		expect(distinct(all, (t) => t.eyes)).toBe(EYES.length);
		expect(distinct(all, (t) => t.tuft)).toBe(TUFTS.length);
	});

	test("every jelly option is reachable", () => {
		const all = seeds.map((s) => pickTraits(s, "jelly") as JellyTraits);
		expect(distinct(all, (t) => t.color)).toBe(JELLY_FLAVORS.length);
		expect(distinct(all, (t) => t.eyes)).toBe(EYES.length);
		expect(distinct(all, (t) => t.mouth)).toBe(JELLY_MOUTHS.length);
	});

	test("mulberry32 stays in [0, 1)", () => {
		const r = mulberry32(cyrb53("x"));
		for (let i = 0; i < 1000; i++) {
			const v = r();
			expect(v).toBeGreaterThanOrEqual(0);
			expect(v).toBeLessThan(1);
		}
	});
});

test("SVG is well-formed for every look, with and without depth", () => {
	const parser = new DOMParser();
	for (const look of LOOKS) {
		for (const s of seeds.slice(0, 50)) {
			const depth = s.endsWith("1");
			const doc = parser.parseFromString(
				toSVG(s, { look, depth }),
				"image/svg+xml",
			);
			expect(doc.querySelector("parsererror")).toBeNull();
			expect(doc.documentElement.getAttribute("viewBox")).toBe("0 0 100 100");
		}
	}
});

test("depth shades soft, bold and blob, and leaves the other looks alone", () => {
	for (const look of ["soft", "bold", "blob"] as const) {
		expect(toSVG("user_1", { look })).not.toContain("bk-hi");
		expect(toSVG("user_1", { look, depth: true })).toContain("bk-hi");
	}
	for (const look of ["mochi", "chick", "jelly"] as const) {
		expect(toSVG("user_1", { look, depth: true })).toBe(
			toSVG("user_1", { look }),
		);
	}
});
