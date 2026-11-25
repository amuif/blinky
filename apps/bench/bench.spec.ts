import { expect, test } from "@playwright/test";

// Budgets from the spec. CI fails if any of these slip.
const BUDGET = {
	perAvatarMs: 1, // first render per avatar, SVG cached
	idleCpu: 0.01, // main-thread busy share with 100 avatars visible
	fps: 55, // 100 avatars animating
};

test("500 avatars in a table render under 1 ms each", async ({ page }) => {
	await page.goto("/?n=500");
	const r = await page.evaluate(
		() =>
			(
				window as unknown as {
					__bench: { renderMs: number; perAvatarMs: number };
				}
			).__bench,
	);
	console.log(
		`render: ${r.renderMs.toFixed(1)} ms total, ${r.perAvatarMs.toFixed(3)} ms each`,
	);
	expect(r.perAvatarMs).toBeLessThan(BUDGET.perAvatarMs);
});

test("100 visible avatars stay under 1% idle CPU", async ({ page }) => {
	await page.goto("/?n=100&grid");
	await page.waitForTimeout(1000);
	const cdp = await page.context().newCDPSession(page);
	await cdp.send("Performance.enable");
	const busy = async () => {
		const { metrics } = await cdp.send("Performance.getMetrics");
		const m = (name: string) =>
			metrics.find((x) => x.name === name)?.value ?? 0;
		return { task: m("TaskDuration"), time: m("Timestamp") };
	};
	const a = await busy();
	await page.waitForTimeout(3000);
	const b = await busy();
	const share = (b.task - a.task) / (b.time - a.time);
	console.log(`idle main-thread share: ${(share * 100).toFixed(2)}%`);
	expect(share).toBeLessThan(BUDGET.idleCpu);
});

test("100 animating avatars hold 60 fps", async ({ page }) => {
	await page.goto("/?n=100&grid");
	await page.waitForTimeout(1000); // measure steady state, not page load
	const fps = await page.evaluate(
		() =>
			new Promise<number>((resolve) => {
				let frames = 0;
				const start = performance.now();
				const tick = (now: number) => {
					frames++;
					if (now - start < 3000) requestAnimationFrame(tick);
					else resolve((frames * 1000) / (now - start));
				};
				requestAnimationFrame(tick);
			}),
	);
	console.log(`fps: ${fps.toFixed(1)}`);
	expect(fps).toBeGreaterThan(BUDGET.fps);
});
