import { authService } from '../../../lib/auth-service';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, password } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Register user with Pinata-based auth service
    const result = await authService.registerUser({
      firstName,
      lastName,
      email,
      password
    });

    res.status(201).json({
      message: 'User registered successfully',
      token: result.token,
      user: {
        id: result.user._id,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        email: result.user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Return appropriate error message
    if (error.message === 'User already exists with this email') {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
} 