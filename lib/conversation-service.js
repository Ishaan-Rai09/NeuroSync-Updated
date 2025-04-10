import { connectToDatabase } from './mongodb';
import { ObjectId } from 'mongodb';

/**
 * Service for managing chat conversations in MongoDB
 */
export const conversationService = {
  /**
   * Store a new message in a conversation
   * @param {Object} message - Message object with user/bot content
   * @param {string} userId - User ID
   * @param {string} conversationId - Optional conversation ID for existing conversation
   * @returns {Promise<Object>} - Stored message with conversation details
   */
  async saveMessage(message, userId, conversationId = null) {
    try {
      const { db } = await connectToDatabase();
      const conversations = db.collection('conversations');
      const timestamp = new Date();
      
      // If no conversationId, create a new conversation
      if (!conversationId) {
        const newConversation = {
          userId: userId,
          title: message.text.slice(0, 50) + (message.text.length > 50 ? '...' : ''),
          createdAt: timestamp,
          updatedAt: timestamp,
          messages: []
        };
        
        const result = await conversations.insertOne(newConversation);
        conversationId = result.insertedId.toString();
      }
      
      // Get the conversation
      const conversation = await conversations.findOne({ 
        _id: new ObjectId(conversationId)
      });
      
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      
      // Add message to conversation
      const messageObj = {
        type: message.type,
        text: message.text,
        timestamp: message.timestamp || timestamp
      };
      
      // Add sentiment if it exists
      if (message.sentiment) {
        messageObj.sentiment = message.sentiment;
      }
      
      // Add emotions if they exist
      if (message.emotions) {
        messageObj.emotions = message.emotions;
      }
      
      // Update the conversation with the new message
      await conversations.updateOne(
        { _id: new ObjectId(conversationId) },
        { 
          $push: { messages: messageObj },
          $set: { updatedAt: timestamp }
        }
      );
      
      return {
        message: messageObj,
        conversationId: conversationId
      };
    } catch (error) {
      console.error('Error saving message:', error);
      throw new Error('Failed to save message');
    }
  },
  
  /**
   * Get all conversations for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - List of conversations
   */
  async getUserConversations(userId) {
    try {
      const { db } = await connectToDatabase();
      const conversations = db.collection('conversations');
      
      const results = await conversations
        .find({ userId })
        .sort({ updatedAt: -1 })
        .project({ 
          _id: 1, 
          title: 1, 
          createdAt: 1, 
          updatedAt: 1,
          messageCount: { $size: "$messages" }
        })
        .toArray();
      
      return results.map(conv => ({
        ...conv,
        id: conv._id.toString()
      }));
    } catch (error) {
      console.error('Error getting user conversations:', error);
      throw new Error('Failed to retrieve conversations');
    }
  },
  
  /**
   * Get a specific conversation by ID
   * @param {string} conversationId - Conversation ID
   * @param {string} userId - User ID for validation
   * @returns {Promise<Object>} - Conversation with messages
   */
  async getConversation(conversationId, userId) {
    try {
      const { db } = await connectToDatabase();
      const conversations = db.collection('conversations');
      
      const conversation = await conversations.findOne({ 
        _id: new ObjectId(conversationId),
        userId: userId
      });
      
      if (!conversation) {
        throw new Error('Conversation not found or not authorized');
      }
      
      return {
        ...conversation,
        id: conversation._id.toString()
      };
    } catch (error) {
      console.error('Error retrieving conversation:', error);
      throw new Error('Failed to retrieve conversation');
    }
  },
  
  /**
   * Delete a conversation
   * @param {string} conversationId - Conversation ID
   * @param {string} userId - User ID for validation
   * @returns {Promise<boolean>} - Success indicator
   */
  async deleteConversation(conversationId, userId) {
    try {
      const { db } = await connectToDatabase();
      const conversations = db.collection('conversations');
      
      const result = await conversations.deleteOne({
        _id: new ObjectId(conversationId),
        userId: userId
      });
      
      return result.deletedCount === 1;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw new Error('Failed to delete conversation');
    }
  },
  
  /**
   * Clear all conversations for a user
   * @param {string} userId - User ID
   * @returns {Promise<number>} - Number of deleted conversations
   */
  async clearAllConversations(userId) {
    try {
      const { db } = await connectToDatabase();
      const conversations = db.collection('conversations');
      
      const result = await conversations.deleteMany({ userId });
      
      return result.deletedCount;
    } catch (error) {
      console.error('Error clearing conversations:', error);
      throw new Error('Failed to clear conversations');
    }
  },
  
  /**
   * Format chat history for AI context
   * @param {Array} messages - Array of messages
   * @returns {Array} - Formatted messages for AI context
   */
  formatHistoryForAI(messages) {
    if (!messages || !Array.isArray(messages)) return [];
    
    return messages.map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));
  }
}; 