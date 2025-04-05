const API_KEY = "pub_76384103b15a6cc6a37e8db0b892e57c149ef";
const baseUrl = "https://newsdata.io/api/1/news";
const newsContainer = document.getElementById("newsContainer");
const categoryLinks = document.querySelectorAll(".category");
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");

let currentCategory = "top";

// Theme Toggle Functionality
function initTheme() {
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
    } else {
        // Use system preference if no saved preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-theme');
        }
    }
}

themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('dark-theme')) {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    }
});

async function fetchNews(category = "top", query = "") {
    try {
        let url = `${baseUrl}?apikey=${API_KEY}&category=${category}`;
        
        if (query) {
            url += `&q=${query}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.results) {
            displayNews(data.results);
        } else {
            newsContainer.innerHTML = "<p class='error-message'>No news found. Try another category or search term.</p>";
        }
    } catch (error) {
        console.error("Error fetching news:", error);
        newsContainer.innerHTML = "<p class='error-message'>Failed to load news. Please try again later.</p>";
    }
}

function displayNews(newsList) {
    newsContainer.innerHTML = ""; // Clear existing news

    if (newsList.length === 0) {
        newsContainer.innerHTML = "<p class='error-message'>No news found for this category or search term.</p>";
        return;
    }

    newsList.forEach(article => {
        if (!article.title || !article.link) return; // Ignore empty articles

        const newsCard = document.createElement("div");
        newsCard.classList.add("news-card");

        // Trimmed description
        const trimmedDescription = article.description
            ? article.description.slice(0, 150) + "..."
            : "No description available.";

        newsCard.innerHTML = `
            <img src="${article.image_url || 'https://via.placeholder.com/400x200?text=News'}" alt="${article.title}">
            <div class="news-content">
                <p class="news-date">📅 ${article.pubDate ? new Date(article.pubDate).toLocaleString() : 'Unknown date'}</p>
                <h3>${article.title}</h3>
                <p>${trimmedDescription}</p>
                <a href="${article.link}" target="_blank">Read more</a>
            </div>
        `;

        newsContainer.appendChild(newsCard);
    });
}

// Category Filter Logic
categoryLinks.forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();
        
        // Update active category
        categoryLinks.forEach(cat => cat.classList.remove("active"));
        this.classList.add("active");
        
        const selectedCategory = this.getAttribute("data-category");
        currentCategory = selectedCategory;
        fetchNews(selectedCategory);
    });
});

// Search functionality
searchButton.addEventListener("click", function() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        fetchNews(currentCategory, searchTerm);
    }
});

searchInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            fetchNews(currentCategory, searchTerm);
        }
    }
});

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    categoryLinks[0].classList.add("active");
    fetchNews(currentCategory);
});
