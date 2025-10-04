import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  BusinessCenter
} from '@mui/icons-material';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/employee';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm();

 const onSubmit = async (data) => {

   try {
   setIsLoading(true);

      // Fetch user info from backend using email
      const res = await axios.get(`http://localhost:5000/api/admin/info-by-email/${data.email}`);
      const admin = res.data.data;

      // Simple password check (replace with real auth in production)
      if (!admin || data.password !== 'Admin@123') {
        setError('email', { 
          type: 'manual', 
          message: 'Invalid credentials' 
        });
        setIsLoading(false);
        return;
      }

      // Set localStorage items
      localStorage.setItem('user', JSON.stringify({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
        companyId: admin.companyId
      }));
      localStorage.setItem('company', JSON.stringify(admin));

      navigate(from, { replace: true });
    } catch (error) {
      setError('email', { 
        type: 'manual', 
        message: error.response?.data?.message || 'Invalid credentials' 
      })
    };
    setIsLoading(false);
  
};

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDark
          ? 'linear-gradient(135deg, #111827 0%, #1F2937 100%)'
          : 'linear-gradient(135deg, #F3F4F6 0%, #E6E9ED 100%)',
        py: 3
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${isDark ? 'rgba(156, 163, 175, 0.1)' : 'rgba(113, 75, 103, 0.1)'}`,
              borderRadius: 4,
              boxShadow: isDark
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
                : '0 25px 50px -12px rgba(113, 75, 103, 0.15)'
            }}
          >
            {/* Header */}
            <motion.div variants={itemVariants}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: 0.2,
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20 
                  }}
                >
                  <Box
                    component="img"
                    src="/logo.png"
                    alt="Odoo Logo"
                    sx={{
                      width: 80,
                      height: 80,
                      mb: 2,
                      filter: 'drop-shadow(0 4px 8px rgba(113, 75, 103, 0.3))'
                    }}
                  />
                </motion.div>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontFamily: 'Caveat, cursive',
                    fontWeight: 700,
                    color: '#714B67',
                    mb: 1,
                    fontSize: { xs: '2rem', sm: '2.5rem' }
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: isDark ? '#D1D5DB' : '#6B7280',
                    fontWeight: 500,
                    mb: 1
                  }}
                >
                  Sign in to your ExpenseHub account
                </Typography>
              </Box>
            </motion.div>

            {/* Demo Credentials */}
            <motion.div variants={itemVariants}>
              <Box
                sx={{
                  mb: 3,
                  p: 3,
                  background: isDark 
                    ? 'linear-gradient(135deg, rgba(143, 107, 132, 0.1) 0%, rgba(113, 75, 103, 0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(113, 75, 103, 0.08) 0%, rgba(143, 107, 132, 0.04) 100%)',
                  borderRadius: 3,
                  border: `2px solid ${isDark ? 'rgba(143, 107, 132, 0.2)' : 'rgba(113, 75, 103, 0.15)'}`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 2, 
                    color: '#714B67',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  🚀 Demo Credentials
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#F9FAFB' : '#1F2937' }}>
                    Admin: admin@company.com
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#F9FAFB' : '#1F2937' }}>
                    Manager: manager@company.com
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#F9FAFB' : '#1F2937' }}>
                    Employee: employee@company.com
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#714B67' }}>
                  Password: Admin@123
                </Typography>
              </Box>
            </motion.div>

            {/* Form */}
            <motion.div variants={itemVariants}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  margin="normal"
                  variant="outlined"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#714B67' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: isDark ? 'rgba(31, 41, 55, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 3,
                      fontFamily: 'Inter, sans-serif',
                      '& fieldset': {
                        borderColor: isDark ? 'rgba(156, 163, 175, 0.3)' : 'rgba(113, 75, 103, 0.3)',
                        borderWidth: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: '#714B67',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#714B67',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: isDark ? '#D1D5DB' : '#6B7280',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      '&.Mui-focused': {
                        color: '#714B67',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: isDark ? '#F9FAFB' : '#1F2937',
                      fontFamily: 'Inter, sans-serif',
                    },
                  }}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  margin="normal"
                  variant="outlined"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#714B67' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: '#714B67' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: isDark ? 'rgba(31, 41, 55, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 3,
                      fontFamily: 'Inter, sans-serif',
                      '& fieldset': {
                        borderColor: isDark ? 'rgba(156, 163, 175, 0.3)' : 'rgba(113, 75, 103, 0.3)',
                        borderWidth: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: '#714B67',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#714B67',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: isDark ? '#D1D5DB' : '#6B7280',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      '&.Mui-focused': {
                        color: '#714B67',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: isDark ? '#F9FAFB' : '#1F2937',
                      fontFamily: 'Inter, sans-serif',
                    },
                  }}
                  {...register('password', {
                    required: 'Password is required'
                  })}
                />

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      mt: 4,
                      mb: 3,
                      py: 2,
                      background: 'linear-gradient(135deg, #714B67 0%, #8F6B84 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5A3B52 0%, #714B67 100%)',
                        boxShadow: '0 6px 20px rgba(113, 75, 103, 0.4)',
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        background: 'linear-gradient(135deg, #9CA3AF 0%, #D1D5DB 100%)',
                      },
                      borderRadius: 3,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      fontFamily: 'Inter, sans-serif',
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(113, 75, 103, 0.3)',
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Sign In to ExpenseHub'
                    )}
                  </Button>
                </motion.div>
              </form>
            </motion.div>

            {/* Links */}
            <motion.div variants={itemVariants}>
              <Divider sx={{ my: 4, borderColor: isDark ? 'rgba(156, 163, 175, 0.2)' : 'rgba(113, 75, 103, 0.2)' }} />
              
              <Box sx={{ textAlign: 'center', space: 2 }}>
                <Link
                  to="/forgot-password"
                  style={{
                    color: '#714B67',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                    display: 'block',
                    marginBottom: '16px',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#8F6B84'}
                  onMouseLeave={(e) => e.target.style.color = '#714B67'}
                >
                  Forgot your password?
                </Link>
                
                <Typography
                  variant="body2"
                  sx={{ 
                    color: isDark ? '#D1D5DB' : '#6B7280',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                  }}
                >
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    style={{
                      color: '#714B67',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontFamily: 'Inter, sans-serif',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#8F6B84'}
                    onMouseLeave={(e) => e.target.style.color = '#714B67'}
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </motion.div>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SignIn;