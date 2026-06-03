/**
 * NOTIFICATION CARD COMPONENT
 * 
 * Displays individual notification with:
 * - Type badge
 * - Priority indicator
 * - Timestamp
 * - View/Unread status
 * - Hover effects
 * - Responsive design
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Badge,
  useTheme
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon
} from '@mui/icons-material';
import {
  formatRelativeTime,
  getTypeBadgeStyle,
  truncateText,
  getPriorityLabel
} from '../../utils/formatUtils.js';
import { isNotificationViewed, markNotificationAsViewed } from '../../utils/storageUtils.js';
import { logNotificationView, logUserAction } from '../../middleware/logger.js';

/**
 * Notification Card Component
 */
const NotificationCard = ({
  notification,
  showPriority = false,
  onClick,
  onBookmark
}) => {
  const [isViewed, setIsViewed] = React.useState(
    () => isNotificationViewed(notification?.id)
  );
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const theme = useTheme();

  const handleCardClick = () => {
    if (!isViewed) {
      markNotificationAsViewed(notification.id);
      setIsViewed(true);
      logNotificationView(notification.id, notification.notification_type, true);
    }
    onClick?.(notification);
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onBookmark?.(notification.id);
    logUserAction('BOOKMARK', 'Notification', {
      notificationId: notification.id,
      bookmarked: !isBookmarked
    });
  };

  const badgeStyle = getTypeBadgeStyle(notification.notification_type);
  const priorityLabel = showPriority ? getPriorityLabel(notification.notification_type) : null;

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        mb: 2,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        borderLeft: `4px solid ${badgeStyle.color}`,
        backgroundColor: isViewed
          ? theme.palette.background.paper
          : theme.palette.info.lighter,
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)',
          backgroundColor: isViewed
            ? theme.palette.action.hover
            : theme.palette.info.lighter
        },
        opacity: isViewed ? 0.8 : 1
      }}
    >
      <CardHeader
        avatar={
          <Badge
            overlap="circular"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            variant="dot"
            color={isViewed ? 'default' : 'error'}
            invisible={isViewed}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: badgeStyle.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}
            >
              {notification.notification_type[0]}
            </Box>
          </Badge>
        }
        action={
          <Box>
            <Tooltip title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}>
              <IconButton size="small" onClick={handleBookmark}>
                {isBookmarked ? (
                  <BookmarkIcon fontSize="small" color="primary" />
                ) : (
                  <BookmarkBorderIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
            <IconButton size="small">
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        }
        title={
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: isViewed ? 500 : 700,
              color: isViewed ? 'text.secondary' : 'text.primary'
            }}
          >
            {truncateText(notification.title, 60)}
          </Typography>
        }
        subheader={
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
            <Chip
              label={badgeStyle.label}
              size="small"
              sx={{
                backgroundColor: badgeStyle.color,
                color: 'white',
                fontWeight: 600,
                height: 24
              }}
            />
            {showPriority && priorityLabel && (
              <Chip
                label={priorityLabel.label}
                size="small"
                icon={<span>{priorityLabel.icon}</span>}
                sx={{
                  height: 24,
                  backgroundColor: `${priorityLabel.color}15`,
                  color: priorityLabel.color,
                  fontWeight: 500
                }}
              />
            )}
            <Typography variant="caption" sx={{ color: 'text.secondary', ml: 'auto' }}>
              {formatRelativeTime(notification.timestamp)}
            </Typography>
          </Box>
        }
        sx={{ pb: 1 }}
      />

      <CardContent sx={{ pt: 0 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1,
            lineHeight: 1.6,
            color: isViewed ? 'text.secondary' : 'text.primary'
          }}
        >
          {truncateText(notification.description || notification.message || 'No description', 150)}
        </Typography>

        {notification.metadata && (
          <Box sx={{ mt: 1, p: 1, backgroundColor: 'action.hover', borderRadius: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              <strong>ID:</strong> {notification.id?.substring(0, 12)}...
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
