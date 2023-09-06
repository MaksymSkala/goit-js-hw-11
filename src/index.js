import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
const message = document.getElementById('message');

const API_KEY = '39263242-9a9e6029252b757da1c0dfd4b';
const BASE_URL = 'https://pixabay.com/api/';
const lightbox = new SimpleLightbox('.gallery a');

let page = 1;
let totalPages = 0;
let currentQuery = '';

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
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return;
        }

        totalPages = Math.ceil(totalHits / 40);
        loadMoreButton.style.display = 'block'; // Показуємо кнопку після завантаження даних

        hits.forEach((image) => {
            // ...
        });

        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        
        // Перевірка тут, після отримання totalPages
        if (page >= totalPages) {
            loadMoreButton.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        
        // Перевірка тут, після отримання totalPages
        if (page >= totalPages) {
            loadMoreButton.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}

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
            loadMoreButton.style.display = 'block';
        });

        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

        loadMoreButton.style.display = 'block';
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}

function searchImages(query) {
    if (query.trim() === '') {
        return;
    }

    clearGallery();

    page = 1;

    currentQuery = query;

    fetchImages(query, page);
}

function loadMoreImages() {
    page++;
    fetchImages(currentQuery, page);

    // Перевірка, чи потрібно приховати кнопку "Load more"
    if (totalPages > 0 && page === totalPages) {
        loadMoreButton.style.display = 'none';
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = e.target.searchQuery.value;
    searchImages(query);
});

loadMoreButton.addEventListener('click', loadMoreImages);

window.addEventListener('load', () => {
    
});

