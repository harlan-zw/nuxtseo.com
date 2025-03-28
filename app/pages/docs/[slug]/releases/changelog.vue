<script setup lang="ts">
import { formatTimeAgo } from '@vueuse/core'
import { useStats } from '~/composables/data'

definePageMeta({
  layout: 'docs',
  breadcrumb: {
    icon: 'i-heroicons-home',
    ariaLabel: 'Home',
  },
})

const stats = await useStats()
const module = useModule([])

// credits https://github.com/antfu/releases.antfu.me/blob/main/app/components/TheItem.vue
const HighlightedVersion = defineComponent({
  props: {
    version: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () => {
      const version = props.version
      const parts = version.split(/(\.)/g)

      let highlightedIndex = -1
      for (let i = parts.length - 1; i >= 0; i--) {
        if (parts[i] !== '.') {
          const num = +parts[i]!
          if (!Number.isNaN(num) && num > 0) {
            highlightedIndex = i
            break
          }
        }
      }

      const mergedParts = [
        parts.slice(0, highlightedIndex),
        parts.slice(highlightedIndex).join(''),
      ]

      const colors = [
        'text-rose-700 bg-rose-100 dark:text-rose-300 dark:bg-rose-700',
        'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-700',
        'text-purple-700 bg-purple-100 dark:text-purple-300 dark:bg-purple-700',
        'text-teal-700 bg-teal-100  dark:text-teal-300 dark:bg-teal-700',
      ]
      const color = colors[Math.round(highlightedIndex / 2)] || colors[3]

      return h('span', ['v', ...mergedParts.map((part, i) => {
        if (i) {
          return h('span', { class: `${color} font-bold px-1 rounded` }, part)
        }
        return part
      })])
    }
  },
})
const route = useRoute()
const releases = computed(() => {
  return stats.value.allReleases.filter(r => r.slug === route.params.slug)
})
</script>

<template>
  <div>
    <UPageHeader :title="`Nuxt ${module.label} Changelog`" description="See what has been shipping recently." />
    <div class="text-center flex justify-between my-5">
      <div class="dark:text-neutral-300 text-sm">
        Last fetched:
        {{ formatTimeAgo(new Date(stats.fetchedAt)) }}.
      </div>
      <div class="mt-1 text-[var(--ui-text-muted)] text-sm">
        See <NuxtLink external href="https://github.com/unjs/unhead/releases" target="_blank">
          GitHub Releases
        </NuxtLink> for realtime updates.
      </div>
    </div>
    <TransitionGroup
      name="release-list"
      tag="ul"
      class="space-y-6 max-w-3xl mx-auto"
    >
      <li
        v-for="(release, key) in releases"
        :key="key"
        class="transform transition-all duration-300 hover:translate-y-[-2px]"
      >
        <div class="flex items-center mb-3">
          <UBadge variant="soft" color="neutral">
            <UIcon name="i-carbon-calendar" class="w-3.5 h-3.5" />
            <time :datetime="new Date(release.publishedAt).toString()">
              {{ formatTimeAgo(new Date(release.publishedAt)) }}
            </time>
          </UBadge>
        </div>

        <UCard
          class="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div class="pb-5 border-b border-[var(--ui-border)] ">
            <NuxtLink target="_blank" :to="`https://github.com/unjs/unhead/releases/tag/${release.name}`" class="pb-3">
              <h3 class="text-xl font-bold flex items-center gap-2">
                <HighlightedVersion :version="release.name.slice(1)" class="font-mono" />
                <UBadge v-if="key === 0" icon="i-carbon-star" variant="soft">
                  Latest release
                </UBadge>
              </h3>
            </NuxtLink>
          </div>

          <div class="prose prose-zinc dark:prose-invert prose-sm max-w-none">
            <MDC :value="release.body" />
          </div>

          <div v-if="release.url" class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
            <UButton
              to="release.url"
              target="_blank"
              variant="ghost"
              size="sm"
              color="gray"
              class="text-xs font-medium"
              trailing-icon="i-heroicons-arrow-top-right-on-square"
            >
              View on GitHub
            </UButton>
          </div>
        </UCard>
      </li>
    </TransitionGroup>

    <div class="mt-10 text-center">
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
        Looking for older releases?
      </p>
      <UButton
        to="https://github.com/unjs/unhead/releases"
        target="_blank"
        variant="outline"
        size="sm"
        class="font-medium"
        color="info"
        trailing-icon="i-heroicons-arrow-right"
      >
        View all releases on GitHub
      </UButton>
    </div>
  </div>
</template>
