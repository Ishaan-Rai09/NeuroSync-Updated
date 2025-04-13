/**
 * Service for managing emergency contacts using Pinata IPFS
 * All emergency contact data is stored on IPFS via Pinata instead of MongoDB
 */
const { pinataService } = require('./pinata-service');

/**
 * Emergency Contacts Service
 * Handles storing and retrieving emergency contacts from Pinata IPFS
 */
class EmergencyContactsService {
  /**
   * Get emergency contacts for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Array of emergency contacts
   */
  async getEmergencyContacts(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Get user pins from Pinata
      const pins = await pinataService.getHistory(userId);
      
      // Find emergency contacts pin
      const contactsPin = pins.find(pin => {
        const metadata = pin.metadata?.keyvalues;
        return metadata?.type === 'emergency_contacts' && metadata?.userId === userId;
      });

      if (!contactsPin) {
        // If no contacts exist, return empty array
        return [];
      }

      // Get contacts data from Pinata
      const contacts = await pinataService.getData(contactsPin.ipfs_pin_hash);
      
      if (!contacts) {
        throw new Error('Failed to retrieve emergency contacts from Pinata');
      }
      
      return contacts.contacts || [];
    } catch (error) {
      console.error('Error fetching emergency contacts from Pinata:', error);
      
      // Return empty array as fallback
      return [];
    }
  }

  /**
   * Update emergency contacts for a user
   * @param {string} userId - User ID
   * @param {Array} contacts - Array of emergency contact objects
   * @returns {Promise<Object>} - Result of the operation
   */
  async updateEmergencyContacts(userId, contacts) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      if (!contacts || !Array.isArray(contacts)) {
        throw new Error('Contacts must be an array');
      }

      // Sanitize and validate contacts
      const sanitizedContacts = contacts.map(contact => ({
        id: contact.id || Date.now().toString(),
        name: contact.name?.trim(),
        relationship: contact.relationship?.trim() || '',
        phone: contact.phone?.trim(),
        isWhatsApp: contact.isWhatsApp !== false // Default to true if not specified
      })).filter(contact => contact.name && contact.phone);

      // Get user pins from Pinata
      const pins = await pinataService.getHistory(userId);
      
      // Find emergency contacts pin
      const contactsPin = pins.find(pin => {
        const metadata = pin.metadata?.keyvalues;
        return metadata?.type === 'emergency_contacts' && metadata?.userId === userId;
      });

      // Prepare data for storage
      const contactsData = {
        userId,
        contacts: sanitizedContacts,
        updatedAt: new Date(),
        type: 'emergency_contacts'
      };

      // Store contacts to Pinata
      const response = await pinataService.storeData(
        `emergency_contacts_${userId}`,
        contactsData,
        { userId, type: 'emergency_contacts' }
      );

      // If we had a previous pin, remove it
      if (contactsPin) {
        await pinataService.removeData(contactsPin.ipfs_pin_hash);
      }

      return { 
        success: true, 
        contacts: sanitizedContacts,
        ipfsHash: response.IpfsHash
      };
    } catch (error) {
      console.error('Error updating emergency contacts on Pinata:', error);
      throw error;
    }
  }
}

const emergencyContactsService = new EmergencyContactsService();

module.exports = { emergencyContactsService }; 