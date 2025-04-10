import { connectToDatabase } from '../mongodb';
import { conversationSchema } from '../models/conversation';
import { ObjectId } from 'mongodb';

/**
 * Service for managing conversations in MongoDB
 */
export const conversationService = {
  /**
   * Create a new conversation
   * @param {string} userId - User ID
   * @param {string} message - Initial message content
   * @param {Object} analysis - Optional sentiment analysis
   * @returns {Promise<Object>} - Created conversation
   */
  createConversation: async (userId, message, analysis = null) => {
    const { db } = await connectToDatabase();
    
    // Validate userId
    if (!userId || typeof userId !== 'string' || userId === 'undefined') {
      console.error('Invalid userId provided to createConversation:', userId);
      throw new Error('Invalid user ID');
    }

    try {
      const newConversation = {
        ...conversationSchema,
        userId: new ObjectId(userId),
        title: `Conversation ${new Date().toLocaleString()}`,
        messages: [
          {
            sender: 'user',
            content: message,
            timestamp: new Date(),
            analysis: analysis || null
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await db.collection('conversations').insertOne(newConversation);
      return { ...newConversation, _id: result.insertedId };
    } catch (error) {
      console.error('Error in createConversation:', error);
      throw error;
    }
  },
  
  /**
   * Add a message to an existing conversation
   * @param {string} conversationId - Conversation ID
   * @param {Object} message - Message object
   * @param {Object} analysis - Sentiment analysis results
   * @returns {Promise<Object>} - Updated conversation
   */
  addMessage: async (conversationId, message, analysis = null) => {
    const { db } = await connectToDatabase();
    
    if (!conversationId) {
      console.error('Invalid conversationId provided to addMessage');
      throw new Error('Invalid conversation ID');
    }
    
    try {
      const updateData = {
        $push: { messages: message },
        $set: { updatedAt: new Date() }
      };
      
      // Add sentiment analysis if available
      if (analysis) {
        updateData.$set.lastSentiment = analysis.sentiment;
        updateData.$set.lastEmotions = analysis.emotions;
        if (analysis.recommendations) {
          updateData.$set.recommendations = analysis.recommendations;
        }
      }
      
      await db.collection('conversations').updateOne(
        { _id: new ObjectId(conversationId) },
        updateData
      );
      
      return await conversationService.getConversation(conversationId);
    } catch (error) {
      console.error('Error in addMessage:', error);
      throw error;
    }
  },
  
  /**
   * Get a conversation by ID
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<Object>} - Conversation
   */
  getConversation: async (conversationId) => {
    const { db } = await connectToDatabase();
    
    if (!conversationId) {
      console.error('Invalid conversationId provided to getConversation');
      return null;
    }
    
    try {
      return await db.collection('conversations').findOne({
        _id: new ObjectId(conversationId)
      });
    } catch (error) {
      console.error('Error in getConversation:', error);
      return null;
    }
  },
  
  /**
   * Get all conversations for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - List of conversations
   */
  getUserConversations: async (userId) => {
    const { db } = await connectToDatabase();
    
    // Handle case when userId is invalid or undefined
    if (!userId || typeof userId !== 'string' || userId === 'undefined') {
      console.log('Invalid userId provided to getUserConversations:', userId);
      return [];
    }
    
    try {
      return await db.collection('conversations')
        .find({ userId: new ObjectId(userId) })
        .sort({ updatedAt: -1 })
        .toArray();
    } catch (error) {
      console.error('Error in getUserConversations:', error);
      return [];
    }
  },
  
  /**
   * Delete a conversation
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<boolean>} - Success status
   */
  deleteConversation: async (conversationId) => {
    const { db } = await connectToDatabase();
    
    if (!conversationId) {
      console.error('Invalid conversationId provided to deleteConversation');
      return false;
    }
    
    try {
      const result = await db.collection('conversations').deleteOne({
        _id: new ObjectId(conversationId)
      });
      
      return result.deletedCount === 1;
    } catch (error) {
      console.error('Error in deleteConversation:', error);
      return false;
    }
  },
  
  /**
   * Delete all conversations for a user
   * @param {string} userId - User ID
   * @returns {Promise<number>} - Number of deleted conversations
   */
  deleteAllConversations: async (userId) => {
    const { db } = await connectToDatabase();
    
    if (!userId || typeof userId !== 'string' || userId === 'undefined') {
      console.error('Invalid userId provided to deleteAllConversations:', userId);
      return 0;
    }
    
    try {
      const result = await db.collection('conversations').deleteMany({
        userId: new ObjectId(userId)
      });
      
      return result.deletedCount;
    } catch (error) {
      console.error('Error in deleteAllConversations:', error);
      return 0;
    }
  }
}; 