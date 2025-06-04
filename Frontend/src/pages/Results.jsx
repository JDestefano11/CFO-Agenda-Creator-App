import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiDownload, FiShare2, FiCopy, FiEdit } from "react-icons/fi";
import { AiOutlineCheckCircle, AiOutlineClockCircle } from "react-icons/ai";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("topics");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDocumentAnalysis = async () => {
      try {
        // Get document ID from location state or localStorage
        const documentId = 
          (location.state && location.state.documentId) || 
          localStorage.getItem("currentDocumentId");

        if (!documentId) {
          setError("No document ID found. Please upload a document first.");
          setLoading(false);
          return;
        }

        // Get auth token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch document analysis from API
        const response = await axios.get(
          `http://localhost:5000/api/documents/${documentId}/analysis`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Document analysis response:", response.data);

        if (response.data.analyzed) {
          setDocumentData(response.data);
        } else {
          setError("Document analysis is still in progress or not available.");
        }
      } catch (err) {
        console.error("Error fetching document analysis:", err);
        setError(
          err.response?.data?.message || 
          "Failed to fetch document analysis. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentAnalysis();
  }, [location.state, navigate]);

  const handleCopyLink = () => {
    const documentId = 
      (location.state && location.state.documentId) || 
      localStorage.getItem("currentDocumentId");
    
    if (documentId) {
      const shareableLink = `${window.location.origin}/results?id=${documentId}`;
      navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderTopics = () => {
    if (!documentData || !documentData.keyTopics || documentData.keyTopics.length === 0) {
      return (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No topics found for this document.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {documentData.keyTopics.map((topic, index) => {
          // Get topic description from the analysis.topicDetails object
          const topicDescription = documentData.analysis?.topicDetails?.[index] || 
            "This topic was identified as a key area of focus in the document.";
            
          return (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start">
                <div className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg text-gray-800">{topic}</h3>
                  <p className="text-gray-600 mt-2 whitespace-pre-line">
                    {topicDescription}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center">
                  <FiEdit className="mr-1" /> Add notes
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSummary = () => {
    if (!documentData || !documentData.analysis || !documentData.analysis.summary) {
      return (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No summary available for this document.</p>
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-medium text-lg text-gray-800 mb-4">Document Summary</h3>
        <p className="text-gray-600 whitespace-pre-line">{documentData.analysis.summary}</p>
      </div>
    );
  };

  const renderFinancialFigures = () => {
    if (!documentData || !documentData.analysis || !documentData.analysis.financialFigures) {
      return (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No financial figures found in this document.</p>
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-medium text-lg text-gray-800 mb-4">Financial Figures</h3>
        <p className="text-gray-600 whitespace-pre-line">{documentData.analysis.financialFigures}</p>
      </div>
    );
  };

  const renderActionItems = () => {
    if (!documentData || !documentData.analysis || !documentData.analysis.actionItems) {
      return (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No action items identified for this document.</p>
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-medium text-lg text-gray-800 mb-4">Action Items</h3>
        <p className="text-gray-600 whitespace-pre-line">{documentData.analysis.actionItems}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading document analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Analysis Not Available</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/upload")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Upload New Document
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Document info header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {documentData?.documentName || "Document Analysis Results"}
              </h1>
              <p className="text-gray-500 mt-1">
                Analyzed {documentData?.analysis?.analyzedAt 
                  ? new Date(documentData.analysis.analyzedAt).toLocaleDateString() 
                  : "recently"}
              </p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <button className="flex items-center text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg">
                <FiDownload className="mr-2" /> Export
              </button>
              <button className="flex items-center text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg">
                <FiShare2 className="mr-2" /> Share
              </button>
              <button 
                className="flex items-center text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <>
                    <AiOutlineCheckCircle className="mr-2 text-green-500" /> Copied
                  </>
                ) : (
                  <>
                    <FiCopy className="mr-2" /> Copy Link
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              <button
                onClick={() => setActiveTab("topics")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "topics"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Key Topics
              </button>
              <button
                onClick={() => setActiveTab("summary")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "summary"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => setActiveTab("financial")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "financial"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Financial Figures
              </button>
              <button
                onClick={() => setActiveTab("actions")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "actions"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Action Items
              </button>
            </nav>
          </div>
        </div>

        {/* Tab content */}
        <div className="mb-8">
          {activeTab === "topics" && renderTopics()}
          {activeTab === "summary" && renderSummary()}
          {activeTab === "financial" && renderFinancialFigures()}
          {activeTab === "actions" && renderActionItems()}
        </div>
      </div>
    </div>
  );
};

export default Results;
