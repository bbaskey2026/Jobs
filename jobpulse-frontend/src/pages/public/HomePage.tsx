import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Stack,
  InputBase,
  Paper,
  Chip
} from '@mui/material';
import {
  Search as SearchIcon,
  Schedule as ScheduleIcon,
  VerifiedUserOutlined as VerifiedIcon,
  FlashOn as FlashIcon,
  AssignmentTurnedInOutlined as ApplicationIcon,
  CalendarMonth as CalendarIcon,
  Star as StarIcon,
  ChevronRight as ChevronRightIcon,
  DescriptionOutlined as DocIcon,
  InfoOutlined as InfoIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  GpsFixed as ForYouIcon,
  AccessTime as ClockIcon,
  AccountBalance as GovtIcon,
  WorkOutline as PrivateIcon,
  AccountBalanceWallet as BankingIcon,
  Security as DefenceIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '../../services/api/jobs.api.js';
import { JobCard } from '../../components/jobs/JobCard.js';
import { JobListSkeleton } from '../../components/feedback/LoadingSkeleton.js';
import { EmptyState } from '../../components/feedback/EmptyState.js';
import { format } from 'date-fns';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchInput, setSearchInput] = useState('');

  // Horizontal feed filter tabs
  const tabFilters = [
    { label: 'For You', icon: <ForYouIcon sx={{ fontSize: 16 }} />, params: { limit: 12, sortBy: 'publishDate', sortOrder: 'desc' as const } },
    { label: 'Latest Vacancies', icon: <ClockIcon sx={{ fontSize: 16 }} />, params: { limit: 12, sortBy: 'publishDate', sortOrder: 'desc' as const } },
    { label: 'Government', icon: <GovtIcon sx={{ fontSize: 16 }} />, params: { limit: 12, isGovernment: true } },
    { label: 'Private Sector', icon: <PrivateIcon sx={{ fontSize: 16 }} />, params: { limit: 12, isGovernment: false } },
    { label: 'Banking & RRB', icon: <BankingIcon sx={{ fontSize: 16 }} />, params: { limit: 12, sector: 'BANKING_INSURANCE,RAILWAYS' } },
    { label: 'Defence & Police', icon: <DefenceIcon sx={{ fontSize: 16 }} />, params: { limit: 12, sector: 'DEFENCE_PARAMILITARY,POLICE_SECURITY' } }
  ];

  const currentTab = tabFilters[selectedTab];

  // Fetch jobs for active feed tab
  const { data: feedJobsData, isLoading: isFeedLoading } = useQuery({
    queryKey: ['feedJobs', selectedTab],
    queryFn: () => {
      if (selectedTab === 2) {
        return jobsApi.getGovernmentJobs({ limit: 12 });
      }
      if (selectedTab === 3) {
        return jobsApi.getPrivateJobs({ limit: 12 });
      }
      return jobsApi.getJobs(currentTab.params as any);
    }
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/jobs?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  // Top active vacancy for timeline dates
  const topJob = feedJobsData?.data?.[0];
  const releaseDate = topJob?.createdAt ? format(new Date(topJob.createdAt), 'dd MMM yyyy') : '20 Oct 2026';
  const startDate = topJob?.applicationStartDate ? format(new Date(topJob.applicationStartDate), 'dd MMM yyyy') : releaseDate;
  const lastDate = topJob?.applicationDeadline ? format(new Date(topJob.applicationDeadline), 'dd MMM yyyy') : '17 Nov 2026';

  // Popular exams list matching user mockup
  const popularExams = [
    { title: 'OSSSC PEO & JA Exam', query: 'OSSSC PEO' },
    { title: 'OSSC CGL Exam', query: 'OSSC CGL' },
    { title: 'OSSC CHSL Exam', query: 'OSSC CHSL' },
    { title: 'OPSC OCS Exam', query: 'OPSC' },
    { title: 'SSC CGL Exam', query: 'SSC CGL' },
    { title: 'IBPS PO Exam', query: 'IBPS PO' },
    { title: 'RRB NTPC Exam', query: 'RRB' },
    { title: 'SBI PO Exam', query: 'SBI PO' }
  ];

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', pb: 8 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 }, pt: 3 }}>
        {/* ========================================================================= */}
        {/* 1. HERO BANNER SECTION (Matches User Mockup)                              */}
        {/* ========================================================================= */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            mb: 3,
            position: 'relative',
            background: {
              xs: '#EAF4FE',
              md: "linear-gradient(90deg, #EAF4FE 0%, rgba(234, 244, 254, 0.98) 46%, rgba(234, 244, 254, 0.4) 75%, rgba(234, 244, 254, 0) 100%), url('/hero-banner.jpg') no-repeat right center / cover"
            }
          }}
        >
          <Box
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              maxWidth: { xs: '100%', md: 680 },
              position: 'relative',
              zIndex: 2
            }}
          >
            {/* Tagline / Breadcrumb indicator */}
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: '#2563EB',
                letterSpacing: '0.5px',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                display: 'block',
                mb: 1.25
              }}
            >
              Government &nbsp;|&nbsp; Private &nbsp;|&nbsp; State Jobs
            </Typography>

            {/* Main Headline */}
            <Typography
              variant="h3"
              sx={{
                fontFamily: "'Roboto', 'Inter', sans-serif",
                fontWeight: 900,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '2.85rem' },
                lineHeight: 1.15,
                color: '#0F2A4A',
                letterSpacing: '-0.02em',
                mb: 1.5
              }}
            >
              Build Your Future <br />
              <span style={{ color: '#1D6EE5' }}>With JOBPULSE</span>
            </Typography>

            {/* Subheadline */}
            <Typography
              variant="body1"
              sx={{
                color: '#475569',
                fontSize: { xs: '0.92rem', sm: '1.02rem' },
                fontWeight: 500,
                lineHeight: 1.5,
                mb: 2.5
              }}
            >
              Find the latest job opportunities, exams and career opportunities in one place.
            </Typography>

            {/* Feature Badges */}
            <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  bgcolor: '#FFFFFF',
                  px: 1.5,
                  py: 0.6,
                  borderRadius: '20px',
                  border: '1px solid #DBEAFE',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                <FlashIcon sx={{ color: '#1D6EE5', fontSize: 16 }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#0F2A4A' }}>
                  Latest Updates
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  bgcolor: '#FFFFFF',
                  px: 1.5,
                  py: 0.6,
                  borderRadius: '20px',
                  border: '1px solid #DBEAFE',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                <VerifiedIcon sx={{ color: '#1D6EE5', fontSize: 16 }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#0F2A4A' }}>
                  Verified Information
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  bgcolor: '#FFFFFF',
                  px: 1.5,
                  py: 0.6,
                  borderRadius: '20px',
                  border: '1px solid #DBEAFE',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                <ApplicationIcon sx={{ color: '#1D6EE5', fontSize: 16 }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#0F2A4A' }}>
                  Easy Application
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Slogan on Right Side (Playful Script Font) */}
          <Box
            sx={{
              display: { xs: 'none', lg: 'block' },
              position: 'absolute',
              top: 28,
              right: 60,
              zIndex: 2,
              textAlign: 'right'
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Brush Script MT', 'Segoe Script', cursive, sans-serif",
                fontSize: '1.75rem',
                color: '#0F2A4A',
                fontWeight: 700,
                letterSpacing: '0.5px',
                transform: 'rotate(-4deg)',
                textShadow: '0 2px 4px rgba(255,255,255,0.8)'
              }}
            >
              Better Jobs <br />
              <span style={{ color: '#1D6EE5' }}>Brighter Future</span>
            </Typography>
          </Box>
        </Paper>

        {/* ========================================================================= */}
        {/* 2. HERO SEARCH BAR                                                        */}
        {/* ========================================================================= */}
        <Paper
          component="form"
          onSubmit={handleSearchSubmit}
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #CBD5E1',
            p: 0.75,
            mb: 3.5,
            boxShadow: '0 2px 8px rgba(15, 42, 74, 0.05)',
            '&:focus-within': {
              borderColor: '#1D6EE5',
              boxShadow: '0 0 0 3px rgba(29, 110, 229, 0.12)'
            }
          }}
        >
          <SearchIcon sx={{ color: '#94A3B8', fontSize: 22, ml: 1.5, mr: 1.25 }} />
          <InputBase
            placeholder="Search jobs, exams, departments or qualifications..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{
              flex: 1,
              fontSize: '0.95rem',
              color: '#0F2A4A',
              '& input::placeholder': {
                color: '#94A3B8',
                opacity: 1
              }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            startIcon={<SearchIcon sx={{ fontSize: 18 }} />}
            sx={{
              bgcolor: '#0F2A4A',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.9rem',
              textTransform: 'none',
              borderRadius: '8px',
              px: 3.5,
              py: 1,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#0A1E35', boxShadow: 'none' }
            }}
          >
            Search
          </Button>
        </Paper>

        {/* ========================================================================= */}
        {/* 3. HORIZONTAL FEED FILTER PILLS                                           */}
        {/* ========================================================================= */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 3.5,
            overflowX: 'auto',
            pb: 0.5,
            '::-webkit-scrollbar': { height: 4 },
            '::-webkit-scrollbar-thumb': { bgcolor: '#CBD5E1', borderRadius: 4 }
          }}
        >
          {tabFilters.map((tab, idx) => {
            const isActive = selectedTab === idx;
            return (
              <Button
                key={tab.label}
                onClick={() => setSelectedTab(idx)}
                startIcon={
                  <span style={{ color: isActive ? '#EA580C' : '#64748B', display: 'flex', alignItems: 'center' }}>
                    {tab.icon}
                  </span>
                }
                sx={{
                  bgcolor: isActive ? '#FFF7ED' : '#FFFFFF',
                  color: isActive ? '#EA580C' : '#334155',
                  border: isActive ? '1px solid #FF7A00' : '1px solid #E2E8F0',
                  borderRadius: '10px',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '0.84rem',
                  textTransform: 'none',
                  px: 2,
                  py: 0.85,
                  whiteSpace: 'nowrap',
                  boxShadow: 'none',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: isActive ? '#FFF7ED' : '#F8FAFC',
                    borderColor: isActive ? '#FF7A00' : '#CBD5E1'
                  }
                }}
              >
                {tab.label}
              </Button>
            );
          })}
        </Box>

        {/* ========================================================================= */}
        {/* 4. MAIN CONTENT: 2-COLUMN LAYOUT (~70% Feed, ~30% Sidebar)                */}
        {/* ========================================================================= */}
        <Grid container spacing={3.5}>
          {/* LEFT COLUMN: Job Notices Feed */}
          <Grid item xs={12} md={7.8} lg={8}>
            {isFeedLoading ? (
              <JobListSkeleton count={4} />
            ) : feedJobsData?.data && feedJobsData.data.length > 0 ? (
              feedJobsData.data.map((job: any, idx: number) => (
                <JobCard key={job.id} job={job} isFeatured={idx === 0} />
              ))
            ) : (
              <EmptyState
                title="No recruitment notices found"
                description="We could not find active vacancies matching this category filter. Check back soon for official updates."
              />
            )}
          </Grid>

          {/* RIGHT COLUMN: Sidebar (Application timeline + Popular exams) */}
          <Grid item xs={12} md={4.2} lg={4}>
            {/* Widget 1: Application timeline */}
            <Paper
              elevation={0}
              sx={{
                p: 2.75,
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                bgcolor: '#FFFFFF',
                mb: 3
              }}
            >
              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                <CalendarIcon sx={{ color: '#EA580C', fontSize: 22 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F2A4A', fontSize: '1.05rem' }}>
                  Application timeline
                </Typography>
              </Box>

              {/* Stepper Timeline */}
              <Stack spacing={2} sx={{ position: 'relative', pl: 1, mb: 2.5 }}>
                {/* Vertical connecting line */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 10,
                    bottom: 15,
                    left: 17,
                    width: 2,
                    bgcolor: '#E2E8F0',
                    zIndex: 0
                  }}
                />

                {/* Step 1: Notification Release */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, position: 'relative', zIndex: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 18, color: '#10B981', bgcolor: '#FFFFFF', borderRadius: '50%' }} />
                  <Box>
                    <Typography sx={{ fontSize: '0.83rem', fontWeight: 700, color: '#0F2A4A' }}>
                      Notification Release
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                      {releaseDate}
                    </Typography>
                  </Box>
                </Box>

                {/* Step 2: Application Start */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, position: 'relative', zIndex: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 18, color: '#10B981', bgcolor: '#FFFFFF', borderRadius: '50%' }} />
                  <Box>
                    <Typography sx={{ fontSize: '0.83rem', fontWeight: 700, color: '#0F2A4A' }}>
                      Application Start
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                      {startDate}
                    </Typography>
                  </Box>
                </Box>

                {/* Step 3: Last Date to Apply (Active orange step) */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, position: 'relative', zIndex: 1 }}>
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      bgcolor: '#FF7A00',
                      border: '3px solid #FFEDD5',
                      boxSizing: 'border-box',
                      flexShrink: 0
                    }}
                  />
                  <Box>
                    <Typography sx={{ fontSize: '0.83rem', fontWeight: 800, color: '#EA580C' }}>
                      Last Date to Apply
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#EA580C', fontWeight: 700 }}>
                      {lastDate}
                    </Typography>
                  </Box>
                </Box>

                {/* Step 4: Exam Date */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, position: 'relative', zIndex: 1 }}>
                  <UncheckedIcon sx={{ fontSize: 18, color: '#94A3B8', bgcolor: '#FFFFFF', borderRadius: '50%' }} />
                  <Box>
                    <Typography sx={{ fontSize: '0.83rem', fontWeight: 600, color: '#64748B' }}>
                      Exam Date
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                      To be announced
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              {/* Informative Callout Banner */}
              <Box
                sx={{
                  bgcolor: '#EFF6FF',
                  border: '1px solid #DBEAFE',
                  borderRadius: '8px',
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1
                }}
              >
                <InfoIcon sx={{ color: '#1D6EE5', fontSize: 17, mt: 0.15, flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.76rem', color: '#1E40AF', lineHeight: 1.4, fontWeight: 500 }}>
                  Keep checking for updates on the official commission websites and this portal.
                </Typography>
              </Box>
            </Paper>

            {/* Widget 2: Explore popular exams */}
            <Paper
              elevation={0}
              sx={{
                p: 2.75,
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                bgcolor: '#FFFFFF'
              }}
            >
              {/* Header */}
              <Box
                component={RouterLink}
                to="/jobs"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                  mb: 2,
                  '&:hover .title': { color: '#1D6EE5' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon sx={{ color: '#EA580C', fontSize: 20 }} />
                  <Typography
                    className="title"
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      color: '#0F2A4A',
                      fontSize: '1rem',
                      transition: 'color 0.15s ease'
                    }}
                  >
                    Explore popular exams
                  </Typography>
                </Box>
                <ChevronRightIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
              </Box>

              {/* List of popular exams */}
              <Stack spacing={1}>
                {popularExams.map((exam) => (
                  <Box
                    key={exam.title}
                    component={RouterLink}
                    to={`/jobs?q=${encodeURIComponent(exam.query)}`}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textDecoration: 'none',
                      py: 1,
                      px: 1.25,
                      borderRadius: '6px',
                      color: '#334155',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        bgcolor: '#F8FAFC',
                        color: '#1D6EE5',
                        '& .chevron': { color: '#1D6EE5' }
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <DocIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
                      <Typography sx={{ fontSize: '0.84rem', fontWeight: 600 }}>
                        {exam.title}
                      </Typography>
                    </Box>
                    <ChevronRightIcon className="chevron" sx={{ fontSize: 16, color: '#CBD5E1', transition: 'color 0.15s ease' }} />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
