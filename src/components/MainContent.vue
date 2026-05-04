<template>
  <div class="main-content">
    <section class="hero">
      <span class="hero__badge">{{ $t('lbl_al_hifdh') }}</span>
      <h2 class="hero__title">{{ $t('lbl_app_title') }}</h2>
      <p class="hero__description">{{ $t('lbl_app_description') }}</p>
    </section>

    <section class="panel">
      <AyahSelctionInputs @set-selection="selectQuestionType" :loading="loading" />
    </section>

    <section v-if="ayahs.length || loading" class="results">
      <div v-if="loading" class="loading-state">
        <div class="spinner" aria-hidden="true"></div>
        <p>{{ $t('lbl_loading') }}</p>
      </div>
      <AyahContainer
        v-else-if="ayahs.length"
        :ayahs="ayahs"
        @reveal="onReveal"
        @next="searchAyah"
      />
    </section>
  </div>
</template>

<script setup>
import AyahContainer from "@/components/AyahContainer.vue";
import { useI18n } from 'vue-i18n'
import AyahSelctionInputs from "@/components/AyahSelctionInputs.vue";
import { ref } from "vue";
import Service from "../common/service.js";

const { t } = useI18n()
const { locale } = useI18n()

const LAST_AYAH_NUMBER = 6236

const ayahRange = ref(null)
const ayahs = ref([])
const loading = ref(false)

function selectQuestionType(response) {
  ayahRange.value = { starting_ayah: response.starting_ayah, ending_ayah: response.ending_ayah }
  searchAyah()
}

async function searchAyah() {
  if (!ayahRange.value) return
  loading.value = true
  ayahs.value = []
  try {
    const range = ayahRange.value
    const selectedNumber = Math.floor(Math.random() * (range.ending_ayah - range.starting_ayah) + range.starting_ayah)
    const [current, next] = await Promise.all([
      Service.getAyah(selectedNumber),
      Service.getAyah(selectedNumber + 1),
    ])
    ayahs.value = [
      { number: selectedNumber, data: current.data.data, revealed: true },
      { number: selectedNumber + 1, data: next.data.data, revealed: false },
    ]
  } finally {
    loading.value = false
  }
}

async function onReveal(index) {
  const item = ayahs.value[index]
  if (!item || item.revealed) return
  item.revealed = true

  const lastNumber = ayahs.value[ayahs.value.length - 1].number
  const nextNumber = lastNumber + 1
  if (nextNumber > LAST_AYAH_NUMBER) return
  try {
    const response = await Service.getAyah(nextNumber)
    ayahs.value.push({ number: nextNumber, data: response.data.data, revealed: false })
  } catch (e) {
    /* ignore network errors; user can request a new ayah */
  }
}
</script>

<style scoped>
.main-content {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero {
  text-align: center;
  padding: 16px 4px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.hero__badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--light);
  color: var(--main-color);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  border: 1px solid var(--border-color);
}

.hero__title {
  margin: 0;
  font-size: 26px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--dark);
}

.hero__description {
  margin: 0;
  max-width: 620px;
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.6;
}

.panel {
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 18px;
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 12px;
  color: var(--text-muted);
  font-size: 14px;
}

.spinner {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid var(--light);
  border-top-color: var(--main-color);
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (min-width: 640px) {
  .main-content {
    gap: 32px;
  }
  .hero__title {
    font-size: 34px;
  }
  .hero__description {
    font-size: 15px;
  }
  .panel {
    padding: 24px;
  }
}

@media (min-width: 900px) {
  .hero__title {
    font-size: 40px;
  }
}
</style>
