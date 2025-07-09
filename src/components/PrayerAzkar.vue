<template>
  <div class="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 p-4 md:p-6 upper">
    <div class="max-w-3xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
      <!-- Header Section -->
      <div class="bg-amber-800 text-white p-6 text-center">
        <h1 class="text-3xl font-bold mb-2">{{ adhkar.category }}</h1>
        <div class="w-20 h-1 bg-amber-500 mx-auto"></div>
      </div>

      <!-- Content Section -->
      <div class="p-4 md:p-6">
        <div class="space-y-5">
          <div 
            v-for="(item, index) in adhkar.array" 
            :key="index"
            class="bg-white border border-amber-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-5"
          >
            <p class="text-amber-900 text-lg md:text-xl leading-relaxed mb-4 font-quran">
              {{ item.text }}
            </p>
            
           
          </div>
        </div>

 
      </div>
    </div>
  </div>

</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import adhkarData from '../assets/adhkar.json'; 

const adhkar = ref({ array: [] }); // Initialize with empty array
const router = useRouter();
const route = useRoute();

const loadAdhkarDetails = () => {
  const adhkarId = parseInt(route.params.id);
  const foundAdhkar = adhkarData.find((a) => a.id === adhkarId);
  adhkar.value = foundAdhkar || { category: 'غير موجود', array: [] };
};

const goBack = () => {
  router.push({ name: 'Home' });
};

onMounted(() => {
  loadAdhkarDetails();
  
  // Smooth scroll to top when component mounts
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
const autoPlayNext = ref(false);

const playNext = (currentIndex) => {
  if (autoPlayNext.value && currentIndex < adhkar.value.array.length - 1) {
    const nextAudio = document.querySelector(`audio[index="${currentIndex + 1}"]`);
    nextAudio.play();
  }
};
const countDhikr = (item) => {
  if (!item.count) item.count = 0;
  item.count++;
};
</script>
  
  <style scoped>
body {
  font-family: 'the-year-of-the-camel', serif;
}

.font-quran {
  font-family: 'Amiri Quran', serif;
  font-size: 1.4rem;
  line-height: 2.2;
}

.audio-player {
  border-radius: 12px;
  height: 40px;
}

.audio-player::-webkit-media-controls-panel {
  background-color: #fef3c7;
}

.audio-player::-webkit-media-controls-play-button {
  background-color: #b45309;
  border-radius: 50%;
}

.audio-player::-webkit-media-controls-current-time-display,
.audio-player::-webkit-media-controls-time-remaining-display {
  color: #78350f;
}

/* Responsive Adjustments */
@media (max-width: 640px) {
  .font-quran {
    font-size: 1.2rem;
    line-height: 2;
  }
  upper {
  padding: 0 !important;
  margin: 0 !important;
  border: 0 !important;
}

}
  </style>