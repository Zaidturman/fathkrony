<template>
  <div class="container text-center mt-2 worships-container">
    <h1 class="mb-4 mt-4 title">جميع العبادات</h1>

    <div class="row justify-content-center">
      <div v-for="(worship, index) in worships" :key="index" class="col-6 col-md-4 col-lg-3 mb-4">
        <router-link :to="worship.route" class="text-decoration-none worship-link">
          <div class="worship-card">
            <div class="worship-icon">{{ worship.icon }}</div>
            <h5 class="worship-title">{{ worship.title }}</h5>
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
    icon: '📖', // أيقونة كتاب
    route: '/quran',
  },
  {
    title: "الأذكار",
    icon: '🕌', // أيقونة مسجد
    route: '/azkar',
  },
  {
    title: "جميع الأدعية",
    icon: '🤲', // أيقونة يدين متضرعتين
    route: '/adia',
  },
  {
    title: "فيديوهات دينية",
    icon: '🎥', // أيقونة كاميرا
    route: '/watch',
  },
  {
    title: "كتب دينية",
    icon: '📚', // أيقونة كتب
    route: '/books',
  },
  {
    title: "الأحاديث النبوية",
    icon: '💬', // أيقونة حديث
    route: '/hadeth',
  },
];
</script>

<style scoped>
* {
  font-family: "the-year-of-the-camel", serif;
}

.worships-container {
  padding: 0 15px;
}

.title {
  font-size: 2rem;
  color: #D0A871;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem !important;
  position: relative;
  display: inline-block;
  font-weight: 700 !important;
}

.title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: #D0A871;
  border-radius: 3px;
}

.worship-link {
  display: block;
  height: 100%;
}

.worship-card {
  background: #fff;
  border-radius: 15px;
  padding: 20px 10px;
  height: 100%;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(208, 168, 113, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.worship-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(208, 168, 113, 0.2);
  border-color: #D0A871;
}

.worship-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
  transition: all 0.3s ease;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(208, 168, 113, 0.1);
  border-radius: 50%;
  color: #D0A871;
}

.worship-card:hover .worship-icon {
  transform: scale(1.1);
  background: rgba(208, 168, 113, 0.2);
}

.worship-title {
  font-size: 1.1rem;
  font-weight: 700 !important;
  color: #333;
  margin: 0;
  transition: all 0.3s ease;
}

.worship-card:hover .worship-title {
  color: #D0A871;
}

/* تحسينات للهواتف الصغيرة */
@media (max-width: 576px) {
  .title {
    font-size: 1.5rem;
  }
  
  .worship-icon {
    font-size: 2rem;
    width: 60px;
    height: 60px;
  }
  
  .worship-title {
    font-size: 0.9rem;
  }
}

/* تحسينات للأجهزة اللوحية */
@media (min-width: 768px) {
  .worship-card {
    padding: 25px 15px;
  }
  
  .worship-icon {
    font-size: 3rem;
    width: 80px;
    height: 80px;
  }
  
  .worship-title {
    font-size: 1.2rem;
  }
}
</style>