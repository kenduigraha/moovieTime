import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMovieStore = defineStore('movieStore', () => {
  const movies = ref([]);
  const loading = ref(true);
  const error = ref(null);
  const config = useRuntimeConfig()
  const OMDB_API_SECRET_KEY = config.public.secret;

  const fetchMovies = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_SECRET_KEY}&s=action&type=movie`);
      const data = await response.json();

      if (data.Response) {
        const movieList = data.Search.slice(0, 10);
        movies.value = await fetchDetail(movieList);
      } else {
        error.value = data.Error;
      }
    } catch (err) {
      error.value = 'Failed to fetch data.';
    } finally {
      loading.value = false;
    }
  }

  const searchMovie = async (query) => {
    loading.value = true;
    error.value = null;
  
    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_SECRET_KEY}&s=${query}&type=movie`);
      const data = await response.json();
  
      if (data.Response) {
        const filteredMovies = data.Search.filter(movie => 
          movie.Title.toLowerCase().includes(query.toLowerCase())
        );
  
        movies.value = await fetchDetail(filteredMovies);
      } else {
        movies.value = [];
        error.value = data.Error;
      }
    } catch (err) {
      error.value = 'Failed to fetch data.';
    } finally {
      loading.value = false;
    }
  };
  
  
  const fetchDetail = async (movieList) => {
    return await Promise.all(
      movieList.map(async (movie) => {
        try {
          const res = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_SECRET_KEY}&i=${movie.imdbID}`);
          const details = await res.json();

          return {
            ...movie,
            imdbRating: details.imdbRating || 'N/A',
            plot: details.Plot || 'No description available',
            genre: details.Genre || 'Unknown',
            imdbVotes: details.imdbVotes || 0,
            runtime: details.Runtime || 'N/A',
            boxOffice: details.BoxOffice,
            language: details.Language,
            director: details.Director
          }
        } catch (error) {
          return { ...movie, imdbRating: 'N/A' };
        }
      })
    );
  };

  return { movies, loading, error, fetchMovies, searchMovie };
});