// Configuration file for the application
// Contains environment-specific variables

// API URL - Change this based on your environment
// Using Vite's environment variable format (import.meta.env)
// Using the correct Heroku URL for the backend
export const API_URL = import.meta.env.VITE_API_URL || 'https://cfo-agenda-creator-21d886a774e1.herokuapp.com';

// Other configuration variables
export const DEFAULT_PAGINATION_LIMIT = 10;
export const MAX_FILE_SIZE_MB = 10;
