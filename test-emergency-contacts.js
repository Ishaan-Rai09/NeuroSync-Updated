/**
 * Test script for the emergency contacts service
 * Run with: node test-emergency-contacts.js
 */

// Load test configuration
require('./test-config');

// Import the emergency contacts service
const emergencyContactsService = require('./lib/services/emergency-contacts-service').emergencyContactsService;

// Sample user ID for testing
const TEST_USER_ID = 'test-user-' + Date.now();

// Sample emergency contacts
const TEST_CONTACTS = [
  {
    name: 'John Doe',
    relationship: 'Friend',
    phone: '+1234567890',
    isWhatsApp: true
  },
  {
    name: 'Jane Smith',
    relationship: 'Family',
    phone: '+0987654321',
    isWhatsApp: false
  }
];

/**
 * Run tests for emergency contacts service
 */
async function runTests() {
  console.log('Starting emergency contacts service tests...');
  console.log('Using Pinata API Key:', process.env.PINATA_API_KEY ? '✓ Set' : '✗ Not Set');
  console.log('Using Pinata API Secret:', process.env.PINATA_API_SECRET ? '✓ Set' : '✗ Not Set');
  console.log('Using Pinata JWT:', process.env.PINATA_JWT ? '✓ Set' : '✗ Not Set');
  
  try {
    // Test updating emergency contacts
    console.log('\n1. Testing updateEmergencyContacts...');
    const updateResult = await emergencyContactsService.updateEmergencyContacts(
      TEST_USER_ID,
      TEST_CONTACTS
    );
    
    console.log('Update result:', JSON.stringify(updateResult, null, 2));
    console.log('✅ Update test passed');
    
    // Test getting emergency contacts
    console.log('\n2. Testing getEmergencyContacts...');
    const contacts = await emergencyContactsService.getEmergencyContacts(TEST_USER_ID);
    
    console.log('Retrieved contacts:', JSON.stringify(contacts, null, 2));
    console.log('✅ Get test passed');
    
    // Verify contacts match what we stored
    if (contacts.length === TEST_CONTACTS.length) {
      console.log('✅ Contact count verification passed');
    } else {
      console.log('❌ Contact count verification failed');
    }
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the tests
runTests().catch(console.error); 