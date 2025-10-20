<script setup lang="ts">
import { motion } from 'motion-v'

const { isOpen, query } = useAiSearchDrawer()
const inputRef = ref<HTMLInputElement>()
const isClicked = ref(false)

const animateProps = { opacity: 1, y: 0, transition: { duration: 500 } }

const keys = useMagicKeys()
const cmdK = keys['Meta+K']
const ctrlK = keys['Ctrl+K']

whenever(cmdK, (v) => {
  if (v) {
    inputRef.value?.focus()
  }
})

whenever(ctrlK, (v) => {
  if (v) {
    inputRef.value?.focus()
  }
})

function handleClick() {
  isClicked.value = true
  setTimeout(() => {
    isClicked.value = false
  }, 300)
}

function handleSubmit() {
  if (query.value) {
    isOpen.value = true
    query.value = ''
  }
}
</script>

<template>
  <div v-if="!isOpen" class="left-0 right-0 sticky sm:px-4 pb-4 sm:pb-6 bottom-6 pt-1 flex flex-col items-center w-full overflow-hidden z-20">
    <motion.div
      class="z-10 w-full sm:w-80 duration-300 transition-all focus-within:w-full"
      :class="[
        isClicked ? 'sm:!w-[calc(20rem*1.3)]' : 'sm:focus-within:w-[26rem]',
      ]"
    >
      <motion.form
        :initial="{ scale: 1 }"
        :while-hover="{ scale: 1.1 }"
        class="pl-5 pr-3 border border-[var(--ui-border)] rounded-2xl bg-[var(--ui-bg-elevated)]/90 backdrop-blur-xl shadow-2xl shadow-gray-900/5 flex items-center justify-between focus-within:border-primary transition-colors duration-400"
        @click="handleClick"
        @submit.prevent="handleSubmit"
      >
        <input
          ref="inputRef"
          v-model="query"
          placeholder="Ask a question..."
          aria-label="Ask a question..."
          class="py-3 flex-1 bg-transparent text-[var(--ui-text)] placeholder-[var(--ui-text-muted)] outline-none outline-0 text-base sm:text-sm"
          type="text"
        >
        <span class="text-xs font-semibold mx-2 select-none pointer-events-none text-[var(--ui-text-muted)]">
          ⌘K
        </span>
        <UButton
          icon="i-lucide-arrow-up"
          :disabled="!query"
          color="primary"
          variant="soft"
          size="xs"
          type="submit"
          aria-label="Send message"
          class="size-7 rounded-full"
        />
      </motion.form>
    </motion.div>

    <div class="fixed sm:hidden left-0 right-0 bottom-0 h-12 bg-[var(--ui-bg)]" />
  </div>
</template>
