import { defineStore } from 'pinia';

export const useWatchStore = defineStore('watch', {
  state: () => ({
    videos: [],
    loading: false,
    error: false,
  }),
  actions: {
    async loadVideos() {
      this.loading = true;
      this.error = false;
      try {
        const response = await fetch("https://api3.islamhouse.com/v3/paV29H2gm56kvLPy/main/videos/ar/ar/1/25/json");
        const data = await response.json();
        // تأكد من وجود البيانات بالشكل الصحيح
        this.videos = (data.data || []).map(video => ({
          id: video.id,
          title: video.title,
          url: video.attachments?.[0]?.url || '',
        }));
      } catch (e) {
        this.error = true;
        this.videos = [];
      } finally {
        this.loading = false;
      }
    },
  },
}); 