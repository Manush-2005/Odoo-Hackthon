import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  LinearProgress,
  Menu,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  Person,
  AdminPanelSettings,
  Assignment,
  Block,
  CheckCircle,
  ArrowBack
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { mockApi } from '../../utils/api';
import { formatDate } from '../../utils/helpers';
import axios from 'axios';

const UserManagement = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [userDialog, setUserDialog] = useState({ open: false, user: null, mode: 'create' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'employee',
    status: 'active',
    managerId: null
  });

  const { user: currentUser } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

   useEffect(() => {
    loadUsers();
    // eslint-disable-next-line
  }, [currentUser?._id]);

   const loadUsers = async () => {
    try {
      setLoading(true);
      // Fetch users from backend
      const res = await axios.get(`http://localhost:5000/api/admin/employees/${currentUser?._id}`);
      // Map backend _id to id for frontend
      const data = (res.data.data?.employees || []).map(u => ({
        ...u,
        id: u._id
      }));
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setFormData({ name: '', email: '', role: 'Employee', status: 'active', managerId: null });
    setUserDialog({ open: true, user: null, mode: 'create' });
  };

   const handleEditUser = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status || 'active',
      managerId: user.managerId || null
    });
    setUserDialog({ open: true, user, mode: 'edit' });
    setAnchorEl(null);
  };

  const handleDeleteUser = (user) => {
    setDeleteDialog({ open: true, user });
    setAnchorEl(null);
  };

   const handleSubmitUser = async () => {
    try {
      if (userDialog.mode === 'create') {
         await axios.post('http://localhost:5000/api/admin/employees', {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          managerId: formData.managerId,
          status: formData.status,
          companyId: currentUser?._id
        });
        toast.success('User created successfully!');
      } else {
        await axios.put(`http://localhost:5000/api/admin/employees/${userDialog.user.id}`, {
          ...formData,
          companyId: currentUser?._id
        });
        toast.success('User updated successfully!');
      }
      loadUsers();
      setUserDialog({ open: false, user: null, mode: 'create' });
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    }
  };
  const handleConfirmDelete = async () => {
    try {
      await mockApi.users.delete(deleteDialog.user.id);
      toast.success('User deleted successfully!');
      loadUsers();
      setDeleteDialog({ open: false, user: null });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const getActiveManagers = () => {
    return users.filter(user => 
      user.role === 'manager' && 
      (user.status || 'active') === 'active'
    );
  };

    const handleManagerAssignment = async (userId, managerId) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/employees/${userId}`, {
        managerId,
        companyId: currentUser?._id
      });
      setUsers(prev => prev.map(user =>
        user.id === userId
          ? { ...user, managerId: managerId || null }
          : user
      ));
      toast.success('Manager assigned successfully!');
    } catch (error) {
      console.error('Error assigning manager:', error);
      toast.error('Failed to assign manager');
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <AdminPanelSettings />;
      case 'manager': return <Assignment />;
      case 'employee': return <Person />;
      default: return <Person />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#ef4444';
      case 'manager': return '#f59e0b';
      case 'employee': return '#10b981';
      default: return '#64748b';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#64748b';
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
            onClick={() => navigate('/admin')}
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
              User Management
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: isDark ? '#D1D5DB' : '#6B7280',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
              }}
            >
              Manage users and their roles
            </Typography>
          </Box>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateUser}
          sx={{
            background: 'linear-gradient(135deg, #714B67 0%, #8F6B84 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #8F6B84 0%, #A084A5 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(113, 75, 103, 0.3)',
            },
            borderRadius: 2,
            px: 3,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            transition: 'all 0.3s ease',
          }}
        >
          Add User
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
                  <Person />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                  >
                    Total Users
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: isDark ? 'white' : 'black'
                    }}
                  >
                    {users.length}
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
                    Active Users
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: isDark ? 'white' : 'black'
                    }}
                  >
                    {users.filter(u => u.status === 'active' || !u.status).length}
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
                  <AdminPanelSettings />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                  >
                    Admins
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: isDark ? 'white' : 'black'
                    }}
                  >
                    {users.filter(u => u.role === 'admin').length}
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
                  <Assignment />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                  >
                    Managers
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: isDark ? 'white' : 'black'
                    }}
                  >
                    {users.filter(u => u.role === 'manager').length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Users Table */}
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
                <TableCell>User</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
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
                          width: 40,
                          height: 40,
                          backgroundColor: '#3b82f6',
                          fontSize: '1rem'
                        }}
                      >
                        {user.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {user.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                        >
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      icon={getRoleIcon(user.role)}
                      label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      size="small"
                      sx={{
                        backgroundColor: `${getRoleColor(user.role)}20`,
                        color: getRoleColor(user.role),
                        border: `1px solid ${getRoleColor(user.role)}40`,
                        fontWeight: 600
                      }}
                    />
                  </TableCell>
                  
                  <TableCell>
                    {user.role === 'employee' ? (
                      <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select
                          value={user.managerId || ''}
                          onChange={(e) => handleManagerAssignment(user.id, e.target.value)}
                          displayEmpty
                          renderValue={(value) => {
                            if (!value) return <em style={{ color: isDark ? '#94a3b8' : '#64748b' }}>No Manager</em>;
                            const manager = users.find(u => u.id === value);
                            return manager ? manager.name : 'Unknown Manager';
                          }}
                          sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(113, 75, 103, 0.2)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(113, 75, 103, 0.3)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#714B67',
                            },
                            '& .MuiSelect-select': {
                              color: isDark ? 'white' : 'black',
                              fontFamily: 'Inter, sans-serif',
                              fontWeight: 500,
                            },
                            borderRadius: 2,
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                background: isDark 
                                  ? 'rgba(20, 26, 41, 0.95)'
                                  : 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(113, 75, 103, 0.1)'}`,
                                borderRadius: 2,
                                maxHeight: 200,
                              }
                            }
                          }}
                        >
                          <MenuItem value="">
                            <em style={{ color: isDark ? '#94a3b8' : '#64748b' }}>No Manager</em>
                          </MenuItem>
                          {getActiveManagers().map((manager) => (
                            <MenuItem 
                              key={manager.id} 
                              value={manager.id}
                              sx={{
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 500,
                                '&:hover': {
                                  backgroundColor: isDark ? 'rgba(113, 75, 103, 0.1)' : 'rgba(113, 75, 103, 0.05)'
                                }
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    backgroundColor: '#714B67',
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  {manager.name.charAt(0)}
                                </Avatar>
                                {manager.name}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', fontStyle: 'italic' }}>
                        -
                      </Typography>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={(user.status || 'active').charAt(0).toUpperCase() + (user.status || 'active').slice(1)}
                      size="small"
                      sx={{
                        backgroundColor: `${getStatusColor(user.status || 'active')}20`,
                        color: getStatusColor(user.status || 'active'),
                        border: `1px solid ${getStatusColor(user.status || 'active')}40`,
                        fontWeight: 600
                      }}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(user.createdAt || new Date().toISOString())}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(event) => handleMenuOpen(event, user)}
                      sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
        <MenuItem onClick={() => handleEditUser(selectedUser)}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Edit User
        </MenuItem>
        
        {selectedUser?.id !== currentUser?.id && (
          <>
            <Divider />
            <MenuItem onClick={() => handleDeleteUser(selectedUser)} sx={{ color: '#ef4444' }}>
              <ListItemIcon>
                <Delete fontSize="small" sx={{ color: '#ef4444' }} />
              </ListItemIcon>
              Delete User
            </MenuItem>
          </>
        )}
      </Menu>

      {/* User Dialog */}
      <Dialog
        open={userDialog.open}
        onClose={() => setUserDialog({ open: false, user: null, mode: 'create' })}
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
          {userDialog.mode === 'create' ? 'Create New User' : 'Edit User'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

            <FormControl fullWidth>
              <InputLabel sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                label="Role"
                sx={{
                  backgroundColor: isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  color: isDark ? 'white' : 'black',
                }}
              >
                <MenuItem value="employee">Employee</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            {formData.role === 'employee' && (
              <FormControl fullWidth>
                <InputLabel sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>Manager</InputLabel>
                <Select
                  value={formData.managerId || ''}
                  onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                  label="Manager"
                  sx={{
                    backgroundColor: isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    color: isDark ? 'white' : 'black',
                  }}
                >
                  <MenuItem value="">
                    <em>No Manager</em>
                  </MenuItem>
                  {getActiveManagers().map((manager) => (
                    <MenuItem key={manager.id} value={manager.id}>
                      {manager.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl fullWidth>
              <InputLabel sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                label="Status"
                sx={{
                  backgroundColor: isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  color: isDark ? 'white' : 'black',
                }}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setUserDialog({ open: false, user: null, mode: 'create' })}
            sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitUser}
            variant="contained"
            sx={{
              backgroundColor: '#3b82f6',
              '&:hover': { backgroundColor: '#2563eb' }
            }}
          >
            {userDialog.mode === 'create' ? 'Create User' : 'Update User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, user: null })}
        PaperProps={{
          sx: {
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? 'white' : 'black'
          }
        }}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deleteDialog.user?.name}</strong>? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, user: null })}
            sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              backgroundColor: '#ef4444',
              '&:hover': { backgroundColor: '#dc2626' }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;