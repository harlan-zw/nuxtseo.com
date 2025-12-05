import { modules } from '../../modules'
import { mapPath } from './data'
import { useLearnPlatform } from './learnPlatform'

export function transformNavigation(res: any, doMap = true) {
  const nav = (doMap ? mapPath(res) : res) as any[]
  return (nav || []).map((m) => {
    if (m.path.includes('/api')) {
      m.icon = 'i-logos-nuxt-icon'
      m.title = 'Nuxt API'
    }
    else if (m.path.includes('/nitro-api')) {
      m.icon = 'i-unjs-nitro'
      m.title = 'Nitro API'
    }
    else if (m.path.includes('/releases')) {
      m.icon = 'i-noto-sparkles'
      m.title = 'Releases'
    }
    else if (m.path.includes('/migration-guide')) {
      m.icon = 'i-noto-globe-with-meridians'
      m.title = 'Migration Guides'
    }
    else if (m.path.includes('/guides')) {
      m.title = 'Core Concepts'
    }
    if (m.children?.length) {
      m.children = m.children.map((c) => {
        if (c.children?.length === 1) {
          c = c.children[0]
        }
        return c
      })
      m.children = m.children.map((c) => {
        if (c.path.includes('/api/config')) {
          c.icon = 'i-vscode-icons-file-type-typescript-official'
          c.title = 'nuxt.config.ts'
        }
        if (c.path.endsWith('hooks')) {
          c.icon = 'i-carbon-webhook'
          c.iconUi = 'opacity-75'
        }
        else if (c.path.includes('/api/schema')) {
          c.icon = 'i-vscode-icons-file-type-typescript-official'
          c.title = 'runtime/types.ts'
        }
        else if (c.title.endsWith('()')) {
          c.html = true
          const [fnName] = c.title.split('()')
          c.title = `<code class="language-ts shiki shiki-themes github-light github-light material-theme-palenight" language="ts"><span style="--shiki-light: #6F42C1; --shiki-default: #6F42C1; --shiki-dark: #82AAFF;">${fnName}</span><span style="--shiki-light: #24292E; --shiki-default: #24292E; --shiki-dark: #BABED8;">()</span></code>`
        }
        else if (c.title.startsWith('<') && c.title.endsWith('>') && !c.title.includes('<code')) {
          const inner = c.title.slice(1, -1)
          c.html = true
          c.title = `<code class="language-ts shiki shiki-themes github-light github-light material-theme-palenight" language="ts"><span class="line" line="2"><span style="--shiki-light: #24292E; --shiki-default: #24292E; --shiki-dark: #89DDFF;">  &lt;</span><span style="--shiki-light: #22863A; --shiki-default: #22863A; --shiki-dark: #F07178;">${inner}</span><span style="--shiki-light: #24292E; --shiki-default: #24292E; --shiki-dark: #89DDFF;"> /&gt;
</span></span></code>`
        }
        if (c.children?.length === 1) {
          c = c.children[0]
        }
        return c
      })
      // make sure childen ending in hooks are always last
      m.children.sort((a, b) => {
        if (a.path.endsWith('hooks') && !b.path.endsWith('hooks')) {
          return 1
        }
        if (!a.path.endsWith('hooks') && b.path.endsWith('hooks')) {
          return -1
        }
        // always sort functions alphabetically top (if they include ()), should be first
        if (a.title.includes('()') && !b.title.includes('()')) {
          return -1
        }
        if (!a.title.includes('()') && b.title.includes('()')) {
          return 1
        }
        return 0
      })
    }
    return m
  })
}

// const ecosystemLinks = [
//   {
//     label: 'Unhead',
//     to: 'https://unhead.unjs.io',
//     icon: 'i-custom-unhead',
//     target: '_blank',
//     description: 'Unhead is the any-framework document head manager built for performance and delightful developer experience.',
//   },
//   {
//     label: 'Zhead',
//     to: 'https://zhead.dev',
//     icon: 'i-custom-unhead',
//     description: 'Zhead is an open-source <head> database. Discover new tags to use to improve your SEO, accessibility and performance.',
//     target: '_blank',
//   },
//   {
//     label: 'Request Indexing',
//     icon: 'i-custom-request-indexing',
//     to: 'https://requestindexing.com',
//     description: 'A free, open-source tool to request pages to be indexed using the Web Search Indexing API and view your Google Search Console data.',
//     target: '_blank',
//   },
//   {
//     label: 'Unlighthouse',
//     icon: 'i-custom-unlighthouse',
//     to: 'https://unlighthouse.dev',
//     description: 'Unlighthouse is a tool to scan your entire site with Google Lighthouse in 2 minutes (on average). Open source, fully configurable with minimal setup.',
//     target: '_blank',
//   },
// ]

export const menu = computed(() => {
  const platform = useLearnPlatform()
  const learnBase = `/learn-seo/${platform.value}`

  return [
    {
      label: 'Get Started',
      icon: 'i-ph-book-open-duotone',
      to: `/docs/nuxt-seo/getting-started/introduction`,
      children: [],
    },
    {
      label: 'Modules',
      icon: 'i-carbon-3rd-party-connected',
      children: modules.filter(m => m.slug !== 'nuxt-seo' && !m.pro).map(m => ({
        label: m.label,
        icon: m.icon,
        to: `/docs/${m.slug}/getting-started/introduction`,
        disabled: m.soon,
        class: m.soon ? 'opacity-30 cursor-not-allowed' : '',
        // need to pass custom module details as ui props so we can modify slot markup
        ui: {
          soon: m.soon,
          pro: m.pro,
        },
      })),
    },
    {
      label: 'Learn SEO',
      icon: 'i-ph-books-duotone',
      children: [
        {
          label: 'Mastering Meta',
          icon: 'i-heroicons-h1-solid',
          to: `${learnBase}/mastering-meta`,
        },
        {
          label: 'Controlling Crawlers',
          icon: 'i-ph-robot-duotone',
          to: `${learnBase}/controlling-crawlers`,
        },
        {
          label: 'Launch & Listen',
          icon: 'i-ph-rocket-duotone',
          to: `${learnBase}/launch-and-listen`,
        },
        {
          label: 'Routes & Rendering',
          icon: 'i-carbon-recording',
          to: `${learnBase}/routes-and-rendering`,
        },
        {
          label: 'Staying Secure',
          icon: 'i-carbon-security',
          to: `${learnBase}/security`,
        },
      ],
    },
    {
      label: 'Pro',
      icon: 'i-ph-sparkle-duotone',
      to: '/pro',
      // children: modules.filter(m => m.pro).map(m => ({
      //   label: m.label,
      //   icon: m.icon,
      //   to: `/docs/${m.slug}/getting-started/introduction`,
      //   disabled: m.soon,
      //   class: m.soon ? 'opacity-30 cursor-not-allowed' : '',
      //   // need to pass custom module details as ui props so we can modify slot markup
      //   ui: {
      //     soon: m.soon,
      //     pro: m.pro,
      //   },
      // })),
    },
    // {
    //   label: 'Recipes',
    //   icon: 'i-ph-cooking-pot-duotone',
    //   children: [
    //     {
    //       label: 'Documentation Site',
    //       description: 'A starter kit for a documentation site with Nuxt SEO.',
    //       icon: 'i-carbon-document-requirements',
    //       to: '/learn/recipes/documentation-site',
    //     },
    //     // {
    //     //   label: 'Blog',
    //     //   description: 'A starter kit for a setting up a blog site with Nuxt SEO.',
    //     //   icon: 'i-tabler-slashes',
    //     //   to: '/learn/trailing-slashes',
    //     // },
    //   ],
    // },
    // {
    //   label: 'Ecosystem',
    //   icon: 'i-ph-heart-straight-duotone',
    //   children: ecosystemLinks,
    // },
  ]
})
