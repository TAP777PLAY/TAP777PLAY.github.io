// Simple Map Integration for Chronicles of Olympus

// Initialize map animations
function initMapAnimations() {
    const mapContainer = document.querySelector('.map-container');
    
    if (mapContainer) {
        // Add intersection observer for animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(mapContainer);
    }
}

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', function() {
    initMapAnimations();
});

// Export functions
window.MapController = {
    initMapAnimations
};