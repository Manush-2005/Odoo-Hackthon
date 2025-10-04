import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import {
  Box,
  IconButton,
  Typography,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider
} from '@mui/material';
import {
  Dashboard,
  Receipt,
  People,
  Settings,
  Assignment,
  History,
  CheckCircle,
  AdminPanelSettings,
  Menu as MenuIcon,
  Close,
  AccountBalance,
  MoreVert,
  Person,
  Logout,
  ExitToApp,
  Brightness4,
  Brightness7,
  BusinessCenter
} from '@mui/icons-material';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ModernSidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [logoutDialog, setLogoutDialog] = useState(false);

  const menuItems = React.useMemo(() => {
    const items = [];

    // Employee items (available to all roles)
    items.push(
      {
        title: 'Employee Dashboard',
        icon: <Dashboard />,
        path: '/employee',
        roles: ['employee', 'manager', 'admin']
      },
      {
        title: 'Submit Expense',
        icon: <Receipt />,
        path: '/employee/submit',
        roles: ['employee', 'manager', 'admin']
      },
      {
        title: 'Expense History',
        icon: <History />,
        path: '/employee/history',
        roles: ['employee', 'manager', 'admin']
      }
    );

    // Manager items
    if (user?.role === 'manager' || user?.role === 'admin') {
      items.push(
        { divider: true },
        {
          title: 'Manager Dashboard',
          icon: <Assignment />,
          path: '/manager',
          roles: ['manager', 'admin']
        },
        {
          title: 'Pending Approvals',
          icon: <CheckCircle />,
          path: '/manager/approvals',
          roles: ['manager', 'admin'],
          badge: 3 // Mock pending count
        }
      );
    }

    // Admin items
    if (user?.role === 'admin') {
      items.push(
        { divider: true },
        {
          title: 'Admin Dashboard',
          icon: <AdminPanelSettings />,
          path: '/admin',
          roles: ['admin']
        },
        {
          title: 'User Management',
          icon: <People />,
          path: '/admin/users',
          roles: ['admin']
        },
        {
          title: 'Approval Rules',
          icon: <Settings />,
          path: '/admin/approval-rules',
          roles: ['admin']
        }
      );
    }

    return items;
  }, [user?.role]);

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleProfileClick = () => {
    handleUserMenuClose();
    navigate('/profile');
  };

  const handleLogoutClick = () => {
    handleUserMenuClose();
    setLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setLogoutDialog(false);
    navigate('/login');
  };

  const handleLogoutCancel = () => {
    setLogoutDialog(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        zIndex: 1200,
        top: 20,
        left: 20,
        bottom: 26,
        borderRadius: '16px',
        border: `2px solid ${isDark ? 'rgba(143, 107, 132, 0.2)' : 'rgba(113, 75, 103, 0.15)'}`,
        width: isOpen ? '280px' : '70px',
        background: isDark 
          ? 'linear-gradient(145deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.95) 100%)' 
          : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(243, 244, 246, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        boxShadow: isDark 
          ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(143, 107, 132, 0.1)' 
          : '0 20px 40px rgba(113, 75, 103, 0.15), 0 0 0 1px rgba(113, 75, 103, 0.05)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '280px',
          height: '100%'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '80px',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            padding: '0 16px',
            background: isDark
              ? 'linear-gradient(90deg, rgba(113, 75, 103, 0.1) 0%, rgba(143, 107, 132, 0.05) 100%)'
              : 'linear-gradient(90deg, rgba(113, 75, 103, 0.08) 0%, rgba(143, 107, 132, 0.04) 100%)',
            borderBottom: `1px solid ${isDark ? 'rgba(143, 107, 132, 0.1)' : 'rgba(113, 75, 103, 0.1)'}`,
          }}
        >
          <IconButton
            onClick={toggleSidebar}
            sx={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              color: '#714B67',
              backgroundColor: isDark ? 'rgba(143, 107, 132, 0.1)' : 'rgba(113, 75, 103, 0.08)',
              '&:hover': {
                backgroundColor: isDark ? 'rgba(143, 107, 132, 0.2)' : 'rgba(113, 75, 103, 0.15)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {isOpen ? <Close fontSize="small" /> : <MenuIcon fontSize="small" />}
          </IconButton>

          <AnimatePresence>
            {isOpen && (
              <Box
                sx={{
                  marginLeft: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  opacity: 0,
                  animation: 'fadeIn 0.3s ease-out forwards',
                  '@keyframes fadeIn': {
                    from: { opacity: 0, transform: 'translateX(-10px)' },
                    to: { opacity: 1, transform: 'translateX(0)' }
                  }
                }}
              >
                <BusinessCenter 
                  sx={{ 
                    color: '#714B67',
                    fontSize: '28px',
                    filter: 'drop-shadow(0 2px 4px rgba(113, 75, 103, 0.3))'
                  }} 
                />
                <Typography
                  variant="h5"
                  sx={{
                    color: '#714B67',
                    fontFamily: 'Caveat, cursive',
                    fontWeight: 700,
                    fontSize: '24px',
                    textShadow: '0 1px 2px rgba(113, 75, 103, 0.2)'
                  }}
                >
                  ExpenseHub
                </Typography>
              </Box>
            )}
          </AnimatePresence>
        </Box>

        {/* Navigation */}
        <Box
          sx={{
            display: 'grid',
            padding: '0 6px',
            gap: '2px',
            paddingTop: '8px'
          }}
        >
          {menuItems.map((item, index) => {
            if (item.divider) {
              return (
                <Box
                  key={`divider-${index}`}
                  sx={{
                    height: '2px',
                    background: isDark 
                      ? 'linear-gradient(90deg, transparent 0%, rgba(143, 107, 132, 0.3) 50%, transparent 100%)'
                      : 'linear-gradient(90deg, transparent 0%, rgba(113, 75, 103, 0.2) 50%, transparent 100%)',
                    margin: '16px 20px',
                    opacity: isOpen ? 1 : 0,
                    borderRadius: '1px',
                  }}
                />
              );
            }

            const active = isActive(item.path);

            return (
              <Box
                key={item.path}
                component="button"
                onClick={() => handleNavigation(item.path)}
                sx={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  height: '52px',
                  width: isOpen ? 'calc(100% - 24px)' : '52px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  fontWeight: active ? 700 : 600,
                  textTransform: 'none',
                  lineHeight: 1.2,
                  padding: '0 16px',
                  margin: '4px 12px',
                  borderRadius: '14px',
                  border: 'none',
                  background: active 
                    ? (isDark 
                        ? 'linear-gradient(135deg, rgba(143, 107, 132, 0.15) 0%, rgba(113, 75, 103, 0.1) 100%)'
                        : 'linear-gradient(135deg, rgba(113, 75, 103, 0.1) 0%, rgba(143, 107, 132, 0.05) 100%)')
                    : 'transparent',
                  color: active 
                    ? '#714B67' 
                    : (isDark ? '#F9FAFB' : '#374151'),
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: active 
                    ? '0 2px 8px rgba(113, 75, 103, 0.15)' 
                    : 'none',
                  '&:hover': {
                    background: active 
                      ? (isDark 
                          ? 'linear-gradient(135deg, rgba(143, 107, 132, 0.2) 0%, rgba(113, 75, 103, 0.15) 100%)'
                          : 'linear-gradient(135deg, rgba(113, 75, 103, 0.15) 0%, rgba(143, 107, 132, 0.1) 100%)')
                      : (isDark 
                          ? 'rgba(143, 107, 132, 0.08)' 
                          : 'rgba(113, 75, 103, 0.06)'),
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(113, 75, 103, 0.2)',
                  },
                  '&:active': {
                    transform: 'translateY(0)'
                  }
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '24px',
                    '& .MuiSvgIcon-root': {
                      fontSize: '22px',
                      color: active ? '#714B67' : 'inherit',
                      filter: active ? 'drop-shadow(0 1px 2px rgba(113, 75, 103, 0.3))' : 'none',
                    }
                  }}
                >
                  {item.icon}
                </Box>

                <AnimatePresence>
                  {isOpen && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flex: 1,
                        pointerEvents: 'none',
                        opacity: 0,
                        animation: 'slideIn 0.25s ease-out forwards',
                        '@keyframes slideIn': {
                          from: { opacity: 0, transform: 'translateX(-10px)' },
                          to: { opacity: 1, transform: 'translateX(0)' }
                        }
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {item.title}
                      </Typography>
                      
                      {item.badge && (
                        <Chip
                          label={item.badge}
                          size="small"
                          sx={{
                            height: '20px',
                            fontSize: '11px',
                            fontWeight: 600,
                            backgroundColor: '#ef4444',
                            color: 'white',
                            minWidth: '20px',
                            '& .MuiChip-label': {
                              padding: '0 6px'
                            }
                          }}
                        />
                      )}
                    </Box>
                  )}
                </AnimatePresence>

                {/* Hover tooltip for collapsed state */}
                {!isOpen && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '60px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      opacity: 0,
                      pointerEvents: 'none',
                      transition: 'opacity 0.3s',
                      zIndex: 1000,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: '-4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 0,
                        height: 0,
                        borderTop: '4px solid transparent',
                        borderBottom: '4px solid transparent',
                        borderRight: '4px solid rgba(0, 0, 0, 0.8)'
                      },
                      '.MuiBox-root:hover &': {
                        opacity: 1
                      }
                    }}
                  >
                    {item.title}
                    {item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          height: '16px',
                          fontSize: '10px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          marginLeft: '8px',
                          '& .MuiChip-label': {
                            padding: '0 4px'
                          }
                        }}
                      />
                    )}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>

        {/* User Info at Bottom */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '20px',
            left: '16px',
            right: '16px'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              borderRadius: '16px',
              background: isDark
                ? 'linear-gradient(135deg, rgba(143, 107, 132, 0.15) 0%, rgba(113, 75, 103, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(113, 75, 103, 0.08) 0%, rgba(143, 107, 132, 0.05) 100%)',
              border: `2px solid ${isDark ? 'rgba(143, 107, 132, 0.2)' : 'rgba(113, 75, 103, 0.15)'}`,
              cursor: 'pointer',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                background: isDark
                  ? 'linear-gradient(135deg, rgba(143, 107, 132, 0.25) 0%, rgba(113, 75, 103, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(113, 75, 103, 0.12) 0%, rgba(143, 107, 132, 0.08) 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(113, 75, 103, 0.2)',
              }
            }}
            onClick={handleUserMenuOpen}
          >
            <Box
              sx={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #714B67 0%, #8F6B84 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                fontWeight: 700,
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 12px rgba(113, 75, 103, 0.3)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Box>

            <AnimatePresence>
              {isOpen && (
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    opacity: 0,
                    animation: 'slideIn 0.3s ease-out forwards',
                    '@keyframes slideIn': {
                      from: { opacity: 0, transform: 'translateX(-10px)' },
                      to: { opacity: 1, transform: 'translateX(0)' }
                    }
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#714B67',
                      fontWeight: 700,
                      fontSize: '16px',
                      fontFamily: 'Inter, sans-serif',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: 1.2,
                    }}
                  >
                    {user?.name || 'User'}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: isDark ? '#D1D5DB' : '#6B7280',
                      fontSize: '13px',
                      fontWeight: 500,
                      textTransform: 'capitalize',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {user?.role || 'employee'}
                  </Typography>
                </Box>
              )}
            </AnimatePresence>

            {isOpen && (
              <IconButton
                size="small"
                sx={{
                  color: '#714B67',
                  backgroundColor: 'rgba(113, 75, 103, 0.1)',
                  borderRadius: '10px',
                  padding: '8px',
                  '&:hover': {
                    backgroundColor: 'rgba(113, 75, 103, 0.2)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* User Menu */}
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: {
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
              minWidth: 160
            }
          }}
        >
          <MenuItem onClick={handleProfileClick}>
            <Person sx={{ mr: 2, color: isDark ? '#94a3b8' : '#64748b' }} />
            <Typography sx={{ color: isDark ? 'white' : 'black' }}>
              Profile
            </Typography>
          </MenuItem>
          <MenuItem onClick={toggleTheme}>
            {isDark ? (
              <Brightness7 sx={{ mr: 2, color: isDark ? '#94a3b8' : '#64748b' }} />
            ) : (
              <Brightness4 sx={{ mr: 2, color: isDark ? '#94a3b8' : '#64748b' }} />
            )}
            <Typography sx={{ color: isDark ? 'white' : 'black' }}>
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </Typography>
          </MenuItem>
          <Divider sx={{ borderColor: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.1)' }} />
          <MenuItem onClick={handleLogoutClick}>
            <ExitToApp sx={{ mr: 2, color: '#ef4444' }} />
            <Typography sx={{ color: '#ef4444' }}>
              Logout
            </Typography>
          </MenuItem>
        </Menu>

        {/* Logout Confirmation Dialog */}
        <Dialog
          open={logoutDialog}
          onClose={handleLogoutCancel}
          PaperProps={{
            sx: {
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              color: isDark ? 'white' : 'black',
              borderRadius: 3
            }
          }}
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
            <Logout sx={{ mr: 2, color: '#ef4444' }} />
            Confirm Logout
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to logout? You will need to sign in again to access your account.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleLogoutCancel}
              sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogoutConfirm}
              variant="contained"
              sx={{
                backgroundColor: '#ef4444',
                '&:hover': { backgroundColor: '#dc2626' }
              }}
            >
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ModernSidebar;