const form = document.querySelector('#form');
const result = document.querySelector('#result');
const pager = document.querySelector('#pager');
const registersForPage = 40;
let totalPages;
let iterator;
let actualPage = 1;

window.onload = () => {
  form.addEventListener('submit', validateForm);
};

function validateForm(e) {
  e.preventDefault();

  const searchTerm = document.querySelector('#inputSearch').value.trim();
  if (searchTerm === '') {
    clearHtml(result);
    clearHtml(pager);
    showAlert('Please add a search term');
    return;
  }
  searchImages();
}

function calculatePages(total) {
  return parseInt(Math.ceil(total / registersForPage));
}

function showAlert(msg) {
  const alert = document.querySelector('.alert');
  if (!alert) {
    const containerAlert = document.createElement('div');
    containerAlert.classList.add('container-alert');
    const alert = document.createElement('p');
    alert.classList.add('alert');
    alert.textContent = msg;
    result.appendChild(containerAlert);
    containerAlert.appendChild(alert);
    setTimeout(() => {
      alert.remove();
      containerAlert.remove();
    }, 3000);
  }
}

function searchImages() {
  const term = document.querySelector('#inputSearch').value;
  const key = '38834416-c661bcad87994e1259ab63d37';
  const url = `https://pixabay.com/api/?key=${key}&q=${term}&per_page=${registersForPage}&page=${actualPage}`;

  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      totalPages = calculatePages(result.totalHits);
      if (result.totalHits === 0) {
        showAlert('No results found');
        return;
      }
      showImages(result.hits);
      showPager(); // Muestra el paginador después de mostrar las imágenes
    });
}

function showImages(images) {
  clearHtml(result);
  images.forEach((image) => {
    const { previewURL, likes, views, largeImageURL } = image;
    const abbreviationLikes = abbreviation(likes);
    const abbreviationViews = abbreviation(views);
    result.innerHTML += `
    <div class="container-card">
        <div class="card">
            <img class="img-card" src="${previewURL}" />
            <div class="container-content-card">
                <div class="container-info-card">
                    <p class="text-info">${abbreviationLikes} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="icon-card" stroke="currentColor" >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  </p>
                    <p class="text-info">${abbreviationViews} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-card">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  </p>
                </div>
                <a class="btn-card" href="${largeImageURL}" target="_blank" rel ="noopener noreferrer">Ver imagen</a>
            </div>
        </div>
    </div>
   `;
  });
  clearHtml(pager);

  showPager();
}

function abbreviation(number) {
  const NUMBER = Number(number);
  const abbreviations = ['K', 'M', 'B', 'T'];
  const accuracy = 1;
  const abbreviation =
    NUMBER >= 1000
      ? abbreviations[Math.floor(Math.log10(Math.abs(NUMBER)) / 3)]
      : '';
  const abbreviatedNumber =
    abbreviation !== ''
      ? (NUMBER / Math.pow(1000, abbreviations.indexOf(abbreviation))).toFixed(
          accuracy
        ) + abbreviation
      : NUMBER;
  return abbreviatedNumber;
}

function* createPagination(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}

function showPager() {
  clearHtml(pager);
  iterator = createPagination(totalPages);
  while (true) {
    const { value, done } = iterator.next();
    if (done) return;

    const button = document.createElement('a');
    button.href = '#';
    button.dataset.page = value;
    button.textContent = value;
    button.classList.add('btn-pager');
    button.onclick = () => {
      actualPage = value;
      searchImages();
    };

    pager.appendChild(button);
  }
}

function clearHtml(parameter) {
  while (parameter.firstChild) {
    parameter.removeChild(parameter.firstChild);
  }
}
