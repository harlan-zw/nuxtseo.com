const isAiSearchDrawerOpen = ref(false)
const aiSearchQuery = ref('')

export const useAiSearchDrawer = () => ({
  isOpen: isAiSearchDrawerOpen,
  query: aiSearchQuery,
})
