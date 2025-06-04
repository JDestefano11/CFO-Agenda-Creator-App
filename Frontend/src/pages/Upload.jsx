import React, { useState, useRef } from "react";
import axios from "axios";
import { FiUpload } from "react-icons/fi";
import {
  AiOutlineFilePdf,
  AiOutlineFileWord,
  AiOutlineFileExcel,
  AiOutlineFileText,
} from "react-icons/ai";

const DocumentUpload = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

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
    const newFiles = Array.from(fileList);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadError("");
    setUploadSuccess(false);

    // DEVELOPMENT MODE: Skip actual API call for testing without backend
    const DEV_MODE = true; // Set to false when backend is available

    if (DEV_MODE) {
      // Simulate successful upload
      setTimeout(() => {
        setUploadSuccess(true);
        setFiles([]);
        console.log(
          "Development mode: Simulated successful upload of",
          files.length,
          "files"
        );
        setUploading(false);
      }, 1500); // Simulate network delay

      return;
    }

    // PRODUCTION MODE: Make actual API call
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("documents", file);
    });

    try {
      const response = await axios.post("/api/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadSuccess(true);
      setFiles([]);
      console.log("Upload successful:", response.data);
    } catch (error) {
      setUploadError("Failed to upload documents. Please try again.");
      console.error("Upload error:", error);
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
            className={`border-2 border-dashed rounded-lg p-10 text-center transition-all mx-auto max-w-md ${
              isDragging
                ? "border-indigo-400 bg-indigo-50"
                : "border-gray-300 hover:border-indigo-400"
            }`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FiUpload
              className="h-12 w-12 mx-auto text-indigo-500 mb-4"
              size={48}
            />
            <h3 className="text-xl font-medium text-indigo-900 mb-2">
              Drop files here
            </h3>
            <p className="text-indigo-600 mb-4">or</p>
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
            >
              Select Documents
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              multiple
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
            />
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="mt-8 text-center">
              <h3 className="text-lg font-medium text-indigo-900 mb-4">
                Selected Files ({files.length})
              </h3>
              <ul className="space-y-3 max-h-60 overflow-y-auto mx-auto max-w-lg">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-center">
                      {getFileIcon(file.name)}
                      <div className="ml-3 text-left">
                        <p className="text-gray-800 font-medium truncate max-w-xs">
                          {file.name}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                  className={`px-6 py-2 rounded-md text-white font-medium ${
                    uploading
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } transition-colors`}
                >
                  {uploading ? "Uploading..." : "Upload Documents"}
                </button>
              </div>
            </div>
          )}

          {/* Success/Error messages */}
          {uploadSuccess && (
            <div className="mt-4 p-3 bg-green-50 border border-green-500 text-green-700 rounded-md mx-auto max-w-md text-center">
              Documents uploaded successfully! Your analysis will begin shortly.
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
