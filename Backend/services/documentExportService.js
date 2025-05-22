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
      systemPrompt = 'You are a professional meeting agenda creator for financial executives. Create clear, concise meeting agendas with appropriate time allocations and discussion points.';
      userPrompt = `
Create a professional meeting agenda for a ${primaryStakeholder} based on this financial document analysis:

Summary: ${summary}

Key Topics:
${keyTopics.join('\n')}

Financial Figures: ${financialFigures}

Action Items: ${actionItems}

Format the agenda with:
1. Meeting title
2. Date (use [DATE] as placeholder)
3. Attendees (include ${primaryStakeholder} and other relevant stakeholders)
4. Clear agenda items with time allocations
5. Discussion points for each agenda item
6. Any pre-meeting preparation required
7. Follow-up actions
`;
      break;
      
    case 'survey':
      systemPrompt = 'You are an expert in creating financial feedback surveys for executive teams. Create targeted questions that will generate valuable insights.';
      userPrompt = `
Create a professional feedback survey for a ${primaryStakeholder} based on this financial document analysis:

Summary: ${summary}

Key Topics:
${keyTopics.join('\n')}

Financial Figures: ${financialFigures}

Action Items: ${actionItems}

Format the survey with:
1. Introduction explaining the purpose
2. 8-10 specific questions including:
 - Multiple choice questions
 - Rating scale questions (1-5)
 - 2-3 open-ended questions
3. Questions should address:
 - The key financial topics identified
 - Opinions on financial figures
 - Feedback on proposed action items
 - Suggestions for improvement
4. Conclusion with thank you note
`;
      break;
      
    case 'email':
      systemPrompt = 'You are a skilled financial communication specialist who drafts professional emails for executives. Create clear, concise, and action-oriented emails.';
      userPrompt = `
Create a professional email draft for a ${primaryStakeholder} based on this financial document analysis:

Summary: ${summary}

Key Topics:
${keyTopics.join('\n')}

Financial Figures: ${financialFigures}

Action Items: ${actionItems}

Format the email with:
1. Appropriate subject line (prefixed with "Subject: ")
2. Professional greeting
3. Brief introduction explaining the purpose
4. Concise summary of key findings
5. Bullet points for the most important financial data
6. Clear next steps or recommendations
7. Request for feedback or meeting if appropriate
8. Professional closing
`;
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