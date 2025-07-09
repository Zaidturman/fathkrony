import { defineStore } from 'pinia'

// Store خاص بعداد التسبيح (Counter)
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++
    },
    decrement() {
      if (this.count > 0) this.count--
    },
    reset() {
      this.count = 0
    },
  },
})
