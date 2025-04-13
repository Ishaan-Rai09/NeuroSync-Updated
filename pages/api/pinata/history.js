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
    
    try {
      // First check if we have stored an IPFS hash for this user's history
      const ipfsHash = global.userHistoryCids?.[walletAddress];
      
      if (ipfsHash) {
        console.log(`Found history IPFS hash for ${walletAddress}: ${ipfsHash}`);
        
        // Try to retrieve the content from Pinata
        const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        
        try {
          const response = await axios.get(gatewayUrl);
          if (response.data && response.data.transactions) {
            transactions = response.data.transactions;
            console.log(`Retrieved ${transactions.length} transactions from Pinata`);
          }
        } catch (error) {
          console.error('Error fetching from Pinata gateway:', error);
          // If we can't retrieve from Pinata, try our in-memory backup
          if (global.userTransactions?.[walletAddress]) {
            transactions = global.userTransactions[walletAddress];
            console.log(`Retrieved ${transactions.length} transactions from memory`);
          }
        }
      } else {
        console.log('No history IPFS hash found, checking if we have transactions in memory');
        // Try to load from global temporary storage
        if (global.userTransactions?.[walletAddress]) {
          transactions = global.userTransactions[walletAddress];
          console.log(`Retrieved ${transactions.length} transactions from memory`);
        } else {
          // If we don't have anything, provide sample data for new users
          console.log('No transactions found, providing initial data for new user');
          
          // For new users, we want to show an initial transaction of 100 NEURO tokens
          transactions = [
            {
              id: `initial-${walletAddress}`,
              type: 'INITIAL',
              amount: '100',
              description: 'Welcome Bonus',
              timestamp: new Date().toISOString()
            }
          ];
          
          // Store this initial transaction
          if (!global.userTransactions) {
            global.userTransactions = {};
          }
          global.userTransactions[walletAddress] = transactions;
          
          // Store on Pinata too (fire and forget)
          try {
            const initialData = {
              walletAddress,
              type: 'INITIAL',
              amount: '100',
              description: 'Welcome Bonus',
              timestamp: new Date().toISOString()
            };
            
            // Store through our own API endpoint
            fetch('/api/pinata/store', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(initialData),
            }).catch(e => console.error('Failed to record initial balance:', e));
          } catch (err) {
            console.error('Failed to store initial balance on Pinata:', err);
          }
        }
      }
      
    } catch (error) {
      console.error('Error retrieving history:', error);
      // If we fail to retrieve history, use an empty array
      transactions = [];
    }
    
    return res.status(200).json({
      success: true,
      walletAddress,
      transactions,
      debug: {
        hasIpfsHash: !!global.userHistoryCids?.[walletAddress],
        hasTransactions: !!global.userTransactions?.[walletAddress],
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