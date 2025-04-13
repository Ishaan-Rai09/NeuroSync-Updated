import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const SpinningWheel = ({ onSpinComplete }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedReward, setSelectedReward] = useState(null);

  const rewards = [
    { value: 1, color: '#FF6B6B' },
    { value: 2, color: '#4ECDC4' },
    { value: 3, color: '#45B7D1' },
    { value: 4, color: '#96CEB4' },
    { value: 5, color: '#FFEEAD' },
    { value: 6, color: '#D4A5A5' },
    { value: 7, color: '#9B59B6' },
    { value: 8, color: '#3498DB' },
    { value: 9, color: '#2ECC71' },
    { value: 10, color: '#F1C40F' }
  ];

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const spinDuration = 5000; // 5 seconds
    const spinRounds = 5; // Number of full rotations
    const startTime = Date.now();
    
    const spin = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      // Easing function for smooth deceleration
      const easeOut = (t) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOut(progress);
      
      // Calculate rotation
      const newRotation = spinRounds * 360 + (easedProgress * 360);
      setRotation(newRotation);
      
      if (progress < 1) {
        requestAnimationFrame(spin);
      } else {
        // Calculate final reward
        const finalRotation = newRotation % 360;
        const rewardIndex = Math.floor((360 - finalRotation) / 36) % rewards.length;
        const reward = rewards[rewardIndex];
        
        setSelectedReward(reward);
        setIsSpinning(false);
        onSpinComplete(reward.value);
      }
    };
    
    spin();
  };

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Wheel */}
      <div 
        className="absolute inset-0 rounded-full border-8 border-gray-200 overflow-hidden transition-transform duration-5000"
        style={{ 
          transform: `rotate(${rotation}deg)`,
          background: `conic-gradient(${rewards.map((reward, i) => 
            `${reward.color} ${i * 36}deg ${(i + 1) * 36}deg`
          ).join(', ')})`
        }}
      >
        {/* Reward values */}
        {rewards.map((reward, i) => (
          <div
            key={i}
            className="absolute w-full h-full"
            style={{
              transform: `rotate(${i * 36 + 18}deg)`,
              textAlign: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            {reward.value}
          </div>
        ))}
      </div>
      
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-16 border-transparent border-b-red-500" />
      
      {/* Spin button */}
      <button
        onClick={spinWheel}
        disabled={isSpinning}
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center ${
          isSpinning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
        }`}
      >
        <span className="text-lg font-bold text-gray-800">SPIN</span>
      </button>
      
      {/* Selected reward display */}
      {selectedReward && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mt-4 text-center">
          <p className="text-xl font-bold text-gray-800">
            You won {selectedReward.value} NEURO tokens!
          </p>
        </div>
      )}
    </div>
  );
};

export default SpinningWheel; 