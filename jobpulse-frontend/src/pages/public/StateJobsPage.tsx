import React, { useState, useMemo, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  Chip,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputBase,
  Switch,
  FormControlLabel,
  Paper,
  Stack,
  Pagination,
  Autocomplete,
  TextField,
  Divider
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Public as PublicIcon,
  AccountBalance as PscIcon,
  LocalPolice as PoliceIcon,
  School as TeachingIcon,
  Engineering as EngineeringIcon,
  AccountBalanceWallet as BankingIcon,
  LocalHospital as HealthcareIcon,
  Computer as TechIcon,
  Search as SearchIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as VerifiedIcon,
  WorkOutline as WorkIcon,
  RestartAlt as ResetIcon
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { INDIAN_STATES_AND_UTS } from '@jobpulse/shared';
import { jobsApi } from '../../services/api/jobs.api.js';
import { JobCard } from '../../components/jobs/JobCard.js';
import { JobListSkeleton } from '../../components/feedback/LoadingSkeleton.js';
import { EmptyState } from '../../components/feedback/EmptyState.js';

// Metadata and top agencies for major Indian states
const STATE_PROFILES: Record<string, { capital: string; boards: string[]; highlight: string }> = {
  Maharashtra: {
    capital: 'Mumbai',
    boards: ['MPSC', 'MahaPolice', 'MAHATRANSCO', 'BMC', 'MahaGenco'],
    highlight: 'Commercial hub with major recruitment in civil services, police force, and state energy.'
  },
  'Uttar Pradesh': {
    capital: 'Lucknow',
    boards: ['UPPSC', 'UPPRPB (Police)', 'UPSSSC', 'UP Basic Education (Super TET)', 'UPPCL'],
    highlight: 'Largest workforce base with mega recruitments in Constabulary, Teaching, and PCS cadres.'
  },
  Delhi: {
    capital: 'New Delhi',
    boards: ['DSSSB', 'Delhi Police', 'MCD', 'Delhi Jal Board', 'DTC'],
    highlight: 'National capital territory with direct government, police, and education vacancies.'
  },
  Karnataka: {
    capital: 'Bengaluru',
    boards: ['KPSC', 'KSP (Karnataka Police)', 'BMRCL (Namma Metro)', 'KPCL', 'DSERT'],
    highlight: 'Premier tech and administrative hub featuring state services, metro rail, and high-tech corporate roles.'
  },
  Bihar: {
    capital: 'Patna',
    boards: ['BPSC', 'CSBC (Bihar Police)', 'BSPHCL (Power)', 'BSSC', 'Bihar Health Society'],
    highlight: 'Extensive public service openings across Combined Civil Services, energy boards, and health centers.'
  },
  'Tamil Nadu': {
    capital: 'Chennai',
    boards: ['TNPSC', 'TNUSRB (Police/Fire)', 'TANGEDCO', 'TRB Teachers', 'MRB Health'],
    highlight: 'Industrial and educational powerhouse offering Group I/II services, uniformed forces, and power engineering.'
  },
  'West Bengal': {
    capital: 'Kolkata',
    boards: ['WBPSC (WBCS)', 'West Bengal Police (WBPRB)', 'WB Primary TET', 'WBSEDCL'],
    highlight: 'Heritage administration hub with state executive services, constabulary, and primary education.'
  },
  Rajasthan: {
    capital: 'Jaipur',
    boards: ['RPSC (RAS/RTS)', 'Rajasthan Police', 'REET Teachers', 'Rajasthan Energy Discoms'],
    highlight: 'Prominent administrative examinations, police recruitment, and teachers selection tests.'
  },
  Gujarat: {
    capital: 'Gandhinagar',
    boards: ['GPSC', 'Gujarat Police Recruitment', 'GETCO', 'Panchayat Service Selection (GPSSB)'],
    highlight: 'Rapidly growing administrative, police, and municipal engineering opportunities.'
  },
  Kerala: {
    capital: 'Thiruvananthapuram',
    boards: ['Kerala PSC (KAS)', 'Kerala Police', 'KSEB', 'KTET', 'DHS Kerala'],
    highlight: 'Highest literacy state with transparent Kerala Administrative Service and public health recruitments.'
  },
  'Madhya Pradesh': {
    capital: 'Bhopal',
    boards: ['MPPSC', 'MP Police (PEB/ESB)', 'MP Power Generating Co', 'MPTET'],
    highlight: 'Central Indian administration offering state civil services, police constable, and grid operations.'
  },
  Telangana: {
    capital: 'Hyderabad',
    boards: ['TSPSC', 'TSLPRB (Police)', 'TSSPDCL', 'TS Gurukulam', 'Singareni (SCCL)'],
    highlight: 'Dynamic state featuring Group I-IV services, police recruitment, and high-growth IT corridors.'
  },
  'Andhra Pradesh': {
    capital: 'Amaravati',
    boards: ['APPSC', 'SLPRB AP (Police)', 'APTRANSCO', 'AP DSC Teachers'],
    highlight: 'Comprehensive state gazette notifications covering administration, teachers, and transmission lines.'
  },
  Punjab: {
    capital: 'Chandigarh',
    boards: ['PPSC', 'Punjab Police Recruitment', 'PSPCL', 'PSTET'],
    highlight: 'Direct recruitments in administrative services, police investigation cadress, and power corporation.'
  },
  Haryana: {
    capital: 'Chandigarh',
    boards: ['HPSC (HCS)', 'HSSC (CET)', 'Haryana Police', 'DHBVN'],
    highlight: 'Common Eligibility Test (CET) and Haryana Civil Services vacancies across state departments.'
  },
  Odisha: {
    capital: 'Bhubaneswar',
    boards: ['OPSC (OAS)', 'Odisha Police', 'OSSC', 'OPTCL', 'OSSSC'],
    highlight: 'Expanding public administration, health mission, and industrial grid opportunities.'
  }
};

// Post Types available in each state
const POST_TYPES = [
  {
    id: 'ALL',
    label: 'All Types of Posts',
    icon: PublicIcon,
    description: 'Every verified vacancy and examination in this state',
    sectors: []
  },
  {
    id: 'STATE_PSC',
    label: 'State PSC & Administration',
    icon: PscIcon,
    description: 'Civil services, administrative cadres, and group gazetted posts',
    sectors: ['UPSC_STATE_PSC', 'STATE_GOVERNMENT']
  },
  {
    id: 'POLICE_SECURITY',
    label: 'Police & Uniformed Services',
    icon: PoliceIcon,
    description: 'Sub-Inspectors, Constables, SRPF, Jail Warders & Fire services',
    sectors: ['POLICE_SECURITY', 'DEFENCE_PARAMILITARY']
  },
  {
    id: 'TEACHING',
    label: 'Teaching & Higher Education',
    icon: TeachingIcon,
    description: 'Assistant Teachers, PGT/TGT, Lecturers, and University Faculty',
    sectors: ['TEACHING_EDUCATION']
  },
  {
    id: 'ENGINEERING_PSU',
    label: 'Engineering & State PSUs',
    icon: EngineeringIcon,
    description: 'State Electricity Boards, PWD, Jal Nigam, and Metro Rail',
    sectors: ['PSU', 'PRIVATE_ENGINEERING']
  },
  {
    id: 'BANKING_FINANCE',
    label: 'Banking & Rural Finance',
    icon: BankingIcon,
    description: 'Cooperative banks, Regional Rural Banks (RRB), and financial statutory bodies',
    sectors: ['BANKING_INSURANCE', 'PRIVATE_FINANCE']
  },
  {
    id: 'HEALTHCARE',
    label: 'Healthcare & NHM',
    icon: HealthcareIcon,
    description: 'National Health Mission, Community Health Officers (CHO), Medical Officers & Nurses',
    sectors: ['HEALTHCARE_PUBLIC', 'PRIVATE_HEALTHCARE']
  },
  {
    id: 'PRIVATE_IT',
    label: 'Private Sector & IT',
    icon: TechIcon,
    description: 'Software development, private corporate hubs, and technology parks',
    sectors: ['PRIVATE_IT', 'PRIVATE_OTHER']
  }
];

export const StateJobsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State selection
  const selectedState = searchParams.get('state') || 'Maharashtra';
  const selectedPostTypeId = searchParams.get('type') || 'ALL';
  const includeAllIndia = searchParams.get('includeAllIndia') !== 'false';
  const searchQuery = searchParams.get('q') || '';
  const sortBy = searchParams.get('sortBy') || 'publishDate';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Sync state param updates
  const updateParam = (key: string, value: string | undefined) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value === undefined || value === '') {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }
    if (key !== 'page') {
      nextParams.delete('page');
    }
    setSearchParams(nextParams);
  };

  const handleStateChange = (newState: string | null) => {
    if (newState) {
      updateParam('state', newState);
    }
  };

  const handlePostTypeChange = (_: React.SyntheticEvent, newTypeId: string) => {
    updateParam('type', newTypeId === 'ALL' ? undefined : newTypeId);
  };

  const activePostType = POST_TYPES.find((pt) => pt.id === selectedPostTypeId) || POST_TYPES[0];

  // Fetch state statistics from backend
  const { data: stateStatsData } = useQuery({
    queryKey: ['stateStats'],
    queryFn: () => jobsApi.getStateStats(),
    staleTime: 60 * 1000
  });

  // Fetch jobs for current state and post type
  const queryParams = useMemo(() => {
    const params: any = {
      page,
      limit: 10,
      sortBy,
      state: selectedState,
      stateOnly: includeAllIndia ? undefined : 'true'
    };

    if (activePostType.sectors.length === 1) {
      params.sector = activePostType.sectors[0];
    }

    if (searchQuery) {
      params.q = searchQuery;
    }

    return params;
  }, [selectedState, activePostType, includeAllIndia, searchQuery, sortBy, page]);

  const { data: jobsData, isLoading: isJobsLoading, refetch } = useQuery({
    queryKey: ['jobsByState', queryParams],
    queryFn: () => jobsApi.getJobs(queryParams)
  });

  const rawJobs = jobsData?.data || [];
  const pagination = jobsData?.pagination;

  // Filter in-memory if multiple sectors map to active post type
  const filteredJobs = useMemo(() => {
    if (activePostType.sectors.length <= 1) {
      return rawJobs;
    }
    return rawJobs.filter((j) => activePostType.sectors.includes(j.sector));
  }, [rawJobs, activePostType]);

  const stateInfo = STATE_PROFILES[selectedState] || {
    capital: 'State Capital',
    boards: ['State Public Service Commission', 'State Police Board', 'Technical Education'],
    highlight: 'Active recruitment gazettes and verified employment notices.'
  };

  // Find stats for this state from backend
  const currentStateStat = stateStatsData?.find((s: any) => s.state === selectedState);

  // Popular states quick selector
  const POPULAR_STATES = [
    'Maharashtra',
    'Uttar Pradesh',
    'Delhi',
    'Karnataka',
    'Bihar',
    'Tamil Nadu',
    'West Bengal',
    'Rajasthan',
    'Gujarat',
    'Kerala',
    'Madhya Pradesh'
  ];

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', pb: 8 }}>
      {/* 1. Page Header with Clean Headline */}
      <Box sx={{ borderBottom: '1px solid #E6E6E6', py: { xs: 3.5, md: 5 }, bgcolor: '#FBFBFC' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <LocationIcon sx={{ color: '#0d3b66', fontSize: 18 }} />
            <Typography
              variant="caption"
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                color: '#0d3b66',
                fontWeight: 700,
                fontSize: '13px',
                letterSpacing: '0.8px',
                textTransform: 'uppercase'
              }}
            >
              State-Wise Employment Gazette
            </Typography>
          </Box>
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 700,
              color: '#1a1a1a',
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.85rem', sm: '2.5rem' },
              lineHeight: 1.2,
              mb: 1
            }}
          >
            All Types of Posts by Indian State
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Open Sans', 'Roboto', sans-serif",
              color: '#222222',
              maxWidth: 840,
              fontSize: '15px',
              lineHeight: 1.6
            }}
          >
            Browse verified opportunities organized by state: Civil Services (PSC), Police & Defence, Teaching, State Engineering & PSUs, Rural Banking, Healthcare (NHM), and Corporate Tech.
          </Typography>

          {/* Quick Popular State Pills */}
          <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#242424', mr: 0.5, fontSize: '0.75rem', letterSpacing: '0.04em' }}>
              POPULAR STATES:
            </Typography>
            {POPULAR_STATES.map((st) => {
              const isSelected = selectedState === st;
              return (
                <Chip
                  key={st}
                  label={st}
                  onClick={() => handleStateChange(st)}
                  clickable
                  size="small"
                  sx={{
                    fontWeight: isSelected ? 700 : 500,
                    bgcolor: isSelected ? '#2563EB' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#242424',
                    border: '1px solid',
                    borderColor: isSelected ? '#2563EB' : '#E6E6E6',
                    '&:hover': {
                      bgcolor: isSelected ? '#1D4ED8' : '#F3F4F6'
                    }
                  }}
                />
              );
            })}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 3.5, px: { xs: 2, sm: 3 } }}>
        {/* 2. State Selector Toolbar & State Profile Card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: 2,
            border: '1px solid #E6E6E6',
            bgcolor: '#FFFFFF',
            mb: 4
          }}
        >
          <Grid container spacing={3} alignItems="center">
            {/* Left: State Dropdown Autocomplete */}
            <Grid item xs={12} md={5}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#6B6B6B', display: 'block', mb: 0.75, letterSpacing: '0.04em' }}>
                SELECT INDIAN STATE OR UT
              </Typography>
              <Autocomplete
                value={selectedState}
                onChange={(_, newValue) => handleStateChange(newValue || 'Maharashtra')}
                options={INDIAN_STATES_AND_UTS.filter((s) => s !== 'All India')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search or choose state..."
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <LocationIcon sx={{ color: '#2563EB', mr: 1, fontSize: 20 }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: '#FFFFFF'
                      }
                    }}
                  />
                )}
              />
            </Grid>

            {/* Middle: State Snapshot Info */}
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {stateInfo.capital ? `Capital: ${stateInfo.capital}` : 'State Information'}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#000000', mt: 0.25, mb: 0.5 }}>
                  {selectedState}
                </Typography>
                <Typography variant="caption" sx={{ color: '#6B6B6B', display: 'block', lineHeight: 1.4 }}>
                  {stateInfo.highlight}
                </Typography>
              </Box>
            </Grid>

            {/* Right: National Inclusion Toggle & KPI */}
            <Grid item xs={12} md={3}>
              <Box sx={{ pl: { md: 2 }, borderLeft: { md: '1px solid #E6E6E6' } }}>
                <Typography variant="caption" sx={{ color: '#6B6B6B', fontWeight: 600, display: 'block', mb: 0.5 }}>
                  {currentStateStat ? `${currentStateStat.totalJobs} Active Posts` : 'Active Gazettes'}
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={includeAllIndia}
                      onChange={(e) => updateParam('includeAllIndia', e.target.checked ? 'true' : 'false')}
                      size="small"
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="caption" sx={{ color: '#242424', fontWeight: 600, fontSize: '0.78rem' }}>
                      Include All-India Posts
                    </Typography>
                  }
                />
                <Typography variant="caption" sx={{ color: '#6B6B6B', display: 'block', fontSize: '0.7rem', mt: 0.25 }}>
                  {includeAllIndia ? 'Showing state posts + national posts open to this state' : 'Showing only jobs stationed in this state'}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Key Recruitment Boards for this State */}
          {stateInfo.boards && stateInfo.boards.length > 0 && (
            <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#6B6B6B', fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                PRIMARY RECRUITMENT COMMISSIONS:
              </Typography>
              {stateInfo.boards.map((b) => (
                <Chip
                  key={b}
                  label={b}
                  size="small"
                  sx={{
                    bgcolor: '#F3F4F6',
                    color: '#242424',
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    height: 22
                  }}
                />
              ))}
            </Box>
          )}
        </Paper>

        {/* 3. Post Type Navigation Tabs: "each state all types of post" */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#000000', fontSize: '1.1rem' }}>
                Explore All Types of Posts in {selectedState}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6B6B6B' }}>
                Switch between civil services, uniformed police, teaching, engineering, healthcare, and corporate posts.
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#2563EB', bgcolor: '#EFF6FF', px: 1.5, py: 0.5, borderRadius: 10, border: '1px solid #DBEAFE' }}>
              {activePostType.label}
            </Typography>
          </Box>

          <Tabs
            value={selectedPostTypeId}
            onChange={handlePostTypeChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: '1px solid #E6E6E6',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: '#6B6B6B',
                minHeight: 48,
                px: 2,
                '&.Mui-selected': {
                  color: '#2563EB',
                  fontWeight: 700
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#2563EB',
                height: 2.5
              }
            }}
          >
            {POST_TYPES.map((pt) => {
              const IconComponent = pt.icon;
              return (
                <Tab
                  key={pt.id}
                  value={pt.id}
                  icon={<IconComponent sx={{ fontSize: 18 }} />}
                  iconPosition="start"
                  label={pt.label}
                />
              );
            })}
          </Tabs>
        </Box>

        {/* 4. Controls: Search inside state + Sort options */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            pb: 2,
            borderBottom: '1px solid #E6E6E6',
            mb: 2.5,
            gap: 2
          }}
        >
          {/* Quick In-State Search */}
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              updateParam('q', localSearch);
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#F7F7F7',
              borderRadius: 20,
              px: 2,
              py: 0.6,
              width: { xs: '100%', sm: 300, md: 360 },
              border: '1px solid #E6E6E6',
              '&:focus-within': {
                bgcolor: '#FFFFFF',
                borderColor: '#2563EB'
              }
            }}
          >
            <SearchIcon sx={{ color: '#6B6B6B', fontSize: 18, mr: 1 }} />
            <InputBase
              placeholder={`Search ${selectedState} roles...`}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              sx={{ fontSize: '0.84rem', color: '#242424', width: '100%' }}
            />
            {localSearch && (
              <Button
                size="small"
                onClick={() => {
                  setLocalSearch('');
                  updateParam('q', undefined);
                }}
                sx={{ minWidth: 'auto', p: 0.25, fontSize: '0.72rem', color: '#6B6B6B' }}
              >
                Clear
              </Button>
            )}
          </Box>

          {/* Sort Selector */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#6B6B6B', fontSize: '0.75rem', letterSpacing: '0.04em' }}>
              SORT:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <Select
                value={sortBy}
                onChange={(e) => updateParam('sortBy', e.target.value)}
                sx={{
                  borderRadius: 20,
                  fontSize: '0.8125rem',
                  bgcolor: '#FFFFFF',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E6E6E6' }
                }}
              >
                <MenuItem value="publishDate">Latest Published</MenuItem>
                <MenuItem value="applicationDeadline">Deadline Approaching</MenuItem>
                <MenuItem value="salaryMax">Highest Salary</MenuItem>
                <MenuItem value="title">Alphabetical (A-Z)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* 5. Job Cards Feed for Selected State & Post Type */}
        {isJobsLoading ? (
          <JobListSkeleton count={5} />
        ) : filteredJobs.length === 0 ? (
          <EmptyState
            title={`No ${activePostType.label} Found in ${selectedState}`}
            description={`We could not find active vacancies under "${activePostType.label}" for ${selectedState}. Try selecting "All Types of Posts" or enable "Include All-India Posts".`}
            actionText="View All Post Types"
            onAction={() => updateParam('type', undefined)}
          />
        ) : (
          <Box>
            <Typography variant="caption" sx={{ color: '#6B6B6B', fontWeight: 600, display: 'block', mb: 1.5 }}>
              Showing {filteredJobs.length} verified post{filteredJobs.length === 1 ? '' : 's'} in {selectedState} ({activePostType.label})
            </Typography>

            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 2 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.page}
                  onChange={(_, val) => updateParam('page', val.toString())}
                  color="primary"
                  size="medium"
                />
              </Box>
            )}
          </Box>
        )}

        {/* 6. Comprehensive All-States Directory Grid */}
        <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid #E6E6E6' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#000000', fontSize: '1.4rem', mb: 0.5 }}>
              All Indian States & Union Territories Directory
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
              Select any state to view its public service commission exams, police recruitments, and corporate vacancies.
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {INDIAN_STATES_AND_UTS.filter((s) => s !== 'All India').map((st) => {
              const isCurrent = selectedState === st;
              const stat = stateStatsData?.find((s: any) => s.state === st);
              const total = stat?.totalJobs || 0;

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={st}>
                  <Box
                    onClick={() => {
                      handleStateChange(st);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    sx={{
                      p: 2,
                      bgcolor: isCurrent ? '#EFF6FF' : '#FFFFFF',
                      border: '1px solid',
                      borderColor: isCurrent ? '#2563EB' : '#E6E6E6',
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: 80,
                      '&:hover': {
                        borderColor: '#2563EB',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: isCurrent ? '#2563EB' : '#000000' }}>
                        {st}
                      </Typography>
                      {isCurrent && <VerifiedIcon sx={{ color: '#2563EB', fontSize: 16 }} />}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Typography variant="caption" sx={{ color: '#6B6B6B', fontSize: '0.75rem' }}>
                        {total > 0 ? `${total} Openings` : 'Explore Posts'}
                      </Typography>
                      <ArrowForwardIcon sx={{ fontSize: 14, color: isCurrent ? '#2563EB' : '#9CA3AF' }} />
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};
