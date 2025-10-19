<template>
  <div class="ayah-content w-full">
    <div class="card w-full">
      <p class="text-xl text-center" dir="rtl">{{ ayah.data.text}} </p>
    </div>
    <div class="card w-full">
      <p v-if="revealNext" class="text-xl text-center" dir="rtl">{{ nextAyah.data.text}} </p>

      <p v-else class="text-xl text-center" dir="rtl" @click="revealNext = true">?</p>
    </div>
  </div>
  <div class="next-ayahs-container">

  </div>
</template>

<script setup>
import {computed, ref} from "vue";

const revealNext = ref(false);
const props = defineProps({
  data: {
    type: Object
  }
})

const ayah = computed(() => props.data.ayah);
const nextAyah = computed(() => props.data.next_ayah);
</script>

<style scoped>
.card{
  @apply bg-[var(--background-light-color)] border border-[var(--border-color)] p-10;
}
</style>