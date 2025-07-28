<template>
  <div class="main-content">
    <div class="inputs-wrapper">
      <div class="flex gap-3 items-end">
        <div class="input-item">
          <p>{{ $t('lbl_question_type') }}</p>
          <n-select v-model:value="selectedType" :options="typeOptions"/>
        </div>
        <div v-if="selectedType === 'surah'" class="input-item w-[200px]">
          <p>{{ $t('lbl_select_surah') }}</p>
          <n-select v-model:value="selectedSurah" :options="surahOptions"/>
        </div>
        <div v-if="selectedType === 'juz' || selectedType === 'hizb_quarter'" class="input-item w-[200px]">
          <p>{{ $t('lbl_select_juz') }}</p>
          <n-select v-model:value="selectedJuz"
                    :options="juzOptions"
                    :render-label="renderLabel"
                    :render-tag="renderSelectTag"/>
        </div>
        <div v-if="selectedType === 'hizb_quarter'" class="input-item w-[200px]">
          <p>{{ $t('lbl_select_hizb_part') }}</p>
          <n-select v-model:value="selectedHizb"
                    :options="hizbOptions"
                    :render-label="renderLabel"
                    :render-tag="renderSelectTag"
          />
        </div>
        <n-button type="success" @click="setSelection">{{ $t('lbl_select') }}</n-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {NButton, NSelect, NText} from 'naive-ui'
import Surahs from "@/assets/data/surahs.json"
import Juz from "@/assets/data/juz.json"
import Hizb from "@/assets/data/hizb.json"
import {computed, h, ref} from "vue"
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
const {locale} = useI18n()
const emit = defineEmits(["setSelection"])

const selectedType = ref("surah")
const selectedSurah = ref("سُورَةُ ٱلْفَاتِحَة")
const selectedJuz = ref(1)
const selectedHizb = ref(1)

const typeOptions = [
  {
    label: t('lbl_surah'),
    value: "surah",
    disabled: false
  }, {
    label: t('lbl_juz'),
    value: "juz",
    disabled: false
  }, {
    label: t('lbl_hizb_quarter'),
    value: "hizb_quarter",
    disabled: false
  },
]
const surahOptions = Surahs?.map(surah => ({
  label: locale.value === 'ar' ? surah.arabic_name : surah.english_name,
  value: surah.english_name,
}))
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

const renderSelectTag = ({option}) => {
  return h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center'
        }
      },
      [
        option.label,
        option.description
      ]
  )
}
const renderLabel = (option) => {
  return h(
      'div', {style: {display: 'flex', alignItems: 'center', gap: '5px'}},
      [
        h('div', {style: {fontWeight: 'bold'}}, [option.label]),
        h(NText, {depth: 3, tag: 'div', style: {fontSize: '12px'}}, {default: () => option.description}
        )
      ]
  )
}

function setSelection() {
  let response = null
  if (selectedType.value === 'surah') {
    const surah = Surahs?.find(s => s.english_name === selectedSurah.value)
    response = {starting_ayah: surah.starting_ayah, ending_ayah: surah.starting_ayah + surah.number_of_ayahs}
  }
  if (selectedType.value === 'juz') {
    const juz = Juz?.find(s => s.number === selectedJuz.value)
    response = {starting_ayah: juz.starting_ayah, ending_ayah: juz.starting_ayah + juz.number_of_ayahs}
  }
  if (selectedType.value === 'hizb_quarter') {
    const hizb = Hizb?.find(s => s.number === selectedHizb.value)
    response = {starting_ayah: hizb.starting_ayah, ending_ayah: hizb.starting_ayah + hizb.number_of_ayahs}
  }
  emit('setSelection', {...response})
}
</script>

<style scoped>

</style>