const global = {
  currentPage: window.location.pathname,
};

let searchPage = 1;
let totalSearchPages = 0;

const moviesContainer = document.querySelector('.movies__container');
const movieContainer = document.querySelector('.movie__container');
const prevBtn = document.querySelector('.btn-prev');
const nextBtn = document.querySelector('.btn-next');
const backBtn = document.querySelector('.back__btn');
const pageNumber = document.querySelector('.search-page');
const pagination = document.querySelector('.pagination');
const results = document.querySelector('.results');
const resultsCount = document.querySelector('.movies__results-count');
const logo = document.querySelector('.logo__link');

const API_KEY = '4b0486f5';
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

function removeSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

function showError(message) {
  const err = document.createElement('p');
  removeSpinner();
  err.style.textAlign = 'center';
  err.textContent = message;
  moviesContainer.appendChild(err);
}

async function fetchAPIData(searchTerm, searchType, page) {
  pagination.style.display = 'none';
  results.style.display = 'none';
  showSpinner();
  const res = await fetch(
    `${API_URL}&s=${searchTerm}&type=${searchType}&page=${page}`,
  );
  const data = await res.json();
  if (data.Response === 'False') {
    return data;
  }

  resultsCount.textContent = data.totalResults;
  totalSearchPages = Math.ceil(data.totalResults / 10);
  pageNumber.textContent = `Page ${searchPage} / ${totalSearchPages}`;
  removeSpinner();
  pagination.style.display = 'flex';
  results.style.display = 'flex';
  return data;
}

function showMovieError(message) {
  const err = document.createElement('p');
  removeSpinner();
  err.style.display = 'flex';
  err.style.justifyContent = 'center';
  err.style.alignItems = 'center';
  err.style.height = '80vh';
  err.textContent = message;
  movieContainer.textContent = '';
  movieContainer.appendChild(err);
}

async function fetchMovieInfo() {
  const ID = window.location.search.split('?id=')[1];
  showSpinner();
  try {
    const res = await fetch(`${API_URL}&i=${ID}`);
    const data = await res.json();
    if (data.Error) {
      showMovieError(data.Error);
      return;
    }
    document.title = data.Title;
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
  } catch (error) {
    showMovieError('Something went wrong. Please reload this page');
  }
  removeSpinner();
}

function createMovieCard(movie) {
  const card = document.createElement('article');
  card.classList.add('card');
  card.innerHTML = `<a href="/movie-details.html?id=${
    movie.imdbID
  }" class="card__link">
                <img src="${
                  movie.Poster === 'N/A' ? '/no-image.jpg' : movie.Poster
                }" class="card__img" alt="Movie Title" />
                              <div class="card__body">
                <h3 class="card__title">${movie.Title}</h3>
                <p class="card__text">
                  <small>Release year: ${movie.Year}</small>
                </p>
              </div>
              </a>
`;
  moviesContainer.appendChild(card);
}

async function displayMovies(searchTerm, searchType) {
  if (searchTerm.length < 3) return;
  try {
    const { Search, Error } = await fetchAPIData(
      searchTerm,
      searchType,
      searchPage,
    );
    if (Error) {
      showError(Error);
      return;
    }
    Search.forEach((movie) => createMovieCard(movie));
  } catch (error) {
    showError('Something went wrong. Please try again');
  }
}

function showNewMoviesPage() {
  moviesContainer.innerHTML = '';
  const searchTerm = document.forms[0].elements.search.value;
  const searchType = document.forms[0].elements.type.value;
  displayMovies(searchTerm, searchType);
}

function onLoad() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      document.forms[0].onsubmit = (e) => {
        e.preventDefault();
        sessionStorage.setItem(
          'lastSearch',
          document.forms[0].elements.search.value,
        );
        showNewMoviesPage();
      };
      nextBtn.addEventListener('click', () => {
        searchPage += 1;
        showNewMoviesPage();
      });
      prevBtn.addEventListener('click', () => {
        if (searchPage === 1) return;
        searchPage -= 1;
        showNewMoviesPage();
      });
      document.forms[0].elements.search.value =
        sessionStorage.getItem('lastSearch');
      showNewMoviesPage();
      break;
    case '/movie-details.html':
      fetchMovieInfo();
      backBtn.addEventListener('click', () => {
        window.history.back();
      });

      break;
    default:
      break;
  }
}

logo.addEventListener('click', () => {
  sessionStorage.setItem('lastSearch', '');
});

document.addEventListener('DOMContentLoaded', onLoad);
