import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Stack,
  Button,
  InputBase,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '../../services/api/jobs.api.js';
import { JobCard } from '../../components/jobs/JobCard.js';
import { JobsNavSidebar } from '../../components/jobs/JobsNavSidebar.js';
import { JobListSkeleton } from '../../components/feedback/LoadingSkeleton.js';
import { EmptyState } from '../../components/feedback/EmptyState.js';

interface JobsListingPageProps {
  initialIsGovernment?: boolean;
  pageTitle?: string;
  pageSubtitle?: string;
}

export const JobsListingPage: React.FC<JobsListingPageProps> = ({
  initialIsGovernment,
  pageTitle = 'Explore Verified Opportunities',
  pageSubtitle = 'Search verified central government, state government, and private sector job openings.'
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<any>({
    q: searchParams.get('q') || '',
    sector: searchParams.get('sector') || '',
    state: searchParams.get('state') || '',
    qualification: searchParams.get('qualification') || '',
    page: parseInt(searchParams.get('page') || '1', 10),
    sortBy: searchParams.get('sortBy') || 'publishDate',
    sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc',
    hasOfficialNotification: searchParams.get('hasOfficialNotification') || undefined,
    deadlineApproachingDays: searchParams.get('deadlineApproachingDays')
      ? parseInt(searchParams.get('deadlineApproachingDays')!, 10)
      : undefined
  });

  // Keep state synced with URL searchParams (e.g. when user navigates or searches from navbar)
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const sector = searchParams.get('sector') || '';
    const state = searchParams.get('state') || '';
    const qualification = searchParams.get('qualification') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const sortBy = searchParams.get('sortBy') || 'publishDate';

    setFilters((prev: any) => {
      if (
        prev.q !== q ||
        prev.sector !== sector ||
        prev.state !== state ||
        prev.qualification !== qualification ||
        prev.page !== page ||
        prev.sortBy !== sortBy
      ) {
        return {
          ...prev,
          q,
          sector,
          state,
          qualification,
          page,
          sortBy
        };
      }
      return prev;
    });
  }, [searchParams]);

  // Sync filter changes back to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.sector) params.set('sector', filters.sector);
    if (filters.state) params.set('state', filters.state);
    if (filters.qualification) params.set('qualification', filters.qualification);
    if (filters.page > 1) params.set('page', filters.page.toString());
    if (filters.sortBy !== 'publishDate') params.set('sortBy', filters.sortBy);
    if (filters.hasOfficialNotification) params.set('hasOfficialNotification', 'true');
    if (filters.deadlineApproachingDays) params.set('deadlineApproachingDays', filters.deadlineApproachingDays.toString());
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const queryParams = {
    ...filters,
    isGovernment: initialIsGovernment !== undefined ? initialIsGovernment : undefined
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['jobs', queryParams],
    queryFn: () => jobsApi.getJobs(queryParams)
  });

  const handleResetFilters = () => {
    setFilters({
      q: '',
      sector: '',
      state: '',
      qualification: '',
      page: 1,
      sortBy: 'publishDate',
      sortOrder: 'desc'
    });
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setFilters((prev: any) => ({ ...prev, page: value }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const jobs = data?.data || [];
  const pagination = data?.pagination;

  return (
    <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto', py: { xs: 3, md: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        {/* LEFT SIDEBAR: Quick Navigations (Types of post, Category, Quick links) */}
        <Box
          sx={{
            width: { xs: '100%', md: 270, lg: 300 },
            flexShrink: 0,
            pr: { md: 3, lg: 4 },
            borderRight: { md: '1px solid #E6E6E6' },
            borderBottom: { xs: '1px solid #E6E6E6', md: 'none' },
            pb: { xs: 3, md: 0 },
            mb: { xs: 3, md: 0 }
          }}
        >
          <Box
            sx={{
              position: { md: 'sticky' },
              top: { md: 80 },
              maxHeight: { md: 'calc(100vh - 100px)' },
              overflowY: { md: 'auto' },
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' }
            }}
          >
            <JobsNavSidebar
              currentSector={filters.sector}
              currentQualification={filters.qualification}
              onSelectSector={(sector) => {
                setFilters((prev: any) => ({ ...prev, sector, page: 1 }));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectQualification={(qualification) => {
                setFilters((prev: any) => ({ ...prev, qualification, page: 1 }));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectKeyword={(keyword) => {
                setFilters((prev: any) => ({ ...prev, q: keyword, page: 1 }));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onResetAll={handleResetFilters}
            />
          </Box>
        </Box>

        {/* RIGHT MAIN COLUMN: Header, Search Bar, Sort Bar & Job Opportunities Feed */}
        <Box sx={{ flex: 1, minWidth: 0, pl: { md: 3.5, lg: 4 } }}>
          {/* Page Header */}
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Roboto', 'Inter', sans-serif",
                fontWeight: 800,
                color: '#0F2A4A',
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.65rem', sm: '2rem' },
                mb: 0.75
              }}
            >
              {pageTitle}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "'Open Sans', 'Roboto', sans-serif",
                color: '#475569',
                fontSize: '14px',
                lineHeight: 1.5,
                maxWidth: 820
              }}
            >
              {pageSubtitle}
            </Typography>
          </Box>

          {/* In-Page Quick Search Box */}
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              setFilters((p: any) => ({ ...p, page: 1 }));
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '10px',
              p: 0.6,
              mb: 2.5,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              '&:focus-within': {
                borderColor: '#1D6EE5',
                boxShadow: '0 0 0 3px rgba(29, 110, 229, 0.12)'
              }
            }}
          >
            <SearchIcon sx={{ color: '#94A3B8', fontSize: 20, ml: 1, mr: 1.25 }} />
            <InputBase
              placeholder="Search jobs, exams, commissions or qualifications..."
              value={filters.q}
              onChange={(e) => setFilters((p: any) => ({ ...p, q: e.target.value, page: 1 }))}
              sx={{ flex: 1, fontSize: '0.9rem', color: '#0F2A4A' }}
            />
            {filters.q && (
              <IconButton size="small" onClick={() => setFilters((p: any) => ({ ...p, q: '', page: 1 }))} sx={{ mr: 0.5 }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: '#0F2A4A',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.84rem',
                borderRadius: '8px',
                px: 2.5,
                py: 0.75,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#0A1E35', boxShadow: 'none' }
              }}
            >
              Search
            </Button>
          </Box>

          {/* Top Sort and Results Bar */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              pb: 2,
              borderBottom: '1px solid #E2E8F0',
              mb: 2,
              gap: 2
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F2A4A' }}>
              {isLoading
                ? 'Searching verified opportunities...'
                : `Showing ${jobs.length} of ${pagination?.total || 0} opportunities`}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                SORT:
              </Typography>
              <FormControl size="small" sx={{ minWidth: 170 }}>
                <Select
                  value={filters.sortBy}
                  onChange={(e) => setFilters((prev: any) => ({ ...prev, sortBy: e.target.value, page: 1 }))}
                  sx={{
                    borderRadius: 20,
                    fontSize: '0.8125rem',
                    bgcolor: '#FFFFFF',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' }
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

          {/* Active Filter Chips */}
          {(filters.q || filters.sector || filters.state || filters.qualification) && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
              {filters.q && (
                <Chip
                  label={`Keyword: "${filters.q}"`}
                  onDelete={() => setFilters((p: any) => ({ ...p, q: '' }))}
                  size="small"
                  sx={{ bgcolor: '#EFF6FF', color: '#1D6EE5', border: '1px solid #BFDBFE', fontWeight: 600 }}
                />
              )}
              {filters.sector && (
                <Chip
                  label={`Sector: ${filters.sector.replace(/_/g, ' ')}`}
                  onDelete={() => setFilters((p: any) => ({ ...p, sector: '' }))}
                  size="small"
                  sx={{ bgcolor: '#EFF6FF', color: '#1D6EE5', border: '1px solid #BFDBFE', fontWeight: 600 }}
                />
              )}
              {filters.state && (
                <Chip
                  label={`Location: ${filters.state}`}
                  onDelete={() => setFilters((p: any) => ({ ...p, state: '' }))}
                  size="small"
                  sx={{ bgcolor: '#EFF6FF', color: '#1D6EE5', border: '1px solid #BFDBFE', fontWeight: 600 }}
                />
              )}
              {filters.qualification && (
                <Chip
                  label={`Qualification: ${filters.qualification}`}
                  onDelete={() => setFilters((p: any) => ({ ...p, qualification: '' }))}
                  size="small"
                  sx={{ bgcolor: '#EFF6FF', color: '#1D6EE5', border: '1px solid #BFDBFE', fontWeight: 600 }}
                />
              )}
              <Button
                size="small"
                onClick={handleResetFilters}
                sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', '&:hover': { color: '#1D6EE5' } }}
              >
                Clear All
              </Button>
            </Stack>
          )}

          {/* Content States: Text-First Editorial Feed */}
          {isLoading ? (
            <JobListSkeleton count={6} />
          ) : error ? (
            <EmptyState
              title="Failed to Load Opportunities"
              description="Could not connect to JobPulse server. Please check your connection and retry."
              actionText="Retry"
              onAction={() => refetch()}
            />
          ) : jobs.length === 0 ? (
            <EmptyState
              title="No Vacancies Found"
              description="We could not find any active vacancies matching your current criteria."
              actionText="Reset Search"
              onAction={handleResetFilters}
            />
          ) : (
            <Box>
              {/* Job Cards Feed */}
              {jobs.map((job, idx) => (
                <JobCard key={job.id} job={job} isFeatured={idx === 0} />
              ))}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 2 }}>
                  <Pagination
                    count={pagination.totalPages}
                    page={pagination.page}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontWeight: 600,
                        fontSize: '0.85rem'
                      }
                    }}
                  />
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};
