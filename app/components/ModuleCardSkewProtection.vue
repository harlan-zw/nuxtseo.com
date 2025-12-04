<script lang="ts" setup>
const module = {
  label: 'Nuxt Skew Protection',
  description: 'Solve Nuxt version skew with persistent assets and instant updates.',
  icon: 'i-carbon-update-now',
  scheduled: '12th October 2025',
}

const items = [
  { slot: 'one', emoji: '🕷️', label: 'Persistent Build Assets', description: 'Previous build artifacts remain accessible, so crawlers and stale sessions never hit dead ends.' },
  { slot: 'two', emoji: '⚡', label: 'Instant Update Prompts', description: 'Zero-config real-time notifications on deploy. Users adopt your latest build immediately.' },
  { slot: 'three', emoji: '🎯', label: 'Chunk-Aware Targeting', description: 'Notifications fire only when the user\'s loaded chunks are invalidated. No noise for unrelated updates.' },
  { slot: 'four', emoji: '🎨', label: 'Headless UI', description: 'Drop-in notification component with first-class Nuxt UI support.' },
]
</script>

<template>
  <ModuleFeaturesCard :module="module" :items="items" />
</template>
