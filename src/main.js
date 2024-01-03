const linkImagenes = "https://image.tmdb.org/t/p/w500";
/**
 * @param apiAxios son los parametros de axios para poder llamar la api
 */
const apiAxios = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: API,
  },
});
//&language=es

//utils
function createMovies(movies, container) {
  container.innerHTML = "";
  movies.forEach((element) => {
    const peliculaContenedora = document.createElement("div");
    peliculaContenedora.classList.add("movie-container");
    peliculaContenedora.addEventListener("click", () => {
      location.hash = `#movie=${element.id}`;
    });

    const posterPelicula = document.createElement("img");
    posterPelicula.classList.add("movie-img");
    posterPelicula.setAttribute("alt", element.title);
    posterPelicula.setAttribute("src", `${linkImagenes}${element.poster_path}`);

    peliculaContenedora.appendChild(posterPelicula);
    container.appendChild(peliculaContenedora);
  });
}

function createCategories(categories, container) {
  container.innerHTML = "";

  categories.forEach((category) => {
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("category-container");

    const categoryTitle = document.createElement("h3");
    categoryTitle.classList.add("category-title");
    categoryTitle.setAttribute("id", "id" + category.id);
    categoryTitle.addEventListener("click", () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });
    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  });
}
//llamados a la API
async function getTendenciasPreview() {
  const { data } = await apiAxios(`trending/movie/day`);
  // const data = await res.json();
  const peliculas = data.results;

  createMovies(peliculas, trendingMoviesPreviewList);
}
/**
 * @param getCategoriaPreview es una funcion para que jalemos los datos de la api sin usar axios
 */
async function getCategoriaPreview() {
  const res = await fetch(
    `https://api.themoviedb.org/3//genre/movie/list?api_key=${API}&language=es`
  );
  const data = await res.json();
  const peliculasCategorias = data.genres;

  console.log(peliculasCategorias);
  categoriesPreviewList.innerHTML = "";
  peliculasCategorias.forEach((category) => {
    const categoriasPreviewContenedor = document.querySelector(
      "#categoriesPreview .categoriesPreview-list"
    );

    const categoriaContenedora = document.createElement("div");
    categoriaContenedora.classList.add("category-container");

    const categoryPelicula = document.createElement("h3");
    categoryPelicula.classList.add("category-title");
    categoryPelicula.setAttribute("id", `id${category.id}`);
    categoryPelicula.addEventListener("click", () => {
      location.hash = `category=${category.id}-${category.name}`;
    });
    const categoriaTitleText = document.createTextNode(category.name);

    categoryPelicula.appendChild(categoriaTitleText);
    categoriaContenedora.appendChild(categoryPelicula);
    categoriasPreviewContenedor.appendChild(categoriaContenedora);
  });
}

async function getMoviesByCategory(id, categoryName) {
  const { data } = await apiAxios(`discover/movie`, {
    params: {
      with_genres: id,
    },
  });
  // const data = await res.json();
  const peliculas = data.results;

  /**
   * @param peliculas realizamos un forech para darle vuelta a los elementos que sacamos del api
   */
  headerCategoryTitle.innerHTML = decodeURIComponent(categoryName);
  createMovies(peliculas, genericSection);
}

async function getMoviesBySearch(query) {
  const { data } = await apiAxios(`search/movie`, {
    params: {
      query: query,
    },
  });
  // const data = await res.json();
  const peliculas = data.results;

  createMovies(peliculas, genericSection);
}

async function getTrendingMovies() {
  const { data } = await apiAxios(`trending/movie/day`);
  // const data = await res.json();
  const peliculas = data.results;
  headerCategoryTitle.innerHTML = "Tendencias";
  createMovies(peliculas, genericSection);
}

async function getMovieById(id) {
  const { data: movie } = await apiAxios(`movie/${id}`);
  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average.toFixed(1);
  const movieImgUrl = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
  console.log(movieImgUrl);
  headerSection.style.background = `
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.35) 19.27%,
      rgba(0, 0, 0, 0) 29.17%
    ),
    url(${movieImgUrl})
  `;

  console.log(movieDetailCategoriesList);
  createCategories(movie.genres, movieDetailCategoriesList);

  getRelatedMoviesId(id);
}

async function getRelatedMoviesId(id) {
  const { data } = await apiAxios(`movie/${id}/recommendations`);
  const relatedMovies = data.results;
  createMovies(relatedMovies, relatedMoviesContainer);
}
