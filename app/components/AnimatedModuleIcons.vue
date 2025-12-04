<script setup lang="ts">
import { motion } from 'motion-v'

interface Module {
  slug: string
  to: string
  label: string
  icon: string
}

const props = defineProps<{
  modules: Module[]
}>()

const animatedIn = ref(false)
onMounted(() => {
  setTimeout(() => {
    animatedIn.value = true
  }, props.modules.length * 300 + 1000)
})
</script>

<template>
  <div class="flex flex-wrap xl:max-w-[400px] items-center gap-6 justify-center">
    <motion.div
      v-for="(module, i) in modules"
      :key="module.slug"
      layout
      :initial="{
        opacity: 0,
        y: 40,
        scale: 0.8,
        rotateZ: -10,
      }"
      :animate="{
        opacity: 1,
        y: 0,
        scale: 1,
        rotateZ: 0,
        transition: animatedIn ? { duration: 0.2 } : {
          type: 'spring',
          damping: 12,
          stiffness: 100,
          delay: i * 0.3,
        },
      }"
      :while-hover="{
        scale: 1.1,
        rotateZ: 5,
        y: -5,
      }"
      class="cursor-pointer transform-gpu"
    >
      <NuxtLink :to="module.to" :aria-label="module.label">
        <UIcon
          :name="module.icon"
          class="size-6 sm:size-10 xl:size-25 text-blue-300"
        />
      </NuxtLink>
    </motion.div>
  </div>
</template>
