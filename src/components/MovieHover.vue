<script setup>
    const props = defineProps(['movie']);
</script>

<template>
    <div class="relative">
        <div class="bg-black bg-opacity-80 text-white px-3 py-12 text-center font-semibold absolute top-0 left-0 w-full h-full flex-col justify-between items-center flex transition ease-linear duration-130 opacity-0 hover:opacity-100">
            <p class="mb-3 text-lg">⭐ {{ props.movie.imdbRating }}</p>
            <p class="mb-3 text-sm">{{ props.movie.genre }}</p>
            <p class="bg-red-600 text-xs px-6 py-1 uppercase rounded-3xl">view</p>
        </div>
        <img :src="movie.Poster" :alt="props.movie.Title" class="w-full object-cover h-64">
    </div>
</template>