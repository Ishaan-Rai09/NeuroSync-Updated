/**
 * MongoDB schema for conversations
 * Stores chat history between users and the AI assistant
 */

/**
 * Message structure:
 * - sender: 'user' | 'ai'
 * - content: string
 * - timestamp: Date
 * - sentiment: string (optional)
 * - emotions: object (optional)
 */

/**
 * Conversation Schema:
 * - userId: ObjectId (reference to users collection)
 * - title: string (auto-generated from first message or user-defined)
 * - messages: Array of message objects
 * - createdAt: Date
 * - updatedAt: Date
 * - lastSentiment: string (most recent analyzed sentiment)
 * - lastEmotions: object (most recent analyzed emotions)
 * - recommendations: Array of recommendation objects (most recent)
 */

// This file provides schema definition for conversations
// to be used in MongoDB collections

// Export schema for use in API routes
export const conversationSchema = {
  userId: '', // Will be populated with MongoDB ObjectId
  title: '',
  messages: [
    // {
    //   sender: 'user' | 'ai',
    //   content: '',
    //   timestamp: new Date(),
    //   sentiment: '', // Optional
    //   emotions: {}, // Optional
    // }
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSentiment: '',
  lastEmotions: {
    primary: '',
    confidence: 0
  },
  recommendations: []
}; 