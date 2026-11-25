# Blinky landing page: build handoff

Build the Blinky landing page from the design in `landing-design.dc.html` (next to this file).

## The design file

`landing-design.dc.html` was exported from a design canvas. It is HTML with inline styles, plus:

- `{{ name }}` holes, filled from `renderVals()` in the `<script type="text/x-dc">` block at the bottom.
- `<sc-if value="{{ x }}">` for conditionals and `<sc-for list="{{ xs }}" as="item">` for loops.
- `onClick="{{ fn }}"`, which binds a click handler (React-style).

Treat it as the source of truth for layout, copy, colours, spacing and behaviour. Don't ship the `.dc.html` format itself: rebuild the page as real components.

## Stack

Use this project's existing stack if there is one. Otherwise: Next.js (App Router) + TypeScript + Tailwind CSS. Make only the interactive parts client components.

## Design tokens

| Token    | Value     | Use                                                  |
|----------|-----------|------------------------------------------------------|
| ink      | `#2B2B3A` | dark hero background, body text                      |
| ink-deep | `#232230` | code and command boxes                               |
| ink-card | `#363547` | preview card background                              |
| line     | `#45445A`, `#4A4960` | borders on the dark sections              |
| cream    | `#FFFAF6` | page background, the active pill                     |
| lavender | `#5A48D8` | accent, the call-to-action band                      |
| mist     | `#ECE8FF` | tiles                                                |
| muted    | `#D4CFE0`, `#B3AEC4` (on dark), `#5F5A6B` (on light) | secondary text |
| syntax   | keyword `#B9B0FF`, string `#A8E6C4`, attribute `#B3AEC4`, component `#C9C0FF` | code highlighting |

Fonts, all from Google Fonts:

- Fredoka 600 for headings and the wordmark.
- Inter 400–700 for body text.
- JetBrains Mono for code.

## Build the avatar as a real component first

Write a reusable `<Blinky look status size name />` component in `components/blinky/`. Every face on the page uses it.

- **`look`:** `soft | bold | blob | mochi | chick | jelly`. The SVG paths are the `<symbol>`s at the top of the design file (`soft-base`, `soft-eyes`, and so on). Draw them inline in the component, not with `<use>` references to a global sprite.
- **`status`:** `online | away | offline`.
  - online: eyes blink.
  - away: eyes squash vertically to 0.45 around their centre line, and a "z" appears.
  - offline: eyes squash to 0.12, and the face is desaturated with `saturate(.35)`.
  - The eye centre y for each look is soft 52, bold 42, blob 52, mochi 57, chick 50, jelly 55.
- **Colours:** the base colours come from the CSS vars `--b`, `--s` and `--c`. Derive them from a seeded hash of `name`, so the same name always gets the same colours.
- **Animation:** the hop, sway, doze, blink, breathe and zz keyframes are in the design's `<helmet><style>`. Turn them all off under `prefers-reduced-motion`.

## Sections, top to bottom

1. **Header** on the dark background: logo and wordmark, nav links (Looks, Features, Examples), a divider, and a GitHub link (placeholder URL).
2. **Hero** on the dark background:
   - The h1 "Every user deserves a face." and a full-width description.
   - **Live preview card:** a large animated Blinky with no background behind it, a grid of 6 look buttons (default: soft), and 3 status buttons (online/away/offline). The online face hops with squash and stretch, breathes and blinks. The away face sways and its z floats. The offline face dozes.
   - **Install block:**
     - Package-manager pills (bun/npm/pnpm/yarn, default bun; the active pill is cream with ink text).
     - A command box with a copy button that shows a check mark for 1.4 s after copying.
     - A "your config" row with a framework `<select>` (react/svelte/html, default react) and the file name (Avatar.tsx / Avatar.svelte / index.html).
     - A highlighted code card with its own copy button, then the helper text and a "Browse every look →" link.
     - The code reflects the selected look and status and uses `name="John Doe"`.
     - React: `import { Blinky } from "blinky-avatar/react";` then `<Blinky name look status />`.
     - Svelte: the same, importing from `blinky-avatar/svelte`.
     - HTML: the unpkg script tag and `<blinky-avatar>`.
3. **Looks** ("Six looks, one tag"): 6 cards, each with a floating face, its name and `look="…"`.
4. **Why Blinky** ("Small tag, lots of life"): 4 feature cards: Same name, same face; Alive, not static; Any framework; Nothing to host.
5. **Examples** ("Drop it anywhere a person shows up"):
   - A "Who's here" avatar stack with a "+3" bubble.
   - A comments card from Lena and Arjun.
   - A team list: Sofia Martínez (online), Kenji Tanaka (away), Amara Okafor (offline).
6. **Call-to-action band** in lavender: "Give your users a face", a command pill with a copy button (uses the selected package manager), and a "Get started" button.
7. **Footer.**

## Requirements

- Fluid layout with a 1200px max-width container. It must work at phone width: rows wrap, and code boxes scroll horizontally instead of overflowing.
- Accessibility:
  - Use real `<button>`s with `aria-pressed` on the toggles and `aria-label` on icon-only buttons.
  - Give decorative SVGs `aria-hidden`. Give meaningful faces `role="img"` and a label such as "Sofia, online".
  - Text contrast at least 4.5:1, and touch targets at least 44px.
- Copy uses `navigator.clipboard.writeText`. Fail silently if it is unavailable.
- Don't invent stats, bundle sizes or testimonials.

## Done when

The page matches the design at 1440px and at 390px, every toggle and copy button works, and lint and typecheck pass.
