<script setup>
  import {ref} from "vue";
  import service from "../common/service.js";
  import unsortedSurahs from "@/assets/data/unsortedSurahs.json";

  let numSurahsCompleted = ref(0)
  let allDetails = ref([])

  async function getSurahDetails(num){
    let response = (await service.getSurahDetails(num)).data;

    let formattedData = {
      number: response.data.number,
      arabic_name: response.data.name,
      english_name: response.data.englishName,
      translated_english_name: response.data.englishNameTranslation,
      starting_ayah: response.data.ayahs?.[0]?.number,
      number_of_ayahs: response.data.numberOfAyahs
    }
    numSurahsCompleted.value = numSurahsCompleted.value + 1
    allDetails.value.push(formattedData);

    if(numSurahsCompleted.value  === 114){
      console.log(allDetails.value)
    }
  }

  async function initialize(){
    // let allSurahs = []
    // for (let i = 1; i < 114; i++) {
    //   allSurahs.push(getSurahDetails(i))
    // }
    //
    // Promise.all(allSurahs)

    for (let i of Array(114).fill().map((element, index) => index + 1)){
      setTimeout(() => {
        getSurahDetails(i)
      }, 1000 + i * 70)
    }
  }



  // initialize()
  sorting()
  function sorting(){
    let sorted = unsortedSurahs.sort((a, b) => {
      if(a.number > b.number){
        return 1;
      }
      if(a.number < b.number){
        return -1;
      }
      return 0;
    })
    console.log(sorted)
  }
</script>

<template>
  <div class="surahs">
    <div class="progress">Progress: {{ numSurahsCompleted }}</div>
  </div>
</template>

<style scoped>

</style>