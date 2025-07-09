<template>
  <div class="container">
    <button class="mute-btn" @click="toggleMute">
      {{ isMuted ? '🔇' : '🔊' }}
    </button>

    <div class="counter">{{ count }}</div>

    <div class="big-circle-wrapper">
      <div class="big-circle" @click="increment">
        <div class="inner-circle"></div>
      </div>

      <div class="small-circle" @click="reset">↻</div>
    </div>

    <p class="total">مجموع التسبيحات <span>{{ total }}</span></p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
      total: 0,
      isMuted: false,
    };
  },
  methods: {
    increment() {
      this.count++;
      this.total++;
      if (!this.isMuted) {
        this.playClickSound();
      }
    },
    reset() {
      this.count = 0;
    },
    toggleMute() {
      this.isMuted = !this.isMuted;
      localStorage.setItem('isMuted', this.isMuted);
    },
    playClickSound() {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
      }, 40);
    }
  },
  mounted() {
    const savedMute = localStorage.getItem('isMuted');
    if (savedMute !== null) {
      this.isMuted = savedMute === 'true';
    }
  }
};
</script>

<style scoped>
.container {
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
}

.mute-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  border: none;
  font-size: 24px;
  background: none;
  cursor: pointer;
  transition: transform 0.2s;
  z-index: 10;
}

.mute-btn:hover {
  transform: scale(1.1);
}

.counter {
  font-size: 3rem;
  font-weight: bold;
  color: #4a5568;
  margin: 1.5rem 0;
  padding: 15px 30px;
  border-radius: 15px;
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.big-circle-wrapper {
  position: relative;
  margin: 2rem 0;
}

.big-circle {
  width: 220px;
  height: 220px;
  background: linear-gradient(145deg, #D0A871, #e8c28a);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 8px 25px rgba(208, 168, 113, 0.4);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.big-circle:active {
  transform: scale(0.95);
  box-shadow: 0 4px 15px rgba(208, 168, 113, 0.3);
}

.inner-circle {
  width: 80%;
  height: 80%;
  background: white;
  border-radius: 50%;
  box-shadow: inset 0 4px 10px rgba(0, 0, 0, 0.1);
}

.small-circle {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 50px;
  height: 50px;
  background: linear-gradient(145deg, #D0A871, #b48b5f);
  color: white;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s;
  z-index: 2;
}

.small-circle:hover {
  transform: rotate(180deg);
  background: linear-gradient(145deg, #b48b5f, #9a774e);
}

.total {
  font-size: 1.3rem;
  color: #4a5568;
  margin-top: 2rem;
  padding: 10px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.total span {
  color: #6b46c1;
  font-weight: bold;
  font-size: 1.4rem;
}

@media (max-width: 480px) {
  .big-circle {
    width: 180px;
    height: 180px;
  }
  
  .small-circle {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
  
  .counter {
    font-size: 2.5rem;
  }
}
</style>