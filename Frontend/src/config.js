// Configuration file for the application
// Contains environment-specific variables

// API URL - Change this based on your environment
// Using Vite's environment variable format (import.meta.env)
export const API_URL = import.meta.env.VITE_API_URL || 'https://cfo-agenda-creator.herokuapp.com' || 'http://localhost:5000';

// Other configuration variables
export const DEFAULT_PAGINATION_LIMIT = 10;
export const MAX_FILE_SIZE_MB = 10;
