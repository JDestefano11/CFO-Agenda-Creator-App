import React, { useState, useEffect } from "react";
import { FiCheckCircle, FiXCircle, FiClock, FiFile, FiChevronRight } from "react-icons/fi";
import { useResults } from "../../context/ResultsContext";
import axios from "axios";
import { API_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";

/**
 * HistoryTab component displays a list of previously analyzed documents
 */
const HistoryTab = () => {
  const { navigate } = useResults();
  const { token } = useAuth();
  const [documentHistory, setDocumentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Fetch document history from the API
  useEffect(() => {
    const fetchDocumentHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/history/user-history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.data && response.data.history) {
          setDocumentHistory(response.data.history);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching document history:", err);
        setError("Failed to load document history. Please try again later.");
        setLoading(false);
      }
    };

    fetchDocumentHistory();
  }, [token]);

  // Fetch document details when a document is selected
  const fetchDocumentDetails = async (documentId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/history/document/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setSelectedDocument(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching document details:", err);
      setError("Failed to load document details. Please try again later.");
      setLoading(false);
    }
  };

  const handleDocumentClick = (documentId) => {
    fetchDocumentDetails(documentId);
  };

  const handleViewResults = (documentId) => {
    localStorage.setItem("currentDocumentId", documentId);
    navigate("/results", { state: { documentId } });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <FiCheckCircle className="text-green-500" />;
      case "rejected":
        return <FiXCircle className="text-red-500" />;
      case "pending":
      default:
        return <FiClock className="text-amber-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && !documentHistory.length) {
    return (
      <div className="p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !documentHistory.length) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto">

      {documentHistory.length === 0 ? (
        <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
          <FiFile className="mx-auto text-gray-400 text-4xl mb-2" />
          <p className="text-gray-500">No document history found</p>
          <p className="text-sm text-gray-400 mt-1">Upload and analyze documents to see them here</p>
        </div>
      ) : selectedDocument ? (
        <div className="pb-20">
          <button 
            onClick={() => setSelectedDocument(null)}
            className="mb-4 flex items-center text-indigo-600 hover:text-indigo-800 cursor-pointer transition-colors duration-200"
          >
            <FiChevronRight className="transform rotate-180 mr-1" /> Back to history
          </button>
          
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-xl font-semibold mb-3">{selectedDocument.currentDocument?.fileName || "Document Details"}</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Created: {formatDate(selectedDocument.currentDocument?.createdAt)}
              </p>
              <p className="text-sm text-gray-500">
                Type: {selectedDocument.currentDocument?.fileType}
              </p>
            </div>
            
            {selectedDocument.currentDocument?.analysis && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Analysis</h4>
                
                {selectedDocument.currentDocument.analysis.summary && (
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-gray-600">Summary</h5>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedDocument.currentDocument.analysis.summary}</p>
                  </div>
                )}
                
                {selectedDocument.currentDocument.analysis.keyTopics && selectedDocument.currentDocument.analysis.keyTopics.length > 0 && (
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-gray-600">Key Topics</h5>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedDocument.currentDocument.analysis.keyTopics.map((topic, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedDocument.currentDocument.analysis.actionItems && (
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-gray-600">Action Items</h5>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedDocument.currentDocument.analysis.actionItems}</p>
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={() => handleViewResults(selectedDocument.currentDocument.id)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center justify-center cursor-pointer transition-colors duration-200 shadow-sm hover:shadow"
            >
              View Full Results
            </button>
          </div>
          
          {selectedDocument.versionHistory && selectedDocument.versionHistory.length > 0 && (
            <div className="mt-8">
              <h4 className="font-medium text-gray-700 mb-4">Version History</h4>
              <div className="space-y-4 pb-32">
                {selectedDocument.versionHistory.map((version) => (
                  <div key={version._id} className="border border-gray-200 rounded p-4 hover:bg-gray-50 hover:border-gray-300 cursor-pointer mb-2 transition-all duration-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Version {version.version}</p>
                        <p className="text-sm text-gray-500 mt-1">{formatDate(version.timestamp)}</p>
                      </div>
                      {version.analysisSnapshot && (
                        <button
                          className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded cursor-pointer transition-colors duration-200"
                          onClick={() => {
                            // Show version details
                            // This could be expanded to show a modal with version details
                            alert(`Analysis from version ${version.version}: ${version.analysisSnapshot.summary}`);
                          }}
                        >
                          View Analysis
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3 pb-20">
          {documentHistory.map((doc) => (
            <div
              key={doc.id}
              className="p-4 border border-gray-200 hover:border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-white cursor-pointer"
              onClick={() => handleDocumentClick(doc.documentId)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3">
                    <FiFile className="text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{doc.fileName || 'Document ' + doc.id}</h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(doc.timestamp)} • {doc.version ? `Version ${doc.version}` : 'Latest version'}
                    </p>
                  </div>
                </div>
                <div className="text-xs px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                  View
                </div>
              </div>
              {doc.summary && (
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{doc.summary}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryTab;