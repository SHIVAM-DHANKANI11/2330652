/**
 * COMPREHENSIVE LOGGING MIDDLEWARE
 * 
 * Provides production-grade structured logging across the entire application.
 * All logs are generated in structured JSON format for easy parsing and monitoring.
 * 
 * Features:
 * - Structured JSON logging
 * - Log levels (INFO, ERROR, WARNING, DEBUG)
 * - Timestamp and session tracking
 * - Performance metrics
 * - API request/response logging
 * - User action tracking
 * - Navigation tracking
 * - Error stack traces
 */

const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR'
};

const LOG_CATEGORIES = {
  NAVIGATION: 'NAVIGATION',
  API: 'API',
  USER_ACTION: 'USER_ACTION',
  FILTER: 'FILTER',
  SEARCH: 'SEARCH',
  PAGINATION: 'PAGINATION',
  VIEW: 'VIEW',
  ERROR: 'ERROR',
  PERFORMANCE: 'PERFORMANCE',
  STATE: 'STATE'
};

// Generate unique session ID on app load
const SESSION_ID = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Format timestamp in ISO 8601 format
 * @returns {string} ISO timestamp
 */
const getTimestamp = () => new Date().toISOString();

/**
 * Create structured log object with metadata
 * @param {string} level - Log level
 * @param {string} category - Log category
 * @param {string} message - Log message
 * @param {object} data - Additional data
 * @returns {object} Structured log object
 */
const createLogStructure = (level, category, message, data = {}) => {
  return {
    timestamp: getTimestamp(),
    sessionId: SESSION_ID,
    level,
    category,
    message,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    ...data
  };
};

/**
 * Output log to console and storage
 * @param {object} logObject - Structured log object
 */
const outputLog = (logObject) => {
  const enableConsoleLogs = import.meta.env.VITE_ENABLE_CONSOLE_LOGS !== 'false';
  
  if (enableConsoleLogs) {
    const style = {
      DEBUG: 'color: #666;',
      INFO: 'color: #0066cc;',
      WARNING: 'color: #ff6600;',
      ERROR: 'color: #cc0000; font-weight: bold;'
    };
    
    console.log(
      `%c[${logObject.category}] ${logObject.message}`,
      style[logObject.level] || 'color: #000;'
    );
    console.log(logObject);
  }
  
  // Store logs in sessionStorage for debugging
  try {
    const logsKey = 'appLogs';
    const existingLogs = JSON.parse(sessionStorage.getItem(logsKey) || '[]');
    existingLogs.push(logObject);
    // Keep only last 100 logs to prevent storage overflow
    if (existingLogs.length > 100) {
      existingLogs.shift();
    }
    sessionStorage.setItem(logsKey, JSON.stringify(existingLogs));
  } catch (e) {
    console.warn('Could not store log in sessionStorage:', e);
  }
};

/**
 * logInfo - Log informational messages
 * Usage: logInfo('User opened notifications page')
 * Usage: logInfo('Fetching notifications', { count: 10 })
 */
export const logInfo = (message, data = {}) => {
  const logObject = createLogStructure(
    LOG_LEVELS.INFO,
    LOG_CATEGORIES.STATE,
    message,
    data
  );
  outputLog(logObject);
  return logObject;
};

/**
 * logError - Log errors with full context and stack trace
 * Usage: logError('Failed to fetch notifications', error, { userId: 123 })
 */
export const logError = (message, error, data = {}) => {
  const logObject = createLogStructure(
    LOG_LEVELS.ERROR,
    LOG_CATEGORIES.ERROR,
    message,
    {
      errorMessage: error?.message || 'Unknown error',
      errorCode: error?.code || null,
      errorStatus: error?.status || null,
      stack: error?.stack || 'No stack trace available',
      ...data
    }
  );
  outputLog(logObject);
  return logObject;
};

/**
 * logApiRequest - Log outgoing API requests
 * Usage: logApiRequest('GET', '/notifications', { page: 1, limit: 10 }, { Authorization: 'Bearer ...' })
 */
export const logApiRequest = (method, endpoint, params = {}, headers = {}) => {
  const logObject = createLogStructure(
    LOG_LEVELS.INFO,
    LOG_CATEGORIES.API,
    `API Request: ${method} ${endpoint}`,
    {
      method,
      endpoint,
      params,
      headersCount: Object.keys(headers).length,
      timestamp: getTimestamp()
    }
  );
  outputLog(logObject);
  return logObject;
};

/**
 * logApiResponse - Log received API responses
 * Usage: logApiResponse('GET', '/notifications', 200, response, 245)
 */
export const logApiResponse = (method, endpoint, statusCode, data, responseTime = 0) => {
  const logObject = createLogStructure(
    LOG_LEVELS.INFO,
    LOG_CATEGORIES.API,
    `API Response: ${method} ${endpoint} [${statusCode}]`,
    {
      method,
      endpoint,
      statusCode,
      dataSize: data ? JSON.stringify(data).length : 0,
      recordCount: Array.isArray(data) ? data.length : 1,
      responseTimeMs: responseTime,
      timestamp: getTimestamp(),
      success: statusCode >= 200 && statusCode < 300
    }
  );
  outputLog(logObject);
  return logObject;
};

/**
 * logNavigation - Log navigation events
 * Usage: logNavigation('/dashboard', '/notifications')
 */
export const logNavigation = (fromPage, toPage, additionalData = {}) => {
  const logObject = createLogStructure(
    LOG_LEVELS.INFO,
    LOG_CATEGORIES.NAVIGATION,
    `Navigation: ${fromPage} → ${toPage}`,
    {
      fromPage,
      toPage,
      timestamp: getTimestamp(),
      ...additionalData
    }
  );
  outputLog(logObject);
  return logObject;
};

/**
 * logUserAction - Log user interactions
 * Usage: logUserAction('BUTTON_CLICK', 'Mark as Read', { notificationId: 123 })
 */
export const logUserAction = (actionType, actionName, data = {}) => {
  const logObject = createLogStructure(
    LOG_LEVELS.INFO,
    LOG_CATEGORIES.USER_ACTION,
    `User Action: ${actionType} - ${actionName}`,
    {
      actionType,
      actionName,
      timestamp: getTimestamp(),
      ...data
    }
  );
  outputLog(logObject);
  return logObject;
};

/**
 * logFilter - Log filter/search operations
 * Usage: logFilter({ type: 'Placement', status: 'new' }, 5)
 */
export const logFilter = (filterParams, resultCount) => {
  const logObject = createLogStructure(
    LOG_LEVELS.INFO,
    LOG_CATEGORIES.FILTER,
    `Filters Applied`,
    {
      filters: filterParams,
      resultCount,
      timestamp: getTimestamp()
    }
  );
  outputLog(logObject);
  return logObject;
};

/**
 * logSearch - Log search operations
 * Usage: logSearch('placement term', 5)
 */
export const logSearch = (searchTerm, resultCount) => {
  const logObject = createLogStructure(
    LOG_LEVELS.INFO,
    LOG_CATEGORIES.SEARCH,
    `Search Performed: "${searchTerm}"`,
    {
      searchTerm,
      resultCount,
      timestamp: getTimestamp(),
      searchLength: searchTerm.length
    }
  );
  outputLog(logObject);
  return logObject;
};

/**
 * logPagination - Log pagination changes
 * Usage: logPagination(2, 10, 150)
 */
export const logPagination = (page, pageSize, totalRecords) => {
  const logObject = createLogStructure(
    LOG_LEVELS.INFO,
    LOG_CATEGORIES.PAGINATION,
    `Pagination Changed: Page ${page} (Size: ${pageSize})`,
    {
      page,
      pageSize,
      totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
      timestamp: getTimestamp()
    }
  );
  outputLog(logObject);
  return logObject;
};

/**
 * logNotificationView - Log when notification is viewed
 * Usage: logNotificationView('notification_123', 'Placement', true)
 */
export const logNotificationView = (notificationId, type, isNew) => {
  const logObject = createLogStructure(
    LOG_LEVELS.INFO,
    LOG_CATEGORIES.VIEW,
    `Notification Viewed: ${notificationId}`,
    {
      notificationId,
      type,
      isNew,
      timestamp: getTimestamp()
    }
  );
  outputLog(logObject);
  return logObject;
};

/**
 * logPerformance - Log performance metrics
 * Usage: logPerformance('notifications_load', 1234)
 */
export const logPerformance = (operationName, duration) => {
  const logObject = createLogStructure(
    LOG_LEVELS.INFO,
    LOG_CATEGORIES.PERFORMANCE,
    `Performance: ${operationName}`,
    {
      operationName,
      durationMs: duration,
      timestamp: getTimestamp()
    }
  );
  outputLog(logObject);
  return logObject;
};

/**
 * getSessionLogs - Retrieve all logs from current session
 * @returns {array} Array of log objects
 */
export const getSessionLogs = () => {
  try {
    const logs = sessionStorage.getItem('appLogs');
    return logs ? JSON.parse(logs) : [];
  } catch (e) {
    console.warn('Could not retrieve logs from sessionStorage:', e);
    return [];
  }
};

/**
 * clearSessionLogs - Clear all logs from session storage
 */
export const clearSessionLogs = () => {
  try {
    sessionStorage.removeItem('appLogs');
    logInfo('Session logs cleared');
  } catch (e) {
    console.warn('Could not clear logs from sessionStorage:', e);
  }
};

/**
 * exportLogs - Export current session logs as JSON file
 */
export const exportLogs = () => {
  const logs = getSessionLogs();
  const dataStr = JSON.stringify(logs, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `logs_${SESSION_ID}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export { LOG_LEVELS, LOG_CATEGORIES, SESSION_ID };
