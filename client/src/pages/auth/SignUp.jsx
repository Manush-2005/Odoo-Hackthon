import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Divider,
  Autocomplete,
  Step,
  Stepper,
  StepLabel
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  AccountBalance,
  Person,
  Business,
  AttachMoney
} from '@mui/icons-material';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { mockApi, currencyApi } from '../../utils/api';
import axios from 'axios';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [currencyLoading, setCurrencyLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  
  const { signUp } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const steps = ['Account Details', 'Company Information'];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue,
    getValues
  } = useForm({
    defaultValues: {
      baseCurrency: 'USD'
    }
  });

  const password = watch('password');

  // Load currencies on mount
  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const currencyData = await currencyApi.getCountriesWithCurrencies();
        setCurrencies(currencyData);
      } catch (error) {
        console.error('Error loading currencies:', error);
      } finally {
        setCurrencyLoading(false);
      }
    };
    
    loadCurrencies();
  }, []);

  const validateStep = (step) => {
    const values = getValues();
    
    if (step === 0) {
      const requiredFields = ['name', 'email', 'password', 'confirmPassword'];
      const hasErrors = requiredFields.some(field => !values[field]);
      
      if (values.password !== values.confirmPassword) {
        setError('confirmPassword', { 
          type: 'manual', 
          message: 'Passwords do not match' 
        });
        return false;
      }
      
      return !hasErrors;
    }
    
    if (step === 1) {
      return values.companyName && values.baseCurrency;
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const onSubmit = async (data) => {
  try {
    setIsLoading(true);
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { 
        type: 'manual', 
        message: 'Passwords do not match' 
      });
      return;
    }
    // Prepare payload for backend
    const signUpData = {
      companyName: data.companyName,
      countryCode: 'US', 
      adminName: data.name,
      adminEmail: data.email
    };
   
console.log('Submitting sign up data:', signUpData);
    // Call backend API directly
    const res = await axios.post('http://localhost:5000/api/admin/createAdmin', signUpData);
    console.log(res.data);
    const admin = res.data.data.admin;

    // Save user and company info to localStorage
    localStorage.setItem('user', JSON.stringify({
      _id: admin._id,
      name: admin.name,
      email: data.email,
      role: 'admin',
      companyId: admin.companyId
    }));
    localStorage.setItem('company', JSON.stringify(admin));

    // Redirect to employee page
    navigate('/admin');
  } catch (error) {
    setError('email', { 
      type: 'manual', 
      message: error.response?.data?.message || 'Registration failed' 
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

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            key="step0"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <TextField
              fullWidth
              label="Full Name"
              margin="normal"
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: isDark ? '#94a3b8' : '#64748b' }} />
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
              {...register('name', {
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
            />

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
              helperText={errors.password?.message || 'Must be at least 8 characters'}
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
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                }
              })}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              margin="normal"
              variant="outlined"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: isDark ? '#94a3b8' : '#64748b' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
            />
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            key="step1"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <TextField
              fullWidth
              label="Company Name"
              margin="normal"
              variant="outlined"
              error={!!errors.companyName}
              helperText={errors.companyName?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business sx={{ color: isDark ? '#94a3b8' : '#64748b' }} />
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
              {...register('companyName', {
                required: 'Company name is required',
                minLength: {
                  value: 2,
                  message: 'Company name must be at least 2 characters'
                }
              })}
            />

            <Autocomplete
              options={currencies}
              getOptionLabel={(option) => `${option.code} - ${option.name}`}
              loading={currencyLoading}
              defaultValue={currencies.find(c => c.code === 'USD')}
              onChange={(_, value) => setValue('baseCurrency', value?.code || 'USD')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Base Currency"
                  margin="normal"
                  variant="outlined"
                  error={!!errors.baseCurrency}
                  helperText={errors.baseCurrency?.message || 'This will be your company\'s default currency'}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney sx={{ color: isDark ? '#94a3b8' : '#64748b' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <>
                        {currencyLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
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
                />
              )}
              sx={{
                '& .MuiAutocomplete-listbox': {
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                },
                '& .MuiAutocomplete-option': {
                  color: isDark ? 'white' : 'black',
                },
              }}
            />

            <Box
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(25, 118, 210, 0.1)',
                borderRadius: 2,
                border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(25, 118, 210, 0.2)'}`
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: isDark ? '#3b82f6' : '#1976d2' }}>
                💡 Setup Complete!
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: isDark ? '#94a3b8' : '#64748b' }}>
                • You'll be the first admin user for your company
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: isDark ? '#94a3b8' : '#64748b' }}>
                • You can add more users and configure approval rules later
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: isDark ? '#94a3b8' : '#64748b' }}>
                • All expenses will be converted to your base currency
              </Typography>
            </Box>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(/signin-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        //   backgroundColor: isDark 
        //     ? 'rgba(17, 24, 39, 0.6)' 
        //     : 'rgba(255, 255, 255, 0.6)',
          zIndex: 1
        },
        py: 3
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
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
                Create Account
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: isDark ? '#D1D5DB' : '#6B7280',
                  fontWeight: 500,
                  mb: 2
                }}
              >
                Join ExpenseHub and streamline your expense management
              </Typography>
            </Box>

            {/* Stepper */}
            <Stepper 
              activeStep={activeStep} 
              sx={{ 
                mb: 4,
                '& .MuiStepConnector-root': {
                  borderColor: isDark ? 'rgba(156, 163, 175, 0.3)' : 'rgba(113, 75, 103, 0.2)',
                },
                '& .Mui-active .MuiStepConnector-line': {
                  borderColor: '#714B67',
                },
                '& .Mui-completed .MuiStepConnector-line': {
                  borderColor: '#714B67',
                },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': {
                        color: isDark ? '#D1D5DB' : '#6B7280',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        '&.Mui-active': {
                          color: '#714B67',
                          fontWeight: 700,
                        },
                        '&.Mui-completed': {
                          color: '#714B67',
                        },
                      },
                      '& .MuiStepIcon-root': {
                        color: isDark ? 'rgba(156, 163, 175, 0.5)' : 'rgba(113, 75, 103, 0.3)',
                        '&.Mui-active': {
                          color: '#714B67',
                        },
                        '&.Mui-completed': {
                          color: '#714B67',
                        },
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {renderStepContent(activeStep)}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{
                    color: '#714B67',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    '&:disabled': {
                      color: isDark ? '#6B7280' : '#9CA3AF',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(113, 75, 103, 0.08)',
                    },
                  }}
                >
                  Back
                </Button>

                {activeStep === steps.length - 1 ? (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isLoading}
                      sx={{
                        py: 2,
                        px: 4,
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
                        fontSize: '1rem',
                        fontFamily: 'Inter, sans-serif',
                        textTransform: 'none',
                        boxShadow: '0 4px 12px rgba(113, 75, 103, 0.3)',
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      {isLoading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{
                        py: 2,
                        px: 4,
                        background: 'linear-gradient(135deg, #714B67 0%, #8F6B84 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5A3B52 0%, #714B67 100%)',
                          boxShadow: '0 6px 20px rgba(113, 75, 103, 0.4)',
                          transform: 'translateY(-2px)',
                        },
                        borderRadius: 3,
                        fontWeight: 700,
                        fontSize: '1rem',
                        fontFamily: 'Inter, sans-serif',
                        textTransform: 'none',
                        boxShadow: '0 4px 12px rgba(113, 75, 103, 0.3)',
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      Next
                    </Button>
                  </motion.div>
                )}
              </Box>
            </form>

            {/* Link to Sign In */}
            <Divider sx={{ my: 4, borderColor: isDark ? 'rgba(156, 163, 175, 0.2)' : 'rgba(113, 75, 103, 0.2)' }} />
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{ 
                  color: isDark ? '#D1D5DB' : '#6B7280',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                }}
              >
                Already have an account?{' '}
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
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SignUp;