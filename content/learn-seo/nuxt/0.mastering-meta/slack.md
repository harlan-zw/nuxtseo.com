---
title: Slack Link Previews in Nuxt
description: Configure Open Graph meta tags for Slack unfurl previews
navigation:
  title: 'Slack'
publishedAt: 2024-11-03
updatedAt: 2024-12-05
readTime: 10 mins
keywords:
  - slack unfurl
  - slack link preview
  - slack meta tags
  - open graph slack
  - slack preview testing
---

Slack unfurls use Open Graph tags to generate link previews. No special Slack-specific tags needed—just standard OG meta.

```vue
<script setup lang="ts">
useSeoMeta({
  ogTitle: 'Dashboard Analytics',
  ogDescription: '847 active users, 12.4% conversion rate',
  ogImage: 'https://app.example.com/og/dashboard.png',
  ogUrl: 'https://app.example.com/dashboard'
})
</script>
```

Slack reads these four tags. Skip `ogUrl` if you want—Slack fills it automatically from the shared link.

## Image Requirements

Slack displays images at 360x200px in chat, 1200x600px on click. Your OG image should be at least 1200x630px.

```ts
useSeoMeta({
  ogImage: 'https://example.com/og-image.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'Dashboard showing 847 active users'
})
```

Width/height tags help Slack allocate space before download. Alt text appears if image fails.

## What Slack Ignores

Slack doesn't care about:
- Twitter Card tags (use those for Twitter/X, not Slack)
- `og:type` unless you're sharing video/audio
- `og:locale`
- `article:*` tags
- Schema.org markup

Don't waste time on tags Slack won't read.

## ✅ Good for

- SaaS dashboards shared in team channels
- Blog posts in company Slack
- Support docs linked in tickets
- Product pages shared with customers

## ❌ Don't use for

- Internal tools behind auth (Slack can't access them)
- Pages with dynamic content (Slack caches aggressively)
- Personalized URLs (everyone sees same preview)

## Testing

Slack caches unfurls for 30+ days. Testing is painful.

**Option 1: URL parameters**
```
https://example.com/page?v=2
```
Different URL = fresh cache. Increment `v` each test.

**Option 2: Slack Unfurl Tester**
Visit `slack.com/apps/YOUR_APP_ID/event-subscriptions` if you have a Slack app. No app? Use URL parameters.

**Option 3: Share in DM with yourself**
Type `/unfurl reset https://example.com/page` in any channel. Doesn't always work.

## Common Issues

**Image not showing**: Check image size (must be under 5MB), format (PNG/JPG/GIF only), and SSL (HTTPS required). Slack rejects images > 5MB silently.

**Wrong description**: Slack reads `og:description`, not meta description. Set both:

```ts
useSeoMeta({
  description: 'For search engines',
  ogDescription: 'For Slack/social previews'
})
```

**Old preview stuck**: Slack's cache is aggressive. Only fix is URL parameters or waiting 30+ days.

**Preview shows but no image**: Your `og:image` URL probably redirects. Slack doesn't follow redirects for images. Use direct image URLs.

## Authenticated Pages

Slack's crawler can't log in. Pages behind auth show generic unfurls.

Options:
1. Generate preview pages at public URLs
2. Use signed URLs that expire
3. Accept generic unfurls for private content

Most SaaS apps do option 3. Not worth engineering effort.

## Dynamic Content

Slack caches the first unfurl for 30+ days. Users sharing `example.com/dashboard` all see the same preview, even if dashboard data differs.

Generate unique URLs if previews should differ:
```
example.com/dashboard?user=alice
example.com/dashboard?user=bob
```

Overkill for most cases. Static previews work fine.

## Related

- [Open Graph Tags](/learn-seo/nuxt/mastering-meta/open-graph)
- [Twitter Cards](/learn-seo/nuxt/mastering-meta/twitter-cards)
- [Social Media Images](/learn-seo/nuxt/mastering-meta/social-images)
