<script setup>
  import { useMovieStore } from '~/src/store/movies';
  import { computed, ref } from 'vue';
  import MovieHover from '~/src/components/MovieHover';

  const movieStore = useMovieStore();
  const sortBy = ref('popularity');

  const sortedMovies = computed(() => {
    if (!movieStore.movies.length) return [];

    return [...movieStore.movies].sort((a, b) => {
      if (sortBy.value === 'popularity') {
        return (b.imdbVotes || 0) - (a.imdbVotes || 0);
      } else if (sortBy.value === 'releaseDate') {
        return parseInt(b.Year) - parseInt(a.Year);
      }
      return 0;
    });
  });

  const setSort = (method) => {
    sortBy.value = method;
  };
</script>

<template>
  <section class="p-6 mt-6 container mx-auto max-w-screen-lg">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-white relative text-2xl font-semibold pt-5 before:w-1/2 before:h-1.5 before:bg-[#E74C3C] before:absolute before:top-0 before:left-0 before:rounded-md">Discover Movies</h2>
      <div class="flex gap-3">
         <button @click="setSort('popularity')" :class="{'bg-red-600 bg-opacity-100 text-white': sortBy === 'popularity'}" class="bg-black bg-opacity-20 text-[#E5E5E5] font-semibold text-sm px-3 rounded-3xl cursor-pointer p-3">Popularity</button>
         <button @click="setSort('releaseDate')" :class="{'bg-red-600 bg-opacity-100 text-white': sortBy === 'releaseDate'}" class="bg-black bg-opacity-20 text-[#E5E5E5] font-semibold text-sm px-3 rounded-3xl cursor-pointer p-3">Release Date</button>
      </div>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
      <div v-for="movie in sortedMovies" :key="movie.imdbID" class="relative -p-4">
        <router-link v-if="movie.imdbID" :to="`/movies/${movie.imdbID}`">
          <MovieHover :movie="movie"/>
        </router-link>

        <div class="mt-2">
          <h2 class="text-sm font-semibold text-white mb-1">{{ movie.Title }}</h2>
          <p class="text-gray-500 text-xs">{{ movie.Year }}</p>
        </div>

        <span
          v-if="movie.imdbRating"
          class="bg-nightblue bg-opacity-80 absolute right-0 top-0 px-2 py-1 text-white text-xs font-bold"
        >
          {{ movie.imdbRating }}
        </span>
      </div>
    </div>
  </section>
</template>