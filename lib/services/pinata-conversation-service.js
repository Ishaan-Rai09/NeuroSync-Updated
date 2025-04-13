import { pinataService } from './pinata-service';

/**
 * Simple UUID generation function that doesn't require dependencies
 * @returns {string} - A unique ID
 */
function generateUniqueId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Pinata-only Conversation Service
 * Handles storing and retrieving conversations only from Pinata IPFS, completely bypassing MongoDB
 */
class PinataConversationService {
  /**
   * Create a new conversation
   * @param {string} userId - User ID
   * @param {string} title - Conversation title
   * @param {Array} messages - Initial messages
   * @returns {Promise<object>} - Created conversation
   */
  async createConversation(userId, title, messages = []) {
    try {
      // Create conversation object with custom UUID instead of MongoDB ID
      const conversation = {
        _id: generateUniqueId(), // Generate a unique ID
        userId,
        title: title || 'New Conversation',
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: Array.isArray(messages) ? messages : [],
        type: 'conversation'
      };

      // Store directly to Pinata
      const pinataResponse = await pinataService.storeData(
        `conversation_${userId}`,
        conversation,
        { conversationId: conversation._id }
      );
      
      conversation.ipfsHash = pinataResponse.IpfsHash;
      console.log(`Conversation created in Pinata with hash: ${pinataResponse.IpfsHash}`);
      return conversation;
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

      // Get all user's pins
      const pins = await pinataService.getHistory(userId);
      const conversationPin = pins.find(pin => {
        const metadata = pin.metadata?.keyvalues;
        return metadata?.type === 'conversation' && 
               metadata?.conversationId === conversationId;
      });

      if (!conversationPin) {
        throw new Error(`Conversation ${conversationId} not found for user ${userId}`);
      }

      // Get the conversation data
      const data = await pinataService.getData(conversationPin.ipfs_pin_hash);
      if (!data) {
        throw new Error(`Failed to retrieve conversation data from Pinata`);
      }

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

      // Get user's pins from Pinata
      const pins = await pinataService.getHistory(userId);
      const conversationPin = pins.find(pin => {
        const metadata = pin.metadata?.keyvalues;
        return metadata?.type === 'conversation' && 
               metadata?.conversationId === conversationId;
      });

      if (!conversationPin) {
        throw new Error(`Conversation ${conversationId} not found for user ${userId}`);
      }

      // Get the conversation data
      const data = await pinataService.getData(conversationPin.ipfs_pin_hash);
      if (!data) {
        throw new Error(`Failed to retrieve conversation data from Pinata`);
      }

      console.log(`Retrieved conversation ${conversationId} from Pinata`);
      data.ipfsHash = conversationPin.ipfs_pin_hash;
      return data;
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

      // Get all pins for the user
      const pins = await pinataService.getHistory(userId);
      
      // Filter for conversation pins
      const conversationPins = pins.filter(pin => {
        const metadata = pin.metadata?.keyvalues;
        return metadata?.type === 'conversation';
      });

      // Get the data for each conversation
      const conversations = [];
      for (const pin of conversationPins) {
        try {
          const data = await pinataService.getData(pin.ipfs_pin_hash);
          if (data) {
            data.ipfsHash = pin.ipfs_pin_hash;
            conversations.push(data);
          }
        } catch (error) {
          console.error(`Failed to get data for pin ${pin.ipfs_pin_hash}:`, error);
        }
      }

      console.log(`Retrieved ${conversations.length} conversations from Pinata for user ${userId}`);
      return conversations;
    } catch (error) {
      console.error('Error in getUserConversations:', error);
      return [];
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

      // Get all pins for the user
      const pins = await pinataService.getHistory(userId);
      const conversationPin = pins.find(pin => {
        const metadata = pin.metadata?.keyvalues;
        return metadata?.type === 'conversation' && 
               metadata?.conversationId === conversationId;
      });

      if (!conversationPin) {
        console.warn(`Conversation ${conversationId} not found for user ${userId}`);
        return false;
      }

      // Remove the pin
      const result = await pinataService.removeData(conversationPin.ipfs_pin_hash);

      console.log(`Deleted conversation ${conversationId} from Pinata`);
      return result.success;
    } catch (error) {
      console.error('Error in deleteConversation:', error);
      return false;
    }
  }

  /**
   * Update conversation title
   * @param {string} conversationId - Conversation ID
   * @param {string} userId - User ID
   * @param {string} newTitle - New title
   * @returns {Promise<object>} - Updated conversation
   */
  async updateConversationTitle(conversationId, userId, newTitle) {
    try {
      if (!conversationId || !userId || !newTitle) {
        throw new Error('Missing required parameters');
      }

      // Get all pins for the user
      const pins = await pinataService.getHistory(userId);
      const conversationPin = pins.find(pin => {
        const metadata = pin.metadata?.keyvalues;
        return metadata?.type === 'conversation' && 
               metadata?.conversationId === conversationId;
      });

      if (!conversationPin) {
        throw new Error(`Conversation ${conversationId} not found for user ${userId}`);
      }

      // Get the conversation data
      const data = await pinataService.getData(conversationPin.ipfs_pin_hash);
      if (!data) {
        throw new Error(`Failed to retrieve conversation data from Pinata`);
      }

      // Update the title
      data.title = newTitle;
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

      console.log(`Updated title for conversation ${conversationId} in Pinata`);
      data.ipfsHash = pinataResponse.IpfsHash;
      return data;
    } catch (error) {
      console.error('Error in updateConversationTitle:', error);
      throw error;
    }
  }

  /**
   * Delete all conversations for a user
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - Whether the deletion was successful
   */
  async deleteAllUserConversations(userId) {
    try {
      if (!userId) {
        throw new Error('Missing required parameter: userId');
      }

      // Get all pins for the user
      const pins = await pinataService.getHistory(userId);
      
      // Filter for conversation pins
      const conversationPins = pins.filter(pin => {
        const metadata = pin.metadata?.keyvalues;
        return metadata?.type === 'conversation';
      });

      // Delete each conversation
      let success = true;
      for (const pin of conversationPins) {
        try {
          const result = await pinataService.removeData(pin.ipfs_pin_hash);
          if (!result.success) {
            success = false;
          }
        } catch (error) {
          console.error(`Failed to delete pin ${pin.ipfs_pin_hash}:`, error);
          success = false;
        }
      }

      console.log(`Deleted ${conversationPins.length} conversations from Pinata for user ${userId}`);
      return success;
    } catch (error) {
      console.error('Error in deleteAllUserConversations:', error);
      return false;
    }
  }
}

export const pinataConversationService = new PinataConversationService(); 