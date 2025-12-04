<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type { ProEmailSchemaOutput, ProWaitlistFeedbackSchemaOutput } from '~~/types/schemas'
import { modules } from '~~/modules'
import {
  ProEmailSchema,

  ProWaitlistFeedbackSchema,

} from '~~/types/schemas'
import { stripHeaderAnchorLinks } from '~~/utils/content'
import { reviews } from '~/composables/data'
import { proAd } from '~/utils/ads'

const faq = [
  {
    label: 'Can I get a refund if I change my mind?',
    content: 'You can request a refund at any point up to a month after purchase.',
  },
  {
    label: 'Do you offer technical support?',
    content: 'Yes! Purchasing a license provides you with Discord support, alternatively you are also free to email me at harlan@harlanzw.com.',
  },
  {
    label: 'What is a project?',
    content: 'A project is considered to be one Git repository or a single production site. Staging and tests sites don\'t count towards being a project.',
  },
  {
    label: 'Wasn\'t this meant to be released a year ago?',
    content: 'Yes! Turns out building stuff takes a long time... Sorry about that. All my time and effort went into building LLMwise which will become available to pro users when its available.',
  },
]

const { data: snippets } = await useAsyncData(`snippets`, async () => {
  return (await queryCollection('snippets').where('path', 'LIKE', '/pro/%').all()).map((snippet) => {
    if (Array.isArray(snippet.body.value) && snippet.body.type === 'minimal') {
      stripHeaderAnchorLinks(snippet.body.value)
    }
    return snippet
  })
})

const waitlistFeedbackStatus = ref<'loading' | 'submitted'>()
const waitlistFeedbackState = reactive<ProWaitlistFeedbackSchemaOutput>({
  comment: '',
})

const waitlistStatus = ref<'loading' | 'submitted'>()
const waitlistState = reactive<ProEmailSchemaOutput>({
  email: '',
})
const toast = useToast()

async function onSubmit(event: FormSubmitEvent<ProEmailSchemaOutput>) {
  proAd.value = false
  waitlistStatus.value = 'loading'
  $fetch('/api/pro-waitlist', {
    method: 'POST',
    body: JSON.stringify(event.data),
  })
    .then(() => {
      toast.add({ title: 'Success', description: 'You\'ve signed up, thanks!', color: 'success' })
    })
    .catch((error) => {
      toast.add({ title: 'Error', description: error.message, color: 'error' })
    })
    .finally(() => {
      waitlistStatus.value = 'submitted'
    })
}

function onSubmitProWaitlistFeedback(event: FormSubmitEvent<ProWaitlistFeedbackSchemaOutput>) {
  waitlistFeedbackStatus.value = 'loading'
  $fetch('/api/pro-waitlist-feedback', {
    method: 'POST',
    body: JSON.stringify(event.data),
  })
    .then(() => {
      toast.add({ title: 'Success', description: 'Thanks!', color: 'success' })
    })
    .catch((error) => {
      toast.add({ title: 'Error', description: error.message, color: 'error' })
    })
    .finally(() => {
      waitlistFeedbackStatus.value = 'submitted'
    })
}
</script>

<template>
  <div>
    <div class="gradient" />
    <UContainer>
      <section class="xl:max-w-full xl:grid grid-cols-2 max-w-3xl mx-auto py-5 sm:py-12 xl:py-15">
        <div class="max-w-2xl mx-auto">
          <div class="xl:flex gap-10">
            <div class="flex flex-col justify-center">
              <h1 class="text-neutral-900/90 dark:text-neutral-100 text-4xl md:text-6xl leading-tight font-bold tracking-tight" style="line-height: 1.3;">
                <span class="extra-italic">Build for </span><br><span class="font-cursive dark:text-pro-200 text-blue-400 px-1">what's next</span>.
              </h1>
              <p class="max-w-xl text-neutral-700 dark:text-neutral-300 mt-4 max-w-3xl text-base md:text-xl">
                Build out your technical SEO using modern LLM tooling. Get discovered and cited by AI models.
                Be ready for the future of search.
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
        <div class="flex items-center justify-center h-full xl:mr-50 mt-7 xl:mt-0 relative">
          <div class="flex flex-wrap xl:max-w-[400px] items-center gap-6 justify-center">
            <motion.div
              v-for="(module, i) in modules.filter(m => m.pro)"
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
                transition: animatedIn ? { duration: 0.2 } : {
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
    <div class="bg-green-100/50 dark:bg-black/50 py-10 mb-10">
      <div class="px-10 max-w-4xl mx-auto">
        <div class="max-w-xl prose prose-gray relative">
          <div class="mb-7">
            <h2 class="font-semibold text-2xl mb-3 flex items-center gap-2">
              Introduction
            </h2>
            <p class="dark:text-neutral-300 mb-3">
              Hi there, I'm looking to push the Nuxt SEO ecosystem even further, but I'll need your help!
            </p>
            <p class="dark:text-neutral-300 mb-3">
              Introducing Nuxt SEO Pro: a collection of new modules and learning resources to help you further grow your sites organic traffic
              through technical SEO.
            </p>
            <p class="mb-3">
              By supporting me, you support all of my <NuxtLink to="https://harlanzw.com/projects" class="underline">
                open-source work
              </NuxtLink> within the Nuxt ecosystem.
            </p>
            <div>
              <div class="flex items-center gap-2">
                <img src="https://avatars.githubusercontent.com/u/5326365?v=4" alt="Harlan" class="w-8 h-8 rounded-full inline mr-1">
                <div>
                  Harlan
                  <div class="text-sm dark:text-neutral-400 text-neutral-600">
                    Nuxt Core Maintainer
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <section class="px-10 max-w-4xl mx-auto mb-10">
      <h2 class="font-semibold text-2xl mb-2 flex items-center gap-2">
        <UIcon name="i-carbon-3rd-party-connected" class="text-blue-300" /> 3 New Modules
      </h2>
      <p class="dark:text-neutral-300">
        Three new modules to help you nurture your organic SEO growth.
      </p>
    </section>

    <div class="px-10 max-w-6xl mx-auto space-y-10 mb-10">
      <!-- Nuxt Skew Protection -->
      <div class="lg:grid grid-cols-2 gap-12 space-y-5 lg:space-y-0">
        <div class="space-y-5">
          <ModuleCardSkewProtection />
          <div class="prose dark:prose-invert max-w-none">
            <h3 class="text-xl font-semibold mb-3">
              Why Nuxt Skew Protection?
            </h3>
            <ContentRenderer :value="snippets.find(s => s.id.endsWith('nuxt-skew-protection.md'))" />
          </div>
        </div>
        <div class="flex items-start justify-center">
          <div class="sticky top-24 w-full bg-[var(--ui-bg-muted)] rounded-lg p-8 space-y-6">
            <SkewProtectionDemoAuto />
          </div>
        </div>
      </div>

      <!-- Nuxt AI Ready -->
      <div class="lg:grid grid-cols-2 gap-12 space-y-5 lg:space-y-0">
        <div class="space-y-5">
          <ModuleCardAIIndex />
          <div class="prose dark:prose-invert max-w-none">
            <h3 class="text-xl font-semibold mb-3">
              Why Nuxt AI Ready?
            </h3>
            <ContentRenderer :value="snippets.find(s => s.id.endsWith('nuxt-ai-index.md'))" />
          </div>
        </div>
        <div class="flex items-start justify-center">
          <div class="sticky top-24 w-full bg-[var(--ui-bg-muted)] rounded-lg p-8 flex items-center justify-center min-h-[300px]">
            <div class="text-[var(--ui-text-muted)] text-sm">
              Live example coming soon
            </div>
          </div>
        </div>
      </div>

      <!-- Magic Redirects -->
      <div class="lg:grid grid-cols-2 gap-12 space-y-5 lg:space-y-0">
        <div class="space-y-5">
          <ModuleCardMagicRedirects />
          <div class="prose dark:prose-invert max-w-none">
            <h3 class="text-xl font-semibold mb-3">
              Why Magic Redirects?
            </h3>
            <ContentRenderer :value="snippets.find(s => s.id.endsWith('magic-redirects.md'))" />
          </div>
        </div>
        <div class="flex items-start justify-center">
          <div class="sticky top-24 w-full bg-[var(--ui-bg-muted)] rounded-lg p-8 flex items-center justify-center min-h-[300px]">
            <div class="text-[var(--ui-text-muted)] text-sm">
              Live example coming soon
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- LLMWise Section -->
    <section class="px-10 max-w-4xl mx-auto mb-10">
      <h2 class="font-semibold text-2xl mb-2 flex items-center gap-2">
        LLMWise: A New Site Audit Tool
        <UBadge color="warning">
          In Development
        </UBadge>
      </h2>
      <div class="mt-6">
        Three new modules to help you nurture your organic SEO growth.
      </div>
    </section>
    <div class="px-10 max-w-6xl mx-auto space-y-10 mb-10">
      <!-- Magic Redirects -->
      <div class="lg:grid grid-cols-2 gap-12 space-y-5 lg:space-y-0">
        <div class="space-y-5">
          <ModuleCardLLMWise />
        </div>
        <div class="flex items-start justify-center">
          <div class="sticky top-24 w-full bg-[var(--ui-bg-muted)] rounded-lg p-8 flex items-center justify-center min-h-[300px]">
            <div class="text-[var(--ui-text-muted)] text-sm">
              Live example coming soon
            </div>
          </div>
        </div>
      </div>
    </div>
    <section class="px-10 max-w-4xl mx-auto mb-12">
      <div class="mb-7 max-w-xl">
        <h2 class="text-3xl font-bold mb-2">
          Get Early Access
        </h2>
      </div>
      <div class="lg:flex gap-10 w-full">
        <div>
          <p class="mb-5 max-w-xl text-lg text-[--ui-text-muted]">
            Purchase early access at the current price and get lifetime access to all modules and updates.
          </p>
        </div>
      </div>

      <USeparator class="my-3" />
      <div class="lg:grid grid-cols-2 gap-5 space-y-5 lg:space-y-0">
        <div class="flex flex-col items-center justify-center">
          <div class="relative max-w-sm mx-auto ring-green-500 ring  rounded-2xl  p-5 space-y-4 text-left">
            <UBadge variant="soft" color="warning" size="lg" class="absolute font-bold top-5 right-5">
              50% off!
            </UBadge>
            <h3 class="font-bold text-2xl">
              Early Access
            </h3>
            <ul class="text-sm space-y-2 list-disc ml-5">
              <li>Up to 5 projects, $39 for each extra project.</li>
              <li>Lifetime updates, access and support.</li>
              <li>Access to the GitHub repos</li>
            </ul>

            <div class="flex flex-row items-center gap-x-1.5">
              <div class="line-through text-2xl">
                $249
              </div>
              <p class="text-neutral-900 dark:text-white text-2xl sm:text-4xl font-semibold">
                $119
              </p>
              <div class="text-xs">
                <p class="text-neutral-600 dark:text-neutral-300 font-semibold">
                  one-time payment
                </p>
                <p class="text-neutral-400 dark:tex-neutral-500">
                  plus local taxes
                </p>
              </div>
            </div>
            <div class="font-bold">
              Save $130
            </div>
            <UButton
              to="https://buy.stripe.com/aFaaEXfcU6Os4gjfsJcs801"
              external
              target="_blank"
              size="xl"
              color="primary"
              class="w-full"
            >
              Purchase Now
            </UButton>
          </div>
        </div>
        <div class="max-w-lg mx-auto bg-neutral-200/30 dark:bg-neutral-900 dark:text-neutral-200 p-10 rounded-2xl py-[70px] flex flex-col items-center justify-center">
          <template v-if="waitlistStatus !== 'submitted'">
            <div class="mb-7">
              <div class="text-xl mb-2 font-semibold">
                Sign up for updates
              </div>
              <div>
                <p class="text-sm">
                  Stay informed about new features, module releases, and important updates.
                </p>
              </div>
            </div>
            <UForm :schema="ProEmailSchema" :state="waitlistState" class="flex gap-2" :validate-on="['change']" @submit="onSubmit">
              <UFormField name="email">
                <UInput v-model="waitlistState.email" size="xl" type="email" placeholder="Your email" />
              </UFormField>
              <div>
                <UButton type="submit" color="secondary" size="xl" :loading="waitlistStatus === 'loading'">
                  Submit
                </UButton>
              </div>
            </UForm>
          </template>
          <div v-else-if="waitlistFeedbackStatus !== 'submitted'">
            <div class="mb-3 text-lg font-semibold">
              Thanks for signing up!
            </div>
            <div class="mb-3">
              Help me out by letting me know modules interest you and what SEO struggles you have.
            </div>
            <UForm :schema="ProWaitlistFeedbackSchema" :state="waitlistFeedbackState" class="space-y-4" :validate-on="['change']" @submit="onSubmitProWaitlistFeedback">
              <UFormField label="Comments" name="comment" class="mb-3">
                <UTextarea v-model="waitlistFeedbackState.comment" type="textarea" class="w-full" />
              </UFormField>
              <UButton type="submit" size="sm" color="secondary" :loading="waitlistFeedbackStatus === 'loading'">
                Submit
              </UButton>
            </UForm>
          </div>
          <div v-else>
            Thanks for your help!
          </div>
        </div>
      </div>
      <div class="mt-10 justify-center flex-col dark:text-neutral-300/75 flex items-center gap-1">
        <UAvatarGroup size="xl" class="mb-3">
          <UAvatar src="https://cdn.discordapp.com/avatars/212548363529355264/a23dd75d7ffadac117115cb745edb25a.webp?size=240" />
          <UAvatar src="https://pbs.twimg.com/profile_images/1374040164180299791/ACw4G3nZ_400x400.jpg" />
          <UAvatar src="https://pbs.twimg.com/profile_images/1832800489580224512/uqwwtRlK_400x400.jpg" />
          <UAvatar text="+251" class="text-white text-xs font-bold" />
        </UAvatarGroup>
        <div class="text-lg text-center max-w-xs">
          Join the 254 Nuxters who have already signed up.
        </div>
      </div>
      <div class="max-w-lg mx-auto mt-10">
        <UAccordion :items="faq" />
      </div>
    </section>

    <section>
      <div class="mb-10">
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
    </section>
  </div>
</template>

<style>
</style>
