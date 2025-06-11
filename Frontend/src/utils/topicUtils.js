/**
 * Formats topic content as bullet points
 * @param {string} content - The content to format
 * @returns {string[]} Array of bullet points
 */
export const formatContentAsBullets = (content) => {
  if (!content) return [];
  
  // Split by newlines or periods followed by a space
  let points = content
    .split(/\n+|\.\s+/)
    .map(point => point.trim())
    .filter(point => point.length > 0);
  
  // If no points were created, try to use the whole content as one point
  if (points.length === 0 && content.trim().length > 0) {
    points = [content.trim()];
  }
  
  // Add a period at the end of each point if it doesn't have one
  points = points.map(point => {
    if (!point.endsWith('.') && !point.endsWith('!') && !point.endsWith('?')) {
      return point + '.';
    }
    return point;
  });
  
  return points;
};

/**
 * Extracts topics data from document data
 * @param {Object} documentData - The document data from API
 * @returns {Array} Array of topic objects with id, title, and content
 */
export const extractTopicsData = (documentData) => {
  if (!documentData) return [];
  
  const topicsData = [];
  
  // Check for topics in the API response (new format)
  if (documentData?.analysis?.topics && documentData.analysis.topics.length > 0) {
    // Use the topics array directly
    documentData.analysis.topics.forEach((topic, index) => {
      topicsData.push({
        id: index + 1,
        title: topic.title,
        content: topic.description,
        description: topic.description // Added for TopicEditor compatibility
      });
    });
  } 
  // Fallback to keyTopics if available (older API format)
  else if (documentData?.keyTopics && documentData.keyTopics.length > 0) {
    documentData.keyTopics.forEach((topic, index) => {
      const description = documentData.analysis?.topicDetails?.[index] || "No description available";
      topicsData.push({
        id: index + 1,
        title: topic,
        content: description,
        description: description // Added for TopicEditor compatibility
      });
    });
  }
  
  return topicsData;
};

/**
 * Checks if all topics have been reviewed (approved or rejected)
 * @param {Object} documentData - The document data from API
 * @param {Array} approvedTopics - Array of approved topic IDs
 * @param {Array} rejectedTopics - Array of rejected topic IDs
 * @returns {boolean} True if all topics are reviewed
 */
export const areAllTopicsReviewed = (documentData, approvedTopics, rejectedTopics) => {
  if (!documentData) return true;
  
  // Get all topic IDs
  const allTopicIds = [];
  
  // For the new API format with analysis.topics
  if (documentData.analysis && documentData.analysis.topics) {
    // Use 1-based indexing as we do in the UI
    documentData.analysis.topics.forEach((_, index) => {
      allTopicIds.push(index + 1);
    });
  } 
  // For the old API format with keyTopics
  else if (documentData.keyTopics && documentData.keyTopics.length > 0) {
    // Use 1-based indexing as we do in the UI
    for (let i = 0; i < documentData.keyTopics.length; i++) {
      allTopicIds.push(i + 1);
    }
  }
  
  // Check if all topics are either approved or rejected
  return allTopicIds.every(id => 
    approvedTopics.includes(id) || rejectedTopics.includes(id)
  );
};
