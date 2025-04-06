'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/me', { method: 'GET' });
      if (!response.ok) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }
      const data = await response.json();
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error: any) {
      setError(error.message || 'Error checking auth');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setIsAuthenticated(false);
      router.push('/');
    } catch (error: any) {
      setError(error.message || 'Logout error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, error, refreshAuth: checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
