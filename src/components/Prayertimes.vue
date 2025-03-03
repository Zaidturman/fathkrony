<template>
    <div class="container text-center mt-5">
        <!-- العنوان -->
        <h1 class="mb-4  font-weight-bold">المسبحة الإلكترونية</h1>

        <!-- عرض الذكر الحالي -->
        <div class="card p-4  mb-4">
            <h3 class="">{{ currentDhikr }}</h3>
        </div>

        <!-- عرض العد -->
        <div class="counter">
            <h2 class="text-dark mb-3"> {{ count }}</h2>
        </div>

        <!-- زر الزيادة -->
        <button @click="increaseCount" class="  btn-lg addbtn">
            أضف تسبيحة
        </button>

        
    </div>
</template>

<script setup>
import { ref } from 'vue';

// قائمة الأذكار المتغيرة
const dhikrs = [
    'سبحان الله',
    'الحمد لله',
    'الله أكبر',
    'لا إله إلا الله'
];

// حالة العد والذكر الحالي
const count = ref(0);
const currentDhikr = ref(dhikrs[0]);

// زيادة العدد وعند الوصول لـ 33 يتم تغيير الذكر
const increaseCount = () => {
    count.value++;
    if (count.value >= 33) {
        count.value = 0;  // إعادة العد إلى 0 بعد 33 مرة
        const randomIndex = Math.floor(Math.random() * dhikrs.length);  // تغيير الذكر عشوائيًا من القائمة
        currentDhikr.value = dhikrs[randomIndex];
    }
};
</script>

<style scoped>
/* تنسيق الصفحة */
.container {
height: 80vh;    
}

h1 {
    font-size: 30px;
    color: #242424;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* تنسيق الذكر */
.card {
    background-color: #D0A871;
    border-radius: 10px;
    color: white;
}

.counter h2 {
    font-size: 24px;
    color: #333;
    
}

/* تنسيق الزر */
button {
    padding: 10px 20px;
    font-size: 20px;
    background-color: #D0A871;
    color: white;
    border: none;
}

button:hover {
    background-color: #FBD182;
    color: #000;
}

/* تنسيق الرسالة بعد الوصول للعدد */
.alert {
    font-size: 18px;
    font-weight: bold;
}

.addbtn {
    position: absolute;
    bottom: 10%;
    width: 100%;
    margin: 10px auto;
    right: 0;
}

@media (max-width: 768px) {
    .counter h2 {
        font-size: 20px;
    }

    button {
        font-size: 18px;
    }
}
</style>
