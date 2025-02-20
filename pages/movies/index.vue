<script setup>
  import { ref, computed, onMounted } from 'vue';

  import Navbar from '~/src/components/Navbar.vue';
  import Footer from '~/src/components/Footer.vue';
  import { useMovieStore } from '~/src/store/movies';

  const movieStore = useMovieStore();
  const displayedMovies = ref(8);
  const sortOption = ref('Popularity Descending');
  const selectedGenres = ref([]);

  const loadMore = () => {
    displayedMovies.value += 8; // Tambahkan 12 item lagi
  };

  const optionListFilter = [
    {label: 'Popularity Ascending', value: 'Popularity Ascending'},
    { label: 'Popularity Descending', value: 'Popularity Descending' },
    { label: 'Release Date Ascending', value: 'Release Date Ascending' },
    { label: 'Release Date Descending', value: 'Release Date Descending' },
    { label: 'Rating Ascending', value: 'Rating Ascending' },
    { label: 'Rating Descending', value: 'Rating Descending' },
  ]

  // List Genre
  const genres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Family', 'Fantasy', 'History', 'Horror'
  ];

  const filteredAndSortedMovies = computed(() => {
    let movies = [...movieStore.movies];

    // Filter berdasarkan genre
    if (selectedGenres.value.length > 0) {
      movies = movies.filter(movie =>
        selectedGenres.value.some(genre => movie.genre.includes(genre))
      );
    }

    // Sorting
    switch (sortOption.value) {
      case 'Popularity Ascending':
        movies.sort((a, b) => a.imdbVotes - b.imdbVotes);
        break;
      case 'Popularity Descending':
        movies.sort((a, b) => b.imdbVotes - a.imdbVotes);
        break;
      case 'Release Date Ascending':
        movies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
        break;
      case 'Release Date Descending':
        movies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
        break;
      case 'Rating Ascending':
        movies.sort((a, b) => parseFloat(a.imdbRating) - parseFloat(b.imdbRating));
        break;
      case 'Rating Descending':
        movies.sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating));
        break;
    }

    return movies.slice(0, displayedMovies.value);
  });

  const shouldShowLoadMore = computed(() => {
    const totalMovies = filteredAndSortedMovies.length;

    if (totalMovies < 8 || totalMovies % 4 === 0) {
      return false;
    }

    return displayedMovies.value < movieStore.movies.length;
  });

  onMounted(() => {
    if (!movieStore.movies.length) {
      movieStore.fetchMovies();
    }
  });
</script>

<template>
  <Navbar/>
  <div class="container max-w-screen-lg mx-auto px-6 py-[calc(1.5rem_+_60px)]">
    <h1
      class="text-2xl relative font-semibold text-white my-8 pt-3 before:absolute before:rounded-lg before:h-1 before:w-16 before:top-0 before:left-0 before:bg-[#E74C3C]"
    >
      Movies
    </h1>

    <div class="flex gap-6 flex-col md:flex-row">
      <aside class="w-full md:w-1/4 bg-gray-900 py-4 rounded-lg text-white">
        <h2 class="text-md font-semibold px-4 pb-4 border-b">Sort Result By</h2>
        <div class="px-4 my-4">
          <select
            v-model="sortOption"
            class="w-full p-2 bg-gray-700 border-none rounded text-xs font-light"
          >
            <option
              v-for="option in optionListFilter"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <h2 class="text-md font-semibold px-4 py-2 border-y">Genres</h2>

        <div class="grid grid-cols-2 md:grid-cols-1 gap-2 p-4">
          <label
            v-for="genre in genres"
            :key="genre"
            class="flex justify-between items-center font-light text-xs"
          >
            {{ genre }}
            <input
              type="checkbox"
              :value="genre"
              v-model="selectedGenres"
              class="mr-2"
            />
          </label>
        </div>
      </aside>

      <section class="w-full md:w-3/4">
        <div v-if="movieStore.loading" class="text-white">Loading...</div>
        <div v-else-if="movieStore.error" class="text-red-500">
          {{ movieStore.error }}
        </div>
        <div v-else>
          <div
            v-if="filteredAndSortedMovies.length > 0"
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            <div
              v-for="movie in filteredAndSortedMovies"
              :key="movie.imdbID"
              class="-p-4 relative"
            >
              <router-link v-if="movie.imdbID" :to="`/movies/${movie.imdbID}`">
                <div class="relative">
                  <div
                    class="bg-black bg-opacity-80 text-white px-3 py-12 text-center font-semibold absolute top-0 left-0 w-full h-full flex-col justify-between items-center flex transition ease-linear duration-130 opacity-0 hover:opacity-100"
                  >
                    <p class="mb-3 text-lg">⭐ {{ movie.imdbRating }}</p>
                    <p class="mb-3 text-sm">{{ movie.genre }}</p>
                    <p
                      class="bg-red-600 text-xs px-6 py-1 uppercase rounded-3xl"
                    >
                      view
                    </p>
                  </div>
                  <img
                    :src="movie.Poster"
                    :alt="movie.Title"
                    class="w-full object-cover h-64"
                  />
                </div>
              </router-link>

              <div class="mt-2">
                <h2 class="text-sm font-semibold text-white mb-1">
                  {{ movie.Title }}
                </h2>
                <p class="text-gray-500 text-xs">{{ movie.Year }}</p>
              </div>

              <span
                class="bg-nightblue bg-opacity-80 absolute right-0 top-0 px-2 py-1 text-white text-xs font-bold"
                v-if="movie.imdbRating"
                >{{ movie.imdbRating }}</span
              >
            </div>
          </div>

          <div v-else class="text-center text-white mt-6 text-lg font-semibold">
            No movie to display
          </div>

          <div class="text-center mt-6">
            <button
              v-if="shouldShowLoadMore"
              @click="loadMore"
              class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Load More
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
  <Footer />
</template>
