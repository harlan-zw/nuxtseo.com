<template>
<svg viewBox="0 0 420 280" xmlns="http://www.w3.org/2000/svg" class="text-[var(--ui-text)]">
  <!-- Title -->
  <text x="210" y="30" font-size="16" text-anchor="middle" font-weight="bold" fill="currentColor">Module Ratings (Average out of 10)</text>

  <!-- Axes -->
  <line x1="60" y1="220" x2="390" y2="220" stroke="#666" stroke-width="2" />
  <line x1="60" y1="220" x2="60" y2="40" stroke="#666" stroke-width="2" />

  <!-- X-axis labels -->
  <text x="115" y="240" font-size="12" text-anchor="middle" fill="currentColor">SEO Analyze</text>
  <text x="225" y="240" font-size="12" text-anchor="middle" fill="currentColor">Google Search Console</text>
  <text x="335" y="240" font-size="12" text-anchor="middle" fill="currentColor">Internal Links</text>
  <text x="115" y="260" font-size="12" text-anchor="middle" fill="currentColor">8.4/10</text>
  <text x="225" y="260" font-size="12" text-anchor="middle" fill="currentColor">7.8/10</text>
  <text x="335" y="260" font-size="12" text-anchor="middle" fill="currentColor">7.0/10</text>

  <!-- Y-axis labels -->
  <text x="50"  fill="currentColor" y="220" font-size="10" text-anchor="end">0</text>
  <text x="50"  fill="currentColor" y="180" font-size="10" text-anchor="end">2</text>
  <text x="50"  fill="currentColor" y="140" font-size="10" text-anchor="end">4</text>
  <text x="50"  fill="currentColor" y="100" font-size="10" text-anchor="end">6</text>
  <text x="50"  fill="currentColor" y="60" font-size="10" text-anchor="end">8</text>
  <text x="50"  fill="currentColor" y="40" font-size="10" text-anchor="end">10</text>

  <!-- Bars -->
  <rect x="80" y="56" width="70" height="164" fill="#10B981" />
  <rect x="190" y="64" width="70" height="156" fill="#3B82F6" />
  <rect x="300" y="80" width="70" height="140" fill="#8B5CF6" />

  <!-- Additional note for Redirects -->
  <text x="210" y="280" font-size="12" text-anchor="middle" font-style="italic"  fill="currentColor" style="opacity: 0.5;">Redirects rated 5.4/10 (not shown)</text>
</svg>
</template>
<script setup lang="ts">
</script>
