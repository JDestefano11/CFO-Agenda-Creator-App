/**
 * Custom wrapper for pdf-parse to avoid test file loading issues
 */

// Import only the parse function from pdf-parse/lib
import { parse } from 'pdf-parse/lib/pdf-parse.js';

/**
 * Parse PDF buffer without loading test files
 * @param {Buffer} dataBuffer - PDF file buffer
 * @param {Object} options - pdf-parse options
 * @returns {Promise<Object>} - Parsed PDF data
 */
export const parsePdf = async (dataBuffer, options = {}) => {
  try {
    // Use the parse function directly to avoid the test file loading
    const data = await parse(dataBuffer, options);
    return data;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
};

export default parsePdf;
