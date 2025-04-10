import { llamaService } from './llama-service';

/**
 * AI Middleware using local LLaMA 3.2 model
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
      // Check for crisis keywords in message
      const lowerMessage = message.toLowerCase();
      const crisisKeywords = ['suicide', 'kill myself', 'end my life', 'want to die', 'don\'t want to live'];
      const isCrisis = crisisKeywords.some(keyword => lowerMessage.includes(keyword));
      
      // Enhance the system message with context
      let enhancedHistory = [...history];
      
      // Add a system message at the beginning
      if (isCrisis) {
        // Special system message for crisis situations
        enhancedHistory.unshift({
          role: 'system',
          content: `You are a mental health assistant called NeuroSync AI. The user has expressed thoughts that may indicate self-harm or suicide risk.
Your primary concern is their safety. Respond with compassion while providing clear crisis resources:
1. Express concern for their wellbeing
2. Tell them to contact emergency services (911 in US) if in immediate danger
3. Provide the Suicide & Crisis Lifeline: call/text 988 or chat at 988lifeline.org
4. Remind them that help is available and they deserve support
5. Don't minimize their feelings or use platitudes like "it will get better"
Do not provide any methods or means that could be used for self-harm. Always prioritize safety over other conversational goals.`
        });
      } else if (history.length > 0) {
        // Regular message with history
        enhancedHistory.unshift({
          role: 'system',
          content: `You are a mental health assistant called NeuroSync AI. You have a conversation history with this user. 
Remember what you've discussed in this conversation so you can refer to previous topics if relevant.
Be empathetic, helpful, and conversational. When the user asks about previous parts of the conversation, 
reference that information accurately. Identify the user's emotional state from their messages.

If the user expresses thoughts of self-harm or suicide, immediately switch to crisis support mode:
- Express concern for their wellbeing
- Tell them to contact emergency services (911 in US) if in immediate danger
- Provide the Suicide & Crisis Lifeline: call/text 988 or chat at 988lifeline.org
- Remind them that help is available and they deserve support
- Never minimize their feelings or use platitudes like "it will get better"`
        });
      } else {
        // No history means this is a new conversation
        enhancedHistory.unshift({
          role: 'system',
          content: `You are a mental health assistant called NeuroSync AI. This is a new conversation with a user.
Be empathetic, helpful, and conversational. Identify the user's emotional state from their messages.

If the user expresses thoughts of self-harm or suicide, immediately switch to crisis support mode:
- Express concern for their wellbeing
- Tell them to contact emergency services (911 in US) if in immediate danger
- Provide the Suicide & Crisis Lifeline: call/text 988 or chat at 988lifeline.org
- Remind them that help is available and they deserve support
- Never minimize their feelings or use platitudes like "it will get better"`
        });
      }
      
      // Run sentiment analysis and chat response in parallel for speed
      console.log('Starting parallel processing for chat response and sentiment analysis');
      const [chatResult, sentimentResult] = await Promise.all([
        // Get chat response from LLaMA - this is the main part
        llamaService.processMessage(message, enhancedHistory),
        // Quick sentiment analysis - use pattern matching first
        llamaService.quickAnalyzeSentiment(message)
      ]);
      
      console.log('Sentiment analysis result:', sentimentResult);
      console.log('Chat response received');
      
      // Get recommendations based on emotional state
      // Use quick pre-defined recommendations for faster response
      console.log('Getting recommendations');
      const emotionalState = isCrisis ? 'distressed' : sentimentResult.emotions.primary;
      const recommendations = llamaService.getQuickRecommendations(emotionalState);
      console.log('Recommendations retrieved, count:', recommendations.length);
      
      // Return the combined result
      return {
        response: chatResult.response,
        sentiment: isCrisis ? 'negative' : sentimentResult.sentiment,
        emotions: isCrisis ? { primary: 'distressed', confidence: 0.9 } : sentimentResult.emotions,
        recommendations
      };
    } catch (error) {
      console.error('Error in local AI middleware:', error);
      
      // Return a fallback response instead of throwing
      return {
        response: `I'm having trouble connecting to my AI brain right now. Let me try a simpler response: I understand you said "${message}". How can I help you with that?`,
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