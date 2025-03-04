<template>
    <div class="container">
  
      <!-- أزرار اختيار الذكر -->
      <div class="zikr-buttons">
        <button
          v-for="(zikr, index) in azkar"
          :key="index"
          @click="setZikr(index)"
          :class="{ active: index === currentZikrIndex }"
        >
          {{ zikr }}
        </button>
      </div>
  
      <!-- دائرة التسبيح -->
      <div class="circle-wrapper">
        <div class="circle" @click="handleClick">
          <p class="zikr-text">{{ azkar[currentZikrIndex] }}</p>
          <div class="progress" :style="progressStyle"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        azkar: ["سُبْحَانَ اللَّهِ", "اللَّهُ أَكْبَرُ", "الحَمْدُ لِلَّهِ", "لا إِلٰهَ إِلَّا اللَّهُ"],
        currentZikrIndex: 0,
        clickCount: 0,
        maxCount: 3,
      };
    },
    computed: {
      progressStyle() {
        const percentage = (this.clickCount / this.maxCount) * 100;
        return {
          background: `conic-gradient(#D0A871 ${percentage}%, #f3f3f3 ${percentage}%)`,
        };
      },
    },
    methods: {
      handleClick() {
        this.clickCount++;
        if (this.clickCount >= this.maxCount) {
          this.clickCount = 0;
          this.nextZikr();
        }
      },
      nextZikr() {
        this.currentZikrIndex = (this.currentZikrIndex + 1) % this.azkar.length;
      },
      setZikr(index) {
        this.currentZikrIndex = index;
        this.clickCount = 0;
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100vh;
    padding: 20px;
    background-color: #f9f9f9;
  }
  
  .title {
    font-size: 1.7rem;
    margin: 0;
    color: #444;
  }
  
  .zikr-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  
  button {
    padding: 8px 16px;
    border: none;
    background: #e0e0e0;
    color: #333;
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
  }
  
  button.active {
    background: #d0a871;
    color: white;
    transform: scale(1.1);
  }
  
  .circle-wrapper {
    position: relative;
    width: 220px;
    height: 220px;
    margin-top: auto;
    margin-bottom: 30px;
  }
  
  .circle {
    width: 100%;
    height: 100%;
    background-color: white;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    position: relative;
    bottom: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
  }
  
  .zikr-text {
    font-size: 1.3rem;
    font-weight: bold;
    color: #555;
    z-index: 2;
    text-align: center;
  }
  
  .progress {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transition: background 0.4s ease;
  }
  </style>
  