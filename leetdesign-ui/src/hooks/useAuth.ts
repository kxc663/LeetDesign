'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });
  
  const router = useRouter();

  // Function to check if user is authenticated
  const checkAuth = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        // If not authenticated, clear state
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
        return;
      }
      
      const data = await response.json();
      
      // If authenticated, set user data
      setAuthState({
        user: data.user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error: any) {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: error.message || 'Error checking authentication',
      });
    }
  };

  // Function to log out the user
  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to log out');
      }
      
      // Clear auth state
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
      
      // Redirect to home page
      router.push('/');
    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: error.message || 'Error during logout'
      }));
    }
  };

  // Check authentication status on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  return {
    ...authState,
    logout,
    refreshAuth: checkAuth,
  };
} 