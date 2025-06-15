import React, { useRef, useEffect, useState, useCallback } from "react";

const ExportEditor = ({ content, onChange }) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [wordCount, setWordCount] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  
  // Initialize editor with content
  useEffect(() => {
    if (editorRef.current) {
      // Only set content if it's different from current content to avoid cursor jumping
      if (editorRef.current.innerHTML !== content) {
        editorRef.current.innerHTML = content;
        updateWordCount();
      }
    }
  }, [content]);

  // Calculate word count
  const updateWordCount = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  };

  // Check content and add pages as needed
  const checkContentOverflow = useCallback(() => {
    if (!editorRef.current || !containerRef.current) return;
    
    // Get standard page height (11 inches)
    const standardPageHeight = 11 * 96; // 11 inches at 96 DPI
    setPageHeight(standardPageHeight);
    
    // Get the content height
    const contentHeight = editorRef.current.scrollHeight;
    
    // Calculate how many pages we need
    const pagesNeeded = Math.max(1, Math.ceil(contentHeight / standardPageHeight));
    setPageCount(pagesNeeded);
    
    // Determine current page based on scroll position
    const scrollTop = containerRef.current.scrollTop;
    const currentPageNum = Math.floor(scrollTop / standardPageHeight) + 1;
    setCurrentPage(Math.min(currentPageNum, pagesNeeded));
    
    // Update word count
    updateWordCount();
  }, []);
  
  // Monitor content changes and scrolling
  useEffect(() => {
    // Initial check
    checkContentOverflow();
    
    // Set up mutation observer to detect content changes
    const observer = new MutationObserver(() => {
      checkContentOverflow();
      if (onChange && editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    });
    
    if (editorRef.current) {
      observer.observe(editorRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true
      });
    }
    
    // Handle window resize
    const handleResize = () => checkContentOverflow();
    window.addEventListener('resize', handleResize);
    
    // Handle scrolling to detect current page
    const handleScroll = () => {
      if (containerRef.current && pageHeight > 0) {
        const scrollTop = containerRef.current.scrollTop;
        const currentPageNum = Math.floor(scrollTop / pageHeight) + 1;
        setCurrentPage(Math.min(currentPageNum, pageCount));
      }
    };
    
    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [checkContentOverflow, onChange, pageCount, pageHeight]);

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    // Support common keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          document.execCommand('bold', false);
          break;
        case 'i':
          e.preventDefault();
          document.execCommand('italic', false);
          break;
        case 'u':
          e.preventDefault();
          document.execCommand('underline', false);
          break;
        default:
          break;
      }
    }
    
    // Check for Enter key to potentially add new page
    if (e.key === 'Enter') {
      setTimeout(checkContentOverflow, 0);
    }
  };
  
  // Handle input changes
  const handleInput = () => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    checkContentOverflow();
  };
  
  // Handle paste to clean up formatting
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand("insertText", false, text);
    setTimeout(checkContentOverflow, 0);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Full-page document editor */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto bg-gray-200"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23d1d5db' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      >
        {/* Single continuous document with page break indicators and visual separation */}
        <div className="w-full py-8 flex flex-col items-center">
          <div 
            className="bg-white shadow-lg w-[8.5in] p-6 md:p-[1in] box-border mb-8 relative"
            style={{ 
              maxWidth: "100%",
              minHeight: `${pageCount * 11}in`, // Dynamically adjust height based on page count
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
            }}
          >
            {/* Page break indicators */}
            {Array.from({ length: Math.max(0, pageCount - 1) }).map((_, i) => (
              <div 
                key={`page-break-${i+1}`}
                className="absolute w-full border-t-2 border-blue-300 border-dashed pointer-events-none"
                style={{ 
                  top: `${(i+1) * pageHeight}px`,
                  left: 0
                }}
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-md shadow-sm">
                  Page {i+1} End
                </div>
              </div>
            ))}
            
            {/* Single continuous editable area */}
            <div
              ref={editorRef}
              className="outline-none min-h-full prose prose-sm max-w-none"
              contentEditable
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              style={{
                fontFamily: "'Segoe UI', Calibri, sans-serif",
                fontSize: "11pt",
                lineHeight: "1.6",
                color: "#333333",
                letterSpacing: "0.01em"
              }}
            />
              
            {/* Current page indicator (floating) */}
            <div className="fixed right-8 bottom-20 bg-blue-600 text-white px-3 py-1 rounded-full text-xs shadow-lg z-50">
              Page {currentPage} of {pageCount}
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced status bar */}
      <div className="bg-white border-t border-gray-200 py-1.5 px-3 flex items-center text-xs text-gray-600 shadow-sm">
        <div className="flex items-center gap-2">
          <span><span className="font-medium">Page:</span> {currentPage} of {pageCount}</span>
          <span className="mx-1 text-gray-300">|</span>
          <span>{wordCount} words</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button 
            className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors"
            onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Top
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportEditor;
