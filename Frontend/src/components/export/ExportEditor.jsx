import React, { useRef, useEffect, useState, useCallback } from "react";
import { FaFont, FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify, FaUndo, FaRedo, FaPalette, FaFill } from "react-icons/fa";

const ExportEditor = ({ content, onChange }) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [wordCount, setWordCount] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [showFormatting, setShowFormatting] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  

  
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

  // Store current formatting state
  const [currentFormatState, setCurrentFormatState] = useState({
    fontFamily: null,
    fontSize: null,
    isBold: false,
    isItalic: false,
    isUnderline: false,
    textColor: null,
    bgColor: null,
    alignment: null
  });
  
  // Update current format state based on selection
  const updateFormatState = () => {
    if (window.getSelection && window.getSelection().rangeCount > 0) {
      const selection = window.getSelection();
      if (selection.anchorNode) {
        // Find the closest parent element of the selection
        let parentElement = selection.anchorNode.nodeType === 3 ? 
          selection.anchorNode.parentElement : selection.anchorNode;
        
        // Get computed style of the element
        const computedStyle = window.getComputedStyle(parentElement);
        
        setCurrentFormatState({
          fontFamily: computedStyle.fontFamily,
          fontSize: computedStyle.fontSize,
          isBold: computedStyle.fontWeight >= 700,
          isItalic: computedStyle.fontStyle === 'italic',
          isUnderline: computedStyle.textDecoration.includes('underline'),
          textColor: computedStyle.color,
          bgColor: computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' ? computedStyle.backgroundColor : null,
          alignment: computedStyle.textAlign
        });
      }
    }
  };
  
  // Apply current format state to new content
  const applyCurrentFormatState = () => {
    if (currentFormatState.isBold) execCommand('bold');
    if (currentFormatState.isItalic) execCommand('italic');
    if (currentFormatState.isUnderline) execCommand('underline');
    if (currentFormatState.textColor) execCommand('foreColor', false, currentFormatState.textColor);
    if (currentFormatState.bgColor) execCommand('hiliteColor', false, currentFormatState.bgColor);
    if (currentFormatState.alignment) {
      switch(currentFormatState.alignment) {
        case 'left': execCommand('justifyLeft'); break;
        case 'center': execCommand('justifyCenter'); break;
        case 'right': execCommand('justifyRight'); break;
        case 'justify': execCommand('justifyFull'); break;
      }
    }
  };

  // Handle keyboard shortcuts and maintain formatting on new lines
  const handleKeyDown = (e) => {
    // Handle Enter key - store format state and check for page overflow
    if (e.key === 'Enter') {
      // Store current format state before creating new line
      updateFormatState();
      
      // Apply the format after the new line is created
      setTimeout(() => {
        applyCurrentFormatState();
      }, 0);
      
      // Check for page overflow
      setTimeout(checkContentOverflow, 0);
    }
    // Ctrl+B: Bold
    else if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      execCommand('bold');
    }
    // Ctrl+I: Italic
    else if (e.ctrlKey && e.key === 'i') {
      e.preventDefault();
      execCommand('italic');
    }
    // Ctrl+U: Underline
    else if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      execCommand('underline');
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

  // Function to apply formatting
  const execCommand = (command, showUI = false, value = null) => {
    document.execCommand(command, showUI, value);
    
    // Update current format state after applying command
    if (['bold', 'italic', 'underline'].includes(command)) {
      setCurrentFormatState(prev => ({
        ...prev,
        isBold: command === 'bold' ? !prev.isBold : prev.isBold,
        isItalic: command === 'italic' ? !prev.isItalic : prev.isItalic,
        isUnderline: command === 'underline' ? !prev.isUnderline : prev.isUnderline
      }));
    } else if (command === 'foreColor') {
      setCurrentFormatState(prev => ({ ...prev, textColor: value }));
    } else if (command === 'hiliteColor') {
      setCurrentFormatState(prev => ({ ...prev, bgColor: value }));
    } else if (command.startsWith('justify')) {
      const alignmentMap = {
        justifyLeft: 'left',
        justifyCenter: 'center',
        justifyRight: 'right',
        justifyFull: 'justify'
      };
      setCurrentFormatState(prev => ({ ...prev, alignment: alignmentMap[command] }));
    }
    
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Toggle formatting toolbar
  const toggleFormatting = () => {
    setShowFormatting(!showFormatting);
    // Close color pickers when toggling formatting toolbar
    setShowTextColorPicker(false);
    setShowBgColorPicker(false);
  };
  
  // Toggle text color picker
  const toggleTextColorPicker = (e) => {
    e.stopPropagation();
    setShowTextColorPicker(!showTextColorPicker);
    setShowBgColorPicker(false); // Close background color picker
  };
  
  // Toggle background color picker
  const toggleBgColorPicker = (e) => {
    e.stopPropagation();
    setShowBgColorPicker(!showBgColorPicker);
    setShowTextColorPicker(false); // Close text color picker
  };
  
  // Apply text color
  const applyTextColor = (color) => {
    document.execCommand('foreColor', false, color);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    setShowTextColorPicker(false);
  };
  
  // Apply background color
  const applyBgColor = (color) => {
    document.execCommand('hiliteColor', false, color);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    setShowBgColorPicker(false);
  };
  
  // Close color pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowTextColorPicker(false);
      setShowBgColorPicker(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Modern floating formatting toolbar */}
      <div 
        className={`${showFormatting ? 'opacity-100' : 'opacity-0 pointer-events-none'} 
          fixed top-24 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl 
          transition-opacity duration-200 z-50 flex items-center px-3 py-2 space-x-1 border border-gray-200`}
      >
        {/* Text style buttons */}
        <button onClick={() => execCommand('bold')} className="p-1.5 rounded hover:bg-gray-100">
          <span className="font-bold">B</span>
        </button>
        <button onClick={() => execCommand('italic')} className="p-1.5 rounded hover:bg-gray-100">
          <span className="italic">I</span>
        </button>
        <button onClick={() => execCommand('underline')} className="p-1.5 rounded hover:bg-gray-100">
          <span className="underline">U</span>
        </button>

        <div className="h-4 w-px bg-gray-200 mx-1"></div>

        {/* Heading buttons */}
        <button onClick={() => execCommand('formatBlock', '<h1>')} className="p-1.5 rounded hover:bg-gray-100">
          <span className="font-bold">H1</span>
        </button>
        <button onClick={() => execCommand('formatBlock', '<h2>')} className="p-1.5 rounded hover:bg-gray-100">
          <span className="font-bold">H2</span>
        </button>

        <div className="h-4 w-px bg-gray-200 mx-1"></div>

        {/* Color pickers */}
        <div className="relative">
          <button onClick={toggleTextColorPicker} className="p-1.5 rounded hover:bg-gray-100">
            <FaPalette size={14} color="#4a86e8" />
          </button>
          
          {/* Text color palette */}
          {showTextColorPicker && (
            <div 
              className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl z-50 p-3 border border-gray-200 animate-fade-in"
              onClick={(e) => e.stopPropagation()}
              style={{ width: '260px' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-700">Text Color</div>
                <button 
                  onClick={() => setShowTextColorPicker(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-2 p-2 border border-gray-200 rounded bg-gray-50">
                <div className="text-xs text-gray-500 mb-1">Recently Used</div>
                <div className="flex gap-1">
                  {['#000000', '#FF0000', '#0000FF', '#008000', '#FFA500'].map((color, index) => (
                    <button
                      key={`recent-${index}`}
                      onClick={() => applyTextColor(color)}
                      className="w-6 h-6 rounded-full border border-gray-300 hover:scale-110 transition-transform shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-10 gap-1.5">
                {colorPalette.map((color, index) => (
                  <button
                    key={`text-${index}`}
                    onClick={() => applyTextColor(color)}
                    className="w-6 h-6 rounded-md border hover:scale-110 transition-transform shadow-sm"
                    style={{ 
                      backgroundColor: color,
                      borderColor: color === '#ffffff' ? '#e0e0e0' : color
                    }}
                    title={color}
                  />
                ))}
              </div>
              
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Preview</div>
                <div className="h-8 flex items-center justify-center rounded bg-gray-50 border border-gray-200">
                  <span style={{ color: '#4a86e8' }}>Sample Text</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="relative">
          <button onClick={toggleBgColorPicker} className="p-1.5 rounded hover:bg-gray-100">
            <FaFill size={14} color="#f1c232" />
          </button>
          
          {/* Background color palette */}
          {showBgColorPicker && (
            <div 
              className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl z-50 p-3 border border-gray-200 animate-fade-in"
              onClick={(e) => e.stopPropagation()}
              style={{ width: '260px' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-700">Highlight Color</div>
                <button 
                  onClick={() => setShowBgColorPicker(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-2 p-2 border border-gray-200 rounded bg-gray-50">
                <div className="text-xs text-gray-500 mb-1">Recently Used</div>
                <div className="flex gap-1">
                  {['#FFFF00', '#90EE90', '#ADD8E6', '#FFD700', '#FFC0CB'].map((color, index) => (
                    <button
                      key={`recent-bg-${index}`}
                      onClick={() => applyBgColor(color)}
                      className="w-6 h-6 rounded-full border border-gray-300 hover:scale-110 transition-transform shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-10 gap-1.5">
                {colorPalette.map((color, index) => (
                  <button
                    key={`bg-${index}`}
                    onClick={() => applyBgColor(color)}
                    className="w-6 h-6 rounded-md border hover:scale-110 transition-transform shadow-sm"
                    style={{ 
                      backgroundColor: color,
                      borderColor: color === '#ffffff' ? '#e0e0e0' : color
                    }}
                    title={color}
                  />
                ))}
              </div>
              
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Preview</div>
                <div className="h-8 flex items-center justify-center rounded bg-gray-50 border border-gray-200">
                  <span style={{ backgroundColor: '#ffff00', padding: '0 6px' }}>Sample Highlight</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="h-4 w-px bg-gray-200 mx-1"></div>

        {/* Alignment buttons */}
        <button onClick={() => execCommand('justifyLeft')} className="p-1.5 rounded hover:bg-gray-100">
          <FaAlignLeft size={14} />
        </button>
        <button onClick={() => execCommand('justifyCenter')} className="p-1.5 rounded hover:bg-gray-100">
          <FaAlignCenter size={14} />
        </button>
        <button onClick={() => execCommand('justifyRight')} className="p-1.5 rounded hover:bg-gray-100">
          <FaAlignRight size={14} />
        </button>
        <button onClick={() => execCommand('justifyFull')} className="p-1.5 rounded hover:bg-gray-100">
          <FaAlignJustify size={14} />
        </button>
      </div>

      {/* Document editor */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto px-4 py-6"
      >
        <div className="max-w-4xl mx-auto">
          {/* Format toggle button - removed */}

          {/* Modern paper-like document */}
          <div 
            className="bg-white rounded-lg shadow-lg overflow-hidden mb-8 transition-all duration-200 ease-in-out transform hover:shadow-xl"
          >
            {/* Page break indicators */}
            {Array.from({ length: Math.max(0, pageCount - 1) }).map((_, i) => (
              <div 
                key={`page-break-${i+1}`}
                className="w-full pointer-events-none relative"
                style={{ 
                  top: `${(i+1) * pageHeight}px`,
                  height: "12px",
                  backgroundColor: "#f0f0f0",
                  borderTop: "1px dashed #d0d0d0",
                  zIndex: 10
                }}
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-50 text-blue-500 text-xs px-2 py-0.5 rounded-full border border-blue-200">
                  Page Break
                </div>
              </div>
            ))}
            
            {/* Editable content area */}
            <div
              ref={editorRef}
              className="outline-none min-h-[11in] p-8 focus:ring-0"
              contentEditable
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              style={{
                fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#333333",
              }}
            />
            
            {/* Page indicator - removed */}
          </div>
        </div>
      </div>
      
      {/* Modern status bar */}
      <div className="bg-white border-t border-gray-200 py-2 px-4 flex items-center text-sm">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-gray-600">{wordCount} words</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-gray-600">Page {currentPage}/{pageCount}</span>
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button 
            className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full text-xs font-medium transition-colors"
            onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to Top
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportEditor;