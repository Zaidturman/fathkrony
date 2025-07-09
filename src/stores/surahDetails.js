import { defineStore } from 'pinia';

export const useSurahDetailsStore = defineStore('surahDetails', {
  state: () => ({
    surahInfo: null,
    ayat: [],
    loading: false,
    error: false,
  }),
  actions: {
    async loadSurah(id) {
      this.loading = true;
      this.error = false;
      try {
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${id}`);
        const data = await response.json();
        this.surahInfo = data.data;
        this.ayat = data.data.ayahs || [];
      } catch (e) {
        this.error = true;
        this.surahInfo = null;
        this.ayat = [];
      } finally {
        this.loading = false;
      }
    },
  },
}); 