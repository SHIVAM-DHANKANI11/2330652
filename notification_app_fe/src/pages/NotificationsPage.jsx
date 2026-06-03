/**
 * NOTIFICATIONS PAGE
 * 
 * Displays:
 * - Paginated notifications
 * - Filter and search
 * - Type filtering
 * - Full notification list
 */

import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  useTheme,
  Fab
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import NotificationFilter from '../components/common/NotificationFilter.jsx';
import NotificationCard from '../components/notification/NotificationCard.jsx';
import PaginationComponent from '../components/common/PaginationComponent.jsx';
import AlertBanner from '../components/common/AlertBanner.jsx';
import SkeletonLoader from '../components/common/SkeletonLoader.jsx';
import { useNotifications, useFilteredNotifications, usePagination } from '../hooks/useNotifications.js';
import { logNavigation, logInfo } from '../middleware/logger.js';
import { paginateArray } from '../utils/paginationUtils.js';

/**
 * Notifications Page
 */
const NotificationsPage = () => {
  const theme = useTheme();
  const notifications = useNotifications();
  const filtered = useFilteredNotifications();
  const pagination = usePagination();

  useEffect(() => {
    logNavigation(window.location.pathname, '/notifications');
    logInfo('Notifications page loaded');
    
    // Fetch initial data
    notifications.fetchNotifications(1, 10);
  }, []);

  const handleTypeFilterChange = (type) => {
    notifications.setSelectedType(type);
    // Fetch with new filter
    notifications.fetchNotifications(1, pagination.pageSize, type);
  };

  const handleSearch = (searchTerm) => {
    notifications.setSearchTerm(searchTerm);
  };

  const handleResetFilters = () => {
    notifications.resetFilters();
    notifications.fetchNotifications(1, pagination.pageSize);
  };

  const handlePageChange = (newPage) => {
    notifications.setPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    notifications.setPageSize(newSize);
  };

  const handleRefresh = () => {
    logInfo('Manual refresh triggered');
    notifications.fetchNotifications(
      notifications.state.page,
      notifications.state.pageSize,
      notifications.state.selectedType
    );
  };

  // Paginate filtered results
  const paginatedNotifications = paginateArray(
    filtered.notifications,
    notifications.state.page,
    notifications.state.pageSize
  );

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Notifications
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Manage and view all notifications
          </Typography>
        </Box>
        <Fab
          size="small"
          color="primary"
          onClick={handleRefresh}
          title="Refresh notifications"
        >
          <RefreshIcon />
        </Fab>
      </Box>

      {/* Alerts */}
      {notifications.state.error && (
        <AlertBanner
          message={notifications.state.error}
          severity="error"
          title="Error Loading Notifications"
          onClose={() => notifications.clearError()}
        />
      )}

      {notifications.state.success && (
        <AlertBanner
          message={notifications.state.success}
          severity="success"
          onClose={() => notifications.clearSuccess()}
        />
      )}

      {/* Filters */}
      <NotificationFilter
        selectedType={notifications.state.selectedType}
        onTypeChange={handleTypeFilterChange}
        searchTerm={notifications.state.searchTerm}
        onSearchChange={handleSearch}
        onReset={handleResetFilters}
        resultCount={filtered.notifications.length}
      />

      {/* Notifications List */}
      <Box sx={{ mb: 3 }}>
        {notifications.state.loading ? (
          <SkeletonLoader count={3} variant="notification" />
        ) : paginatedNotifications.length === 0 ? (
          <Box
            sx={{
              py: 8,
              textAlign: 'center',
              backgroundColor: 'action.hover',
              borderRadius: 2
            }}
          >
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
              No Notifications Found
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {filtered.notifications.length === 0 && notifications.state.notifications.length > 0
                ? 'Try adjusting your filters or search terms'
                : 'No notifications available at the moment'}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {paginatedNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                showPriority={false}
              />
            ))}
          </Stack>
        )}
      </Box>

      {/* Pagination */}
      {filtered.notifications.length > 0 && (
        <PaginationComponent
          page={notifications.state.page}
          pageSize={notifications.state.pageSize}
          totalRecords={filtered.notifications.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </Box>
  );
};

export default NotificationsPage;
