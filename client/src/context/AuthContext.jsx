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

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    
    const dunderCompany = {
      "_id": "68e0b3cdea8ac4964e44c8bc",
      "name": "Dunder Mifflin Company",
      "defaultCurrency": "USD",
      "countryCode": "US",
      "overrideApprovalEnabled": true,
      "approvalRules": [
        {
          "name": "Majority Vote Rule for the Officeeess",
          "type": "Percentage",
          "value": 60,
          "specificApproverId": null,
          "_id": "68e0b6dcb5c62dae1f61084f"
        }
      ],
      "createdAt": "2025-10-04T05:42:37.441Z",
      "updatedAt": "2025-10-04T05:55:40.119Z",
      "__v": 0
    };

   
    const dunderUsers = [
      {
        "_id": "68e0b3cdea8ac4964e44c8bc",
        "companyId": "68e0b3cdea8ac4964e44c8bc",
        "name": "Dunder Mifflin Company",
        "email": "admin@dundermifflin.com",
        "role": "admin"
      },
      {
        "_id": "68e0b44cea8ac4964e44c8bf",
        "companyId": "68e0b3cdea8ac4964e44c8bc",
        "name": "Dwight Schrute",
        "email": "dwight@dunder.com",
        "role": "Manager",
        "managerId": null,
        "isManagerApprover": true
      },
      {
        "_id": "68e0b477ea8ac4964e44c8c1",
        "companyId": "68e0b3cdea8ac4964e44c8bc",
        "name": "Jim Halpert",
        "email": "jim@dunder.com",
        "role": "Employee",
        "managerId": "68e0b3cdea8ac4964e44c8bc",
        "isManagerApprover": true
      }
    ];

   
    const foundUser = dunderUsers.find(u => u.email === email);

    if (!foundUser || password !== 'Admin@123') {
      throw new Error('Invalid email or password');
    }

    localStorage.setItem('user', JSON.stringify(foundUser));
    localStorage.setItem('company', JSON.stringify(dunderCompany));

    setUser(foundUser);
    setCompany(dunderCompany);

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
  "_id": "68e0b3cdea8ac4964e44c8bc",
  "name": "Dunder Mifflin Company",
  "role": "admin",
  "email": "admin@dundermifflin.com",
  "companyId": "68e0b3cdea8ac4964e44c8bc"
}
     

const newCompany = {
  "_id": "68e0b3cdea8ac4964e44c8bc",
  "name": "Dunder Mifflin Company",
  "defaultCurrency": "USD",
  "countryCode": "US",
  "overrideApprovalEnabled": true,
  "approvalRules": [
    {
      "name": "Majority Vote Rule for the Officeeess",
      "type": "Percentage",
      "value": 60,
      "specificApproverId": null,
      "_id": "68e0b6dcb5c62dae1f61084f"
    }
  ],
  "createdAt": "2025-10-04T05:42:37.441Z",
  "updatedAt": "2025-10-04T05:55:40.119Z",
  "__v": 0
}


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