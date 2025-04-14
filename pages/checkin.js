import React, { useState } from 'react';
import Head from 'next/head';
import { toast } from 'react-hot-toast';
import Layout from '../components/Layout';
import useWalletAuth from '../components/blockchain/useWalletAuth';

const emotions = [
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'calm', label: 'Calm', emoji: '😌' },
  { id: 'excited', label: 'Excited', emoji: '🤩' },
  { id: 'anxious', label: 'Anxious', emoji: '😰' },
  { id: 'sad', label: 'Sad', emoji: '😔' },
  { id: 'stressed', label: 'Stressed', emoji: '😩' },
  { id: 'neutral', label: 'Neutral', emoji: '😐' },
  { id: 'tired', label: 'Tired', emoji: '😴' }
];

const CheckinPage = () => {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isConnected, walletAddress } = useWalletAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedEmotion) {
      toast.error('Please select an emotion');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Here you would typically save this to your backend
      const checkinData = {
        emotion: selectedEmotion,
        notes,
        timestamp: new Date().toISOString(),
        walletAddress: isConnected ? walletAddress : null
      };
      
      console.log('Submitting check-in:', checkinData);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reward the user with NEURO tokens for checking in
      if (isConnected && walletAddress) {
        try {
          const rewardResponse = await fetch('/api/blockchain/reward', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              walletAddress,
              action: 'daily_mood_checkin',
              amount: 5 // Reward 5 NEURO tokens for checking in
            }),
          });
          
          if (rewardResponse.ok) {
            toast.success('You earned 5 NEURO tokens for your check-in!');
          }
        } catch (rewardError) {
          console.error('Failed to reward tokens:', rewardError);
        }
      }
      
      toast.success('Check-in recorded successfully!');
      setSelectedEmotion(null);
      setNotes('');
    } catch (error) {
      console.error('Error submitting check-in:', error);
      toast.error('Failed to record your check-in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Daily Mood Check-in | NeuroSync</title>
      </Head>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Daily Mood Check-in
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Track your emotional patterns over time. Regular check-ins help you understand your 
            mental wellness journey and provide personalized recommendations.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                How are you feeling right now?
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {emotions.map((emotion) => (
                  <button
                    key={emotion.id}
                    type="button"
                    onClick={() => setSelectedEmotion(emotion.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
                      selectedEmotion === emotion.id
                        ? 'bg-indigo-100 dark:bg-indigo-900 border-2 border-indigo-500'
                        : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="text-3xl mb-2">{emotion.emoji}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {emotion.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Any notes about your day? (Optional)
              </h2>
              
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What's on your mind today?"
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                rows={4}
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Check-in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CheckinPage; 