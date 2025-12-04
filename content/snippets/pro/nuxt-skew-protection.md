**Version skew** is a mismatch between your deployed build and the chunks running in user browsers and crawler sessions. It can lead to several issues:

- 🕷️ **Crawlers 404 on stale chunks** - Googlebot requests `_nuxt/builds/abc123.js` which no longer exists post-deploy, logging 500s and potentially impacting indexing
- 💥 **ChunkLoadError in production** - Users mid-session get `Failed to fetch dynamically imported module` when navigating to routes with invalidated chunks
- 🔄 **Delayed rollout** - Your latest release sits unloaded until users hard refresh, sometimes hours or days later

Nuxt's built-in behavior (hard-reload when a new deployment is detected) helps, but in many cases it's [not enough](https://github.com/nuxt/nuxt/issues/29624).

Nuxt Skew Protection solves this with proactive update prompts and persistent build assets across deploys.
