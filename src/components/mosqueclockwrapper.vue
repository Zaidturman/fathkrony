<template>
  <div class="app-container">
    <div class="zoom-controls">
      <button @click="zoomIn" title="تكبير">
        <span class="icon">+</span>
      </button>
      <button @click="zoomReset" title="إعادة الضبط">
        <span class="icon">↻</span>
      </button>
      <button @click="zoomOut" title="تصغير">
        <span class="icon">-</span>
      </button>
    </div>

    <div class="mosque-clock-container" :style="containerStyle">
      <!-- باقي المحتوى كما هو -->
      <div v-if="isLoading" class="loading-screen">
        <div class="spinner"></div>
        <p class="loading-text">جاري تحميل البيانات...</p>
      </div>

      <div v-else class="main-content">
        <!-- القسم العلوي - الوقت والتاريخ -->
        <div class="header-section">
          <div class="time-display">
            <h1>{{ currentTime }}</h1>
          </div>
          
          <div class="date-display">
            <div class="hijri-date">{{ currentHijriDate }}</div>
            <div class="gregorian-date">{{ currentDate }}</div>
            <div class="day-name">{{ currentDay }}</div>
          </div>
        </div>

        <!-- أوقات الصلاة -->
        <div class="prayer-times-section">
          <div 
            v-for="(time, name) in filteredPrayerTimes" 
            :key="name"
            :class="['prayer-card', { 'next-prayer': isNextPrayer(name) }]"
          >
            <div class="prayer-name">{{ getPrayerName(name) }}</div>
            <div class="prayer-time">{{ time }}</div>
            <div class="time-remaining">
              <span v-if="!isPrayerPassed(time)">{{ getRemainingTimeForPrayer(time) }}</span>
              <span v-else class="passed">تمت الصلاة</span>
            </div>
          </div>
        </div>

        <!-- معلومات إضافية -->
        <div class="info-section">
          <div class="info-card iqama-time">
            <div class="info-title">الوقت المتبقي للإقامة</div>
            <div class="info-value">{{ remainingTimeForIqama }}</div>
          </div>
          
          <div class="info-card next-prayer-time">
            <div class="info-title">الصلاة القادمة</div>
            <div class="info-value">{{ getPrayerName(nextPrayer) }} - {{ remainingTimeForNextPrayer }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const isLoading = ref(true);
const location = ref({ latitude: null, longitude: null });
const currentTime = ref('');
const prayerTimes = ref(null);
const nextPrayer = ref(null);
const remainingTimeForNextPrayer = ref('');
const currentDate = ref('');
const currentHijriDate = ref('');
const currentDay = ref('');
const zoomLevel = ref(1);
const minZoom = 0.8;
const maxZoom = 1.5;
const zoomStep = 0.1;

const containerStyle = computed(() => ({
  transform: `scale(${zoomLevel.value})`,
  transformOrigin: 'top center',
  width: '100%',
  height: '100%',
  position: 'relative',
  transition: 'transform 0.3s ease'
}));

const zoomIn = () => {
  if (zoomLevel.value < maxZoom) {
    zoomLevel.value = parseFloat((zoomLevel.value + zoomStep).toFixed(1));
    localStorage.setItem('zoomLevel', zoomLevel.value);
  }
};

const zoomOut = () => {
  if (zoomLevel.value > minZoom) {
    zoomLevel.value = parseFloat((zoomLevel.value - zoomStep).toFixed(1));
    localStorage.setItem('zoomLevel', zoomLevel.value);
  }
};

const zoomReset = () => {
  zoomLevel.value = 1;
  localStorage.setItem('zoomLevel', zoomLevel.value);
};

// استعادة إعدادات التكبير عند التحميل
onMounted(() => {
  const savedZoom = localStorage.getItem('zoomLevel');
  if (savedZoom) {
    zoomLevel.value = parseFloat(savedZoom);
  }
});

const prayerIqamaTimes = {
  Fajr: 20,
  Dhuhr: 15,
  Asr: 15,
  Maghrib: 10,
  Isha: 10
};

// الدوال الأساسية
onMounted(async () => {
  await getLocation();
  updateDateTime();
  setInterval(updateDateTime, 1000);
  setInterval(updateNextPrayerInfo, 60000);
});

async function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.error("المتصفح لا يدعم تحديد الموقع");
      reject();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        location.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        await fetchPrayerTimes();
        resolve();
      },
      (error) => {
        console.error("خطأ في الحصول على الموقع:", error);
        // استخدام موقع افتراضي في حالة الخطأ
        location.value = { latitude: 24.7136, longitude: 46.6753 }; // الرياض
        fetchPrayerTimes().then(resolve);
      }
    );
  });
}

async function fetchPrayerTimes() {
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timings?latitude=${location.value.latitude}&longitude=${location.value.longitude}&method=4`
    );
    const data = await response.json();
    prayerTimes.value = data.data.timings;
    updateNextPrayerInfo();
    await fetchHijriDate();
    isLoading.value = false;
  } catch (error) {
    console.error("خطأ في جلب أوقات الصلاة:", error);
  }
}

function updateDateTime() {
  const now = new Date();
  
  // تحديث الوقت الحالي
  currentTime.value = now.toLocaleTimeString('ar-SA', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  
  // تحديث التاريخ الميلادي
  currentDate.value = now.toLocaleDateString('ar-SA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  // تحديث اليوم
  currentDay.value = now.toLocaleDateString('ar-SA', { weekday: 'long' });
}

async function fetchHijriDate() {
  try {
    const today = new Date();
    const dateStr = `${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`;
    const response = await fetch(`https://api.aladhan.com/v1/gToH/${dateStr}`);
    const data = await response.json();
    
    if (data.code === 200) {
      const hijri = data.data.hijri;
      currentHijriDate.value = `${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`;
    }
  } catch (error) {
    console.error("خطأ في جلب التاريخ الهجري:", error);
  }
}

function updateNextPrayerInfo() {
  if (!prayerTimes.value) return;
  
  nextPrayer.value = getNextPrayer();
  remainingTimeForNextPrayer.value = getRemainingTimeForPrayer(prayerTimes.value[nextPrayer.value]);
}

function getNextPrayer() {
  const now = new Date();
  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  
  for (const prayer of prayers) {
    const prayerTime = convertTimeStringToDate(prayerTimes.value[prayer]);
    if (prayerTime > now) return prayer;
  }
  
  // إذا مرت جميع الصلوات، نعود لصلاة الفجر التالية
  return 'Fajr';
}

function convertTimeStringToDate(timeStr) {
  const [hours, minutes] = timeStr.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return date;
}

function getRemainingTimeForPrayer(prayerTime) {
  const now = new Date();
  const prayerDate = convertTimeStringToDate(prayerTime);
  
  if (prayerDate < now) return 'تمت الصلاة';
  
  const diff = prayerDate - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours} ساعة ${minutes} دقيقة`;
}

function isPrayerPassed(prayerTime) {
  const now = new Date();
  const prayerDate = convertTimeStringToDate(prayerTime);
  return prayerDate < now;
}

const remainingTimeForIqama = computed(() => {
  if (!nextPrayer.value) return '';
  const prayerTime = convertTimeStringToDate(prayerTimes.value[nextPrayer.value]);
  const iqamaMinutes = prayerIqamaTimes[nextPrayer.value];
  const iqamaTime = new Date(prayerTime.getTime() + iqamaMinutes * 60000);
  
  const now = new Date();
  if (iqamaTime < now) return 'تمت الإقامة';
  
  const diff = iqamaTime - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours} ساعة ${minutes} دقيقة`;
});

const filteredPrayerTimes = computed(() => {
  if (!prayerTimes.value) return {};
  const { Fajr, Dhuhr, Asr, Maghrib, Isha } = prayerTimes.value;
  return { Fajr, Dhuhr, Asr, Maghrib, Isha };
});

function getPrayerName(prayerKey) {
  const names = {
    Fajr: 'الفجر',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء'
  };
  return names[prayerKey];
}

function isNextPrayer(prayerKey) {
  return nextPrayer.value === prayerKey;
}
</script>

<style scoped>


.mosque-clock-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  direction: rtl;
}

.loading-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 5px solid rgba(142, 108, 136, 0.2);
  border-radius: 50%;
  border-top-color: #8e6c88;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.loading-text {
  font-size: 1.2rem;
  color: #5a5a5a;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.header-section {
  background-color: rgb(250, 250, 250);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.time-display h1 {
  font-size: 3rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.date-display {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 10px;
}

.hijri-date {
  color: #8e6c88;
  font-weight: bold;
  font-size: 1.1rem;
}

.gregorian-date {
  color: #4a6baf;
  font-size: 1.1rem;
}

.day-name {
  color: #2c786c;
  font-weight: bold;
  font-size: 1.1rem;
}

.prayer-times-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.prayer-card {
  background-color: rgb(250, 250, 250);

  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  text-align: center;
}

.prayer-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.prayer-name {
  font-weight: bold;
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.prayer-time {
  font-size: 1.3rem;
  font-weight: bold;
  color: #2c786c;
  margin-bottom: 5px;
}

.time-remaining {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.time-remaining .passed {
  color: #e74c3c;
}

.next-prayer {
  background: linear-gradient(135deg, #f5cd87 0%, #e8b563 100%);
  position: relative;
  overflow: hidden;
}

.next-prayer::after {
  content: "القادمة";
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: #e74c3c;
  color: white;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
}

.info-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}

.info-card {
  background-color: rgb(250, 250, 250);

  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.iqama-time {
  border-bottom: 4px solid #8e6c88;
}

.next-prayer-time {
  border-bottom: 4px solid #2c786c;
}

.info-title {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 5px;
}

.info-value {
  font-size: 1.1rem;
  font-weight: bold;
  color: #2c3e50;
}

@media (max-width: 600px) {
  .time-display h1 {
    font-size: 2.5rem;
  }
  
  .prayer-times-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 400px) {
  .prayer-times-section {
    grid-template-columns: 1fr;
    
  }
  
  .date-display {
    flex-direction: column;
  }
  .mosque-clock-container{
    margin-bottom: 100px;
  }
}
.zoom-controls {
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.zoom-controls button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #8e6c88;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.3s;
}

.zoom-controls button:hover {
  background: #6d4c67;
  transform: scale(1.1);
}
@media (max-width: 768px) {
  .zoom-controls {
    flex-direction: row;
    left: 50%;
    top: auto;
    bottom: 20px;
    transform: translateX(-50%);
  }
  
  .mosque-clock-container {
    padding-bottom: 80px;
  }
}
</style>