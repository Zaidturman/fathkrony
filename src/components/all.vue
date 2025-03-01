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
          <div class="card h-100 shadow-sm">
            <div class="card-body">
                <div>
                    <img :src="worship.icon" class="icon"  alt="">
                </div>
              <h5 class="card-title">{{ worship.title }}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import 'bootstrap/dist/css/bootstrap.min.css';

  // تعريف بيانات العبادات
  const worships = [
    {
      title: "اذكار الصلاة",
      icon: "../assets/images/beads.png",
    },
    {
      title: "اذكار الصباح",
      icon: "../assest/images/beads.png",

    },
    {
      title: "اذكار المساء",
      icon: "../assest/images/beads.png",

    },
    {
      title: " التسبيح",
      icon: "../assest/images/beads.png",

    },
    {
      title: "جميع الادعية",
      icon: "../assest/images/beads.png",

    },
    {
      title: "اذكار متنوعة",
      icon: "../assest/images/beads.png",

    },
    {
      title: " المصحف",
      icon: "../assest/images/beads.png",

    },
    
  ];
  </script>
  
  <style scoped>
  /* يمكنك إضافة أنماط مخصصة هنا إذا كنت بحاجة */
  .card {
    transition: transform 0.3s ease;
    font-size: 12px;
  }
  .card:hover {
    transform: scale(1.05);
    background: #F5CD87;
  }
  .icon {
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}
  </style>