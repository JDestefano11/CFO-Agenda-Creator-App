// Authentication utilities for token management and session expiration

// Token expiration time in milliseconds (8 hours)
const TOKEN_EXPIRATION_TIME = 8 * 60 * 60 * 1000;

// Save token with expiration timestamp
export const saveTokenWithExpiration = (token) => {
  const now = new Date();
  const expirationTime = now.getTime() + TOKEN_EXPIRATION_TIME;
  
  const tokenData = {
    value: token,
    expiry: expirationTime
  };
  
  localStorage.setItem('tokenData', JSON.stringify(tokenData));
  localStorage.setItem('token', token); // Keep for backward compatibility
};

// Check if token is expired
export const isTokenExpired = () => {
  const tokenDataString = localStorage.getItem('tokenData');
  
  if (!tokenDataString) {
    // If no token data exists, check if there's a legacy token
    const legacyToken = localStorage.getItem('token');
    if (legacyToken) {
      // Migrate legacy token to new format
      saveTokenWithExpiration(legacyToken);
      return false;
    }
    return true; // No token exists
  }
  
  try {
    const tokenData = JSON.parse(tokenDataString);
    const now = new Date();
    
    // Check if current time is past expiration
    return now.getTime() > tokenData.expiry;
  } catch (error) {
    console.error('Error parsing token data:', error);
    return true; // Assume expired if there's an error
  }
};

// Get token if valid
export const getToken = () => {
  if (isTokenExpired()) {
    // Clear expired tokens
    clearAuthData();
    return null;
  }
  
  const tokenDataString = localStorage.getItem('tokenData');
  if (tokenDataString) {
    try {
      const tokenData = JSON.parse(tokenDataString);
      return tokenData.value;
    } catch (error) {
      return null;
    }
  }
  
  return localStorage.getItem('token'); // Fallback to legacy token
};

// Clear all authentication data
export const clearAuthData = () => {
  localStorage.removeItem('tokenData');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Refresh token expiration (call this on user activity)
export const refreshTokenExpiration = () => {
  const token = getToken();
  if (token) {
    saveTokenWithExpiration(token);
  }
};
