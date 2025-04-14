import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../../components/Layout';

const articles = [
  {
    id: 'basics',
    title: 'Mental Wellness Basics',
    description: 'Explore fundamental concepts of mental wellbeing.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&q=80&w=600',
    url: '/resources/articles/basics',
    publishDate: 'Jan 15, 2023',
    readTime: '6 min'
  },
  {
    id: 'anxiety',
    title: 'Managing Anxiety',
    description: 'Practical strategies for managing anxiety in daily life.',
    image: 'https://images.unsplash.com/photo-1482235225574-c37692835cf3?auto=format&q=80&w=600',
    url: '/resources/articles/anxiety',
    publishDate: 'Feb 8, 2023',
    readTime: '8 min'
  },
  {
    id: 'mindfulness',
    title: 'Introduction to Mindfulness',
    description: 'Learn the basics of mindfulness and how it can improve your mental health.',
    image: 'https://images.unsplash.com/photo-1506126944674-00c6c192e0a3?auto=format&q=80&w=600',
    url: '/resources/articles/mindfulness',
    publishDate: 'Mar 22, 2023',
    readTime: '7 min'
  },
  {
    id: 'stress',
    title: 'Coping with Stress',
    description: 'Effective techniques to manage and reduce stress in your life.',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&q=80&w=600',
    url: '/resources/articles/stress',
    publishDate: 'Apr 11, 2023',
    readTime: '9 min'
  },
  {
    id: 'sleep',
    title: 'Improving Sleep Quality',
    description: 'How better sleep can dramatically improve your mental health.',
    image: 'https://images.unsplash.com/photo-1455203983296-aea3ee196b7b?auto=format&q=80&w=600',
    url: '/resources/articles/sleep',
    publishDate: 'May 4, 2023',
    readTime: '5 min'
  },
  {
    id: 'selfcare',
    title: 'Self-Care Essentials',
    description: 'Building a sustainable self-care routine for mental wellness.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&q=80&w=600',
    url: '/resources/articles/selfcare',
    publishDate: 'Jun 18, 2023',
    readTime: '6 min'
  }
];

const ArticlesPage = () => {
  return (
    <Layout>
      <Head>
        <title>Articles | NeuroSync Mental Wellness</title>
      </Head>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Mental Wellness Articles
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
            Explore our collection of articles on various aspects of mental wellness. 
            Whether you're looking to understand the basics or dive deeper into specific topics, 
            we have resources to support your journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div key={article.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <Link href={article.url} className="block">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>{article.publishDate}</span>
                    <span className="mx-2">•</span>
                    <span>{article.readTime} read</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {article.description}
                  </p>
                  <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium">
                    Read article
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href="/resources" 
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to all resources
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default ArticlesPage; 