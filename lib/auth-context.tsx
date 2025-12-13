'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authHelper, pb } from './pocketbase';

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
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isAuthenticated = authHelper.isAuthenticated();

    if (isAuthenticated) {
      const currentUser = authHelper.getCurrentUser();

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
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('welcome_shown');
        }
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    const result = await authHelper.login(email, password);

    setIsLoading(false);
    return result;
  };

  const logout = () => {
    authHelper.logout();
    // User state will be cleared via the authStore.onChange listener
    // Welcome message flag will also be cleared in the onChange handler
  };

  const requestPasswordReset = async (email: string) => {
    return await authHelper.requestPasswordReset(email);
  };

  const refreshUser = async () => {
    try {
      if (pb.authStore.model?.id) {
        const currentUser = pb.authStore.record;
        let updatedUser;

        if (currentUser && currentUser.collectionName === '_superusers') {
          updatedUser = await pb.admins.getOne(pb.authStore.model.id);
        } else {
          updatedUser = await pb.collection('users').getOne(pb.authStore.model.id);
        }

        const userObj = {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          avatar: updatedUser.avatar,
        };
        setUser(userObj);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        requestPasswordReset,
        refreshUser,
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