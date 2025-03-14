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
            <p>{{ currentZikr }}</p>
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
    }
});
</script>

<style scoped>

.footer{
    padding-bottom: 100px; 
    text-align: center;
}
.all{
    margin-bottom: 20px;
}
* {
    font-family: "Cairo", serif;
    font-weight: 400;
    font-style: normal;
}

.bgdiv {
    display: flex;
    height: 70px;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    margin: 0;
    background: linear-gradient(to right, #ebc58f, #F5CD87);
    p {
        font-weight: 500;
        font-size: 1.25em;
        color: #222222;
    }
}

.prayer-times-wrapper {
    max-width: 90%;
    margin: 0 auto;
    padding: 16px;
    font-family: 'Cairo', sans-serif;
    direction: rtl;
}

.location-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.date-info {
    text-align: left;
    font-size: 14px;
    color: #555;
}

.location-info {
    text-align: right;
}

.location-title {
    color: #D0A871;
    font-size: 14px;
    margin-bottom: 4px;
    font-weight: bold;
}

.location-name {
    font-weight: bold;
    font-size: 16px;
    color: #333;
}

.prayer-times-container {
    display: flex;
    justify-content: flex-start;
    gap: 12px;
    padding: 16px;
    overflow-x: auto;
    white-space: nowrap;
}

.prayer-time {
    text-align: center;
    padding: 8px;
    background: #ffffff;
    border-radius: 8px;
    min-width: 80px;
    flex: 0 0 auto;
    transition: transform 0.3s ease, background-color 0.3s ease;
}

.prayer-name {
    font-weight: bold;
    font-size: 14px;
    color: #232323;
    margin-bottom: 8px;
}

.prayer-time-value {
    font-size: 16px;
    color: #000;
}

.next-prayer {
    background-color: #f5cd87;
    color: #000;
    transform: scale(1.05);
    font-weight: bold;
    box-shadow: 0 0 10px rgba(245, 205, 135, 0.5);
}

.error-message {
    color: red;
    text-align: center;
    margin-top: 16px;
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
</style>