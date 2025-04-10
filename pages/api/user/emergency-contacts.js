/**
 * API endpoint for managing emergency contacts
 * 
 * GET: Fetch the user's emergency contacts
 * POST: Save/update the user's emergency contacts
 */

import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

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
  
  // Connect to database
  try {
    const { db } = await connectToDatabase();
    
    let userObjectId;
    try {
      userObjectId = new ObjectId(userId);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format'
      });
    }
    
    if (req.method === 'GET') {
      // Retrieve emergency contacts
      const user = await db.collection('users').findOne(
        { _id: userObjectId },
        { projection: { 'emergencyContacts': 1 } }
      );
      
      return res.status(200).json({
        success: true,
        contacts: user?.emergencyContacts || []
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
      
      // Sanitize and validate contacts
      const contacts = req.body.contacts.map(contact => ({
        id: contact.id || Date.now().toString(),
        name: contact.name?.trim(),
        relationship: contact.relationship?.trim() || '',
        phone: contact.phone?.trim(),
        isWhatsApp: contact.isWhatsApp !== false // Default to true if not specified
      })).filter(contact => contact.name && contact.phone);
      
      // Update user's emergency contacts
      await db.collection('users').updateOne(
        { _id: userObjectId },
        { $set: { emergencyContacts: contacts } }
      );
      
      return res.status(200).json({
        success: true,
        message: 'Emergency contacts updated successfully'
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