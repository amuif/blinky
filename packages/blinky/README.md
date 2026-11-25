<p align="center">
  <img src="https://blinky.amudiworks.workers.dev/favicon.svg" width="88" height="88" alt="" />
</p>

<h1 align="center">blinky-avatar</h1>

<p align="center">
  A drop-in web component that turns any name or user ID into a small, cute, animated character.<br />
  One tag, any framework, no images and no server.
</p>

<p align="center">
  <a href="https://blinky.amudiworks.workers.dev">Live demo</a> ·
  <a href="https://github.com/amuif/blinky">GitHub</a>
</p>

---

```html
<blinky-avatar name="Amara Okafor" status="online"></blinky-avatar>
```

- **Same name, same face.** Faces are drawn from a seed, so a person looks the same on every page, device and visit.
- **Alive, not static.** Online avatars blink and breathe, away ones doze with a little "z", offline ones close their eyes and fade.
- **Any framework.** It's a standard custom element, with thin React and Svelte wrappers.
- **Nothing to host.** Drawn as SVG in the browser: no uploads, no image CDN, no network calls.
- **Light.** Zero dependencies and a 10 kB gzipped budget enforced in CI.

## Install

```bash
npm i blinky-avatar      # or: pnpm add / yarn add / bun add
```

Or without a build step:

```html
<script type="module" src="https://unpkg.com/blinky-avatar"></script>
```

## Usage

### HTML

Importing the package registers `<blinky-avatar>` once.

```js
import "blinky-avatar";
```

```html
<blinky-avatar name="Amara Okafor" look="mochi" status="away" size="lg"></blinky-avatar>
```

### React

```tsx
import { Blinky } from "blinky-avatar/react";

export function Avatar() {
	return <Blinky name="Amara Okafor" look="mochi" status="away" size={64} />;
}
```

### Svelte 5

```svelte
<script>
  import { Blinky } from "blinky-avatar/svelte";
</script>

<Blinky name="Amara Okafor" look="mochi" status="away" size={64} />
```

### Vue

Use the element directly, and tell Vue it's a custom element:

```js
// vite.config.js
vue({
	template: {
		compilerOptions: { isCustomElement: (tag) => tag === "blinky-avatar" },
	},
});
```

## Attributes

| Attribute  | Values                                             | Default  | What it does                                                                   |
| ---------- | -------------------------------------------------- | -------- | ------------------------------------------------------------------------------ |
| `name`     | any text                                           | `Avatar` | The accessible label, and the seed when `seed` is not set.                     |
| `seed`     | any text                                           | `name`   | What the face is drawn from. Prefer a stable user ID so faces survive renames. |
| `look`     | `soft` `bold` `blob` `mochi` `chick` `jelly`       | `soft`   | The character style.                                                           |
| `status`   | `online` `away` `offline`                          | none     | Shows presence on the face and adds it to the label ("Amara, away").           |
| `size`     | `xs` (24) `sm` (32) `md` (48) `lg` (96), or pixels | `md`     | Width and height.                                                              |
| `depth`    | present, or `false`                                | off      | A rounded, glossy finish for `soft`, `bold` and `blob`.                        |
| `animated` | `false`                                            | on       | Turns all motion off.                                                          |

The React and Svelte wrappers take the same props, with `size` as a number or name and `depth` and `animated` as booleans. Unknown values log a warning once and fall back to the default.

### Status

| Status    | Face                                         |
| --------- | -------------------------------------------- |
| `online`  | Blinks at a seeded rhythm and breathes.      |
| `away`    | Eyes closed, slow breathing, a floating "z". |
| `offline` | Eyes closed, still, colours faded.           |

## Static SVG

`toSVG` returns the same face as a standalone SVG string, for emails, PDFs, Open Graph images or server rendering. It works in Node.

```js
import { toSVG } from "blinky-avatar";

const svg = toSVG("user_8f2a", { look: "bold" });
```

## Accessibility and performance

- Each avatar has `role="img"` and an accessible name: the `name`, plus the status when set.
- Status is shown by the face itself, never by colour alone.
- All motion stops under `prefers-reduced-motion: reduce`.
- Animation is CSS transforms only, so idle avatars run no JavaScript per frame. Avatars pause while off-screen or when the tab is hidden.
- Blink timing is seeded, so a page full of avatars never blinks in unison.

## Events

`avatar-ready` fires once, bubbling, when an avatar first connects.

## License

MIT
