const express = require('express');
const router = express.Router();
const ethers = require('ethers');
const { 
  rewardUserForAction, 
  getUserTokenBalance, 
  redeemTokensForService,
  verifyTherapist,
  checkTherapistVerification,
  storeUserDataReference,
  getUserDataReferences
} = require('../web3/services/smartContracts');
const uploadToIPFS = require('../storage/uploadToIPFS');

// Middleware to check if wallet is connected
const requireWalletAuth = (req, res, next) => {
  if (!req.body.walletAddress) {
    return res.status(401).json({ 
      success: false, 
      error: 'Wallet address is required' 
    });
  }
  
  // Verify wallet ownership with signature if needed for higher security
  // This is a simplified version, in production you'd validate signatures
  
  next();
};

/**
 * @route POST /api/blockchain/authenticate
 * @desc Authenticate a user's wallet
 * @access Public
 */
router.post('/authenticate', async (req, res) => {
  try {
    const { walletAddress, signature, message } = req.body;
    
    if (!walletAddress || !signature || !message) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address, signature, and message are required'
      });
    }
    
    // Verify the signature
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({
        success: false,
        error: 'Invalid signature'
      });
    }
    
    // At this point, the user has proven ownership of the wallet
    // Here you would:
    // 1. Check if the wallet is already in your database
    // 2. Create a new user if needed
    // 3. Generate a session token or JWT
    
    // For this example, we'll just return success
    return res.status(200).json({
      success: true,
      walletAddress,
      // Include any JWT token or session info here
      message: 'Wallet authenticated successfully'
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error during authentication'
    });
  }
});

/**
 * @route GET /api/blockchain/token-balance
 * @desc Get a user's token balance
 * @access Private (requires wallet)
 */
router.get('/token-balance', requireWalletAuth, async (req, res) => {
  try {
    const { walletAddress } = req.query;
    
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required'
      });
    }
    
    const balanceResponse = await getUserTokenBalance(walletAddress);
    
    if (!balanceResponse.success) {
      return res.status(400).json(balanceResponse);
    }
    
    return res.status(200).json(balanceResponse);
  } catch (error) {
    console.error('Error getting token balance:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while fetching token balance'
    });
  }
});

/**
 * @route POST /api/blockchain/reward
 * @desc Reward a user for completing an action
 * @access Private (admin only)
 */
router.post('/reward', async (req, res) => {
  try {
    // In production, add admin-only middleware
    const { walletAddress, actionType } = req.body;
    
    if (!walletAddress || !actionType) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address and action type are required'
      });
    }
    
    const rewardResponse = await rewardUserForAction(walletAddress, actionType);
    
    if (!rewardResponse.success) {
      return res.status(400).json(rewardResponse);
    }
    
    return res.status(200).json({
      ...rewardResponse,
      message: `User rewarded for ${actionType}`
    });
  } catch (error) {
    console.error('Error rewarding user:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while rewarding user'
    });
  }
});

/**
 * @route POST /api/blockchain/redeem
 * @desc Redeem tokens for a service
 * @access Private (requires wallet)
 */
router.post('/redeem', requireWalletAuth, async (req, res) => {
  try {
    const { walletAddress, serviceName, amount } = req.body;
    
    if (!walletAddress || !serviceName || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address, service name, and amount are required'
      });
    }
    
    // Check balance before redeeming
    const balanceResponse = await getUserTokenBalance(walletAddress);
    
    if (!balanceResponse.success) {
      return res.status(400).json(balanceResponse);
    }
    
    if (parseFloat(balanceResponse.balance) < parseFloat(amount)) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient token balance'
      });
    }
    
    const redeemResponse = await redeemTokensForService(walletAddress, serviceName, amount);
    
    if (!redeemResponse.success) {
      return res.status(400).json(redeemResponse);
    }
    
    return res.status(200).json({
      ...redeemResponse,
      message: `Successfully redeemed ${amount} tokens for ${serviceName}`
    });
  } catch (error) {
    console.error('Error redeeming tokens:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while redeeming tokens'
    });
  }
});

/**
 * @route POST /api/blockchain/store-data
 * @desc Store data reference on blockchain
 * @access Private (requires wallet)
 */
router.post('/store-data', requireWalletAuth, async (req, res) => {
  try {
    const { walletAddress, data, dataType, encrypt } = req.body;
    
    if (!walletAddress || !data || !dataType) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address, data, and data type are required'
      });
    }
    
    // First upload to IPFS
    const isEncrypted = encrypt !== false; // Default to true
    const jsonData = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Upload to IPFS (uses the function from ../storage/uploadToIPFS.js)
    const ipfsResponse = await uploadToIPFS(jsonData, isEncrypted, walletAddress);
    
    if (!ipfsResponse.success) {
      return res.status(400).json(ipfsResponse);
    }
    
    // Store reference on blockchain
    const storeResponse = await storeUserDataReference(
      walletAddress,
      ipfsResponse.cid,
      dataType,
      isEncrypted
    );
    
    if (!storeResponse.success) {
      return res.status(400).json(storeResponse);
    }
    
    return res.status(200).json({
      success: true,
      cid: ipfsResponse.cid,
      transactionHash: storeResponse.transactionHash,
      message: `Data stored successfully on IPFS and referenced on blockchain`
    });
  } catch (error) {
    console.error('Error storing data:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while storing data'
    });
  }
});

/**
 * @route GET /api/blockchain/user-data
 * @desc Get user data references
 * @access Private (requires wallet)
 */
router.get('/user-data', requireWalletAuth, async (req, res) => {
  try {
    const { walletAddress, requestorAddress } = req.query;
    
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required'
      });
    }
    
    // If requestor is different from wallet owner, verify access permission
    const effectiveRequestor = requestorAddress || walletAddress;
    
    const dataResponse = await getUserDataReferences(walletAddress, effectiveRequestor);
    
    if (!dataResponse.success) {
      return res.status(400).json(dataResponse);
    }
    
    return res.status(200).json(dataResponse);
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while retrieving user data'
    });
  }
});

/**
 * @route POST /api/blockchain/verify-therapist
 * @desc Verify a therapist's credentials with SBT
 * @access Private (admin only)
 */
router.post('/verify-therapist', async (req, res) => {
  try {
    // In production, add admin-only middleware
    const { 
      walletAddress, 
      licenseNumber, 
      licenseType, 
      jurisdiction, 
      expirationDate,
      additionalInfo 
    } = req.body;
    
    if (!walletAddress || !licenseNumber || !licenseType || !jurisdiction || !expirationDate) {
      return res.status(400).json({
        success: false,
        error: 'All therapist credential fields are required'
      });
    }
    
    // Create license info object
    const licenseInfo = {
      licenseNumber,
      licenseType,
      jurisdiction
    };
    
    // Generate or build token URI (would normally point to IPFS metadata)
    const tokenURI = `ipfs://QmExampleHash`; // Placeholder
    
    // Verify therapist
    const verifyResponse = await verifyTherapist(
      walletAddress,
      licenseInfo,
      new Date(expirationDate),
      tokenURI
    );
    
    if (!verifyResponse.success) {
      return res.status(400).json(verifyResponse);
    }
    
    return res.status(200).json({
      ...verifyResponse,
      message: 'Therapist verified successfully'
    });
  } catch (error) {
    console.error('Error verifying therapist:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while verifying therapist'
    });
  }
});

/**
 * @route GET /api/blockchain/check-therapist
 * @desc Check if a therapist is verified
 * @access Public
 */
router.get('/check-therapist', async (req, res) => {
  try {
    const { walletAddress } = req.query;
    
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Therapist wallet address is required'
      });
    }
    
    const verificationResponse = await checkTherapistVerification(walletAddress);
    
    if (!verificationResponse.success) {
      return res.status(400).json(verificationResponse);
    }
    
    return res.status(200).json(verificationResponse);
  } catch (error) {
    console.error('Error checking therapist verification:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while checking therapist verification'
    });
  }
});

module.exports = router; 