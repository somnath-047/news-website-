const apiKey = "08aa6fded8a145018cc1b0adb446275d";
const newsContainer = document.getElementById("newsContainer");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");

function searchNews() {
  const query = searchInput.value.trim() || "latest";
  const category = categorySelect.value;
  const url =
    category
      ? `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apiKey}&pageSize=12&country=in`
      : `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}&pageSize=12`;

  localStorage.setItem("lastSearch", JSON.stringify({ query, category }));

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.status !== "ok") {
        newsContainer.innerHTML = "<p class='text-danger'>Something went wrong.</p>";
        return;
      }

      const articlesHtml = data.articles.map(article => `
        <div class="col-md-4">
          <div class="card h-100">
            <img src="${article.urlToImage || 'https://via.placeholder.com/300'}" class="card-img-top" alt="News Image">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${article.title}</h5>
              <p class="card-text">${article.description || ''}</p>
              <a href="${article.url}" target="_blank" class="btn btn-outline-primary mt-auto">Read More</a>
            </div>
          </div>
        </div>
      `).join('');

      newsContainer.innerHTML = articlesHtml;
    })
    .catch(() => {
      newsContainer.innerHTML = "<p class='text-danger'>Failed to load news.</p>";
    });
}

function toggleMode() {
  const body = document.body;
  if (body.classList.contains("dark-mode")) {
    body.classList.replace("dark-mode", "light-mode");
    localStorage.setItem("theme", "light-mode");
  } else {
    body.classList.replace("light-mode", "dark-mode");
    localStorage.setItem("theme", "dark-mode");
  }
}

// Load preferences
window.onload = () => {
  const lastSearch = JSON.parse(localStorage.getItem("lastSearch"));
  const theme = localStorage.getItem("theme") || "light-mode";
  document.body.classList.add(theme);

  if (lastSearch) {
    searchInput.value = lastSearch.query;
    categorySelect.value = lastSearch.category;
  }

  searchNews();
};
