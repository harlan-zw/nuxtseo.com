import { useAsyncData } from '#imports'
import { titleCase } from 'scule'
import { modifyRelativeDocLinksWithFramework } from '~~/utils/content'

export async function useStats() {
  const nuxtApp = useNuxtApp()
  if (nuxtApp.static.data._nuxtSeoStats) {
    return nuxtApp.static.data._nuxtSeoStats
  }
  const asyncData = useAsyncData('stats', () => $fetch('/api/stats.json'))
  nuxtApp.static.data._nuxtSeoStats = asyncData
  return asyncData
}

export async function useCurrentDocPage() {
  const nuxtApp = useNuxtApp()
  const route = useRouter().currentRoute.value
  if (nuxtApp.static.data.docsCurrent?.path === route.path) {
    return await nuxtApp.static.data.docsCurrent.promise
  }
  const module = modules.find(m => m.slug === route.path.split('/')[2])
  if (!module) {
    throw createError({ statusCode: 404, statusMessage: `Page not found`, fatal: true })
  }

  // eslint-disable-next-line no-async-promise-executor
  const p = new Promise(async (resolve) => {
    const [pageData, surroundData] = await Promise.all([
      queryCollection(module.contentCollection).path(route.path).first(),
      queryCollectionItemSurroundings(module.contentCollection, route.path, {
        fields: ['title', 'description', 'path'],
      }),
    ])
    if (pageData?.body?.value) {
      throw createError({ statusCode: 404, statusMessage: `Page not found: ${route.path}`, fatal: true })
    }

    modifyRelativeDocLinksWithFramework(pageData.body?.value)

    const page = ref(pageData)
    const surround = ref(surroundData.filter(m => m).map(m => ({
      ...m,
      _path: m.path,
    })))

    const lastCommitData = await $fetch(`/api/github/${module.repo.replace('/', '@')}/last-file-commit?file=${module.contentPrefix}${pageData.id.split('/').slice(3).join('/')}`)
    const lastCommit = ref(lastCommitData)

    resolve({
      page,
      surround,
      lastCommit,
    })
  })

  nuxtApp.static.data.docsCurrent = { promise: p, path: toRaw(route.path) }
  return p
}

export function movingAverage(data: number[], windowSize: number) {
  const result = []
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - windowSize + 1) // Determine the start of the window
    const windowData = data.slice(start, i + 1) // Get the data for the window
    const sum = windowData.reduce((sum, point) => sum + point, 0) // Sum the downloads in the window
    const avg = sum / windowData.length // Calculate the average
    result.push(avg) // Add the moving average to the result
  }
  return result
}

export function mapPath(data, node = 0) {
  if (node < 2) {
    return mapPath(data[0].children, node + 1)
  }
  return data.map((item) => {
    if (item.children?.length && !item.page) {
      item.title = titleCase(item.title)
      item.children = mapPath(item.children, node + 1)
    }
    return {
      ...item,
      _path: item.path,
    }
  })
}
export const reviews = [
  {
    username: '@nogueiraju',
    img: 'https://pbs.twimg.com/profile_images/1413881210321911810/5j9VNqaN_normal.jpg',
    name: 'Ju Nogueira',
    body: 'Nuxt SEO by @harlan_zw. Makes my life a lot easier.',
  },
  {
    name: 'Estéban',
    body: 'I have to say that your SEO modules are one of the things that make me stay on Nuxt for every one of my websites.',
    img: 'https://avatars.githubusercontent.com/u/45267552?v=4',
    username: '@soubiran_',
  },
  {
    username: '@eoThica',
    name: 'Thomas ✪',
    body: `Just did schema markup for a whole webshop in 20 minutes cause of @harlan_zw. absolutely gorgeous.  Check it out.
nuxtseo.com`,
    img: 'https://pbs.twimg.com/profile_images/1650610309785108484/arOyrwG-_normal.png',
  },
  {
    username: 'marcustoy',
    name: 'marcustoy',
    body: `Hey man, appreciate all your great work on those Nuxt modules. I'm using Nuxt SEO and it's awesome! 💪🏻
`,
    img: 'https://cdn.discordapp.com/avatars/716064643809804288/4895f3e4b7551e9ee03a98f7cd2675fb.webp?size=80',
  },
  {
    username: '@__Sun__',
    name: 'Sun',
    body: `how freaking cool is this ?!

OG Image preview of community templates, as well as the ones i made, right in the @nuxt_js dev tools 🤯

amazing work @harlan_zw`,
    img: 'https://pbs.twimg.com/profile_images/1596204487948894209/SINw8xBj_normal.jpg',
  },
  {
    username: '@Atinux',
    name: 'Sébastien Chopin',
    body: `What an impressive work done by @harlan_zw on Nuxt OG Image v3 🙌`,
    img: 'https://avatars.githubusercontent.com/u/904724?v=4',
  },
  {
    name: 'Fabian B.',
    img: 'https://pbs.twimg.com/profile_images/1715052883899555840/L0TFwzp9_normal.jpg',
    username: '@madebyfabian',
    body: `Nuxt GraphQL middleware by @dulnan is really, really good. And Nuxt SEO by @harlan_zw is also something I use in almost every project. There are so many more though!`,
  },
]

export function isHydratingRef() {
  const nuxtApp = useNuxtApp()
  const isHydrating = ref(true)
  nuxtApp.hooks.hook('page:finish', () => {
    isHydrating.value = false
  })
  return isHydrating
}
