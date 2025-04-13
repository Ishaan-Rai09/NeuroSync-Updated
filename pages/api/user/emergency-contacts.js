/**
 * API endpoint for managing emergency contacts
 * 
 * GET: Fetch the user's emergency contacts
 * POST: Save/update the user's emergency contacts
 */

import { emergencyContactsService } from '../../../lib/services/emergency-contacts-service';

/**
 * @description API handler for emergency contacts
 * @route GET /api/user/emergency-contacts - Retrieve user's emergency contacts
 * @route POST /api/user/emergency-contacts - Update user's emergency contacts
 */
export default async function handler(req, res) {
  // Get the user ID from the request
  // The client sends user ID either in query params (GET) or request body (POST)
  const userId = req.query.userId || req.body?.userId;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: 'User ID is required'
    });
  }
  
  try {
    if (req.method === 'GET') {
      // Retrieve emergency contacts using Pinata service
      const contacts = await emergencyContactsService.getEmergencyContacts(userId);
      
      return res.status(200).json({
        success: true,
        contacts
      });
    }
    
    else if (req.method === 'POST') {
      // Validate request body
      if (!req.body.contacts || !Array.isArray(req.body.contacts)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid request body'
        });
      }
      
      // Update emergency contacts using Pinata service
      const result = await emergencyContactsService.updateEmergencyContacts(
        userId,
        req.body.contacts
      );
      
      return res.status(200).json({
        success: true,
        message: 'Emergency contacts updated successfully',
        contacts: result.contacts
      });
    }
    
    // Method not allowed
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  } catch (error) {
    console.error('Error handling emergency contacts:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
} 