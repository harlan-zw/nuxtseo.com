export const appStorage = defineEventHandler((event) => {
  const cloudflare = event?.context?.cloudfare
  return cloudflare?.env?.KV || useStorage()
})
