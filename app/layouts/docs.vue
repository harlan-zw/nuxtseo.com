<script lang="ts" setup>
import { motion } from 'motion-v'
import { isHydratingRef, useCurrentDocPage } from '~/composables/data'

const router = useRouter()
const route = router.currentRoute
const activeModule = inject('module')
console.log({ activeModule })
const search = inject('search')
const navigation = inject('navigation')
const currentPage = await useCurrentDocPage()
provide('currentPage', currentPage)
watch(router.currentRoute, async () => {
  const newData = await useCurrentDocPage()
  currentPage.page.value = newData.page.value
  currentPage.surround.value = newData.surround.value
  currentPage.lastCommit.value = newData.lastCommit.value
})

const page = computed(() => currentPage.page?.value)

const searchTerm = ref('')

const subSectionLinks = computed(() => {
  return [
    {
      label: 'Guides',
      to: `/docs/${activeModule.value.slug}/getting-started/introduction`,
      active: !route.value.path.startsWith(`/docs/${activeModule.value.slug}/releases`) && !route.value.path.startsWith(`/docs/${activeModule.value.slug}/api`),
    },
    {
      label: 'API',
      icon: 'i-heroicons-code',
      to: navigation.value.find(m => m.path.endsWith('/api'))?.children?.[0]?.path,
      active: route.value.path.startsWith(`/docs/${activeModule.value.slug}/api`),
    },
    {
      label: 'Releases',
      icon: 'i-carbon-version',
      to: navigation.value.find(m => m.path.endsWith('/releases'))?.children?.[0]?.path,
      active: route.value.path.startsWith(`/docs/${activeModule.value.slug}/releases`),
    },
  ].filter(i => !!i.to)
})

const { open: openSearch } = useContentSearch()

onKeyStroke('Divide', () => {
  openSearch.value = true
})

const isHydrating = isHydratingRef()
</script>

<template>
  <div>
    <div class=" h-12">
      <div class="relative max-w-[1452px] px-6 mx-auto flex lg:grid grid-cols-10 h-full justify-between lg:justify-center items-center w-full">
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
        <div class="col-span-6">
          <div class="max-w-[66ch] mx-auto flex items-center gap-2 ">
            <div class="z-10  flex gap-2 items-center dark:text-blue-200 group-hover:text-blue-500 transition-all">
              <div v-if="motion" class="font-semibold">
                {{ activeModule.label }}
              </div>
            </div>
            <ul v-if="motion" class="z-10 gap-1 text-blue-200 group-hover:text-blue-500 hidden lg:flex transition-all relative">
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
                  scale: activeModule.slug === module.slug ? 1.2 : 0.8,
                  rotate: activeModule.slug === module.slug ? 1.2 : 0.8,
                  transform: activeModule.slug === module.slug ? 'rotate(33deg)' : 'rotate(0deg)',
                }"
              >
                <UButton
                  :title="`Switch to ${module.label}`" :aria-label="module.label" type="button"
                  class="cursor-pointer transition-all "
                  :to="route.path.endsWith('') ? module.to : module.to"
                  :class="[module.slug === activeModule.slug ? ['text-blue-400 dark:text-blue-300'] : ['text-[var(--ui-text-dimmed)] hover:text-blue-400']]"
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
            <USelectMenu :search-input="false" size="sm" :model-value="activeModule.version" :items="activeModule.versions?.map(v => ({ label: v, disabled: v !== activeModule.version }))" class="md:w-full" />
          </div>
        </div>
      </div>
    </div>
    <UMain class="relative mb-20 px-5">
      <svg viewBox="0 0 1440 181" fill="none" xmlns="http://www.w3.org/2000/svg" class="left-0  text-blue-300/30 dark:text-blue-900/30 pointer-events-none absolute w-full top-[1px] transition-all text-primary flex-shrink-0 opacity-100 duration-[400ms] opacity-30 z-20"><mask id="path-1-inside-1_414_5526" fill="white"><path d="M0 0H1440V181H0V0Z" /></mask><path d="M0 0H1440V181H0V0Z" fill="url(#paint0_linear_414_5526)" fill-opacity="0.22" /><path d="M0 2H1440V-2H0V2Z" fill="url(#paint1_linear_414_5526)" mask="url(#path-1-inside-1_414_5526)" /><defs><linearGradient id="paint0_linear_414_5526" x1="720" y1="0" x2="720" y2="181" gradientUnits="userSpaceOnUse"><stop stop-color="currentColor" /><stop offset="1" stop-color="currentColor" stop-opacity="0" /></linearGradient><linearGradient id="paint1_linear_414_5526" x1="0" y1="90.5" x2="1440" y2="90.5" gradientUnits="userSpaceOnUse"><stop stop-color="currentColor" stop-opacity="0" /><stop offset="0.395" stop-color="currentColor" /><stop offset="1" stop-color="currentColor" stop-opacity="0" /></linearGradient></defs></svg>
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
                    <TableOfContents :links="page.body?.toc?.links" />
                  </div>
                </template>
                <Ads />
              </div>
            </div>
          </template>
          <template #left>
            <UPageAside class="max-w-[300px] pt-8">
              <DocsSidebarHeader :key="activeModule?.slug || 'slug'" />
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
</template>
