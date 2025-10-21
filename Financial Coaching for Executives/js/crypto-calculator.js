// Crypto Investment Calculator
(function() {
  'use strict';

  // Crypto data with historical performance and risk metrics
  const cryptoData = {
    bitcoin: {
      name: 'Bitcoin',
      symbol: 'BTC',
      conservativeReturn: 0.08, // 8% annual
      moderateReturn: 0.20,     // 20% annual
      aggressiveReturn: 0.35,   // 35% annual
      volatility: 0.65,         // 65% volatility
      correlation: 0.8,         // 0.8 correlation with market
      riskLevel: 'high',
      marketTrend: 'bullish',
      regulatory: 'evolving',
      adoption: 'institutional'
    },
    ethereum: {
      name: 'Ethereum',
      symbol: 'ETH',
      conservativeReturn: 0.12,
      moderateReturn: 0.25,
      aggressiveReturn: 0.40,
      volatility: 0.70,
      correlation: 0.75,
      riskLevel: 'high',
      marketTrend: 'bullish',
      regulatory: 'stable',
      adoption: 'growing'
    },
    cardano: {
      name: 'Cardano',
      symbol: 'ADA',
      conservativeReturn: 0.10,
      moderateReturn: 0.22,
      aggressiveReturn: 0.38,
      volatility: 0.75,
      correlation: 0.70,
      riskLevel: 'very-high',
      marketTrend: 'neutral',
      regulatory: 'stable',
      adoption: 'developing'
    },
    solana: {
      name: 'Solana',
      symbol: 'SOL',
      conservativeReturn: 0.15,
      moderateReturn: 0.30,
      aggressiveReturn: 0.45,
      volatility: 0.80,
      correlation: 0.65,
      riskLevel: 'very-high',
      marketTrend: 'bullish',
      regulatory: 'evolving',
      adoption: 'growing'
    },
    polygon: {
      name: 'Polygon',
      symbol: 'MATIC',
      conservativeReturn: 0.18,
      moderateReturn: 0.35,
      aggressiveReturn: 0.50,
      volatility: 0.85,
      correlation: 0.60,
      riskLevel: 'very-high',
      marketTrend: 'bullish',
      regulatory: 'stable',
      adoption: 'growing'
    }
  };

  // Risk level configurations
  const riskConfigs = {
    conservative: {
      multiplier: 0.6,
      label: 'Conservative',
      color: '#10b981'
    },
    moderate: {
      multiplier: 1.0,
      label: 'Moderate',
      color: '#f59e0b'
    },
    aggressive: {
      multiplier: 1.4,
      label: 'Aggressive',
      color: '#ef4444'
    }
  };

  // Market insights data
  const marketInsights = {
    bullish: {
      icon: '📈',
      text: 'Current market trend: Bullish',
      color: '#10b981'
    },
    bearish: {
      icon: '📉',
      text: 'Current market trend: Bearish',
      color: '#ef4444'
    },
    neutral: {
      icon: '➡️',
      text: 'Current market trend: Neutral',
      color: '#f59e0b'
    },
    stable: {
      icon: '⚠️',
      text: 'Regulatory environment: Stable',
      color: '#10b981'
    },
    evolving: {
      icon: '🔄',
      text: 'Regulatory environment: Evolving',
      color: '#f59e0b'
    },
    growing: {
      icon: '🔮',
      text: 'Adoption rate: Growing',
      color: '#10b981'
    },
    institutional: {
      icon: '🏛️',
      text: 'Adoption rate: Institutional',
      color: '#3b82f6'
    },
    developing: {
      icon: '🚧',
      text: 'Adoption rate: Developing',
      color: '#f59e0b'
    }
  };

  // DOM elements
  let elements = {};

  // Initialize calculator
  function init() {
    elements = {
      initialInvestment: document.getElementById('initial-investment'),
      cryptoSelect: document.getElementById('crypto-select'),
      timeHorizon: document.getElementById('time-horizon'),
      rangeValue: document.querySelector('.range-value'),
      riskLevel: document.getElementById('risk-level'),
      calculateBtn: document.querySelector('.crypto-calc__calculate'),
      conservativeReturn: document.getElementById('conservative-return'),
      moderateReturn: document.getElementById('moderate-return'),
      aggressiveReturn: document.getElementById('aggressive-return'),
      riskFill: document.getElementById('risk-fill'),
      riskText: document.getElementById('risk-text'),
      volatilityValue: document.getElementById('volatility-value'),
      correlationValue: document.getElementById('correlation-value'),
      marketInsights: document.getElementById('market-insights')
    };

    if (!elements.initialInvestment) return; // Calculator not on this page

    setupEventListeners();
    updateRangeValue();
    updateMarketInsights();
    
    // Auto-calculate with default values on page load
    setTimeout(() => {
      calculateProjections();
    }, 500);
  }

  // Setup event listeners
  function setupEventListeners() {
    // Range slider
    elements.timeHorizon.addEventListener('input', updateRangeValue);
    
    // Calculate button
    elements.calculateBtn.addEventListener('click', calculateProjections);
    
    // Auto-calculate on input change
    elements.initialInvestment.addEventListener('input', debounce(calculateProjections, 500));
    elements.cryptoSelect.addEventListener('change', () => {
      updateMarketInsights();
      calculateProjections();
    });
    elements.timeHorizon.addEventListener('input', debounce(calculateProjections, 300));
    elements.riskLevel.addEventListener('change', calculateProjections);
  }

  // Update range value display
  function updateRangeValue() {
    const value = elements.timeHorizon.value;
    elements.rangeValue.textContent = `${value} year${value !== '1' ? 's' : ''}`;
  }

  // Update market insights based on selected crypto
  function updateMarketInsights() {
    const selectedCrypto = elements.cryptoSelect.value;
    const crypto = cryptoData[selectedCrypto];
    
    if (!crypto) return;

    const insights = [
      marketInsights[crypto.marketTrend],
      marketInsights[crypto.regulatory],
      marketInsights[crypto.adoption]
    ];

    elements.marketInsights.innerHTML = insights.map(insight => `
      <div class="insight-item">
        <span class="insight-icon">${insight.icon}</span>
        <span class="insight-text">${insight.text}</span>
      </div>
    `).join('');
  }

  // Calculate compound interest
  function calculateCompoundInterest(principal, rate, time) {
    return principal * Math.pow(1 + rate, time);
  }

  // Calculate projections
  function calculateProjections() {
    const initialInvestment = parseFloat(elements.initialInvestment.value) || 0;
    const selectedCrypto = elements.cryptoSelect.value;
    const timeHorizon = parseInt(elements.timeHorizon.value);
    const riskLevel = elements.riskLevel.value;

    if (initialInvestment <= 0) {
      resetResults();
      return;
    }

    const crypto = cryptoData[selectedCrypto];
    if (!crypto) return;

    // Add loading animation to result values
    animateResultValues();

    // Calculate returns for each scenario
    const conservativeReturn = calculateCompoundInterest(
      initialInvestment, 
      crypto.conservativeReturn, 
      timeHorizon
    );
    
    const moderateReturn = calculateCompoundInterest(
      initialInvestment, 
      crypto.moderateReturn, 
      timeHorizon
    );
    
    const aggressiveReturn = calculateCompoundInterest(
      initialInvestment, 
      crypto.aggressiveReturn, 
      timeHorizon
    );

    // Animate result cards
    animateResultCards();

    // Update result displays with animation
    setTimeout(() => {
      animateValueUpdate(elements.conservativeReturn, formatCurrency(conservativeReturn));
      animateValueUpdate(elements.moderateReturn, formatCurrency(moderateReturn));
      animateValueUpdate(elements.aggressiveReturn, formatCurrency(aggressiveReturn));
    }, 200);

    // Update risk analysis
    updateRiskAnalysis(crypto, riskLevel);
  }

  // Update risk analysis
  function updateRiskAnalysis(crypto, riskLevel) {
    const riskConfig = riskConfigs[riskLevel];
    const adjustedVolatility = crypto.volatility * riskConfig.multiplier;
    
    // Update risk bar
    const riskPercentage = Math.min(adjustedVolatility * 100, 100);
    elements.riskFill.style.width = `${riskPercentage}%`;
    
    // Update risk text
    let riskLabel = 'Low Risk';
    if (riskPercentage > 70) riskLabel = 'Very High Risk';
    else if (riskPercentage > 50) riskLabel = 'High Risk';
    else if (riskPercentage > 30) riskLabel = 'Moderate Risk';
    
    elements.riskText.textContent = riskLabel;
    elements.riskText.style.color = getRiskColor(riskPercentage);

    // Update volatility and correlation
    elements.volatilityValue.textContent = `${Math.round(adjustedVolatility * 100)}%`;
    elements.correlationValue.textContent = crypto.correlation.toFixed(2);
  }

  // Get risk color based on percentage
  function getRiskColor(percentage) {
    if (percentage > 70) return '#ef4444';
    if (percentage > 50) return '#f59e0b';
    if (percentage > 30) return '#3b82f6';
    return '#10b981';
  }

  // Reset results
  function resetResults() {
    elements.conservativeReturn.textContent = '$0';
    elements.moderateReturn.textContent = '$0';
    elements.aggressiveReturn.textContent = '$0';
    elements.riskFill.style.width = '0%';
    elements.riskText.textContent = 'No Risk';
    elements.volatilityValue.textContent = '0%';
    elements.correlationValue.textContent = '0.00';
  }

  // Format currency
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Add loading animation
  function showLoading() {
    elements.calculateBtn.textContent = 'Calculating...';
    elements.calculateBtn.disabled = true;
  }

  function hideLoading() {
    elements.calculateBtn.textContent = 'Calculate Projection';
    elements.calculateBtn.disabled = false;
  }

  // Enhanced calculate function with loading
  function calculateProjectionsWithLoading() {
    showLoading();
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
      calculateProjections();
      hideLoading();
    }, 800);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Animation functions
  function animateResultValues() {
    [elements.conservativeReturn, elements.moderateReturn, elements.aggressiveReturn].forEach(el => {
      el.classList.add('updating');
    });
  }

  function animateValueUpdate(element, newValue) {
    element.classList.remove('updating');
    element.textContent = newValue;
    element.style.transform = 'scale(1.1)';
    element.style.color = '#10b981';
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
      element.style.color = '';
    }, 300);
  }

  function animateResultCards() {
    const resultCards = document.querySelectorAll('.results-card');
    resultCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-in');
      }, index * 100);
    });
  }

  // Enhanced calculate function with loading
  function calculateProjectionsWithLoading() {
    showLoading();
    
    // Add loading class to button
    elements.calculateBtn.classList.add('loading');
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
      calculateProjections();
      hideLoading();
      elements.calculateBtn.classList.remove('loading');
    }, 800);
  }

  // Update calculate button event listener
  function setupEventListeners() {
    // Range slider
    elements.timeHorizon.addEventListener('input', updateRangeValue);
    
    // Calculate button with enhanced loading
    elements.calculateBtn.addEventListener('click', calculateProjectionsWithLoading);
    
    // Auto-calculate on input change
    elements.initialInvestment.addEventListener('input', debounce(calculateProjections, 500));
    elements.cryptoSelect.addEventListener('change', () => {
      updateMarketInsights();
      calculateProjections();
    });
    elements.timeHorizon.addEventListener('input', debounce(calculateProjections, 300));
    elements.riskLevel.addEventListener('change', calculateProjections);
  }

  // Expose for external use if needed
  window.CryptoCalculator = {
    calculate: calculateProjections,
    reset: resetResults,
    animate: animateResultCards
  };

})();
