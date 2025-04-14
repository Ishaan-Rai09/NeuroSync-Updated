import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import useWalletAuth from './useWalletAuth';
import { toast } from 'react-hot-toast';
import RewardActivities from './RewardActivities';
import PurchaseReceipt from './PurchaseReceipt';

// Set the default balance to 100 NEURO tokens for new users
const DEFAULT_INITIAL_BALANCE = '100';

const TokenStats = () => {
  const [tokenBalance, setTokenBalance] = useState(DEFAULT_INITIAL_BALANCE); // Default to 100 NEURO coins
  const [tokenSymbol, setTokenSymbol] = useState('NEURO');
  const [tokenHistory, setTokenHistory] = useState([]);
  const [redeemOptions, setRedeemOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRedeemOption, setSelectedRedeemOption] = useState(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  
  // Get wallet auth data
  const { 
    isConnected, 
    walletAddress, 
    connectWallet 
  } = useWalletAuth();
  
  // Reset data when wallet address changes
  useEffect(() => {
    if (walletAddress) {
      // Clear previous account data when switching wallets
      setTokenBalance(DEFAULT_INITIAL_BALANCE);
      setTokenHistory([]);
      setError(null);
    }
  }, [walletAddress]);
  
  // Merchandise options
  const merchandiseOptions = [
    { 
      id: 'tshirt', 
      name: 'NeuroSync T-Shirt', 
      description: 'Comfortable cotton t-shirt with NeuroSync logo',
      cost: 100,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    { 
      id: 'water_bottle', 
      name: 'NeuroSync Water Bottle', 
      description: 'Stainless steel water bottle with NeuroSync branding',
      cost: 75,
      imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    { 
      id: 'key_ring', 
      name: 'NeuroSync Key Ring', 
      description: 'Durable key ring with NeuroSync logo',
      cost: 50,
      imageUrl: 'https://images.unsplash.com/photo-1541421912826-96bb0979c6c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    }
  ];
  
  // Handle reward earned callback from RewardActivities
  const handleRewardEarned = async (amount) => {
    // Update token balance
    const newBalance = (parseFloat(tokenBalance) + amount).toString();
    setTokenBalance(newBalance);

    // Add to local transaction history
    const newTransaction = {
      type: 'REWARD',
      amount: amount.toString(),
      description: 'Activity Reward',
      timestamp: new Date().toISOString(),
      txHash: 'pending' // Could be updated with actual hash later
    };

    setTokenHistory(prev => [newTransaction, ...prev]);
  };
  
  // Fetch token balance and history
  useEffect(() => {
    // Initialize merchandise options immediately to prevent UI issues
    setRedeemOptions(merchandiseOptions);
    
    const fetchTokenBalance = async () => {
      if (!isConnected || !walletAddress) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // API call to get token balance and transaction history
        const response = await fetch(`/api/pinata/history?walletAddress=${walletAddress}`);
        
        // If response is 404, it might be a new user
        if (response.status === 404) {
          const errorData = await response.json();
          
          // Check if this is a new user error
          if (errorData.isNewUser) {
            console.log('New user detected, creating initial balance');
            await createInitialBalanceForNewUser();
            return;
          }
          
          // Otherwise, it's a different 404 error
          throw new Error(errorData.error || 'Failed to fetch transaction history');
        }
        
        // For other non-OK responses, throw an error
        if (!response.ok) {
          console.error('Failed to fetch history:', await response.text());
          throw new Error('Failed to fetch transaction history');
        }
        
        const historyData = await response.json();
        
        if (!historyData.success) {
          console.error('History API returned error:', historyData.error);
          throw new Error(historyData.error || 'Failed to fetch transaction history');
        }
        
        // Check if user has any transactions
        const hasTransactions = historyData.transactions && 
                               Array.isArray(historyData.transactions) && 
                               historyData.transactions.length > 0;
        
        if (hasTransactions) {
          // User has transaction history, calculate balance from transactions
          setTokenHistory(historyData.transactions);
          
          // Calculate accurate balance from all transactions
          let calculatedBalance = 0;
          historyData.transactions.forEach(tx => {
            calculatedBalance += parseFloat(tx.amount || '0');
          });
          
          // Set the calculated balance
          setTokenBalance(calculatedBalance.toString());
        } else {
          // No transactions found for this wallet - create initial balance
          await createInitialBalanceForNewUser();
        }
        
      } catch (err) {
        console.error('Error fetching token data:', err);
        setError(err.message || 'Failed to load token data');
        
        // Ensure redeem options are set even if we hit an error
        setRedeemOptions(merchandiseOptions);
        
        // If we failed to load transaction history, at least show the initial balance
        if (tokenHistory.length === 0) {
          setTokenBalance(DEFAULT_INITIAL_BALANCE);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    // Helper function to create initial balance for new users
    const createInitialBalanceForNewUser = async () => {
      try {
        // This is a new user with no transaction history
        console.log('Creating initial balance for new user:', walletAddress);
        setTokenBalance(DEFAULT_INITIAL_BALANCE);
        
        // Always set redeem options for new users
        setRedeemOptions(merchandiseOptions);
        
        // Record the initial balance to Pinata
        const initialBalanceData = {
          type: 'INITIAL',
          amount: DEFAULT_INITIAL_BALANCE,
          description: 'Welcome Bonus',
          timestamp: new Date().toISOString(),
          walletAddress: walletAddress.toLowerCase() // Ensure wallet address is included and normalized
        };
        
        console.log('Recording initial balance:', initialBalanceData);
        
        const storeResponse = await fetch('/api/pinata/store', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(initialBalanceData),
        });
        
        if (storeResponse.ok) {
          const storeData = await storeResponse.json();
          console.log('Initial balance recorded on Pinata:', storeData);
          
          // Add initial welcome bonus transaction to history
          const initialTransaction = {
            id: `initial-${walletAddress.toLowerCase()}`,
            type: 'INITIAL',
            amount: DEFAULT_INITIAL_BALANCE,
            description: 'Welcome Bonus',
            timestamp: new Date().toISOString(),
            walletAddress: walletAddress.toLowerCase()
          };
          setTokenHistory([initialTransaction]);
          
          toast.success('Welcome! You received 100 NEURO tokens as a welcome bonus.');
        } else {
          const errorText = await storeResponse.text();
          console.error('Failed to record initial balance on Pinata:', errorText);
          // Continue even if Pinata storage fails - the UI will still show the initial balance
          
          // Add initial welcome bonus transaction to history even if Pinata fails
          const initialTransaction = {
            id: `initial-${walletAddress.toLowerCase()}`,
            type: 'INITIAL',
            amount: DEFAULT_INITIAL_BALANCE,
            description: 'Welcome Bonus',
            timestamp: new Date().toISOString(),
            walletAddress: walletAddress.toLowerCase()
          };
          setTokenHistory([initialTransaction]);
          
          toast.success('Welcome! You received 100 NEURO tokens as a welcome bonus.');
          toast.error('However, there was an issue saving your transaction. Please try refreshing the page.');
        }
      } catch (err) {
        console.error('Failed to record initial balance:', err);
        // Set the token balance anyway so the user can see it
        setTokenBalance(DEFAULT_INITIAL_BALANCE);
        
        // Create a local record even if the API failed
        const initialTransaction = {
          id: `initial-${walletAddress.toLowerCase()}`,
          type: 'INITIAL',
          amount: DEFAULT_INITIAL_BALANCE,
          description: 'Welcome Bonus (Local Only)',
          timestamp: new Date().toISOString(),
          walletAddress: walletAddress.toLowerCase()
        };
        setTokenHistory([initialTransaction]);
        
        toast.success('Welcome! You received 100 NEURO tokens as a welcome bonus.');
        toast.error('However, there was an issue saving your transaction. Please try refreshing the page.');
      }
    };
    
    fetchTokenBalance();
  }, [isConnected, walletAddress]);
  
  // Handle redeem selection
  const handleRedeemSelect = (option) => {
    setSelectedRedeemOption(option);
  };
  
  // Handle redemption
  const handleRedeem = async () => {
    if (!selectedRedeemOption) return;
    
    try {
      setIsRedeeming(true);
      setError(null);
      
      // Check if balance is sufficient
      if (parseFloat(tokenBalance) < selectedRedeemOption.cost) {
        throw new Error('Insufficient token balance for this redemption');
      }
      
      console.log('Redeeming tokens for:', selectedRedeemOption.name);
      
      // API call to redeem tokens
      const response = await fetch('/api/blockchain/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          serviceName: selectedRedeemOption.id,
          amount: selectedRedeemOption.cost
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Redeem API error:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || 'Failed to redeem tokens');
        } catch (e) {
          throw new Error('Failed to redeem tokens: ' + errorText);
        }
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to redeem tokens');
      }
      
      // Update token balance
      const updatedBalance = (parseFloat(tokenBalance) - selectedRedeemOption.cost).toString();
      setTokenBalance(updatedBalance);
      
      // Prepare receipt data
      const receipt = {
        item: selectedRedeemOption,
        purchaseDate: new Date().toISOString(),
        walletAddress,
        price: selectedRedeemOption.cost,
        balanceAfter: updatedBalance,
        transactionId: data?.transactionHash || ethers.utils.id(`redeem-${Date.now()}`),
      };
      
      setReceiptData(receipt);
      
      // Store redemption in Pinata
      const transactionData = {
        type: 'REDEEM',
        amount: `-${selectedRedeemOption.cost}`,
        description: `Redeemed for ${selectedRedeemOption.name}`,
        timestamp: new Date().toISOString(),
        walletAddress,
        item: selectedRedeemOption.id,
        receipt: receipt
      };

      console.log('Storing redemption transaction in Pinata');
      
      const pinataResponse = await fetch('/api/pinata/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (!pinataResponse.ok) {
        const errorText = await pinataResponse.text();
        console.error('Pinata API error:', errorText);
        toast.error('Transaction recorded, but failed to store on Pinata');
      } else {
        const pinataData = await pinataResponse.json();
        console.log('Transaction stored on Pinata:', pinataData);
        
        if (pinataData.success && pinataData.ipfsHash) {
          // Update receipt with IPFS hash
          receipt.ipfsHash = pinataData.ipfsHash;
          setReceiptData({...receipt});
          console.log('Receipt data updated with IPFS hash:', receipt);
        } else {
          console.error('Pinata API returned error:', pinataData.error);
          toast.error('Transaction recorded, but failed to store on Pinata');
        }
      }
      
      // Show the receipt modal
      setShowReceipt(true);
      
      // Add to history
      const newTransaction = {
        type: 'REDEEM',
        amount: `-${selectedRedeemOption.cost}`,
        description: `Redeemed for ${selectedRedeemOption.name}`,
        timestamp: new Date().toISOString(),
        txHash: data?.transactionHash || 'pending'
      };
      
      setTokenHistory(prev => [newTransaction, ...prev]);
      
      // Clear selection
      setSelectedRedeemOption(null);
      
      // Show success message
      toast.success(`Successfully redeemed ${selectedRedeemOption.cost} tokens for ${selectedRedeemOption.name}`);
      
    } catch (err) {
      console.error('Error redeeming tokens:', err);
      setError(err.message || 'Failed to redeem tokens');
      toast.error(err.message || 'Failed to redeem tokens');
    } finally {
      setIsRedeeming(false);
    }
  };
  
  // Render connect wallet message if not connected
  if (!isConnected) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">NeuroSync Tokens</h2>
        <p className="text-gray-600 mb-4">Connect your wallet to view your token balance and rewards.</p>
        <button
          onClick={connectWallet}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
        >
          Connect Wallet
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Token Balance Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white text-sm font-medium">Your Balance</p>
            <h3 className="text-white text-3xl font-bold">{isLoading ? '...' : tokenBalance}</h3>
            <p className="text-indigo-100">{tokenSymbol}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p className="text-white/80 text-xs mt-4">Connected: {walletAddress?.substring(0, 6)}...{walletAddress?.substring(38)}</p>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}
      
      {/* Reward Activities */}
      <RewardActivities onRewardEarned={handleRewardEarned} />
      
      {/* Merchandise Redemption */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Redeem Merchandise</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Use your NEURO tokens to get exclusive NeuroSync merchandise!
        </p>
        
        {redeemOptions.length === 0 ? (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <p className="text-yellow-700 dark:text-yellow-300">Loading redemption options...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {redeemOptions.map((option) => (
              <div
                key={option.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedRedeemOption?.id === option.id
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                }`}
                onClick={() => handleRedeemSelect(option)}
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium text-gray-800 dark:text-white">{option.name}</h4>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{option.cost} {tokenSymbol}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{option.description}</p>
                  {option.imageUrl && (
                    <div className="mt-auto">
                      <img 
                        src={option.imageUrl} 
                        alt={option.name} 
                        className="w-full h-24 object-cover rounded" 
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6">
          <button
            onClick={handleRedeem}
            disabled={!selectedRedeemOption || isRedeeming || parseFloat(tokenBalance) < (selectedRedeemOption?.cost || 0)}
            className={`w-full py-3 px-4 rounded-lg font-medium ${
              !selectedRedeemOption || isRedeeming || parseFloat(tokenBalance) < (selectedRedeemOption?.cost || 0)
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isRedeeming 
              ? 'Processing...' 
              : selectedRedeemOption 
                ? `Redeem for ${selectedRedeemOption.cost} ${tokenSymbol}` 
                : 'Select an item'
            }
          </button>
        </div>
      </div>
      
      {/* Transaction History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Transaction History</h3>
        
        {tokenHistory.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                  <th className="py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {tokenHistory.map((tx, index) => (
                  <tr key={index} className="border-b dark:border-gray-700">
                    <td className="py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        tx.type === 'REWARD' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                          : tx.type === 'REDEEM' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                            : tx.type === 'INITIAL'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 whitespace-nowrap">
                      <span className={`font-medium ${
                        parseFloat(tx.amount) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {parseFloat(tx.amount) >= 0 ? '+' : ''}{tx.amount}
                      </span>
                    </td>
                    <td className="py-3 text-gray-800 dark:text-gray-300">{tx.description}</td>
                    <td className="py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Purchase Receipt Modal */}
      {showReceipt && receiptData && (
        <PurchaseReceipt 
          receipt={receiptData} 
          onClose={() => setShowReceipt(false)} 
        />
      )}
    </div>
  );
};

export default TokenStats;