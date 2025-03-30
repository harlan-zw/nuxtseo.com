import { cachedFetchGitHubRaw } from '~~/server/utils/github'
import { modules } from '~~/utils/modules'

export default defineEventHandler(async (e) => {
  const path = getRequestPath(e)
  if (path.startsWith('/docs') && path.endsWith('.md')) {
    const module = modules.find(m => m.slug === e.path.split('/')[2])
    if (module) {
      try {
        const page = await queryCollection(e, module.contentCollection).path(path.replace('.md', '')).first()
        let repo = `${module.repo}/${module.contentPrefix}`
        // doc has moved
        if (repo.startsWith('harlan-zw/nuxt-seo')) {
          repo = 'harlan-zw/nuxtseo.com/content'
        }
        const text = await cachedFetchGitHubRaw(e, `${repo}${page.id.split('/').slice(3).join('/')}`)
        // set headers for markdown - needs to be utf8
        setHeader(e, 'Content-Type', 'text/markdown; charset=utf-8')
        setHeader(e, 'Cache-Control', 'no-cache')
        return text
      }
      catch (e) {
        console.error(e)
        return 'Failed to load markdown'
      }
    }
  }
})
