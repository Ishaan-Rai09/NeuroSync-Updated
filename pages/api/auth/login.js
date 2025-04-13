import { authService } from '../../../lib/auth-service';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Login user with Pinata-based auth service
    const result = await authService.loginUser(email, password);

    // Return user info and token
    res.status(200).json({
      token: result.token,
      user: {
        id: result.user._id,
        email: result.user.email,
        name: `${result.user.firstName} ${result.user.lastName}`,
        firstName: result.user.firstName,
        lastName: result.user.lastName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    
    // Return appropriate error message
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
} 