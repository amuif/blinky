<p align="center">
  <img src="https://blinky.amudiworks.workers.dev/favicon.svg" width="88" height="88" alt="" />
</p>

<h1 align="center">Blinky</h1>

<p align="center">
  Every user deserves a face. Blinky turns any name or ID into a cute character that blinks, breathes and naps.
</p>

<p align="center">
  <a href="https://blinky.amudiworks.workers.dev">Live demo</a> ·
  <a href="packages/blinky/README.md">Package docs</a>
</p>

---

```html
<script type="module" src="https://unpkg.com/blinky-avatar"></script>

<blinky-avatar name="Amara Okafor" status="online"></blinky-avatar>
```

Six looks (`soft`, `bold`, `blob`, `mochi`, `chick`, `jelly`), three presence states, React and Svelte wrappers, and a `toSVG()` export for static images. Full usage is in the [package README](packages/blinky/README.md).

## Repository

This is a pnpm workspace run with Turborepo.

| Path              | What it is                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| `packages/blinky` | The `blinky-avatar` package: the web component, React and Svelte wrappers, and `toSVG()`.        |
| `apps/landing`    | The landing page (Svelte 5, Vite, [ui-sdk](https://ui-sdk.dev)), deployed to Cloudflare Workers. |
| `apps/bench`      | Playwright performance budgets: 500 avatars rendering, idle CPU and frame rate.                  |
| `docs`            | The landing page design, exported from the design canvas.                                        |

## Development

Needs Node 24 and pnpm (the version is pinned in `package.json`).

```bash
pnpm install
pnpm dev          # package playground
pnpm landing      # landing page at http://localhost:5173
```

| Command          | What it runs                                                                                             |
| ---------------- | -------------------------------------------------------------------------------------------------------- |
| `pnpm build`     | Builds every package and app.                                                                            |
| `pnpm test`      | Unit tests (Vitest).                                                                                     |
| `pnpm typecheck` | TypeScript and svelte-check.                                                                             |
| `pnpm lint`      | Biome lint and format check. `pnpm format` fixes what it can.                                            |
| `pnpm size`      | Checks the package against its 10 kB gzipped budget.                                                     |
| `pnpm bench`     | Performance budgets in Chromium (run `pnpm --filter bench exec playwright install chromium` once first). |

CI runs all of these on every push and pull request.

## Releasing

Releases use [Changesets](https://github.com/changesets/changesets).

1. Run `pnpm changeset` and describe the change.
2. Push to `main`. The Release workflow opens a "Version Packages" pull request.
3. Merging that pull request publishes to npm. This needs an `NPM_TOKEN` repository secret.

## Deploying the landing page

The landing page is static and deploys with the [`cf` CLI](https://developers.cloudflare.com/cf/):

```bash
cd apps/landing
pnpm build
cf deploy dist
```

## License

MIT
