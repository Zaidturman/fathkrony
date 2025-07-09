<template >
    <div class="prayer-times-wrapper">
        <div class="location-header">
            <div class="date-info">
                <p>{{ gregorianDate }}</p>
                <p>{{ hijriDate }}</p>
            </div>
            <div class="location-info">
                <p class="location-title">المكان</p>
                <p class="location-name">
                    <span v-if="location.city && location.country">
                        {{ location.city }}<br />
                    </span>
                    <span v-else>جاري تحديد الموقع...</span>
                </p>
            </div>
        </div>

        <div class="prayer-times-container">
            <div v-for="(time, name) in filteredPrayerTimes" :key="name"
                :class="['prayer-time', { 'next-prayer': isNextPrayer(name) }]">
                <div class="prayer-name">{{ getPrayerName(name) }}</div>
                <div class="prayer-time-value">{{ time }}</div>
            </div>
        </div>

        <p v-if="error" class="error-message">⚠️ {{ error }}</p>
        <div class="bgdiv">
        <div>
            <p class="zikr">{{ currentZikr }}</p>
        </div>
    </div>

    <All class="all"/>
    <div class="footer">
        برمجة وتطوير زيد طرمان
    </div>
    </div>

  
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import All from './all.vue';
import Quran from './quran.vue';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/dist/sweetalert2.min.css'; 
import azkarData from "../assets/theker.json"; 

const azkar = azkarData.azkar;
const currentZikr = ref("");

const getRandomZikr = () => {
    const randomIndex = Math.floor(Math.random() * azkar.length);
    currentZikr.value = azkar[randomIndex];
};

onMounted(() => {
    getRandomZikr(); 
    setInterval(getRandomZikr, 3600000);
});

const location = ref({ latitude: null, longitude: null, city: '', country: '' });
const error = ref(null);
const gregorianDate = ref('');
const hijriDate = ref('');
const prayerTimes = ref(null);
const nextPrayer = ref(null); 

onMounted(() => {
    getLocation();
    getCurrentDate();
});

async function getLocation() {
    if (!navigator.geolocation) {
        error.value = "المتصفح لا يدعم تحديد الموقع الجغرافي.";
        Swal.fire({
      title: "خطأ",
      text: "المتصفح لا يدعم تحديد الموقع الجغرافي.",
      icon: "error",
      confirmButtonText: "حسنًا",
    });
    return;
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            location.value.latitude = latitude;
            location.value.longitude = longitude;

            await getCityAndCountry(latitude, longitude);
            await getPrayerTimes(latitude, longitude);
        },
        (err) => {
            error.value = "تعذر الحصول على الموقع: " + err.message;
            Swal.fire({
        title: "تنبيه",
        text: "يجب الموافقة على مشاركة الموقع لجلب أوقات الصلاة",
        icon: "warning",
        confirmButtonText: "موافق",
      });        }
    );
}

async function getCityAndCountry(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ar`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        location.value.city = data.address.city || data.address.town || data.address.village || "غير معروف";
        location.value.country = data.address.country || "غير معروف";
    } catch (err) {
        error.value = "حدث خطأ أثناء جلب البيانات: " + err.message;
    }
}

function getCurrentDate() {
    const now = new Date();
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    gregorianDate.value = now.toLocaleDateString('ar', options);
    fetchHijriDate(now);
}

async function fetchHijriDate(date) {
    const isoDate = date.toISOString().split('T')[0];
    const url = `https://api.aladhan.com/v1/gToH?date=${isoDate}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const hijri = data.data.hijri;
        hijriDate.value = `${hijri.weekday.ar} ${hijri.day} ${hijri.month.ar} ${hijri.year}`;
    } catch (error) {
        console.error("Hijri API Error:", error);
        hijriDate.value = 'تعذر جلب التاريخ الهجري';
    }
}

async function getPrayerTimes(latitude, longitude) {
    const url = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        prayerTimes.value = data.data.timings;
        gregorianDate.value = data.data.date.readable;
        hijriDate.value = `${data.data.date.hijri.weekday.ar} ${data.data.date.hijri.day} ${data.data.date.hijri.month.ar} ${data.data.date.hijri.year}`;
    } catch (err) {
        error.value = "تعذر جلب أوقات الصلاة: " + err.message;
    }
}

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
        const next = upcomingPrayers.reduce((prev, curr) =>
            prev.time < curr.time ? prev : curr
        );
        return next.name;
    }

    return prayerTimesWithDates[0].name;
}

function startNextPrayerUpdate(prayerTimes) {
    setInterval(() => {
        nextPrayer.value = getNextPrayer(prayerTimes);
    }, 60000); 
}

watch(prayerTimes, (newPrayerTimes) => {
  if (newPrayerTimes) {
    nextPrayer.value = getNextPrayer(newPrayerTimes);
    startNextPrayerUpdate(newPrayerTimes);
    
    // تمرير تلقائي للصلاة الحالية على الشاشات الصغيرة
    if (window.innerWidth < 768) {
      setTimeout(() => {
        const activePrayer = document.querySelector('.next-prayer');
        if (activePrayer) {
          activePrayer.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }
      }, 300);
    }
  }
});
</script>

<style scoped>



.bgdiv {
    display: flex;
    min-height: 90px;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    margin: 25px 0;
    background: linear-gradient(to right, #e8c58f, #f0d087);
    padding: 20px;
    box-shadow: 0 4px 12px rgba(208, 168, 113, 0.2);
    position: relative;
    overflow: hidden;
    font-size: 1.5em;
}

.bgdiv::before {
    content: '';
    position: absolute;
    top: -10px;
    right: -10px;
    width: 40px;
    height: 40px;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ffffff50"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg>');
    background-size: contain;
    opacity: 0.3;
}

.bgdiv p {
    font-weight: 500;
    font-size: 1.3em;
    color: #3a3228;
    text-align: center;
    line-height: 1.6;
    margin: 0;
}

.prayer-times-wrapper {
    max-width: 100%;
    margin: 0 auto;
    padding: 20px 16px 100px;
    direction: rtl;
    min-height: 100vh;
}

* {
    font-family: "the-year-of-the-camel", serif;
    font-weight: 500;
    line-height: 1.6;
}
.location-header {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 25px;
    background: linear-gradient(135deg, #f5e8d0, #f0e0c0);
    padding: 15px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(208, 168, 113, 0.15);
}

.date-info {
    text-align: left;
    font-size: 15px;
    color: #5a4a3a;
}

.date-info p:first-child {
    margin-bottom: 5px;
    font-weight: 600;
}

.location-info {
    text-align: center;
}

.location-title {
    color: #D0A871;
    font-size: 15px;
    margin-bottom: 5px;
    font-weight: 700 !important;
    position: relative;
    display: inline-block;
}

.location-title::after {
    content: '';
    position: absolute;
    bottom: -3px;
    right: 0;
    width: 100%;
    height: 2px;
    background: #D0A871;
    border-radius: 2px;
}

.location-name {
    font-weight: bold;
    font-size: 17px;
    color: #3a3228;
}

.prayer-times-container {
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding: 16px;
  scrollbar-width: none; /* لإخفاء شريط التمرير في Firefox */
  -ms-overflow-style: none; /* لإخفاء شريط التمرير في IE و Edge */
  white-space: nowrap;
}
/* لإخفاء شريط التمرير في Chrome و Safari و Opera */
.prayer-times-container::-webkit-scrollbar {
  display: none;
}


.prayer-time {
  flex: 0 0 auto;
  min-width: 100px;
  text-align: center;
  padding: 15px 10px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #eee;
  display: inline-block; /* مهم للتمرير الأفقي */
}

@media (min-width: 768px) {
  .prayer-times-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    overflow-x: visible;
    white-space: normal;
  }
  
  .prayer-time {
    display: block;
  }
}

.prayer-time:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.prayer-name {
    font-weight: bold;
    font-size: 16px;
    color: #5a4a3a;
    margin-bottom: 10px;
    position: relative;
    padding-bottom: 5px;
}

.prayer-name::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 2px;
    background: #D0A871;
    border-radius: 2px;
}

.prayer-time-value {
    font-size: 18px;
    color: #3a3228;
    font-weight: 600;
}

.next-prayer {
  position: relative;
  z-index: 1;
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(245, 205, 135, 0.4);
  background-color: #f0d087;
}

.next-prayer .prayer-name,
.next-prayer .prayer-time-value {
    color: #3a3228;
}
/* للهواتف الصغيرة (أقل من 768px) */
@media (max-width: 767px) {
  .prayer-times-container {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch; /* لتمرير سلس على الأجهزة المحمولة */
    padding-bottom: 10px; /* مساحة للظل */
    margin: 0 -16px;
    padding-left: 16px;
  }
  
  .prayer-time {
    min-width: 110px;
    margin-right: 0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  /* إضافة مسافة على الجانب الأيمن لآخر عنصر */
  .prayer-times-container::after {
    content: '';
    min-width: 16px;
    height: 1px;
  }
}
.prayer-times-container {
  scroll-snap-type: x mandatory;
}

.prayer-time {
  scroll-snap-align: start;
}
/* للشاشات الكبيرة (768px فأكثر) */
@media (min-width: 768px) {
  .prayer-times-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 15px;
    overflow-x: visible;
    padding: 10px;
    margin: 0;
  }
  
  .prayer-time {
    width: auto;
    min-width: auto;
  }
}
.error-message {
    color: #d32f2f;
    text-align: center;
    margin: 20px 0;
    padding: 15px;
    background-color: #ffebee;
    border-radius: 8px;
    border-left: 4px solid #d32f2f;
    font-size: 15px;
}

.imagesection {
    width: 90%;
    max-width: 800px;
    margin: 0 auto;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    height: 200px;
}

.imagesection img {
    width: 100%;
    height: auto;
    display: block;
    z-index: -1;
    width: 100%;
    height: 100%;
    height: 200px;
}

.imagesection content {
    position: relative;
    z-index: 999;
    color: white;
    text-align: center;
    padding-top: 20%;
}
@media (max-width: 576px) {
    .location-header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
    }
    
    .date-info {
        text-align: center;
    }
    
    .location-info {
        text-align: center;
    }
    
    .prayer-times-container {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .bgdiv p {
        font-size: 1.1em;
    }
}

@media (min-width: 768px) {
    .prayer-times-container {
        grid-template-columns: repeat(5, 1fr);
    }
}
.footer {
    padding: 30px 0 30px;
    text-align: center;
    color: #5a4a3a;
    font-size: 14px;

    position: relative;
}

.footer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 2px;
    background: #D0A871;
    border-radius: 2px;
}
.zikr{
    font-weight:900 !important;
}
</style>