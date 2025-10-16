<script lang="ts" setup>
const { data: md } = await useAsyncData(() => parseMarkdown(`
\`\`\`vue [app.vue]
<template>
  <SkewNotification v-slot="{ isCurrentChunksOutdated, dismiss, reload, timeAgo }">
    <Transition name="slide-up">
      <div v-if="isCurrentChunksOutdated" class="skew-notification">
        <div class="skew-notification-content">
          <div class="skew-notification-message">
            <span class="skew-notification-icon">✨</span>
            <div>
              <div class="skew-notification-title">
                New update available!
              </div>
              <div v-if="timeAgo" class="skew-notification-subtitle">
                Released {{ timeAgo }}
              </div>
            </div>
          </div>
          <div class="skew-notification-actions">
            <button class="skew-button skew-button-secondary" @click="dismiss">
              Dismiss
            </button>
            <button class="skew-button skew-button-primary" @click="reload">
              Refresh
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </SkewNotification>
</template>

<style>
.skew-notification {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
  max-width: 400px;
}
.skew-notification-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 1rem 1.25rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.skew-notification-message {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.skew-notification-title {
  font-weight: 600;
  font-size: 0.9375rem;
}
.skew-notification-subtitle {
  font-size: 0.8125rem;
  color: #666;
}
.skew-notification-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
.skew-button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
}
.skew-button-primary {
  background: #18181b;
  color: white;
}
.skew-button-secondary {
  background: #f4f4f5;
  color: #52525b;
}
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(1rem);
}
</style>
\`\`\``))
</script>

<template>
  <ProseCodeGroup>
    <div label="Live Example">
      <div class="not-prose mt-3">
        <div class="inline-block">
          <div class="skew-notification">
            <div class="skew-notification-content">
              <div class="skew-notification-message">
                <span class="skew-notification-icon">✨</span>
                <div>
                  <div class="skew-notification-title">
                    New update available!
                  </div>
                </div>
              </div>
              <div class="skew-notification-actions">
                <button class="skew-button skew-button-secondary">
                  Dismiss
                </button>
                <button class="skew-button skew-button-primary">
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div label="Code">
      <MDCRenderer v-bind="md" />
    </div>
  </ProseCodeGroup>
</template>

<style>
.skew-notification {
  z-index: 9999;
  max-width: 400px;
}
.skew-notification-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 1rem 1.25rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.dark .skew-notification-content {
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.skew-notification-message {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.skew-notification-title {
  font-weight: 600;
  font-size: 0.9375rem;
}
.skew-notification-subtitle {
  font-size: 0.8125rem;
  color: #666;
}
.skew-notification-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
.skew-button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
}
.skew-button-primary {
  background: #18181b;
  color: white;
}
.skew-button-secondary {
  background: #f4f4f5;
  color: #52525b;
}
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(1rem);
}
</style>
