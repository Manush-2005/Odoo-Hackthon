import React, { useState, useEffect } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Pending,
  Receipt,
  People,
  TrendingUp,
  MoreVert
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { mockApi } from '../../utils/api';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers';

const ManagerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({
    pendingCount: 0,
    pendingAmount: 0,
    thisMonthApproved: 0,
    teamMembers: 0
  });
  const [actionDialog, setActionDialog] = useState({ open: false, expense: null, action: '' });
  const [rejectionReason, setRejectionReason] = useState('');

  const { user, company } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const loadDashboardData = React.useCallback(async () => {
    try {
      setLoading(true);
      
      const [expenseData, userData] = await Promise.all([
        mockApi.expenses.getAll(),
        mockApi.users.getAll()
      ]);

      // Filter pending expenses for approval
      const pendingExpenses = expenseData.filter(e => e.status === 'pending');
      
      setExpenses(pendingExpenses);
      
      // Calculate stats
      const pendingCount = pendingExpenses.length;
      const pendingAmount = pendingExpenses.reduce((sum, e) => sum + e.convertedAmount, 0);
      const thisMonthApproved = expenseData
        .filter(e => e.status === 'approved' && new Date(e.date).getMonth() === new Date().getMonth())
        .reduce((sum, e) => sum + e.convertedAmount, 0);
      const teamMembers = userData.filter(u => u.role === 'employee').length;

      setStats({
        pendingCount,
        pendingAmount,
        thisMonthApproved,
        teamMembers
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

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
      loadDashboardData();
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
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: isDark ? 'white' : 'black',
            mb: 1
          }}
        >
          Manager Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: isDark ? '#94a3b8' : '#64748b'
          }}
        >
          Review and approve team expense submissions
        </Typography>
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
              borderRadius: 3,
              cursor: 'pointer'
            }}
            onClick={() => navigate('/manager/approvals')}
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
                  <Pending />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                  >
                    Pending Approvals
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: isDark ? 'white' : 'black'
                    }}
                  >
                    {stats.pendingCount}
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
                  <Receipt />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                  >
                    Pending Amount
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: isDark ? 'white' : 'black'
                    }}
                  >
                    {formatCurrency(stats.pendingAmount, company?.baseCurrency)}
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
                  <TrendingUp />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                  >
                    This Month Approved
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: isDark ? 'white' : 'black'
                    }}
                  >
                    {formatCurrency(stats.thisMonthApproved, company?.baseCurrency)}
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
                  <People />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                  >
                    Team Members
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: isDark ? 'white' : 'black'
                    }}
                  >
                    {stats.teamMembers}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pending Approvals */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: isDark ? 'white' : 'black'
                  }}
                >
                  Pending Approvals
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate('/manager/approvals')}
                  sx={{ color: isDark ? '#3b82f6' : '#1976d2' }}
                >
                  View All
                </Button>
              </Box>

              {expenses.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircle sx={{ fontSize: 48, color: isDark ? '#475569' : '#9ca3af', mb: 2 }} />
                  <Typography
                    variant="h6"
                    sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 1 }}
                  >
                    All caught up!
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: isDark ? '#64748b' : '#9ca3af' }}
                  >
                    No expenses pending your approval
                  </Typography>
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {expenses.slice(0, 5).map((expense, index) => (
                    <ListItem
                      key={expense.id}
                      sx={{
                        px: 0,
                        py: 2,
                        borderBottom: index < Math.min(expenses.length, 5) - 1
                          ? `1px solid ${isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
                          : 'none'
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 48 }}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 2,
                            backgroundColor: `${getStatusColor(expense.status)}20`,
                            color: getStatusColor(expense.status)
                          }}
                        >
                          {getStatusIcon(expense.status)}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              color: isDark ? 'white' : 'black',
                              mb: 0.5
                            }}
                          >
                            {expense.title}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                color: isDark ? '#94a3b8' : '#64748b',
                                mb: 0.5
                              }}
                            >
                              by {expense.submittedBy.name} • {formatDate(expense.date)}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: isDark ? '#94a3b8' : '#64748b'
                              }}
                            >
                              {expense.description}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box sx={{ textAlign: 'right', mr: 2 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: isDark ? 'white' : 'black',
                            mb: 1
                          }}
                        >
                          {formatCurrency(expense.convertedAmount, company?.baseCurrency)}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
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
                        </Box>
                      </Box>
                      <IconButton
                        size="small"
                        sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                      >
                        <MoreVert />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
            onClick={handleExpenseAction}
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

export default ManagerDashboard;