<script setup lang="ts">
defineProps<{
  filename?: string
}>()
</script>

<template>
  <div class="relative">
    <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl -z-10" />
    <div class="bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded-2xl overflow-hidden">
      <div class="bg-[var(--ui-bg-elevated)] px-4 py-3 border-b border-[var(--ui-border)] flex items-center gap-2">
        <div class="flex gap-1.5">
          <div class="size-3 rounded-full bg-red-400/60" />
          <div class="size-3 rounded-full bg-yellow-400/60" />
          <div class="size-3 rounded-full bg-green-400/60" />
        </div>
        <span v-if="filename" class="text-xs text-[var(--ui-text-dimmed)] font-mono ml-2">{{ filename }}</span>
      </div>
      <div class="p-6 font-mono text-sm text-[var(--ui-text-muted)] space-y-2">
        <slot />
      </div>
    </div>
  </div>
</template>
