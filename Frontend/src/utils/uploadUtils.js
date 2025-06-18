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

/**
 * API configuration
 */
export const API_CONFIG = {
  BASE_URL: 'https://cfo-agenda-creator-21d886a774e1.herokuapp.com',
  ENDPOINTS: {
    UPLOAD: '/api/documents/upload',
    ANALYZE: '/api/documents/{documentId}/analyze'
  },
  TIMEOUT: 30000 // 30 second timeout
};

/**
 * Uploads a document to the server
 * @param {File} file - File to upload
 * @param {string} authToken - Authentication token
 * @returns {Promise} - Promise with response
 */
export const uploadDocument = async (file, authToken) => {
  const formData = new FormData();
  formData.append("document", file);

  try {
    const response = await axios.post(
      "https://cfo-agenda-creator-21d886a774e1.herokuapp.com/api/documents/upload",
      formData,
      {
        headers: {
         'Content-Type': 'application/json',
          "Authorization": `Bearer ${authToken}`
        }
      }
    );
    return response;
  } catch (error) {
    console.error("Upload error:", error.response?.data || error.message);
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
  const url = `https://cfo-agenda-creator-21d886a774e1.herokuapp.com/api/documents/${documentId}/analyze`;
  
  return await axios.post(
    url,
    {},
    {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    }
  );
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
