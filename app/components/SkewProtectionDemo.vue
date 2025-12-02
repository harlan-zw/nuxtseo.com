<script setup lang="ts">
const showNotification = ref(false)
const deployments = ref<Array<{ version: number, chunks: Record<string, string> }>>([])

function generateChunkHash(seed: number) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let hash = ''
  for (let i = 0; i < 8; i++) {
    hash += chars[Math.floor((seed * (i + 1) * 12345) % chars.length)]
  }
  return hash
}

// Initialize with first deployment
if (deployments.value.length === 0) {
  deployments.value.push({
    version: 1,
    chunks: {
      entry: generateChunkHash(1),
      index: generateChunkHash(2),
      about: generateChunkHash(3),
      components: generateChunkHash(4),
    },
  })
}

function triggerRelease() {
  // Reset after 5 releases
  if (deployments.value.length >= 5) {
    deployments.value = [{
      version: 1,
      chunks: {
        entry: generateChunkHash(1),
        index: generateChunkHash(2),
        about: generateChunkHash(3),
        components: generateChunkHash(4),
      },
    }]
    showNotification.value = false
    return
  }

  const lastDeployment = deployments.value[deployments.value.length - 1]
  const newVersion = lastDeployment.version + 1

  // Some chunks stay the same, some change
  const newChunks: Record<string, string> = {}
  const chunkNames = Object.keys(lastDeployment.chunks)

  chunkNames.forEach((name, idx) => {
    // 50% chance a chunk stays the same (simulating unchanged code)
    if (Math.random() > 0.5) {
      newChunks[name] = lastDeployment.chunks[name]
    }
    else {
      newChunks[name] = generateChunkHash(newVersion * 10 + idx)
    }
  })

  deployments.value.push({
    version: newVersion,
    chunks: newChunks,
  })

  showNotification.value = true
}

function handleDismiss() {
  showNotification.value = false
}

function handleReload() {
  showNotification.value = false
}
</script>

<template>
  <div class="space-y-4">
    <div class="relative min-h-[120px] flex items-center justify-center bg-[var(--ui-bg)] rounded-lg border border-[var(--ui-border)] p-4">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div v-if="showNotification" class="absolute">
          <div class="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-full shadow-lg ring-1 ring-gray-200 dark:ring-gray-800 px-4 py-3">
            <span class="text-lg">✨</span>
            <div class="text-sm font-medium">
              Update available
            </div>
            <UButton color="primary" size="xs" label="Refresh" @click="handleReload" />
            <UButton color="neutral" variant="ghost" size="xs" icon="i-heroicons-x-mark-20-solid" @click="handleDismiss" />
          </div>
        </div>
        <UButton
          v-else
          color="primary"
          size="md"
          @click="triggerRelease"
        >
          Show Example
        </UButton>
      </Transition>
    </div>
  </div>
</template>
