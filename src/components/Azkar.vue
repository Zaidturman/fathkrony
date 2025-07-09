<template>
    <div id="app" class="min-h-screen  ">
      <h1 class="text-2xl font-bold text-center  ">قائمة الأذكار</h1>
  
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div 
  v-for="adhkar in adhkarList"
  :key="adhkar.id"
  @click="goToAdhkarDetails(adhkar.id)"
  class="card"
>
  <div class="flex flex-col items-center">
    <div class="icon mb-2">
      <!-- يمكنك استبدال هذا بآيقونات مختلفة حسب الفئة -->
      <span v-if="adhkar.category.includes('الصباح')">🌅</span>
      <span v-else-if="adhkar.category.includes('المساء')">🌙</span>
      <span v-else-if="adhkar.category.includes('النوم')">🛌</span>
      <span v-else>📿</span>
    </div>
    <h2 class="cat">{{ adhkar.category }}</h2>
  </div>
</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import adhkarData from '../assets/adhkar.json'; 
  
  const adhkarList = ref(adhkarData);
  const router = useRouter();
  
  const goToAdhkarDetails = (adhkarId) => {
    router.push({ name: 'AdhkarDetails', params: { id: adhkarId } });
  };
  </script>
  
  <style scoped> 
  
  h1 {
  font-size: 2.2rem;
  color: #5a3921;
  margin: 20px;
  font-weight: 700;



}


.card {
  background: #fff;
  border-radius: 15px;
  padding: 1.5rem;
  margin: 0.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(208, 168, 113, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 5px;
  height: 100%;
  background: #D0A871;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(208, 168, 113, 0.2);
  border-color: #D0A871;
}

.card:hover::before {
  width: 8px;
}

.cat {
  font-size: 1.2rem !important;
  color: #3a3228;
  font-weight: 600;
  text-align: center;
  position: relative;
  padding-bottom: 8px;
  margin: 0;
  transition: all 0.3s ease;
}

.card:hover .cat {
  color: #D0A871;
}

.cat::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background: #D0A871;
  opacity: 0;
  transition: all 0.3s ease;
}

.card:hover .cat::after {
  opacity: 1;
}
@media (max-width: 768px) {
  h1 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
  
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .card {
    padding: 1rem;
    min-height: 80px;
  }
  
  .cat {
    font-size: 1rem !important;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.5rem;
  }
  
  .grid {
    grid-template-columns: 1fr;
  }
  
  #app {
    padding: 1rem;
  }
}
/* تأثيرات التحميل (إذا كنت تستخدمها) */
.loading {
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #5a3921;
}

/* تأثيرات عند النقر */
.card:active {
  transform: scale(0.98);
}


  </style>