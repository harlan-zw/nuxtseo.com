<template>
<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" class="text-[var(--ui-text)]">
  <!-- Title -->
  <text x="200" y="30" font-size="16" text-anchor="middle" font-weight="bold" fill="currentColor">SEO Experience Levels</text>

  <!-- Pie chart -->
  <g transform="translate(200, 120)">
    <!-- Beginners (40%) - Green slice -->
    <path d="M 0 0 L 0 -80 A 80 80 0 0 1 49.6 -62.8 Z" fill="#10B981" />

    <!-- Intermediate (35%) - Blue slice -->
    <path d="M 0 0 L 49.6 -62.8 A 80 80 0 0 1 49.6 62.8 Z" fill="#3B82F6" />

    <!-- Experienced (25%) - Purple slice -->
    <path d="M 0 0 L 49.6 62.8 A 80 80 0 0 1 -49.6 62.8 A 80 80 0 0 1 0 -80 Z" fill="#8B5CF6" />
  </g>

  <!-- Legend -->
  <g transform="translate(20, 200)">
    <!-- Beginners -->
    <rect x="0" y="0" width="15" height="15" fill="#10B981" />
    <text x="20" y="12" font-size="11" fill="currentColor">Beginner 40%</text>

    <!-- Intermediate -->
    <rect x="130" y="0" width="15" height="15" fill="#3B82F6" />
    <text x="150" y="12" font-size="11" fill="currentColor">Intermediate 35%</text>

    <!-- Experienced -->
    <rect x="265" y="0" width="15" height="15" fill="#8B5CF6" />
    <text x="285" y="12" font-size="11" fill="currentColor">Experienced 25%</text>
  </g>
</svg>
</template>
<script setup lang="ts">
</script>
