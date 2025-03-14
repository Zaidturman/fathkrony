<template>
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 class="text-2xl font-bold text-center mb-6">📖 {{ adhkar.category }}</h1>
  
        <div class="grid grid-cols-1 gap-4">
          <div
            v-for="item in adhkar.array"
            :key="item.id"
            class="bg-gray-50 rounded-lg shadow-md p-4"
          >
            <p class="text-gray-700 mb-4">{{ item.text }}</p>
            <audio controls class="w-full">
              <source :src="item.audio" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
  
        <button
          @click="goBack"
          class="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          رجوع
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import adhkarData from '../assets/adhkar.json'; 

  const adhkar = ref({});
  const router = useRouter();
  const route = useRoute();
  
  const loadAdhkarDetails = () => {
    const adhkarId = parseInt(route.params.id);
    adhkar.value = adhkarData.find((a) => a.id === adhkarId);
  };
  
  const goBack = () => {
    router.push({ name: 'Home' });
  };
  
  onMounted(() => {
    loadAdhkarDetails();
  });
  </script>
  
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Amiri+Quran&display=swap');
  
  body {
    font-family: 'Amiri Quran', serif;
  }
  </style>