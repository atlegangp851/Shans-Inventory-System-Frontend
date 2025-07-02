// Shared authentication utilities for user-facing pages
// Auto-detect environment and set appropriate API URL
const API_BASE_URL = (() => {
  const hostname = window.location.hostname;

  // Production environment (Netlify)
  if (hostname === 'shans-system.netlify.app') {
    return 'https://shans-backend.onrender.com/api';
  }

  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'https://shans-backend.onrender.com/api';
  }

  // Default fallback to production
  return 'https://shans-backend.onrender.com/api';
})();

// Storage utility with fallback
const storage = {
  get: function(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('localStorage not available, using sessionStorage');
      return sessionStorage.getItem(key);
    }
  },
  set: function(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('localStorage not available, using sessionStorage');
      sessionStorage.setItem(key, value);
    }
  },
  remove: function(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('localStorage not available, using sessionStorage');
      sessionStorage.removeItem(key);
    }
  }
};

// Enhanced authentication check with better error handling
async function checkAuthStatus(options = {}) {
  const { 
    redirectOnFail = true, 
    showLoading = false, 
    retryCount = 2,
    timeout = 8000 
  } = options;
  
  const token = storage.get('authToken');
  const userInfo = storage.get('userInfo');
  
  // If no token, redirect immediately
  if (!token) {
    if (redirectOnFail) {
      window.location.href = 'login.html';
    }
    return false;
  }
  
  // If we have userInfo cached and it's recent, trust it temporarily
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo);
      const lastCheck = storage.get('lastAuthCheck');
      const now = Date.now();
      
      // If last check was less than 5 minutes ago, skip server validation
      if (lastCheck && (now - parseInt(lastCheck)) < 5 * 60 * 1000) {
        return true;
      }
    } catch (e) {
      console.warn('Error parsing cached user info:', e);
    }
  }
  
  // Validate token with server
  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      // Add cache busting parameter to prevent cached responses
      const cacheBuster = `?_t=${Date.now()}`;
      const response = await fetch(`${API_BASE_URL}/auth/me${cacheBuster}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        // Update cached user info and timestamp
        storage.set('userInfo', JSON.stringify(data.user));
        storage.set('lastAuthCheck', Date.now().toString());
        return true;
      } else if (response.status === 401 || response.status === 403) {
        // Token is invalid, clear storage and redirect
        storage.remove('authToken');
        storage.remove('userInfo');
        storage.remove('lastAuthCheck');
        
        if (redirectOnFail) {
          window.location.href = 'login.html';
        }
        return false;
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.warn(`Auth check attempt ${attempt + 1} failed:`, error);
      
      // If this is the last attempt, handle the failure
      if (attempt === retryCount) {
        // If we have cached user info, use it as fallback
        if (userInfo) {
          console.log('Using cached authentication due to network issues');
          return true;
        }
        
        // No cached info and all attempts failed
        console.error('Authentication failed after all retries:', error);
        storage.remove('authToken');
        storage.remove('userInfo');
        storage.remove('lastAuthCheck');
        
        if (redirectOnFail) {
          // Show error message before redirect
          if (showLoading) {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
              const errorMessage = loadingScreen.querySelector('.error-message');
              if (errorMessage) {
                errorMessage.textContent = 'Authentication failed. Redirecting to login...';
                errorMessage.style.display = 'block';
              }
              const loadingText = loadingScreen.querySelector('p');
              if (loadingText) {
                loadingText.textContent = 'Authentication Error';
              }
            }
          }
          
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 2000);
        }
        return false;
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  
  return false;
}

// Check if user is admin
function isAdmin() {
  const userInfo = storage.get('userInfo');
  if (!userInfo) return false;
  
  try {
    const user = JSON.parse(userInfo);
    return Boolean(user.is_admin);
  } catch (e) {
    console.error('Error parsing user info:', e);
    return false;
  }
}

// Get current user info
function getCurrentUser() {
  const userInfo = storage.get('userInfo');
  if (!userInfo) return null;
  
  try {
    return JSON.parse(userInfo);
  } catch (e) {
    console.error('Error parsing user info:', e);
    return null;
  }
}

// Logout function
function logout() {
  const token = storage.get('authToken');
  
  // Call logout endpoint (don't wait for response)
  if (token) {
    fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).catch(error => {
      console.warn('Logout API call failed:', error);
    });
  }
  
  // Clear storage and redirect
  storage.remove('authToken');
  storage.remove('userInfo');
  storage.remove('lastAuthCheck');
  window.location.href = 'login.html';
}

// Initialize authentication for a page
async function initAuth(options = {}) {
  const { requireAuth = true, showLoading = false } = options;
  
  if (!requireAuth) return true;
  
  try {
    const isAuthenticated = await checkAuthStatus({ 
      showLoading, 
      redirectOnFail: true 
    });
    return isAuthenticated;
  } catch (error) {
    console.error('Auth initialization failed:', error);
    return false;
  }
}
