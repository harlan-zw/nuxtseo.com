<script lang="ts" setup>
const module = {
  label: 'Nuxt Skew Protection',
  description: 'Zero-config real-time notifications and long-lived build assets to avoid breaking crawlers and old sessions.',
  icon: 'i-carbon-update-now',
  scheduled: '12th October 2025',
}

const items = [
  { slot: 'one', emoji: '🕷️', label: 'Persistent Build Assets', description: 'Previous build artifacts stay accessible across deploys. No more 500s from crawlers or broken sessions.' },
  { slot: 'two', emoji: '⚡', label: 'Instant Update Prompts', description: 'Zero-config real-time notifications when a new version is deployed.' },
  { slot: 'three', emoji: '🎯', label: 'Chunk-Aware Targeting', description: 'Only prompt users when their loaded chunks are invalidated. No noise for unrelated updates.' },
]
</script>

<template>
  <ModuleFeaturesCard :module="module" :items="items" />
</template>
