import { OpenAI } from 'openai';
import dotenv from 'dotenv';


dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Extract text from PDF with robust error handling
export const extractTextFromPDF = async (pdfBuffer) => {
  try {
    console.log(`Processing PDF buffer of size: ${pdfBuffer.length} bytes`);
    
    // Try multiple PDF parsing approaches
    try {
      // First approach: Use pdf-parse with default options
      const { default: pdfParse } = await import('pdf-parse/lib/pdf-parse.js');
      const data = await pdfParse(pdfBuffer);
      console.log(`Successfully extracted ${data.text.length} characters of text from PDF`);
      return data.text;
    } catch (mainError) {
      console.log('Standard PDF parsing failed, trying alternative approach:', mainError.message);
      
      // Second approach: Try with more lenient options
      try {
        const { default: pdfParse } = await import('pdf-parse/lib/pdf-parse.js');
        // Use more lenient options to handle corrupted PDFs
        const data = await pdfParse(pdfBuffer, {
          max: 0, // No page limit
          pagerender: null, // Use default page renderer
          version: 'v1.10.100' // Use older version which can be more forgiving
        });
        console.log(`Successfully extracted ${data.text.length} characters of text from PDF with lenient options`);
        return data.text;
      } catch (lenientError) {
        console.log('Lenient PDF parsing also failed:', lenientError.message);
        
        // If both approaches fail, extract what we can from the buffer
        // This is a last resort approach to get at least some text
        const text = extractTextFromBuffer(pdfBuffer);
        if (text && text.length > 100) {
          console.log(`Extracted ${text.length} characters using buffer fallback method`);
          return text;
        }
        
        // If all methods fail, throw the original error
        throw mainError;
      }
    }
  } catch (error) {
    console.error('Error extracting text from PDF:', error.message);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

// Helper function to extract text directly from buffer as a last resort
function extractTextFromBuffer(buffer) {
  try {
    // Convert buffer to string and look for text patterns
    const bufferString = buffer.toString('utf8');
    
    // Extract text between common PDF text markers
    const textContent = [];
    
    // Look for text between BT (Begin Text) and ET (End Text) markers
    const btEtMatches = bufferString.match(/BT(.*?)ET/gs);
    if (btEtMatches && btEtMatches.length > 0) {
      btEtMatches.forEach(match => {
        // Clean up non-printable characters
        const cleaned = match.replace(/[^\x20-\x7E\n\r\t]/g, ' ')
                            .replace(/\s+/g, ' ')
                            .trim();
        if (cleaned.length > 5) {
          textContent.push(cleaned);
        }
      });
    }
    
    // Look for plain text content
    const plainTextMatches = bufferString.match(/\((.*?)\)/g);
    if (plainTextMatches && plainTextMatches.length > 0) {
      plainTextMatches.forEach(match => {
        if (match.length > 5) {
          const cleaned = match.replace(/[^\x20-\x7E\n\r\t]/g, ' ')
                               .replace(/\s+/g, ' ')
                               .replace(/[\(\)]/g, '')
                               .trim();
          if (cleaned.length > 5) {
            textContent.push(cleaned);
          }
        }
      });
    }
    
    return textContent.join('\n');
  } catch (error) {
    console.error('Buffer extraction fallback failed:', error.message);
    return '';
  }
};

// Extract text from Word document
export const extractTextFromWord = async (docBuffer) => {
  try {
    console.log(`Processing Word document buffer of size: ${docBuffer.length} bytes`);
    
    // Dynamically import mammoth only when needed
    const mammoth = await import('mammoth');
    
    // Convert the buffer to text
    const result = await mammoth.extractRawText({ buffer: docBuffer });
    
    console.log(`Successfully extracted ${result.value.length} characters of text from Word document`);
    
    return result.value;
  } catch (error) {
    console.error('Error extracting text from Word document:', error.message);
    throw new Error(`Failed to extract text from Word document: ${error.message}`);
  }
};

// Extract text from Excel file
export const extractTextFromExcel = async (excelBuffer) => {
  try {
    console.log(`Processing Excel file buffer of size: ${excelBuffer.length} bytes`);
    
    // Dynamically import xlsx only when needed
    const XLSX = await import('xlsx');
    
    // Parse the Excel file
    const workbook = XLSX.read(excelBuffer, { type: 'buffer' });
    
    // Extract text from all sheets
    let extractedText = '';
    
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Add sheet name as a header
      extractedText += `\n\n== Sheet: ${sheetName} ==\n`;
      
      // Convert rows to text
      sheetData.forEach(row => {
        if (row && row.length > 0) {
          extractedText += row.join('\t') + '\n';
        }
      });
    });
    
    console.log(`Successfully extracted ${extractedText.length} characters of text from Excel file`);
    
    return extractedText;
  } catch (error) {
    console.error('Error extracting text from Excel file:', error.message);
    throw new Error(`Failed to extract text from Excel file: ${error.message}`);
  }
};

// Extract text from DOCX file using docx library (alternative to mammoth)
export const extractTextFromDocx = async (docxBuffer) => {
  try {
    console.log(`Processing DOCX buffer of size: ${docxBuffer.length} bytes`);
    
    // Dynamically import docx only when needed
    const { Document } = await import('docx');
    
    // Load the document
    const doc = new Document(docxBuffer);
    
    // Extract text from the document
    let extractedText = '';
    
    // Process the document content
    doc.sections.forEach(section => {
      section.paragraphs.forEach(paragraph => {
        paragraph.children.forEach(child => {
          if (child.text) {
            extractedText += child.text + '\n';
          }
        });
        extractedText += '\n';
      });
    });
    
    console.log(`Successfully extracted ${extractedText.length} characters of text from DOCX file`);
    
    return extractedText;
  } catch (error) {
    console.error('Error extracting text from DOCX file:', error.message);
    // If docx library fails, try mammoth as a fallback
    console.log('Trying mammoth as a fallback...');
    return await extractTextFromWord(docxBuffer);
  }
};

// Extract text based on file type from buffer stored in MongoDB
export const extractTextFromDocument = async (fileBuffer, fileType) => {
  try {
    console.log(`Extracting text from ${fileType} document, buffer size: ${fileBuffer.length} bytes`);
    
    // Handle different file types
    if (fileType === 'application/pdf') {
      return await extractTextFromPDF(fileBuffer);
    } else if (fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Word documents (.doc and .docx)
      return await extractTextFromWord(fileBuffer);
    } else if (fileType === 'application/vnd.ms-excel' || fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      // Excel files (.xls and .xlsx)
      return await extractTextFromExcel(fileBuffer);
    } else if (fileType === 'text/plain') {
      // Plain text files
      return fileBuffer.toString('utf8');
    } else if (fileType === 'text/csv') {
      // CSV files
      return fileBuffer.toString('utf8');
    } else if (fileType === 'application/rtf') {
      // RTF files - convert to plain text
      return fileBuffer.toString('utf8').replace(/\{\\[^{}]*\}/g, '');
    } else {
      return `Text extraction not supported for ${fileType} files yet.`;
    }
  } catch (error) {
    console.error('Error extracting text from document:', error.message);
    throw new Error(`Failed to extract text from document: ${error.message}`);
  }
};

// Analyze document content with OpenAI
export const analyzeDocumentContent = async (text) => {
  try {
    const truncatedText = text.length > 8000 ? text.substring(0, 8000) + '...' : text;
    
    const prompt = `
    Please analyze the following document content and provide:
    
    1. A brief summary of the document (2-3 sentences)
    
    2. EXACTLY 5 key topics or themes from the document, formatted as follows:
       - Topic 1: [Topic Name]
         [2-3 sentences of details about this topic from the document]
       
       - Topic 2: [Topic Name]
         [2-3 sentences of details about this topic from the document]
       
       - Topic 3: [Topic Name]
         [2-3 sentences of details about this topic from the document]
       
       - Topic 4: [Topic Name]
         [2-3 sentences of details about this topic from the document]
       
       - Topic 5: [Topic Name]
         [2-3 sentences of details about this topic from the document]
    
    3. Financial figures or important numbers mentioned (list at least 3-5 if present)
    
    4. Action items or recommendations (list 4-6 items)
    
    Document content:
    ${truncatedText}
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a financial document analysis assistant. Extract key information from financial documents in a clear, structured format. Always provide EXACTLY 5 key topics with details under each topic."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    });
    
    return {
      success: true,
      analysis: response.choices[0].message.content
    };
  } catch (error) {
    console.error('Error analyzing document with OpenAI:', error.message);
    return {
      success: false,
      message: `Failed to analyze document: ${error.message}`
    };
  }
};

// Process document with real content extraction for all document types
export const processDocument = async (document) => {
  try {
    console.log(`Processing document: ${document.fileName}, type: ${document.fileType}`);
    
    // Check if document has fileContent
    if (!document.fileContent || document.fileContent.length === 0) {
      console.error('Document has no file content');
      return {
        success: false,
        message: 'Document has no file content'
      };
    }
    
    console.log(`Document has file content of size: ${document.fileContent.length} bytes`);
    
    // Extract text from the document using the appropriate method for its file type
    console.log('Extracting text from document...');
    let extractedText;
    
    try {
      // Use the appropriate extraction method based on file type
      if (document.fileType === 'application/pdf') {
        extractedText = await extractTextFromPDF(document.fileContent);
      } else if (document.fileType === 'application/msword' || document.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        extractedText = await extractTextFromWord(document.fileContent);
      } else if (document.fileType === 'application/vnd.ms-excel' || document.fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        extractedText = await extractTextFromExcel(document.fileContent);
      } else if (document.fileType === 'text/plain' || document.fileType === 'text/csv') {
        extractedText = document.fileContent.toString('utf8');
      } else {
        return {
          success: false,
          message: `Unsupported file type: ${document.fileType}`
        };
      }
      
      console.log(`Text extracted successfully, length: ${extractedText.length} characters`);
      
      // If we got very little text, the document might be empty or have extraction issues
      if (extractedText.length < 50) {
        return {
          success: false,
          message: 'The document appears to be empty or contains too little text to analyze'
        };
      }
    } catch (extractError) {
      console.error('Error extracting text:', extractError);
      return {
        success: false,
        message: `Failed to extract text from document: ${extractError.message}`
      };
    }
    
    // Send the extracted text to OpenAI for analysis
    console.log('Sending content to OpenAI for analysis...');
    const analysisResult = await analyzeDocumentContent(extractedText);
    
    if (!analysisResult.success) {
      return {
        success: false,
        message: analysisResult.message || 'Failed to analyze document content'
      };
    }
    
    console.log(`Analysis complete, success: ${analysisResult.success}`);
    return analysisResult;
  } catch (error) {
    console.error('Error processing document:', error);
    return {
      success: false,
      message: `Failed to process document: ${error.message}`
    };
  }
};
export default {
  extractTextFromPDF,
  extractTextFromDocument,
  analyzeDocumentContent,
  processDocument
};
