<script lang="ts" setup>
const module = {
  label: 'Magic Redirects',
  description: 'Never worry about a 404 again with zero-config redirects that feel like magic.',
  icon: 'i-carbon-direction-loop-right',
  scheduled: '12th October 2025',
}

const items = [
  { slot: 'one', emoji: '⚡', label: 'Automatic 301 Redirects', description: 'Zero-config redirects when you move or rename pages.' },
  { slot: 'two', emoji: '🔍', label: 'Analytics & Monitoring', description: 'Track production 404 links and redirect usages to optimize your site.' },
  { slot: 'three', emoji: '🔄', label: 'Advanced Pattern Matching', description: 'Safer redirects with RegExp support and infinite loop detection.' },
]
</script>

<template>
  <ModuleFeaturesCard :module="module" :items="items" />
</template>
