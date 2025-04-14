import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

const resources = [
  {
    id: 'wellness-basics',
    type: 'article',
    title: 'Mental Wellness Basics',
    description: 'Explore fundamental concepts of mental wellbeing.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&q=80&w=600',
    url: '/resources/articles/basics'
  },
  {
    id: 'breathing-exercises',
    type: 'exercise',
    title: 'Breathing Techniques',
    description: 'Simple breathing exercises to reduce stress and anxiety.',
    image: 'https://images.unsplash.com/photo-1506126279646-a697353d3166?auto=format&q=80&w=600',
    url: '/resources/exercises/breathing'
  },
  {
    id: 'meditation-guide',
    type: 'guide',
    title: 'Meditation for Beginners',
    description: 'Learn how to start a meditation practice with this simple guide.',
    image: 'https://images.unsplash.com/photo-1474418397713-2d83362f7888?auto=format&q=80&w=600',
    url: '/resources/guides/meditation'
  },
  {
    id: 'anxiety-management',
    type: 'article',
    title: 'Managing Anxiety',
    description: 'Practical strategies for managing anxiety in daily life.',
    image: 'https://images.unsplash.com/photo-1482235225574-c37692835cf3?auto=format&q=80&w=600',
    url: '/resources/articles/anxiety'
  },
  {
    id: 'sleep-hygiene',
    type: 'guide',
    title: 'Sleep Hygiene',
    description: 'Tips for better sleep and improved mental health.',
    image: 'https://images.unsplash.com/photo-1455203983296-aea3ee196b7b?auto=format&q=80&w=600',
    url: '/resources/guides/sleep'
  },
  {
    id: 'gratitude-practice',
    type: 'exercise',
    title: 'Gratitude Practice',
    description: 'Simple gratitude exercises to improve your outlook and mood.',
    image: 'https://images.unsplash.com/photo-1473492201326-7c01dd2e596b?auto=format&q=80&w=600',
    url: '/resources/exercises/gratitude'
  }
];

const ResourcesPage = () => {
  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'article', label: 'Articles' },
    { id: 'exercise', label: 'Exercises' },
    { id: 'guide', label: 'Guides' }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'article':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        );
      case 'exercise':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'guide':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getTypeColor = (type) => {
    const colorClasses = {
      article: {
        badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        icon: 'text-blue-500 dark:text-blue-400'
      },
      exercise: {
        badge: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        icon: 'text-green-500 dark:text-green-400'
      },
      guide: {
        badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        icon: 'text-purple-500 dark:text-purple-400'
      }
    };

    return colorClasses[type] || {
      badge: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      icon: 'text-gray-500 dark:text-gray-400'
    };
  };

  return (
    <Layout>
      <Head>
        <title>Mental Wellness Resources | NeuroSync</title>
      </Head>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Mental Wellness Resources
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
            Explore our collection of articles, guides, and exercises designed to support your 
            mental wellness journey. Whether you're looking to learn the basics or develop specific 
            skills, we've got resources to help.
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                category.id === 'all' 
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => {
            const typeStyles = getTypeColor(resource.type);
            
            return (
              <Link 
                key={resource.id}
                href={resource.url}
                className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-all z-10"></div>
                  <img 
                    src={resource.image} 
                    alt={resource.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeStyles.badge}`}>
                      {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                    </span>
                  </div>
                  <div className={`absolute right-4 bottom-4 bg-white dark:bg-gray-800 rounded-full p-2 z-20 ${typeStyles.icon}`}>
                    {getTypeIcon(resource.type)}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {resource.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <span className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-800 dark:group-hover:text-indigo-300">
                      View resource
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default ResourcesPage; 