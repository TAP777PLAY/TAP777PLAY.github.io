// Zoos Page Interactive Elements

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Leaflet Map
    initializeMap();
    
    // Initialize Accordions
    initializeAccordions();
    
    // Initialize Gallery Modal
    initializeGallery();
    
    // Initialize Booking Form
    initializeBookingForm();
    
    // Initialize Timeline Animation
    initializeTimeline();
});

// Map Initialization
function initializeMap() {
    // Initialize the map centered on UAE
    const map = L.map('zoo-map').setView([24.2992, 54.6973], 8);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Define zoo locations with different colors
    const zooLocations = [
        {
            name: 'Dubai Safari Park',
            location: [25.2048, 55.2708],
            color: '#7B2FF7',
            description: 'Largest petting zoo in Dubai with giraffes, camels, and goats'
        },
        {
            name: 'Al Ain Zoo',
            location: [24.2075, 55.7447],
            color: '#B366FF',
            description: 'Historic zoo with elephants, giraffes, and conservation programs'
        },
        {
            name: 'Abu Dhabi Petting Zoo',
            location: [24.4539, 54.3773],
            color: '#00C9FF',
            description: 'Perfect for young children with farm animals and educational workshops'
        },
        {
            name: 'Dubai Miracle Garden Zoo',
            location: [25.0667, 55.1833],
            color: '#7B2FF7',
            description: 'Beautiful setting with butterflies, birds, and small animals'
        }
    ];
    
    // Add markers for each zoo
    zooLocations.forEach(zoo => {
        const marker = L.circleMarker(zoo.location, {
            radius: 15,
            fillColor: zoo.color,
            color: '#FFFFFF',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);
        
        // Add popup with zoo information
        marker.bindPopup(`
            <div style="color: #0B021F; font-family: 'Poppins', sans-serif;">
                <h3 style="color: ${zoo.color}; margin: 0 0 10px 0;">${zoo.name}</h3>
                <p style="margin: 0; color: #666;">${zoo.description}</p>
                <button onclick="scrollToZoo('${zoo.name}')" 
                        style="background: ${zoo.color}; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-top: 10px;">
                    View Details
                </button>
            </div>
        `);
        
        // Add hover effect
        marker.on('mouseover', function() {
            this.setStyle({
                radius: 20,
                fillOpacity: 1
            });
        });
        
        marker.on('mouseout', function() {
            this.setStyle({
                radius: 15,
                fillOpacity: 0.8
            });
        });
    });
}

// Scroll to specific zoo in table
function scrollToZoo(zooName) {
    const table = document.querySelector('.comparison-table');
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const nameCell = row.querySelector('.zoo-name strong');
        if (nameCell && nameCell.textContent.includes(zooName)) {
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            row.style.background = 'rgba(123, 47, 247, 0.1)';
            setTimeout(() => {
                row.style.background = '';
            }, 3000);
        }
    });
}

// Accordion Functionality
function initializeAccordions() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all accordions
            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Open clicked accordion if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Gallery Modal Functionality
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.close');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            modalImage.src = img.src;
            modalImage.alt = img.alt;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Booking Form Functionality
function initializeBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(bookingForm);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!data.visitorName || !data.visitorEmail || !data.selectedZoo || !data.visitDate) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.visitorEmail)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Validate date (must be in the future)
        const selectedDate = new Date(data.visitDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showNotification('Please select a future date', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Booking...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('Booking request submitted successfully! We will contact you soon.', 'success');
            bookingForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
    
    // Set minimum date to today
    const dateInput = document.getElementById('visitDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// Timeline Animation
function initializeTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 200);
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-50px)';
        item.style.transition = 'all 0.6s ease-in-out';
        timelineObserver.observe(item);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00C9FF' : type === 'error' ? '#FF6B6B' : '#7B2FF7'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 400px;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Table Row Click Handlers
document.addEventListener('DOMContentLoaded', function() {
    const tableRows = document.querySelectorAll('.comparison-table tbody tr');
    
    tableRows.forEach(row => {
        const viewBtn = row.querySelector('.btn-secondary');
        
        viewBtn.addEventListener('click', () => {
            const zooName = row.querySelector('.zoo-name strong').textContent;
            const accordionItem = document.querySelector(`.accordion-item:has(.accordion-header h3:contains("${zooName}"))`);
            
            if (accordionItem) {
                // Close all accordions first
                document.querySelectorAll('.accordion-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Open the matching accordion
                accordionItem.classList.add('active');
                accordionItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
});

// Enhanced Table Interactions
document.addEventListener('DOMContentLoaded', function() {
    const table = document.querySelector('.comparison-table');
    
    if (table) {
        // Add hover effects to table rows
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(123, 47, 247, 0.1)';
                this.style.transform = 'scale(1.02)';
                this.style.transition = 'all 0.3s ease';
            });
            
            row.addEventListener('mouseleave', function() {
                this.style.background = '';
                this.style.transform = 'scale(1)';
            });
        });
    }
});

// Smooth scrolling for internal links
document.addEventListener('DOMContentLoaded', function() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Form Validation Enhancement
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookingForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
});

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    
    // Remove existing error styling
    clearFieldError(field);
    
    // Validate based on field type
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (fieldName === 'visitorEmail' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    if (fieldName === 'visitDate' && value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showFieldError(field, 'Please select a future date');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.style.borderColor = '#FF6B6B';
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: #FF6B6B;
        font-size: 12px;
        margin-top: 4px;
        font-family: 'Poppins', sans-serif;
    `;
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}
