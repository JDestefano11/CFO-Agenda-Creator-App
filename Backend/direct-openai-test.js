import { testConnection } from './services/openaiService.js';

// Test OpenAI connection directly
async function testOpenAIDirectly() {
  try {
    console.log('Testing OpenAI connection directly...');
    
    const result = await testConnection();
    
    if (result.success) {
      console.log('OpenAI connection test result:');
      console.log('Success:', result.message);
      console.log('Response from OpenAI:', result.response);
      console.log('\nOpenAI is properly configured and working!');
    } else {
      console.error('OpenAI connection test failed:');
      console.error(result.message);
    }
    
    return result;
  } catch (error) {
    console.error('Error testing OpenAI connection:', error.message);
    return null;
  }
}

// Run the test
testOpenAIDirectly();
