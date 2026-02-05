import React, { createContext, useContext, useState, useEffect } from 'react';

interface GuestUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
}

interface GuestAuthContextType {
  isSignedIn: boolean;
  user: GuestUser | null;
  signIn: (email: string, username: string) => void;
  signOut: () => void;
  getToken: () => Promise<string | null>;
}

const GuestAuthContext = createContext<GuestAuthContextType | undefined>(undefined);

export const GuestAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<GuestUser | null>(null);

  // Load guest session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('playto_guest_user');
    if (saved) {
      try {
        const userData = JSON.parse(saved);
        setUser(userData);
        setIsSignedIn(true);
      } catch (e) {
        console.warn('Failed to load guest session');
      }
    }
  }, []);

  const signIn = (email: string, username: string) => {
    const guestUser: GuestUser = {
      id: `guest_${Date.now()}`,
      email,
      first_name: username.split(' ')[0] || 'Guest',
      last_name: username.split(' ')[1] || '',
      username,
    };
    setUser(guestUser);
    setIsSignedIn(true);
    localStorage.setItem('playto_guest_user', JSON.stringify(guestUser));
  };

  const signOut = () => {
    setUser(null);
    setIsSignedIn(false);
    localStorage.removeItem('playto_guest_user');
  };

  const getToken = async () => {
    // Return a dummy token for guest users
    // In a real app, this might be a JWT
    return user ? `guest_token_${user.id}` : null;
  };

  return (
    <GuestAuthContext.Provider value={{ isSignedIn, user, signIn, signOut, getToken }}>
      {children}
    </GuestAuthContext.Provider>
  );
};

export const useGuestAuth = () => {
  const context = useContext(GuestAuthContext);
  if (!context) {
    throw new Error('useGuestAuth must be used within GuestAuthProvider');
  }
  return context;
};
