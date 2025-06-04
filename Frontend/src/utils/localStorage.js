/**
 * Utility functions for working with localStorage
 */

// Save token to localStorage
export const saveToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
    }
};

// Get token from localStorage
export const getToken = () => {
    return localStorage.getItem('token');
};

// Remove token from localStorage
export const removeToken = () => {
    localStorage.removeItem('token');
};

// Save user data to localStorage
export const saveUser = (user) => {
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
    }
};

// Get user data from localStorage
export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Remove user data from localStorage
export const removeUser = () => {
    localStorage.removeItem('user');
};

// Clear all auth data (logout)
export const clearAuthData = () => {
    removeToken();
    removeUser();
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!getToken();
};