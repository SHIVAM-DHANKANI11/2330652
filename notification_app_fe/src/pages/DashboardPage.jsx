/**
 * DASHBOARD PAGE
 * 
 * Displays:
 * - Statistics overview
 * - Notification distribution
 * - Recent notifications
 * - Quick actions
 */

import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Stack,
  Button
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  EventNote as EventIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import StatisticsCard from '../components/common/StatisticsCard.jsx';
import NotificationCard from '../components/notification/NotificationCard.jsx';
import AlertBanner from '../components/common/AlertBanner.jsx';
import SkeletonLoader from '../components/common/SkeletonLoader.jsx';
import { useNotifications, usePriorityNotifications } from '../hooks/useNotifications.js';
import { analyzeNotificationDistribution } from '../utils/priorityUtils.js';
import { logNavigation, logInfo } from '../middleware/logger.js';

/**
 * Dashboard Page
 */
const DashboardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [stats, setStats] = useState(null);

  const notifications = useNotifications();
  const priorityNotifications = usePriorityNotifications();

  useEffect(() => {
    logNavigation('/', '/dashboard');
    logInfo('Dashboard page loaded');
    
    // Fetch initial data
    notifications.fetchNotifications(1, 20);
    priorityNotifications.fetchPriorityNotifications(10);
  }, []);

  // Calculate statistics
  useEffect(() => {
    if (notifications.notifications.length > 0) {
      const distribution = analyzeNotificationDistribution(notifications.notifications);
      setStats({
        totalNotifications: notifications.totalRecords,
        placementCount: distribution.distribution.Placement.count,
        resultCount: distribution.distribution.Result.count,
        eventCount: distribution.distribution.Event.count,
        distribution
      });
    }
  }, [notifications.notifications]);

  const recentNotifications = notifications.notifications.slice(0, 5);

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Campus Notification System Overview
        </Typography>
      </Box>

      {/* Alerts */}
      {notifications.error && (
        <AlertBanner
          message={notifications.error}
          severity="error"
          title="Error"
          onClose={() => notifications.context?.clearError?.()}
        />
      )}

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatisticsCard
            title="Total Notifications"
            value={stats?.totalNotifications || 0}
            icon={<NotificationsIcon />}
            color="primary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatisticsCard
            title="Placement"
            value={stats?.placementCount || 0}
            icon={<SchoolIcon />}
            color="error"
            trend={5}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatisticsCard
            title="Result"
            value={stats?.resultCount || 0}
            icon={<AssignmentIcon />}
            color="warning"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatisticsCard
            title="Events"
            value={stats?.eventCount || 0}
            icon={<EventIcon />}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Notifications */}
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Notifications
                </Typography>
                <Button
                  size="small"
                  href="/notifications"
                  sx={{ textTransform: 'none' }}
                >
                  View All →
                </Button>
              </Box>

              {notifications.loading ? (
                <SkeletonLoader count={3} variant="notification" />
              ) : recentNotifications.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography sx={{ color: 'text.secondary' }}>
                    No notifications yet
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {recentNotifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      showPriority={false}
                    />
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Side Information */}
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            {/* Priority Inbox */}
            <Card sx={{ boxShadow: 1 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Top Notifications
                </Typography>

                {priorityNotifications.loading ? (
                  <CircularProgress size={24} />
                ) : priorityNotifications.priorityNotifications.length === 0 ? (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No priority notifications
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {priorityNotifications.priorityNotifications.slice(0, 5).map((notification) => (
                      <Box
                        key={notification.id}
                        sx={{
                          p: 1.5,
                          backgroundColor: 'action.hover',
                          borderRadius: 1,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: 'action.selected',
                            transform: 'translateX(4px)'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                          <Box
                            sx={{
                              px: 1,
                              py: 0.5,
                              backgroundColor: 'primary.light',
                              borderRadius: '4px',
                              minWidth: 32,
                              textAlign: 'center',
                              fontWeight: 600,
                              color: 'primary.main'
                            }}
                          >
                            {notification.priorityWeight}
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 600,
                                display: 'block',
                                mb: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {notification.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.secondary',
                                display: 'block',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {notification.notification_type}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>

            {/* Distribution Info */}
            {stats?.distribution && (
              <Card sx={{ boxShadow: 1 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Distribution
                  </Typography>
                  <Stack spacing={1.5}>
                    {Object.entries(stats.distribution.percentages).map(([type, percentage]) => (
                      <Box key={type}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {type}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                            {percentage}%
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'action.hover',
                            overflow: 'hidden'
                          }}
                        >
                          <Box
                            sx={{
                              height: '100%',
                              width: `${percentage}%`,
                              backgroundColor: type === 'Placement' ? 'error.main' : type === 'Result' ? 'warning.main' : 'info.main',
                              transition: 'width 0.3s ease'
                            }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
