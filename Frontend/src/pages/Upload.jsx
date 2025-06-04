import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FiUpload } from "react-icons/fi";
import {
  AiOutlineFilePdf,
  AiOutlineFileWord,
  AiOutlineFileExcel,
  AiOutlineFileText,
} from "react-icons/ai";
import Loading from "../components/Loading";

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

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList) => {
    // Only take the first file, ignoring any others
    if (fileList.length > 0) {
      setFiles([fileList[0]]);
    }
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploadError("");
    setUploadSuccess(false);

    const formData = new FormData();

    // Only single file upload is supported
    if (files.length > 0) {
      formData.append("document", files[0]);
    }

    try {
      // Show uploading state
      setUploading(true);

      // Log what we're sending to help debug
      console.log(
        "Uploading files:",
        files.map((f) => ({ name: f.name, size: f.size, type: f.type }))
      );

      const response = await axios.post(
        "http://localhost:5000/api/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
          // Add timeout and validate status options
          timeout: 30000, // 30 second timeout
          validateStatus: (status) => status < 500,
        }
      );

      // Log the full response to help debug
      console.log("Upload successful - Full response:", response);
      console.log("Response data:", response.data);

      // Explicitly log the document object and its properties
      if (response.data && response.data.document) {
        console.log("Document object:", response.data.document);
      }

      // Try to extract document ID from various possible response formats
      let documentId = null;

      // Force direct extraction based on the known response structure
      if (
        response.data &&
        response.data.document &&
        response.data.document.id
      ) {
        documentId = response.data.document.id;
        console.log("DIRECT EXTRACTION - Document ID:", documentId);
      }

      // If direct extraction failed, try parsing the response as a string
      if (!documentId && response.data) {
        try {
          // Try to parse the entire response as a string if it's not already an object
          const responseStr = JSON.stringify(response.data);
          console.log("Response as string:", responseStr);

          // Use regex to extract the ID
          const idMatch = responseStr.match(/"id"\s*:\s*"([^"]+)"/i);
          if (idMatch && idMatch[1]) {
            documentId = idMatch[1];
            console.log("REGEX EXTRACTION - Document ID:", documentId);
          }
        } catch (e) {
          console.error("Error parsing response:", e);
        }
      }

      // Store the document ID in localStorage for use in ResultsPage
      if (documentId) {
        localStorage.setItem("currentDocumentId", documentId);
        console.log("Document ID saved to localStorage:", documentId);
      } else {
        console.warn("No document ID found in response");
        // For testing purposes, set a mock document ID
        localStorage.setItem("currentDocumentId", "mock-document-id-123");
      }
      // If we still don't have an ID, log the failure
      if (!documentId) {
        console.log(
          "Could not find document ID in response. Response structure:",
          JSON.stringify(response.data)
        );
      }

      // Show success message
      setUploadSuccess(true);
      setUploading(false);
      setFiles([]);

      // Start analysis if we have a document ID
      if (documentId) {
        try {
          // Start analysis in the background if we have a document ID
          const analysisResponse = await axios.post(
            `http://localhost:5000/api/documents/${documentId}/analyze`,
            {},
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          console.log("Analysis started successfully:", analysisResponse.data);

          // Store document ID in localStorage for the Loading component to access
          localStorage.setItem("currentDocumentId", documentId);

          // Show the loading screen with progress animation
          // The Loading component will handle the navigation when complete
          setShowLoading(true);
        } catch (analysisError) {
          console.error("Error starting analysis:", analysisError);
          setUploadError(
            "Document uploaded but analysis could not be started. Please try again."
          );
        }
      } else {
        // If no document ID is found, show an error
        console.error("No document ID received from server");
        setUploadError(
          "Upload succeeded but document ID was not returned. Please try again."
        );
      }
    } catch (error) {
      // Log detailed error information
      console.error("Upload error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      // Set more specific error message based on error type
      if (error.response?.status === 500) {
        setUploadError(
          "Server error occurred. The backend might be experiencing issues. Please try again later."
        );
      } else if (error.response?.status === 413) {
        setUploadError("File too large. Please upload a smaller file.");
      } else if (error.response?.status === 415) {
        setUploadError(
          "Unsupported file type. Please upload a supported document type."
        );
      } else if (error.response?.data?.message) {
        setUploadError(`Error: ${error.response.data.message}`);
      } else {
        setUploadError("Failed to upload documents. Please try again.");
      }

      // Continue with error handling without development mode fallback
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();

    switch (extension) {
      case "pdf":
        return <AiOutlineFilePdf className="h-6 w-6 text-red-500" />;
      case "doc":
      case "docx":
        return <AiOutlineFileWord className="h-6 w-6 text-blue-500" />;
      case "xls":
      case "xlsx":
        return <AiOutlineFileExcel className="h-6 w-6 text-green-500" />;
      case "csv":
        return <AiOutlineFileExcel className="h-6 w-6 text-emerald-500" />;
      default:
        return <AiOutlineFileText className="h-6 w-6 text-gray-500" />;
    }
  };

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
          <div
            className={`mx-auto max-w-xl border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging
                ? "border-indigo-400 bg-indigo-50"
                : "border-gray-200 hover:border-indigo-400"
            }`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {files.length === 0 ? (
              <>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
                  <FiUpload className="text-indigo-600" size={32} />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  Drag & Drop Your Document
                </h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  Supported formats: PDF, DOC, DOCX, XLS, XLSX, CSV, TXT
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium shadow-md hover:shadow-lg"
                >
                  Browse Files
                </button>
              </>
            ) : (
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-4 py-2 border border-indigo-300 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors font-medium"
                >
                  Select Different Document
                </button>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
            />
          </div>

          {/* Selected file display */}
          {files.length > 0 && (
            <div className="mt-6 mx-auto max-w-xl">
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center">
                <div className="flex items-center justify-center mb-4 relative">
                  <div className="flex items-center">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      {getFileIcon(files[0].name)}
                    </div>
                    <div className="ml-4 text-left">
                      <p className="text-gray-800 font-medium truncate max-w-xs">
                        {files[0].name}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {(files[0].size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(0)}
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

                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading}
                    className={`w-full py-3 rounded-lg text-white font-medium flex items-center justify-center ${
                      uploading
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg"
                    } transition-all`}
                  >
                    {uploading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>Upload & Analyze Document</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success/Error messages - only shown briefly before loading screen appears */}
          {uploadSuccess && (
            <div className="mt-4 p-3 bg-green-50 border border-green-500 text-green-700 rounded-md mx-auto max-w-md text-center">
              Documents uploaded successfully! Redirecting to analysis...
            </div>
          )}

          {uploadError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-500 text-red-700 rounded-md mx-auto max-w-md text-center">
              {uploadError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
