/**
 * PAGINATION UTILITIES
 * 
 * Helper functions for:
 * - Pagination calculation
 * - Page navigation
 * - Range calculations
 */

import { logPagination } from '../middleware/logger.js';

/**
 * Calculate pagination metadata
 * 
 * @param {number} totalRecords - Total number of records
 * @param {number} page - Current page (1-based)
 * @param {number} pageSize - Records per page
 * @returns {object} Pagination metadata
 */
export const calculatePaginationMetadata = (totalRecords, page = 1, pageSize = 10) => {
  const totalPages = Math.ceil(totalRecords / pageSize);
  const startRecord = (page - 1) * pageSize + 1;
  const endRecord = Math.min(page * pageSize, totalRecords);
  const validPage = Math.max(1, Math.min(page, totalPages));

  return {
    page: validPage,
    pageSize,
    totalRecords,
    totalPages,
    startRecord,
    endRecord,
    hasNextPage: validPage < totalPages,
    hasPreviousPage: validPage > 1,
    pageNumbers: generatePageNumbers(validPage, totalPages)
  };
};

/**
 * Generate array of page numbers for pagination controls
 * Shows 5 pages max: [prev, current-1, current, current+1, next]
 * 
 * @param {number} currentPage - Current page
 * @param {number} totalPages - Total pages
 * @param {number} maxVisible - Max pages to show (default 5)
 * @returns {array} Array of page numbers
 */
export const generatePageNumbers = (currentPage, totalPages, maxVisible = 5) => {
  const pages = [];
  
  if (totalPages <= maxVisible) {
    // Show all pages if fewer than max
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Show centered window of pages
    const halfWindow = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - halfWindow);
    let end = Math.min(totalPages, start + maxVisible - 1);

    // Adjust if window doesn't have enough pages
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    // Add ellipsis if needed at start
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    // Add page range
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis if needed at end
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
  }

  return pages;
};

/**
 * Calculate slice indices for array pagination
 * 
 * @param {number} page - Current page (1-based)
 * @param {number} pageSize - Records per page
 * @returns {object} Start and end indices
 */
export const calculateSliceIndices = (page = 1, pageSize = 10) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return { startIndex, endIndex };
};

/**
 * Slice array for pagination
 * 
 * @param {array} array - Array to paginate
 * @param {number} page - Current page (1-based)
 * @param {number} pageSize - Records per page
 * @returns {array} Sliced array for current page
 */
export const paginateArray = (array, page = 1, pageSize = 10) => {
  if (!Array.isArray(array)) return [];
  
  const { startIndex, endIndex } = calculateSliceIndices(page, pageSize);
  return array.slice(startIndex, endIndex);
};

/**
 * Check if page is valid
 * 
 * @param {number} page - Page to validate
 * @param {number} totalPages - Total pages
 * @returns {boolean} Is valid
 */
export const isValidPage = (page, totalPages) => {
  return page >= 1 && page <= totalPages;
};

/**
 * Get next page number
 * 
 * @param {number} currentPage - Current page
 * @param {number} totalPages - Total pages
 * @returns {number|null} Next page or null if at end
 */
export const getNextPage = (currentPage, totalPages) => {
  if (currentPage < totalPages) {
    return currentPage + 1;
  }
  return null;
};

/**
 * Get previous page number
 * 
 * @param {number} currentPage - Current page
 * @returns {number|null} Previous page or null if at start
 */
export const getPreviousPage = (currentPage) => {
  if (currentPage > 1) {
    return currentPage - 1;
  }
  return null;
};

/**
 * Log pagination change
 * 
 * @param {number} page - New page
 * @param {number} pageSize - Page size
 * @param {number} totalRecords - Total records
 */
export const logPaginationChange = (page, pageSize, totalRecords) => {
  logPagination(page, pageSize, totalRecords);
};

export default {
  calculatePaginationMetadata,
  generatePageNumbers,
  calculateSliceIndices,
  paginateArray,
  isValidPage,
  getNextPage,
  getPreviousPage,
  logPaginationChange
};
