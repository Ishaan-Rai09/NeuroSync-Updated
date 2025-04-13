/**
 * Authentication service using Pinata IPFS for credential storage
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pinataService } from './services/pinata-service';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to generate unique IDs
function generateUserId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Prefix for user storage in Pinata
const USER_PREFIX = 'user_auth';

export const authService = {
  /**
   * Register a new user with email and password
   * @param {Object} userData - User data including credentials
   * @returns {Promise<Object>} - User object and JWT token
   */
  async registerUser(userData) {
    try {
      const { firstName, lastName, email, password } = userData;
      
      // Basic validation
      if (!firstName || !lastName || !email || !password) {
        throw new Error('All fields are required');
      }
      
      // Check if user exists by retrieving all users with same email
      const existingUser = await this.findUserByEmail(email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }
      
      // Generate a user ID
      const userId = generateUserId();
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user object
      const user = {
        _id: userId,
        userId: userId,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        type: 'user_auth'
      };
      
      // Store user data in Pinata
      const pinataResponse = await pinataService.storeData(
        `${USER_PREFIX}_${userId}`,
        user,
        {
          userId,
          type: 'user_auth',
          email // Store email in metadata for searchability
        }
      );
      
      console.log(`User registered with ID: ${userId}, IPFS Hash: ${pinataResponse.IpfsHash}`);
      
      // Create JWT token
      const token = jwt.sign(
        { userId, email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Return user info and token (exclude password)
      const { password: _, ...userInfo } = user;
      return {
        token,
        user: {
          ...userInfo,
          ipfsHash: pinataResponse.IpfsHash
        }
      };
    } catch (error) {
      console.error('Error registering user in Pinata:', error);
      throw error;
    }
  },
  
  /**
   * Login a user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - User object and JWT token
   */
  async loginUser(email, password) {
    try {
      // Find user by email
      const user = await this.findUserByEmail(email);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }
      
      // Create token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Return user info and token (exclude password)
      const { password: _, ...userInfo } = user;
      return {
        token,
        user: userInfo
      };
    } catch (error) {
      console.error('Error logging in user from Pinata:', error);
      throw error;
    }
  },
  
  /**
   * Find a user by email in Pinata storage
   * @param {string} email - User email
   * @returns {Promise<Object|null>} - User object or null if not found
   */
  async findUserByEmail(email) {
    try {
      // Get all pins from Pinata
      const pins = await pinataService.getAllPins();
      
      // Find the user pin with matching email in metadata
      const userPin = pins.find(pin => {
        const metadata = pin.metadata?.keyvalues;
        return metadata?.type === 'user_auth' && 
               metadata?.email === email;
      });
      
      if (!userPin) {
        return null;
      }
      
      // Get user data from Pinata
      const userData = await pinataService.getData(userPin.ipfs_pin_hash);
      if (!userData) {
        return null;
      }
      
      // Add IPFS hash to user data
      return {
        ...userData,
        ipfsHash: userPin.ipfs_pin_hash
      };
    } catch (error) {
      console.error('Error finding user by email in Pinata:', error);
      return null;
    }
  },
  
  /**
   * Verify a JWT token and get user data
   * @param {string} token - JWT token
   * @returns {Promise<Object>} - Decoded token and user data
   */
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId;
      
      // Get user data from Pinata
      const pins = await pinataService.getHistory(userId);
      
      const userPin = pins.find(pin => {
        const metadata = pin.metadata?.keyvalues;
        return metadata?.type === 'user_auth' && 
               metadata?.userId === userId;
      });
      
      if (!userPin) {
        throw new Error('User not found');
      }
      
      const userData = await pinataService.getData(userPin.ipfs_pin_hash);
      if (!userData) {
        throw new Error('User data not found');
      }
      
      // Remove password from user data
      const { password, ...userInfo } = userData;
      
      return {
        decoded,
        user: {
          ...userInfo,
          ipfsHash: userPin.ipfs_pin_hash
        }
      };
    } catch (error) {
      console.error('Error verifying token:', error);
      throw error;
    }
  }
}; 