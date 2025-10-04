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
  AccountBalance
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
      await signIn(data.email, data.password);
      navigate(from, { replace: true });
    } catch (error) {
      setError('email', { 
        type: 'manual', 
        message: error.message || 'Invalid credentials' 
      });
    } finally {
      setIsLoading(false);
    }
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
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
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
              p: 4,
              backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              borderRadius: 3,
              boxShadow: isDark
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                : '0 25px 50px -12px rgba(0, 0, 0, 0.1)'
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
                  <AccountBalance
                    sx={{
                      fontSize: 48,
                      color: isDark ? '#3b82f6' : '#1976d2',
                      mb: 2
                    }}
                  />
                </motion.div>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: isDark ? 'white' : 'black',
                    mb: 1
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: isDark ? '#94a3b8' : '#64748b'
                  }}
                >
                  Sign in to your expense management account
                </Typography>
              </Box>
            </motion.div>

            {/* Demo Credentials */}
            <motion.div variants={itemVariants}>
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(25, 118, 210, 0.1)',
                  borderRadius: 2,
                  border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(25, 118, 210, 0.2)'}`
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: isDark ? '#3b82f6' : '#1976d2' }}>
                  Demo Credentials:
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', color: isDark ? '#94a3b8' : '#64748b' }}>
                  Admin: admin@company.com | Manager: manager@company.com | Employee: employee@company.com
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', color: isDark ? '#94a3b8' : '#64748b' }}>
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
                        <Email sx={{ color: isDark ? '#94a3b8' : '#64748b' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      '& fieldset': {
                        borderColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: isDark ? 'rgba(148, 163, 184, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: isDark ? '#94a3b8' : '#64748b',
                    },
                    '& .MuiInputBase-input': {
                      color: isDark ? 'white' : 'black',
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
                        <Lock sx={{ color: isDark ? '#94a3b8' : '#64748b' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      '& fieldset': {
                        borderColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: isDark ? 'rgba(148, 163, 184, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: isDark ? '#94a3b8' : '#64748b',
                    },
                    '& .MuiInputBase-input': {
                      color: isDark ? 'white' : 'black',
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
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      backgroundColor: isDark ? '#3b82f6' : '#1976d2',
                      '&:hover': {
                        backgroundColor: isDark ? '#2563eb' : '#1565c0',
                      },
                      borderRadius: 2,
                      fontWeight: 600,
                      fontSize: '1rem'
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </motion.div>
              </form>
            </motion.div>

            {/* Links */}
            <motion.div variants={itemVariants}>
              <Divider sx={{ my: 3, borderColor: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.1)' }} />
              
              <Box sx={{ textAlign: 'center', space: 2 }}>
                <Link
                  to="/forgot-password"
                  style={{
                    color: isDark ? '#3b82f6' : '#1976d2',
                    textDecoration: 'none',
                    fontWeight: 500,
                    display: 'block',
                    marginBottom: '8px'
                  }}
                >
                  Forgot your password?
                </Link>
                
                <Typography
                  variant="body2"
                  sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                >
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    style={{
                      color: isDark ? '#3b82f6' : '#1976d2',
                      textDecoration: 'none',
                      fontWeight: 600
                    }}
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