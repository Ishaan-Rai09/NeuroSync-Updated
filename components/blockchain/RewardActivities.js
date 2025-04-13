import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import useWalletAuth from './useWalletAuth';
import { toast } from 'react-hot-toast';
import SpinningWheel from './SpinningWheel';

// Define questions outside the component to ensure they're always available
const QUIZ_QUESTIONS = [
  {
    question: "What is the recommended daily meditation time for beginners?",
    options: ["5 minutes", "20 minutes", "1 hour", "2 hours"],
    correctAnswer: "5 minutes"
  },
  {
    question: "Which breathing technique helps reduce anxiety?",
    options: ["Box Breathing", "Rapid Breathing", "Holding Breath", "Shallow Breathing"],
    correctAnswer: "Box Breathing"
  },
  {
    question: "What is the '5-4-3-2-1' technique used for?",
    options: ["Sleep", "Anxiety", "Focus", "Memory"],
    correctAnswer: "Anxiety"
  },
  {
    question: "How many hours of sleep are recommended for adults?",
    options: ["4-5 hours", "6-7 hours", "7-9 hours", "10-12 hours"],
    correctAnswer: "7-9 hours"
  },
  {
    question: "What is the benefit of practicing gratitude?",
    options: ["Reduces stress", "Improves sleep", "Boosts mood", "All of the above"],
    correctAnswer: "All of the above"
  }
];

const RewardActivities = ({ onRewardEarned }) => {
  const [lastSpinTime, setLastSpinTime] = useState(null);
  const [canSpin, setCanSpin] = useState(true);
  const [quizQuestions, setQuizQuestions] = useState(QUIZ_QUESTIONS);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const { walletAddress } = useWalletAuth();

  useEffect(() => {
    // Check last spin time from localStorage
    const storedLastSpin = localStorage.getItem('lastSpinTime');
    if (storedLastSpin) {
      setLastSpinTime(parseInt(storedLastSpin));
      const timeSinceLastSpin = Date.now() - parseInt(storedLastSpin);
      setCanSpin(timeSinceLastSpin >= 24 * 60 * 60 * 1000);
    }
    
    // Ensure questions are loaded
    if (!quizQuestions || quizQuestions.length === 0) {
      console.log("Loading quiz questions...");
      setQuizQuestions(QUIZ_QUESTIONS);
    }
  }, [quizQuestions]);

  const handleSpinComplete = async (reward) => {
    try {
      // API call to reward tokens
      console.log(`Spinning wheel completed with reward: ${reward} tokens`);
      
      const response = await fetch('/api/blockchain/reward', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          action: 'daily_spin',
          amount: reward
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Reward API error:', errorText);
        throw new Error('Failed to reward tokens');
      }

      const responseData = await response.json();
      if (!responseData.success) {
        throw new Error(responseData.error || 'Failed to process reward');
      }

      // Update last spin time
      const now = Date.now();
      setLastSpinTime(now);
      localStorage.setItem('lastSpinTime', now.toString());
      setCanSpin(false);

      // Store transaction in Pinata
      console.log('Storing spin reward transaction in Pinata');
      
      const transactionData = {
        type: 'REWARD',
        amount: reward,
        description: 'Daily Spin Reward',
        timestamp: new Date().toISOString(),
        walletAddress
      };

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
        toast.error('Reward received, but failed to store on Pinata');
      } else {
        const pinataData = await pinataResponse.json();
        console.log('Transaction stored on Pinata with hash:', pinataData.ipfsHash);
      }

      // Callback to update parent component's balance
      if (onRewardEarned) {
        onRewardEarned(reward);
      }

      toast.success(`Congratulations! You won ${reward} NEURO tokens!`);
    } catch (error) {
      console.error('Failed to process spin reward:', error);
      toast.error(error.message || 'Failed to process reward');
    }
  };

  const handleQuizAnswer = async (selectedAnswer) => {
    if (!quizQuestions || quizQuestions.length === 0 || !quizQuestions[currentQuestion]) {
      console.error("Quiz questions not loaded properly!");
      toast.error("Quiz data not loaded properly. Please try again later.");
      return;
    }
    
    const currentQuestionObj = quizQuestions[currentQuestion];
    const isCorrect = selectedAnswer === currentQuestionObj.correctAnswer;
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setIsQuizComplete(true);
      
      // Calculate reward based on score (updated score including this answer)
      const finalScore = isCorrect ? quizScore + 1 : quizScore;
      const reward = finalScore * 2; // 2 tokens per correct answer
      
      try {
        // API call to reward tokens
        console.log(`Quiz completed with score: ${finalScore}/${quizQuestions.length}, reward: ${reward} tokens`);
        
        const response = await fetch('/api/blockchain/reward', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletAddress,
            action: 'quiz_completion',
            amount: reward
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Reward API error:', errorText);
          throw new Error('Failed to reward tokens');
        }

        const responseData = await response.json();
        if (!responseData.success) {
          throw new Error(responseData.error || 'Failed to process reward');
        }

        // Store transaction in Pinata
        console.log('Storing quiz reward transaction in Pinata');
        
        const transactionData = {
          type: 'REWARD',
          amount: reward,
          description: 'Quiz Completion Reward',
          timestamp: new Date().toISOString(),
          walletAddress,
          score: finalScore
        };

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
          toast.error('Reward received, but failed to store on Pinata');
        } else {
          const pinataData = await pinataResponse.json();
          console.log('Transaction stored on Pinata with hash:', pinataData.ipfsHash);
        }

        // Callback to update parent component's balance
        if (onRewardEarned) {
          onRewardEarned(reward);
        }

        toast.success(`Quiz complete! You earned ${reward} NEURO tokens!`);
      } catch (error) {
        console.error('Failed to process quiz reward:', error);
        toast.error(error.message || 'Failed to process quiz reward');
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setQuizScore(0);
    setIsQuizComplete(false);
  };

  // Ensure we have questions loaded
  if (!quizQuestions || quizQuestions.length === 0) {
    console.log("No quiz questions available, using default set");
    // If quizQuestions is empty, use the QUIZ_QUESTIONS directly
    return (
      <div className="space-y-8">
        {/* Daily Spin Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Daily Spin</h3>
          <p className="text-gray-600 mb-4">
            Spin the wheel once every 24 hours to win NEURO tokens!
          </p>
          {canSpin ? (
            <SpinningWheel onSpinComplete={handleSpinComplete} />
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-4">Come back in 24 hours to spin again!</p>
              <div className="w-64 h-64 mx-auto rounded-full border-8 border-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Next spin available in {Math.floor((24 * 60 * 60 * 1000 - (Date.now() - lastSpinTime)) / (60 * 60 * 1000))} hours</span>
              </div>
            </div>
          )}
        </div>

        {/* Quiz Section - Loading Version */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Mental Wellness Quiz</h3>
          <p className="text-gray-600 mb-4">
            Answer 5 questions about mental wellness to earn NEURO tokens!
          </p>
          <div className="text-center p-6">
            <p>Loading quiz questions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Daily Spin Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Daily Spin</h3>
        <p className="text-gray-600 mb-4">
          Spin the wheel once every 24 hours to win NEURO tokens!
        </p>
        {canSpin ? (
          <SpinningWheel onSpinComplete={handleSpinComplete} />
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">Come back in 24 hours to spin again!</p>
            <div className="w-64 h-64 mx-auto rounded-full border-8 border-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Next spin available in {Math.floor((24 * 60 * 60 * 1000 - (Date.now() - lastSpinTime)) / (60 * 60 * 1000))} hours</span>
            </div>
          </div>
        )}
      </div>

      {/* Quiz Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Mental Wellness Quiz</h3>
        {!isQuizComplete ? (
          <div>
            <p className="text-gray-600 mb-4">
              Answer 5 questions about mental wellness to earn NEURO tokens!
            </p>
            <div className="mb-4">
              <p className="font-medium text-gray-800">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </p>
              <p className="text-lg text-gray-900 mt-2">
                {quizQuestions[currentQuestion]?.question || "Loading question..."}
              </p>
            </div>
            <div className="space-y-2">
              {quizQuestions[currentQuestion]?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleQuizAnswer(option)}
                  className="w-full text-left py-3 px-4 rounded-lg border border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg text-gray-800 mb-4">
              Quiz Complete! You scored {quizScore} out of {quizQuestions.length}!
            </p>
            <button
              onClick={resetQuiz}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardActivities; 