import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Stack,
  Button,
  Dialog
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '../../services/api/jobs.api.js';
import { JobCard } from '../../components/jobs/JobCard.js';
import { FilterSidebar } from '../../components/jobs/FilterSidebar.js';
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

  // Sync state to URL params
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

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

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

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setFilters((prev: any) => ({ ...prev, page: value }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const jobs = data?.data || [];
  const pagination = data?.pagination;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>
      {/* Page Header */}
      <Box sx={{ mb: 3.5 }}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontWeight: 800,
            color: '#000000',
            letterSpacing: '-0.035em',
            fontSize: { xs: '1.75rem', sm: '2.25rem' },
            mb: 0.75
          }}
        >
          {pageTitle}
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B6B6B', maxWidth: 800 }}>
          {pageSubtitle}
        </Typography>
      </Box>

      {/* Mobile Filter Button */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2.5 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => setMobileFilterOpen(true)}
          sx={{ borderColor: '#E6E6E6', color: '#242424', fontWeight: 600, py: 1, borderRadius: 20 }}
        >
          Filters & Refinements
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Left Filter Column (Desktop) */}
        <Grid item xs={12} md={4} lg={3.5} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box sx={{ position: 'sticky', top: 80 }}>
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </Box>
        </Grid>

        {/* Right Editorial Feed */}
        <Grid item xs={12} md={8} lg={8.5}>
          {/* Top Sort and Results Bar */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              pb: 2,
              borderBottom: '1px solid #E6E6E6',
              mb: 2,
              gap: 2
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#242424' }}>
              {isLoading
                ? 'Searching verified opportunities...'
                : `Showing ${jobs.length} of ${pagination?.total || 0} opportunities`}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#6B6B6B', fontSize: '0.75rem', letterSpacing: '0.04em' }}>
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

          {/* Active Filter Chips */}
          {(filters.q || filters.sector || filters.state || filters.qualification) && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
              {filters.q && (
                <Chip
                  label={`Keyword: "${filters.q}"`}
                  onDelete={() => setFilters((p: any) => ({ ...p, q: '' }))}
                  size="small"
                  sx={{ bgcolor: '#EFF6FF', color: '#2563EB', border: '1px solid #DBEAFE', fontWeight: 500 }}
                />
              )}
              {filters.sector && (
                <Chip
                  label={`Sector: ${filters.sector}`}
                  onDelete={() => setFilters((p: any) => ({ ...p, sector: '' }))}
                  size="small"
                  sx={{ bgcolor: '#EFF6FF', color: '#2563EB', border: '1px solid #DBEAFE', fontWeight: 500 }}
                />
              )}
              {filters.state && (
                <Chip
                  label={`Location: ${filters.state}`}
                  onDelete={() => setFilters((p: any) => ({ ...p, state: '' }))}
                  size="small"
                  sx={{ bgcolor: '#EFF6FF', color: '#2563EB', border: '1px solid #DBEAFE', fontWeight: 500 }}
                />
              )}
              {filters.qualification && (
                <Chip
                  label={`Qualification: ${filters.qualification}`}
                  onDelete={() => setFilters((p: any) => ({ ...p, qualification: '' }))}
                  size="small"
                  sx={{ bgcolor: '#EFF6FF', color: '#2563EB', border: '1px solid #DBEAFE', fontWeight: 500 }}
                />
              )}
              <Button
                size="small"
                onClick={handleResetFilters}
                sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B6B6B', '&:hover': { color: '#2563EB' } }}
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
              description="We could not find any active vacancies matching your current filters. Try resetting filters or broadening your search terms."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <Box>
              {/* Text-First Editorial Feed with thin separators */}
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 2 }}>
                  <Pagination
                    count={pagination.totalPages}
                    page={pagination.page}
                    onChange={handlePageChange}
                    color="primary"
                    size="medium"
                  />
                </Box>
              )}
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Mobile Modal for Filters */}
      <Dialog
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 2, border: '1px solid #E6E6E6', p: 1 } }}
      >
        <Box sx={{ p: 1 }}>
          <FilterSidebar
            filters={filters}
            onChange={(newFilters) => {
              handleFilterChange(newFilters);
              setMobileFilterOpen(false);
            }}
            onReset={() => {
              handleResetFilters();
              setMobileFilterOpen(false);
            }}
          />
        </Box>
      </Dialog>
    </Container>
  );
};
