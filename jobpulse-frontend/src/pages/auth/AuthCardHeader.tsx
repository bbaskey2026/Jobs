import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface AuthCardHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthCardHeader: React.FC<AuthCardHeaderProps> = ({
  title,
  subtitle
}) => {
  return (
    <Box sx={{ textAlign: 'center', mb: 3 }}>
      {/* Brand Logo in the Card (Tracxn style) */}
      <Box
        component={RouterLink}
        to="/"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1.25,
          textDecoration: 'none',
          color: 'inherit',
          mb: 2.25
        }}
      >
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            bgcolor: '#0F2A4A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(15, 42, 74, 0.15)'
          }}
        >
          {/* Swirl/Pulse SVG icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#38BDF8" strokeWidth="2.5" />
            <path
              d="M7 12H10L12 8L14 16L16 12H17"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
          <Typography
            sx={{
              fontFamily: "'Roboto', 'Inter', sans-serif",
              fontWeight: 800,
              color: '#0F2A4A',
              fontSize: '1.45rem',
              letterSpacing: '-0.03em',
              lineHeight: 1
            }}
          >
            JobPulse
          </Typography>
          <Box
            component="span"
            sx={{ width: 5.5, height: 5.5, bgcolor: '#2563EB', borderRadius: '50%', ml: 0.5 }}
          />
        </Box>
      </Box>

      {/* Title */}
      <Typography
        variant="h5"
        sx={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700,
          color: '#0F172A',
          fontSize: { xs: '1.25rem', sm: '1.35rem' },
          letterSpacing: '-0.01em',
          mb: 0.5
        }}
      >
        {title}
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="body2"
        sx={{
          color: '#64748B',
          fontSize: '0.875rem'
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};
