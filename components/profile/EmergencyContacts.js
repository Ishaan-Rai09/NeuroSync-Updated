import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiPlus, FiTrash2, FiPhone } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: '',
    phone: '',
    isWhatsApp: true
  });
  const [userId, setUserId] = useState(null);

  // Get user ID on component mount
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
    
    setLoading(true);
    try {
      const response = await fetch(`/api/user/emergency-contacts?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setContacts(data.contacts || []);
      } else {
        toast.error('Failed to load emergency contacts');
      }
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
      toast.error('Failed to load emergency contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact(prev => ({ ...prev, [name]: value }));
  };

  const validatePhoneNumber = (phone) => {
    // Enhanced phone number validation - allows spaces and common formatting
    return /^\+?[0-9\s]{10,20}$/.test(phone);
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    
    if (!userId) {
      return toast.error('User not authenticated');
    }
    
    if (!newContact.name.trim()) {
      return toast.error('Contact name is required');
    }
    
    if (!validatePhoneNumber(newContact.phone)) {
      return toast.error('Please enter a valid phone number');
    }
    
    const contactToAdd = {
      id: Date.now().toString(),
      name: newContact.name.trim(),
      relationship: newContact.relationship.trim(),
      phone: newContact.phone.trim(),
      isWhatsApp: newContact.isWhatsApp
    };
    
    setContacts(prev => [...prev, contactToAdd]);
    setNewContact({ name: '', relationship: '', phone: '', isWhatsApp: true });
    saveChanges([...contacts, contactToAdd]);
  };

  const handleRemoveContact = (contactId) => {
    const updatedContacts = contacts.filter(contact => contact.id !== contactId);
    setContacts(updatedContacts);
    saveChanges(updatedContacts);
  };

  const saveChanges = async (contactsToSave) => {
    if (!userId) {
      return toast.error('User not authenticated');
    }
    
    setSaving(true);
    try {
      const response = await fetch('/api/user/emergency-contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: userId,
          contacts: contactsToSave 
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Emergency contacts updated');
      } else {
        toast.error(data.error || 'Failed to update contacts');
      }
    } catch (error) {
      console.error('Error saving emergency contacts:', error);
      toast.error('Failed to save emergency contacts');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Emergency Contacts</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        These contacts will be notified during crisis detection.
      </p>
      
      {/* Add new contact form */}
      <form onSubmit={handleAddContact} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contact Name*
            </label>
            <input
              type="text"
              name="name"
              value={newContact.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Full Name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Relationship
            </label>
            <input
              type="text"
              name="relationship"
              value={newContact.relationship}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g. Parent, Sibling, Friend"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number*
            </label>
            <input
              type="tel"
              name="phone"
              value={newContact.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="+1234567890"
              required
            />
          </div>
        </div>
        
        <div className="mt-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isWhatsApp"
              name="isWhatsApp"
              checked={newContact.isWhatsApp}
              onChange={(e) => setNewContact({...newContact, isWhatsApp: e.target.checked})}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isWhatsApp" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Contact has WhatsApp (for emergency alerts)
            </label>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={saving}
          className="mt-4 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <FiPlus className="mr-2" /> Add Contact
        </button>
      </form>
      
      {/* Loading spinner */}
      {loading && (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      )}
      
      {/* Contacts list */}
      {!loading && (
        <div>
          {contacts.length === 0 ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              No emergency contacts added yet
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {contacts.map(contact => (
                <li key={contact.id} className="py-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800 dark:text-white">{contact.name}</h3>
                    {contact.relationship && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{contact.relationship}</p>
                    )}
                    <div className="flex items-center mt-1">
                      <FiPhone className="text-gray-400 mr-1" size={14} />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{contact.phone}</span>
                      {contact.isWhatsApp && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          <BsWhatsapp className="mr-1" size={10} /> WhatsApp
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {contact.isWhatsApp && (
                      <a
                        href={`https://wa.me/${contact.phone.replace(/\+/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 p-2 mr-2"
                        title="Contact via WhatsApp"
                      >
                        <BsWhatsapp size={18} />
                      </a>
                    )}
                    <button
                      onClick={() => handleRemoveContact(contact.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Remove contact"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      {/* Helper text */}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>* WhatsApp integration will be used to initiate calls during crisis detection</p>
      </div>
    </div>
  );
};

export default EmergencyContacts; 