import { useState, useEffect } from 'react';

/**
 * Custom hook for managing topic storage
 */

// Key for storing edited topics in local storage
const EDITED_TOPICS_KEY = 'cfo_agenda_edited_topics';
const APPROVED_TOPICS_KEY = 'cfo_agenda_approved_topics';
const REJECTED_TOPICS_KEY = 'cfo_agenda_rejected_topics';

/**
 * Custom hook for managing topic storage in localStorage
 * @param {string} documentId - The current document ID
 * @returns {Object} - Methods for managing topic storage
 */
const useTopicStorage = (documentId) => {
  const [editedTopics, setEditedTopics] = useState({});
  const [approvedTopics, setApprovedTopics] = useState([]);
  const [rejectedTopics, setRejectedTopics] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    if (documentId) {
      loadStoredTopics();
    }
  }, [documentId]);

  /**
   * Load all stored topics from localStorage
   */
  const loadStoredTopics = () => {
    try {
      // Load edited topics
      const storedEditedTopics = localStorage.getItem(EDITED_TOPICS_KEY);
      if (storedEditedTopics) {
        const parsedTopics = JSON.parse(storedEditedTopics);
        setEditedTopics(parsedTopics[documentId] || {});
      }

      // Load approved topics
      const storedApprovedTopics = localStorage.getItem(APPROVED_TOPICS_KEY);
      if (storedApprovedTopics) {
        const parsedApproved = JSON.parse(storedApprovedTopics);
        setApprovedTopics(parsedApproved[documentId] || []);
      }

      // Load rejected topics
      const storedRejectedTopics = localStorage.getItem(REJECTED_TOPICS_KEY);
      if (storedRejectedTopics) {
        const parsedRejected = JSON.parse(storedRejectedTopics);
        setRejectedTopics(parsedRejected[documentId] || []);
      }
    } catch (error) {
      console.error('Error loading topics from localStorage:', error);
    }
  };

  /**
   * Save an edited topic
   * @param {Object} topic - The topic to save
   */
  const saveEditedTopic = (topic) => {
    try {
      // Get existing edited topics or initialize empty object
      const storedTopics = JSON.parse(localStorage.getItem(EDITED_TOPICS_KEY) || '{}');
      
      // Create document section if it doesn't exist
      if (!storedTopics[documentId]) {
        storedTopics[documentId] = {};
      }
      
      // Save the edited topic under the document ID and topic ID
      storedTopics[documentId][topic.id] = topic;
      
      // Store back to local storage
      localStorage.setItem(EDITED_TOPICS_KEY, JSON.stringify(storedTopics));
      
      // Update state
      setEditedTopics(prev => ({...prev, [topic.id]: topic}));
    } catch (error) {
      console.error('Error saving edited topic:', error);
    }
  };

  /**
   * Get an edited topic by ID
   * @param {string} topicId - The topic ID
   * @returns {Object|null} - The edited topic or null if not found
   */
  const getEditedTopic = (topicId) => {
    return editedTopics[topicId] || null;
  };

  /**
   * Save an approved topic ID
   * @param {string} topicId - The topic ID to approve
   */
  const saveApprovedTopic = (topicId) => {
    try {
      // Don't add duplicates
      if (approvedTopics.includes(topicId)) return;
      
      // Get existing approved topics or initialize empty object
      const storedApproved = JSON.parse(localStorage.getItem(APPROVED_TOPICS_KEY) || '{}');
      
      // Create document section if it doesn't exist
      if (!storedApproved[documentId]) {
        storedApproved[documentId] = [];
      }
      
      // Add the topic ID if not already present
      if (!storedApproved[documentId].includes(topicId)) {
        storedApproved[documentId].push(topicId);
      }
      
      // Store back to local storage
      localStorage.setItem(APPROVED_TOPICS_KEY, JSON.stringify(storedApproved));
      
      // Update state
      setApprovedTopics(prev => [...prev, topicId]);
      
      // Remove from rejected if present
      if (rejectedTopics.includes(topicId)) {
        removeRejectedTopic(topicId);
      }
    } catch (error) {
      console.error('Error saving approved topic:', error);
    }
  };

  /**
   * Save a rejected topic ID
   * @param {string} topicId - The topic ID to reject
   */
  const saveRejectedTopic = (topicId) => {
    try {
      // Don't add duplicates
      if (rejectedTopics.includes(topicId)) return;
      
      // Get existing rejected topics or initialize empty object
      const storedRejected = JSON.parse(localStorage.getItem(REJECTED_TOPICS_KEY) || '{}');
      
      // Create document section if it doesn't exist
      if (!storedRejected[documentId]) {
        storedRejected[documentId] = [];
      }
      
      // Add the topic ID if not already present
      if (!storedRejected[documentId].includes(topicId)) {
        storedRejected[documentId].push(topicId);
      }
      
      // Store back to local storage
      localStorage.setItem(REJECTED_TOPICS_KEY, JSON.stringify(storedRejected));
      
      // Update state
      setRejectedTopics(prev => [...prev, topicId]);
      
      // Remove from approved if present
      if (approvedTopics.includes(topicId)) {
        removeApprovedTopic(topicId);
      }
    } catch (error) {
      console.error('Error saving rejected topic:', error);
    }
  };

  /**
   * Remove a topic from approved list
   * @param {string} topicId - The topic ID to remove
   */
  const removeApprovedTopic = (topicId) => {
    try {
      // Get existing approved topics
      const storedApproved = JSON.parse(localStorage.getItem(APPROVED_TOPICS_KEY) || '{}');
      
      // Remove the topic ID if present
      if (storedApproved[documentId]) {
        storedApproved[documentId] = storedApproved[documentId].filter(id => id !== topicId);
        localStorage.setItem(APPROVED_TOPICS_KEY, JSON.stringify(storedApproved));
      }
      
      // Update state
      setApprovedTopics(prev => prev.filter(id => id !== topicId));
    } catch (error) {
      console.error('Error removing approved topic:', error);
    }
  };

  /**
   * Remove a topic from rejected list
   * @param {string} topicId - The topic ID to remove
   */
  const removeRejectedTopic = (topicId) => {
    try {
      // Get existing rejected topics
      const storedRejected = JSON.parse(localStorage.getItem(REJECTED_TOPICS_KEY) || '{}');
      
      // Remove the topic ID if present
      if (storedRejected[documentId]) {
        storedRejected[documentId] = storedRejected[documentId].filter(id => id !== topicId);
        localStorage.setItem(REJECTED_TOPICS_KEY, JSON.stringify(storedRejected));
      }
      
      // Update state
      setRejectedTopics(prev => prev.filter(id => id !== topicId));
    } catch (error) {
      console.error('Error removing rejected topic:', error);
    }
  };

  /**
   * Check if a topic is approved
   * @param {string} topicId - The topic ID to check
   * @returns {boolean} - True if the topic is approved
   */
  const isTopicApproved = (topicId) => {
    return approvedTopics.includes(topicId);
  };

  /**
   * Check if a topic is rejected
   * @param {string} topicId - The topic ID to check
   * @returns {boolean} - True if the topic is rejected
   */
  const isTopicRejected = (topicId) => {
    return rejectedTopics.includes(topicId);
  };

  /**
   * Check if a topic has been edited
   * @param {string} topicId - The topic ID to check
   * @returns {boolean} - True if the topic has been edited
   */
  const isTopicEdited = (topicId) => {
    return !!editedTopics[topicId];
  };

  return {
    // State
    editedTopics,
    approvedTopics,
    rejectedTopics,
    
    // Methods
    saveEditedTopic,
    getEditedTopic,
    saveApprovedTopic,
    saveRejectedTopic,
    removeApprovedTopic,
    removeRejectedTopic,
    isTopicApproved,
    isTopicRejected,
    isTopicEdited,
    loadStoredTopics
  };
};

export default useTopicStorage;
