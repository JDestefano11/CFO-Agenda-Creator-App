import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Check if OpenAI API key is configured
if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not defined in environment variables');
  console.error('Please add your OpenAI API key to the .env file');
}

// Initialize OpenAI client
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  console.log('OpenAI service initialized with API key:', process.env.OPENAI_API_KEY ? 'Key is present' : 'Key is missing');
} catch (error) {
  console.error('Error initializing OpenAI client:', error.message);
}

/**
 * Test the connection to OpenAI
 * @returns {Promise<Object>} - Test result
 */
export const testConnection = async () => {
  try {
    console.log('Testing connection to OpenAI...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant."
        },
        {
          role: "user",
          content: "Hello, this is a test message to check if the OpenAI API connection is working."
        }
      ],
      max_tokens: 50
    });
    
    console.log('Connection successful!');
    return {
      success: true,
      message: 'OpenAI API connection successful',
      response: response.choices[0].message.content
    };
  } catch (error) {
    console.error('Error connecting to OpenAI:', error.message);
    return {
      success: false,
      message: `Error connecting to OpenAI: ${error.message}`,
      error: error
    };
  }
};

/**
 * Generate text using OpenAI
 * @param {string} prompt - The prompt to generate text from
 * @returns {Promise<string>} - Generated text
 */
export const generateText = async (prompt) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating text with OpenAI:', error.message);
    throw new Error(`Failed to generate text: ${error.message}`);
  }
};

export default {
  testConnection,
  generateText
};
