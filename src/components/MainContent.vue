<template>
  <div class="main-content">
    <section class="hero">
      <span class="hero__badge">{{ $t('lbl_al_hifdh') }}</span>
      <h2 class="hero__title">{{ $t('lbl_app_title') }}</h2>
      <p class="hero__description">{{ $t('lbl_app_description') }}</p>
    </section>

    <div class="mode-switch" role="tablist" :aria-label="$t('lbl_question_type')">
      <button
        v-for="opt in modeOptions"
        :key="opt.value"
        role="tab"
        :aria-selected="mode === opt.value"
        :class="['mode-switch__btn', { active: mode === opt.value }]"
        @click="setMode(opt.value)"
      >
        <span class="mode-switch__icon" aria-hidden="true">
          <component :is="opt.icon" />
        </span>
        <span>{{ opt.label }}</span>
      </button>
    </div>

    <section v-if="mode === 'memorization'" class="panel">
      <AyahSelctionInputs @set-selection="selectQuestionType" :loading="loading" />
    </section>

    <section v-if="showResultsSection" class="results">
      <div v-if="loading && mode === 'memorization'" class="loading-state">
        <div class="spinner" aria-hidden="true"></div>
        <p>{{ $t('lbl_loading') }}</p>
      </div>

      <AyahContainer
        v-else-if="mode === 'memorization' && ayahs.length"
        :ayahs="ayahs"
        @reveal="onReveal"
        @next="searchAyah"
      />

      <RepetitionCounter v-else-if="mode === 'repetition'" />
    </section>
  </div>
</template>

<script setup>
import AyahContainer from "@/components/AyahContainer.vue";
import RepetitionCounter from "@/components/RepetitionCounter.vue";
import { useI18n } from 'vue-i18n'
import AyahSelctionInputs from "@/components/AyahSelctionInputs.vue";
import { computed, h, ref } from "vue";
import Service from "../common/service.js";

const { t } = useI18n()

const LAST_AYAH_NUMBER = 6236

const mode = ref('memorization')
const ayahRange = ref(null)
const ayahs = ref([])
const loading = ref(false)

const IconMemorize = () => h('svg', { viewBox: '0 0 24 24', width: 16, height: 16, fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('path', { d: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z' }),
  h('path', { d: 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' }),
])
const IconCounter = () => h('svg', { viewBox: '0 0 24 24', width: 16, height: 16, fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('rect', { x: 3, y: 4, width: 18, height: 16, rx: 3 }),
  h('line', { x1: 12, y1: 9, x2: 12, y2: 15 }),
  h('line', { x1: 9, y1: 12, x2: 15, y2: 12 }),
])

const modeOptions = computed(() => [
  { label: t('lbl_mode_memorization'), value: 'memorization', icon: IconMemorize },
  { label: t('lbl_mode_repetition'), value: 'repetition', icon: IconCounter },
])

const showResultsSection = computed(() => {
  if (mode.value === 'repetition') return true
  return ayahs.value.length > 0 || loading.value
})

function setMode(value) {
  if (mode.value === value) return
  mode.value = value
  ayahs.value = []
  ayahRange.value = null
}

function selectQuestionType(response) {
  ayahRange.value = { starting_ayah: response.starting_ayah, ending_ayah: response.ending_ayah }
  if (mode.value === 'memorization') {
    searchAyah()
  }
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

.mode-switch {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
  padding: 4px;
  background: var(--light);
  border-radius: 14px;
  border: 1px solid var(--border-color);
}

.mode-switch__btn {
  appearance: none;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-weight: 600;
  font-size: 13px;
  padding: 10px 6px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: background-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mode-switch__btn:hover {
  color: var(--dark);
}

.mode-switch__btn.active {
  background: #ffffff;
  color: var(--main-color);
  box-shadow: var(--shadow-sm);
}

.mode-switch__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
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
  .mode-switch__btn {
    font-size: 14px;
    padding: 12px 10px;
  }
}

@media (min-width: 900px) {
  .hero__title {
    font-size: 40px;
  }
}
</style>
