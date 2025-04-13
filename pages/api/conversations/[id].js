import { pinataConversationService } from '../../../lib/services/pinata-conversation-service';

export default async function handler(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Conversation ID is required' });
  }

  // Get userId directly from query or body
  const userId = req.query.userId || req.body.userId;
  
  if (!userId) {
    return res.status(401).json({ error: 'User ID is required' });
  }

  try {
    // GET: Fetch a conversation
    if (req.method === 'GET') {
      const conversation = await pinataConversationService.getConversation(id, userId);
      
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      
      return res.status(200).json({ conversation });
    }
    
    // PUT: Update a conversation (add a message or update title)
    if (req.method === 'PUT') {
      const { message, title } = req.body;
      
      // Update title
      if (title && !message) {
        const updatedConversation = await pinataConversationService.updateConversationTitle(
          id,
          userId,
          title
        );
        
        if (!updatedConversation) {
          return res.status(404).json({ error: 'Conversation not found or update failed' });
        }
        
        return res.status(200).json({ conversation: updatedConversation });
      }
      
      // Add message
      if (message) {
        if (!message.content || !message.role) {
          return res.status(400).json({ error: 'Message with content and role is required' });
        }
        
        const updatedConversation = await pinataConversationService.addMessage(
          id,
          userId,
          message
        );
        
        if (!updatedConversation) {
          return res.status(404).json({ error: 'Conversation not found or update failed' });
        }
        
        return res.status(200).json({ conversation: updatedConversation });
      }
      
      return res.status(400).json({ error: 'Either message or title is required for update' });
    }
    
    // DELETE: Delete a conversation
    if (req.method === 'DELETE') {
      const result = await pinataConversationService.deleteConversation(id, userId);
      
      if (!result) {
        return res.status(404).json({ error: 'Conversation not found or delete failed' });
      }
      
      return res.status(200).json({ success: true });
    }
    
    // Handle unsupported methods
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in conversation API:', error);
    return res.status(500).json({ error: 'An error occurred processing your request' });
  }
} 