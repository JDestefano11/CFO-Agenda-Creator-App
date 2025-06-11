import React from 'react';
import {
  AiOutlineFilePdf,
  AiOutlineFileWord,
  AiOutlineFileExcel,
  AiOutlineFileText,
} from "react-icons/ai";

/**
 * FileIcon component to display appropriate icon based on file extension
 */
const FileIcon = ({ fileName }) => {
  // Get file extension
  const extension = fileName.split('.').pop().toLowerCase();
  
  // Return appropriate icon based on file extension
  switch (extension) {
    case 'pdf':
      return <AiOutlineFilePdf className="h-6 w-6 text-red-500" />;
    case 'doc':
    case 'docx':
      return <AiOutlineFileWord className="h-6 w-6 text-blue-500" />;
    case 'xls':
    case 'xlsx':
      return <AiOutlineFileExcel className="h-6 w-6 text-emerald-500" />;
    default:
      return <AiOutlineFileText className="h-6 w-6 text-gray-500" />;
  }
};

export default FileIcon;
