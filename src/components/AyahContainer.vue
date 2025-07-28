<template>
  <div class="ayah-content">
    <div class="card">
      <p class="text-xl">{{ ayah.data.text}} </p>
    </div>
  </div>
  <div class="next-ayahs-container">

  </div>
</template>

<script setup>
const props = defineProps({
  ayah: {
    type: Object
  }
})
</script>

<style scoped>

</style>