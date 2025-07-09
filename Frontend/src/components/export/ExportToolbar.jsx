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
      id: "agenda", 
      name: "Meeting Agenda", 
      icon: <FaFileExport />,
      applyFormat: () => {
        const agendaTemplate = `<div style="font-family: Calibri, Arial, sans-serif;">
          <div style="text-align: center; border-bottom: 1px solid #2c5282; padding-bottom: 15px; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 22px; color: #2c5282;">Meeting Agenda</h1>
            <p style="color: #4a5568; font-size: 14px; margin-top: 5px;">Financial Topics Review</p>
          </div>

          <div style="margin-bottom: 20px;">
            <p><strong>Date:</strong> Tuesday, June 25, 2025</p>
            <p><strong>Time:</strong> 10:00 AM – 11:00 AM (60 minutes total)</p>
            <p><strong>Location:</strong> Conference Room B / Zoom</p>
            <p><strong>Meeting Lead:</strong> [CFO Name]</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 16px; color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">1. Welcome and Introductions (5 mins)</h2>
            <ul style="margin-top: 5px; padding-left: 25px;">
              <li>Quick round of updates</li>
              <li>New team members welcome</li>
            </ul>

            <h2 style="font-size: 16px; color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-top: 15px;">2. Review of Last Week's Action Items (10 mins)</h2>
            <ul style="margin-top: 5px; padding-left: 25px;">
              <li>Status updates</li>
              <li>Outstanding items</li>
            </ul>

            <h2 style="font-size: 16px; color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-top: 15px;">3. Missing Financial Information (25 mins)</h2>
            <ul style="margin-top: 5px; padding-left: 25px;">
              <li>Q2 Revenue Projections (5 mins)</li>
              <li>Capital Expenditure Budget (5 mins)</li>
              <li>Accounts Receivable Aging Analysis (5 mins)</li>
              <li>Cash Flow Forecast (5 mins)</li>
              <li>Operating Expense Breakdown (5 mins)</li>
            </ul>

            <h2 style="font-size: 16px; color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-top: 15px;">4. Next Steps (15 mins)</h2>
            <ul style="margin-top: 5px; padding-left: 25px;">
              <li>Assign responsibilities for missing information</li>
              <li>Set deadlines for data collection</li>
              <li>Schedule follow-up review</li>
            </ul>

            <h2 style="font-size: 16px; color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-top: 15px;">5. Q&A (5 mins)</h2>
          </div>

          <div style="margin-top: 30px; font-style: italic; color: #718096; font-size: 14px;">
            <p>Note: This agenda focuses on financial topics that were NOT found in the uploaded documentation. Please come prepared to discuss these missing elements.</p>
          </div>
        </div>`;
        
        if (onApplyTemplate) {
          onApplyTemplate(agendaTemplate);
        }
      }
    },
    { 
      id: "survey", 
      name: "Survey", 
      icon: <FaClipboardList />,
      applyFormat: () => {
        const surveyTemplate = `<div style="font-family: Calibri, Arial, sans-serif;">
          <div style="border-bottom: 1px solid #e0e0e0; padding-bottom: 15px; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #2c5282; font-size: 22px;">Financial Information Request Survey</h2>
            <p style="color: #718096; margin-top: 5px;">Please help us gather missing information from our financial documentation</p>
          </div>

          <div style="margin-bottom: 15px; padding: 15px; background-color: #f8fafc; border-left: 4px solid #2c5282;">
            <p style="margin: 0; color: #4a5568;">This survey aims to collect important financial information that was not found in the analyzed documents. Your responses will help complete our financial assessment.</p>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="font-size: 16px; color: #2c5282; margin-bottom: 10px;">Question 1</h3>
            <p style="margin-bottom: 10px;">Which of the following quarterly revenue figures are available but not included in the documentation?</p>
            <div style="margin-left: 15px;">
              <p style="margin-bottom: 5px;">□ Q1 2025 Revenue</p>
              <p style="margin-bottom: 5px;">□ Q2 2025 Revenue</p>
              <p style="margin-bottom: 5px;">□ Q3 2024 Revenue</p>
              <p style="margin-bottom: 5px;">□ Q4 2024 Revenue</p>
              <p style="margin-bottom: 5px;">□ None of the above</p>
            </div>

            <h3 style="font-size: 16px; color: #2c5282; margin-top: 25px; margin-bottom: 10px;">Question 2</h3>
            <p style="margin-bottom: 10px;">How important is it to include cash flow forecasting in the financial documentation?</p>
            <div style="margin-left: 15px;">
              <p style="margin-bottom: 5px;">○ 1 - Not important</p>
              <p style="margin-bottom: 5px;">○ 2 - Somewhat important</p>
              <p style="margin-bottom: 5px;">○ 3 - Important</p>
              <p style="margin-bottom: 5px;">○ 4 - Very important</p>
              <p style="margin-bottom: 5px;">○ 5 - Critical</p>
            </div>

            <h3 style="font-size: 16px; color: #2c5282; margin-top: 25px; margin-bottom: 10px;">Question 3</h3>
            <p style="margin-bottom: 10px;">Which financial metrics are missing from the current documentation? (Select all that apply)</p>
            <div style="margin-left: 15px;">
              <p style="margin-bottom: 5px;">□ Debt-to-Equity Ratio</p>
              <p style="margin-bottom: 5px;">□ Current Ratio</p>
              <p style="margin-bottom: 5px;">□ Quick Ratio</p>
              <p style="margin-bottom: 5px;">□ Return on Assets (ROA)</p>
              <p style="margin-bottom: 5px;">□ Return on Equity (ROE)</p>
            </div>

            <h3 style="font-size: 16px; color: #2c5282; margin-top: 25px; margin-bottom: 10px;">Question 4</h3>
            <p style="margin-bottom: 10px;">Please provide any missing information about capital expenditure plans that should be included in the financial documentation:</p>
            <div style="border: 1px solid #e0e0e0; padding: 10px; min-height: 100px; background-color: #f9f9f9;">
              <p style="color: #a0aec0; font-style: italic;">Your answer here...</p>
            </div>

            <h3 style="font-size: 16px; color: #2c5282; margin-top: 25px; margin-bottom: 10px;">Question 5</h3>
            <p style="margin-bottom: 10px;">How often should financial documentation be reviewed and updated?</p>
            <div style="margin-left: 15px;">
              <p style="margin-bottom: 5px;">○ Monthly</p>
              <p style="margin-bottom: 5px;">○ Quarterly</p>
              <p style="margin-bottom: 5px;">○ Bi-annually</p>
              <p style="margin-bottom: 5px;">○ Annually</p>
            </div>
          </div>

          <div style="margin-top: 30px; text-align: center;">
            <p style="color: #4a5568; font-style: italic;">Thank you for providing this missing information. Your input will help complete our financial assessment.</p>
          </div>
        </div>`;
        
        if (onApplyTemplate) {
          onApplyTemplate(surveyTemplate);
        }
      }
    },
    { 
      id: "email", 
      name: "Email", 
      icon: <FaFileExport />,
      applyFormat: () => {
        const emailTemplate = `<div style="font-family: Calibri, Arial, sans-serif;">
          <div style="border-bottom: 1px solid #e0e0e0; padding-bottom: 15px; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #2c5282; font-size: 18px;">Subject: Request for Missing Financial Information</h2>
          </div>
          <p style="margin-bottom: 15px;">Dear [Recipient],</p>
          <p style="margin-bottom: 15px;">I hope this email finds you well. Thank you for providing the financial documentation that was recently analyzed by our team.</p>
          <p style="margin-bottom: 15px;">While reviewing the materials, we identified several key pieces of financial information that are missing but would be valuable for a complete assessment:</p>
          <ul style="margin-bottom: 20px; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Detailed cash flow projections for the next fiscal quarter</li>
            <li style="margin-bottom: 8px;">Breakdown of capital expenditures by department</li>
            <li style="margin-bottom: 8px;">Accounts receivable aging report</li>
            <li style="margin-bottom: 8px;">Updated operating expense forecasts</li>
            <li style="margin-bottom: 8px;">Debt servicing schedule for the remainder of the fiscal year</li>
          </ul>
          <p style="margin-bottom: 15px;">This missing information is critical for our financial planning process and will allow us to provide a more comprehensive analysis for the upcoming executive review.</p>
          <p style="margin-bottom: 15px;">Could you please provide these details by [DATE], or let me know when we can expect to receive them? If gathering all of this information presents any challenges, I'd be happy to schedule a brief call to discuss alternatives.</p>
          <p style="margin-bottom: 15px;">Thank you for your assistance with this matter.</p>
          <p style="margin-bottom: 5px;">Best regards,</p>
          <p style="margin-bottom: 0;">[Your Name]<br>[Your Position]<br>[Contact Information]</p>
        </div>`;
        
        if (onApplyTemplate) {
          onApplyTemplate(emailTemplate);
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