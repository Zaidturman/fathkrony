<template>
  <div class="min-h-screen">
      <h1 class="text-2xl font-bold text-center mb-4">📜 {{ surah.name }}</h1>
      <p class="text-center text-gray-600 mb-4">عدد الآيات: {{ surah.numberOfAyahs }}</p>

      <swiper
          :modules="[Navigation, Pagination]"
          navigation
          pagination
          class="quran-swiper"
      >
          <swiper-slide v-for="(page, pageIndex) in paginatedAyahs" :key="pageIndex">
              <div class="page-container">
                  <span v-for="(ayah, index) in page" :key="ayah.number"  class="inline">
                      {{ ayah.text }}
                      <span class="ayah-number">({{ (pageIndex * ayatPerPage) + index + 1 }})</span>
                  </span>
              </div>
          </swiper-slide>
      </swiper>
  </div>
</template>

<script>
import axios from 'axios';
import { useRoute } from 'vue-router';

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

export default {
  components: {
      Swiper,
      SwiperSlide,
  },
  setup() {
      return {
          Navigation,
          Pagination,
      };
  },
  data() {
      return {
          surah: {
              ayahs: [],
          },
          ayatPerPage: 8,
      };
  },
  computed: {
      paginatedAyahs() {
          const pages = [];
          for (let i = 0; i < this.surah.ayahs.length; i += this.ayatPerPage) {
              pages.push(this.surah.ayahs.slice(i, i + this.ayatPerPage));
          }
          return pages;
      },
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
* {
  font-family: "Amiri Quran", serif;
  font-weight: 400;
  font-style: normal;
}

.page-container {
  text-align: justify;
  direction: rtl;
  padding: 20px;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.inline-ayah {
  display: inline !important;
  font-size: 18px;
  line-height: 2;
}

.ayah-number {
  font-size: 16px;
  color: gray;
  margin-left: 4px;
}
</style>
