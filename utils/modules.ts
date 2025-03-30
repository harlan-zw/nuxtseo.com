import { modules as baseModules } from '@nuxtjs/seo/const'
import { camelCase } from 'scule'

export const modules = baseModules.map((m) => {
  return {
    ...m,
    to: `/docs/${m.slug}/getting-started/introduction`,
    contentPrefix: m.slug === 'nuxt-seo' ? 'docs/content/nuxtSeo/' : 'docs/content/',
    contentCollection: camelCase(m.slug),
  }
})
