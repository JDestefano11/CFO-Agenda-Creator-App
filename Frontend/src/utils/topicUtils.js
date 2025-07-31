/**
 * List of all expected financial control topics that must be present
 */
export const EXPECTED_TOPICS = [
  "Understanding Financial KPIs and Business Priorities",
  "Seasonality and Timing",
  "Volatility and One-Off Items",
  "Qualitative Factors and Known Issues",
  "Materiality Threshold Calibration",
  "Business Structure & Entity Significance",
  "Financial Statement Account Significance",
  "Process and Risk Mapping",
  "Systems & IT Considerations",
  "Risk Indicators and Qualitative Factors",
  "Changes and Emerging Risks",
  "CFO Decisions and Preferences",
  "Follow-Up Data Requests to Support Scoping"
];

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
  
  // Always use our 13 expected topics
  for (let i = 0; i < EXPECTED_TOPICS.length; i++) {
    const topicId = i + 1;
    const topicTitle = EXPECTED_TOPICS[i];
    let topicDescription = "No information available for this topic.";
    
    // Try to find the matching topic description in the document data
    // First check for structured topics (new format)
    if (documentData.analysis && documentData.analysis.topics) {
      const matchingTopic = documentData.analysis.topics.find(t => 
        t.title === topicTitle ||
        t.title.toLowerCase().includes(topicTitle.toLowerCase()) ||
        topicTitle.toLowerCase().includes(t.title.toLowerCase())
      );
      
      if (matchingTopic) {
        topicDescription = matchingTopic.description;
      }
    }
    // Then check the topic details map (older format)
    else if (documentData.analysis && documentData.analysis.topicDetails && documentData.analysis.topicDetails[i]) {
      topicDescription = documentData.analysis.topicDetails[i];
    }
    
    // Add the topic to our data array
    topicsData.push({
      id: topicId,
      title: topicTitle,
      content: topicDescription,
      description: topicDescription // Added for TopicEditor compatibility
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

/**
 * Finds topics that are missing from the document analysis
 * @param {Object} documentData - The document data from API
 * @returns {Array} Array of missing topic names
 */
export const findMissingTopics = (documentData) => {
  if (!documentData) return EXPECTED_TOPICS; // If no data, all topics are missing
  
  // If the API directly returns missing topics, use those
  if (documentData.missingTopics && Array.isArray(documentData.missingTopics)) {
    return documentData.missingTopics;
  }
  
  // Check for topics in the structured format
  const missingTopics = [];
  
  // Go through each expected topic and check if we have meaningful content for it
  for (let i = 0; i < EXPECTED_TOPICS.length; i++) {
    const topicTitle = EXPECTED_TOPICS[i];
    let topicFound = false;
    
    // Check in the analysis.topics array first (new format)
    if (documentData.analysis && documentData.analysis.topics) {
      const matchingTopic = documentData.analysis.topics.find(topic => 
        topic.title === topicTitle || 
        topic.title.toLowerCase().includes(topicTitle.toLowerCase()) ||
        topicTitle.toLowerCase().includes(topic.title.toLowerCase())
      );
      
      if (matchingTopic && matchingTopic.description && 
          !matchingTopic.description.includes("No information available") &&
          !matchingTopic.description.includes("The document does not provide sufficient information")) {
        topicFound = true;
      }
    }
    
    // Check in the topic details map (older format)
    else if (documentData.analysis && documentData.analysis.topicDetails) {
      const description = documentData.analysis.topicDetails[i];
      if (description && 
          !description.includes("No information available") &&
          !description.includes("The document does not provide sufficient information")) {
        topicFound = true;
      }
    }
    
    // If we didn't find meaningful content for this topic, it's missing
    if (!topicFound) {
      missingTopics.push(topicTitle);
    }
  }
  
  return missingTopics;
};
