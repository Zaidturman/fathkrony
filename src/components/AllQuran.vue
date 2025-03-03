<template>
    <TheHeader />
    <router-view />
    <ScrollButton />
</template>

<script>
import TheHeader from './TheHeader.vue'
import ScrollButton from './ScrollButton.vue'

export default {
    name: 'App',
    components: {
        TheHeader,
        ScrollButton
    }
}
</script>

<style>
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css');
@import url('../assets/css/styles.css');

body {
    direction: rtl;
    font-family: Arial, sans-serif;
}
</style>