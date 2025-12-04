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
  meta: [
    { name: 'theme-color', content: '#a684ff', media: '(prefers-color-scheme: light)' },
    { name: 'theme-color', content: '#5d0ec0', media: '(prefers-color-scheme: dark)' },
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

    <Footer />
    <SkewNotification v-slot="{ isAppOutdated, dismiss, reload }">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div v-if="isAppOutdated" class="fixed bottom-4 right-4 z-50">
          <div class="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-full shadow-lg ring-1 ring-gray-200 dark:ring-gray-800 px-4 py-3">
            <span class="text-lg">✨</span>
            <div class="text-sm font-medium">
              Update available
            </div>
            <UButton color="primary" size="xs" label="Refresh" @click="reload" />
            <UButton color="gray" variant="ghost" size="xs" icon="i-heroicons-x-mark-20-solid" @click="dismiss" />
          </div>
        </div>
      </Transition>
    </SkewNotification>
  </UApp>
</template>

<style>
/* Safelist (do not remove): [&>div]:*:my-0 [&>div]:*:w-full h-64 !px-0 !py-0 !pt-0 !pb-0 !p-0 !justify-start !min-h-96 h-136 border-(--ui-border-muted) bg-(--ui-bg) */
</style>
