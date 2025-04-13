/**
 * API handler for conversations collection endpoints
 * Supports GET (list) and POST (create) methods
 */
import { pinataConversationService } from '../../../lib/services/pinata-conversation-service';

export default async function handler(req, res) {
  try {
    // Extract userId directly from query or body instead of session
    const userId = req.query.userId || req.body?.userId;

    if (!userId) {
      console.error('No user ID found in request');
      return res.status(401).json({ error: 'User ID is required' });
    }

    if (req.method === 'GET') {
      try {
        const conversations = await pinataConversationService.getUserConversations(userId);
        return res.status(200).json(conversations || []);
      } catch (error) {
        console.error('Error retrieving conversations:', error);
        return res.status(500).json({ error: 'Failed to retrieve conversations' });
      }
    } else if (req.method === 'POST') {
      try {
        const { title = 'New Conversation', messages = [] } = req.body;
        
        const newConversation = await pinataConversationService.createConversation(userId, title, messages);
        return res.status(201).json(newConversation);
      } catch (error) {
        console.error('Error creating conversation:', error);
        return res.status(500).json({ error: 'Failed to create conversation' });
      }
    } else if (req.method === 'DELETE') {
      try {
        const success = await pinataConversationService.deleteAllUserConversations(userId);
        return res.status(200).json({ 
          message: success ? 'Successfully deleted all conversations' : 'Some conversations could not be deleted',
          success 
        });
      } catch (error) {
        console.error('Error deleting all conversations:', error);
        return res.status(500).json({ error: 'Failed to delete conversations' });
      }
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Unexpected error in conversations API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 