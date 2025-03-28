<script setup lang="ts">
import { titleCase } from 'scule'
import { getLastPathSegment, getPathSegments } from '~~/utils/urls'
import { useCurrentDocPage } from '~/composables/data'
import { useModule } from '~/composables/module'

definePageMeta({
  layout: 'docs',
})

const route = useRoute()

const modules = (await useStats()).value.modules
const module = useModule(modules)
const { page, surround } = await useCurrentDocPage()
if (!page.value)
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

const moduleName = computed(() => `Nuxt ${module.value.label}`)
useSeoMeta({
  title: () => (page.value?.title === moduleName.value ? '' : page.value?.title) || '',
  description: () => page.value?.description,
  titleTemplate: '%s %separator %moduleName %separator %siteName',
})

useHead({
  templateParams: {
    moduleName,
  },
})

useHead({
  link: () => {
    return [
      // add prev and next using surround
      ...(surround.value?.length
        ? surround.value.map((s, i) => {
            return {
              rel: i === 0 ? 'prev' : 'next',
              href: `https://unhead.unjs.io/${s.path}`,
            }
          })
        : []),
    ]
  },
})

const headline = computed(() => titleCase(getLastPathSegment(getPathSegments(route.path, route.path.split('/').length - 2))))

defineOgImageComponent('Module', {
  title: page.value?.title || '',
  moduleName: module.value?.repo.replace('harlan-zw/', ''),
  description: page.value?.description,
  headline,
  ...module.value,
})

const repoLinks = computed(() => [
  {
    label: 'Edit this page',
    to: `https://github.com/${module.value.repo}/edit/main/docs/content/${page.value.id.split('/').slice(3).join('/')}`,
    target: '_blank',
  },
  {
    label: 'Markdown For LLMs',
    to: `https://raw.githubusercontent.com/${module.value.repo}/refs/heads/main/docs/${page.value.id.split('/').slice(3).join('/')}`,
    target: '_blank',
  },
])
</script>

<template>
  <div class="max-w-[66ch] ml-auto md:ml-0 md:mr-auto">
    <UPageHeader
      :title="page.title" :headline="headline" class="text-balance pt-4" :links="!['overview', 'intro-to-unhead'].includes(route.path.split('/').pop()) ? [
        { label: 'Copy for LLMs', to: repoLinks[1].to, icon: 'i-catppuccin-markdown', target: '_blank' },
      ] : []"
      :ui="{ title: 'leading-normal' }"
    />

    <UPageBody prose class="pb-0">
      <ContentRenderer v-if="page.body" :value="page" class="mb-10" />
      <div class="justify-center flex items-center gap-2 font-semibold">
        <UIcon name="i-simple-icons-github" class="w-5 h-5" />
        <NuxtLink v-bind="repoLinks[0]" class="hover:underline">
          {{ repoLinks[0].label }}
        </NuxtLink>
      </div>
      <FeedbackButtons :edit-link="repoLinks[0].to" />
      <USeparator v-if="surround?.length" class="my-8" />
      <UContentSurround :surround="surround" />
    </UPageBody>
  </div>
</template>
