import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

const PurchaseReceipt = ({ data, onClose }) => {
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
  
  if (!data) return null;
  
  const formattedDate = new Date(data.purchaseDate).toLocaleString();
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <motion.div 
        className="bg-white rounded-lg shadow-xl max-w-lg w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Receipt Content */}
        <div ref={receiptRef} className="p-6 bg-white rounded-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">NeuroSync</h2>
            <p className="text-gray-500">Purchase Receipt</p>
          </div>
          
          <div className="border-t border-b border-gray-200 py-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-mono text-sm">{data.transactionId.substring(0, 10)}...</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Date:</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Wallet:</span>
              <span className="font-mono text-sm">{`${data.walletAddress.substring(0, 6)}...${data.walletAddress.substring(38)}`}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Item Purchased</h3>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">{data.item.name}</p>
                <p className="text-sm text-gray-600">{data.item.description}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-indigo-600">{data.price} NEURO</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Balance After Transaction:</span>
              <span className="font-semibold">{data.balanceAfter} NEURO</span>
            </div>
          </div>
          
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>This transaction is securely stored on blockchain via NFT.storage</p>
            <p>NeuroSync AI - Mental Wellness Platform</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex border-t border-gray-200">
          <button
            onClick={handleDownload}
            className="flex-1 px-4 py-3 text-indigo-600 font-medium hover:bg-indigo-50 transition-colors rounded-bl-lg"
          >
            Download Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-gray-600 font-medium hover:bg-gray-50 transition-colors rounded-br-lg"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PurchaseReceipt; 