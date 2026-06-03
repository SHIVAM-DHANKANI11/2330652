/**
 * MAIN LAYOUT COMPONENT
 * 
 * Root layout wrapper with:
 * - Header
 * - Sidebar
 * - Main content area
 * - Responsive design
 * - Mobile-friendly drawer
 */

import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import Header from './Header.jsx';
import Sidebar, { DRAWER_WIDTH } from './Sidebar.jsx';

/**
 * Main Layout Component
 */
const MainLayout = ({ children, onSearch }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenuClick = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Header */}
      <Header onMenuClick={handleMenuClick} onSearch={onSearch} />

      {/* Sidebar */}
      <Box
        sx={{
          width: isMobile ? 0 : DRAWER_WIDTH,
          flexShrink: 0
        }}
      >
        <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          pt: 8,
          px: { xs: 1, sm: 2, md: 3 },
          pb: 2,
          backgroundColor: theme.palette.background.default
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
