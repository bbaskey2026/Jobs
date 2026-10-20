import React, { useState } from 'react';
import { Box, Button, Typography, Snackbar, Alert, Tooltip } from '@mui/material';
import { HelpOutline as HelpOutlineIcon } from '@mui/icons-material';

interface AuthSocialButtonsProps {
  mode: 'signup' | 'signin';
  onBusinessEmailClick?: () => void;
}

export const AuthSocialButtons: React.FC<AuthSocialButtonsProps> = ({
  mode,
  onBusinessEmailClick
}) => {
  const [ssoAlertOpen, setSsoAlertOpen] = useState(false);
  const [ssoProvider, setSsoProvider] = useState('');

  const handleSsoClick = (provider: string) => {
    setSsoProvider(provider);
    setSsoAlertOpen(true);
  };

  const actionText = mode === 'signup' ? 'SIGN UP' : 'SIGN IN';

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      {/* Divider */}
      <Box sx={{ display: 'flex', alignItems: 'center', my: 2.5 }}>
        <Box sx={{ flex: 1, height: '1px', bgcolor: '#E2E8F0' }} />
        <Typography
          variant="caption"
          sx={{
            px: 2,
            color: '#94A3B8',
            fontWeight: 600,
            letterSpacing: '0.05em',
            fontSize: '0.75rem'
          }}
        >
          OR
        </Typography>
        <Box sx={{ flex: 1, height: '1px', bgcolor: '#E2E8F0' }} />
      </Box>

      {/* Optional Business Email banner from screenshot */}
      {mode === 'signup' && (
        <Box
          onClick={onBusinessEmailClick}
          sx={{
            mb: 2,
            py: 1,
            px: 2,
            bgcolor: '#F0F7FF',
            border: '1px solid #BAE6FD',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            '&:hover': {
              bgcolor: '#E0F2FE',
              borderColor: '#7DD3FC'
            }
          }}
        >
          <Typography sx={{ fontSize: '0.825rem', color: '#0369A1', fontWeight: 500 }}>
            Sign up using your business email address
          </Typography>
          <Tooltip title="Using your official organization email unlocks fast-track verification" arrow>
            <HelpOutlineIcon sx={{ fontSize: 15, color: '#0284C7' }} />
          </Tooltip>
        </Box>
      )}

      {/* Google SSO Button */}
      <Button
        fullWidth
        variant="outlined"
        onClick={() => handleSsoClick('Google')}
        sx={{
          mb: 1.5,
          py: 1.1,
          px: 2,
          bgcolor: '#FFFFFF',
          borderColor: '#E2E8F0',
          color: '#1E293B',
          borderRadius: '6px',
          textTransform: 'none',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          '&:hover': {
            bgcolor: '#F8FAFC',
            borderColor: '#CBD5E1'
          }
        }}
      >
        {/* Google 4-color SVG */}
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <Typography sx={{ fontWeight: 600, fontSize: '0.825rem', letterSpacing: '0.02em', color: '#334155' }}>
          {actionText} WITH GOOGLE
        </Typography>
      </Button>

      {/* Microsoft SSO Button */}
      <Button
        fullWidth
        variant="outlined"
        onClick={() => handleSsoClick('Microsoft')}
        sx={{
          py: 1.1,
          px: 2,
          bgcolor: '#FFFFFF',
          borderColor: '#E2E8F0',
          color: '#1E293B',
          borderRadius: '6px',
          textTransform: 'none',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          '&:hover': {
            bgcolor: '#F8FAFC',
            borderColor: '#CBD5E1'
          }
        }}
      >
        {/* Microsoft 4-square SVG */}
        <svg width="17" height="17" viewBox="0 0 23 23">
          <path fill="#f25022" d="M1 1h10v10H1z" />
          <path fill="#00a4ef" d="M1 12h10v10H1z" />
          <path fill="#7fba00" d="M12 1h10v10H12z" />
          <path fill="#ffb900" d="M12 12h10v10H12z" />
        </svg>
        <Typography sx={{ fontWeight: 600, fontSize: '0.825rem', letterSpacing: '0.02em', color: '#334155' }}>
          {actionText} WITH MICROSOFT
        </Typography>
      </Button>

      {/* SSO Informational Alert Snackbar */}
      <Snackbar
        open={ssoAlertOpen}
        autoHideDuration={4000}
        onClose={() => setSsoAlertOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSsoAlertOpen(false)}
          severity="info"
          sx={{ borderRadius: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
        >
          {ssoProvider} Single Sign-On (SSO) integration is enabled. Please enter your email above or contact administrator for enterprise domain single sign-on.
        </Alert>
      </Snackbar>
    </Box>
  );
};
