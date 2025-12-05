export type LearnPlatform = 'nuxt' | 'vue'

const platform = ref<LearnPlatform>('nuxt')

export function useLearnPlatform() {
  return platform
}
