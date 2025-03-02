<template>
    <div class="videos-container">
        <h2>الفيديوهات الدينية</h2>
        <div v-if="loading">جاري تحميل الفيديوهات...</div>
        <div v-else-if="error">حدث خطأ أثناء جلب الفيديوهات.</div>
        <div v-else>
            <div v-for="video in videos" :key="video.id" class="video-card">
                <h3>{{ video.title }}</h3>
                <video controls :src="video.attachments[0]?.url" width="100%" height="315">
                    متصفحك لا يدعم مشغل الفيديو.
                </video>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            videos: [],
            loading: true,
            error: false
        };
    },
    created() {
        this.fetchVideos();
    },
    methods: {
        async fetchVideos() {
            try {
                const response = await fetch("https://api3.islamhouse.com/v3/paV29H2gm56kvLPy/main/videos/ar/ar/1/25/json");
                const data = await response.json();
                this.videos = data.data;
            } catch (error) {
                this.error = true;
                console.error("Error fetching videos:", error);
            } finally {
                this.loading = false;
            }
        }
    }
};
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
