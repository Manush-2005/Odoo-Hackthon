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
  Chip
} from '@mui/material';
import {
  Receipt,
  AttachMoney,
  CalendarToday,
  Category,
  Description,
  Upload,
  CheckCircle
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { mockApi, currencyApi } from '../../utils/api';
import { formatCurrency } from '../../utils/helpers';

const ExpenseSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const { user, company } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const steps = ['Expense Details', 'Receipt Upload', 'Review & Submit'];

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
    setValue,
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

  // Load currencies and exchange rates
  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const currencyData = await currencyApi.getCountriesWithCurrencies();
        setCurrencies(currencyData);
        
        if (company?.baseCurrency) {
          const rates = await currencyApi.getExchangeRates(company.baseCurrency);
          setExchangeRates(rates);
        }
      } catch (error) {
        console.error('Error loading currencies:', error);
      }
    };
    
    loadCurrencies();
  }, [company?.baseCurrency]);

  // Convert currency when amount or currency changes
  useEffect(() => {
    const convertCurrency = async () => {
      if (watchedAmount && watchedCurrency && company?.baseCurrency) {
        try {
          const converted = await currencyApi.convertCurrency(
            parseFloat(watchedAmount),
            watchedCurrency,
            company.baseCurrency
          );
          setConvertedAmount(converted);
        } catch (error) {
          console.error('Error converting currency:', error);
          setConvertedAmount(parseFloat(watchedAmount) || 0);
        }
      }
    };

    if (watchedAmount && watchedCurrency) {
      convertCurrency();
    }
  }, [watchedAmount, watchedCurrency, company?.baseCurrency]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image (JPEG, PNG) or PDF file');
        return;
      }

      setSelectedFile(file);
      toast.success('Receipt uploaded successfully!');
    }
  };

  const validateStep = (step) => {
    const values = getValues();
    
    switch (step) {
      case 0:
        return values.title && values.description && values.amount && values.currency && values.category && values.date;
      case 1:
        return selectedFile !== null;
      case 2:
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Simulate file upload
      let receiptUrl = '/mock-receipt.jpg';
      if (selectedFile) {
        // In real app, upload file to server/cloud storage
        console.log('Uploading file:', selectedFile.name);
        receiptUrl = `/uploads/${selectedFile.name}`;
      }

      const expenseData = {
        title: data.title,
        description: data.description,
        amount: parseFloat(data.amount),
        currency: data.currency,
        convertedAmount: convertedAmount,
        baseCurrency: company.baseCurrency,
        category: data.category,
        date: data.date,
        receiptUrl: receiptUrl,
        submittedBy: {
          id: user.id,
          name: user.name
        }
      };

      await mockApi.expenses.create(expenseData);
      
      toast.success('Expense submitted successfully!');
      navigate('/employee');
    } catch (error) {
      console.error('Error submitting expense:', error);
      toast.error('Failed to submit expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    const values = getValues();

    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Expense Title"
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
                        fontFamily: 'Inter, sans-serif',
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                rules={{ required: 'Description is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Description sx={{ color: '#714B67', alignSelf: 'flex-start', mt: 1 }} />
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
                        fontFamily: 'Inter, sans-serif',
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
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
                        fontFamily: 'Inter, sans-serif',
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="currency"
                control={control}
                rules={{ required: 'Currency is required' }}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={currencies}
                    getOptionLabel={(option) => `${option.code} - ${option.name}`}
                    value={currencies.find(c => c.code === field.value) || null}
                    onChange={(_, value) => field.onChange(value?.code || '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Currency"
                        error={!!errors.currency}
                        helperText={errors.currency?.message}
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
                            fontFamily: 'Inter, sans-serif',
                          },
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="category"
                control={control}
                rules={{ required: 'Category is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
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
                        fontFamily: 'Inter, sans-serif',
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
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="date"
                control={control}
                rules={{ required: 'Date is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label="Date"
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
                        fontFamily: 'Inter, sans-serif',
                      },
                    }}
                  />
                )}
              />
            </Grid>

            {/* Currency Conversion Info */}
            {watchedAmount && watchedCurrency && company?.baseCurrency && watchedCurrency !== company.baseCurrency && (
              <Grid item xs={12}>
                <Alert
                  severity="info"
                  sx={{
                    backgroundColor: isDark ? 'rgba(113, 75, 103, 0.1)' : 'rgba(113, 75, 103, 0.1)',
                    border: `1px solid rgba(113, 75, 103, 0.2)`,
                    color: '#714B67',
                    '& .MuiAlert-icon': {
                      color: '#714B67',
                    }
                  }}
                >
                  <Typography variant="body2">
                    <strong>Currency Conversion:</strong> {formatCurrency(parseFloat(watchedAmount), watchedCurrency)} 
                    {' → '} {formatCurrency(convertedAmount, company.baseCurrency)}
                  </Typography>
                </Alert>
              </Grid>
            )}
          </Grid>
        );

      case 1:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                border: `2px dashed ${isDark ? 'rgba(148, 163, 184, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`,
                borderRadius: 2,
                p: 4,
                mb: 3,
                backgroundColor: isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: isDark ? '#3b82f6' : '#1976d2',
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(25, 118, 210, 0.1)',
                }
              }}
              onClick={() => document.getElementById('receipt-upload').click()}
            >
              <input
                id="receipt-upload"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              
              {selectedFile ? (
                <Box>
                  <CheckCircle sx={{ fontSize: 48, color: '#10b981', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: isDark ? 'white' : 'black', mb: 1 }}>
                    Receipt Uploaded!
                  </Typography>
                  <Chip
                    label={selectedFile.name}
                    sx={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </Box>
              ) : (
                <Box>
                  <Upload sx={{ fontSize: 48, color: isDark ? '#94a3b8' : '#64748b', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: isDark ? 'white' : 'black', mb: 1 }}>
                    Upload Receipt
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                    Click to browse or drag and drop your receipt
                  </Typography>
                  <Typography variant="caption" sx={{ color: isDark ? '#64748b' : '#9ca3af', mt: 1, display: 'block' }}>
                    Supported formats: JPEG, PNG, PDF (Max 5MB)
                  </Typography>
                </Box>
              )}
            </Box>

            <Alert
              severity="warning"
              sx={{
                backgroundColor: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(237, 137, 54, 0.1)',
                border: `1px solid ${isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(237, 137, 54, 0.2)'}`,
                color: isDark ? '#f59e0b' : '#ed8936'
              }}
            >
              <Typography variant="body2">
                Please ensure your receipt is clear and legible. All expenses require receipt verification for approval.
              </Typography>
            </Alert>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ color: isDark ? 'white' : 'black', mb: 3 }}>
              Review Your Expense
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    background: isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: isDark ? 'white' : 'black' }}>
                      Expense Details
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>Title:</Typography>
                      <Typography variant="body2" sx={{ color: isDark ? 'white' : 'black', fontWeight: 600 }}>
                        {values.title}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>Amount:</Typography>
                      <Typography variant="body2" sx={{ color: isDark ? 'white' : 'black', fontWeight: 600 }}>
                        {formatCurrency(parseFloat(values.amount), values.currency)}
                      </Typography>
                    </Box>
                    
                    {values.currency !== company?.baseCurrency && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>Converted:</Typography>
                        <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                          {formatCurrency(convertedAmount, company.baseCurrency)}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>Category:</Typography>
                      <Typography variant="body2" sx={{ color: isDark ? 'white' : 'black', fontWeight: 600 }}>
                        {values.category}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>Date:</Typography>
                      <Typography variant="body2" sx={{ color: isDark ? 'white' : 'black', fontWeight: 600 }}>
                        {new Date(values.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    background: isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: isDark ? 'white' : 'black' }}>
                      Receipt & Description
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 1 }}>
                        Description:
                      </Typography>
                      <Typography variant="body2" sx={{ color: isDark ? 'white' : 'black' }}>
                        {values.description}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 1 }}>
                        Receipt:
                      </Typography>
                      {selectedFile ? (
                        <Chip
                          icon={<CheckCircle />}
                          label={selectedFile.name}
                          sx={{
                            backgroundColor: '#10b981',
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                      ) : (
                        <Typography variant="body2" sx={{ color: '#ef4444' }}>
                          No receipt uploaded
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
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
          Submit Expense
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: isDark ? '#D1D5DB' : '#6B7280',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
          }}
        >
          Create a new expense report for approval
        </Typography>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              sx={{
                '& .MuiStepLabel-label': {
                  color: isDark ? '#D1D5DB' : '#6B7280',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  '&.Mui-active': {
                    color: '#714B67',
                    fontWeight: 600,
                  },
                  '&.Mui-completed': {
                    color: '#714B67',
                    fontWeight: 600,
                  },
                },
                '& .MuiStepIcon-root': {
                  color: isDark ? 'rgba(113, 75, 103, 0.3)' : 'rgba(113, 75, 103, 0.2)',
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

      {/* Form Content */}
      <Card
        sx={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          borderRadius: 3
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent(activeStep)}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{
                  color: isDark ? '#94a3b8' : '#64748b',
                  '&:disabled': {
                    color: isDark ? '#475569' : '#bdbdbd',
                  },
                }}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !selectedFile}
                  sx={{
                    py: 1.5,
                    px: 4,
                    backgroundColor: isDark ? '#3b82f6' : '#1976d2',
                    '&:hover': {
                      backgroundColor: isDark ? '#2563eb' : '#1565c0',
                    },
                    borderRadius: 2,
                    fontWeight: 600
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Submit Expense'
                  )}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    py: 1.5,
                    px: 4,
                    backgroundColor: isDark ? '#3b82f6' : '#1976d2',
                    '&:hover': {
                      backgroundColor: isDark ? '#2563eb' : '#1565c0',
                    },
                    borderRadius: 2,
                    fontWeight: 600
                  }}
                >
                  Next
                </Button>
              )}
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ExpenseSubmission;