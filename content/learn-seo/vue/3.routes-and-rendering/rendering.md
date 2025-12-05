---
title: 'Rendering Modes in Vue: SPA, SSR, SSG'
description: 'How SPA, SSR, and SSG affect Google indexing. Which mode to use and when.'
navigation:
  title: 'Rendering Modes'
publishedAt: 2024-10-25
updatedAt: 2024-12-05
---

Google can render JavaScript. But it's slower and less reliable than HTML. Choose the wrong rendering mode and your content might not get indexed.

## Rendering Modes in Vue

Vue applications support three main rendering strategies:

**SPA (Single Page Application)** - JavaScript renders everything client-side
**SSR (Server-Side Rendering)** - Server sends HTML, JavaScript hydrates
**SSG (Static Site Generation)** - Pre-render HTML at build time

## SPA: Client-Side Rendering

Default behavior for Vue + Vite projects.

```ts
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
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

Server generates HTML on each request. Use Vite SSR or framework solutions like Quasar.

**Basic Vite SSR setup:**

```ts
// server.js
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

app.get('*', async (req, res) => {
  const app = createSSRApp({
    // your app
  })
  const html = await renderToString(app)
  res.send(`
    <!DOCTYPE html>
    <html>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
  `)
})
```

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

HTML generated once at build time. Use tools like VitePress or Vite SSG plugin.

**Vite SSG example:**

```ts
import vue from '@vitejs/plugin-vue'
// vite.config.ts
import { defineConfig } from 'vite'
import ViteSSG from 'vite-ssg'

export default defineConfig({
  plugins: [
    vue(),
    ViteSSG({
      routes: [
        { path: '/', component: Home },
        { path: '/blog/:slug', component: BlogPost }
      ]
    })
  ]
})
```

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
- Sites with 10,000+ dynamic pages

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
Your builds will time out. Use SSR instead.

**Mistake 4: Not testing the output**
Always verify with Search Console. Your local dev server lies.

## Default Recommendation

For content-heavy sites that need SEO:
- Use **SSG** (VitePress, Vite SSG) for blogs, docs, marketing
- Use **SSR** (Vite SSR, Quasar) for dynamic, frequently updated content
- Use **SPA** only for authenticated apps or internal tools

Avoid SPA for anything you want Google to index quickly.

## Using Nuxt?

If you're using Nuxt, check out [Nuxt SEO](/docs/nuxt-seo/getting-started/introduction) for built-in SEO features. Nuxt provides sophisticated rendering controls with `routeRules`, hybrid rendering, and ISR (Incremental Static Regeneration).

[Learn more in Nuxt →](/learn-seo/nuxt/routes-and-rendering/rendering)
