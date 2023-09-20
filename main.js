const moviesContainer = document.querySelector('.movies__container');

const API_KEY = '';
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

async function fetchAPIData(searchTerm, searchType) {
  const res = await fetch(
    `${API_URL}&s=${searchTerm}&type=${searchType}&page=2`,
  );
  const data = await res.json();
  console.log(data);
  return data;
}

function createMovieCard(movie) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `<a href="#">
                <img src="${movie.Poster}" class="card__img" alt="Movie Title" />
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

document.forms[0].onsubmit = (e) => {
  e.preventDefault();
  moviesContainer.innerHTML = '';
  const searchTerm = document.forms[0].elements.search.value;
  const searchType = document.forms[0].elements.type.value;
  displayMovies(searchTerm, searchType);
};
