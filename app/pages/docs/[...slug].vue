<script setup lang="ts">
import type { NuxtSEOModule } from '@nuxtjs/seo/const'
import { titleCase } from 'scule'
import { joinURL } from 'ufo'
import { getLastPathSegment, getPathSegments } from '~~/utils/urls'
import { transformNavigation } from '~/composables/nav'

definePageMeta({
  layout: 'docs',
})

const route = useRoute()

const module = inject<Ref<NuxtSEOModule>>('module')
const { page, surround, lastCommit } = await useCurrentDocPage()
if (!page?.value?.id) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const moduleName = computed(() => module.value.label === 'Nuxt SEO' ? '' : `Nuxt ${module.value.label}`)
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
              href: joinURL('https://nuxtseo.com/', s.path),
            }
          })
        : []),
    ]
  },
})

const headline = computed(() => {
  const path = titleCase(getLastPathSegment(getPathSegments(route.path, route.path.split('/').length - 2)))
  return transformNavigation([{ ...route }], false)[0]?.title || path
})

defineOgImageComponent('Module', {
  title: page.value?.title || '',
  moduleName: module.value?.repo.replace('harlan-zw/', ''),
  description: page.value?.description,
  headline,
  ...module.value,
})

prerenderRoutes(`${route.path}.md`)

const repoLinks = computed(() => [
  {
    label: 'Edit this page',
    to: `https://github.com/${module.value.repo}/edit/main/docs/content/${String(page.value?.id || '').split('/').slice(3).join('/')}`,
    target: '_blank',
  },
  {
    label: 'Markdown For LLMs',
    to: `${route.path}.md`,
    target: '_blank',
  },
])
</script>

<template>
  <div class="flex justify-between w-full">
    <div class="xl:mx-auto w-full max-w-[66ch]">
      <UPageHeader
        :title="page.title" :headline="headline" class="text-balance pt-4"
        :ui="{ title: 'leading-normal' }"
      >
        <div v-if="lastCommit" class="mt-3 text-sm">
          <div class="text-[var(--ui-text-dimmed)]">
            Last updated <time class="font-semibold" :datetime="lastCommit.date">{{ lastCommit.dateHuman }}</time> by <UBadge color="neutral" variant="outline">
              <NuxtLink :to="`https://github.com/${lastCommit.author.committer}`" external target="_blank" class="inline-flex items-center gap-1.5">
                <div class="hover:text-[var(--ui-text)] text-[var(--ui-text-muted)] transition">
                  {{ lastCommit.author.name }}
                </div>
              </NuxtLink>
            </UBadge> in <UBadge variant="outline" color="neutral" class="my-1">
              <NuxtLink :to="lastCommit.url" target="_blank" external class="hover:text-[var(--ui-text)] text-[var(--ui-text-muted)] transition max-w-[250px] whitespace-nowrap overflow-hidden text-ellipsis">
                {{ lastCommit.message }}
              </NuxtLink>
            </UBadge>.
          </div>
        </div>
        <div v-if="!['overview', 'intro-to-unhead'].includes(route.path.split('/').pop())" class="mt-3">
          <UButton label="Copy for LLMs" :to="repoLinks[1].to" icon="i-catppuccin-markdown" target="_blank" variant="outline" size="sm" class="md:inline-flex hidden" />
        </div>
      </UPageHeader>
      <UPageBody prose class="pb-0 ">
        <ContentRenderer v-if="page.body" :value="page" class="mb-10" />
        <div class="justify-center flex items-center gap-5 font-semibold">
          <div class="flex items-center gap-2">
            <UIcon name="i-simple-icons-github" class="w-5 h-5" />
            <NuxtLink v-bind="repoLinks[0]" class="hover:underline">
              {{ repoLinks[0].label }}
            </NuxtLink>
          </div>
          <div class="flex items-center gap-2">
            <UIcon name="i-simple-icons-markdown" class="w-5 h-5" />
            <NuxtLink v-bind="repoLinks[1]" class="hover:underline">
              {{ repoLinks[1].label }}
            </NuxtLink>
          </div>
        </div>
        <FeedbackButtons :edit-link="repoLinks[0].to" />
        <USeparator v-if="surround?.length" class="my-8" />
        <UContentSurround :surround="surround" />
      </UPageBody>
    </div>

    <div class="hidden xl:block max-w-[300px] w-full flex justify-end">
      <div class="pt-11 pl-10 gap-5 flex flex-col">
        <div v-if="page?.body?.toc?.links?.length > 1">
          <div class="mb-5 flex items-center gap-2 text-[var(--ui-text-accented)]">
            <UIcon name="i-tabler-align-left-2" class="size-4" />
            <div class="text-xs font-medium">
              On this page
            </div>
          </div>
          <TableOfContents :links="page.body.toc.links" />
        </div>
        <div class="max-w-[200px]">
          <Ads />
        </div>
      </div>
    </div>
  </div>
</template>
