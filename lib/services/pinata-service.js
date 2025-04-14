const axios = require('axios');

/**
 * Pinata IPFS Service
 * Handles storing and retrieving data from Pinata IPFS
 */
class PinataService {
  constructor() {
    this.apiKey = process.env.PINATA_API_KEY;
    this.apiSecret = process.env.PINATA_API_SECRET;
    this.jwt = process.env.PINATA_JWT;
    this.apiUrl = 'https://api.pinata.cloud';
    this.gateway = 'https://gateway.pinata.cloud/ipfs/';
  }

  /**
   * Check if the Pinata credentials are configured
   */
  isConfigured() {
    return !!(this.jwt || (this.apiKey && this.apiSecret));
  }

  /**
   * Get the headers for Pinata API requests
   */
  getHeaders() {
    if (this.jwt) {
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.jwt}`
      };
    } else if (this.apiKey && this.apiSecret) {
      return {
        'Content-Type': 'application/json',
        'pinata_api_key': this.apiKey,
        'pinata_secret_api_key': this.apiSecret
      };
    } else {
      throw new Error('Pinata credentials not configured');
    }
  }

  /**
   * Store data on Pinata IPFS
   * @param {string} keyName - Unique key for the data
   * @param {object} data - Data to store
   * @param {object} metadata - Optional metadata for the pin
   * @returns {Promise<object>} - Response from Pinata
   */
  async storeData(keyName, data, metadata = {}) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Pinata credentials not configured');
      }

      // Generate a unique identifier for the transaction
      const uniqueId = `${keyName}_${Date.now()}`;
      
      // Prepare the data for Pinata
      const pinataBody = {
        pinataContent: data,
        pinataMetadata: {
          name: uniqueId,
          keyvalues: {
            userId: data.userId || 'anonymous',
            type: data.type || 'conversation',
            timestamp: Date.now(),
            ...metadata
          }
        }
      };

      // Upload to Pinata
      const response = await axios.post(
        `${this.apiUrl}/pinning/pinJSONToIPFS`,
        pinataBody,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to store data on Pinata:', error?.response?.data || error?.message || error);
      throw error;
    }
  }

  /**
   * Get data from Pinata IPFS
   * @param {string} ipfsHash - IPFS hash to retrieve
   * @returns {Promise<object>} - Retrieved data
   */
  async getData(ipfsHash) {
    try {
      if (!ipfsHash) {
        throw new Error('IPFS hash is required');
      }

      // Fetch data from Pinata Gateway
      const response = await axios.get(`${this.gateway}${ipfsHash}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get data from Pinata (${ipfsHash}):`, error?.message || error);
      return null;
    }
  }

  /**
   * Get history of pins for a user
   * @param {string} userId - User ID to get history for
   * @returns {Promise<Array>} - Array of pins
   */
  async getHistory(userId) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Pinata credentials not configured');
      }

      if (!userId) {
        return [];
      }

      // Query Pinata for pins with the user's ID
      const response = await axios.get(
        `${this.apiUrl}/data/pinList?metadata[keyvalues][userId]={"value":"${userId}","op":"eq"}&status=pinned`,
        { headers: this.getHeaders() }
      );

      return response.data.rows || [];
    } catch (error) {
      console.error(`Failed to get history from Pinata for user ${userId}:`, error?.response?.data || error?.message || error);
      return [];
    }
  }

  /**
   * Remove data from Pinata IPFS
   * @param {string} ipfsHash - IPFS hash to remove
   * @returns {Promise<object>} - Response from Pinata
   */
  async removeData(ipfsHash) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Pinata credentials not configured');
      }

      if (!ipfsHash) {
        throw new Error('IPFS hash is required');
      }

      // Unpin from Pinata
      const response = await axios.delete(
        `${this.apiUrl}/pinning/unpin/${ipfsHash}`,
        { headers: this.getHeaders() }
      );

      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Failed to remove data from Pinata (${ipfsHash}):`, error?.response?.data || error?.message || error);
      
      // Handle common Pinata error cases: 
      // 1. 404 - Pin doesn't exist
      // 2. 400 with "CURRENT_USER_HAS_NOT_PINNED_CID" - User doesn't have permission to unpin
      if (error?.response?.status === 404 || 
          (error?.response?.status === 400 && 
           error?.response?.data?.error?.reason === 'CURRENT_USER_HAS_NOT_PINNED_CID')) {
        console.log(`Pin ${ipfsHash} not found or not owned by current user. Considering it removed.`);
        return { success: true, message: 'Pin not found or not owned by current user' };
      }
      
      throw error;
    }
  }

  /**
   * Test the Pinata connection
   * @returns {Promise<boolean>} - Whether the connection was successful
   */
  async testConnection() {
    try {
      if (!this.isConfigured()) {
        return false;
      }

      // Test the connection by getting the pin count
      await axios.get(
        `${this.apiUrl}/data/userPinnedDataTotal`,
        { headers: this.getHeaders() }
      );

      return true;
    } catch (error) {
      console.error('Pinata connection test failed:', error?.response?.data || error?.message || error);
      return false;
    }
  }

  /**
   * Get all pins from Pinata regardless of user ID
   * @returns {Promise<Array>} - Array of pins
   */
  async getAllPins() {
    try {
      if (!this.isConfigured()) {
        throw new Error('Pinata credentials not configured');
      }

      // Query Pinata for all pins
      const response = await axios.get(
        `${this.apiUrl}/data/pinList?status=pinned`,
        { headers: this.getHeaders() }
      );

      return response.data.rows || [];
    } catch (error) {
      console.error(`Failed to get all pins from Pinata:`, error?.response?.data || error?.message || error);
      return [];
    }
  }
}

const pinataService = new PinataService();

module.exports = { pinataService }; 