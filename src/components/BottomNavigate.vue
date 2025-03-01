<template>
    <div class="bottomnavigate">

        <button>الإعدادات</button>
        <button>مواقيت الصلاة</button>
        <button>الرئيسية</button>
    </div>
</template>

<script></script>

<style scoped>
.bottomnavigate {
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-around;
}

.bottom-nav {
    display: flex;
    padding: 8px;
    background: var(--color-white);
    border-top: 1px solid var(--color-light-grey);
}

button {}
</style>