import type { NuxtSEOModule } from './modules'
import { existsSync } from 'node:fs'
import { defineCollection, defineContentConfig } from '@nuxt/content'
import { asSeoCollection } from '@nuxtjs/seo/content'
import { relative, resolve } from 'pathe'
import z from 'zod'
import { logger } from './logger'
import { LinkCheckerModule, NuxtSEO, NuxtSkewProtectionModule, OgImageModule, RobotsModule, SchemaOrgModule, SeoUtilsModule, SiteConfigModule, SitemapModule, NuxtAiReadyModule } from './modules'

const schema = z.object({
  new: z.boolean().optional(),
  deprecated: z.boolean().optional(),
})

function getSubModuleCollection(m: NuxtSEOModule) {
  const localDirPaths = new Set([
    resolve(__dirname, '..', m.npm, 'docs', 'content'),
    resolve(__dirname, '..', m.repo.replace('harlan-zw/', '').replace('nuxt-modules/', ''), 'docs', 'content'),
    // check <homeDir>/<pkg>/<m.npm> -> /home/harlan/pkg/nuxt-skew-protection
    resolve(process.env.HOME || '', 'pkg', m.npm, 'docs', 'content'),
  ])
  for (const localDirPath of localDirPaths) {
    if (existsSync(localDirPath)) {
      logger.info(`🔗 Docs source \`${m.slug}\` using local fs: ${relative(process.cwd(), localDirPath)}`)
      return defineCollection({
        schema,
        type: 'page',
        source: {
          include: '**/*.md',
          cwd: localDirPath,
          prefix: `docs/${m.slug}`,
        },
      })
    }
  }
  // use github source
  logger.info(`🔗 Docs source \`${m.slug}\` using GitHub: ${m.repo}`)
  return defineCollection(asSeoCollection({
    schema,
    type: 'page',
    source: {
      repository: `https://github.com/${m.repo}`,
      include: 'docs/content/**/*.md',
      prefix: `/docs/${m.slug}`,
    },
  }))
}

export const content = defineContentConfig({
  collections: {
    nuxtSeo: getSubModuleCollection(NuxtSEO),
    robots: getSubModuleCollection(RobotsModule),
    sitemap: getSubModuleCollection(SitemapModule),
    ogImage: getSubModuleCollection(OgImageModule),
    schemaOrg: getSubModuleCollection(SchemaOrgModule),
    linkChecker: getSubModuleCollection(LinkCheckerModule),
    seoUtils: getSubModuleCollection(SeoUtilsModule),
    siteConfig: getSubModuleCollection(SiteConfigModule),
    skewProtection: getSubModuleCollection(NuxtSkewProtectionModule),
    aiReady: getSubModuleCollection(NuxtAiReadyModule),
    learn: defineCollection(asSeoCollection({
      type: 'page',
      source: {
        include: '**/*.md',
        cwd: resolve('content/learn'),
        prefix: '/learn',
      },
      schema: z.object({
        icon: z.string().optional(),
        publishedAt: z.string().optional(),
        updatedAt: z.string().optional(),
        keywords: z.array(z.string()).optional(),
        readTime: z.string(),
        ogImageComponent: z.string().optional(),
      }),
    })),
    root: defineCollection(asSeoCollection({
      type: 'page',
      source: {
        include: '**/*.md',
        cwd: resolve('content/root'),
        prefix: '/',
      },
      schema: z.object({
        icon: z.string().optional(),
        publishedAt: z.string().optional(),
        updatedAt: z.string().optional(),
        keywords: z.array(z.string()).optional(),
        readTime: z.string(),
        ogImageComponent: z.string().optional(),
      }),
    })),
    recipes: defineCollection(asSeoCollection({
      type: 'page',
      source: {
        include: '**/*.md',
        cwd: resolve('content/recipes'),
        prefix: '/recipes',
      },
      schema: z.object({
        icon: z.string().optional(),
        publishedAt: z.string().optional(),
        updatedAt: z.string().optional(),
        keywords: z.array(z.string()).optional(),
        readTime: z.string(),
      }),
    })),
    snippets: defineCollection({
      type: 'page', // partial
      source: {
        include: '**/*.md',
        cwd: resolve('./content/snippets'),
      },
    }),
  },
})

export default content
