import { useState } from 'react';
import {
  handleDragEnter,
  handleDragLeave,
  handleDragOver,
  processFiles,
  extractDocumentId,
  uploadDocument,
  analyzeDocument,
  getErrorMessage
} from '../utils/uploadUtils';

/**
 * Custom hook for handling document uploads
 * @returns {Object} - Upload state and handlers
 */
export const useUpload = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showLoading, setShowLoading] = useState(false);

  // Drag and drop handlers
  const onDragEnter = (e) => {
    const stateUpdate = handleDragEnter(e);
    setIsDragging(stateUpdate.isDragging);
  };

  const onDragLeave = (e) => {
    const stateUpdate = handleDragLeave(e);
    setIsDragging(stateUpdate.isDragging);
  };

  const onDragOver = handleDragOver;

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      const processedFiles = processFiles(e.dataTransfer.files);
      setFiles(processedFiles);
    }
  };

  // File input handlers
  const onFileInputChange = (e) => {
    if (e.target.files) {
      const processedFiles = processFiles(e.target.files);
      setFiles(processedFiles);
    }
  };

  const onRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Upload handler
  const onUpload = async (authToken) => {
    if (files.length === 0) return;

    setUploadError('');
    setUploadSuccess(false);
    setUploading(true);

    try {
      // Upload the document
      const response = await uploadDocument(files[0], authToken);

      // Extract document ID
      const documentId = extractDocumentId(response);

      // Store the document ID in localStorage for use in ResultsPage
      if (documentId) {
        localStorage.setItem('currentDocumentId', documentId);
      }

      // Show success message
      setUploadSuccess(true);
      setFiles([]);

      // Start analysis if we have a document ID
      if (documentId) {
        try {
          // Use the utility function to start analysis
          await analyzeDocument(documentId, authToken);

          // Show the loading screen with progress animation
          setShowLoading(true);
        } catch (analysisError) {
          setUploadError(
            'Document uploaded but analysis could not be started. Please try again.'
          );
        }
      } else {
        // If no document ID is found, show an error
        setUploadError(
          'Upload succeeded but document ID was not returned. Please try again.'
        );
      }
    } catch (error) {
      // Use the utility function to get appropriate error message
      setUploadError(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  };

  // Loading completion handler
  const onLoadingComplete = () => {
    setShowLoading(false);
    setFiles([]);
    // Clear the document ID from localStorage
    localStorage.removeItem('currentDocumentId');
  };

  return {
    // State
    files,
    isDragging,
    uploading,
    uploadSuccess,
    uploadError,
    showLoading,
    
    // Handlers
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    onFileInputChange,
    onRemoveFile,
    onUpload,
    onLoadingComplete
  };
};

export default useUpload;
