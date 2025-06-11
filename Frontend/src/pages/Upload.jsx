import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Loading from "../components/Loading";

// Import our new components
import FileDropZone from "../components/upload/FileDropZone";
import FilePreview from "../components/upload/FilePreview";
import UploadButton from "../components/upload/UploadButton";
import StatusMessages from "../components/upload/StatusMessages";

// Import utility functions
import {
  handleDragEnter,
  handleDragLeave,
  handleDragOver,
  processFiles,
  extractDocumentId,
  uploadDocument,
  analyzeDocument,
  getErrorMessage
} from "../utils/uploadUtils";

const DocumentUpload = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const fileInputRef = useRef(null);

  // Get authentication token from localStorage when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    }
  }, []);

  // Using the imported utility functions but updating state locally
  const onDragEnter = (e) => {
    const stateUpdate = handleDragEnter(e);
    setIsDragging(stateUpdate.isDragging);
  };

  const onDragLeave = (e) => {
    const stateUpdate = handleDragLeave(e);
    setIsDragging(stateUpdate.isDragging);
  };

  const onDragOver = handleDragOver;

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      const processedFiles = processFiles(e.dataTransfer.files);
      setFiles(processedFiles);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files) {
      const processedFiles = processFiles(e.target.files);
      setFiles(processedFiles);
    }
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploadError("");
    setUploadSuccess(false);
    setUploading(true);

    {/*Beginning of try block */}
    try {

      // Use the utility function to upload the document
      const response = await uploadDocument(files[0], authToken);

      // Use the utility function to extract document ID
      const documentId = extractDocumentId(response);

      // Store the document ID in localStorage for use in ResultsPage
      if (documentId) {
        localStorage.setItem("currentDocumentId", documentId);
      }

      // Show success message
      setUploadSuccess(true);
      setUploading(false);
      setFiles([]);

      // Start analysis if we have a document ID
      if (documentId) {
        try {
          // Use the utility function to start analysis
          const analysisResponse = await analyzeDocument(documentId, authToken);

          // Store document ID in localStorage for the Loading component to access
          localStorage.setItem("currentDocumentId", documentId);

          // Show the loading screen with progress animation
          setShowLoading(true);
        } catch (analysisError) {
          console.error("Error starting analysis:", analysisError);
          setUploadError(
            "Document uploaded but analysis could not be started. Please try again."
          );
        }
      } else {
        // If no document ID is found, show an error
        setUploadError(
          "Upload succeeded but document ID was not returned. Please try again."
        );
      }
    } catch (error) {

      // Use the utility function to get appropriate error message
      setUploadError(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  };
  {/*End of try block */}

  // Function to handle completion of loading
  const handleLoadingComplete = () => {
    setShowLoading(false);
    setFiles([]);
    // Clear the document ID from localStorage
    localStorage.removeItem("currentDocumentId");
  };

  // If showing loading screen, render the Loading component
  // Use a fixed height container to prevent page movement
  if (showLoading) {
    return (
      <div className="min-h-screen">
        <Loading duration={5} onComplete={handleLoadingComplete} />
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
              handleDrop={handleDrop}
              fileInputRef={fileInputRef}
              handleFileInputChange={handleFileInputChange}
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
                onRemove={() => removeFile(0)} 
              />

              <div className="mt-6 flex justify-center">
                <UploadButton 
                  onClick={handleUpload} 
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
