<script setup lang="ts">
import { defineBaseCommands, defineBaseKeymap, defineHistory } from '@prosekit/core'
import { defineCode } from '@prosekit/extensions/code'
import { defineCodeBlock } from '@prosekit/extensions/code-block'
import { defineDoc } from '@prosekit/extensions/doc'
import { defineGapCursor } from '@prosekit/extensions/gap-cursor'
import { defineList } from '@prosekit/extensions/list'
import { defineModClickPrevention } from '@prosekit/extensions/mod-click-prevention'
import { defineParagraph } from '@prosekit/extensions/paragraph'
import { defineText } from '@prosekit/extensions/text'
import { defineVirtualSelection } from '@prosekit/extensions/virtual-selection'
import { createEditor, union } from 'prosekit/core'
import { definePlaceholder } from 'prosekit/extensions/placeholder'
import { ProseKit } from 'prosekit/vue'
import { onMounted, onUnmounted, ref } from 'vue'

import 'prosekit/basic/style.css'

interface AskAiInputProps {
  placeholder?: string
}

const props = withDefaults(defineProps<AskAiInputProps>(), {
  placeholder: 'How can I help you today?',
})

function defineExtension() {
  return union(
    defineDoc(),
    defineText(),
    defineParagraph(),
    defineCode(),
    defineCodeBlock(),
    defineList(),
    defineBaseCommands(),
    defineBaseKeymap(),
    defineGapCursor(),
    defineHistory(),
    defineVirtualSelection(),
    defineModClickPrevention(),
    definePlaceholder({ placeholder: props.placeholder, strategy: 'doc' }),
  )
}

const editor = createEditor({ extension: defineExtension() })
const editorRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (editorRef.value) {
    editor.mount(editorRef.value)

    // Handle Enter key to submit form (unless Shift+Enter for newline)
    editorRef.value.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        // Find and submit the parent form
        const form = editorRef.value?.closest('form')
        if (form) {
          form.requestSubmit()
        }
      }
    })
  }
})

onUnmounted(() => {
  editor.unmount()
})
</script>

<template>
  <ProseKit :editor="editor">
    <div
      ref="editorRef"
      spellcheck="false"
      class="ProseMirror w-full rounded-md border-0 appearance-none placeholder:text-dimmed focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors px-2.5 py-1.5 gap-1.5 text-highlighted bg-transparent resize-none pe-9 text-base/5"
    />
  </ProseKit>
</template>
