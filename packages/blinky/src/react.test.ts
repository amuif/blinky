import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, test } from "vitest";
import { Blinky, type BlinkyProps } from "./react.js";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

function render(props: BlinkyProps): HTMLElement {
	const host = document.createElement("div");
	document.body.append(host);
	act(() => createRoot(host).render(createElement(Blinky, props)));
	const el = host.querySelector("blinky-avatar");
	if (!(el instanceof HTMLElement))
		throw new Error("no <blinky-avatar> rendered");
	return el;
}

afterEach(() => {
	document.body.innerHTML = "";
});

test("renders a registered <blinky-avatar>; seed defaults to name", () => {
	const el = render({ name: "John Doe" });
	expect(el.getAttribute("seed")).toBe("John Doe");
	expect(el.getAttribute("name")).toBe("John Doe");
	expect(el.shadowRoot?.querySelector("svg")).not.toBeNull();
	expect(el.getAttribute("aria-label")).toBe("John Doe");
});

test("maps props to attributes", () => {
	const el = render({
		name: "John Doe",
		seed: "user_1",
		size: 64,
		status: "away",
		look: "chick",
		depth: true,
		animated: false,
		className: "avatar",
	});
	expect(el.getAttribute("seed")).toBe("user_1");
	expect(el.getAttribute("size")).toBe("64");
	expect(el.getAttribute("status")).toBe("away");
	expect(el.getAttribute("look")).toBe("chick");
	expect(el.getAttribute("depth")).toBe("");
	expect(el.getAttribute("animated")).toBe("false");
	expect(el.getAttribute("aria-label")).toBe("John Doe, away");
});

test("depth off and animated on leave the attributes out", () => {
	const el = render({ name: "John Doe", depth: false, animated: true });
	expect(el.hasAttribute("depth")).toBe(false);
	expect(el.hasAttribute("animated")).toBe(false);
});
