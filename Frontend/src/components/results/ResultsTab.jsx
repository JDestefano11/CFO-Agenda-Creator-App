import React, { useState } from "react";
import { useResults } from "../../context/ResultsContext";

/**
 * ResultsTab component displays the selected topic content in detail
 */
const ResultsTab = () => {
  const { 
    getTopicsData,
    selectedTopic: selectedTopicId,
    areAllTopicsReviewed,
    handleShowConfirmationModal
  } = useResults();
  
  // Get the selected topic data
  const topics = getTopicsData();
  const selectedTopic = selectedTopicId ? topics.find(topic => topic.id === selectedTopicId) : null;
  const allTopicsReviewed = areAllTopicsReviewed();
  const [showError, setShowError] = useState(false);
  const handleApprove = () => {
    if (!allTopicsReviewed) {
      console.error('Cannot approve: Not all topics have been reviewed');
      setShowError(true);
      // Hide error message after 5 seconds
      setTimeout(() => setShowError(false), 5000);
      return;
    }
    
    console.log('Content approved');
    // Show confirmation modal
    handleShowConfirmationModal();
  };
  
  const handleReject = () => {
    if (!allTopicsReviewed) {
      console.error('Cannot reject: Not all topics have been reviewed');
      setShowError(true);
      // Hide error message after 5 seconds
      setTimeout(() => setShowError(false), 5000);
      return;
    }
    
    console.log('Content rejected');
  };

  return (
    <div className="p-4 flex flex-col h-full">
      {/* AI Information Box */}
      <div className="bg-purple-100 border-l-4 border-purple-500 text-purple-700 p-4 mb-4">
        <p className="font-medium">This information was extracted by our AI from the uploaded documents. Please make any changes if needed and confirm.</p>
      </div>
      
      {/* Content area */}
      <div className="flex-grow">
        {selectedTopic && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">{selectedTopic.title}</h2>
            <p className="text-gray-700">{selectedTopic.content}</p>
          </div>
        )}
      </div>
      
      {/* Messages and buttons container - fixed at bottom */}
      <div className="mt-auto">
        {/* Red error message when button is clicked without reviewing all topics */}
        {showError && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 mb-6 animate-pulse shadow-lg rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="font-bold text-lg text-red-800">Action Required</p>
                <p className="text-base mt-1 font-medium">You must approve or reject all topics before proceeding.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Yellow warning message when not all topics are reviewed */}
        {!allTopicsReviewed && !showError && (
          <div className="bg-yellow-100 border-2 border-yellow-500 text-yellow-700 p-4 mb-6 shadow-md rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-7 w-7 text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-base font-medium">Please approve or reject all topics before proceeding.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Approve/Reject Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          <button 
            onClick={handleApprove}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-sm cursor-pointer transition-all hover:bg-indigo-700 hover:shadow-md active:bg-indigo-800 active:shadow-inner"
          >
            Approve
          </button>
          <button 
            onClick={handleReject}
            className="px-6 py-2 bg-white text-indigo-600 font-medium rounded-md border border-indigo-600 shadow-sm cursor-pointer transition-all hover:bg-indigo-50 hover:shadow-md active:bg-indigo-100 active:shadow-inner"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsTab;