<script lang="ts" setup>
import { motion } from 'motion-v'
import { useCurrentDocPage } from '~/composables/data'

const route = useRoute()

const { page } = await useCurrentDocPage()
const activeModule = useModule((await useStats()).value.modules)
const _nav = await useDocsNav(activeModule)

const subSectionLinks = computed(() => {
  return [
    {
      label: 'User Guides',
      to: `/docs/${activeModule.value.slug}/getting-started/introduction`,
      active: !route.path.startsWith(`/docs/${activeModule.value.slug}/releases`) && !route.path.startsWith(`/docs/${activeModule.value.slug}/api`),
    },
    {
      label: 'API',
      icon: 'i-heroicons-code',
      to: `/docs/${activeModule.value.slug}/api/overview`,
      active: route.path.startsWith(`/docs/${activeModule.value.slug}/api`),
    },
    {
      label: 'Releases',
      icon: 'i-carbon-version',
      to: `/docs/${activeModule.value.slug}/releases/changelog`,
      active: route.path.startsWith(`/docs/${activeModule.value.slug}/releases`),
    },
  ]
})

const { open: openSearch } = useContentSearch()

onKeyStroke('Divide', () => {
  openSearch.value = true
})

const rightLinks = computed(() => [
  {
    title: 'Discord Support',
    icon: 'i-logos-discord-icon',
    to: 'https://discord.com/invite/275MBUBvgP',
  },
].filter(l => !!l.to))
</script>

<template>
  <div class=" h-12">
    <div class="relative max-w-[1452px] px-6 mx-auto flex lg:grid grid-cols-10 h-full justify-between lg:justify-center items-center w-full">
      <div class="col-span-3 flex h-12">
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
      <div class="flex items-center gap-2 lg:pl-3 col-span-5">
        <div class="z-10  flex gap-2 items-center dark:text-blue-200 group-hover:text-blue-500 transition-all">
          <div v-if="motion" class="font-semibold">
            <motion.div
              :key="activeModule.slug"
              :initial="{ opacity: 0, y: 16, filter: 'blur(0.2rem)' }"
              :animate="{ opacity: 1, y: 0, filter: 'blur(0)' }"
              :exit="{ opacity: 0, y: 16, filter: 'blur(0.2rem)' }"
              :while-hover="{ scale: 1.2 }" layout
            >
              {{ activeModule.label }}
            </motion.div>
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
              :class="[module.slug === activeModule.slug ? [] : ['hover:brightness-100 hover:sepia-[10%] brightness-120 sepia-[90%]']]"
              variant="ghost"
            >
              <UIcon dynamic :name="module.icon" class="w-5 h-5" />
            </UButton>
          </motion.li>
        </ul>
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
    <svg viewBox="0 0 1440 181" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-blue-900/30 pointer-events-none absolute w-full top-[1px] transition-all text-primary flex-shrink-0 opacity-100 duration-[400ms] opacity-30 z-20"><mask id="path-1-inside-1_414_5526" fill="white"><path d="M0 0H1440V181H0V0Z" /></mask><path d="M0 0H1440V181H0V0Z" fill="url(#paint0_linear_414_5526)" fill-opacity="0.22" /><path d="M0 2H1440V-2H0V2Z" fill="url(#paint1_linear_414_5526)" mask="url(#path-1-inside-1_414_5526)" /><defs><linearGradient id="paint0_linear_414_5526" x1="720" y1="0" x2="720" y2="181" gradientUnits="userSpaceOnUse"><stop stop-color="currentColor" /><stop offset="1" stop-color="currentColor" stop-opacity="0" /></linearGradient><linearGradient id="paint1_linear_414_5526" x1="0" y1="90.5" x2="1440" y2="90.5" gradientUnits="userSpaceOnUse"><stop stop-color="currentColor" stop-opacity="0" /><stop offset="0.395" stop-color="currentColor" /><stop offset="1" stop-color="currentColor" stop-opacity="0" /></linearGradient></defs></svg>
    <div class="max-w-[1400px] mx-auto lg:pt-5">
      <UPage :ui="{ left: 'lg:col-span-3', right: 'lg:col-span-2 hidden lg:block', center: 'lg:col-span-5' }">
        <template #right>
          <div>
            <div class="pl-10 gap-5 flex flex-col">
              <ul class="isolate -mx-2.5 -mb-2">
                <li v-for="link in rightLinks" :key="link.to">
                  <NuxtLink
                    :to="link.to"
                    class="group relative w-full px-2.5 py-1.5 before:inset-y-px before:inset-x-0 flex items-center gap-1.5 text-sm before:absolute before:z-[-1] before:rounded-[calc(var(--ui-radius)*1.5)] focus:outline-none focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2 text-[var(--ui-text-toned)] focus-visible:before:ring-(--ui-primary) hover:text-(--ui-text-highlighted) hover:before:bg-(--ui-bg-elevated)/50 data-[state=open]:text-(--ui-text-highlighted) transition-colors before:transition-colors"
                  >
                    <div
                      class="rounded-md p-1 inline-flex ring-inset ring-1 bg-neutral-100/10 dark:bg-neutral-800/50 ring-neutral-200 dark:ring-neutral-700 group-hover:bg-primary group-hover:ring-primary group-hover:text-background"
                    >
                      <UIcon v-if="link.icon" :name="link.icon" class="w-4 h-4 text-[var(--ui-text-dimmed)] brightness-120 sepia" />
                    </div>
                    <span class="truncate">{{ link.title }}</span>
                  </NuxtLink>
                </li>
              </ul>
              <USeparator class="mt-0 pt-0" />
              <div>
              <div class="mb-5 flex items-center gap-2  text-[var(--ui-text-accented)]">
                <UIcon name="i-tabler-align-left-2" class="size-4 " />
                <div class="text-xs  font-medium">
                  On this page
                </div>
              </div>
                <TableOfContents v-if="page?.body?.toc?.links?.length > 1" :links="page.body?.toc?.links" />
              </div>
              <Ads />
            </div>
          </div>
        </template>
        <template #left>
          <UPageAside class="max-w-[300px] pt-0">
            <DocsSidebarHeader />
          </UPageAside>
        </template>
        <AnimatePresence v-if="motion" mode="wait">
          <motion.div
            :key="route.path"
            :initial="{ opacity: 0, y: 16, filter: 'blur(0.2rem)' }"
            :animate="{ opacity: 1, y: 0, filter: 'blur(0)' }"
            :exit="{ opacity: 0, y: 16, filter: 'blur(0.2rem)' }"
            :transition="{
              duration: 0.2,
            }"
          >
            <slot />
          </motion.div>
        </AnimatePresence>
      </UPage>
    </div>
  </UMain>
</template>
