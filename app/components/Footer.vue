<script setup lang="ts">
import { menu } from '~/composables/nav'
</script>

<template>
  <footer class="relative z-10 antialiased font-sans dark:bg-[#131822] bg-neutral-50 text-sm text-neutral-700 dark:text-neutral-200">
    <svg viewBox="0 0 1440 181" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-blue-900/30 pointer-events-none absolute w-full top-[1px] transition-all text-(--ui-primary) flex-shrink-0 opacity-100 duration-[400ms] opacity-30 z-20"><mask id="path-1-inside-1_414_5526" fill="white"><path d="M0 0H1440V181H0V0Z" /></mask><path d="M0 0H1440V181H0V0Z" fill="url(#paint0_linear_414_5526)" fill-opacity="0.22" /><path d="M0 2H1440V-2H0V2Z" fill="url(#paint1_linear_414_5526)" mask="url(#path-1-inside-1_414_5526)" /><defs><linearGradient id="paint0_linear_414_5526" x1="720" y1="0" x2="720" y2="181" gradientUnits="userSpaceOnUse"><stop stop-color="currentColor" /><stop offset="1" stop-color="currentColor" stop-opacity="0" /></linearGradient><linearGradient id="paint1_linear_414_5526" x1="0" y1="90.5" x2="1440" y2="90.5" gradientUnits="userSpaceOnUse"><stop stop-color="currentColor" stop-opacity="0" /><stop offset="0.395" stop-color="currentColor" /><stop offset="1" stop-color="currentColor" stop-opacity="0" /></linearGradient></defs></svg>
    <div class="border-t border-neutral-200 dark:border-neutral-800">
      <UContainer class="py-10">
        <div class="flex lg:flex-row flex-col items-center justify-center gap-3 mb-10">
          <div class="sm:flex items-center justify-center gap-3 ">
            <UButton
              aria-label="Nuxt SEO on GitHub"
              to="https://github.com/harlan-zw/nuxt-seo"
              target="_blank"
              color="neutral"
              variant="ghost"
              class="transition opacity-85"
              icon="i-carbon-logo-github"
            >
              GitHub
            </UButton>
            <UButton
              aria-label="Harlan's Discord"
              to="https://discord.com/invite/275MBUBvgP"
              target="_blank"
              color="neutral"
              variant="ghost"
              class="transition opacity-85"
              icon="i-carbon-logo-discord"
            >
              Discord
            </UButton>
            <ColorModeButton verbose />
            <ULink target="_blank" external href="/llms.txt" class="flex items-center gap-1 hover:underline transition">
              <UIcon dynamic name="i-noto-sparkles" class="w-4 h-4" />
              /llms.txt
            </ULink>
          </div>
        </div>
        <div class="py-10 grid xl:grid-cols-3 lg:gap-20 gap-10">
          <div v-for="(category, cKey) in menu.filter(c => c.children?.length)" :key="cKey">
            <h3 class="font-bold mb-5 flex items-center gap-1">
              <UIcon dynamic :name="category.icon" class="w-5 h-5" />
              {{ category.label }}
            </h3>
            <nav>
              <ul class="grid grid-cols-2 gap-6">
                <li v-for="(link, key) in category.children" :key="key">
                  <ULink :to="link.to" class="flex items-center gap-1 hover:underline transition">
                    <UIcon v-if="link.icon" dynamic :name="link.icon" class="w-4 h-4" :class="cKey === 0 ? 'text-blue-500 dark:text-blue-300' : ''" />
                    {{ link.label }}
                  </ULink>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div class="sm:flex items-center gap-10 mb-6">
          <NuxtLink to="/" title="Home" class="flex items-end gap-1.5 font-bold text-xl text-neutral-900 dark:text-white font-title">
            <Logo />
          </NuxtLink>
        </div>
      </UContainer>
    </div>
    <div class="border-t border-neutral-200 dark:border-neutral-800">
      <UContainer>
        <div class="py-10">
          Copyright © 2023-{{ new Date().getFullYear() }} Harlan Wilton - <a href="https://github.com/harlan-zw/nuxt-seo/blob/main/LICENSE">MIT License</a>
        </div>
      </UContainer>
    </div>
  </footer>
</template>
