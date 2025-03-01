<template>

    <div class="location-header">
        <div class="date-info">
            <p>{{ gregorianDate }}</p>
            <p>{{ hijriDate }}</p>
        </div>
        <div class="location-info">
            <p class="location-title">المكان</p>
            <p class="location-name">
            <p v-if="location.city && location.country">
                {{ location.city }}<br />
            </p>
            <p v-else>جاري تحديد الموقع...</p>

            </p>
        </div>
    </div>
    <div class="prayer-times-container">
        <div v-for="(time, key) in prayerTimes" :key="key" class="prayer-time"
            :class="{ 'next-prayer': key === nextPrayer }">
            <div class="prayer-name">{{ getPrayerName(key) }}</div>
            <div class="prayer-time-value">{{ time }}</div>
        </div>
    </div>

    <p v-if="error" style="color:red;">⚠️ {{ error }}</p>

</template>
<script setup>

import { ref, onMounted } from 'vue';

const location = ref({ latitude: null, longitude: null, city: '', country: '' });
const error = ref(null);

import { computed } from 'vue';

const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const nextPrayer = computed(() => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    for (const prayer of prayerOrder) {
        const [hours, minutes] = prayerTimes.value[prayer].split(':').map(Number);
        const prayerTimeInMinutes = hours * 60 + minutes;

        if (prayerTimeInMinutes > currentTime) {
            return prayer;
        }
    }

    // لو عدت كل الصلوات، نرجع للفجر تاني يوم
    return 'Fajr';
});
function getPrayerName(key) {
    const names = {
        Fajr: 'الفجر',
        Sunrise: 'الشروق',
        Dhuhr: 'الظهر',
        Asr: 'العصر',
        Maghrib: 'المغرب',
        Isha: 'العشاء',
    };
    return names[key] || key;
}
onMounted(() => {
    getLocation(); // تشغيل مباشرة عند فتح الموقع
});

function getLocation() {
    if (!navigator.geolocation) {
        error.value = "المتصفح لا يدعم تحديد الموقع الجغرافي.";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            location.value.latitude = latitude;
            location.value.longitude = longitude;

            // استدعاء Reverse Geocoding للحصول على اسم المدينة والدولة
            await getCityAndCountry(latitude, longitude);
            await getPrayerTimes(latitude, longitude);

        },
        (err) => {
            error.value = "تعذر الحصول على الموقع: " + err.message;
        }
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

const gregorianDate = ref('');
const hijriDate = ref('');

onMounted(() => {
    getCurrentDate();
});

function getCurrentDate() {
    const now = new Date();

    // التاريخ الميلادي
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    gregorianDate.value = now.toLocaleDateString('ar-EG', options);

    // استدعاء التاريخ الهجري
    fetchHijriDate(now);
}

async function fetchHijriDate(date) {
    const isoDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const url = `https://api.aladhan.com/v1/gToH?date=${isoDate}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        const hijri = data.data.hijri;
        hijriDate.value = `${hijri.weekday.ar} ${hijri.day} ${hijri.month.ar} ${hijri.year}`;
    } catch (error) {
        console.error("Hijri API Error:", error);
        hijriDate.value = 'تعذر جلب التاريخ الهجري';
    }
}
const prayerTimes = ref(null);


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

/* 
import { ref } from 'vue';

const location = ref({ latitude: null, longitude: null, city: '', country: '' });
const error = ref(null);

async function getLocation() {
    if (!navigator.geolocation) {
        error.value = "Geolocation is not supported by your browser.";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            location.value.latitude = latitude;
            location.value.longitude = longitude;

            // Call reverse geocoding API
            await getCityAndCountry(latitude, longitude);
        },
        (err) => {
            error.value = "Unable to retrieve location. Error: " + err.message;
        }
    );
}

async function getCityAndCountry(lat, lon) {
    const apiKey = '5c043ac684874734ae5451592b91884a';  // Replace with your OpenCage API Key
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}&language=ar`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results.length > 0) {
            const result = data.results[0].components;
            location.value.city = result.city || result.town || result.village || "غير معروف";
            location.value.country = result.country || "غير معروف";
        } else {
            error.value = "لم يتم العثور على موقع جغرافي.";
        }
    } catch (err) {
        error.value = "حدث خطأ أثناء جلب البيانات: " + err.message;
    }
} */
</script>
<style scoped>
.location-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    direction: rtl;
    font-family: 'Cairo', sans-serif;
}

.date-info {
    text-align: left;
    font-size: 12px;
    color: #000;
}

.location-info {
    text-align: right;
}

.location-title {
    color: #D0A871;
    font-size: 12px;
}

.location-name {
    font-weight: bold;
    font-size: 14px;
    color: #000;
}

.prayer-times-container {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    background: #f7f7f7;
    padding: 12px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow-x: auto;
}

.prayer-time {
    flex: 1;
    text-align: center;
    padding: 8px;
    background: #fff;
    border-radius: 8px;
    transition: transform 0.3s ease, background-color 0.3s ease;
    min-width: 70px;
}

.prayer-name {
    font-weight: bold;
    font-size: 14px;
    color: #8E8D8B;
}

.prayer-time-value {
    font-size: 16px;
    color: #000;
    margin-top: 4px;
}

.next-prayer {
    background-color: #f5cd87;
    color: #000;
    transform: scale(1.1);
    font-weight: bold;
    box-shadow: 0 0 10px rgba(245, 205, 135, 0.5);
}
</style>