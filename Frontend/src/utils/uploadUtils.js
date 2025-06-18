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

// Direct Heroku endpoint URL - confirmed by user
const HEROKU_URL = 'https://cfo-agenda-creator-21d886a774e1.herokuapp.com';
const TIMEOUT = 60000; // 60 second timeout for slow connections

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
    // Log detailed information for debugging
    console.log('=== UPLOAD ATTEMPT DETAILS ===');
    console.log('File:', file.name, 'Size:', file.size, 'Type:', file.type);
    console.log('Auth token present:', !!authToken);
    
    // Use the exact endpoint path that matches the backend routes
    const uploadUrl = HEROKU_URL + '/api/documents/upload';
    console.log('Upload URL:', uploadUrl);
    
    // Check if the file is actually a File object
    if (!(file instanceof File)) {
      console.error('Error: Not a valid File object');
      throw new Error('Invalid file object');
    }
    
    // Make the POST request to the upload endpoint
    const response = await axios({
      method: 'post',
      url: uploadUrl,
      data: formData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
        // Let axios set the content-type automatically
      },
      timeout: TIMEOUT,
      // Add these options to ensure proper handling of FormData
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    });
    
    console.log('=== UPLOAD SUCCESS ===');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    return response;
  } catch (error) {
    console.log('=== UPLOAD ERROR ===');
    console.error("Error message:", error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Status text:', error.response.statusText);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
      
      // If we get a 404, try an alternative URL format
      if (error.response.status === 404) {
        try {
          console.log('Trying direct URL without string concatenation...');
          const altUrl = 'https://cfo-agenda-creator-21d886a774e1.herokuapp.com/api/documents/upload';
          console.log('Alternative URL:', altUrl);
          
          const altResponse = await axios({
            method: 'post',
            url: altUrl,
            data: formData,
            headers: {
              'Authorization': `Bearer ${authToken}`
            },
            timeout: TIMEOUT
          });
          
          console.log('=== ALTERNATIVE UPLOAD SUCCESS ===');
          console.log('Response status:', altResponse.status);
          console.log('Response data:', altResponse.data);
          return altResponse;
        } catch (altError) {
          console.error('Alternative URL also failed:', altError.message);
          throw altError;
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
      console.error('Request details:', error.request);
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
    // Use the exact endpoint path that matches the backend routes
    const analyzeUrl = HEROKU_URL + `/api/documents/${documentId}/analyze`;
    console.log('=== ANALYZE DOCUMENT ===');
    console.log('Document ID:', documentId);
    console.log('Auth token present:', !!authToken);
    console.log('Analyze URL:', analyzeUrl);
    
    const response = await axios({
      method: 'post',
      url: analyzeUrl,
      data: {},
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      timeout: TIMEOUT
    });
    
    console.log('=== ANALYZE SUCCESS ===');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    return response;
  } catch (error) {
    console.log('=== ANALYZE ERROR ===');
    console.error("Error message:", error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Status text:', error.response.statusText);
      console.error('Response data:', error.response.data);
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
