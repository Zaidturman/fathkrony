<template>
    <div class="scrollBtn" :class="{ active: isActive }" @click="scrollToTop">
        <i class="fas fa-angle-double-up" aria-hidden="true"></i>
    </div>
</template>

<script>
export default {
    name: 'ScrollButton',
    data() {
        return {
            isActive: false
        }
    },
    mounted() {
        window.addEventListener('scroll', this.checkScroll)
    },
    unmounted() {
        window.removeEventListener('scroll', this.checkScroll)
    },
    methods: {
        checkScroll() {
            this.isActive = window.scrollY > 100
        },
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }
    }
}
</script>