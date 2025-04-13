const { ethers } = require('ethers');
const NeuroSyncTokenABI = require('../abis/NeuroSyncToken.json');
const TherapistVerificationABI = require('../abis/TherapistVerification.json');
const UserDataABI = require('../abis/UserData.json');

// Contract addresses - these would be set after deployment
const CONTRACT_ADDRESSES = {
  NeuroSyncToken: process.env.TOKEN_CONTRACT_ADDRESS,
  TherapistVerification: process.env.THERAPIST_CONTRACT_ADDRESS,
  UserData: process.env.USER_DATA_CONTRACT_ADDRESS
};

// Provider setup (e.g., Infura, Alchemy, or your own node)
const getProvider = () => {
  // Use environment variables for the RPC URL
  const rpcUrl = process.env.BLOCKCHAIN_RPC_URL;
  return new ethers.providers.JsonRpcProvider(rpcUrl);
};

// Get a signer for transactions that modify state
const getSigner = () => {
  const provider = getProvider();
  // Platform wallet private key (keep secure and use environment variables)
  const privateKey = process.env.PLATFORM_WALLET_PRIVATE_KEY;
  return new ethers.Wallet(privateKey, provider);
};

// Contract instances
const getNeuroSyncTokenContract = (signer = null) => {
  const provider = getProvider();
  const contractAddress = CONTRACT_ADDRESSES.NeuroSyncToken;
  
  if (!contractAddress) {
    throw new Error('NeuroSync Token contract address not configured');
  }
  
  const connection = signer || provider;
  return new ethers.Contract(contractAddress, NeuroSyncTokenABI, connection);
};

const getTherapistVerificationContract = (signer = null) => {
  const provider = getProvider();
  const contractAddress = CONTRACT_ADDRESSES.TherapistVerification;
  
  if (!contractAddress) {
    throw new Error('Therapist Verification contract address not configured');
  }
  
  const connection = signer || provider;
  return new ethers.Contract(contractAddress, TherapistVerificationABI, connection);
};

const getUserDataContract = (signer = null) => {
  const provider = getProvider();
  const contractAddress = CONTRACT_ADDRESSES.UserData;
  
  if (!contractAddress) {
    throw new Error('User Data contract address not configured');
  }
  
  const connection = signer || provider;
  return new ethers.Contract(contractAddress, UserDataABI, connection);
};

// Token Functions
const rewardUserForAction = async (userAddress, actionType) => {
  try {
    const signer = getSigner();
    const tokenContract = getNeuroSyncTokenContract(signer);
    
    const tx = await tokenContract.rewardUser(userAddress, actionType);
    const receipt = await tx.wait();
    
    return {
      success: true,
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Error rewarding user:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const getUserTokenBalance = async (userAddress) => {
  try {
    const tokenContract = getNeuroSyncTokenContract();
    const balance = await tokenContract.balanceOf(userAddress);
    
    return {
      success: true,
      balance: ethers.utils.formatUnits(balance, 18), // Assumes 18 decimals
      rawBalance: balance.toString()
    };
  } catch (error) {
    console.error('Error getting token balance:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const redeemTokensForService = async (userAddress, serviceName, amount) => {
  try {
    const signer = getSigner();
    const tokenContract = getNeuroSyncTokenContract(signer);
    
    // Convert amount to wei (assuming 18 decimals)
    const tokenAmount = ethers.utils.parseUnits(amount.toString(), 18);
    
    const tx = await tokenContract.redeemTokens(userAddress, serviceName, tokenAmount);
    const receipt = await tx.wait();
    
    return {
      success: true,
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Error redeeming tokens:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Therapist Verification Functions
const verifyTherapist = async (therapistAddress, licenseInfo, expirationDate, tokenURI) => {
  try {
    const signer = getSigner();
    const verificationContract = getTherapistVerificationContract(signer);
    
    const tx = await verificationContract.verifyTherapist(
      therapistAddress,
      licenseInfo.licenseNumber,
      licenseInfo.licenseType,
      licenseInfo.jurisdiction,
      Math.floor(expirationDate.getTime() / 1000), // Convert to Unix timestamp
      tokenURI
    );
    
    const receipt = await tx.wait();
    
    return {
      success: true,
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Error verifying therapist:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const checkTherapistVerification = async (therapistAddress) => {
  try {
    const verificationContract = getTherapistVerificationContract();
    const isVerified = await verificationContract.isVerifiedTherapist(therapistAddress);
    
    // If verified, get more details
    let credentials = null;
    if (isVerified) {
      try {
        credentials = await verificationContract.getTherapistCredential(therapistAddress);
      } catch (e) {
        // Handle case where credentials might exist but are not accessible
      }
    }
    
    return {
      success: true,
      isVerified,
      credentials
    };
  } catch (error) {
    console.error('Error checking therapist verification:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// User Data Functions
const storeUserDataReference = async (userAddress, ipfsCid, dataType, isEncrypted = true) => {
  try {
    const signer = getSigner();
    const userDataContract = getUserDataContract(signer);
    
    const tx = await userDataContract.storeData(
      userAddress,
      ipfsCid,
      isEncrypted,
      dataType
    );
    
    const receipt = await tx.wait();
    
    return {
      success: true,
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Error storing user data reference:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const getUserDataReferences = async (userAddress, requestorAddress) => {
  try {
    // Use the requestor's address to retrieve data, enforcing access control
    const provider = getProvider();
    // If we're using the platform's wallet to request data, use a signer
    const connection = requestorAddress === process.env.PLATFORM_WALLET_ADDRESS ? 
      getSigner() : 
      new ethers.Wallet(requestorAddress, provider);
    
    const userDataContract = getUserDataContract(connection);
    const dataEntries = await userDataContract.getAllData(userAddress);
    
    return {
      success: true,
      dataEntries: dataEntries.map(entry => ({
        cid: entry.cid,
        isEncrypted: entry.isEncrypted,
        timestamp: new Date(entry.timestamp.toNumber() * 1000), // Convert to JS Date
        dataType: entry.dataType
      }))
    };
  } catch (error) {
    console.error('Error retrieving user data references:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const grantAccessToTherapist = async (userAddress, therapistAddress, expirationDate = null) => {
  try {
    // This should be called by the user's wallet, but here we'll simulate it
    // In a real scenario, this would be a frontend operation using the user's wallet
    const signer = getSigner(); // Normally would be user's wallet
    const userDataContract = getUserDataContract(signer);
    
    const expiration = expirationDate ? 
      Math.floor(expirationDate.getTime() / 1000) : // Convert to Unix timestamp
      0; // 0 means indefinite access
    
    const tx = await userDataContract.grantAccess(therapistAddress, expiration);
    const receipt = await tx.wait();
    
    return {
      success: true,
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Error granting access to therapist:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  // Token functions
  rewardUserForAction,
  getUserTokenBalance,
  redeemTokensForService,
  
  // Therapist verification functions
  verifyTherapist,
  checkTherapistVerification,
  
  // User data functions
  storeUserDataReference,
  getUserDataReferences,
  grantAccessToTherapist,
  
  // Contract instances (for advanced use)
  getNeuroSyncTokenContract,
  getTherapistVerificationContract,
  getUserDataContract
}; 