import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  Stack,
  Chip
} from '@mui/material';
import {
  Bookmark as BookmarkIcon,
  Notifications as AlertIcon,
  Send as ApplicationIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store.js';
import { useQuery } from '@tanstack/react-query';
import { alertsApi, applicationsApi } from '../../services/api/alerts.api.js';
import { apiClient } from '../../services/api/client.js';

export const UserDashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  const { data: alerts } = useQuery({
    queryKey: ['myAlerts'],
    queryFn: () => alertsApi.getAlerts()
  });

  const { data: bookmarks } = useQuery({
    queryKey: ['myBookmarks'],
    queryFn: async () => {
      const res = await apiClient.get('/bookmarks');
      return res.data.data;
    }
  });

  const { data: applications } = useQuery({
    queryKey: ['myApplications'],
    queryFn: () => applicationsApi.getApplications()
  });

  const statCards = [
    { title: 'Saved Opportunities', count: bookmarks?.length || 0, icon: <BookmarkIcon sx={{ color: '#2563EB', fontSize: 22 }} />, path: '/dashboard/bookmarks' },
    { title: 'Active Alert Subscriptions', count: alerts?.filter((a) => a.isActive).length || 0, icon: <AlertIcon sx={{ color: '#2563EB', fontSize: 22 }} />, path: '/dashboard/alerts' },
    { title: 'Tracked Portal Submissions', count: applications?.length || 0, icon: <ApplicationIcon sx={{ color: '#2563EB', fontSize: 22 }} />, path: '/dashboard/applications' }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3, md: 4 } }}>
      {/* Welcome Banner */}
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          bgcolor: '#FFFFFF',
          border: '1px solid #E6E6E6',
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2.5
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ color: '#2563EB', fontWeight: 700, letterSpacing: 1.2 }}>
            CANDIDATE DASHBOARD
          </Typography>
          <Typography variant="h3" sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 800, color: '#000000', mt: 0.5, mb: 0.5, fontSize: { xs: '1.6rem', md: '2rem' } }}>
            Namaste, {user?.fullName}!
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B6B6B', display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            {user?.email} • Role: <Chip label={user?.role} size="small" sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 600, fontSize: '0.72rem', height: 22, border: '1px solid #DBEAFE' }} />
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            component={RouterLink}
            to="/dashboard/profile"
            variant="outlined"
            sx={{ borderRadius: 20, borderColor: '#E6E6E6', color: '#242424', fontWeight: 600, '&:hover': { borderColor: '#2563EB', bgcolor: '#EFF6FF' } }}
          >
            Edit Profile & Resume
          </Button>
          <Button
            component={RouterLink}
            to="/jobs"
            variant="contained"
            sx={{ borderRadius: 20, bgcolor: '#2563EB', fontWeight: 600, '&:hover': { bgcolor: '#1D4ED8' } }}
          >
            Browse Vacancies
          </Button>
        </Stack>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={4} key={card.title}>
            <Box sx={{ p: 3, borderRadius: 2, border: '1px solid #E6E6E6', bgcolor: '#FFFFFF' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#6B6B6B', fontWeight: 600, fontSize: '0.84rem' }}>
                  {card.title}
                </Typography>
                <Box sx={{ p: 0.75, bgcolor: '#EFF6FF', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {card.icon}
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#000000', mb: 1.5 }}>
                {card.count}
              </Typography>
              <Button
                component={RouterLink}
                to={card.path}
                size="small"
                endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                sx={{ fontWeight: 600, color: '#2563EB', p: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
              >
                View All
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Quick Navigation Sections */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 3, borderRadius: 2, border: '1px solid #E6E6E6', bgcolor: '#FFFFFF', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
              <Typography variant="h6" sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 700, color: '#000000', fontSize: '1.1rem' }}>
                Your Job Alerts
              </Typography>
              <Button component={RouterLink} to="/dashboard/alerts" size="small" sx={{ color: '#2563EB', fontWeight: 600, fontSize: '0.8125rem' }}>
                Manage Alerts
              </Button>
            </Box>
            {alerts && alerts.length > 0 ? (
              <Stack spacing={1.5}>
                {alerts.slice(0, 3).map((alert) => (
                  <Box key={alert.id} sx={{ p: 2, bgcolor: '#F7F7F7', borderRadius: 1.5, border: '1px solid #E6E6E6' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#000000' }}>
                      {alert.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6B6B6B' }}>
                      Frequency: {alert.frequency} • Sector: {alert.sector || 'All Sectors'}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                No alerts configured yet. Set up job alerts to receive immediate or daily updates.
              </Typography>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ p: 3, borderRadius: 2, border: '1px solid #E6E6E6', bgcolor: '#FFFFFF', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
              <Typography variant="h6" sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 700, color: '#000000', fontSize: '1.1rem' }}>
                Recent Outbound Applications
              </Typography>
              <Button component={RouterLink} to="/dashboard/applications" size="small" sx={{ color: '#2563EB', fontWeight: 600, fontSize: '0.8125rem' }}>
                View Tracker
              </Button>
            </Box>
            {applications && applications.length > 0 ? (
              <Stack spacing={1.5}>
                {applications.slice(0, 3).map((app) => (
                  <Box key={app.id} sx={{ p: 2, bgcolor: '#F7F7F7', borderRadius: 1.5, border: '1px solid #E6E6E6' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#000000' }}>
                      {app.job.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6B6B6B', display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      {app.job.organizationName} • Status: <Chip label={app.status} size="small" sx={{ fontSize: '0.65rem', height: 20, bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 600, border: '1px solid #DBEAFE' }} />
                    </Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                When you click "Apply on Official Portal" for any verified job, it will automatically be tracked here for your records.
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
