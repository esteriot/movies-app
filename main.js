const global = {
  currentPage: window.location.pathname,
};

const moviesContainer = document.querySelector('.movies__container');

const API_KEY = '';
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

function removeSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

async function fetchAPIData(searchTerm, searchType) {
  showSpinner();
  const res = await fetch(
    `${API_URL}&s=${searchTerm}&type=${searchType}`,
  );
  const data = await res.json();
  removeSpinner();
  return data;
}

async function fetchMovieInfo() {
  const ID = window.location.search.split('?id=')[1];
  showSpinner();
  const res = await fetch(`${API_URL}&i=${ID}`);
  const data = await res.json();
  document.querySelector('.details__image').src =
    data.Poster === 'N/A' ? '/public/no-image.jpg' : data.Poster;
  document.querySelector('.details__title').textContent = data.Title;
  document.querySelector('.details__rating').textContent = data.imdbRating;
  document.querySelector('.details__release').textContent = data.Released;
  document.querySelector('.details__plot').textContent = data.Plot;
  document.querySelector('.details__director').textContent = data.Director;
  document.querySelector('.details__actors').textContent = data.Actors;
  document.querySelector('.details__country').textContent = data.Country;
  document.querySelector('.details__language').textContent = data.Language;
  document.querySelector('.details__runtime').textContent = data.Runtime;
  const genres = data.Genre.split(', ');
  const genresList = document.querySelector('.details__genres');
  genres.forEach((genre) => {
    const li = document.createElement('li');
    li.textContent = genre;
    genresList.appendChild(li);
  });
  removeSpinner();
  return data;
}

function createMovieCard(movie) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `<a href="/movie-details.html?id=${
    movie.imdbID
  }" class="card__link">
                <img src="${
                  movie.Poster === 'N/A' ? '/public/no-image.jpg' : movie.Poster
                }" class="card__img" alt="Movie Title" />
              </a>
              <div class="card__body">
                <h3 class="card__title">${movie.Title}</h3>
                <p class="card__text">
                  <small>Release year: ${movie.Year}</small>
                </p>
              </div>`;
  moviesContainer.appendChild(card);
}

async function displayMovies(searchTerm, searchType) {
  if (searchTerm.length < 3) return;
  const { Search } = await fetchAPIData(searchTerm, searchType);
  Search.forEach((movie) => createMovieCard(movie));
}

function onLoad() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      document.forms[0].onsubmit = (e) => {
        e.preventDefault();
        moviesContainer.innerHTML = '';
        const searchTerm = document.forms[0].elements.search.value;
        const searchType = document.forms[0].elements.type.value;
        displayMovies(searchTerm, searchType);
      };
      break;
    case '/movie-details.html':
      fetchMovieInfo();
      break;
    default:
      break;
  }
}

document.addEventListener('DOMContentLoaded', onLoad);
