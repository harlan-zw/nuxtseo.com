import { modules as baseModules } from '../../modules'

export const modules = baseModules

export function useModule(_slug?: Ref<string> | string | false, _stats?: any) {
  const stats = inject('stats', _stats)
  const moduleSlug = ref(_slug ? toValue(_slug) : useRoute().path.split('/')[2])
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
      ...(stats.value?.modules?.find(m => m.slug === slug) || {}),
      ...(modules.find(m => m.slug === slug) || {}),
    }
  })
}
