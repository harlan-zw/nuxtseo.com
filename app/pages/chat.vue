<script setup lang="ts">
import { getTextFromMessage } from '@nuxt/ui/utils/ai'

const route = useRoute()
const input = ref((route.query.q as string) || '')
const chat = useAskAi()

function handleSubmit(e: Event) {
  e.preventDefault()
  if (!input.value.trim())
    return

  chat.sendMessage({ text: input.value })
  input.value = ''
}

// Handle initial query from URL
onMounted(() => {
  if (route.query.q) {
    chat.sendMessage({ text: route.query.q as string })
  }
})
</script>

<template>
  <UContainer>
    <UDashboardPanel>
      <template #header>
        <div class="flex items-center justify-between px-4 py-3 border-b border-[var(--ui-border)]">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-bot" class="size-6 text-[var(--ui-text-primary)]" />
            <div>
              <h1 class="text-lg font-semibold text-[var(--ui-text)]">
                AI Chat
              </h1>
              <p class="text-sm text-[var(--ui-text-muted)]">
                Ask questions about Nuxt SEO
              </p>
            </div>
          </div>

          <UButton
            to="/"
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            size="sm"
            aria-label="Close chat"
          />
        </div>
      </template>

      <template #body>
        <UContainer class="h-full flex flex-col">
          <UChatMessages
            :messages="chat.messages || []"
            :status="chat.status"
            should-auto-scroll
            :user="{
              avatar: { icon: 'i-lucide-user' },
              variant: 'soft',
              side: 'right',
            }"
            :assistant="{
              avatar: { icon: 'i-lucide-bot' },
              variant: 'naked',
              side: 'left',
            }"
          >
            <template #content="{ message }">
              <MDC
                :value="getTextFromMessage(message)"
                :cache-key="message.id"
                unwrap="p"
                class="prose prose-sm dark:prose-invert max-w-none"
              />
            </template>

            <template #actions="{ message }">
              <div class="flex gap-1">
                <UButton
                  icon="i-lucide-copy"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  aria-label="Copy message"
                  @click="() => navigator.clipboard.writeText(getTextFromMessage(message))"
                />
                <UButton
                  v-if="message.role === 'assistant'"
                  icon="i-lucide-thumbs-up"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  aria-label="Good response"
                />
                <UButton
                  v-if="message.role === 'assistant'"
                  icon="i-lucide-thumbs-down"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  aria-label="Bad response"
                />
              </div>
            </template>

            <template #indicator>
              <div class="flex items-center gap-2 text-[var(--ui-text-muted)]">
                <UIcon name="i-lucide-loader" class="size-4 animate-spin" />
                <span class="text-sm">Thinking...</span>
              </div>
            </template>
          </UChatMessages>
        </UContainer>
      </template>

      <template #footer>
        <UContainer class="pb-4">
          <UChatPrompt
            v-model="input"
            :error="chat.error"
            variant="subtle"
            placeholder="Ask anything about Nuxt SEO..."
            @submit="handleSubmit"
          >
            <template #header>
              <UBadge
                v-if="chat.error"
                color="error"
                variant="subtle"
                size="sm"
              >
                {{ chat.error.message }}
              </UBadge>
            </template>

            <UChatPromptSubmit
              :status="chat.status"
              class="rounded-full"
              @stop="chat.stop"
              @reload="chat.regenerate"
            />

            <template #footer>
              <div class="flex items-center justify-between w-full text-xs text-[var(--ui-text-muted)]">
                <span>Press <UKbd>Enter</UKbd> to send, <UKbd>Esc</UKbd> to clear</span>
                <span v-if="chat.messages?.length">{{ chat.messages.length }} messages</span>
              </div>
            </template>
          </UChatPrompt>
        </UContainer>
      </template>
    </UDashboardPanel>
  </UContainer>
</template>
