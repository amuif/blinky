export interface Pausable extends Element {
	setPaused(paused: boolean): void;
}

// One IntersectionObserver and one visibilitychange listener serve every avatar on the page.
const watched = new Set<Pausable>();
const offScreen = new WeakSet<Element>();
let io: IntersectionObserver | undefined;
let listening = false;

function apply(el: Pausable): void {
	el.setPaused(document.hidden || offScreen.has(el));
}

function onVisibilityChange(): void {
	for (const el of watched) apply(el);
}

function onIntersect(entries: IntersectionObserverEntry[]): void {
	for (const entry of entries) {
		if (entry.isIntersecting) offScreen.delete(entry.target);
		else offScreen.add(entry.target);
		apply(entry.target as Pausable);
	}
}

/** Pauses an avatar's animations while it is off-screen or the tab is in the background. */
export function watch(el: Pausable): void {
	if (!listening) {
		listening = true;
		document.addEventListener("visibilitychange", onVisibilityChange);
		if (typeof IntersectionObserver !== "undefined") {
			io = new IntersectionObserver(onIntersect);
		}
	}
	watched.add(el);
	io?.observe(el);
	apply(el);
}

export function unwatch(el: Pausable): void {
	watched.delete(el);
	offScreen.delete(el);
	io?.unobserve(el);
}
