# Mitchell County Historical Society Website

Next.js static site for the Mitchell County Historical Society in Mitchell County, North Carolina.

## Live Site

- Production: https://mitchellnchistory.org
- Hosting: GitHub Pages
- Custom domain: `public/CNAME` contains `mitchellnchistory.org`
- Deployment: `.github/workflows/deploy.yml` runs on pushes to `main`

## Project Status

This repository has been customized from the Free For Charity single-page template into a Mitchell County Historical Society site. Some inherited template documentation may still exist in older support files; issue #107 tracks the cleanup of stale template references.

The application includes:

- A Mitchell County Historical Society homepage
- Static routes for museum, membership, events, articles, newsletters, videos, resources, and history features
- Policy pages for privacy, cookies, terms, donation policy, security acknowledgements, and vulnerability disclosure
- GitHub Actions CI, Lighthouse, deployment, and post-deploy smoke workflows
- Jest, Playwright, ESLint, Prettier, and static export checks

## Main Routes

The canonical site URL and sitemap routes are defined in `src/lib/siteConfig.ts`.

Key public routes include:

- `/`
- `/about/`
- `/museum/`
- `/membership/`
- `/events/`
- `/apple-butter-festival/`
- `/contact/`
- `/articles/`
- `/scholarship/`
- `/scan-days/`
- `/penland-cemetery/`
- `/overmountain-men/`
- `/newsletters/`
- `/history-bee/`
- `/red-wilson/`
- `/six-women-six-voices/`
- `/mitchell-county-nc-world-war-inductees/`
- `/mitchell-county-nc-world-war-enlistees/`
- `/videos/`
- `/resources/`

Policy routes include:

- `/cookie-policy/`
- `/donation-policy/`
- `/free-for-charity-donation-policy/`
- `/privacy-policy/`
- `/security-acknowledgements/`
- `/terms-of-service/`
- `/vulnerability-disclosure-policy/`

## Tech Stack

- Next.js App Router with static export
- TypeScript
- Tailwind CSS utilities
- React
- Jest and React Testing Library
- Playwright
- Lighthouse CI
- GitHub Pages

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000.

## Quality Checks

Run the common local checks:

```bash
npm run format:check
npm run lint
npm test
npm run build
```

Run Playwright tests:

```bash
npm run test:e2e
```

Preview a production build locally:

```bash
npm run build
npm run preview
```

## Deployment

The site uses `output: 'export'` in `next.config.ts`, producing static files in `out/`.

The deploy workflow:

1. Runs formatting, linting, unit tests, Playwright, and a Next.js build.
2. Calls GitHub's Pages API to detect whether a custom domain is active.
3. Uses an empty `NEXT_PUBLIC_BASE_PATH` when the custom domain is configured.
4. Falls back to `/${repo_name}` only when there is no custom domain.
5. Uploads `out/` with `actions/upload-pages-artifact`.
6. Deploys with `actions/deploy-pages`.
7. Runs a post-deploy smoke check against the deployed Pages URL.

For more detail, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Important Files

| File                           | Purpose                                                     |
| ------------------------------ | ----------------------------------------------------------- |
| `src/lib/siteConfig.ts`        | Canonical site URL and sitemap routes                       |
| `src/app/layout.tsx`           | Site metadata, global layout, JSON-LD, and global providers |
| `src/app/page.tsx`             | Homepage entry point                                        |
| `src/app/home-page/`           | Homepage section composition                                |
| `src/components/header/`       | Site header/navigation                                      |
| `src/components/footer/`       | Site footer                                                 |
| `src/lib/assetPath.ts`         | Asset path helper for custom-domain and subpath deployments |
| `next.config.ts`               | Static export and base path configuration                   |
| `.github/workflows/deploy.yml` | GitHub Pages deployment workflow                            |

## Documentation

- [QUICK_START.md](./QUICK_START.md) - local setup and common commands
- [DEPLOYMENT.md](./DEPLOYMENT.md) - GitHub Pages deployment details
- [TESTING.md](./TESTING.md) - test strategy and commands
- [CODE_QUALITY.md](./CODE_QUALITY.md) - linting and formatting standards
- [SECURITY.md](./SECURITY.md) - security policy
- [DEPENDABOT.md](./DEPENDABOT.md) - dependency update process

## Template Provenance

This repository was derived from a Free For Charity website template. Template-specific docs such as `TEMPLATE_USAGE.md` and `CONTENT_REPLACEMENT_GUIDE.md` may still be useful for understanding the original scaffold, but production-facing documentation should describe the Mitchell County Historical Society site at https://mitchellnchistory.org.
