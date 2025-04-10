/**
 * Service for handling emergency features, including WhatsApp integration
 */

// Function to initiate WhatsApp call or message to emergency contact
export const contactEmergencyNumber = async (phoneNumber, message = "Emergency alert! I need help.") => {
  try {
    // Format phone number to ensure it starts with country code
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    
    // In browser context, open WhatsApp
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
      return { success: true };
    }
    
    // For server-side code, return the URL
    return { success: true, whatsappUrl };
  } catch (error) {
    console.error('Error initiating emergency contact:', error);
    return { success: false, error: error.message };
  }
};

// Validate phone number format
export const validatePhoneNumber = (phone) => {
  // Basic validation - remove spaces, dashes, and parentheses
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check if it's numeric and of reasonable length
  if (/^\+?[0-9]{10,15}$/.test(cleanPhone)) {
    return true;
  }
  
  return false;
};

// Format phone number to ensure it has country code
export const formatPhoneNumber = (phone) => {
  let cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // If no plus sign at beginning, and it's likely a US/Canada number
  if (!cleanPhone.startsWith('+')) {
    if (cleanPhone.length === 10) {
      // Assume US/Canada and add +1
      return `+1${cleanPhone}`;
    } else if (cleanPhone.startsWith('1') && cleanPhone.length === 11) {
      // Has 1 prefix but no plus
      return `+${cleanPhone}`;
    }
    // Otherwise add plus sign
    return `+${cleanPhone}`;
  }
  
  return cleanPhone;
};

// Trigger emergency alert to all contacts
export const triggerEmergencyAlert = async (emergencyContacts, crisisData = {}) => {
  try {
    if (!Array.isArray(emergencyContacts) || emergencyContacts.length === 0) {
      return { success: false, error: 'No emergency contacts found' };
    }
    
    const { location, severity, type } = crisisData;
    
    let message = "Emergency alert! I need help.";
    
    // Add crisis details if available
    if (Object.keys(crisisData).length > 0) {
      message += ` Crisis detected: ${type || 'Unknown'} - Severity: ${severity || 'Unknown'}`;
      
      if (location) {
        message += ` Location: ${location}`;
      }
    }
    
    // In a real implementation, we might use a proper messaging service API
    // to send messages programmatically. For now, just return data for UI to handle.
    return {
      success: true,
      message,
      contacts: emergencyContacts,
    };
  } catch (error) {
    console.error('Error triggering emergency alert:', error);
    return { success: false, error: error.message };
  }
}; 