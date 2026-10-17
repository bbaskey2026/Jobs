import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Stack,
  Alert
} from '@mui/material';
import {
  Sync as SyncIcon,
  Security as AdminIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { adminApi } from '../../services/api/alerts.api.js';

export const AdminDashboardPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const { data: metrics } = useQuery({
    queryKey: ['adminMetrics'],
    queryFn: () => adminApi.getDashboardMetrics()
  });

  const { data: adminJobs } = useQuery({
    queryKey: ['adminJobsList'],
    queryFn: () => adminApi.getAdminJobs({ limit: 8 })
  });

  const handleTriggerSync = async () => {
    try {
      setSyncMessage('Initiating provider synchronization...');
      const res = await adminApi.triggerSourceSync('API_NOAUTH');
      setSyncMessage(`Synchronization completed: ${res.recordsFound} found, ${res.recordsIngested} ingested, ${res.recordsSkippedDuplicates} duplicate skipped.`);
      queryClient.invalidateQueries({ queryKey: ['adminMetrics'] });
      queryClient.invalidateQueries({ queryKey: ['adminJobsList'] });
    } catch (err: any) {
      setSyncMessage(`Sync failed: ${err.message}`);
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    await adminApi.updateJobStatus(jobId, newStatus);
    queryClient.invalidateQueries({ queryKey: ['adminJobsList'] });
    queryClient.invalidateQueries({ queryKey: ['adminMetrics'] });
  };

  // Recharts Chart Data
  const chartData = [
    { name: 'Active', count: metrics?.activeJobsCount || 0 },
    { name: 'Upcoming', count: metrics?.upcomingJobsCount || 0 },
    { name: 'Expired', count: metrics?.expiredJobsCount || 0 },
    { name: 'Pending Review', count: metrics?.pendingReviewCount || 0 }
  ];

  const pieColors = ['#2563EB', '#1D4ED8', '#242424', '#6B6B6B'];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3, md: 4 } }}>
      {/* Top Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="overline" sx={{ color: '#2563EB', fontWeight: 700, letterSpacing: 1.2 }}>
            ADMINISTRATION & MODERATION CONSOLE
          </Typography>
          <Typography variant="h2" sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 800, color: '#000000', fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
            JobPulse System Control
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SyncIcon />}
          onClick={handleTriggerSync}
          sx={{ bgcolor: '#2563EB', fontWeight: 600, borderRadius: 20, px: 2.5, '&:hover': { bgcolor: '#1D4ED8' } }}
        >
          Sync External Sources
        </Button>
      </Box>

      {syncMessage && (
        <Alert severity="info" sx={{ mb: 4, borderRadius: 2, border: '1px solid #E6E6E6' }} onClose={() => setSyncMessage(null)}>
          {syncMessage}
        </Alert>
      )}

      {/* Metrics Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #E6E6E6', bgcolor: '#FFFFFF', boxShadow: 'none' }}>
            <Typography variant="caption" sx={{ color: '#6B6B6B', fontWeight: 700, letterSpacing: '0.04em' }}>ACTIVE VERIFIED JOBS</Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#2563EB', my: 1 }}>
              {metrics?.activeJobsCount ?? '-'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6B6B6B' }}>Currently open for application</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #E6E6E6', bgcolor: '#FFFFFF', boxShadow: 'none' }}>
            <Typography variant="caption" sx={{ color: '#6B6B6B', fontWeight: 700, letterSpacing: '0.04em' }}>UPCOMING NOTICES</Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#000000', my: 1 }}>
              {metrics?.upcomingJobsCount ?? '-'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6B6B6B' }}>Advance Gazette releases</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #E6E6E6', bgcolor: '#FFFFFF', boxShadow: 'none' }}>
            <Typography variant="caption" sx={{ color: '#6B6B6B', fontWeight: 700, letterSpacing: '0.04em' }}>EXPIRED / CLOSED</Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#242424', my: 1 }}>
              {metrics?.expiredJobsCount ?? '-'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6B6B6B' }}>Past application deadline</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #E6E6E6', bgcolor: '#FFFFFF', boxShadow: 'none' }}>
            <Typography variant="caption" sx={{ color: '#6B6B6B', fontWeight: 700, letterSpacing: '0.04em' }}>REPORTED / FLAGGED</Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#6B6B6B', my: 1 }}>
              {metrics?.reportedJobsCount ?? '-'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6B6B6B' }}>Candidate feedback queue</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Analytics Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #E6E6E6', bgcolor: '#FFFFFF', boxShadow: 'none', height: 340 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#000000', mb: 3, fontSize: '1rem' }}>
              Job Distribution Overview
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#6B6B6B" fontSize={12} />
                <YAxis stroke="#6B6B6B" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #E6E6E6', bgcolor: '#FFFFFF', boxShadow: 'none', height: 340 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#000000', mb: 1, fontSize: '1rem' }}>
              Lifecycle Status Share
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label={(entry) => `${entry.name}: ${entry.count}`}
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Job Moderation Table */}
      <Paper sx={{ p: 3.5, borderRadius: 2, border: '1px solid #E6E6E6', bgcolor: '#FFFFFF', boxShadow: 'none', mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Typography variant="h5" sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 800, color: '#000000', fontSize: '1.25rem' }}>
            Job Moderation & Publishing Desk
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F7F7F7' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#000000', borderBottom: '1px solid #E6E6E6' }}>Job Title</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#000000', borderBottom: '1px solid #E6E6E6' }}>Organization</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#000000', borderBottom: '1px solid #E6E6E6' }}>Sector</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#000000', borderBottom: '1px solid #E6E6E6' }}>Current Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#000000', borderBottom: '1px solid #E6E6E6' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {adminJobs?.data?.map((job: any) => (
                <TableRow key={job.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell sx={{ fontWeight: 600, color: '#000000', borderBottom: '1px solid #E6E6E6' }}>{job.title}</TableCell>
                  <TableCell sx={{ color: '#6B6B6B', borderBottom: '1px solid #E6E6E6' }}>{job.organization?.name || '-'}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #E6E6E6' }}>
                    <Chip label={job.sector} size="small" sx={{ fontSize: '0.68rem', bgcolor: '#F7F7F7', border: '1px solid #E6E6E6' }} />
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #E6E6E6' }}>
                    <Chip
                      label={job.status}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.72rem',
                        bgcolor: job.status === 'PUBLISHED' ? '#EFF6FF' : '#F7F7F7',
                        color: job.status === 'PUBLISHED' ? '#2563EB' : '#242424',
                        border: '1px solid #E6E6E6'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #E6E6E6' }}>
                    <Stack direction="row" spacing={1}>
                      {job.status !== 'PUBLISHED' && (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleStatusChange(job.id, 'PUBLISHED')}
                          sx={{ bgcolor: '#2563EB', borderRadius: 20, fontSize: '0.75rem', px: 1.5, py: 0.25, '&:hover': { bgcolor: '#1D4ED8' } }}
                        >
                          Publish
                        </Button>
                      )}
                      {job.status === 'PUBLISHED' && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleStatusChange(job.id, 'CLOSED')}
                          sx={{ borderColor: '#E6E6E6', color: '#242424', borderRadius: 20, fontSize: '0.75rem', px: 1.5, py: 0.25 }}
                        >
                          Close
                        </Button>
                      )}
                      <Button
                        size="small"
                        onClick={() => handleStatusChange(job.id, 'ARCHIVED')}
                        sx={{ color: '#6B6B6B', fontSize: '0.75rem', borderRadius: 20, '&:hover': { color: '#000000', bgcolor: '#F7F7F7' } }}
                      >
                        Archive
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};
