import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { useRouter } from 'next/router';
import axios from 'axios';
import Recommendations from '../components/Recommendations';
import AuthWrapper from '../components/AuthWrapper';
import FilloutForm from '../components/FilloutForm';
import Switch from '../components/Switch';
import PersonalizedRecommendations from '../components/PersonalizedRecommendations';

const Chat = () => {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const [activeChat, setActiveChat] = useState('new');
  const [currentEmotionalState, setCurrentEmotionalState] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendationsPopup, setShowRecommendationsPopup] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isUsingLocalLlama, setIsUsingLocalLlama] = useState(true); // Default to using local LLaMA
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [crisisDetected, setCrisisDetected] = useState(false);
  const [showFilloutForm, setShowFilloutForm] = useState(false);

  // Crisis keywords for detection
  const crisisKeywords = [
    'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die', 
    'don\'t want to live', 'life is not worth', 'better off dead', 
    'no reason to live', 'can\'t take it anymore', 'ending it all',
    'hurt myself', 'harm myself', 'self harm'
  ];

  // Crisis detection function
  const checkForCrisis = (text) => {
    // Check if text is undefined, null, or not a string
    if (!text || typeof text !== 'string') {
      return false;
    }
    const lowerText = text.toLowerCase();
    return crisisKeywords.some(keyword => lowerText.includes(keyword));
  };

  // Handle crisis situation
  const handleCrisisDetected = () => {
    setCrisisDetected(true);
    
    // Show urgent toast message
    toast.error(
      "⚠️ We've detected concerning content in your message. Redirecting you to crisis resources for immediate support.", 
      { autoClose: 5000 }
    );
    
    // Notify emergency contacts via WhatsApp
    notifyEmergencyContacts();
    
    // Redirect to crisis page after a short delay
    setTimeout(() => {
      router.push('/crisis?auto=true');
      
      // Attempt to initiate a phone call if on mobile
      try {
        const crisisNumber = '988'; // US Crisis Lifeline
        
        // Check if this is a mobile device
        if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          // Create hidden link for phone call
          const callLink = document.createElement('a');
          callLink.href = `tel:${crisisNumber}`;
          callLink.style.display = 'none';
          document.body.appendChild(callLink);
          callLink.click();
          document.body.removeChild(callLink);
        }
      } catch (error) {
        console.error('Error initiating crisis call:', error);
      }
    }, 3000); // 3 second delay before redirect
  };

  // Function to notify emergency contacts via WhatsApp
  const notifyEmergencyContacts = () => {
    try {
      // Get emergency contacts from localStorage
      const contactsJson = localStorage.getItem('emergencyContacts');
      if (!contactsJson) return;
      
      const contacts = JSON.parse(contactsJson);
      if (!contacts || contacts.length === 0) return;
      
      // Prepare emergency message with location if available
      let emergencyMessage = `URGENT: ${user?.name || 'Someone'} may be experiencing a mental health crisis and needs support. This is an automated alert from NeuroSync AI.`;
      
      // Try to get location if browser supports it
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
            const fullMessage = `${emergencyMessage} Their location: ${locationUrl}`;
            
            // Send message to each WhatsApp contact
            contacts.filter(c => c.isWhatsApp).forEach(contact => {
              const phone = contact.phone.replace(/\D/g, '');
              const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(fullMessage)}`;
              // Open WhatsApp link in new tab
              window.open(whatsappUrl, '_blank');
            });
          },
          (error) => {
            console.error("Error getting location:", error);
            // Send message without location
            contacts.filter(c => c.isWhatsApp).forEach(contact => {
              const phone = contact.phone.replace(/\D/g, '');
              const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(emergencyMessage)}`;
              window.open(whatsappUrl, '_blank');
            });
          }
        );
      } else {
        // Browser doesn't support geolocation, send without location
        contacts.filter(c => c.isWhatsApp).forEach(contact => {
          const phone = contact.phone.replace(/\D/g, '');
          const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(emergencyMessage)}`;
          window.open(whatsappUrl, '_blank');
        });
      }
      
      // Show toast message
      if (contacts.filter(c => c.isWhatsApp).length > 0) {
        toast.info(`Sending emergency alerts to ${contacts.filter(c => c.isWhatsApp).length} emergency contacts`, {
          autoClose: 3000
        });
      }
    } catch (error) {
      console.error("Error notifying emergency contacts:", error);
    }
  };

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Only fetch conversations if we have a valid user ID
        if (parsedUser && parsedUser.id) {
          fetchConversations(parsedUser.id);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Handle invalid user data in localStorage
        localStorage.removeItem('user');
      }
    }
    
    // Check if user has a preference for using local LLaMA
    const llamaPreference = localStorage.getItem('useLocalLlama');
    if (llamaPreference !== null) {
      setIsUsingLocalLlama(llamaPreference === 'true');
    }
    
    // Add initial bot message
    setMessages([
      {
        id: 1,
        type: 'bot',
        text: `Hello! I am NeuroSync AI, your personal health companion${isUsingLocalLlama ? ' (powered by LLaMA 3.2)' : ''}. How can I assist you today?`,
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

  const fetchConversations = async (userId) => {
    // Ensure userId is valid before fetching
    if (!userId || userId === 'undefined') {
      console.error('Invalid userId for fetching conversations:', userId);
      return;
    }

    try {
      const response = await axios.get(`/api/conversations?userId=${userId}`);
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to fetch conversation history');
    }
  };

  const loadConversation = async (conversationId) => {
    // Check if we have a valid user before proceeding
    if (!user || !user.id) {
      toast.error('User information is missing');
      return;
    }

    setIsLoadingHistory(true);
    try {
      const response = await axios.get(`/api/conversations/${conversationId}?userId=${user.id}`);
      
      // Extract conversation from response - handle both formats
      const conversation = response.data.conversation || response.data;
      
      if (!conversation) {
        throw new Error("Conversation not found or invalid response format");
      }
      
      // Transform conversation messages to chat format
      const formattedMessages = conversation.messages.map((msg, index) => ({
        id: index + 1,
        type: msg.sender === 'user' ? 'user' : 'bot',
        text: msg.content,
        timestamp: new Date(msg.timestamp),
        sentiment: msg.analysis?.sentiment || null,
        emotions: msg.analysis?.emotions || null
      }));
      
      setMessages(formattedMessages);
      setCurrentConversationId(conversationId);
      setActiveChat('loaded');
      
      // Set chat history for context
      const contextHistory = conversation.messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
      setChatHistory(contextHistory);
      
      // Set the latest emotional state if available
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      if (lastMessage?.analysis?.sentiment) {
        setCurrentEmotionalState(lastMessage.analysis.sentiment);
      }
      
      if (conversation.recommendations && conversation.recommendations.length > 0) {
        setRecommendations(conversation.recommendations);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      toast.error('Failed to load conversation');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleNewChat = () => {
    setActiveChat('new');
    setMessages([{
      id: 1,
      type: 'bot',
      text: `Hello! I am NeuroSync AI, your personal health companion${isUsingLocalLlama ? ' (powered by LLaMA 3.2)' : ''}. How can I assist you today?`,
      timestamp: new Date(),
    }]);
    setNewMessage('');
    setChatHistory([]);
    setRecommendations([]);
    setCurrentEmotionalState(null);
    setCurrentConversationId(null);
  };

  const handleHistory = async () => {
    setActiveChat('history');
    // Refresh conversation list
    if (user) {
      await fetchConversations(user.id);
    }
  };

  // Add new handler for deleting a conversation
  const handleDeleteConversation = async (conversationId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this conversation?')) {
      return;
    }
    
    try {
      await axios.delete(`/api/conversations/${conversationId}?userId=${user.id}`);
      toast.success('Conversation deleted');
      // Refresh the conversation list
      fetchConversations(user.id);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error('Failed to delete conversation');
    }
  };
  
  // Add new handler for clearing all conversations
  const handleClearAllConversations = async () => {
    if (!confirm('Are you sure you want to delete ALL your conversations? This cannot be undone.')) {
      return;
    }
    
    try {
      await axios.delete(`/api/conversations?userId=${user.id}`);
      toast.success('All conversations cleared');
      setConversations([]);
    } catch (error) {
      console.error('Error clearing conversations:', error);
      toast.error('Failed to clear conversations');
    }
  };

  const handleSettings = () => {
    setActiveChat('settings');
    router.push('/settings');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const toggleAiModel = () => {
    const newValue = !isUsingLocalLlama;
    setIsUsingLocalLlama(newValue);
    localStorage.setItem('useLocalLlama', newValue.toString());
    toast.info(`Switched to ${newValue ? 'Local LLaMA 3.2' : 'Neural AI'}`);
    handleNewChat(); // Start a new chat when switching models
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Check if user is logged in
    if (!user || !user.id) {
      toast.error('Please log in to continue chatting');
      return;
    }
    
    // Check for crisis content in user message
    if (checkForCrisis(newMessage)) {
      handleCrisisDetected();
      // Continue with the message submission to get AI response
    }
    
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: newMessage,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    
    // Update chat history for context
    const updatedHistory = [...chatHistory, { role: 'user', content: newMessage }];
    setChatHistory(updatedHistory);
    
    try {
      // Call the appropriate AI endpoint based on user preference
      const endpoint = isUsingLocalLlama ? '/api/ai/local-chat' : '/api/ai/chat';
      
      const response = await axios.post(endpoint, {
        message: {
          content: newMessage,
          role: 'user',
          timestamp: new Date()
        },
        history: updatedHistory,
        userId: user.id,
        conversationId: currentConversationId
      });
      
      // Update conversation ID if this is a new conversation
      if (response.data.conversationId && !currentConversationId) {
        setCurrentConversationId(response.data.conversationId);
      }
      
      // Update chat history with AI response
      setChatHistory([
        ...updatedHistory,
        { role: 'assistant', content: response.data.message.content || response.data.message }
      ]);
      
      // Update emotional state and recommendations
      if (response.data.sentiment) {
        setCurrentEmotionalState(response.data.sentiment);
      }
      
      if (response.data.recommendations) {
        setRecommendations(response.data.recommendations);
      }
      
      // Add AI response to messages
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: typeof response.data.message === 'object' 
          ? response.data.message.content || 'Sorry, I couldn\'t process that properly.' 
          : response.data.message || 'Sorry, I couldn\'t process that properly.',
        timestamp: new Date(),
        sentiment: response.data.sentiment,
        emotions: response.data.emotions
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Check if AI response indicates a crisis situation
      // This ensures we catch crisis risks that the AI identified in the conversation
      if (
        (response.data.emotions?.primary === 'distressed') || 
        checkForCrisis(typeof response.data.message === 'object' 
          ? response.data.message.content 
          : response.data.message) ||
        // Check if the message mentions suicide/self-harm resources
        checkForCrisis(botMessage.text) && botMessage.text.includes('988')
      ) {
        handleCrisisDetected();
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      setIsLoading(false);
      
      // Fallback response in case of error
      const errorMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Update sentiment handling to show popup
  useEffect(() => {
    if (currentEmotionalState === 'negative') {
      setShowRecommendationsPopup(true);
    }
  }, [currentEmotionalState]);

  return (
    <AuthWrapper>
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
                      activeChat === 'history' || activeChat === 'loaded'
                      ? 'bg-primary text-white' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } group transition-colors duration-150`}
                >
                    <svg className={`mr-3 h-6 w-6 ${activeChat === 'history' || activeChat === 'loaded' ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  History
                </button>
                  
                  {/* History list - only show when history is active */}
                  {activeChat === 'history' && (
                    <div className="mt-2 space-y-2 pl-10">
                      {isLoadingHistory ? (
                        <div className="text-gray-500 text-sm">Loading...</div>
                      ) : conversations.length > 0 ? (
                        <>
                          <div className="mb-3">
                            <button
                              onClick={handleClearAllConversations}
                              className="text-xs text-red-500 hover:text-red-700 transition-colors"
                            >
                              Clear All History
                            </button>
                          </div>
                          {conversations.map((conv) => (
                            <div key={conv._id} className="flex items-center group">
                              <button
                                onClick={() => loadConversation(conv._id)}
                                className="flex-1 text-left text-sm text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary truncate py-2"
                              >
                                {conv.title || `Conversation ${new Date(conv.createdAt).toLocaleDateString()}`}
                              </button>
                              <button
                                onClick={(e) => handleDeleteConversation(conv._id, e)}
                                className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Delete conversation"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="text-gray-500 text-sm">No conversations yet</div>
                      )}
                    </div>
                  )}
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
                  
                  {/* AI Model Toggle Button */}
                  <div className="flex items-center space-x-3 mt-5 border-t border-gray-100 dark:border-gray-700 pt-5 px-5">
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      {isUsingLocalLlama ? 'Using: LLaMA 3.2' : 'Using: Neural AI'}
                    </div>
                    <div>
                      <Switch 
                        isOn={isUsingLocalLlama} 
                        handleToggle={toggleAiModel}
                        id="ai-model-toggle"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowFilloutForm(true)}
                    className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 group transition-colors duration-150"
                  >
                    <svg className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call to NeuroSync
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
            {/* Chat header for mobile - AI Model indicator */}
            <div className="md:hidden flex items-center justify-between border-b border-gray-200 dark:border-gray-700 py-2 px-4 bg-white dark:bg-gray-800">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {isUsingLocalLlama ? 'Using LLaMA 3.2 (Local)' : 'Using Neural AI'}
              </h3>
              <button 
                onClick={toggleAiModel}
                className="ml-2 p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            </div>
            
            {/* Add a header bar for the current conversation when loaded */}
            {activeChat === 'loaded' && currentConversationId && (
              <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <h2 className="text-base font-medium text-gray-900 dark:text-white">
                  Conversation
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDeleteConversation(currentConversationId, new Event('click'))}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                    aria-label="Delete current conversation"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNewChat}
                    className="p-2 text-gray-400 hover:text-primary rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                    aria-label="New conversation"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
              
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
                        {message.sentiment && (
                          <span className={`inline-flex items-center mt-2 px-2 py-0.5 rounded text-xs font-medium ${
                            message.sentiment === 'positive' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                            message.sentiment === 'negative' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100'
                          }`}>
                            {message.sentiment}
                          </span>
                        )}
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
            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-white dark:bg-gray-800">
              <form onSubmit={handleSubmit} className="flex items-center">
                <div className="flex-1 min-w-0">
                <textarea
                  rows="1"
                    className="block w-full resize-none border-0 bg-transparent p-0 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-0 sm:text-sm"
                    placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  ></textarea>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 transition duration-500 ease-in-out text-white bg-primary hover:bg-indigo-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Send</span>
                    <svg className="h-4 w-4 ml-2 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </form>
              </div>

            {showFilloutForm && (
              <FilloutForm onClose={() => setShowFilloutForm(false)} />
            )}

            {/* Recommendations Popup */}
            {showRecommendationsPopup && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">We noticed you might be feeling down</h2>
                      <button 
                        onClick={() => setShowRecommendationsPopup(false)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="mb-6">
                      <PersonalizedRecommendations emotionalState={currentEmotionalState || 'neutral'} />
                    </div>
                    {recommendations.length > 0 && false && (
                      <div className="mb-6">
                        <Recommendations 
                          recommendations={recommendations} 
                          emotionalState={currentEmotionalState} 
                        />
                      </div>
                    )}
                    <div className="flex justify-end">
                      <button
                        onClick={() => setShowRecommendationsPopup(false)}
                        className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-indigo-700 focus:outline-none"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </Layout>
    </AuthWrapper>
  );
};

export default Chat;