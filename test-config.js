/**
 * Test configuration file
 * Contains environment variables for testing
 */

// Set environment variables for testing
process.env.PINATA_API_KEY = 'YOUR_PINATA_API_KEY';
process.env.PINATA_API_SECRET = 'YOUR_PINATA_API_SECRET';
// Or use JWT if preferred
// process.env.PINATA_JWT = 'YOUR_PINATA_JWT';

// Export the config for use in tests
module.exports = {
  PINATA_API_KEY: process.env.PINATA_API_KEY,
  PINATA_API_SECRET: process.env.PINATA_API_SECRET,
  PINATA_JWT: process.env.PINATA_JWT
}; 