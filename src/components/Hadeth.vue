<template>
    <div class="prayer-times-wrapper">
      <!-- تصنيفات الأحاديث -->
      <div class="location-header">
        <div class="date-info">
          <p>تصنيفات الأحاديث</p>
        </div>
        <div class="location-info">
          <p class="location-title">عدد الأحاديث</p>
          <p class="location-name">{{ totalItems }}</p>
        </div>
      </div>
  
      <!-- فلترة التصنيفات -->
      <div class="category-filter">
        <button 
          v-for="category in categories" 
          :key="category.id"
          @click="loadHadithsByCategory(category.id)"
          :class="{ 'active': selectedCategory === category.id }"
        >
          {{ category.title }} ({{ category.hadeeths_count }})
        </button>
      </div>
  
      <!-- بطاقات الأحاديث -->
      <div class="prayer-times-container">
        <div class="col-md-6 col-lg-4" v-for="hadith in hadiths" :key="hadith.id">
          <div class="card mb-4 shadow-sm">
            <div class="card-body">
              <h5 class="card-title hadith-title">{{ hadith.title }}</h5>
              <p class="card-text hadith-text">{{ hadith.hadeeth }}</p>
              
              <div class="hadith-meta mt-3">
                <span class="badge bg-success me-2">{{ hadith.grade }}</span>
                <span class="text-muted">{{ hadith.attribution }}</span>
              </div>
              
              <button 
                @click="showHadithDetails(hadith.id)"
                class="btn btn-sm btn-outline-secondary mt-2"
              >
                التفاصيل الكاملة
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- حالة عدم وجود أحاديث -->
      <div v-if="!loading && hadiths.length === 0" class="alert alert-info text-center">
        لا توجد أحاديث متاحة في هذا التصنيف
      </div>
  
      <!-- Pagination -->
      <div class="pagination-footer">
        <div class="pagination-controls">
          <select v-model="perPage" @change="handlePerPageChange">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          
          <nav aria-label="Page navigation">
            <ul class="pagination">
              <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                <button class="page-link" @click="goToPage(1)" aria-label="First">
                  &laquo;
                </button>
              </li>
              <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                <button class="page-link" @click="goToPage(currentPage - 1)" aria-label="Previous">
                  &lsaquo;
                </button>
              </li>
  
              <li 
                class="page-item" 
                v-for="page in visiblePages" 
                :key="page" 
                :class="{ 'active': currentPage === page }"
              >
                <button class="page-link" @click="goToPage(page)">{{ page }}</button>
              </li>
  
              <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
                <button class="page-link" @click="goToPage(currentPage + 1)" aria-label="Next">
                  &rsaquo;
                </button>
              </li>
              <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
                <button class="page-link" @click="goToPage(totalPages)" aria-label="Last">
                  &raquo;
                </button>
              </li>
            </ul>
          </nav>
        </div>
        
        <div class="page-info">
          عرض {{ startItem }}-{{ endItem }} من إجمالي {{ totalItems }} حديث
        </div>
      </div>
  
      <!-- حالة التحميل -->
      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
        <p>جاري تحميل الأحاديث...</p>
      </div>
  
      <!-- حالة الخطأ -->
      <div v-if="error" class="error-message">
        ⚠️ {{ error }}
      </div>
  
      <!-- مودال تفاصيل الحديث -->
      <div class="modal fade" id="hadithModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ currentHadith.title }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p class="lead">{{ currentHadith.hadeeth }}</p>
              <div class="mb-3">
                <h6>التفسير:</h6>
                <p>{{ currentHadith.explanation }}</p>
              </div>
              <div class="mb-3" v-if="currentHadith.hints && currentHadith.hints.length">
                <h6>الفواىد:</h6>
                <ul>
                  <li v-for="(hint, index) in currentHadith.hints" :key="index">{{ hint }}</li>
                </ul>
              </div>
              <div class="hadith-meta">
                <span class="badge bg-success me-2">{{ currentHadith.grade }}</span>
                <span class="text-muted">{{ currentHadith.attribution }}</span>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
            </div>
          </div>
        </div>
      </div>
  
      <div class="footer">
        برمجة وتطوير زيد طرمان
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { Modal } from 'bootstrap';
  
  // البيانات التفاعلية
  const categories = ref([]);
  const hadiths = ref([]);
  const currentHadith = ref({});
  const selectedCategory = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const currentPage = ref(1);
  const perPage = ref(10);
  const totalItems = ref(0);
  const totalPages = ref(1);
  let hadithModal = null;
  
  // الحسابات المحسوبة
  const visiblePages = computed(() => {
    const pages = [];
    let startPage = Math.max(1, currentPage.value - 2);
    let endPage = Math.min(totalPages.value, startPage + 4);
  
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
  
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  
    return pages;
  });
  
  const startItem = computed(() => (currentPage.value - 1) * perPage.value + 1);
  const endItem = computed(() => Math.min(currentPage.value * perPage.value, totalItems.value));
  
  // الدوال الرئيسية
  const loadCategories = async () => {
    try {
      loading.value = true;
      const response = await fetch('https://hadeethenc.com/api/v1/categories/roots/?language=ar');
      categories.value = await response.json();
    } catch (err) {
      error.value = 'حدث خطأ أثناء تحميل التصنيفات';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };
  
  const loadHadiths = async () => {
    try {
      loading.value = true;
      error.value = null;
      
      let url = `https://hadeethenc.com/api/v1/hadeeths/list/?language=ar&page=${currentPage.value}&per_page=${perPage.value}`;
      
      if (selectedCategory.value) {
        url += `&category_id=${selectedCategory.value}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      hadiths.value = data.data || [];
      totalItems.value = data.meta?.total_items || 0;
      totalPages.value = data.meta?.last_page || 1;
      perPage.value = parseInt(data.meta?.per_page) || perPage.value;
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      error.value = 'حدث خطأ أثناء تحميل الأحاديث';
      console.error('Error loading hadiths:', err);
    } finally {
      loading.value = false;
    }
  };
  
  const loadHadithsByCategory = (categoryId) => {
    selectedCategory.value = categoryId;
    currentPage.value = 1;
    loadHadiths();
  };
  
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
      currentPage.value = page;
      loadHadiths();
    }
  };
  
  const handlePerPageChange = () => {
    currentPage.value = 1;
    loadHadiths();
  };
  
  const showHadithDetails = async (hadithId) => {
    try {
      loading.value = true;
      const response = await fetch(`https://hadeethenc.com/api/v1/hadeeths/one/?language=ar&id=${hadithId}`);
      currentHadith.value = await response.json();
      hadithModal.show();
    } catch (err) {
      error.value = 'حدث خطأ أثناء تحميل تفاصيل الحديث';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };
  
  // دورة الحياة
  onMounted(() => {
    hadithModal = new Modal(document.getElementById('hadithModal'));
    loadCategories();
    loadHadiths();
  });
  </script>
  
  <style scoped>
  .prayer-times-wrapper {
    max-width: 100%;
    margin: 0 auto;
    padding: 20px 16px 100px;
    direction: rtl;
    min-height: 100vh;
  }
  
  * {
    font-family: "the-year-of-the-camel", serif;
    font-weight: 500;
    line-height: 1.6;
  }
  
  .location-header {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 25px;
    background: linear-gradient(135deg, #f5e8d0, #f0e0c0);
    padding: 15px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(208, 168, 113, 0.15);
  }
  
  .date-info {
    text-align: left;
    font-size: 15px;
    color: #5a4a3a;
  }
  
  .date-info p:first-child {
    margin-bottom: 5px;
    font-weight: 600;
  }
  
  .location-info {
    text-align: center;
  }
  
  .location-title {
    color: #D0A871;
    font-size: 15px;
    margin-bottom: 5px;
    font-weight: 700 !important;
    position: relative;
    display: inline-block;
  }
  
  .location-title::after {
    content: '';
    position: absolute;
    bottom: -3px;
    right: 0;
    width: 100%;
    height: 2px;
    background: #D0A871;
    border-radius: 2px;
  }
  
  .location-name {
    font-weight: bold;
    font-size: 17px;
    color: #3a3228;
  }
  
  .category-filter {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
    justify-content: center;
  }
  
  .category-filter button {
    padding: 8px 15px;
    border: 1px solid #D0A871;
    background: white;
    border-radius: 20px;
    color: #5a4a3a;
    font-size: 14px;
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .category-filter button:hover {
    background: #f0e0c0;
  }
  
  .category-filter button.active {
    background: #D0A871;
    color: white;
    border-color: #D0A871;
  }
  
  .prayer-times-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .card {
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid #eee;
  }
  
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .card-body {
    padding: 20px;
  }
  
  .hadith-title {
    font-weight: bold;
    font-size: 18px;
    color: #3a3228;
    margin-bottom: 15px;
    position: relative;
    padding-bottom: 10px;
  }
  
  .hadith-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 50px;
    height: 2px;
    background: #D0A871;
  }
  
  .hadith-text {
    font-size: 16px;
    color: #5a4a3a;
    line-height: 1.8;
    margin-bottom: 15px;
  }
  
  .hadith-meta {
    display: flex;
    align-items: center;
    margin-top: 15px;
    font-size: 14px;
  }
  
  .badge {
    padding: 5px 10px;
    border-radius: 4px;
    font-weight: 600;
  }
  
  .text-muted {
    color: #888;
    margin-right: 10px;
  }
  
  .btn-outline-secondary {
    border-color: #D0A871;
    color: #D0A871;
    transition: all 0.3s ease;
  }
  
  .btn-outline-secondary:hover {
    background: #D0A871;
    color: white;
  }
  
  .pagination-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
    gap: 15px;
  }
  
  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  select {
    padding: 8px 15px;
    border-radius: 20px;
    border: 1px solid #D0A871;
    background: white;
    color: #5a4a3a;
  }
  
  .pagination {
    display: flex;
    gap: 5px;
  }
  
  .page-item {
    list-style: none;
  }
  
  .page-link {
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #eee;
    background: white;
    color: #5a4a3a;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .page-link:hover {
    background: #f0e0c0;
  }
  
  .page-item.active .page-link {
    background: #D0A871;
    color: white;
    border-color: #D0A871;
  }
  
  .page-item.disabled .page-link {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .page-info {
    font-size: 14px;
    color: #888;
  }
  
  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f0e0c0;
    border-top: 4px solid #D0A871;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error-message {
    color: #d32f2f;
    text-align: center;
    margin: 20px 0;
    padding: 15px;
    background-color: #ffebee;
    border-radius: 8px;
    border-left: 4px solid #d32f2f;
    font-size: 15px;
  }
  
  .footer {
    padding: 30px 0;
    text-align: center;
    color: #5a4a3a;
    font-size: 14px;
    position: relative;
    margin-top: 50px;
  }
  
  .footer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 2px;
    background: #D0A871;
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    .prayer-times-container {
      grid-template-columns: 1fr;
    }
    
    .pagination-controls {
      flex-direction: column;
    }
    
    .location-header {
      flex-direction: column;
      gap: 15px;
      text-align: center;
    }
    
    .date-info {
      text-align: center;
    }
  }
  </style>