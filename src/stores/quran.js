import { defineStore } from 'pinia';

export const useQuranStore = defineStore('quran', {
  state: () => ({
    surahs: [],
    loading: false,
    error: false,
  }),
  actions: {
    async loadSurahs() {
      this.loading = true;
      this.error = false;
      try {
        const response = await fetch('https://api.alquran.cloud/v1/meta');
        const data = await response.json();
        this.surahs = (data.data?.surahs?.references) || [];
      } catch (e) {
        this.error = true;
        this.surahs = [];
      } finally {
        this.loading = false;
      }
    },
  },
}); 