/**
 * HEADER / APP BAR COMPONENT
 * 
 * Main application header with:
 * - Navigation branding
 * - Search functionality
 * - User menu
 * - Responsive design
 */

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  AccountCircle,
  Info as InfoIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { logUserAction } from '../../middleware/logger.js';
import { exportLogs } from '../../middleware/logger.js';

const SearchBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.common.white,
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

/**
 * Header Component
 */
const Header = ({ onMenuClick, onSearch, notificationCount = 0 }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchValue, setSearchValue] = React.useState('');

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    onSearch?.(value);
    logUserAction('SEARCH', 'Header Search', { query: value });
  };

  const handleExportLogs = () => {
    exportLogs();
    logUserAction('EXPORT', 'Session Logs', {});
    handleMenuClose();
  };

  return (
    <AppBar position="sticky" sx={{ zIndex: 100, boxShadow: 1 }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          sx={{
            flexGrow: 0,
            fontWeight: 'bold',
            letter spacing: 0.5,
            minWidth: 200
          }}
        >
          Campus Notifications
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <SearchBox>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search notifications..."
            value={searchValue}
            onChange={handleSearch}
            inputProps={{ 'aria-label': 'search' }}
          />
        </SearchBox>

        <IconButton
          size="large"
          color="inherit"
          onClick={handleMenuOpen}
        >
          <AccountCircle />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => {
            handleMenuClose();
            logUserAction('CLICK', 'View About', {});
          }}>
            <InfoIcon sx={{ mr: 1 }} /> About
          </MenuItem>
          <MenuItem onClick={handleExportLogs}>
            <DownloadIcon sx={{ mr: 1 }} /> Export Logs
          </MenuItem>
          <MenuItem onClick={() => {
            handleMenuClose();
            logUserAction('CLICK', 'Logout', {});
          }}>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
