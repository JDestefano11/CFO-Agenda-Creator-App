import React from 'react';
import { formatContentAsBullets } from '../../utils/topicUtils';
import { useResults } from '../../context/ResultsContext';

/**
 * TopicList component renders a list of topics with approval/rejection badges and action buttons.
 */
const TopicList = () => {
  // Get data and handlers from context
  const {
    getTopicsData,
    approvedTopics,
    rejectedTopics,
    selectedTopic,
    handleTopicSelect,
    handleApprove,
    handleReject,
    handleEdit
  } = useResults();
  
  // Get topics data from context
  const topics = getTopicsData();
  return (
    <div className="space-y-4 max-w-[85%] mx-auto pb-10">
      {topics.map((topic) => {
        const bulletPoints = formatContentAsBullets(topic.content);
        const isApproved = approvedTopics.includes(topic.id);
        const isRejected = rejectedTopics.includes(topic.id);
        const isSelected = selectedTopic === topic.id;

        return (
          <div
            key={topic.id}
            className={`w-full p-6 rounded-lg relative cursor-pointer transition-all shadow-sm hover:shadow-md
              ${isApproved ? "border-2 border-green-500 bg-green-100" : ""}
              ${isRejected ? "border-2 border-red-500 bg-red-50" : ""}
              ${!isApproved && !isRejected && isSelected ? "border-2 border-indigo-600 bg-indigo-50" : ""}
              ${!isApproved && !isRejected && !isSelected ? "border border-gray-200 hover:bg-gray-50" : ""}
            `}
            onClick={() => handleTopicSelect(topic.id)}
          >
            {/* Approval/Rejection badges */}
            {isApproved && (
              <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                <div className="w-8 h-8 rounded-full bg-green-500 shadow-lg flex items-center justify-center border-2 border-white animate-[pulse_0.3s_ease-out]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
            {isRejected && (
              <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                <div className="w-8 h-8 rounded-full bg-red-500 shadow-lg flex items-center justify-center border-2 border-white animate-[pulse_0.3s_ease-out]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
            <h3 className={`font-medium mb-2 ${isApproved ? 'text-green-800' : 'text-gray-800'}`}>
              {topic.title}
            </h3>

            {/* Bullet points display */}
            <ul className={`text-sm ml-5 list-disc space-y-1 mb-2 ${isApproved ? 'text-green-700' : 'text-gray-600'}`}>
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
                className={`p-1.5 rounded-full cursor-pointer ${isApproved ? "bg-green-500 text-white" : "bg-green-100 hover:bg-green-200 text-green-700"} transition-colors`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleApprove(e, topic.id);
                }}
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
                className="p-1.5 rounded-full cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(e, topic);
                }}
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
                className={`p-1.5 rounded-full cursor-pointer ${isRejected ? "bg-red-500 text-white" : "bg-red-100 hover:bg-red-200 text-red-700"} transition-colors`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleReject(e, topic.id);
                }}
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
  );
};


export default TopicList;
