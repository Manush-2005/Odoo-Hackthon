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
  Avatar,
  Divider
} from '@mui/material';
import {
  Search,
  Visibility,
  CheckCircle,
  Cancel,
  ArrowBack,
  Receipt,
  AttachMoney,
  Schedule,
  Group,
  FilterList
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatDate } from '../../utils/helpers';

const PendingApprovals = () => {
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [amountFilter, setAmountFilter] = useState('all');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [actionDialog, setActionDialog] = useState({ open: false, expense: null, action: null });
  const [rejectionReason, setRejectionReason] = useState('');

  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Mock pending expenses data
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      title: 'Software License Renewal',
      category: 'software',
      amount: 299.99,
      currency: 'USD',
      date: '2024-01-15',
      submittedDate: '2024-01-15',
      employee: {
        name: 'John Doe',
        email: 'john.doe@company.com',
        avatar: '/api/placeholder/32/32'
      },
      description: 'Annual renewal for Adobe Creative Suite license for design team',
      receipt: 'receipt_001.pdf',
      merchant: 'Adobe Systems',
      urgency: 'medium'
    },
    {
      id: 2,
      title: 'Client Meeting Lunch',
      category: 'meals',
      amount: 125.75,
      currency: 'USD',
      date: '2024-01-14',
      submittedDate: '2024-01-14',
      employee: {
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        avatar: '/api/placeholder/32/32'
      },
      description: 'Business lunch with potential client to discuss Q2 project requirements',
      receipt: 'receipt_002.pdf',
      merchant: 'The Executive Grill',
      urgency: 'low'
    },
    {
      id: 3,
      title: 'Conference Registration',
      category: 'travel',
      amount: 850.00,
      currency: 'USD',
      date: '2024-01-13',
      submittedDate: '2024-01-13',
      employee: {
        name: 'Mike Johnson',
        email: 'mike.johnson@company.com',
        avatar: '/api/placeholder/32/32'
      },
      description: 'Registration fee for TechCon 2024 - networking and learning opportunity',
      receipt: 'receipt_003.pdf',
      merchant: 'TechCon Events',
      urgency: 'high'
    },
    {
      id: 4,
      title: 'Office Supplies',
      category: 'office',
      amount: 67.50,
      currency: 'USD',
      date: '2024-01-12',
      submittedDate: '2024-01-12',
      employee: {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@company.com',
        avatar: '/api/placeholder/32/32'
      },
      description: 'Whiteboard markers, sticky notes, and presentation folders',
      receipt: 'receipt_004.pdf',
      merchant: 'Staples',
      urgency: 'low'
    },
    {
      id: 5,
      title: 'Equipment Purchase',
      category: 'equipment',
      amount: 1250.00,
      currency: 'USD',
      date: '2024-01-11',
      submittedDate: '2024-01-11',
      employee: {
        name: 'David Chen',
        email: 'david.chen@company.com',
        avatar: '/api/placeholder/32/32'
      },
      description: 'New monitor and wireless keyboard for development workstation',
      receipt: 'receipt_005.pdf',
      merchant: 'Best Buy Business',
      urgency: 'medium'
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

  const amountRanges = [
    { value: 'all', label: 'All Amounts' },
    { value: '0-100', label: '$0 - $100' },
    { value: '100-500', label: '$100 - $500' },
    { value: '500-1000', label: '$500 - $1000' },
    { value: '1000+', label: '$1000+' }
  ];

  // Filter expenses
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    
    let matchesAmount = true;
    if (amountFilter !== 'all') {
      const [min, max] = amountFilter.split('-').map(v => v === '+' ? Infinity : parseInt(v));
      matchesAmount = expense.amount >= min && (max ? expense.amount <= max : true);
    }
    
    return matchesSearch && matchesCategory && matchesAmount;
  });

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

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  };

  const handleViewExpense = (expense) => {
    setSelectedExpense(expense);
    setViewDialog(true);
  };

  const handleAction = (expense, action) => {
    setActionDialog({ open: true, expense, action });
    setRejectionReason('');
  };

  const handleConfirmAction = async () => {
    try {
      const { expense, action } = actionDialog;
      
      if (action === 'approve') {
        setExpenses(prev => prev.filter(e => e.id !== expense.id));
        toast.success(`Expense "${expense.title}" approved successfully!`);
      } else if (action === 'reject') {
        if (!rejectionReason.trim()) {
          toast.error('Please provide a reason for rejection');
          return;
        }
        setExpenses(prev => prev.filter(e => e.id !== expense.id));
        toast.success(`Expense "${expense.title}" rejected successfully!`);
      }
      
      setActionDialog({ open: false, expense: null, action: null });
    } catch (error) {
      console.error('Error processing action:', error);
      toast.error('Failed to process expense action');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setAmountFilter('all');
  };

  // Calculate stats
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const highUrgencyCount = filteredExpenses.filter(e => e.urgency === 'high').length;
  const uniqueEmployees = new Set(filteredExpenses.map(e => e.employee.email)).size;

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={() => navigate('/manager')}
            sx={{ mr: 2, color: isDark ? '#94a3b8' : '#64748b' }}
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
              Pending Approvals
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: isDark ? '#D1D5DB' : '#6B7280',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
              }}
            >
              Review and approve team expense submissions
            </Typography>
          </Box>
        </Box>
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
                    {filteredExpenses.length}
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
                    {formatCurrency(totalAmount, 'USD')}
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
                  <Receipt />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                  >
                    High Priority
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: isDark ? 'white' : 'black'
                    }}
                  >
                    {highUrgencyCount}
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
                  <Group />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                  >
                    Employees
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: isDark ? 'white' : 'black'
                    }}
                  >
                    {uniqueEmployees}
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
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search expenses or employees..."
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

            <Grid item xs={12} sm={6} md={3}>
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

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>Amount</InputLabel>
                <Select
                  value={amountFilter}
                  onChange={(e) => setAmountFilter(e.target.value)}
                  label="Amount"
                  sx={{
                    backgroundColor: isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    color: isDark ? 'white' : 'black',
                  }}
                >
                  {amountRanges.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
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
                <TableCell>Employee</TableCell>
                <TableCell>Expense</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Urgency</TableCell>
                <TableCell>Date</TableCell>
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
                          width: 32,
                          height: 32
                        }}
                      >
                        {expense.employee.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {expense.employee.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                        >
                          {expense.employee.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
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
                    <Chip
                      label={expense.urgency.charAt(0).toUpperCase() + expense.urgency.slice(1)}
                      size="small"
                      sx={{
                        backgroundColor: `${getUrgencyColor(expense.urgency)}20`,
                        color: getUrgencyColor(expense.urgency),
                        border: `1px solid ${getUrgencyColor(expense.urgency)}40`,
                        fontWeight: 600
                      }}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(expense.date)}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewExpense(expense)}
                        sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleAction(expense, 'approve')}
                        sx={{ color: '#10b981' }}
                      >
                        <CheckCircle fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleAction(expense, 'reject')}
                        sx={{ color: '#ef4444' }}
                      >
                        <Cancel fontSize="small" />
                      </IconButton>
                    </Box>
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
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      mr: 2,
                      backgroundColor: '#3b82f620',
                      color: '#3b82f6',
                      width: 48,
                      height: 48
                    }}
                  >
                    {selectedExpense.employee.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {selectedExpense.employee.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                    >
                      {selectedExpense.employee.email}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 3, borderColor: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.1)' }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 1 }}>
                  Expense Title
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
                  Urgency
                </Typography>
                <Chip
                  label={selectedExpense.urgency.charAt(0).toUpperCase() + selectedExpense.urgency.slice(1)}
                  size="small"
                  sx={{
                    backgroundColor: `${getUrgencyColor(selectedExpense.urgency)}20`,
                    color: getUrgencyColor(selectedExpense.urgency),
                    border: `1px solid ${getUrgencyColor(selectedExpense.urgency)}40`,
                    fontWeight: 600,
                    mb: 2
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 1 }}>
                  Expense Date
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                  {formatDate(selectedExpense.date)}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 1 }}>
                  Submitted Date
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                  {formatDate(selectedExpense.submittedDate)}
                </Typography>
              </Grid>

              <Grid item xs={12}>
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
          {selectedExpense && (
            <>
              <Button
                onClick={() => handleAction(selectedExpense, 'reject')}
                variant="outlined"
                sx={{
                  borderColor: '#ef4444',
                  color: '#ef4444',
                  '&:hover': {
                    borderColor: '#dc2626',
                    backgroundColor: '#ef444420'
                  }
                }}
              >
                Reject
              </Button>
              <Button
                onClick={() => handleAction(selectedExpense, 'approve')}
                variant="contained"
                sx={{
                  backgroundColor: '#10b981',
                  '&:hover': { backgroundColor: '#059669' }
                }}
              >
                Approve
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog
        open={actionDialog.open}
        onClose={() => setActionDialog({ open: false, expense: null, action: null })}
        PaperProps={{
          sx: {
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? 'white' : 'black'
          }
        }}
      >
        <DialogTitle>
          {actionDialog.action === 'approve' ? 'Approve Expense' : 'Reject Expense'}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to {actionDialog.action} the expense "{actionDialog.expense?.title}"?
          </Typography>
          {actionDialog.action === 'reject' && (
            <TextField
              fullWidth
              label="Rejection Reason"
              multiline
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              variant="outlined"
              required
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
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setActionDialog({ open: false, expense: null, action: null })}
            sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            sx={{
              backgroundColor: actionDialog.action === 'approve' ? '#10b981' : '#ef4444',
              '&:hover': {
                backgroundColor: actionDialog.action === 'approve' ? '#059669' : '#dc2626'
              }
            }}
          >
            {actionDialog.action === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PendingApprovals;