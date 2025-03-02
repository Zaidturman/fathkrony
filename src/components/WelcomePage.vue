<template>
    <router-view></router-view>

    <div class="bottom-nav">
        <router-link to="/" class="nav-item">الرئيسية
        </router-link>
        <router-link to="/times" class="nav-item">المسبحة</router-link>
        <router-link to="/setting" class="nav-item">الاعدادات</router-link>
    </div>
</template>

<style scoped>
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
}

.nav-item {
    text-decoration: none;
    color: #2c3e50;
    font-size: 16px;
}

.nav-item.router-link-exact-active {
    color: var(--color-gold-dark);
}
</style>