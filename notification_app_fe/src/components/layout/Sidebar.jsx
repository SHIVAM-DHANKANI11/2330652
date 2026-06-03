/**
 * SIDEBAR / NAVIGATION DRAWER COMPONENT
 * 
 * Navigation with:
 * - Main menu items
 * - Collapsible drawer
 * - Responsive design
 * - Active route highlighting
 */

import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  Priority as PriorityIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { logNavigation } from '../../middleware/logger.js';

const DRAWER_WIDTH = 280;

/**
 * Sidebar Navigation Component
 */
const Sidebar = ({ open, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { label: 'Notifications', path: '/notifications', icon: <NotificationsIcon /> },
    { label: 'Priority Inbox', path: '/priority-inbox', icon: <PriorityIcon /> }
  ];

  const handleNavigate = (path) => {
    logNavigation(location.pathname, path);
    navigate(path);
    if (isMobile) {
      onClose?.();
    }
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const drawerContent = (
    <Box sx={{ overflow: 'auto', height: '100%' }}>
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white'
        }}
      >
        <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
          NAVIGATION
        </Typography>
      </Box>

      <List sx={{ pt: 2 }}>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => handleNavigate(item.path)}
            selected={isActive(item.path)}
            sx={{
              mx: 1,
              mb: 0.5,
              borderRadius: 1,
              transition: 'all 0.3s ease',
              backgroundColor: isActive(item.path)
                ? theme.palette.primary.light
                : 'transparent',
              '&:hover': {
                backgroundColor: isActive(item.path)
                  ? theme.palette.primary.light
                  : theme.palette.action.hover
              },
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.light,
                '&:hover': {
                  backgroundColor: theme.palette.primary.light
                }
              }
            }}
          >
            <ListItemIcon
              sx={{
                color: isActive(item.path)
                  ? theme.palette.primary.main
                  : 'inherit',
                minWidth: 40
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: isActive(item.path) ? 600 : 400
              }}
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ p: 2 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Campus Notification System v1.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          anchor="left"
          open={open}
          onClose={onClose}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box'
            }
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              marginTop: '64px',
              height: 'calc(100vh - 64px)'
            }
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
export { DRAWER_WIDTH };
