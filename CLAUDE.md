# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start development server on http://localhost:3000
- `pnpm build` - Build for production (runs `nuxi prepare` and `nuxi build`)
- `pnpm deploy` - Deploy to Netlify with NITRO_PRESET=netlify
- `pnpm lint:docs` - Lint documentation files
- `pnpm lint:docs:fix` - Fix linting issues in documentation
- `pnpm lint` - Run ESLint on the codebase
- `pnpm twoslash:verify` - Verify TypeScript code snippets in documentation

### Dependencies
- `pnpm add <package>` - Add a new dependency
- `pnpm remove <package>` - Remove a dependency
- `pnpm update` - Update dependencies

## Architecture

### Framework Stack
- **Nuxt**: v4.1.2 with compatibility version 4
- **Content**: @nuxt/content v3.7.1 with D1 database (Cloudflare D1 binding)
- **UI**: @nuxt/ui v4.0.0 with Tailwind CSS v4
- **TypeScript**: Full type safety throughout
- **SEO**: @nuxtjs/seo v3.2.2 (the main focus of this documentation site)
- **Package Manager**: pnpm@10.18.0
- **Node**: >= 22.0.0

### Content Organization
Documentation content lives in `/content/` and is fetched via @nuxt/content from a D1 database:
- `/content/learn/` - Educational content about SEO concepts (articles, guides)
- `/content/recipes/` - Implementation guides
- `/content/snippets/` - Code examples and snippets
- `/content/root/` - Special pages (announcements, pro pages)
- Module documentation is dynamically pulled from @nuxtjs/seo package based on `modules` configuration

Module data is sourced from `@nuxtjs/seo/const` and configured in `utils/modules.ts`. Each module has:
- Dynamic routes: `/docs/[slug]/getting-started/introduction`
- Content prefix and collection defined per module

**Content Sources** (`content.config.ts`):
- Module docs use smart sourcing: checks local filesystem first (for development), then falls back to GitHub
- Local paths checked: `../<npm-name>/docs/content`, `../<repo-name>/docs/content`, `~/pkg/<npm-name>/docs/content`
- GitHub fallback: Pulls from `https://github.com/<repo>/docs/content/**/*.md`
- Collections: `nuxtSeo`, `robots`, `sitemap`, `ogImage`, `schemaOrg`, `linkChecker`, `seoUtils`, `siteConfig`, `skewProtection`, `learn`, `recipes`, `snippets`, `root`

### Key Modules Documented
- `nuxt-seo` - Main SEO module
- `robots` - Robots.txt management
- `sitemap` - Sitemap generation
- `og-image` - Open Graph image generation
- `schema-org` - Schema.org structured data
- `link-checker` - Link validation
- `seo-utils` - SEO utilities
- `site-config` - Site configuration

### Deployment
- Primary: Netlify deployment with Cloudflare Pages compatibility
- Database: Cloudflare D1 for content storage
- Analytics: Fathom Analytics (production only)
- OG Images: Zero runtime with custom fonts (Hubot Sans)

### API Integrations
- **GitHub API**: Stars, sponsors, commit data, releases, issue counts, file commits (via Octokit)
- **npm API**: Download statistics for packages
- **Twitter/X API**: Tweet embeds
- **LLMs**: nuxt-llms for AI-powered features with llms.txt support
- **NuxtHub**: Cache, KV storage, and D1 database integration
- **Email Octopus**: Newsletter/waitlist management

### Styling

Use the following CSS variables within tailwind classes to ensure consistency across the application.

Text classes:

- `text-[var(--ui-text)]`: Default text color
- `text-[var(--ui-text-muted)]`: Muted text color
- `text-[var(--ui-text-dimmed)]`: Dimmed text color
- `text-[var(--ui-text-highlighted)]`: Highlighted text color
- `text-[var(--ui-text-accented)]`: Accented text color
- `text-[var(--ui-text-inverted)]`: Inverted text color
- `text-[var(--ui-text-success)]`: Success text color
- `text-[var(--ui-text-error)]`: Error text color
- `text-[var(--ui-text-warning)]`: Warning text color
- `text-[var(--ui-text-info)]`: Info text color
- `text-[var(--ui-text-primary)]`: Primary text color
- `text-[var(--ui-text-secondary)]`: Secondary text color
- `text-[var(--ui-text-gray)]`: Gray text color

Background classes:

- `bg-[var(--ui-bg)]`: Default background color
- `bg-[var(--ui-bg-muted)]`: Muted background color
- `bg-[var(--ui-bg-elevated)]`: Elevated background color
- `bg-[var(--ui-bg-accented)]`: Accented background color
- `bg-[var(--ui-bg-inverted)]`: Inverted background color

Border classes:

- `border-[var(--ui-border)]`: Default border color
- `border-[var(--ui-border-muted)]`: Muted border color
- `border-[var(--ui-border-accented)]`: Accented border color
- `border-[var(--ui-border-inverted)]`: Inverted border color

## Project Structure

### Key Directories
- `/app` - Nuxt application code
  - `/components` - Vue components (auto-imported)
  - `/composables` - Composable functions:
    - `data.ts` - GitHub/npm data fetching (stars, downloads, releases, sponsors)
    - `nav.ts` - Navigation utilities for docs/learn sections
    - `format.ts` - Formatting helpers (dates, numbers, etc.)
    - `module.ts` - Module-specific info and utilities
  - `/layouts` - Page layouts (default, docs, learn, article-simple)
  - `/pages` - File-based routing pages
  - `/utils` - Utility functions
  - `/assets/icons` - Custom icon collection (used with `custom:` prefix)
  - `/css` - Global CSS styles
- `/content` - Markdown content for docs, learn, recipes, snippets
- `/server` - Server-side code
  - `/api` - API endpoints:
    - `/github/[repo]/*` - GitHub data (stars, releases, commits, issues)
    - `/npm/[pkgName]/*` - npm download stats
    - `stats.json` - Aggregated stats (prerendered in production)
    - `feedback*.post.ts` - Feedback and thumbs up/down
    - `pro-waitlist*.post.ts` - Pro waitlist with Email Octopus integration
    - `get-tweet/[tweetId].get.ts` - Twitter/X embed data
  - `/middleware` - Server middleware:
    - `redirects.ts` - Handles URL redirects
    - `markdown.ts` - Markdown processing
  - `/plugins/llms.ts` - LLM configuration for AI features
  - `/utils` - Server utilities
- `/utils/modules.ts` - Shared module configuration (maps @nuxtjs/seo/const to routes and content)

### Important Configuration Files
- `nuxt.config.ts` - Main Nuxt configuration with extensive route rules, module configs, and custom hooks
- `content.config.ts` - Defines content collections and sources (local fs vs GitHub)
- `package.json` - Dependencies and scripts

### Special Features
- **Custom Nitro Hook**: Optimizes Cloudflare `_routes.json` for prerendered pages (in nuxt.config.ts)
- **Route Rules**: Extensive redirect rules for documentation versioning and restructuring
- **Link Checker**: Configured to generate HTML, Markdown, and JSON reports
- **OG Images**: Zero-runtime generation with custom Hubot Sans fonts
- **Content Database**: Uses Cloudflare D1 binding for content storage
