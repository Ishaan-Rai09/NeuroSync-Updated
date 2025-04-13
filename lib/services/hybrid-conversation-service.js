import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../mongodb';
import { pinataService } from './pinata-service';
import { conversationService } from '../conversation-service';

/**
 * Utility to check if a string is a valid MongoDB ObjectId
 * @param {string} id - The ID to validate
 * @returns {boolean} - Whether the ID is a valid ObjectId
 */
const isValidObjectId = (id) => {
  try {
    return ObjectId.isValid(id) && (new ObjectId(id)).toString() === id;
  } catch (error) {
    return false;
  }
};

/**
 * Hybrid Conversation Service
 * Handles storing and retrieving conversations from both MongoDB and Pinata
 */
class HybridConversationService {
  /**
   * Create a new conversation
   * @param {string} userId - User ID
   * @param {string} title - Conversation title
   * @param {Array} messages - Initial messages
   * @returns {Promise<object>} - Created conversation
   */
  async createConversation(userId, title, messages = []) {
    try {
      const conversation = {
        userId,
        title: title || 'New Conversation',
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: Array.isArray(messages) ? messages : [],
      };

      // Try to save to MongoDB first
      try {
        const { db } = await connectToDatabase();
        const result = await db.collection('conversations').insertOne(conversation);
        conversation._id = result.insertedId;
        console.log(`Conversation created in MongoDB with ID: ${conversation._id}`);
        return conversation;
      } catch (mongoError) {
        console.error('Failed to create conversation in MongoDB:', mongoError);
        
        // If MongoDB fails, try Pinata
        try {
          // For Pinata, we need to generate a client-side ID
          conversation._id = new ObjectId().toString();
          const pinataResponse = await pinataService.storeData(
            `conversation_${userId}`,
            {
              ...conversation,
              type: 'conversation'
            }
          );
          
          conversation.ipfsHash = pinataResponse.IpfsHash;
          console.log(`Conversation created in Pinata with hash: ${pinataResponse.IpfsHash}`);
          return conversation;
        } catch (pinataError) {
          console.error('Failed to create conversation in Pinata:', pinataError);
          throw new Error('Failed to create conversation in both MongoDB and Pinata');
        }
      }
    } catch (error) {
      console.error('Error in createConversation:', error);
      throw error;
    }
  }

  /**
   * Add a message to an existing conversation
   * @param {string} conversationId - Conversation ID
   * @param {string} userId - User ID
   * @param {object} message - Message to add
   * @returns {Promise<object>} - Updated conversation
   */
  async addMessage(conversationId, userId, message) {
    try {
      if (!conversationId || !userId || !message) {
        throw new Error('Missing required parameters');
      }

      // Check if the ID is a valid MongoDB ObjectId
      if (isValidObjectId(conversationId)) {
        try {
          // Try to update in MongoDB
          const { db } = await connectToDatabase();
          const objectId = new ObjectId(conversationId);
          
          const conversation = await db.collection('conversations').findOne({
            _id: objectId,
            userId
          });

          if (conversation) {
            // Add the message to the existing conversation
            const updatedMessages = [...conversation.messages, message];
            await db.collection('conversations').updateOne(
              { _id: objectId },
              {
                $set: {
                  messages: updatedMessages,
                  updatedAt: new Date()
                }
              }
            );

            console.log(`Added message to conversation ${conversationId} in MongoDB`);
            conversation.messages = updatedMessages;
            conversation.updatedAt = new Date();
            return conversation;
          }
        } catch (mongoError) {
          console.error(`Failed to add message to conversation ${conversationId} in MongoDB:`, mongoError);
        }
      }

      // If MongoDB failed or ID is not a valid ObjectId, try Pinata
      try {
        // Get the list of user's pins
        const pins = await pinataService.getHistory(userId);
        let conversationPin = pins.find(pin => {
          const metadata = pin.metadata?.keyvalues;
          return metadata?.type === 'conversation' && 
                 metadata?.conversationId === conversationId;
        });

        // If found, get the data and update it
        if (conversationPin) {
          const data = await pinataService.getData(conversationPin.ipfs_pin_hash);
          if (data) {
            // Add the message to the existing conversation
            const updatedMessages = [...(data.messages || []), message];
            data.messages = updatedMessages;
            data.updatedAt = new Date();

            // Store the updated data
            const pinataResponse = await pinataService.storeData(
              `conversation_${userId}`,
              {
                ...data,
                type: 'conversation',
                userId
              },
              { conversationId }
            );

            // Remove the old pin
            await pinataService.removeData(conversationPin.ipfs_pin_hash);

            console.log(`Added message to conversation ${conversationId} in Pinata`);
            data.ipfsHash = pinataResponse.IpfsHash;
            return data;
          }
        }

        throw new Error(`Conversation ${conversationId} not found for user ${userId}`);
      } catch (pinataError) {
        console.error(`Failed to add message to conversation ${conversationId} in Pinata:`, pinataError);
        throw new Error(`Failed to add message to conversation ${conversationId}`);
      }
    } catch (error) {
      console.error('Error in addMessage:', error);
      throw error;
    }
  }

  /**
   * Get a conversation by ID
   * @param {string} conversationId - Conversation ID
   * @param {string} userId - User ID
   * @returns {Promise<object>} - Retrieved conversation
   */
  async getConversation(conversationId, userId) {
    try {
      if (!conversationId || !userId) {
        throw new Error('Missing required parameters');
      }

      // Check if the ID is a valid MongoDB ObjectId
      if (isValidObjectId(conversationId)) {
        try {
          // Try to get from MongoDB
          const { db } = await connectToDatabase();
          const conversation = await db.collection('conversations').findOne({
            _id: new ObjectId(conversationId),
            userId
          });

          if (conversation) {
            console.log(`Retrieved conversation ${conversationId} from MongoDB`);
            return conversation;
          }
        } catch (mongoError) {
          console.error(`Failed to get conversation ${conversationId} from MongoDB:`, mongoError);
        }
      }

      // If MongoDB failed or ID is not a valid ObjectId, try Pinata
      try {
        // Get the list of user's pins
        const pins = await pinataService.getHistory(userId);
        const conversationPin = pins.find(pin => {
          const metadata = pin.metadata?.keyvalues;
          return metadata?.type === 'conversation' && 
                 metadata?.conversationId === conversationId;
        });

        // If found, get the data
        if (conversationPin) {
          const data = await pinataService.getData(conversationPin.ipfs_pin_hash);
          if (data) {
            console.log(`Retrieved conversation ${conversationId} from Pinata`);
            data.ipfsHash = conversationPin.ipfs_pin_hash;
            return data;
          }
        }
      } catch (pinataError) {
        console.error(`Failed to get conversation ${conversationId} from Pinata:`, pinataError);
      }

      throw new Error(`Conversation ${conversationId} not found for user ${userId}`);
    } catch (error) {
      console.error('Error in getConversation:', error);
      throw error;
    }
  }

  /**
   * Get all conversations for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Array of conversations
   */
  async getUserConversations(userId) {
    try {
      if (!userId) {
        throw new Error('Missing required parameter: userId');
      }

      const conversations = [];
      const conversationIds = new Set();

      // Try to get from MongoDB
      try {
        const { db } = await connectToDatabase();
        const mongoConversations = await db.collection('conversations')
          .find({ userId })
          .sort({ updatedAt: -1 })
          .toArray();

        if (mongoConversations.length > 0) {
          mongoConversations.forEach(conversation => {
            conversations.push(conversation);
            conversationIds.add(conversation._id.toString());
          });
          console.log(`Retrieved ${mongoConversations.length} conversations from MongoDB for user ${userId}`);
        }
      } catch (mongoError) {
        console.error(`Failed to get conversations from MongoDB for user ${userId}:`, mongoError);
      }

      // Try to get from Pinata
      try {
        // Get the list of user's pins
        const pins = await pinataService.getHistory(userId);
        const conversationPins = pins.filter(pin => {
          const metadata = pin.metadata?.keyvalues;
          return metadata?.type === 'conversation';
        });

        // Get the data for each pin
        if (conversationPins.length > 0) {
          for (const pin of conversationPins) {
            const data = await pinataService.getData(pin.ipfs_pin_hash);
            
            // Ensure the data is a conversation and not already in the list
            if (data && !conversationIds.has(data._id)) {
              data.ipfsHash = pin.ipfs_pin_hash;
              conversations.push(data);
              conversationIds.add(data._id);
            }
          }
          console.log(`Retrieved ${conversationPins.length} conversations from Pinata for user ${userId}`);
        }
      } catch (pinataError) {
        console.error(`Failed to get conversations from Pinata for user ${userId}:`, pinataError);
      }

      // Sort by updatedAt
      return conversations.sort((a, b) => {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();
        return dateB - dateA;
      });
    } catch (error) {
      console.error('Error in getUserConversations:', error);
      throw error;
    }
  }

  /**
   * Delete a conversation
   * @param {string} conversationId - Conversation ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - Whether the deletion was successful
   */
  async deleteConversation(conversationId, userId) {
    try {
      if (!conversationId || !userId) {
        throw new Error('Missing required parameters');
      }

      let deleted = false;

      // Check if the ID is a valid MongoDB ObjectId
      if (isValidObjectId(conversationId)) {
        try {
          // Try to delete from MongoDB
          const { db } = await connectToDatabase();
          const result = await db.collection('conversations').deleteOne({
            _id: new ObjectId(conversationId),
            userId
          });

          if (result.deletedCount > 0) {
            console.log(`Deleted conversation ${conversationId} from MongoDB`);
            deleted = true;
          }
        } catch (mongoError) {
          console.error(`Failed to delete conversation ${conversationId} from MongoDB:`, mongoError);
        }
      }

      // Try to delete from Pinata
      try {
        // Get the list of user's pins
        const pins = await pinataService.getHistory(userId);
        const conversationPin = pins.find(pin => {
          const metadata = pin.metadata?.keyvalues;
          return metadata?.type === 'conversation' && 
                 metadata?.conversationId === conversationId;
        });

        // If found, delete it
        if (conversationPin) {
          await pinataService.removeData(conversationPin.ipfs_pin_hash);
          console.log(`Deleted conversation ${conversationId} from Pinata`);
          deleted = true;
        }
      } catch (pinataError) {
        console.error(`Failed to delete conversation ${conversationId} from Pinata:`, pinataError);
      }

      return deleted;
    } catch (error) {
      console.error('Error in deleteConversation:', error);
      throw error;
    }
  }

  async updateConversationTitle(conversationId, userId, newTitle) {
    if (!conversationId || !userId || !newTitle) {
      console.warn('Missing required parameters for updating conversation title');
      return null;
    }
    
    try {
      // Try MongoDB first if it's a valid ObjectId
      if (isValidObjectId(conversationId)) {
        try {
          const updatedConversation = await conversationService.updateConversationTitle(
            conversationId,
            userId,
            newTitle
          );
          
          if (updatedConversation) {
            return updatedConversation;
          }
        } catch (mongoError) {
          console.warn('MongoDB update title error, falling back to Pinata:', mongoError);
        }
      }
      
      // If MongoDB fails or not a valid ObjectId, try Pinata
      const pinataConversation = await pinataService.updateConversationTitle(
        conversationId,
        userId,
        newTitle
      );
      
      return pinataConversation;
    } catch (error) {
      console.error('Error updating conversation title:', error);
      return null;
    }
  }

  /**
   * Delete all conversations for a user
   * @param {string} userId - User ID
   * @returns {Promise<number>} - Number of deleted conversations
   */
  async deleteAllUserConversations(userId) {
    if (!userId) {
      console.warn('Missing required parameter userId for deleteAllUserConversations');
      return 0;
    }

    try {
      let deletedCount = 0;
      
      // Try to delete from MongoDB
      try {
        const { db } = await connectToDatabase();
        const result = await db.collection('conversations').deleteMany({
          userId: isValidObjectId(userId) ? new ObjectId(userId) : userId
        });
        
        if (result.deletedCount > 0) {
          console.log(`Deleted ${result.deletedCount} conversations from MongoDB for user ${userId}`);
          deletedCount += result.deletedCount;
        }
      } catch (mongoError) {
        console.error(`Failed to delete conversations from MongoDB for user ${userId}:`, mongoError);
      }
      
      // Try to delete from Pinata
      try {
        // Get the list of user's pins
        const pins = await pinataService.getHistory(userId);
        const conversationPins = pins.filter(pin => {
          const metadata = pin.metadata?.keyvalues;
          return metadata?.type === 'conversation';
        });
        
        // Delete each pin
        if (conversationPins.length > 0) {
          for (const pin of conversationPins) {
            await pinataService.removeData(pin.ipfs_pin_hash);
            deletedCount++;
          }
          console.log(`Deleted ${conversationPins.length} conversations from Pinata for user ${userId}`);
        }
      } catch (pinataError) {
        console.error(`Failed to delete conversations from Pinata for user ${userId}:`, pinataError);
      }
      
      return deletedCount;
    } catch (error) {
      console.error('Error in deleteAllUserConversations:', error);
      return 0;
    }
  }
}

export const hybridConversationService = new HybridConversationService(); 