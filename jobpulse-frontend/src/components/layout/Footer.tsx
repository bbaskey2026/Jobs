import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { VerifiedUser as VerifiedIcon } from '@mui/icons-material';

export const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ bgcolor: '#FFFFFF', color: '#6B6B6B', pt: 6, pb: 4, mt: 'auto', borderTop: '1px solid #E6E6E6' }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Grid container spacing={4}>
          {/* Brand Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: '#0f2a4a',
                    fontSize: '1.25rem',
                    lineHeight: 1
                  }}
                >
                  JobPulse
                </Typography>
                <Box component="span" sx={{ width: 5, height: 5, bgcolor: '#0d3b66', borderRadius: '50%', ml: 0.5 }} />
              </Box>
              <Typography
                sx={{
                  fontFamily: "'Noto Sans Devanagari', sans-serif",
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#555555',
                  mt: 0.5
                }}
              >
                रोजगार सूचना पोर्टल
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#222222', mb: 2, lineHeight: 1.6, maxWidth: 380, fontSize: '15px' }}>
              India's premier editorial job discovery network aggregating verified central & state government, banking, defence, railway, and private sector employment notifications.
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <VerifiedIcon sx={{ color: '#2563EB', fontSize: 17 }} />
              <Typography variant="caption" sx={{ color: '#242424', fontWeight: 600 }}>
                100% Official Notifications & Gazette Notices
              </Typography>
            </Stack>
          </Grid>

          {/* Govt Recruitment Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#000000', mb: 1.5, fontSize: '0.875rem' }}>
              Govt Vacancies
            </Typography>
            <Stack spacing={1}>
              <Link component={RouterLink} to="/jobs?sector=UPSC_STATE_PSC" sx={{ color: '#6B6B6B', textDecoration: 'none', '&:hover': { color: '#2563EB' } }} variant="body2">
                UPSC & State PSC
              </Link>
              <Link component={RouterLink} to="/jobs?sector=SSC" sx={{ color: '#6B6B6B', textDecoration: 'none', '&:hover': { color: '#2563EB' } }} variant="body2">
                SSC CGL / CHSL
              </Link>
              <Link component={RouterLink} to="/jobs?sector=BANKING_INSURANCE" sx={{ color: '#6B6B6B', textDecoration: 'none', '&:hover': { color: '#2563EB' } }} variant="body2">
                Banking & IBPS
              </Link>
              <Link component={RouterLink} to="/jobs?sector=RAILWAYS" sx={{ color: '#6B6B6B', textDecoration: 'none', '&:hover': { color: '#2563EB' } }} variant="body2">
                Railway (RRB)
              </Link>
              <Link component={RouterLink} to="/jobs?sector=DEFENCE_PARAMILITARY" sx={{ color: '#6B6B6B', textDecoration: 'none', '&:hover': { color: '#2563EB' } }} variant="body2">
                Defence & Forces
              </Link>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#000000', mb: 1.5, fontSize: '0.875rem' }}>
              Explore
            </Typography>
            <Stack spacing={1}>
              <Link component={RouterLink} to="/jobs" sx={{ color: '#6B6B6B', textDecoration: 'none', '&:hover': { color: '#2563EB' } }} variant="body2">
                All Opportunities
              </Link>
              <Link component={RouterLink} to="/government-jobs" sx={{ color: '#6B6B6B', textDecoration: 'none', '&:hover': { color: '#2563EB' } }} variant="body2">
                Government Jobs
              </Link>
              <Link component={RouterLink} to="/private-jobs" sx={{ color: '#6B6B6B', textDecoration: 'none', '&:hover': { color: '#2563EB' } }} variant="body2">
                Private Sector
              </Link>
              <Link component={RouterLink} to="/organizations" sx={{ color: '#6B6B6B', textDecoration: 'none', '&:hover': { color: '#2563EB' } }} variant="body2">
                Top Recruiters
              </Link>
              <Link component={RouterLink} to="/categories" sx={{ color: '#6B6B6B', textDecoration: 'none', '&:hover': { color: '#2563EB' } }} variant="body2">
                Exam Categories
              </Link>
            </Stack>
          </Grid>

          {/* Company & Legal */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#000000', mb: 1.5, fontSize: '0.875rem' }}>
              Editorial & Transparency
            </Typography>
            <Stack spacing={1}>
              <Link component={RouterLink} to="/about" sx={{ color: '#6B6B6B', textDecoration: 'none', '&:hover': { color: '#2563EB' } }} variant="body2">
                About JobPulse
              </Link>
              <Link component={RouterLink} to="/contact" sx={{ color: '#6B6B6B', textDecoration: 'none', '&:hover': { color: '#2563EB' } }} variant="body2">
                Contact & Verification Desk
              </Link>
              <Link component={RouterLink} to="/privacy" sx={{ color: '#6B6B6B', textDecoration: 'none', '&:hover': { color: '#2563EB' } }} variant="body2">
                Privacy Policy
              </Link>
              <Link component={RouterLink} to="/terms" sx={{ color: '#6B6B6B', textDecoration: 'none', '&:hover': { color: '#2563EB' } }} variant="body2">
                Terms of Service
              </Link>
              <Link component={RouterLink} to="/data-deletion" sx={{ color: '#6B6B6B', textDecoration: 'none', '&:hover': { color: '#2563EB' } }} variant="body2">
                Data Deletion & Candidate Privacy
              </Link>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: '#E6E6E6' }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" sx={{ color: '#6B6B6B' }}>
            © {new Date().getFullYear()} JobPulse India. Built for verified job seekers across India. Not affiliated with any government body.
          </Typography>
          <Typography variant="caption" sx={{ color: '#6B6B6B' }}>
            Curated daily from official government gazettes and portals.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
