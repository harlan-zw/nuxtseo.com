<script setup lang="ts">
import UIcon from '#ui/components/Icon.vue'
import { Motion } from 'motion-v'
import { modules } from '~~/modules'
import { useStats } from '../composables/data'
import { useLearnPlatform } from '../composables/learnPlatform'
import { menu } from '../composables/nav'

const { data: stats } = await useStats()
const learnPlatform = useLearnPlatform()

const platforms = [
  { label: 'Nuxt', value: 'nuxt', icon: 'i-logos-nuxt-icon' },
  { label: 'Vue', value: 'vue', icon: 'i-logos-vue' },
] as const
const route = useRoute()

const nuxtSeoStars = computed(() => {
  const stars = stats.value?.modules.find(m => m.slug === 'nuxt-seo')?.stars || 0
  return Intl.NumberFormat('en', { notation: 'compact', compactDisplay: 'short' }).format(stars)
})

const isPro = computed(() => {
  return route.path.startsWith('/pro')
    || route.path.startsWith('/docs/skew-protection')
    || route.path.startsWith('/docs/ai-ready')
    || route.path.startsWith('/docs/ai-search')
})

const navigation = computed(() => {
  const menuItems = [...menu.value]
  if (isPro.value) {
    // replace menu[1] with pro menu
    menuItems[1] = {
      label: 'Modules',
      icon: 'i-carbon-3rd-party-connected',
      children: modules.filter(m => m.slug !== 'nuxt-seo' && m.pro).map(m => ({
        label: m.label,
        icon: m.icon,
        to: `/docs/${m.slug}/getting-started/introduction`,
        disabled: m.soon,
        class: m.soon ? 'opacity-30 cursor-not-allowed' : '',
        // need to pass custom module details as ui props so we can modify slot markup
        ui: {
          soon: m.soon,
          pro: m.pro,
        },
      })),
    }
  }
  return menuItems.map((item) => {
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
  <UHeader :ui="{ root: 'border-none bg-transparent pt-2 mb-3 px-5 h-auto', container: 'max-w-[1452px] lg:bg-white/3 lg:border border-[var(--ui-border)] lg:dark:bg-gray-900/10 mx-auto py-0 px-0 lg:px-5 sm:px-0 rounded-lg' }">
    <template #left>
      <NuxtLink
        to="/"
        title="Home" aria-label="Title"
        class="flex mr-4 items-end gap-1.5 font-bold text-base text-(--ui-text-highlighted) font-title w-[150px]"
      >
        <LogoPro v-if="isPro" />
        <Logo v-else />
      </NuxtLink>
    </template>
    <template #default>
      <div class="hidden lg:flex items-center">
        <UNavigationMenu :ui="{ viewport: 'min-w-[400px]' }" :items="[menu[0]]" class="justify-center" />
        <UNavigationMenu :ui="{ viewport: 'min-w-[450px]' }" :items="[menu[1], menu[3]]" class="justify-center">
          <template #item-content="{ item }">
            <div v-if="item.label === 'Learn SEO'" class="px-2 pt-2">
              <div class="inline-flex rounded-md border border-[var(--ui-border)] overflow-hidden">
                <button
                  v-for="(p, i) in platforms"
                  :key="p.value"
                  type="button"
                  class="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all duration-150" :class="[
                    learnPlatform === p.value
                      ? 'bg-[var(--ui-bg-elevated)] text-[var(--ui-text-highlighted)]'
                      : 'bg-transparent text-[var(--ui-text-muted)] hover:text-[var(--ui-text)] hover:bg-[var(--ui-bg-muted)]',
                    i === 0 ? '' : 'border-l border-[var(--ui-border)]',
                  ]"
                  @click="learnPlatform = p.value"
                >
                  <UIcon :name="p.icon" class="size-4" />
                  {{ p.label }}
                </button>
              </div>
            </div>
            <ul class="grid grid-cols-3 p-2 gap-2">
              <Motion
                v-for="(module, idx) in item.children"
                :key="module.to"
                as="li"
                class="text-center"
                :initial="{ opacity: 0, y: -8 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.15, delay: idx * 0.03 }"
              >
                <UButton variant="ghost" :to="module.to" class="w-full">
                  <div class="w-full">
                    <div class="flex items-center justify-center gap-1 w-full">
                      <UIcon :name="module.icon" class="block w-6 h-6 mb-0.5 align-text-top" />
                      <div v-if="module.ui?.pro">
                        <UBadge color="pro" variant="outline" size="xs">
                          Pro
                        </UBadge>
                      </div>
                    </div>
                    <div class="text-xs text-muted">
                      {{ module.label }}
                    </div>
                  </div>
                </UButton>
              </Motion>
            </ul>
          </template>
        </UNavigationMenu>
        <UNavigationMenu :ui="{ viewport: 'min-w-[400px]' }" :items="[menu[2]]" class="justify-center" />
      </div>
    </template>

    <template #body>
      <UContentNavigation :navigation="navigation" />
    </template>

    <template #right>
      <div class="flex items-center justify-end lg:-mr-1.5 ml-3 gap-3">
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
