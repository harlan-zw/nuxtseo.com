---
title: URL Structure for SEO in Nuxt
description: How URL paths affect search rankings and what to optimize (and what to ignore) in your Nuxt routes.
navigation:
  title: 'Routes'
publishedAt: 2024-10-25
updatedAt: 2024-12-05
---

URLs are a minor ranking factor. Spend 5 minutes on them, not 5 hours. Google reads them, users see them in search results, but obsessing over perfect URLs won't move the needle.

## Readable URLs Win

Compare these two URLs:

```
✅ /blog/nuxt-prerendering-guide
❌ /blog/p?id=847&cat=2&ref=internal
```

The first tells both humans and bots what the page is about. The second is gibberish. Make URLs readable.

## Hyphens Not Underscores

Google treats hyphens as word separators. Underscores are ignored.

```
✅ /performance-optimization
❌ /performance_optimization
```

Nuxt's file-based routing handles this automatically if you name files with hyphens.

## URL Length

Shorter URLs are slightly better for:
- User sharing (easier to copy/paste)
- Search result display (don't get truncated)
- Technical crawling (minimal impact)

But don't sacrifice clarity. `/blog/seo-guide` beats `/seo` if it's actually a blog post.

```
✅ /guides/seo-basics
✅ /blog/improving-core-web-vitals
❌ /g/sb
❌ /blog/a-comprehensive-guide-to-improving-your-core-web-vitals-and-page-speed-metrics
```

## Keywords in URLs

Including keywords helps a tiny bit. Keyword stuffing makes you look spammy.

```
✅ /nuxt/prerendering
❌ /nuxt-prerendering-static-site-generation-ssg-prerender-routes
```

If your page title is "Nuxt Prerendering Guide", use `/nuxt-prerendering-guide`. Done. Don't optimize further.

## URL Parameters and Query Strings

Query parameters (`?page=2&sort=date`) create duplicate content issues:

```
/blog
/blog?page=2
/blog?sort=date
/blog?page=2&sort=date
```

Google sees four different URLs for the same content. Pick one canonical URL and stick with it.

**Nuxt file-based routing avoids this by default** - dynamic segments use clean paths:

```
pages/
  blog/
    [slug].vue        → /blog/my-post
    page-[page].vue   → /blog/page-2
```

If you must use query parameters (filters, search), add canonical tags or use `noindex`.

## Dynamic Routes in Nuxt

Dynamic routes work fine for SEO. Google crawls them like any other page.

```
pages/
  blog/
    [slug].vue        → /blog/seo-guide, /blog/web-vitals
  products/
    [category]/
      [id].vue        → /products/electronics/123
```

**Don't use dynamic routes for:**
- Session IDs (`/page?session=abc123`)
- Tracking parameters (`/page?utm_source=twitter`)
- Temporary tokens

These create infinite crawl loops. Use `robots.txt` or `noindex` to block them.

## Nuxt Route Best Practices

Your file structure defines your URLs. Make it semantic:

```
✅ Good structure:
pages/
  blog/
    index.vue              → /blog
    [slug].vue             → /blog/post-name
  docs/
    [category]/
      [page].vue           → /docs/guides/installation

❌ Confusing structure:
pages/
  p/
    [id].vue               → /p/123
  c/
    [cat]/
      i.vue                → /c/electronics/i
```

Use `definePageMeta()` to customize URLs if needed:

```vue
<script setup lang="ts">
definePageMeta({
  path: '/custom-path'
})
</script>
```

## URL Changes and Redirects

Changed a URL? Set up a 301 redirect. Google transfers ranking signals to the new URL.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/old-blog-post': { redirect: '/blog/new-post' },
    '/old-category/**': { redirect: '/new-category/**' }
  }
})
```

Don't skip redirects. Broken links lose traffic and rankings.

## What NOT to Do

❌ **Don't** stuff keywords in every URL segment
❌ **Don't** use uppercase letters (inconsistent, case-sensitive)
❌ **Don't** add dates unless content is time-sensitive (`/2024/01/post`)
❌ **Don't** expose internal IDs (`/products/db-id-847392`)
❌ **Don't** create parameter variations of the same page
❌ **Don't** change URLs without redirects

## Related

- [Sitemap Generation](/docs/sitemap/getting-started/introduction)
- [Canonical URLs](/learn-seo/nuxt/meta-tags/canonical-urls)
- [Redirects and Status Codes](/learn-seo/nuxt/technical-seo/redirects)
