import React from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import { ThemeProvider, useTheme } from './ThemeContext';

// Inner layout component that uses the theme context (without Footer)
const ChatLayoutInner = ({ children, title = 'NeuroSync Chat' }) => {
  const { darkMode } = useTheme();
  
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="AI-powered mental health companion chat" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
        <Navbar />
        <main className="flex-grow">{children}</main>
        {/* No Footer component here */}
      </div>
    </>
  );
};

// Outer layout component that provides the theme context
const ChatLayout = ({ children, title }) => {
  return (
    <ThemeProvider>
      <ChatLayoutInner title={title}>
        {children}
      </ChatLayoutInner>
    </ThemeProvider>
  );
};

export default ChatLayout; 