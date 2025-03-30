import { modules as baseModules } from '../../utils/modules'

export const modules = baseModules.map((m) => {
  return {
    ...m,
    to: `/docs/${m.slug}/getting-started/introduction`,
  }
})

export async function useModule(_slug?: Ref<string> | string) {
  const route = useRouter().currentRoute
  const { data: stats } = await useStats()
  return computed(() => {
    const slug = _slug ? toValue(_slug) : route.value.path.split('/')[2]
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
