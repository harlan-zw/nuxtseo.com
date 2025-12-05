<template>
  <div class="grid grid-cols-2 gap-6">
    <ModuleCard v-for="module in modules.filter(m => m.slug !== 'site-config' && m.slug !== 'nuxt-seo' && !m.pro)" :key="module.slug" :slug="module.slug" />
  </div>
</template>
