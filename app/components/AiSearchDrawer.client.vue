<script setup lang="ts">
import { useAISearch } from '#imports'
import { motion } from 'motion-v'

const { isOpen, query: initialQuery } = useAiSearchDrawer()

const ai = useAISearch({
  mode: 'chat',
  sessionKey: 'nuxt-seo-ai-chat',
})

interface UIMessage {
  id: string
  role: 'user' | 'assistant'
  parts: { type: 'text', text: string }[]
}

const drawerWidth = ref(572)
const isResizing = ref(false)

// Transform AI messages to UI format
const uiMessages = computed<UIMessage[]>(() =>
  (ai.messages.value || []).map(msg => ({
    id: msg.id,
    role: msg.role,
    parts: [{ type: 'text', text: msg.content }],
  })),
)

const status = computed<'ready' | 'submitted' | 'streaming' | 'error'>(() => {
  if (ai.error.value)
    return 'error'
  if (ai.isLoading.value)
    return 'streaming'
  return 'ready'
})

function handleClose() {
  isOpen.value = false
}

function handleClear() {
  ai.clearSession()
}

function handleSubmit(e: Event) {
  e.preventDefault()
  if (!ai.query.value.trim())
    return
  ai.sendMessage()
}

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

// Submit initial query when drawer opens
watch(isOpen, (open) => {
  if (open && initialQuery.value) {
    ai.query.value = initialQuery.value
    nextTick(() => ai.sendMessage())
  }
})
</script>

<template>
  <component
    :is="motion?.div || 'div'"
    :initial="{ width: 0 }"
    :animate="isOpen ? { width: drawerWidth } : { width: 0 }"
    :transition="{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }"
    class="relative"
    :style="{
      minWidth: isOpen ? '368px' : '0px',
      maxWidth: isOpen ? '576px' : '0px',
      flexShrink: 0,
      flexGrow: 0,
      flexBasis: isOpen ? `${drawerWidth}px` : '0px',
    }"
  >
    <!-- Fixed drawer content -->
    <div
      v-if="isOpen"
      class="fixed right-0 z-20 bg-[var(--ui-bg)] border-l border-[var(--ui-border)] flex flex-col overflow-hidden"
      :style="{ width: `${drawerWidth}px`, height: 'calc(100vh - 70px)', top: '70px' }"
    >
      <!-- Resize handle -->
      <div
        class="absolute -left-1 top-0 bottom-0 w-1 cursor-col-resize hover:bg-gray-200/70 dark:hover:bg-white/[0.07] z-10"
        @mousedown="startResize"
      />

      <div class="w-full flex flex-col pb-4 h-full pt-3">
        <!-- Header -->
        <div class="flex items-center justify-between pb-3 px-4">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" class="size-5 text-primary dark:text-primary-light">
              <g fill="currentColor">
                <path d="M5.658,2.99l-1.263-.421-.421-1.263c-.137-.408-.812-.408-.949,0l-.421,1.263-1.263,.421c-.204,.068-.342,.259-.342,.474s.138,.406,.342,.474l1.263,.421,.421,1.263c.068,.204,.26,.342,.475,.342s.406-.138,.475-.342l.421-1.263,1.263-.421c.204-.068,.342-.259,.342-.474s-.138-.406-.342-.474Z" fill="currentColor" data-stroke="none" stroke="none" />
                <polygon points="9.5 2.75 11.412 7.587 16.25 9.5 11.412 11.413 9.5 16.25 7.587 11.413 2.75 9.5 7.587 7.587 9.5 2.75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
              </g>
            </svg>
            <span class="font-semibold text-[var(--ui-text)]">Assistant</span>
          </div>
          <div class="flex items-center gap-1">
            <UButton
              icon="i-lucide-trash-2"
              variant="ghost"
              size="xs"
              color="neutral"
              aria-label="Clear chat"
              @click="handleClear"
            />
            <UButton
              icon="i-lucide-x"
              variant="ghost"
              size="xs"
              color="neutral"
              aria-label="Close drawer"
              @click="handleClose"
            />
          </div>
        </div>

        <!-- Chat content -->
        <UChatMessages
          :messages="uiMessages"
          :status="status"
          :should-scroll-to-bottom="false"
          class="flex-1 px-4 overflow-y-auto"
          :user="{
            variant: 'soft',
            side: 'right',
          }"
          :assistant="{
            icon: 'i-lucide-sparkles',
            variant: 'naked',
            side: 'left',
            actions: [
              { 'icon': 'i-lucide-thumbs-up', 'color': 'neutral', 'variant': 'ghost', 'size': 'xs', 'aria-label': 'Vote that response was good' },
              { 'icon': 'i-lucide-thumbs-down', 'color': 'neutral', 'variant': 'ghost', 'size': 'xs', 'aria-label': 'Vote that response was not good' },
              { 'icon': 'i-lucide-copy', 'color': 'neutral', 'variant': 'ghost', 'size': 'xs', 'aria-label': 'Copy chat response' },
              { 'icon': 'i-lucide-refresh-cw', 'color': 'neutral', 'variant': 'ghost', 'size': 'xs', 'aria-label': 'Reload last chat' },
            ],
          }"
        >
          <template #content="{ message }">
            <div class="prose prose-sm dark:prose-invert">
              <p class="whitespace-pre-line">
                {{ message.parts[0]?.text }}
              </p>
            </div>
          </template>
        </UChatMessages>

        <!-- Input area -->
        <div class="px-4">
          <UChatPrompt
            v-model="ai.query.value"
            variant="subtle"
            :autofocus="false"
            @submit="handleSubmit"
          >
            <template #trailing>
              <UButton
                icon="i-lucide-arrow-up"
                :disabled="!ai.query.value.trim()"
                color="primary"
                variant="soft"
                size="xs"
                type="submit"
                aria-label="Send message"
                class="rounded-full"
              />
            </template>
          </UChatPrompt>
        </div>
      </div>
    </div>
  </component>
</template>
