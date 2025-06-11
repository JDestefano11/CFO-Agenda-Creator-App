import React from 'react';
import PropTypes from 'prop-types';

/**
 * A reusable confirmation modal component
 */
const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  confirmButtonClass = "bg-indigo-600 hover:bg-indigo-700"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop - slight blur to keep results page visible but slightly blurred */}
      <div 
        className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-[2px] transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 z-10 animate-fadeIn border-2 border-indigo-300">
        {/* Close button */}
        <button 
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Title */}
        <h3 className="text-xl font-medium text-indigo-900 mb-4 text-center">{title}</h3>
        
        {/* Message */}
        <div className="text-gray-700 mb-8 text-center">
          {message}
        </div>
        
        {/* Buttons - centered with Confirm on the left */}
        <div className="flex justify-center space-x-4">
          <button
            className={`px-5 py-2 text-sm font-medium text-white rounded-md cursor-pointer transition-colors shadow-sm ${confirmButtonClass}`}
            onClick={() => {
              onConfirm();
              // Don't close the modal here, let the navigation happen first
            }}
          >
            {confirmText}
          </button>
          <button
            className="px-5 py-2 text-sm font-medium text-indigo-700 bg-white border border-indigo-300 hover:bg-indigo-50 rounded-md cursor-pointer transition-colors shadow-sm"
            onClick={onClose}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.node.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmButtonClass: PropTypes.string
};

export default ConfirmationModal;