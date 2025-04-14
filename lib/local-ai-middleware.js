import { llamaService } from './llama-service';

/**
 * AI Middleware using local LLaMA 3.2 model
 * Simplified to focus only on Ollama API interaction and Pinata storage
 */
export const localAiMiddleware = {
  /**
   * Process input and generate responses using local LLaMA model
   * @param {string} message - User message
   * @param {Array} history - Chat history
   * @param {Object} userProfile - User profile data
   * @returns {Promise<Object>} - Processed result with AI response
   */
  async processInput(message, history = [], userProfile = {}) {
    console.log('Processing input with local LLaMA middleware:', {message, historyLength: history.length});
    
    // First check if Ollama server is available
    try {
      const serverStatus = await llamaService.checkServerStatus();
      if (!serverStatus.isAvailable) {
        throw new Error('Ollama server is not responding');
      }
      console.log('Ollama server is responding correctly');
    } catch (error) {
      console.error('Ollama server check failed:', error.message);
      return this.getFallbackResponse(message);
    }
    
    // Process sentiment and chat in parallel to save time
    try {
      console.log('Starting parallel processing for sentiment analysis and chat response');
      // Check for crisis content
      const isCrisis = this.detectCrisisContent(message);
      
      // Start sentiment analysis
      const sentimentPromise = llamaService.quickAnalyzeSentiment(message);
      
      // Start chat response generation with a timeout
      const chatPromise = Promise.race([
        llamaService.processMessage(
          userProfile.name || 'User',
          message,
          history,
          null, // No streaming for API calls
          null  // We'll wait for sentiment analysis result
        ),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Chat response timeout')), 20000)
        )
      ]);
      
      // Wait for both sentiment analysis and chat response
      const [sentimentResult, chatResponse] = await Promise.all([
        sentimentPromise.catch(error => {
          console.error('Sentiment analysis failed:', error);
          return { sentiment: 'neutral', emotions: { primary: 'neutral', confidence: 0.5 }};
        }),
        chatPromise.catch(error => {
          console.error('Chat response failed:', error);
          return `I understand you said "${message}". I'd like to respond, but I'm having trouble connecting to my knowledge base right now. How about we try a simpler question?`;
        })
      ]);
      
      console.log('Sentiment analysis result:', sentimentResult);
      console.log('Chat response received from LLaMA');
      
      // Get recommendations based on emotional state
      const emotionalState = isCrisis ? 'distressed' : sentimentResult.emotions.primary;
      const recommendations = llamaService.getQuickRecommendations(emotionalState);
      console.log('Recommendations retrieved, count:', recommendations.length);
      
      // Return the combined result
      return {
        message: chatResponse,
        sentiment: isCrisis ? 'negative' : sentimentResult.sentiment,
        emotions: isCrisis ? { primary: 'distressed', confidence: 0.9 } : sentimentResult.emotions,
        recommendations
      };
    } catch (error) {
      console.error('Error in local AI middleware:', error);
      return this.getFallbackResponse(message);
    }
  },
  
  /**
   * Detect crisis content in a message
   * @param {string} message - User message
   * @returns {boolean} - True if crisis content detected
   */
  detectCrisisContent(message) {
    if (!message) return false;
    
    const crisisKeywords = [
      'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die', 
      'don\'t want to live', 'life is not worth', 'better off dead', 
      'no reason to live', 'can\'t take it anymore', 'ending it all',
      'hurt myself', 'harm myself', 'self harm'
    ];
    
    const lowerText = message.toLowerCase();
    return crisisKeywords.some(keyword => lowerText.includes(keyword));
  },
  
  /**
   * Get a fallback response when AI processing fails
   * @param {string} message - User message
   * @returns {Object} - Fallback response
   */
  getFallbackResponse(message) {
    return {
      message: `I understand you said "${message}". I'm having trouble connecting to my AI brain right now. Can you try again in a moment? If this continues, you might want to check if Ollama is running properly.`,
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
}; 