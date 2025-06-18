import axios from 'axios';

// Direct Heroku URL - confirmed by user
const HEROKU_URL = 'https://cfo-agenda-creator-21d886a774e1.herokuapp.com';

/**
 * Generate export content for a document
 * @param {string} documentId - The ID of the document
 * @param {Object} options - Export options
 * @param {string} options.outputType - Type of output (email, survey, agenda, other)
 * @param {string} options.primaryStakeholder - Primary stakeholder (CFO, VP of Finance, Head of Accounting)
 * @param {string} [options.customOutputType] - Custom output type (required if outputType is 'other')
 * @returns {Promise<Object>} - The generated export content
 */
export const generateExportContent = async (documentId, options) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.post(
      `${HEROKU_URL}/api/export/${documentId}/generate`,
      {
        outputType: options.outputType,
        primaryStakeholder: options.primaryStakeholder,
        ...(options.outputType === 'other' && { customOutputType: options.customOutputType })
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error generating export content:', error);
    
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token'); // Clear invalid token
      return {
        success: false,
        error: 'Authentication failed. Please log in again.',
        authError: true
      };
    }
    
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to generate export content'
    };
  }
};

/**
 * Update export content for a document
 * @param {string} documentId - The ID of the document
 * @param {string} modifiedContent - The modified export content
 * @returns {Promise<Object>} - The update result
 */
export const updateExportContent = async (documentId, modifiedContent) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.put(
      `${HEROKU_URL}/api/export/${documentId}/update`,
      { modifiedContent },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error updating export content:', error);
    
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token'); // Clear invalid token
      return {
        success: false,
        error: 'Authentication failed. Please log in again.',
        authError: true
      };
    }
    
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to update export content'
    };
  }
};

/**
 * Finalize export content for a document
 * @param {string} documentId - The ID of the document
 * @param {string} modifiedContent - The final export content
 * @returns {Promise<Object>} - The finalization result
 */
export const finalizeExportContent = async (documentId, modifiedContent) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.post(
      `${HEROKU_URL}/api/export/${documentId}/finalize`,
      { modifiedContent },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error finalizing export content:', error);
    
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token'); // Clear invalid token
      return {
        success: false,
        error: 'Authentication failed. Please log in again.',
        authError: true
      };
    }
    
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to finalize export content'
    };
  }
};

/**
 * Get export content for a document
 * @param {string} documentId - The ID of the document
 * @returns {Promise<Object>} - The export content
 */
export const getExportContent = async (documentId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.get(
      `${HEROKU_URL}/api/export/${documentId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching export content:', error);
    
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token'); // Clear invalid token
      return {
        success: false,
        error: 'Authentication failed. Please log in again.',
        authError: true
      };
    }
    
    // Handle 404 errors (no export found)
    if (error.response && error.response.status === 404) {
      return {
        success: false,
        error: 'No export found for this document',
        notFound: true
      };
    }
    
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to fetch export content'
    };
  }
};

export default {
  generateExportContent,
  updateExportContent,
  finalizeExportContent,
  getExportContent
};
