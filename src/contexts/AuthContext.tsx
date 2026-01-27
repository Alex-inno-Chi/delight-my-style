import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface StoredUser extends User {
  password: string;
}

const USERS_KEY = 'fashion_store_users';
const CURRENT_USER_KEY = 'fashion_store_current_user';

// Initialize with default admin
const getStoredUsers = (): StoredUser[] => {
  const stored = localStorage.getItem(USERS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Create default admin
  const defaultAdmin: StoredUser = {
    id: 'admin-1',
    email: 'admin@store.com',
    password: 'admin123',
    name: 'Store Admin',
    role: 'admin',
  };
  localStorage.setItem(USERS_KEY, JSON.stringify([defaultAdmin]));
  return [defaultAdmin];
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = getStoredUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    const users = getStoredUsers();
    
    if (users.some(u => u.email === email)) {
      return false; // Email already exists
    }

    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      role: 'customer',
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout,
      isAdmin: user?.role === 'admin' 
    }}>
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
