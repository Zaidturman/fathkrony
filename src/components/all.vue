<template>
  <div class="container text-center mt-2">
    <h1 class="mb-4 mt-4 title font-weight-bold ">جميع العبادات</h1>

    <div class="row">
      <div v-for="(worship, index) in worships" :key="index" class="col-6 mb-3">
        <router-link :to="worship.route" class="text-decoration-none">
          <div class="card h-100 ">
            <div class="card-body d-flex flex-column align-items-center">
            
              <h5 class="card-title text-dark">{{ worship.title }}</h5>
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
    title: "المصحف",
    icon: '../assets/images/koran.png',
    route: '/quran',
  },
  {
    title: "الأذكار",
    icon: '../assets/images/bismillah.png',
    route: '/azkar',
  },

  {
    title: "جميع الأدعية",
    icon: '../assets/images/hands.png',
    route: '/adia',

  },
  {
    title: "فيديوهات دينية",
    icon: '../assets/images/beads.png',
    route: '/watch',
  },
  {
    title: "كتب دينية",
    icon: '../assets/images/beads.png',
    route: '/books',
  },
  {
    title: "الأحاديث النبوية",
    icon: '../assets/images/beads.png',
    route: '/hadeth',
  },
];
</script>

<style scoped>
* {
  font-family: "Cairo";
}
.container{
  margin-bottom: 20px;

}

.card {
  border-radius: 10px;
  transition: transform 0.3s ease;
  background-color: #ffffff;
  border: none
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.card:hover {
  transform: scale(1.05);
  background-color: #f0f8ff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.icon {
  width: 60px;
  height: 60px;
  object-fit: contain;
  border-radius: 50%;
  background-color: #e8e8e8;
  padding: 10px;
}

.card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h1 {
  font-size: 30px;
  color: #D0A871;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  font-family: 'Cairo', sans-serif;
}

</style>
