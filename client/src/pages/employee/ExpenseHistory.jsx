import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Avatar
} from '@mui/material';
import {
  Search,
  FilterList,
  GetApp,
  Visibility,
  ArrowBack,
  Receipt,
  AttachMoney,
  CheckCircle,
  Cancel,
  Schedule
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatDate } from '../../utils/helpers';

const ExpenseHistory = () => {
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);

  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Mock expense data
  const [expenses] = useState([
    {
      id: 1,
      title: 'Business Lunch with Client',
      category: 'meals',
      amount: 85.50,
      currency: 'USD',
      date: '2024-01-15',
      status: 'approved',
      approvedBy: 'John Manager',
      description: 'Lunch meeting with potential client to discuss project requirements',
      receipt: 'receipt_001.pdf',
      merchant: 'The Business Bistro',
      approvedDate: '2024-01-16'
    },
    {
      id: 2,
      title: 'Software License',
      category: 'software',
      amount: 299.99,
      currency: 'USD',
      date: '2024-01-10',
      status: 'pending',
      description: 'Annual license for design software',
      receipt: 'receipt_002.pdf',
      merchant: 'SoftwareCorp Inc.',
      submittedDate: '2024-01-10'
    },
    {
      id: 3,
      title: 'Conference Travel',
      category: 'travel',
      amount: 450.00,
      currency: 'USD',
      date: '2024-01-05',
      status: 'rejected',
      rejectedBy: 'Sarah Admin',
      description: 'Flight tickets for tech conference',
      receipt: 'receipt_003.pdf',
      merchant: 'Airlines Co.',
      rejectedDate: '2024-01-06',
      rejectionReason: 'Conference not pre-approved'
    },
    {
      id: 4,
      title: 'Office Supplies',
      category: 'office',
      amount: 67.25,
      currency: 'USD',
      date: '2024-01-08',
      status: 'approved',
      approvedBy: 'John Manager',
      description: 'Notebooks, pens, and sticky notes',
      receipt: 'receipt_004.pdf',
      merchant: 'Office Depot',
      approvedDate: '2024-01-09'
    },
    {
      id: 5,
      title: 'Hotel Accommodation',
      category: 'travel',
      amount: 180.00,
      currency: 'USD',
      date: '2024-01-12',
      status: 'approved',
      approvedBy: 'John Manager',
      description: 'Hotel stay for client meeting',
      receipt: 'receipt_005.pdf',
      merchant: 'Grand Hotel',
      approvedDate: '2024-01-13'
    },
    {
      id: 6,
      title: 'Taxi Fare',
      category: 'travel',
      amount: 25.75,
      currency: 'USD',
      date: '2024-01-14',
      status: 'pending',
      description: 'Airport to hotel transportation',
      receipt: 'receipt_006.pdf',
      merchant: 'City Cab Service',
      submittedDate: '2024-01-14'
    }
  ]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'travel', label: 'Travel' },
    { value: 'meals', label: 'Meals' },
    { value: 'office', label: 'Office Supplies' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'software', label: 'Software' },
    { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  // Filter expenses based on search and filters
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    const matchesDateRange = (!startDate || new Date(expense.date) >= startDate) &&
                            (!endDate || new Date(expense.date) <= endDate);
    
    return matchesSearch && matchesStatus && matchesCategory && matchesDateRange;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle fontSize="small" />;
      case 'pending': return <Schedule fontSize="small" />;
      case 'rejected': return <Cancel fontSize="small" />;
      default: return <Schedule fontSize="small" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'travel': return '#3b82f6';
      case 'meals': return '#10b981';
      case 'office': return '#f59e0b';
      case 'equipment': return '#ef4444';
      case 'software': return '#8b5cf6';
      default: return '#64748b';
    }
  };

  const handleViewExpense = (expense) => {
    setSelectedExpense(expense);
    setViewDialog(true);
  };

  const handleExport = () => {
    // Simulate CSV export
    const csvData = filteredExpenses.map(expense => ({
      'Expense ID': expense.id,
      'Title': expense.title,
      'Category': expense.category,
      'Amount': expense.amount,
      'Currency': expense.currency,
      'Date': expense.date,
      'Status': expense.status,
      'Description': expense.description,
      'Merchant': expense.merchant
    }));
    
    console.log('Exporting expenses:', csvData);
    // Here you would implement actual CSV download
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setStartDate(null);
    setEndDate(null);
  };

  // Calculate stats
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const approvedExpenses = filteredExpenses.filter(e => e.status === 'approved').length;
  const pendingExpenses = filteredExpenses.filter(e => e.status === 'pending').length;
  const rejectedExpenses = filteredExpenses.filter(e => e.status === 'rejected').length;

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={() => navigate('/employee')}
              sx={{ mr: 2, color: '#714B67' }}
            >
              <ArrowBack />
            </IconButton>
            <Box>
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
                Expense History
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: isDark ? '#D1D5DB' : '#6B7280',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                }}
              >
                View and track all your submitted expenses
              </Typography>
            </Box>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<GetApp />}
            onClick={handleExport}
            sx={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
              },
              borderRadius: 2,
              px: 3,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              transition: 'all 0.3s ease',
            }}
          >
            Export
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
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
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      backgroundColor: '#3b82f620',
                      color: '#3b82f6',
                      mr: 2
                    }}
                  >
                    <AttachMoney />
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                    >
                      Total Amount
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: isDark ? 'white' : 'black'
                      }}
                    >
                      {formatCurrency(totalExpenses, 'USD')}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
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
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      backgroundColor: '#10b98120',
                      color: '#10b981',
                      mr: 2
                    }}
                  >
                    <CheckCircle />
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                    >
                      Approved
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: isDark ? 'white' : 'black'
                      }}
                    >
                      {approvedExpenses}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
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
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      backgroundColor: '#f59e0b20',
                      color: '#f59e0b',
                      mr: 2
                    }}
                  >
                    <Schedule />
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                    >
                      Pending
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: isDark ? 'white' : 'black'
                      }}
                    >
                      {pendingExpenses}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
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
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      backgroundColor: '#ef444420',
                      color: '#ef4444',
                      mr: 2
                    }}
                  >
                    <Cancel />
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                    >
                      Rejected
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: isDark ? 'white' : 'black'
                      }}
                    >
                      {rejectedExpenses}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Card
          sx={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            borderRadius: 3,
            mb: 3
          }}
        >
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: isDark ? '#94a3b8' : '#64748b' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    },
                    '& .MuiInputBase-input': {
                      color: isDark ? 'white' : 'black',
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                    sx={{
                      backgroundColor: isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      color: isDark ? 'white' : 'black',
                    }}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    label="Category"
                    sx={{
                      backgroundColor: isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      color: isDark ? 'white' : 'black',
                    }}
                  >
                    {categories.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(0, 0, 0, 0.02)',
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
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(0, 0, 0, 0.02)',
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
                />
              </Grid>

              <Grid item xs={12} md={1}>
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  startIcon={<FilterList />}
                  sx={{
                    borderColor: isDark ? '#94a3b8' : '#64748b',
                    color: isDark ? '#94a3b8' : '#64748b',
                    '&:hover': {
                      borderColor: isDark ? 'white' : 'black',
                      color: isDark ? 'white' : 'black',
                    }
                  }}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Expenses Table */}
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
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    '& .MuiTableCell-head': {
                      backgroundColor: isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      color: isDark ? '#94a3b8' : '#64748b',
                      fontWeight: 600,
                      borderBottom: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
                    }
                  }}
                >
                  <TableCell>Expense</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow
                    key={expense.id}
                    sx={{
                      '& .MuiTableCell-body': {
                        color: isDark ? 'white' : 'black',
                        borderBottom: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
                      },
                      '&:hover': {
                        backgroundColor: isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(0, 0, 0, 0.02)'
                      }
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            mr: 2,
                            backgroundColor: '#3b82f620',
                            color: '#3b82f6',
                            width: 40,
                            height: 40
                          }}
                        >
                          <Receipt />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {expense.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                          >
                            {expense.merchant}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={categories.find(c => c.value === expense.category)?.label || expense.category}
                        size="small"
                        sx={{
                          backgroundColor: `${getCategoryColor(expense.category)}20`,
                          color: getCategoryColor(expense.category),
                          border: `1px solid ${getCategoryColor(expense.category)}40`,
                          fontWeight: 600
                        }}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(expense.amount, expense.currency)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(expense.date)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                        size="small"
                        icon={getStatusIcon(expense.status)}
                        sx={{
                          backgroundColor: `${getStatusColor(expense.status)}20`,
                          color: getStatusColor(expense.status),
                          border: `1px solid ${getStatusColor(expense.status)}40`,
                          fontWeight: 600,
                          '& .MuiChip-icon': {
                            color: getStatusColor(expense.status)
                          }
                        }}
                      />
                    </TableCell>
                    
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleViewExpense(expense)}
                        sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* View Expense Dialog */}
        <Dialog
          open={viewDialog}
          onClose={() => setViewDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              color: isDark ? 'white' : 'black'
            }
          }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  mr: 2,
                  backgroundColor: '#3b82f620',
                  color: '#3b82f6'
                }}
              >
                <Receipt />
              </Avatar>
              Expense Details
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedExpense && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 1 }}>
                    Title
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                    {selectedExpense.title}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 1 }}>
                    Amount
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                    {formatCurrency(selectedExpense.amount, selectedExpense.currency)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 1 }}>
                    Category
                  </Typography>
                  <Chip
                    label={categories.find(c => c.value === selectedExpense.category)?.label || selectedExpense.category}
                    size="small"
                    sx={{
                      backgroundColor: `${getCategoryColor(selectedExpense.category)}20`,
                      color: getCategoryColor(selectedExpense.category),
                      border: `1px solid ${getCategoryColor(selectedExpense.category)}40`,
                      fontWeight: 600,
                      mb: 2
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 1 }}>
                    Status
                  </Typography>
                  <Chip
                    label={selectedExpense.status.charAt(0).toUpperCase() + selectedExpense.status.slice(1)}
                    size="small"
                    icon={getStatusIcon(selectedExpense.status)}
                    sx={{
                      backgroundColor: `${getStatusColor(selectedExpense.status)}20`,
                      color: getStatusColor(selectedExpense.status),
                      border: `1px solid ${getStatusColor(selectedExpense.status)}40`,
                      fontWeight: 600,
                      mb: 2,
                      '& .MuiChip-icon': {
                        color: getStatusColor(selectedExpense.status)
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 1 }}>
                    Date
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                    {formatDate(selectedExpense.date)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 1 }}>
                    Merchant
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                    {selectedExpense.merchant}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 1 }}>
                    Description
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedExpense.description}
                  </Typography>
                </Grid>

                {selectedExpense.status === 'approved' && (
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 1 }}>
                      Approved By
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#10b981', mb: 1 }}>
                      {selectedExpense.approvedBy}
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                      on {formatDate(selectedExpense.approvedDate)}
                    </Typography>
                  </Grid>
                )}

                {selectedExpense.status === 'rejected' && (
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 1 }}>
                      Rejected By
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#ef4444', mb: 1 }}>
                      {selectedExpense.rejectedBy}
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 2 }}>
                      on {formatDate(selectedExpense.rejectedDate)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 1 }}>
                      Reason
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#ef4444' }}>
                      {selectedExpense.rejectionReason}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setViewDialog(false)}
              sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default ExpenseHistory;