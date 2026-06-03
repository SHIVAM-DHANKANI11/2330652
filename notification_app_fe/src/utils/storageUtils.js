/**
 * STORAGE UTILITIES
 * 
 * Manage localStorage for:
 * - Viewed notifications tracking
 * - Notification state persistence
 * - User preferences
 */

import { logInfo, logError } from '../middleware/logger.js';

const STORAGE_KEYS = {
  VIEWED_NOTIFICATIONS: 'viewed_notifications',
  NOTIFICATION_PREFERENCES: 'notification_preferences',
  LAST_SYNC: 'last_sync_timestamp'
};

/**
 * Add notification ID to viewed list
 * 
 * @param {string} notificationId - Notification ID to mark as viewed
 * @returns {boolean} Success status
 */
export const markNotificationAsViewed = (notificationId) => {
  try {
    const viewed = getViewedNotifications();
    
    if (!viewed.includes(notificationId)) {
      viewed.push(notificationId);
      localStorage.setItem(STORAGE_KEYS.VIEWED_NOTIFICATIONS, JSON.stringify(viewed));
      logInfo('Notification marked as viewed', { notificationId });
    }
    
    return true;
  } catch (error) {
    logError('Failed to mark notification as viewed', error, { notificationId });
    return false;
  }
};

/**
 * Get all viewed notification IDs
 * 
 * @returns {array} Array of viewed notification IDs
 */
export const getViewedNotifications = () => {
  try {
    const viewed = localStorage.getItem(STORAGE_KEYS.VIEWED_NOTIFICATIONS);
    return viewed ? JSON.parse(viewed) : [];
  } catch (error) {
    logError('Failed to retrieve viewed notifications', error);
    return [];
  }
};

/**
 * Check if notification is viewed
 * 
 * @param {string} notificationId - Notification ID
 * @returns {boolean} Is viewed
 */
export const isNotificationViewed = (notificationId) => {
  try {
    const viewed = getViewedNotifications();
    return viewed.includes(notificationId);
  } catch (error) {
    logError('Failed to check if notification is viewed', error, { notificationId });
    return false;
  }
};

/**
 * Clear all viewed notifications
 * 
 * @returns {boolean} Success status
 */
export const clearViewedNotifications = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.VIEWED_NOTIFICATIONS);
    logInfo('Cleared all viewed notifications');
    return true;
  } catch (error) {
    logError('Failed to clear viewed notifications', error);
    return false;
  }
};

/**
 * Save user preferences
 * 
 * @param {object} preferences - User preferences object
 * @returns {boolean} Success status
 */
export const savePreferences = (preferences) => {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATION_PREFERENCES, JSON.stringify(preferences));
    logInfo('Preferences saved', { keys: Object.keys(preferences) });
    return true;
  } catch (error) {
    logError('Failed to save preferences', error);
    return false;
  }
};

/**
 * Get user preferences
 * 
 * @returns {object} User preferences with defaults
 */
export const getPreferences = () => {
  try {
    const prefs = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_PREFERENCES);
    return prefs ? JSON.parse(prefs) : getDefaultPreferences();
  } catch (error) {
    logError('Failed to retrieve preferences', error);
    return getDefaultPreferences();
  }
};

/**
 * Get default preferences
 * 
 * @returns {object} Default preferences
 */
export const getDefaultPreferences = () => {
  return {
    topN: 10,
    itemsPerPage: 10,
    autoRefresh: true,
    refreshInterval: 30000,
    theme: 'light',
    notificationSounds: true
  };
};

/**
 * Update specific preference
 * 
 * @param {string} key - Preference key
 * @param {any} value - New value
 * @returns {boolean} Success status
 */
export const updatePreference = (key, value) => {
  try {
    const prefs = getPreferences();
    prefs[key] = value;
    return savePreferences(prefs);
  } catch (error) {
    logError('Failed to update preference', error, { key, value });
    return false;
  }
};

/**
 * Update last sync timestamp
 * 
 * @returns {boolean} Success status
 */
export const updateLastSync = () => {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, JSON.stringify(new Date().toISOString()));
    return true;
  } catch (error) {
    logError('Failed to update last sync', error);
    return false;
  }
};

/**
 * Get last sync timestamp
 * 
 * @returns {string|null} ISO timestamp or null
 */
export const getLastSync = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  } catch (error) {
    logError('Failed to get last sync', error);
    return null;
  }
};

export default {
  markNotificationAsViewed,
  getViewedNotifications,
  isNotificationViewed,
  clearViewedNotifications,
  savePreferences,
  getPreferences,
  getDefaultPreferences,
  updatePreference,
  updateLastSync,
  getLastSync,
  STORAGE_KEYS
};
