<template>
  <section class="quran">
    <h3><span style="font-size: 40px;"></span> القرآن الكريم <span style="font-size: 40px;"></span></h3>
    
    <div class="search-container">
      <input 
        v-model="searchQuery"
        type="text" 
        placeholder="ابحث عن سورة بالاسم أو الرقم..."
        class="search-input"
      >
    </div>
    
    <div class="container">
      <div class="surahContainer">
        <div v-if="quranStore.loading">جاري التحميل...</div>
        <div v-else-if="quranStore.error">حدث خطأ أثناء جلب السور.</div>
        <div v-else>
          <!-- استخدم filteredSurahs بدلاً من quranStore.surahs -->
          <div 
            v-for="surah in filteredSurahs" 
            :key="surah.number" 
            class="surah" 
            @click="goToSurah(surah.number)"
          >
            <p>{{ surah.name }}</p>
            <p>{{ surah.englishName }}</p>
            <p class="surah-number">رقم السورة: {{ surah.number }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuranStore } from '@/stores/quran';

const router = useRouter();
const quranStore = useQuranStore();
const searchQuery = ref('');

const filteredSurahs = computed(() => {
  if (!searchQuery.value) return quranStore.surahs;
  return quranStore.surahs.filter(surah => 
    surah.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    surah.englishName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    surah.number.toString().includes(searchQuery.value)
  );
});

onMounted(() => {
  quranStore.loadSurahs();
});

const goToSurah = (id) => {
  router.push({ name: 'surah', params: { id } });
};
</script>

<style scoped>
*{
  font-family: "the-year-of-the-camel", serif;
}
.quran {
  text-align: center;
  padding: 30px 20px;
  background: linear-gradient(to bottom, #f8f5f0, #f0e8dd);
  min-height: 100vh;
}

h3 {
  font-size: 2.5rem;
  color: #5a3921;
  margin: 30px 0;
  font-weight: 700;
  position: relative;
  display: inline-block;
  font-family: "the-year-of-the-camel", serif;
}

h3 span {
  color: #D0A871;
  vertical-align: middle;
  margin: 0 10px;
}
.surahContainer {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  max-width: 1200px;
  width: 100%;
  padding: 20px;
}

.surah {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(208, 168, 113, 0.3);
  position: relative;
  overflow: hidden;
  margin: 10px 20px;
}

.surah::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background: #D0A871;
  transition: width 0.3s ease;
}

.surah:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(208, 168, 113, 0.2);
  border-color: #D0A871;
}

.surah:hover::before {
  width: 8px;
}

.surah p:first-child {
  font-size: 1.4rem;
  color: #3a3228;
  font-weight: 600;
  margin-bottom: 8px;
  position: relative;
  padding-bottom: 8px;
}

.surah p:first-child::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background: #D0A871;
}

.surah p:last-child {
  font-size: 1rem;
  color: #7f8c8d;
  font-style: italic;
}

@media (max-width: 768px) {
  h3 {
    font-size: 2rem;
    margin: 20px 0;
  }
  
  .surahContainer {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    padding: 10px;
  }
  
  .surah {
    padding: 15px 10px;
  }
  
  .surah p:first-child {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  h3 {
    font-size: 1.8rem;
  }
  
  .surahContainer {
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 10px;
  }
}

/* تأثيرات التحميل */
.quran-enter-active,
.quran-leave-active {
  transition: opacity 0.5s ease;
}

.quran-enter-from,
.quran-leave-to {
  opacity: 0;
}

/* تأثيرات البطاقات */
.surah-enter-active {
  transition: all 0.3s ease;
  transition-delay: calc(var(--index) * 0.05s);
}

.surah-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.search-container {
  max-width: 600px;
  margin: 0 auto 30px;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 12px 20px;
  border: 2px solid #D0A871;
  border-radius: 30px;
  font-size: 1rem;
  outline: none;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.search-input:focus {
  box-shadow: 0 0 0 3px rgba(208, 168, 113, 0.3);
  background: #fff;
}
</style>