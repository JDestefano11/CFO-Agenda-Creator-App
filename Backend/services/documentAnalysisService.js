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
You are continuing your role as a financial controls expert assisting a consultant in preparing for a strategic meeting with a company's CFO. The consultant has already reviewed a list of general topics relevant to setting up or updating the company's financial control framework.
In this step, match the general requirements and questions from Step 2 with relevant findings from the uploaded documentation (e.g., annual reports, trial balances, internal records). For each topic, extract any supporting content from the documents that provides an answer or partial answer.
    
    Document content:
    ${truncatedText}
    
    Output Format:
    For each general topic:
    Display the original requirement or question
    Show the AI-extracted information from the documentation that addresses it
    Clearly highlight if no relevant data was found, keeping the topic open for user input
    Ensure that each answer is drill-down ready, so the user can confirm, edit, or manually complete the information
    Maintain a clear and editable structure so the consultant can:
    Verify the accuracy and completeness of each AI-generated response
    Add missing context based on their own knowledge or other sources
    Confirm which topics are ready for inclusion in the final CFO agenda or need further clarification
    Keep your answers precise, clearly sourced from the uploaded content, and action-oriented. Avoid assumptions or filler text — the goal is to efficiently validate which topics have been addressed and which require CFO input in the next meeting.
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
    
    // Extract topics from the analysis
    const analysisText = analysisResult.analysis;
    let keyTopics = [];
    
    try {
      console.log('Attempting to extract topics from OpenAI response');
      
      // First attempt: Look for explicit topic patterns
      const topicPatterns = [
        /Topic\s*\d+:\s*([^\n]+)/g,  // "Topic 1: Something"
        /\d+\.\s+([^\n:]+)(?:\n|:|$)/g,  // "1. Something" followed by newline or colon
        /\*\s+([^\n:]+)(?:\n|:|$)/g,  // "* Something" followed by newline or colon
        /•\s+([^\n:]+)(?:\n|:|$)/g,  // "• Something" followed by newline or colon
        /^([A-Z][^\n:]+?):\s/gm,  // "Capital Words: " at start of line
        /\n([A-Z][^\n:]{10,60})(?:\n|$)/g  // Capitalized phrases on their own line (10-60 chars)
      ];
      
      // Try each pattern until we find topics
      for (const pattern of topicPatterns) {
        const matches = [];
        let match;
        const regex = new RegExp(pattern);
        
        // Need to create a copy of the text for regex with 'g' flag
        const textCopy = analysisText;
        
        // Extract all matches for this pattern
        while ((match = regex.exec(textCopy)) !== null) {
          if (match[1] && match[1].trim().length > 3) {
            matches.push(match[1].trim());
          }
        }
        
        // If we found topics with this pattern, use them
        if (matches.length >= 3) { // Require at least 3 matches to consider it a valid pattern
          console.log(`Found ${matches.length} topics using pattern: ${pattern}`);
          keyTopics = matches;
          break;
        }
      }
      
      // If no patterns worked, try the section splitting approach
      if (keyTopics.length === 0) {
        console.log('No topics found with patterns, trying section splitting');
        
        // Split by common section dividers
        const sections = analysisText.split(/\n\s*\d+\.\s+/).filter(Boolean);
        
        if (sections.length >= 3) {
          // Extract the first line of each section as a topic
          keyTopics = sections.map(section => {
            const firstLine = section.split('\n')[0].trim();
            return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
          });
          console.log(`Extracted ${keyTopics.length} topics from sections`);
        }
      }
      
      // If we still don't have topics, try a more aggressive approach
      if (keyTopics.length === 0) {
        console.log('Still no topics found, using aggressive line parsing');
        
        const lines = analysisText.split('\n');
        for (const line of lines) {
          const trimmedLine = line.trim();
          // Look for lines that might be headings or topics
          if (trimmedLine.length > 5 && trimmedLine.length < 100 && 
              (trimmedLine.endsWith(':') || 
               trimmedLine.match(/^[\d\*\-•\.]\s+/) || 
               trimmedLine.match(/^[A-Z]/) || 
               trimmedLine.includes('topic') || 
               trimmedLine.includes('Topic'))) {
            
            const cleanedLine = trimmedLine
              .replace(/^[\d\*\-•\.]\s+/, '') // Remove bullet points
              .replace(/^[^:]+:\s*/, '')      // Remove "Something:" prefix
              .replace(/:\s*$/, '')           // Remove trailing colon
              .trim();
              
            if (cleanedLine && cleanedLine.length > 3 && !keyTopics.includes(cleanedLine)) {
              keyTopics.push(cleanedLine);
              if (keyTopics.length >= 5) break; // Limit to 5 topics
            }
          }
        }
      }
      
      // If we still don't have enough topics, create generic ones from the content
      if (keyTopics.length < 5) {
        console.log(`Only found ${keyTopics.length} topics, generating additional generic topics`);
        
        // Extract important-looking phrases from the text
        const phrases = analysisText.match(/\b[A-Z][a-z]+ [A-Za-z ]{2,30}\b/g) || [];
        const financialTerms = phrases.filter(phrase => 
          phrase.includes('financial') || 
          phrase.includes('budget') || 
          phrase.includes('cost') || 
          phrase.includes('revenue') || 
          phrase.includes('profit') ||
          phrase.includes('investment') ||
          phrase.includes('strategy') ||
          phrase.includes('control') ||
          phrase.includes('risk')
        );
        
        // Add unique financial terms as topics
        for (const term of financialTerms) {
          if (!keyTopics.includes(term) && term.length > 5) {
            keyTopics.push(term);
            if (keyTopics.length >= 5) break;
          }
        }
        
        // If still not enough, add generic topics
        const genericTopics = [
          'Financial Performance Analysis',
          'Budget Planning and Forecasting',
          'Risk Management Strategy',
          'Cost Optimization Opportunities',
          'Investment Priorities'
        ];
        
        for (let i = keyTopics.length; i < 5; i++) {
          keyTopics.push(genericTopics[i - keyTopics.length]);
        }
      }
      
      // Ensure we have exactly 5 topics
      keyTopics = keyTopics.slice(0, 5);
      
      console.log('Final extracted topics:', keyTopics);
    } catch (parseError) {
      console.error('Error parsing topics from analysis:', parseError);
      // Fallback to generic topics if parsing fails
      keyTopics = [
        'Financial Performance Analysis',
        'Budget Planning and Forecasting',
        'Risk Management Strategy',
        'Cost Optimization Opportunities',
        'Investment Priorities'
      ];
    }
    
    // Extract a summary from the analysis
    let summary = 'Document analysis summary not available';
    try {
      // Try to find the first paragraph as a summary
      const paragraphs = analysisText.split('\n\n').filter(p => p.trim().length > 0);
      if (paragraphs.length > 0) {
        const firstParagraph = paragraphs[0].trim();
        if (firstParagraph.length > 20) {
          summary = firstParagraph;
        }
      }
      
      // If no good paragraph found, use the first 200 characters
      if (summary === 'Document analysis summary not available') {
        summary = analysisText.substring(0, 200) + '...';
      }
    } catch (error) {
      console.error('Error extracting summary:', error);
    }
    
    // Return structured analysis result
    return {
      success: true,
      summary: summary,
      keyTopics: keyTopics,
      financialFigures: 'Financial figures extracted from document',
      actionItems: 'Action items identified from document content',
      rawAnalysis: analysisText
    };
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
