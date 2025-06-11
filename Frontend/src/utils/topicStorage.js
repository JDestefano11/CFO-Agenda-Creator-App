/**
 * Utility functions for storing and retrieving edited topics in local storage
 */

// Key for storing edited topics in local storage
const EDITED_TOPICS_KEY = 'cfo_agenda_edited_topics';

/**
 * Save an edited topic to local storage
 * @param {string} documentId - The document ID
 * @param {Object} topic - The edited topic object
 */
export const saveEditedTopic = (documentId, topic) => {
  try {
    // Get existing edited topics or initialize empty object
    const storedTopics = getEditedTopics();
    
    // Create document section if it doesn't exist
    if (!storedTopics[documentId]) {
      storedTopics[documentId] = {};
    }
    
    // Save the edited topic under the document ID and topic ID
    storedTopics[documentId][topic.id] = topic;
    
    // Store back to local storage
    localStorage.setItem(EDITED_TOPICS_KEY, JSON.stringify(storedTopics));
  } catch (error) {
    console.error('Error saving edited topic to local storage:', error);
  }
};

/**
 * Get all edited topics from local storage
 * @returns {Object} Object with document IDs as keys and topics as values
 */
export const getEditedTopics = () => {
  try {
    const storedTopics = localStorage.getItem(EDITED_TOPICS_KEY);
    return storedTopics ? JSON.parse(storedTopics) : {};
  } catch (error) {
    console.error('Error retrieving edited topics from local storage:', error);
    return {};
  }
};

/**
 * Get edited topics for a specific document
 * @param {string} documentId - The document ID
 * @returns {Object} Object with topic IDs as keys and edited topics as values
 */
export const getEditedTopicsForDocument = (documentId) => {
  try {
    const storedTopics = getEditedTopics();
    return storedTopics[documentId] || {};
  } catch (error) {
    console.error('Error retrieving edited topics for document:', error);
    return {};
  }
};

/**
 * Clear edited topics for a specific document
 * @param {string} documentId - The document ID
 */
export const clearEditedTopicsForDocument = (documentId) => {
  try {
    const storedTopics = getEditedTopics();
    if (storedTopics[documentId]) {
      delete storedTopics[documentId];
      localStorage.setItem(EDITED_TOPICS_KEY, JSON.stringify(storedTopics));
    }
  } catch (error) {
    console.error('Error clearing edited topics for document:', error);
  }
};
