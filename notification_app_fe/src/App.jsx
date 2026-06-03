/**
 * MAIN APPLICATION COMPONENT
 * 
 * Root component with:
 * - React Router setup
 * - Context providers
 * - Theme provider
 * - Main layout wrapper
 * - Route definitions
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import theme from './theme.js';
import { NotificationProvider } from './contexts/NotificationContext.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import PriorityInboxPage from './pages/PriorityInboxPage.jsx';
import { logNavigation, logInfo } from './middleware/logger.js';

/**
 * Main Application Component
 */
function App() {
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  const handleGlobalSearch = (searchTerm) => {
    setGlobalSearchTerm(searchTerm);
    logInfo('Global search triggered', { searchTerm });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <Router>
          <MainLayout onSearch={handleGlobalSearch}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/priority-inbox" element={<PriorityInboxPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MainLayout>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
