import axios from 'axios';

// Configure axios with SSL certificate validation options
const axiosInstance = axios.create({
  httpsAgent: new (require('https').Agent)({
    rejectUnauthorized: process.env.NODE_ENV === 'production' // Only enforce SSL validation in production
  })
});

// Default responses for different emotional states
const FALLBACK_RESPONSES = {
  happy: "That's wonderful to hear! I'm glad you're feeling positive.",
  sad: "I'm sorry to hear you're feeling down. It's okay to have these emotions, and talking about them is a good step.",
  anxious: "It sounds like you might be feeling anxious. Deep breathing exercises might help in moments like this.",
  angry: "I understand you're feeling frustrated. Taking a moment to pause can sometimes help process these emotions.",
  neutral: "I understand. How else can I support you today?",
  default: "I'm here to listen and support you. How can I help you today?"
};

// Classification helper for sentiment/emotion
const classifyText = (text) => {
  const lowerText = text.toLowerCase();
  
  // Simple keyword-based classification
  if (lowerText.includes('happy') || lowerText.includes('joy') || lowerText.includes('great') || lowerText.includes('excited')) {
    return { sentiment: 'positive', primary: 'happy', confidence: 0.8 };
  } else if (lowerText.includes('sad') || lowerText.includes('depress') || lowerText.includes('unhappy')) {
    return { sentiment: 'negative', primary: 'sad', confidence: 0.8 };
  } else if (lowerText.includes('anxious') || lowerText.includes('worry') || lowerText.includes('nervous') || lowerText.includes('stress')) {
    return { sentiment: 'negative', primary: 'anxious', confidence: 0.7 };
  } else if (lowerText.includes('angry') || lowerText.includes('frustrated') || lowerText.includes('upset')) {
    return { sentiment: 'negative', primary: 'angry', confidence: 0.7 };
  } else if (lowerText.includes('suicide') || lowerText.includes('kill myself') || lowerText.includes('end my life')) {
    return { sentiment: 'negative', primary: 'distressed', confidence: 0.9 };
  }
  
  return { sentiment: 'neutral', primary: 'neutral', confidence: 0.6 };
};

/**
 * AI Chat Service
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
      // Use local response generation
      const classification = classifyText(message);
      const response = FALLBACK_RESPONSES[classification.primary] || FALLBACK_RESPONSES.default;
      
      return {
        response,
        emotion: classification.primary,
        emotionScore: classification.confidence,
        suggestions: []
      };
    } catch (error) {
      console.error('Error in AI chat service:', error);
      // Return a default response instead of throwing
      return {
        response: "I'm sorry, I'm having trouble processing your request right now. How else can I help you?",
        emotion: 'neutral',
        emotionScore: 0.5,
        suggestions: []
      };
    }
  }
};

/**
 * Sentiment Analysis Service
 */
export const sentimentAnalysisService = {
  /**
   * Analyze text to determine sentiment and emotions
   * @param {string} text - Text to analyze
   * @returns {Promise<{sentiment: string, emotions: Object, score: number}>}
   */
  async analyzeText(text) {
    try {
      // Use local classification
      const classification = classifyText(text);
      
      return {
        sentiment: classification.sentiment,
        emotions: {
          primary: classification.primary,
          confidence: classification.confidence
        },
        score: classification.confidence
      };
    } catch (error) {
      console.error('Error in sentiment analysis service:', error);
      // Return a neutral classification instead of throwing
      return {
        sentiment: 'neutral',
        emotions: {
          primary: 'neutral',
          confidence: 0.5
        },
        score: 0.5
      };
    }
  }
};

/**
 * Recommendation Service
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
      // Default recommendations by emotional state
      const defaultRecommendations = {
        happy: [
          {
            type: 'activity',
            title: 'Journal Your Positive Moments',
            description: 'Take a moment to write down what made you feel good today.',
            actionUrl: '/resources/activities/journal',
            actionText: 'Start Journaling'
          }
        ],
        sad: [
          {
            type: 'exercise',
            title: 'Mindful Breathing',
            description: 'Try this 5-minute breathing exercise to help center yourself.',
            actionUrl: '/resources/exercises/breathing',
            actionText: 'Start Exercise'
          },
          {
            type: 'resource',
            title: 'Understanding Low Mood',
            description: 'Learn about the causes and management of sadness.',
            actionUrl: '/resources/articles/sadness',
            actionText: 'Read Article'
          }
        ],
        anxious: [
          {
            type: 'exercise',
            title: '5-4-3-2-1 Grounding Technique',
            description: 'A simple exercise to help manage anxiety in the moment.',
            actionUrl: '/resources/exercises/grounding',
            actionText: 'Try Now'
          }
        ],
        angry: [
          {
            type: 'activity',
            title: 'Physical Activity Break',
            description: 'A short physical activity can help release tension.',
            actionUrl: '/resources/activities/movement',
            actionText: 'Get Moving'
          }
        ],
        default: [
          {
            type: 'checkin',
            title: 'Daily Mood Check-in',
            description: 'Track your emotional patterns over time.',
            actionUrl: '/checkin',
            actionText: 'Check In'
          }
        ]
      };
        
      // Use local recommendations based on emotion
      const emotionKey = userState.toLowerCase();
      return defaultRecommendations[emotionKey] || defaultRecommendations.default;
    } catch (error) {
      console.error('Error in recommendation service:', error);
      // Return default recommendations instead of throwing
      return [
        {
          type: 'resource',
          title: 'Wellness Resources',
          description: 'Explore our collection of articles and activities for mental wellbeing.',
          actionUrl: '/resources',
          actionText: 'Explore'
        }
      ];
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
      // Return a fallback response rather than throwing
      return {
        response: "I'm here to help. How are you feeling today?",
        sentiment: 'neutral',
        emotions: { primary: 'neutral', confidence: 0.5 },
        recommendations: [
          {
            type: 'checkin',
            title: 'Daily Mood Check-in',
            description: 'Take a moment to reflect on your current emotional state.',
            actionUrl: '/checkin',
            actionText: 'Check In'
          }
        ]
      };
    }
  }
}; 