<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type { ProEmailSchemaOutput, ProWaitlistFeedbackSchemaOutput } from '~~/types/schemas'
import { modules } from '~~/modules'
import {
  ProEmailSchema,
} from '~~/types/schemas'
import { reviews } from '~/composables/data'
import { proAd } from '~/utils/ads'

const filteredModules = computed(() => modules.filter(m => m.pro))

const faq = [
  {
    label: 'Can I try the modules before buying?',
    content: 'Yes! All modules work fully in development mode. Install them, build your features, and only purchase when you\'re ready to deploy to production.',
  },
  {
    label: 'Can I get a refund if I change my mind?',
    content: 'You can request a refund at any point up to a month after purchase.',
  },
  {
    label: 'Do you offer technical support?',
    content: 'Yes! Purchasing a license provides you with Discord support, alternatively you are also free to email me at harlan@harlanzw.com.',
  },
]

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

// Animated status indicator
const statusMessages = ['Indexing...', 'Optimizing...', 'Protecting...', 'Ready.']
const statusSymbols = ['◐', '◑', '◒', '◓', '✽']
const currentStatus = ref(0)
const currentSymbol = ref(0)

onMounted(() => {
  setInterval(() => {
    currentSymbol.value = (currentSymbol.value + 1) % statusSymbols.length
  }, 150)
  setInterval(() => {
    currentStatus.value = (currentStatus.value + 1) % statusMessages.length
  }, 2000)
})

const activeTab = ref('ai-ready')
const tabs = [
  { id: 'ai-ready', label: 'AI Ready', icon: 'i-carbon-ai' },
  { id: 'ai-search', label: 'AI Search', icon: 'i-carbon-chat-bot' },
  { id: 'skew', label: 'Skew Protection', icon: 'i-carbon-update-now' },
]
</script>

<template>
  <div>
    <div class="gradient" />

    <!-- Hero Section (keeping as-is) -->
    <div class="relative">
      <UContainer>
        <section class="xl:max-w-full xl:grid grid-cols-2 max-w-3xl mx-auto py-5 sm:py-12 xl:py-15 ">
          <div class="absolute inset-0 bg-gradient-to-b from-green-500/5 via-transparent to-transparent" />
          <div class="z-10 max-w-2xl mx-auto">
            <div class="xl:flex gap-10">
              <div class="flex flex-col justify-center">
                <!-- Animated Status -->
                <div class="mx-3 inline-flex items-center gap-2 mb-6 font-mono text-sm text-[var(--ui-text-muted)]">
                  <span class="text-green-400">{{ statusSymbols[currentSymbol] }}</span>
                  <span>{{ statusMessages[currentStatus] }}</span>
                </div>
                <h1 class="text-neutral-900/90 dark:text-neutral-100 text-4xl md:text-6xl leading-tight font-bold tracking-tight" style="line-height: 1.3;">
                  <span class="extra-italic">The futures</span><br><span class="font-cursive dark:text-pro-300 text-blue-400 px-1"> SEO Modules</span> for todays <span class="bg-green-500/10 px-2">Nuxters</span>.
                </h1>
                <p class="max-w-xl text-neutral-700 dark:text-neutral-300 mt-4 max-w-3xl text-base md:text-xl">
                  Technical SEO for LLMs and AI search engines is here. Vibe code your semantic data. Be on first name basis
                  with LLMs and protect yourself from irrelevance.
                </p>

                <div class="flex mb-5 items-center gap-4 mt-5 md:mt-10 justify-start">
                  <UButton size="lg" external href="/pro#pricing" color="pro" icon="i-carbon-rocket" class="font-semibold">
                    Get Early Access - $119
                  </UButton>
                  <UButton size="lg" icon="i-carbon-download" variant="ghost" to="#modules">
                    Try Free in Dev
                  </UButton>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-center h-full xl:mr-50 mt-7 xl:mt-0 relative">
            <AnimatedModuleIcons :modules="filteredModules" />
          </div>
        </section>
      </UContainer>
    </div>

    <!-- Tabbed Feature Showcase -->
    <section class="bg-black/20 py-16 md:py-20 md:pb-25">
      <UContainer>
        <div class="text-center mb-5">
          <h2 class="text-3xl md:text-3xl font-bold mr-8">
            Three modules. One purchase.
          </h2>
          <p class="text-[var(--ui-text-muted)] mt-2">
            Each module works independently or together.
          </p>
        </div>
        <!-- Tab Navigation -->
        <div class="flex justify-center mb-12">
          <div class="inline-flex bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded-xl p-1.5">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all" :class="[
                activeTab === tab.id
                  ? 'bg-[var(--ui-bg-elevated)] text-[var(--ui-text)] shadow-sm'
                  : 'text-[var(--ui-text-muted)] hover:text-[var(--ui-text)]',
              ]"
              @click="activeTab = tab.id"
            >
              <UIcon :name="tab.icon" class="size-4" />
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="max-w-5xl mx-auto">
          <!-- AI Ready Tab -->
          <div v-show="activeTab === 'ai-ready'" class="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="text-3xl font-bold mb-4">
                Make your site visible to AI
              </h2>
              <p class="text-[var(--ui-text-muted)] text-lg mb-6">
                AI search engines are growing 40%+ yearly. If LLMs can't read your content, you're invisible to a growing audience.
              </p>
              <ul class="space-y-4">
                <li class="flex items-start gap-3">
                  <div class="p-1 rounded bg-green-500/10 mt-0.5">
                    <UIcon name="i-carbon-checkmark" class="size-4 text-green-500" />
                  </div>
                  <div>
                    <div class="font-medium">
                      llms.txt generation
                    </div>
                    <div class="text-sm text-[var(--ui-text-muted)]">
                      Anthropic-spec compliant, auto-maintained
                    </div>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <div class="p-1 rounded bg-green-500/10 mt-0.5">
                    <UIcon name="i-carbon-checkmark" class="size-4 text-green-500" />
                  </div>
                  <div>
                    <div class="font-medium">
                      Model Context Protocol
                    </div>
                    <div class="text-sm text-[var(--ui-text-muted)]">
                      Let AI agents query your content directly
                    </div>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <div class="p-1 rounded bg-green-500/10 mt-0.5">
                    <UIcon name="i-carbon-checkmark" class="size-4 text-green-500" />
                  </div>
                  <div>
                    <div class="font-medium">
                      Semantic search
                    </div>
                    <div class="text-sm text-[var(--ui-text-muted)]">
                      Search by meaning, not just keywords
                    </div>
                  </div>
                </li>
              </ul>
              <div class="mt-10 flex items-center gap-3">
                <UButton to="/docs/ai-ready/getting-started/introduction" variant="outline" icon="i-carbon-download">
                  Install now
                </UButton>
                <div class="text-muted text-xs">
                  Free to try locally.
                </div>
              </div>
            </div>
            <CodeTerminal filename="llms.txt" class="mb-0">
              <div class="font-mono text-sm text-[var(--ui-text-muted)] leading-relaxed">
                <div class="text-green-400">
                  # Your Site
                </div>
                <div class="mt-2">
                  > A concise description of your site
                </div>
                <div class="mt-4 text-green-400">
                  ## Docs
                </div>
                <div class="mt-1 text-blue-400">
                  - [Getting Started](/docs/intro)
                </div>
                <div class="text-blue-400">
                  - [API Reference](/docs/api)
                </div>
                <div class="text-blue-400">
                  - [Examples](/docs/examples)
                </div>
              </div>
            </CodeTerminal>
          </div>

          <!-- AI Search Tab -->
          <div v-show="activeTab === 'ai-search'" class="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="text-3xl font-bold mb-4">
                AI-powered search for your users
              </h2>
              <p class="text-[var(--ui-text-muted)] text-lg mb-6">
                Let visitors ask questions and get instant, accurate answers from your content. No vendor lock-in.
              </p>
              <ul class="space-y-4">
                <li class="flex items-start gap-3">
                  <div class="p-1 rounded bg-green-500/10 mt-0.5">
                    <UIcon name="i-carbon-checkmark" class="size-4 text-green-500" />
                  </div>
                  <div>
                    <div class="font-medium">
                      Works with Nuxt UI
                    </div>
                    <div class="text-sm text-[var(--ui-text-muted)]">
                      Drop-in components, full customization
                    </div>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <div class="p-1 rounded bg-green-500/10 mt-0.5">
                    <UIcon name="i-carbon-checkmark" class="size-4 text-green-500" />
                  </div>
                  <div>
                    <div class="font-medium">
                      Any LLM provider
                    </div>
                    <div class="text-sm text-[var(--ui-text-muted)]">
                      OpenAI, Anthropic, Ollama, and more
                    </div>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <div class="p-1 rounded bg-green-500/10 mt-0.5">
                    <UIcon name="i-carbon-checkmark" class="size-4 text-green-500" />
                  </div>
                  <div>
                    <div class="font-medium">
                      Vector DB support
                    </div>
                    <div class="text-sm text-[var(--ui-text-muted)]">
                      libSQL, pgvector, Upstash
                    </div>
                  </div>
                </li>
              </ul>
              <div class="mt-10 flex items-center gap-3">
                <UButton to="/docs/ai-ready/getting-started/introduction" variant="outline" icon="i-carbon-download">
                  Install now
                </UButton>
                <div class="text-muted text-xs">
                  Free to try locally.
                </div>
              </div>
            </div>
            <CodeTerminal filename="AI Search" class="mb-0">
              <div class="p-6 space-y-4">
                <div class="flex gap-3">
                  <div class="size-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <UIcon name="i-carbon-user" class="size-4 text-blue-400" />
                  </div>
                  <div class="bg-[var(--ui-bg-elevated)] rounded-lg px-4 py-2 text-sm">
                    How do I set up sitemaps?
                  </div>
                </div>
                <div class="flex gap-3">
                  <div class="size-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <UIcon name="i-carbon-bot" class="size-4 text-green-400" />
                  </div>
                  <div class="bg-[var(--ui-bg-elevated)] rounded-lg px-4 py-2 text-sm text-[var(--ui-text-muted)]">
                    The sitemap module auto-generates your sitemap. Add <code class="text-green-400">@nuxtjs/sitemap</code> to your modules...
                  </div>
                </div>
              </div>
            </CodeTerminal>
          </div>

          <!-- Skew Protection Tab -->
          <div v-show="activeTab === 'skew'" class="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="text-3xl font-bold mb-4">
                Zero broken sessions during deploys
              </h2>
              <p class="text-[var(--ui-text-muted)] text-lg mb-6">
                2-5% of sessions break during deployments when users with cached JS try loading chunks that no longer exist.
              </p>
              <ul class="space-y-4">
                <li class="flex items-start gap-3">
                  <div class="p-1 rounded bg-green-500/10 mt-0.5">
                    <UIcon name="i-carbon-checkmark" class="size-4 text-green-500" />
                  </div>
                  <div>
                    <div class="font-medium">
                      Version mismatch detection
                    </div>
                    <div class="text-sm text-[var(--ui-text-muted)]">
                      Knows when client/server are out of sync
                    </div>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <div class="p-1 rounded bg-green-500/10 mt-0.5">
                    <UIcon name="i-carbon-checkmark" class="size-4 text-green-500" />
                  </div>
                  <div>
                    <div class="font-medium">
                      Friendly update prompts
                    </div>
                    <div class="text-sm text-[var(--ui-text-muted)]">
                      Users see a clear message, not a blank screen
                    </div>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <div class="p-1 rounded bg-green-500/10 mt-0.5">
                    <UIcon name="i-carbon-checkmark" class="size-4 text-green-500" />
                  </div>
                  <div>
                    <div class="font-medium">
                      Zero config
                    </div>
                    <div class="text-sm text-[var(--ui-text-muted)]">
                      Install and forget
                    </div>
                  </div>
                </li>
              </ul>
              <div class="mt-10 flex items-center gap-3">
                <UButton to="/docs/ai-ready/getting-started/introduction" variant="outline" icon="i-carbon-download">
                  Install now
                </UButton>
                <div class="text-muted text-xs">
                  Free to try locally.
                </div>
              </div>
            </div>
            <CodeTerminal filename="Update Notification" class="mb-0">
              <SkewProtectionDemoAuto class="w-full h-full" />
            </CodeTerminal>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Platform Support -->
    <section class="py-16 md:py-20 ">
      <UContainer>
        <div class="text-center mb-12">
          <h2 class="text-2xl md:text-3xl font-bold mb-4">
            Works everywhere Nuxt does
          </h2>
          <p class="text-[var(--ui-text-muted)]">
            Full compatibility with your existing setup
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          <div class="flex flex-col items-center gap-3 p-6 bg-[var(--ui-bg-elevated)] rounded-xl border border-[var(--ui-border)]">
            <UIcon name="i-simple-icons-vercel" class="size-8" />
            <span class="text-sm font-medium">Vercel</span>
          </div>
          <div class="flex flex-col items-center gap-3 p-6 bg-[var(--ui-bg-elevated)] rounded-xl border border-[var(--ui-border)]">
            <UIcon name="i-simple-icons-netlify" class="size-8" />
            <span class="text-sm font-medium">Netlify</span>
          </div>
          <div class="flex flex-col items-center gap-3 p-6 bg-[var(--ui-bg-elevated)] rounded-xl border border-[var(--ui-border)]">
            <UIcon name="i-simple-icons-cloudflare" class="size-8" />
            <span class="text-sm font-medium">Cloudflare</span>
          </div>
          <div class="flex flex-col items-center gap-3 p-6 bg-[var(--ui-bg-elevated)] rounded-xl border border-[var(--ui-border)]">
            <UIcon name="i-carbon-server-dns" class="size-8" />
            <span class="text-sm font-medium">Self-hosted</span>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- MCP Section -->
    <section class="bg-black/20 py-16 md:py-24">
      <UContainer>
        <div class="max-w-5xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <!-- Terminal Demo -->
            <CodeTerminal filename="Claude Code" class="mb-0 order-1 lg:order-2">
              <div class="font-mono text-sm space-y-3">
                <div class="flex gap-2">
                  <span class="text-purple-400">$</span>
                  <span class="text-[var(--ui-text-muted)]">claude "add schema.org to my blog posts"</span>
                </div>
                <div class="text-[var(--ui-text-dimmed)] pl-4 border-l-2 border-[var(--ui-border)]">
                  <div class="text-green-400">
                    ◐ Reading nuxt-seo docs...
                  </div>
                  <div class="mt-1">
                    Found: useSchemaOrg composable
                  </div>
                  <div class="mt-1">
                    Adding to pages/blog/[slug].vue
                  </div>
                </div>
                <div class="flex gap-2 mt-2">
                  <span class="text-green-400">✓</span>
                  <span class="text-[var(--ui-text)]">Schema.org added with Article type</span>
                </div>
              </div>
            </CodeTerminal>

            <!-- Content -->
            <div class="order-1 lg:order-2">
              <div class="inline-flex items-center gap-2 text-sm text-purple-400 font-medium mb-4">
                <UIcon name="i-carbon-terminal" class="size-4" />
                Model Context Protocol
              </div>
              <h2 class="text-3xl md:text-4xl font-bold mb-4">
                Vibe code your SEO
              </h2>
              <p class="text-[var(--ui-text-muted)] text-lg mb-8">
                Connect Claude Code, Cursor, or any MCP-compatible IDE to Nuxt SEO.
                Your AI gets full context on every module, config option, and best practice.
              </p>

              <div class="space-y-4 mb-8">
                <div class="flex gap-3">
                  <div class="p-1.5 rounded bg-purple-500/10 mt-0.5 shrink-0">
                    <UIcon name="i-carbon-code" class="size-4 text-purple-400" />
                  </div>
                  <div>
                    <div class="font-medium text-sm">
                      Full module context
                    </div>
                    <div class="text-sm text-[var(--ui-text-muted)]">
                      AI knows every API across all Nuxt SEO modules
                    </div>
                  </div>
                </div>
                <div class="flex gap-3">
                  <div class="p-1.5 rounded bg-purple-500/10 mt-0.5 shrink-0">
                    <UIcon name="i-carbon-flash" class="size-4 text-purple-400" />
                  </div>
                  <div>
                    <div class="font-medium text-sm">
                      No context switching
                    </div>
                    <div class="text-sm text-[var(--ui-text-muted)]">
                      Ask your IDE to configure sitemaps or og:images
                    </div>
                  </div>
                </div>
                <div class="flex gap-3">
                  <div class="p-1.5 rounded bg-purple-500/10 mt-0.5 shrink-0">
                    <UIcon name="i-carbon-plug" class="size-4 text-purple-400" />
                  </div>
                  <div>
                    <div class="font-medium text-sm">
                      One-line setup
                    </div>
                    <div class="text-sm text-[var(--ui-text-muted)]">
                      Works with Claude Code, Cursor, Windsurf
                    </div>
                  </div>
                </div>
              </div>

              <UButton to="/docs/nuxt-seo/getting-started/mcp" variant="outline" size="lg">
                Set up the MCP
                <UIcon name="i-carbon-arrow-right" class="size-4" />
              </UButton>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Reviews Section -->
    <section class="py-16">
      <UContainer>
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold mb-2">
            What Developers Say About Nuxt SEO
          </h2>
          <p class="text-[var(--ui-text-muted)]">
            Feedback from developers using the free modules.
          </p>
        </div>
        <div class="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden">
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

          <div class="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[var(--ui-bg)] to-transparent" />
          <div class="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[var(--ui-bg)] to-transparent" />
        </div>
      </UContainer>
    </section>

    <section class="py-16 md:py-24 bg-[var(--ui-bg-muted)]">
      <UContainer>
        <div class="max-w-5xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <!-- Content -->
            <div>
              <div class="inline-flex items-center gap-2 text-sm text-amber-400 font-medium mb-4">
                <UIcon name="i-carbon-time" class="size-4" />
                Coming Q2 2025
              </div>
              <h2 class="text-3xl md:text-4xl font-bold mb-4">
                Premium templates
              </h2>
              <p class="text-[var(--ui-text-muted)] text-lg mb-8">
                Production-ready Nuxt templates with SEO best practices baked in.
                Launch faster with pre-configured modules and optimized meta tags.
              </p>

              <div class="grid grid-cols-2 gap-3 mb-8">
                <div class="flex items-center gap-2 text-sm">
                  <UIcon name="i-carbon-checkmark" class="size-4 text-green-500 shrink-0" />
                  <span>Documentation sites</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <UIcon name="i-carbon-checkmark" class="size-4 text-green-500 shrink-0" />
                  <span>Blog templates</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <UIcon name="i-carbon-checkmark" class="size-4 text-green-500 shrink-0" />
                  <span>SaaS landing pages</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <UIcon name="i-carbon-checkmark" class="size-4 text-green-500 shrink-0" />
                  <span>E-commerce stores</span>
                </div>
              </div>

              <p class="text-sm text-[var(--ui-text-dimmed)]">
                Included with your license. Saves 1-2 days of SEO setup per project.
              </p>
            </div>

            <!-- Template Preview Grid -->
            <div class="grid grid-cols-2 gap-4">
              <div class="aspect-[4/3] bg-[var(--ui-bg)] rounded-lg border border-[var(--ui-border)] p-4 flex flex-col">
                <div class="flex items-center gap-2 mb-3">
                  <UIcon name="i-carbon-document" class="size-4 text-blue-400" />
                  <span class="text-xs font-medium">Docs</span>
                </div>
                <div class="flex-1 bg-[var(--ui-bg-elevated)] rounded border border-dashed border-[var(--ui-border)]" />
              </div>
              <div class="aspect-[4/3] bg-[var(--ui-bg)] rounded-lg border border-[var(--ui-border)] p-4 flex flex-col">
                <div class="flex items-center gap-2 mb-3">
                  <UIcon name="i-carbon-blog" class="size-4 text-green-400" />
                  <span class="text-xs font-medium">Blog</span>
                </div>
                <div class="flex-1 bg-[var(--ui-bg-elevated)] rounded border border-dashed border-[var(--ui-border)]" />
              </div>
              <div class="aspect-[4/3] bg-[var(--ui-bg)] rounded-lg border border-[var(--ui-border)] p-4 flex flex-col">
                <div class="flex items-center gap-2 mb-3">
                  <UIcon name="i-carbon-rocket" class="size-4 text-purple-400" />
                  <span class="text-xs font-medium">SaaS</span>
                </div>
                <div class="flex-1 bg-[var(--ui-bg-elevated)] rounded border border-dashed border-[var(--ui-border)]" />
              </div>
              <div class="aspect-[4/3] bg-[var(--ui-bg)] rounded-lg border border-[var(--ui-border)] p-4 flex flex-col">
                <div class="flex items-center gap-2 mb-3">
                  <UIcon name="i-carbon-shopping-cart" class="size-4 text-amber-400" />
                  <span class="text-xs font-medium">Store</span>
                </div>
                <div class="flex-1 bg-[var(--ui-bg-elevated)] rounded border border-dashed border-[var(--ui-border)]" />
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-16 md:py-24">
      <UContainer class="max-w-4xl">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            Simple pricing.
          </h2>
          <p class="text-[var(--ui-text-muted)] text-lg">
            One purchase. Lifetime access. No subscriptions.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- Pricing Card -->
          <div class="relative bg-[var(--ui-bg-elevated)] rounded-2xl p-8 border-2 border-green-500">
            <div class="absolute -top-3 left-6">
              <UBadge color="success" variant="solid" size="sm">
                Early Access
              </UBadge>
            </div>

            <h3 class="text-2xl font-bold mb-2">
              Nuxt SEO Pro
            </h3>
            <div class="flex items-baseline gap-3 mb-6">
              <span class="text-4xl font-bold">$119</span>
              <span class="text-lg text-[var(--ui-text-muted)] line-through">$249</span>
              <span class="text-sm text-[var(--ui-text-dimmed)]">+ tax</span>
            </div>

            <ul class="space-y-3 mb-8 text-sm">
              <li class="flex items-center gap-2">
                <UIcon name="i-carbon-checkmark" class="size-4 text-green-500" />
                AI Ready, AI Search, Skew Protection
              </li>
              <li class="flex items-center gap-2">
                <UIcon name="i-carbon-checkmark" class="size-4 text-green-500" />
                Lifetime updates and support
              </li>
              <li class="flex items-center gap-2">
                <UIcon name="i-carbon-checkmark" class="size-4 text-green-500" />
                Private GitHub access
              </li>
              <li class="flex items-center gap-2">
                <UIcon name="i-carbon-checkmark" class="size-4 text-green-500" />
                30-day refund guarantee
              </li>
            </ul>

            <UButton
              to="https://buy.stripe.com/aFaaEXfcU6Os4gjfsJcs801"
              external
              target="_blank"
              size="xl"
              color="primary"
              block
            >
              Get Nuxt SEO Pro
            </UButton>
          </div>

          <!-- Newsletter -->
          <div class="bg-[var(--ui-bg-muted)] rounded-2xl p-8 flex flex-col justify-center">
            <template v-if="waitlistStatus !== 'submitted'">
              <h3 class="text-xl font-semibold mb-2">
                Not ready yet?
              </h3>
              <p class="text-sm text-[var(--ui-text-muted)] mb-6">
                Get notified when price increases or new features ship.
              </p>
              <UForm :schema="ProEmailSchema" :state="waitlistState" class="flex gap-2" @submit="onSubmit">
                <UFormField name="email" class="flex-1">
                  <UInput v-model="waitlistState.email" size="lg" type="email" placeholder="you@company.com" />
                </UFormField>
                <UButton type="submit" size="lg" :loading="waitlistStatus === 'loading'">
                  Notify
                </UButton>
              </UForm>
            </template>
            <div v-else class="text-center py-4">
              <UIcon name="i-carbon-checkmark-filled" class="size-10 text-green-500 mb-3" />
              <p class="font-medium">
                You're on the list!
              </p>
            </div>
            <div>
              <!-- Social Proof -->
              <div class="mt-12 text-center">
                <UAvatarGroup size="lg" class="justify-center mb-3">
                  <UAvatar src="https://cdn.discordapp.com/avatars/212548363529355264/a23dd75d7ffadac117115cb745edb25a.webp?size=240" />
                  <UAvatar src="https://pbs.twimg.com/profile_images/1374040164180299791/ACw4G3nZ_400x400.jpg" />
                  <UAvatar src="https://pbs.twimg.com/profile_images/1832800489580224512/uqwwtRlK_400x400.jpg" />
                  <UAvatar text="+251" class="text-xs font-bold" />
                </UAvatarGroup>
                <p class="text-sm text-[var(--ui-text-muted)]">
                  254+ developers on the waitlist
                </p>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Founder -->
    <section class="py-12">
      <UContainer class="max-w-2xl">
        <div class="text-center">
          <img
            src="https://avatars.githubusercontent.com/u/5326365?v=4"
            alt="Harlan Wilton"
            class="size-20 rounded-full mx-auto mb-6 ring-4 ring-[var(--ui-border)]"
          >
          <blockquote class="text-xl text-[var(--ui-text-muted)] mb-6 leading-relaxed">
            "By purchasing Nuxt SEO Pro you're supporting all of the open-source work I do on Nuxt and within the Nuxt ecosystem. Thank you so much!"
          </blockquote>
          <div class="font-semibold">
            Harlan Wilton
          </div>
          <div class="text-sm text-[var(--ui-text-dimmed)]">
            Nuxt Core Team
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Call to Action Section -->
    <section class="py-24 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent">
      <UContainer class="max-w-3xl text-center">
        <h2 class="text-3xl md:text-5xl font-bold mb-6">
          Ready to get building?
        </h2>
        <p class="text-lg text-[var(--ui-text-muted)] mb-8 max-w-xl mx-auto">
          Get all three modules now while early access pricing lasts. Try in dev first — purchase when ready.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <UButton size="xl" to="https://buy.stripe.com/aFaaEXfcU6Os4gjfsJcs801" external target="_blank" color="primary" class="px-8">
            Get Early Access — $119
          </UButton>
          <UButton size="xl" to="#modules" variant="ghost">
            Learn More
          </UButton>
        </div>
      </UContainer>
    </section>
  </div>
</template>
