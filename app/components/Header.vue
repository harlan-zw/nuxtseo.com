<script setup lang="ts">
import { motion } from 'motion-v'
import { modules } from '~~/utils/modules'
import { useStats } from '../composables/data'
import { menu } from '../composables/nav'

const { data: stats } = await useStats()
const route = useRoute()

const nuxtSeoStars = computed(() => {
  const stars = stats.value?.modules.find(m => m.slug === 'nuxt-seo')?.stars || 0
  return Intl.NumberFormat('en', { notation: 'compact', compactDisplay: 'short' }).format(stars)
})

const activeModule = inject('module', null)

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
      <div v-if="activeModule">
        <div class="space-y-2 mb-3">
          <div class="text-center dark:text-blue-200 group-hover:text-blue-500 transition-all">
            {{ activeModule.label }}
          </div>
          <ul v-if="motion" class="z-10 gap-1 text-blue-200 group-hover:text-blue-500 items-center justify-center flex transition-all relative">
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
                :to="module.to"
                :class="[module.slug === activeModule.slug ? ['text-blue-400 dark:text-blue-300'] : ['text-[var(--ui-text-dimmed)] hover:text-blue-400']]"
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
      <UContentNavigation :navigation="navigation">
        <template #link="{ link }">
          <div class="flex items-center gap-2">
            <UIcon v-if="link.icon" :name="link.icon" class="w-4 h-4 text-(--ui-text-muted) dark:text-sky-200" />
            <div :class="link.children?.length ? 'text-sm font-bold' : ''">
              {{ link.title }}
            </div>
          </div>
        </template>
      </UContentNavigation>
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

        <div class="flex items-center lg:gap-1.5">
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
      </div>
    </template>
  </UHeader>
</template>
