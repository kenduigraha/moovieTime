<script setup>
  import 'swiper/css';
  import 'swiper/css/pagination';
  import { computed } from 'vue';
  import { Pagination, Autoplay } from 'swiper/modules';
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { useMovieStore } from '~/src/store/movies';

  const movieStore = useMovieStore();

  const movies = computed(() => movieStore.movies);

  const sliderMovies = computed(() => movies.value.slice(0, 4));
</script>

<template>
  <section>
    <Swiper
      :loop="true"
      :spaceBetween="20"
      :slidesPerView="1.5"
      :centeredSlides="true"
      :modules="[ Pagination, Autoplay]"
      :pagination="{ clickable: true, dynamicBullets: true }"
      class="w-full"
    >
      <SwiperSlide v-for="(movie, index) in sliderMovies" :key="index">
        <div class="text-white p-6 flex flex-col sm:flex-row w-full h-full items-center">
          <img :src="movie.Poster" :alt="movie.Title" class="w-60 md:w-[243px] h-[365px] object-cover">
          <div class="flex flex-col flex-1 h-[267px] bg-black p-6 w-11/12 md:w-full sm:w-4/6">
            <span class="text-white font-bold">
              ⭐ {{ movie.imdbRating }}
            </span>
            <h2 class="text-xl font-medium my-1">
              {{ movie.Title }}
            </h2>
            <p class="text-xs font-light">
              {{ movie.Year }} • {{ movie.genre }}
            </p>
            <p class="mt-3 text-sm font-light">
              {{ movie.plot }}
            </p>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </section>
</template>