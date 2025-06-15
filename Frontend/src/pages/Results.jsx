import React, { useState } from "react";
import TopBar from "../components/results/TopBar";
import PageLayout from "../components/results/PageLayout";
import HistoryTab from "../components/results/HistoryTab";
import RightPanel from "../components/results/RightPanel";
import TopicEditor from "../components/results/TopicEditor";
import TopicList from "../components/results/TopicList";
import ConfirmationModal from "../components/results/ConfirmationModal";
import OutputModal from "../components/OutputModal";
import LoadingPage from "./LoadingPage";
import { ResultsProvider, useResults } from '../context/ResultsContext';
import { generateExportContent } from '../utils/exportUtils';

// Main Results component that uses the context
const ResultsContent = () => {
  // Get data and handlers from context
  const {
    loading,
    error,
    mainTab,
    setMainTab,
    editingTopic,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    isOutputModalOpen,
    setIsOutputModalOpen,
    handleSaveEdit,
    handleCancelEdit,
    handleConfirmApproval,
    getTopicsData,
    navigate,
    approvedTopics,
    rejectedTopics,
    location
  } = useResults();
  
  // State for export generation loading
  const [isExportGenerating, setIsExportGenerating] = useState(false);

  // If loading, show loading message
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-gray-600">Loading document analysis...</p>
      </div>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate("/upload")}
          >
            Back to Upload
          </button>
        </div>
      </div>
    );
  }
  
  // No need for handleConfirm as we're using handleConfirmApproval directly from context
  
  // Handle generate from OutputModal
  const handleGenerate = async (options) => {
    try {
      // Get document ID from options or from localStorage
      const docId = options.documentId || localStorage.getItem("currentDocumentId");
      
      if (!docId) {
        alert("No document ID found. Please try again.");
        setIsOutputModalOpen(false);
        return;
      }
      
      // Close the output modal and show loading page
      setIsOutputModalOpen(false);
      setIsExportGenerating(true);
      
      console.log('Generating export with options:', options);
      const result = await generateExportContent(docId, options);
      
      if (result.success) {
        // Navigate to the export page
        navigate('/export', { state: { documentId: docId } });
      } else {
        if (result.authError) {
          navigate('/login');
        } else {
          alert(result.error);
        }
      }
    } catch (error) {
      console.error("Error generating export:", error);
      alert("An error occurred while generating export content.");
      setIsExportGenerating(false);
    }
  };

  // Render left content with interactive topic cards
  const renderLeftContent = () => {
    // Check if we have topics
    const topicsData = getTopicsData();
    
    return (
      <div className="h-full p-4 overflow-y-auto">
        {/* Show TopicEditor if a topic is being edited */}
        {editingTopic ? (
          <div className="mb-6 animate-fadeIn">
            <TopicEditor />
          </div>
        ) : null}
        
        {topicsData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No topics available</p>
          </div>
        ) : (
          <TopicList />
        )}
      </div>
    );
  };

  // Render right content based on active tab
  const renderRightContent = () => {
    if (mainTab === 'results') {
      return <RightPanel />;
    } else if (mainTab === 'history') {
      return <HistoryTab />;
    }
    
    return null;
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* This div is explicitly for the TopBar */}
      <div className="flex-none">
        <TopBar />
      </div>
      <div className="flex-grow overflow-hidden">
        <PageLayout 
          leftContent={renderLeftContent()}
          rightContent={renderRightContent()}
        />
      </div>
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmApproval}
        title="Finalize Topics and Export"
        message={
          <div>
            <p>You have reviewed all topics. Are you ready to finalize and proceed to export? Clicking confirm will take you to the export options.</p>
          </div>
        }
        confirmText="Confirm"
        cancelText="Cancel"
        confirmButtonClass="bg-indigo-600 hover:bg-indigo-700"
      />
      
      {/* Output Modal */}
      <OutputModal
        isOpen={isOutputModalOpen}
        onClose={() => setIsOutputModalOpen(false)}
        onGenerate={handleGenerate}
        documentId={location.state?.documentId || localStorage.getItem("currentDocumentId")}
      />
      
      {/* Export Generation Loading Page */}
      {isExportGenerating && (
        <LoadingPage message="We're preparing your export content. This will just take a moment..." />
      )}
    </div>
  );
};

// Wrapper component that provides the context
const Results = () => {
  return (
    <ResultsProvider>
      <ResultsContent />
    </ResultsProvider>
  );
};

export default Results;
