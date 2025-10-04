import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, LinearProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Rule, Policy, AddCircle } from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';

const ApprovalRules = () => {
  const [loading, setLoading] = useState(true);
  const [rules, setRules] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: '',
    value: '',
    specificApproverId: ''
  });
  const { isDark } = useTheme();

  // Replace with dynamic companyId if needed
  const companyId = JSON.parse(localStorage.getItem('user'))?._id;

  useEffect(() => {
    fetchApprovalRules();
    // eslint-disable-next-line
  }, []);

  const fetchApprovalRules = async () => {
    try {
      setLoading(true);
      const companyRes = await axios.get(`http://localhost:5000/api/admin/info/${companyId}`);
      const approvalRules = companyRes.data?.data.approvalRules || [];
      setRules(approvalRules);
    } catch (error) {
      setRules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = () => {
    setForm({
      name: '',
      type: '',
      value: '',
      specificApproverId: ''
    });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddRule = async () => {
    try {
      await axios.post('http://localhost:5000/api/admin/approval-rules', {
        name: form.name,
        type: form.type,
        value: form.value,
        specificApproverId: form.specificApproverId || null,
        companyId
      });
      fetchApprovalRules();
      setDialogOpen(false);
    } catch (error) {
      // Handle error (toast, etc.)
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
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontFamily: 'Caveat, cursive',
            color: isDark ? '#FFFFFF' : '#141A29',
            flex: 1
          }}
        >
          Approval Rules
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircle />}
          onClick={handleDialogOpen}
          sx={{
            backgroundColor: '#8b5cf6',
            color: 'white',
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#7c3aed' }
          }}
        >
          Add Rule
        </Button>
      </Box>
      <Grid container spacing={3}>
        {rules.length === 0 ? (
          <Grid item xs={12}>
            <Card
              sx={{
                background: isDark
                  ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
                borderRadius: 3,
                textAlign: 'center',
                py: 4
              }}
            >
              <CardContent>
                <Policy sx={{ fontSize: 48, color: '#f59e0b', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  No approval rules found.
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                  Please add approval rules for your company.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          rules.map((rule) => (
            <Grid item xs={12} md={6} lg={4} key={rule._id}>
              <Card
                sx={{
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(55, 65, 81, 0.75) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.8) 100%)',
                  borderRadius: 3,
                  boxShadow: isDark
                    ? '0 8px 32px rgba(113, 75, 103, 0.1)'
                    : '0 8px 32px rgba(113, 75, 103, 0.05)',
                  p: 2
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rule sx={{ color: '#8b5cf6', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {rule.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Type:</strong> {rule.type}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Value:</strong> {rule.value}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Approver Role:</strong>{' '}
                    <Chip
                      label={rule.specificApproverId ? rule.specificApproverId : 'Majority'}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 600, backgroundColor: '#f59e0b', color: 'white' }}
                    />
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Rule ID:</strong> {rule._id}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Add Rule Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add Approval Rule</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Rule Name"
            name="name"
            fullWidth
            value={form.name}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            label="Type"
            name="type"
            fullWidth
            value={form.type}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            label="Value"
            name="value"
            type="number"
            fullWidth
            value={form.value}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            label="Specific Approver ID"
            name="specificApproverId"
            fullWidth
            value={form.specificApproverId}
            onChange={handleFormChange}
            placeholder="Leave blank for Majority"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleAddRule} variant="contained" color="primary">
            Add Rule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApprovalRules;