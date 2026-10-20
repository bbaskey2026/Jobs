import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Chip,
  Button,
  CircularProgress
} from '@mui/material';
import { Verified as VerifiedIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import { organizationsApi } from '../../services/api/alerts.api.js';

export const OrganizationsPage: React.FC = () => {
  const { data: orgs, isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => organizationsApi.getOrganizations()
  });

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 700,
            color: '#1a1a1a',
            letterSpacing: '-0.02em',
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            mb: 0.75
          }}
        >
          Recruitment Authorities & Agencies
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: "'Open Sans', 'Roboto', sans-serif",
            color: '#222222',
            fontSize: '15px',
            lineHeight: 1.6,
            maxWidth: 800
          }}
        >
          Explore India's constitutional recruitment bodies, ministries, state selection boards, and verified corporate employers.
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#2563EB' }} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {orgs?.map((org) => (
            <Grid item xs={12} sm={6} md={4} key={org.id}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: '#FFFFFF',
                  border: '1px solid #E6E6E6',
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'border-color 0.15s ease, background-color 0.15s ease',
                  '&:hover': {
                    borderColor: '#2563EB',
                    bgcolor: '#FAFAFA'
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Chip
                    label={org.sector.replace(/_/g, ' ')}
                    size="small"
                    sx={{ bgcolor: '#F7F7F7', color: '#6B6B6B', fontWeight: 600, fontSize: '0.7rem', border: '1px solid #E6E6E6' }}
                  />
                  {org.verificationStatus === 'VERIFIED' && (
                    <Chip
                      icon={<VerifiedIcon sx={{ fontSize: '14px !important', color: '#2563EB' }} />}
                      label="Verified"
                      size="small"
                      sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 600, border: '1px solid #DBEAFE' }}
                    />
                  )}
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 700, color: '#000000', mb: 0.75, fontSize: '1.05rem' }}>
                  {org.name}
                </Typography>

                <Typography variant="body2" sx={{ color: '#6B6B6B', mb: 2, flexGrow: 1, lineHeight: 1.6 }}>
                  {org.description || 'Official recruitment authority and employment board.'}
                </Typography>

                {org.headquartersState && (
                  <Typography variant="caption" sx={{ color: '#6B6B6B', display: 'block', mb: 2 }}>
                    HQ: {org.headquartersState}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', pt: 2, borderTop: '1px solid #E6E6E6' }}>
                  <Button
                    component={RouterLink}
                    to={`/jobs?organizationSlug=${org.slug}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderRadius: 20,
                      borderColor: '#E6E6E6',
                      color: '#242424',
                      fontWeight: 600,
                      fontSize: '0.78rem',
                      '&:hover': { borderColor: '#2563EB', bgcolor: '#EFF6FF', color: '#2563EB' }
                    }}
                  >
                    View Vacancies ({org.activeJobsCount || 0})
                  </Button>

                  {org.websiteUrl && (
                    <Button
                      component="a"
                      href={org.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      endIcon={<OpenInNewIcon sx={{ fontSize: 13 }} />}
                      sx={{ color: '#6B6B6B', fontSize: '0.75rem', '&:hover': { color: '#2563EB' } }}
                    >
                      Official Site
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};
