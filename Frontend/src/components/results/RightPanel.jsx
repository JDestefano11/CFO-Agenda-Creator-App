import React from "react";
import { useResults } from "../../context/ResultsContext";
import ApprovalActions from "./ApprovalActions";

/**
 * RightPanel component displays the selected topic content in detail
 */
const RightPanel = () => {
  const { 
    getTopicsData,
    selectedTopic: selectedTopicId
  } = useResults();
  
  // Get the selected topic data
  const topics = getTopicsData();
  const selectedTopic = selectedTopicId ? topics.find(topic => topic.id === selectedTopicId) : null;

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
      <ApprovalActions />
    </div>
  );
};

export default RightPanel;