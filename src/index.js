document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#search-form");
    const gallery = document.querySelector(".gallery");
    const loadMoreBtn = document.querySelector(".load-more");
  
    let page = 1; // Початкова сторінка
    let searchQuery = ""; // Початковий пустий рядок пошуку
  
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      page = 1; // Скидаємо сторінку до початкового значення
      searchQuery = e.target.searchQuery.value.trim();
      gallery.innerHTML = ""; // Очищуємо галерею перед новим пошуком
      await fetchImages();
    });
  
    async function fetchImages() {
      try {
        const apiKey = "39263242-9a9e6029252b757da1c0dfd4b";
        const response = await fetch(
          `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
        );
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const data = await response.json();
        const images = data.hits;
  
        if (images.length === 0) {
          gallery.innerHTML = '<p class="error-message">Sorry, there are no images matching your search query. Please try again.</p>';
          return;
        }
  
        images.forEach((image) => {
          const card = document.createElement("div");
          card.classList.add("photo-card");
          card.innerHTML = `
            <a href="${image.largeImageURL}" class="lightbox">
              <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
            </a>
            <div class="info">
              <p class="info-item"><b>Likes:</b> ${image.likes}</p>
              <p class="info-item"><b>Views:</b> ${image.views}</p>
              <p class="info-item"><b>Comments:</b> ${image.comments}</p>
              <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
            </div>
          `;
          gallery.appendChild(card);
        });
  
        // Ініціалізуємо SimpleLightbox
        const lightbox = new SimpleLightbox(".lightbox", {
          captionsData: "alt",
          captionDelay: 250,
        });
  
        if (images.length < 40) {
          loadMoreBtn.style.display = "none";
        } else {
          loadMoreBtn.style.display = "block";
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    }
  
    loadMoreBtn.addEventListener("click", async function () {
      page += 1; // Збільшуємо сторінку для завантаження наступної групи зображень
      await fetchImages();
      // Прокручуємо сторінку
      window.scrollBy({
        top: gallery.clientHeight,
        behavior: "smooth",
      });
    });
  });