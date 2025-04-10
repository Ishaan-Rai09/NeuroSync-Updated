import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

/**
 * Authentication wrapper component that checks if a user is logged in
 * and redirects to signup page if not
 */
const AuthWrapper = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if running on the client side
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          if (parsedUser && parsedUser.id) {
            setIsAuthenticated(true);
          } else {
            // Invalid user data, redirect to signup
            router.push('/signup');
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          // Handle invalid user data in localStorage
          localStorage.removeItem('user');
          router.push('/signup');
        }
      } else {
        // No user data found, redirect to signup
        router.push('/signup');
      }
      
      setLoading(false);
    }
  }, [router]);

  // Show a blank screen while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Only render children if authenticated
  return isAuthenticated ? children : null;
};

export default AuthWrapper; 