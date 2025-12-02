<script setup lang="ts">
import { motion } from 'motion-v'

defineProps<{
  hideToolbar?: boolean
}>()

const input = ref<HTMLInputElement | null>(null)

const isClicked = ref(false)

function handleClick() {
  isClicked.value = true
  setTimeout(() => {
    isClicked.value = false
  }, 300)
}

function onSubmit(e?: Event) {
  e?.preventDefault()
  e?.stopPropagation()
  navigateTo(`/chat?q=${encodeURIComponent(input.value?.value || '')}`)
  return false
}
</script>

<template>
  <div v-if="!hideToolbar" class="left-0 right-0 sticky sm:px-4 pb-4 sm:pb-6 bottom-6 pt-1 flex flex-col items-center w-full overflow-hidden z-20">
    <motion.div
      class="z-10 w-full sm:w-80 duration-300 transition-all focus-within:w-full"
      :class="[
        isClicked ? 'sm:!w-[calc(20rem*1.3)]' : 'sm:focus-within:w-[26rem]',
      ]"
    >
      <form @submit.prevent="onSubmit">
        <motion.div
          :initial="{ scale: 1 }"
          :while-hover="{ scale: 1.1 }"
          as="div"
          class="pl-5 pr-3 border border-[var(--ui-border)] rounded-2xl bg-[var(--ui-bg-elevated)]/90 backdrop-blur-xl shadow-2xl shadow-gray-900/5 flex items-center justify-between focus-within:border-primary transition-colors duration-400"
        >
          <input
            ref="input"
            type="text"
            placeholder="Ask a question..."
            aria-label="Ask a question..."
            class="py-3 flex-1 bg-transparent text-[var(--ui-text)] placeholder-[var(--ui-text-muted)] outline-none outline-0 text-base sm:text-sm"
            @click="handleClick"
          >
          <UButton
            icon="i-lucide-arrow-up"
            color="primary"
            variant="soft"
            size="xs"
            type="submit"
            aria-label="Send message"
            class="size-7 rounded-full"
          />
        </motion.div>
      </form>
    </motion.div>

    <div class="fixed sm:hidden left-0 right-0 bottom-0 h-12 bg-[var(--ui-bg)]" />
  </div>
</template>
