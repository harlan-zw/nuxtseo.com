<script setup lang="ts">
import { useStats } from '~/composables/data'

const { data: stats } = await useStats()
if (!stats.value) {
  createError({
    statusText: 'Missing stats.json!',
    status: 500,
  })
}
provide('stats', stats)

const appConfig = useAppConfig()

useHead({
  style: [
    { innerHTML: `:root { --ui-primary: #1d293d; } .dark { --ui-primary: oklch(0.809 0.105 251.813); }`, id: 'nuxt-ui-black-as-primary', tagPriority: -2 },
  ],
  htmlAttrs: {
    lang: 'en',
  },
  meta: [
    { name: 'theme-color', content: '#0000FF', media: '(prefers-color-scheme: light)' },
    { name: 'theme-color', content: '#000000', media: '(prefers-color-scheme: dark)' },
    { name: 'color-scheme', content: 'light dark' },
  ],
})
</script>

<template>
  <UApp :toaster="appConfig.toaster">
    <NuxtLoadingIndicator color="#FFF" />
    <Header class="z-100" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ClientOnly />

    <Footer />
  </UApp>
</template>

<style>
/* Safelist (do not remove): [&>div]:*:my-0 [&>div]:*:w-full h-64 !px-0 !py-0 !pt-0 !pb-0 !p-0 !justify-start !min-h-96 h-136 border-(--ui-border-muted) bg-(--ui-bg) */
</style>
