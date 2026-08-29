# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Project:** FFC_Single_Page_Template — a Free For Charity nonprofit website. The current deployment is the **Mitchell County Historical Society** (`mitchellnchistory.org`), built from the FFC template.

For the broader FFC reference (mission, governance, full agent guidance), see `AGENTS.md`. For Copilot-specific notes, see `.github/copilot-instructions.md`. Project rules live in `.claude/rules/`.

---

## Commands

Tooling: Next.js 16 (App Router) + TypeScript (strict) + Tailwind v4 + Jest + Playwright. Node 20 in CI.

| Command                 | Purpose                                            |
| ----------------------- | -------------------------------------------------- |
| `pnpm install`          | Install dependencies (~17s)                        |
| `pnpm run dev`          | Dev server with Turbopack at `localhost:3000`      |
| `pnpm run build`        | Static export to `out/` (~30s)                     |
| `pnpm run preview`      | Serve `out/` locally (used by Playwright)          |
| `pnpm run format`       | Prettier write                                     |
| `pnpm run format:check` | Prettier check (CI gate)                           |
| `pnpm run lint`         | ESLint over `src __tests__ tests`                  |
| `pnpm test`             | Jest unit + a11y tests                             |
| `pnpm run test:watch`   | Jest watch mode                                    |
| `pnpm run test:e2e`     | Playwright E2E (auto-runs `pnpm run preview`)      |
| `pnpm run smoke`        | Post-deploy smoke against live URL (default prod)  |
| `pnpm run check-links`  | Linkinator over built `out/`                       |
| `pnpm run thumbnails`   | Regenerate article grid thumbnails (after migrate) |

**Run a single Jest test:** `npx jest __tests__/components/Header.test.tsx` or `npx jest -t "renders nav"`. Test files live in `__tests__/` and must match `**/__tests__/**/*.test.{js,ts,tsx}` (see `jest.config.js`).

**Run a single Playwright test:** `pnpm exec playwright test tests/navigation.spec.ts` or `pnpm exec playwright test -g "footer link"`. The `webServer` config builds via `pnpm run preview`, so run `pnpm run build` first if `out/` is stale. Use `pnpm run test:e2e:ui` for the UI runner, `:headed` for headed mode.

**Post-deploy smoke:** `pnpm run smoke` runs `tests/smoke/*.spec.ts` against `https://mitchellnchistory.org` (override with `SMOKE_BASE_URL`). It does not start a local server. The main E2E config ignores `tests/smoke/` so these only run on demand.

**Long commands:** `pnpm install`, `pnpm run build`, and `pnpm run test:e2e` need 180+ second timeouts. Never cancel them — let them finish and read the error if they fail.

---

## Pre-commit Checklist

Husky's `pre-commit` hook runs `format:check` then `lint`. The full CI gate (`.github/workflows/ci.yml`) additionally runs Jest, build, and Playwright. Run them in this order locally before pushing:

```bash
pnpm run format && pnpm run lint && pnpm test && pnpm run build && pnpm run test:e2e
```

If any step fails, fix the issue and re-run from that step forward.

---

## Architecture

### Static export, no server runtime

`next.config.ts` sets `output: 'export'`, `trailingSlash: true`, and `images.unoptimized: true`. There is no API route layer, no middleware, no ISR — every page must render statically at build time. The build emits to `out/` for GitHub Pages.

### Asset path handling (critical)

Sites deploy to two surfaces: a custom domain (no prefix) and `https://freeforcharity.github.io/<repo>/` (subpath prefix). `NEXT_PUBLIC_BASE_PATH` controls Next's `basePath` and `assetPrefix` (`next.config.ts`). **Do not hardcode `/Images/...` or other absolute asset paths.** Always use:

```tsx
import { assetPath } from '@/lib/assetPath'
;<img src={assetPath('/Images/hero.jpg')} alt="..." />
```

`<img>` with `assetPath()` is the correct pattern for static export — `next/image` has limitations and ESLint warnings about `<img>` here are expected.

The CI build does **not** set `NEXT_PUBLIC_BASE_PATH` (Playwright runs against an unprefixed build). Only the deploy workflow detects and applies the base path.

### Routing & content

- App Router pages live under `src/app/<route>/page.tsx`. Route folder names **must be kebab-case** (`about-mitchell-county/`, not `aboutMitchellCounty/`) — SEO requirement per Google Search Central.
- The home route (`src/app/page.tsx`) re-exports `src/app/home-page` rather than rendering inline.
- The static site map is the union of `sitemapRoutes` in `src/lib/siteConfig.ts` plus per-article routes from `src/data/articles.ts`. **Adding a top-level page requires adding both the `src/app/<route>/` folder and an entry in `sitemapRoutes`.**
- `src/app/sitemap.ts` and `src/app/robots.ts` generate SEO files at build time. JSON-LD organization data is inlined in `src/app/layout.tsx` via `src/lib/jsonLd.ts`.
- Path alias: `@/*` → `src/*` (see `tsconfig.json`).

### Content pipeline (WordPress migration)

Articles are not authored in the repo. They are migrated from the legacy WordPress site by `scripts/migrate-wp-content.mjs` (fetches `wp-json/wp/v2`) into `src/data/articles/*.json`, which is gitignored from ESLint and consumed by `src/data/articles.ts` with in-memory caches. After adding articles, run `pnpm run thumbnails` to (re)generate the 480px WebP grid thumbnails under `public/thumbnails/` — these are committed and consumed by `thumbnailSrc()` on the articles hub; a Jest guard fails if any local featured image lacks one. WordPress HTML is rendered through `src/lib/sanitizeHtml.ts`, which:

- Allowlists tags/attributes via `sanitize-html`
- Whitelists iframe hosts (YouTube, Anchor.fm)
- Rewrites old WP permalinks (`/YYYY/MM/DD/slug/`) to `/articles/slug/`
- Strips known tracking pixels
- Forces `rel="noopener noreferrer"` on `target="_blank"` links

Any new rendering of WP-derived HTML must go through `sanitizeHtml()`.

### Layout chrome

`src/app/layout.tsx` is the single root layout: it loads the site's Google Fonts via `src/lib/fonts.ts` (CSS variables — Open Sans, Lato, Faustina after the July 2026 audit), wires `<Header>`, `<Footer>`, `<CookieConsent>`, `<GoogleTagManager>`, and emits the JSON-LD organization script. Metadata defaults (title template, OpenGraph, Twitter, manifest, icons) are defined here and inherited by all pages — override per-page via the `metadata` export.

### Components & data

- `src/components/<feature>/` — feature-grouped React components (PascalCase filenames).
- `src/data/` — the typed content module `articles.ts` plus its backing JSON under `src/data/articles/`.
- `src/lib/` — utilities: `assetPath`, `fonts`, `formatDate`, `imageUrl`, `jsonLd`, `sanitizeHtml`, `siteConfig`, `feed`.

### Styling

Tailwind v4 with **CSS-based config** (no `tailwind.config.*` file). Global styles in `src/app/globals.css`. PostCSS plugin set in `postcss.config.mjs`.

### Testing layout

- Unit/a11y tests in `__tests__/` (Jest + Testing Library + `jest-axe`). `jest.setup.js` extends `jest-dom` and `jest-axe`, and silences the known Next.js `<Link>` `act()` warning.
- Coverage thresholds (`jest.config.js`) are a ratchet set just below measured coverage (~35–40%); `collectCoverage` is on so `pnpm test` enforces them. Raise as coverage grows; never lower without discussion.
- E2E tests in `tests/` (Playwright). Config tries system Chromium via `which` before falling back to Playwright's bundled browser (helpful in restricted/sandboxed envs).

---

## Conventions

- **Branches:** Never commit to `main`. Branch from `main`, open a PR, merge via the merge queue.
- **Commit messages:** Conventional Commits — `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`. Enforced by `commitlint.config.js`.
- **PRs:** Link issues with `Fixes #NNN` or `Refs #NNN`.
- **Route folders:** kebab-case only.
- **Component files:** PascalCase.
- **Secrets:** Never in code, comments, or commits. Workflows must use `${{ secrets.* }}` and validate presence before use. See `.claude/rules/01-security.md`.

---

## Tool Usage Notes

- Prefer the Edit tool over `sed`/`awk`. Always Read a file before editing.
- Prefer Grep/Glob over shelling out to `grep`/`find`/`rg`.
- MCP servers, when available: **GitHub** (issues/PRs), **Playwright** (browser automation), **Cloudflare** (DNS/Pages), **Sentry** (errors). Prefer them over CLI equivalents for that domain.
- Custom agents in `.claude/agents/` (e.g. `dns-audit`, `site-health`, `pr-reviewer`) — invoke when the task matches.
