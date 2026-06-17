# Quick Start Guide

Get the Mitchell County Historical Society site running locally.

## Prerequisites

- Node.js 20.x
- npm
- Git

## Clone the Repository

```bash
git clone https://github.com/FreeForCharity/FFC-EX-mitchellnchistory.org.git
cd FFC-EX-mitchellnchistory.org
```

## Install Dependencies

```bash
npm install
```

## Start Development

```bash
npm run dev
```

Open http://localhost:3000.

## Common Commands

```bash
npm run dev            # Start local dev server
npm run build          # Build static production output
npm run preview        # Preview the built out/ directory
npm run format         # Format files with Prettier
npm run format:check   # Check formatting
npm run lint           # Run ESLint
npm test               # Run Jest tests
npm run test:watch     # Run Jest in watch mode
npm run test:coverage  # Run Jest with coverage
npm run test:e2e       # Run Playwright tests
npm run test:e2e:ui    # Open Playwright UI
npm run check-links    # Check links in the built site
```

## Verify a Local Checkout

Run the same core checks used by CI:

```bash
npm run format:check
npm run lint
npm test
npm run build
```

## Production URL

The live site is:

https://mitchellnchistory.org

The production custom domain is configured through GitHub Pages and `public/CNAME`.

## Project Structure

```text
src/
  app/                  Next.js App Router pages and route folders
  components/           Shared UI components
  data/                 Static JSON content
  lib/                  Site config and utilities
public/                 Static assets and CNAME
tests/                  Playwright tests
__tests__/              Jest tests
.github/workflows/     CI, Lighthouse, deployment, and smoke checks
```

## Key Files

| File                           | Purpose                            |
| ------------------------------ | ---------------------------------- |
| `src/lib/siteConfig.ts`        | Canonical URL and sitemap routes   |
| `src/app/layout.tsx`           | Metadata and global layout         |
| `src/app/page.tsx`             | Homepage entry point               |
| `src/app/home-page/`           | Homepage composition               |
| `src/components/header/`       | Header and navigation              |
| `src/components/footer/`       | Footer                             |
| `next.config.ts`               | Static export and base path config |
| `.github/workflows/deploy.yml` | GitHub Pages deployment            |

## Deployment Notes

For normal production builds, leave `NEXT_PUBLIC_BASE_PATH` empty because the site uses the custom domain `mitchellnchistory.org`.

Only set `NEXT_PUBLIC_BASE_PATH` when intentionally testing a GitHub Pages repository subpath build.

## Troubleshooting

### Port 3000 is already in use

Use another port:

```bash
PORT=3001 npm run dev
```

On Windows PowerShell:

```powershell
$env:PORT=3001
npm run dev
```

### Build fails

Run the checks individually to locate the failure:

```bash
npm run format:check
npm run lint
npm test
npm run build
```

### Playwright fails locally

Install browsers:

```bash
npx playwright install --with-deps chromium
```

Then rerun:

```bash
npm run test:e2e
```

## More Documentation

- [README.md](./README.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [TESTING.md](./TESTING.md)
- [CODE_QUALITY.md](./CODE_QUALITY.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
