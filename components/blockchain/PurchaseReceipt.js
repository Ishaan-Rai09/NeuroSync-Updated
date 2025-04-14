import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

const PurchaseReceipt = ({ receipt, onClose }) => {
  const receiptRef = useRef(null);
  
  const handleDownload = async () => {
    if (!receiptRef.current) return;
    
    try {
      // Create canvas from the receipt
      const canvas = await html2canvas(receiptRef.current);
      
      // Convert to image data
      const imageData = canvas.toDataURL('image/png');
      
      // Create download link
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `neuroSync-receipt-${new Date().toISOString().split('T')[0]}.png`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download receipt:', error);
    }
  };
  
  if (!receipt) return null;
  
  const formattedDate = new Date(receipt.purchaseDate).toLocaleString();
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-black/70 z-50 p-4">
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Receipt Content */}
        <div ref={receiptRef} className="p-6 bg-white dark:bg-gray-800 rounded-lg">
          <div className="text-center mb-6">
            <div className="h-16 w-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">NeuroSync</h2>
            <p className="text-gray-500 dark:text-gray-400">Purchase Receipt</p>
          </div>
          
          <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-4">
            <div className="flex justify-between mb-3">
              <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
              <span className="font-mono text-sm text-gray-800 dark:text-gray-300">{receipt.transactionId.substring(0, 14)}...</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-600 dark:text-gray-400">Date:</span>
              <span className="text-gray-800 dark:text-gray-300">{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Wallet:</span>
              <span className="font-mono text-sm text-gray-800 dark:text-gray-300">{`${receipt.walletAddress.substring(0, 6)}...${receipt.walletAddress.substring(38)}`}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Item Purchased</h3>
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div>
                <p className="font-medium text-gray-800 dark:text-white">{receipt.item.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{receipt.item.description}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{receipt.price} NEURO</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Balance After Transaction:</span>
              <span className="font-semibold text-gray-800 dark:text-white">{receipt.balanceAfter} NEURO</span>
            </div>
          </div>
          
          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            <p>This transaction is securely stored on IPFS via Pinata</p>
            <p className="mt-1">NeuroSync AI - Mental Wellness Platform</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleDownload}
            className="flex-1 px-4 py-3 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors rounded-bl-lg flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-br-lg"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PurchaseReceipt; 