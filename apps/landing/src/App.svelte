<script lang="ts">
import { Button } from "@ui-sdk/svelte/button";
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field";
import { Input } from "@ui-sdk/svelte/input";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@ui-sdk/svelte/navigation-menu";
import {
	ScrollArea,
	ScrollAreaContent,
	ScrollAreaScrollbar,
	ScrollAreaThumb,
	ScrollAreaViewport,
} from "@ui-sdk/svelte/scroll-area";
import {
	SegmentedControl,
	SegmentedControlIndicator,
	SegmentedControlItem,
} from "@ui-sdk/svelte/segmented-control";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@ui-sdk/svelte/select";
import { Separator } from "@ui-sdk/svelte/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@ui-sdk/svelte/tooltip";
import { LOOKS, type Look } from "blinky-avatar";
import Examples from "./Examples.svelte";

type Status = "online" | "away" | "offline";
type Seg = [text: string, cls?: string];

const cmds = {
	bun: "bun add blinky-avatar",
	npm: "npm i blinky-avatar",
	pnpm: "pnpm add blinky-avatar",
	yarn: "yarn add blinky-avatar",
} as const;
type Pm = keyof typeof cmds;
const files = {
	react: "Avatar.tsx",
	svelte: "Avatar.svelte",
	html: "index.html",
} as const;
type Fw = keyof typeof files;
const STATUSES: Status[] = ["online", "away", "offline"];
const motion = { online: "hop", away: "sway", offline: "doze" } as const;
const floats = ["float1", "float2", "float3", "float2", "float1", "float3"];

let pm = $state<Pm>("bun");
let fw = $state<Fw>("react");
let look = $state<Look>("soft");
let status = $state<Status>("online");
let copied = $state<"" | "cmd" | "code" | "cta">("");
let typed = $state("Amara Okafor");
// After the anchor jump (which resets focus), put the cursor in the name box without cancelling the smooth scroll.
const focusName = () =>
	setTimeout(() =>
		document
			.querySelector<HTMLInputElement>("#names input")
			?.focus({ preventScroll: true }),
	);
const who = $derived(typed.trim() || "Blinky");
const samples = [
	"Ana",
	"Anna",
	"Hana",
	"Hanna",
	"Yuki",
	"Yuko",
	"Omar",
	"Amir",
];

const cap = (s: string) => s[0]?.toUpperCase() + s.slice(1);
// The closing script tag is split so it can't end this component's own <script> block.
const END_SCRIPT = `</${"script"}>`;

const code = $derived.by((): Seg[] => {
	const attr = (n: string, v: string): Seg[] => [
		["\n  "],
		[n, "a"],
		["="],
		[`"${v}"`, "s"],
	];
	const attrs = [
		...attr("name", "John Doe"),
		...attr("look", look),
		...attr("status", status),
	];
	if (fw === "html")
		return [
			["<script", "k"],
			[" "],
			["type", "a"],
			["="],
			['"module"', "s"],
			[" "],
			["src", "a"],
			["="],
			['"https://unpkg.com/blinky-avatar"', "s"],
			[`>${END_SCRIPT}`, "k"],
			["\n\n<blinky-avatar"],
			...attrs,
			["\n></blinky-avatar>"],
		];
	const from: Seg[] = [
		["import", "k"],
		[" { Blinky } "],
		["from", "k"],
		[" "],
		[`"blinky-avatar/${fw}"`, "s"],
		[";"],
	];
	const tag: Seg[] = [["\n\n<"], ["Blinky", "c"], ...attrs, ["\n/>"]];
	return fw === "react"
		? [...from, ...tag]
		: [["<script>", "k"], ["\n  "], ...from, ["\n"], [END_SCRIPT, "k"], ...tag];
});
const codeText = $derived(code.map((s) => s[0]).join(""));

let timer: ReturnType<typeof setTimeout> | undefined;
function copy(text: string, key: typeof copied) {
	try {
		navigator.clipboard?.writeText(text).catch(() => {});
	} catch {}
	copied = key;
	clearTimeout(timer);
	timer = setTimeout(() => (copied = ""), 1400);
}
</script>

{#snippet copyButton(text: string, key: typeof copied, label: string)}
	<Tooltip closeOnPress={false}>
		<TooltipTrigger class="copy" aria-label={copied === key ? "Copied" : label} onclick={() => copy(text, key)}>
			{#if copied === key}
				<svg width="20" height="20" viewBox="0 0 24 24" class="done" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>
			{:else}
				<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></svg>
			{/if}
		</TooltipTrigger>
		<TooltipContent>{copied === key ? "Copied" : "Copy"}</TooltipContent>
	</Tooltip>
{/snippet}

{#snippet scroller(label: string, content: import("svelte").Snippet)}
	<ScrollArea class="scroller">
		<ScrollAreaViewport role="region" aria-label={label}>
			<ScrollAreaContent>{@render content()}</ScrollAreaContent>
		</ScrollAreaViewport>
		<ScrollAreaScrollbar orientation="horizontal"><ScrollAreaThumb /></ScrollAreaScrollbar>
	</ScrollArea>
{/snippet}

<div class="topbar">
	<header class="nav">
		<a class="brand" href="#top"><span aria-hidden="true"><blinky-avatar seed="blinky" size="22"></blinky-avatar></span>Blinky</a>
		<NavigationMenu aria-label="Main" class="menu">
			<NavigationMenuList>
				{#each [["#looks", "Looks"], ["#features", "Features"], ["#names", "Names"], ["#context", "Examples"]] as [href, text] (href)}
					<NavigationMenuItem><NavigationMenuLink {href}>{text}</NavigationMenuLink></NavigationMenuItem>
				{/each}
				<NavigationMenuItem class="divider"><Separator orientation="vertical" decorative /></NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink class="gh" href="https://github.com/amuif/blinky" target="_blank" rel="noopener noreferrer">
						<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" /></svg>GitHub
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	</header>
</div>

<div class="dark">
	<section id="top" class="wrap hero">
		<div class="hero-row">
			<div class="hero-main">
				<h1>Every user deserves a face.</h1>
				<p class="lede">
					Blinky turns any name or ID into a cute character that blinks, breathes and naps.<br />
					One tag, any framework, no images or server.
				</p>
			<div class="install">
				<SegmentedControl class="pms" aria-label="Package manager" value={pm} onValueChange={(v) => v && (pm = v as Pm)}>
					<SegmentedControlIndicator />
					{#each Object.keys(cmds) as p (p)}
						<SegmentedControlItem value={p}>{p}</SegmentedControlItem>
					{/each}
				</SegmentedControl>

				<div class="cmd">
					{#snippet cmdText()}<code><span class="prompt">$</span> {cmds[pm]}</code>{/snippet}
					{@render scroller("Install command", cmdText)}
					{@render copyButton(cmds[pm], "cmd", "Copy install command")}
				</div>

				<div class="code">
					{@render copyButton(codeText, "code", "Copy code")}
					{#snippet codeBody()}<pre>{#each code as [t, c]}<span class={c}>{t}</span>{/each}</pre>{/snippet}
					{@render scroller("Code", codeBody)}
				</div>

				<div class="config">
					<Button class="more" onclick={focusName}>
						{#snippet render({ props })}
							<a {...props} href="#names">
								Browse every look<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
							</a>
						{/snippet}
					</Button>
					<div class="config-meta">
						<Select value={fw} onValueChange={(v) => v && (fw = v as Fw)}>
							<SelectLabel class="sr-only">Framework</SelectLabel>
							<SelectTrigger><SelectValue /></SelectTrigger>
							<SelectContent>
								{#each Object.keys(files) as f (f)}
									<SelectItem value={f}>{f === "html" ? "HTML" : cap(f)}</SelectItem>
								{/each}
							</SelectContent>
						</Select>
						<code class="file">{files[fw]}</code>
					</div>
				</div>

				<p class="sr-only" aria-live="polite">{copied ? "Copied to clipboard" : ""}</p>
			</div>
			</div>

			<div class="preview">
				<div class="preview-head">
					<span>{cap(look)} · {status}</span>
				</div>
				<div class="stage">
					{#key status}
						<div class={motion[status]}>
							<blinky-avatar name="John Doe" {look} {status} size="120"></blinky-avatar>
						</div>
					{/key}
				</div>
				<div class="field">
					<span class="label" id="look-label">Look</span>
					<SegmentedControl class="look-grid" aria-labelledby="look-label" value={look} onValueChange={(v) => v && (look = v as Look)}>
						<SegmentedControlIndicator />
						{#each LOOKS as l (l)}
							<SegmentedControlItem value={l} aria-label={cap(l)}>
								<span aria-hidden="true"><blinky-avatar name="John Doe" look={l} size="36" animated="false"></blinky-avatar></span>
							</SegmentedControlItem>
						{/each}
					</SegmentedControl>
				</div>
				<div class="field">
					<span class="label" id="status-label">Status</span>
					<SegmentedControl class="status-grid" aria-labelledby="status-label" value={status} onValueChange={(v) => v && (status = v as Status)}>
						<SegmentedControlIndicator />
						{#each STATUSES as s (s)}
							<SegmentedControlItem value={s}><span class="dot {s}"></span>{cap(s)}</SegmentedControlItem>
						{/each}
					</SegmentedControl>
				</div>
			</div>
		</div>
	</section>
</div>

<main>
	<section id="looks" class="wrap block">
		<div class="head split">
			<div>
				<p class="kicker">Looks</p>
				<h2>Six looks, one tag</h2>
			</div>
			<p class="muted narrow">Pick a look for your whole product. The name picks the colours and the face, so nobody looks the same.</p>
		</div>
		<div class="looks">
			{#each LOOKS as l, i (l)}
				<article class="card">
					<div class={floats[i]}><blinky-avatar name={cap(l)} seed="John Doe" look={l} size="72"></blinky-avatar></div>
					<h3>{cap(l)}</h3>
					<code>look="{l}"</code>
				</article>
			{/each}
		</div>
	</section>

	<section id="features" class="white">
		<div class="wrap block">
			<div class="head">
				<p class="kicker">Why Blinky</p>
				<h2>Small tag, lots of life</h2>
			</div>
			<div class="features">
				<article class="card">
					<div class="art" aria-hidden="true">
						<blinky-avatar seed="Maya" size="44"></blinky-avatar>
						<svg width="20" height="20" viewBox="0 0 24 24" class="eq"><path d="M5 9h14M5 15h14" /></svg>
						<blinky-avatar seed="Maya" size="44"></blinky-avatar>
					</div>
					<h3>Same name, same face</h3>
					<p>Faces come from a seed, so a user looks the same on every page, device and visit.</p>
				</article>
				<article class="card">
					<div class="art">
						{#each STATUSES as s (s)}<blinky-avatar seed="Maya" name={cap(s)} status={s} size="40"></blinky-avatar>{/each}
					</div>
					<h3>Alive, not static</h3>
					<p>Online blinks and breathes, away gets sleepy, offline closes its eyes. Presence you can see.</p>
				</article>
				<article class="card">
					<div class="art">
						{#each ["html", "react", "vue", "svelte"] as f (f)}<span class="chip">{f}</span>{/each}
					</div>
					<h3>Any framework</h3>
					<p>It is a standard web component. If your stack renders HTML, it renders Blinky.</p>
				</article>
				<article class="card">
					<div class="art">
						<span class="tile">
							<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7l8-4 8 4-8 4z" /><path d="M4 12l8 4 8-4" /><path d="M4 17l8 4 8-4" /></svg>
						</span>
					</div>
					<h3>Nothing to host</h3>
					<p>Drawn as SVG in the browser. No image uploads, no CDN of faces, no server calls.</p>
				</article>
			</div>
		</div>
	</section>

	<section id="names">
		<div class="wrap block">
			<div class="head split">
				<div>
					<p class="kicker">Names</p>
					<h2>Your name picks your Blinky</h2>
				</div>
				<p class="muted narrow">The same name always draws the same face and colours. Change one letter and someone new shows up.</p>
			</div>
			<div class="namer">
				<Field class="name-field">
					<FieldLabel>Type a name</FieldLabel>
					<Input bind:value={typed} autocomplete="off" spellcheck="false" maxlength={60} />
					<FieldDescription>Try your own, or a teammate's.</FieldDescription>
				</Field>
				<div class="name-looks">
					{#each LOOKS as l (l)}
						<figure>
							<blinky-avatar name={who} look={l} size="64"></blinky-avatar>
							<figcaption>{l}</figcaption>
						</figure>
					{/each}
				</div>
			</div>
			<div class="name-samples">
				{#each samples as n (n)}
					<figure>
						<blinky-avatar name={n} size="48"></blinky-avatar>
						<figcaption>{n}</figcaption>
					</figure>
				{/each}
			</div>
		</div>
	</section>

	<Examples />

	<section class="cta-wrap">
		<div class="cta">
			<div class="cta-copy">
				<h2>Give your users a face</h2>
				<p>Install it, add one tag, ship it today.</p>
			</div>
			<div class="cta-actions">
				<div class="cta-cmd">
					{#snippet ctaText()}<code>$ {cmds[pm]}</code>{/snippet}
					{@render scroller("Install command", ctaText)}
					{@render copyButton(cmds[pm], "cta", "Copy install command")}
				</div>
				<Button class="btn">
					{#snippet render({ props })}<a {...props} href="#top">Get started</a>{/snippet}
				</Button>
			</div>
		</div>
	</section>
</main>

<footer>
	<Separator />
	<div class="wrap foot">
		<span class="foot-brand"><span aria-hidden="true"><blinky-avatar seed="blinky" size="24" animated="false"></blinky-avatar></span>Blinky · MIT licensed</span>
		<span>Made with soft shapes and big eyes</span>
	</div>
</footer>
