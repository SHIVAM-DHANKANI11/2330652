/**
 * MATERIAL UI THEME CONFIGURATION
 * 
 * Custom theme with:
 * - Primary and secondary colors
 * - Typography settings
 * - Component overrides
 * - Responsive breakpoints
 */

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      lighter: '#e3f2fd',
      dark: '#1565c0'
    },
    secondary: {
      main: '#dc004e',
      light: '#f50057',
      dark: '#c51162'
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      lighter: '#ffebee'
    },
    warning: {
      main: '#f57c00',
      light: '#fb8c00',
      lighter: '#fff3e0'
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      lighter: '#e3f2fd'
    },
    success: {
      main: '#388e3c',
      light: '#4caf50',
      lighter: '#e8f5e9'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    },
    action: {
      hover: '#f0f0f0',
      selected: '#e3f2fd'
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 700,
      lineHeight: 1.4
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.4
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.5
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'All 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          transition: 'all 0.3s ease'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500
        }
      }
    }
  }
});

export default theme;
