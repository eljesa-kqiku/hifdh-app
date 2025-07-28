<template>
  <div class="main-content">
    <AyahSelctionInputs @set-selection="selectQuestionType"/>
    <AyahContainer v-if="ayahData" :ayah="ayahData" />
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
  const selectedNumber = Math.floor(Math.random() * (ayahRange.value.ending_ayah - ayahRange.value.starting_ayah) + ayahRange.value.starting_ayah)
  const { data } = await Service.getAyah(selectedNumber)
  ayahData.value = data
}
</script>

<style scoped>

</style>