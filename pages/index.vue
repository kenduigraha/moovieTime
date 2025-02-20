<script setup lang="ts">
    import { onMounted, nextTick } from 'vue';
    import { useMovieStore } from '~/src/store/movies';
    import Navbar from '~/src/components/Navbar.vue';
    import Content from '~/src/components/Content.vue';
    import Footer from '~/src/components/Footer.vue';
    const movieStore = useMovieStore();

    onMounted(async () => {
        await nextTick();
        await movieStore.fetchMovies();
    });
</script>

<template>
    <div>
        <Navbar />
        <Content />
        <Footer />
    </div>
  </template>
  
