import { OpenAI } from 'openai';
import dotenv from 'dotenv'; 


dotenv.config();

// Initialize OpenAI Client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate document export content based on document analysis and export parameters
 * @param {Object} document - The document object with analysis data
 * @param {String} outputType - Type of output (agenda, survey, email)
 * @param {String} primaryStakeholder - The primary stakeholder (CFO, VP of Finance, Head of Accounting)
 * @returns {Promise<Object>} Export content generation result
 */

export const generateDocumentExportContent = async(document, outputType, primaryStakeholder) => {
    try{
        console.log(`Generating ${outputType} for document: ${document.fileName}, stakeholder: ${primaryStakeholder}`);
if(!document.analyzed || !document.analysis) {
    return {
        success: false,
        message: ' Document has not been analyzed yet'
    };
}

// Extract analysis
const { summary, keyTopics, financialFigures, actionItems } = document.analysis;

// Create the prompt for OpenAi based on the output type and stakeholder
let systemPrompt = '';
let userPrompt = '';

switch (outputType) {
    case 'agenda':
      systemPrompt = 'You are a professional meeting agenda creator for financial executives. Create clear, concise meeting agendas focused on topics that were NOT found in the uploaded documentation. The agenda should highlight these gaps for discussion.';
      userPrompt = `
Create a professional meeting agenda for a ${primaryStakeholder} that focuses specifically on financial topics that are MISSING from the analyzed document.

Summary: ${summary}

Key Topics Found in Document:
${keyTopics.join('\n')}

Financial Figures: ${financialFigures}

Action Items: ${actionItems}

The meeting should focus on addressing information gaps in the document. Structure it like this example:

"Meeting Agenda
Team Weekly Sync
Date: [DATE]
Time: 10:00 AM – 11:00 AM (60 minutes total)
Location: Conference Room B / Zoom
Meeting Lead: [PRIMARY STAKEHOLDER]

1. Welcome and Introductions (5 mins)
   - Quick round of updates
   - New team members welcome
2. Review of Last Week's Action Items (10 mins)
   - Status updates
   - Outstanding items
3. Missing Financial Information (25 mins)
   - [Specific missing topic 1] (5 mins)
   - [Specific missing topic 2] (5 mins)
   - [Specific missing topic 3] (5 mins)
   - [Specific missing topic 4] (5 mins)
   - [Specific missing topic 5] (5 mins)
4. Next Steps (15 mins)
   - Assign responsibilities
   - Set deadlines
5. Q&A (5 mins)"

Ask for meeting duration (in minutes) to properly allocate time for each section. Include 5-7 specific topics that are NOT covered in the document but should be discussed. Make it directly actionable for the ${primaryStakeholder}.`;
      break;
      
    case 'survey':
      systemPrompt = 'You are an expert in creating financial feedback surveys for executive teams. Create targeted questions specifically about information that is MISSING from the document analysis.';
      userPrompt = `
Create a professional feedback survey for a ${primaryStakeholder} that focuses on gathering missing information NOT found in the analyzed financial document. Format this in a Google Form style.

Summary of What IS Known: ${summary}

Key Topics Already Covered in Document:
${keyTopics.join('\n')}

Financial Figures Already Available: ${financialFigures}

Action Items Already Identified: ${actionItems}

Create a survey that specifically asks about information gaps in the document. Format it in Google Forms style with:

1. Brief introduction explaining you're gathering missing information
2. 8-10 specific questions focusing ONLY on missing information:
   - Multiple choice questions about missing data points
   - Rating scale questions (1-5) about importance of missing topics
   - 2-3 open-ended questions to capture missing context
3. Each question should be clearly labeled as "Question 1", "Question 2", etc.
4. For multiple choice questions, list options as:
   □ Option A
   □ Option B
   □ Option C
5. For rating scales, format as:
   How important is [missing topic]?
   ○ 1 - Not important
   ○ 2 - Somewhat important
   ○ 3 - Important
   ○ 4 - Very important
   ○ 5 - Critical

Make sure all questions focus exclusively on information that is NOT present in the document analysis but would be valuable for a complete financial assessment.`;
      break;
      
    case 'email':
      systemPrompt = 'You are a skilled financial communication specialist who drafts professional emails for executives. Create emails specifically requesting missing information that was not found in the documentation.';
      userPrompt = `
Create a professional email draft for a ${primaryStakeholder} that specifically requests missing information NOT found in the analyzed financial document.

Summary of What IS Known: ${summary}

Key Topics Already Covered in Document:
${keyTopics.join('\n')}

Financial Figures Already Available: ${financialFigures}

Action Items Already Identified: ${actionItems}

The email should:
1. Have an appropriate subject line (prefixed with "Subject: ") focusing on requesting missing financial information
2. Include a professional greeting
3. Briefly acknowledge the information already provided
4. Clearly list 5-7 specific pieces of missing information that are needed (formatted as bullet points)
5. Explain why this missing information is important for complete financial assessment
6. Request a timeline for when this missing information can be provided
7. Suggest a follow-up meeting if appropriate
8. End with a professional closing

Make the email concise, direct, and focused exclusively on obtaining the missing information not present in the document.`;
      break;
      
    case 'other':
      // For custom output type, use a more generic prompt based on the customOutputType
      systemPrompt = 'You are a professional financial content creator who can adapt information into any requested format while maintaining clarity and professionalism.';
      userPrompt = `
Create a professional ${document.export?.customOutputType || 'custom document'} for a ${primaryStakeholder} based on this financial document analysis:

Summary: ${summary}

Key Topics:
${keyTopics.join('\n')}

Financial Figures: ${financialFigures}

Action Items: ${actionItems}

Create a well-structured document that:
1. Has an appropriate title and introduction
2. Organizes the financial information clearly
3. Highlights the key topics in a logical order
4. Includes all important financial figures
5. Clearly states any action items or next steps
6. Uses a professional tone appropriate for financial executives
7. Follows standard formatting conventions for this type of document
`;
      break;
      
    default:
      return {
        success: false,
        message: `Invalid output type: ${outputType}`
      };
  }

// Call OpenAi to generate content
const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 1500
});
return {
    success: true,
    content: response.choices[0].message.content
};
    } catch(error) {
        console.error('Error generating document export content:', error.message);
        return {
            success: false,
            message: `Error generating document export content: ${error.message}`
        };
    }
};

/**
 * Update export content with user modifications
 * @param {Object} document - The document object
 * @param {String} modifiedContent - User modified content
 * @returns {Promise<Object>} Update result
 */

export const updateExportContent = async (document, modifiedContent) => {
    try {
      // No need to call external services, just update the content
      return {
        success: true,
        content: modifiedContent
      };
    } catch (error) {
      console.error('Error updating export content:', error.message);
      return {
        success: false,
        message: `Failed to update export content: ${error.message}`
      };
    }
  };

  /**
 * Finalize export content
 * @param {Object} document - The document object
 * @returns {Promise<Object>} Finalization result
 */

  export const finalizeExportContent = async (document) => {
    try {
      if (!document.export || !document.export.modifiedContent) {
        // If no modified content exists, use the original content
        const content = document.export && document.export.content 
          ? document.export.content 
          : '';
          
        return {
          success: true,
          content
        };
      }
      
      return {
        success: true,
        content: document.export.modifiedContent
      };
    } catch(error) {
        console.error('Error finalizing export content:', error.message);
        return {
            success: false,
            message: `Failed to finalize export content: ${error.message}`
        };
    }
  }


  export default {
    generateDocumentExportContent,
    updateExportContent,
    finalizeExportContent
  }