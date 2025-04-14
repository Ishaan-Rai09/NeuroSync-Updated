import React from 'react';
import Link from 'next/link';

const PersonalizedRecommendations = ({ emotionalState = 'neutral' }) => {
  // Function to get appropriate icon based on recommendation type
  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'checkin':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'article':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  // Default recommendations that will always be visible
  const defaultRecommendations = [
    {
      id: 'daily-checkin',
      type: 'checkin',
      title: 'Daily Mood Check-in',
      description: 'Track your emotional patterns over time.',
      actionUrl: '/checkin',
      actionText: 'Check In'
    },
    {
      id: 'wellness-basics',
      type: 'article',
      title: 'Mental Wellness Basics',
      description: 'Explore fundamental concepts of mental wellbeing.',
      actionUrl: '/resources/articles/basics',
      actionText: 'Read Article'
    }
  ];

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg mb-8">
      <div className="flex items-center mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <h2 className="text-lg font-semibold text-white">Personalized Recommendations</h2>
        {emotionalState && (
          <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-700 text-white">
            {emotionalState}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {defaultRecommendations.map((recommendation) => (
          <div key={recommendation.id} className="flex items-start">
            <div className="flex-shrink-0 text-indigo-500 mt-1">
              {getRecommendationIcon(recommendation.type)}
            </div>
            <div className="ml-3">
              <h3 className="text-white font-medium">{recommendation.title}</h3>
              <p className="text-gray-400 text-sm mt-1">
                {recommendation.description}
              </p>
              <Link 
                href={recommendation.actionUrl}
                className="inline-flex items-center mt-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
              >
                {recommendation.actionText}
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-700">
        <Link 
          href="/resources"
          className="inline-flex items-center text-indigo-400 hover:text-indigo-300 text-sm font-medium"
        >
          View all resources
          <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default PersonalizedRecommendations; 