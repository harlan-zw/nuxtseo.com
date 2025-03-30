import { modules as baseModules } from '../../utils/modules'

export const modules = baseModules.map((m) => {
  return {
    ...m,
    to: `/docs/${m.slug}/getting-started/introduction`,
  }
})

export function useModule(_slug?: Ref<string> | string) {
  const stats = inject('stats')
  const moduleSlug = ref(toValue(_slug))
  watch(() => useRoute().path, (s) => {
    moduleSlug.value = useRoute().path.split('/')[2]
  })
  return computed(() => {
    const slug = moduleSlug.value
    const module = modules.find(m => m.slug === slug)
    if (!module) {
      return null
    }
    return {
      ...(stats.value.modules.find(m => m.slug === slug) || {}),
      ...(modules.find(m => m.slug === slug) || {}),
    }
  })
}
