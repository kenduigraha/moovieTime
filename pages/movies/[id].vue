<script setup>
    import Navbar from '~/src/components/Navbar.vue';
    import Footer from '~/src/components/Footer.vue';
    import ReviewCards from "~/src/components/ReviewCards.vue";
    import { useMovieStore } from "~/src/store/movies";
    import { computed, onMounted } from "vue";
    import { useRoute } from "vue-router";

    const route = useRoute();
    const movieStore = useMovieStore();
    const movie = computed(() =>
    movieStore.movies.find((m) => m.imdbID === route.params.id)
    );

    onMounted(async () => {
    if (!movie.value) {
        await movieStore.fetchMovies();
    }
    });

    const recommendedMovies = computed(() => {
    if (!movie.value) return [];

    const movieGenre = movie.value.genre?.split(", ")[0]; // Ambil genre utama
    return movieStore.movies
        .filter((m) => m.imdbID !== movie.value.imdbID && m.genre?.includes(movieGenre))
        .slice(0, 5); // Ambil 5 rekomendasi
    });
</script>
<!-- TODO: enhance navbar & footer -->
<template>
  <Navbar />
  <div>
    <div v-if="!movie" class="text-white">Movie Not Available.</div>

    <div v-else>
      <div
        class="w-full text-white bg-cover"
        :style="{ backgroundImage: `linear-gradient(rgba(30, 35, 43, 0.6), rgba(30, 35, 43, 0.6)), url(${movie.Poster})`}"
      >
        <div class="pt-[calc(1.5rem_+_60px)] text-white">
          <div class="w-full flex flex-col relative pt-36 items-center">
            <img
              :src="movie.Poster"
              :alt="movie.Title"
              class="w-[200px] mb-6 lg:mb-0 lg:absolute lg:left-12"
            />
            <div
              class="mb-8 container max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-6 lg:pl-[260px]"
            >
              <p class="text-white text-lg font-medium">{{ movie.Year }}</p>
              <h1 class="text-3xl font-semibold text-white my-1.5">
                {{ movie.Title }}
              </h1>
              <p class="text-sm text-white">{{ movie.genre }}</p>
            </div>
            <div class="bg-black bg-opacity-50 w-full">
              <div
                class="flex flex-row flex-wrap items-center w-full container max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-6 lg:pl-[260px]"
              >
                <p class="text-whtie font-semibold text-xl py-3">
                  ⭐
                  <span
                    class="align-middle text-3xl"
                    >{{ movie.imdbRating }}</span
                  >
                </p>
                <p
                  class="flex flex-col px-6 border-r border-white border-opacity-20"
                >
                  <span
                    class="font-medium text-white opacity-50 uppercase text-xs"
                    >User Score</span
                  >
                  <span
                    class="font-medium text-white uppercase text-xs"
                    >{{ movie.imdbVotes }}</span
                  >
                </p>
                <p
                  class="flex flex-col px-6 py-3 border-r border-white border-opacity-20"
                >
                  <span
                    class="font-medium text-white opacity-50 uppercase text-xs"
                    >Runtime</span
                  >
                  <span
                    class="font-medium text-white uppercase text-xs"
                    >{{ movie.runtime }}</span
                  >
                </p>
                <p
                  class="flex flex-col px-6 py-3 border-r border-white border-opacity-20"
                >
                  <span
                    class="font-medium text-white opacity-50 uppercase text-xs"
                    >Language</span
                  >
                  <span
                    class="font-medium text-white uppercase text-xs"
                    >{{ movie.language }}</span
                  >
                </p>
                <p
                  class="flex flex-col px-6 py-3 border-r border-white border-opacity-20"
                >
                  <span
                    class="font-medium text-white opacity-50 uppercase text-xs"
                    >Box Office</span
                  >
                  <span
                    class="font-medium text-white uppercase text-xs"
                    >{{ movie.boxOffice }}</span
                  >
                </p>
                <p class="flex flex-col px-6 py-3">
                  <span
                    class="font-medium text-white opacity-50 uppercase text-xs"
                    >Director</span
                  >
                  <span
                    class="font-medium text-white uppercase text-xs"
                    >{{ movie.director }}</span
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white">
        <div class="container py-6 mx-auto max-w-screen-lg px-6 lg:pl-[260px]">
          <h3 class="text-red-500 font-semibold uppercase">Overview</h3>
          <p class="mt-4">{{ movie.plot }}</p>
        </div>
      </div>
    </div>

    <section class="bg-white">
      <div class="container p-6 mx-auto max-w-screen-lg">
        <h3 class="text-red-500 font-semibold uppercase">Reviews</h3>

        <div
          class="flex flex-col md:flex-row gap-6 justify-between items-stretch mt-4"
        >
        <!-- there's no API for review -->
          <ReviewCards />
          <ReviewCards />
        </div>
      </div>
    </section>

    <!-- Movie Recommendations Section -->
    <section class="bg-nightblue container p-6 mx-auto max-w-screen-lg">
      <h3 class="text-white font-semibold uppercase">
        RECOMMENDATION MOVIES
      </h3>
      <div v-if="recommendedMovies.length">
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
          <div
            v-for="recMovie in recommendedMovies"
            :key="recMovie.imdbID"
            class="-p-4 relative"
          >
            <router-link
              v-if="recMovie.imdbID"
              :to="`/movies/${recMovie.imdbID}`"
            >
              <div class="relative">
                <div
                  class="bg-black bg-opacity-80 text-white px-3 py-12 text-center font-semibold absolute top-0 left-0 w-full h-full flex-col justify-between items-center flex transition ease-linear duration-130 opacity-0 hover:opacity-100"
                >
                  <p class="mb-3 text-lg">⭐ {{ recMovie.imdbRating }}</p>
                  <p class="mb-3 text-sm">{{ recMovie.genre }}</p>
                  <p class="bg-red-600 text-xs px-6 py-1 uppercase rounded-3xl">
                    view
                  </p>
                </div>
                <img
                  :src="recMovie.Poster"
                  :alt="recMovie.Title"
                  class="w-full object-cover h-64"
                />
              </div>
            </router-link>

            <div class="mt-2">
              <h2 class="text-sm font-semibold text-white mb-1">
                {{ recMovie.Title }}
              </h2>
              <p class="text-gray-500 text-xs">{{ recMovie.Year }}</p>
            </div>

            <span
              class="bg-nightblue bg-opacity-80 absolute right-0 top-0 px-2 py-1 text-white text-xs font-bold"
              v-if="movie.imdbRating"
              >{{ movie.imdbRating }}</span
            >
          </div>
        </div>
      </div>

      <p v-else class="text-center text-gray-400 mt-4 py-6">
        No similar movies found.
      </p>
    </section>
  </div>
  <Footer />
</template>
