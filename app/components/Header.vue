<script setup lang="ts">
import { useStats } from '../composables/data'
import { menu } from '../composables/nav'

const { data: stats } = await useStats()

const nuxtSeoStars = computed(() => {
  const stars = stats.value?.modules.find(m => m.slug === 'nuxt-seo')?.stars || 0
  return Intl.NumberFormat('en', { notation: 'compact', compactDisplay: 'short' }).format(stars)
})

const navigation = computed(() => {
  return menu.value.map((item) => {
    return {
      ...item,
      title: item.label,
      children: item.children?.map((child) => {
        return {
          ...child,
          to: child.children?.length ? child.children[0].to : child.to,
          title: child.label,
        }
      }),
    }
  })
})
</script>

<template>
  <UHeader :ui="{ root: 'border-none bg-transparent pt-2 mb-3 px-5 h-auto', container: 'max-w-[1452px] lg:bg-gray-600/3 lg:border border-[var(--ui-border)] lg:dark:bg-gray-900/10 mx-auto py-0 px-0 lg:px-5 sm:px-0 rounded-lg' }">
    <template #left>
      <NuxtLink
        to="/"
        title="Home" aria-label="Title"
        class="flex mr-4 items-end gap-1.5 font-bold text-base text-(--ui-text-highlighted) font-title"
      >
        <Logo />
      </NuxtLink>
      <div class="hidden lg:block">
        <UNavigationMenu :ui="{ viewport: 'min-w-[600px]' }" :items="menu.slice(0, 3)" class="justify-center" />
      </div>
    </template>

    <template #body>
      <UContentNavigation :navigation="navigation" />
    </template>

    <template #right>
      <div class="flex items-center justify-end lg:-mr-1.5 ml-3 gap-3">
        <div class="hidden lg:block">
          <UNavigationMenu :items="menu.slice(3)" :ui="{ viewport: 'min-w-[500px] -left-full' }" class="justify-center" />
        </div>
        <UTooltip text="Star on GitHub">
          <UButton class="hidden sm:flex" to="https://github.com/harlan-zw/nuxt-seo" target="_blank" color="primary" variant="ghost">
            <template #leading>
              <div class="flex items-center transition rounded-l py-1 space-x-1 dark:text-neutral-200">
                <UIcon name="i-carbon-star" class="w-3 h-3 " />
              </div>
            </template>
            <div class="font-semibold font-mono">
              {{ nuxtSeoStars }}
            </div>
          </UButton>
        </UTooltip>

        <ColorModeButton />

        <UTooltip text="Open Nuxt SEO on GitHub">
          <UButton
            aria-label="Nuxt SEO on GitHub"
            to="https://github.com/harlan-zw/nuxt-seo"
            target="_blank"
            color="neutral"
            variant="ghost"
            class="hidden lg:inline-flex transition opacity-85"
            icon="i-carbon-logo-github"
          />
        </UTooltip>
      </div>
    </template>
  </UHeader>
</template>
