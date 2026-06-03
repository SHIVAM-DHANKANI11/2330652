/**
 * NOTIFICATION SERVICE
 * 
 * Handles all notification-related API calls with:
 * - Pagination support
 * - Filtering by type (Placement, Result, Event)
 * - Response transformation
 * - Error handling with logging
 */

import apiClient from './apiClient.js';
import { logInfo, logError } from '../middleware/logger.js';

const NOTIFICATION_ENDPOINTS = {
  GET_NOTIFICATIONS: '/notifications',
  GET_NOTIFICATION_BY_ID: (id) => `/notifications/${id}`
};

/**
 * Fetch notifications with pagination and filtering
 * 
 * @param {object} options - Query options
 * @param {number} options.page - Page number (1-based)
 * @param {number} options.limit - Results per page
 * @param {string} options.notification_type - Filter by type (Placement, Result, Event)
 * @returns {Promise<object>} Notifications data with pagination info
 * 
 * @example
 * const { notifications, totalCount, page, totalPages } = 
 *   await getNotifications({ page: 1, limit: 10, notification_type: 'Placement' });
 */
export const getNotifications = async (options = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      notification_type = null
    } = options;

    logInfo('Fetching notifications', {
      page,
      limit,
      notification_type
    });

    const params = {
      page,
      limit
    };

    // Add filter if specified
    if (notification_type) {
      params.notification_type = notification_type;
    }

    const response = await apiClient.get(NOTIFICATION_ENDPOINTS.GET_NOTIFICATIONS, { params });

    logInfo('Notifications fetched successfully', {
      count: response.data?.length || 0,
      page,
      limit
    });

    return {
      notifications: response.data || [],
      page,
      limit,
      totalCount: response.data?.length || 0
    };
  } catch (error) {
    logError('Failed to fetch notifications', error, { options });
    throw error;
  }
};

/**
 * Fetch all notifications with all available parameters
 * Used for priority inbox calculation
 * 
 * @returns {Promise<array>} All notifications from all pages
 */
export const getAllNotifications = async () => {
  try {
    logInfo('Fetching all notifications for priority inbox');

    // Fetch with large limit to get all notifications
    const response = await apiClient.get(
      NOTIFICATION_ENDPOINTS.GET_NOTIFICATIONS,
      {
        params: {
          page: 1,
          limit: 1000 // Large limit to fetch all at once
        }
      }
    );

    logInfo('All notifications fetched', {
      count: response.data?.length || 0
    });

    return response.data || [];
  } catch (error) {
    logError('Failed to fetch all notifications', error);
    throw error;
  }
};

/**
 * Fetch notifications by type
 * 
 * @param {string} type - Notification type (Placement, Result, Event)
 * @param {object} options - Additional options (page, limit)
 * @returns {Promise<array>} Filtered notifications
 */
export const getNotificationsByType = async (type, options = {}) => {
  try {
    const { page = 1, limit = 10 } = options;

    logInfo(`Fetching ${type} notifications`, { page, limit });

    const response = await apiClient.get(
      NOTIFICATION_ENDPOINTS.GET_NOTIFICATIONS,
      {
        params: {
          page,
          limit,
          notification_type: type
        }
      }
    );

    return response.data || [];
  } catch (error) {
    logError(`Failed to fetch ${type} notifications`, error);
    throw error;
  }
};

export default {
  getNotifications,
  getAllNotifications,
  getNotificationsByType
};
