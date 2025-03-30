<script setup lang="ts">
import { queryCollectionNavigation, useAsyncData, useModule } from '#imports'
import { useStats } from '~/composables/data'

const { data: stats } = await useStats()
if (!stats.value) {
  createError({
    statusText: 'Missing stats.json!',
    status: 500,
  })
}

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

const activeModule = await useModule()
provide('module', activeModule)

const { data: search, refresh: refreshSearch } = await useLazyAsyncData(`search`, () => queryCollectionSearchSections(activeModule.value.contentCollection))
const { data: navigation, refresh: refreshNavigation } = await useAsyncData(`navigation`, () => queryCollectionNavigation(activeModule.value.contentCollection), {
  default: () => [],
  async transform(res) {
    const nav = mapPath(res)
    return (nav || []).map((m) => {
      if (m.path.includes('/api')) {
        m.icon = 'i-logos-nuxt-icon'
        m.title = 'Nuxt API'
      }
      else if (m.path.includes('/nitro-api')) {
        m.icon = 'i-unjs-nitro'
        m.title = 'Nitro API'
      }
      else if (m.path.includes('/releases')) {
        m.icon = 'i-noto-sparkles'
        m.title = 'Releases'
      }
      else if (m.path.includes('/migration-guide')) {
        m.icon = 'i-noto-globe-with-meridians'
        m.title = 'Migration Guides'
      }
      else if (m.path.includes('/guides')) {
        m.title = 'Core Concepts'
      }
      if (m.children?.length) {
        m.children = m.children.map((c) => {
          if (c.children?.length === 1) {
            c = c.children[0]
          }
          return c
        })
        m.children = m.children.map((c) => {
          if (c.path.includes('/api/config')) {
            c.icon = 'i-vscode-icons-file-type-typescript-official'
            c.title = 'nuxt.config.ts'
          }
          else if (c.path.includes('/api/schema')) {
            c.icon = 'i-vscode-icons-file-type-typescript-official'
            c.title = 'runtime/types.ts'
          }
          else if (c.title.endsWith('()')) {
            c.html = true
            const [fnName] = c.title.split('()')
            c.title = `<code class="language-ts shiki shiki-themes github-light github-light material-theme-palenight" language="ts"><span style="--shiki-light: #6F42C1; --shiki-default: #6F42C1; --shiki-dark: #82AAFF;">${fnName}</span><span style="--shiki-light: #24292E; --shiki-default: #24292E; --shiki-dark: #BABED8;">()</span></code>`
          }
          else if (c.title.startsWith('<') && c.title.endsWith('>') && !c.title.includes('<code')) {
            const inner = c.title.slice(1, -1)
            c.html = true
            c.title = `<code class="language-ts shiki shiki-themes github-light github-light material-theme-palenight" language="ts"><span class="line" line="2"><span style="--shiki-light: #24292E; --shiki-default: #24292E; --shiki-dark: #89DDFF;">  &lt;</span><span style="--shiki-light: #22863A; --shiki-default: #22863A; --shiki-dark: #F07178;">${inner}</span><span style="--shiki-light: #24292E; --shiki-default: #24292E; --shiki-dark: #89DDFF;"> /&gt;
</span></span></code>`
          }
          if (c.children?.length === 1) {
            c = c.children[0]
          }
          return c
        })
      }
      return m
    })
  },
})
provide('search', search)
provide('navigation', navigation)
watch(activeModule, async () => {
  await Promise.all([refreshNavigation(), refreshSearch()])
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
