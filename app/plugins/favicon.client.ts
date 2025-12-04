export default defineNuxtPlugin(() => {
  const route = useRoute()

  const isPro = computed(() =>
    route.path.startsWith('/pro')
    || route.path.startsWith('/docs/skew-protection')
    || route.path.startsWith('/docs/ai-ready'),
  )

  useHead({
    link: computed(() => [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: isPro.value ? '/icon-pro.svg' : '/icon.svg',
      },
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: isPro.value ? '/favicon-pro.ico' : '/favicon.ico',
      },
    ]),
  })
})
