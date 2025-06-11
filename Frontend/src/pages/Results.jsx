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
    
    // First try to split by newlines
    let points = content.split('\n').filter(line => line.trim() !== '');
    
    // If we only got one item, try to split by sentences
    if (points.length <= 1) {
      points = content.split(/\.\s+/).filter(sentence => sentence.trim().length > 0);
      
      // Add periods back to sentences if they were removed during splitting
      points = points.map(point => {
        if (!point.endsWith('.') && !point.endsWith('!') && !point.endsWith('?')) {
          return point + '.';
        }
        return point;
      });
    }
    
    return points;
  };
  
  // Handle topic selection
  const handleTopicSelect = (topicId) => {
    setSelectedTopic(topicId);
  };
  
  // This comment intentionally left to maintain code structure
  
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
    } 
    // Fallback to keyTopics if available (older API format)
    else if (documentData?.keyTopics && documentData.keyTopics.length > 0) {
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
      <div className="h-full p-4">
        {topicsData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No topics available</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-[85%] mx-auto">
            {topicsData.map((topic) => {
              const bulletPoints = formatContentAsBullets(topic.content);

              return (
                <div
                  key={topic.id}
                  className={`w-full p-6 rounded-lg relative cursor-pointer transition-all shadow-sm hover:shadow-md
                    ${approvedTopics.includes(topic.id) ? "border-2 border-green-500 bg-green-100" : ""}
                    ${rejectedTopics.includes(topic.id) ? "border-2 border-red-500 bg-red-50" : ""}
                    ${!approvedTopics.includes(topic.id) && !rejectedTopics.includes(topic.id) && selectedTopic === topic.id ? "border-2 border-indigo-600 bg-indigo-50" : ""}
                    ${!approvedTopics.includes(topic.id) && !rejectedTopics.includes(topic.id) && selectedTopic !== topic.id ? "border border-gray-200 hover:bg-gray-50" : ""}
                  `}
                  onClick={() => handleTopicSelect(topic.id)}
                >
                  {/* Approval/Rejection badges */}
                  {approvedTopics.includes(topic.id) && (
                    <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                      <div className="w-8 h-8 rounded-full bg-green-500 shadow-lg flex items-center justify-center border-2 border-white animate-[pulse_0.3s_ease-out]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                  {rejectedTopics.includes(topic.id) && (
                    <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                      <div className="w-8 h-8 rounded-full bg-red-500 shadow-lg flex items-center justify-center border-2 border-white animate-[pulse_0.3s_ease-out]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <h3 className={`font-medium mb-2 ${approvedTopics.includes(topic.id) ? 'text-green-800' : 'text-gray-800'}`}>
                    {topic.title}
                  </h3>

                  {/* Bullet points display */}
                  <ul className={`text-sm ml-5 list-disc space-y-1 mb-2 ${approvedTopics.includes(topic.id) ? 'text-green-700' : 'text-gray-600'}`}>
                    {bulletPoints.slice(0, 3).map((point, index) => (
                      <li key={index} className="break-normal">
                        {point}
                      </li>
                    ))}
                    {bulletPoints.length > 3 && (
                      <li className="text-gray-500 italic">
                        ...and {bulletPoints.length - 3} more points
                      </li>
                    )}
                  </ul>

                  {/* Action buttons */}
                  <div className="flex justify-end mt-3 space-x-2">
                    <button
                      className={`p-1.5 rounded-full ${approvedTopics.includes(topic.id) ? "bg-green-500 text-white" : "bg-green-100 hover:bg-green-200 text-green-700"} transition-colors`}
                      onClick={(e) => handleApprove(e, topic.id)}
                      title="Approve"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      className="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
                      onClick={(e) => handleEdit(e, topic)}
                      title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      className={`p-1.5 rounded-full ${rejectedTopics.includes(topic.id) ? "bg-red-500 text-white" : "bg-red-100 hover:bg-red-200 text-red-700"} transition-colors`}
                      onClick={(e) => handleReject(e, topic.id)}
                      title="Reject"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
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
