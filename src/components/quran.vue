<template>
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 class="text-2xl font-bold text-center mb-4">📖 قائمة السور القرآنية</h1>
  
        <input
          type="text"
          v-model="searchQuery"
          placeholder="ابحث عن سورة..."
          class="w-full p-2 mb-4 border rounded"
        />
  
        <ul class="grid grid-cols-2 gap-3">
          <li
            v-for="surah in filteredSurahs"
            :key="surah.number"
            class="p-3 bg-gray-50 hover:bg-gray-200 cursor-pointer rounded shadow flex justify-between items-center"
            @click="openSurah(surah.number)"
          >
            <span class="font-semibold">({{ surah.number }}) </span>
            <span class="text-gray-600">{{ surah.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  export default {
    data() {
      return {
        surahs: [],
        searchQuery: '',
      };
    },
    computed: {
      filteredSurahs() {
        return this.surahs.filter((surah) =>
          surah.englishName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          surah.name.includes(this.searchQuery)
        );
      },
    },
    async created() {
      const response = await axios.get('https://api.alquran.cloud/v1/surah');
      this.surahs = response.data.data;
    },
    setup() {
      const router = useRouter();
  
      function openSurah(surahNumber) {
        router.push(`/surah/${surahNumber}`);
      }
  
      return { openSurah };
    },
  };
  </script>
  <style scoped>
*{
    font-family: "Amiri Quran", serif;
  font-weight: 400;
  font-style: normal;
}
ul {
 list-style: none;
}
</style>
  