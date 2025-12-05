---
title: URL Structure for SEO in Vue
description: How URL paths affect search rankings and what to optimize (and what to ignore) in your Vue Router routes.
navigation:
  title: 'Routes'
publishedAt: 2024-10-25
updatedAt: 2024-12-05
---

URLs are a minor ranking factor. Spend 5 minutes on them, not 5 hours. Google reads them, users see them in search results, but obsessing over perfect URLs won't move the needle.

## Readable URLs Win

Compare these two URLs:

```
✅ /blog/vue-ssr-guide
❌ /blog/p?id=847&cat=2&ref=internal
```

The first tells both humans and bots what the page is about. The second is gibberish. Make URLs readable.

## Hyphens Not Underscores

Google treats hyphens as word separators. Underscores are ignored.

```
✅ /performance-optimization
❌ /performance_optimization
```

Use hyphens in your route paths and component names.

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
✅ /vue/ssr
❌ /vue-server-side-rendering-ssr-prerender-static-site-generation
```

If your page title is "Vue SSR Guide", use `/vue-ssr-guide`. Done. Don't optimize further.

## URL Parameters and Query Strings

Query parameters (`?page=2&sort=date`) create duplicate content issues:

```
/blog
/blog?page=2
/blog?sort=date
/blog?page=2&sort=date
```

Google sees four different URLs for the same content. Pick one canonical URL and stick with it.

**Vue Router dynamic segments use clean paths:**

```ts
const routes = [
  {
    path: '/blog/:slug',
    component: BlogPost
  },
  {
    path: '/blog/page/:page',
    component: BlogList
  }
]
```

This generates `/blog/my-post` and `/blog/page/2` instead of query parameters.

If you must use query parameters (filters, search), add canonical tags or use `noindex`.

## Dynamic Routes in Vue Router

Dynamic routes work fine for SEO. Google crawls them like any other page.

```ts
const routes = [
  {
    path: '/blog/:slug',
    component: BlogPost
  },
  {
    path: '/products/:category/:id',
    component: Product
  }
]
```

This generates:
- `/blog/seo-guide`, `/blog/web-vitals`
- `/products/electronics/123`

**Don't use dynamic routes for:**
- Session IDs (`/page?session=abc123`)
- Tracking parameters (`/page?utm_source=twitter`)
- Temporary tokens

These create infinite crawl loops. Use `robots.txt` or `noindex` to block them.

## Vue Router Best Practices

Organize your routes semantically:

```ts
✅ Good structure:
const routes = [
  {
    path: '/blog',
    component: BlogList
  },
  {
    path: '/blog/:slug',
    component: BlogPost
  },
  {
    path: '/docs/:category/:page',
    component: DocPage
  }
]

❌ Confusing structure:
const routes = [
  {
    path: '/p/:id',
    component: Post
  },
  {
    path: '/c/:cat/i',
    component: Item
  }
]
```

Use route aliases for custom paths if needed:

```ts
{
  path: '/about',
  component: About,
  alias: '/about-us'
}
```

## URL Changes and Redirects

Changed a URL? Set up a 301 redirect. Google transfers ranking signals to the new URL.

For Vue SPAs, handle redirects in your server configuration (Nginx, Apache, etc.):

```nginx
# Nginx
location /old-blog-post {
  return 301 /blog/new-post;
}
```

Or use Vue Router redirects (client-side only):

```ts
const routes = [
  {
    path: '/old-blog-post',
    redirect: '/blog/new-post'
  }
]
```

**Note:** Client-side redirects don't send proper 301 status codes. Use server-side redirects for SEO.

Don't skip redirects. Broken links lose traffic and rankings.

## What NOT to Do

❌ **Don't** stuff keywords in every URL segment
❌ **Don't** use uppercase letters (inconsistent, case-sensitive)
❌ **Don't** add dates unless content is time-sensitive (`/2024/01/post`)
❌ **Don't** expose internal IDs (`/products/db-id-847392`)
❌ **Don't** create parameter variations of the same page
❌ **Don't** change URLs without redirects

## Related

- [Canonical URLs](/learn-seo/vue/meta-tags/canonical-urls)
- [Redirects and Status Codes](/learn-seo/vue/technical-seo/redirects)

## Using Nuxt?

If you're using Nuxt, check out [Nuxt SEO](/docs/nuxt-seo/getting-started/introduction) for built-in SEO features including automatic sitemap generation, route rules, and file-based routing.

[Learn more in Nuxt →](/learn-seo/nuxt/routes-and-rendering/routes)
