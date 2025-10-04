import React, { useState } from 'react';
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
  LinearProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ArrowBack,
  Policy,
  AttachMoney,
  Group,
  Rule
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from '../../utils/helpers';

const ApprovalRules = () => {
  const [loading] = useState(false);
  const [rules, setRules] = useState([
    {
      id: 1,
      name: 'Standard Expense Approval',
      description: 'Default approval rule for regular expenses',
      category: 'all',
      minAmount: 0,
      maxAmount: 500,
      approverRole: 'manager',
      isActive: true,
      autoApprove: false
    },
    {
      id: 2,
      name: 'High Value Expenses',
      description: 'Requires admin approval for high-value expenses',
      category: 'all',
      minAmount: 500,
      maxAmount: 999999,
      approverRole: 'admin',
      isActive: true,
      autoApprove: false
    },
    {
      id: 3,
      name: 'Travel Expenses',
      description: 'Special approval for travel-related expenses',
      category: 'travel',
      minAmount: 0,
      maxAmount: 2000,
      approverRole: 'manager',
      isActive: true,
      autoApprove: false
    }
  ]);
  const [ruleDialog, setRuleDialog] = useState({ open: false, rule: null, mode: 'create' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, rule: null });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'all',
    minAmount: 0,
    maxAmount: 1000,
    approverRole: 'manager',
    isActive: true,
    autoApprove: false
  });

  const { isDark } = useTheme();
  const navigate = useNavigate();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'travel', label: 'Travel' },
    { value: 'meals', label: 'Meals' },
    { value: 'office', label: 'Office Supplies' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'software', label: 'Software' },
    { value: 'other', label: 'Other' }
  ];

  const handleCreateRule = () => {
    setFormData({
      name: '',
      description: '',
      category: 'all',
      minAmount: 0,
      maxAmount: 1000,
      approverRole: 'manager',
      isActive: true,
      autoApprove: false
    });
    setRuleDialog({ open: true, rule: null, mode: 'create' });
  };

  const handleEditRule = (rule) => {
    setFormData(rule);
    setRuleDialog({ open: true, rule, mode: 'edit' });
  };

  const handleDeleteRule = (rule) => {
    setDeleteDialog({ open: true, rule });
  };

  const handleSubmitRule = async () => {
    try {
      if (ruleDialog.mode === 'create') {
        const newRule = {
          ...formData,
          id: Date.now()
        };
        setRules(prev => [...prev, newRule]);
        toast.success('Approval rule created successfully!');
      } else {
        setRules(prev => prev.map(r => r.id === ruleDialog.rule.id ? { ...formData, id: r.id } : r));
        toast.success('Approval rule updated successfully!');
      }
      
      setRuleDialog({ open: false, rule: null, mode: 'create' });
    } catch (error) {
      console.error('Error saving rule:', error);
      toast.error('Failed to save approval rule');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setRules(prev => prev.filter(r => r.id !== deleteDialog.rule.id));
      toast.success('Approval rule deleted successfully!');
      setDeleteDialog({ open: false, rule: null });
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast.error('Failed to delete approval rule');
    }
  };

  const toggleRuleStatus = (ruleId) => {
    setRules(prev => prev.map(r => 
      r.id === ruleId ? { ...r, isActive: !r.isActive } : r
    ));
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

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#ef4444';
      case 'manager': return '#f59e0b';
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
              Approval Rules
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: isDark ? '#D1D5DB' : '#6B7280',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
              }}
            >
              Configure expense approval workflows and rules
            </Typography>
          </Box>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateRule}
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
          Create Rule
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
                  <Rule />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                  >
                    Total Rules
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: isDark ? 'white' : 'black'
                    }}
                  >
                    {rules.length}
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
                  <Policy />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                  >
                    Active Rules
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: isDark ? 'white' : 'black'
                    }}
                  >
                    {rules.filter(r => r.isActive).length}
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
                  <AttachMoney />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                  >
                    Auto Approve
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: isDark ? 'white' : 'black'
                    }}
                  >
                    {rules.filter(r => r.autoApprove).length}
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
                    backgroundColor: '#8b5cf620',
                    color: '#8b5cf6',
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
                    Categories
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: isDark ? 'white' : 'black'
                    }}
                  >
                    {new Set(rules.map(r => r.category)).size}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Rules Table */}
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
                <TableCell>Rule Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Amount Range</TableCell>
                <TableCell>Approver</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rules.map((rule) => (
                <TableRow
                  key={rule.id}
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
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {rule.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                      >
                        {rule.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={categories.find(c => c.value === rule.category)?.label || rule.category}
                      size="small"
                      sx={{
                        backgroundColor: `${getCategoryColor(rule.category)}20`,
                        color: getCategoryColor(rule.category),
                        border: `1px solid ${getCategoryColor(rule.category)}40`,
                        fontWeight: 600
                      }}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {formatCurrency(rule.minAmount, 'USD')} - {formatCurrency(rule.maxAmount, 'USD')}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={rule.approverRole.charAt(0).toUpperCase() + rule.approverRole.slice(1)}
                      size="small"
                      sx={{
                        backgroundColor: `${getRoleColor(rule.approverRole)}20`,
                        color: getRoleColor(rule.approverRole),
                        border: `1px solid ${getRoleColor(rule.approverRole)}40`,
                        fontWeight: 600
                      }}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Switch
                        checked={rule.isActive}
                        onChange={() => toggleRuleStatus(rule.id)}
                        size="small"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#10b981',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#10b981',
                          },
                        }}
                      />
                      <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditRule(rule)}
                        sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteRule(rule)}
                        sx={{ color: '#ef4444' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Rule Dialog */}
      <Dialog
        open={ruleDialog.open}
        onClose={() => setRuleDialog({ open: false, rule: null, mode: 'create' })}
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
          {ruleDialog.mode === 'create' ? 'Create Approval Rule' : 'Edit Approval Rule'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Rule Name"
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
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                variant="outlined"
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  label="Category"
                  sx={{
                    backgroundColor: isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    color: isDark ? 'white' : 'black',
                  }}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>Approver Role</InputLabel>
                <Select
                  value={formData.approverRole}
                  onChange={(e) => setFormData({ ...formData, approverRole: e.target.value })}
                  label="Approver Role"
                  sx={{
                    backgroundColor: isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    color: isDark ? 'white' : 'black',
                  }}
                >
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum Amount"
                type="number"
                value={formData.minAmount}
                onChange={(e) => setFormData({ ...formData, minAmount: parseFloat(e.target.value) || 0 })}
                variant="outlined"
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Maximum Amount"
                type="number"
                value={formData.maxAmount}
                onChange={(e) => setFormData({ ...formData, maxAmount: parseFloat(e.target.value) || 0 })}
                variant="outlined"
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
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#10b981',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#10b981',
                        },
                      }}
                    />
                  }
                  label="Active"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.autoApprove}
                      onChange={(e) => setFormData({ ...formData, autoApprove: e.target.checked })}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#3b82f6',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#3b82f6',
                        },
                      }}
                    />
                  }
                  label="Auto Approve"
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRuleDialog({ open: false, rule: null, mode: 'create' })}
            sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitRule}
            variant="contained"
            sx={{
              backgroundColor: '#3b82f6',
              '&:hover': { backgroundColor: '#2563eb' }
            }}
          >
            {ruleDialog.mode === 'create' ? 'Create Rule' : 'Update Rule'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, rule: null })}
        PaperProps={{
          sx: {
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? 'white' : 'black'
          }
        }}
      >
        <DialogTitle>Delete Approval Rule</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the rule <strong>{deleteDialog.rule?.name}</strong>? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, rule: null })}
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

export default ApprovalRules;