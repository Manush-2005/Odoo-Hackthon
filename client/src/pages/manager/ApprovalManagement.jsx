import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Pending,
  Visibility,
  MoreVert,
  FilterList,
  Download,
  ArrowBack
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { mockApi } from '../../utils/api';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers';

const ApprovalManagement = () => {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [actionDialog, setActionDialog] = useState({ open: false, expense: null, action: '' });
  const [rejectionReason, setRejectionReason] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const { user, company } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const tabs = useMemo(() => [
    { label: 'Pending', value: 'pending', count: expenses.filter(e => e.status === 'pending').length },
    { label: 'Approved', value: 'approved', count: expenses.filter(e => e.status === 'approved').length },
    { label: 'Rejected', value: 'rejected', count: expenses.filter(e => e.status === 'rejected').length },
    { label: 'All', value: 'all', count: expenses.length }
  ], [expenses]);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await mockApi.expenses.getAll();
      setExpenses(data);
    } catch (error) {
      console.error('Error loading expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = expenses;
    
    if (tabValue !== 3) { // Not "All" tab
      const status = tabs[tabValue].value;
      filtered = expenses.filter(expense => expense.status === status);
    }
    
    setFilteredExpenses(filtered);
  }, [expenses, tabValue, tabs]);

  const handleExpenseAction = async (action) => {
    try {
      if (action === 'approve') {
        await mockApi.expenses.approve(actionDialog.expense.id, user.id);
        toast.success('Expense approved successfully!');
      } else if (action === 'reject') {
        if (!rejectionReason.trim()) {
          toast.error('Please provide a reason for rejection');
          return;
        }
        await mockApi.expenses.reject(actionDialog.expense.id, user.id, rejectionReason);
        toast.success('Expense rejected');
      }
      
      // Reload data
      loadExpenses();
      setActionDialog({ open: false, expense: null, action: '' });
      setRejectionReason('');
      
    } catch (error) {
      console.error('Error processing expense:', error);
      toast.error('Failed to process expense');
    }
  };

  const openActionDialog = (expense, action) => {
    setActionDialog({ open: true, expense, action });
    setRejectionReason('');
    setAnchorEl(null);
  };

  const openViewDialog = (expense) => {
    setSelectedExpense(expense);
    setViewDialog(true);
    setAnchorEl(null);
  };

  const handleMenuOpen = (event, expense) => {
    setAnchorEl(event.currentTarget);
    setSelectedExpense(expense);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedExpense(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle />;
      case 'pending': return <Pending />;
      case 'rejected': return <Cancel />;
      default: return <Pending />;
    }
  };

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
              Approval Management
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: isDark ? '#D1D5DB' : '#6B7280',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
              }}
            >
              Review and manage expense approvals
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            startIcon={<FilterList />}
            variant="outlined"
            sx={{
              borderColor: '#714B67',
              color: '#714B67',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#8F6B84',
                backgroundColor: 'rgba(113, 75, 103, 0.1)',
              }
            }}
          >
            Filter
          </Button>
          <Button
            startIcon={<Download />}
            variant="outlined"
            sx={{
              borderColor: '#714B67',
              color: '#714B67',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#8F6B84',
                backgroundColor: 'rgba(113, 75, 103, 0.1)',
              }
            }}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
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
        <Tabs
          value={tabValue}
          onChange={(event, newValue) => setTabValue(newValue)}
          sx={{
            px: 2,
            '& .MuiTab-root': {
              color: isDark ? '#94a3b8' : '#64748b',
              '&.Mui-selected': {
                color: isDark ? '#3b82f6' : '#1976d2'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: isDark ? '#3b82f6' : '#1976d2'
            }
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {tab.label}
                  <Chip
                    label={tab.count}
                    size="small"
                    sx={{
                      backgroundColor: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                      color: isDark ? '#94a3b8' : '#64748b',
                      fontSize: '0.75rem'
                    }}
                  />
                </Box>
              }
            />
          ))}
        </Tabs>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: '#3b82f6',
                          fontSize: '0.875rem'
                        }}
                      >
                        {expense.submittedBy.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {expense.submittedBy.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                        >
                          {expense.submittedBy.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {expense.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                    >
                      {expense.category} • {expense.description.substring(0, 50)}...
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(expense.convertedAmount, company?.baseCurrency)}
                    </Typography>
                    {expense.currency !== company?.baseCurrency && (
                      <Typography
                        variant="caption"
                        sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                      >
                        {formatCurrency(expense.amount, expense.currency)}
                      </Typography>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(expense.date)}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(expense.status)}
                      label={expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                      size="small"
                      sx={{
                        backgroundColor: `${getStatusColor(expense.status)}20`,
                        color: getStatusColor(expense.status),
                        border: `1px solid ${getStatusColor(expense.status)}40`
                      }}
                    />
                  </TableCell>
                  
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      {expense.status === 'pending' && (
                        <>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => openActionDialog(expense, 'approve')}
                            sx={{
                              backgroundColor: '#10b981',
                              '&:hover': { backgroundColor: '#059669' },
                              minWidth: 'auto',
                              px: 2
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => openActionDialog(expense, 'reject')}
                            sx={{
                              borderColor: '#ef4444',
                              color: '#ef4444',
                              '&:hover': {
                                borderColor: '#dc2626',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)'
                              },
                              minWidth: 'auto',
                              px: 2
                            }}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <IconButton
                        size="small"
                        onClick={(event) => handleMenuOpen(event, expense)}
                        sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredExpenses.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CheckCircle sx={{ fontSize: 48, color: isDark ? '#475569' : '#9ca3af', mb: 2 }} />
            <Typography
              variant="h6"
              sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 1 }}
            >
              No expenses found
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: isDark ? '#64748b' : '#9ca3af' }}
            >
              {tabValue === 0 ? 'All caught up! No pending approvals.' : 'No expenses match the current filter.'}
            </Typography>
          </Box>
        )}
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            borderRadius: 2,
            minWidth: 160
          }
        }}
      >
        <MenuItem onClick={() => openViewDialog(selectedExpense)}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          View Details
        </MenuItem>
        
        {selectedExpense?.status === 'pending' && (
          <>
            <Divider />
            <MenuItem onClick={() => openActionDialog(selectedExpense, 'approve')}>
              <ListItemIcon>
                <CheckCircle fontSize="small" />
              </ListItemIcon>
              Approve
            </MenuItem>
            <MenuItem onClick={() => openActionDialog(selectedExpense, 'reject')}>
              <ListItemIcon>
                <Cancel fontSize="small" />
              </ListItemIcon>
              Reject
            </MenuItem>
          </>
        )}
      </Menu>

      {/* View Details Dialog */}
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
        <DialogTitle>Expense Details</DialogTitle>
        <DialogContent>
          {selectedExpense && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: isDark ? '#94a3b8' : '#64748b' }}>
                  Title
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedExpense.title}
                </Typography>

                <Typography variant="subtitle2" sx={{ mb: 1, color: isDark ? '#94a3b8' : '#64748b' }}>
                  Description
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedExpense.description}
                </Typography>

                <Typography variant="subtitle2" sx={{ mb: 1, color: isDark ? '#94a3b8' : '#64748b' }}>
                  Category
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedExpense.category}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: isDark ? '#94a3b8' : '#64748b' }}>
                  Amount
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formatCurrency(selectedExpense.amount, selectedExpense.currency)}
                  {selectedExpense.currency !== company?.baseCurrency && (
                    <Box component="span" sx={{ color: isDark ? '#94a3b8' : '#64748b', ml: 1 }}>
                      ({formatCurrency(selectedExpense.convertedAmount, company?.baseCurrency)})
                    </Box>
                  )}
                </Typography>

                <Typography variant="subtitle2" sx={{ mb: 1, color: isDark ? '#94a3b8' : '#64748b' }}>
                  Date
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formatDate(selectedExpense.date)}
                </Typography>

                <Typography variant="subtitle2" sx={{ mb: 1, color: isDark ? '#94a3b8' : '#64748b' }}>
                  Status
                </Typography>
                <Chip
                  icon={getStatusIcon(selectedExpense.status)}
                  label={selectedExpense.status.charAt(0).toUpperCase() + selectedExpense.status.slice(1)}
                  sx={{
                    backgroundColor: `${getStatusColor(selectedExpense.status)}20`,
                    color: getStatusColor(selectedExpense.status),
                    border: `1px solid ${getStatusColor(selectedExpense.status)}40`
                  }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)} sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
            Close
          </Button>
          {selectedExpense?.status === 'pending' && (
            <>
              <Button
                onClick={() => {
                  setViewDialog(false);
                  openActionDialog(selectedExpense, 'approve');
                }}
                variant="contained"
                sx={{
                  backgroundColor: '#10b981',
                  '&:hover': { backgroundColor: '#059669' }
                }}
              >
                Approve
              </Button>
              <Button
                onClick={() => {
                  setViewDialog(false);
                  openActionDialog(selectedExpense, 'reject');
                }}
                variant="outlined"
                sx={{
                  borderColor: '#ef4444',
                  color: '#ef4444',
                  '&:hover': {
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)'
                  }
                }}
              >
                Reject
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Action Dialog */}
      <Dialog
        open={actionDialog.open}
        onClose={() => setActionDialog({ open: false, expense: null, action: '' })}
        maxWidth="sm"
        fullWidth
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
          {actionDialog.expense && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {actionDialog.expense.title}
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 1 }}>
                {formatCurrency(actionDialog.expense.convertedAmount, company?.baseCurrency)} • {actionDialog.expense.submittedBy.name}
              </Typography>
              <Typography variant="body2">
                {actionDialog.expense.description}
              </Typography>
            </Box>
          )}

          {actionDialog.action === 'reject' && (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Reason for rejection"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              margin="normal"
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
            onClick={() => setActionDialog({ open: false, expense: null, action: '' })}
            sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleExpenseAction(actionDialog.action)}
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

export default ApprovalManagement;