<template>
    <div class="videos-container">
        <h2>الفيديوهات الدينية</h2>
        <div v-if="watchStore.loading">جاري التحميل...</div>
        <div v-else-if="watchStore.error">حدث خطأ أثناء جلب الفيديوهات.</div>
        <div v-else>
            <div v-for="video in watchStore.videos" :key="video.id" class="video-card">
                <h3>{{ video.title }}</h3>
                <video controls :src="video.url" width="100%" height="315">
                    متصفحك لا يدعم مشغل الفيديو.
                </video>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useWatchStore } from '@/stores/watch';

const watchStore = useWatchStore();

onMounted(() => {
  watchStore.loadVideos();
});
</script>

<style>
.videos-container {
    max-width: 800px;
    margin: auto;
    text-align: center;
    padding: 20px;
}

.video-card {
    margin: 20px 0;
    padding: 10px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.video-card h3 {
    font-size: 18px;
    margin-bottom: 10px;
}

video {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
