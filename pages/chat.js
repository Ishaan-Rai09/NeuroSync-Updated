import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Chat = () => {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const [activeChat, setActiveChat] = useState('new'); // 'new', 'history', 'settings'

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Add some sample messages
    setMessages([
      {
        id: 1,
        type: 'bot',
        text: 'Hello! I am NeuroSync AI, your personal health companion. How can I assist you today?',
        timestamp: new Date(),
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNewChat = () => {
    setActiveChat('new');
    setMessages([{
      id: 1,
      type: 'bot',
      text: 'Hello! I am NeuroSync AI, your personal health companion. How can I assist you today?',
      timestamp: new Date(),
    }]);
    setNewMessage('');
  };

  const handleHistory = () => {
    setActiveChat('history');
    // You can implement chat history functionality here
    toast.info('Chat history feature coming soon!');
  };

  const handleSettings = () => {
    setActiveChat('settings');
    router.push('/settings');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: newMessage,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    
    try {
      // Simulate AI response
      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          type: 'bot',
          text: 'I understand your concern. Let me help you with that...',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to send message');
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Layout title="Chat | NeuroSync">
      <div className="flex h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-72 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 bg-white dark:bg-gray-800 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.31802 6.31802C2.56066 8.07538 2.56066 10.9246 4.31802 12.682L12.0001 20.364L19.682 12.682C21.4393 10.9246 21.4393 8.07538 19.682 6.31802C17.9246 4.56066 15.0754 4.56066 13.318 6.31802L12.0001 7.63609L10.682 6.31802C8.92462 4.56066 6.07538 4.56066 4.31802 6.31802Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="ml-3 text-2xl font-semibold text-gray-900 dark:text-white">NeuroSync</h2>
            </div>
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-4 space-y-3">
                <button 
                  onClick={handleNewChat}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    activeChat === 'new' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } group transition-colors duration-150`}
                >
                  <svg className={`mr-3 h-6 w-6 ${activeChat === 'new' ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  New Chat
                </button>
                <button 
                  onClick={handleHistory}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    activeChat === 'history' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } group transition-colors duration-150`}
                >
                  <svg className={`mr-3 h-6 w-6 ${activeChat === 'history' ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  History
                </button>
                <button 
                  onClick={handleSettings}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    activeChat === 'settings' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } group transition-colors duration-150`}
                >
                  <svg className={`mr-3 h-6 w-6 ${activeChat === 'settings' ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
              </nav>
            </div>
            {user && (
              <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center w-full">
                  <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                    <span className="text-base font-medium">{user.name.charAt(0)}</span>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-2 p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end space-x-3 max-w-2xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                  <div className="flex-shrink-0">
                    {message.type === 'bot' ? (
                      <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <span className="text-base font-medium">{user?.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className={`rounded-2xl px-6 py-4 max-w-lg ${
                    message.type === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}>
                    <p className="text-base">{message.text}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-300 mt-2">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-3 max-w-2xl">
                  <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-6 py-4">
                    <div className="flex space-x-2">
                      <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
            <form onSubmit={handleSubmit} className="flex items-center space-x-4">
              <button
                type="button"
                className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <div className="flex-1 flex">
                <textarea
                  rows="1"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="block w-full rounded-l-xl border-0 py-3 px-4 text-base text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-700 dark:placeholder-gray-400 resize-none"
                />
                <div className="flex">
                  <button
                    type="button"
                    className="flex items-center justify-center px-4 border border-l-0 border-gray-300 dark:border-gray-700 dark:bg-gray-700 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center px-4 border border-l-0 border-gray-300 dark:border-gray-700 dark:bg-gray-700 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center px-6 rounded-r-xl bg-primary text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors duration-150"
                  >
                    <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;