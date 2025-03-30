Setting simple redirects in Nuxt is easy. Your choices are either to use `routeRules` or server middleware.

::code-group

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  routeRules: {
    '/foo': { redirect: { to: 'bar', statusCode: 301 } },
  },
})
```

```ts [serverMiddleware.ts]
export default defineEventHandler((e) => {
  if (e.path.startsWith('/foo')) {
    sendRedirect(e, '/bar', 301)
  }
})
```

::

However, redirects get complicated:

- Potential negative SEO when you forget to set them.
- Limited advanced pattern matching for static environments.
- Annoying DX with full Nuxt reload when you modify redirects
- Finding 404s to add redirects for

The Redirects module will solve these problems and more by providing a zero-config solution that feels like magic. It is scheduled for Q1 2025.
