import { localAiMiddleware } from '../../../lib/local-ai-middleware';
import { conversationService } from '../../../lib/services/conversation-service';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../lib/mongodb';

// Sample recommendation data for fallback
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
    description: "Record how you're feeling right now to track your emotional patterns.",
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
    const { message, history, userId, conversationId } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Get user profile if userId is provided
    let userProfile = {};
    if (userId) {
      // In a real implementation, fetch user profile from database
      userProfile = {
        id: userId,
        name: "User", // This would be fetched from the database
        // Other user data would be fetched from database
      };
    }

    try {
      // Process the message through local LLaMA middleware
      const result = await localAiMiddleware.processInput(message, history, userProfile);
      
      // Save to MongoDB based on whether it's a new or existing conversation
      let savedConversationId = conversationId;
      let savedConversation;
      
      // Create or update conversation in MongoDB
      try {
        if (!conversationId) {
          // New conversation
          savedConversation = await conversationService.createConversation(
            userId,
            message,
            {
              sentiment: result.sentiment,
              emotions: result.emotions
            }
          );
          savedConversationId = savedConversation._id.toString();
          
          // Add AI response to the conversation
          await conversationService.addMessage(
            savedConversationId,
            {
              sender: 'bot',
              content: result.response,
              timestamp: new Date()
            }
          );
        } else {
          // Add message to existing conversation
          await conversationService.addMessage(
            conversationId,
            {
              sender: 'user',
              content: message,
              timestamp: new Date(),
              analysis: {
                sentiment: result.sentiment,
                emotions: result.emotions
              }
            }
          );
          
          // Add AI response to the conversation
          savedConversation = await conversationService.addMessage(
            conversationId,
            {
              sender: 'bot',
              content: result.response,
              timestamp: new Date()
            }
          );
        }
        
        // Update recommendations if available
        if (result.recommendations && Array.isArray(result.recommendations) && result.recommendations.length > 0) {
          const { db } = await connectToDatabase();
          await db.collection('conversations').updateOne(
            { _id: new ObjectId(savedConversationId) },
            { $set: { recommendations: result.recommendations } }
          );
        }
      } catch (dbError) {
        console.error('Error saving conversation to MongoDB:', dbError);
        // Continue even if DB save fails
      }
      
      // Return AI response to client
      res.status(200).json({
        message: result.response,
        sentiment: result.sentiment,
        emotions: result.emotions,
        recommendations: result.recommendations,
        conversationId: savedConversationId
      });
    } catch (error) {
      console.error('Error in local LLaMA processing:', error);
      
      // Fallback response
      const lowerMessage = message.toLowerCase();
      let sentiment = 'neutral';
      let responseText = "I understand what you're saying. How else can I help you today?";
      let emotions = { primary: 'neutral', confidence: 0.8 };
      
      if (lowerMessage.includes('sad') || lowerMessage.includes('depress') || lowerMessage.includes('upset')) {
        sentiment = 'negative';
        emotions = { primary: 'sad', confidence: 0.8 };
        responseText = "I'm sorry to hear you're feeling down. Remember that it's okay to have these feelings, and there are resources available to help.";
      } else if (lowerMessage.includes('happy') || lowerMessage.includes('great') || lowerMessage.includes('good')) {
        sentiment = 'positive';
        emotions = { primary: 'happy', confidence: 0.8 };
        responseText = "I'm glad to hear you're feeling positive! That's wonderful.";
      } else if (lowerMessage.includes('anxious') || lowerMessage.includes('worry') || lowerMessage.includes('stress')) {
        sentiment = 'negative';
        emotions = { primary: 'anxious', confidence: 0.8 };
        responseText = "It sounds like you might be feeling anxious. Deep breathing can sometimes help in moments like this.";
      } else if (lowerMessage.includes('suicide') || lowerMessage.includes('kill myself') || lowerMessage.includes('end my life')) {
        sentiment = 'negative';
        emotions = { primary: 'distressed', confidence: 0.9 };
        responseText = "I'm concerned about what you're saying. If you're having thoughts of harming yourself, please reach out to a crisis helpline immediately. In the US, you can call or text 988 to reach the Suicide and Crisis Lifeline, or chat at 988lifeline.org. They provide free, confidential support 24/7. Your life matters, and help is available.";
      }
      
      // Save to MongoDB even in fallback case
      let savedConversationId = conversationId;
      try {
        if (!conversationId) {
          // New conversation
          const savedConversation = await conversationService.createConversation(
            userId,
            message,
            {
              sentiment: sentiment,
              emotions: emotions
            }
          );
          savedConversationId = savedConversation._id.toString();
          
          // Add AI response
          await conversationService.addMessage(
            savedConversationId,
            {
              sender: 'bot',
              content: responseText,
              timestamp: new Date()
            }
          );
        } else {
          // Add to existing conversation
          await conversationService.addMessage(
            conversationId,
            {
              sender: 'user',
              content: message,
              timestamp: new Date(),
              analysis: {
                sentiment: sentiment,
                emotions: emotions
              }
            }
          );
          
          // Add AI response
          await conversationService.addMessage(
            conversationId,
            {
              sender: 'bot',
              content: responseText,
              timestamp: new Date()
            }
          );
        }
      } catch (dbError) {
        console.error('Error saving fallback response to MongoDB:', dbError);
      }
      
      res.status(200).json({
        message: responseText,
        sentiment: sentiment,
        emotions: emotions,
        recommendations: SAMPLE_RECOMMENDATIONS,
        conversationId: savedConversationId
      });
    }
  } catch (error) {
    console.error('Error in local chat API:', error);
    res.status(500).json({ 
      message: 'An error occurred while processing your message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 