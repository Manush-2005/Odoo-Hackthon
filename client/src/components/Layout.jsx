import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Drawer,
  Box,
  Fab
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

import { useTheme } from '../context/ThemeContext';
import ModernSidebar from './ModernSidebar';

const Layout = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Track desktop sidebar state
  

  const { isDark } = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = (isOpen) => {
    setSidebarOpen(isOpen);
  };

  return (
    <Box 
      sx={{ 
        display: 'grid',
        gridTemplateColumns: { 
          xs: '1fr', 
          lg: sidebarOpen ? 'var(--sidebar-width-open) 1fr' : 'var(--sidebar-width-closed) 1fr' 
        },
        gridTemplateAreas: { 
          xs: '"main"', 
          lg: '"sidebar main"' 
        },
        minHeight: '100vh',
        background: isDark 
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        transition: 'grid-template-columns 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Modern Sidebar - Desktop */}
      <Box 
        sx={{ 
          display: { xs: 'none', lg: 'block' },
          gridArea: 'sidebar',
        }}
      >
        <ModernSidebar onSidebarToggle={handleSidebarToggle} />
      </Box>

      {/* Mobile/Tablet Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            borderRight: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          },
        }}
      >
        <ModernSidebar onClose={handleDrawerToggle} />
      </Drawer>

      {/* Floating Menu Button - Mobile/Tablet Only */}
      <Fab
        color="primary"
        aria-label="menu"
        onClick={handleDrawerToggle}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'flex', lg: 'none' },
          zIndex: 1300,
          background: 'linear-gradient(135deg, #714B67 0%, #8F6B84 100%)',
          backdropFilter: 'blur(10px)',
          border: `2px solid ${isDark ? 'rgba(143, 107, 132, 0.3)' : 'rgba(113, 75, 103, 0.3)'}`,
          '&:hover': {
            transform: 'scale(1.1)',
            background: 'linear-gradient(135deg, #5A3B52 0%, #714B67 100%)',
            boxShadow: '0 8px 25px rgba(113, 75, 103, 0.4)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        <MenuIcon />
      </Fab>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          gridArea: 'main',
          p: { xs: 2, sm: 2, md: 3 },
          minHeight: '100vh',
          minWidth: 0, // Important for proper grid behavior
          backgroundColor: 'transparent',
          position: 'relative',
          zIndex: 1,
          overflow: 'auto', // Handle content overflow properly
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default Layout;