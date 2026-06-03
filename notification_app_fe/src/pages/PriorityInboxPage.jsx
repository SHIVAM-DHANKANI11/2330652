/**
 * PRIORITY INBOX PAGE
 * 
 * Displays:
 * - Top N priority notifications
 * - Configurable N value
 * - Priority score display
 * - Type-based sorting
 */

import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Slider,
  Stack,
  Grid,
  Button,
  CircularProgress,
  useTheme,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Priority as PriorityIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import AlertBanner from '../components/common/AlertBanner.jsx';
import NotificationCard from '../components/notification/NotificationCard.jsx';
import SkeletonLoader from '../components/common/SkeletonLoader.jsx';
import { usePriorityNotifications, useTopN } from '../hooks/useNotifications.js';
import { logNavigation, logInfo, logUserAction } from '../middleware/logger.js';
import { updatePreference, getPreferences } from '../utils/storageUtils.js';

/**
 * Priority Inbox Page
 */
const PriorityInboxPage = () => {
  const theme = useTheme();
  const priorityNotifications = usePriorityNotifications();
  const topN = useTopN();
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [tempTopN, setTempTopN] = React.useState(topN.topN);

  useEffect(() => {
    logNavigation(window.location.pathname, '/priority-inbox');
    logInfo('Priority Inbox page loaded', { topN: topN.topN });
    
    // Fetch priority notifications
    priorityNotifications.fetchPriorityNotifications(topN.topN);
  }, []);

  useEffect(() => {
    // Refetch when topN changes
    priorityNotifications.fetchPriorityNotifications(topN.topN);
  }, [topN.topN]);

  const handleTopNChange = (newValue) => {
    topN.setTopN(newValue);
    updatePreference('topN', newValue);
  };

  const handleSettingsOpen = () => {
    setTempTopN(topN.topN);
    setSettingsOpen(true);
  };

  const handleSettingsSave = () => {
    handleTopNChange(tempTopN);
    setSettingsOpen(false);
    logUserAction('SAVE', 'Top-N Settings', { topN: tempTopN });
  };

  const handleRefresh = () => {
    logInfo('Manual refresh triggered for priority inbox');
    priorityNotifications.fetchPriorityNotifications(topN.topN);
  };

  // Group notifications by type
  const groupedByType = {
    Placement: priorityNotifications.priorityNotifications.filter(n => n.notification_type === 'Placement'),
    Result: priorityNotifications.priorityNotifications.filter(n => n.notification_type === 'Result'),
    Event: priorityNotifications.priorityNotifications.filter(n => n.notification_type === 'Event')
  };

  const typeColors = {
    Placement: '#d32f2f',
    Result: '#f57c00',
    Event: '#1976d2'
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            <PriorityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Priority Inbox
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Top {topN.topN} notifications by priority weight
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Fab
            size="small"
            onClick={handleRefresh}
            title="Refresh"
          >
            <RefreshIcon />
          </Fab>
          <Fab
            size="small"
            color="primary"
            onClick={handleSettingsOpen}
            title="Configure Top-N"
          >
            <SettingsIcon />
          </Fab>
        </Stack>
      </Box>

      {/* Alerts */}
      {priorityNotifications.error && (
        <AlertBanner
          message={priorityNotifications.error}
          severity="error"
          title="Error Loading Priority Notifications"
          onClose={() => {}}
        />
      )}

      {/* Configuration Card */}
      <Card sx={{ mb: 3, boxShadow: 1 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Configuration
          </Typography>
          <Grid container spacing={3} alignItems="flex-end">
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                  Show Top
                </Typography>
                <Slider
                  value={topN.topN}
                  onChange={(e, newValue) => handleTopNChange(newValue)}
                  min={5}
                  max={50}
                  step={5}
                  marks={[
                    { value: 5, label: '5' },
                    { value: 25, label: '25' },
                    { value: 50, label: '50' }
                  ]}
                  valueLabelDisplay="auto"
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button variant="contained" onClick={handleSettingsOpen}>
                Advanced Settings
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Priority Weights Info */}
      <Card sx={{ mb: 3, boxShadow: 1, backgroundColor: 'info.lighter' }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Priority Weights (Higher = First)
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 1, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#d32f2f'
                }}
              />
              <Typography variant="caption">
                <strong>Placement:</strong> Weight 3
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#f57c00'
                }}
              />
              <Typography variant="caption">
                <strong>Result:</strong> Weight 2
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#1976d2'
                }}
              />
              <Typography variant="caption">
                <strong>Event:</strong> Weight 1
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Notifications by Type */}
      {priorityNotifications.loading ? (
        <SkeletonLoader count={3} variant="notification" />
      ) : priorityNotifications.priorityNotifications.length === 0 ? (
        <Box
          sx={{
            py: 8,
            textAlign: 'center',
            backgroundColor: 'action.hover',
            borderRadius: 2
          }}
        >
          <PriorityIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
            No Priority Notifications
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Check back later for high-priority notifications
          </Typography>
        </Box>
      ) : (
        <Stack spacing={3}>
          {Object.entries(groupedByType)
            .filter(([type, notifications]) => notifications.length > 0)
            .map(([type, notifications]) => (
              <Box key={type}>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 4,
                      height: 24,
                      borderRadius: 2,
                      backgroundColor: typeColors[type]
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {type} ({notifications.length})
                  </Typography>
                </Box>

                <Stack spacing={2} sx={{ ml: 2 }}>
                  {notifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      showPriority={true}
                    />
                  ))}
                </Stack>
              </Box>
            ))}
        </Stack>
      )}

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Priority Inbox Settings</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                Show Top N Notifications
              </Typography>
              <TextField
                type="number"
                value={tempTopN}
                onChange={(e) => setTempTopN(Math.max(5, Math.min(100, parseInt(e.target.value) || 5)))}
                inputProps={{ min: 5, max: 100, step: 5 }}
                fullWidth
              />
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                Range: 5 - 100
              </Typography>
            </Box>

            <Box sx={{ p: 1.5, backgroundColor: 'info.lighter', borderRadius: 1 }}>
              <Typography variant="caption">
                <strong>Sorting Logic:</strong> Notifications are sorted by priority weight first (Placement &gt; Result &gt; Event), then by latest timestamp within each weight.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
          <Button onClick={handleSettingsSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PriorityInboxPage;
