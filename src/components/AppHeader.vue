<template>
  <header class="app-header">
    <div class="app-header__inner">
      <div class="brand">
        <div class="brand__logo" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stop-color="#34a36b"/>
                <stop offset="1" stop-color="#0f7a4a"/>
              </linearGradient>
            </defs>
            <circle cx="16" cy="16" r="13" stroke="url(#logoGrad)" stroke-width="3"/>
            <circle cx="16" cy="16" r="5" fill="url(#logoGrad)"/>
          </svg>
        </div>
        <div class="brand__text">
          <h1 class="brand__title">{{ $t('lbl_app_title') }}</h1>
          <p class="brand__subtitle">{{ $t('lbl_al_hifdh') }}</p>
        </div>
      </div>

      <div class="lang-switch" role="tablist" aria-label="language">
        <button
          v-for="lang in languages"
          :key="lang.code"
          role="tab"
          :aria-selected="locale === lang.code"
          :class="['lang-switch__btn', { active: locale === lang.code }]"
          @click="setLocale(lang.code)"
        >
          {{ lang.label }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const languages = [
  { code: 'sq', label: 'SQ' },
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'AR' },
]

function setLocale(code) {
  locale.value = code
}
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: saturate(180%) blur(14px);
  -webkit-backdrop-filter: saturate(180%) blur(14px);
  background: rgba(255, 255, 255, 0.65);
  border-bottom: 1px solid var(--border-color);
}

.app-header__inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.brand__logo {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #eaf7ef, #ffffff);
  border: 1px solid var(--border-color);
  display: grid;
  place-items: center;
  box-shadow: var(--shadow-sm);
  flex: 0 0 auto;
}

.brand__text {
  min-width: 0;
}

.brand__title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--dark);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.brand__subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}

.lang-switch {
  display: inline-flex;
  padding: 4px;
  background: var(--light);
  border: 1px solid var(--border-color);
  border-radius: 999px;
  gap: 2px;
}

.lang-switch__btn {
  appearance: none;
  border: none;
  background: transparent;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  border-radius: 999px;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.lang-switch__btn:hover {
  color: var(--dark);
}

.lang-switch__btn.active {
  background: #ffffff;
  color: var(--main-color);
  box-shadow: var(--shadow-sm);
}

@media (min-width: 768px) {
  .app-header__inner {
    padding: 18px 32px;
  }
  .brand__title {
    font-size: 18px;
  }
  .brand__subtitle {
    font-size: 13px;
  }
  .lang-switch__btn {
    padding: 8px 14px;
    font-size: 13px;
  }
}
</style>
