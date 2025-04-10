import axios from 'axios';

const SINGULARITYNET_API_KEY = process.env.NEXT_PUBLIC_SINGULARITYNET_API_KEY;
const SINGULARITYNET_API_URL = process.env.NEXT_PUBLIC_SINGULARITYNET_API_URL || 'https://www.singularitynet.io/api/v1';

// Configure axios with SSL certificate validation options
const axiosInstance = axios.create({
  httpsAgent: new (require('https').Agent)({
    rejectUnauthorized: process.env.NODE_ENV === 'production' // Only enforce SSL validation in production
  })
});

/**
 * AI Chat Service using SingularityNET
 */
export const aiChatService = {
  /**
   * Process a chat message and get AI response
   * @param {string} message - User's message
   * @param {Array} history - Previous chat history for context
   * @returns {Promise<{response: string, emotion: string, suggestions: Array}>}
   */
  async processMessage(message, history = []) {
    try {
      const response = await axiosInstance.post(`${SINGULARITYNET_API_URL}/chat`, {
        message,
        history,
        options: {
          max_tokens: 300,
          temperature: 0.7,
          include_emotional_analysis: true,
          include_recommendations: true
        }
      }, {
        headers: {
          'Authorization': `Bearer ${SINGULARITYNET_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        response: response.data.response,
        emotion: response.data.emotional_analysis?.primary_emotion || 'neutral',
        emotionScore: response.data.emotional_analysis?.score || 0.5,
        suggestions: response.data.recommendations || []
      };
    } catch (error) {
      console.error('Error in AI chat service:', error);
      throw new Error('Failed to get AI response');
    }
  }
};

/**
 * Sentiment Analysis Service using SingularityNET
 */
export const sentimentAnalysisService = {
  /**
   * Analyze text to determine sentiment and emotions
   * @param {string} text - Text to analyze
   * @returns {Promise<{sentiment: string, emotions: Object, score: number}>}
   */
  async analyzeText(text) {
    try {
      const response = await axiosInstance.post(`${SINGULARITYNET_API_URL}/sentiment-analysis`, {
        text
      }, {
        headers: {
          'Authorization': `Bearer ${SINGULARITYNET_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        sentiment: response.data.sentiment,
        emotions: response.data.emotions,
        score: response.data.score
      };
    } catch (error) {
      console.error('Error in sentiment analysis service:', error);
      throw new Error('Failed to analyze sentiment');
    }
  }
};

/**
 * Recommendation Service using SingularityNET
 */
export const recommendationService = {
  /**
   * Get personalized recommendations based on user state
   * @param {string} userState - Current emotional state of the user
   * @param {Object} userProfile - User profile information
   * @returns {Promise<Array>} - List of recommendations
   */
  async getRecommendations(userState, userProfile = {}) {
    try {
      const response = await axiosInstance.post(`${SINGULARITYNET_API_URL}/recommendations`, {
        user_state: userState,
        user_profile: userProfile
      }, {
        headers: {
          'Authorization': `Bearer ${SINGULARITYNET_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.recommendations;
    } catch (error) {
      console.error('Error in recommendation service:', error);
      throw new Error('Failed to get recommendations');
    }
  }
};

/**
 * Middleware for processing AI logic
 */
export const aiMiddleware = {
  /**
   * Process a message through the full NLP pipeline
   * @param {string} message - User's message
   * @param {Array} history - Chat history
   * @param {Object} userProfile - User profile data
   * @returns {Promise<Object>} - Processed result with AI response
   */
  async processInput(message, history = [], userProfile = {}) {
    try {
      // 1. Sentiment analysis
      const sentimentResult = await sentimentAnalysisService.analyzeText(message);
      
      // 2. Get AI chat response
      const chatResult = await aiChatService.processMessage(message, history);
      
      // 3. Get recommendations based on emotional state
      const recommendations = await recommendationService.getRecommendations(
        sentimentResult.sentiment, 
        userProfile
      );
      
      return {
        response: chatResult.response,
        sentiment: sentimentResult.sentiment,
        emotions: sentimentResult.emotions,
        recommendations
      };
    } catch (error) {
      console.error('Error in AI middleware:', error);
      throw new Error('Failed to process message');
    }
  }
}; 