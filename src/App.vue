<template>
  <n-config-provider :rtl="rtlStyles" :theme-overrides="themeOverrides">
    <div class="app-shell" :dir="dir">
      <AppHeader />
      <main class="app-main">
        <MainContent />
      </main>
    </div>
  </n-config-provider>
</template>

<script setup>
import { computed, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import {
  NConfigProvider,
  unstableSelectRtl as selectRtl,
  unstableInputNumberRtl as inputNumberRtl,
} from "naive-ui";
import MainContent from "@/components/MainContent.vue";
import AppHeader from "@/components/AppHeader.vue";

const { locale } = useI18n();
const dir = computed(() => (locale.value === "ar" ? "rtl" : "ltr"));
const rtlStyles = computed(() => (locale.value === "ar" ? [selectRtl, inputNumberRtl] : []));

const themeOverrides = {
  common: {
    primaryColor: "#1888a0",
    primaryColorHover: "#3698ad",
    primaryColorPressed: "#0c667a",
    primaryColorSuppl: "#3698ad",
  },
};

watchEffect(() => {
  document.documentElement.dir = dir.value;
  document.documentElement.lang = locale.value;
});
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
