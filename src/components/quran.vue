<template>
  <section class="quran">
    <h3><span style="font-size: 40px;">{</span> القرآن الكريم <span style="font-size: 40px;">}</span></h3>

    <div class="container">
      <div class="surahContainer">
        <div v-for="(surah, index) in surahs" :key="index" class="surah" @click="goToSurah(surah.number)">
          <p>{{ surah.name }}</p>
          <p>{{ surah.englishName }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const surahs = ref([]);
const searchQuery = ref(''); // قيمة البحث

onMounted(async () => {
  try {
    console.log('Fetching surahs...');
    const response = await fetch('https://api.alquran.cloud/v1/meta');

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Surahs data:', data);

    if (data && data.data && data.data.surahs && data.data.surahs.references) {
      surahs.value = data.data.surahs.references;
    } else {
      console.error('Unexpected API response format:', data);
    }
  } catch (error) {
    console.error('Error fetching surahs:', error);
  }
});


const goToSurah = (id) => {
  router.push({ name: 'surah', params: { id } });
};
</script>

<style></style>