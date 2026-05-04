<template>
  <div class="app-shell">
    <AppHeader />
    <main class="app-main">
      <MainContent />
    </main>
  </div>
</template>

<script setup>
import MainContent from "@/components/MainContent.vue";
import AppHeader from "@/components/AppHeader.vue";
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  width: 100%;
  padding: 24px 20px 64px;
}

@media (min-width: 768px) {
  .app-main {
    padding: 40px 32px 80px;
  }
}
</style>
