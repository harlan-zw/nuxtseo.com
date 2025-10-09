<script lang="ts" setup>
const module = {
  label: 'Nuxt Skew Protection',
  description: 'Zero-config real-time notifications and long-lived build assets to avoid breaking crawlers and old sessions.',
  icon: 'i-carbon-update-now',
  scheduled: '12th October 2025',
}

const items = [
  { slot: 'one', emoji: '⚡', label: 'Instantly Adopted Releases', description: 'Zero-config real-time notifications to users when a new version is deployed.' },
  { slot: 'two', emoji: '🎯', label: 'Intelligent User Notifications', description: 'Avoid spamming users by only sending update notifications when their chunks are outdated.' },
  { slot: 'three', emoji: '📦', label: 'Long-lived Build Assets', description: 'No more 500 errors from Google. Previous build assets remain accessible for crawlers and old sessions.' },
]
</script>

<template>
  <ModuleFeaturesCard :module="module" :items="items" />
</template>
