import { conversationService } from '../../../lib/services/conversation-service';

/**
 * API handler for individual conversation operations
 * GET: Fetch a specific conversation
 * PUT: Add a message to a conversation
 * DELETE: Delete a conversation
 */
export default async function handler(req, res) {
  // Basic authentication check - use userId from query or body
  const userId = req.body.userId || req.query.userId;
  
  if (!userId) {
    return res.status(401).json({ error: 'UserId is required for authentication' });
  }
  
  const { id } = req.query;
  
  try {
    switch (req.method) {
      case 'GET':
        const conversation = await conversationService.getConversation(id);
        
        if (!conversation) {
          return res.status(404).json({ error: 'Conversation not found' });
        }
        
        // Verify the conversation belongs to the authenticated user
        if (conversation.userId.toString() !== userId) {
          return res.status(403).json({ error: 'Forbidden' });
        }
        
        return res.status(200).json(conversation);
        
      case 'PUT':
        const { message, analysis } = req.body;
        
        if (!message) {
          return res.status(400).json({ error: 'Message is required' });
        }
        
        // Verify ownership before updating
        const existingConversation = await conversationService.getConversation(id);
        if (!existingConversation) {
          return res.status(404).json({ error: 'Conversation not found' });
        }
        
        if (existingConversation.userId.toString() !== userId) {
          return res.status(403).json({ error: 'Forbidden' });
        }
        
        const updatedConversation = await conversationService.addMessage(id, message, analysis);
        return res.status(200).json(updatedConversation);
        
      case 'DELETE':
        // Verify ownership before deletion
        const conversationToDelete = await conversationService.getConversation(id);
        if (!conversationToDelete) {
          return res.status(404).json({ error: 'Conversation not found' });
        }
        
        if (conversationToDelete.userId.toString() !== userId) {
          return res.status(403).json({ error: 'Forbidden' });
        }
        
        const result = await conversationService.deleteConversation(id);
        return res.status(200).json({ success: result });
        
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Conversation API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 