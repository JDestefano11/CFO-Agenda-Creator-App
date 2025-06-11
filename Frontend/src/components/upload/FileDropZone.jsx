import React from 'react';
import { FiUpload } from "react-icons/fi";

/**
 * FileDropZone component for handling drag and drop file uploads
 */
const FileDropZone = ({ 
  isDragging, 
  handleDragEnter, 
  handleDragLeave, 
  handleDragOver, 
  handleDrop, 
  fileInputRef, 
  handleFileInputChange 
}) => {
  return (
    <div
      className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
        isDragging
          ? "border-indigo-500 bg-indigo-50"
          : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50"
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="bg-indigo-100 p-3 rounded-full mb-4">
          <FiUpload className="h-8 w-8 text-indigo-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          Drag & Drop your document
        </h3>
        <p className="text-gray-500 mb-4">
          or click to browse from your computer
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Select File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
          onChange={handleFileInputChange}
        />
        <p className="text-xs text-gray-500 mt-4">
          Supported formats: PDF, Word, Excel, Text
        </p>
      </div>
    </div>
  );
};

export default FileDropZone;
