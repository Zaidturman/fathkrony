<template>
    <div class="container mt-5">
        <h1 class="text-center mb-4">أحاديث أبي داود</h1>
        <div class="row">
            <div class="col-md-4" v-for="hadith in hadethStore.hadiths" :key="hadith.id">
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title hadith-number">الحديث رقم: {{ hadith.number }}</h5>
                        <p class="card-text hadith-text">{{ hadith.arab }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="hadethStore.loading" class="text-center">
            <span class="spinner-border spinner-border-sm"></span> جاري التحميل...
        </div>
        <div v-if="hadethStore.error" class="alert alert-danger">
            خطأ في تحميل الأحاديث.
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useHadethStore } from '@/stores/hadeth';

const hadethStore = useHadethStore();

onMounted(() => {
  hadethStore.loadHadiths();
});
</script>

<style scoped>
.hadith-text {
    font-size: 1.1rem;
    text-align: justify;
}

.hadith-number {
    font-weight: bold;
    color: #007bff;
}

.hadith-author {
    font-style: italic;
    color: #6c757d;
}
</style>
