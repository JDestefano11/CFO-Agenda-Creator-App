import React, { useRef, useEffect, useState } from "react";
import Loading from "../components/Loading";

// Import our new components
import FileDropZone from "../components/upload/FileDropZone";
import FilePreview from "../components/upload/FilePreview";
import UploadButton from "../components/upload/UploadButton";
import StatusMessages from "../components/upload/StatusMessages";

// Import custom hook
import useUpload from "../hooks/useUpload";

const DocumentUpload = () => {
  // Get all upload state and handlers from our custom hook
  const {
    files,
    isDragging,
    uploading,
    uploadSuccess,
    uploadError,
    showLoading,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    onFileInputChange,
    onRemoveFile,
    onUpload,
    onLoadingComplete
  } = useUpload();
  
  const [authToken, setAuthToken] = useState("");
  const fileInputRef = useRef(null);

  // Get authentication token from localStorage when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    }
  }, []);

  // If showing loading screen, render the Loading component
  // Use a fixed height container to prevent page movement
  if (showLoading) {
    return (
      <div className="min-h-screen">
        <Loading duration={5} onComplete={onLoadingComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      {/* Main content */}
      <div className="container max-w-4xl mx-auto z-10">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-4xl w-full mx-auto relative z-10 border border-indigo-100 text-center">
          <h2 className="text-3xl font-bold text-indigo-900 mb-2">
            Document Upload
          </h2>
          <p className="text-indigo-600 mb-8">
            Upload your financial documents for AI-powered analysis
          </p>

          {/* Document types */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-indigo-900 mb-4">
              Recommended Document Types
            </h3>
            <div className="flex flex-wrap justify-center gap-2 mx-auto max-w-2xl">
              <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm border border-indigo-100">
                Financial statements
              </span>
              <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm border border-indigo-100">
                Balance sheets
              </span>
              <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm border border-indigo-100">
                Income statements
              </span>
              <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm border border-indigo-100">
                Cash flow statements
              </span>
              <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm border border-indigo-100">
                Audit reports
              </span>
              <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm border border-indigo-100">
                Tax documents
              </span>
              <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm border border-indigo-100">
                Meeting minutes
              </span>
              <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm border border-indigo-100">
                Quarterly reports
              </span>
              <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm border border-indigo-100">
                Budget forecasts
              </span>
            </div>
          </div>

          {/* Drag and drop area */}
          {files.length === 0 && (
            <FileDropZone 
              isDragging={isDragging}
              handleDragEnter={onDragEnter}
              handleDragLeave={onDragLeave}
              handleDragOver={onDragOver}
              handleDrop={onDrop}
              fileInputRef={fileInputRef}
              handleFileInputChange={onFileInputChange}
            />
          )}

          {/* File preview */}
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Selected Document
              </h3>
              <FilePreview 
                file={files[0]} 
                onRemove={() => onRemoveFile(0)} 
              />

              <div className="mt-6 flex justify-center">
                <UploadButton 
                  onClick={() => onUpload(authToken)} 
                  uploading={uploading} 
                />
              </div>
            </div>
          )}

          {/* Success/Error messages - only shown briefly before loading screen appears */}
          <StatusMessages 
            success={uploadSuccess} 
            error={uploadError} 
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
