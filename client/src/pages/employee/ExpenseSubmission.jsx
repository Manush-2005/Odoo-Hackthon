import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Autocomplete,
  MenuItem,
  InputAdornment,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Paper,
  Container,
  Stack
} from '@mui/material';
import {
  Receipt,
  AttachMoney,
  CalendarToday,
  Category,
  Description,
  Upload,
  CheckCircle,
  ArrowBack,
  ArrowForward,
  CloudUpload
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { mockApi, currencyApi } from '../../utils/api';
import { formatCurrency } from '../../utils/helpers';

const ExpenseSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const { company } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const steps = ['Expense Details', 'Receipt Upload', 'Review & Submit'];

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  const buttonVariants = {
    hover: { scale: 1.02, y: -2 },
    tap: { scale: 0.98 }
  };

  const expenseCategories = [
    'Meals & Entertainment',
    'Travel',
    'Office Supplies',
    'Transportation',
    'Accommodation',
    'Telecommunications',
    'Training & Education',
    'Software & Subscriptions',
    'Marketing',
    'Other'
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    getValues
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      amount: '',
      currency: company?.baseCurrency || 'USD',
      category: '',
      date: new Date().toISOString().split('T')[0]
    }
  });

  const watchedAmount = watch('amount');
  const watchedCurrency = watch('currency');

  // Load currencies on component mount
  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        console.log('Loading currencies...');
        const currencyData = await currencyApi.getCountriesWithCurrencies();
        console.log('Currencies loaded:', currencyData.length, 'currencies');
        setCurrencies(currencyData);
      } catch (error) {
        console.error('Error loading currencies:', error);
        toast.error('Failed to load currency data');
      }
    };

    loadCurrencies();
  }, []);

  // Handle currency conversion when amount or currency changes
  useEffect(() => {
    const convertCurrency = async () => {
      if (company?.baseCurrency && watchedAmount && watchedCurrency && watchedCurrency !== company.baseCurrency) {
        try {
          const convertedValue = await currencyApi.convertCurrency(
            parseFloat(watchedAmount),
            watchedCurrency,
            company.baseCurrency
          );
          setConvertedAmount(convertedValue);
        } catch (error) {
          console.error('Error converting currency:', error);
        }
      }
    };

    convertCurrency();
  }, [watchedAmount, watchedCurrency, company?.baseCurrency]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const onSubmit = async (data) => {
    if (activeStep === steps.length - 1) {
      setLoading(true);
      try {
        // Prepare expense data
        const expenseData = {
          ...data,
          receiptFile: selectedFile ? selectedFile.name : null,
          convertedAmount: convertedAmount,
          baseCurrency: company?.baseCurrency || 'USD'
        };
        
        await mockApi.expenses.create(expenseData);
        toast.success('Expense submitted successfully!');
        navigate('/dashboard/employee');
      } catch (error) {
        console.error('Error submitting expense:', error);
        toast.error('Failed to submit expense');
      } finally {
        setLoading(false);
      }
    } else {
      handleNext();
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid size={{ xs: 12 }}>
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Controller
                    name="title"
                    control={control}
                    rules={{ required: 'Title is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Expense Title"
                        placeholder="Enter a descriptive title for your expense"
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Receipt sx={{ color: '#714B67' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: isDark ? 'rgba(113, 75, 103, 0.08)' : 'rgba(113, 75, 103, 0.04)',
                            borderRadius: 3,
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '& fieldset': {
                              borderColor: isDark ? 'rgba(113, 75, 103, 0.4)' : 'rgba(113, 75, 103, 0.3)',
                              borderWidth: '1.5px',
                            },
                            '&:hover fieldset': {
                              borderColor: '#714B67',
                              borderWidth: '2px',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#714B67',
                              borderWidth: '2px',
                              boxShadow: '0 0 0 3px rgba(113, 75, 103, 0.1)',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: isDark ? '#D1D5DB' : '#6B7280',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 500,
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            '&.Mui-focused': {
                              color: '#714B67',
                            },
                          },
                          '& .MuiInputBase-input': {
                            color: isDark ? '#FFFFFF' : '#141A29',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 500,
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            '&::placeholder': {
                              color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
                              opacity: 1,
                            },
                          },
                          '& .MuiFormHelperText-root': {
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.75rem',
                            mt: 1,
                          },
                        }}
                      />
                    )}
                  />
                </motion.div>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: 'Description is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        label="Description"
                        placeholder="Provide detailed information about this expense"
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Description sx={{ color: '#714B67', alignSelf: 'flex-start', mt: 1.5 }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: isDark ? 'rgba(113, 75, 103, 0.08)' : 'rgba(113, 75, 103, 0.04)',
                            borderRadius: 3,
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '& fieldset': {
                              borderColor: isDark ? 'rgba(113, 75, 103, 0.4)' : 'rgba(113, 75, 103, 0.3)',
                              borderWidth: '1.5px',
                            },
                            '&:hover fieldset': {
                              borderColor: '#714B67',
                              borderWidth: '2px',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#714B67',
                              borderWidth: '2px',
                              boxShadow: '0 0 0 3px rgba(113, 75, 103, 0.1)',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: isDark ? '#D1D5DB' : '#6B7280',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 500,
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            '&.Mui-focused': {
                              color: '#714B67',
                            },
                          },
                          '& .MuiInputBase-input': {
                            color: isDark ? '#FFFFFF' : '#141A29',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 500,
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            lineHeight: 1.6,
                            '&::placeholder': {
                              color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
                              opacity: 1,
                            },
                          },
                          '& .MuiFormHelperText-root': {
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.75rem',
                            mt: 1,
                          },
                        }}
                      />
                    )}
                  />
                </motion.div>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Controller
                    name="amount"
                    control={control}
                    rules={{ 
                      required: 'Amount is required',
                      pattern: {
                        value: /^\d+(\.\d{1,2})?$/,
                        message: 'Please enter a valid amount'
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Amount"
                        type="number"
                        placeholder="0.00"
                        error={!!errors.amount}
                        helperText={errors.amount?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AttachMoney sx={{ color: '#714B67' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: isDark ? 'rgba(113, 75, 103, 0.08)' : 'rgba(113, 75, 103, 0.04)',
                            borderRadius: 3,
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '& fieldset': {
                              borderColor: isDark ? 'rgba(113, 75, 103, 0.4)' : 'rgba(113, 75, 103, 0.3)',
                              borderWidth: '1.5px',
                            },
                            '&:hover fieldset': {
                              borderColor: '#714B67',
                              borderWidth: '2px',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#714B67',
                              borderWidth: '2px',
                              boxShadow: '0 0 0 3px rgba(113, 75, 103, 0.1)',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: isDark ? '#D1D5DB' : '#6B7280',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 500,
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            '&.Mui-focused': {
                              color: '#714B67',
                            },
                          },
                          '& .MuiInputBase-input': {
                            color: isDark ? '#FFFFFF' : '#141A29',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 500,
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            '&::placeholder': {
                              color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
                              opacity: 1,
                            },
                          },
                          '& .MuiFormHelperText-root': {
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.75rem',
                            mt: 1,
                          },
                        }}
                      />
                    )}
                  />
                </motion.div>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Controller
                    name="currency"
                    control={control}
                    rules={{ required: 'Currency is required' }}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={currencies || []}
                        getOptionLabel={(option) => {
                          if (!option || typeof option !== 'object') return '';
                          return `${option.currency || ''} - ${option.name || option.country || ''}`;
                        }}
                        getOptionKey={(option) => option?.currency || Math.random()}
                        value={currencies.find(c => c?.currency === field.value) || null}
                        onChange={(_, value) => field.onChange(value?.currency || '')}
                        loading={currencies.length === 0}
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {option.currency} - {option.symbol}
                              </Typography>
                              <Typography variant="caption" sx={{ color: isDark ? '#D1D5DB' : '#6B7280' }}>
                                {option.name} ({option.country})
                              </Typography>
                            </Box>
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Currency"
                            error={!!errors.currency}
                            helperText={errors.currency?.message}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {currencies.length === 0 ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: isDark ? 'rgba(113, 75, 103, 0.08)' : 'rgba(113, 75, 103, 0.04)',
                                borderRadius: 3,
                                fontSize: { xs: '0.875rem', md: '1rem' },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '& fieldset': {
                                  borderColor: isDark ? 'rgba(113, 75, 103, 0.4)' : 'rgba(113, 75, 103, 0.3)',
                                  borderWidth: '1.5px',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#714B67',
                                  borderWidth: '2px',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#714B67',
                                  borderWidth: '2px',
                                  boxShadow: '0 0 0 3px rgba(113, 75, 103, 0.1)',
                                },
                              },
                            }}
                          />
                        )}
                      />
                    )}
                  />
                </motion.div>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: 'Category is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label="Category"
                        error={!!errors.category}
                        helperText={errors.category?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Category sx={{ color: '#714B67' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: isDark ? 'rgba(113, 75, 103, 0.08)' : 'rgba(113, 75, 103, 0.04)',
                            borderRadius: 3,
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '& fieldset': {
                              borderColor: isDark ? 'rgba(113, 75, 103, 0.4)' : 'rgba(113, 75, 103, 0.3)',
                              borderWidth: '1.5px',
                            },
                            '&:hover fieldset': {
                              borderColor: '#714B67',
                              borderWidth: '2px',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#714B67',
                              borderWidth: '2px',
                              boxShadow: '0 0 0 3px rgba(113, 75, 103, 0.1)',
                            },
                          },
                        }}
                      >
                        {expenseCategories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </motion.div>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Controller
                    name="date"
                    control={control}
                    rules={{ required: 'Date is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Date"
                        type="date"
                        error={!!errors.date}
                        helperText={errors.date?.message}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarToday sx={{ color: '#714B67' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: isDark ? 'rgba(113, 75, 103, 0.08)' : 'rgba(113, 75, 103, 0.04)',
                            borderRadius: 3,
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '& fieldset': {
                              borderColor: isDark ? 'rgba(113, 75, 103, 0.4)' : 'rgba(113, 75, 103, 0.3)',
                              borderWidth: '1.5px',
                            },
                            '&:hover fieldset': {
                              borderColor: '#714B67',
                              borderWidth: '2px',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#714B67',
                              borderWidth: '2px',
                              boxShadow: '0 0 0 3px rgba(113, 75, 103, 0.1)',
                            },
                          },
                        }}
                      />
                    )}
                  />
                </motion.div>
              </Grid>

              {watchedAmount && watchedCurrency && company?.baseCurrency && watchedCurrency !== company.baseCurrency && (
                <Grid size={{ xs: 12 }}>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert 
                      severity="info" 
                      sx={{ 
                        backgroundColor: isDark ? 'rgba(29, 78, 216, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                        color: isDark ? '#93C5FD' : '#1E40AF',
                        '& .MuiAlert-icon': {
                          color: isDark ? '#93C5FD' : '#1E40AF'
                        }
                      }}
                    >
                      Converted amount: {formatCurrency(convertedAmount, company.baseCurrency)}
                    </Alert>
                  </motion.div>
                </Grid>
              )}
            </Grid>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid size={{ xs: 12 }}>
                <Paper
                  sx={{
                    border: `2px dashed ${isDark ? 'rgba(113, 75, 103, 0.5)' : 'rgba(113, 75, 103, 0.3)'}`,
                    borderRadius: 3,
                    p: 4,
                    backgroundColor: isDark ? 'rgba(113, 75, 103, 0.05)' : 'rgba(113, 75, 103, 0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#714B67',
                      backgroundColor: isDark ? 'rgba(113, 75, 103, 0.1)' : 'rgba(113, 75, 103, 0.05)',
                    }
                  }}
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <Box textAlign="center">
                    <CloudUpload
                      sx={{
                        fontSize: 64,
                        color: '#714B67',
                        mb: 2
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        color: isDark ? '#FFFFFF' : '#141A29',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600
                      }}
                    >
                      Upload Receipt
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDark ? '#D1D5DB' : '#6B7280',
                        fontFamily: 'Inter, sans-serif',
                        mb: 2
                      }}
                    >
                      Click to upload or drag and drop your receipt here
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: isDark ? '#9CA3AF' : '#9CA3AF',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      Supported formats: JPG, PNG, PDF (Max 10MB)
                    </Typography>
                  </Box>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </Paper>
              </Grid>

              {selectedFile && (
                <Grid size={{ xs: 12 }}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert
                      severity="success"
                      sx={{
                        backgroundColor: isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                        color: isDark ? '#4ADE80' : '#16A34A',
                        '& .MuiAlert-icon': {
                          color: isDark ? '#4ADE80' : '#16A34A'
                        }
                      }}
                    >
                      File uploaded successfully: {selectedFile.name}
                    </Alert>
                  </motion.div>
                </Grid>
              )}
            </Grid>
          </motion.div>
        );

      case 2: {
        const formData = getValues();
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid size={{ xs: 12 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    color: isDark ? '#FFFFFF' : '#141A29',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600
                  }}
                >
                  Review Your Expense
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ p: 2, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: isDark ? '#D1D5DB' : '#6B7280', mb: 1 }}>Title</Typography>
                  <Typography variant="body1" sx={{ color: isDark ? '#FFFFFF' : '#141A29', fontWeight: 500 }}>{formData.title}</Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ p: 2, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: isDark ? '#D1D5DB' : '#6B7280', mb: 1 }}>Amount</Typography>
                  <Typography variant="body1" sx={{ color: isDark ? '#FFFFFF' : '#141A29', fontWeight: 500 }}>{formatCurrency(formData.amount, formData.currency)}</Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ p: 2, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: isDark ? '#D1D5DB' : '#6B7280', mb: 1 }}>Category</Typography>
                  <Typography variant="body1" sx={{ color: isDark ? '#FFFFFF' : '#141A29', fontWeight: 500 }}>{formData.category}</Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ p: 2, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: isDark ? '#D1D5DB' : '#6B7280', mb: 1 }}>Date</Typography>
                  <Typography variant="body1" sx={{ color: isDark ? '#FFFFFF' : '#141A29', fontWeight: 500 }}>{formData.date}</Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ p: 2, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: isDark ? '#D1D5DB' : '#6B7280', mb: 1 }}>Description</Typography>
                  <Typography variant="body1" sx={{ color: isDark ? '#FFFFFF' : '#141A29', fontWeight: 500 }}>{formData.description}</Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ p: 2, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: isDark ? '#D1D5DB' : '#6B7280', mb: 1 }}>Receipt</Typography>
                  <Typography variant="body1" sx={{ color: isDark ? '#FFFFFF' : '#141A29', fontWeight: 500 }}>
                    {selectedFile ? selectedFile.name : 'No receipt uploaded'}
                  </Typography>
                </Box>
              </Grid>

              {watchedAmount && watchedCurrency && company?.baseCurrency && watchedCurrency !== company.baseCurrency && (
                <Grid size={{ xs: 12 }}>
                  <Alert 
                    severity="info" 
                    sx={{ 
                      backgroundColor: isDark ? 'rgba(29, 78, 216, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      color: isDark ? '#93C5FD' : '#1E40AF',
                      '& .MuiAlert-icon': {
                        color: isDark ? '#93C5FD' : '#1E40AF'
                      }
                    }}
                  >
                    Converted amount (Company Currency): {formatCurrency(convertedAmount, company.baseCurrency)}
                  </Alert>
                </Grid>
              )}
            </Grid>
          </motion.div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            mb: { xs: 3, md: 4 },
            textAlign: 'center'
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: isDark ? '#FFFFFF' : '#141A29',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              mb: 2
            }}
          >
            Submit New Expense
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: isDark ? '#D1D5DB' : '#6B7280',
              fontFamily: 'Inter, sans-serif',
              fontSize: { xs: '0.875rem', md: '1rem' },
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Fill out the form below to submit your expense for approval
          </Typography>
        </Box>

        <Card
          sx={{
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
            borderRadius: 4,
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stepper
              activeStep={activeStep}
              sx={{
                mb: 4,
                '& .MuiStepLabel-root': {
                  '& .MuiStepLabel-label': {
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    color: isDark ? '#D1D5DB' : '#6B7280',
                    '&.Mui-active': {
                      color: '#714B67',
                      fontWeight: 600
                    },
                    '&.Mui-completed': {
                      color: isDark ? '#4ADE80' : '#16A34A',
                      fontWeight: 600
                    }
                  }
                },
                '& .MuiStepIcon-root': {
                  color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                  '&.Mui-active': {
                    color: '#714B67'
                  },
                  '&.Mui-completed': {
                    color: isDark ? '#4ADE80' : '#16A34A'
                  }
                }
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleSubmit(onSubmit)}>
                  {renderStepContent(activeStep)}

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 4,
                      pt: 3,
                      borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`
                    }}
                  >
                    <motion.div
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Button
                        variant="outlined"
                        onClick={activeStep === 0 ? () => navigate('/dashboard/employee') : handleBack}
                        startIcon={<ArrowBack />}
                        sx={{
                          borderColor: '#714B67',
                          color: '#714B67',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          px: 3,
                          py: 1.5,
                          borderRadius: 3,
                          fontSize: { xs: '0.875rem', md: '1rem' },
                          '&:hover': {
                            borderColor: '#714B67',
                            backgroundColor: 'rgba(113, 75, 103, 0.05)'
                          }
                        }}
                      >
                        {activeStep === 0 ? 'Cancel' : 'Back'}
                      </Button>
                    </motion.div>

                    <motion.div
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        endIcon={loading ? <CircularProgress size={20} color="inherit" /> : 
                                activeStep === steps.length - 1 ? <CheckCircle /> : <ArrowForward />}
                        sx={{
                          backgroundColor: '#714B67',
                          color: '#FFFFFF',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          px: 3,
                          py: 1.5,
                          borderRadius: 3,
                          fontSize: { xs: '0.875rem', md: '1rem' },
                          '&:hover': {
                            backgroundColor: '#5D3A52'
                          },
                          '&:disabled': {
                            backgroundColor: 'rgba(113, 75, 103, 0.5)',
                            color: 'rgba(255, 255, 255, 0.7)'
                          }
                        }}
                      >
                        {loading ? 'Submitting...' : 
                         activeStep === steps.length - 1 ? 'Submit Expense' : 'Next'}
                      </Button>
                    </motion.div>
                  </Box>
                </form>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </Container>
    </motion.div>
  );
};

export default ExpenseSubmission;