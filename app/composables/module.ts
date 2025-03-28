import { modules as baseModules } from '@nuxtjs/seo/const'

export function useModule(moduleStats: any[], _slug?: Ref<string>) {
  const route = useRoute()
  return computed(() => {
    const slug = _slug ? toValue(_slug) : route.path.split('/')[2]
    return {
      ...(moduleStats.find(m => m.slug === slug) || {}),
      ...(modules.find(m => m.slug === slug) || {}),
    }
  })
}

export const modules = baseModules.map((m) => {
  return {
    ...m,
    to: `/docs/${m.slug}/getting-started/introduction`,
  }
})
