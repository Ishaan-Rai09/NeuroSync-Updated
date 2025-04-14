import { ethers } from 'ethers';

/**
 * @route POST /api/blockchain/reward
 * @desc Reward tokens to a user's wallet
 * @access Private
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const { walletAddress, action, amount } = req.body;
    
    if (!walletAddress || !action || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address, action, and amount are required'
      });
    }

    // Normalize wallet address
    const normalizedWalletAddress = walletAddress.toLowerCase();

    // In a real implementation:
    // 1. Connect to the blockchain network
    // 2. Call the NeuroSyncToken contract to mint tokens
    // 3. Wait for transaction confirmation
    
    // For this demo, we'll simulate a successful transaction
    
    // Generate mock transaction hash
    const transactionHash = ethers.utils.id(
      `reward-${normalizedWalletAddress}-${action}-${amount}-${Date.now()}`
    );
    
    // In a real app, you would update a database record with the new balance
    // and store the transaction details
    
    // Ensure we record this transaction in Pinata
    const pinataData = {
      type: 'REWARD',
      amount: parseFloat(amount),
      description: `${action.replace('_', ' ').charAt(0).toUpperCase() + action.replace('_', ' ').slice(1)} Reward`,
      timestamp: new Date().toISOString(),
      walletAddress: normalizedWalletAddress,
      action
    };

    try {
      // Direct server-side import of the store functionality instead of using fetch
      const { default: pinataStoreHandler } = await import('../pinata/store');
      
      // Create mock request and response objects
      const mockReq = {
        method: 'POST',
        body: pinataData
      };
      
      let responseData = {};
      const mockRes = {
        status: (code) => ({ 
          json: (data) => {
            responseData = data;
            return mockRes;
          }
        })
      };
      
      // Call the handler directly
      await pinataStoreHandler(mockReq, mockRes);
      
      if (responseData.success) {
        console.log('Reward transaction stored on Pinata');
      } else {
        console.error('Failed to store reward on Pinata:', responseData.error);
      }
    } catch (pinataError) {
      console.error('Error storing reward on Pinata:', pinataError);
      // Continue with the response even if Pinata storage fails
    }
    
    return res.status(200).json({
      success: true,
      walletAddress: normalizedWalletAddress,
      action,
      amount,
      transactionHash,
      message: `Successfully rewarded ${amount} NEURO tokens`
    });
  } catch (error) {
    console.error('Reward error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to reward tokens'
    });
  }
} 