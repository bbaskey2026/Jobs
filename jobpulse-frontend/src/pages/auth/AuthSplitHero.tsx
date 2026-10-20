import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';

interface AuthSplitHeroProps {
  headingTitle?: string;
  headingHighlight?: string;
  subtitle?: string;
  bulletItems?: Array<{ highlight1: string; text1: string; highlight2: string; text2: string }>;
  trustedText?: string;
}

export const AuthSplitHero: React.FC<AuthSplitHeroProps> = ({
  headingTitle = 'Our Lite Plan awaits you -',
  headingHighlight = "It's Free!",
  subtitle = 'Complete your sign up to unlock full access to curated data',
  bulletItems = [
    { highlight1: '8.4M+', text1: 'Companies,', highlight2: '292K+', text2: 'Investors' },
    { highlight1: '2M+', text1: 'Funding Rounds,', highlight2: '229K+', text2: 'Acquisitions' },
    { highlight1: '3K+', text1: 'Sectors,', highlight2: '55.7K+', text2: 'Business Models' }
  ],
  trustedText = 'JobPulse is trusted by 1,000+ customers across 30+ countries'
}) => {
  return (
    <Box sx={{ maxWidth: { xs: '100%', md: 480 }, py: { xs: 2, md: 4 } }}>
      {/* Main Headline matching Tracxn style */}
      <Typography
        variant="h3"
        sx={{
          fontFamily: "'Inter', 'Roboto', sans-serif",
          fontWeight: 700,
          color: '#1E293B',
          fontSize: { xs: '1.75rem', sm: '2rem', md: '2.35rem' },
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
          mb: 1.5
        }}
      >
        {headingTitle}{' '}
        <Box
          component="span"
          sx={{
            color: '#059669', // Vibrant emerald green from Tracxn screenshot
            fontWeight: 800
          }}
        >
          {headingHighlight}
        </Box>
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="body1"
        sx={{
          color: '#475569',
          fontSize: { xs: '0.95rem', md: '1.05rem' },
          fontWeight: 400,
          lineHeight: 1.5,
          mb: 4
        }}
      >
        {subtitle}
      </Typography>

      {/* Feature Checkmarks List */}
      <Stack spacing={2.25} sx={{ mb: 6 }}>
        {bulletItems.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
            <Box
              sx={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                bgcolor: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
              }}
            >
              <CheckIcon sx={{ fontSize: 14, stroke: '#FFFFFF', strokeWidth: 1.5 }} />
            </Box>
            <Typography
              sx={{
                color: '#334155',
                fontSize: { xs: '0.925rem', md: '0.975rem' },
                lineHeight: 1.4
              }}
            >
              <Box component="span" sx={{ fontWeight: 700, color: '#0F172A' }}>
                {item.highlight1}
              </Box>{' '}
              {item.text1}{' '}
              <Box component="span" sx={{ fontWeight: 700, color: '#0F172A' }}>
                {item.highlight2}
              </Box>{' '}
              {item.text2}
            </Typography>
          </Box>
        ))}
      </Stack>

      {/* Social Proof Statement */}
      <Typography
        variant="body2"
        sx={{
          color: '#334155',
          fontSize: '0.9rem',
          fontWeight: 600,
          mb: 3
        }}
      >
        {trustedText}
      </Typography>

      {/* Partner Logos Row (Pixel-perfect matches for Accel, Partech, IQT, Fujitsu, Tenity, Stanford) */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: { xs: 2, sm: 3 },
          opacity: 0.95
        }}
      >
        {/* Accel Badge */}
        <Box
          sx={{
            bgcolor: '#4C1D95',
            color: '#FFFFFF',
            px: 1.5,
            py: 0.6,
            borderRadius: '4px',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800,
            fontSize: '0.95rem',
            letterSpacing: '-0.02em',
            display: 'inline-flex',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(76, 29, 149, 0.2)'
          }}
        >
          Accel
        </Box>

        {/* partech */}
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#0EA5E9" />
            <path d="M2 17L12 22L22 17" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: '0.95rem',
              color: '#0284C7',
              letterSpacing: '-0.03em'
            }}
          >
            partech
          </Typography>
        </Box>

        {/* iqt. */}
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6 }}>
          <svg width="22" height="22" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="14" stroke="#2563EB" strokeWidth="2" fill="none" />
            <circle cx="16" cy="16" r="8" stroke="#38BDF8" strokeWidth="2" fill="none" />
            <circle cx="16" cy="6" r="3" fill="#2563EB" />
            <circle cx="26" cy="16" r="3" fill="#2563EB" />
            <circle cx="16" cy="26" r="3" fill="#2563EB" />
            <circle cx="6" cy="16" r="3" fill="#2563EB" />
          </svg>
          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 800,
              fontSize: '1rem',
              color: '#1E293B'
            }}
          >
            iqt.
          </Typography>
        </Box>

        {/* FUJITSU */}
        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
          <Typography
            sx={{
              fontFamily: "'Arial Black', 'Helvetica', sans-serif",
              fontWeight: 900,
              fontSize: '1rem',
              color: '#DC2626',
              letterSpacing: '0.04em'
            }}
          >
            FUJITSU
          </Typography>
        </Box>

        {/* Tenity */}
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M4 16L16 4M16 4H8M16 4V12" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: '0.95rem',
              color: '#0F172A'
            }}
          >
            Tenity
          </Typography>
        </Box>

        {/* Stanford University Crest */}
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
          <Box
            sx={{
              bgcolor: '#8C1515',
              color: '#FFFFFF',
              width: 26,
              height: 26,
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(140, 21, 21, 0.25)'
            }}
          >
            {/* Redwood Tree Silhouette */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF">
              <path d="M12 2L8 8H10.5L7 14H10.5L6 20H18L13.5 14H17L13.5 8H16L12 2Z" />
              <rect x="11" y="20" width="2" height="3" fill="#FFFFFF" />
            </svg>
          </Box>
          <Typography
            sx={{
              fontFamily: "'Georgia', serif",
              fontWeight: 700,
              fontSize: '0.825rem',
              color: '#8C1515',
              lineHeight: 1.1
            }}
          >
            Stanford
            <Box component="span" sx={{ display: 'block', fontSize: '0.7rem', fontWeight: 500, color: '#64748B' }}>
              University
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
