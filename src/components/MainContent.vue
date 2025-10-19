<template>
  <div class="main-content w-full h-full">
    <div class="w-[calc(100vw-500px)] max-w-[700px] min-w-[500px] h-[calc(100vh-100px)]
        mt-[100px] mb-[100px]
        m-auto flex flex-col items-center gap-[40px] overflow-auto">
      <p>{{$t('lbl_app_description')}}</p>
      <div class="flex justify-center">
        <AyahSelctionInputs @set-selection="selectQuestionType"/>
      </div>

      <AyahContainer v-if="ayahData" :data="ayahData"/>
    </div>
  </div>
</template>

<script setup>
import AyahContainer from "@/components/AyahContainer.vue";
import {useI18n} from 'vue-i18n'
import AyahSelctionInputs from "@/components/AyahSelctionInputs.vue";
import {ref} from "vue";
import Service from "../common/service.js";

const {t} = useI18n()
const { locale } = useI18n()
const ayahRange = ref(null)
const ayahData = ref(null)
function selectQuestionType(response) {
  ayahRange.value = {starting_ayah: response.starting_ayah, ending_ayah: response.ending_ayah}
  searchAyah()
}

async function searchAyah() {
  ayahData.value = null
  const selectedNumber = Math.floor(Math.random() * (ayahRange.value.ending_ayah - ayahRange.value.starting_ayah) + ayahRange.value.starting_ayah)
  const ayahResponse = await Service.getAyah(selectedNumber)
  const nextAyahResponse = await Service.getAyah(selectedNumber + 1)
  ayahData.value = {
    ayah: ayahResponse.data,
    next_ayah: nextAyahResponse.data,
  }
}
</script>

<style scoped>

</style>