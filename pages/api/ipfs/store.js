import { NFTStorage, File } from 'nft.storage';
import { ethers } from 'ethers';

// Configure NFT.Storage client
const NFT_STORAGE_API_KEY = process.env.NFT_STORAGE_API_KEY;

/**
 * @route POST /api/ipfs/store
 * @desc Store transaction data on NFT.storage (backed by IPFS and Filecoin)
 * @access Private
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  // Validate API key
  if (!NFT_STORAGE_API_KEY) {
    console.error('NFT_STORAGE_API_KEY is not configured in environment variables');
    return res.status(500).json({
      success: false,
      error: 'NFT.storage API key not configured'
    });
  }

  // Create NFT.storage client
  const client = new NFTStorage({ token: NFT_STORAGE_API_KEY });

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

    // Prepare data for NFT.storage
    const jsonData = JSON.stringify(data);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const txFile = new File([blob], `${txId}.json`, { type: 'application/json' });
    
    console.log('Uploading to NFT.storage...');
    
    // Store on NFT.storage
    const cid = await client.storeBlob(txFile);
    
    console.log('Transaction stored with CID:', cid);
    
    // Also add to user's transaction history
    const historyCid = await updateUserTransactionHistory(client, data.walletAddress, {
      ...data,
      cid
    });
    
    return res.status(200).json({
      success: true,
      cid,
      historyCid,
      message: 'Transaction saved to NFT.storage'
    });
  } catch (error) {
    console.error('NFT.storage error:', error);
    return res.status(500).json({
      success: false,
      error: `Failed to store transaction on NFT.storage: ${error.message}`,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

/**
 * Helper function to update a user's transaction history on NFT.storage
 */
async function updateUserTransactionHistory(client, walletAddress, newTransaction) {
  try {
    // Create a key for the user's transaction history file
    const userHistoryKey = `neuro_${walletAddress.toLowerCase()}_transactions`;
    
    console.log('Updating transaction history for wallet:', walletAddress);
    
    // For a production app, you would retrieve the existing history
    // and append the new transaction
    // For this example, we'll create a simple history with this transaction
    
    // Try to load existing transactions from global storage (this is temporary, in a real app use a database)
    let transactions = global.userTransactions?.[walletAddress] || [];
    transactions = [newTransaction, ...transactions];
    
    // Store in global for this session (temporary solution)
    if (!global.userTransactions) {
      global.userTransactions = {};
    }
    global.userTransactions[walletAddress] = transactions;
    
    const historyData = {
      walletAddress,
      lastUpdated: new Date().toISOString(),
      transactions
    };
    
    // Store history data as JSON
    const jsonData = JSON.stringify(historyData, null, 2);
    console.log('Storing updated history:', jsonData);
    
    const blob = new Blob([jsonData], { type: 'application/json' });
    const historyFile = new File([blob], `${userHistoryKey}.json`, { type: 'application/json' });
    
    // Store on NFT.storage
    const cid = await client.storeBlob(historyFile);
    
    console.log(`Updated transaction history stored with CID: ${cid}`);
    
    // In a production app, you would store this CID in a database
    // For this demo, we'll store it in a global variable (this is lost on server restart)
    if (!global.userHistoryCids) {
      global.userHistoryCids = {};
    }
    global.userHistoryCids[walletAddress] = cid;
    
    return cid;
  } catch (error) {
    console.error('Error updating transaction history:', error);
    throw error;
  }
} 