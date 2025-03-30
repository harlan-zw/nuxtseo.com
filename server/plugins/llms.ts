import { modules } from '~~/utils/modules'

export default defineNitroPlugin((nitroApp) => {
  // Method 1: Using the hooks directly
  nitroApp.hooks.hook('llms:generate', async (event, options) => {
    nitroApp._nuxtSeoModuleStats = nitroApp._nuxtSeoModuleStats || await $fetch('/api/stats.json')
    options.sections = options.sections.map((section) => {
      const module = modules.find(m => m.slug === section.description)
      if (module) {
        const moduleStats = nitroApp._nuxtSeoModuleStats.modules.find(m => m.slug === section.description)
        const humanNumberDownloads = Intl.NumberFormat('en-US', {
          notation: 'compact',
          compactDisplay: 'short',
        }).format(moduleStats.downloads)
        section.description = `${module.label === 'Nuxt SEO' ? module.label : `Nuxt ${module.label}`} is a Nuxt module maintained by Harlan Wilton, the latest version is ${moduleStats.version} (${humanNumberDownloads} downloads, ${moduleStats?.stars || 0} stars, ${moduleStats?.commitCount || 0} commits, ${moduleStats?.issuesCloses || 0} issues closed)`
      }
      section.links = section.links.map((link) => {
        if (!link.href.endsWith('.md') && !link.href.endsWith('.txt')) {
          link.href = `${link.href}.md`
        }
        link.href = link.href.replace('https://nuxtseo.com//llms-full.txt', 'https://nuxtseo.com/llms-full.txt')
        return link
      })
      return section
    })
    // Add a new section to llms.txt
    options.sections.push({
      title: 'API Documentation',
      description: 'REST API endpoints and usage',
      links: [
        {
          title: 'Authentication',
          description: 'API authentication methods',
          href: `${options.domain}/api/auth`,
        },
      ],
    })
  })
})
