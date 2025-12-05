<script setup lang="ts">
const learnPlatform = useLearnPlatform()
await navigateTo(`/learn-seo/${learnPlatform.value}`, { replace: true })
</script>
