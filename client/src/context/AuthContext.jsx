import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);

  // Check for existing auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedCompany = localStorage.getItem('company');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    
    if (storedCompany) {
      try {
        setCompany(JSON.parse(storedCompany));
      } catch (error) {
        console.error('Error parsing stored company:', error);
        localStorage.removeItem('company');
      }
    }
    
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      
      // Mock authentication - in real app, this would be an API call
      const mockUsers = [
        {
          id: 1,
          email: 'admin@company.com',
          name: 'John Admin',
          role: 'admin',
          companyId: 1
        },
        {
          id: 2,
          email: 'manager@company.com',
          name: 'Sarah Manager',
          role: 'manager',
          companyId: 1
        },
        {
          id: 3,
          email: 'employee@company.com',
          name: 'Mike Employee',
          role: 'employee',
          companyId: 1
        }
      ];

      const mockCompany = {
        id: 1,
        name: 'Acme Corporation',
        baseCurrency: 'USD',
        settings: {
          approvalRequired: true,
          maxExpenseAmount: 10000
        }
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const foundUser = mockUsers.find(u => u.email === email);
      
      if (!foundUser || password !== 'Admin@123') {
        throw new Error('Invalid email or password');
      }

      // Store in localStorage (in real app, use secure tokens)
      localStorage.setItem('user', JSON.stringify(foundUser));
      localStorage.setItem('company', JSON.stringify(mockCompany));
      
      setUser(foundUser);
      setCompany(mockCompany);
      
      toast.success('Successfully signed in!');
      return foundUser;
    } catch (error) {
      toast.error(error.message || 'Sign in failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData) => {
    try {
      setLoading(true);
      
      // Mock sign up - in real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newUser = {
        id: Date.now(),
        email: userData.email,
        name: userData.name,
        role: 'admin', // First user is admin
        companyId: Date.now()
      };

      const newCompany = {
        id: Date.now(),
        name: userData.companyName,
        baseCurrency: userData.baseCurrency,
        settings: {
          approvalRequired: true,
          maxExpenseAmount: 10000
        }
      };

      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('company', JSON.stringify(newCompany));
      
      setUser(newUser);
      setCompany(newCompany);
      
      toast.success('Account created successfully!');
      return newUser;
    } catch (error) {
      toast.error(error.message || 'Sign up failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('company');
    setUser(null);
    setCompany(null);
    toast.info('Signed out successfully');
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      
      // Mock forgot password - in real app, this would send an email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate random password
      const newPassword = Math.random().toString(36).slice(-8);
      
      toast.success(`New password sent to ${email}: ${newPassword}`);
      return { newPassword };
    } catch (error) {
      toast.error(error.message || 'Failed to reset password');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      
      // Mock profile update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success('Profile updated successfully!');
      return updatedUser;
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const value = {
    user,
    company,
    loading,
    signIn,
    signUp,
    signOut,
    forgotPassword,
    updateProfile,
    hasRole,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager' || user?.role === 'admin',
    isEmployee: !!user // All roles can act as employees
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};