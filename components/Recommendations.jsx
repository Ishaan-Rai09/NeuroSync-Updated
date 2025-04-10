import React from 'react';
import Link from 'next/link';

/**
 * Recommendations component that displays personalized suggestions
 * based on emotional analysis
 */
const Recommendations = ({ recommendations, emotionalState }) => {
  // If no recommendations are available
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  const getEmotionColor = (emotion) => {
    const emotionColors = {
      'anxious': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
      'sad': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
      'stressed': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
      'happy': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
      'neutral': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
    };
    
    return emotionColors[emotion.toLowerCase()] || emotionColors.neutral;
  };

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-3">
        <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          Personalized Recommendations
        </h3>
        {emotionalState && (
          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEmotionColor(emotionalState)}`}>
            {emotionalState}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {recommendations.map((recommendation, index) => (
          <div key={index} className="flex items-start p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
            <div className="flex-shrink-0 text-primary">
              {recommendation.type === 'exercise' && (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {recommendation.type === 'resource' && (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              )}
              {recommendation.type === 'checkin' && (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                {recommendation.title}
              </h4>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {recommendation.description}
              </p>
              {recommendation.actionUrl && (
                <Link 
                  href={recommendation.actionUrl} 
                  className="mt-2 inline-flex items-center text-xs font-medium text-primary hover:text-indigo-700"
                >
                  {recommendation.actionText || 'Learn more'}
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <Link 
          href="/resources" 
          className="inline-flex items-center text-xs font-medium text-primary hover:text-indigo-700"
        >
          View all resources
          <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default Recommendations; 