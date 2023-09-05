const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39263242-9a9e6029252b757da1c0dfd4b';

// Отримання посилань на форму, галерею та кнопку "Load more"
const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

// Ініціалізація SimpleLightbox для галереї
const lightbox = new SimpleLightbox('.gallery a');

// Ініціалізація поточної сторінки для пагінації
let currentPage = 1;

// Обробник події для пошуку зображень
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const searchQuery = e.target.elements.searchQuery.value.trim();

  if (!searchQuery) {
    alert('Please enter a search query');
    return;
  }

  try {
    // Виконання HTTP-запиту до API Pixabay з параметром q
    const response = await fetch(
      `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=1`
    );

    if (!response.ok) {
      throw new Error('Error fetching images');
    }

    const data = await response.json();

    // Очищення галереї перед новими зображеннями
    gallery.innerHTML = '';

    // Відображення знайдених зображень
    data.hits.forEach((image) => {
      const galleryItem = document.createElement('a');
      galleryItem.href = image.largeImageURL;
      galleryItem.setAttribute('data-lightbox', 'gallery');
      galleryItem.innerHTML = `<img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />`;
      gallery.appendChild(galleryItem);
    });

    // Оновлення SimpleLightbox
    lightbox.refresh();

    // Пагінація: показ кнопки "Load more"
    if (data.hits.length < 20) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'block';
    }

    // Скидання поточної сторінки
    currentPage = 1;
  } catch (error) {
    console.error('Error fetching images:', error);
    alert('Error fetching images. Please try again.');
  }
});

// Обробник події для кнопки "Load more"
loadMoreBtn.addEventListener('click', async () => {
  currentPage++;

  try {
    const searchQuery = searchForm.elements.searchQuery.value.trim();

    const response = await fetch(
      `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}`
    );

    if (!response.ok) {
      throw new Error('Error fetching images');
    }

    const data = await response.json();

    // Додавання нових зображень до галереї
    data.hits.forEach((image) => {
      const galleryItem = document.createElement('a');
      galleryItem.href = image.largeImageURL;
      galleryItem.setAttribute('data-lightbox', 'gallery');
      galleryItem.innerHTML = `<img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />`;
      gallery.appendChild(galleryItem);
    });

    // Оновлення SimpleLightbox
    lightbox.refresh();

    // Пагінація: приховання кнопки "Load more" на останній сторінці
    if (data.hits.length < 20) {
      loadMoreBtn.style.display = 'none';
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    alert('Error fetching images. Please try again.');
  }
});