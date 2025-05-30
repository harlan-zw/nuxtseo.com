<script setup lang="ts">
import { computed } from 'vue'

// convert to typescript props
const props = withDefaults(defineProps<{
  colorMode?: 'dark' | 'light'
  title?: string
  description?: string
  icon?: string | boolean
  version?: string
  siteName?: string
  siteLogo?: string
  theme?: string
}>(), {
  colorMode: 'light',
  theme: '#00dc82',
  title: 'title',
})

const HexRegex = /^#(?:[0-9a-f]{3}){1,2}$/i

const themeHex = computed(() => {
  // regex test if valid hex
  if (HexRegex.test(props.theme))
    return props.theme

  // if it's hex without the hash, just add the hash
  if (HexRegex.test(`#${props.theme}`))
    return `#${props.theme}`

  // if it's rgb or rgba, we convert it to hex
  if (props.theme.startsWith('rgb')) {
    const rgb = props.theme.replace('rgb(', '').replace('rgba(', '').replace(')', '').split(',').map(v => Number.parseInt(v.trim(), 10))
    const hex = rgb
      .map((v) => {
        const hex = v.toString(16)
        return hex.length === 1 ? `0${hex}` : hex
      })
      .join('')
    return `#${hex}`
  }
  return '#FFFFFF'
})

const themeRgb = computed(() => {
  // we want to convert it so it's just `<red>, <green>, <blue>` (255, 255, 255)
  return themeHex.value.replace('#', '').match(/.{1,2}/g)?.map(v => Number.parseInt(v, 16)).join(', ')
})
</script>

<template>
  <div
    class="w-full h-full flex justify-between relative p-[60px]"
    :class="[
      colorMode === 'light' ? ['bg-white', 'text-neutral-900'] : ['bg-neutral-900', 'text-neutral-50'],
    ]"
  >
    <div
      class="flex absolute bottom-[-200%] right-[-50%]" :style="{
        width: '200%',
        height: '250%',
        backgroundImage: `radial-gradient(circle, rgba(${themeRgb}, 0.5) 0%,  ${colorMode === 'dark' ? 'rgba(5, 5, 5,0.3)' : 'rgba(255, 255, 255, 0.7)'} 50%, ${props.colorMode === 'dark' ? 'rgba(5, 5, 5,0)' : 'rgba(255, 255, 255, 0)'} 70%)`,
      }"
    />
    <svg viewBox="0 0 1440 181" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-blue-900/90 absolute w-[1200px] h-[100px] top-[0px] transition-all text-(--ui-primary) flex-shrink-0 duration-[400ms] z-20"><mask id="path-1-inside-1_414_5526" fill="white"><path d="M0 0H1440V181H0V0Z" /></mask><path d="M0 0H1440V181H0V0Z" fill="url(#paint0_linear_414_5526)" fill-opacity="0.22" /><path d="M0 2H1440V-2H0V2Z" fill="url(#paint1_linear_414_5526)" mask="url(#path-1-inside-1_414_5526)" /><defs><linearGradient id="paint0_linear_414_5526" x1="720" y1="0" x2="720" y2="181" gradientUnits="userSpaceOnUse"><stop stop-color="currentColor" /><stop offset="1" stop-color="currentColor" stop-opacity="0" /></linearGradient><linearGradient id="paint1_linear_414_5526" x1="0" y1="90.5" x2="1440" y2="90.5" gradientUnits="userSpaceOnUse"><stop stop-color="currentColor" stop-opacity="0" /><stop offset="0.395" stop-color="currentColor" /><stop offset="1" stop-color="currentColor" stop-opacity="0" /></linearGradient></defs></svg>
    <div class="h-full w-full justify-between relative">
      <div class="flex flex-row justify-center items-center text-left w-full">
        <svg height="70" viewBox="0 0 1204 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M377 200C379.16 200 381 198.209 381 196V103C381 103 386 112 395 127L434 194C435.785 197.74 439.744 200 443 200H470V50H443C441.202 50 439 51.4941 439 54V148L421 116L385 55C383.248 51.8912 379.479 50 376 50H350V200H377Z" fill="currentColor" />
          <path d="M726 92H739C742.314 92 745 89.3137 745 86V60H773V92H800V116H773V159C773 169.5 778.057 174 787 174H800V200H783C759.948 200 745 185.071 745 160V116H726V92Z" fill="currentColor" />
          <path d="M591 92V154C591 168.004 585.742 179.809 578 188C570.258 196.191 559.566 200 545 200C530.434 200 518.742 196.191 511 188C503.389 179.809 498 168.004 498 154V92H514C517.412 92 520.769 92.622 523 95C525.231 97.2459 526 98.5652 526 102V154C526 162.059 526.457 167.037 530 171C533.543 174.831 537.914 176 545 176C552.217 176 555.457 174.831 559 171C562.543 167.037 563 162.059 563 154V102C563 98.5652 563.769 96.378 566 94C567.96 91.9107 570.028 91.9599 573 92C573.411 92.0055 574.586 92 575 92H591Z" fill="currentColor" />
          <path d="M676 144L710 92H684C680.723 92 677.812 93.1758 676 96L660 120L645 97C643.188 94.1758 639.277 92 636 92H611L645 143L608 200H634C637.25 200 640.182 196.787 642 194L660 167L679 195C680.818 197.787 683.75 200 687 200H713L676 144Z" fill="currentColor" />
          <path d="M168 200H279C282.542 200 285.932 198.756 289 197C292.068 195.244 295.23 193.041 297 190C298.77 186.959 300.002 183.51 300 179.999C299.998 176.488 298.773 173.04 297 170.001L222 41C220.23 37.96 218.067 35.7552 215 34C211.933 32.2448 207.542 31 204 31C200.458 31 197.067 32.2448 194 34C190.933 35.7552 188.77 37.96 187 41L168 74L130 9.99764C128.228 6.95784 126.068 3.75491 123 2C119.932 0.245087 116.542 0 113 0C109.458 0 106.068 0.245087 103 2C99.9323 3.75491 96.7717 6.95784 95 9.99764L2 170.001C0.226979 173.04 0.00154312 176.488 1.90993e-06 179.999C-0.0015393 183.51 0.229648 186.959 2 190C3.77035 193.04 6.93245 195.244 10 197C13.0675 198.756 16.4578 200 20 200H90C117.737 200 137.925 187.558 152 164L186 105L204 74L259 168H186L168 200ZM89 168H40L113 42L150 105L125.491 147.725C116.144 163.01 105.488 168 89 168Z" fill="#00DC82" />
          <path d="M892 200C881.746 200 873.788 197.911 866 194C858.212 189.959 851.543 184.169 847 177C842.587 169.7 840.389 161.646 840 152H868C868.649 159.039 870.717 163.959 875 168C879.413 172.041 885.861 174 893 174C899.62 174 904.106 172.737 908 170C912.024 167.263 914 164.084 914 159C914 155.48 913.336 152.086 911 150C908.793 147.784 906.375 146.173 903 145C899.625 143.827 894.23 142.564 888 141C878.784 138.784 870.971 136.477 865 134C859.159 131.393 854.283 127.605 850 122C845.717 116.395 844 108.777 844 99C844 91.5698 845.976 84.8659 850 79C854.024 73.1341 859.861 68.2589 867 65C874.139 61.6108 881.914 60 891 60C900.735 60 909.601 61.4805 917 65C924.528 68.5196 929.846 73.4823 934 80C938.283 86.5177 940.74 94.3967 941 103H913C912.481 97.5251 910.894 93.1285 907 90C903.106 86.7411 897.49 85 891 85C885.289 85 880.375 86.5233 877 89C873.625 91.4767 872 94.959 872 99C872 102.78 873.664 105.784 876 108C878.336 110.216 881.366 111.696 885 113C888.634 114.173 893.64 115.566 900 117C909.346 119.216 916.159 121.654 922 124C927.841 126.346 932.846 130.395 937 136C941.283 141.475 944 148.354 944 158C944 166.473 941.283 173.743 937 180C932.717 186.257 926.788 191.611 919 195C911.342 198.389 902.124 200 892 200Z" fill="#00DC82" />
          <path d="M1056 200H961V60H1054V87H990V116H1041V141H990V173H1056V200Z" fill="#00DC82" />
          <path d="M1134 200C1120.76 200 1108.64 196.996 1098 191C1087.49 184.873 1080.1 176.559 1074 166C1068.03 155.311 1065 143.296 1065 130C1065 116.704 1068.03 104.559 1074 94C1080.1 83.311 1088.49 74.9963 1099 69C1109.64 62.8734 1120.76 60 1134 60C1147.11 60 1159.49 62.8734 1170 69C1180.64 74.9963 1189.03 83.311 1195 94C1201.1 104.559 1204 116.704 1204 130C1204 143.296 1201.1 155.311 1195 166C1189.03 176.559 1180.64 184.873 1170 191C1159.49 196.996 1147.11 200 1134 200ZM1134 174C1141.66 174 1148.9 172.78 1155 169C1161.23 165.089 1165.63 159.778 1169 153C1172.5 146.222 1174 138.473 1174 130C1174 121.527 1172.5 113.778 1169 107C1165.63 100.222 1161.23 94.9106 1155 91C1148.9 87.0894 1141.66 85 1134 85C1126.34 85 1120.1 87.0894 1114 91C1107.9 94.9106 1102.5 100.222 1099 107C1095.63 113.778 1094 121.527 1094 130C1094 138.473 1095.63 146.222 1099 153C1102.5 159.778 1107.9 165.089 1114 169C1120.1 172.78 1126.34 174 1134 174Z" fill="#00DC82" />
        </svg>
      </div>
      <div class="flex justify-center max-w-[600px] mb-[60px] mx-auto gap-10">
        <UIcon v-for="(module, key) in modules" :key="key" mode="svg" dynamic class="text-blue-300 w-[120px] h-[120px]" :name="module.icon" />
      </div>
    </div>
  </div>
</template>
