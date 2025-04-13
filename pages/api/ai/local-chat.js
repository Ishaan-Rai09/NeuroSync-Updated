/**
 * API handler for local chat interactions
 * Streamlined to focus on Ollama chat processing and Pinata IPFS storage
 */
import { localAiMiddleware } from '../../../lib/local-ai-middleware';
import { pinataConversationService } from '../../../lib/services/pinata-conversation-service';
import { userProfileService } from '../../../lib/user-profile-service';

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userId = req.body.userId || req.query.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID is required' });
    }

    // Get basic user info if available, but don't require it
    let userProfile = null;
    if (userId && userId !== 'anonymous') {
      try {
        userProfile = await userProfileService.getUserProfile(userId);
      } catch (error) {
        console.warn('Error fetching user profile, continuing without it:', error.message);
      }
    }

    const { message, conversationId, history } = req.body;
    
    if (!message || !message.content) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    console.log('Local chat API called with message:', message.content.substring(0, 50) + '...');
    
    // Extract chat history if available
    const chatHistory = history || [];
    
    // Process the message through LLaMA AI middleware
    const processedResult = await localAiMiddleware.processInput(message.content, chatHistory, userProfile);
    
    // Setup message objects for Pinata storage
    const userMessage = {
      role: 'user',
      content: message.content,
      timestamp: new Date()
    };
    
    const aiMessage = {
      role: 'assistant',
      content: processedResult.message,
      sentiment: processedResult.sentiment,
      emotions: processedResult.emotions,
      timestamp: new Date()
    };

    // Handle conversation storage
    let conversation;
    try {
      if (conversationId) {
        // Add user message to existing conversation
        await pinataConversationService.addMessage(
          conversationId,
          userId,
          userMessage
        );
        
        // Add AI response
        conversation = await pinataConversationService.addMessage(
          conversationId,
          userId,
          aiMessage
        );
        
        console.log(`Added messages to existing conversation: ${conversationId}`);
      } else {
        // Create new conversation title from message content
        const title = message.content.length > 30
          ? message.content.substring(0, 30) + '...'
          : message.content;
          
        // Create new conversation with both messages
        conversation = await pinataConversationService.createConversation(
          userId,
          title,
          [userMessage, aiMessage]
        );
        
        console.log(`Created new conversation: ${conversation._id}`);
      }
    } catch (storageError) {
      console.error('Error storing conversation in Pinata:', storageError);
      // Continue even if storage fails - prioritize the user getting a response
    }

    // Update recommendations if available
    if (processedResult.recommendations && userProfile) {
      try {
        await userProfileService.updateRecommendations(
          userId,
          processedResult.recommendations
        );
      } catch (error) {
        console.error('Error updating recommendations:', error);
        // Continue without updating recommendations
      }
    }

    // Return the response to the client
    return res.status(200).json({
      conversationId: conversation?._id || 'fallback_id',
      message: aiMessage,
      sentiment: processedResult.sentiment,
      emotions: processedResult.emotions,
      recommendations: processedResult.recommendations || []
    });
  } catch (error) {
    console.error('Error in local chat API:', error);
    return res.status(500).json({ 
      error: 'An error occurred processing your request',
      message: { 
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again later."
      }
    });
  }
} 