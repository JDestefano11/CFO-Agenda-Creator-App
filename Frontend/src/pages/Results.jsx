import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiDownload, FiShare2, FiCopy, FiEdit } from "react-icons/fi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import TopBar from "../components/results/TopBar";
import PageLayout from "../components/results/PageLayout";
import ResultsTab from "../components/results/ResultsTab";
import HistoryTab from "../components/results/HistoryTab";
import LeftPanel from "../components/results/LeftPanel";
import RightPanel from "../components/results/RightPanel";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainTab, setMainTab] = useState("results");
  const [copied, setCopied] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [approvedTopics, setApprovedTopics] = useState([]);
  const [rejectedTopics, setRejectedTopics] = useState([]);

  useEffect(() => {
    const fetchDocumentAnalysis = async () => {
      try {
        const documentId =
          (location.state && location.state.documentId) ||
          localStorage.getItem("currentDocumentId");

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

        const response = await axios.get(
          `http://localhost:5000/api/documents/${documentId}/analysis`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.analyzed) {
          setDocumentData(response.data);
        } else {
          setError("Document analysis is still in progress or not available.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch document analysis. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentAnalysis();
  }, [location.state, navigate]);

  const handleCopyLink = () => {
    const documentId =
      (location.state && location.state.documentId) ||
      localStorage.getItem("currentDocumentId");

    if (documentId) {
      const shareableLink = `${window.location.origin}/results?id=${documentId}`;
      navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Helper function to format content as bullet points
  const formatContentAsBullets = (content) => {
    if (!content) return [];
    
    // Split content by sentences and create bullet points
    const sentences = content.split(/\.\s+/);
    return sentences.filter(sentence => sentence.trim().length > 0);
  };
  
  // Handle topic selection
  const handleTopicSelect = (topicId) => {
    setSelectedTopic(topicId);
  };
  
  // Handle topic approval
  const handleApprove = (e, topicId) => {
    e.stopPropagation();
    setApprovedTopics(prev => {
      if (prev.includes(topicId)) {
        return prev.filter(id => id !== topicId);
      } else {
        // Remove from rejected if it's there
        setRejectedTopics(prev => prev.filter(id => id !== topicId));
        return [...prev, topicId];
      }
    });
  };
  
  // Handle topic rejection
  const handleReject = (e, topicId) => {
    e.stopPropagation();
    setRejectedTopics(prev => {
      if (prev.includes(topicId)) {
        return prev.filter(id => id !== topicId);
      } else {
        // Remove from approved if it's there
        setApprovedTopics(prev => prev.filter(id => id !== topicId));
        return [...prev, topicId];
      }
    });
  };
  
  // Handle topic editing
  const handleEdit = (e, topic) => {
    e.stopPropagation();
    console.log("Editing topic:", topic);
    // Implement edit functionality here
  };
  
  if (loading) {
    return (
      <div>
        <div>Loading document analysis...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="64"
              width="64"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2>Analysis Not Available</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/upload")}>Upload New Document</button>
        </div>
      </div>
    );
  }

  // Render left content with interactive topic cards
  const renderLeftContent = () => {
    const topicsData = [];
    
    // Extract topics data from documentData
    if (documentData?.analysis?.topics && documentData.analysis.topics.length > 0) {
      // Use the topics array directly
      documentData.analysis.topics.forEach((topic, index) => {
        topicsData.push({
          id: index + 1,
          title: topic.title,
          content: topic.description
        });
      });
    } else if (documentData?.keyTopics && documentData.keyTopics.length > 0) {
      documentData.keyTopics.forEach((topic, index) => {
        const description = documentData.analysis?.topicDetails?.[index] || "No description available";
        topicsData.push({
          id: index + 1,
          title: topic,
          content: description
        });
      });
    }
    
    return (
      <LeftPanel 
        topicsData={topicsData}
        selectedTopic={selectedTopic}
        approvedTopics={approvedTopics}
        rejectedTopics={rejectedTopics}
        handleTopicSelect={handleTopicSelect}
      />
    );
  };

  // Check if all topics have been reviewed (approved or rejected)
  const areAllTopicsReviewed = () => {
    if (!documentData) return true;
    
    // Get all topic IDs
    const allTopicIds = [];
    
    if (documentData.analysis && documentData.analysis.topics) {
      documentData.analysis.topics.forEach(topic => {
        if (topic.id) allTopicIds.push(topic.id);
      });
    } else if (documentData.keyTopics) {
      Object.keys(documentData.keyTopics).forEach(key => {
        allTopicIds.push(parseInt(key));
      });
    }
    
    // Check if all topics are either approved or rejected
    return allTopicIds.every(id => 
      approvedTopics.includes(id) || rejectedTopics.includes(id)
    );
  };
  
  // Render right content based on active tab
  const renderRightContent = () => {
    if (mainTab === 'results') {
      // Check if all topics have been reviewed
      const allTopicsReviewed = areAllTopicsReviewed();
      
      // Get the selected topic for the RightPanel
      let selectedTopicData = null;
      
      // Transform document data into the format needed for the UI
      const topicsData = [];
      
      // Check for topics in the API response
      if (documentData?.analysis?.topics && documentData.analysis.topics.length > 0) {
        // Use the topics array directly
        documentData.analysis.topics.forEach((topic, index) => {
          const topicData = {
            id: index + 1,
            title: topic.title,
            content: topic.description
          };
          
          if (selectedTopic === index + 1) {
            selectedTopicData = topicData;
          }
          
          topicsData.push(topicData);
        });
      } 
      // Fallback to keyTopics if available (older API format)
      else if (documentData?.keyTopics && documentData.keyTopics.length > 0) {
        documentData.keyTopics.forEach((topic, index) => {
          const description = documentData.analysis?.topicDetails?.[index] || "No description available";
          const topicData = {
            id: index + 1,
            title: topic,
            content: description
          };
          
          if (selectedTopic === index + 1) {
            selectedTopicData = topicData;
          }
          
          topicsData.push(topicData);
        });
      }
      
      return <RightPanel 
        selectedTopic={selectedTopicData} 
        allTopicsReviewed={allTopicsReviewed} 
      />;
    } else {
      return <HistoryTab />;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* This div is explicitly for the TopBar */}
      <div className="w-full">
        <TopBar activeTab={mainTab} setActiveTab={setMainTab} />
      </div>
      
      {/* This is the main content area with the PageLayout */}
      <div className="flex-1 overflow-hidden">
        <PageLayout 
          leftContent={renderLeftContent()}
          rightContent={renderRightContent()}
        />
      </div>
    </div>
  );
};

export default Results;
