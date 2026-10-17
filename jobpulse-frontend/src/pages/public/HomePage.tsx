import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Tabs,
  Tab,
  Chip,
  Button,
  Stack,
  InputBase,
  Divider,
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  Schedule as ScheduleIcon,
  ArrowForward as ArrowForwardIcon,
  Verified as VerifiedIcon,
  NotificationsActiveOutlined as AlertIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '../../services/api/jobs.api.js';
import { JobCard } from '../../components/jobs/JobCard.js';
import { JobListSkeleton } from '../../components/feedback/LoadingSkeleton.js';
import { EmptyState } from '../../components/feedback/EmptyState.js';
import { format, differenceInDays } from 'date-fns';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchInput, setSearchInput] = useState('');

  // Tab configurations
  const tabFilters = [
    { label: 'For You', params: { limit: 10, sortBy: 'publishDate', sortOrder: 'desc' as const } },
    { label: 'Latest Vacancies', params: { limit: 10, sortBy: 'publishDate', sortOrder: 'desc' as const } },
    { label: 'Government', sector: 'UPSC_STATE_PSC,CENTRAL_GOVERNMENT,STATE_GOVERNMENT,SSC', params: { limit: 10, isGovernment: true } },
    { label: 'Private Sector', sector: 'PRIVATE_IT', params: { limit: 10, isGovernment: false } },
    { label: 'Banking & RRB', sector: 'BANKING_INSURANCE,RAILWAYS', params: { limit: 10 } },
    { label: 'Defence & Police', sector: 'DEFENCE_PARAMILITARY', params: { limit: 10 } }
  ];

  const currentTab = tabFilters[selectedTab];

  // Fetch jobs for active feed tab
  const { data: feedJobsData, isLoading: isFeedLoading } = useQuery({
    queryKey: ['feedJobs', selectedTab],
    queryFn: () => {
      if (selectedTab === 2) {
        return jobsApi.getGovernmentJobs({ limit: 10 });
      }
      if (selectedTab === 3) {
        return jobsApi.getPrivateJobs({ limit: 10 });
      }
      return jobsApi.getJobs(currentTab.params as any);
    }
  });

  // Fetch upcoming deadlines for sidebar
  const { data: deadlinesData } = useQuery({
    queryKey: ['sidebarDeadlines'],
    queryFn: () => jobsApi.getJobs({ limit: 4, sortBy: 'applicationDeadline', sortOrder: 'asc' })
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/jobs?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const topics = [
    { label: 'UPSC & Civil Services', path: '/jobs?sector=UPSC_STATE_PSC' },
    { label: 'SSC CGL / CHSL', path: '/jobs?sector=SSC' },
    { label: 'Banking PO & Clerk', path: '/jobs?sector=BANKING_INSURANCE' },
    { label: 'Railway RRB', path: '/jobs?sector=RAILWAYS' },
    { label: 'Defence & Armed Forces', path: '/jobs?sector=DEFENCE_PARAMILITARY' },
    { label: 'Private IT & Tech', path: '/private-jobs' },
    { label: 'Engineering & PSU', path: '/jobs?q=Engineer' },
    { label: 'Teaching & UGC', path: '/jobs?sector=TEACHING_EDUCATION' }
  ];

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Grid container spacing={0}>
          {/* LEFT / CENTER COLUMN: Medium-Style Editorial Job Feed */}
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              pr: { md: 5 },
              py: { xs: 2.5, md: 4 }
            }}
          >
            {/* Minimal Editorial Page Header */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <VerifiedIcon sx={{ color: '#2563EB', fontSize: 18 }} />
                <Typography variant="caption" sx={{ color: '#2563EB', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                  Official Job Gazette & Opportunities
                </Typography>
              </Box>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: '"Manrope", sans-serif',
                  fontWeight: 800,
                  color: '#000000',
                  letterSpacing: '-0.035em',
                  fontSize: { xs: '1.75rem', sm: '2.25rem' },
                  lineHeight: 1.2,
                  mb: 1
                }}
              >
                Verified Employment Feed
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B6B6B', fontSize: '0.95rem' }}>
                Daily recruitment notices, official examination notifications, and verified vacancies across India.
              </Typography>
            </Box>

            {/* Quick In-feed Search Bar */}
            <Box
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#F7F7F7',
                borderRadius: 20,
                px: 2,
                py: 0.75,
                mb: 3,
                border: '1px solid #E6E6E6',
                '&:focus-within': {
                  borderColor: '#2563EB',
                  bgcolor: '#FFFFFF'
                }
              }}
            >
              <SearchIcon sx={{ color: '#6B6B6B', fontSize: 20, mr: 1.5 }} />
              <InputBase
                placeholder="Search by job title, department, exam or qualification..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                sx={{
                  flexGrow: 1,
                  fontSize: '0.9rem',
                  color: '#242424',
                  '& input::placeholder': {
                    color: '#6B6B6B',
                    opacity: 1
                  }
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="small"
                sx={{
                  bgcolor: '#2563EB',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  borderRadius: 20,
                  px: 2,
                  py: 0.5,
                  '&:hover': { bgcolor: '#1D4ED8' }
                }}
              >
                Search
              </Button>
            </Box>

            {/* Medium Feed Underline Tabs */}
            <Box sx={{ borderBottom: '1px solid #E6E6E6', mb: 2 }}>
              <Tabs
                value={selectedTab}
                onChange={(_, newValue) => setSelectedTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  minHeight: 42,
                  '& .MuiTabs-indicator': {
                    bgcolor: '#242424',
                    height: 2
                  }
                }}
              >
                {tabFilters.map((tab, idx) => (
                  <Tab
                    key={tab.label}
                    label={tab.label}
                    sx={{
                      minHeight: 42,
                      py: 1,
                      px: { xs: 1.5, sm: 2 },
                      fontSize: '0.9rem',
                      fontWeight: selectedTab === idx ? 700 : 500,
                      color: selectedTab === idx ? '#000000' : '#6B6B6B',
                      textTransform: 'none',
                      '&:hover': { color: '#000000' }
                    }}
                  />
                ))}
              </Tabs>
            </Box>

            {/* The Text-First Feed of Opportunities */}
            {isFeedLoading ? (
              <JobListSkeleton count={6} />
            ) : feedJobsData?.data && feedJobsData.data.length > 0 ? (
              <Box>
                {feedJobsData.data.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}

                {/* Explore More Footer Link */}
                <Box sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
                  <Button
                    component={RouterLink}
                    to="/jobs"
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      borderRadius: 20,
                      borderColor: '#E6E6E6',
                      color: '#242424',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      '&:hover': {
                        borderColor: '#2563EB',
                        color: '#2563EB',
                        bgcolor: '#EFF6FF'
                      }
                    }}
                  >
                    Explore All Verified Vacancies
                  </Button>
                </Box>
              </Box>
            ) : (
              <EmptyState
                title="No Opportunities in this Category Yet"
                description="Check back shortly as new government gazettes and private sector roles are indexed continuously."
                actionText="View All Jobs"
                onAction={() => navigate('/jobs')}
              />
            )}
          </Grid>

          {/* RIGHT SIDEBAR: Medium-Style Editorial Discovery & Alerts */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              pl: { md: 4 },
              py: { xs: 3, md: 4 },
              borderLeft: { md: '1px solid #E6E6E6' },
              display: { xs: 'none', md: 'block' }
            }}
          >
            <Box sx={{ position: 'sticky', top: 80 }}>
              {/* 1. Recommended Topics (Medium-style Topic Pills) */}
              <Box sx={{ mb: 4.5 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontFamily: '"Manrope", sans-serif',
                    fontWeight: 700,
                    color: '#000000',
                    fontSize: '0.9375rem',
                    letterSpacing: '-0.01em',
                    mb: 2
                  }}
                >
                  Recommended Topics
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {topics.map((t) => (
                    <Chip
                      key={t.label}
                      component={RouterLink}
                      to={t.path}
                      label={t.label}
                      clickable
                      sx={{
                        borderRadius: 20,
                        bgcolor: '#F7F7F7',
                        color: '#242424',
                        border: '1px solid #E6E6E6',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        height: 32,
                        '&:hover': {
                          bgcolor: '#EAEAEA',
                          color: '#2563EB'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Divider sx={{ mb: 4, borderColor: '#E6E6E6' }} />

              {/* 2. Upcoming Application Deadlines (Closing Soon) */}
              <Box sx={{ mb: 4.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontFamily: '"Manrope", sans-serif',
                      fontWeight: 700,
                      color: '#000000',
                      fontSize: '0.9375rem',
                      letterSpacing: '-0.01em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75
                    }}
                  >
                    <ScheduleIcon sx={{ fontSize: 17, color: '#2563EB' }} />
                    Closing Soon
                  </Typography>
                  <Button
                    component={RouterLink}
                    to="/jobs?closingSoon=true"
                    size="small"
                    sx={{ color: '#2563EB', fontWeight: 600, fontSize: '0.75rem', p: 0, minWidth: 'auto' }}
                  >
                    View all
                  </Button>
                </Box>

                {deadlinesData?.data && deadlinesData.data.length > 0 ? (
                  <Stack spacing={2}>
                    {deadlinesData.data.slice(0, 4).map((dJob) => {
                      const deadlineDate = dJob.applicationDeadline ? new Date(dJob.applicationDeadline) : null;
                      const daysLeft = deadlineDate ? differenceInDays(deadlineDate, new Date()) : null;

                      return (
                        <Box key={dJob.id} sx={{ '&:hover a': { color: '#2563EB' } }}>
                          <Typography variant="caption" sx={{ color: '#6B6B6B', fontWeight: 600, display: 'block', mb: 0.25 }}>
                            {dJob.organization.name}
                          </Typography>
                          <Typography
                            component={RouterLink}
                            to={`/jobs/${dJob.slug}`}
                            variant="body2"
                            sx={{
                              fontWeight: 700,
                              color: '#000000',
                              textDecoration: 'none',
                              lineHeight: 1.35,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              mb: 0.5
                            }}
                          >
                            {dJob.title}
                          </Typography>
                          {deadlineDate && (
                            <Typography variant="caption" sx={{ color: '#2563EB', fontWeight: 600 }}>
                              {daysLeft !== null && daysLeft >= 0 && daysLeft <= 7
                                ? `Closes in ${daysLeft === 0 ? 'today' : `${daysLeft} days`}`
                                : `Last date: ${format(deadlineDate, 'dd MMM yyyy')}`}
                            </Typography>
                          )}
                        </Box>
                      );
                    })}
                  </Stack>
                ) : (
                  <Typography variant="caption" sx={{ color: '#6B6B6B' }}>
                    No immediate closing vacancies.
                  </Typography>
                )}
              </Box>

              <Divider sx={{ mb: 4, borderColor: '#E6E6E6' }} />

              {/* 3. Job Alert Subscription (Editorial Style) */}
              <Box
                sx={{
                  p: 2.5,
                  bgcolor: '#F7F7F7',
                  borderRadius: 2,
                  border: '1px solid #E6E6E6',
                  mb: 4
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <AlertIcon sx={{ color: '#2563EB', fontSize: 20 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#000000' }}>
                    JobPulse Alert Digest
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#6B6B6B', fontSize: '0.84rem', mb: 2, lineHeight: 1.5 }}>
                  Get verified notices delivered straight to your inbox daily or immediately upon publication.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/dashboard/alerts"
                  variant="contained"
                  fullWidth
                  size="small"
                  sx={{
                    bgcolor: '#2563EB',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    borderRadius: 20,
                    py: 0.75,
                    '&:hover': { bgcolor: '#1D4ED8' }
                  }}
                >
                  Create Custom Job Alert
                </Button>
              </Box>

              {/* 4. Compact Sidebar Editorial Links */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, color: '#6B6B6B', fontSize: '0.75rem' }}>
                <RouterLink to="/about" style={{ color: '#6B6B6B', textDecoration: 'none' }}>About</RouterLink>
                <span>·</span>
                <RouterLink to="/privacy" style={{ color: '#6B6B6B', textDecoration: 'none' }}>Privacy</RouterLink>
                <span>·</span>
                <RouterLink to="/terms" style={{ color: '#6B6B6B', textDecoration: 'none' }}>Terms</RouterLink>
                <span>·</span>
                <RouterLink to="/contact" style={{ color: '#6B6B6B', textDecoration: 'none' }}>Contact</RouterLink>
                <span>·</span>
                <RouterLink to="/categories" style={{ color: '#6B6B6B', textDecoration: 'none' }}>Sectors</RouterLink>
              </Box>
              <Typography variant="caption" sx={{ color: '#A8A8A8', mt: 1, display: 'block', fontSize: '0.7rem' }}>
                © {new Date().getFullYear()} JobPulse Editorial India
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
