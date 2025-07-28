<template>
  <div class="main-content">
    <AyahSelctionInputs />
    <AyahContainer />
  </div>
</template>

<script setup>
import AyahContainer from "@/components/AyahContainer.vue";
import {useI18n} from 'vue-i18n'
import AyahSelctionInputs from "@/components/AyahSelctionInputs.vue";

const {t} = useI18n()
const { locale } = useI18n()

</script>

<style scoped>

</style>