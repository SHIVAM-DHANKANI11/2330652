/**
 * CUSTOM HOOKS
 * 
 * Reusable logic hooks for:
 * - NotificationContext access
 * - Notifications API calls
 * - Data filtering and sorting
 */

import { useContext, useEffect, useCallback, useState } from 'react';
import NotificationContext from '../contexts/NotificationContext.jsx';
import { getNotifications, getAllNotifications, getNotificationsByType } from '../services/notificationService.js';
import { getTopNNotifications, enrichWithPriority } from '../utils/priorityUtils.js';
import { isNotificationViewed } from '../utils/storageUtils.js';
import { logUserAction, logError } from '../middleware/logger.js';

/**
 * Hook to access NotificationContext
 */
export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  
  return context;
};

/**
 * Hook to fetch notifications with pagination and filtering
 */
export const useNotifications = () => {
  const context = useNotificationContext();
  const [isFetching, setIsFetching] = useState(false);

  const fetchNotifications = useCallback(async (page = 1, limit = 10, type = null) => {
    try {
      setIsFetching(true);
      context.setLoading(true);

      logUserAction('FETCH', 'Notifications', { page, limit, type });

      const response = await getNotifications({ page, limit, notification_type: type });

      context.setNotifications(response.notifications);
      context.setTotalRecords(response.totalCount);
      context.setPage(page);
      context.setPageSize(limit);

      context.clearError();
    } catch (error) {
      logError('Failed to fetch notifications', error);
      context.setError(error.message || 'Failed to fetch notifications');
    } finally {
      context.setLoading(false);
      setIsFetching(false);
    }
  }, [context]);

  return {
    ...context.state,
    fetchNotifications,
    isFetching
  };
};

/**
 * Hook to fetch priority inbox notifications
 */
export const usePriorityNotifications = () => {
  const context = useNotificationContext();
  const [isFetching, setIsFetching] = useState(false);

  const fetchPriorityNotifications = useCallback(async (topN = 10) => {
    try {
      setIsFetching(true);
      context.setLoading(true);

      logUserAction('FETCH', 'Priority Notifications', { topN });

      // Fetch all notifications
      const allNotifications = await getAllNotifications();

      // Get top N by priority
      const topNotifications = getTopNNotifications(allNotifications, topN);

      // Enrich with priority metadata
      const enriched = enrichWithPriority(topNotifications);

      context.setPriorityNotifications(enriched);
      context.clearError();
    } catch (error) {
      logError('Failed to fetch priority notifications', error);
      context.setError(error.message || 'Failed to fetch priority notifications');
    } finally {
      context.setLoading(false);
      setIsFetching(false);
    }
  }, [context]);

  return {
    priorityNotifications: context.state.priorityNotifications,
    loading: context.state.loading,
    error: context.state.error,
    fetchPriorityNotifications,
    isFetching
  };
};

/**
 * Hook to get notifications with viewed status
 */
export const useNotificationsWithViewedStatus = () => {
  const context = useNotificationContext();

  const getNotificationsWithStatus = useCallback(() => {
    return context.state.notifications.map(notification => ({
      ...notification,
      isViewed: isNotificationViewed(notification.id)
    }));
  }, [context.state.notifications]);

  return {
    notifications: getNotificationsWithStatus(),
    total: context.state.notifications.length
  };
};

/**
 * Hook for filtering and searching notifications
 */
export const useFilteredNotifications = () => {
  const context = useNotificationContext();
  const [filteredNotifications, setFilteredNotifications] = useState([]);

  useEffect(() => {
    const filtered = context.state.notifications.filter(notification => {
      // Type filter
      if (context.state.selectedType && notification.notification_type !== context.state.selectedType) {
        return false;
      }

      // Search filter
      if (context.state.searchTerm) {
        const searchLower = context.state.searchTerm.toLowerCase();
        const title = (notification.title || '').toLowerCase();
        const description = (notification.description || '').toLowerCase();

        if (!title.includes(searchLower) && !description.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });

    setFilteredNotifications(filtered);
  }, [
    context.state.notifications,
    context.state.selectedType,
    context.state.searchTerm
  ]);

  const applyFilters = useCallback((type = null, search = '') => {
    if (type) context.setSelectedType(type);
    if (search !== undefined) context.setSearchTerm(search);
  }, [context]);

  const clearFilters = useCallback(() => {
    context.resetFilters();
  }, [context]);

  return {
    notifications: filteredNotifications,
    applyFilters,
    clearFilters,
    activeFilters: {
      type: context.state.selectedType,
      search: context.state.searchTerm
    }
  };
};

/**
 * Hook for pagination
 */
export const usePagination = () => {
  const context = useNotificationContext();

  const goToPage = useCallback((page) => {
    context.setPage(page);
  }, [context]);

  const nextPage = useCallback(() => {
    const totalPages = Math.ceil(context.state.totalRecords / context.state.pageSize);
    if (context.state.page < totalPages) {
      context.setPage(context.state.page + 1);
    }
  }, [context]);

  const previousPage = useCallback(() => {
    if (context.state.page > 1) {
      context.setPage(context.state.page - 1);
    }
  }, [context]);

  const changePageSize = useCallback((size) => {
    context.setPageSize(size);
  }, [context]);

  return {
    page: context.state.page,
    pageSize: context.state.pageSize,
    totalRecords: context.state.totalRecords,
    totalPages: Math.ceil(context.state.totalRecords / context.state.pageSize),
    goToPage,
    nextPage,
    previousPage,
    changePageSize
  };
};

/**
 * Hook for top N configuration
 */
export const useTopN = () => {
  const context = useNotificationContext();

  const setSelectedTopN = useCallback((topN) => {
    context.setTopN(topN);
    logUserAction('CHANGE', 'Top-N Value', { topN });
  }, [context]);

  return {
    topN: context.state.topN,
    setTopN: setSelectedTopN
  };
};

export default {
  useNotificationContext,
  useNotifications,
  usePriorityNotifications,
  useNotificationsWithViewedStatus,
  useFilteredNotifications,
  usePagination,
  useTopN
};
