<script lang="ts" setup>
const module = {
  label: 'LLMWise',
  description: 'Crawls your site running 86 framework-targeted audits, pulling data from 4 Google APIs with complete local control.',
  icon: 'i-carbon-ai-governance-tracked',
  scheduled: 'Q2 2025',
}

const items = [
  { slot: 'one', emoji: '🛠️', label: '86 Framework-Specific Audits', description: 'From SEO to performance, accessibility to best practices, LLMWise has you covered.' },
  { slot: 'two', emoji: '🌐', label: '4 Google API Integrations', description: 'CrUX, Google Search Console, PageSpeed Insights, Google Analytics.' },
  { slot: 'three', emoji: '📜', label: '1 Year License Included', description: 'Includes 1 year license for LLMWise when it ships.' },
]
</script>

<template>
  <ModuleFeaturesCard :module="module" :items="items" />
</template>
