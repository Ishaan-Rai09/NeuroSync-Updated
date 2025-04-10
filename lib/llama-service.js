import axios from 'axios';

// Configuration for local LLaMA 3.2 model
// Use IPv4 format to avoid IPv6 connection issues
const LLAMA_API_URL = process.env.NEXT_PUBLIC_LLAMA_API_URL || 'http://127.0.0.1:11434';
const LLAMA_MODEL_NAME = process.env.NEXT_PUBLIC_LLAMA_MODEL_NAME || 'llama3.2:latest';

/**
 * Service to interact with locally hosted LLaMA 3.2 model
 */
export const llamaService = {
  /**
   * Process a chat message using local LLaMA 3.2 model
   * @param {string} message - User's message
   * @param {Array} history - Previous chat history for context
   * @returns {Promise<{response: string}>}
   */
  async processMessage(message, history = []) {
    try {
      // Format history in a way LLaMA expects
      const formattedHistory = history.map(msg => ({
        role: msg.role || 'user',
        content: msg.content
      }));

      // Add system message to enhance the response with sentiment
      formattedHistory.unshift({
        role: 'system',
        content: `You are a mental health assistant. When responding, identify the user's emotional state and be empathetic. Your response should be clear and concise.`
      });

      // Add current message to history
      formattedHistory.push({
        role: 'user',
        content: message
      });

      console.log('Calling LLaMA API for chat response');

      // Call local LLaMA API
      const response = await axios.post(`${LLAMA_API_URL}/v1/chat/completions`, {
        messages: formattedHistory,
        model: LLAMA_MODEL_NAME,
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      }, {
        // Configure timeout and headers
        timeout: 60000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('LLaMA response received');

      return {
        response: response.data.choices[0].message.content,
      };
    } catch (error) {
      console.error('Error calling local LLaMA model:', error);
      if (error.response) {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      }
      throw new Error('Failed to get response from LLaMA model');
    }
  },

  /**
   * Analyze sentiment in a message - simplified version
   * @param {string} message - Message to analyze
   * @returns {Promise<{sentiment: string, emotions: Object}>}
   */
  async quickAnalyzeSentiment(message) {
    try {
      // Simple pattern matching for quick sentiment analysis
      const lowerMessage = message.toLowerCase();
      let sentiment = 'neutral';
      let primaryEmotion = 'neutral';
      let confidence = 0.6;
      
      // Simple keyword matching for quick analysis
      const positiveWords = ['happy', 'glad', 'great', 'good', 'positive', 'wonderful', 'excited', 'love', 'enjoy'];
      const negativeWords = ['sad', 'upset', 'angry', 'frustrated', 'depressed', 'anxious', 'worried', 'stress', 'fear'];
      
      let positiveCount = 0;
      let negativeCount = 0;
      
      positiveWords.forEach(word => {
        if (lowerMessage.includes(word)) positiveCount++;
      });
      
      negativeWords.forEach(word => {
        if (lowerMessage.includes(word)) negativeCount++;
      });
      
      if (positiveCount > negativeCount) {
        sentiment = 'positive';
        primaryEmotion = 'happy';
        confidence = 0.7 + (0.1 * Math.min(positiveCount, 3));
      } else if (negativeCount > positiveCount) {
        sentiment = 'negative';
        
        // Determine specific negative emotion
        if (lowerMessage.includes('anxious') || lowerMessage.includes('worry') || lowerMessage.includes('nervous')) {
          primaryEmotion = 'anxious';
        } else if (lowerMessage.includes('sad') || lowerMessage.includes('depress')) {
          primaryEmotion = 'sad';
        } else if (lowerMessage.includes('anger') || lowerMessage.includes('angry') || lowerMessage.includes('frustrat')) {
          primaryEmotion = 'angry';
        } else if (lowerMessage.includes('stress')) {
          primaryEmotion = 'stressed';
        } else {
          primaryEmotion = 'sad';
        }
        
        confidence = 0.7 + (0.1 * Math.min(negativeCount, 3));
      }
      
      // Only do full AI sentiment analysis if we couldn't determine from keywords
      if (positiveCount === 0 && negativeCount === 0) {
        return this.fullAnalyzeSentiment(message);
      }
      
      return {
        sentiment: sentiment,
        emotions: {
          primary: primaryEmotion,
          confidence: confidence
        }
      };
    } catch (error) {
      console.error('Error in quick sentiment analysis:', error);
      return {
        sentiment: 'neutral',
        emotions: {
          primary: 'neutral',
          confidence: 0.5
        }
      };
    }
  },

  /**
   * Analyze sentiment in a message using LLaMA - full analysis
   * @param {string} message - Message to analyze
   * @returns {Promise<{sentiment: string, emotions: Object}>}
   */
  async fullAnalyzeSentiment(message) {
    try {
      // Instead of using completions endpoint, we'll use chat completions
      // which is more commonly supported in local LLaMA servers
      const response = await axios.post(`${LLAMA_API_URL}/v1/chat/completions`, {
        messages: [
          {
            role: "system",
            content: "You are a sentiment analysis assistant. Analyze the emotional sentiment of the user's message and respond with only a JSON object with the format: {\"sentiment\": \"positive/negative/neutral\", \"primary_emotion\": \"emotion_name\", \"confidence\": 0.X}"
          },
          {
            role: "user",
            content: message
          }
        ],
        model: LLAMA_MODEL_NAME,
        max_tokens: 100,
        temperature: 0.1,
        stream: false
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Parse the JSON response
      const responseText = response.data.choices[0].message.content.trim();
      let emotionData;
      
      try {
        // Find JSON object in response if it's wrapped in other text
        const jsonMatch = responseText.match(/(\{.*\})/s);
        if (jsonMatch) {
          emotionData = JSON.parse(jsonMatch[0]);
        } else {
          emotionData = JSON.parse(responseText);
        }
      } catch (parseError) {
        console.error('Error parsing sentiment JSON:', parseError, 'Raw response:', responseText);
        // Fallback sentiment analysis
        return {
          sentiment: 'neutral',
          emotions: {
            primary: 'neutral',
            confidence: 0.5
          }
        };
      }

      return {
        sentiment: emotionData.sentiment || 'neutral',
        emotions: {
          primary: emotionData.primary_emotion || 'neutral',
          confidence: emotionData.confidence || 0.5
        }
      };
    } catch (error) {
      console.error('Error analyzing sentiment with LLaMA:', error);
      if (error.response) {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      }
      
      // Instead of throwing the error, return a fallback sentiment
      return {
        sentiment: 'neutral',
        emotions: {
          primary: 'neutral',
          confidence: 0.5
        }
      };
    }
  },

  /**
   * Get predefined recommendations based on emotional state
   * @param {string} emotionalState - Current emotional state
   * @returns {Array} - List of recommendations
   */
  getQuickRecommendations(emotionalState) {
    const recommendations = {
      // Crisis/distress state
      distressed: [
        {
          type: 'resource',
          title: 'Crisis Support',
          description: 'Get immediate help from trained crisis counselors.',
          actionUrl: '/crisis',
          actionText: 'Get Help Now'
        },
        {
          type: 'resource',
          title: 'Suicide Prevention Resources',
          description: 'Find resources and support for suicidal thoughts.',
          actionUrl: '/resources/articles/suicide-prevention',
          actionText: 'View Resources'
        },
        {
          type: 'exercise',
          title: 'Safety Plan',
          description: 'Create a personal safety plan for difficult moments.',
          actionUrl: '/resources/exercises/safety-plan',
          actionText: 'Create Plan'
        }
      ],
      // Happy state
      happy: [
        {
          type: 'exercise',
          title: 'Gratitude Journal',
          description: "Write down three things you're grateful for to maintain your positive mood.",
          actionUrl: '/resources/exercises/gratitude',
          actionText: 'Start Exercise'
        },
        {
          type: 'resource',
          title: 'Positive Psychology',
          description: 'Learn how to maintain and cultivate positive emotions.',
          actionUrl: '/resources/articles/positive-psychology',
          actionText: 'Read Article'
        }
      ],
      // Sad state
      sad: [
        {
          type: 'exercise',
          title: 'Mood Lifting Activities',
          description: 'Simple activities that can help improve your mood when feeling down.',
          actionUrl: '/resources/exercises/mood-lifting',
          actionText: 'View Activities'
        },
        {
          type: 'resource',
          title: 'Understanding Sadness',
          description: 'Learn about sadness, its purpose, and healthy ways to process it.',
          actionUrl: '/resources/articles/understanding-sadness',
          actionText: 'Read Article'
        },
        {
          type: 'checkin',
          title: 'Daily Mood Tracker',
          description: 'Track your mood changes to identify patterns and improvements.',
          actionUrl: '/checkin',
          actionText: 'Start Tracking'
        }
      ],
      // Anxious state
      anxious: [
        {
          type: 'exercise',
          title: 'Deep Breathing',
          description: 'A simple breathing exercise to help calm anxiety in the moment.',
          actionUrl: '/resources/exercises/deep-breathing',
          actionText: 'Start Exercise'
        },
        {
          type: 'exercise',
          title: 'Grounding Technique',
          description: 'Use your senses to ground yourself in the present moment.',
          actionUrl: '/resources/exercises/grounding',
          actionText: 'Try Now'
        },
        {
          type: 'resource',
          title: 'Coping with Anxiety',
          description: 'Learn effective strategies for managing anxiety.',
          actionUrl: '/resources/articles/anxiety-management',
          actionText: 'Read Article'
        }
      ],
      // Stressed state
      stressed: [
        {
          type: 'exercise',
          title: 'Progressive Muscle Relaxation',
          description: 'Release physical tension to help reduce stress.',
          actionUrl: '/resources/exercises/muscle-relaxation',
          actionText: 'Start Exercise'
        },
        {
          type: 'resource',
          title: 'Stress Management',
          description: 'Learn effective techniques for managing stress in daily life.',
          actionUrl: '/resources/articles/stress-management',
          actionText: 'Read Article'
        },
        {
          type: 'checkin',
          title: 'Stress Journal',
          description: 'Identify your stress triggers and patterns.',
          actionUrl: '/checkin',
          actionText: 'Start Journal'
        }
      ],
      // Angry state
      angry: [
        {
          type: 'exercise',
          title: 'Anger Cool-Down',
          description: 'Quick techniques to calm down when feeling angry.',
          actionUrl: '/resources/exercises/anger-cooldown',
          actionText: 'Start Exercise'
        },
        {
          type: 'resource',
          title: 'Healthy Expression of Anger',
          description: 'Learn constructive ways to express and process anger.',
          actionUrl: '/resources/articles/healthy-anger',
          actionText: 'Read Article'
        }
      ],
      // Default/neutral state
      neutral: [
        {
          type: 'exercise',
          title: 'Mindfulness Meditation',
          description: 'A simple mindfulness practice to enhance awareness and presence.',
          actionUrl: '/resources/exercises/mindfulness',
          actionText: 'Start Meditation'
        },
        {
          type: 'resource',
          title: 'Mental Wellness Basics',
          description: 'Learn the foundations of maintaining good mental health.',
          actionUrl: '/resources/articles/mental-wellness',
          actionText: 'Read Article'
        },
        {
          type: 'checkin',
          title: 'Regular Check-In',
          description: "Take a moment to check in with yourself and assess how you're feeling.",
          actionUrl: '/checkin',
          actionText: 'Check In'
        }
      ]
    };
    
    // Convert emotional state to lowercase and remove any punctuation
    const normalizedState = emotionalState.toLowerCase().replace(/[^\w\s]/gi, '');
    
    // Map various emotional states to our predefined categories
    let category = 'neutral';
    if (['happy', 'joy', 'excited', 'content', 'pleased'].includes(normalizedState)) {
      category = 'happy';
    } else if (['sad', 'unhappy', 'depressed', 'down', 'blue', 'gloomy'].includes(normalizedState)) {
      category = 'sad';
    } else if (['anxious', 'worried', 'nervous', 'uneasy', 'fearful'].includes(normalizedState)) {
      category = 'anxious';
    } else if (['stressed', 'overwhelmed', 'pressured', 'burdened'].includes(normalizedState)) {
      category = 'stressed';
    } else if (['angry', 'mad', 'furious', 'irritated', 'annoyed'].includes(normalizedState)) {
      category = 'angry';
    } else if (['distressed', 'crisis', 'suicidal', 'desperate', 'hopeless'].includes(normalizedState)) {
      category = 'distressed';
    }
    
    // Return recommendations for the identified category or neutral as fallback
    return recommendations[category] || recommendations.neutral;
  },

  /**
   * Generate recommendations based on emotional state (using full AI)
   * This is a more expensive operation so should be used less frequently
   * @param {string} emotionalState - Current emotional state
   * @param {Object} userProfile - User profile information
   * @returns {Promise<Array>} - List of recommendations
   */
  async generateRecommendations(emotionalState, userProfile = {}) {
    try {
      const userName = userProfile.name || "the user";
      
      // Again using chat completions instead of completions
      const response = await axios.post(`${LLAMA_API_URL}/v1/chat/completions`, {
        messages: [
          {
            role: "system",
            content: `Generate 3 personalized mental health recommendations for someone who is feeling ${emotionalState}. Each recommendation should have a type (either 'exercise', 'resource', or 'checkin'), a title, a short description, and optionally an actionUrl and actionText. Respond with only a JSON array with the format: [{"type": "exercise/resource/checkin", "title": "...", "description": "...", "actionUrl": "/path", "actionText": "..."}]`
          },
          {
            role: "user", 
            content: `I'm ${userName} and I'm feeling ${emotionalState}. What do you recommend?`
          }
        ],
        model: LLAMA_MODEL_NAME,
        max_tokens: 500,
        temperature: 0.7,
        stream: false
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Parse the JSON response
      const responseText = response.data.choices[0].message.content.trim();
      let recommendations;
      
      try {
        // Find JSON array in response if it's wrapped in other text
        const jsonMatch = responseText.match(/(\[.*\])/s);
        if (jsonMatch) {
          recommendations = JSON.parse(jsonMatch[0]);
        } else {
          recommendations = JSON.parse(responseText);
        }
      } catch (parseError) {
        console.error('Error parsing recommendations JSON:', parseError, 'Raw response:', responseText);
        // Use quick recommendations instead
        return this.getQuickRecommendations(emotionalState);
      }

      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations with LLaMA:', error);
      if (error.response) {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      }
      
      // Use quick recommendations instead
      return this.getQuickRecommendations(emotionalState);
    }
  }
}; 