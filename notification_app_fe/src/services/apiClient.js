/**
 * AXIOS API CLIENT CONFIGURATION
 * 
 * Centralized API client with:
 * - Automatic request/response logging
 * - Error handling and logging
 * - Request interceptors
 * - Response interceptors
 * - Global error handling
 * - Performance tracking
 */

import axios from 'axios';
import {
  logApiRequest,
  logApiResponse,
  logError,
  logPerformance,
  logInfo
} from '../middleware/logger.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://4.224.186.213/evaluation-service';

/**
 * Create axios instance with custom configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * REQUEST INTERCEPTOR
 * Logs all outgoing requests with parameters and headers
 */
apiClient.interceptors.request.use(
  (config) => {
    const requestStartTime = performance.now();
    
    // Store start time for performance tracking
    config.metadata = { startTime: requestStartTime };
    
    // Log the request
    logApiRequest(
      config.method.toUpperCase(),
      config.url,
      { params: config.params, data: config.data },
      config.headers
    );
    
    return config;
  },
  (error) => {
    logError('Request interceptor error', error);
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * Logs all responses with status codes and performance metrics
 */
apiClient.interceptors.response.use(
  (response) => {
    const endTime = performance.now();
    const responseTime = endTime - (response.config.metadata?.startTime || endTime);
    
    // Log successful response
    logApiResponse(
      response.config.method.toUpperCase(),
      response.config.url,
      response.status,
      response.data,
      Math.round(responseTime)
    );
    
    logPerformance(
      `${response.config.method.toUpperCase()} ${response.config.url}`,
      Math.round(responseTime)
    );
    
    return response;
  },
  (error) => {
    if (error.response) {
      // Response with error status code
      logError(
        `API Error ${error.response.status}`,
        error,
        {
          endpoint: error.config.url,
          method: error.config.method?.toUpperCase(),
          statusCode: error.response.status,
          responseData: error.response.data
        }
      );
    } else if (error.request) {
      // Request made but no response
      logError(
        'API No Response',
        error,
        {
          endpoint: error.config?.url,
          message: 'Server did not respond to request'
        }
      );
    } else {
      // Error in request setup
      logError('API Request Setup Error', error);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
