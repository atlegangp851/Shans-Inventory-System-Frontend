// Authentication utility for admin pages
const API_BASE_URL = 'https://shans-backend-1.onrender.com/api';

// Check authentication status
function checkAuthStatus() {
  const token = localStorage.getItem('authToken');
  const userInfo = localStorage.getItem('userInfo');
  
  if (!token || !userInfo) {
    window.location.href = '../login.html';
    return false;
  }

  const user = JSON.parse(userInfo);
  if (!user.is_admin) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    window.location.href = '../login.html';
    return false;
  }

  // Verify token with backend
  fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    if (!response.ok) {
      // Token is invalid, redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      window.location.href = '../login.html';
    } else {
      return response.json();
    }
  })
  .then(data => {
    if (data && !data.user.is_admin) {
      // User is not admin, redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      window.location.href = '../login.html';
    }
  })
  .catch(error => {
    console.error('Auth check failed:', error);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    window.location.href = '../login.html';
  });

  return true;
}

// Logout functionality
function logout() {
  fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  })
  .then(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    window.location.href = '../login.html';
  })
  .catch(error => {
    console.error('Logout error:', error);
    // Even if logout fails on server, clear local storage and redirect
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    window.location.href = '../login.html';
  });
}

// Initialize authentication on page load
function initAuth() {
  if (!checkAuthStatus()) {
    return false;
  }
  return true;
}
