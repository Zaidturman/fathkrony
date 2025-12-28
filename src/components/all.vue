<template>
  <div class="modern-worships-container">
    <!-- شريط العنوان الجديد بدون خلفية زخرفية -->
    <div class="header-section">
      <h1 class="main-title">
        <span class="title-text">جميع العبادات</span>
        <span class="title-icon">🕌</span>
      </h1>
      <p class="subtitle">اختر عبادة للبدأ في رحلتك الروحانية</p>
    </div>

    <!-- بطاقات العبادات -->
    <div class="worships-grid">
      <div v-for="(worship, index) in worships" :key="index" class="worship-item">
        <router-link :to="worship.route" class="worship-card-link">
          <div class="modern-worship-card" :style="getCardGradient(index)">
            <div class="card-content">
              <!-- أيقونة بطاقة مع خلفية -->
              <div class="icon-container">
                <div class="icon-background"></div>
                <div class="icon-wrapper">
                  <span class="worship-icon">{{ worship.icon }}</span>
                </div>
                <div class="icon-shine"></div>
              </div>
              
              <!-- عنوان البطاقة -->
              <h3 class="worship-title">{{ worship.title }}</h3>
              
              <!-- تأثير عند التمرير -->
              <div class="card-hover-effect"></div>
            </div>
            
            <!-- شريط أسفل البطاقة -->
            <div class="card-footer">
              <span class="footer-text">اضغط للدخول</span>
              <span class="footer-arrow">←</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    
    <!-- عنصر زخرفي سفلي -->
    <div class="bottom-decoration">
      <div class="wave wave-1"></div>
      <div class="wave wave-2"></div>
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

// دالة لإنشاء تدرجات ألوان مختلفة لكل بطاقة
const getCardGradient = (index) => {
  const gradients = [
    'linear-gradient(135deg, #D0A871 0%, #B8945F 100%)',
    'linear-gradient(135deg, #7C9A92 0%, #5E8077 100%)',
    'linear-gradient(135deg, #A77E58 0%, #8A6846 100%)',
    'linear-gradient(135deg, #8B7E74 0%, #6D6158 100%)',
    'linear-gradient(135deg, #B8A284 0%, #9A876B 100%)',
    'linear-gradient(135deg, #9C8B70 0%, #7E7058 100%)',
  ];
  
  return { background: gradients[index % gradients.length] };
};
</script>

<style scoped>
* {
  font-family: "the-year-of-the-camel", serif;
  box-sizing: border-box;
}

.modern-worships-container {
  min-height: 100vh;
  padding: 20px 15px 60px;
  position: relative;
  overflow: hidden;
}

/* شريط العنوان - نظيف بدون خلفية */
.header-section {
  text-align: center;
  margin: 40px 0 60px;
  position: relative;
  z-index: 2;
}

.main-title {
  font-size: 2.8rem;
  color: #5a4a3a;
  margin-bottom: 20px;
  position: relative;
  display: inline-block;
  font-weight: 800;
  padding: 0 20px;
}

.title-text {
  background: linear-gradient(to right, #8B7355, #D0A871);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
  position: relative;
}

.title-text::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(to right, #D0A871, #8B7355);
  border-radius: 3px;
}

.title-icon {
  display: inline-block;
  margin-right: 20px;
  animation: float 3s ease-in-out infinite;
  font-size: 2.5rem;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.subtitle {
  font-size: 1.2rem;
  color: #8B7355;
  max-width: 500px;
  margin: 30px auto 0;
  line-height: 1.6;
  font-weight: 500;
}

/* شبكة البطاقات */
.worships-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.worship-item {
  perspective: 1000px;
  height: 100%;
}

.worship-card-link {
  text-decoration: none;
  display: block;
  height: 100%;
}

.modern-worship-card {
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 10px 30px rgba(139, 115, 85, 0.15);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.modern-worship-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.05));
  z-index: 1;
}

.modern-worship-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(139, 115, 85, 0.25);
}

.card-content {
  padding: 30px 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

/* تصميم الأيقونة */
.icon-container {
  position: relative;
  width: 100px;
  height: 100px;
  margin-bottom: 25px;
}

.icon-background {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  backdrop-filter: blur(5px);
}

.icon-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.worship-icon {
  font-size: 3.2rem;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease;
}

.modern-worship-card:hover .worship-icon {
  transform: scale(1.1);
}

.icon-shine {
  position: absolute;
  top: -5px;
  left: -5px;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modern-worship-card:hover .icon-shine {
  opacity: 1;
}

/* عنوان البطاقة */
.worship-title {
  font-size: 1.5rem;
  color: white;
  text-align: center;
  margin: 0;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  padding-bottom: 10px;
}

.worship-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background: rgba(255, 255, 255, 0.7);
  transition: width 0.3s ease;
}

.modern-worship-card:hover .worship-title::after {
  width: 70px;
}

/* تأثير التمرير */
.card-hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
  border-radius: 20px;
}

.modern-worship-card:hover .card-hover-effect {
  opacity: 1;
}

/* تذييل البطاقة */
.card-footer {
  background: rgba(0, 0, 0, 0.1);
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
}

.footer-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.footer-arrow {
  color: white;
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.modern-worship-card:hover .footer-arrow {
  transform: translateX(-5px);
}

/* الزخرفة السفلية */
.bottom-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  overflow: hidden;
  z-index: 1;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(208, 168, 113, 0.05);
}

.wave-1 {
  border-radius: 50% 50% 0 0;
  transform: translateY(30px);
}

.wave-2 {
  border-radius: 60% 60% 0 0;
  background: rgba(208, 168, 113, 0.03);
  transform: translateY(50px);
}

/* تحسينات للهواتف الصغيرة */
@media (max-width: 768px) {
  .modern-worships-container {
    padding: 15px 10px 40px;
  }
  
  .header-section {
    margin: 30px 0 50px;
  }
  
  .main-title {
    font-size: 2rem;
    padding: 0 15px;
  }
  
  .title-icon {
    margin-right: 15px;
    font-size: 1.8rem;
  }
  
  .subtitle {
    font-size: 1rem;
    padding: 0 10px;
    margin-top: 20px;
  }
  
  .worships-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }
  
  .icon-container {
    width: 80px;
    height: 80px;
  }
  
  .worship-icon {
    font-size: 2.5rem;
  }
  
  .worship-title {
    font-size: 1.3rem;
  }
}

@media (max-width: 576px) {
  .worships-grid {
    grid-template-columns: 1fr;
    max-width: 320px;
  }
  
  .main-title {
    font-size: 1.8rem;
  }
  
  .title-icon {
    margin-right: 10px;
    font-size: 1.6rem;
  }
}

/* تحسينات للأجهزة اللوحية */
@media (min-width: 992px) {
  .worships-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>