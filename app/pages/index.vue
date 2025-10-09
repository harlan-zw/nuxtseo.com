<script setup lang="ts">
import { useAsyncData } from '#imports'
import { useElementHover, useTransition, useWindowScroll } from '@vueuse/core'
import { motion } from 'motion-v'
import { ref } from 'vue'
import { reviews, useStats } from '~/composables/data'
import { humanNumber } from '~/composables/format'
import { modules } from '~/composables/module'

definePageMeta({
  breadcrumb: {
    icon: 'i-heroicons-home',
    ariaLabel: 'Home',
  },
})

const { data: stats } = await useStats()

useSeoMeta({
  title: '%siteName %separator All-in-one Technical SEO for Nuxt',
  ogTitle: '%siteName %separator All-in-one Technical SEO for Nuxt',
  titleTemplate: null,
})

const { data: sponsors } = await useFetch('/api/github/sponsors.json', {
  key: 'sponsors',
})

defineOgImageComponent('Home', {
  title: 'Nuxt SEO',
  version: useRuntimeConfig().public.version,
})

interface JSConfettiApi {
  addConfetti: (options?: { emojis: string[] }) => void
}
declare global {
  interface Window {
    JSConfetti: { new (): JSConfettiApi }
  }
}

const confetti = useScript<JSConfettiApi>({
  key: 'confetti',
  src: 'https://cdn.jsdelivr.net/npm/js-confetti@latest/dist/js-confetti.browser.js',
}, {
  trigger: 'manual',
  use() {
    if (window.JSConfetti)
      return new window.JSConfetti()
  },
})

const scoreEl = ref()
const score = ref<number>(0)
const output = useTransition(score)
function clickScore() {
  score.value = 1
  setTimeout(() => {
    confetti.addConfetti({ emojis: ['🎉', '🎊', '🎈'] })
  }, 200)
}
// on scroll we'll increment the score
onMounted(() => {
  const scoreHovered = useElementHover(scoreEl.value)
  const endHoverWatch = watch(scoreHovered, (hovered) => {
    if (hovered) {
      confetti.load()
      endHoverWatch()
    }
  })
  const { y: windowScrollY } = useWindowScroll()
  const endScrollWatch = watch(windowScrollY, (y) => {
    const { top, height } = scoreEl.value.getBoundingClientRect()
    const _score = Math.max(0, Math.min(1, 1 - ((top - height) / y)))
    if (score.value === 1) {
      endScrollWatch()
      return
    }
    if (_score !== score.value)
      score.value = _score
  })
})

useServerHead({
  link: [
    {
      rel: 'dns-prefetch',
      href: 'https://avatars.githubusercontent.com',
    },
  ],
})

const { data: snippets } = await useAsyncData(`home-snippets`, () => queryCollection('snippets').where('path', 'LIKE', '/home/%').all(),
)

function useContentHomeSnippets(folderName: string) {
  // Get special slot names based on folder
  const getSpecialSlot = (index: number): string => {
    if (index === 0) {
      // For first item in each category
      const specialFirstSlots: Record<string, string> = {
        'robots': 'robots-txt',
        'sitemap': 'sitemap',
        'schema-org': 'schemaOrg',
        'link-checker': 'meta1',
        'seo-utils-one': 'meta',
        'seo-utils-two': 'meta1',
        'og-image': 'meta',
      }
      return specialFirstSlots[folderName] || `${folderName}-txt`
    }

    // For other items, stick to meta, meta2, meta3 pattern
    return ['meta', 'meta2', 'meta3'][index - 1] || 'meta'
  }

  // Map each file to the format needed for ModuleFeaturesCard
  return snippets.value?.filter(n => n.path.includes(folderName)).map((file, index) => {
    // Get appropriate slot based on index and folder
    const slot = getSpecialSlot(index)

    return {
      ...file,
      label: file.title,
      slot,
    }
  }) || []
}

// Using content/snippets/home/robots/ markdown files
const robotsItems = useContentHomeSnippets('robots')

// Using content/snippets/home/sitemap/ markdown files
const sitemapItems = useContentHomeSnippets('sitemap')

// Using content/snippets/home/schema-org/ markdown files
const schemaOrgItems = useContentHomeSnippets('schema-org')

// Using content/snippets/home/seo-utils-one/ markdown files
const seoUtilOneItems = useContentHomeSnippets('seo-utils-one')

// Using content/snippets/home/og-image/ markdown files
const ogImageItems = useContentHomeSnippets('og-image')

// Using content/snippets/home/seo-utils-two/ markdown files
const seoUtilsTwoItems = useContentHomeSnippets('seo-utils-two')

// Using content/snippets/home/link-checker/ markdown files
const linkCheckerItems = useContentHomeSnippets('link-checker')

const [DefineSectionTemplate, ReuseSectionTemplate] = createReusableTemplate()
</script>

<template>
  <div>
    <DefineSectionTemplate v-slot="{ section, $slots }">
      <section class="mb-8 xl:mb-14">
        <div class="xl:grid xl:max-w-full max-w-3xl mx-auto px-5 sm:px-10 xl:px-0 grid-cols-6">
          <div class="col-span-1 xl:border-t pt-5 px-5 xl:p-0" :class="[section.bg, section.border]">
            <div class="sticky top-[80px] xl:py-10 flex xl:justify-end mr-5">
              <div class=" text-4xl font-mono flex  items-center gap-3">
                {{ section.id }}. <UIcon :name="section.icon" class="w-10 h-10" />
              </div>
            </div>
          </div>
          <div class="col-span-1 p-5 xl:p-0 relative xl:rounded-r-[70px] xl:pr-7 h-full xl:border-t xl:border-r xl:bottom-b xl:px-4 xl:py-10" :class="[section.bg, section.border]">
            <div class="relative flex items-center gap-3 sticky top-[100px]">
              <div>
                <h2 class="text-3xl text-balance text-neutral-700 dark:text-neutral-100 leading-tight font-bold mb-3 flex items-center gap-2">
                  {{ section.title }}
                </h2>
                <div class="text-balance dark:text-neutral-300/80 text-neutral-600">
                  {{ section.description }}
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-3 py-10 2xl:px-14 xl:pl-5">
            <div class="xl:grid flex flex-col grid-cols-2 2xl:px-5 2xl:gap-10 gap-5">
              <div>
                <component :is="$slots.a" />
              </div>
              <div>
                <component :is="$slots.b" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </DefineSectionTemplate>

    <div class="gradient" />
    <UContainer>
      <section class="xl:max-w-full xl:grid grid-cols-2 max-w-3xl mx-auto py-5 sm:py-12 xl:py-15">
        <div class="max-w-2xl mx-auto">
          <div class="mb-2 sm:mb-0">
            <div class="sm:inline-flex block mb-2 gap-3 inline px-3 py-2 rounded text-sm ">
              <UButton variant="outline" to="/announcement" size="sm">
                <UIcon name="i-noto-party-popper" />
                <span>Nuxt SEO v2 stable</span>
              </UButton>
            </div>
          </div>
          <div class="xl:flex gap-10">
            <div class="flex flex-col justify-center">
              <h1 class="text-neutral-900/90 dark:text-neutral-100 text-4xl md:text-6xl leading-tight font-bold tracking-tight" style="line-height: 1.3;">
                <span class="extra-italic">Fully equipped</span> <span class="font-cursive dark:text-yellow-200 text-blue-400 px-1">Technical SEO</span> for busy <span class="bg-green-500/10 px-2"> Nuxters</span>.
              </h1>
              <p class="max-w-xl text-neutral-700 dark:text-neutral-300 mt-4 max-w-3xl text-base md:text-xl">
                Nuxt SEO is a collection of  <NuxtLink to="https://nuxt.com/modules" class="font-semibold">
                  modules
                </NuxtLink> that handle all of the technical aspects in growing your sites organic traffic.
              </p>

              <div class="flex mb-5 items-center gap-4 mt-5 md:mt-10  justify-start">
                <UButton size="lg" to="/docs/nuxt-seo/getting-started/introduction">
                  Get Started
                </UButton>
                <UButton size="lg" icon="i-carbon-download" variant="ghost" to="/docs/nuxt-seo/getting-started/installation">
                  Install Nuxt SEO
                </UButton>
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-center h-full xl:mr-50 mt-7 xl:mt-0">
          <div class="flex flex-wrap xl:max-w-[400px] items-center gap-6 justify-center">
            <motion.div
              v-for="(module, i) in modules.filter(m => m.slug !== 'nuxt-seo' && m.slug !== 'site-config')"
              :key="module.slug"
              layout
              :initial="{
                opacity: 0,
                y: 40,
                scale: 0.8,
                rotateZ: -10,
              }"
              :animate="{
                opacity: 1,
                y: 0,
                scale: 1,
                rotateZ: 0,
                transition: {
                  type: 'spring',
                  damping: 12,
                  stiffness: 100,
                  delay: i * 0.3,
                },
              }"
              :while-hover="{
                scale: 1.1,
                rotateZ: 5,
                y: -5,
                transition: {
                  type: 'spring',
                  damping: 0.10,
                },
              }"
              class="cursor-pointer transform-gpu"
            >
              <NuxtLink :to="module.to">
                <UIcon
                  :name="module.icon"
                  class="size-6 sm:size-10 xl:size-25 text-blue-300"
                />
              </NuxtLink>
            </motion.div>
          </div>
        </div>
      </section>
    </UContainer>
    <ReuseSectionTemplate
      :section="{
        id: 1,
        icon: 'i-noto-spider',
        title: 'Put web crawlers to work.',
        description: 'Providing a robots.txt and sitemap.xml gives web crawlers data on how to index your site.',
        bg: 'dark:bg-pink-500/5 bg-pink-500/15',
        border: 'border-pink-500/10 border-pink-500/50',
      }"
    >
      <template #a>
        <ModuleFeaturesCard module="robots" :items="robotsItems" />
      </template>
      <template #b>
        <ModuleFeaturesCard module="sitemap" :items="sitemapItems" />
      </template>
    </ReuseSectionTemplate>
    <ReuseSectionTemplate
      :section="{
        id: 2,
        icon: 'i-noto-robot',
        title: 'Feed semantic data to hungry bots.',
        description: 'Robots love data, give them what they want with Schema.org and Open Graph tags.',
        bg: 'dark:bg-purple-500/5 bg-purple-500/15',
        border: 'border-purple-500/10 border-purple-500/50',
      }"
    >
      <template #a>
        <ModuleFeaturesCard module="schema-org" :items="schemaOrgItems" />
      </template>
      <template #b>
        <ModuleFeaturesCard module="seo-utils" :items="seoUtilOneItems" />
      </template>
    </ReuseSectionTemplate>
    <ReuseSectionTemplate
      :section="{
        id: 3,
        icon: 'i-noto-sparkles',
        title: 'Humanize it.',
        description: 'Technical SEO doesn\'t just involve robots, make sure your site is human friendly too.',
        bg: 'dark:bg-yellow-500/5 bg-yellow-500/15',
        border: 'border-yellow-500/10 border-yellow-500/50',
      }"
    >
      <template #a>
        <ModuleFeaturesCard module="og-image" :items="ogImageItems" />
      </template>
      <template #b>
        <ModuleFeaturesCard module="seo-utils" :items="seoUtilsTwoItems" />
      </template>
    </ReuseSectionTemplate>
    <ReuseSectionTemplate
      :section="{
        id: 4,
        icon: 'i-noto-potted-plant',
        title: 'Nurture and watch it flourish.',
        description: 'Providing a robots.txt and sitemap.xml gives web crawlers data on how to index your site.',
        bg: 'dark:bg-green-500/5 bg-green-500/15',
        border: 'border-green-500/10 border-green-500/50',
      }"
    >
      <template #a>
        <div class="space-y-6">
          <ModuleFeaturesCard module="link-checker" :items="linkCheckerItems" />
          <ModuleCardSkewProtection />
        </div>
      </template>
      <template #b>
        <div class="mb-8">
          <ModuleCardMagicRedirects />
          <ModuleCardAIIndex />
        </div>
      </template>
    </ReuseSectionTemplate>
    <section class="pb-10 xl:pb-20">
      <UContainer class="mb-10">
        <h2 class="font-bold mb-5 text-3xl">
          Nuxt SEO Principals
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <ShowcaseCard label="Delightful Developer Experience" description="Full featured modules that do everything you expect and more.">
            <UIcon name="i-noto-sparkles" class="w-1/2 h-1/2" />
          </ShowcaseCard>
          <ShowcaseCard label="Zero Config Defaults" description="Provide a site URL and all modules are good to go. Fully extensible with config and hooks.">
            <UIcon name="i-noto-rocket" class="w-1/2 h-1/2" />
          </ShowcaseCard>
          <ShowcaseCard label="Integrate with Ecosystem" description="Modules integrate with themselves as well as Nuxt Content, Nuxt I18n and Nuxt DevTools.">
            <div class="gap-5 flex">
              <div><img alt="Nuxt I18n Icon" class="h-20" height="80" width="80" src="https://ipx.nuxt.com/s_80,f_auto/gh/nuxt/modules/main/icons/i18n.png"></div>
              <div>
                <UIcon name="i-logos-nuxt-icon" class="w-20 h-20" />
              </div>
            </div>
          </ShowcaseCard>
        </div>
      </UContainer>
      <UContainer>
        <h3 class="text-center font-bold mb-5 text-2xl font-semibold">
          For Apps All Shapes and Sizes
        </h3>
        <div class="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-lg">
          <div class="bg-neutral-700/20 ring ring-neutral-500/50 rounded-xl  text-center p-3 flex items-center justify-center">
            Single Page
          </div>
          <div class="bg-neutral-700/20 ring ring-neutral-500/50 rounded-xl text-center p-3 flex items-center justify-center">
            Server-Side Generated
          </div>
          <div class="bg-neutral-700/20 ring ring-neutral-500/50 rounded-xl text-center p-3 flex items-center justify-center">
            Server-Side Rendered
          </div>
          <div class="bg-neutral-700/20 ring ring-neutral-500/50 rounded-xl  text-center p-3 flex items-center justify-center">
            Multi-tenancy
          </div>
          <div class="bg-neutral-700/20 ring ring-neutral-500/50 rounded-xl text-center p-3 flex items-center justify-center">
            Base URL
          </div>
          <div class="bg-neutral-700/20 ring ring-neutral-500/50 rounded-xl text-center p-3 flex items-center justify-center">
            Trailing Slashes
          </div>
        </div>
      </UContainer>
    </section>
    <section ref="scoreEl" class="pb-10 xl:pb-20 max-w-4xl mx-auto">
      <div class="md:flex items-center justify-around gap-10 py-5 px-3 lg:bg-gradient-to-br from-sky-500/20 dark:from-sky-900/20 rounded-full cursor-pointer lg:shadow-sm hover:shadow transition-shadow" @click="clickScore">
        <UIcon name="i-logos-lighthouse" class="!hidden lg:!block w-[175px] h-[175px]" />
        <div class="lg:flex-grow">
          <h2 class="text-3xl flex items-center gap-2 font-bold dark:opacity-90 leading-normal mb-3">
            <UIcon name="i-carbon-checkmark-filled" class="opacity-60 text-green-500" /> Technical SEO Audits
          </h2>
          <p class="max-w-[30rem] text-lg">
            Nuxt SEO provides you with with all the tools needed to help you pass technical SEO audits on Google Lighthouse.
          </p>
        </div>
        <div class="lg:w-1/3 flex items-center justify-center">
          <MetricGuage :score="output" label="SEO" class="text-2xl" />
        </div>
      </div>
    </section>
    <section class="pb-10 xl:pb-20">
      <UContainer>
        <div class="lg:flex gap-10 items-center justify-between">
          <div class="mb-10">
            <div class="mb-10 mx-auto max-w-[35rem] flex flex-col justify-center">
              <h2 class="font-bold mb-5 text-5xl">
                Up To Date. Always.
                <span class="text-blue-300 text-3xl" />
              </h2>
              <p class="text-neutral-700 mb-3 dark:text-neutral-300 mt-4 max-w-3xl text-center text-xl lg:text-left">
                Nuxt SEO was started at the end of 2022 and has received continuous bug fixes and feature improvements from the community.
              </p>
              <div class="gap-2 mx-auto text-center grid grid-cols-12">
                <span v-for="(c, index) in stats?.uniqueContributors || []" :key="index" class="inline-flex items-center justify-center shrink-0 select-none overflow-hidden rounded-full align-middle bg-[--ui-bg-elevated] size-8 text-base">
                  <NuxtImg class="h-full w-full rounded-[inherit] object-cover" :alt="`GitHub User ${c}`" size="xl" height="45" width="45" loading="lazy" :src="`https://avatars.githubusercontent.com/u/${c}?s=80&v=4`" />
                </span>
              </div>
            </div>
          </div>
          <div class=" text-center justify-center gap-16 lg:mx-20 xl:mx-0 mb-10 ">
            <div class="mb-7">
              <div class="md:flex justify-center gap-10">
                <div>
                  <div class="font-light justify-center flex items-center gap-3 text-6xl mb-2">
                    <UIcon name="i-carbon-commit" />
                    {{ humanNumber(stats?.totalCommits || 0) }}
                  </div>
                  <div class="text-sm opacity-80">
                    Commits
                  </div>
                </div>
                <div>
                  <div class="font-light justify-center flex items-center gap-3 text-6xl mb-2">
                    <UIcon name="i-carbon-checkmark" />
                    {{ humanNumber(stats.totalIssuesClosed) }}
                  </div>
                  <div class="text-sm opacity-80">
                    Issues Closed
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div>
                <div class="font-light text-6xl mb-2">
                  <UIcon name="i-carbon-user-favorite-alt" />
                  {{ stats.uniqueContributors.length || 0 }}
                </div>
                <div class="text-sm opacity-80">
                  Contributors
                </div>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <section class="pb-10 xl:pb-20">
      <div class="mb-10">
        <div class="text-center mb-10 mx-auto max-w-[35rem] flex flex-col justify-center">
          <h2 class="font-bold mb-5 text-5xl">
            Loved by Nuxt Developers
            <span class="text-blue-300 text-3xl" />
          </h2>
          <p class="text-neutral-700 dark:text-neutral-300 mt-4 max-w-3xl text-center text-xl lg:text-left">
            Nuxt SEO was built for the community. Here's what some of them have to say.
          </p>
        </div>
        <UContainer>
          <div
            class="relative flex h-[500px] w-full space-y-5 flex-col items-center justify-center overflow-hidden rounded-lg bg-background mb-12"
          >
            <Marquee pause-on-hover class="[--duration:20s]">
              <ReviewCard
                v-for="review in reviews.slice(0, Math.round((reviews.length / 2)))"
                :key="review.username"
                :img="review.img"
                :name="review.name"
                :username="review.username"
                :body="review.body"
              />
            </Marquee>

            <Marquee reverse pause-on-hover class="[--duration:20s]">
              <ReviewCard
                v-for="review in reviews.slice(Math.round((reviews.length / 2)) - 1)"
                :key="review.username"
                :img="review.img"
                :name="review.name"
                :username="review.username"
                :body="review.body"
              />
            </Marquee>

            <div
              class="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-neutral-900"
            />

            <div
              class="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-neutral-900"
            />
          </div>
        </UContainer>
      </div>
      <UContainer>
        <div class="xl:flex items-center justify-around my-14">
          <div class="xl:max-w-sm xl:mb-0 mb-10">
            <div class="font-bold mb-5 text-5xl">
              {{ humanNumber(stats.modules.reduce((sum, m) => sum + m.averageDownloads30, 0)) }} downloads<br>
              <span class="text-blue-300 text-3xl">per day, on average</span>
            </div>
            <p class="opacity-80 mb-5">
              Nuxt SEO is used and trusted by thousands of developers and companies around the world.
            </p>
          </div>
          <div class="text-6xl space-y-6 px-5 lg:px-0">
            <div class="flex justify-between text-right gap-5">
              <div class="mb-1  font-light items-center flex gap-5">
                <UIcon name="i-carbon-chart-line-smooth" class="h-15 w-15 mr-1 opacity-80" />
                {{ humanNumber(stats.modules.reduce((sum, m) => sum + m.totalDownloads30, 0)) }}
              </div>
              <div class="flex items-center font-normal opacity-70 text-sm">
                Downloads<br>/ month
              </div>
            </div>
            <div class="flex justify-between gap-5">
              <div class="mb-1 font-light items-center flex gap-5">
                <UIcon name="i-carbon-star" class="h-15 w-15 mr-1 opacity-90" />
                {{ humanNumber(stats.modules.reduce((sum, m) => sum + m.stars, 0)) }}
              </div>
              <div class="flex items-center font-normal text-right opacity-70 text-sm">
                Total Stars
              </div>
            </div>
          </div>
        </div>
        <ClientOnly>
          <NuxtSeoDownloads class="rounded mx-auto max-w-[600px]  w-full h-full overflow-hidden" />
        </ClientOnly>
      </UContainer>
    </section>
    <section class="mb-14">
      <UContainer>
        <div class="xl:grid grid-cols-2 gap-10">
          <div class="mb-10 mx-auto max-w-lg flex flex-col  lg:items-start">
            <h2 class=" font-bold mb-3 text-5xl text-center lg:text-left">
              Funded by the community
              <span class="text-blue-300 text-3xl" />
            </h2>
            <p class="mb-5 text-neutral-700 dark:text-neutral-300 mt-4 max-w-xl text-center text-xl lg:text-left">
              Nuxt SEO is completely free and open-source due to the generous support of the community.
            </p>
            <div>
              <UButton size="lg" to="https://github.com/sponsors/harlan-zw">
                Become a sponsor
              </UButton>
            </div>
          </div>
          <div v-if="sponsors" class="max-w-xl mx-auto">
            <div class="text-2xl font-semibold mb-5">
              Top Sponsors
            </div>
            <div class="sm:grid space-y-5 md:space-y-0 grid-cols-3 gap-5 mb-10">
              <div v-for="(entry, key) in sponsors.$50 || {}" :key="key">
                <NuxtLink :to="entry.sponsor.websiteUrl" class="flex items-center gap-2">
                  <NuxtImg loading="lazy" :alt="entry.sponsor.name" width="56" height="56" :src="entry.sponsor.avatarUrl" class="w-14 h-14 rounded-full" />
                  <div>
                    <div class="font-bold text-xl whitespace-nowrap">
                      {{ entry.sponsor.name }}
                    </div>
                    <div v-if="entry.sponsor.websiteUrl" class="text-neutral-400">
                      {{ entry.sponsor.websiteUrl.replace('https://', '') }}
                    </div>
                  </div>
                </NuxtLink>
              </div>
            </div>
            <div class="text-2xl font-semibold mb-5">
              Gold Sponsors
            </div>
            <div class="sm:grid space-y-5 md:space-y-0 grid-cols-3 gap-5 mb-10">
              <div v-for="(entry, key) in sponsors.$25 || {}" :key="key">
                <NuxtLink :to="entry.sponsor.websiteUrl" class="flex items-center gap-2">
                  <NuxtImg loading="lazy" :alt="entry.sponsor.name || entry.sponsor.login" width="48" height="48" :src="entry.sponsor.avatarUrl" class="w-12 h-12 rounded-full" />
                  <div>
                    <div class="font-bold text-sm whitespace-nowrap">
                      {{ entry.sponsor.name || entry.sponsor.login }}
                    </div>
                    <div v-if="entry.sponsor.websiteUrl" class="text-xs text-neutral-400">
                      {{ entry.sponsor.websiteUrl.replace('https://', '') }}
                    </div>
                  </div>
                </NuxtLink>
              </div>
            </div>
            <div class="text-2xl font-semibold mb-5">
              Backers
            </div>
            <div class="grid grid-cols-6 sm:grid-cols-10 gap-3 mb-10">
              <div v-for="(entry, key) in sponsors.others || {}" :key="key">
                <UTooltip :text="entry.sponsor.name || entry.sponsor.login">
                  <NuxtLink :to="(entry.monthlyDollars > 5 ? entry.sponsor.websiteUrl : entry.sponsor.linkUrl) || entry.sponsor.linkUrl" class="flex items-center gap-2">
                    <NuxtImg loading="lazy" :alt="entry.sponsor.name || entry.sponsor.login" width="48" height="48" :src="entry.sponsor.avatarUrl" class="w-12 h-12 rounded-full" :class="entry.monthlyDollars > 5 ? ['ring-green-500 ring-2'] : []" />
                  </NuxtLink>
                </UTooltip>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>

<style>
.extra-italic {
  font-style: italic;
  font-variation-settings: 'ital' 1.5;
}
</style>
