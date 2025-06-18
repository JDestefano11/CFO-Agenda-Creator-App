import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getExportContent, updateExportContent, finalizeExportContent } from "../utils/exportUtils";
import ExportToolbar from "../components/export/ExportToolbar";
import ExportEditor from "../components/export/ExportEditor";
import LoadingPage from "../pages/LoadingPage";
import ConfirmationModal from "../components/results/ConfirmationModal";
import { FaArrowLeft, FaSave, FaFileExport } from "react-icons/fa";

const Export = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [documentId, setDocumentId] = useState(null);
  const [documentTitle, setDocumentTitle] = useState("");
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [exportFormat, setExportFormat] = useState("pdf");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Fetch export content on component mount
  useEffect(() => {
    const fetchExportContent = async () => {
      setLoading(true);
      
      // Get document ID from location state or localStorage
      const docId = location.state?.documentId || localStorage.getItem("currentDocumentId");
      
      if (!docId) {
        setError("No document ID found. Please go back to the results page.");
        setLoading(false);
        return;
      }
      
      setDocumentId(docId);
      
      try {
        const result = await getExportContent(docId);
        
        if (result.success) {
          // Extract content from the export data structure
          const exportData = result.data.export;
          // Use the modified content if available, otherwise use the original content
          const displayContent = exportData.modifiedContent || exportData.content;
          
          setContent(displayContent);
          setOriginalContent(displayContent);
          setDocumentTitle(result.data.documentTitle || exportData.outputType || "Untitled Document");
        } else {
          if (result.authError) {
            navigate("/login");
            return;
          }
          
          if (result.notFound) {
            setError("No export content found. Please generate export content from the results page.");
          } else {
            setError(result.error);
          }
        }
      } catch (error) {
        console.error("Error fetching export content:", error);
        setError("An error occurred while fetching export content.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchExportContent();
  }, [location, navigate]);

  // Handle content change in the editor
  const handleContentChange = (newContent) => {
    setContent(newContent);
    setHasUnsavedChanges(true);
  };
  
  // Handle applying document templates
  const handleApplyTemplate = (templateContent) => {
    setContent(templateContent);
    setHasUnsavedChanges(true);
  };

  // Handle save
  const handleSave = async () => {
    if (!documentId) return;
    
    setSaving(true);
    
    try {
      const result = await updateExportContent(documentId, content);
      
      if (result.success) {
        setOriginalContent(content);
        setHasUnsavedChanges(false);
        setSaveSuccess(true);
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        if (result.authError) {
          navigate("/login");
          return;
        }
        
        setError(result.error);
      }
    } catch (error) {
      console.error("Error saving export content:", error);
      setError("An error occurred while saving export content.");
    } finally {
      setSaving(false);
    }
  };

  // Handle export
  const handleExport = () => {
    setShowConfirmModal(true);
  };

  // Handle export confirmation
  const handleConfirmExport = async () => {
    setShowConfirmModal(false);
    setIsExporting(true);
    
    try {
      // First save any unsaved changes
      if (hasUnsavedChanges) {
        const updateResult = await updateExportContent(documentId, content);
        if (!updateResult.success) {
          throw new Error(updateResult.error || 'Failed to save changes before export');
        }
      }
      
      // Then finalize the export
      const result = await finalizeExportContent(documentId, content);
      
      if (result.success) {
        // Get the finalized content from the response
        const finalContent = result.data.export.finalContent;
        
        // Create a download link
        const element = document.createElement('a');
        
        // Create appropriate content based on format
        let fileContent;
        let mimeType;
        let fileExtension;
        
        switch(exportFormat) {
          case 'pdf':
            // For PDF, we'll create a styled HTML document that browsers can save as PDF
            fileContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${documentTitle}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
    h1, h2, h3 { color: #2c5282; }
    .header { border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 40px; font-size: 12px; color: #718096; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${documentTitle}</h1>
    <p>Generated on ${new Date().toLocaleDateString()}</p>
  </div>
  ${finalContent}
  <div class="footer">
    <p>Generated using CFO Agenda Creator</p>
  </div>
</body>
</html>`;
            mimeType = 'text/html';
            fileExtension = 'html';
            break;
          case 'docx':
            // For Word documents, we'll create an HTML file that Word can open
            fileContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${documentTitle}</title>
  <style>
    body { font-family: 'Calibri', sans-serif; margin: 1in; }
    h1, h2, h3 { font-family: 'Calibri Light', sans-serif; }
  </style>
</head>
<body>
  <h1>${documentTitle}</h1>
  ${finalContent}
</body>
</html>`;
            mimeType = 'application/vnd.ms-word';
            fileExtension = 'doc';
            break;
          default:
            // Plain text - strip HTML tags
            fileContent = finalContent.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
            mimeType = 'text/plain';
            fileExtension = 'txt';
        }
        
        // Create a blob with the content
        const blob = new Blob([fileContent], { type: mimeType });
        element.href = URL.createObjectURL(blob);
        
        // Set the file name with timestamp to avoid duplicates
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
        const fileName = `${documentTitle.replace(/\s+/g, '_')}_${timestamp}.${fileExtension}`;
        element.download = fileName;
        
        // Trigger the download
        document.body.appendChild(element);
        element.click();
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(element);
          URL.revokeObjectURL(element.href);
        }, 100);
        
        // Show success message with the file name
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50';
        successMessage.innerHTML = `
          <div class="flex items-center">
            <div class="py-1"><svg class="fill-current h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM6.7 9.29L9 11.6l4.3-4.3 1.4 1.42L9 14.4l-3.7-3.7 1.4-1.42z"/></svg></div>
            <div>
              <p class="font-bold">Success!</p>
              <p class="text-sm">Document exported as ${fileName}</p>
            </div>
          </div>
        `;
        document.body.appendChild(successMessage);
        
        // Remove the success message after 5 seconds
        setTimeout(() => {
          if (document.body.contains(successMessage)) {
            document.body.removeChild(successMessage);
          }
        }, 5000);
        
        // Don't navigate away - let the user stay on the export page
        setIsExporting(false);
      } else {
        if (result.authError) {
          navigate("/login");
          return;
        }
        
        setError(result.error);
      }
    } catch (error) {
      console.error("Error exporting document:", error);
      setError("An error occurred while exporting the document.");
    } finally {
      setIsExporting(false);
    }
  };

  // Handle format change
  const handleFormatChange = (format) => {
    setExportFormat(format);
  };

  // Handle back button
  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return <LoadingPage message="Loading export content..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate("/results")}
          >
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with document title */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-800">{documentTitle}</h1>
        </div>
        <div className="flex items-center space-x-2">
          {saving && (
            <span className="text-gray-500 text-sm">Saving...</span>
          )}
          {saveSuccess && (
            <span className="text-green-500 text-sm">Saved!</span>
          )}
          {hasUnsavedChanges && (
            <span className="text-amber-500 text-sm">Unsaved changes</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !hasUnsavedChanges}
            className={`px-3 py-1 rounded text-sm ${
              saving || !hasUnsavedChanges
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Save
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`px-3 py-1 rounded text-sm flex items-center ${
              isExporting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            <FaFileExport className="mr-1" size={12} />
            Export
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 shadow-sm z-10">
        <ExportToolbar 
          onFormatChange={setExportFormat} 
          selectedFormat={exportFormat} 
          onApplyTemplate={handleApplyTemplate}
          content={originalContent}
        />
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-grow overflow-hidden">
        <div className="flex-grow overflow-auto p-4">
          <div className="bg-white shadow-sm rounded-lg max-w-5xl mx-auto h-full">
            <ExportEditor 
              content={content} 
              onChange={handleContentChange} 
            />
          </div>
        </div>
        
        {/* Document info footer */}
        <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">{documentTitle}</span>
            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">Format: {exportFormat.toUpperCase()}</span>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`px-3 py-1 rounded text-sm flex items-center ${
              isExporting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            <FaFileExport className="mr-1" size={12} />
            Export
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmExport}
        title={`Export as ${exportFormat.toUpperCase()}`}
        message={
          <div>
            <p>Are you sure you want to export this document as {exportFormat.toUpperCase()}?</p>
            <p className="mt-2 text-sm text-gray-500">
              This will finalize the document and make it available for download.
            </p>
          </div>
        }
        confirmText="Export"
        cancelText="Cancel"
        confirmButtonClass="bg-green-600 hover:bg-green-700"
      />

      {/* Loading overlay for export process */}
      {isExporting && (
        <LoadingPage message="Exporting your document. This will just take a moment..." />
      )}
    </div>
  );
};

export default Export;
