<template>
    <div class="surah-view">
        <div class="container ayat" style="background:rgb(255, 250, 243); background-size: cover;">
            <div class="close-popup" @click="goBack">
                <i class="fas fa-times"></i>
            </div>

            <div v-if="surahDetailsStore.loading">جاري التحميل...</div>
            <div v-else-if="surahDetailsStore.error">حدث خطأ أثناء جلب تفاصيل السورة.</div>
            <div v-else>
                <div class="ayat-content">
                    <nav class="ayat-name">
                        <h1 class="surahName">{{ surahDetailsStore.surahInfo?.name }}</h1>
                        <h1 class="surahNum">عدد الآيات: <span class="surah-num">( {{ surahDetailsStore.surahInfo?.numberOfAyahs }} )</span>
                        </h1>
                        <div class="audio">
                            <audio class="ayah-audio" controls>
                                <source
                                    :src="`https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/${surahDetailsStore.surahInfo?.number}.mp3`"
                                    type="audio/mp3">
                            </audio>
                        </div>
                    </nav>
                    <br>

                    <section class="all container">
                        <div id="ayats">
                            <span v-for="(aya, index) in surahDetailsStore.ayat" :key="index">
                                <span class="aya-text" style="font-family: quran;">{{ aya.text }}</span>
                                <span class="label" style="font-size:24px;color:#247429;font-family: quran;">﴿{{
                                    aya.numberInSurah }}﴾</span>
                            </span>
                        </div>
                    </section>
                    <br>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { useSurahDetailsStore } from '@/stores/surahDetails';
import { useRoute } from 'vue-router';

const route = useRoute();
const surahDetailsStore = useSurahDetailsStore();

onMounted(() => {
  surahDetailsStore.loadSurah(route.params.id);
});
</script>
<style scoped>
.surah-view {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  direction: rtl;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}
.ayat-name {
  text-align: center;
  padding: 20px 0;
  margin-bottom: 20px;
  border-bottom: 2px solid rgba(208, 168, 113, 0.3);
}

.surahName {
  font-size: 2.2rem;
  color: #5a3921;
  margin-bottom: 10px;
  font-weight: 700;
  font-family: "the-year-of-the-camel", serif;
}

.surahNum {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 20px;
}

.surah-num {
  color: #D0A871;
  font-weight: bold;
}
.audio {
  margin: 20px auto;
  max-width: 100%;
}

.ayah-audio {
  width: 100%;
  border-radius: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.ayah-audio::-webkit-media-controls-panel {
  background-color: #f5f5f5;
}

.ayah-audio::-webkit-media-controls-play-button {
  background-color: #D0A871;
  border-radius: 50%;
}
#ayats {
  line-height: 3;
  font-size: 1.8rem;
  text-align: justify;
  padding: 20px;
  font-weight: 500;
  color: #3a3228;
}

.aya-text {
  font-family: 'Amiri Quran', serif !important;
  font-size: 2rem;
  line-height: 2.5;
}

.label {
  font-size: 1.4rem !important;
  color: #247429 !important;
  vertical-align: super;
  margin: 0 3px;
  font-family: 'Amiri Quran', serif !important;
}
.close-popup {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 50px;
  height: 50px;
  background: #D0A871;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.close-popup:hover {
  transform: scale(1.1);
  background: #c59b63;
}
@media (max-width: 768px) {
  .surahName {
    font-size: 1.8rem;
  }
  
  #ayats {
    font-size: 1.5rem;
    padding: 10px;
    line-height: 2.5;
  }
  
  .aya-text {
    font-size: 1.7rem;
  }
  
  .label {
    font-size: 1.2rem !important;
  }
}

@media (max-width: 480px) {
  .surah-view {
    padding: 10px;
  }
  
  .surahName {
    font-size: 1.5rem;
  }
  
  #ayats {
    font-size: 1.3rem;
    line-height: 2.2;
  }
  
  .aya-text {
    font-size: 1.5rem;
  }
  
  .close-popup {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}
/* تأثيرات التحميل */
.loading {
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #5a3921;
}

/* رسالة الخطأ */
.error-message {
  text-align: center;
  padding: 50px;
  color: #d32f2f;
  font-size: 1.2rem;
}

/* تأثيرات للآيات */
.aya-text {
  transition: color 0.3s ease;
}

.aya-text:hover {
  color: #5a3921;
  text-shadow: 0 0 1px rgba(90, 57, 33, 0.2);
}
</style>