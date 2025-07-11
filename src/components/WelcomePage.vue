<template>
    <router-view></router-view>

    <div class="bottom-nav">
        <router-link to="/" class="nav-item" active-class="active">
            <div>
                <img src="../assets/images/home.png" alt="" class="icon default-icon">
                <img src="../assets/images/home1.png" alt="" class="icon active-icon">
                <div>الرئيسية</div>
            </div>
        </router-link>

        <router-link to="/times" class="nav-item" active-class="active">
            <div>
                <img src="../assets/images/rosaryactive.png" alt="" class="icon default-icon">
                <img src="../assets/images/rosary.png" alt="" class="icon active-icon">
                <div>المسبحة</div>
            </div>
        </router-link>
        <router-link to="/radio" class="nav-item" active-class="active">
            <div>
                <img src="../assets/images/radio.png" alt="" class="icon default-icon">
                <img src="../assets/images/radio-2.png" alt="" class="icon active-icon">
                <div>الاذاعة</div>
            </div>
        </router-link>
        <router-link to="/counter" class="nav-item" active-class="active">
            <div>
                <img src="../assets/images/counter.png" alt="" class="icon default-icon">
                <img src="../assets/images/counter-2.png" alt="" class="icon active-icon">
                <div>عداد</div>
            </div>
        </router-link>
        <router-link to="/mosqu-clock" class="nav-item" active-class="active">
            <div>
                <img src="../assets/images/dome-2.png" alt="" class="icon default-icon">
                <img src="../assets/images/dome.png" alt="" class="icon active-icon">
                <div>ساعة المسجد</div>
            </div>
        </router-link>

      
    </div>
</template>

<style scoped>

.icon {
    width: 24px;
}

.default-icon {
    display: block;
}

.active-icon {
    display: none;
}

.nav-item.active .default-icon {
    display: none;
}

.nav-item.active .active-icon {
    display: block;
}
.bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-around;
    background-color: #f8f9fa;
    padding: 10px 0;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

.nav-item {
    text-decoration: none;
    color: #2c3e50;
    font-size: 0.75rem; /* تصغير حجم الخط للهواتف */
    flex: 1;
    text-align: center;
    padding: 5px;
}

.nav-item div {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.icon {
    width: 22px;
    height: 22px;
    margin-bottom: 4px;
    transition: all 0.3s ease;
}

/* تحسينات للشاشات الصغيرة */
@media (max-width: 480px) {
    .nav-item {
        font-size: 0.65rem;
    }
    .icon {
        width: 20px;
        height: 20px;
    }
}

/* تحسينات للشاشات المتوسطة والكبيرة */
@media (min-width: 768px) {
    .nav-item {
        font-size: 0.85rem;
    }
    .icon {
        width: 24px;
        height: 24px;
    }
}
</style>
