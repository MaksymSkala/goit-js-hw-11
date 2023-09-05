import axios from 'axios';
import SimpleLightbox from 'simplelightbox';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

const API_KEY = '39263242-9a9e6029252b757da1c0dfd4b';
const BASE_URL = 'https://pixabay.com/api/';

const lightbox = new SimpleLightbox('.gallery a');

let page = 1; // Початкова сторінка
let currentQuery = ''; // Поточний запит

function clearGallery() {
    gallery.innerHTML = '';
}

async function fetchImages(query, pageNum) {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                key: API_KEY,
                q: query,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                page: pageNum,
                per_page: 40,
            },
        });

        const { data } = response;
        const { hits, totalHits } = data;

        if (hits.length === 0) {
            // Відобразити повідомлення, що нічого не знайдено
            return;
        }

        // Рендерити кожну картку зображення
        hits.forEach((image) => {
            const photoCard = document.createElement('div');
            photoCard.classList.add('photo-card');

            const img = document.createElement('img');
            img.src = image.webformatURL;
            img.alt = image.tags;
            img.loading = 'lazy';

            const info = document.createElement('div');
            info.classList.add('info');

            const likes = document.createElement('p');
            likes.classList.add('info-item');
            likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

            const views = document.createElement('p');
            views.classList.add('info-item');
            views.innerHTML = `<b>Views:</b> ${image.views}`;

            const comments = document.createElement('p');
            comments.classList.add('info-item');
            comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

            const downloads = document.createElement('p');
            downloads.classList.add('info-item');
            downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

            info.appendChild(likes);
            info.appendChild(views);
            info.appendChild(comments);
            info.appendChild(downloads);

            photoCard.appendChild(img);
            photoCard.appendChild(info);

            gallery.appendChild(photoCard);
        });

        // Відобразити повідомлення про кількість знайдених зображень
        alert(`Hooray! We found ${totalHits} images.`);

        // Включити кнопку "Load more"
        loadMoreButton.style.display = 'block';
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}

function searchImages(query) {
    if (query.trim() === '') {
        return;
    }

    // Очистити галерею при новому пошуку
    clearGallery();

    // Почати з першої сторінки
    page = 1;

    // Запам'ятати поточний запит
    currentQuery = query;

    // Виконати HTTP-запит та рендерити зображення
    fetchImages(query, page);
}

function loadMoreImages() {
    // Збільшити номер сторінки на 1
    page++;

    // Виконати HTTP-запит та додати наступну групу зображень до галереї
    fetchImages(currentQuery, page);
}

// Обробники подій
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = e.target.searchQuery.value;
    searchImages(query);
});

loadMoreButton.addEventListener('click', loadMoreImages);

// Пошук при завантаженні сторінки
window.addEventListener('load', () => {
    searchImages('landscape'); // Приклад пошуку за замовчуванням
});