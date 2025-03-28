<script setup lang="ts">
import { getLastPathSegment, getPathSubSection } from '~~/utils/urls'

const activeModule = useModule((await useStats()).value.modules)
const searchTerm = ref('')
const route = useRoute()
const _nav = await useDocsNav(activeModule)
const nav = computed(() => {
  return _nav.value?.nav.value || []
})

const bottom = computed(() => (_nav.value?.nav.value || []).filter((p) => {
  if (['migration-guide', 'releases'].includes(getLastPathSegment(getPathSubSection(route.path)))) {
    return ['migration-guide', 'releases'].includes(getLastPathSegment(p.path))
  }
  if (getLastPathSegment(getPathSubSection(route.path)).includes('api')) {
    return getLastPathSegment(getPathSubSection(p.path)).includes('api')
  }
  return !['migration-guide', 'releases'].includes(getLastPathSegment(p.path)) && !getLastPathSegment(getPathSubSection(p.path)).includes('api')
}))

const files = computed(() => _nav.value?.files.value || [])

const topLinks = computed(() => [
  {
    title: `Playground`,
    icon: 'i-logos-stackblitz-icon',
    to: '/',
  },
  {
    title: `Changelog`,
    icon: 'i-carbon-catalog',
    to: `/docs/${activeModule.value.slug}/releases/changelog`,
  },
].filter(l => !!l.to))
</script>

<template>
  <div>
    <nav :key="activeModule?.slug" aria-title="Documentation Navigation" class="flex flex-col gap-5">
      <ul class="isolate -mx-2.5 -mb-2">
        <li v-for="link in topLinks" :key="link.to">
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
      <ContentNavigation
        as="div" default-open :collapsible="false" :navigation="bottom || []" highlight
        :ui="{ listWithChildren: 'sm:ml-0 mt-2' }"
      >
        <template #link="{ link, active }">
          <div
            v-if="!link.html" class="flex items-center justify-between gap-2 w-full"
            :class="link.deprecated ? 'opacity-50' : ''"
          >
            <div class="flex items-center gap-2">
              <UIcon
                v-if="link.icon" :name="link.icon"
                class="w-4 h-4 transition-all hover:brightness-50 brightness-120"
                :class="active ? 'sepia-[0%] brightness-100' : ' sepia-[50%]'"
              />
              <div :class="link.children?.length ? 'text-sm font-bold' : ''">
                {{ link.title }}
              </div>
            </div>
            <UIcon v-if="link.tag" :name="`i-logos-${link.tag}`" dynamclic ass="w-4 h-4" />
          </div>
          <div v-else :class="link.deprecated ? 'opacity-50' : ''">
            <UIcon v-if="link.icon" :name="link.icon" class="w-4 h-4 text-(--ui-primary)-400 dark:text-sky-200" />
            <div v-html="link.title" />
          </div>
          <div v-if="link.new">
            <UBadge size="sm" variant="subtle" color="success">
              New
            </UBadge>
          </div>
          <div v-else-if="link.deprecated" class="opacity-50">
            <UBadge size="sm" variant="subtle" color="neutral">
              Deprecated
            </UBadge>
          </div>
        </template>
      </ContentNavigation>
    </nav>
    <ClientOnly>
      <LazyUContentSearch
        v-model:search-term="searchTerm"
        :files="files"
        :navigation="[{ title: 'Getting Started', _path: `/docs/${activeModule.slug}/getting-started`, path: `/docs/${activeModule.slug}/getting-started`, children: nav[0].children[0] }, ...nav]"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>
  </div>
</template>
