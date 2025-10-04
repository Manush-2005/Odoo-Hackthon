import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Alert
} from '@mui/material';
import {
  Email,
  AccountBalance,
  KeyRounded
} from '@mui/icons-material';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  
  const { forgotPassword } = useAuth();
  const { isDark } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const result = await forgotPassword(data.email);
      setNewPassword(result.newPassword);
      setIsSubmitted(true);
    } catch (error) {
      setError('email', { 
        type: 'manual', 
        message: error.message || 'Failed to reset password' 
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
              p: 4,
              backgroundColor: isDark ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${isDark ? 'rgba(113, 75, 103, 0.2)' : 'rgba(113, 75, 103, 0.15)'}`,
              borderRadius: 3,
              boxShadow: isDark
                ? '0 25px 50px -12px rgba(113, 75, 103, 0.25)'
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
                  {isSubmitted ? (
                    <KeyRounded
                      sx={{
                        fontSize: 48,
                        color: '#10B981',
                        mb: 2
                      }}
                    />
                  ) : (
                    <AccountBalance
                      sx={{
                        fontSize: 48,
                        color: '#714B67',
                        mb: 2
                      }}
                    />
                  )}
                </motion.div>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    fontFamily: 'Caveat, cursive',
                    color: isDark ? '#FFFFFF' : '#141A29',
                    mb: 1
                  }}
                >
                  {isSubmitted ? 'Password Reset' : 'Forgot Password'}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: isDark ? '#D1D5DB' : '#6B7280',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                  }}
                >
                  {isSubmitted 
                    ? 'Your new password has been generated'
                    : 'Enter your email to reset your password'
                  }
                </Typography>
              </Box>
            </motion.div>

            {isSubmitted ? (
              /* Success State */
              <motion.div variants={itemVariants}>
                <Alert
                  severity="success"
                  icon={<KeyRounded />}
                  sx={{
                    mb: 3,
                    backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    border: `1px solid rgba(16, 185, 129, 0.2)`,
                    color: '#10B981',
                    '& .MuiAlert-icon': {
                      color: '#10B981',
                    }
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Password Reset Successful!
                  </Typography>
                  <Typography variant="body2">
                    Your new temporary password is: <strong>{newPassword}</strong>
                  </Typography>
                </Alert>

                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    backgroundColor: isDark ? 'rgba(113, 75, 103, 0.1)' : 'rgba(113, 75, 103, 0.1)',
                    borderRadius: 2,
                    border: `1px solid rgba(113, 75, 103, 0.2)`
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#714B67' }}>
                    📧 Email Sent (Demo Mode)
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: isDark ? '#D1D5DB' : '#6B7280', mb: 1 }}>
                    In a real application, this password would be sent to your email address.
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: isDark ? '#D1D5DB' : '#6B7280' }}>
                    Please change this password after signing in for security.
                  </Typography>
                </Box>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    component={Link}
                    to="/signin"
                    fullWidth
                    variant="contained"
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(135deg, #714B67 0%, #8F6B84 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #8F6B84 0%, #A084A5 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(113, 75, 103, 0.3)',
                      },
                      borderRadius: 2,
                      fontWeight: 600,
                      fontSize: '1rem',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Back to Sign In
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              /* Form State */
              <motion.div variants={itemVariants}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    margin="normal"
                    variant="outlined"
                    error={!!errors.email}
                    helperText={errors.email?.message || 'Enter the email address associated with your account'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: '#714B67' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: isDark ? 'rgba(113, 75, 103, 0.05)' : 'rgba(113, 75, 103, 0.02)',
                        '& fieldset': {
                          borderColor: isDark ? 'rgba(113, 75, 103, 0.3)' : 'rgba(113, 75, 103, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#714B67',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#714B67',
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: isDark ? '#D1D5DB' : '#6B7280',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 500,
                        '&.Mui-focused': {
                          color: '#714B67',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: isDark ? '#FFFFFF' : '#141A29',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 500,
                      },
                      '& .MuiFormHelperText-root': {
                        color: isDark ? '#D1D5DB' : '#6B7280',
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
                        background: 'linear-gradient(135deg, #714B67 0%, #8F6B84 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #8F6B84 0%, #A084A5 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(113, 75, 103, 0.3)',
                        },
                        '&:disabled': {
                          background: isDark ? 'rgba(113, 75, 103, 0.3)' : 'rgba(113, 75, 103, 0.5)',
                          color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                        },
                        borderRadius: 2,
                        fontWeight: 600,
                        fontSize: '1rem',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {isLoading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        'Reset Password'
                      )}
                    </Button>
                  </motion.div>
                </form>
              </motion.div>
            )}

            {/* Links */}
            {!isSubmitted && (
              <motion.div variants={itemVariants}>
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography
                    variant="body2"
                    sx={{ 
                      color: isDark ? '#D1D5DB' : '#6B7280',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                    }}
                  >
                    Remember your password?{' '}
                    <Link
                      to="/signin"
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
                      Sign In
                    </Link>
                  </Typography>
                </Box>
              </motion.div>
            )}
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ForgotPassword;