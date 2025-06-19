/**
 * Utility functions for working with localStorage
 */

import { saveTokenWithExpiration, getToken as getTokenWithExpiry } from './authUtils';

// Save token to localStorage with expiration
export const saveToken = (token) => {
    if (token) {
        saveTokenWithExpiration(token);
    }
};

// Get token from localStorage (with expiry check)
export const getToken = () => {
    return getTokenWithExpiry();
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
    localStorage.removeItem('tokenData'); // Remove token expiration data
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!getToken();
};