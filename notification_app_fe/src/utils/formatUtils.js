/**
 * FORMATTING UTILITIES
 * 
 * Helper functions for:
 * - Date/time formatting
 * - Text truncation
 * - String manipulation
 * - Type conversion
 */

import { logInfo } from '../middleware/logger.js';

/**
 * Format date to relative time (e.g., "2 hours ago")
 * 
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return 'Unknown';

  try {
    const d = new Date(date);
    const now = new Date();
    const seconds = Math.floor((now - d) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    // For older dates, show actual date
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  } catch (error) {
    logInfo('Error formatting relative time', { date, error: error.message });
    return 'Unknown';
  }
};

/**
 * Format date to readable string
 * 
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';

  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    logInfo('Error formatting date', { date });
    return 'N/A';
  }
};

/**
 * Format date to short date string
 * 
 * @param {string|Date} date - Date to format
 * @returns {string} Short date string (e.g., "Jan 15, 2024")
 */
export const formatShortDate = (date) => {
  if (!date) return 'N/A';

  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    logInfo('Error formatting short date', { date });
    return 'N/A';
  }
};

/**
 * Format date to time only
 * 
 * @param {string|Date} date - Date to format
 * @returns {string} Time string (e.g., "2:30 PM")
 */
export const formatTime = (date) => {
  if (!date) return 'N/A';

  try {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      meridiem: 'short'
    });
  } catch (error) {
    logInfo('Error formatting time', { date });
    return 'N/A';
  }
};

/**
 * Truncate text to specified length with ellipsis
 * 
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Get initials from full name
 * 
 * @param {string} name - Full name
 * @returns {string} Initials (e.g., "JD" for "John Doe")
 */
export const getInitials = (name) => {
  if (!name || typeof name !== 'string') return 'U';
  
  return name
    .split(' ')
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || '')
    .join('');
};

/**
 * Capitalize first letter of string
 * 
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Format notification type with proper capitalization and styling
 * 
 * @param {string} type - Notification type
 * @returns {string} Formatted type
 */
export const formatNotificationType = (type) => {
  if (!type) return 'Unknown';
  return capitalize(type);
};

/**
 * Get color for notification type
 * 
 * @param {string} type - Notification type
 * @returns {string} Color value
 */
export const getTypeColor = (type) => {
  const colors = {
    Placement: '#d32f2f',  // Red
    Result: '#f57c00',      // Orange
    Event: '#1976d2'        // Blue
  };
  return colors[type] || '#666';
};

/**
 * Get badge style for notification type
 * 
 * @param {string} type - Notification type
 * @returns {object} Badge style object
 */
export const getTypeBadgeStyle = (type) => {
  const styles = {
    Placement: {
      backgroundColor: '#ffebee',
      color: '#c62828',
      label: 'Placement'
    },
    Result: {
      backgroundColor: '#fff3e0',
      color: '#e65100',
      label: 'Result'
    },
    Event: {
      backgroundColor: '#e3f2fd',
      color: '#0d47a1',
      label: 'Event'
    }
  };
  return styles[type] || { backgroundColor: '#f5f5f5', color: '#424242', label: type };
};

/**
 * Format large numbers with abbreviations
 * 
 * @param {number} num - Number to format
 * @returns {string} Formatted number (e.g., "1.5K", "2.3M")
 */
export const formatLargeNumber = (num) => {
  if (!num) return '0';
  
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export default {
  formatRelativeTime,
  formatDate,
  formatShortDate,
  formatTime,
  truncateText,
  getInitials,
  capitalize,
  formatNotificationType,
  getTypeColor,
  getTypeBadgeStyle,
  formatLargeNumber
};
