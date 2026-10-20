import React from 'react';
import { Container, Typography, Paper, Box, Button, Stack, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Verified as VerifiedIcon, Security as SecurityIcon } from '@mui/icons-material';

export const AboutPage: React.FC = () => (
  <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
    <Typography variant="h2" sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: 800, color: '#000000', mb: 2, letterSpacing: '-0.03em', fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
      About JobPulse Editorial
    </Typography>
    <Typography variant="body1" sx={{ color: '#242424', mb: 4, fontSize: '1.05rem', lineHeight: 1.8 }}>
      JobPulse is an independent, technology-driven recruitment discovery and alert portal designed specifically for candidates across India. We aggregate, verify, and index employment notices from Central Ministries, State Public Service Commissions (UPSC, MPSC, UPPSC, TNPSC, KPSC), Banking Boards (IBPS, SBI, RBI), Indian Railways (RRB), Defence & Paramilitary wings, and reputed private-sector organizations.
    </Typography>

    <Box sx={{ p: 3.5, borderRadius: 2, border: '1px solid #E6E6E6', bgcolor: '#F7F7F7', mb: 4 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
        <VerifiedIcon sx={{ color: '#2563EB', fontSize: 24 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#000000', fontSize: '1.15rem' }}>
          Verification Standard
        </Typography>
      </Stack>
      <Typography variant="body2" sx={{ color: '#6B6B6B', lineHeight: 1.7 }}>
        Every government posting indexed on JobPulse links directly to the authorized official notification PDF and verified government application portal (such as nic.in, gov.in, or direct organizational career portals). We do not collect examination or registration fees on behalf of any government agency.
      </Typography>
    </Box>
  </Container>
);

export const ContactPage: React.FC = () => (
  <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
    <Typography variant="h2" sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: 800, color: '#000000', mb: 1, letterSpacing: '-0.03em', fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
      Contact & Verification Desk
    </Typography>
    <Typography variant="body1" sx={{ color: '#6B6B6B', mb: 4 }}>
      Have a question regarding job alerts, employer verification, or spotting an inaccurate vacancy? Reach out to our team.
    </Typography>

    <Box sx={{ p: 3.5, borderRadius: 2, border: '1px solid #E6E6E6', bgcolor: '#FFFFFF' }}>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#000000' }}>
            Job Verification & Moderation Desk
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
            alerts@jobpulse.in
          </Typography>
        </Box>
        <Divider sx={{ borderColor: '#E6E6E6' }} />
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#000000' }}>
            Employer Partnership & Recruiter Queries
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
            recruiters@jobpulse.in
          </Typography>
        </Box>
        <Divider sx={{ borderColor: '#E6E6E6' }} />
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#000000' }}>
            Editorial Office
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
            JobPulse Information Technologies India Pvt Ltd<br />
            Connaught Place, New Delhi 110001, India
          </Typography>
        </Box>
      </Stack>
    </Box>
  </Container>
);

export const PrivacyPolicyPage: React.FC = () => (
  <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
    <Typography variant="h2" sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: 800, color: '#000000', mb: 1, letterSpacing: '-0.03em', fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
      Privacy Policy
    </Typography>
    <Typography variant="caption" sx={{ color: '#6B6B6B', display: 'block', mb: 3 }}>
      Last revised: October 2026
    </Typography>
    <Typography variant="body1" sx={{ color: '#242424', mb: 3, lineHeight: 1.8 }}>
      JobPulse respects candidate privacy. We collect minimal personal information (such as email, name, education qualifications, and state preferences) strictly for the purpose of dispatching personalized job notifications and managing saved preferences.
    </Typography>
    <Typography variant="h5" sx={{ fontWeight: 700, color: '#000000', mb: 1.5, fontSize: '1.15rem' }}>
      Data Confidentiality & Resumes
    </Typography>
    <Typography variant="body2" sx={{ color: '#6B6B6B', mb: 3, lineHeight: 1.7 }}>
      Uploaded candidate resumes are encrypted and stored in secure, private directories with randomized storage keys. Resumes are never sold, rented, or made publicly accessible to third-party scrapers.
    </Typography>
  </Container>
);

export const TermsPage: React.FC = () => (
  <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
    <Typography variant="h2" sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: 800, color: '#000000', mb: 1, letterSpacing: '-0.03em', fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
      Terms of Service
    </Typography>
    <Typography variant="caption" sx={{ color: '#6B6B6B', display: 'block', mb: 3 }}>
      Effective: October 2026
    </Typography>
    <Typography variant="body1" sx={{ color: '#242424', mb: 3, lineHeight: 1.8 }}>
      By using JobPulse, users acknowledge that job vacancies, eligibility rules, reservation criteria, and examination schedules are governed exclusively by the respective recruitment commissions and employers. Candidates must always review the official Gazette / Notification PDF before submitting applications.
    </Typography>
  </Container>
);

export const DataDeletionPage: React.FC = () => (
  <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
    <Typography variant="h2" sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: 800, color: '#000000', mb: 2, letterSpacing: '-0.03em', fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
      Data Deletion & Candidate Privacy
    </Typography>
    <Box sx={{ p: 3.5, borderRadius: 2, border: '1px solid #E6E6E6', bgcolor: '#FFFFFF', mt: 3 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
        <SecurityIcon sx={{ color: '#2563EB', fontSize: 24 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#000000', fontSize: '1.15rem' }}>
          Your Right to Be Forgotten
        </Typography>
      </Stack>
      <Typography variant="body2" sx={{ color: '#6B6B6B', mb: 3, lineHeight: 1.7 }}>
        Candidates have complete control over their profile data. You may delete your uploaded resume, saved search preferences, or permanently delete your account and all associated personal data directly from your Account Settings tab.
      </Typography>
      <Button
        component={RouterLink}
        to="/dashboard/profile"
        variant="outlined"
        sx={{ borderRadius: 20, borderColor: '#E6E6E6', color: '#242424', '&:hover': { borderColor: '#2563EB', bgcolor: '#EFF6FF', color: '#2563EB' } }}
      >
        Manage Account Privacy
      </Button>
    </Box>
  </Container>
);

export const NotFoundPage: React.FC = () => (
  <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
    <Typography variant="h1" sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: 800, color: '#2563EB', fontSize: '4.5rem', mb: 1 }}>
      404
    </Typography>
    <Typography variant="h4" sx={{ fontWeight: 700, color: '#000000', mb: 1.5 }}>
      Page Not Found
    </Typography>
    <Typography variant="body1" sx={{ color: '#6B6B6B', mb: 4 }}>
      The opportunity or page you requested may have moved, expired, or does not exist.
    </Typography>
    <Button
      component={RouterLink}
      to="/"
      variant="contained"
      size="large"
      sx={{ fontWeight: 600, bgcolor: '#2563EB', borderRadius: 20, px: 3, '&:hover': { bgcolor: '#1D4ED8' } }}
    >
      Return to Job Feed
    </Button>
  </Container>
);
