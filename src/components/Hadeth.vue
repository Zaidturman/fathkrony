<template>
    <div class="container mt-5">
        <h1 class="text-center mb-4">أحاديث أبي داود</h1>
        <div class="row">
            <div class="col-md-4" v-for="hadith in hadiths" :key="hadith.id">
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title hadith-number">الحديث رقم: {{ hadith.number }}</h5>
                        <p class="card-text hadith-text">{{ hadith.arab }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="loading" class="text-center">
            <span class="spinner-border spinner-border-sm"></span> جاري التحميل...
        </div>
        <div v-if="error" class="alert alert-danger">
            خطأ في تحميل الأحاديث.
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            hadiths: [], 
            loading: true, 
            
            error: false, 
            
        };
    },
    mounted() {
        this.fetchHadiths();
    },
    methods: {
        async fetchHadiths() {
            try {
                const response = await fetch('https://hadis-api-id.vercel.app/hadith/abu-dawud?page=2&limit=300');
                const data = await response.json();
                console.log(data.items);  
            
                this.hadiths = data.items;
                this.loading = false;
            } catch (error) {
                this.error = true;
                this.loading = false;
            }
        }

    },
};
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
