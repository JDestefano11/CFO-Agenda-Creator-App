import React from 'react';
import PropTypes from 'prop-types';

const LeftPanel = ({ children }) => {
  return (
    <div style={{ width: '70%', height: '100%', overflow: 'auto' }}>
      {children}
    </div>
  );
};

LeftPanel.propTypes = {
  children: PropTypes.node
};

export default LeftPanel;
