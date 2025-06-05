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
      <div className="w-[30%] flex items-center pl-6">
        <button 
          onClick={() => setActiveTab('results')}
          className={`mr-4 ${activeTab === 'results' ? 'font-bold text-blue-600' : 'text-gray-600'}`}
        >
          Results
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`${activeTab === 'history' ? 'font-bold text-blue-600' : 'text-gray-600'}`}
        >
          History
        </button>
      </div>
    </div>
  );
};

TopBar.propTypes = {
  activeTab: PropTypes.oneOf(['results', 'history']).isRequired,
  setActiveTab: PropTypes.func.isRequired
};

export default TopBar;
