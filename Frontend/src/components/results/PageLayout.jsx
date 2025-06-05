import React from 'react';
import PropTypes from 'prop-types';

const PageLayout = ({ leftContent, rightContent }) => {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Left panel - 70% width */}
      <div className="w-[70%] p-5">
        {leftContent}
      </div>
      
      {/* Vertical divider line - fixed position to stay visible during scrolling */}
      <div className="fixed left-[70%] top-[64px] bottom-0 w-[1px] bg-gray-300"></div>
      
      {/* Right panel - 30% width */}
      <div className="w-[30%] p-5">
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
