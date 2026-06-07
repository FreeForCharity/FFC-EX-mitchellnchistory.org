# Template Usage Notes

This repository is already customized for the Mitchell County Historical Society production site:

https://mitchellnchistory.org

Use this document only when you intentionally want to reuse this codebase or the original Free For Charity template patterns for another nonprofit site. Production-facing documentation for this repository should describe `FreeForCharity/FFC-EX-mitchellnchistory.org` and the Mitchell County Historical Society site.

## Current Repository

- Repository: `FreeForCharity/FFC-EX-mitchellnchistory.org`
- Live site: https://mitchellnchistory.org
- GitHub Pages custom domain: `public/CNAME`
- Static export output: `out/`
- Deploy workflow: `.github/workflows/deploy.yml`

## Creating Another Site From This Codebase

1. Create a new repository from the source template or fork this repository.
2. Clone the new repository.
3. Install dependencies with `npm install`.
4. Run `npm run build` to verify the scaffold.
5. Configure GitHub Pages for the new repository.
6. Configure a custom domain, if the new site has one.
7. Replace organization-specific content and documentation.

## Required Content Replacements

When adapting this repository for another organization, update:

- organization name
- domain and canonical URL
- contact information
- social media links
- logos, favicon, and web manifest assets
- team/member data
- event and article content
- policy pages
- metadata and JSON-LD
- GitHub repository links
- CODEOWNERS and maintainer references
- funding or sponsorship links

Useful files to inspect:

- `src/lib/siteConfig.ts`
- `src/app/layout.tsx`
- `src/components/header/`
- `src/components/footer/`
- `src/data/`
- `public/CNAME`
- `.github/FUNDING.yml`
- `.github/CODEOWNERS`
- root documentation files such as `README.md`, `DEPLOYMENT.md`, `SUPPORT.md`, and `CONTRIBUTING.md`

## GitHub Pages and Base Path

For this Mitchell County Historical Society repository, production builds use the custom domain `mitchellnchistory.org`, so `NEXT_PUBLIC_BASE_PATH` should be empty.

For a new repository:

- If GitHub Pages uses a custom domain, leave `NEXT_PUBLIC_BASE_PATH` empty.
- If GitHub Pages uses the default `https://ORG.github.io/REPO/` URL, use `NEXT_PUBLIC_BASE_PATH=/REPO`.

The current deploy workflow detects the active Pages custom-domain setting and chooses the base path automatically. Verify that behavior before hard-coding a base path in a derived repository.

## Suggested GitHub Settings

For a new repository, review:

- Actions permissions
- GitHub Pages source and custom domain
- Dependabot alerts and security updates
- branch protection or rulesets for `main`
- merge queue settings, if used
- CodeQL/code scanning
- repository description and topics
- issue and pull request templates

## Local Verification

After adapting the site, run:

```bash
npm run format:check
npm run lint
npm test
npm run build
npm run test:e2e
```

Preview the static build:

```bash
npm run preview
```

## Current Repo Reminder

Do not reintroduce old template URLs such as `ffcworkingsite1.org` or `freeforcharity.github.io/FFC_Single_Page_Template/` into production-facing docs for this repository. The live site is:

https://mitchellnchistory.org
