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
      // You should have an authentication route, but for now, fetch by email
      // Example: GET /api/admin/info-by-email/:email
      const res = await axios.get(`http://localhost:5000/api/admin/info-by-email/${email}`);
      const admin = res.data.data;
      if (!admin) throw new Error('Admin not found');
      // You should check password here if you store it in DB
      localStorage.setItem('user', JSON.stringify({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
        companyId: admin.companyId
      }));
      localStorage.setItem('company', JSON.stringify(admin));
      setUser({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
        companyId: admin.companyId
      });
      setCompany(admin);
      toast.success('Successfully signed in!');
      return admin;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Sign in failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  

  const signUp = async (userData) => {
    try {
      setLoading(true);
      // POST to backend route
      const res = await axios.post('http://localhost:5000/api/admin/createAdmin', {
        companyName: userData.companyName,
        countryCode: 'US', // or get from userData if needed
        adminName: userData.name,
        adminEmail: userData.email
      });
      console.log('Sign up response:', res);
      const admin = res.data.data.admin;
      localStorage.setItem('user', JSON.stringify({
        _id: admin._id,
        name: admin.name,
        email: userData.email,
        role: 'admin',
        companyId: admin.companyId
      }));
      localStorage.setItem('company', JSON.stringify(admin));
      setUser({
        _id: admin._id,
        name: admin.name,
        email: userData.email,
        role: 'admin',
        companyId: admin.companyId
      });
      setCompany(admin);
      toast.success('Account created successfully!');
      return admin;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Sign up failed');
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