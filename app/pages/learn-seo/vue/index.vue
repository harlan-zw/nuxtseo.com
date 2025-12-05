<script setup lang="ts">
definePageMeta({
  layout: 'learn',
})

const topics = [
  {
    title: 'Mastering Meta',
    description: 'Learn how to write effective meta tags that drive clicks and improve rankings.',
    icon: 'i-heroicons-h1-solid',
    to: '/learn-seo/vue/mastering-meta',
  },
  {
    title: 'Controlling Crawlers',
    description: 'Understand robots.txt, sitemaps, and how to guide search engine crawlers.',
    icon: 'i-ph-robot-duotone',
    to: '/learn-seo/vue/controlling-crawlers',
  },
  {
    title: 'Launch & Listen',
    description: 'Best practices for launching your site and monitoring SEO performance.',
    icon: 'i-ph-rocket-duotone',
    to: '/learn-seo/vue/launch-and-listen',
  },
  {
    title: 'Routes & Rendering',
    description: 'Optimize your routing strategy and rendering modes for SEO.',
    icon: 'i-carbon-recording',
    to: '/learn-seo/vue/routes-and-rendering',
  },
  {
    title: 'Staying Secure',
    description: 'Security practices that also benefit your SEO.',
    icon: 'i-carbon-security',
    to: '/learn-seo/vue/security',
  },
]

useSeoMeta({
  title: 'Learn SEO for Vue',
  description: 'Master SEO fundamentals with practical guides tailored for Vue developers.',
})
</script>

<template>
  <div class="py-10">
    <div class="text-center mb-10">
      <h1 class="text-3xl font-bold mb-3">
        Learn SEO for Vue
      </h1>
      <p class="text-[var(--ui-text-muted)] max-w-xl mx-auto">
        Master SEO fundamentals with practical guides tailored for Vue developers.
      </p>
    </div>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="topic in topics"
        :key="topic.to"
        :to="topic.to"
        class="group p-5 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-bg)] hover:bg-[var(--ui-bg-elevated)] hover:border-[var(--ui-border-accented)] transition-all"
      >
        <UIcon :name="topic.icon" class="size-8 mb-3 text-[var(--ui-primary)]" />
        <h2 class="font-semibold mb-1 group-hover:text-[var(--ui-primary)]">
          {{ topic.title }}
        </h2>
        <p class="text-sm text-[var(--ui-text-muted)]">
          {{ topic.description }}
        </p>
      </NuxtLink>
    </div>
  </div>
</template>
