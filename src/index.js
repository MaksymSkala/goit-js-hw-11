const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39263242-9a9e6029252b757da1c0dfd4b';
const perPage = 20; // Кількість зображень на сторінці

let page = 1; // Початкова сторінка

const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

// Функція для виконання HTTP-запиту до Pixabay API
async function fetchImages(searchQuery) {
  try {
    const response = await fetch(
      `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    if (!response.ok) {
      throw new Error('Error fetching images');
    }
    const data = await response.json();
    return data.hits;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

// Функція для додавання карток зображень до галереї
function appendImagesToGallery(images) {
  const galleryItemsHTML = images
    .map(
      (item) =>
        `<div class="photo-card">
           <img src="${item.largeImageURL}" alt="${item.tags}" loading="lazy" />
           <div class="info">
             <p class="info-item"><b>Likes:</b> ${item.likes}</p>
             <p class="info-item"><b>Views:</b> ${item.views}</p>
             <p class="info-item"><b>Comments:</b> ${item.comments}</p>
             <p class="info-item"><b>Downloads:</b> ${item.downloads}</p>
           </div>
         </div>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', galleryItemsHTML);
}

// Функція для обробки подальших запитів при натисканні кнопки "Load more"
async function handleLoadMore() {
  page += 1; // Збільшуємо номер сторінки
  const searchQuery = document.querySelector('input[name="searchQuery"]').value;
  const images = await fetchImages(searchQuery);

  if (images.length === 0) {
    // Перевірка на порожній масив результатів
    loadMoreBtn.style.display = 'none'; // Якщо немає результатів, ховаємо кнопку "Load more"
    console.log("Sorry, there are no more images matching your search query.");
  } else {
    appendImagesToGallery(images);
    window.scrollBy({
      top: gallery.clientHeight * 2,
      behavior: 'smooth',
    });
  }
}

document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  page = 1; // Скидаємо номер сторінки при новому пошуку
  gallery.innerHTML = ''; // Очищуємо галерею
  loadMoreBtn.style.display = 'none'; // Ховаємо кнопку "Load more"

  const searchQuery = e.target.searchQuery.value;
  const images = await fetchImages(searchQuery);

  if (images.length === 0) {
    console.log("Sorry, there are no images matching your search query. Please try again.");
    return;
  }

  appendImagesToGallery(images);
  loadMoreBtn.style.display = 'block'; // Показуємо кнопку "Load more"
  window.scrollBy({
    top: gallery.clientHeight,
    behavior: 'smooth',
  });
});

loadMoreBtn.addEventListener('click', handleLoadMore);