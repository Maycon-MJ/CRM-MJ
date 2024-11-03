import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { auth, mockUsers } from '../config/firebase';
import { User } from '../types/types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthorized: (requiredRole: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser as User);
      } else {
        setUser(null);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const email = `${username}@portal-akron.com`;
      await auth.signInWithEmailAndPassword(email, password);
      const userDoc = mockUsers.find(u => u.username === username);
      
      if (userDoc) {
        setUser(userDoc);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAuthorized = (requiredRole: string) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.role === requiredRole;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthorized }}>
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