import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'admin' | 'student';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string, role: 'admin' | 'student') => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface RegisterData {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: 'admin' | 'student';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (phone: string, password: string, role: 'admin' | 'student') => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo credentials for testing
    if (phone === '+1234567890' && password === 'password123') {
      const userData: User = {
        id: '1',
        name: role === 'admin' ? 'Rajesh Kumar' : 'Priya Sharma',
        phone: '+1234567890',
        email: role === 'admin' ? 'admin@drivesheet.com' : 'priya@example.com',
        role,
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
      };
      
      const token = `mock-jwt-token-${role}-${Date.now()}`;
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      setUser(userData);
      return;
    }
    
    // Also accept without the + prefix for convenience
    if (phone === '1234567890' && password === 'password123') {
      const userData: User = {
        id: '1',
        name: role === 'admin' ? 'Rajesh Kumar' : 'Priya Sharma',
        phone: '+1234567890',
        email: role === 'admin' ? 'admin@drivesheet.com' : 'priya@example.com',
        role,
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
      };
      
      const token = `mock-jwt-token-${role}-${Date.now()}`;
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      setUser(userData);
      return;
    }
    
    throw new Error('Invalid credentials. Please use the demo credentials provided.');
  };

  const register = async (userData: RegisterData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, this would send the data to the server
    // For demo purposes, we'll just simulate success
    console.log('Registration data:', userData);
    
    // You could store the registration data or redirect to login
    // For now, we'll just simulate success
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 