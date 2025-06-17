/**
 * API Configuration
 * 
 * This file centralizes API configuration settings.
 * It uses environment variables with fallbacks for development.
 */

// Default to the Heroku URL if no environment variable is set
const API_URL = import.meta.env.VITE_API_URL || 'https://cfo-agenda-creator-21d886a774e1.herokuapp.com';

export const API_CONFIG = {
  BASE_URL: API_URL,
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: '/api/users/login',
    SIGNUP: '/api/users/signup',
    PROFILE: '/api/users/profile',
    
    // Document endpoints
    DOCUMENTS: '/api/documents',
    UPLOAD: '/api/documents/upload',
    ANALYZE: '/api/documents/{documentId}/analyze',
    DOCUMENT_ANALYSIS: '/api/documents/{documentId}/analysis',
    
    // Export endpoints
    EXPORT: '/api/export/{documentId}',
    EXPORT_GENERATE: '/api/export/{documentId}/generate',
    EXPORT_UPDATE: '/api/export/{documentId}/update',
    EXPORT_FINALIZE: '/api/export/{documentId}/finalize',
  },
  TIMEOUT: 30000 // 30 second timeout
};

export default API_CONFIG;
