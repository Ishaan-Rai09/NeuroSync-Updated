import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

/**
 * Custom hook for wallet-based authentication
 * Handles connecting to MetaMask, signing messages, and session management
 */
const useWalletAuth = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [userData, setUserData] = useState(null);

  // Check if user has already connected their wallet
  useEffect(() => {
    const checkConnection = async () => {
      // Check if browser has ethereum object
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Setup ethers provider
          const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(ethersProvider);

          // Check if already connected
          const accounts = await ethersProvider.listAccounts();
          if (accounts.length > 0) {
            const network = await ethersProvider.getNetwork();
            
            setWalletAddress(accounts[0]);
            setChainId(network.chainId);
            setIsConnected(true);
            
            // Check if we have stored session data
            const storedUser = localStorage.getItem('wallet_user_data');
            if (storedUser) {
              setUserData(JSON.parse(storedUser));
            }
          }
        } catch (err) {
          console.error('Error checking wallet connection:', err);
          setError('Failed to connect to wallet');
        }
      }
    };

    checkConnection();
  }, []);

  // Handle account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // User disconnected
          setIsConnected(false);
          setWalletAddress(null);
          localStorage.removeItem('wallet_user_data');
          setUserData(null);
        } else if (accounts[0] !== walletAddress) {
          // Account changed
          setWalletAddress(accounts[0]);
          localStorage.removeItem('wallet_user_data');
          setUserData(null);
        }
      };

      const handleChainChanged = (chainIdHex) => {
        const newChainId = parseInt(chainIdHex, 16);
        setChainId(newChainId);
      };

      // Subscribe to events
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Cleanup
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [walletAddress]);

  /**
   * Connect to MetaMask wallet
   */
  const connectWallet = async () => {
    setError(null);
    
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed. Please install MetaMask to use this feature.');
      return;
    }

    try {
      setIsAuthenticating(true);
      
      // Request account access
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await ethersProvider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask and try again.');
      }
      
      const network = await ethersProvider.getNetwork();
      
      setProvider(ethersProvider);
      setWalletAddress(accounts[0]);
      setChainId(network.chainId);
      setIsConnected(true);
      
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsAuthenticating(false);
    }
  };

  /**
   * Sign a message to verify wallet ownership
   */
  const authenticate = async () => {
    if (!isConnected || !provider || !walletAddress) {
      await connectWallet();
    }
    
    if (!provider || !walletAddress) {
      setError('Wallet connection failed');
      return null;
    }

    try {
      setIsAuthenticating(true);
      
      // Generate a nonce for security
      const nonce = Math.floor(Math.random() * 1000000).toString();
      
      // Create a message to sign
      const message = `Sign this message to authenticate with NeuroSync: ${nonce}`;
      
      // Request signature from user
      const signer = provider.getSigner();
      let signature;
      try {
        signature = await signer.signMessage(message);
      } catch (signError) {
        console.error('Error signing message:', signError);
        throw new Error('User rejected signature request');
      }
      
      // Ensure we have all required parameters
      if (!walletAddress || !signature || !message) {
        throw new Error('Wallet address, signature, and message are required');
      }
      
      // Verify on the server
      const response = await fetch('/api/blockchain/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          message,
          signature,
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Authentication failed');
      }
      
      // Save user data
      setUserData(data);
      localStorage.setItem('wallet_user_data', JSON.stringify(data));
      
      return data;
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || 'Failed to authenticate');
      return null;
    } finally {
      setIsAuthenticating(false);
    }
  };
  
  /**
   * Disconnect wallet
   */
  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress(null);
    setChainId(null);
    setUserData(null);
    localStorage.removeItem('wallet_user_data');
  };
  
  /**
   * Check if connected to the right network
   * @param {number} expectedChainId - The expected chain ID
   * @returns {boolean} - Whether connected to the right network
   */
  const isCorrectNetwork = (expectedChainId) => {
    return chainId === expectedChainId;
  };
  
  /**
   * Switch network
   * @param {number} targetChainId - The chain ID to switch to
   */
  const switchNetwork = async (targetChainId) => {
    if (!provider) {
      await connectWallet();
    }
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
      
      // Network will update via event listener
    } catch (err) {
      console.error('Error switching network:', err);
      setError(err.message || 'Failed to switch network');
    }
  };

  return {
    isConnected,
    isAuthenticating,
    error,
    walletAddress,
    chainId,
    provider,
    userData,
    connectWallet,
    authenticate,
    disconnectWallet,
    isCorrectNetwork,
    switchNetwork,
  };
};

export default useWalletAuth; 