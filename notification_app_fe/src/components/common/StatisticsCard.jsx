/**
 * STATISTICS CARD COMPONENT
 * 
 * Displays:
 * - Metric value
 * - Metric label
 * - Trend indicator
 * - Icon
 * - Color coding
 */

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

/**
 * Statistics Card Component
 */
const StatisticsCard = ({
  title,
  value,
  icon,
  color = 'primary',
  trend,
  trendLabel,
  suffix = '',
  prefix = ''
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${theme.palette[color].light} 0%, ${theme.palette[color].lighter || theme.palette[color].light}40 100%)`,
        boxShadow: 1,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-4px)'
        }
      }}
    >
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette[color].main,
              fontWeight: 600,
              fontSize: '0.9rem',
              letterSpacing: 0.5
            }}
          >
            {title.toUpperCase()}
          </Typography>
          {icon && (
            <Box
              sx={{
                p: 1,
                backgroundColor: `${theme.palette[color].main}20`,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.palette[color].main
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: theme.palette[color].main,
            mb: 1
          }}
        >
          {prefix}{value}{suffix}
        </Typography>

        {trend !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={trendLabel || `${Math.abs(trend)}% ${trend > 0 ? 'increase' : 'decrease'}`}
              size="small"
              icon={trend > 0 ? <TrendingUp /> : <TrendingDown />}
              color={trend > 0 ? 'success' : 'error'}
              variant="outlined"
              sx={{ mt: 'auto' }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
