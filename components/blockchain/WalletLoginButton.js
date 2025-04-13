import React, { useState } from 'react';
import { useRouter } from 'next/router';
import useWalletAuth from './useWalletAuth';

/**
 * MetaMask login button component
 * Shows a visually appealing button to connect with MetaMask
 * and handles authentication flow
 */
const WalletLoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  
  const { 
    connectWallet, 
    authenticate, 
    isConnected,
    isAuthenticating
  } = useWalletAuth();
  
  const handleWalletLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First connect wallet if not connected
      if (!isConnected) {
        await connectWallet();
      }
      
      // Then authenticate
      const authResult = await authenticate();
      
      if (authResult) {
        // Redirect to dashboard after successful login
        router.push('/dashboard');
      } else {
        // If authentication returned null, but no error was thrown
        setError('Authentication failed. Please try again.');
      }
    } catch (err) {
      console.error('Wallet login error:', err);
      setError(err.message || 'Failed to login with wallet');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
          <p>{error}</p>
          
          {error.includes('MetaMask is not installed') && (
            <a 
              href="https://metamask.io/download/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 underline mt-1 block"
            >
              Install MetaMask
            </a>
          )}
        </div>
      )}
      
      <button
        onClick={handleWalletLogin}
        disabled={isLoading || isAuthenticating}
        className="flex items-center justify-center space-x-2 w-full text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-lg px-5 py-3 font-medium transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-5 w-5">
          <path d="M378.7 32H133.3C82.7 32 41 73.7 41 124.3V388c0 50.6 41.7 92.3 92.3 92.3h245.4c50.6 0 92.3-41.7 92.3-92.3V124.3c0-50.6-41.7-92.3-92.3-92.3zm52.3 356c0 28.8-23.5 52.3-52.3 52.3H133.3c-28.8 0-52.3-23.5-52.3-52.3V124.3c0-28.8 23.5-52.3 52.3-52.3h245.4c28.8 0 52.3 23.5 52.3 52.3V388zM336 170.6H176c-11 0-20 9-20 20v130.8c0 11 9 20 20 20h160c11 0 20-9 20-20V190.6c0-11-9-20-20-20zm-20 130.8H196V210.6h120v90.8z" fill="currentColor" />
        </svg>
        <span>{isLoading || isAuthenticating ? 'Connecting...' : 'Continue with MetaMask'}</span>
      </button>
      
      <p className="text-center text-sm text-gray-600 mt-4">
        Privacy-focused login. Your wallet address becomes your decentralized identity.
      </p>
    </div>
  );
};

export default WalletLoginButton; 