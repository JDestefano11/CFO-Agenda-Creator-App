import React from 'react';
import PropTypes from 'prop-types';

const LeftPanel = ({ topicsData, selectedTopic, approvedTopics, rejectedTopics, handleTopicSelect }) => {
  // Format content as bullet points
  const formatContentAsBullets = (content) => {
    if (!content) return [];
    return content.split('\n').filter(line => line.trim() !== '');
  };

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
                    <div className="bg-green-500 text-white rounded-full p-1 shadow-md">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
                {rejectedTopics.includes(topic.id) && (
                  <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                    <div className="bg-red-500 text-white rounded-full p-1 shadow-md">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                )}

                <h3 className="text-lg font-semibold mb-2">{topic.title}</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {bulletPoints.slice(0, 3).map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                  {bulletPoints.length > 3 && (
                    <li className="text-gray-500 italic">...and {bulletPoints.length - 3} more points</li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

LeftPanel.propTypes = {
  topicsData: PropTypes.array.isRequired,
  selectedTopic: PropTypes.number,
  approvedTopics: PropTypes.array.isRequired,
  rejectedTopics: PropTypes.array.isRequired,
  handleTopicSelect: PropTypes.func.isRequired
};

export default LeftPanel;
