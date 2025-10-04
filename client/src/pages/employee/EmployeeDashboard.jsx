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
  ListItemIcon
} from '@mui/material';
import {
  Receipt,
  TrendingUp,
  Pending,
  CheckCircle,
  Cancel,
  Add,
  AttachMoney,
  CalendarToday
} from '@mui/icons-material';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { mockApi } from '../../utils/api';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers';

const EmployeeDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({
    totalExpenses: 0,
    pendingAmount: 0,
    approvedAmount: 0,
    rejectedCount: 0
  });

  const { user, company } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const loadExpenseData = React.useCallback(async () => {
    try {
      setLoading(true);
      const expenseData = await mockApi.expenses.getAll();
      
      // Filter expenses for current user (in real app, this would be done by API)
      const userExpenses = expenseData.filter(e => e.submittedBy.id === user.id || user.role === 'admin');
      
      setExpenses(userExpenses);
      
      // Calculate stats
      const totalExpenses = userExpenses.length;
      const pendingAmount = userExpenses
        .filter(e => e.status === 'pending')
        .reduce((sum, e) => sum + e.convertedAmount, 0);
      const approvedAmount = userExpenses
        .filter(e => e.status === 'approved')
        .reduce((sum, e) => sum + e.convertedAmount, 0);
      const rejectedCount = userExpenses.filter(e => e.status === 'rejected').length;

      setStats({
        totalExpenses,
        pendingAmount,
        approvedAmount,
        rejectedCount
      });

    } catch (error) {
      console.error('Error loading expense data:', error);
    } finally {
      setLoading(false);
    }
  }, [user.id, user.role]);

  useEffect(() => {
    loadExpenseData();
  }, [loadExpenseData]);

  const recentExpenses = expenses.slice(0, 5);

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
            fontFamily: 'Caveat, cursive',
            color: isDark ? '#FFFFFF' : '#141A29',
            mb: 1
          }}
        >
          My Expenses
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: isDark ? '#D1D5DB' : '#6B7280',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
          }}
        >
          Track and manage your expense submissions
        </Typography>
      </Box>

      {/* Quick Submit Button */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<Add />}
          onClick={() => navigate('/employee/submit')}
          sx={{
            py: 1.5,
            px: 4,
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
          Submit New Expense
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(55, 65, 81, 0.75) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.8) 100%)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${isDark ? 'rgba(113, 75, 103, 0.2)' : 'rgba(113, 75, 103, 0.15)'}`,
              borderRadius: 3,
              boxShadow: isDark
                ? '0 8px 32px rgba(113, 75, 103, 0.1)'
                : '0 8px 32px rgba(113, 75, 103, 0.05)'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    backgroundColor: 'rgba(113, 75, 103, 0.2)',
                    color: '#714B67',
                    mr: 2
                  }}
                >
                  <Receipt />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ 
                      color: isDark ? '#D1D5DB' : '#6B7280',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                    }}
                  >
                    Total Expenses
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      fontFamily: 'Caveat, cursive',
                      color: isDark ? '#FFFFFF' : '#141A29'
                    }}
                  >
                    {stats.totalExpenses}
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
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(55, 65, 81, 0.75) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.8) 100%)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${isDark ? 'rgba(113, 75, 103, 0.2)' : 'rgba(113, 75, 103, 0.15)'}`,
              borderRadius: 3,
              boxShadow: isDark
                ? '0 8px 32px rgba(113, 75, 103, 0.1)'
                : '0 8px 32px rgba(113, 75, 103, 0.05)'
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
                  <Pending />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ 
                      color: isDark ? '#D1D5DB' : '#6B7280',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                    }}
                  >
                    Pending Amount
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      fontFamily: 'Caveat, cursive',
                      color: isDark ? '#FFFFFF' : '#141A29'
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
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(55, 65, 81, 0.75) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.8) 100%)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${isDark ? 'rgba(113, 75, 103, 0.2)' : 'rgba(113, 75, 103, 0.15)'}`,
              borderRadius: 3,
              boxShadow: isDark
                ? '0 8px 32px rgba(113, 75, 103, 0.1)'
                : '0 8px 32px rgba(113, 75, 103, 0.05)'
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
                    sx={{ 
                      color: isDark ? '#D1D5DB' : '#6B7280',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                    }}
                  >
                    Approved Amount
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      fontFamily: 'Caveat, cursive',
                      color: isDark ? '#FFFFFF' : '#141A29'
                    }}
                  >
                    {formatCurrency(stats.approvedAmount, company?.baseCurrency)}
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
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(55, 65, 81, 0.75) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.8) 100%)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${isDark ? 'rgba(113, 75, 103, 0.2)' : 'rgba(113, 75, 103, 0.15)'}`,
              borderRadius: 3,
              boxShadow: isDark
                ? '0 8px 32px rgba(113, 75, 103, 0.1)'
                : '0 8px 32px rgba(113, 75, 103, 0.05)'
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
                    sx={{ 
                      color: isDark ? '#D1D5DB' : '#6B7280',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                    }}
                  >
                    Rejected
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      fontFamily: 'Caveat, cursive',
                      color: isDark ? '#FFFFFF' : '#141A29'
                    }}
                  >
                    {stats.rejectedCount}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Expenses */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card
            sx={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(55, 65, 81, 0.75) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.8) 100%)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${isDark ? 'rgba(113, 75, 103, 0.2)' : 'rgba(113, 75, 103, 0.15)'}`,
              borderRadius: 3,
              boxShadow: isDark
                ? '0 8px 32px rgba(113, 75, 103, 0.1)'
                : '0 8px 32px rgba(113, 75, 103, 0.05)'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontFamily: 'Caveat, cursive',
                    color: isDark ? '#FFFFFF' : '#141A29'
                  }}
                >
                  Recent Expenses
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate('/employee/history')}
                  sx={{ 
                    color: '#714B67',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    '&:hover': {
                      color: '#8F6B84',
                      backgroundColor: 'rgba(113, 75, 103, 0.1)',
                    }
                  }}
                >
                  View All
                </Button>
              </Box>

              {recentExpenses.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Receipt sx={{ fontSize: 48, color: isDark ? '#6B7280' : '#9CA3AF', mb: 2 }} />
                  <Typography
                    variant="h6"
                    sx={{ 
                      color: isDark ? '#D1D5DB' : '#6B7280',
                      fontFamily: 'Caveat, cursive',
                      fontWeight: 700,
                      mb: 1 
                    }}
                  >
                    No expenses yet
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ 
                      color: isDark ? '#9CA3AF' : '#6B7280',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                    }}
                  >
                    Submit your first expense to get started
                  </Typography>
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {recentExpenses.map((expense, index) => (
                    <ListItem
                      key={expense.id}
                      sx={{
                        px: 0,
                        py: 2,
                        borderBottom: index < recentExpenses.length - 1
                          ? `1px solid ${isDark ? 'rgba(113, 75, 103, 0.2)' : 'rgba(113, 75, 103, 0.15)'}`
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
                              fontFamily: 'Inter, sans-serif',
                              color: isDark ? '#FFFFFF' : '#141A29',
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
                                color: isDark ? '#D1D5DB' : '#6B7280',
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 500,
                                mb: 0.5
                              }}
                            >
                              {expense.description}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AttachMoney sx={{ fontSize: 16, color: isDark ? '#D1D5DB' : '#6B7280' }} />
                                <Typography
                                  variant="caption"
                                  sx={{ 
                                    color: isDark ? '#D1D5DB' : '#6B7280',
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 500,
                                  }}
                                >
                                  {formatCurrency(expense.convertedAmount, company?.baseCurrency)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CalendarToday sx={{ fontSize: 16, color: isDark ? '#D1D5DB' : '#6B7280' }} />
                                <Typography
                                  variant="caption"
                                  sx={{ 
                                    color: isDark ? '#D1D5DB' : '#6B7280',
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 500,
                                  }}
                                >
                                  {formatDate(expense.date)}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        }
                      />
                      <Box sx={{ textAlign: 'right', ml: 2 }}>
                        <Chip
                          label={expense.status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(expense.status),
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeDashboard;