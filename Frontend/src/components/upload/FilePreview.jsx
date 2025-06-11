import React from 'react';
import FileIcon from './FileIcon';

/**
 * FilePreview component to display selected file with remove button
 */
const FilePreview = ({ file, onRemove }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative flex items-center">
      <div className="p-3 bg-white rounded-lg shadow-sm">
        <FileIcon fileName={file.name} />
      </div>
      <div className="ml-4 text-left">
        <p className="text-gray-800 font-medium truncate max-w-xs">
          {file.name}
        </p>
        <p className="text-gray-500 text-sm">
          {(file.size / 1024).toFixed(1)} KB
        </p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors absolute right-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default FilePreview;
