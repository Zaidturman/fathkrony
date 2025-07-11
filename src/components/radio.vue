<template>
    <div class="radio-app">
      <!-- شريط التحكم في الصوت -->
      <div class="player-controls" :class="{ active: currentRadio }">
        <div class="now-playing">
          <img v-if="currentRadio" :src="currentRadio.img" class="current-radio-img">
          <div v-if="currentRadio" class="radio-info">
            <h3>{{ currentRadio.name }}</h3>
            <p>جاري التشغيل الآن</p>
          </div>
          <div v-else class="radio-info">
            <h3>لم يتم اختيار إذاعة</h3>
          </div>
        </div>
        
        <div class="controls">
          <button @click="togglePlay" class="play-btn">
            <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
          </button>
          <button @click="stopRadio" class="stop-btn">
            <i class="fas fa-stop"></i>
          </button>
          <div class="volume-control">
            <i class="fas fa-volume-up"></i>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              v-model="volume"
              @input="setVolume"
              class="volume-slider"
            >
          </div>
        </div>
      </div>
  
      <!-- قائمة الإذاعات -->
      <div class="radio-container">
        <h1 class="page-title"><i class="fas fa-broadcast-tower"></i> إذاعات القرآن الكريم</h1>
        
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="ابحث عن إذاعة..."
            class="search-input"
          >
          <i class="fas fa-search search-icon"></i>
        </div>
        
        <div class="radio-grid">
          <div 
            v-for="radio in filteredRadios" 
            :key="radio.id"
            @click="playRadio(radio)"
            :class="['radio-card', { 'active': currentRadio && currentRadio.id === radio.id }]"
          >
            <div class="radio-image">
              <img :src="radio.img" :alt="radio.name">
              <div class="play-overlay">
                <i v-if="currentRadio && currentRadio.id === radio.id && isPlaying" class="fas fa-pause"></i>
                <i v-else class="fas fa-play"></i>
              </div>
            </div>
            <div class="radio-details">
              <h3>{{ radio.name }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { Howl } from 'howler';
  
  // بيانات الإذاعات
  const radios = ref([]);
  const currentRadio = ref(null);
  const isPlaying = ref(false);
  const searchQuery = ref('');
  const volume = ref(0.7);
  let sound = null;
  
  // جلب بيانات الإذاعات
  onMounted(async () => {
    try {
      const response = await fetch('https://data-rosy.vercel.app/radio.json');
      const data = await response.json();
      radios.value = data.radios;
    } catch (error) {
      console.error('Error fetching radio data:', error);
    }
  });
  
  // تصفية الإذاعات حسب البحث
  const filteredRadios = computed(() => {
    return radios.value.filter(radio => 
      radio.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
  
  // تشغيل الإذاعة
  function playRadio(radio) {
    if (currentRadio.value && currentRadio.value.id === radio.id) {
      togglePlay();
      return;
    }
  
    stopRadio();
    
    currentRadio.value = radio;
    sound = new Howl({
      src: [radio.url],
      html5: true,
      format: ['mp3', 'aac'],
      volume: volume.value
    });
  
    sound.play();
    isPlaying.value = true;
    
    sound.on('end', () => {
      isPlaying.value = false;
    });
  }
  
  // تبديل التشغيل/الإيقاف المؤقت
  function togglePlay() {
    if (!sound) return;
    
    if (isPlaying.value) {
      sound.pause();
    } else {
      sound.play();
    }
    
    isPlaying.value = !isPlaying.value;
  }
  
  // إيقاف الإذاعة
  function stopRadio() {
    if (sound) {
      sound.stop();
      sound.unload();
      sound = null;
    }
    
    isPlaying.value = false;
    currentRadio.value = null;
  }
  
  // ضبط مستوى الصوت
  function setVolume() {
    if (sound) {
      sound.volume(volume.value);
    }
  }
  </script>
  
  <style scoped>
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

  .radio-app {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    min-height: 100vh;
  }
  
  .page-title {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 30px;
    font-size: 2rem;
    padding-bottom: 15px;
    border-bottom: 2px solid #8e6c88;
  }
  
  .page-title i {
    margin-left: 10px;
    color: #8e6c88;
  }
  
  .search-box {
    position: relative;
    max-width: 500px;
    margin: 0 auto 30px;
  }
  
  .search-input {
    width: 100%;
    padding: 12px 45px 12px 15px;
    border: 2px solid #ddd;
    border-radius: 30px;
    font-size: 1rem;
    outline: none;
    transition: all 0.3s;
  }
  
  .search-input:focus {
    border-color: #8e6c88;
    box-shadow: 0 0 10px rgba(142, 108, 136, 0.2);
  }
  
  .search-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #7f8c8d;
  }
  
  .radio-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    padding: 10px;
  }
  
  .radio-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .radio-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
  
  .radio-card.active {
    border: 3px solid #8e6c88;
  }
  
  .radio-image {
    position: relative;
    width: 100%;
    height: 160px;
    overflow: hidden;
  }
  
  .radio-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }
  
  .radio-card:hover .radio-image img {
    transform: scale(1.05);
  }
  
  .play-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 2rem;
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  .radio-card:hover .play-overlay {
    opacity: 1;
  }
  
  .radio-details {
    padding: 15px;
    text-align: center;
  }
  
  .radio-details h3 {
    color: #2c3e50;
    font-size: 1.1rem;
    margin-bottom: 5px;
  }
  
  .player-controls {
    position: fixed;
    bottom: -100px;
    left: 0;
    right: 0;
    background: white;
    padding: 15px 20px;
    box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: bottom 0.3s ease;
    z-index: 1000;
  }
  
  .player-controls.active {
    bottom: 0;
  }
  
  .now-playing {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .current-radio-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .radio-info h3 {
    color: #2c3e50;
    font-size: 1.1rem;
    margin-bottom: 5px;
  }
  
  .radio-info p {
    color: #7f8c8d;
    font-size: 0.9rem;
  }
  
  .controls {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .play-btn, .stop-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: #8e6c88;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s;
  }
  
  .play-btn:hover, .stop-btn:hover {
    background: #7a5b75;
    transform: scale(1.1);
  }
  
  .volume-control {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .volume-control i {
    color: #8e6c88;
  }
  
  .volume-slider {
    width: 100px;
    accent-color: #8e6c88;
  }
  
  @media (max-width: 768px) {
    .radio-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
    
    .player-controls {
      flex-direction: column;
      gap: 15px;
      padding: 15px;
    }
    
    .now-playing {
      width: 100%;
    }
    
    .controls {
      width: 100%;
      justify-content: center;
    }
  }
  
  @media (max-width: 480px) {
    .radio-grid {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 10px;
    }
    
    .page-title {
      font-size: 1.5rem;
    }
    
    .radio-details h3 {
      font-size: 0.9rem;
    }
  }
  </style>