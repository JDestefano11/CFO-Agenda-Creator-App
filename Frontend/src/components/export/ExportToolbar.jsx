import React, { useState } from "react";
import { 
  FaBold, FaItalic, FaUnderline, FaStrikethrough, 
  FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify,
  FaListUl, FaListOl, FaIndent, FaOutdent,
  FaLink, FaImage, FaTable, FaUndo, FaRedo,
  FaHighlighter, FaEnvelope, FaFileAlt, FaClipboardList,
  FaSave, FaFileExport
} from "react-icons/fa";
import { 
  MdFormatColorText, MdOutlineFormatSize
} from "react-icons/md";

const ExportToolbar = ({ onFormatChange, selectedFormat, onApplyTemplate, content }) => {
  const [fontFamily, setFontFamily] = useState("Calibri");
  const [fontSize, setFontSize] = useState("11");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  
  const formatOptions = [
    { value: "pdf", label: "PDF" },
    { value: "docx", label: "Word" },
    { value: "txt", label: "Text" }
  ];

  // Document templates
  const documentTemplates = [
    { 
      id: "email", 
      name: "Email", 
      icon: <FaEnvelope />,
      applyFormat: () => {
        const emailTemplate = `<div>
          <div style="border-bottom: 1px solid #e0e0e0; padding-bottom: 15px; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #2c5282; font-size: 18px;">Subject: Financial Analysis Report</h2>
          </div>
          <p style="margin-bottom: 15px;">Dear [Recipient],</p>
          <p style="margin-bottom: 15px;">I hope this email finds you well. Please find attached our financial analysis report based on the documents you provided.</p>
          <p style="margin-bottom: 15px;">The analysis highlights several key findings that we believe will be valuable for your upcoming CFO meeting:</p>
          <ul style="margin-bottom: 20px; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Key financial controls require additional documentation</li>
            <li style="margin-bottom: 8px;">Quarterly variance analysis shows positive trends in operational efficiency</li>
            <li style="margin-bottom: 8px;">Recommended updates to compliance monitoring procedures</li>
          </ul>
          <p style="margin-bottom: 15px;">Please let me know if you have any questions or require any clarification on the report.</p>
          <p style="margin-bottom: 5px;">Best regards,</p>
          <p style="margin-bottom: 0;">[Your Name]<br>[Your Position]<br>[Contact Information]</p>
        </div>`;
        
        if (onApplyTemplate) {
          onApplyTemplate(emailTemplate);
        }
      }
    },
    { 
      id: "memo", 
      name: "Memo", 
      icon: <FaFileAlt />,
      applyFormat: () => {
        const memoTemplate = `<div>
          <div style="text-align: center; border-bottom: 1px solid #2c5282; padding-bottom: 15px; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 22px; color: #2c5282;">MEMORANDUM</h1>
          </div>
          <table style="width: 100%; margin-bottom: 25px; border-collapse: collapse;">
            <tr>
              <td style="width: 80px; font-weight: 600; padding: 5px 10px 5px 0; vertical-align: top;">TO:</td>
              <td style="padding: 5px 0;">[Recipient Name and Title]</td>
            </tr>
            <tr>
              <td style="font-weight: 600; padding: 5px 10px 5px 0; vertical-align: top;">FROM:</td>
              <td style="padding: 5px 0;">[Your Name and Title]</td>
            </tr>
            <tr>
              <td style="font-weight: 600; padding: 5px 10px 5px 0; vertical-align: top;">DATE:</td>
              <td style="padding: 5px 0;">${new Date().toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="font-weight: 600; padding: 5px 10px 5px 0; vertical-align: top;">SUBJECT:</td>
              <td style="padding: 5px 0;">Financial Analysis Findings</td>
            </tr>
          </table>
          <div>
            <p style="margin-bottom: 15px;">Based on our analysis of the financial documentation provided, we have identified the following key points that should be addressed in the upcoming CFO meeting:</p>
            
            <h2 style="font-size: 16px; margin-top: 20px; margin-bottom: 10px; color: #2c5282;">1. Executive Summary</h2>
            <p style="margin-bottom: 15px; margin-left: 15px;">The financial controls review indicates overall compliance with established protocols, with specific areas requiring attention as detailed below.</p>
            
            <h2 style="font-size: 16px; margin-top: 20px; margin-bottom: 10px; color: #2c5282;">2. Financial Controls Assessment</h2>
            <p style="margin-bottom: 15px; margin-left: 15px;">Current documentation processes meet 85% of requirements, with gaps identified in quarterly reconciliation procedures and approval workflows.</p>
            
            <h2 style="font-size: 16px; margin-top: 20px; margin-bottom: 10px; color: #2c5282;">3. Recommendations</h2>
            <p style="margin-bottom: 15px; margin-left: 15px;">Implement standardized documentation templates, establish clear approval chains, and conduct monthly compliance reviews to address identified gaps.</p>
          </div>
        </div>`;
        
        if (onApplyTemplate) {
          onApplyTemplate(memoTemplate);
        }
      }
    },
    { 
      id: "financial", 
      name: "Financial Report", 
      icon: <FaClipboardList />,
      applyFormat: () => {
        const financialTemplate = `<div>
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #2c5282; font-size: 24px; margin-bottom: 8px;">Financial Controls Assessment</h1>
            <p style="color: #4a5568; font-size: 14px;">Prepared for CFO Meeting | ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div style="margin-bottom: 25px; padding: 15px; background-color: #f8fafc; border-left: 4px solid #2c5282;">
            <p style="margin: 0; font-style: italic; color: #4a5568;">This report provides a comprehensive assessment of financial controls based on the documentation review. Key areas requiring attention are highlighted for discussion in the upcoming CFO meeting.</p>
          </div>
          
          <div>
            <h2 style="color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; font-size: 18px;">Executive Summary</h2>
            <p style="margin: 15px 0; line-height: 1.6;">Our review indicates that while most financial controls are operating effectively, there are specific areas that require attention to ensure full compliance with regulatory requirements and internal policies.</p>
            
            <h2 style="color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; font-size: 18px; margin-top: 25px;">Key Findings</h2>
            <ul style="padding-left: 20px; margin: 15px 0;">
              <li style="margin-bottom: 10px;"><strong style="color: #2c5282;">Documentation Gaps:</strong> Current process documentation is incomplete for quarterly reconciliation procedures, particularly for intercompany transactions.</li>
              <li style="margin-bottom: 10px;"><strong style="color: #2c5282;">Approval Workflows:</strong> Several instances were identified where approval chains were bypassed or approvals were obtained after transactions were processed.</li>
              <li style="margin-bottom: 10px;"><strong style="color: #2c5282;">Monitoring Effectiveness:</strong> The current monitoring system does not provide adequate visibility into control exceptions and remediation actions.</li>
            </ul>
            
            <h2 style="color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; font-size: 18px; margin-top: 25px;">Recommendations</h2>
            <ol style="padding-left: 20px; margin: 15px 0;">
              <li style="margin-bottom: 10px;">Implement standardized documentation templates for all financial control processes, with specific focus on reconciliation procedures.</li>
              <li style="margin-bottom: 10px;">Enhance the approval system to prevent transaction processing without required approvals and implement automated notifications for pending approvals.</li>
              <li style="margin-bottom: 10px;">Develop a comprehensive monitoring dashboard that provides real-time visibility into control exceptions and tracks remediation progress.</li>
            </ol>
          </div>
        </div>`;
        
        if (onApplyTemplate) {
          onApplyTemplate(financialTemplate);
        }
      }
    }
  ];

  // Font options
  const fontOptions = ["Arial", "Calibri", "Times New Roman", "Verdana", "Georgia", "Tahoma", "Helvetica"];
  const fontSizeOptions = ["8", "9", "10", "11", "12", "14", "16", "18", "20", "24", "28", "32", "36", "48", "72"];
  const colorOptions = ["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#800000", "#008000", "#000080", "#808000", "#800080", "#008080", "#808080", "#C00000"];

  // Execute document.execCommand
  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  // Handle font change
  const handleFontChange = (e) => {
    setFontFamily(e.target.value);
    executeCommand("fontName", e.target.value);
  };

  // Handle font size change
  const handleFontSizeChange = (e) => {
    setFontSize(e.target.value);
    executeCommand("fontSize", getSizeIndex(e.target.value));
  };

  // Get font size index for execCommand
  const getSizeIndex = (size) => {
    const sizes = {8: 1, 9: 2, 10: 3, 11: 3, 12: 3, 14: 4, 16: 4, 18: 5, 20: 5, 24: 6, 28: 6, 32: 7, 36: 7, 48: 7, 72: 7};
    return sizes[size] || 3;
  };

  // Handle color click
  const handleColorClick = (color) => {
    executeCommand("foreColor", color);
    setShowColorPicker(false);
  };

  // Toolbar button component
  const ToolbarButton = ({ icon, label, command, value, active, className, onClick }) => {
    const handleClick = () => {
      if (onClick) {
        onClick();
      } else if (command) {
        executeCommand(command, value);
      }
    };

    return (
      <button 
        className={`p-1 rounded hover:bg-gray-100 ${active ? 'bg-gray-200' : ''} ${className || ''}`}
        onClick={handleClick}
        title={label || command}
      >
        {icon}
      </button>
    );
  };

  // Format selector component
  const FormatSelector = () => {
    return (
      <div className="flex items-center">
        {formatOptions.map((format) => (
          <button
            key={format.value}
            className={`px-2 py-1 text-xs rounded mr-1 ${
              selectedFormat === format.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => onFormatChange(format.value)}
          >
            {format.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-2 py-1">
        <div className="flex flex-wrap items-center gap-2">
          {/* Templates dropdown */}
          <div className="relative mr-3">
            <button
              className="flex items-center px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              onClick={() => setShowTemplates(!showTemplates)}
            >
              <FaClipboardList className="mr-1" />
              <span>Templates</span>
            </button>
            {showTemplates && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-20 w-48">
                {documentTemplates.map(template => (
                  <button
                    key={template.id}
                    className="flex items-center w-full px-3 py-2 text-left hover:bg-gray-100 text-sm"
                    onClick={() => {
                      template.applyFormat();
                      setShowTemplates(false);
                    }}
                  >
                    <span className="mr-2 text-gray-600">{template.icon}</span>
                    {template.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font controls */}
          <div className="flex items-center space-x-1 border-r border-gray-200 pr-3">
            <select 
              className="text-sm border border-gray-300 rounded px-1 py-1 w-24"
              value={fontFamily}
              onChange={handleFontChange}
              title="Font Family"
            >
              {fontOptions.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
            <select 
              className="text-sm border border-gray-300 rounded px-1 py-1 w-12"
              value={fontSize}
              onChange={handleFontSizeChange}
              title="Font Size"
            >
              {fontSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <div className="flex">
              <ToolbarButton icon={<FaBold size={14} />} command="bold" />
              <ToolbarButton icon={<FaItalic size={14} />} command="italic" />
              <ToolbarButton icon={<FaUnderline size={14} />} command="underline" />
              <div className="relative">
                <ToolbarButton 
                  icon={<MdFormatColorText size={16} />} 
                  onClick={() => setShowColorPicker(!showColorPicker)} 
                  title="Text Color"
                />
                {showColorPicker && (
                  <div className="absolute top-full left-0 mt-1 p-1 bg-white shadow-lg rounded border border-gray-200 z-10 grid grid-cols-5 gap-1">
                    {colorOptions.map(color => (
                      <div 
                        key={color} 
                        className="w-4 h-4 cursor-pointer border border-gray-300" 
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorClick(color)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Paragraph controls */}
          <div className="flex items-center space-x-1 border-r border-gray-200 pr-3">
            <ToolbarButton icon={<FaAlignLeft size={14} />} command="justifyLeft" title="Align Left" />
            <ToolbarButton icon={<FaAlignCenter size={14} />} command="justifyCenter" title="Align Center" />
            <ToolbarButton icon={<FaAlignRight size={14} />} command="justifyRight" title="Align Right" />
            <ToolbarButton icon={<FaListUl size={14} />} command="insertUnorderedList" title="Bullet List" />
            <ToolbarButton icon={<FaListOl size={14} />} command="insertOrderedList" title="Numbered List" />
          </div>

          {/* Insert controls */}
          <div className="flex items-center space-x-1 border-r border-gray-200 pr-3">
            <ToolbarButton icon={<FaLink size={14} />} command="createLink" value="https://" title="Insert Link" />
            <ToolbarButton icon={<FaTable size={14} />} command="insertHTML" value="<table border='1'><tr><td>Cell 1</td><td>Cell 2</td></tr></table>" title="Insert Table" />
          </div>

          {/* Editing controls */}
          <div className="flex items-center space-x-1">
            <ToolbarButton icon={<FaUndo size={14} />} command="undo" title="Undo" />
            <ToolbarButton icon={<FaRedo size={14} />} command="redo" title="Redo" />
          </div>
          
          {/* Export Format */}
          <div className="flex items-center ml-auto">
            <div className="text-xs font-medium text-gray-500 mr-2">Export As:</div>
            <FormatSelector />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportToolbar;