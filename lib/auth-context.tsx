'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authHelpers, pb } from './pocketbase';

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if PocketBase already has a valid auth state
    const isAuthenticated = authHelpers.isAuthenticated();
    
    if (isAuthenticated) {
      const currentUser = authHelpers.getCurrentUser();
      
      if (currentUser) {
        const userObj = {
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.name,
          avatar: currentUser.avatar,
        };
        setUser(userObj);
      }
    }
    
    setIsLoading(false);

    // Set up auth store listener for changes
    const unsubscribe = pb.authStore.onChange((token, record) => {
      if (token && record) {
        const userObj = {
          id: record.id,
          email: record.email,
          name: record.name,
          avatar: record.avatar,
        };
        setUser(userObj);
      } else {
        setUser(null);
        // Clear welcome message flag when user logs out
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('welcome_shown');
        }
      }
    });

    // Cleanup function
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    const result = await authHelpers.login(email, password);
    
    // Note: User state will be updated via the authStore.onChange listener
    // No need to manually set user here
    
    setIsLoading(false);
    return result;
  };

  const logout = () => {
    authHelpers.logout();
    // User state will be cleared via the authStore.onChange listener
    // Welcome message flag will also be cleared in the onChange handler
  };

  const requestPasswordReset = async (email: string) => {
    return await authHelpers.requestPasswordReset(email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        requestPasswordReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 