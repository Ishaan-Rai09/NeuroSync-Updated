import { aiMiddleware } from '../../../lib/ai-service';

// Sample recommendation data for fallback in development/demo
const SAMPLE_RECOMMENDATIONS = [
  {
    type: 'exercise',
    title: 'Deep Breathing Exercise',
    description: 'Take 5 deep breaths, inhaling for 4 seconds and exhaling for 6 seconds.',
    actionUrl: '/resources/exercises/breathing',
    actionText: 'Start Exercise'
  },
  {
    type: 'resource',
    title: 'Understanding Anxiety',
    description: 'Learn about the causes and effects of anxiety in everyday life.',
    actionUrl: '/resources/articles/anxiety',
    actionText: 'Read Article'
  },
  {
    type: 'checkin',
    title: 'Mood Check-in',
    description: 'Record how you\'re feeling right now to track your emotional patterns.',
    actionUrl: '/checkin',
    actionText: 'Check In'
  }
];

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message, history, userId } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Get user profile if userId is provided
    let userProfile = {};
    if (userId) {
      // In a real implementation, fetch user profile from database
      // This is a placeholder for demonstration
      userProfile = {
        id: userId,
        // Other user data would be fetched from database
      };
    }

    try {
      // Process the message through AI middleware
      const result = await aiMiddleware.processInput(message, history, userProfile);
      
      // Return AI response to client
      res.status(200).json({
        message: result.response,
        sentiment: result.sentiment,
        emotions: result.emotions,
        recommendations: result.recommendations
      });
    } catch (error) {
      console.error('Error in AI processing:', error);
      
      // For development/demo purposes, return a meaningful fallback response
      // In production, you'd want to handle this differently
      if (process.env.NODE_ENV !== 'production') {
        // Determine sentiment based on message content for demo
        const lowerMessage = message.toLowerCase();
        let sentiment = 'neutral';
        let responseText = "I understand what you're saying. How else can I help you today?";
        
        if (lowerMessage.includes('sad') || lowerMessage.includes('depress') || lowerMessage.includes('upset')) {
          sentiment = 'negative';
          responseText = "I'm sorry to hear you're feeling down. Remember that it's okay to have these feelings, and there are resources available to help.";
        } else if (lowerMessage.includes('happy') || lowerMessage.includes('great') || lowerMessage.includes('good')) {
          sentiment = 'positive';
          responseText = "I'm glad to hear you're feeling positive! That's wonderful.";
        } else if (lowerMessage.includes('anxious') || lowerMessage.includes('worry') || lowerMessage.includes('stress')) {
          sentiment = 'negative';
          responseText = "It sounds like you might be feeling anxious. Deep breathing can sometimes help in moments like this.";
        }
        
        res.status(200).json({
          message: responseText,
          sentiment: sentiment,
          emotions: { primary: sentiment, confidence: 0.8 },
          recommendations: SAMPLE_RECOMMENDATIONS
        });
      } else {
        res.status(500).json({ 
          message: 'An error occurred while processing your message',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    }
  } catch (error) {
    console.error('Error in AI chat API:', error);
    res.status(500).json({ 
      message: 'An error occurred while processing your message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 