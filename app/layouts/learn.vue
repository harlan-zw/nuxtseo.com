<script setup lang="ts">
import contentNavTheme from '#build/ui/content/content-navigation'
import { useAppConfig, useLearnPlatform } from '#imports'
import UBadge from '#ui/components/Badge.vue'
import UIcon from '#ui/components/Icon.vue'
import ULink from '#ui/components/Link.vue'
import ULinkBase from '#ui/components/LinkBase.vue'
import { mapContentNavigationItem } from '#ui/utils/content'
import { pickLinkProps } from '#ui/utils/link'
import { tv } from '#ui/utils/tv'
import { titleCase } from 'scule'
import { computed } from 'vue'

function mapPath(data) {
  return data.map((item) => {
    if (item.children?.length && !item.page) {
      item.title = titleCase(item.title)
      item.children = mapPath(item.children)
    }
    return {
      ...item,
      _path: item.path,
    }
  })
}

const route = useRoute()
const navCollection = computed(() => route.path.startsWith('/learn-seo/nuxt') ? 'learnSeoNuxt' : 'learnSeoVue')

const {
  data: navigation,
} = await useAsyncData(`docs-nav-learn`, () => queryCollectionNavigation(navCollection.value), {
  default: () => [],
  watch: [navCollection],
  transform: transformNavigation,
  // transform(res) {
  //   // firstly we need to merge the children on the path key
  //   const children = res[0].children
  //   // map as an object path => data, merge data
  //   const mappedChildren = children.reduce((acc, item) => {
  //     if (!acc[item.path]) {
  //       acc[item.path] = item
  //     }
  //     else {
  //       acc[item.path] = defu(acc[item.path], item)
  //       // filter the children, they shouldn't contain the item.path
  //     }
  //     return acc
  //   }, {})
  //   return mapPath(Object.values(mappedChildren)).map(item => item.children.map(c => ({ icon: 'i-ph-dot-outline-duotone', ...c })))
  // },
})
provide('navigation', navigation)
const breadcrumbs = useBreadcrumbItems({
  overrides: computed(() => {
    const segments = route.path.split('/')
    const parent = navigation.value.flat().find(i => i.path === segments.slice(0, 3).join('/'))
    const currItem = navigation.value.flat().find(i => i.path === route.path)
    return [
      null,
      {
        icon: 'i-ph-books-duotone',
        label: 'Learn SEO',
      },
      parent,
      { label: currItem?.title },
    ]
  }),
})

const appConfig = useAppConfig()
const ui = computed(() => tv({ extend: tv(contentNavTheme), ...appConfig.ui?.contentNavigation || {} })())

const platforms = [
  { label: 'Nuxt', value: 'nuxt', icon: 'i-logos-nuxt-icon' },
  { label: 'Vue', value: 'vue', icon: 'i-logos-vue' },
] as const

const learnPlatform = useLearnPlatform()

watch(learnPlatform, (newPlatform) => {
  const currentPlatform = route.path.startsWith('/learn-seo/nuxt') ? 'nuxt' : 'vue'
  if (newPlatform !== currentPlatform) {
    const newPath = route.path.replace(`/learn-seo/${currentPlatform}`, `/learn-seo/${newPlatform}`)
    navigateTo(newPath)
  }
})
</script>

<template>
  <UMain class="relative mb-20 px-5">
    <svg viewBox="0 0 1440 181" fill="none" xmlns="http://www.w3.org/2000/svg" class="left-0  text-primary-300/30 dark:text-primary-900/30 pointer-events-none absolute w-full top-[1px] transition-all text-primary flex-shrink-0 opacity-100 duration-[400ms] z-20"><mask id="path-1-inside-1_414_5526" fill="white"><path d="M0 0H1440V181H0V0Z" /></mask><path d="M0 0H1440V181H0V0Z" fill="url(#paint0_linear_414_5526)" fill-opacity="0.22" /><path d="M0 2H1440V-2H0V2Z" fill="url(#paint1_linear_414_5526)" mask="url(#path-1-inside-1_414_5526)" /><defs><linearGradient id="paint0_linear_414_5526" x1="720" y1="0" x2="720" y2="181" gradientUnits="userSpaceOnUse"><stop stop-color="currentColor" /><stop offset="1" stop-color="currentColor" stop-opacity="0" /></linearGradient><linearGradient id="paint1_linear_414_5526" x1="0" y1="90.5" x2="1440" y2="90.5" gradientUnits="userSpaceOnUse"><stop stop-color="currentColor" stop-opacity="0" /><stop offset="0.395" stop-color="currentColor" /><stop offset="1" stop-color="currentColor" stop-opacity="0" /></linearGradient></defs></svg>
    <div class="max-w-[1400px] mx-auto lg:pt-5">
      <UPage :ui="{ left: 'lg:col-span-3 xl:col-span-2', center: 'col-span-5 lg:col-span-7 xl:col-span-8' }">
        <template #left>
          <UPageAside class="max-w-[300px]">
            <div>
              <div class="flex flex-col gap-5">
                <div>
                  <div class="flex items-center gap-2 mb-3">
                    <UIcon name="i-ph-books-duotone" class="size-6 mb-2 text-(--ui-primary)-400 dark:text-sky-200" />
                    <div class="mb-3 text-sm font-bold">
                      Learn SEO
                    </div>
                  </div>
                  <div class="inline-flex rounded-md border border-[var(--ui-border)] overflow-hidden">
                    <button
                      v-for="(p, i) in platforms"
                      :key="p.value"
                      type="button"
                      class="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all duration-150" :class="[
                        learnPlatform === p.value
                          ? 'bg-[var(--ui-bg-elevated)] text-[var(--ui-text-highlighted)]'
                          : 'bg-transparent text-[var(--ui-text-muted)] hover:text-[var(--ui-text)] hover:bg-[var(--ui-bg-muted)]',
                        i === 0 ? '' : 'border-l border-[var(--ui-border)]',
                      ]"
                      @click="learnPlatform = p.value"
                    >
                      <UIcon :name="p.icon" class="size-4" />
                      {{ p.label }}
                    </button>
                  </div>
                </div>
                <nav v-for="group in navigation" :key="group.title" aria-title="Documentation Section" class="space-y-3">
                  <h3 class="text-sm font-bold mb-3">
                    {{ group.title }}
                  </h3>
                  <ul>
                    <li v-for="(link, key) in group.children" :key="key" data-slot="item" :class="ui.item({ class: [link.ui?.item], level: true })">
                      <ULink v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(mapContentNavigationItem(link))" custom>
                        <ULinkBase v-bind="slotProps" data-slot="link" :class="ui.link({ class: [link.ui?.link, link.class], active, disabled: !!link.disabled, level: true })">
                          <div
                            v-if="!link.html" class="flex items-center justify-between gap-2 w-full"
                            :class="link.deprecated ? 'opacity-50' : ''"
                          >
                            <div class="flex items-center gap-2">
                              <UIcon
                                v-if="link.icon"
                                :name="link.icon"
                                :class="link.iconUi"
                                class="w-4 h-4 transition-all hover:brightness-50 brightness-120"
                              />
                              <div :class="link.children?.length ? 'text-sm font-bold' : ''">
                                {{ link.title }}
                              </div>
                            </div>
                            <UIcon v-if="link.tag" :name="`i-logos-${link.tag}`" dynamclic ass="w-4 h-4" />
                          </div>
                          <div v-else :class="link.deprecated ? 'opacity-50' : ''">
                            <UIcon v-if="link.icon" :name="link.icon" class="w-4 h-4 text-(--ui-primary)-400 dark:text-sky-200" />
                            <div v-html="link.title" />
                          </div>
                          <div v-if="link.new">
                            <UBadge size="sm" variant="subtle" color="success">
                              New
                            </UBadge>
                          </div>
                          <div v-else-if="link.deprecated" class="opacity-50">
                            <UBadge size="sm" variant="subtle" color="neutral">
                              Deprecated
                            </UBadge>
                          </div>
                        </ULinkBase>
                      </ULink>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </UPageAside>
        </template>
        <UBreadcrumb :items="breadcrumbs" class="mt-10" />
        <slot />
      </UPage>
    </div>
  </UMain>
</template>
