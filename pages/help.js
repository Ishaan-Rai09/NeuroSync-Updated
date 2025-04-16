import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

const HelpCenter = () => {
  return (
    <Layout title="Help Center | NeuroSync">
      <div className="bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
              Support Resources
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Help Center
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              Find answers to frequently asked questions and get the support you need.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              
              {/* Getting Started */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Getting Started</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                  Learn how to create an account, set up your profile, and start using NeuroSync.
                </p>
                <div className="mt-4">
                  <ul className="space-y-2">
                    <li className="text-primary hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">
                      <Link href="/help/account-setup">
                        Account Setup Guide
                      </Link>
                    </li>
                    <li className="text-primary hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">
                      <Link href="/help/profile-customization">
                        Profile Customization
                      </Link>
                    </li>
                    <li className="text-primary hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">
                      <Link href="/help/first-session">
                        Your First AI Session
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Features */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Features Guide</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                  Detailed guides on all NeuroSync features and how to use them effectively.
                </p>
                <div className="mt-4">
                  <ul className="space-y-2">
                    <li className="text-primary hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">
                      <Link href="/help/ai-chat">
                        AI Chat Therapy
                      </Link>
                    </li>
                    <li className="text-primary hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">
                      <Link href="/help/emotion-analysis">
                        Emotion Analysis
                      </Link>
                    </li>
                    <li className="text-primary hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">
                      <Link href="/help/crisis-support">
                        Crisis Support System
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Frequently Asked Questions</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                  Find answers to common questions about NeuroSync and its services.
                </p>
                <div className="mt-4">
                  <ul className="space-y-2">
                    <li className="text-primary hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">
                      <Link href="/help/faq-general">
                        General FAQs
                      </Link>
                    </li>
                    <li className="text-primary hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">
                      <Link href="/help/faq-billing">
                        Billing & Subscription
                      </Link>
                    </li>
                    <li className="text-primary hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">
                      <Link href="/help/faq-privacy">
                        Privacy & Security
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Troubleshooting */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Troubleshooting</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                  Solutions for common issues you might encounter while using NeuroSync.
                </p>
                <div className="mt-4">
                  <ul className="space-y-2">
                    <li className="text-primary hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">
                      <Link href="/help/connection-issues">
                        Connection Issues
                      </Link>
                    </li>
                    <li className="text-primary hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">
                      <Link href="/help/account-access">
                        Account Access Problems
                      </Link>
                    </li>
                    <li className="text-primary hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">
                      <Link href="/help/app-performance">
                        App Performance
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact Support */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Contact Support</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                  Can't find what you need? Our support team is ready to help you.
                </p>
                <div className="mt-4">
                  <Link href="/contact" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Contact Us
                  </Link>
                </div>
              </div>

              {/* Resources */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Mental Health Resources</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                  Additional resources for mental health support and education.
                </p>
                <div className="mt-4">
                  <ul className="space-y-2">
                    <li className="text-primary hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">
                      <Link href="/help/resources">
                        External Resources
                      </Link>
                    </li>
                    <li className="text-primary hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">
                      <Link href="/blog">
                        NeuroSync Blog
                      </Link>
                    </li>
                    <li className="text-primary hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">
                      <Link href="/help/crisis-hotlines">
                        Crisis Hotlines
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Help Section */}
          <div className="mt-20">
            <div className="bg-indigo-50 dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Need Quick Help?</h3>
                <p className="mt-2 text-lg text-gray-500 dark:text-gray-300">
                  Try our AI assistant for immediate answers to your questions
                </p>
                <div className="mt-6">
                  <Link 
                    href="/chat"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Chat with NeuroSync AI
                    <svg className="ml-3 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" transform="rotate(90 12 12)" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HelpCenter; 