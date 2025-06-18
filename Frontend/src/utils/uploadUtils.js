
import axios from 'axios';

/**
 * 
 * This file contains pure utility functions for handling document uploads:
 * - Drag and drop event handlers
 * - File processing
 * - API calls for document upload and analysis
 * - Error handling
 */

/**
 * Handles file drag enter event
 * @param {Event} e - Drag event
 * @returns {Object} - State update object
 */
export const handleDragEnter = (e) => {
  e.preventDefault();
  e.stopPropagation();
  return { isDragging: true };
};

/**
 * Handles file drag leave event
 * @param {Event} e - Drag event
 * @returns {Object} - State update object
 */
export const handleDragLeave = (e) => {
  e.preventDefault();
  e.stopPropagation();
  return { isDragging: false };
};

/**
 * Handles file drag over event
 * @param {Event} e - Drag event
 */
export const handleDragOver = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

/**
 * Processes files from a FileList
 * @param {FileList} fileList - List of files from input or drop event
 * @returns {Array} - Array containing only the first file
 */
export const processFiles = (fileList) => {
  if (fileList && fileList.length > 0) {
    return [fileList[0]];
  }
  return [];
};

/**
 * Extracts document ID from API response
 * @param {Object} response - API response object
 * @returns {string|null} - Document ID or null if not found
 */
export const extractDocumentId = (response) => {
  // Direct extraction based on the known response structure
  if (response.data?.document?.id) {
    return response.data.document.id;
  }

  // Try parsing the response as a string
  if (response.data) {
    try {
      const responseStr = JSON.stringify(response.data);
      const idMatch = responseStr.match(/"id"\s*:\s*"([^"]+)"/i);
      if (idMatch && idMatch[1]) {
        return idMatch[1];
      }
    } catch (e) {
      // Error parsing response - continue to return null
    }
  }

  return null;
};

// Direct Heroku endpoint URL
const HEROKU_URL = 'https://cfo-agenda-creator-21d886a774e1.herokuapp.com';
const TIMEOUT = 30000; // 30 second timeout

/**
 * Uploads a document to the server
 * @param {File} file - File to upload
 * @param {string} authToken - Authentication token
 * @returns {Promise} - Promise with response
 */
export const uploadDocument = async (file, authToken) => {
  // Create a FormData object to handle the file upload
  const formData = new FormData();
  
  // The backend expects the file with the field name 'document'
  formData.append("document", file);

  try {
    console.log('===== UPLOAD DEBUG =====');
    console.log('File details:', { name: file.name, size: file.size, type: file.type });
    console.log('Auth token present:', !!authToken);
    console.log('Auth token first 10 chars:', authToken ? authToken.substring(0, 10) + '...' : 'none');
    
    // Log the FormData contents (as much as possible)
    for (let [key, value] of formData.entries()) {
      console.log('FormData entry:', key, value instanceof File ? `[File: ${value.name}]` : value);
    }
    
    // Use the exact URL that works in Postman
    const url = "https://cfo-agenda-creator-21d886a774e1.herokuapp.com/api/documents/upload";
    console.log('Upload URL:', url);
    
    const config = {
      headers: {
        // IMPORTANT: Do NOT set Content-Type header when using FormData
        "Authorization": `Bearer ${authToken}`
      },
      timeout: TIMEOUT
    };
    console.log('Request config:', JSON.stringify(config));
    
    console.log('Sending request...');
    const response = await axios.post(url, formData, config);
    
    console.log('===== UPLOAD SUCCESS =====');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    return response;
  } catch (error) {
    console.log('===== UPLOAD ERROR =====');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Status:', error.response.status);
      console.error('Status text:', error.response.statusText);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', JSON.stringify(error.response.headers));
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Request details:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
    }
    
    throw error;
  }
};

/**
 * Starts document analysis
 * @param {string} documentId - Document ID to analyze
 * @param {string} authToken - Authentication token
 * @returns {Promise} - Promise with response
 */
export const analyzeDocument = async (documentId, authToken) => {
  try {
    console.log('===== ANALYZE DEBUG =====');
    console.log('Document ID:', documentId);
    console.log('Auth token present:', !!authToken);
    console.log('Auth token first 10 chars:', authToken ? authToken.substring(0, 10) + '...' : 'none');
    
    // Use the exact URL format that works in Postman
    const url = `https://cfo-agenda-creator-21d886a774e1.herokuapp.com/api/documents/${documentId}/analyze`;
    console.log('Analyze URL:', url);
    
    const config = {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      timeout: TIMEOUT
    };
    console.log('Request config:', JSON.stringify(config));
    
    console.log('Sending analyze request...');
    const response = await axios.post(url, {}, config);
    
    console.log('===== ANALYZE SUCCESS =====');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    return response;
  } catch (error) {
    console.log('===== ANALYZE ERROR =====');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Status text:', error.response.statusText);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', JSON.stringify(error.response.headers));
    } else if (error.request) {
      console.error('No response received. Request details:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    throw error;
  }
};

/**
 * Gets appropriate error message based on error response
 * @param {Error} error - Error object from axios
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (error.response?.status === 500) {
    return "Server error occurred. The backend might be experiencing issues. Please try again later.";
  } else if (error.response?.status === 413) {
    return "File too large. Please upload a smaller file.";
  } else if (error.response?.status === 415) {
    return "Unsupported file type. Please upload a supported document type.";
  } else if (error.response?.data?.message) {
    return `Error: ${error.response.data.message}`;
  }
  return "Failed to upload documents. Please try again.";
};