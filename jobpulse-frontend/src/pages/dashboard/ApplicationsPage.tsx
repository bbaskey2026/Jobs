import React from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button
} from '@mui/material';
import { OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { applicationsApi } from '../../services/api/alerts.api.js';
import { EmptyState } from '../../components/feedback/EmptyState.js';
import { useNavigate } from 'react-router-dom';

export const ApplicationsPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: applications } = useQuery({
    queryKey: ['myApplications'],
    queryFn: () => applicationsApi.getApplications()
  });

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: 800, color: '#000000', mb: 0.5, fontSize: { xs: '1.6rem', md: '2rem' } }}>
          Outbound Application Tracker
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B6B6B' }}>
          Tracking links clicked and official portal visits to help you keep a journal of external job applications.
        </Typography>
      </Box>

      {applications && applications.length > 0 ? (
        <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #E6E6E6', boxShadow: 'none', bgcolor: '#FFFFFF' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#F7F7F7' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#000000', borderBottom: '1px solid #E6E6E6' }}>Job Title</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#000000', borderBottom: '1px solid #E6E6E6' }}>Organization</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#000000', borderBottom: '1px solid #E6E6E6' }}>Visited Date</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#000000', borderBottom: '1px solid #E6E6E6' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#000000', borderBottom: '1px solid #E6E6E6' }}>Official Portal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell sx={{ fontWeight: 600, color: '#000000', borderBottom: '1px solid #E6E6E6' }}>
                    {app.job.title}
                  </TableCell>
                  <TableCell sx={{ color: '#6B6B6B', borderBottom: '1px solid #E6E6E6' }}>{app.job.organizationName}</TableCell>
                  <TableCell sx={{ color: '#6B6B6B', borderBottom: '1px solid #E6E6E6' }}>{format(new Date(app.appliedDate), 'dd MMM yyyy, hh:mm a')}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #E6E6E6' }}>
                    <Chip
                      label={app.status.replace(/_/g, ' ')}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.72rem',
                        bgcolor: '#EFF6FF',
                        color: '#2563EB',
                        border: '1px solid #DBEAFE'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #E6E6E6' }}>
                    {app.job.applicationUrl && (
                      <Button
                        component="a"
                        href={app.job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                        sx={{ color: '#2563EB', fontWeight: 600, textTransform: 'none', borderRadius: 20 }}
                      >
                        Revisit Link
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <EmptyState
          title="No Tracked Applications"
          description="When you apply to any verified opportunity through JobPulse, we maintain a secure timeline of your submissions."
          actionText="Explore Opportunities"
          onAction={() => navigate('/jobs')}
        />
      )}
    </Container>
  );
};
