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
const searchQuery = ref(''); 

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

<style scoped>
.quran {
  text-align: center;
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

h3 {
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: bold;
}

.container {
  display: flex;
  justify-content: center;
}

.surahContainer {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
  max-width: 800px;
  width: 100%;
}

.surah {
  background: #ffffff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}

.surah:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.surah p {
  margin: 5px 0;
  font-size: 18px;
  font-weight: bold;
  color: #34495e;
}

.surah p:last-child {
  font-size: 14px;
  color: #7f8c8d;
}
</style>