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
    
    // Hard-coded list of 13 financial control topics and their questions
    const hardcodedTopics = [
      {
        topic: "Understanding Financial KPIs and Business Priorities",
        questions: [
          "What are the primary financial KPIs tracked by management and reported to the Board or investors?",
          "Which financial measure best reflects business performance from your perspective — revenue, profit, cash flow, or assets?",
          "Which KPI, if misstated, would have the biggest impact on investor confidence or internal decision-making?",
          "Are there any non-GAAP or adjusted performance measures we use frequently in external communications?"
        ]
      },
      {
        topic: "Seasonality and Timing",
        questions: [
          "Does the business have significant seasonality? If so, which quarters are the most critical financially?",
          "Are certain business lines or products only relevant during specific parts of the year?"
        ]
      },
      {
        topic: "Volatility and One-Off Items",
        questions: [
          "Do we regularly have large one-off transactions or adjustments (e.g., impairments, restructuring, M&A)?",
          "If yes, how are these treated in internal and external reporting?",
          "How stable are earnings or margins year over year? Would using a 3-year average make sense as a benchmark?"
        ]
      },
      {
        topic: "Qualitative Factors and Known Issues",
        questions: [
          "Have there been past material misstatements, restatements, or auditor concerns?",
          "Are there business units, geographies, or systems with a history of control weaknesses or fraud risk?",
          "Do we operate in highly regulated or sensitive industries (e.g., banking, pharma, energy)?",
          "Are there legal, compliance, or reputational risks that could make certain smaller errors significant?"
        ]
      },
      {
        topic: "Materiality Threshold Calibration",
        questions: [
          "What was the audit materiality used by the external auditors last year? Do you agree with their approach?",
          "Would you prefer to set different thresholds for entity-level controls vs. process-level controls, or financial reporting vs. operational/IT controls?",
          "What level of control failure do you consider tolerable before requiring remediation?"
        ]
      },
      {
        topic: "Business Structure & Entity Significance",
        questions: [
          "What are the major legal entities or reporting units in the group structure?",
          "Which entities or locations contribute most significantly to revenue, total assets, and net income?",
          "Which parts of the business are most significant or complex?",
          "Are any entities immaterial from a financial standpoint but high-risk?",
          "Are there recent acquisitions, divestitures, or reorganizations we need to consider in this year's scope?"
        ]
      },
      {
        topic: "Financial Statement Account Significance",
        questions: [
          "Which financial statement line items are most material to the business?",
          "Are there any complex or judgmental accounts that require special attention?",
          "Which accounts have the highest transaction volume or greatest exposure to error or fraud?"
        ]
      },
      {
        topic: "Process and Risk Mapping",
        questions: [
          "Which processes have the highest impact on financial reporting?",
          "Are there centralized processes that serve multiple entities?",
          "Are there manual processes or spreadsheets used in financial reporting that are not system-based?"
        ]
      },
      {
        topic: "Systems & IT Considerations",
        questions: [
          "Which ERP or financial systems are used across entities? Are any systems outdated or unsupported?",
          "Are there interfaces or data transfers between systems that are not fully automated?",
          "Is access to financial systems tightly controlled across all key locations and user groups?"
        ]
      },
      {
        topic: "Risk Indicators and Qualitative Factors",
        questions: [
          "Have any internal audits or external audits flagged recurring control issues in certain areas or locations?",
          "Are there known control weaknesses or late remediations from the previous year?",
          "Are there any locations or teams with high staff turnover, poor segregation of duties, or high fraud risk?"
        ]
      },
      {
        topic: "Changes and Emerging Risks",
        questions: [
          "Have there been significant changes in processes, systems, or organizational responsibilities in the last 12 months?",
          "Are there upcoming changes that could affect control design or testing?"
        ]
      },
      {
        topic: "CFO Decisions and Preferences",
        questions: [
          "Would you prefer to take a risk-based approach or cover more broadly across the group?",
          "What level of involvement do you want in approving final scoping decisions?"
        ]
      },
      {
        topic: "Follow-Up Data Requests to Support Scoping",
        questions: [
          "Most recent audited financial statements",
          "KPI dashboards or board reporting packs",
          "External auditor planning materiality memo (if available)",
          "Org structure and business unit revenue/profit splits",
          "Process ownership matrix (if available)"
        ]
      }
    ];
    
    const prompt = `
You are a financial controls expert analyzing a document for a CFO. Analyze the document and answer the specific questions for each of the 13 predefined topics provided below.

Document content:
${truncatedText}

For each topic, provide a detailed, insightful response based on the document content. If information for a particular topic is not found in the document, state clearly that the document does not contain information on this topic.

Output Format:
Provide answers in the following structured format:

TOPIC 1: Understanding Financial KPIs and Business Priorities
DESCRIPTION: [Provide a detailed answer addressing the KPI questions based on the document]

TOPIC 2: Seasonality and Timing
DESCRIPTION: [Provide a detailed answer addressing the seasonality questions based on the document]

TOPIC 3: Volatility and One-Off Items
DESCRIPTION: [Provide a detailed answer addressing the volatility questions based on the document]

TOPIC 4: Qualitative Factors and Known Issues
DESCRIPTION: [Provide a detailed answer addressing the qualitative factors questions based on the document]

TOPIC 5: Materiality Threshold Calibration
DESCRIPTION: [Provide a detailed answer addressing the materiality threshold questions based on the document]

TOPIC 6: Business Structure & Entity Significance
DESCRIPTION: [Provide a detailed answer addressing the business structure questions based on the document]

TOPIC 7: Financial Statement Account Significance
DESCRIPTION: [Provide a detailed answer addressing the financial statement questions based on the document]

TOPIC 8: Process and Risk Mapping
DESCRIPTION: [Provide a detailed answer addressing the process and risk mapping questions based on the document]

TOPIC 9: Systems & IT Considerations
DESCRIPTION: [Provide a detailed answer addressing the systems questions based on the document]

TOPIC 10: Risk Indicators and Qualitative Factors
DESCRIPTION: [Provide a detailed answer addressing the risk indicators questions based on the document]

TOPIC 11: Changes and Emerging Risks
DESCRIPTION: [Provide a detailed answer addressing the changes and emerging risks questions based on the document]

TOPIC 12: CFO Decisions and Preferences
DESCRIPTION: [Provide a detailed answer addressing the CFO decisions questions based on the document]

TOPIC 13: Follow-Up Data Requests to Support Scoping
DESCRIPTION: [Provide a detailed answer addressing the data requests based on the document]

IMPORTANT: You MUST address ALL 13 topics. For any topic not covered in the document, clearly state: "The document does not provide sufficient information on [topic name]." but still include that topic in your response.
`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a financial document analysis assistant specializing in financial controls and CFO agenda preparation. Analyze documents to provide detailed answers to specific questions across 13 predefined financial topics. Always include all 13 topics in your response, even if information is not available for some topics."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 3000
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
    // Step 1: Extract file info from the document
    const { fileId, fileName, fileType, userId } = document;
    console.log(`Processing document: ${fileName} (${fileType}) for user: ${userId}`);
    
    // Step 2: Retrieve file buffer from GridFS
    const db = global.mongoClient.db();
    const bucket = new mongodb.GridFSBucket(db);
    
    let fileBuffer;
    try {
      // Get the file data as a buffer
      const downloadStream = bucket.openDownloadStream(new mongodb.ObjectId(fileId));
      fileBuffer = await streamToBuffer(downloadStream);
      console.log(`Successfully retrieved file buffer of size: ${fileBuffer.length} bytes`);
    } catch (error) {
      console.error(`Error retrieving file from GridFS: ${error.message}`);
      throw new Error(`Could not retrieve file: ${error.message}`);
    }
    
    // Step 3: Extract text based on file type
    console.log(`Extracting text from ${fileType} document...`);
    const extractedText = await extractTextFromDocument(fileBuffer, fileType);
    
    if (!extractedText || extractedText.length < 50) {
      console.error(`Insufficient text extracted from document. Length: ${extractedText ? extractedText.length : 0}`);
      throw new Error('Could not extract sufficient text from the document');
    }
    
    console.log(`Successfully extracted ${extractedText.length} characters from document`);
    
    // Step 4: Analyze the extracted text with OpenAI
    console.log('Analyzing document content with OpenAI...');
    const analysisResult = await analyzeDocumentContent(extractedText);
    
    if (!analysisResult.success) {
      console.error(`OpenAI analysis failed: ${analysisResult.message}`);
      throw new Error(`OpenAI analysis failed: ${analysisResult.message}`);
    }
    
    console.log('Successfully analyzed document content with OpenAI');
    
    // Step 5: Parse the analysis result
    const analysisText = analysisResult.analysis;
    
    // Define the 13 expected topics
    const expectedTopics = [
      "Understanding Financial KPIs and Business Priorities",
      "Seasonality and Timing",
      "Volatility and One-Off Items",
      "Qualitative Factors and Known Issues",
      "Materiality Threshold Calibration",
      "Business Structure & Entity Significance",
      "Financial Statement Account Significance",
      "Process and Risk Mapping",
      "Systems & IT Considerations",
      "Risk Indicators and Qualitative Factors",
      "Changes and Emerging Risks",
      "CFO Decisions and Preferences",
      "Follow-Up Data Requests to Support Scoping"
    ];
    
    // Extract key topics from the analysis
    let keyTopics = [];
    let topicTitles = [];
    let topicDescriptions = [];
    let structuredTopics = [];
    let topicDetailsMap = {};
    let missingTopics = [];
    
    try {
      console.log('Extracting topics from analysis...');
      
      // Try to extract structured topics from the output
      const topicRegex = /TOPIC\s+(\d+)\s*:\s*([^\n]+)[\s\S]*?DESCRIPTION\s*:\s*([^\n]+(?:\n(?!TOPIC\s+\d+)[^\n]+)*)/g;
      
      let match;
      while ((match = topicRegex.exec(analysisText)) !== null) {
        const topicNumber = parseInt(match[1]);
        
        // We only want topics 1-13 (our hardcoded topics)
        if (topicNumber < 1 || topicNumber > 13) {
          continue;
        }
        
        // Use the expected topic title from our hardcoded list instead of what OpenAI returned
        // This ensures consistency in topic names
        const topicTitle = expectedTopics[topicNumber - 1]; // Convert to 0-based index
        const topicDescription = match[3].trim();
        
        console.log(`Found topic ${topicNumber}: ${topicTitle}`);
        
        structuredTopics.push({
          number: topicNumber,
          title: topicTitle,
          description: topicDescription
        });
        
        topicTitles.push(topicTitle);
        topicDescriptions.push(topicDescription);
        topicDetailsMap[topicNumber] = topicDescription;
      }
      
      console.log('Topic details map:', topicDetailsMap);
      console.log(`Found ${structuredTopics.length} structured topics out of 13 expected`);
      
      // Always use the expected topics list for keyTopics
      keyTopics = expectedTopics;
      
      // Store the descriptions for later use
      global.topicDescriptions = topicDescriptions;
      global.structuredTopics = structuredTopics;
      global.topicDetailsMap = topicDetailsMap;
      
      // Check which of our expected topics are missing
      missingTopics = expectedTopics.filter(expectedTopic => 
        !structuredTopics.some(topic => 
          topic.title === expectedTopic || 
          topic.title.toLowerCase().includes(expectedTopic.toLowerCase()) || 
          expectedTopic.toLowerCase().includes(topic.title.toLowerCase())
        )
      );
      
      console.log('Missing topics:', missingTopics);
    } catch (parseError) {
      console.error('Error parsing topics from analysis:', parseError);
      // If parsing fails, all topics are considered missing
      missingTopics = expectedTopics;
    }
    
    // Ensure we have all 13 topics by filling in missing ones
    for (let i = 0; i < expectedTopics.length; i++) {
      const topicNum = i + 1;
      
      // If this topic isn't in our extracted topics, add it with a default description
      if (!topicDetailsMap[topicNum]) {
        const missingTopic = expectedTopics[i];
        const missingDescription = `The document does not provide sufficient information on ${missingTopic}.`;
        
        // Add to the structured topics
        structuredTopics.push({
          number: topicNum,
          title: missingTopic,
          description: missingDescription
        });
        
        // Also add to the map
        topicDetailsMap[topicNum] = missingDescription;
      }
    }
    
    // Sort the structured topics by their number
    structuredTopics.sort((a, b) => a.number - b.number);
    
    // Update global variables with the complete list
    global.structuredTopics = structuredTopics;
    global.topicDetailsMap = topicDetailsMap;
    global.missingTopics = missingTopics;
    
    console.log('Final structured topics:', structuredTopics.map(t => t.title));
    
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
    
    // Return structured analysis result with topic details
    return {
      success: true,
      summary: summary,
      keyTopics: expectedTopics, // Always use the expected topics list
      topicDetails: topicDetailsMap || {}, // Use the map we created during extraction
      financialFigures: 'Financial figures extracted from document',
      actionItems: 'Action items identified from document content',
      rawAnalysis: analysisText,
      missingTopics: missingTopics // Include the list of missing topics
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
