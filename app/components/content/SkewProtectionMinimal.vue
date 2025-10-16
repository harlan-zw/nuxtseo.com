<script lang="ts" setup>
const { data: md } = await useAsyncData(() => parseMarkdown(`
\`\`\`vue [app.vue]
<template>
<SkewNotification v-slot="{ isCurrentChunksOutdated, dismiss, reload }" force-open>
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div v-if="isCurrentChunksOutdated" class="fixed bottom-4 right-4 z-50">
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
</template>
\`\`\``))
</script>

<template>
  <ProseCodeGroup>
    <div label="Live Example">
      <div class="not-prose mt-3">
        <div class="inline-block">
          <div class="z-50">
            <div class="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-full shadow-lg ring-1 ring-gray-200 dark:ring-gray-800 px-4 py-3">
              <span class="text-lg">✨</span>
              <div class="text-sm font-medium">
                Update available
              </div>
              <UButton color="primary" size="xs" label="Refresh" />
              <UButton color="primary" variant="ghost" size="xs" icon="i-heroicons-x-mark-20-solid" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div label="Code">
      <MDCRenderer v-bind="md" />
    </div>
  </ProseCodeGroup>
</template>
