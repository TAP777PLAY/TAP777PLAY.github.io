// Markets Page JavaScript - Interactive Charts and Animations

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all markets page functionality
    initTabSwitching();
    initInteractiveCharts();
    initScrollAnimations();
    initHoverAnimations();
    initMarketDataSimulation();
});

// Tab switching functionality with smooth animations
function initTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show target panel with animation
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
                
                // Reinitialize charts for the active tab
                setTimeout(() => {
                    initChartsForTab(targetTab);
                }, 300);
            }
            
            // Track tab switching
            trackEvent('tab_switched', {
                tab: targetTab,
                timestamp: new Date().toISOString()
            });
        });
    });
}

// Initialize interactive charts using Chart.js
function initInteractiveCharts() {
    // Initialize all charts
    initStockIndicesChart();
    initCurrencyChart();
    initFintechChart();
    initCryptoChart();
}

function initStockIndicesChart() {
    const ctx = document.getElementById('stockIndicesChart');
    if (!ctx) return;
    
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'S&P 500',
                data: [4200, 4350, 4100, 4400, 4600, 4500, 4700, 4800, 4600, 4800, 4900, 5000],
                borderColor: '#5C7BA0',
                backgroundColor: 'rgba(92, 123, 160, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'NASDAQ',
                data: [13000, 13500, 12500, 14000, 15000, 14500, 15500, 16000, 15000, 16000, 16500, 17000],
                borderColor: '#BFA36F',
                backgroundColor: 'rgba(191, 163, 111, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'FTSE 100',
                data: [7500, 7600, 7400, 7700, 7800, 7750, 7850, 7900, 7800, 7900, 7950, 8000],
                borderColor: '#C7BBA3',
                backgroundColor: 'rgba(199, 187, 163, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: '#5C7BA0',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                y: {
                    display: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
    
    // Add hover effects
    ctx.addEventListener('mouseenter', () => {
        chart.options.animation.duration = 0;
    });
}

function initCurrencyChart() {
    const ctx = document.getElementById('currencyChart');
    if (!ctx) return;
    
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'AED'],
            datasets: [{
                label: 'Currency Strength vs USD',
                data: [0.95, 1.02, 0.98, 1.05, 0.92, 0.88, 1.00],
                backgroundColor: [
                    '#5C7BA0',
                    '#BFA36F',
                    '#C7BBA3',
                    '#8E8E8E',
                    '#2E2E2E',
                    '#F7F5F3',
                    '#4E6C8F'
                ],
                borderColor: '#5C7BA0',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y > 1 ? 
                                `Stronger than USD (+${((context.parsed.y - 1) * 100).toFixed(1)}%)` :
                                `Weaker than USD (${((context.parsed.y - 1) * 100).toFixed(1)}%)`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(2);
                        }
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutBounce'
            }
        }
    });
}

function initFintechChart() {
    const ctx = document.getElementById('fintechChart');
    if (!ctx) return;
    
    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Digital Payments', 'Digital Banking', 'Investment Tech', 'RegTech', 'InsurTech', 'Other'],
            datasets: [{
                data: [35, 25, 20, 10, 5, 5],
                backgroundColor: [
                    '#5C7BA0',
                    '#BFA36F',
                    '#C7BBA3',
                    '#8E8E8E',
                    '#2E2E2E',
                    '#F7F5F3'
                ],
                borderWidth: 2,
                borderColor: '#FFFFFF'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                duration: 2000
            }
        }
    });
}

function initCryptoChart() {
    const ctx = document.getElementById('cryptoChart');
    if (!ctx) return;
    
    const chart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Market Cap', 'Trading Volume', 'Adoption', 'Volatility', 'Regulation', 'Innovation'],
            datasets: [{
                label: 'Bitcoin',
                data: [95, 85, 70, 60, 50, 80],
                borderColor: '#F7931A',
                backgroundColor: 'rgba(247, 147, 26, 0.2)',
                pointBackgroundColor: '#F7931A'
            }, {
                label: 'Ethereum',
                data: [80, 90, 85, 70, 60, 95],
                borderColor: '#627EEA',
                backgroundColor: 'rgba(98, 126, 234, 0.2)',
                pointBackgroundColor: '#627EEA'
            }, {
                label: 'Binance Coin',
                data: [70, 75, 60, 80, 40, 70],
                borderColor: '#F3BA2F',
                backgroundColor: 'rgba(243, 186, 47, 0.2)',
                pointBackgroundColor: '#F3BA2F'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Initialize charts for specific tab
function initChartsForTab(tabName) {
    switch(tabName) {
        case 'global-markets':
            // Charts are already initialized
            break;
        case 'fintech-trends':
            // Fintech chart is already initialized
            break;
        case 'crypto-analysis':
            // Crypto chart is already initialized
            break;
    }
}

// Scroll animations for market page
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Special handling for different card types
                if (entry.target.classList.contains('trend-card')) {
                    const cards = entry.target.parentElement.querySelectorAll('.trend-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animate');
                        }, index * 200);
                    });
                }
                
                if (entry.target.classList.contains('tech-card')) {
                    const cards = entry.target.parentElement.querySelectorAll('.tech-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animate');
                        }, index * 150);
                    });
                }
                
                if (entry.target.classList.contains('insight-card')) {
                    const cards = entry.target.parentElement.querySelectorAll('.insight-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animate');
                        }, index * 200);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.trend-card, .tech-card, .insight-card, .sector-card, .crypto-stat'
    );
    
    animatedElements.forEach(el => observer.observe(el));
}

// Enhanced hover animations
function initHoverAnimations() {
    // Add hover effects to trend cards
    const trendCards = document.querySelectorAll('.trend-card');
    trendCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        });
    });
    
    // Add hover effects to tech cards
    const techCards = document.querySelectorAll('.tech-card');
    techCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const image = card.querySelector('.tech-image img');
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const image = card.querySelector('.tech-image img');
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
    });
    
    // Add hover effects to sector cards
    const sectorCards = document.querySelectorAll('.sector-card');
    sectorCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) rotate(1deg)';
            card.style.borderColor = 'var(--accent)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotate(0deg)';
            card.style.borderColor = 'transparent';
        });
    });
}

// Market data simulation
function initMarketDataSimulation() {
    // Simulate real-time data updates
    setInterval(() => {
        updateMarketMetrics();
    }, 5000);
    
    // Add click handlers for interactive elements
    addInteractiveHandlers();
}

function updateMarketMetrics() {
    // Update trend card metrics with random changes
    const metrics = document.querySelectorAll('.metric');
    metrics.forEach(metric => {
        if (metric.classList.contains('positive') || metric.classList.contains('negative')) {
            const currentValue = parseFloat(metric.textContent);
            const change = (Math.random() - 0.5) * 0.5; // Random change between -0.25 and +0.25
            const newValue = currentValue + change;
            
            // Animate the change
            animateValueChange(metric, currentValue, newValue);
        }
    });
}

function animateValueChange(element, startValue, endValue) {
    const duration = 1000;
    const startTime = performance.now();
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = startValue + (endValue - startValue) * progress;
        element.textContent = currentValue.toFixed(1) + '%';
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }
    
    requestAnimationFrame(updateValue);
}

function addInteractiveHandlers() {
    // Add click handlers for heatmap items
    const heatmapItems = document.querySelectorAll('.heatmap-item');
    heatmapItems.forEach(item => {
        item.addEventListener('click', () => {
            const country = item.querySelector('.country').textContent;
            const change = item.querySelector('.change').textContent;
            
            // Show detailed information
            showMarketDetail(country, change);
            
            // Track interaction
            trackEvent('heatmap_clicked', {
                country: country,
                change: change
            });
        });
    });
    
    // Add click handlers for trend items
    const trendItems = document.querySelectorAll('.trend-item');
    trendItems.forEach(item => {
        item.addEventListener('click', () => {
            const title = item.querySelector('h4').textContent;
            
            // Show trend details
            showTrendDetail(title);
            
            // Track interaction
            trackEvent('trend_clicked', {
                trend: title
            });
        });
    });
}

function showMarketDetail(country, change) {
    // Create modal or tooltip with detailed information
    const modal = document.createElement('div');
    modal.className = 'market-detail-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${country} Market Details</h3>
            <p>Current Change: ${change}</p>
            <p>Market Status: ${change.includes('+') ? 'Positive' : 'Negative'}</p>
            <button class="btn btn-primary" onclick="this.closest('.market-detail-modal').remove()">Close</button>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    document.body.appendChild(modal);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (modal.parentNode) {
            modal.remove();
        }
    }, 3000);
}

function showTrendDetail(trend) {
    // Create tooltip with trend details
    const tooltip = document.createElement('div');
    tooltip.className = 'trend-detail-tooltip';
    tooltip.innerHTML = `
        <h4>${trend}</h4>
        <p>Click for more detailed analysis and market insights.</p>
    `;
    
    tooltip.style.cssText = `
        position: fixed;
        background: var(--text-primary);
        color: white;
        padding: var(--spacing-md);
        border-radius: var(--radius-medium);
        z-index: 1000;
        max-width: 300px;
        box-shadow: var(--shadow-medium);
    `;
    
    document.body.appendChild(tooltip);
    
    // Position tooltip near cursor
    document.addEventListener('mousemove', (e) => {
        tooltip.style.left = e.clientX + 10 + 'px';
        tooltip.style.top = e.clientY - 10 + 'px';
    });
    
    // Remove tooltip after 2 seconds
    setTimeout(() => {
        if (tooltip.parentNode) {
            tooltip.remove();
        }
    }, 2000);
}

// Enhanced tracking for markets page
function trackEvent(eventName, properties = {}) {
    const analyticsData = {
        page: 'markets',
        timestamp: new Date().toISOString(),
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        ...properties
    };
    
    console.log('Markets Event:', eventName, analyticsData);
    
    // Store in localStorage for debugging
    const events = JSON.parse(localStorage.getItem('markets_events') || '[]');
    events.push({ event: eventName, data: analyticsData });
    localStorage.setItem('markets_events', JSON.stringify(events));
}

// Chart interaction tracking
function initChartInteractionTracking() {
    const charts = document.querySelectorAll('canvas');
    
    charts.forEach(canvas => {
        canvas.addEventListener('click', (e) => {
            const chart = Chart.getChart(canvas);
            if (chart) {
                const activePoints = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
                
                if (activePoints.length > 0) {
                    const point = activePoints[0];
                    const dataset = chart.data.datasets[point.datasetIndex];
                    const label = chart.data.labels[point.index];
                    const value = dataset.data[point.index];
                    
                    trackEvent('chart_point_clicked', {
                        chart_type: chart.config.type,
                        dataset_label: dataset.label,
                        point_label: label,
                        point_value: value
                    });
                }
            }
        });
    });
}

// Initialize chart interaction tracking
initChartInteractionTracking();

// Performance monitoring for markets page
function initMarketsPerformanceMonitoring() {
    // Monitor chart rendering performance
    const chartContainers = document.querySelectorAll('.chart-container');
    
    chartContainers.forEach(container => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const startTime = performance.now();
                    
                    // Simulate chart rendering time
                    setTimeout(() => {
                        const renderTime = performance.now() - startTime;
                        
                        trackEvent('chart_render_performance', {
                            chart_id: entry.target.querySelector('canvas')?.id,
                            render_time: renderTime
                        });
                    }, 100);
                }
            });
        });
        
        observer.observe(container);
    });
}

// Initialize performance monitoring
initMarketsPerformanceMonitoring();

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initTabSwitching,
        initInteractiveCharts,
        initScrollAnimations,
        trackEvent
    };
}
