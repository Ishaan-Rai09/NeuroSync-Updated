import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';

const CrisisPage = () => {
  const [isAutoCallPrompted, setIsAutoCallPrompted] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [emergencyCallMade, setEmergencyCallMade] = useState(false);

  // Get user ID and set up initial state
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUserId(parsedUser.id);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Fetch emergency contacts when userId is available
  useEffect(() => {
    if (userId) {
      fetchEmergencyContacts();
    }
  }, [userId]);

  const fetchEmergencyContacts = async () => {
    if (!userId) return;
    
    setContactsLoading(true);
    try {
      const response = await fetch(`/api/user/emergency-contacts?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setEmergencyContacts(data.contacts || []);
      } else {
        toast.error('Failed to load emergency contacts');
      }
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
      toast.error('Failed to load emergency contacts');
    } finally {
      setContactsLoading(false);
    }
  };

  useEffect(() => {
    // Check if this is a redirected crisis situation from URL query param
    const urlParams = new URLSearchParams(window.location.search);
    const isAutoRedirect = urlParams.get('auto') === 'true';

    if (isAutoRedirect && !isAutoCallPrompted) {
      setIsAutoCallPrompted(true);
      
      // Start countdown
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Initiate call when countdown reaches 0
            initiateEmergencyCall();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Cleanup timer
      return () => clearInterval(timer);
    }
  }, [isAutoCallPrompted]);

  // Function to contact emergency contacts via WhatsApp
  const contactEmergencyWhatsApp = async () => {
    // Filter for contacts that have WhatsApp
    const whatsAppContacts = emergencyContacts.filter(contact => contact.isWhatsApp);
    
    if (whatsAppContacts.length === 0) {
      toast.warning('No WhatsApp emergency contacts found');
      return;
    }

    // Start with the first WhatsApp contact
    const firstContact = whatsAppContacts[0];
    const cleanNumber = firstContact.phone.replace(/\s+/g, '').replace(/\+/g, '');
    
    // Create a WhatsApp deep link with pre-filled urgent message
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
      "URGENT: This is an automated crisis alert from NeuroSync AI. I may need immediate support or assistance. Please call or message me as soon as possible."
    )}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    // Mark that emergency contact has been attempted
    setEmergencyCallMade(true);
    
    toast.success(`Contacting emergency contact: ${firstContact.name}`);
    
    // If there are more contacts, provide information about them
    if (whatsAppContacts.length > 1) {
      toast.info(`${whatsAppContacts.length - 1} more emergency contacts available`);
    }
  };

  // Function to initiate emergency call
  const initiateEmergencyCall = () => {
    try {
      // First attempt to contact emergency contacts via WhatsApp
      if (emergencyContacts.length > 0 && !emergencyCallMade) {
        contactEmergencyWhatsApp();
      }
      
      // Also provide option to call crisis line
      const crisisNumber = '988'; // US Crisis Lifeline
      
      // Create hidden link for phone call
      const callLink = document.createElement('a');
      callLink.href = `tel:${crisisNumber}`;
      callLink.style.display = 'none';
      document.body.appendChild(callLink);
      callLink.click();
      document.body.removeChild(callLink);
      
      toast.info(`Initiating call to crisis support: ${crisisNumber}`);
    } catch (error) {
      console.error('Error initiating emergency call:', error);
      toast.error('Unable to initiate automatic call. Please call 988 directly for support.');
    }
  };

  // Function to manually contact a specific emergency contact
  const contactSpecificEmergencyContact = (contact) => {
    if (!contact.isWhatsApp) {
      toast.warning(`${contact.name} doesn't have WhatsApp configured`);
      return;
    }
    
    const cleanNumber = contact.phone.replace(/\s+/g, '').replace(/\+/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
      "URGENT: This is an automated crisis alert from NeuroSync AI. I may need immediate support or assistance. Please call or message me as soon as possible."
    )}`;
    
    window.open(whatsappUrl, '_blank');
    toast.success(`Contacting ${contact.name}`);
  };

  return (
    <Layout title="NeuroSync - Crisis Support">
      <div className="min-h-screen bg-red-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h1 className="text-xl font-bold text-gray-900">NeuroSync Crisis Support</h1>
            </div>
            <button 
              onClick={initiateEmergencyCall}
              className="inline-flex items-center px-4 py-2 border border-red-600 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Crisis Support (988)
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Auto-call Prompt */}
          {isAutoCallPrompted && countdown > 0 && (
            <div className="bg-red-600 text-white rounded-lg shadow-md p-6 mb-8 animate-pulse">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium">URGENT: Automatic Crisis Call</h3>
                  <div className="mt-2 text-sm">
                    <p>We've detected concerning content and will connect you with crisis support in {countdown} seconds.</p>
                    <div className="mt-2 flex space-x-4">
                      <button 
                        onClick={() => setCountdown(0)}
                        className="px-3 py-1 bg-white text-red-600 rounded-md hover:bg-gray-100"
                      >
                        Call Now
                      </button>
                      <button 
                        onClick={() => setIsAutoCallPrompted(false)}
                        className="px-3 py-1 bg-red-700 text-white rounded-md hover:bg-red-800"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Crisis Alert */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-600">Crisis Alert Detected</h3>
                <div className="mt-2 text-sm text-gray-700">
                  <p>We've noticed signs of distress in your recent interactions. Help is available 24/7. You're not alone.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          {emergencyContacts.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="px-6 py-4 bg-red-50 border-b">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h2 className="text-lg font-medium text-gray-900">Your Emergency Contacts</h2>
                </div>
              </div>
              
              {contactsLoading ? (
                <div className="flex justify-center items-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {emergencyContacts.map(contact => (
                    <li key={contact.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                            {contact.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                            <p className="text-sm text-gray-500">{contact.relationship || 'Emergency Contact'}</p>
                            <div className="flex items-center mt-1">
                              <p className="text-xs text-gray-500">{contact.phone}</p>
                              {contact.isWhatsApp && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  WhatsApp
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => contactSpecificEmergencyContact(contact)}
                          disabled={!contact.isWhatsApp}
                          className={`inline-flex items-center p-2 rounded-full text-white ${
                            contact.isWhatsApp 
                              ? 'bg-green-500 hover:bg-green-600' 
                              : 'bg-gray-300 cursor-not-allowed'
                          }`}
                          title={contact.isWhatsApp ? "Contact via WhatsApp" : "No WhatsApp available"}
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              
              <div className="px-6 py-4 bg-gray-50">
                <button 
                  onClick={contactEmergencyWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center"
                  disabled={emergencyContacts.filter(c => c.isWhatsApp).length === 0}
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Contact All Emergency Contacts via WhatsApp
                </button>
              </div>
            </div>
          )}

          {/* One-click Call Buttons */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            <button 
              onClick={initiateEmergencyCall}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-4 rounded-lg flex items-center justify-center text-lg"
            >
              <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call National Suicide Prevention Lifeline: 988
            </button>
            
            <a 
              href="sms:741741?body=HOME"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-lg flex items-center justify-center text-lg"
            >
              <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Text "HOME" to Crisis Text Line: 741741
            </a>
            
            <a 
              href="tel:911"
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-4 rounded-lg flex items-center justify-center text-lg"
            >
              <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Call Emergency Services: 911
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Emergency Hotlines */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <h2 className="text-lg font-medium text-gray-900">Emergency Hotlines</h2>
                </div>
              </div>
              <ul className="divide-y divide-gray-200">
                <li className="px-6 py-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-900">National Crisis Line</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      988
                    </span>
                  </div>
                </li>
                <li className="px-6 py-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-900">Suicide Prevention</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      1-800-273-8255
                    </span>
                  </div>
                </li>
                <li className="px-6 py-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-900">Crisis Text Line</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Text HOME to 741741
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Grounding Techniques */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h2 className="text-lg font-medium text-gray-900">Instant Grounding Techniques</h2>
                </div>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="bg-blue-50 rounded-md p-4">
                  <h3 className="text-sm font-medium text-blue-800">5-4-3-2-1 Method</h3>
                  <p className="mt-1 text-sm text-gray-700">
                    Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste
                  </p>
                </div>
                <div className="bg-green-50 rounded-md p-4">
                  <h3 className="text-sm font-medium text-green-800">Deep Breathing</h3>
                  <p className="mt-1 text-sm text-gray-700">
                    Breathe in for 4 counts, hold for 4, exhale for 4
                  </p>
                </div>
                <div className="bg-purple-50 rounded-md p-4">
                  <h3 className="text-sm font-medium text-purple-800">Body Scan</h3>
                  <p className="mt-1 text-sm text-gray-700">
                    Focus attention slowly from head to toe
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>If you're experiencing a medical emergency, please dial 911 immediately.</p>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default CrisisPage;
