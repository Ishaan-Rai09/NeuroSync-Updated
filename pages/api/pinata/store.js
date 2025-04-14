import axios from 'axios';
import { ethers } from 'ethers';

// Pinata configuration
const JWT = process.env.PINATA_JWT;
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;

/**
 * @route POST /api/pinata/store
 * @desc Store transaction data on Pinata IPFS
 * @access Private
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  // Validate API credentials
  if (!JWT && (!PINATA_API_KEY || !PINATA_API_SECRET)) {
    console.error('Pinata API credentials not configured in environment variables');
    return res.status(500).json({
      success: false,
      error: 'Pinata API credentials not configured'
    });
  }

  try {
    const data = req.body;
    
    if (!data || !data.walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Invalid transaction data'
      });
    }

    console.log('Storing transaction data:', JSON.stringify(data, null, 2));

    // Add timestamp if not provided
    if (!data.timestamp) {
      data.timestamp = new Date().toISOString();
    }

    // Create a unique identifier for the transaction
    const txId = ethers.utils.id(
      `${data.walletAddress}-${data.type}-${data.amount}-${data.timestamp}`
    );
    
    data.id = txId;

    // Prepare data for Pinata
    const jsonData = JSON.stringify(data, null, 2);
    
    // Upload to Pinata
    let response;
    
    if (JWT) {
      // Use JWT authentication
      response = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JWT}`
          }
        }
      );
    } else {
      // Use API key/secret
      response = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'pinata_api_key': PINATA_API_KEY,
            'pinata_secret_api_key': PINATA_API_SECRET
          }
        }
      );
    }
    
    const ipfsHash = response.data.IpfsHash;
    console.log('Transaction stored with IPFS hash:', ipfsHash);
    
    // Also add to user's transaction history
    const historyIpfsHash = await updateUserTransactionHistory(data.walletAddress, {
      ...data,
      ipfsHash
    });
    
    return res.status(200).json({
      success: true,
      ipfsHash,
      historyIpfsHash,
      message: 'Transaction saved to Pinata IPFS'
    });
  } catch (error) {
    console.error('Pinata storage error:', error);
    return res.status(500).json({
      success: false,
      error: `Failed to store transaction on Pinata: ${error.message}`,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

/**
 * Helper function to update a user's transaction history on Pinata
 */
async function updateUserTransactionHistory(walletAddress, newTransaction) {
  try {
    // Normalize the wallet address to lowercase for consistent lookup
    const normalizedWalletAddress = walletAddress.toLowerCase();
    
    // Create a key for the user's transaction history file
    const userHistoryKey = `neuro_${normalizedWalletAddress}_transactions`;
    
    console.log('Updating transaction history for wallet:', normalizedWalletAddress);
    
    // For a production app, you would retrieve the existing history
    // and append the new transaction
    // For this example, we'll use global variable storage
    
    // Try to load existing transactions from global storage (this is temporary, in a real app use a database)
    if (!global.userTransactions) {
      global.userTransactions = {};
    }
    
    let transactions = global.userTransactions[normalizedWalletAddress] || [];
    
    // Ensure the transaction has the normalized wallet address
    const transactionWithNormalizedWallet = {
      ...newTransaction,
      walletAddress: normalizedWalletAddress
    };
    
    // Add the new transaction at the beginning of the array
    transactions = [transactionWithNormalizedWallet, ...transactions];
    
    // Store in global for this session (temporary solution)
    global.userTransactions[normalizedWalletAddress] = transactions;
    
    const historyData = {
      walletAddress: normalizedWalletAddress,
      lastUpdated: new Date().toISOString(),
      transactions
    };
    
    // Store history data as JSON
    const metadata = {
      name: `${userHistoryKey}.json`,
      keyvalues: {
        walletAddress: normalizedWalletAddress,
        lastUpdated: new Date().toISOString()
      }
    };
    
    // Upload to Pinata
    let response;
    
    if (process.env.PINATA_JWT) {
      // Use JWT authentication
      response = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        historyData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.PINATA_JWT}`
          },
          params: {
            pinataMetadata: JSON.stringify(metadata)
          }
        }
      );
    } else {
      // Use API key/secret
      response = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        historyData,
        {
          headers: {
            'Content-Type': 'application/json',
            'pinata_api_key': process.env.PINATA_API_KEY,
            'pinata_secret_api_key': process.env.PINATA_API_SECRET
          },
          params: {
            pinataMetadata: JSON.stringify(metadata)
          }
        }
      );
    }
    
    const ipfsHash = response.data.IpfsHash;
    console.log(`Updated transaction history stored with IPFS hash: ${ipfsHash}`);
    
    // In a production app, you would store this hash in a database
    // For this demo, we'll store it in a global variable (this is lost on server restart)
    if (!global.userHistoryCids) {
      global.userHistoryCids = {};
    }
    global.userHistoryCids[normalizedWalletAddress] = ipfsHash;
    
    return ipfsHash;
  } catch (error) {
    console.error('Error updating transaction history:', error);
    throw error;
  }
} 