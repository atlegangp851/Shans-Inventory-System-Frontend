// Performance optimization utilities

// Debounce function for better performance
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

// Throttle function for better performance
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// DOM element cache
const DOM = {
  // Cache DOM elements on page load
  init: function() {
    // Cache all form elements
    this.forms = document.querySelectorAll('form');
    this.inputs = document.querySelectorAll('input');
    this.selects = document.querySelectorAll('select');
    this.textareas = document.querySelectorAll('textarea');
    this.buttons = document.querySelectorAll('button');
    this.links = document.querySelectorAll('a');
    this.tables = document.querySelectorAll('table');
    this.lists = document.querySelectorAll('ul, ol');
    this.images = document.querySelectorAll('img');
    this.loadingScreen = document.getElementById('loadingScreen');
    this.toastContainer = document.getElementById('toastContainer');
  },

  // Clear cache
  clear: function() {
    Object.keys(this).forEach(key => {
      if (key !== 'init' && key !== 'clear') {
        this[key] = null;
      }
    });
  }
};

// Performance optimized event listeners
const EventHandlers = {
  // Add passive event listeners
  addPassiveListener: function(element, event, handler) {
    element.addEventListener(event, handler, { passive: true });
  },

  // Add debounced event listeners
  addDebouncedListener: function(element, event, handler, wait = 300) {
    element.addEventListener(event, debounce(handler, wait), { passive: true });
  },

  // Add throttled event listeners
  addThrottledListener: function(element, event, handler, limit = 300) {
    element.addEventListener(event, throttle(handler, limit), { passive: true });
  }
};

// Memory management
const MemoryManager = {
  // Clean up event listeners
  cleanupEventListeners: function() {
    // Remove all event listeners from cached elements
    Object.values(DOM).forEach(element => {
      if (element && element.removeEventListener) {
        element.removeEventListener();
      }
    });
  },

  // Clear DOM cache
  clearCache: function() {
    DOM.clear();
  },

  // Clear all intervals and timeouts
  clearTimers: function() {
    const highestTimeoutId = setTimeout(() => {}, 0);
    for (let i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
      clearInterval(i);
    }
  }
};

// Initialize performance optimizations
function initPerformanceOptimizations() {
  // Initialize DOM cache
  DOM.init();

  // Add passive event listeners to all interactive elements
  DOM.buttons.forEach(button => {
    EventHandlers.addPassiveListener(button, 'click', button.onclick);
  });

  DOM.links.forEach(link => {
    EventHandlers.addPassiveListener(link, 'click', link.onclick);
  });

  // Add debounced event listeners to all input elements
  DOM.inputs.forEach(input => {
    if (input.type === 'text' || input.type === 'search') {
      EventHandlers.addDebouncedListener(input, 'input', input.oninput);
    }
  });

  // Add throttled event listeners to scroll events
  EventHandlers.addThrottledListener(window, 'scroll', () => {
    // Handle scroll events
  });

  // Add cleanup on page unload
  window.addEventListener('unload', () => {
    MemoryManager.cleanupEventListeners();
    MemoryManager.clearCache();
    MemoryManager.clearTimers();
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initPerformanceOptimizations);

// Export utilities
window.PerformanceUtils = {
  debounce,
  throttle,
  DOM,
  EventHandlers,
  MemoryManager,
  initPerformanceOptimizations
}; 