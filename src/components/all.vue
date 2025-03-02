<template>
    <div class="container text-center mt-5">
      <!-- العنوان -->
      <h1 class="mb-4">جميع العبادات</h1>
  
      <!-- الجدول (Grid) -->
      <div class="row">
        <div
          v-for="(worship, index) in worships"
          :key="index"
          class="col-4 mb-4"
        >
        <router-link
          :to="worship.route"
          class="text-decoration-none"
        >
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <div>
                <img :src="worship.icon" class="icon" alt="">
              </div>
              <h5 class="card-title">{{ worship.title }}</h5>
            </div>
          </div>
        </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import 'bootstrap/dist/css/bootstrap.min.css';

  // تعريف بيانات العبادات
  const worships = [
    
    {
      title: " التسبيح",
      icon: '../assets/images/beads.png',

    },
    {
      title: "جميع الادعية",
      icon: '../assets/images/beads.png',

    },
    {
      title: "الاذكار ",
      icon: '../assets/images/beads.png',
      route: '/azkar'

    },
    {
      title: " المصحف",
      icon: '../assets/images/beads.png',
      route: '/quran'

    },
    
  ];
  </script>
  
  <style scoped>
  /* يمكنك إضافة أنماط مخصصة هنا إذا كنت بحاجة */
  .card {
    transition: transform 0.3s ease;
}
.card-title{
      font-size: 12px;

  }
  .card:hover {
    transform: scale(1.05);
    background: #F5CD87;
  }
  .icon {
  width: 50px;
}
  </style>