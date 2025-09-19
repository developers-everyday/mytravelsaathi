import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { User, UserProfile, TravelPreferences } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  // Default travel preferences
  const defaultTravelPreferences: TravelPreferences = {
    preferredDestinations: [],
    budgetRange: 'mid-range',
    travelStyle: 'family',
    interests: [],
    accommodationTypes: ['hotel', 'resort']
  };

  // Mock authentication for testing
  const mockUser: User = {
    uid: 'demo-user-123',
    email: 'demo@mytravelsaathi.com',
    displayName: 'Demo User',
    photoURL: '',
    createdAt: new Date()
  };

  const mockUserProfile: UserProfile = {
    uid: 'demo-user-123',
    name: 'Demo User',
    email: 'demo@mytravelsaathi.com',
    phone: '+1234567890',
    travelPreferences: defaultTravelPreferences,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Login with email and password (mock)
  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentUser(mockUser);
      setUserProfile(mockUserProfile);
      toast.success('Welcome back! (Demo Mode)');
    } catch (error: any) {
      toast.error('Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register with email and password (mock)
  const register = async (email: string, password: string, name: string): Promise<void> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = { ...mockUser, displayName: name, email };
      const newProfile = { ...mockUserProfile, name, email };
      
      setCurrentUser(newUser);
      setUserProfile(newProfile);
      toast.success('Account created successfully! (Demo Mode)');
    } catch (error: any) {
      toast.error('Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with Google (mock)
  const loginWithGoogle = async (): Promise<void> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentUser(mockUser);
      setUserProfile(mockUserProfile);
      toast.success('Welcome! (Demo Mode)');
    } catch (error: any) {
      toast.error('Google login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      setCurrentUser(null);
      setUserProfile(null);
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error('Logout failed');
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (profileUpdate: Partial<UserProfile>): Promise<void> => {
    if (!currentUser) throw new Error('No user logged in');

    try {
      const updatedProfile = {
        ...userProfile,
        ...profileUpdate,
        updatedAt: new Date()
      };

      setUserProfile(updatedProfile as UserProfile);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};