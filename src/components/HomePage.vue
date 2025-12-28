<template>
    <div class="modern-prayer-times-wrapper">
        <!-- تصميم العنوان المحدث -->
        <div class="modern-location-header">
           
            
            <div class="location-info-card">
                <div class="info-card-content">
                    <div class="date-section">
                        <div class="date-item">
                            <span class="date-label">الميلادي</span>
                            <span class="date-value">{{ gregorianDate }}</span>
                        </div>
                        <div class="date-divider"></div>
                        <div class="date-item">
                            <span class="date-label">الهجري</span>
                            <span class="date-value">{{ hijriDate }}</span>
                        </div>
                    </div>
                    
                    <div class="location-section">
                        <div class="location-icon">📍</div>
                        <div class="location-details">
                            <p class="location-title">موقعك الحالي</p>
                            <p class="location-name">
                                <span v-if="location.city && location.country">
                                    {{ location.city }}, {{ location.country }}
                                </span>
                                <span v-else>جاري تحديد الموقع...</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- بطاقات أوقات الصلاة المحدثة -->
        <div class="modern-prayer-times-container">
            <div v-for="(time, name) in filteredPrayerTimes" :key="name"
                :class="['modern-prayer-time', { 'next-prayer-highlight': isNextPrayer(name) }]">
                <div class="prayer-card">
                    <div class="card-header">
                        <div class="prayer-icon">{{ getPrayerIcon(name) }}</div>
                        <div class="prayer-name">{{ getPrayerName(name) }}</div>
                    </div>
                    
                    <div class="card-body">
                        <div class="time-value">{{ time }}</div>
                        <div class="prayer-subtitle">{{ getPrayerSubtitle(name) }}</div>
                    </div>
                    
                    <div v-if="isNextPrayer(name)" class="next-prayer-badge">الصلاة القادمة</div>
                    
                    <div class="card-gradient"></div>
                </div>
            </div>
        </div>

        <!-- بطاقة الذكر المحدثة -->
        <div class="modern-zikr-card">
            <div class="zikr-header">
                <div class="zikr-icon">📿</div>
                <h3>ذكر اليوم</h3>
                <button @click="getRandomZikr" class="refresh-btn" title="تحديث الذكر">
                    <span>🔄</span>
                </button>
            </div>
            
            <div class="zikr-content">
                <p class="zikr-text">{{ currentZikr }}</p>
            </div>
            
            <div class="zikr-footer">
                <div class="refresh-hint">يتجدد تلقائيًا كل ساعة</div>
            </div>
        </div>

        <!-- رسالة الخطأ -->
        <p v-if="error" class="modern-error-message">
            <span class="error-icon">⚠️</span>
            {{ error }}
        </p>

        <!-- المكونات الأخرى -->
        <All class="all" />
        
        <!-- التذييل المحدث -->
        <div class="modern-footer">
            <div class="footer-content">
                <div class="footer-text">برمجة وتطوير زيد طرمان</div>
                <div class="footer-decoration">
                    <span class="decoration-dot"></span>
                    <span class="decoration-dot"></span>
                    <span class="decoration-dot"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import All from './all.vue';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/dist/sweetalert2.min.css'; 
import azkarData from "../assets/theker.json"; 

const azkar = azkarData.azkar;
const currentZikr = ref("");

const getRandomZikr = () => {
    const randomIndex = Math.floor(Math.random() * azkar.length);
    currentZikr.value = azkar[randomIndex].text;
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
            });
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

function getPrayerIcon(prayerKey) {
    const icons = {
        Fajr: '🌅',
        Dhuhr: '☀️',
        Asr: '⛅',
        Maghrib: '🌇',
        Isha: '🌙'
    };
    return icons[prayerKey];
}

function getPrayerSubtitle(prayerKey) {
    const subtitles = {
        Fajr: 'وقت البكور',
        Dhuhr: 'منتصف النهار',
        Asr: 'وقت الظل',
        Maghrib: 'غروب الشمس',
        Isha: 'منتصف الليل'
    };
    return subtitles[prayerKey];
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
        
        if (window.innerWidth < 768) {
            setTimeout(() => {
                const activePrayer = document.querySelector('.next-prayer-highlight');
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
.modern-prayer-times-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px 16px 100px;
    direction: rtl;
    min-height: 100vh;
    position: relative;
}

* {
    font-family: "the-year-of-the-camel", serif;
    font-weight: 500;
    line-height: 1.6;
}

/* تصميم العنوان المحدث */
.modern-location-header {
    margin-bottom: 40px;
    position: relative;
}

.header-decoration {
    text-align: center;
    margin-bottom: 20px;
}

.decoration-icon {
    font-size: 2.5rem;
    margin-bottom: 10px;
    display: inline-block;
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
}

.decoration-line {
    width: 100px;
    height: 3px;
    background: linear-gradient(to right, #D0A871, #8B7355, #D0A871);
    margin: 0 auto;
    border-radius: 3px;
}

.location-info-card {
    background: linear-gradient(135deg, #ffffff 0%, #f9f5f0 100%);
    border-radius: 20px;
    padding: 25px;
    box-shadow: 0 10px 30px rgba(139, 115, 85, 0.1);
    border: 1px solid rgba(208, 168, 113, 0.2);
    backdrop-filter: blur(10px);
}

.info-card-content {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.date-section {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(208, 168, 113, 0.2);
}

.date-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.date-label {
    font-size: 0.9rem;
    color: #8B7355;
    font-weight: 600;
}

.date-value {
    font-size: 1.1rem;
    color: #5a4a3a;
    font-weight: 700;
    padding: 8px 15px;
    background: rgba(208, 168, 113, 0.1);
    border-radius: 10px;
    min-width: 120px;
    text-align: center;
}

.date-divider {
    width: 1px;
    height: 40px;
    background: rgba(208, 168, 113, 0.3);
}

.location-section {
    display: flex;
    align-items: center;
    gap: 15px;
}

.location-icon {
    font-size: 1.8rem;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(208, 168, 113, 0.15);
    border-radius: 50%;
    flex-shrink: 0;
}

.location-details {
    flex-grow: 1;
}

.location-title {
    color: #D0A871;
    font-size: 0.9rem;
    margin-bottom: 5px;
    font-weight: 600;
}

.location-name {
    font-size: 1.2rem;
    color: #3a3228;
    font-weight: 700;
    line-height: 1.4;
}

/* بطاقات أوقات الصلاة المحدثة */
.modern-prayer-times-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.modern-prayer-time {
    perspective: 1000px;
}

.prayer-card {
    background: linear-gradient(135deg, #ffffff 0%, #f9f5f0 100%);
    border-radius: 18px;
    padding: 25px 20px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(139, 115, 85, 0.12);
    border: 1px solid rgba(208, 168, 113, 0.15);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    height: 100%;
    display: flex;
    flex-direction: column;
}

.prayer-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(139, 115, 85, 0.2);
}

.next-prayer-highlight .prayer-card {
    background: linear-gradient(135deg, #f0d087 0%, #e8c58f 100%);
    border-color: #D0A871;
    box-shadow: 0 10px 30px rgba(208, 168, 113, 0.3);
}

.card-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
}

.prayer-icon {
    font-size: 2.2rem;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(208, 168, 113, 0.1);
    border-radius: 50%;
    flex-shrink: 0;
}

.prayer-name {
    font-size: 1.3rem;
    color: #5a4a3a;
    font-weight: 700;
    flex-grow: 1;
}

.card-body {
    text-align: center;
    margin-bottom: 20px;
}

.time-value {
    font-size: 2.2rem;
    color: #3a3228;
    font-weight: 800;
    margin-bottom: 8px;
    direction: ltr;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.prayer-subtitle {
    font-size: 0.9rem;
    color: #8B7355;
    font-weight: 500;
}

.next-prayer-badge {
    position: absolute;
    top: 15px;
    left: 15px;
    background: #ffffff;
    color: #D0A871;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.card-gradient {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(to right, #D0A871, #8B7355, #D0A871);
    opacity: 0.5;
    transition: opacity 0.3s ease;
}

.prayer-card:hover .card-gradient {
    opacity: 1;
}

/* بطاقة الذكر المحدثة */
.modern-zikr-card {
    background: linear-gradient(135deg, #ffffff 0%, #f9f5f0 100%);
    border-radius: 20px;
    padding: 25px;
    margin: 40px 0;
    box-shadow: 0 10px 30px rgba(139, 115, 85, 0.1);
    border: 1px solid rgba(208, 168, 113, 0.2);
}

.zikr-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(208, 168, 113, 0.2);
}

.zikr-icon {
    font-size: 1.8rem;
}

.zikr-header h3 {
    font-size: 1.4rem;
    color: #5a4a3a;
    font-weight: 700;
    margin: 0;
    flex-grow: 1;
}

.refresh-btn {
    background: rgba(208, 168, 113, 0.15);
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.refresh-btn:hover {
    background: rgba(208, 168, 113, 0.25);
    transform: rotate(180deg);
}

.refresh-btn span {
    font-size: 1.2rem;
}

.zikr-content {
    margin-bottom: 20px;
}

.zikr-text {
    font-size: 1.4rem;
    color: #3a3228;
    font-weight: 700;
    text-align: center;
    line-height: 1.8;
    padding: 20px;
    background: rgba(208, 168, 113, 0.05);
    border-radius: 15px;
    margin: 0;
}

.zikr-footer {
    text-align: center;
}

.refresh-hint {
    font-size: 0.9rem;
    color: #8B7355;
    font-style: italic;
}

/* رسالة الخطأ المحدثة */
.modern-error-message {
    background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
    color: #d32f2f;
    text-align: center;
    padding: 20px;
    border-radius: 15px;
    margin: 30px 0;
    border-left: 5px solid #d32f2f;
    font-weight: 500;
    box-shadow: 0 5px 15px rgba(211, 47, 47, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.error-icon {
    font-size: 1.5rem;
}

/* التذييل المحدث */
.modern-footer {
    margin-top: 60px;
    padding: 25px 0;
    position: relative;
}

.footer-content {
    text-align: center;
    position: relative;
}

.footer-text {
    font-size: 1rem;
    color: #5a4a3a;
    font-weight: 600;
    margin-bottom: 15px;
    position: relative;
    display: inline-block;
    padding: 0 20px;
}

.footer-text::before,
.footer-text::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 50px;
    height: 2px;
    background: #D0A871;
    border-radius: 2px;
}

.footer-text::before {
    right: -60px;
}

.footer-text::after {
    left: -60px;
}

.footer-decoration {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 15px;
}

.decoration-dot {
    width: 8px;
    height: 8px;
    background: #D0A871;
    border-radius: 50%;
    opacity: 0.5;
}

/* تحسينات للهواتف */
@media (max-width: 768px) {
    .modern-prayer-times-wrapper {
        padding: 15px 12px 80px;
    }
    
    .location-info-card {
        padding: 20px;
    }
    
    .date-section {
        flex-direction: column;
        gap: 15px;
    }
    
    .date-divider {
        width: 80%;
        height: 1px;
    }
    
    .modern-prayer-times-container {
        grid-template-columns: 1fr;
        gap: 15px;
    }
    
    .prayer-card {
        padding: 20px 15px;
    }
    
    .time-value {
        font-size: 1.8rem;
    }
    
    .zikr-text {
        font-size: 1.2rem;
        padding: 15px;
    }
    
    .footer-text::before,
    .footer-text::after {
        width: 30px;
    }
    
    .footer-text::before {
        right: -40px;
    }
    
    .footer-text::after {
        left: -40px;
    }
}

@media (min-width: 768px) and (max-width: 1024px) {
    .modern-prayer-times-container {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .modern-prayer-times-container {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (min-width: 1200px) {
    .modern-prayer-times-container {
        grid-template-columns: repeat(5, 1fr);
    }
}
</style>