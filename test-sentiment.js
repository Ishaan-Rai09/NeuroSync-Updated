/**
 * Test script for the quickAnalyzeSentiment method
 * Run with: node test-sentiment.js
 */

// Import axios for making HTTP requests
const axios = require('axios');

// Constants (copy from llama-service.js)
const LLAMA_API_URL = process.env.NEXT_PUBLIC_LLAMA_API_URL || 'http://127.0.0.1:11434';
const LLAMA_MODEL = process.env.NEXT_PUBLIC_LLAMA_MODEL_NAME || 'llama3.2:latest';

/**
 * Quick sentiment analysis using new API format
 * @param {string} text - Text to analyze 
 */
async function testSentimentAnalysis(text) {
  console.log(`Testing sentiment analysis for: "${text}"`);
  
  try {
    console.log('Sending request to Ollama API...');
    const response = await axios.post(`${LLAMA_API_URL}/api/chat`, {
      model: LLAMA_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a sentiment analyzer. Analyze the emotional content of the message. Respond in JSON format only with the structure {\"sentiment\": \"positive|negative|neutral\", \"emotions\": {\"primary\": \"emotion_name\", \"confidence\": 0.0-1.0}}"
        },
        {
          role: "user",
          content: `Analyze the emotional content of this message: "${text}"`
        }
      ],
      stream: false,
      options: {
        temperature: 0.2
      }
    }, {
      timeout: 15000
    });
    
    console.log('Response received, status:', response.status);
    
    // Check for the response in the standard Ollama chat format
    let responseContent = '';
    if (response.data && response.data.message && response.data.message.content) {
      responseContent = response.data.message.content;
      console.log('Found response in message.content format');
    } else if (response.data && response.data.response) {
      // Fallback for older Ollama format
      responseContent = response.data.response;
      console.log('Found response in response format');
    } else {
      console.log('Unexpected response format:', JSON.stringify(response.data));
      return;
    }
    
    console.log('Raw response content:', responseContent);
    
    try {
      // Try to parse the response as JSON
      const parsedResponse = JSON.parse(responseContent);
      console.log('Parsed sentiment result:', JSON.stringify(parsedResponse, null, 2));
      
      if (parsedResponse.sentiment && parsedResponse.emotions) {
        console.log('TEST PASSED: Successfully parsed sentiment analysis result');
        return;
      }
      
      console.log('TEST FAILED: Response did not contain required fields');
    } catch (jsonError) {
      console.error('TEST FAILED: Could not parse response as JSON:', jsonError.message);
    }
  } catch (error) {
    console.error('ERROR during test:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
  }
}

// Run the test with a sample text
const testText = "I'm feeling happy today!";
testSentimentAnalysis(testText).catch(console.error); 