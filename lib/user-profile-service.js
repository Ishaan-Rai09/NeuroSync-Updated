/**
 * Service for managing user profiles using Pinata IPFS
 * All user data is stored on IPFS via Pinata instead of MongoDB
 */
import { pinataService } from './services/pinata-service';

// Helper function to generate unique IDs
function generateUserId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export const userProfileService = {
  /**
   * Get user profile by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - User profile
   */
  async getUserProfile(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Get user pins from Pinata
      const pins = await pinataService.getHistory(userId);
      
      // Find user profile pin
      const userProfilePin = pins.find(pin => {
        const metadata = pin.metadata?.keyvalues;
        return metadata?.type === 'user_profile' && metadata?.userId === userId;
      });

      if (!userProfilePin) {
        // If no profile exists, create a default one
        const defaultProfile = {
          _id: userId,
          userId: userId,
          name: 'User',
          email: 'user@example.com',
          recommendations: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          type: 'user_profile'
        };
        
        // Store default profile
        const response = await pinataService.storeData(
          `user_${userId}`,
          defaultProfile,
          { userId, type: 'user_profile' }
        );
        
        // Return the default profile
        defaultProfile.ipfsHash = response.IpfsHash;
        return defaultProfile;
      }

      // Get profile data from Pinata
      const profile = await pinataService.getData(userProfilePin.ipfs_pin_hash);
      
      if (!profile) {
        throw new Error('Failed to retrieve user profile from Pinata');
      }
      
      // Add IPFS hash to profile
      profile.ipfsHash = userProfilePin.ipfs_pin_hash;
      return profile;
    } catch (error) {
      console.error('Error fetching user profile from Pinata:', error);
      
      // Return a fallback basic profile
      return {
        _id: userId,
        userId: userId,
        name: 'User',
        recommendations: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
  },

  /**
   * Update user recommendations
   * @param {string} userId - User ID
   * @param {Array} recommendations - Array of recommendation objects
   * @returns {Promise<Object>} - Updated user
   */
  async updateRecommendations(userId, recommendations) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      if (!recommendations || !Array.isArray(recommendations)) {
        throw new Error('Recommendations must be an array');
      }

      // Get current user profile
      const profile = await this.getUserProfile(userId);
      
      // Get user pins from Pinata
      const pins = await pinataService.getHistory(userId);
      
      // Find user profile pin
      const userProfilePin = pins.find(pin => {
        const metadata = pin.metadata?.keyvalues;
        return metadata?.type === 'user_profile' && metadata?.userId === userId;
      });

      // Update profile with new recommendations
      profile.recommendations = recommendations;
      profile.lastRecommendationUpdate = new Date();
      profile.updatedAt = new Date();

      // Store updated profile to Pinata
      const response = await pinataService.storeData(
        `user_${userId}`,
        profile,
        { userId, type: 'user_profile' }
      );

      // If we had a previous pin, remove it
      if (userProfilePin) {
        await pinataService.removeData(userProfilePin.ipfs_pin_hash);
      }

      return { 
        success: true, 
        profile: { ...profile, ipfsHash: response.IpfsHash } 
      };
    } catch (error) {
      console.error('Error updating recommendations on Pinata:', error);
      throw error;
    }
  },
  
  /**
   * Create or update user profile
   * @param {Object} userData - User data including credentials
   * @returns {Promise<Object>} - Created/updated user
   */
  async createOrUpdateUser(userData) {
    try {
      if (!userData) {
        throw new Error('User data is required');
      }
      
      let userId = userData.userId || userData._id;
      
      // If no userId, generate one
      if (!userId) {
        userId = generateUserId();
        userData._id = userId;
        userData.userId = userId;
      }
      
      // Get user pins from Pinata
      const pins = await pinataService.getHistory(userId);
      
      // Find user profile pin
      const userProfilePin = pins.find(pin => {
        const metadata = pin.metadata?.keyvalues;
        return metadata?.type === 'user_profile' && metadata?.userId === userId;
      });
      
      // Set timestamps
      userData.updatedAt = new Date();
      if (!userData.createdAt) {
        userData.createdAt = new Date();
      }
      
      // Set type for Pinata metadata
      userData.type = 'user_profile';
      
      // Store profile to Pinata
      const response = await pinataService.storeData(
        `user_${userId}`,
        userData,
        { userId, type: 'user_profile' }
      );
      
      // If we had a previous pin, remove it
      if (userProfilePin) {
        await pinataService.removeData(userProfilePin.ipfs_pin_hash);
      }
      
      return { 
        ...userData, 
        ipfsHash: response.IpfsHash 
      };
    } catch (error) {
      console.error('Error creating/updating user on Pinata:', error);
      throw error;
    }
  }
}; 