<template>
    <div class="container text-center mt-5">
        <!-- العنوان -->
        <h1 class="mb-4 text-primary font-weight-bold">المسبحة الإلكترونية</h1>

        <!-- عرض الذكر الحالي -->
        <div class="card p-4 shadow-lg mb-4">
            <h3 class="text-dark">{{ currentDhikr }}</h3>
        </div>

        <!-- عرض العد -->
        <div class="counter">
            <h2 class="text-dark mb-3"> {{ count }}</h2>
        </div>

        <!-- زر الزيادة -->
        <button @click="increaseCount" class="btn btn-primary btn-lg addbtn">
            أضف تسبيحة
        </button>

        <!-- عرض الرسالة بعد إتمام العدد -->
        <div v-if="count === 33" class="mt-4 alert alert-success">
            تم اكتمال العدد. الذكر التالي سيظهر بعد ضغط الزر مجددًا.
        </div>
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
    font-family: 'Cairo', sans-serif;
}

h1 {
    font-size: 30px;
    color: #2b6cb0;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* تنسيق الذكر */
.card {
    background-color: #f0f8ff;
    border-radius: 10px;
}

.counter h2 {
    font-size: 24px;
    color: #333;
}

/* تنسيق الزر */
button {
    padding: 10px 20px;
    font-size: 20px;
    border-radius: 5px;
    background-color: #6c757d;
    color: white;
    border: none;
}

button:hover {
    background-color: #5a6268;
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
