import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Close
} from '@mui/icons-material';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, company } = useAuth();
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(true);

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, company } = useAuth();
  const { isDark } = useTheme();

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

  return (
    <Box>
      <Toolbar sx={{ px: 3, py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <AccountBalance
              sx={{
                fontSize: 32,
                color: isDark ? '#3b82f6' : '#1976d2'
              }}
            />
          </motion.div>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: isDark ? 'white' : 'black',
                fontSize: '1.1rem'
              }}
            >
              {company?.name || 'Expense Manager'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: isDark ? '#94a3b8' : '#64748b',
                fontSize: '0.75rem'
              }}
            >
              {company?.baseCurrency || 'USD'} • {user?.role?.toUpperCase()}
            </Typography>
          </Box>
        </Box>
      </Toolbar>

      <Divider sx={{ borderColor: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.1)' }} />

      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item, index) => {
          if (item.divider) {
            return (
              <Divider
                key={index}
                sx={{
                  my: 2,
                  borderColor: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                }}
              />
            );
          }

          const active = isActive(item.path);

          return (
            <motion.div
              key={item.path}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    px: 2,
                    backgroundColor: active
                      ? isDark
                        ? 'rgba(59, 130, 246, 0.1)'
                        : 'rgba(25, 118, 210, 0.1)'
                      : 'transparent',
                    color: active
                      ? isDark
                        ? '#3b82f6'
                        : '#1976d2'
                      : isDark
                      ? '#e2e8f0'
                      : '#475569',
                    '&:hover': {
                      backgroundColor: active
                        ? isDark
                          ? 'rgba(59, 130, 246, 0.15)'
                          : 'rgba(25, 118, 210, 0.15)'
                        : isDark
                        ? 'rgba(148, 163, 184, 0.05)'
                        : 'rgba(0, 0, 0, 0.04)',
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: 'inherit',
                      minWidth: 40
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      fontWeight: active ? 600 : 500,
                      fontSize: '0.875rem'
                    }}
                  />
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      sx={{
                        backgroundColor: isDark ? '#dc2626' : '#ef4444',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 20,
                        minWidth: 20
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </motion.div>
          );
        })}
      </List>

      {/* User info at bottom */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          borderTop: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: isDark ? '#3b82f6' : '#1976d2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 600
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: isDark ? 'white' : 'black',
                fontSize: '0.875rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {user?.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: isDark ? '#94a3b8' : '#64748b',
                fontSize: '0.75rem'
              }}
            >
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;