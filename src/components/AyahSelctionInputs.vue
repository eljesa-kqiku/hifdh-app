<template>
  <div class="selection">
    <div class="type-picker" role="tablist" :aria-label="$t('lbl_question_type')">
      <button
        v-for="opt in typeOptions"
        :key="opt.value"
        role="tab"
        :aria-selected="selectedType === opt.value"
        :class="['type-picker__btn', { active: selectedType === opt.value }]"
        @click="selectedType = opt.value"
      >
        <span class="type-picker__icon" aria-hidden="true">
          <component :is="opt.icon" />
        </span>
        <span class="type-picker__label">{{ opt.label }}</span>
      </button>
    </div>

    <div class="inputs-grid">
      <div v-if="selectedType === 'surah'" class="input-item">
        <label class="input-label">{{ $t('lbl_select_surah') }}</label>
        <n-select
          v-model:value="selectedSurah"
          :options="surahOptions"
          filterable
          size="large"
          :theme-overrides="selectThemeOverrides"
        />
      </div>

      <div v-if="selectedType === 'juz'" class="input-item">
        <label class="input-label">{{ $t('lbl_select_juz') }}</label>
        <n-select
          v-model:value="selectedJuz"
          :options="juzOptions"
          :render-label="renderLabel"
          :render-tag="renderSelectTag"
          size="large"
          :theme-overrides="selectThemeOverrides"
        />
      </div>

      <template v-if="selectedType === 'custom_pages'">
        <div class="input-item">
          <label class="input-label">{{ $t('lbl_from_page') }}</label>
          <n-input-number
            :key="`from-${locale}`"
            v-model:value="fromPage"
            :min="1"
            :max="totalPages"
            size="large"
            :theme-overrides="inputNumberThemeOverrides"
            :placeholder="localizeNumber(1, locale)"
            :format="(v) => localizeNumber(v, locale)"
            :parse="parsePageInput"
          />
        </div>
        <div class="input-item">
          <label class="input-label">{{ $t('lbl_to_page') }}</label>
          <n-input-number
            :key="`to-${locale}`"
            v-model:value="toPage"
            :min="1"
            :max="totalPages"
            size="large"
            :theme-overrides="inputNumberThemeOverrides"
            :placeholder="localizeNumber(totalPages, locale)"
            :format="(v) => localizeNumber(v, locale)"
            :parse="parsePageInput"
          />
        </div>
        <p class="range-hint">
          {{ $t('lbl_pages_range') }}: {{ localizeNumber(1, locale) }} – {{ localizeNumber(totalPages, locale) }}
        </p>
      </template>
    </div>

    <button class="cta" :disabled="loading || !canSubmit" @click="setSelection">
      <span class="cta__label">{{ $t('lbl_select') }}</span>
      <svg class="cta__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"/>
        <path d="m13 6 6 6-6 6"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { NSelect, NText, NInputNumber } from 'naive-ui'
import Surahs from "@/assets/data/surahs.json"
import Juz from "@/assets/data/juz.json"
import Pages from "@/assets/data/pages.json"
import { computed, h, ref } from "vue"
import { useI18n } from 'vue-i18n'
import { localizeNumber, toWesternDigits } from "@/common/numerals.js"

const { t } = useI18n()
const { locale } = useI18n()

function parsePageInput(input) {
  const parsed = Number.parseInt(toWesternDigits(input), 10)
  return Number.isNaN(parsed) ? null : parsed
}
const emit = defineEmits(["setSelection"])

defineProps({
  loading: { type: Boolean, default: false },
})

const selectedType = ref("surah")
const selectedSurah = ref("Al-Faatiha")
const selectedJuz = ref(1)

const totalPages = Pages.length
const fromPage = ref(1)
const toPage = ref(totalPages)

const IconSurah = () => h('svg', { viewBox: '0 0 24 24', width: 16, height: 16, fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('path', { d: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z' }),
  h('path', { d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20' }),
])
const IconJuz = () => h('svg', { viewBox: '0 0 24 24', width: 16, height: 16, fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('rect', { x: 3, y: 3, width: 18, height: 18, rx: 3 }),
  h('path', { d: 'M3 9h18' }),
  h('path', { d: 'M9 21V9' }),
])
const IconPages = () => h('svg', { viewBox: '0 0 24 24', width: 16, height: 16, fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
  h('polyline', { points: '14 2 14 8 20 8' }),
  h('line', { x1: 8, y1: 13, x2: 16, y2: 13 }),
  h('line', { x1: 8, y1: 17, x2: 13, y2: 17 }),
])

const typeOptions = computed(() => [
  { label: t('lbl_surah'), value: 'surah', icon: IconSurah },
  { label: t('lbl_juz'), value: 'juz', icon: IconJuz },
  { label: t('lbl_custom_pages'), value: 'custom_pages', icon: IconPages },
])

const surahOptions = computed(() => Surahs?.map(surah => ({
  label: locale.value === 'ar' ? surah.arabic_name : surah.english_name,
  value: surah.english_name,
})))
const juzOptions = computed(() => Juz?.map((juz, index) => {
  const endPage = index < Juz.length - 1 ? Juz[index + 1].page - 1 : totalPages
  return {
    label: t('lbl_juz_item', { n: localizeNumber(juz.number, locale.value) }),
    value: juz.number,
    description: `(${t('lbl_page')} ${localizeNumber(juz.page, locale.value)}-${localizeNumber(endPage, locale.value)})`,
  }
}))

const selectThemeOverrides = {
  peers: {
    InternalSelection: {
      borderRadius: '12px',
      border: '1px solid var(--border-color)',
      borderHover: '1px solid var(--main-color-soft)',
      borderActive: '1px solid var(--main-color)',
      borderFocus: '1px solid var(--main-color)',
      boxShadowFocus: '0 0 0 3px rgba(52,163,107,0.18)',
      heightLarge: '48px',
    },
  },
}
const inputNumberThemeOverrides = {
  peers: {
    Input: {
      borderRadius: '12px',
      border: '1px solid var(--border-color)',
      borderHover: '1px solid var(--main-color-soft)',
      borderFocus: '1px solid var(--main-color)',
      boxShadowFocus: '0 0 0 3px rgba(52,163,107,0.18)',
      heightLarge: '48px',
      color: '#ffffff',
    },
    Button: {
      borderRadiusMedium: '10px',
    },
  },
}

const renderSelectTag = ({ option }) => {
  return h(
    'div',
    { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
    [option.label, option.description],
  )
}
const renderLabel = (option) => {
  return h(
    'div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
    [
      h('div', { style: { fontWeight: 'bold' } }, [option.label]),
      h(NText, { depth: 3, tag: 'div', style: { fontSize: '12px' } }, { default: () => option.description }),
    ],
  )
}

const canSubmit = computed(() => {
  if (selectedType.value !== 'custom_pages') return true
  return Number.isInteger(fromPage.value) && Number.isInteger(toPage.value)
    && fromPage.value >= 1 && toPage.value <= totalPages
    && fromPage.value <= toPage.value
})

function setSelection() {
  let response = null
  if (selectedType.value === 'surah') {
    const surah = Surahs?.find(s => s.english_name === selectedSurah.value)
    response = { starting_ayah: surah.starting_ayah, ending_ayah: surah.starting_ayah + surah.number_of_ayahs }
  }
  if (selectedType.value === 'juz') {
    const juz = Juz?.find(s => s.number === selectedJuz.value)
    response = { starting_ayah: juz.starting_ayah, ending_ayah: juz.starting_ayah + juz.number_of_ayahs }
  }
  if (selectedType.value === 'custom_pages') {
    if (!canSubmit.value) return
    const startPage = Pages.find(p => p.number === fromPage.value)
    const endPage = Pages.find(p => p.number === toPage.value)
    response = {
      starting_ayah: startPage.starting_ayah,
      ending_ayah: endPage.starting_ayah + endPage.number_of_ayahs,
    }
  }
  emit('setSelection', { ...response })
}
</script>

<style scoped>
.selection {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.type-picker {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
  padding: 4px;
  background: var(--light);
  border-radius: 14px;
  border: 1px solid var(--border-color);
}

.type-picker__btn {
  appearance: none;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-weight: 600;
  font-size: 13px;
  padding: 10px 6px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 0;
  cursor: pointer;
  transition: background-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
}

.type-picker__label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.type-picker__btn:hover {
  color: var(--dark);
}

.type-picker__btn.active {
  background: #ffffff;
  color: var(--main-color);
  box-shadow: var(--shadow-sm);
}

.type-picker__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.inputs-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.input-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
}

.range-hint {
  grid-column: 1 / -1;
  margin: 0;
  font-size: 12px;
  color: var(--text-muted);
}

.cta {
  appearance: none;
  border: none;
  cursor: pointer;
  width: 100%;
  padding: 14px 18px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--main-color-soft), var(--main-color));
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 10px 24px rgba(15, 122, 74, 0.28);
  transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
}

.cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(15, 122, 74, 0.32);
}

.cta:active {
  transform: translateY(0);
  filter: brightness(0.97);
}

.cta:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.cta__icon {
  width: 18px;
  height: 18px;
}

[dir="rtl"] .cta__icon {
  transform: scaleX(-1);
}

@media (min-width: 640px) {
  .inputs-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .type-picker__btn {
    font-size: 14px;
    padding: 12px 10px;
  }
  .cta {
    width: auto;
    align-self: flex-end;
    padding: 14px 22px;
  }
}
</style>
