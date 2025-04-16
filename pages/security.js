import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

const Security = () => {
  return (
    <Layout title="Security | NeuroSync">
      <div className="bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          {/* Hero section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Your Security is Our</span>
              <span className="block text-primary">Top Priority</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              At NeuroSync, we understand that your mental health data is extremely sensitive. 
              Learn how we protect your information with industry-leading security measures.
            </p>
          </div>

          {/* Main content */}
          <div className="prose prose-lg dark:prose-dark mx-auto">
            {/* Data Protection Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-8 mb-12">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-md bg-primary text-white">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="ml-6 text-3xl font-bold text-gray-900 dark:text-white">Data Protection</h2>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">End-to-End Encryption</h3>
              <p className="text-gray-600 dark:text-gray-300">
                All data transmitted between your device and our servers is protected with industry-standard 
                TLS 1.3 encryption. This ensures that your conversations with our AI remain private and secure.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">Secure Data Storage</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your data is stored in encrypted form on secure, redundant servers with strict access controls. 
                We use AES-256 encryption, the same standard used by financial institutions and government agencies.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">Regular Security Audits</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our systems undergo regular security audits and penetration testing by independent third-party 
                security firms to identify and address potential vulnerabilities.
              </p>
            </div>

            {/* Privacy Practices Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-8 mb-12">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-md bg-primary text-white">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="ml-6 text-3xl font-bold text-gray-900 dark:text-white">Privacy Practices</h2>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Data Minimization</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We only collect the data necessary to provide our services. You can use NeuroSync without 
                sharing personally identifiable information beyond what's necessary for account creation.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">No Third-Party Data Selling</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We do not sell your data to third parties. Your conversations, emotional states, and 
                personal information are used solely to provide and improve our service.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">User Control</h3>
              <p className="text-gray-600 dark:text-gray-300">
                You maintain control over your data. Access your information, request data exports, 
                or delete your data completely at any time through your account settings.
              </p>

              <div className="mt-6">
                <Link href="/privacy" className="text-primary hover:text-indigo-600 font-medium">
                  Read our full Privacy Policy →
                </Link>
              </div>
            </div>

            {/* Compliance Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-8 mb-12">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-md bg-primary text-white">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="ml-6 text-3xl font-bold text-gray-900 dark:text-white">Compliance</h2>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">HIPAA Compliance</h3>
              <p className="text-gray-600 dark:text-gray-300">
                NeuroSync is designed to be compliant with the Health Insurance Portability and 
                Accountability Act (HIPAA), ensuring that your health information is protected 
                according to industry standards.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">GDPR Compliance</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We comply with the General Data Protection Regulation (GDPR), providing users with 
                control over their personal data and ensuring transparent data processing practices.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">SOC 2 Certification</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We are committed to obtaining and maintaining SOC 2 certification, demonstrating our 
                adherence to strict information security policies and procedures.
              </p>
            </div>

            {/* AI Ethics Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-8 mb-12">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-md bg-primary text-white">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="ml-6 text-3xl font-bold text-gray-900 dark:text-white">AI Ethics & Security</h2>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Ethical AI Development</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI models are developed according to strict ethical guidelines, with built-in safeguards 
                against misuse or harmful outputs. We regularly review and improve these safeguards.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">Crisis Detection</h3>
              <p className="text-gray-600 dark:text-gray-300">
                NeuroSync includes advanced crisis detection systems to identify potential mental health 
                emergencies and provide appropriate support and resources when needed.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">Model Security</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI models are protected against prompt injection attacks and other security vulnerabilities, 
                ensuring that they cannot be manipulated to access sensitive information or behave inappropriately.
              </p>
            </div>

            {/* Security Team Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-8">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-md bg-primary text-white">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="ml-6 text-3xl font-bold text-gray-900 dark:text-white">Our Security Team</h2>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300">
                Our dedicated security team consists of experienced professionals with backgrounds in 
                information security, data protection, and privacy law. They work around the clock to 
                monitor our systems, respond to potential threats, and continuously improve our security measures.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">Bug Bounty Program</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We maintain an active bug bounty program, inviting security researchers to identify and 
                report potential vulnerabilities in our systems. This collaborative approach helps us 
                maintain the highest level of security.
              </p>
              
              <div className="mt-6">
                <Link href="/contact" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Contact Our Security Team
                </Link>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20">
            <div className="bg-primary rounded-lg shadow-xl overflow-hidden">
              <div className="px-6 py-12 sm:px-12 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
                <div className="lg:self-center">
                  <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                    <span className="block">Ready to experience secure mental health support?</span>
                  </h2>
                  <p className="mt-4 text-lg leading-6 text-indigo-100">
                    Start your journey with NeuroSync today, knowing your data and privacy are protected.
                  </p>
                  <div className="mt-8 flex space-x-4">
                    <Link
                      href="/signup"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                    >
                      Get Started
                    </Link>
                    <Link
                      href="/help"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-700 bg-opacity-60 hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Security; 