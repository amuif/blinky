import "blinky-avatar";

// ?n=500 rows; 100 distinct users repeat, like a real activity table.
const params = new URLSearchParams(location.search);
const n = Number(params.get("n") ?? 500);
const statuses = ["online", "away", "offline"];

const grid = params.has("grid");
const rows = document.getElementById("rows") as HTMLTableSectionElement;
const t0 = performance.now();
const frag = document.createDocumentFragment();
for (let i = 0; i < n; i++) {
	const u = i % 100;
	const avatar = `<blinky-avatar seed="user_${u}" name="User ${u}" size="sm" status="${statuses[u % 3]}"></blinky-avatar>`;
	if (grid) {
		frag.append(document.createRange().createContextualFragment(avatar));
		continue;
	}
	const tr = document.createElement("tr");
	tr.innerHTML = `<td>${avatar}</td><td>User ${u}</td><td>row ${i}</td>`;
	frag.append(tr);
}
(grid ? (document.getElementById("grid") as HTMLElement) : rows).append(frag);
const renderMs = performance.now() - t0;

const result = { n, renderMs, perAvatarMs: renderMs / n };
(window as unknown as { __bench: typeof result }).__bench = result;
(document.getElementById("result") as HTMLElement).textContent =
	`${n} avatars rendered in ${renderMs.toFixed(1)} ms (${result.perAvatarMs.toFixed(3)} ms each)`;
