import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  IconButton
} from '@mui/material';
import {
  People,
  Receipt,
  TrendingUp,
  Settings,
  Add,
  MoreVert,
  CheckCircle,
  Pending,
  Cancel
} from '@mui/icons-material';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatDate } from '../../utils/helpers';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExpenses: 0,
    pendingApprovals: 0,
    monthlySpend: 0
  });
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  const { user, company } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line
  }, [user?._id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Use user._id from localStorage/context for all routes
      const companyId = user?._id;

      // Fetch users and expenses from backend
      const [usersRes, expensesRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/admin/employees/${companyId}`),
        axios.get(`http://localhost:5000/api/admin/expenses/all`, {
          params: { companyId }
        })
      ]);

      // Extract data from responses
      const users = usersRes.data.data?.employees || [];
      const expenses = expensesRes.data.data?.expenses || [];

      // Calculate stats
      const totalUsers = users.length;
      const totalExpenses = expenses.length;
      const pendingApprovals = expenses.filter(e => e.currentStatus === 'pending').length;
      const monthlySpend = expenses
        .filter(e => new Date(e.createdAt).getMonth() === new Date().getMonth())
        .reduce((sum, e) => sum + (e.convertedAmount || e.amount || 0), 0);

      setStats({
        totalUsers,
        totalExpenses,
        pendingApprovals,
        monthlySpend
      });

      // Set recent data (sorted by createdAt descending)
      setRecentExpenses(
        expenses
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map(e => ({
            id: e._id,
            title: e.title || e.description || 'Expense',
            submittedBy: e.employeeId || { name: 'Unknown' },
            date: e.createdAt,
            convertedAmount: e.convertedAmount || e.amount || 0,
            status: e.currentStatus || 'pending'
          }))
      );

      setRecentUsers(
        users
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map(u => ({
            id: u._id,
            name: u.name,
            role: u.role,
            status: 'active'
          }))
      );
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <People />,
      color: '#3b82f6',
      change: '+12%',
      action: () => navigate('/admin/users')
    },
    {
      title: 'Total Expenses',
      value: stats.totalExpenses,
      icon: <Receipt />,
      color: '#10b981',
      change: '+8%',
      action: () => navigate('/employee/history')
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: <Pending />,
      color: '#f59e0b',
      change: '-5%',
      action: () => navigate('/manager/approvals')
    },
    {
      title: 'Monthly Spend',
      value: formatCurrency(stats.monthlySpend, company?.baseCurrency || company?.defaultCurrency),
      icon: <TrendingUp />,
      color: '#8b5cf6',
      change: '+15%',
      action: () => navigate('/employee/history')
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
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
            fontFamily: 'Caveat, cursive',
            color: isDark ? '#FFFFFF' : '#141A29',
            mb: 1
          }}
        >
          Admin Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: isDark ? '#D1D5DB' : '#6B7280',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
          }}
        >
          Welcome back, {user?.name}! Here's what's happening with your expense system.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card
                sx={{
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(55, 65, 81, 0.75) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.8) 100%)',
                  backdropFilter: 'blur(16px)',
                  border: `1px solid ${isDark ? 'rgba(113, 75, 103, 0.2)' : 'rgba(113, 75, 103, 0.15)'}`,
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isDark
                    ? '0 8px 32px rgba(113, 75, 103, 0.1)'
                    : '0 8px 32px rgba(113, 75, 103, 0.05)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: isDark
                      ? '0 12px 40px rgba(113, 75, 103, 0.2)'
                      : '0 12px 40px rgba(113, 75, 103, 0.15)',
                  }
                }}
                onClick={stat.action}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        backgroundColor: `${stat.color}20`,
                        color: stat.color,
                        mr: 2
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: isDark ? '#D1D5DB' : '#6B7280',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 500,
                        }}
                      >
                        {stat.title}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      fontFamily: 'Caveat, cursive',
                      color: isDark ? '#FFFFFF' : '#141A29',
                      mb: 1
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                      label={stat.change}
                      size="small"
                      sx={{
                        backgroundColor: stat.change.startsWith('+') ? '#10b981' : '#ef4444',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: isDark ? '#94a3b8' : '#64748b',
                        ml: 1
                      }}
                    >
                      vs last month
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Expenses */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
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
                    Recent Expenses
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => navigate('/employee/history')}
                    sx={{ color: isDark ? '#3b82f6' : '#1976d2' }}
                  >
                    View All
                  </Button>
                </Box>

                {recentExpenses.map((expense, index) => (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        py: 2,
                        borderBottom: index < recentExpenses.length - 1
                          ? `1px solid ${isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
                          : 'none'
                      }}
                    >
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          backgroundColor: `${getStatusColor(expense.status)}20`,
                          color: getStatusColor(expense.status),
                          mr: 2
                        }}
                      >
                        {getStatusIcon(expense.status)}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: isDark ? 'white' : 'black',
                            mb: 0.5
                          }}
                        >
                          {expense.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: isDark ? '#94a3b8' : '#64748b'
                          }}
                        >
                          by {expense.submittedBy?.name || 'Unknown'} • {formatDate(expense.date)}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: isDark ? 'white' : 'black'
                          }}
                        >
                          {formatCurrency(expense.convertedAmount, company?.baseCurrency || company?.defaultCurrency)}
                        </Typography>
                        <Chip
                          label={expense.status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(expense.status),
                            color: 'white',
                            fontSize: '0.7rem',
                            height: 20
                          }}
                        />
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Recent Users & Quick Actions */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            {/* Recent Users */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
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
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: isDark ? 'white' : 'black'
                        }}
                      >
                        Team Members
                      </Typography>
                      <IconButton
                        size="small"
                        sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>

                    {recentUsers.map((userItem, index) => (
                      <Box
                        key={userItem.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          py: 1.5,
                          borderBottom: index < recentUsers.length - 1
                            ? `1px solid ${isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
                            : 'none'
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: isDark ? '#3b82f6' : '#1976d2',
                            fontSize: '0.875rem',
                            mr: 2
                          }}
                        >
                          {userItem.name.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: isDark ? 'white' : 'black'
                            }}
                          >
                            {userItem.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: isDark ? '#94a3b8' : '#64748b'
                            }}
                          >
                            {userItem.role}
                          </Typography>
                        </Box>
                        <Chip
                          label={userItem.status}
                          size="small"
                          sx={{
                            backgroundColor: userItem.status === 'active' ? '#10b981' : '#6b7280',
                            color: 'white',
                            fontSize: '0.7rem',
                            height: 20
                          }}
                        />
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
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
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: isDark ? 'white' : 'black',
                        mb: 2
                      }}
                    >
                      Quick Actions
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => navigate('/admin/users')}
                        sx={{
                          justifyContent: 'flex-start',
                          borderColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                          color: isDark ? 'white' : 'black',
                          '&:hover': {
                            borderColor: isDark ? '#3b82f6' : '#1976d2',
                            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(25, 118, 210, 0.1)',
                          }
                        }}
                      >
                        Add New User
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Settings />}
                        onClick={() => navigate('/admin/approval-rules')}
                        sx={{
                          justifyContent: 'flex-start',
                          borderColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                          color: isDark ? 'white' : 'black',
                          '&:hover': {
                            borderColor: isDark ? '#3b82f6' : '#1976d2',
                            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(25, 118, 210, 0.1)',
                          }
                        }}
                      >
                        Configure Rules
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Receipt />}
                        onClick={() => navigate('/manager/approvals')}
                        sx={{
                          justifyContent: 'flex-start',
                          borderColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                          color: isDark ? 'white' : 'black',
                          '&:hover': {
                            borderColor: isDark ? '#3b82f6' : '#1976d2',
                            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(25, 118, 210, 0.1)',
                          }
                        }}
                      >
                        Review Expenses
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;