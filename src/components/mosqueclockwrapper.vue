<template>
    <div class="mosque-clock-wrapper">
      <div class="current-time">
        <p>{{ currentTime }}</p>
      </div>
  
      <div class="date-info">
        <p>{{ currentDate }} </p>

        <p>{{ currentHijriDate }} </p>
        <p>{{ currentDay }}</p> <!-- اسم اليوم -->

      </div>
  
      <div class="prayer-times">
        <div
          v-for="(time, name) in filteredPrayerTimes"
          :key="name"
          :class="['prayer-time', { 'next-prayer': isNextPrayer(name) }]"
        >
          <div class="prayer-name">{{ getPrayerName(name) }}</div>
          <div class="prayer-time-value">{{ time }}</div>
          <div class="remaining-time">
            <span v-if="name !== 'Fajr'">{{ getRemainingTimeForPrayer(time) }}</span>
          </div>
        </div>
      </div>
  
      <div class="remaining-time-info">
        <p>الوقت المتبقي للإقامة: {{ remainingTimeForIqama }}</p>
        <p>الوقت المتبقي للصلاة التالية: {{ remainingTimeForNextPrayer }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed, watch } from 'vue';
  
  const location = ref({ latitude: null, longitude: null, city: '', country: '' });
  const gregorianDate = ref('');
  const hijriDate = ref('');
  const currentTime = ref('');
  const prayerTimes = ref(null);
  const nextPrayer = ref(null);
  const remainingTimeForIqama = ref('');
  const remainingTimeForNextPrayer = ref('');
  const currentDate = ref('');
  const currentHijriDate = ref('');
  const currentDay = ref(''); // اسم اليوم

  
  const prayerIqamaTimes = {
    Fajr: 20,
    Dhuhr: 15,
    Asr: 15,
    Maghrib: 10,
    Isha: 10
  };
  
  onMounted(() => {
    getLocation();
    getCurrentDate();
    getRemainingTimeForNextPrayer();
    updateNextPrayer(); // تحديث الصلاة التالية عند التحميل
    setInterval(updateNextPrayer, 60000); // تحديث الصلاة التالية كل دقيقة

    setInterval(updateTime, 1000); // تحديث الوقت كل ثانية
    setInterval(toggleDate, 30000); // التبديل بين الميلادي والهجري كل نصف دقيقة
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
    } catch (err) {
      console.error("تعذر جلب أوقات الصلاة: " + err.message);
    }
  }
  
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
      const next = upcomingPrayers.reduce((prev, curr) => prev.time < curr.time ? prev : curr);
      return next.name;
    }
  
    return prayerTimesWithDates[0].name;
  }
  
  function getRemainingTimeForPrayer(prayerTime) {
    const now = new Date();
    const [hours, minutes] = prayerTime.split(':');
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0, 0);
  
    const remainingTime = prayerDate - now;
    const hoursLeft = Math.floor(remainingTime / 3600000); // الوقت المتبقي بالساعات
    const minutesLeft = Math.floor((remainingTime % 3600000) / 60000); // الوقت المتبقي بالدقائق
  
    if (remainingTime < 0) return 'تمت الصلاة';
    return `${hoursLeft} ساعة ${minutesLeft} دقيقة`;
  }
  
  function getRemainingTimeForNextPrayer() {
    if (!nextPrayer.value) return '';
    const prayerTime = prayerTimes.value[nextPrayer.value];
    return getRemainingTimeForPrayer(prayerTime);
  }
  function updateNextPrayer() {
  if (prayerTimes.value) {
    nextPrayer.value = getNextPrayer(prayerTimes.value);
    remainingTimeForNextPrayer.value = getRemainingTimeForNextPrayer(); // تأكد من تحديث الوقت المتبقي
  }
}
  
  function updateTime() {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString('ar');
  }
  
  function toggleDate() {
    currentDate.value = currentDate.value === gregorianDate.value ? hijriDate.value : gregorianDate.value;
  }
  
   // Function to format the date as DD-MM-YYYY
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Function to fetch the Hijri date
async function fetchHijriDate(gregorianDate, calendarMethod = 'HJCoSA') {
  const url = `https://api.aladhan.com/v1/gToH/${gregorianDate}?calendarMethod=${calendarMethod}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 200 && data.data) {
      const hijriData = data.data.hijri;

      hijriDate.value = hijriData.date;
      currentDay.value = hijriData.weekday.ar; // Set the Hijri day name in Arabic
    } else {
      console.error("Data not available:", data);
    }
  } catch (error) {
    console.error("Error fetching Hijri date:", error);
  }
}

// Function to get the current Gregorian and Hijri dates
function getCurrentDate() {
  const now = new Date();
  gregorianDate.value = formatDate(now); // Format the Gregorian date
  currentDay.value = now.toLocaleDateString('ar', { weekday: 'long' }); // Get the day of the week in Arabic

  fetchHijriDate(gregorianDate.value); // Fetch the Hijri date based on the formatted Gregorian date
}



  
  const filteredPrayerTimes = computed(() => {
    if (!prayerTimes.value) return {};
    const { Fajr, Dhuhr, Asr, Maghrib, Isha } = prayerTimes.value;
    return { Fajr, Dhuhr, Asr, Maghrib, Isha };
  });
  
  function isNextPrayer(prayerKey) {
    return nextPrayer.value === prayerKey;
  }
  
  // الوقت المتبقي للإقامة
  function getRemainingTimeForIqamaForPrayer(prayerKey) {
    return prayerIqamaTimes[prayerKey];
  }
  </script>
  
  <style scoped>
  *{

      font-family: "Cairo", serif;
  }
  .mosque-clock-wrapper {
    padding: 20px;
    text-align: center;
    direction: rtl;
    background-color: #f4f4f9;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding-bottom: 60px; /* المسافة أسفل المحتوى لتجنب تغطيته بالـ bottom-nav */

  }
  
  .current-time {
    font-size: 2em;
    font-weight: bold;
    color: #333;
  }
  
  .date-info {
    margin-top: 20px;
    font-size: 1.2em;
    color: #555;
  }
  
  .prayer-times {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
  }
  
  .prayer-time {
    margin-bottom: 10px;
    padding: 15px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 120px;
    text-align: center;
    transition: transform 0.3s ease, background-color 0.3s ease;
  }
  
  .prayer-time:hover {
    transform: scale(1.05);
    background-color: #f5cd87;
  }
  
  .prayer-name {
    font-weight: bold;
    font-size: 1.1em;
  }
  
  .prayer-time-value {
    font-size: 1.2em;
  }
  
  .remaining-time {
    font-size: 0.7em;
    color: #999;
  }
  
  .remaining-time-info {
    margin-top: 20px;
    font-size: 1.2em;
    color: #444;
  }
  
  .next-prayer {
    background-color: #f5cd87;
    color: #000;
    font-weight: bold;
    box-shadow: 0 0 10px rgba(245, 205, 135, 0.5);
  }
  </style>
  