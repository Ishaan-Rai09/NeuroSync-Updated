import axios from 'axios';

// Pinata configuration
const JWT = process.env.PINATA_JWT;
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;

/**
 * @route GET /api/pinata/history
 * @desc Get transaction history for a wallet from Pinata IPFS
 * @access Private
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const { walletAddress } = req.query;
    
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required'
      });
    }

    console.log('Fetching transaction history for wallet:', walletAddress);

    // Validate API credentials
    if (!JWT && (!PINATA_API_KEY || !PINATA_API_SECRET)) {
      console.error('Pinata API credentials not configured in environment variables');
      return res.status(500).json({
        success: false,
        error: 'Pinata API credentials not configured'
      });
    }

    // In a production app, you would use a database to store the latest IPFS hash
    // for each user's transaction history. For this demo, we're using global variables
    // or falling back to mock data.
    
    // Check for transactions in our global temporary storage
    let transactions = [];
    let foundHistory = false;
    
    try {
      // First check if we have stored an IPFS hash for this specific user's history
      // Make sure we're comparing addresses in a case-insensitive way
      const normalizedWalletAddress = walletAddress.toLowerCase();
      const ipfsHash = global.userHistoryCids?.[normalizedWalletAddress];
      
      if (ipfsHash) {
        console.log(`Found history IPFS hash for ${normalizedWalletAddress}: ${ipfsHash}`);
        
        // Try to retrieve the content from Pinata
        const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        
        try {
          const response = await axios.get(gatewayUrl);
          if (response.data && response.data.transactions) {
            // Verify that the transactions are actually for this wallet
            if (response.data.walletAddress.toLowerCase() === normalizedWalletAddress) {
              transactions = response.data.transactions;
              console.log(`Retrieved ${transactions.length} transactions from Pinata for ${normalizedWalletAddress}`);
              foundHistory = true;
            } else {
              console.error('Wallet address mismatch in retrieved data');
              // We'll continue and try our in-memory backup
            }
          }
        } catch (error) {
          console.error('Error fetching from Pinata gateway:', error);
          // If we can't retrieve from Pinata, try our in-memory backup
        }
      }
      
      // If we couldn't get from IPFS, try our in-memory backup
      if (!foundHistory && global.userTransactions) {
        // Ensure we're looking at the right wallet's transactions
        const userTransactions = global.userTransactions[normalizedWalletAddress] || [];
        
        // Filter to make sure we only return transactions for this specific wallet
        const filteredTransactions = userTransactions.filter(tx => 
          tx.walletAddress && tx.walletAddress.toLowerCase() === normalizedWalletAddress
        );
        
        if (filteredTransactions.length > 0) {
          transactions = filteredTransactions;
          console.log(`Retrieved ${transactions.length} transactions from memory for ${normalizedWalletAddress}`);
          foundHistory = true;
        }
      }
      
      // If we still don't have history, this is a new user
      if (!foundHistory) {
        console.log('No transaction history found for this wallet address');
        return res.status(404).json({
          success: false,
          error: 'No transaction history found for this wallet address - this appears to be a new user',
          isNewUser: true
        });
      }
      
    } catch (error) {
      console.error('Error retrieving history:', error);
      return res.status(500).json({
        success: false,
        error: `Error retrieving transaction history: ${error.message}`
      });
    }
    
    return res.status(200).json({
      success: true,
      walletAddress,
      transactions,
      debug: {
        hasIpfsHash: !!global.userHistoryCids?.[walletAddress.toLowerCase()],
        hasTransactions: !!global.userTransactions?.[walletAddress.toLowerCase()],
        transactionCount: transactions.length
      }
    });
  } catch (error) {
    console.error('Pinata retrieval error:', error);
    return res.status(500).json({
      success: false,
      error: `Failed to retrieve transaction history: ${error.message}`,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 