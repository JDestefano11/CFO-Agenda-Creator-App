import React from 'react';
import PropTypes from 'prop-types';

const PageLayout = ({ leftContent, rightContent }) => {
  return (
    <div className="flex h-[calc(100vh-64px)] relative">
      {/* Left panel - 70% width */}
      <div className="w-[70%] h-full overflow-y-auto">
        <div className="p-5 pb-8"> 
        {leftContent}
        </div>
      </div>
      
      {/* Vertical divider line */}
      <div className="absolute left-[70%] top-0 bottom-0 w-[1px] bg-gray-300"></div>
      
      {/* Right panel - 30% width */}
      <div className="w-[30%] h-full p-5 overflow-y-auto">
        {rightContent}
      </div>
    </div>
  );
};

PageLayout.propTypes = {
  leftContent: PropTypes.node,
  rightContent: PropTypes.node
};

export default PageLayout;
