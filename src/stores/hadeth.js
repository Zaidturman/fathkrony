import { defineStore } from 'pinia';

export const useHadethStore = defineStore('hadeth', {
  state: () => ({
    hadiths: [],
    loading: false,
    error: false,
  }),
  actions: {
    async loadHadiths() {
      this.loading = true;
      this.error = false;
      try {
        const response = await fetch('https://hadis-api-id.vercel.app/hadith/abu-dawud?page=2&limit=300');
        const data = await response.json();
        this.hadiths = data.items || [];
      } catch (e) {
        this.error = true;
        this.hadiths = [];
      } finally {
        this.loading = false;
      }
    },
  },
}); 