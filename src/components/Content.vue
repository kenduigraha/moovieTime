<script setup>
  import Loading from "~/src/components/Loading.vue";
  import Slider from "~/src/components/Slider.vue";
  import ListItems from "~/src/components/MovieItemList.vue";
  import { useMovieStore } from "~/src/store/movies";
  import { computed } from "vue";

  const movieStore = useMovieStore();

  const loading = computed(() => movieStore.loading);
  const error = computed(() => movieStore.error);
</script>

<template>
  <main class="pb-6 py-[calc(1.5rem_+_60px)]">
    <div v-if="loading" class="flex justify-center items-center h-screen">
      <Loading />
    </div>

    <div v-else-if="error" class="text-red-500">
      {{ error }}
    </div>

    <div v-else>
      <Slider />
      <ListItems />
    </div>
  </main>
</template>
