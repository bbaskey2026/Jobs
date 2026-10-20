import React, { useEffect, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { InfoOutlined as InfoIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';

interface GoogleAdSlotProps {
  slotId?: string;
  client?: string;
  format?: 'auto' | 'rectangle' | 'horizontal';
  className?: string;
  minHeight?: number;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const GoogleAdSlot: React.FC<GoogleAdSlotProps> = ({
  slotId = '1234567890',
  client = '',
  format = 'auto',
  className,
  minHeight = 240
}) => {
  const adRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    // Only attempt to push real ad if client id is provided
    if (client && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // Handle ad push errors gracefully
      }
    }
  }, [client]);

  return (
    <Box
      className={className}
      sx={{
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* 1. Compliant Google AdSense Header Label */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 0.75,
          mb: 1.25,
          borderBottom: '1px solid #F0F0F0'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: '#9CA3AF',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}
          >
            ADVERTISEMENT
          </Typography>
        </Box>
        <Box
          component="a"
          href="https://www.google.com/adsense/start/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.35,
            color: '#9CA3AF',
            textDecoration: 'none',
            fontSize: '0.65rem',
            fontWeight: 500,
            '&:hover': { color: '#2563EB' }
          }}
        >
          <span>Ads by Google</span>
          <InfoIcon sx={{ fontSize: 11 }} />
        </Box>
      </Box>

      {/* 2. Real Google Ad Unit OR High-Fidelity Sponsored Demo Creative */}
      {client ? (
        <Box sx={{ minHeight, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'block', width: '100%' }}
            data-ad-client={client}
            data-ad-slot={slotId}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
        </Box>
      ) : (
        <Box
          sx={{
            py: 0.5,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  bgcolor: '#EFF6FF',
                  color: '#2563EB',
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  fontWeight: 700,
                  fontSize: '0.68rem',
                  letterSpacing: '0.04em'
                }}
              >
                SPONSORED
              </Typography>
              <Typography variant="caption" sx={{ color: '#9CA3AF', fontSize: '0.68rem' }}>
                Verified Partner
              </Typography>
            </Box>

            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 800,
                color: '#111827',
                fontSize: '0.925rem',
                lineHeight: 1.35,
                mb: 0.75
              }}
            >
              Master UPSC, SSC & Banking Exams with 500+ Live Mock Tests
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: '#4B5563',
                fontSize: '0.78rem',
                lineHeight: 1.45,
                display: 'block'
              }}
            >
              Get unlimited access to previous year papers, chapter-wise test series, and AI-driven performance analytics.
            </Typography>
          </Box>

          <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px dashed #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#10B981', display: 'block', fontSize: '0.72rem' }}>
                ★ Free Initial Mock Test
              </Typography>
              <Typography variant="caption" sx={{ color: '#9CA3AF', fontSize: '0.68rem' }}>
                testseries.jobpulse.in
              </Typography>
            </Box>

            <Button
              component="a"
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              variant="contained"
              endIcon={<OpenInNewIcon sx={{ fontSize: 13 }} />}
              sx={{
                bgcolor: '#2563EB',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.75rem',
                borderRadius: 20,
                px: 1.75,
                py: 0.5,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' }
              }}
            >
              Explore Free
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};
