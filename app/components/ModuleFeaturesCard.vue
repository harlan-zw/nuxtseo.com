<script lang="ts" setup>
const props = defineProps<{
  module: string | { label: string, description: string, icon: string }
  items: any[]
}>()

const isComingSoon = computed(() => typeof props.module === 'object')
</script>

<template>
  <div>
    <ModuleCardComingSoon v-if="isComingSoon" :module="module" size="lg" class="rounded-b-none w-full" />
    <ModuleCard v-else :slug="module" size="lg" class="rounded-b-none w-full" />
    <UCard class="rounded-t-none">
      <UAccordion v-if="!isComingSoon" :default-value="false" :items="items">
        <template #default="{ item }">
          <div class="dark:text-neutral-300 text-neutral-600 text-sm">
            {{ item.label }}
          </div>
        </template>
        <template v-for="(item, key) in items" :key="key" #[item.slot]>
          <ContentRenderer v-if="item?.body" :value="item.body" unwrap="p" class="text-xs pb-5" />
        </template>
      </UAccordion>
      <div v-else>
        <ul class="space-y-4">
          <li v-for="(item, key) in items" :key="key">
            <div class="font-semibold text-[var(--ui-text)] text-sm mb-1">
              {{ item.emoji }} {{ item.label }}
            </div>
            <div class="text-[var(--ui-text-muted)] text-sm leading-relaxed prose-a:underline">
              <MDC :value="item.description" unwrap="p" />
            </div>
          </li>
        </ul>
      </div>
    </UCard>
  </div>
</template>
