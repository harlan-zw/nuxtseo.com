import type { ChatInit } from 'ai'
import { createIdGenerator } from '@ai-sdk/provider-utils'
import { Chat } from '@ai-sdk/vue'

export interface UseAISearchOptions extends Partial<ChatInit<any>> {
  api?: string
  sessionKey?: string
  mode?: 'list' | 'generate' | 'summarize'
}

/**
 * Composable for AI-powered chat with RAG
 *
 * @param options - Configuration options
 * @returns Chat instance (chat.messages is reactive)
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * const chat = useAskAi()
 * </script>
 *
 * <template>
 *   <div v-for="message in chat.messages">
 *     {{ message.role }}: {{ message.parts[0].text }}
 *   </div>
 * </template>
 * ```
 */
// @ts-expect-error - Chat type requires generic but it's inferred correctly
export function useAskAi(options: UseAISearchOptions = {}): Chat {
  const { api, sessionKey, transport, ...chatOptions } = options

  return new Chat({
    generateId: createIdGenerator({ prefix: 'msg', size: 16 }),
    ...chatOptions,
  })
}
