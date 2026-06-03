/**
 * NOTIFICATION CONTEXT
 * 
 * Centralized state management for:
 * - Notifications data
 * - Loading and error states
 * - Pagination
 * - Filters and search
 * - User preferences
 * 
 * Uses Context API + useReducer for scalable state management
 */

import React, { createContext, useReducer, useCallback } from 'react';
import { logInfo, logError } from '../middleware/logger.js';

export const NotificationContext = createContext();

/**
 * Initial state structure
 */
const initialState = {
  // Data
  notifications: [],
  priorityNotifications: [],

  // Pagination
  page: 1,
  pageSize: 10,
  totalRecords: 0,

  // Filters
  selectedType: null,
  searchTerm: '',

  // Priority Inbox
  topN: 10,

  // UI State
  loading: false,
  error: null,
  success: null,

  // Metadata
  lastFetch: null,
  totalNotifications: 0
};

/**
 * Action types
 */
export const ACTIONS = {
  // Data actions
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  SET_PRIORITY_NOTIFICATIONS: 'SET_PRIORITY_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',

  // Pagination actions
  SET_PAGE: 'SET_PAGE',
  SET_PAGE_SIZE: 'SET_PAGE_SIZE',
  SET_TOTAL_RECORDS: 'SET_TOTAL_RECORDS',

  // Filter actions
  SET_SELECTED_TYPE: 'SET_SELECTED_TYPE',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  RESET_FILTERS: 'RESET_FILTERS',

  // Priority actions
  SET_TOP_N: 'SET_TOP_N',

  // UI actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SUCCESS: 'SET_SUCCESS',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_SUCCESS: 'CLEAR_SUCCESS',

  // Reset
  RESET_STATE: 'RESET_STATE'
};

/**
 * Reducer function
 */
const notificationReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_NOTIFICATIONS:
      logInfo('Setting notifications in state', { count: action.payload?.length || 0 });
      return {
        ...state,
        notifications: action.payload || [],
        lastFetch: new Date().toISOString(),
        error: null
      };

    case ACTIONS.SET_PRIORITY_NOTIFICATIONS:
      logInfo('Setting priority notifications', { count: action.payload?.length || 0 });
      return {
        ...state,
        priorityNotifications: action.payload || []
      };

    case ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        totalNotifications: state.totalNotifications + 1
      };

    case ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };

    case ACTIONS.SET_PAGE:
      logInfo('Page changed', { page: action.payload });
      return {
        ...state,
        page: action.payload
      };

    case ACTIONS.SET_PAGE_SIZE:
      return {
        ...state,
        pageSize: action.payload,
        page: 1 // Reset to first page when changing page size
      };

    case ACTIONS.SET_TOTAL_RECORDS:
      return {
        ...state,
        totalRecords: action.payload
      };

    case ACTIONS.SET_SELECTED_TYPE:
      logInfo('Filter applied', { type: action.payload });
      return {
        ...state,
        selectedType: action.payload,
        page: 1 // Reset to first page when filter changes
      };

    case ACTIONS.SET_SEARCH_TERM:
      logInfo('Search term set', { searchTerm: action.payload });
      return {
        ...state,
        searchTerm: action.payload,
        page: 1
      };

    case ACTIONS.RESET_FILTERS:
      logInfo('Filters reset');
      return {
        ...state,
        selectedType: null,
        searchTerm: '',
        page: 1
      };

    case ACTIONS.SET_TOP_N:
      logInfo('Top-N value set', { topN: action.payload });
      return {
        ...state,
        topN: action.payload
      };

    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: null
      };

    case ACTIONS.SET_ERROR:
      logError('Application error', new Error(action.payload));
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case ACTIONS.SET_SUCCESS:
      return {
        ...state,
        success: action.payload
      };

    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case ACTIONS.CLEAR_SUCCESS:
      return {
        ...state,
        success: null
      };

    case ACTIONS.RESET_STATE:
      logInfo('State reset to initial');
      return initialState;

    default:
      return state;
  }
};

/**
 * NotificationProvider component
 */
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Action creators
  const setNotifications = useCallback(
    (notifications) => dispatch({ type: ACTIONS.SET_NOTIFICATIONS, payload: notifications }),
    []
  );

  const setPriorityNotifications = useCallback(
    (notifications) => dispatch({ type: ACTIONS.SET_PRIORITY_NOTIFICATIONS, payload: notifications }),
    []
  );

  const addNotification = useCallback(
    (notification) => dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: notification }),
    []
  );

  const removeNotification = useCallback(
    (notificationId) => dispatch({ type: ACTIONS.REMOVE_NOTIFICATION, payload: notificationId }),
    []
  );

  const setPage = useCallback(
    (page) => dispatch({ type: ACTIONS.SET_PAGE, payload: page }),
    []
  );

  const setPageSize = useCallback(
    (pageSize) => dispatch({ type: ACTIONS.SET_PAGE_SIZE, payload: pageSize }),
    []
  );

  const setTotalRecords = useCallback(
    (total) => dispatch({ type: ACTIONS.SET_TOTAL_RECORDS, payload: total }),
    []
  );

  const setSelectedType = useCallback(
    (type) => dispatch({ type: ACTIONS.SET_SELECTED_TYPE, payload: type }),
    []
  );

  const setSearchTerm = useCallback(
    (term) => dispatch({ type: ACTIONS.SET_SEARCH_TERM, payload: term }),
    []
  );

  const resetFilters = useCallback(
    () => dispatch({ type: ACTIONS.RESET_FILTERS }),
    []
  );

  const setTopN = useCallback(
    (topN) => dispatch({ type: ACTIONS.SET_TOP_N, payload: topN }),
    []
  );

  const setLoading = useCallback(
    (loading) => dispatch({ type: ACTIONS.SET_LOADING, payload: loading }),
    []
  );

  const setError = useCallback(
    (error) => dispatch({ type: ACTIONS.SET_ERROR, payload: error }),
    []
  );

  const setSuccess = useCallback(
    (message) => dispatch({ type: ACTIONS.SET_SUCCESS, payload: message }),
    []
  );

  const clearError = useCallback(
    () => dispatch({ type: ACTIONS.CLEAR_ERROR }),
    []
  );

  const clearSuccess = useCallback(
    () => dispatch({ type: ACTIONS.CLEAR_SUCCESS }),
    []
  );

  const resetState = useCallback(
    () => dispatch({ type: ACTIONS.RESET_STATE }),
    []
  );

  const value = {
    // State
    state,

    // Setters
    setNotifications,
    setPriorityNotifications,
    addNotification,
    removeNotification,
    setPage,
    setPageSize,
    setTotalRecords,
    setSelectedType,
    setSearchTerm,
    resetFilters,
    setTopN,
    setLoading,
    setError,
    setSuccess,
    clearError,
    clearSuccess,
    resetState
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
