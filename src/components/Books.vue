<template>
    <div class="books-container">
        <h2>الكتب الدينية</h2>
        <div v-if="loading">جاري تحميل الكتب...</div>
        <div v-else-if="error">حدث خطأ أثناء جلب الكتب.</div>
        <div v-else>
            <div v-for="book in books" :key="book.id" class="book-card">
                <h3>{{ book.title }}</h3>
                <p>{{ book.description }}</p>
                <a :href="book.attachments[0].url" download class="download-button">عرض الكتاب</a>
            </div>
        </div>

        <div v-if="selectedBook" class="book-viewer">
            <button @click="selectedBook = null" class="close-button">إغلاق</button>
            <embed :src="selectedBook" type="application/pdf" width="80%" height="80%" class="pdf-viewer"/>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            books: [],
            loading: true,
            error: false,
            selectedBook: null
        };
    },
    created() {
        this.fetchBooks();
    },
    methods: {
        async fetchBooks() {
            try {
                const response = await fetch("https://api3.islamhouse.com/v3/paV29H2gm56kvLPy/main/books/ar/ar/1/25/json");
                const data = await response.json();
                this.books = data.data;
            } catch (error) {
                this.error = true;
                console.error("Error fetching books:", error);
            } finally {
                this.loading = false;
            }
        },
        openBook(url) {
            this.selectedBook = url;
        }
    }
};
</script>

<style>
.books-container {
    max-width: 800px;
    margin: auto;
    text-align: center;
    padding: 20px;
}

.book-card {
    margin: 20px 0;
    padding: 10px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.book-card h3 {
    font-size: 18px;
    margin-bottom: 10px;
}

.book-card p {
    font-size: 14px;
    color: #555;
}

.view-button, .download-button {
    display: inline-block;
    margin-top: 10px;
    padding: 8px 12px;
    background: #007bff;
    color: #fff;
    text-decoration: none;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
    margin-right: 5px;
}

.view-button:hover, .download-button:hover {
    background: #0056b3;
}

.book-viewer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.pdf-viewer {
    border-radius: 8px;
    background: #fff;
}

.close-button {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 10px 15px;
    background: red;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.close-button:hover {
    background: darkred;
}
</style>
