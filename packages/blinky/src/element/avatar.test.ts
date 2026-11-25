import { afterEach, describe, expect, test, vi } from "vitest";
import { LOOKS, pickTraits } from "../index.js";
import { renderLayers } from "../parts/face.js";
import { blinkTiming, parseLook, parseSize, parseStatus } from "./avatar.js";

function mount(attrs: Record<string, string>): HTMLElement {
	const el = document.createElement("blinky-avatar");
	for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
	document.body.append(el);
	return el;
}
// happy-dom may serialize empty SVG tags as <x></x>; normalize to <x/>.
const svgOf = (el: HTMLElement) =>
	(el.shadowRoot?.querySelector(".root")?.innerHTML ?? "").replace(
		/<(\w+)([^<>]*)><\/\1>/g,
		"<$1$2/>",
	);

const layers = (seed: string) => renderLayers(pickTraits(seed));

afterEach(() => {
	document.body.innerHTML = "";
});

describe("<blinky-avatar>", () => {
	test("renders the seed's face in its shadow root", () => {
		const el = mount({ seed: "user_8f2a", name: "Ibrahim Hassen" });
		expect(svgOf(el)).toContain("<svg");
		expect(svgOf(el)).toBe(layers("user_8f2a"));
	});

	test("seed falls back to name", () => {
		expect(svgOf(mount({ name: "Ibrahim Hassen" }))).toBe(
			layers("Ibrahim Hassen"),
		);
	});

	test("changing seed re-renders", () => {
		const el = mount({ seed: "a" });
		el.setAttribute("seed", "user_3");
		expect(svgOf(el)).toBe(layers("user_3"));
	});

	test("accessible name comes from name", () => {
		const el = mount({ seed: "a", name: "Ibrahim Hassen" });
		expect(el.getAttribute("role")).toBe("img");
		expect(el.getAttribute("aria-label")).toBe("Ibrahim Hassen");
		expect(mount({ seed: "b" }).getAttribute("aria-label")).toBe("Avatar");
	});

	test("look switches the drawing", () => {
		const el = mount({ seed: "user_3" });
		expect(svgOf(el)).toBe(layers("user_3"));
		for (const look of [
			"bold",
			"blob",
			"mochi",
			"chick",
			"jelly",
			"soft",
		] as const) {
			el.setAttribute("look", look);
			expect(svgOf(el)).toBe(renderLayers(pickTraits("user_3", look)));
		}
	});

	test("depth adds shading to the drawing", () => {
		const el = mount({ seed: "user_3", look: "bold" });
		el.setAttribute("depth", "");
		expect(svgOf(el)).toBe(
			renderLayers(pickTraits("user_3", "bold"), { depth: true }),
		);
		el.setAttribute("depth", "false");
		expect(svgOf(el)).toBe(renderLayers(pickTraits("user_3", "bold")));
	});

	test("unknown look warns and falls back to soft", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		expect(parseLook("fancy")).toBe("soft");
		expect(parseLook("jelly")).toBe("jelly");
		expect(warn).toHaveBeenCalledOnce();
		warn.mockRestore();
	});

	test("size sets the rendered size", () => {
		const el = mount({ seed: "user_0", size: "lg" });
		expect(el.style.getPropertyValue("--_size")).toBe("96px");
		el.setAttribute("size", "xs");
		expect(el.style.getPropertyValue("--_size")).toBe("24px");
	});

	test("fires avatar-ready once", () => {
		const onReady = vi.fn();
		document.addEventListener("avatar-ready", onReady);
		const el = mount({ seed: "a" });
		el.remove();
		document.body.append(el);
		document.removeEventListener("avatar-ready", onReady);
		expect(onReady).toHaveBeenCalledTimes(1);
	});
});

describe("parseSize", () => {
	test("presets, pixels and fallback", () => {
		expect(parseSize(null)).toBe(48);
		expect(parseSize("sm")).toBe(32);
		expect(parseSize("40")).toBe(40);
		expect(parseSize("40px")).toBe(40);
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		expect(parseSize("huge")).toBe(48);
		expect(parseSize("0")).toBe(48);
		expect(warn).toHaveBeenCalledTimes(2);
		warn.mockRestore();
	});
});

describe("states", () => {
	test("every look has shut eyes for sleeping states", () => {
		for (const look of LOOKS) {
			expect(renderLayers(pickTraits("user_3", look))).toMatch(
				/class="layer closed">.*part="eyes-closed"/,
			);
		}
	});

	test("status is announced in the accessible name", () => {
		const el = mount({ seed: "a", name: "Ibrahim Hassen", status: "away" });
		expect(el.getAttribute("aria-label")).toBe("Ibrahim Hassen, away");
		el.setAttribute("status", "offline");
		expect(el.getAttribute("aria-label")).toBe("Ibrahim Hassen, offline");
	});

	test("unknown status warns and behaves as online", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		expect(parseStatus("napping")).toBe("online");
		expect(parseStatus("away")).toBe("away");
		expect(warn).toHaveBeenCalledOnce();
		warn.mockRestore();
	});

	test("blink timing is seeded, 3–6 s, with a negative offset", () => {
		for (let i = 0; i < 200; i++) {
			const t = blinkTiming(`user_${i}`);
			expect(t).toEqual(blinkTiming(`user_${i}`));
			expect(t.duration).toBeGreaterThanOrEqual(3);
			expect(t.duration).toBeLessThan(6);
			expect(t.delay).toBeLessThanOrEqual(0);
			expect(t.delay).toBeGreaterThan(-t.duration);
		}
		const el = mount({ seed: "user_1" });
		const root = el.shadowRoot?.querySelector<HTMLElement>(".root");
		expect(root?.style.getPropertyValue("--_blink")).toBe(
			`${blinkTiming("user_1").duration}s`,
		);
	});
});

describe("shared runtime", () => {
	const paused = (el: HTMLElement) =>
		el.shadowRoot?.querySelector(".root")?.classList.contains("paused");

	test("pauses every avatar while the tab is hidden", () => {
		const a = mount({ seed: "a" });
		const b = mount({ seed: "b" });
		expect(paused(a)).toBe(false);
		Object.defineProperty(document, "hidden", {
			configurable: true,
			value: true,
		});
		document.dispatchEvent(new Event("visibilitychange"));
		expect(paused(a)).toBe(true);
		expect(paused(b)).toBe(true);
		Object.defineProperty(document, "hidden", {
			configurable: true,
			value: false,
		});
		document.dispatchEvent(new Event("visibilitychange"));
		expect(paused(a)).toBe(false);
	});
});
