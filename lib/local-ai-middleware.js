import { llamaService } from './llama-service';

/**
 * AI Middleware using local LLaMA 3.2 model
 * Simplified to focus only on Ollama API interaction and Pinata storage
 */
export const localAiMiddleware = {
  /**
   * Process a user message through the LLaMA 3.2 AI pipeline
   * @param {string} message - User's message
   * @param {Array} history - Chat history
   * @param {Object} userProfile - User profile data
   * @returns {Promise<Object>} - Processed result with AI response
   */
  async processInput(message, history = [], userProfile = {}) {
    console.log('Processing input with local LLaMA middleware:', {message, historyLength: history.length});
    
    try {
      // Check if Ollama is responding before attempting to process the message
      try {
        const testResponse = await fetch('http://127.0.0.1:11434/api/tags', { 
          method: 'GET',
          timeout: 3000 
        });
        
        if (!testResponse.ok) {
          throw new Error(`Ollama server not responding properly: ${testResponse.status}`);
        }
        
        console.log('Ollama server is responding correctly');
      } catch (connectionError) {
        console.error('Error connecting to Ollama server:', connectionError);
        throw new Error('Cannot connect to Ollama LLaMA service. Please ensure Ollama is running.');
      }
    
      // Check for crisis keywords in message
      const lowerMessage = message.toLowerCase();
      const crisisKeywords = ['suicide', 'kill myself', 'end my life', 'want to die', 'don\'t want to live'];
      const isCrisis = crisisKeywords.some(keyword => lowerMessage.includes(keyword));
      
      // Run sentiment analysis and chat response sequentially to avoid overloading Ollama
      console.log('Starting sequential processing for sentiment analysis and chat response');
      
      // First get sentiment to use in the chat prompt
      const sentimentResult = await llamaService.quickAnalyzeSentiment(message);
      console.log('Sentiment analysis result:', sentimentResult);
      
      // Then get the chat response, passing the emotion for contextual awareness
      const chatResponse = await llamaService.processMessage(
        userProfile.name || 'User', 
        message, 
        history,
        null, // No streaming for API calls
        sentimentResult.emotions.primary // Pass detected emotion
      );
      console.log('Chat response received from LLaMA');
      
      // Get recommendations based on emotional state
      const emotionalState = isCrisis ? 'distressed' : sentimentResult.emotions.primary;
      const recommendations = llamaService.getQuickRecommendations(emotionalState);
      console.log('Recommendations retrieved, count:', recommendations.length);
      
      // Return the simplified result
      return {
        message: chatResponse,
        sentiment: isCrisis ? 'negative' : sentimentResult.sentiment,
        emotions: isCrisis ? { primary: 'distressed', confidence: 0.9 } : sentimentResult.emotions,
        recommendations
      };
    } catch (error) {
      console.error('Error in local AI middleware:', error);
      
      // Return a fallback response
      return {
        message: `I'm having trouble connecting to my AI brain right now. Let me try a simpler response: I understand you said "${message}". How can I help you with that? (Error: ${error.message})`,
        sentiment: 'neutral',
        emotions: {
          primary: 'neutral',
          confidence: 0.5
        },
        recommendations: [
          {
            type: 'exercise',
            title: 'Take a Moment',
            description: 'Take a deep breath and a moment for yourself.',
            actionUrl: '/resources/mindfulness',
            actionText: 'Learn More'
          }
        ]
      };
    }
  }
}; 