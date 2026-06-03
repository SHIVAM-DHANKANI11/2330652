/**
 * PAGINATION COMPONENT
 * 
 * Provides:
 * - Page navigation
 * - Page size selector
 * - Previous/Next buttons
 * - Responsive design
 */

import React from 'react';
import {
  Box,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  FormLabel,
  Typography,
  Stack,
  Card,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { logUserAction } from '../../middleware/logger.js';

/**
 * Pagination Component
 */
const PaginationComponent = ({
  page,
  pageSize,
  totalRecords,
  onPageChange,
  onPageSizeChange
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const totalPages = Math.ceil(totalRecords / pageSize);
  const startRecord = (page - 1) * pageSize + 1;
  const endRecord = Math.min(page * pageSize, totalRecords);

  const handlePageChange = (event, newPage) => {
    onPageChange?.(newPage);
    logUserAction('PAGINATE', `Page ${newPage}`, { page: newPage, pageSize });
  };

  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    onPageSizeChange?.(newSize);
    logUserAction('CHANGE', 'Page Size', { pageSize: newSize });
  };

  return (
    <Card
      sx={{
        p: 2,
        mt: 3,
        backgroundColor: theme.palette.background.paper,
        boxShadow: 1
      }}
    >
      <Stack
        spacing={2}
        direction={isMobile ? 'column' : 'row'}
        justifyContent="space-between"
        alignItems={isMobile ? 'flex-start' : 'center'}
      >
        {/* Results Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Showing
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {startRecord}-{endRecord}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            of {totalRecords} results
          </Typography>
        </Box>

        {/* Page Size Selector */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <FormLabel sx={{ mb: 0.5, fontSize: '0.875rem', color: 'text.secondary' }}>
            Per Page
          </FormLabel>
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            sx={{
              backgroundColor: theme.palette.action.hover,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.divider
              }
            }}
          >
            <MenuItem value={5}>5 items</MenuItem>
            <MenuItem value={10}>10 items</MenuItem>
            <MenuItem value={20}>20 items</MenuItem>
            <MenuItem value={50}>50 items</MenuItem>
          </Select>
        </FormControl>

        {/* Pagination Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'center', width: isMobile ? '100%' : 'auto' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? 'small' : 'medium'}
            showFirstButton
            showLastButton
            disabled={totalPages <= 1}
          />
        </Box>
      </Stack>
    </Card>
  );
};

export default PaginationComponent;
