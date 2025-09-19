import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase-config/firebase';
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
  const [loading, setLoading] = useState(true);

  // Default travel preferences
  const defaultTravelPreferences: TravelPreferences = {
    preferredDestinations: [],
    budgetRange: 'mid-range',
    travelStyle: 'family',
    interests: [],
    accommodationTypes: ['hotel', 'resort']
  };

  // Convert Firebase user to our User type
  const convertFirebaseUser = (firebaseUser: FirebaseUser): User => ({
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || '',
    photoURL: firebaseUser.photoURL || '',
    createdAt: new Date()
  });

  // Load user profile from Firestore
  const loadUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  };

  // Create user profile in Firestore
  const createUserProfile = async (user: FirebaseUser, name: string): Promise<void> => {
    const userProfile: UserProfile = {
      uid: user.uid,
      name: name || user.displayName || '',
      email: user.email || '',
      phone: '',
      travelPreferences: defaultTravelPreferences,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(doc(db, 'users', user.uid), {
      ...userProfile,
      createdAt: userProfile.createdAt,
      updatedAt: userProfile.updatedAt
    });

    setUserProfile(userProfile);
  };

  // Login with email and password
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      
      // Load user profile
      const profile = await loadUserProfile(user.uid);
      setUserProfile(profile);
      
      toast.success('Welcome back!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register with email and password
  const register = async (email: string, password: string, name: string): Promise<void> => {
    try {
      setLoading(true);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Firebase profile
      await updateProfile(user, { displayName: name });
      
      // Create user profile in Firestore
      await createUserProfile(user, name);
      
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with Google
  const loginWithGoogle = async (): Promise<void> => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      
      // Check if user profile exists
      let profile = await loadUserProfile(user.uid);
      
      // Create profile if it doesn't exist
      if (!profile) {
        await createUserProfile(user, user.displayName || '');
      } else {
        setUserProfile(profile);
      }
      
      toast.success('Welcome!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
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

      await setDoc(doc(db, 'users', currentUser.uid), {
        ...updatedProfile,
        createdAt: updatedProfile.createdAt,
        updatedAt: updatedProfile.updatedAt
      });

      setUserProfile(updatedProfile as UserProfile);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = convertFirebaseUser(firebaseUser);
        setCurrentUser(user);
        
        // Load user profile
        const profile = await loadUserProfile(firebaseUser.uid);
        setUserProfile(profile);
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

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
