import React, { useState, useEffect } from "react";
import { 
  FaBold, FaItalic, FaUnderline, 
  FaAlignLeft, FaAlignCenter, FaAlignRight, 
  FaUndo, FaRedo,
  FaFileExport, FaClipboardList
} from "react-icons/fa";
import { 
  MdFormatSize 
} from "react-icons/md";

// Add CSS for animations
const styles = {
  fadeIn: {
    animation: 'fadeIn 0.2s ease-in-out',
  },
};

// Add keyframes for animations
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.2s ease-in-out;
    }
  `;
  document.head.appendChild(styleSheet);
}

const ExportToolbar = ({ onFormatChange, selectedFormat, onApplyTemplate, content }) => {
  const [fontFamily, setFontFamily] = useState("Calibri");
  const [fontSize, setFontSize] = useState("11");
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
      icon: <FaFileExport />,
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
      icon: <FaFileExport />,
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
            <ol style="padding-left: 20px; margin: 15px 0;">
              <li style="margin-bottom: 10px;"><strong style="color: #2c5282;">Documentation Gaps:</strong> Current process documentation is incomplete for quarterly reconciliation procedures, particularly for intercompany transactions.</li>
              <li style="margin-bottom: 10px;"><strong style="color: #2c5282;">Approval Workflows:</strong> Several instances were identified where approval chains were bypassed or approvals were obtained after transactions were processed.</li>
              <li style="margin-bottom: 10px;"><strong style="color: #2c5282;">Monitoring Effectiveness:</strong> The current monitoring system does not provide adequate visibility into control exceptions and remediation actions.</li>
            </ol>
            
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

  // Toolbar button component
  const ToolbarButton = ({ icon, command, label, className }) => {
    const [active, setActive] = useState(false);

    const handleClick = () => {
      document.execCommand(command);
      setActive(!active);
    };

    return (
      <button 
        className={`p-0.5 rounded hover:bg-gray-100 ${active ? 'bg-gray-200' : ''} ${className || ''}`}
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
        <span className="text-xs font-medium text-gray-600 mr-2">Export as:</span>
        <div className="flex bg-gray-50 rounded border border-gray-200 shadow-sm">
          {formatOptions.map((format) => (
            <button
              key={format.value}
              className={`px-2 py-1 text-xs rounded transition-all duration-200 font-medium ${
                selectedFormat === format.value
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
              onClick={() => onFormatChange(format.value)}
              title={`Export as ${format.label} file`}
            >
              {format.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-3 py-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-end flex-wrap gap-4">
            {/* Templates dropdown */}
            <div>
              <label className="text-xs text-gray-500 mb-0.5 font-medium block">Template</label>
              <button
                className="flex items-center px-2 py-1 text-xs font-medium border border-gray-300 rounded hover:bg-indigo-50 transition-all duration-200 bg-white shadow-sm h-7"
                onClick={() => setShowTemplates(!showTemplates)}
              >
                <FaClipboardList className="mr-1 text-indigo-600" size={12} />
                <span>Templates</span>
              </button>
              {showTemplates && (
                <div className="absolute mt-1 bg-white border border-gray-200 rounded shadow-md z-20 w-48 overflow-hidden">
                  <div className="py-0.5">
                    {documentTemplates.map(template => (
                      <button
                        key={template.id}
                        className="flex items-center w-full px-2 py-1.5 text-left hover:bg-indigo-50 text-xs transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          template.applyFormat();
                          setShowTemplates(false);
                        }}
                      >
                        <span className="mr-2 text-indigo-600">{template.icon}</span>
                        <span className="font-medium">{template.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Font controls group */}
            <div className="flex items-end gap-3 border-r border-gray-200 pr-4 ml-2">
              <div>
                <label className="text-xs text-gray-500 mb-0.5 font-medium block">Font</label>
                <select 
                  className="text-xs border border-gray-300 rounded px-1 py-1 w-24 focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300 bg-white shadow-sm h-7"
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
              </div>
              
              <div>
                <label className="text-xs text-gray-500 mb-0.5 font-medium block">Size</label>
                <select 
                  className="text-xs border border-gray-300 rounded px-1 py-1 w-12 focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300 bg-white shadow-sm h-7"
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
              </div>
              
              <div>
                <label className="text-xs text-gray-500 mb-0.5 font-medium block">Style</label>
                <div className="flex bg-white rounded border border-gray-300 shadow-sm h-7">
                  <ToolbarButton icon={<FaBold size={12} />} command="bold" className="hover:bg-indigo-50 px-2" />
                  <ToolbarButton icon={<FaItalic size={12} />} command="italic" className="hover:bg-indigo-50 px-2 border-l border-r border-gray-300" />
                  <ToolbarButton icon={<FaUnderline size={12} />} command="underline" className="hover:bg-indigo-50 px-2" />
                </div>
              </div>
            </div>

            {/* Paragraph controls */}
            <div className="border-r border-gray-200 pr-4 ml-2">
              <label className="text-xs text-gray-500 mb-0.5 font-medium block">Align</label>
              <div className="flex bg-white rounded border border-gray-300 shadow-sm h-7">
                <ToolbarButton icon={<FaAlignLeft size={12} />} command="justifyLeft" title="Align Left" className="hover:bg-indigo-50 px-2" />
                <ToolbarButton icon={<FaAlignCenter size={12} />} command="justifyCenter" title="Align Center" className="hover:bg-indigo-50 px-2 border-l border-r border-gray-300" />
                <ToolbarButton icon={<FaAlignRight size={12} />} command="justifyRight" title="Align Right" className="hover:bg-indigo-50 px-2" />
              </div>
            </div>

            {/* Editing controls */}
            <div className="ml-2">
              <label className="text-xs text-gray-500 mb-0.5 font-medium block">Actions</label>
              <div className="flex bg-white rounded border border-gray-300 shadow-sm h-7">
                <ToolbarButton icon={<FaUndo size={12} />} command="undo" title="Undo" className="hover:bg-indigo-50 px-2" />
                <ToolbarButton icon={<FaRedo size={12} />} command="redo" title="Redo" className="hover:bg-indigo-50 px-2 border-l border-gray-300" />
              </div>
            </div>
          </div>
          
          {/* Export Format */}
          <div>
            <label className="text-xs text-gray-500 mb-0.5 font-medium block invisible">Export</label>
            <FormatSelector />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportToolbar;