import type { NuxtSEOModule } from '@nuxtjs/seo/const'
import { modules as baseModules } from '@nuxtjs/seo/const'
import { camelCase } from 'scule'

export * from '@nuxtjs/seo/const'

// export NuxtSkewProtectionModule
export const NuxtSkewProtectionModule: NuxtSEOModule = {
  // @ts-expect-error untyped
  slug: 'skew-protection',
  npm: 'nuxt-skew-protection',
  repo: 'nuxt-seo-pro/nuxt-skew-protection',
  description: 'Solve Nuxt version skews with persistent assets and instant updates.',
  title: 'Skew Protection',
  label: 'Skew Protection',
  icon: 'i-carbon-version',
  pro: true,
}

// Magic Redirects
export const NuxtMagicRedirectsModule: NuxtSEOModule = {
  // @ts-expect-error untyped
  slug: 'magic-redirects',
  npm: 'nuxt-magic-redirects',
  repo: 'harlan-zw/nuxt-magic-redirects',
  description: 'Easily manage redirects for your Nuxt 3 application with zero configuration.',
  title: 'Magic Redirects',
  label: 'Magic Redirects',
  icon: 'i-carbon-magic-wand',
  soon: true,
  pro: true,
}

export const NuxtAiReadyModule: NuxtSEOModule = {
  // @ts-expect-error untyped
  slug: 'ai-ready',
  npm: 'nuxt-ai-ready',
  repo: 'nuxt-seo-pro/nuxt-ai-ready',
  description: 'Best practice AI & LLM discoverability for Nuxt sites.',
  title: 'AI Ready',
  label: 'AI Ready',
  icon: 'i-carbon-ai-label',
  soon: true,
  pro: true,
}

export const NuxtAiSearchModule: NuxtSEOModule = {
  // @ts-expect-error untyped
  slug: 'ai-search',
  npm: 'nuxt-ai-search',
  repo: 'nuxt-seo-pro/nuxt-ai-search',
  description: 'AI-powered search and content generation for your Nuxt 3 application.',
  title: 'AI Search',
  label: 'AI Search',
  icon: 'i-carbon-chat-bot',
  soon: true,
  pro: true,
}

export const modules = [
  ...baseModules,
]
  .slice(0, -1)
  .concat([NuxtSkewProtectionModule, NuxtAiReadyModule, NuxtAiSearchModule], baseModules.slice(-1))
  .map((m) => {
    return {
      ...m,
      to: `/docs/${m.slug}/getting-started/introduction`,
      contentPrefix: m.slug === 'nuxt-seo' ? 'docs/content/nuxtSeo/' : 'docs/content/',
      contentCollection: camelCase(m.slug),
    }
  })
