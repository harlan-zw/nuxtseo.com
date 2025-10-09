import type { NuxtSEOModule } from '@nuxtjs/seo/const'
import { modules as baseModules } from '@nuxtjs/seo/const'
import { camelCase } from 'scule'

export * from '@nuxtjs/seo/const'

// export NuxtSkewProtectionModule
export const NuxtSkewProtectionModule: NuxtSEOModule = {
  // @ts-expect-error untyped
  slug: 'skew-protection',
  npm: 'nuxt-skew-protection',
  repo: 'harlan-zw/nuxt-skew-protection',
  description: 'Zero downtime deployments for Nuxt 3 applications.',
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

export const NuxtAiIndexModule: NuxtSEOModule = {
  // @ts-expect-error untyped
  slug: 'ai-index',
  npm: 'nuxt-ai-index',
  repo: 'harlan-zw/nuxt-ai-index',
  description: 'AI-powered search and content generation for your Nuxt 3 application.',
  title: 'AI Index',
  label: 'AI Index',
  icon: 'i-carbon-ai-label',
  soon: true,
  pro: true,
}

export const modules = [
  ...baseModules,
]
  .slice(0, -1)
  .concat([NuxtSkewProtectionModule/* , NuxtAiIndexModule, NuxtMagicRedirectsModule */], baseModules.slice(-1))
  .map((m) => {
    return {
      ...m,
      to: `/docs/${m.slug}/getting-started/introduction`,
      contentPrefix: m.slug === 'nuxt-seo' ? 'docs/content/nuxtSeo/' : 'docs/content/',
      contentCollection: camelCase(m.slug),
    }
  })
