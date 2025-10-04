import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import {
  Person,
  Edit,
  Save,
  Cancel,
  Settings,
  Security,
  Notifications,
  Business,
  PhotoCamera,
  ArrowBack
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Profile = () => {
  const [loading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [changePasswordDialog, setChangePasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Profile form data
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    email: user?.email || 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    position: 'Senior Developer',
    manager: 'Sarah Johnson',
    employeeId: 'EMP001',
    startDate: '2022-03-15',
    location: 'New York, NY'
  });

  // Settings data
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    expenseReminders: true,
    darkMode: isDark,
    language: 'en',
    currency: 'USD',
    timezone: 'EST'
  });

  // Company data
  const [companyData] = useState({
    name: 'Tech Solutions Inc.',
    address: '123 Business Ave, Suite 100',
    city: 'New York, NY 10001',
    phone: '+1 (555) 987-6543',
    website: 'www.techsolutions.com',
    taxId: '12-3456789'
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleProfileSave = () => {
    try {
      // Here you would save the profile data to your backend
      console.log('Saving profile data:', profileData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleSettingsChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    toast.success('Settings updated successfully!');
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      // Here you would handle password change logic
      console.log('Changing password...');
      setChangePasswordDialog(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      toast.success('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    }
  };

  const handleAvatarUpload = () => {
    // Simulate file upload
    toast.success('Profile picture updated successfully!');
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
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            mr: 3,
            color: isDark ? '#94a3b8' : '#64748b',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          Back
        </Button>
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
            Profile Settings
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: isDark ? '#D1D5DB' : '#6B7280',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
            }}
          >
            Manage your account settings and preferences
          </Typography>
        </Box>
      </Box>

      {/* Profile Header Card */}
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box sx={{ position: 'relative', mr: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: '#3b82f6',
                  fontSize: '2rem',
                  fontWeight: 600
                }}
              >
                {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
              </Avatar>
              <Button
                onClick={handleAvatarUpload}
                sx={{
                  position: 'absolute',
                  bottom: -5,
                  right: -5,
                  minWidth: 32,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#2563eb'
                  }
                }}
              >
                <PhotoCamera fontSize="small" />
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: isDark ? 'white' : 'black' }}>
                {profileData.firstName} {profileData.lastName}
              </Typography>
              <Typography variant="body1" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 1 }}>
                {profileData.position} • {profileData.department}
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                Employee ID: {profileData.employeeId}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 1 }}>
                Member since
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: isDark ? 'white' : 'black' }}>
                {new Date(profileData.startDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
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
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            '& .MuiTab-root': {
              color: isDark ? '#94a3b8' : '#64748b',
              '&.Mui-selected': {
                color: '#3b82f6',
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#3b82f6',
            }
          }}
        >
          <Tab icon={<Person />} label="Personal Info" />
          <Tab icon={<Settings />} label="Preferences" />
        <Tab icon={<Security />} label="Security" />
          <Tab icon={<Business />} label="Company" />
        </Tabs>

        <CardContent sx={{ p: 4 }}>
          {/* Personal Info Tab */}
          {activeTab === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: isDark ? 'white' : 'black' }}>
                  Personal Information
                </Typography>
                <Button
                  variant={isEditing ? "outlined" : "contained"}
                  startIcon={isEditing ? <Cancel /> : <Edit />}
                  onClick={() => setIsEditing(!isEditing)}
                  sx={{
                    backgroundColor: isEditing ? 'transparent' : '#3b82f6',
                    borderColor: isEditing ? '#ef4444' : '#3b82f6',
                    color: isEditing ? '#ef4444' : 'white',
                    '&:hover': {
                      backgroundColor: isEditing ? '#ef444420' : '#2563eb',
                    }
                  }}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    disabled={!isEditing}
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
                    label="Last Name"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    disabled={!isEditing}
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
                    label="Email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!isEditing}
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
                    label="Phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!isEditing}
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
                    label="Department"
                    value={profileData.department}
                    onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                    disabled={!isEditing}
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
                    label="Position"
                    value={profileData.position}
                    onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                    disabled={!isEditing}
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
                    label="Manager"
                    value={profileData.manager}
                    disabled
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
                    label="Location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    disabled={!isEditing}
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
              </Grid>

              {isEditing && (
                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(false)}
                    sx={{
                      borderColor: isDark ? '#94a3b8' : '#64748b',
                      color: isDark ? '#94a3b8' : '#64748b'
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleProfileSave}
                    sx={{
                      backgroundColor: '#10b981',
                      '&:hover': { backgroundColor: '#059669' }
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {/* Preferences Tab */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: isDark ? 'white' : 'black' }}>
                Preferences & Settings
              </Typography>

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: isDark ? 'white' : 'black' }}>
                    Notifications
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.emailNotifications}
                          onChange={(e) => handleSettingsChange('emailNotifications', e.target.checked)}
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
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? 'white' : 'black' }}>
                            Email Notifications
                          </Typography>
                          <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                            Receive email updates about expense status
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.pushNotifications}
                          onChange={(e) => handleSettingsChange('pushNotifications', e.target.checked)}
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
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? 'white' : 'black' }}>
                            Push Notifications
                          </Typography>
                          <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                            Get instant notifications on your device
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.weeklyReports}
                          onChange={(e) => handleSettingsChange('weeklyReports', e.target.checked)}
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
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? 'white' : 'black' }}>
                            Weekly Reports
                          </Typography>
                          <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                            Receive weekly expense summary reports
                          </Typography>
                        </Box>
                      }
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: isDark ? 'white' : 'black' }}>
                    Regional Settings
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>Language</InputLabel>
                      <Select
                        value={settings.language}
                        onChange={(e) => handleSettingsChange('language', e.target.value)}
                        label="Language"
                        sx={{
                          backgroundColor: isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                          color: isDark ? 'white' : 'black',
                        }}
                      >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="es">Spanish</MenuItem>
                        <MenuItem value="fr">French</MenuItem>
                        <MenuItem value="de">German</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>Currency</InputLabel>
                      <Select
                        value={settings.currency}
                        onChange={(e) => handleSettingsChange('currency', e.target.value)}
                        label="Currency"
                        sx={{
                          backgroundColor: isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                          color: isDark ? 'white' : 'black',
                        }}
                      >
                        <MenuItem value="USD">USD - US Dollar</MenuItem>
                        <MenuItem value="EUR">EUR - Euro</MenuItem>
                        <MenuItem value="GBP">GBP - British Pound</MenuItem>
                        <MenuItem value="CAD">CAD - Canadian Dollar</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>Timezone</InputLabel>
                      <Select
                        value={settings.timezone}
                        onChange={(e) => handleSettingsChange('timezone', e.target.value)}
                        label="Timezone"
                        sx={{
                          backgroundColor: isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                          color: isDark ? 'white' : 'black',
                        }}
                      >
                        <MenuItem value="EST">EST - Eastern Time</MenuItem>
                        <MenuItem value="PST">PST - Pacific Time</MenuItem>
                        <MenuItem value="CST">CST - Central Time</MenuItem>
                        <MenuItem value="MST">MST - Mountain Time</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Security Tab */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: isDark ? 'white' : 'black' }}>
                Security Settings
              </Typography>

              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Alert 
                    severity="info" 
                    sx={{ 
                      mb: 3,
                      backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                      color: isDark ? '#60a5fa' : '#3b82f6',
                      '& .MuiAlert-icon': {
                        color: isDark ? '#60a5fa' : '#3b82f6'
                      }
                    }}
                  >
                    Keep your account secure by using a strong password and enabling two-factor authentication.
                  </Alert>

                  <Card
                    sx={{
                      backgroundColor: isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                      borderRadius: 2,
                      p: 3
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: isDark ? 'white' : 'black' }}>
                          Password
                        </Typography>
                        <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                          Last changed 30 days ago
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        onClick={() => setChangePasswordDialog(true)}
                        sx={{
                          borderColor: '#3b82f6',
                          color: '#3b82f6',
                          '&:hover': {
                            borderColor: '#2563eb',
                            backgroundColor: '#3b82f620'
                          }
                        }}
                      >
                        Change Password
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Company Tab */}
          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: isDark ? 'white' : 'black' }}>
                Company Information
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    value={companyData.name}
                    disabled
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
                    label="Tax ID"
                    value={companyData.taxId}
                    disabled
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
                    label="Address"
                    value={companyData.address}
                    disabled
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
                    label="City, State, ZIP"
                    value={companyData.city}
                    disabled
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
                    label="Phone"
                    value={companyData.phone}
                    disabled
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
                    label="Website"
                    value={companyData.website}
                    disabled
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
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog
        open={changePasswordDialog}
        onClose={() => setChangePasswordDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? 'white' : 'black'
          }
        }}
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              sx={{
                mb: 3,
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
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              sx={{
                mb: 3,
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
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setChangePasswordDialog(false)}
            sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePasswordChange}
            variant="contained"
            sx={{
              backgroundColor: '#3b82f6',
              '&:hover': { backgroundColor: '#2563eb' }
            }}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;