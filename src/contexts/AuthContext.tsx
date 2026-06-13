import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'client_admin' | 'client_viewer';

export interface User {
  name: string;
  email: string;
  role: UserRole;
  company: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('client_portal_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, role: UserRole) => {
    const newUser: User = {
      name: role === 'client_admin' ? 'Admin Client' : 'Viewer Client',
      email,
      role,
      company: 'PT Maju Bersama',
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
    };
    setUser(newUser);
    localStorage.setItem('client_portal_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('client_portal_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};