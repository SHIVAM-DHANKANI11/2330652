/**
 * ALERT BANNER COMPONENT
 * 
 * Displays:
 * - Success messages
 * - Error messages
 * - Warning messages
 * - Info messages
 * - Auto-dismiss option
 */

import React, { useEffect } from 'react';
import {
  Alert,
  Box,
  IconButton,
  Collapse
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

/**
 * Alert Banner Component
 */
const AlertBanner = ({
  message,
  severity = 'info',
  onClose,
  autoDismiss = true,
  autoDismissDelay = 5000,
  open = true,
  title
}) => {
  const [isOpen, setIsOpen] = React.useState(open);

  useEffect(() => {
    if (autoDismiss && isOpen && message) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoDismissDelay);

      return () => clearTimeout(timer);
    }
  }, [autoDismiss, autoDismissDelay, isOpen, message]);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  if (!message) return null;

  return (
    <Collapse in={isOpen} sx={{ mb: 2 }}>
      <Alert
        severity={severity}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{
          borderRadius: 1,
          boxShadow: 1
        }}
      >
        {title && <strong>{title}</strong>}
        {title && message && ' - '}
        {message}
      </Alert>
    </Collapse>
  );
};

export default AlertBanner;
