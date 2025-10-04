import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import {
  Box,
  IconButton,
  Typography,
  Chip
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
  Menu,
  Close,
  AccountBalance
} from '@mui/icons-material';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ModernSidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

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
        borderRadius: '14px',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        width: isOpen ? '240px' : '64px',
        background: isDark 
          ? 'rgba(255, 255, 255, 0.06)' 
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '240px',
          height: '100%'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '64px',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            padding: '0 6px'
          }}
        >
          <IconButton
            onClick={toggleSidebar}
            sx={{
              width: '44px',
              height: '44px',
              color: isDark ? '#f9f9f9' : '#1a1a1a',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            {isOpen ? <Close fontSize="small" /> : <Menu fontSize="small" />}
          </IconButton>

          <AnimatePresence>
            {isOpen && (
              <Box
                sx={{
                  marginLeft: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: 0,
                  animation: 'fadeIn 0.25s ease-out forwards',
                  '@keyframes fadeIn': {
                    from: { opacity: 0 },
                    to: { opacity: 1 }
                  }
                }}
              >
                <AccountBalance 
                  sx={{ 
                    color: '#3b82f6',
                    fontSize: '20px'
                  }} 
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: isDark ? '#f9f9f9' : '#1a1a1a',
                    fontWeight: 600,
                    fontSize: '16px'
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
                    height: '1px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    margin: '12px 12px',
                    opacity: isOpen ? 1 : 0
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
                  gap: '12px',
                  alignItems: 'center',
                  height: '44px',
                  width: isOpen ? '100%' : '44px',
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '14px',
                  textTransform: 'capitalize',
                  lineHeight: 1,
                  padding: '0 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: active 
                    ? 'rgba(59, 130, 246, 0.15)' 
                    : 'transparent',
                  opacity: active ? 1 : 0.7,
                  color: active 
                    ? '#3b82f6' 
                    : (isDark ? '#f9f9f9' : '#1a1a1a'),
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    background: active 
                      ? 'rgba(59, 130, 246, 0.2)' 
                      : 'rgba(255, 255, 255, 0.08)',
                    opacity: 1,
                    transform: 'translateY(-1px)'
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
                    minWidth: '20px',
                    '& .MuiSvgIcon-root': {
                      fontSize: '20px'
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
            bottom: '16px',
            left: '6px',
            right: '6px'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Box
              sx={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600
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
                      color: isDark ? '#f9f9f9' : '#1a1a1a',
                      fontWeight: 600,
                      fontSize: '13px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {user?.name || 'User'}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: isDark ? '#94a3b8' : '#64748b',
                      fontSize: '11px',
                      textTransform: 'capitalize'
                    }}
                  >
                    {user?.role || 'employee'}
                  </Typography>
                </Box>
              )}
            </AnimatePresence>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ModernSidebar;