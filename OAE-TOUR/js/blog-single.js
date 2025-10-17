/* ===== BLOG SINGLE PAGE JAVASCRIPT ===== */

document.addEventListener('DOMContentLoaded', function() {
    initializeBlogSingle();
    initializeArticleInteractions();
    initializeTableOfContents();
    initializeReadingProgress();
    initializeSocialSharing();
});

// ===== BLOG SINGLE INITIALIZATION =====
function initializeBlogSingle() {
    // Initialize reading progress
    initializeReadingProgress();
    
    // Initialize article interactions
    initializeArticleInteractions();
    
    // Initialize table of contents
    initializeTableOfContents();
    
    // Initialize social sharing
    initializeSocialSharing();
    
    // Initialize related articles
    initializeRelatedArticles();
}

// ===== ARTICLE INTERACTIONS =====
function initializeArticleInteractions() {
    // Like button functionality
    const likeBtn = document.getElementById('likeBtn');
    if (likeBtn) {
        likeBtn.addEventListener('click', function() {
            toggleLike(this);
        });
    }
    
    // Bookmark button functionality
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', function() {
            toggleBookmark(this);
        });
    }
    
    // Share button functionality
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            openShareMenu();
        });
    }
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
    
    // Save to localStorage
    const articleId = window.location.pathname;
    const likes = JSON.parse(localStorage.getItem('articleLikes') || '{}');
    likes[articleId] = isLiked ? 0 : 1;
    localStorage.setItem('articleLikes', JSON.stringify(likes));
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
    
    // Save to localStorage
    const articleId = window.location.pathname;
    const bookmarks = JSON.parse(localStorage.getItem('articleBookmarks') || '{}');
    bookmarks[articleId] = !isBookmarked;
    localStorage.setItem('articleBookmarks', JSON.stringify(bookmarks));
}

function openShareMenu() {
    const url = window.location.href;
    const title = document.title;
    const text = 'Check out this amazing desert adventure article!';
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copied to clipboard!', 'success');
        });
    }
}

// ===== TABLE OF CONTENTS =====
function initializeTableOfContents() {
    const tocLinks = document.querySelectorAll('.toc-link');
    
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Highlight current section in TOC
    highlightCurrentSection();
}

function highlightCurrentSection() {
    const sections = document.querySelectorAll('.article-text h2, .article-text h3');
    const tocLinks = document.querySelectorAll('.toc-link');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all TOC links
                tocLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to corresponding TOC link
                const targetId = entry.target.id;
                const correspondingLink = document.querySelector(`.toc-link[href="#${targetId}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-100px 0px -50% 0px'
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// ===== READING PROGRESS =====
function initializeReadingProgress() {
    // Create progress bar
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

// ===== SOCIAL SHARING =====
function initializeSocialSharing() {
    const shareLinks = document.querySelectorAll('.share-link');
    
    shareLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.className.split(' ')[1];
            shareArticle(platform);
        });
    });
}

function shareArticle(platform) {
    const url = window.location.href;
    const title = document.title;
    const text = 'Check out this amazing desert adventure article!';
    
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

// ===== RELATED ARTICLES =====
function initializeRelatedArticles() {
    const relatedArticles = document.querySelectorAll('.related-article, .similar-article');
    
    relatedArticles.forEach(article => {
        article.addEventListener('click', function() {
            // Track article click
            trackEvent('Blog', 'Related Article Click', this.querySelector('.related-title, .article-title').textContent);
        });
    });
}

// ===== ARTICLE STATISTICS =====
function trackArticleView() {
    const articleId = window.location.pathname;
    const views = JSON.parse(localStorage.getItem('articleViews') || '{}');
    views[articleId] = (views[articleId] || 0) + 1;
    localStorage.setItem('articleViews', JSON.stringify(views));
    
    // Update view count display
    const viewElement = document.querySelector('.article-views');
    if (viewElement) {
        viewElement.textContent = `${views[articleId]} views`;
    }
}

// ===== COMMENTS SYSTEM (PLACEHOLDER) =====
function initializeComments() {
    // This would integrate with a comments system like Disqus or custom backend
    console.log('Comments system would be initialized here');
}

// ===== PRINT FUNCTIONALITY =====
function initializePrintFunctionality() {
    // Add print button if needed
    const printBtn = document.createElement('button');
    printBtn.className = 'btn btn-outline print-btn';
    printBtn.innerHTML = '🖨️ Print Article';
    printBtn.addEventListener('click', function() {
        window.print();
    });
    
    // Add to article actions if needed
    const articleActions = document.querySelector('.article-actions');
    if (articleActions) {
        articleActions.appendChild(printBtn);
    }
}

// ===== ARTICLE BOOKMARKING =====
function loadArticleState() {
    const articleId = window.location.pathname;
    
    // Load like state
    const likes = JSON.parse(localStorage.getItem('articleLikes') || '{}');
    if (likes[articleId]) {
        const likeBtn = document.getElementById('likeBtn');
        if (likeBtn) {
            likeBtn.classList.add('liked');
        }
    }
    
    // Load bookmark state
    const bookmarks = JSON.parse(localStorage.getItem('articleBookmarks') || '{}');
    if (bookmarks[articleId]) {
        const bookmarkBtn = document.getElementById('bookmarkBtn');
        if (bookmarkBtn) {
            bookmarkBtn.classList.add('bookmarked');
        }
    }
}

// ===== ARTICLE RATING =====
function initializeArticleRating() {
    // This would implement a star rating system
    const ratingContainer = document.createElement('div');
    ratingContainer.className = 'article-rating';
    ratingContainer.innerHTML = `
        <div class="rating-stars">
            <span class="star" data-rating="1">★</span>
            <span class="star" data-rating="2">★</span>
            <span class="star" data-rating="3">★</span>
            <span class="star" data-rating="4">★</span>
            <span class="star" data-rating="5">★</span>
        </div>
        <span class="rating-text">Rate this article</span>
    `;
    
    // Add rating functionality
    const stars = ratingContainer.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.dataset.rating;
            rateArticle(rating);
        });
        
        star.addEventListener('mouseenter', function() {
            highlightStars(this.dataset.rating);
        });
    });
    
    ratingContainer.addEventListener('mouseleave', function() {
        clearStarHighlight();
    });
}

function rateArticle(rating) {
    const articleId = window.location.pathname;
    const ratings = JSON.parse(localStorage.getItem('articleRatings') || '{}');
    ratings[articleId] = parseInt(rating);
    localStorage.setItem('articleRatings', JSON.stringify(ratings));
    
    showNotification(`Thank you for rating this article ${rating} stars!`, 'success');
    updateRatingDisplay(rating);
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('highlighted');
        } else {
            star.classList.remove('highlighted');
        }
    });
}

function clearStarHighlight() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => star.classList.remove('highlighted'));
}

function updateRatingDisplay(rating) {
    const ratingText = document.querySelector('.rating-text');
    if (ratingText) {
        ratingText.textContent = `You rated this article ${rating} stars`;
    }
}

// ===== INITIALIZE ALL FEATURES =====
document.addEventListener('DOMContentLoaded', function() {
    trackArticleView();
    loadArticleState();
    initializeComments();
    initializePrintFunctionality();
    initializeArticleRating();
});

// ===== UTILITY FUNCTIONS =====
function trackEvent(category, action, label, value) {
    // Google Analytics tracking (in real app)
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
    
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleLike,
        toggleBookmark,
        shareArticle,
        trackArticleView
    };
}
