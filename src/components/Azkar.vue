<template>
    <div id="app" class="min-h-screen  ">
      <h1 class="text-2xl font-bold text-center  ">📖 قائمة الأذكار</h1>
  
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="adhkar in adhkarList"
          :key="adhkar.id"
          @click="goToAdhkarDetails(adhkar.id)"
          class="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow  card"
        >
          <h2 class="cat font-semibold text-center">{{ adhkar.category }}</h2>
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
  @import url('https://fonts.googleapis.com/css2?family=Amiri+Quran&display=swap');
  
  #app {
    font-family: 'Amiri Quran', serif;
  }

.card{
    margin: 10px;
    
}
.cat{
    font-size: 16px !important;

}
  </style>