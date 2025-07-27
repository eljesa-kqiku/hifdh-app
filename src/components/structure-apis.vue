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

  // getAllJuz()
  let numJuzCompleted = ref(0)
  let juzDetails = ref([])
  async function getJuzDetails(num){
    let response = (await service.getJuzDetails(num)).data;

    let formattedData = {
      number: response.data.number,
      starting_ayah: response.data.ayahs?.[0]?.number,
      number_of_ayahs: response.data.ayahs?.[response.data?.ayahs.length - 1]?.number - response.data.ayahs?.[0]?.number + 1,
      page: response.data.ayahs?.[0]?.page
    }
    numJuzCompleted.value = numJuzCompleted.value + 1
    juzDetails.value.push(formattedData);

    if(numJuzCompleted.value  === 30){
      console.log({numJuzCompleted})
      // console.log(allDetails.value)
    }
  }
  async function getAllJuz(){
    for (let i of Array(30).fill().map((element, index) => index + 1)){
      setTimeout(() => {
        getJuzDetails(i)
        console.log(juzDetails.value)
      }, 1000 + i * 70)
    }
  }


  getAllHizb()
  let numHizbCompleted = ref(0)
  let hizbDetails = ref([])
  async function getHizbDetails(num){
    let response = (await service.getHizbDetails(num)).data;

    let formattedData = {
      number: response.data.number,
      starting_ayah: response.data.ayahs?.[0]?.number,
      number_of_ayahs: response.data.ayahs?.[response.data?.ayahs.length - 1]?.number - response.data.ayahs?.[0]?.number + 1,
      page: response.data.ayahs?.[0]?.page
    }
    numHizbCompleted.value = numHizbCompleted.value + 1
    hizbDetails.value.push(formattedData);

    // if(numHizbCompleted.value  === 240){
    //   console.log({numHizbCompleted})
    //   // console.log(allDetails.value)
    // }
  }
  async function getAllHizb(){
    for (let i of Array(240).fill().map((element, index) => index + 1)){
      setTimeout(() => {
        getHizbDetails(i)
        console.log(hizbDetails.value)
      }, 1000 + i * 100)
    }
  }
</script>

<template>
  <div class="surahs">
    <div class="progress">Progress: {{ numHizbCompleted }}</div>
  </div>
</template>

<style scoped>

</style>