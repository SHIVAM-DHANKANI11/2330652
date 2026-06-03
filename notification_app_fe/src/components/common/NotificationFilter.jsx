/**
 * FILTER & SEARCH COMPONENT
 * 
 * Provides:
 * - Type filtering
 * - Search
 * - Reset filters
 * - Responsive layout
 */

import React, { useState } from 'react';
import {
  Box,
  Card,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Chip,
  Stack,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Clear as ClearIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { logFilter, logSearch, logUserAction } from '../../middleware/logger.js';

/**
 * Filter Component
 */
const NotificationFilter = ({
  selectedType,
  onTypeChange,
  searchTerm,
  onSearchChange,
  onReset,
  resultCount = 0
}) => {
  const [localSearch, setLocalSearch] = useState(searchTerm || '');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const types = [
    { value: 'Placement', label: 'Placement' },
    { value: 'Result', label: 'Result' },
    { value: 'Event', label: 'Event' }
  ];

  const handleTypeChange = (event, newType) => {
    onTypeChange(newType);
    logFilter({ type: newType }, resultCount);
    logUserAction('FILTER', 'Type Changed', { selectedType: newType });
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setLocalSearch(value);
    onSearchChange(value);
    if (value.length > 0) {
      logSearch(value, resultCount);
    }
  };

  const handleReset = () => {
    setLocalSearch('');
    onReset?.();
    logUserAction('RESET', 'Filters', {});
  };

  const hasActiveFilters = selectedType || localSearch;

  return (
    <Card
      sx={{
        p: 2,
        mb: 3,
        backgroundColor: theme.palette.background.paper,
        boxShadow: 1
      }}
    >
      <Stack spacing={2}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Filters
          </Typography>
          {hasActiveFilters && (
            <Button
              startIcon={<ClearIcon />}
              size="small"
              onClick={handleReset}
              color="inherit"
              sx={{
                textTransform: 'none',
                '&:hover': { backgroundColor: 'action.hover' }
              }}
            >
              Clear All
            </Button>
          )}
        </Box>

        {/* Search Box */}
        <TextField
          placeholder="Search notifications..."
          variant="outlined"
          size="small"
          value={localSearch}
          onChange={handleSearchChange}
          StartAdornment={<SearchIcon sx={{ mr: 1 }} />}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: theme.palette.action.hover
            }
          }}
        />

        {/* Type Filter */}
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
            Filter by Type
          </Typography>
          <ToggleButtonGroup
            value={selectedType}
            exclusive
            onChange={handleTypeChange}
            fullWidth={isMobile}
            size="small"
            sx={{
              display: 'flex',
              gap: 1,
              '& .MuiToggleButton-root': {
                textTransform: 'none',
                flex: isMobile ? 1 : 'auto',
                border: `1px solid ${theme.palette.divider}`
              }
            }}
          >
            <ToggleButton value={null} sx={{ minWidth: 80 }}>
              <Typography variant="caption">All</Typography>
            </ToggleButton>
            {types.map((type) => (
              <ToggleButton key={type.value} value={type.value} sx={{ minWidth: 100 }}>
                <Typography variant="caption">{type.label}</Typography>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <Box sx={{
            p: 1.5,
            backgroundColor: 'info.lighter',
            borderRadius: 1,
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              Active Filters:
            </Typography>
            {selectedType && (
              <Chip
                label={`Type: ${selectedType}`}
                size="small"
                color="primary"
                variant="outlined"
                onDelete={() => handleTypeChange(null, null)}
              />
            )}
            {localSearch && (
              <Chip
                label={`Search: "${localSearch}"`}
                size="small"
                color="primary"
                variant="outlined"
                onDelete={() => handleSearchChange({ target: { value: '' } })}
              />
            )}
          </Box>
        )}

        {/* Results Info */}
        <Box sx={{
          p: 1,
          backgroundColor: theme.palette.action.hover,
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Results
          </Typography>
          <Chip
            label={`${resultCount} notification${resultCount !== 1 ? 's' : ''}`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
      </Stack>
    </Card>
  );
};

export default NotificationFilter;
