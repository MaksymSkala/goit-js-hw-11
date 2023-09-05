const form = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const searchQuery = e.target.searchQuery.value;
  // Очистити галерею перед новим пошуком
  gallery.innerHTML = "";

  const apiKey = "39263242-9a9e6029252b757da1c0dfd4b";
  const baseUrl = "https://pixabay.com/api/";
  const perPage = 20;
  let page = 1;

  const fetchImages = async () => {
    try {
      const response = await fetch(
        `${baseUrl}?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
      );
      const data = await response.json();
      return data.hits;
    } catch (error) {
      console.error("Error fetching images:", error);
      return [];
    }
  };

  const renderImages = async () => {
    const images = await fetchImages();
    // Перевірка на наявність зображень
    if (images.length === 0) {
      gallery.innerHTML = '<p class="no-results">No results found.</p>';
      return;
    }

    images.forEach((image) => {
      const imageCard = document.createElement("div");
      imageCard.classList.add("photo-card");
      imageCard.innerHTML = `
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${image.likes}</p>
          <p class="info-item"><b>Views:</b> ${image.views}</p>
          <p class="info-item"><b>Comments:</b> ${image.comments}</p>
          <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
        </div>
      `;
      gallery.appendChild(imageCard);
    });

    // Показати кнопку "Load more"
    loadMoreBtn.style.display = "block";
  };

  // Завантажити та відобразити зображення
  renderImages();

  page++; // Збільшити номер сторінки
});

loadMoreBtn.addEventListener("click", () => {
    renderImages(); // Завантажити і відобразити більше зображень
    page++; // Збільшити номер сторінки
  });

  import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const lightbox = new SimpleLightbox(".photo-card img", {
  captionsData: "alt",
  captionDelay: 250,
});