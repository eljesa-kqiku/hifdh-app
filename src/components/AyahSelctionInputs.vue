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
        <span>{{ opt.label }}</span>
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

      <div v-if="selectedType === 'juz' || selectedType === 'hizb_quarter'" class="input-item">
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

      <div v-if="selectedType === 'hizb_quarter'" class="input-item">
        <label class="input-label">{{ $t('lbl_select_hizb_part') }}</label>
        <n-select
          v-model:value="selectedHizb"
          :options="hizbOptions"
          :render-label="renderLabel"
          :render-tag="renderSelectTag"
          size="large"
          :theme-overrides="selectThemeOverrides"
        />
      </div>
    </div>

    <button class="cta" :disabled="loading" @click="setSelection">
      <span class="cta__label">{{ $t('lbl_select') }}</span>
      <svg class="cta__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"/>
        <path d="m13 6 6 6-6 6"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { NSelect, NText } from 'naive-ui'
import Surahs from "@/assets/data/surahs.json"
import Juz from "@/assets/data/juz.json"
import Hizb from "@/assets/data/hizb.json"
import { computed, h, ref } from "vue"
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { locale } = useI18n()
const emit = defineEmits(["setSelection"])

defineProps({
  loading: { type: Boolean, default: false },
})

const selectedType = ref("surah")
const selectedSurah = ref("Al-Faatiha")
const selectedJuz = ref(1)
const selectedHizb = ref(1)

const IconSurah = () => h('svg', { viewBox: '0 0 24 24', width: 16, height: 16, fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('path', { d: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z' }),
  h('path', { d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20' }),
])
const IconJuz = () => h('svg', { viewBox: '0 0 24 24', width: 16, height: 16, fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('rect', { x: 3, y: 3, width: 18, height: 18, rx: 3 }),
  h('path', { d: 'M3 9h18' }),
  h('path', { d: 'M9 21V9' }),
])
const IconHizb = () => h('svg', { viewBox: '0 0 24 24', width: 16, height: 16, fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('circle', { cx: 12, cy: 12, r: 9 }),
  h('path', { d: 'M12 3v18' }),
  h('path', { d: 'M3 12h18' }),
])

const typeOptions = computed(() => [
  { label: t('lbl_surah'), value: 'surah', icon: IconSurah },
  { label: t('lbl_juz'), value: 'juz', icon: IconJuz },
  { label: t('lbl_hizb_quarter'), value: 'hizb_quarter', icon: IconHizb },
])

const surahOptions = computed(() => Surahs?.map(surah => ({
  label: locale.value === 'ar' ? surah.arabic_name : surah.english_name,
  value: surah.english_name,
})))
const juzOptions = Juz?.map(juz => ({
  label: juz.number,
  value: juz.number,
  description: `(${t('lbl_page')} ${juz.page})`,
}))
const hizbOptions = computed(() => {
  return Hizb?.slice((selectedJuz.value - 1) * 8, selectedJuz.value * 8).map(element => ({
    label: element.number,
    value: element.number,
    description: `(${t('lbl_page')} ${element.page})`,
  }))
})

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
  if (selectedType.value === 'hizb_quarter') {
    const hizb = Hizb?.find(s => s.number === selectedHizb.value)
    response = { starting_ayah: hizb.starting_ayah, ending_ayah: hizb.starting_ayah + hizb.number_of_ayahs }
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
