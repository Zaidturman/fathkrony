<template>
    <div class="books-page">
        <div class="books-header">
            <h2 class="page-title">الكتب الدينية</h2>
            <div class="header-decoration"></div>
        </div>

        <div class="books-content">
            <div v-if="booksStore.loading" class="loading-state">
                <div class="spinner"></div>
                <p>جاري تحميل الكتب...</p>
            </div>

            <div v-else-if="booksStore.error" class="error-state">
                <i class="icon-error"></i>
                <p>حدث خطأ أثناء جلب الكتب</p>
                <button @click="booksStore.loadBooks()" class="retry-button">إعادة المحاولة</button>
            </div>

            <div v-else class="books-grid">
                <div v-for="book in booksStore.books" :key="book.id" class="book-card">
                  
                    <div class="book-info">
                        <h3 class="book-title">{{ book.title }}</h3>
                        <p class="book-author">{{ book.author }}</p>
                        <p class="book-description">{{ book.description }}</p>
                        <div class="book-actions">
                            <button @click="openBook(book.attachments[0].url)" class="view-button">
                                <i class="icon-eye"></i> معاينة
                            </button>
                            <a :href="book.attachments[0].url" download class="download-button">
                                <i class="icon-download"></i> تحميل
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="selectedBook" class="book-modal">
            <div class="modal-content">
                <button @click="selectedBook = null" class="close-button">
                    <i class="icon-close"></i>
                </button>
                <embed :src="selectedBook" type="application/pdf" class="pdf-viewer" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import { useBooksStore } from '@/stores/books';

const booksStore = useBooksStore();
const selectedBook = ref(null);

const openBook = (url) => {
    selectedBook.value = url;
    // إخفاء scrollbar عند فتح الكتاب
    document.body.style.overflow = 'hidden';
};

const closeModal = () => {
    selectedBook.value = null;
    // إعادة scrollbar عند الإغلاق
    document.body.style.overflow = 'auto';
};

onMounted(() => {
    booksStore.loadBooks();

    // إضافة تأثير scroll لطيف عند التحميل
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
</script>

<style>
.books-page {
    font-family: 'Tajawal', 'the-year-of-the-camel', sans-serif;
    min-height: 100vh;
    padding: 2rem;
}

.books-header {
    text-align: center;
    margin-bottom: 3rem;
    position: relative;
}

.page-title {
    font-size: 2.5rem;
    color: #5a3921;
    margin-bottom: 1rem;
    font-weight: 700;
}

.header-decoration {
    width: 100px;
    height: 4px;
    background: linear-gradient(to right, #D0A871, #b45309);
    margin: 0 auto;
    border-radius: 2px;
}

/* بطاقات الكتب */
.books-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.book-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
}

.book-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
}

.book-cover {
    height: 200px;
    overflow: hidden;
}

.book-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.book-card:hover .book-cover img {
    transform: scale(1.05);
}

.book-info {
    padding: 1.5rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.book-title {
    font-size: 1.3rem;
    color: #3a3228;
    margin-bottom: 0.5rem;
    font-weight: 700;
}

.book-author {
    color: #b45309;
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

.book-description {
    color: #5a4a3a;
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    flex-grow: 1;
}

.book-actions {
    display: flex;
    gap: 1rem;
    margin-top: auto;
}

.view-button,
.download-button {
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.view-button {
    background: #D0A871;
    color: white;
}

.view-button:hover {
    background: #b45309;
}

.download-button {
    background: #3a3228;
    color: white;
    text-decoration: none;
}

.download-button:hover {
    background: #5a4a3a;
}

/* نافذة المعاينة */
.book-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
}

.modal-content {
    position: relative;
    width: 90%;
    height: 90%;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.pdf-viewer {
    width: 100%;
    height: 100%;
    border: none;
}

.close-button {
    position: absolute;
    top: 15px;
    left: 15px;
    width: 40px;
    height: 40px;
    background: #d32f2f;
    color: white;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1001;
    transition: all 0.3s ease;
}

.close-button:hover {
    background: #b71c1c;
    transform: rotate(90deg);
}

/* حالات التحميل والخطأ */
.loading-state,
.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 1rem;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #D0A871;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.error-state {
    color: #d32f2f;
}

.retry-button {
    padding: 0.75rem 1.5rem;
    background: #D0A871;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s;
}

.retry-button:hover {
    background: #b45309;
}

/* التكيف مع الشاشات الصغيرة */
@media (max-width: 768px) {
    .books-grid {
        grid-template-columns: 1fr;
    }

    .page-title {
        font-size: 2rem;
    }

    .book-actions {
        flex-direction: column;
    }

    .modal-content {
        width: 95%;
        height: 95%;
    }
}
</style>
