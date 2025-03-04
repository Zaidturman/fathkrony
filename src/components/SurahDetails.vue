<template>
    <div class="surah-view">
        <div class="container ayat" style="background:rgb(255, 250, 243); background-size: cover;">
            <div class="close-popup" @click="goBack">
                <i class="fas fa-times"></i>
            </div>

            <div v-if="surahInfo" class="ayat-content">
                <nav class="ayat-name">
                    <h1 class="surahName">{{ surahInfo.name }}</h1>
                    <h1 class="surahNum">عدد الآيات: <span class="surah-num">( {{ surahInfo.numberOfAyahs }} )</span>
                    </h1>
                    <div class="audio">
                        <audio class="ayah-audio" controls>
                            <source
                                :src="`https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/${surahInfo.number}.mp3`"
                                type="audio/mp3">
                        </audio>
                    </div>
                </nav>
                <br>

                <section class="all container">
                    <div id="ayats">
                        <span v-for="(aya, index) in ayat" :key="index">
                            <span class="aya-text" style="font-family: quran;">{{ aya.text }}</span>
                            <span class="label" style="font-size:24px;color:#247429;font-family: quran;">﴿{{
                                aya.numberInSurah }}﴾</span>
                        </span>
                    </div>
                </section>
                <br>
            </div>

            <div v-else class="loading">
                Loading...
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'SurahView',
    data() {
        return {
            surahInfo: null,
            ayat: []
        }
    },
    created() {
        this.fetchSurah()
    },
    methods: {
        async fetchSurah() {
            try {
                const id = this.$route.params.id; // الحصول على الـ ID من المسار
                const response = await fetch(`https://api.alquran.cloud/v1/surah/${id}`);
                const data = await response.json();
                this.surahInfo = data.data;
                this.ayat = data.data.ayahs;
            } catch (error) {
                console.error('Error fetching surah:', error);
            }
        },
        goBack() {
            this.$router.push({ name: 'quran' });
        }
    }
}
</script>
<style scoped>
.aya-text{
    font-family: 'Amiri Quran', serif !important;
}
.surah-view {
    margin: 0 auto;
    padding: 0;
    width: 410px;

}

.container {
    margin: 0;
    padding: 10px;
    width: 100%;
}
</style>