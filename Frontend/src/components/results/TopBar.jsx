import React from 'react';
import { useResults } from '../../context/ResultsContext';

const TopBar = () => {
  // Get data and handlers from context
  const { mainTab: activeTab, setMainTab: setActiveTab } = useResults();
  return (
    <div className="flex w-full h-16 border-b-2 border-gray-400 bg-white relative mt-15 z-10">
      {/* Left side - Document Analysis title */}
      <div className="w-[70%] flex justify-center items-center">
        <h2 className="text-xl font-semibold">Document Analysis</h2>
      </div>
      
     {/* Vertical divider line */}
     <div className="absolute left-[70%] top-0 bottom-0 w-[1px] bg-gray-300"></div>
  {/* Right side - Tabs */}
  <div className="w-[30%] flex justify-center">
        <div className="flex w-full h-full">
          <button 
            onClick={() => setActiveTab('results')}
            className={`flex-1 flex items-center justify-center transition-colors duration-200 cursor-pointer h-full ${
              activeTab === 'results' 
                ? 'text-indigo-600 font-medium bg-indigo-50' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            Results
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center transition-colors duration-200 cursor-pointer h-full ${
              activeTab === 'history' 
                ? 'text-indigo-600 font-medium bg-indigo-50' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            History
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
