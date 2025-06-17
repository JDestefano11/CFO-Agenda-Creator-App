import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatContentAsBullets } from '../utils/topicUtils';
import { saveEditedTopic, getEditedTopicsForDocument } from '../utils/topicStorage';
import { extractTopicsData, areAllTopicsReviewed as checkAllTopicsReviewed } from '../utils/topicUtils';
import { API_CONFIG } from '../config/api';

// Create the context
const ResultsContext = createContext();

// Custom hook to use the context
export const useResults = () => {
  const context = useContext(ResultsContext);
  if (!context) {
    throw new Error('useResults must be used within a ResultsProvider');
  }
  return context;
};

// Provider component
export const ResultsProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State variables
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainTab, setMainTab] = useState("results");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [approvedTopics, setApprovedTopics] = useState([]);
  const [rejectedTopics, setRejectedTopics] = useState([]);
  const [editingTopic, setEditingTopic] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isOutputModalOpen, setIsOutputModalOpen] = useState(false);
  
  // Fetch document analysis data and load saved state
  useEffect(() => {
    const fetchDocumentAnalysis = async () => {
      setLoading(true);
  
      const documentId = location.state?.documentId || localStorage.getItem("currentDocumentId");
      if (!documentId) {
        setError("No document ID found. Please upload a document first.");
        setLoading(false);
        return;
      }
  
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      // Load saved approved/rejected topics from localStorage
      const savedApprovedTopics = localStorage.getItem(`${documentId}_approvedTopics`);
      const savedRejectedTopics = localStorage.getItem(`${documentId}_rejectedTopics`);
      
      if (savedApprovedTopics) {
        try {
          setApprovedTopics(JSON.parse(savedApprovedTopics));
        } catch (e) {
          console.error("Error parsing saved approved topics:", e);
        }
      }
      
      if (savedRejectedTopics) {
        try {
          setRejectedTopics(JSON.parse(savedRejectedTopics));
        } catch (e) {
          console.error("Error parsing saved rejected topics:", e);
        }
      }
  
      try {
        const { data } = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCUMENT_ANALYSIS.replace('{documentId}', documentId)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!data.analyzed) {
          setError("Document analysis is still in progress or not available.");
          setLoading(false);
          return;
        }
  
        const editedTopics = getEditedTopicsForDocument(documentId);
        if (Object.keys(editedTopics).length === 0) {
          setDocumentData(data);
          setLoading(false);
          return;
        }
  
        const updatedData = structuredClone(data); // modern alternative to deep clone
        const { analysis, keyTopics } = updatedData;
  
        if (analysis?.topics) {
          analysis.topics = analysis.topics.map((topic, index) => {
            const topicId = index + 1; // 1-based indexing
            if (editedTopics[topicId]) {
              return {
                ...topic,
                title: editedTopics[topicId].title,
                description: editedTopics[topicId].content
              };
            }
            return topic;
          });
        }
  // If keyTopics exists, update each topic title and its corresponding content.
// The index is derived from topicId (assuming it's 1-based), and if valid,
// it updates the title in keyTopics and the content in updatedData.analysis.topicDetails.
        if (keyTopics?.length) {
          Object.entries(editedTopics).forEach(([topicId, { title, content }]) => {
            const index = parseInt(topicId) - 1;
            if (index >= 0 && index < keyTopics.length) {
              keyTopics[index] = title;
              updatedData.analysis ||= {};
              updatedData.analysis.topicDetails ||= {};
              updatedData.analysis.topicDetails[index] = content;
            }
          });
        }
  
        setDocumentData(updatedData);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch document analysis. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchDocumentAnalysis();
  }, [location.state, navigate]);

  // Topic selection handler
  const handleTopicSelect = (topicId) => {
    setSelectedTopic(topicId);
  };

  // Topic approval handler
  const handleApprove = (e, topicId) => {
    e.stopPropagation();
    
    // Add to approved topics if not already there
    if (!approvedTopics.includes(topicId)) {
      const newApprovedTopics = [...approvedTopics, topicId];
      setApprovedTopics(newApprovedTopics);
      
      // Save to localStorage for persistence
      const documentId = location.state?.documentId || localStorage.getItem("currentDocumentId");
      if (documentId) {
        localStorage.setItem(`${documentId}_approvedTopics`, JSON.stringify(newApprovedTopics));
      }
    }
    
    // Remove from rejected topics if it was there
    if (rejectedTopics.includes(topicId)) {
      const newRejectedTopics = rejectedTopics.filter(id => id !== topicId);
      setRejectedTopics(newRejectedTopics);
      
      // Save to localStorage for persistence
      const documentId = location.state?.documentId || localStorage.getItem("currentDocumentId");
      if (documentId) {
        localStorage.setItem(`${documentId}_rejectedTopics`, JSON.stringify(newRejectedTopics));
      }
    }
  };

  // Topic rejection handler
  const handleReject = (e, topicId) => {
    e.stopPropagation();
    
    // Add to rejected topics if not already there
    if (!rejectedTopics.includes(topicId)) {
      const newRejectedTopics = [...rejectedTopics, topicId];
      setRejectedTopics(newRejectedTopics);
      
      // Save to localStorage for persistence
      const documentId = location.state?.documentId || localStorage.getItem("currentDocumentId");
      if (documentId) {
        localStorage.setItem(`${documentId}_rejectedTopics`, JSON.stringify(newRejectedTopics));
      }
    }
    
    // Remove from approved topics if it was there
    if (approvedTopics.includes(topicId)) {
      const newApprovedTopics = approvedTopics.filter(id => id !== topicId);
      setApprovedTopics(newApprovedTopics);
      
      // Save to localStorage for persistence
      const documentId = location.state?.documentId || localStorage.getItem("currentDocumentId");
      if (documentId) {
        localStorage.setItem(`${documentId}_approvedTopics`, JSON.stringify(newApprovedTopics));
      }
    }
  };

  // Topic editing handler
  const handleEdit = (e, topic) => {
    e.stopPropagation();
    setEditingTopic(topic);
  };

  // Save edited topic handler
  const handleSaveEdit = (updatedTopic) => {
    // Get document ID for storage
    const documentId = 
      (location.state && location.state.documentId) ||
      localStorage.getItem("currentDocumentId");
    
    if (!documentId) {
      console.error("No document ID found for saving edited topic");
      return;
    }
    
    // Create a deep copy of the document data
    const updatedDocumentData = structuredClone(documentData);
    
    // Update the topic in the document data
    if (updatedDocumentData.analysis && updatedDocumentData.analysis.topics) {
      // For the new API format
      const topicIndex = updatedDocumentData.analysis.topics.findIndex(
        (_, index) => index + 1 === updatedTopic.id
      );
      
      if (topicIndex !== -1) {
        updatedDocumentData.analysis.topics[topicIndex] = {
          ...updatedDocumentData.analysis.topics[topicIndex],
          title: updatedTopic.title,
          description: updatedTopic.content
        };
      }
    } else if (updatedDocumentData.keyTopics && updatedDocumentData.keyTopics.length > 0) {
      // For the old API format
      const topicIndex = updatedTopic.id - 1;
      
      if (topicIndex >= 0 && topicIndex < updatedDocumentData.keyTopics.length) {
        updatedDocumentData.keyTopics[topicIndex] = updatedTopic.title;
        
        // Ensure the analysis and topicDetails objects exist
        updatedDocumentData.analysis = updatedDocumentData.analysis || {};
        updatedDocumentData.analysis.topicDetails = updatedDocumentData.analysis.topicDetails || {};
        
        // Update the topic description
        updatedDocumentData.analysis.topicDetails[topicIndex] = updatedTopic.content;
      }
    }
    
    // Update the state with the modified document data
    setDocumentData(updatedDocumentData);
    
    // Save the edited topic to local storage for persistence across page refreshes
    // Store both the title and content in the correct format
    saveEditedTopic(documentId, {
      id: updatedTopic.id,
      title: updatedTopic.title,
      content: updatedTopic.content,
      // Add a flag to indicate this topic has been edited
      edited: true
    });
    
    // Close the editor
    setEditingTopic(null);
  };

  // Cancel editing handler
  const handleCancelEdit = () => {
    setEditingTopic(null);
  };

  // Show confirmation modal handler
  const handleShowConfirmationModal = () => {
    setIsConfirmModalOpen(true);
  };

  // Confirm approval handler
  const handleConfirmApproval = () => {
    // Close the confirmation modal
    setIsConfirmModalOpen(false);
    
    // Get the document ID
    const documentId = 
      (location.state && location.state.documentId) ||
      localStorage.getItem("currentDocumentId");
    
    // Store document ID in localStorage for persistence
    if (documentId) {
      localStorage.setItem("currentDocumentId", documentId);
    }
    
    // Open the output modal
    setIsOutputModalOpen(true);
    
    console.log('Opening output modal with document ID:', documentId);
  };

  // Check if all topics are reviewed
  const areAllTopicsReviewed = () => {
    return checkAllTopicsReviewed(documentData, approvedTopics, rejectedTopics);
  };

  // Get topics data
  const getTopicsData = () => {
    return extractTopicsData(documentData);
  };

  // Context value
  const value = {
    documentData,
    loading,
    error,
    mainTab,
    setMainTab,
    selectedTopic,
    approvedTopics,
    rejectedTopics,
    editingTopic,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    isOutputModalOpen,
    setIsOutputModalOpen,
    handleTopicSelect,
    handleApprove,
    handleReject,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleShowConfirmationModal,
    handleConfirmApproval,
    areAllTopicsReviewed,
    getTopicsData,
    navigate,
    location
  };

  return (
    <ResultsContext.Provider value={value}>
      {children}
    </ResultsContext.Provider>
  );
};
