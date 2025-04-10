import { conversationService } from '../../../lib/services/conversation-service';

/**
 * API handler for conversation operations
 * GET: Fetch user conversations
 * POST: Create a new conversation
 * DELETE: Clear all user conversations
 */
export default async function handler(req, res) {
  // Basic authentication check - in a real app, use proper auth middleware
  // For this app, we'll accept the userId from the request directly
  const userId = req.body.userId || req.query.userId;
  
  if (!userId) {
    return res.status(401).json({ error: 'UserId is required for authentication' });
  }
  
  try {
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        const conversations = await conversationService.getUserConversations(userId);
        return res.status(200).json(conversations);
        
      case 'POST':
        const { message, analysis } = req.body;
        
        if (!message) {
          return res.status(400).json({ error: 'Message is required' });
        }
        
        const newConversation = await conversationService.createConversation(userId, message, analysis);
        return res.status(201).json(newConversation);
      
      case 'DELETE':
        // Clear all conversations for the user
        const result = await conversationService.deleteAllConversations(userId);
        return res.status(200).json({ success: true, deleted: result });
        
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Conversation API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 