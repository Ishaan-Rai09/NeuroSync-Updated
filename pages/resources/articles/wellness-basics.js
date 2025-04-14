import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../../components/Layout';

const WellnessBasicsArticle = () => {
  return (
    <Layout>
      <Head>
        <title>Mental Wellness Basics | NeuroSync</title>
      </Head>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
          {/* Article Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Mental Wellness Basics
            </h1>
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
              <span className="mr-4">Published: Jan 15, 2023</span>
              <span>Reading time: 6 min</span>
            </div>
          </div>
          
          {/* Article Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-6">
              Understanding the fundamentals of mental wellness is essential for building a 
              resilient and balanced life. This guide explores key concepts and practical 
              approaches to maintaining and improving your mental health.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">
              What is Mental Wellness?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Mental wellness is more than just the absence of mental illness. It encompasses 
              a positive state of mental health where individuals can cope with the normal 
              stresses of life, work productively, realize their potential, and contribute 
              to their communities.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">
              Five Pillars of Mental Wellness
            </h2>
            <div className="space-y-6 my-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">
                  1. Emotional Well-being
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Understanding and managing your emotions effectively. This includes recognizing 
                  your feelings, expressing them appropriately, and developing healthy coping 
                  mechanisms for challenging emotions.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">
                  2. Physical Health
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  The mind-body connection is powerful. Regular physical activity, adequate sleep, 
                  and proper nutrition significantly impact mental health. Taking care of your 
                  body supports your mind.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">
                  3. Social Connections
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Maintaining healthy relationships and social support networks. Human connection 
                  is fundamental to mental wellness, providing emotional support, shared experiences, 
                  and a sense of belonging.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">
                  4. Mindfulness & Present Awareness
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Being fully present in the moment without judgment. Mindfulness practices help 
                  reduce stress, enhance focus, and develop a clearer understanding of your thoughts 
                  and feelings.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">
                  5. Purpose & Meaning
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Having a sense of direction and meaning in life. This can come from various sources: 
                  work, relationships, creative pursuits, spiritual practices, or contributing to causes 
                  larger than oneself.
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">
              Daily Practices for Mental Wellness
            </h2>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-6">
              <li>Practice mindfulness meditation for 5-10 minutes daily</li>
              <li>Engage in physical activity that you enjoy</li>
              <li>Maintain a regular sleep schedule</li>
              <li>Connect with friends or family members</li>
              <li>Keep a gratitude journal</li>
              <li>Set boundaries to protect your energy and time</li>
              <li>Take breaks throughout the day to reset and refresh</li>
              <li>Limit exposure to negative news and social media</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">
              When to Seek Professional Support
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              While self-care practices are essential for maintaining mental wellness, sometimes 
              professional support is needed. Consider reaching out to a mental health professional if:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-6">
              <li>Your daily functioning is significantly impaired</li>
              <li>You're experiencing persistent feelings of sadness, anxiety, or hopelessness</li>
              <li>You're using substances to cope with emotions</li>
              <li>You're having thoughts of harming yourself or others</li>
              <li>Your relationships are consistently strained or difficult</li>
              <li>Self-care strategies aren't providing relief</li>
            </ul>
            
            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-lg mt-8 mb-6">
              <h3 className="text-xl font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                Remember:
              </h3>
              <p className="text-indigo-600 dark:text-indigo-400">
                Mental wellness is a journey, not a destination. Small, consistent steps can lead 
                to significant improvements over time. Be patient and compassionate with yourself 
                as you develop and maintain practices that support your mental health.
              </p>
            </div>
          </div>
          
          {/* Article Footer */}
          <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <Link href="/resources/articles" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Articles
                </Link>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-gray-500 dark:text-gray-400">Share:</span>
                <button className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </button>
                <button className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </button>
                <button className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WellnessBasicsArticle; 