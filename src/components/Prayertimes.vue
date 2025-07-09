<template>
  <div class="container">
    <h1 class="title">أذكار المسلم</h1>
    
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
    
    <div class="circle-wrapper">
      <div class="circle" @click="handleClick">
        <p class="zikr-text">{{ azkar[currentZikrIndex] }}</p>
        <div class="progress" :style="progressStyle"></div>
        <div class="counter">{{ clickCount }}/{{ maxCount }}</div>
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
      maxCount: 33,
    };
  },
  computed: {
    progressStyle() {
      const percentage = (this.clickCount / this.maxCount) * 100;
      return {
        background: `conic-gradient(#4CAF50 ${percentage}%, #f3f3f3 ${percentage}%)`,
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
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #2c3e50;
  text-align: center;
}

.zikr-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  max-width: 90%;
}

button {
  padding: 10px 20px;
  border: none;
  background: #e0e0e0;
  color: #333;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

button.active {
  background: #4CAF50;
  color: white;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
}

.circle-wrapper {
  position: relative;
  width: 280px;
  height: 280px;
  margin: 2rem 0;
}

.circle {
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.circle:active {
  transform: scale(0.98);
}

.zikr-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  z-index: 2;
  text-align: center;
  padding: 0 20px;
  line-height: 1.4;
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

.counter {
  position: absolute;
  bottom: 20px;
  font-size: 1rem;
  color: #4CAF50;
  font-weight: bold;
  z-index: 3;
  background: rgba(255,255,255,0.8);
  padding: 5px 15px;
  border-radius: 20px;
}

@media (max-width: 600px) {

  .circle-wrapper {
    width: 250px;
    height: 250px;
  }
  
  .zikr-text {
    font-size: 1.3rem;
  }
  
  button {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}
</style>