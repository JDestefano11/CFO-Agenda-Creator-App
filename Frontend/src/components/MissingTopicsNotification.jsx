import React from 'react';

/**
 * Component to display a notification about topics that are missing from the document
 * @param {Object} props - Component props
 * @param {Array} props.missingTopics - List of missing topic names
 */
const MissingTopicsNotification = ({ missingTopics }) => {
  if (!missingTopics || missingTopics.length === 0) {
    return null; // Don't render anything if no topics are missing
  }

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 mt-2 rounded-md shadow-sm">
      <div className="flex">
        <div className="flex-shrink-0">
          {/* Custom info icon */}
          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
            i
          </div>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800">
            Some topics couldn't be found in your document
          </h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>
              The following financial control topics couldn't be identified in the uploaded document:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {missingTopics.map((topic, index) => (
                <li key={index} className="text-sm">
                  {topic}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-3 text-sm text-blue-700 italic">
            Consider providing more information on these topics in future documents.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MissingTopicsNotification;
