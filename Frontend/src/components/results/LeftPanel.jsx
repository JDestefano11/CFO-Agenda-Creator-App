import React from 'react';

const LeftPanel = ({ children }) => {
  return (
    <div style={{ width: '70%', height: '100%', overflow: 'auto' }}>
      {children}
    </div>
  );
};

export default LeftPanel;
