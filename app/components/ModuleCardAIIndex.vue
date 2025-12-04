<script lang="ts" setup>
const module = {
  label: 'Nuxt AI Ready',
  description: 'Best practice AI & LLM discoverability for Nuxt sites ',
  icon: 'i-carbon-ai-label',
  scheduled: '12th October 2025',
}

const items = [
  { slot: 'one', emoji: '📝', label: 'Markdown for LLMs', description: 'Zero config markdown powered by [Mdream](https://github.com/harlan-zw/mdream).' },
  { slot: 'two', emoji: '🤖', label: 'Model Context Protocol (MCP)', description: 'Enable Claude and other AI agents to directly read and search your site.' },
  { slot: 'three', emoji: '🔍', label: 'Semantic & Full-Text Search', description: 'Let AI agents search your content by meaning or keywords.' },
]
</script>

<template>
  <ModuleFeaturesCard :module="module" :items="items" />
</template>
