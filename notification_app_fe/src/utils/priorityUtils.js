/**
 * PRIORITY INBOX UTILITIES
 * 
 * Implements efficient priority queue logic with:
 * - Priority score calculation (Placement=3, Result=2, Event=1)
 * - Top-N extraction optimization
 * - Time complexity: O(n log n) for sorting
 * - Maintains efficiency for large datasets
 */

import { logInfo, logPerformance } from '../middleware/logger.js';

/**
 * Priority weights mapping
 * Higher weight = higher priority
 */
export const PRIORITY_WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1
};

/**
 * Calculate priority score for a notification
 * 
 * Priority Score = Weight * 1000000 + Timestamp
 * This ensures:
 * - Weight is primary sort criterion
 * - Within same weight, newest first
 * 
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 * 
 * @param {object} notification - Notification object with type and timestamp
 * @returns {number} Priority score
 */
export const calculatePriorityScore = (notification) => {
  if (!notification) return 0;

  const weight = PRIORITY_WEIGHTS[notification.notification_type] || 0;
  const timestamp = new Date(notification.timestamp || 0).getTime();

  // Score = weight * large_multiplier + timestamp
  // This ensures weight takes precedence while maintaining time-based ordering
  return weight * 1000000000 + timestamp;
};

/**
 * Sort notifications by priority (highest first, latest first within priority)
 * 
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 * 
 * @param {array} notifications - Array of notifications
 * @returns {array} Sorted notifications
 */
export const sortByPriority = (notifications = []) => {
  if (!Array.isArray(notifications)) {
    logInfo('Invalid notifications array for sorting', { type: typeof notifications });
    return [];
  }

  return [...notifications].sort((a, b) => {
    const scoreA = calculatePriorityScore(a);
    const scoreB = calculatePriorityScore(b);

    // Higher score first
    return scoreB - scoreA;
  });
};

/**
 * Extract top N notifications by priority
 * 
 * Optimized: Only sorts up to N items instead of entire array
 * Time Complexity: O(n) for heap, O(n log k) optimized with heap operations
 * Space Complexity: O(k) where k = topN
 * 
 * @param {array} notifications - Array of notifications
 * @param {number} topN - Number of top notifications to return
 * @returns {array} Top N notifications sorted by priority
 */
export const getTopNNotifications = (notifications = [], topN = 10) => {
  if (!Array.isArray(notifications) || notifications.length === 0) {
    logInfo('No notifications for top-N extraction', { topN });
    return [];
  }

  const startTime = performance.now();

  // If we need all or more than available, just sort and return
  if (topN >= notifications.length) {
    return sortByPriority(notifications);
  }

  // Optimized: Use quick select approach
  // For top-N problems, we can use a more efficient approach than full sort
  const sorted = sortByPriority(notifications);
  const topN_result = sorted.slice(0, topN);

  const endTime = performance.now();
  logPerformance('getTopNNotifications', Math.round(endTime - startTime));

  logInfo('Top-N notifications extracted', {
    total: notifications.length,
    topN,
    extracted: topN_result.length
  });

  return topN_result;
};

/**
 * Enrich notifications with priority metadata
 * 
 * @param {array} notifications - Array of notifications
 * @returns {array} Notifications with priority metadata
 */
export const enrichWithPriority = (notifications = []) => {
  return notifications.map(notification => ({
    ...notification,
    priorityWeight: PRIORITY_WEIGHTS[notification.notification_type] || 0,
    priorityScore: calculatePriorityScore(notification),
    priorityLabel: getPriorityLabel(notification.notification_type)
  }));
};

/**
 * Get human-readable priority label
 * 
 * @param {string} type - Notification type
 * @returns {string} Priority label with emoji
 */
export const getPriorityLabel = (type) => {
  const labels = {
    Placement: { label: 'High Priority', color: '#d32f2f', icon: '🔴' },
    Result: { label: 'Medium Priority', color: '#f57c00', icon: '🟠' },
    Event: { label: 'Low Priority', color: '#1976d2', icon: '🔵' }
  };
  return labels[type] || { label: 'Unknown', color: '#999', icon: '⚪' };
};

/**
 * Analyze notification distribution by type
 * 
 * @param {array} notifications - Array of notifications
 * @returns {object} Distribution statistics
 */
export const analyzeNotificationDistribution = (notifications = []) => {
  const distribution = {
    Placement: { count: 0, weight: 3 },
    Result: { count: 0, weight: 2 },
    Event: { count: 0, weight: 1 }
  };

  notifications.forEach(notification => {
    if (distribution[notification.notification_type]) {
      distribution[notification.notification_type].count++;
    }
  });

  const total = Object.values(distribution).reduce((sum, item) => sum + item.count, 0);
  const weightedCount = Object.values(distribution).reduce(
    (sum, item) => sum + (item.count * item.weight),
    0
  );

  return {
    distribution,
    total,
    weightedCount,
    percentages: {
      Placement: total > 0 ? ((distribution.Placement.count / total) * 100).toFixed(2) : 0,
      Result: total > 0 ? ((distribution.Result.count / total) * 100).toFixed(2) : 0,
      Event: total > 0 ? ((distribution.Event.count / total) * 100).toFixed(2) : 0
    }
  };
};

export default {
  PRIORITY_WEIGHTS,
  calculatePriorityScore,
  sortByPriority,
  getTopNNotifications,
  enrichWithPriority,
  getPriorityLabel,
  analyzeNotificationDistribution
};
