import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'

import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'pathe'
import { gray, logger } from './logger'
import { modules } from './utils/modules'

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/seo',
    '@nuxt/ui',
    'motion-v/nuxt',
    // 'nuxt-content-twoslash',
    '@nuxt/content',
    'nitro-cloudflare-dev',
    '@vueuse/nuxt',
    'nuxt-llms',
    'nuxt-skew-protection',
    '@nuxt/scripts',
    '@nuxt/image',
    async (_, nuxt) => {
      nuxt.hooks.hook('nitro:init', (nitro) => {
        // from sponsorkit
        nitro.options.alias.sharp = 'unenv/mock/empty'
        nitro.options.alias.pnpapi = 'unenv/mock/empty' // ?
        nitro.hooks.hook('compiled', async (_nitro) => {
          const routesPath = resolve(nitro.options.output.publicDir, '_routes.json')
          if (existsSync(routesPath)) {
            const routes: { version: number, include: string[], exclude: string[] } = await readFile(routesPath)
              .then(buffer => JSON.parse(buffer.toString()))
            const preSize = routes.exclude.length
            routes.exclude = routes.exclude.filter((path) => {
              if (path.startsWith('/docs') || path.startsWith('/learn')) {
                return false
              }
              if (path.startsWith('/skew-protection') || path.startsWith('/nuxt-seo') || path.startsWith('/experiments') || path.startsWith('/og-image') || path.startsWith('/schema-org') || path.startsWith('/sitemap') || path.startsWith('/robots') || path.startsWith('/site-config') || path.startsWith('/link-checker')) {
                return false
              }
              return true
            })
            if (!routes.exclude.includes('/docs/*')) {
              routes.exclude.push('/docs/*')
            }
            if (!routes.exclude.includes('/learn/*')) {
              routes.exclude.push('/learn/*')
            }
            if (preSize !== routes.exclude.length) {
              logger.info(`Optimizing CloudFlare \`_routes.json\` for prerendered Nuxt SEO ${gray(`(${100 - Math.round(routes.exclude.length / preSize * 100)}% smaller)`)}`)
            }
            await writeFile(routesPath, JSON.stringify(routes, void 0, 2))
          }
        })
      })
    },
  ],

  skewProtection: {
    debug: true,
  },

  sitemap: {
    exclude: [
      '**/.navigation',
      '/__nuxt_content/**',
    ],
    xslColumns: [
      { label: 'URL', width: '100%' },
    ],
  },

  ui: {
    mdc: true,
    content: true,
    theme: {
      colors: [
        'primary',
        'secondary',
        'tertiary',
        'info',
        'success',
        'warning',
        'error',
        'pro',
      ],
    },
  },

  runtimeConfig: {
    emailOctopusToken: '', // NUXT_EMAIL_OCTOPUS_TOKEN
    githubAccessToken: '', // NUXT_GITHUB_ACCESS_TOKEN
    githubAuthToken: '', // NUXT_GITHUB_AUTH_TOKEN
    githubAuthClientId: 'cabace556bd9519d9299', // NUXT_GITHUB_AUTH_CLIENT_ID
    githubAuthClientSecret: '', // NUXT_GITHUB_AUTH_SECRET_ID
  },

  twoslash: {
    floatingVueOptions: {
      classMarkdown: 'prose prose-(--ui-text-muted) dark:prose-invert bg-blue-500',
    },
    // Skip Twoslash in dev to improve performance. Turn this on when you want to explictly test twoslash in dev.
    enableInDev: false,
    // Do not throw when twoslash fails, the typecheck should be down in github.com/nuxt/nuxt's CI
    throws: false,
  },

  fonts: {
    // experimental: {
    //   processCSSVariables: true,
    // },
    families: [
      { name: 'Hubot Sans', provider: 'local', weight: [200, 900], stretch: '75% 125%' },
    ],
  },

  nitro: {
    preset: 'cloudflare-durable',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        vars: {
          NUXT_GITHUB_ACCESS_TOKEN: process.env.NUXT_GITHUB_ACCESS_TOKEN || '',
          NUXT_EMAIL_OCTOPUS_TOKEN: process.env.NUXT_EMAIL_OCTOPUS_TOKEN || '',
          NUXT_GITHUB_AUTH_CLIENT_SECRET: process.env.NUXT_GITHUB_AUTH_CLIENT_SECRET || '',
          NUXT_GITHUB_AUTH_TOKEN: process.env.NUXT_GITHUB_AUTH_TOKEN || '',
        },
        d1_databases: [
          {
            binding: 'DB',
            database_id: '2c8aeceb-8c00-4f9e-b734-ca4bf9174464', // nuxtseo-com
          },
        ],
        kv_namespaces: [
          {
            binding: 'KV',
            id: '24f53b632fbe477188aa0bd4ad81d9db', // nuxtseo-com
          },
          {
            binding: 'CACHE',
            id: '11998f815de7425fa0d524e819bece2c', // nuxtseo-com_cache for nitro cache
          },
        ],
        durable_objects: {
          bindings: [
            {
              name: '$DurableObject',
              class_name: '$DurableObject',
            },
          ],
        },
        migrations: [
          {
            tag: 'v1',
            new_classes: ['$DurableObject'],
          },
        ],
      },
    },
    storage: {
      cache: {
        driver: 'cloudflare-kv-binding',
        binding: 'CACHE',
      },
    },
    experimental: {
      websocket: true,
    },
    prerender: {
      autoSubfolderIndex: false,
      failOnError: false,
      crawlLinks: true,
      routes: ['/', '/404.html'],
    },
  },

  linkChecker: {
    report: {
      // generate both a html and markdown report
      html: true,
      markdown: true,
      json: true,
      publish: true,
    },
  },

  site: {
    url: 'https://nuxtseo.com',
    name: 'Nuxt SEO',
    description: 'Nuxt SEO is a collection of hand-crafted Nuxt Modules to help you rank higher in search engines.',
    tagline: 'All the boring SEO stuff for Nuxt done.',
  },

  imports: {
    autoImport: true,
  },

  typescript: {
    strict: false,
    includeWorkspace: true,
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            light: 'github-light',
            default: 'github-light',
            dark: 'material-theme-palenight',
          },
          langs: [
            'ts',
            'vue',
            'json',
            'html',
            'bash',
            'xml',
            'diff',
            'md',
            'dotenv',
            'yaml',
          ],
        },
      },
    },
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  hooks: {
    'components:extend': function (components) {
      for (const component of components) {
        if (component.pascalName === 'UAlert') {
          component.global = true
        }
      }
    },
  },

  mdc: {
    highlight: {
      noApiRoute: false,
      theme: {
        light: 'github-light',
        default: 'github-light',
        dark: 'material-theme-palenight',
      },
      langs: [
        'ts',
        'vue',
        'json',
        'html',
        'bash',
        'xml',
        'diff',
        'md',
        'dotenv',
        'yaml',
      ],
    },
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Nuxt SEO',
      logo: '/logo.svg',
    },
  },

  $production: {
    routeRules: {
      '/api/stats.json': { prerender: true },
      '/api/github/sponsors.json': { prerender: true },
      '/api/_mdc/highlight': { cache: { group: 'mdc', name: 'highlight', maxAge: 60 * 60 } },
      '/api/_nuxt_icon': { cache: { group: 'icon', name: 'icon', maxAge: 60 * 60 * 24 * 7 } },
    },
    scripts: {
      registry: {
        fathomAnalytics: {
          site: 'KGILBQDV',
        },
      },
    },
  },

  routeRules: {
    // for doc linking purposes
    '/robots': { redirect: { to: '/docs/robots/getting-started/installation', statusCode: 301 } },
    '/sitemap': { redirect: { to: '/docs/sitemap/getting-started/installation', statusCode: 301 } },
    '/og-image': { redirect: { to: '/docs/og-image/getting-started/installation', statusCode: 301 } },
    '/schema-org': { redirect: { to: '/docs/schema-org/getting-started/installation', statusCode: 301 } },
    '/experiments': { redirect: { to: '/docs/seo-utils/getting-started/installation', statusCode: 301 } },
    '/site-config': { redirect: { to: '/docs/site-config/getting-started/installation', statusCode: 301 } },
    '/link-checker': { redirect: { to: '/docs/link-checker/getting-started/installation', statusCode: 301 } },
    '/skew-protection': { redirect: { to: '/docs/skew-protection/getting-started/installation', statusCode: 301 } },

    '/nuxt-seo/**': {
      ogImage: {
        component: 'NuxtSeo',
      },
    },
    '/og-image/releases/v3': { redirect: { to: '/docs/og-image/releases/v3-major', statusCode: 301 } },
    // extra redirects
    '/sitemap/guides/i18n': { redirect: { to: '/docs/sitemap/integrations/i18n', statusCode: 301 } },
    '/sitemap/guides/integrations': { redirect: { to: '/docs/sitemap/integrations/content', statusCode: 301 } },
    '/sitemap/guides/auto-lastmod': { redirect: { to: '/docs/sitemap/guides/best-practices', statusCode: 301 } },
    '/nuxt-seo/getting-started/migration-guide': {
      redirect: {
        to: '/docs/nuxt-seo/migration-guide/nuxt-seo-kit',
        statusCode: 301,
      },
    },

    // v2 redirects
    '/docs/seo-utils/guides/redirect-canonical': { redirect: { to: '/docs/seo-utils/guides/canonical-url', statusCode: 301 } },

    '/docs/sitemap/getting-started/faq': { redirect: { to: '/docs/sitemap/getting-started/troubleshooting', statusCode: 301 } },
    '/docs/sitemap/getting-started/data-sources': { redirect: { to: '/docs/sitemap/guides/data-sources', statusCode: 301 } },
    '/docs/sitemap/integrations/robots': { redirect: { to: '/docs/sitemap/getting-started/installation', statusCode: 301 } },
    '/docs/sitemap/guides/lastmod': { redirect: { to: '/docs/sitemap/guides/loc-data', statusCode: 301 } },
    '/docs/sitemap/guides/cache': { redirect: { to: '/docs/sitemap/guides/performance', statusCode: 301 } },
    '/docs/sitemap/guides/debugging': { redirect: { to: '/docs/sitemap/getting-started/troubleshooting', statusCode: 301 } },
    '/docs/sitemap/integrations/content': { redirect: { to: '/docs/sitemap/guides/content', statusCode: 301 } },
    '/docs/sitemap/api/schema': { redirect: { to: '/docs/sitemap/guides/images-videos', statusCode: 301 } },

    '/docs/robots/getting-started/how-it-works': { redirect: { to: '/docs/robots/guides/how-it-works', statusCode: 301 } },
    '/docs/robots/integration/i18n': { redirect: { to: '/docs/robots/guides/i18n', statusCode: 301 } },
    '/docs/robots/nitro-api/get-site-indexable': { redirect: { to: '/docs/robots/nitro-api/get-site-robot-config', statusCode: 301 } },

    '/docs/link-checker/integrations/sitemap': { redirect: { to: '/docs/link-checker/getting-started/installation', statusCode: 301 } },

    '/docs/schema-org/integrations/robots': { redirect: { to: '/docs/schema-org/getting-started/installation', statusCode: 301 } },
    '/docs/schema-org/getting-started/how-it-works': { redirect: { to: '/docs/schema-org/guides/how-it-works', statusCode: 301 } },
    '/docs/schema-org/integrations/i18n': { redirect: { to: '/docs/schema-org/guides/i18n', statusCode: 301 } },
    '/docs/schema-org/guides/debugging': { redirect: { to: '/docs/schema-org/getting-started/troubleshooting', statusCode: 301 } },

    '/docs/og-image/api/nuxt-seo-template': { redirect: { to: '/docs/og-image/guides/community-templates', statusCode: 301 } },

    '/docs/site-config/getting-started/how-it-works': { redirect: { to: '/docs/site-config/guides/how-it-works', statusCode: 301 } },
    '/docs/site-config/integrations/i18n': { redirect: { to: '/docs/site-config/integrations/i18n', statusCode: 301 } },
    '/docs/site-config/guides/debugging': { redirect: { to: '/docs/site-config/getting-started/troubleshooting', statusCode: 301 } },

    '/docs/nuxt-seo/getting-started/what-is-nuxt-seo': { redirect: { to: '/docs/nuxt-seo/getting-started/introduction', statusCode: 301 } },
    '/docs/nuxt-seo/getting-started/faq': { redirect: { to: '/docs/nuxt-seo/getting-started/troubleshooting', statusCode: 301 } },
    '/docs/nuxt-seo/guides/default-meta': { redirect: { to: '/docs/seo-utils/guides/default-meta', statusCode: 301 } },
    '/docs/nuxt-seo/guides/fallback-title': { redirect: { to: '/docs/seo-utils/guides/fallback-title', statusCode: 301 } },
    '/docs/nuxt-seo/guides/redirect-canonical': { redirect: { to: '/docs/seo-utils/guides/canonical-url', statusCode: 301 } },
    '/docs/nuxt-seo/guides/title-templates': { redirect: { to: '/learn/mastering-titles-in-nuxt', statusCode: 301 } },
    '/docs/nuxt-seo/guides/trailing-slashes': { redirect: { to: '/learn/trailing-slashes', statusCode: 301 } },
    '/docs/nuxt-seo/guides/i18n': { redirect: { to: '/docs/nuxt-seo/getting-started/introduction', statusCode: 301 } },
    '/docs/nuxt-seo/seo-guides/going-live': { redirect: { to: '/learn/going-live', statusCode: 301 } },
    '/docs/nuxt-seo/api/breadcrumbs': { redirect: { to: '/docs/seo-utils/api/breadcrumbs', statusCode: 301 } },
    '/docs/nuxt-seo/api/config': { redirect: { to: '/docs/nuxt-seo/getting-started/introduction', statusCode: 301 } },
    '/docs/nuxt-seo/guides/configuring-modules': { redirect: { to: '/docs/nuxt-seo/guides/using-the-modules', statusCode: 301 } },

    '/docs/link-checker/guides/skip-inspections': { redirect: { to: '/docs/link-checker/guides/rules', statusCode: 301 } },
    '/docs/schema-org/guides/quick-setup': { redirect: { to: '/docs/schema-org/guides/setup-identity', statusCode: 301 } },
  },

  css: [
    '~/css/global.css',
  ],

  ogImage: {
    zeroRuntime: true,
    fonts: [
      'Hubot+Sans:400',
      'Hubot+Sans:700',
    ],
  },

  icon: {
    customCollections: [{
      prefix: 'custom',
      dir: resolve('./app/assets/icons'),
    }],
    clientBundle: {
      scan: true,
      includeCustomCollections: true,
    },
    provider: 'iconify',
  },

  seo: {
    meta: {
      themeColor: [
        { content: '#18181b', media: '(prefers-color-scheme: dark)' },
        { content: 'white', media: '(prefers-color-scheme: light)' },
      ],
    },
  },

  llms: {
    domain: 'https://nuxtseo.com/',
    title: 'Nuxt SEO',
    description: 'Nuxt SEO is a collection of hand-crafted Nuxt Modules to help you rank higher in search engines.',
    notes: [
      'The documentation only supports Nuxt v3 and Nuxt v4',
      'The content is automatically generated from the same source as the official documentation.',
    ],
    full: {
      title: 'Complete Documentation',
      description: 'The complete documentation including all content',
    },
    sections: modules.map(m => ({
      title: `${m.label} Module Documentation`,
      description: m.slug,
      contentCollection: m.contentCollection,
      contentFilters: [
        { field: 'extension', operator: '=', value: 'md' },
      ],
    })),
  },

  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
    head: {
      templateParams: {
        separator: '·',
      },
      bodyAttrs: {
        class: 'antialiased font-sans text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-900',
      },
    },
  },

  compatibilityDate: '2025-10-10',
})
