<script setup lang="ts">
import { useAskAi } from '#imports'
import { getTextFromMessage } from '@nuxt/ui/utils/ai'
import { motion } from 'motion-v'

const props = defineProps<{
  showDrawer?: boolean
  initialInput?: string
}>()

const input = ref(props.initialInput)

const chat = useAskAi()

const drawerWidth = ref(572)
const isResizing = ref(false)

function handleResize(e: MouseEvent) {
  if (!isResizing.value)
    return

  const newWidth = window.innerWidth - e.clientX
  drawerWidth.value = Math.max(368, Math.min(576, newWidth))
}

function startResize() {
  isResizing.value = true
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

function stopResize() {
  isResizing.value = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

function handleSubmit(e) {
  e.preventDefault()
  chat.sendMessage({ text: input.value })
  input.value = ''
}
</script>

<template>
  <motion.div
    :initial="{ width: 0 }"
    :animate="showDrawer ? { width: drawerWidth } : { width: 0 }"
    :transition="{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }"
    :style="{
      minWidth: showDrawer ? '368px' : '0px',
      maxWidth: showDrawer ? '576px' : '0px',
      flexShrink: 0,
      flexGrow: 0,
      flexBasis: showDrawer ? `${drawerWidth}px` : '0px',
    }"
  >
    <!-- Fixed drawer content -->
    <div
      v-if="showDrawer"
      class="fixed right-0 max-h-[500px] overflow-y-scroll z-20 bg-[var(--ui-bg)] border-l border-[var(--ui-border)] flex flex-col overflow-hidden"
      :style="{ width: `${drawerWidth}px`, height: 'calc(100vh - 70px)', top: '70px' }"
    >
      <!-- Resize handle -->
      <div
        class="absolute -left-1 top-0 bottom-0 w-1 cursor-col-resize hover:bg-gray-200/70 dark:hover:bg-white/[0.07] z-10"
        @mousedown="startResize"
      />

      <div class="w-full flex flex-col pb-4 h-full pt-3 px-5">
        <UChatMessages :should-auto-scroll="false" :should-scroll-to-bottom="false" :messages="chat.messages || []" :status="chat.status">
          <template #content="{ message }">
            <MDC :value="getTextFromMessage(message)" :cache-key="message.id" unwrap="p" />
          </template>
        </UChatMessages>
        <UChatPrompt v-model="input" :error="chat.error" @submit="handleSubmit">
          <UChatPromptSubmit :status="chat.status" @stop="chat.stop" @reload="chat.regenerate" />
        </UChatPrompt>
      </div>
    </div>
  </motion.div>
</template>
