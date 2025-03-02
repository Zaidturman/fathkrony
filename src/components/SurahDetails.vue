<template>
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <button
            @click="$router.push('/quran')"
            class="mt-6 bg-blue-500  px-4 py-2 rounded"
          >
            العودة للقائمة
          </button>
        <h1 class="text-2xl font-bold text-center mb-4">📜 {{ surah.name }} </h1>
        <p class="text-center text-gray-600">عدد الآيات: {{ surah.numberOfAyahs }}</p>
        <div class="text-xl leading-relaxed ayahs-container">
        <span
          v-for="ayah in surah.ayahs"
          :key="ayah.number"
          class="inline"
        >
          {{ ayah.text }} <span class="ayah-number">({{ ayah.number }})</span>
        </span>
      </div>
  
       
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useRoute } from 'vue-router';
  
  export default {
    data() {
      return {
        surah: {
          ayahs: [],
        },
      };
    },
    async created() {
      const route = useRoute();
      const surahNumber = route.params.id;
  
      const response = await axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
      this.surah = response.data.data;
    },
  };
  </script>

  <style scoped>
  *{
    font-family: "Amiri Quran", serif;
  font-weight: 400;
  font-style: normal;
  }
  .ayahs-container {
  text-align: justify;
  direction: rtl;
  word-spacing: 4px;
  padding: 5px;
}
.ayah-number {
  font-size: 14px;
  color: gray;
  margin-left: 5px;
}
</style>
  