import { ethers } from 'ethers';

/**
 * @route POST /api/blockchain/authenticate
 * @desc Authenticate a user via wallet signature
 * @access Public
 */
export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const { walletAddress, signature, message } = req.body;
    
    // Validate input
    if (!walletAddress || !signature || !message) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address, signature, and message are required'
      });
    }
    
    // Verify signature matches the expected wallet address
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({
        success: false,
        error: 'Invalid signature'
      });
    }
    
    // Here you would typically:
    // 1. Check if the wallet is in your database
    // 2. Create a new user if needed
    // 3. Generate a JWT or session token
    
    // For this example, we'll just use the wallet address as the user ID
    // In a real app, you might look up a user record or create one
    
    // Mock user data
    const userData = {
      id: walletAddress,
      walletAddress,
      authMethod: 'wallet',
      authenticated: true,
      createdAt: new Date().toISOString()
    };
    
    // Return success with user data
    return res.status(200).json({
      success: true,
      ...userData,
      message: 'Wallet authenticated successfully'
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error during authentication'
    });
  }
} 