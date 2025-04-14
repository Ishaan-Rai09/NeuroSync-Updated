import axios from 'axios';

// Environment variables
const LLAMA_API_URL = process.env.NEXT_PUBLIC_LLAMA_API_URL || 'http://127.0.0.1:11434';
const LLAMA_MODEL = process.env.NEXT_PUBLIC_LLAMA_MODEL_NAME || 'llama3.2:latest';

// Default response templates for different emotional states
const DEFAULT_RESPONSES = {
  happy: "I'm glad you're feeling positive! What's been going well for you?",
  sad: "I'm sorry to hear you're feeling down. Would you like to talk about what's troubling you?",
  anxious: "It sounds like you might be experiencing some anxiety. Deep breathing can sometimes help in moments like this. Would you like to try a simple breathing exercise?",
  angry: "I can sense you're feeling frustrated. It's completely valid to feel this way. Would it help to talk through what's causing these feelings?",
  distressed: "I'm concerned about what you're sharing. If you're having thoughts of harming yourself, please reach out to the Suicide & Crisis Lifeline: call/text 988 or chat at 988lifeline.org. Would it be helpful to talk through some immediate coping strategies?",
  confused: "I understand this might be confusing. Let's break things down together. What specific aspect would you like me to clarify?",
  neutral: "I'm here to support you. How can I help you today?"
};

// Predefined recommendations for different emotional states
const QUICK_RECOMMENDATIONS = {
  happy: [
    {
      type: 'activity',
      title: 'Gratitude Journal',
      description: "Maintain your positive mood by writing down three things you're grateful for today.",
      actionUrl: '/resources/activities/gratitude',
      actionText: 'Start Journaling'
    },
    {
      type: 'resource',
      title: 'Positive Psychology',
      description: 'Learn techniques to maintain and enhance positive emotions.',
      actionUrl: '/resources/articles/positive-psychology',
      actionText: 'Read More'
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
      actionUrl: '/resources/articles/mood',
      actionText: 'Read Article'
    },
    {
      type: 'activity',
      title: 'Mood Booster',
      description: 'Simple activities that can help lift your mood.',
      actionUrl: '/resources/activities/mood-boost',
      actionText: 'Try Now'
    }
  ],
  anxious: [
    {
      type: 'exercise',
      title: '5-4-3-2-1 Grounding Technique',
      description: 'A simple exercise to help manage anxiety in the moment.',
      actionUrl: '/resources/exercises/grounding',
      actionText: 'Try Now'
    },
    {
      type: 'resource',
      title: 'Understanding Anxiety',
      description: 'Learn about the causes and effective coping strategies for anxiety.',
      actionUrl: '/resources/articles/anxiety',
      actionText: 'Read Article'
    }
  ],
  angry: [
    {
      type: 'exercise',
      title: 'Progressive Muscle Relaxation',
      description: 'Reduce tension through progressive muscle relaxation.',
      actionUrl: '/resources/exercises/pmr',
      actionText: 'Start Exercise'
    },
    {
      type: 'activity',
      title: 'Physical Activity Break',
      description: 'A short physical activity can help release tension.',
      actionUrl: '/resources/activities/movement',
      actionText: 'Get Moving'
    }
  ],
  distressed: [
    {
      type: 'hotline',
      title: 'Crisis Support',
      description: "If you're in crisis, contact the Suicide & Crisis Lifeline: call/text 988 or chat at 988lifeline.org.",
      actionUrl: 'tel:988',
      actionText: 'Call 988'
    },
    {
      type: 'exercise',
      title: 'Urge Surfing',
      description: 'A technique to manage overwhelming urges or thoughts.',
      actionUrl: '/resources/exercises/urge-surfing',
      actionText: 'Learn More'
    }
  ],
  neutral: [
    {
      type: 'checkin',
      title: 'Daily Mood Check-in',
      description: 'Track your emotional patterns over time.',
      actionUrl: '/checkin',
      actionText: 'Check In'
    },
    {
      type: 'resource',
      title: 'Mental Wellness Basics',
      description: 'Explore fundamental concepts of mental wellbeing.',
      actionUrl: '/resources/articles/wellness-basics',
      actionText: 'Read Article'
    }
  ]
};

// Simple emotion detection with keyword matching
const detectEmotion = (text) => {
  const lowerText = text.toLowerCase();
  
  // Crisis detection takes priority
  if (
    lowerText.includes('suicide') || 
    lowerText.includes('kill myself') || 
    lowerText.includes('end my life') || 
    lowerText.includes('don\'t want to live') ||
    lowerText.includes('want to die')
  ) {
    return { 
      sentiment: 'negative', 
      emotions: { primary: 'distressed', confidence: 0.9 } 
    };
  }
  
  // Detect positive emotions - check these patterns first
  if (
    lowerText.includes('feeling good') || 
    lowerText.includes('feel good') || 
    lowerText.includes('feeling great') || 
    lowerText.includes('happy') || 
    lowerText.includes('joy') || 
    lowerText.includes('excited') ||
    lowerText.includes('wonderful') ||
    lowerText.includes('fantastic') ||
    lowerText.includes('awesome') ||
    lowerText.includes('excellent') ||
    lowerText.includes('glad') ||
    lowerText.includes('positive') ||
    lowerText.includes('feeling better')
  ) {
    return { 
      sentiment: 'positive', 
      emotions: { primary: 'happy', confidence: 0.9 } 
    };
  }
  
  // Detect negative emotions
  if (
    lowerText.includes('sad') || 
    lowerText.includes('depress') || 
    lowerText.includes('down') ||
    lowerText.includes('unhappy') ||
    lowerText.includes('miserable') ||
    lowerText.includes('hurt') ||
    lowerText.includes('pain')
  ) {
    return { 
      sentiment: 'negative', 
      emotions: { primary: 'sad', confidence: 0.85 } 
    };
  }
  
  if (
    lowerText.includes('anxious') || 
    lowerText.includes('worry') || 
    lowerText.includes('stress') ||
    lowerText.includes('nervous') ||
    lowerText.includes('afraid') ||
    lowerText.includes('fear') ||
    lowerText.includes('panic')
  ) {
    return { 
      sentiment: 'negative', 
      emotions: { primary: 'anxious', confidence: 0.85 } 
    };
  }
  
  if (
    lowerText.includes('angry') || 
    lowerText.includes('mad') || 
    lowerText.includes('frustrated') ||
    lowerText.includes('annoyed') ||
    lowerText.includes('irritated') ||
    lowerText.includes('upset')
  ) {
    return { 
      sentiment: 'negative', 
      emotions: { primary: 'angry', confidence: 0.85 } 
    };
  }
  
  if (
    lowerText.includes('confused') || 
    lowerText.includes('don\'t understand') ||
    lowerText.includes('puzzled') ||
    lowerText.includes('unsure') ||
    lowerText.includes('uncertain')
  ) {
    return { 
      sentiment: 'neutral', 
      emotions: { primary: 'confused', confidence: 0.8 } 
    };
  }
  
  // Check for greeting patterns
  if (
    lowerText.match(/^(hi|hello|hey|greetings|howdy)/) ||
    lowerText.includes('how are you') ||
    lowerText.includes('how\'s it going')
  ) {
    return {
      sentiment: 'neutral',
      emotions: { primary: 'greeting', confidence: 0.85 }
    };
  }
  
  // Default to neutral
  return { 
    sentiment: 'neutral', 
    emotions: { primary: 'neutral', confidence: 0.6 } 
  };
};

/**
 * Service for interacting with local LLaMA API
 */
export const llamaService = {
  /**
   * Check if the Ollama server is available
   * @returns {Promise<Object>} - Server status
   */
  async checkServerStatus() {
    try {
      const response = await axios.get(`${LLAMA_API_URL}/api/tags`, { 
        timeout: 2000 // Fast timeout for checking
      });
      
      return {
        isAvailable: response.status === 200,
        status: response.status,
        models: response.data?.models || []
      };
    } catch (error) {
      console.error('Ollama server check failed:', error.message);
      return {
        isAvailable: false,
        error: error.message
      };
    }
  },

  /**
   * Process a message through the LLaMA model
   * @param {string} userName - User's name
   * @param {string} message - User's message
   * @param {Array} chatHistory - Chat history
   * @param {Function} onStream - Callback function for streaming response
   * @param {string} detectedEmotion - Pre-detected emotion for context
   * @returns {Promise<string>} - Model response
   */
  async processMessage(userName, message, chatHistory, onStream = null, detectedEmotion = null) {
    try {
      const formattedHistory = this.formatChatHistory(chatHistory);
      
      // Use the provided emotion or get one if not provided
      const emotion = detectedEmotion ? 
        { emotions: { primary: detectedEmotion } } : 
        await this.quickAnalyzeSentiment(message);
        
      const normalizedMessage = message.trim();
      
      // Log request details for debugging
      console.log(`Sending request to LLaMA model: ${LLAMA_MODEL}`);
      console.log(`API URL: ${LLAMA_API_URL}/api/chat`);
      
      const chatMessages = [
        {
          role: "system",
          content: `You are NeuroSync AI, an empathetic mental health assistant. 
Be caring but stay realistic. You've detected the user is feeling: ${emotion.emotions.primary || 'neutral'}.
If the user seems in a crisis, prioritize their safety and suggest immediate professional help.
Provide concise, practical advice. Avoid generic platitudes. Be authentic, warm, and honest.`
        }
      ];
      
      // Add chat history as context (if any)
      if (formattedHistory && formattedHistory.length > 0) {
        formattedHistory.forEach(entry => {
          chatMessages.push({
            role: entry.role,
            content: entry.content
          });
        });
      }
      
      // Add the current user message
      chatMessages.push({
        role: "user",
        content: normalizedMessage
      });
      
      try {
        let fullResponse = '';
        
        if (onStream) {
          // Streaming mode
          const response = await axios.post(
            `${LLAMA_API_URL}/api/chat`,
            {
              model: LLAMA_MODEL,
              messages: chatMessages,
              stream: true,
              options: {
                temperature: 0.7
              }
            },
            {
              timeout: 30000, // Increased timeout to 30 seconds
              responseType: 'stream'
            }
          );
          
          const stream = response.data;
          
          return new Promise((resolve, reject) => {
            stream.on('data', (chunk) => {
              try {
                const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
                for (const line of lines) {
                  if (line.includes('data: [DONE]')) continue;
                  
                  if (line.startsWith('data: ')) {
                    const jsonData = JSON.parse(line.substring(6));
                    if (jsonData.message && jsonData.message.content) {
                      const content = jsonData.message.content;
                      fullResponse += content;
                      onStream(content);
                    }
                  }
                }
              } catch (e) {
                console.error('Error processing stream chunk:', e);
              }
            });
            
            stream.on('end', () => {
              resolve(fullResponse);
            });
            
            stream.on('error', (error) => {
              reject(error);
            });
          });
        } else {
          // Non-streaming mode - simplified to ensure proper JSON formatting
          console.log('Sending non-streaming request to Ollama API');
          const requestData = {
            model: LLAMA_MODEL,
            messages: chatMessages,
            stream: false,
            options: {
              temperature: 0.7
            }
          };
          
          console.log('Request payload:', JSON.stringify(requestData).substring(0, 150) + '...');
          
          const response = await axios.post(
            `${LLAMA_API_URL}/api/chat`,
            requestData,
            {
              timeout: 30000 // Increased timeout to 30 seconds
            }
          );
          
          console.log('Response received, status:', response.status);
          
          if (response.data && response.data.message && response.data.message.content) {
            return response.data.message.content;
          }
          
          // Fallback for other response formats
          if (response.data && response.data.response) {
            return response.data.response;
          }
          
          throw new Error('Unexpected response format from LLaMA API');
        }
      } catch (error) {
        console.error('Error calling LLaMA API:', error);
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
        }
        
        // Provide a fallback response based on the detected emotion
        return this.getFallbackResponse(emotion.emotions.primary || 'neutral');
      }
    } catch (error) {
      console.error('Error in processMessage:', error);
      return "I'm having trouble processing your message right now. Can we try again?";
    }
  },
  
  /**
   * Quick sentiment analysis using pattern matching
   * @param {string} text - Text to analyze
   * @returns {Object} - Sentiment analysis result
   */
  async quickAnalyzeSentiment(text) {
    try {
      // Check for simple cases using pattern matching first for speed
      const quickResult = detectEmotion(text);
      if (quickResult.emotions.confidence > 0.8) {
        console.log('Using fast pattern matching for sentiment:', quickResult);
        return quickResult;
      }
      
      // Try to use LLaMA for analysis with a simplified prompt
      try {
        const response = await axios.post(`${LLAMA_API_URL}/api/chat`, {
          model: LLAMA_MODEL,
          messages: [
            {
              role: "system",
              content: "You are a sentiment analyzer with high accuracy. Analyze the emotional content of the message and classify it correctly. Pay special attention to positive indicators like 'feeling good', 'happy', etc. Respond in JSON format only with the structure {\"sentiment\": \"positive|negative|neutral\", \"emotions\": {\"primary\": \"emotion_name\", \"confidence\": 0.0-1.0}}"
            },
            {
              role: "user",
              content: `Analyze the emotional content of this message: "${text}"`
            }
          ],
          stream: false,
          options: {
            temperature: 0.1 // Lower temperature for more predictable results
          }
        }, {
          timeout: 5000 // Reduced timeout for faster response
        });
        
        // Check for the response in the standard Ollama chat format
        let responseContent = '';
        if (response.data && response.data.message && response.data.message.content) {
          responseContent = response.data.message.content;
        } else if (response.data && response.data.response) {
          // Fallback for older Ollama format
          responseContent = response.data.response;
        } else {
          throw new Error('Unexpected response format from LLaMA API');
        }
        
        try {
          // Try to parse the response as JSON
          const parsedResponse = JSON.parse(responseContent);
          
          if (parsedResponse.sentiment && parsedResponse.emotions) {
            return {
              sentiment: parsedResponse.sentiment,
              emotions: parsedResponse.emotions
            };
          }
        } catch (jsonError) {
          console.warn('Failed to parse Ollama sentiment response as JSON:', jsonError);
        }
        
        // If we get here, something went wrong with parsing
        throw new Error('Invalid format returned from LLaMA sentiment analysis');
      } catch (llamaError) {
        console.warn('LLaMA sentiment analysis failed, using pattern matching:', llamaError.message);
        return detectEmotion(text);
      }
    } catch (error) {
      console.error('Error in sentiment analysis:', error);
      // Return a neutral result as fallback
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
   * Get quick recommendations based on emotional state
   * @param {string} emotionalState - User's emotional state
   * @returns {Array} - List of recommendations
   */
  getQuickRecommendations(emotionalState) {
    // Convert to lowercase and normalize
    const emotion = emotionalState.toLowerCase();
    
    // Return recommendations for the emotional state or default to neutral
    return QUICK_RECOMMENDATIONS[emotion] || QUICK_RECOMMENDATIONS.neutral;
  },
  
  /**
   * Format chat history for LLaMA API
   * @param {Array} chatHistory - Chat history
   * @returns {Array} - Formatted chat history
   */
  formatChatHistory(chatHistory) {
    // Check if chatHistory is null or undefined
    if (!chatHistory || !Array.isArray(chatHistory)) {
      return [];
    }
    
    return chatHistory.map(msg => ({
      role: msg.role === 'system' ? 'system' : msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
  },
  
  /**
   * Get fallback response based on detected emotion
   * @param {string} emotion - Detected emotion
   * @returns {string} - Fallback response
   */
  getFallbackResponse(emotion) {
    const fallbackResponse = DEFAULT_RESPONSES[emotion] || DEFAULT_RESPONSES.neutral;
    return `${fallbackResponse} [Note: I'm currently operating in fallback mode as I couldn't connect to the LLaMA 3.2 model. Please check if Ollama is running.]`;
  }
}; 