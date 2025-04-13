const axios = require('axios');
const CryptoJS = require('crypto-js');
const { NFTStorage, Blob } = require('nft.storage');

// Environment variables
const NFT_STORAGE_API_KEY = process.env.NFT_STORAGE_API_KEY;

/**
 * Encrypts data with a user-specific key
 * @param {string} data - Data to encrypt
 * @param {string} userKey - Key derived from user's identity (address)
 * @returns {string} - Encrypted data
 */
const encryptData = (data, userKey) => {
  try {
    // Generate a strong encryption key using the user's wallet address
    // In production, use a more sophisticated key derivation function
    const encryptionKey = CryptoJS.SHA256(userKey).toString();
    
    // Encrypt the data
    const encryptedData = CryptoJS.AES.encrypt(data, encryptionKey).toString();
    
    return {
      success: true,
      encryptedData
    };
  } catch (error) {
    console.error('Encryption error:', error);
    return {
      success: false,
      error: 'Failed to encrypt data'
    };
  }
};

/**
 * Decrypts data with a user-specific key
 * @param {string} encryptedData - Data to decrypt
 * @param {string} userKey - Key derived from user's identity (address)
 * @returns {string} - Decrypted data
 */
const decryptData = (encryptedData, userKey) => {
  try {
    // Generate the same encryption key using the user's wallet address
    const encryptionKey = CryptoJS.SHA256(userKey).toString();
    
    // Decrypt the data
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedData) {
      throw new Error('Decryption failed - invalid key or corrupted data');
    }
    
    return {
      success: true,
      decryptedData
    };
  } catch (error) {
    console.error('Decryption error:', error);
    return {
      success: false,
      error: 'Failed to decrypt data'
    };
  }
};

/**
 * Uploads data to IPFS through NFT.Storage
 * @param {string} data - Data to upload
 * @param {boolean} shouldEncrypt - Whether to encrypt the data
 * @param {string} userAddress - User's wallet address for encryption key
 * @returns {Object} - Response with CID
 */
const uploadToIPFS = async (data, shouldEncrypt = true, userAddress) => {
  try {
    if (!NFT_STORAGE_API_KEY) {
      throw new Error('NFT.Storage API key not configured');
    }
    
    // Create NFT.Storage client
    const client = new NFTStorage({ token: NFT_STORAGE_API_KEY });
    
    // Prepare the data (encrypt if required)
    let finalData = data;
    let contentType = 'application/json';
    let encrypted = false;
    
    if (shouldEncrypt && userAddress) {
      const encryptionResult = encryptData(data, userAddress);
      
      if (!encryptionResult.success) {
        throw new Error(encryptionResult.error);
      }
      
      finalData = encryptionResult.encryptedData;
      contentType = 'application/encrypted+json';
      encrypted = true;
    }
    
    // Add metadata
    const metadata = {
      data: finalData,
      metadata: {
        type: contentType,
        encrypted,
        timestamp: new Date().toISOString(),
        userAddress: userAddress ? `${userAddress.substring(0, 6)}...${userAddress.substring(38)}` : undefined
      }
    };
    
    // Create a blob with the data
    const blob = new Blob([JSON.stringify(metadata)], { type: contentType });
    
    // Upload to IPFS
    const cid = await client.storeBlob(blob);
    
    return {
      success: true,
      cid,
      encrypted,
      ipfsUrl: `ipfs://${cid}`,
      gatewayUrl: `https://nftstorage.link/ipfs/${cid}`
    };
  } catch (error) {
    console.error('IPFS upload error:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload to IPFS'
    };
  }
};

/**
 * Fetches data from IPFS
 * @param {string} cid - IPFS CID
 * @param {string} userAddress - User's wallet address for decryption
 * @returns {Object} - Response with data
 */
const fetchFromIPFS = async (cid, userAddress) => {
  try {
    // Fetch from IPFS gateway
    const gatewayUrl = `https://nftstorage.link/ipfs/${cid}`;
    const response = await axios.get(gatewayUrl);
    
    if (!response.data) {
      throw new Error('No data returned from IPFS');
    }
    
    const { data, metadata } = response.data;
    
    // Check if data is encrypted
    if (metadata.encrypted && userAddress) {
      const decryptionResult = decryptData(data, userAddress);
      
      if (!decryptionResult.success) {
        throw new Error(decryptionResult.error);
      }
      
      return {
        success: true,
        data: JSON.parse(decryptionResult.decryptedData),
        metadata
      };
    }
    
    // Return unencrypted data
    return {
      success: true,
      data: typeof data === 'string' ? JSON.parse(data) : data,
      metadata
    };
  } catch (error) {
    console.error('IPFS fetch error:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch from IPFS'
    };
  }
};

module.exports = uploadToIPFS;
module.exports.fetchFromIPFS = fetchFromIPFS;
module.exports.encryptData = encryptData;
module.exports.decryptData = decryptData; 