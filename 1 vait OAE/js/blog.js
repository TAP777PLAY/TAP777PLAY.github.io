/* ===== BLOG PAGE JAVASCRIPT ===== */

document.addEventListener('DOMContentLoaded', function() {
    initializeBlogFilters();
    initializeNewsletter();
    initializeSocialSharing();
    initializeLoadMore();
    initializeBlogSearch();
    initializeBlogAnimations();
});

// ===== BLOG FILTERS =====
function initializeBlogFilters() {
    const categoryLinks = document.querySelectorAll('.category-link');
    const articles = document.querySelectorAll('.blog-article, .featured-article');

    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const category = this.dataset.category;
            
            // Update active category
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Filter articles
            filterArticles(category, articles);
        });
    });
}

function filterArticles(category, articles) {
    articles.forEach(article => {
        if (category === 'all') {
            article.style.display = 'block';
            article.classList.add('animate-in');
        } else {
            const articleCategory = article.querySelector('.article-category').textContent.toLowerCase();
            if (articleCategory === category) {
                article.style.display = 'block';
                article.classList.add('animate-in');
            } else {
                article.style.display = 'none';
                article.classList.remove('animate-in');
            }
        }
    });
}

// ===== NEWSLETTER SUBSCRIPTION =====
function initializeNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewsletterSubmission(this);
        });
    }
}

function handleNewsletterSubmission(form) {
    const formData = new FormData(form);
    const email = formData.get('email');
    const interests = formData.get('interests');
    
    // Validate email
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('.newsletter-submit');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Subscribing...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Save subscription
        const subscription = {
            email: email,
            interests: interests,
            subscribedAt: new Date().toISOString()
        };
        
        const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
        subscriptions.push(subscription);
        localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
        
        // Show success
        showNotification('Successfully subscribed to newsletter!', 'success');
        
        // Reset form
        form.reset();
    }, 2000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== SOCIAL SHARING =====
function initializeSocialSharing() {
    const shareButtons = document.querySelectorAll('.share-link');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.className.split(' ')[1];
            shareArticle(platform);
        });
    });
}

function shareArticle(platform) {
    const url = window.location.href;
    const title = document.title;
    const text = 'Check out this amazing safari breakfast experience!';
    
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
    };
    
    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copied to clipboard!', 'success');
        });
    }
}

// ===== LOAD MORE ARTICLES =====
function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreArticles');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreArticles(this);
        });
    }
}

function loadMoreArticles(button) {
    // Show loading state
    const originalText = button.textContent;
    button.textContent = 'Loading...';
    button.disabled = true;
    
    // Simulate loading more articles
    setTimeout(() => {
        // Create new articles (in real app, this would be an API call)
        const articlesGrid = document.querySelector('.articles-grid');
        const newArticles = createMockArticles(3);
        
        newArticles.forEach((article, index) => {
            setTimeout(() => {
                articlesGrid.appendChild(article);
                article.classList.add('animate-in');
            }, index * 200);
        });
        
        // Reset button
        button.textContent = originalText;
        button.disabled = false;
        
        showNotification('More articles loaded!', 'success');
    }, 1500);
}

function createMockArticles(count) {
    const articles = [];
    const mockData = [
        {
            title: 'Desert Wildlife Photography Tips',
            category: 'Photography',
            date: 'Jan 15, 2025',
            readTime: '6 min read',
            description: 'Learn professional techniques for capturing stunning wildlife photos in the desert.',
            image: 'images/blog/desert-wildlife-photography.webp',
            tags: ['Photography', 'Wildlife', 'Tips']
        },
        {
            title: 'Traditional Emirati Cuisine Guide',
            category: 'Culture',
            date: 'Jan 15, 2025',
            readTime: '8 min read',
            description: 'Discover the rich flavors and cultural significance of traditional Emirati dishes.',
            image: 'images/blog/emirati-cuisine-guide.webp',
            tags: ['Culture', 'Food', 'Traditional']
        },
        {
            title: 'Desert Safety and Survival Tips',
            category: 'Safety',
            date: 'Jan 15, 2025',
            readTime: '5 min read',
            description: 'Essential safety guidelines for desert adventures and emergency preparedness.',
            image: 'images/blog/desert-safety-tips.webp',
            tags: ['Safety', 'Survival', 'Tips']
        }
    ];
    
    for (let i = 0; i < count; i++) {
        const data = mockData[i % mockData.length];
        const article = createArticleElement(data);
        articles.push(article);
    }
    
    return articles;
}

function createArticleElement(data) {
    const article = document.createElement('article');
    article.className = 'blog-article';
    article.innerHTML = `
        <div class="article-image">
            <img src="${data.image}" alt="${data.title}" class="article-thumbnail">
            <div class="article-badge">${data.category}</div>
        </div>
        <div class="article-content">
            <div class="article-meta">
                <span class="article-category">${data.category}</span>
                <span class="article-date">${data.date}</span>
                <span class="article-read-time">${data.readTime}</span>
            </div>
            <h3 class="article-title">${data.title}</h3>
            <p class="article-excerpt">${data.description}</p>
            <div class="article-tags">
                ${data.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <a href="blog-single.html" class="btn btn-outline">Read More</a>
        </div>
    `;
    
    return article;
}

// ===== READING PROGRESS =====
function initializeReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    document.body.appendChild(progressBar);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(138, 124, 255, 0.2);
            z-index: 1000;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            width: 0%;
            transition: width 0.1s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Update progress on scroll
    window.addEventListener('scroll', updateReadingProgress);
}

function updateReadingProgress() {
    const progressBar = document.querySelector('.progress-fill');
    if (!progressBar) return;
    
    const article = document.querySelector('.article-text');
    if (!article) return;
    
    const articleTop = article.offsetTop;
    const articleHeight = article.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollTop = window.pageYOffset;
    
    const progress = Math.min(
        Math.max((scrollTop - articleTop + windowHeight) / articleHeight, 0),
        1
    );
    
    progressBar.style.width = `${progress * 100}%`;
}

// ===== ARTICLE INTERACTIONS =====
function initializeArticleInteractions() {
    // Like functionality
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            toggleLike(this);
        });
    });
    
    // Bookmark functionality
    const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
    bookmarkButtons.forEach(button => {
        button.addEventListener('click', function() {
            toggleBookmark(this);
        });
    });
    
    // Share functionality
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            openShareMenu(this);
        });
    });
}

function toggleLike(button) {
    const isLiked = button.classList.contains('liked');
    const countElement = button.querySelector('.btn-count');
    let count = parseInt(countElement.textContent) || 0;
    
    if (isLiked) {
        button.classList.remove('liked');
        count--;
        showNotification('Removed from likes', 'info');
    } else {
        button.classList.add('liked');
        count++;
        showNotification('Added to likes!', 'success');
    }
    
    countElement.textContent = count;
}

function toggleBookmark(button) {
    const isBookmarked = button.classList.contains('bookmarked');
    
    if (isBookmarked) {
        button.classList.remove('bookmarked');
        showNotification('Removed from bookmarks', 'info');
    } else {
        button.classList.add('bookmarked');
        showNotification('Added to bookmarks!', 'success');
    }
}

function openShareMenu(button) {
    const url = window.location.href;
    const title = document.title;
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: 'Check out this amazing safari breakfast experience!',
            url: url
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copied to clipboard!', 'success');
        });
    }
}

// ===== SEARCH FUNCTIONALITY =====
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        searchArticles(query);
    });
}

function searchArticles(query) {
    const articles = document.querySelectorAll('.blog-article, .featured-article');
    
    articles.forEach(article => {
        const title = article.querySelector('.article-title').textContent.toLowerCase();
        const excerpt = article.querySelector('.article-excerpt').textContent.toLowerCase();
        const tags = Array.from(article.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        
        const matches = title.includes(query) || 
                       excerpt.includes(query) || 
                       tags.some(tag => tag.includes(query));
        
        if (matches) {
            article.style.display = 'block';
            article.classList.add('animate-in');
        } else {
            article.style.display = 'none';
            article.classList.remove('animate-in');
        }
    });
}

// ===== BLOG SEARCH =====
function initializeBlogSearch() {
    const searchInput = document.getElementById('blogSearch');
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        clearTimeout(searchTimeout);
        
        if (query.length < 2) {
            searchSuggestions.style.display = 'none';
            return;
        }
        
        searchTimeout = setTimeout(() => {
            performSearch(query);
            showSearchSuggestions(query);
        }, 300);
    });
    
    searchInput.addEventListener('focus', function() {
        if (this.value.trim().length >= 2) {
            showSearchSuggestions(this.value.trim());
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
            searchSuggestions.style.display = 'none';
        }
    });
}

function performSearch(query) {
    const articles = document.querySelectorAll('.blog-article, .featured-article');
    const searchResults = [];
    
    articles.forEach(article => {
        const title = article.querySelector('.article-title').textContent.toLowerCase();
        const excerpt = article.querySelector('.article-excerpt').textContent.toLowerCase();
        const tags = Array.from(article.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        const category = article.querySelector('.article-category').textContent.toLowerCase();
        
        const matches = title.includes(query.toLowerCase()) || 
                       excerpt.includes(query.toLowerCase()) || 
                       tags.some(tag => tag.includes(query.toLowerCase())) ||
                       category.includes(query.toLowerCase());
        
        if (matches) {
            article.style.display = 'block';
            article.classList.add('animate-in');
            searchResults.push({
                title: article.querySelector('.article-title').textContent,
                excerpt: article.querySelector('.article-excerpt').textContent,
                category: article.querySelector('.article-category').textContent,
                element: article
            });
        } else {
            article.style.display = 'none';
            article.classList.remove('animate-in');
        }
    });
    
    // Update search results count
    updateSearchResultsCount(searchResults.length);
}

function showSearchSuggestions(query) {
    const searchSuggestions = document.getElementById('searchSuggestions');
    const articles = document.querySelectorAll('.blog-article, .featured-article');
    const suggestions = [];
    
    articles.forEach(article => {
        const title = article.querySelector('.article-title').textContent;
        const category = article.querySelector('.article-category').textContent;
        
        if (title.toLowerCase().includes(query.toLowerCase()) || 
            category.toLowerCase().includes(query.toLowerCase())) {
            suggestions.push({
                title: title,
                category: category,
                element: article
            });
        }
    });
    
    if (suggestions.length > 0) {
        searchSuggestions.innerHTML = suggestions.slice(0, 5).map(suggestion => 
            `<div class="search-suggestion" data-article="${suggestion.element.dataset.id || ''}">
                <div class="suggestion-title">${suggestion.title}</div>
                <div class="suggestion-category">${suggestion.category}</div>
            </div>`
        ).join('');
        
        searchSuggestions.style.display = 'block';
        
        // Add click handlers to suggestions
        searchSuggestions.querySelectorAll('.search-suggestion').forEach(suggestion => {
            suggestion.addEventListener('click', function() {
                const articleElement = suggestions.find(s => s.title === this.querySelector('.suggestion-title').textContent)?.element;
                if (articleElement) {
                    articleElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    articleElement.style.animation = 'highlight 2s ease-out';
                }
                searchSuggestions.style.display = 'none';
            });
        });
    } else {
        searchSuggestions.style.display = 'none';
    }
}

function updateSearchResultsCount(count) {
    let resultsCounter = document.querySelector('.search-results-count');
    if (!resultsCounter) {
        resultsCounter = document.createElement('div');
        resultsCounter.className = 'search-results-count';
        document.querySelector('.blog-main').insertBefore(resultsCounter, document.querySelector('.articles-grid'));
    }
    
    if (count > 0) {
        resultsCounter.innerHTML = `<p>Found ${count} article${count !== 1 ? 's' : ''} matching your search</p>`;
        resultsCounter.style.display = 'block';
    } else {
        resultsCounter.style.display = 'none';
    }
}

// ===== BLOG ANIMATIONS =====
function initializeBlogAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.blog-article, .featured-article, .sidebar-widget');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Add highlight animation for search results
    const style = document.createElement('style');
    style.textContent = `
        @keyframes highlight {
            0% { background-color: rgba(138, 124, 255, 0.3); }
            100% { background-color: transparent; }
        }
        
        .search-results-count {
            background: var(--bg-secondary);
            padding: 15px 20px;
            border-radius: var(--border-radius);
            border: 2px solid var(--primary);
            margin-bottom: var(--spacing-lg);
            text-align: center;
        }
        
        .search-results-count p {
            color: var(--text-primary);
            margin: 0;
            font-weight: var(--fw-medium);
        }
        
        .suggestion-title {
            font-weight: var(--fw-bold);
            color: var(--text-primary);
            margin-bottom: 5px;
        }
        
        .suggestion-category {
            font-size: 12px;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
    `;
    document.head.appendChild(style);
}

// ===== INITIALIZE ALL FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    initializeReadingProgress();
    initializeArticleInteractions();
    initializeSearch();
});
