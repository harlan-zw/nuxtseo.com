---
title: Meta Descriptions in Vue
description: Meta descriptions get rewritten by Google 70% of the time anyway. Here's how to implement them properly in Vue using composables and let your content do the heavy lifting.
navigation:
  title: 'Meta Description'
publishedAt: 2024-11-05
updatedAt: 2024-12-05
readTime: 7 mins
keywords:
  - vue meta description
  - description seo
  - useHead description
  - vue meta tags
---

## Introduction

Meta descriptions don't directly impact rankings, however, they can influence click-through rates by giving users context about your page's content.

```html
<meta name="description" content="Learn how to implement meta descriptions in Vue. Includes reactive content, SEO best practices, and social sharing tips.">
```

Unlike [page titles](/learn-seo/vue/mastering-meta/titles), descriptions have more flexibility but require careful crafting to be effective.

### Quick Tips

1. **They're not essential**: Google often rewrites them [~70% of the time](https://www.searchenginejournal.com/google-rewrites-meta-descriptions-over-70-of-the-time/382140/), pulling from your page content instead.
2. **Length Is Dynamic**: Google's display length changes based on device and query. Focus on clarity over arbitrary character count.
3. **Templates Are Bad**: Using templates for descriptions like "Buy {product} at great prices" is lazy and will hurt click-through rates, summarize using AI tools, if you're short on time.

## Implementation in Vue

In Vue, we use the built-in head package called [Unhead](https://unhead.unjs.io/).

```ts
useSeoMeta({
  description: 'Your description here'
})
```

Or with `useHead()` if you prefer:

```ts
useHead({
  meta: [
    { name: 'description', content: 'Your description here' }
  ]
})
```

## Reactive Descriptions

Use async data with refs for dynamic descriptions:

```vue
<script setup lang="ts">
const post = ref(null)

onMounted(async () => {
  const response = await fetch('/api/post')
  post.value = await response.json()
})

useSeoMeta({
  // computer getter syntax
  description: () => post.value?.description
})
</script>
```

## Open Graph Description `'og:description'`{lang="ts"}

The following social sites are known to use the `og:description` tag for descriptions: Facebook, LinkedIn, Discord, Slack.

Twitter (X) no longer uses the `twitter:description` tag, so it's not worth setting.

```ts
useSeoMeta({
  description: 'Technical description for search',
  ogDescription: 'More casual description for social sharing',
  // Don't bother with Twitter description, it won't be shown
})
```

You can verify your social og descriptions using the following tools:
- Facebook: [Sharing Debugger](https://developers.facebook.com/tools/debug/)
- Twitter: [Card Validator](https://cards-dev.twitter.com/validator)
- LinkedIn: [Post Inspector](https://www.linkedin.com/post-inspector/)

## Using Nuxt?

If you're using Nuxt, check out [Nuxt SEO](/docs/nuxt-seo/getting-started/introduction) which handles much of this automatically.

[Learn more about Meta Descriptions in Nuxt →](/learn-seo/nuxt/mastering-meta/descriptions)
