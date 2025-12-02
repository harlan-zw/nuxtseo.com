<script lang="ts" setup>
import { queryCollectionNavigation } from '#imports'
import { motion } from 'motion-v'
import { modules } from '~~/modules'
import { isHydratingRef, useCurrentDocPage } from '~/composables/data'
import { useModule } from '~/composables/module'

const route = useRoute()
const navOpen = ref(false)

const activeModule = useModule(useRouter().currentRoute.value.params.slug[0])
provide('module', activeModule)
const {
  data: search,
  refresh: refreshSearch,
} = await useLazyAsyncData(`search-${activeModule.value.slug}`, () => queryCollectionSearchSections(activeModule.value.contentCollection))
const {
  data: navigation,
  refresh: refreshNavigation,
} = await useLazyAsyncData(`navigation-${activeModule.value.slug}`, () => queryCollectionNavigation(activeModule.value.contentCollection), {
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
  if (activeModule.value) {
    await Promise.all([refreshNavigation(), refreshSearch()])
  }
})
const { data: currentPage } = await useAsyncData(() => `current-page-${route.path}`, () => useCurrentDocPage(), {
  watch: [() => route.path],
})
provide('currentPage', currentPage)
watch(() => route.path, () => {
  navOpen.value = false
})

const page = computed(() => currentPage.value?.page?.value)

const searchTerm = ref('')

const subSectionLinks = computed(() => {
  if (!activeModule.value) {
    return []
  }
  return [
    {
      label: 'Guides',
      to: `/docs/${activeModule.value.slug}/getting-started/introduction`,
      active: !route.path.startsWith(`/docs/${activeModule.value.slug}/releases`) && !route.path.startsWith(`/docs/${activeModule.value.slug}/api`),
    },
    {
      label: 'API',
      icon: 'i-heroicons-code',
      to: navigation.value.find(m => m.path.endsWith('/api'))?.children?.[0]?.path,
      active: route.path.startsWith(`/docs/${activeModule.value.slug}/api`),
    },
    {
      label: 'Releases',
      icon: 'i-carbon-version',
      to: navigation.value.find(m => m.path.endsWith('/releases'))?.children?.[0]?.path,
      active: route.path.startsWith(`/docs/${activeModule.value.slug}/releases`),
    },
  ].filter(i => !!i.to)
})

const { open: openSearch } = useContentSearch()

onKeyStroke('Divide', () => {
  openSearch.value = true
})

const isHydrating = isHydratingRef()

const isAiSearchReady = ref(false)
const toolbarQuery = ref(null)
</script>

<template>
  <div>
    <div>
      <div class="flex">
        <div class="w-full">
          <div class=" h-12">
            <div class="relative max-w-[1452px] px-6 mx-auto flex lg:grid grid-cols-10 h-full justify-between lg:justify-center items-center w-full">
              <UButton variant="link" class="font-semibold mr-3 font-sm lg:hidden flex items-center gap-2 cursor-pointer" @click="navOpen = true">
                <UIcon name="i-carbon-open-panel-bottom" size="w-6 h-6" />
                {{ activeModule.label }}
              </UButton>
              <div class="col-span-2 flex h-12">
                <div class="h-full flex text-sm space-x-6">
                  <div v-for="item in subSectionLinks" :key="item.to">
                    <NuxtLink
                      :class="item.active ? 'group relative h-full flex items-center text-gray-800 dark:text-gray-200 font-semibold' : 'group relative h-full flex items-center font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-300'"
                      :to="item.to"
                    >
                      {{ item.label }}
                      <div :class="item.active ? 'absolute bottom-0 h-[1.5px] w-full bg-[var(--ui-primary)] dark:bg-primary-light' : 'absolute bottom-0 h-[1.5px] w-full group-hover:bg-gray-200 dark:group-hover:bg-gray-700'" />
                    </NuxtLink>
                  </div>
                </div>
              </div>
              <div class="col-span-6 hidden lg:flex ">
                <div class="max-w-full w-[66ch] mx-auto flex items-center gap-2 ">
                  <div class="z-10  flex gap-2 items-center dark:text-blue-200 group-hover:text-blue-500 transition-all">
                    <div class="font-semibold">
                      {{ activeModule?.label }}
                    </div>
                    <UTooltip v-if="activeModule?.pro" text="Requires a Nuxt SEO Pro license.">
                      <UBadge color="pro" variant="outline" size="sm">
                        Pro
                      </UBadge>
                    </UTooltip>
                  </div>
                  <ul v-if="motion && activeModule" class="z-10 gap-1 text-blue-200 flex group-hover:text-blue-500 transition-all relative">
                    <motion.li
                      v-for="module in [activeModule, ...modules.filter(m => m.slug !== activeModule.slug && m.pro === activeModule.pro)]"
                      :key="module.slug"
                      :while-hover="{ scale: 1.2 }"
                      layout
                      :transition="{
                        type: 'spring',
                        damping: 20,
                        stiffness: 300,
                        duration: 2,
                      }"
                      :while-press="{
                        scale: activeModule?.slug === module.slug ? 1.2 : 0.8,
                        rotate: activeModule?.slug === module.slug ? 1.2 : 0.8,
                        transform: activeModule?.slug === module.slug ? 'rotate(33deg)' : 'rotate(0deg)',
                      }"
                    >
                      <UButton
                        :title="`Switch to ${module.label}`" :aria-label="module.label" type="button"
                        class="cursor-pointer transition-all "
                        :to="module.to"
                        :class="[module.slug === activeModule?.slug ? ['text-blue-400 dark:text-blue-300'] : ['text-[var(--ui-text-dimmed)] hover:text-blue-400']]"
                        variant="ghost"
                      >
                        <UIcon v-if="module.icon" dynamic :name="module.icon" class="w-5 h-5" />
                      </UButton>
                    </motion.li>
                  </ul>
                </div>
              </div>
              <div class="col-span-2 flex space-x-3 justify-end">
                <div>
                  <UInput type="search" size="sm" class="cursor-pointer hidden lg:block w-[70px]" shortcut="divide" @click="openSearch = true">
                    <template #leading>
                      <UContentSearchButton size="sm" class="cursor-pointer  p-0 opacity-70 hover:opacity-100" @click="openSearch = true" />
                    </template>
                    <template #trailing>
                      <UKbd @click="openSearch = true">
                        /
                      </UKbd>
                    </template>
                  </UInput>
                </div>
                <div>
                  <USelectMenu :search-input="false" size="sm" :model-value="activeModule?.version" :items="activeModule?.versions?.map(v => ({ label: v, disabled: v !== activeModule?.version }))" class="md:w-full" />
                </div>
              </div>
            </div>
          </div>
          <UMain class="relative mb-20 px-5">
            <svg viewBox="0 0 1440 181" fill="none" xmlns="http://www.w3.org/2000/svg" class="left-0  text-primary-300/30 dark:text-primary-900/30 pointer-events-none absolute w-full top-[1px] transition-all text-primary flex-shrink-0 opacity-100 duration-[400ms] z-20"><mask id="path-1-inside-1_414_5526" fill="white"><path d="M0 0H1440V181H0V0Z" /></mask><path d="M0 0H1440V181H0V0Z" fill="url(#paint0_linear_414_5526)" fill-opacity="0.22" /><path d="M0 2H1440V-2H0V2Z" fill="url(#paint1_linear_414_5526)" mask="url(#path-1-inside-1_414_5526)" /><defs><linearGradient id="paint0_linear_414_5526" x1="720" y1="0" x2="720" y2="181" gradientUnits="userSpaceOnUse"><stop stop-color="currentColor" /><stop offset="1" stop-color="currentColor" stop-opacity="0" /></linearGradient><linearGradient id="paint1_linear_414_5526" x1="0" y1="90.5" x2="1440" y2="90.5" gradientUnits="userSpaceOnUse"><stop stop-color="currentColor" stop-opacity="0" /><stop offset="0.395" stop-color="currentColor" /><stop offset="1" stop-color="currentColor" stop-opacity="0" /></linearGradient></defs></svg>
            <div class="max-w-[1400px] mx-auto lg:pt-5">
              <UPage :ui="{ left: 'lg:col-span-3 xl:col-span-2', right: 'lg:col-span-2 hidden xl:block', center: 'col-span-5 xl:col-span-6' }">
                <template #right>
                  <div class="">
                    <div class="pt-11 pl-10 gap-5 flex flex-col">
                      <template v-if="page?.body?.toc?.links?.length > 1">
                        <div>
                          <div class="mb-5 flex items-center gap-2  text-[var(--ui-text-accented)]">
                            <UIcon name="i-tabler-align-left-2" class="size-4 " />
                            <div class="text-xs  font-medium">
                              On this page
                            </div>
                          </div>
                          <TableOfContents :links="page?.body?.toc?.links" />
                        </div>
                      </template>
                      <Ads />
                    </div>
                  </div>
                </template>
                <template #left>
                  <UPageAside class="max-w-[300px] pt-8">
                    <DocsSidebarHeader :key="`${activeModule?.slug || ''}-${navigation?.length || 0}`" />
                  </UPageAside>
                </template>
                <AnimatePresence v-if="motion" mode="wait">
                  <motion.div
                    :key="route.path"
                    :initial="isHydrating ? {} : { opacity: 0, y: 16, filter: 'blur(0.2rem)' }"
                    :animate="{ opacity: 1, y: 0, filter: 'blur(0)' }"
                    :exit="{ opacity: 0, y: 16, filter: 'blur(0.2rem)' }"
                    :transition="{
                      duration: 0.2,
                    }"
                  >
                    <div class="max-w-[66ch] mx-auto pt-7">
                      <slot />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </UPage>
            </div>
          </UMain>
          <ClientOnly>
            <LazyUContentSearch
              :key="openSearch"
              v-model:search-term="searchTerm"
              shortcut="/"
              :files="search"
              :navigation="navigation"
              :fuse="{ resultLimit: 42 }"
            />
          </ClientOnly>
        </div>
        <AiSearchDrawer v-if="isAiSearchReady" :show-drawer="!!toolbarQuery" />
      </div>
      <AiSearchToolbar v-if="isAiSearchReady && !toolbarQuery" @submit="e => { console.log('toolbar submit received', e); toolbarQuery = e }" />
      <UDrawer v-model:open="navOpen">
        <template #content>
          <div class="px-5">
            <div class="space-y-2 mb-3 mt-5 px-5">
              <ul v-if="motion && activeModule" class="z-10 gap-1 text-blue-200 group-hover:text-blue-500 items-center justify-center flex transition-all relative">
                <motion.li
                  v-for="module in [activeModule, ...modules.filter(m => m.slug !== activeModule.slug)]"
                  :key="module.slug"
                  :while-hover="{ scale: 1.2 }"
                  layout
                  :transition="{
                    type: 'spring',
                    damping: 20,
                    stiffness: 300,
                    duration: 2,
                  }"
                  :while-press="{
                    scale: activeModule?.slug === module.slug ? 1.2 : 0.8,
                    rotate: activeModule?.slug === module.slug ? 1.2 : 0.8,
                    transform: activeModule?.slug === module.slug ? 'rotate(33deg)' : 'rotate(0deg)',
                  }"
                >
                  <UButton
                    :title="`Switch to ${module.label}`" :aria-label="module.label" type="button"
                    class="cursor-pointer transition-all "
                    :to="module.to"
                    :class="[module.slug === activeModule?.slug ? ['text-blue-400 dark:text-blue-300'] : ['text-[var(--ui-text-dimmed)] hover:text-blue-400']]"
                    variant="ghost"
                  >
                    <UIcon v-if="module.icon" dynamic :name="module.icon" class="w-5 h-5" />
                  </UButton>
                </motion.li>
              </ul>
            </div>
            <DocsSidebarHeader />
            <USeparator class="mb-5" />
          </div>
        </template>
      </UDrawer>
    </div>
  </div>
</template>
