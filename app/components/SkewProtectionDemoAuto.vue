<script setup lang="ts">
const state = ref<'idle' | 'checking' | 'available'>('idle')
const containerRef = ref<HTMLElement>()

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && state.value === 'idle') {
        state.value = 'checking'
        setTimeout(() => {
          state.value = 'available'
        }, 2000)
      }
    })
  })

  if (containerRef.value)
    observer.observe(containerRef.value)

  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <div ref="containerRef" class="relative min-h-[120px] flex items-center justify-center bg-[var(--ui-bg)] rounded-lg border border-[var(--ui-border)] p-4">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
      mode="out-in"
    >
      <div v-if="state === 'checking'" key="checking" class="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-full shadow-lg ring-1 ring-gray-200 dark:ring-gray-800 px-4 py-3">
        <UIcon name="i-heroicons-arrow-path-20-solid" class="animate-spin text-[var(--ui-text-muted)]" />
        <div class="text-sm font-medium text-[var(--ui-text-muted)]">
          Checking for updates...
        </div>
      </div>

      <div v-else-if="state === 'available'" key="available" class="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-full shadow-lg ring-1 ring-gray-200 dark:ring-gray-800 px-4 py-3">
        <span class="text-lg">✨</span>
        <div class="text-sm font-medium">
          Update available
        </div>
      </div>
    </Transition>
  </div>
</template>
