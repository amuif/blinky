import { renderLayers } from "../parts/face.js";
import { type Pausable, unwatch, watch } from "../runtime/visibility.js";
import { cyrb53 } from "../seed/random.js";
import { LOOKS, type Look, pickTraits } from "../seed/traits.js";

export const SIZES = { xs: 24, sm: 32, md: 48, lg: 96 } as const;
export const STATUSES = ["online", "away", "offline"] as const;
export type Status = (typeof STATUSES)[number];

// Motion is CSS keyframes on transform/opacity only, so idle avatars cost no JS per frame.
// Default rules are the online state; other states override them.
const CSS = `
:host {
  display: inline-block;
  vertical-align: middle;
  width: var(--_size, 48px);
  height: var(--_size, 48px);
  /* No rounded overflow clip: the body is already a circle, and clipping animated
     layers to a radius costs a mask per layer per frame (≈30 fps → 60 fps in the bench). */
  contain: strict;
  transition: transform .2s ease;
}
:host([hidden]) { display: none; }
:host(:hover) { transform: scale(1.05); }
.root { position: relative; width: 100%; height: 100%; transition: filter .2s ease; }
.layer { position: absolute; inset: 0; display: block; width: 100%; height: 100%; }
/* Lids and blinks squash around each look's eye line (see EYE_LINE in parts/face.ts). */
.lids, .blink { transform-origin: 50% 52%; }
:host([look="bold"]) .lids, :host([look="bold"]) .blink { transform-origin: 50% 42%; }
:host([look="mochi"]) .lids, :host([look="mochi"]) .blink { transform-origin: 50% 57%; }
:host([look="chick"]) .lids, :host([look="chick"]) .blink { transform-origin: 50% 50%; }
:host([look="jelly"]) .lids, :host([look="jelly"]) .blink { transform-origin: 50% 55%; }
.face { animation: blinky-breathe 4s ease-in-out infinite; }
.blink { animation: blinky-blink var(--_blink, 4s) var(--_blink-delay, 0s) infinite; }
.lids { transition: transform .2s ease, opacity .2s ease; }
.z { opacity: 0; }
/* Asleep (away, offline): the open eyes give way to shut ones. */
.closed { opacity: 0; transition: opacity .2s ease; }
:host(:is([status="away"], [status="offline"])) .lids { opacity: 0; }
:host(:is([status="away"], [status="offline"])) .closed { opacity: 1; }

:host([status="away"]) .face { animation-duration: 6s; }
:host([status="away"]) .blink { animation: none; }
:host([status="away"]) .z { animation: blinky-z 3s ease-out infinite; }

:host([status="offline"]) .face, :host([status="offline"]) .blink { animation: none; }
:host([status="offline"]) .root { filter: saturate(.35); }

.paused * { animation-play-state: paused !important; }
:host([animated="false"]) { transition: none; transform: none; }
:host([animated="false"]) .root * { animation: none !important; transition: none !important; }
@media (prefers-reduced-motion: reduce) {
  :host { transition: none; transform: none !important; }
  .root * { animation: none !important; transition: none !important; }
}

@keyframes blinky-breathe { 50% { transform: translateY(-2%); } }
@keyframes blinky-blink { 0%, 95%, 100% { transform: scaleY(1); } 97.5% { transform: scaleY(.1); } }
@keyframes blinky-z {
  0% { opacity: 0; transform: translate(0, 0); }
  30% { opacity: 1; }
  100% { opacity: 0; transform: translate(6%, -8%); }
}
`;

// One stylesheet and one SVG cache shared by every avatar on the page.
let sheet: CSSStyleSheet | undefined;
const svgCache = new Map<string, string>();

function faceFor(seed: string, look: Look, depth: boolean): string {
	const key = `${look}|${depth ? 1 : 0}|${seed}`;
	let svg = svgCache.get(key);
	if (svg === undefined) {
		svg = renderLayers(pickTraits(seed, look), { depth });
		svgCache.set(key, svg);
	}
	return svg;
}

/** Seeded blink timing: every 3–6 s, offset so a crowd never blinks in unison. */
export function blinkTiming(seed: string): { duration: number; delay: number } {
	const h = cyrb53(seed, 1);
	const duration = 3 + (h % 3000) / 1000;
	return {
		duration,
		delay: -((Math.floor(h / 3000) % 6000) / 1000) % duration,
	};
}

const warned = new Set<string>();
function warnOnce(msg: string): void {
	if (warned.has(msg)) return;
	warned.add(msg);
	console.warn(`[blinky] ${msg}`);
}

/** Parses the size attribute into pixels; unknown values warn and fall back to md. */
export function parseSize(value: string | null): number {
	if (value === null || value === "") return SIZES.md;
	if (value in SIZES) return SIZES[value as keyof typeof SIZES];
	const px = /^(\d+(?:\.\d+)?)(px)?$/.exec(value.trim());
	if (px?.[1] && Number(px[1]) > 0) return Number(px[1]);
	warnOnce(
		`unknown size "${value}"; use xs, sm, md, lg or a pixel value. Falling back to md.`,
	);
	return SIZES.md;
}

/** Parses the look attribute; unknown values warn and fall back to soft. */
export function parseLook(value: string | null): Look {
	if (value === null || value === "") return "soft";
	if ((LOOKS as readonly string[]).includes(value)) return value as Look;
	warnOnce(
		`unknown look "${value}"; use ${LOOKS.join(", ")}. Falling back to soft.`,
	);
	return "soft";
}

/** Parses the status attribute; unknown values warn and behave as online. */
export function parseStatus(value: string | null): Status {
	if (value === null || value === "") return "online";
	if ((STATUSES as readonly string[]).includes(value)) return value as Status;
	warnOnce(
		`unknown status "${value}"; use ${STATUSES.join(", ")}. Falling back to online.`,
	);
	return "online";
}

// Lets this module load in Node (for toSVG) where HTMLElement doesn't exist.
const Base = (globalThis.HTMLElement ?? class {}) as typeof HTMLElement;

export class BlinkyAvatar extends Base implements Pausable {
	static observedAttributes = [
		"seed",
		"name",
		"size",
		"status",
		"look",
		"depth",
	];

	#root: HTMLDivElement;
	#rendered = "";
	#ready = false;

	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });
		sheet ??= new CSSStyleSheet();
		if (sheet.cssRules.length === 0) sheet.replaceSync(CSS);
		shadow.adoptedStyleSheets = [sheet];
		this.#root = document.createElement("div");
		this.#root.className = "root";
		shadow.append(this.#root);
	}

	connectedCallback(): void {
		this.#update();
		watch(this);
		if (!this.#ready) {
			this.#ready = true;
			this.dispatchEvent(
				new CustomEvent("avatar-ready", { bubbles: true, composed: true }),
			);
		}
	}

	disconnectedCallback(): void {
		unwatch(this);
	}

	attributeChangedCallback(): void {
		if (this.isConnected) this.#update();
	}

	/** The seed actually used: `seed`, else `name`. */
	get effectiveSeed(): string {
		return this.getAttribute("seed") || this.getAttribute("name") || "";
	}

	/** @internal Called by the shared runtime when off-screen or the tab is hidden. */
	setPaused(paused: boolean): void {
		this.#root.classList.toggle("paused", paused);
	}

	#update(): void {
		const seed = this.effectiveSeed;
		const size = parseSize(this.getAttribute("size"));
		this.style.setProperty("--_size", `${size}px`);

		const depth =
			this.hasAttribute("depth") && this.getAttribute("depth") !== "false";
		const svg = faceFor(seed, parseLook(this.getAttribute("look")), depth);
		if (svg !== this.#rendered) {
			this.#root.innerHTML = svg;
			this.#rendered = svg;
			const { duration, delay } = blinkTiming(seed);
			this.#root.style.setProperty("--_blink", `${duration}s`);
			this.#root.style.setProperty("--_blink-delay", `${delay}s`);
		}

		const name = this.getAttribute("name") || "Avatar";
		const status = this.hasAttribute("status")
			? parseStatus(this.getAttribute("status"))
			: null;
		this.setAttribute("role", "img");
		this.setAttribute("aria-label", status ? `${name}, ${status}` : name);
	}
}

if (globalThis.customElements && !customElements.get("blinky-avatar")) {
	customElements.define("blinky-avatar", BlinkyAvatar);
}

declare global {
	interface HTMLElementTagNameMap {
		"blinky-avatar": BlinkyAvatar;
	}
}
