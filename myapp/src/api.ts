const API_KEY = "83af6f85f29b6467ef7f4bd87e80b297";
const BASE_PATH = "https://api.themoviedb.org/3/";

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
