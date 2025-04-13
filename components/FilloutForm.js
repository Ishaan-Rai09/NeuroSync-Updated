import React, { useEffect } from 'react';

const FilloutForm = ({ onClose }) => {
  useEffect(() => {
    // Load Fillout script
    const script = document.createElement('script');
    script.src = 'https://server.fillout.com/embed/v1/';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000}}>
      <div 
        data-fillout-id="9CeuCuxPLuus" 
        data-fillout-embed-type="fullscreen" 
        style={{width: '100%', height: '100%'}} 
        data-fillout-inherit-parameters
      />
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white text-gray-600 hover:bg-gray-100 shadow-lg"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default FilloutForm; 