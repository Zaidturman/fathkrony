import { defineStore } from 'pinia';

export const useBooksStore = defineStore('books', {
  state: () => ({
    books: [],
    loading: false,
    error: false,
  }),
  actions: {
    async loadBooks() {
      this.loading = true;
      this.error = false;
      try {
        const response = await fetch("https://api3.islamhouse.com/v3/paV29H2gm56kvLPy/main/books/ar/ar/1/25/json");
        const data = await response.json();
        this.books = data.data 
        this.loading = false;
      } catch (e) {
        this.error = true;
        this.books = [];
      } finally {
        this.loading = false;
      }
    },
  },
}); 