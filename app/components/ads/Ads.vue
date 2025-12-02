<script lang="ts" setup>
import { blueprintAd, proAd } from '~/utils/ads'

// const possibleAds = computed(() => {
//   return [
//     { id: 'pro', enabled: proAd.value },
//     { id: 'blueprint', enabled: blueprintAd.value },
//   ].filter(v => v.enabled)
// })
// shuffle
const ad = computed(() => {
  return null
  // if (possibleAds.value.length === 0)
  //   return null
  // // if we're on mobile, show nothing
  // if (import.meta.client && window.innerWidth < 640)
  //   return null
  // return possibleAds.value[Math.floor(Math.random() * possibleAds.value.length)]
})

const route = useRoute()
const key = ref(route.path)

function attachRouteWatcher() {
  watch(() => route.path, (newPath) => {
    key.value = newPath
  })
}
</script>

<template>
  <div>
    <ClientOnly>
      <template v-if="ad">
        <div
          v-if="ad.id === 'pro'"
          class="px-1 Carbon border text-xs dark:text-neutral-300 text-neutral-700 border-neutral-200 dark:border-neutral-800 rounded-lg mb-5"
        >
          <div class="px-1 pt-1 mb-2 flex items-center justify-between ">
            <strong>Nuxt SEO <span class="text-green-500">Pro</span></strong>
            <UButton class="cursor-pointer" size="xs" variant="ghost" color="neutral" type="button" @click="proAd = false">
              Hide
            </UButton>
          </div>
          <ul class="px-1 list-disc ml-4 space-y-1 mb-3">
            <li>Nuxt Magic Redirects</li>
            <li>Nuxt Google Search Console</li>
            <li>Nuxt Internal Links</li>
            <li>Nuxt SEO Analyze</li>
          </ul>
          <div class="px-1">
            Save $130 by joining the <NuxtLink to="/pro" class="underline text-green-500">
              waitlist
            </NuxtLink> now.
          </div>
        </div>
        <div
          v-else-if="ad.id === 'blueprint'"
          class="px-1 Carbon border text-xs dark:text-neutral-300 text-neutral-700 border-neutral-200 dark:border-neutral-800 rounded-lg mb-5"
        >
          <div class="px-1 pt-1 mb-2 flex items-center justify-between">
            <strong>SEO <span class="text-green-500">Blueprint</span></strong>
            <UButton class="cursor-pointer" size="xs" variant="ghost" color="neutral" type="button" @click="blueprintAd = false">
              Hide
            </UButton>
          </div>
          <ul class="px-1 list-disc ml-4 space-y-1 mb-3">
            <li>2hr 58min video course</li>
            <li>Get your website to #1</li>
            <li>For beginners and professionals</li>
            <li>By Nuxt IndieHacker Danny Postma</li>
          </ul>
          <div class="px-1">
            <NuxtLink to="https://www.dannypostma.com/seo-course?via=harlan" class="underline text-green-500">
              See course outline
            </NuxtLink>
          </div>
        </div>
      </template>
    </ClientOnly>
    <ScriptCarbonAds
      :key="key"
      format="cover"
      serve="CW7DTKJJ"
      placement="nuxtseocom"
      trigger="onNuxtReady"
      @ready="attachRouteWatcher"
    >
      <AdsFallback />
    </ScriptCarbonAds>
  </div>
</template>

<style>
.dark #carbon-responsive {
  --carbon-padding: 1em;
  --carbon-max-char: 20ch;
  --carbon-bg-primary: var(--ui-bg);
  --carbon-bg-secondary: var(--ui-bg-muted);
  --carbon-text-color: var(--ui-text);
}

#carbon-responsive .carbon-responsive-wrap {
  border-radius: var(--ui-radius);
  max-width: 100%;
}
</style>
