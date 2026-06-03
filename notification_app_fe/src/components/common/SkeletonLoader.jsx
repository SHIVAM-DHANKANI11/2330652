/**
 * LOADING SKELETON COMPONENT
 * 
 * Shows placeholder loading state
 */

import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Skeleton,
  Stack,
  Box
} from '@mui/material';

/**
 * Skeleton Loader Component
 */
const SkeletonLoader = ({ count = 3, variant = 'notification' }) => {
  if (variant === 'notification') {
    return (
      <Stack spacing={2}>
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index}>
            <CardHeader
              avatar={<Skeleton variant="circular" width={40} height={40} />}
              title={<Skeleton variant="text" width="60%" />}
              subheader={<Skeleton variant="text" width="40%" />}
            />
            <CardContent>
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" width="80%" />
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  if (variant === 'statistics') {
    return (
      <Stack direction="row" spacing={2}>
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} sx={{ flex: 1 }}>
            <CardContent>
              <Skeleton variant="text" width="60%" sx={{ mb: 1 }} />
              <Skeleton variant="text" height={40} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" />
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  return null;
};

export default SkeletonLoader;
