<template>
    <div class="container">
      <button class="mute-btn" @click="toggleMute">
        {{ isMuted ? '🔇' : '🔊' }}
      </button>
  
      <div class="counter">{{ count }}</div>
  
      <div class="big-circle-wrapper">
        <div class="big-circle" @click="increment"></div>
  
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
    }
  };
  </script>
  
  <style scoped>
  .container {
    text-align: center;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
  }
  
  .mute-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    border: none;
    font-size: 24px;
    background: none;
    cursor: pointer;
  }
  
  .counter {
    font-size: 2rem;
    padding: 10px 20px;
    border-radius: 10px;
  }
  
  .big-circle-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    position: absolute;
    bottom: 100px;
  }
  
  .big-circle {
    width: 200px;
    height: 200px;
    background: #D0A871;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.1s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    
  }
  .big-circle:active {
    transform: scale(0.9);
  }
  
  .small-circle {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 40px;
    height: 40px;
    background: #D0A871;
    color: white;
    font-size: 18px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: background 0.3s;
  }
  .small-circle:hover {
    background: #b48b5f;
  }
  
  .total {
    font-size: 1.2rem;
  }
  .total span {
    color: purple;
    font-weight: bold;
  }
  </style>
  