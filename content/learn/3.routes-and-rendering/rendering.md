---
title: 'Rendering Modes: SPA, SSR, SSG'
description: 'How SPA, SSR, and SSG affect Google indexing. Which mode to use and when.'
navigation:
  title: 'Rendering Modes'
---

Google can render JavaScript. But it's slower and less reliable than HTML. Choose the wrong rendering mode and your content might not get indexed.

## Rendering Modes in Nuxt

Nuxt supports three core modes plus hybrid combinations:

**SPA (Single Page Application)** - JavaScript renders everything client-side
**SSR (Server-Side Rendering)** - Server sends HTML, JavaScript hydrates
**SSG (Static Site Generation)** - Pre-render HTML at build time
**Hybrid** - Mix modes per route

## SPA: Client-Side Rendering

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  ssr: false
})
```

Google's crawler downloads JavaScript, waits for execution, then indexes. This adds 5-10 seconds to indexing time.

✅ **Good for:**
- Internal dashboards
- Apps behind authentication
- Content that shouldn't be indexed

❌ **Don't use for:**
- Marketing pages
- Blog posts
- Product catalogs
- Anything you want in Google

**Common mistake:** Launching a SPA site expecting Google to index it immediately. You'll wait weeks longer than SSR.

## SSR: Server-Side Rendering

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  ssr: true // Default in Nuxt
})
```

Server generates HTML on each request. Google gets immediate content.

✅ **Good for:**
- Dynamic content (user profiles, dashboards)
- Personalized pages
- Real-time data
- Content updated frequently

❌ **Don't use for:**
- Static blogs (SSG is faster)
- Documentation (SSG is cheaper)
- Landing pages (SSG serves faster)

**Performance note:** SSR requires server compute on every request. SSG serves from CDN.

## SSG: Static Site Generation

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ['/blog', '/docs']
    }
  }
})
```

HTML generated once at build time. Blazing fast delivery.

✅ **Good for:**
- Blogs
- Documentation
- Marketing pages
- Product catalogs
- Content updated daily or less

❌ **Don't use for:**
- User-specific content
- Real-time dashboards
- Content changing hourly
- 10,000+ pages (build times get painful)

**Build consideration:** A site with 50,000 routes might take 30+ minutes to build. SSR handles this better.

## Hybrid: Per-Route Configuration

Mix modes based on route needs:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  routeRules: {
    // Prerender static content
    '/blog/**': { prerender: true },
    '/docs/**': { prerender: true },

    // SSR for dynamic content
    '/user/**': { ssr: true },
    '/dashboard/**': { ssr: true },

    // SPA for auth-only sections
    '/admin/**': { ssr: false },

    // Incremental Static Regeneration
    '/products/**': {
      swr: 3600 // Revalidate every hour
    }
  }
})
```

**SWR (Stale-While-Revalidate):** Serve cached HTML, rebuild in background. Best of SSG speed + SSR freshness.

## Verifying What Google Sees

Don't guess. Check what Googlebot actually received:

**1. Google Search Console URL Inspection**

- Go to URL Inspection tool
- Enter your URL
- Click "Test Live URL"
- View "Screenshot" and "HTML" tabs

If the HTML tab shows `<div id="app"></div>` with no content, Google isn't seeing your page.

**2. View Page Source**

Right-click page > "View Page Source" (not Inspect Element)

✅ **Good:** Full content in HTML
❌ **Bad:** Empty div with JavaScript

**3. Fetch as Google**

```bash
curl -A "Mozilla/5.0 (compatible; Googlebot/2.1)" https://yoursite.com
```

Should return complete HTML with content.

## Common Mistakes

**Mistake 1: Using SPA for a blog**
You're making Google work 10x harder. SSG renders in milliseconds.

**Mistake 2: SSR for static documentation**
Why run server compute for content that never changes? SSG is free to serve.

**Mistake 3: SSG for 100,000 product pages**
Your builds will time out. Use SSR or ISR.

**Mistake 4: Forgetting route rules**
Nuxt defaults to SSR. Set explicit rules so builds don't try pre-rendering your entire site.

**Mistake 5: Not testing the output**
Always verify with Search Console. Your local dev server lies.

## Default Recommendation

Start here:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },
    '/blog/**': { prerender: true },
    '/docs/**': { prerender: true },
    '/**': { ssr: true } // Everything else
  }
})
```

Adjust based on your content update frequency.

::read-more
---
title: Route Rules
to: /docs/nuxt-seo/guides/route-rules
---
::

::read-more
---
title: Pre-rendering
to: https://nuxt.com/docs/getting-started/prerendering
target: _blank
---
::
