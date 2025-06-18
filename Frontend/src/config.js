// Configuration file for the application
// Contains environment-specific variables

// API URL - Change this based on your environment
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Other configuration variables
export const DEFAULT_PAGINATION_LIMIT = 10;
export const MAX_FILE_SIZE_MB = 10;
