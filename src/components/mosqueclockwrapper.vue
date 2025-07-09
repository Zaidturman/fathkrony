<template>
  <div class="mosque-clock-wrapper">
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>جاري التحميل...</p>
    </div>
    <div v-else class="content">
      <div class="header-section">
        <div class="current-time">
          <p>{{ currentTime }}</p>
        </div>

        <div class="date-info">
          <p class="hijri-date">{{ currentHijriDate }}</p>
          <p class="gregorian-date">{{ currentDate }}</p>
          <p class="day-name">{{ currentDay }}</p> 
        </div>
      </div>

      <div class="prayer-times">
        <div
          v-for="(time, name) in filteredPrayerTimes"
          :key="name"
          :class="['prayer-time', { 'next-prayer': isNextPrayer(name) }]"
        >
          <div class="prayer-name">{{ getPrayerName(name) }}</div>
          <div class="prayer-time-container">
            <div class="prayer-time-value">{{ time }}</div>
            <div class="remaining-time">
              <span>{{ getRemainingTimeForPrayer(time) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-section">
        <div class="time-info-card">
          <p class="info-label">الوقت المتبقي للإقامة:</p>
          <p class="info-value">{{ remainingTimeForIqama }}</p>
        </div>
        <div class="time-info-card accent">
          <p class="info-label">الوقت المتبقي للصلاة التالية:</p>
          <p class="info-value">{{ remainingTimeForNextPrayer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const isLoading = ref(true);
const location = ref({ latitude: null, longitude: null });
const gregorianDate = ref('');
const hijriDate = ref('');
const currentTime = ref('');
const prayerTimes = ref(null);
const nextPrayer = ref(null);
const remainingTimeForNextPrayer = ref('');
const currentDate = ref('');
const currentHijriDate = ref('');
const currentDay = ref('');

const prayerIqamaTimes = {
  Fajr: 20,
  Dhuhr: 15,
  Asr: 15,
  Maghrib: 10,
  Isha: 10
};

onMounted(async () => {
  await getLocation();
  getCurrentDate();
  updateNextPrayer();
  updateTime();

  setInterval(updateNextPrayer, 60000);
  setInterval(updateTime, 1000);
  setInterval(toggleDate, 30000);
});

async function getLocation() {
  if (!navigator.geolocation) {
    console.error("المتصفح لا يدعم تحديد الموقع الجغرافي.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      location.value.latitude = latitude;
      location.value.longitude = longitude;
      await getPrayerTimes(latitude, longitude);
    },
    (err) => {
      console.error("تعذر الحصول على الموقع: " + err.message);
    }
  );
}

async function getPrayerTimes(latitude, longitude) {
  const url = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    prayerTimes.value = data.data.timings;
    nextPrayer.value = getNextPrayer(data.data.timings);
    isLoading.value = false; 

  } catch (err) {
    console.error("تعذر جلب أوقات الصلاة: " + err.message);
  }
}

function getPrayerName(prayerKey) {
  return {
    Fajr: 'الفجر',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء'
  }[prayerKey];
}

function getNextPrayer(prayerTimes) {
  const now = new Date();
  const prayerTimesWithDates = Object.entries(prayerTimes).map(([name, time]) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return { name, time: date };
  });

  const upcomingPrayers = prayerTimesWithDates.filter((prayer) => prayer.time > now);

  if (upcomingPrayers.length > 0) {
    return upcomingPrayers.reduce((prev, curr) => prev.time < curr.time ? prev : curr).name;
  }
  return prayerTimesWithDates[0].name;
}

function getRemainingTimeForPrayer(prayerTime) {
  const now = new Date();
  const [hours, minutes] = prayerTime.split(':');
  const prayerDate = new Date();
  prayerDate.setHours(hours, minutes, 0, 0);

  const remainingTime = prayerDate - now;
  if (remainingTime < 0) return 'تمت الصلاة';

  const hoursLeft = Math.floor(remainingTime / 3600000);
  const minutesLeft = Math.floor((remainingTime % 3600000) / 60000);
  return `${hoursLeft} ساعة ${minutesLeft} دقيقة`;
}

function getRemainingTimeForNextPrayer() {
  if (!nextPrayer.value) return '';
  return getRemainingTimeForPrayer(prayerTimes.value[nextPrayer.value]);
}

function updateNextPrayer() {
  if (prayerTimes.value) {
    nextPrayer.value = getNextPrayer(prayerTimes.value);
    remainingTimeForNextPrayer.value = getRemainingTimeForNextPrayer();
  }
}

function updateTime() {
  currentTime.value = new Date().toLocaleTimeString('ar');
}

function toggleDate() {
  currentDate.value = currentDate.value === gregorianDate.value ? hijriDate.value : gregorianDate.value;
}

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

async function fetchHijriDate(gregorianDate, calendarMethod = 'HJCoSA') {
  const url = `https://api.aladhan.com/v1/gToH/${gregorianDate}?calendarMethod=${calendarMethod}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 200 && data.data) {
      hijriDate.value = data.data.hijri.date;
      currentDay.value = data.data.hijri.weekday.ar;
    } else {
      console.error("Data not available:", data);
    }
  } catch (error) {
    console.error("Error fetching Hijri date:", error);
  }
}

function getCurrentDate() {
  const now = new Date();
  gregorianDate.value = formatDate(now);
  currentDay.value = now.toLocaleDateString('ar', { weekday: 'long' });
  fetchHijriDate(gregorianDate.value);
  currentDate.value = gregorianDate.value;
}

const filteredPrayerTimes = computed(() => {
  if (!prayerTimes.value) return {};
  const { Fajr, Dhuhr, Asr, Maghrib, Isha } = prayerTimes.value;
  return { Fajr, Dhuhr, Asr, Maghrib, Isha };
});

function isNextPrayer(prayerKey) {
  return nextPrayer.value === prayerKey;
}
</script>



<style scoped>
* {
  font-family: "Tajawal", "the-year-of-the-camel", sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.mosque-clock-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  direction: rtl;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  min-height: 100vh;
}

.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5em;
  color: #5a5a5a;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #8e6c88;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.header-section {
  background-color: #fff;
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.current-time {
  font-size: 2.5em;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 15px;
}

.date-info {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 10px;
}

.date-info p {
  font-size: 1.1em;
  color: #5a5a5a;
}

.hijri-date {
  color: #8e6c88;
  font-weight: bold;
}

.gregorian-date {
  color: #4a6baf;
}

.day-name {
  color: #2c786c;
  font-weight: bold;
}

.prayer-times {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

.prayer-time {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.prayer-time:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.prayer-name {
  font-weight: bold;
  font-size: 1.2em;
  color: #2c3e50;
  margin-bottom: 10px;
}

.prayer-time-value {
  font-size: 1.3em;
  font-weight: bold;
  color: #2c786c;
  margin-bottom: 5px;
}

.remaining-time {
  font-size: 0.8em;
  color: #7f8c8d;
}

.next-prayer {
  background: linear-gradient(135deg, #f5cd87 0%, #e8b563 100%);
  color: #2c3e50;
  position: relative;
  overflow: hidden;
}

.next-prayer::after {
  content: "القادمة";
  position: absolute;
  top: 5px;
  left: 5px;
  background-color: #e74c3c;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7em;
}

.footer-section {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 20px;
}

.time-info-card {
  flex: 1;
  background-color: #fff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.time-info-card.accent {
  background: linear-gradient(135deg, #8e6c88 0%, #6d4c7b 100%);
  color: white;
}

.info-label {
  font-size: 0.9em;
  margin-bottom: 5px;
  color: #7f8c8d;
}

.time-info-card.accent .info-label {
  color: rgba(255, 255, 255, 0.9);
}

.info-value {
  font-size: 1.1em;
  font-weight: bold;
  color: #2c3e50;
}

.time-info-card.accent .info-value {
  color: white;
}

@media (max-width: 768px) {
  .prayer-times {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .footer-section {
    flex-direction: column;
  }
  
  .current-time {
    font-size: 2em;
  }
}

@media (max-width: 480px) {
  .prayer-times {
    grid-template-columns: 1fr;
  }
  
  .date-info {
    flex-direction: column;
  }
}
</style>