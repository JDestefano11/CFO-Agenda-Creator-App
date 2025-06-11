import React from 'react';
import PropTypes from 'prop-types';

const TopBar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex w-full h-16 border-b-2 border-gray-400 bg-white relative mt-15 z-10">
      {/* Left side - Document Analysis title */}
      <div className="w-[70%] flex justify-center items-center">
        <h2 className="text-xl font-semibold">Document Analysis</h2>
      </div>
      
     {/* Vertical divider line */}
     <div className="absolute left-[70%] top-0 bottom-0 w-[1px] bg-gray-300"></div>
  {/* Right side - Tabs */}
  <div className="w-[30%] flex items-end justify-center pb-0">
        <div className="flex w-full">
          <button 
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-2 text-center transition-colors duration-200 cursor-pointer ${
              activeTab === 'results' 
                ? 'text-blue-600 font-medium bg-blue-50' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            Results
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-center transition-colors duration-200 cursor-pointer ${
              activeTab === 'history' 
                ? 'text-blue-600 font-medium bg-blue-50' 
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

TopBar.propTypes = {
  activeTab: PropTypes.oneOf(['results', 'history']).isRequired,
  setActiveTab: PropTypes.func.isRequired
};

export default TopBar;
