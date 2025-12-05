---
title: Twitter Cards in Nuxt
description: Configure Twitter/X Cards to control how your links appear when shared on Twitter with rich previews, images, and metadata.
image: /og-image/mastering-meta/twitter-cards
keywords:
  - twitter cards
  - twitter meta tags
  - x cards
  - social sharing
  - twitter preview
  - twitter:card
  - twitter:image
navigation:
  title: 'Twitter Cards'
publishedAt: 2024-11-03
updatedAt: 2024-12-05
readTime: 10 mins
---

Twitter ignores most Open Graph tags and requires its own `twitter:*` meta tags for rich link previews. Without them, your links appear as plain text with no image or description.

```vue
<script setup lang="ts">
useSeoMeta({
  twitterCard: 'summary_large_image',
  twitterImage: '/social-preview.jpg',
  twitterTitle: 'Your page title',
  twitterDescription: 'Your page description'
})
</script>
```

## Card Types

Twitter supports four card types via `twitter:card`:

**summary_large_image** - Full-width image preview (1200x630px). Use this for most pages.

```vue
useSeoMeta({
  twitterCard: 'summary_large_image',
  twitterImage: '/preview.jpg' // Minimum 300x157px, aspect ratio 2:1
})
```

**summary** - Small square thumbnail (1:1 aspect ratio). Don't use this unless you specifically want a smaller preview.

```vue
useSeoMeta({
  twitterCard: 'summary',
  twitterImage: '/icon.jpg' // Minimum 144x144px
})
```

**player** - Embedded video/audio player. Requires approval from Twitter.

**app** - Mobile app install prompts. Requires app store URLs and IDs.

Most sites should only use `summary_large_image`.

## Required Tags

These three tags are mandatory for any Twitter Card:

```vue
useSeoMeta({
  twitterCard: 'summary_large_image',
  twitterTitle: 'Page title - 70 characters max',
  twitterImage: 'https://example.com/image.jpg' // Must be absolute URL
})
```

Image requirements:
- Maximum 5MB file size
- Supported formats: JPG, PNG, WEBP, GIF
- `summary_large_image`: 2:1 ratio (1200x630px recommended)
- `summary`: 1:1 ratio (300x300px minimum)
- Must use HTTPS absolute URLs

## Optional Tags

```vue
useSeoMeta({
  twitterCard: 'summary_large_image',
  twitterTitle: 'Your title',
  twitterImage: '/preview.jpg',
  twitterDescription: 'Description text - 200 characters max',
  twitterSite: '@yourhandle', // Your site's Twitter handle
  twitterCreator: '@authorhandle' // Content author's handle
})
```

`twitterDescription` defaults to `og:description` if not set, but specify it to control the exact text Twitter shows.

## Open Graph Fallbacks

Twitter falls back to Open Graph tags when `twitter:*` tags are missing:

| Twitter Tag | Fallback |
|------------|----------|
| `twitter:title` | `og:title` |
| `twitter:description` | `og:description` |
| `twitter:image` | `og:image` |

This won't work:

```vue
// ❌ Twitter will show nothing
useSeoMeta({
  ogTitle: 'My page',
  ogImage: '/image.jpg'
})
```

This works:

```vue
// ✅ Twitter uses og:* tags as fallback
useSeoMeta({
  twitterCard: 'summary_large_image', // Required - no fallback
  ogTitle: 'My page',
  ogImage: '/image.jpg'
})
```

Set both to avoid relying on fallback behavior:

```vue
// ✅ Explicit control
useSeoMeta({
  twitterCard: 'summary_large_image',
  twitterTitle: 'Twitter-specific title (70 chars)',
  twitterImage: '/twitter-preview.jpg',
  ogTitle: 'OpenGraph title can be longer',
  ogImage: '/og-preview.jpg'
})
```

## Testing

Use [Twitter Card Validator](https://cards-dev.twitter.com/validator) to preview your cards before sharing.

The validator caches results. If you update tags and don't see changes:
1. Add a query parameter: `?v=2`
2. Wait 7 days for cache to expire
3. Use a different URL to test

Common issues:

**Image not showing** - Check that:
- URL is absolute with HTTPS
- File size is under 5MB
- Image exists and returns 200 status
- No robots.txt blocking Twitter's bot

**Wrong title/description** - Twitter cached the old version. Add `?v=1` to the URL.

**Card not appearing** - You forgot `twitterCard` meta tag. It has no fallback.

## Per-Page Cards

Set different cards for different pages:

```vue
<!-- ~/pages/blog/[slug].vue -->
<script setup lang="ts">
const { data: post } = await useAsyncData('post', () =>
  queryContent('blog', route.params.slug).findOne())

useSeoMeta({
  twitterCard: 'summary_large_image',
  twitterTitle: post.value.title,
  twitterDescription: post.value.excerpt,
  twitterImage: post.value.coverImage
})
</script>
```

## Good For

✅ Blog posts with feature images
✅ Product pages with product photos
✅ Landing pages with marketing visuals
✅ Documentation with branded images

## Don't Use For

❌ Pages with no images (just omit twitter:image)
❌ Internal tools not meant for sharing
❌ Password-protected content (Twitter can't fetch it)

## Related

- [Open Graph Meta Tags](/learn-seo/nuxt/mastering-meta/open-graph) - Facebook's version of social cards
- [Meta Tag Priorities](/learn-seo/nuxt/mastering-meta/priorities) - Which tags override others
- [Image Optimization](/learn-seo/nuxt/mastering-meta/image-optimization) - Optimizing social preview images
