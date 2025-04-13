import React from 'react';
import Layout from '../components/Layout';
import TokenStats from '../components/blockchain/TokenStats';
import useWalletAuth from '../components/blockchain/useWalletAuth';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const RewardsPage = () => {
  const { isConnected, connectWallet } = useWalletAuth();

  const handleConnectClick = async () => {
    try {
      await connectWallet();
      toast.success('Wallet connected successfully!');
    } catch (error) {
      toast.error('Failed to connect wallet. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section with Animation */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              <span className="block">NeuroSync</span>
              <span className="block text-primary">Rewards</span>
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              Earn tokens through mindfulness activities and redeem exclusive merchandise.
            </p>
          </motion.div>

          {/* Wallet Connection Section */}
          {!isConnected ? (
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="px-6 py-8 sm:p-10 sm:pb-6">
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-medium text-gray-900 dark:text-white">Connect Your Wallet</h3>
                  <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
                    To view your rewards and participate in activities, please connect your wallet.
                  </p>
                </div>
              </div>
              <div className="px-6 pt-6 pb-8 bg-gray-50 dark:bg-gray-900 sm:p-10 sm:pt-6">
                <button
                  onClick={handleConnectClick}
                  className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg transition-all duration-150"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                  </svg>
                  Connect Wallet
                </button>
                <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
                  Powered by MetaMask. Your data remains secure and private.
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {/* Background Patterns */}
              <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute left-0 top-0 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"></div>
                <div className="absolute right-0 bottom-0 w-60 h-60 bg-gradient-to-tl from-indigo-500/20 to-transparent rounded-full translate-x-1/3 translate-y-1/3 blur-xl"></div>
              </div>
              
              {/* TokenStats Integration */}
              <TokenStats />
            </motion.div>
          )}

          {/* Value Proposition Section */}
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Card 1 */}
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="p-6">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Secure Blockchain</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your rewards and progress are securely stored on blockchain, giving you full ownership and control.
                  </p>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <div className="p-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Daily Rewards</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Complete daily activities, spin the wheel, and take quizzes to earn NEURO tokens.
                  </p>
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <div className="p-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Exclusive Merchandise</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Redeem your tokens for exclusive NeuroSync merchandise like t-shirts, bottles, and key rings.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto divide-y divide-gray-200 dark:divide-gray-700">
              <div className="py-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">How do I earn NEURO tokens?</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  You can earn NEURO tokens by completing daily activities like spinning the wheel, completing quizzes, and engaging with the NeuroSync platform.
                </p>
              </div>
              <div className="py-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">How are my tokens stored?</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Your tokens are stored on the blockchain using NFT.storage, providing a secure and permanent record of your rewards that you fully own.
                </p>
              </div>
              <div className="py-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">How do I redeem my tokens?</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Once you've connected your wallet, you can redeem your tokens for merchandise by selecting items from the Rewards page and confirming the transaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RewardsPage; 