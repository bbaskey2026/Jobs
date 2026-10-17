import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Button,
  Stack
} from '@mui/material';
import {
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Verified as VerifiedIcon,
  Schedule as ScheduleIcon,
  LocationOnOutlined as LocationIcon,
  SchoolOutlined as SchoolIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import { JobDto } from '@jobpulse/shared';
import { jobsApi } from '../../services/api/jobs.api.js';
import { useAuthStore } from '../../stores/auth.store.js';

interface JobCardProps {
  job: JobDto;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { isAuthenticated } = useAuthStore();
  const [isBookmarked, setIsBookmarked] = useState(job.isBookmarked || false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;

    try {
      setIsBookmarking(true);
      const res = await jobsApi.toggleBookmark(job.id);
      setIsBookmarked(res.bookmarked);
    } catch {
      // Revert on error
    } finally {
      setIsBookmarking(false);
    }
  };

  // Deadline calculation
  let deadlineText = 'Open until filled';
  let isUrgent = false;

  if (job.applicationDeadline) {
    const deadlineDate = new Date(job.applicationDeadline);
    const daysLeft = differenceInDays(deadlineDate, new Date());
    deadlineText = `Deadline: ${format(deadlineDate, 'dd MMM yyyy')}`;

    if (daysLeft >= 0 && daysLeft <= 7) {
      isUrgent = true;
      deadlineText = `Closing in ${daysLeft === 0 ? 'today' : `${daysLeft} days`} (${format(deadlineDate, 'dd MMM')})`;
    }
  }

  const isGovt = [
    'CENTRAL_GOVERNMENT',
    'STATE_GOVERNMENT',
    'UPSC_STATE_PSC',
    'SSC',
    'BANKING_INSURANCE',
    'RAILWAYS',
    'DEFENCE_PARAMILITARY',
    'PSU'
  ].includes(job.sector);

  // Format posted date
  const postedDate = job.createdAt ? format(new Date(job.createdAt), 'dd MMM yyyy') : '';

  return (
    <Box
      sx={{
        py: { xs: 2.5, sm: 3 },
        borderBottom: '1px solid #E6E6E6',
        transition: 'background-color 0.15s ease',
        '&:hover': {
          bgcolor: '#FAFAFA'
        },
        px: { xs: 1, sm: 2 },
        borderRadius: 1
      }}
    >
      {/* 1. Publication Header: Organization + Verification + Sector + Published Date */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography
            variant="caption"
            sx={{
              color: '#000000',
              fontWeight: 700,
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              letterSpacing: '-0.01em'
            }}
          >
            {job.organization.name}
            {job.organization.verificationStatus === 'VERIFIED' && (
              <VerifiedIcon sx={{ fontSize: 15, color: '#2563EB', ml: 0.5 }} />
            )}
          </Typography>

          <Typography variant="caption" sx={{ color: '#E6E6E6' }}>·</Typography>

          <Chip
            label={isGovt ? 'Government' : 'Private'}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.7rem',
              fontWeight: 600,
              bgcolor: isGovt ? '#EFF6FF' : '#F7F7F7',
              color: isGovt ? '#2563EB' : '#6B6B6B',
              border: `1px solid ${isGovt ? '#DBEAFE' : '#E6E6E6'}`
            }}
          />

          {postedDate && (
            <>
              <Typography variant="caption" sx={{ color: '#E6E6E6' }}>·</Typography>
              <Typography variant="caption" sx={{ color: '#6B6B6B', fontSize: '0.78rem' }}>
                {postedDate}
              </Typography>
            </>
          )}
        </Box>

        {/* Save button */}
        <IconButton
          size="small"
          onClick={handleBookmark}
          disabled={isBookmarking}
          title={isAuthenticated ? (isBookmarked ? 'Remove Bookmark' : 'Save Job') : 'Sign in to save'}
          sx={{
            color: isBookmarked ? '#2563EB' : '#6B6B6B',
            p: 0.5,
            '&:hover': { color: '#2563EB', bgcolor: '#EFF6FF' }
          }}
        >
          {isBookmarked ? <BookmarkIcon sx={{ fontSize: 19 }} /> : <BookmarkBorderIcon sx={{ fontSize: 19 }} />}
        </IconButton>
      </Box>

      {/* 2. Article Title */}
      <Typography
        component={RouterLink}
        to={`/jobs/${job.slug}`}
        variant="h5"
        sx={{
          fontFamily: '"Manrope", sans-serif',
          fontWeight: 700,
          color: '#000000',
          textDecoration: 'none',
          lineHeight: 1.35,
          fontSize: { xs: '1.05rem', sm: '1.2rem' },
          mb: 0.75,
          display: 'block',
          '&:hover': {
            color: '#2563EB'
          }
        }}
      >
        {job.title}
      </Typography>

      {/* 3. Summary Excerpt */}
      {job.summary && (
        <Typography
          variant="body2"
          sx={{
            color: '#6B6B6B',
            lineHeight: 1.6,
            fontSize: '0.875rem',
            mb: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {job.summary}
        </Typography>
      )}

      {/* 4. Metadata Pills & Bottom Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mt: 1 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ rowGap: 0.75 }}>
          {/* Location */}
          <Chip
            icon={<LocationIcon sx={{ fontSize: '14px !important', color: '#6B6B6B' }} />}
            label={job.isAllIndia ? 'All India' : `${job.city ? `${job.city}, ` : ''}${job.state}`}
            size="small"
            sx={{
              height: 24,
              fontSize: '0.75rem',
              bgcolor: '#F7F7F7',
              color: '#242424',
              border: '1px solid #E6E6E6'
            }}
          />

          {/* Qualification */}
          {job.qualificationSummary && (
            <Chip
              icon={<SchoolIcon sx={{ fontSize: '14px !important', color: '#6B6B6B' }} />}
              label={job.qualificationSummary}
              size="small"
              sx={{
                height: 24,
                fontSize: '0.75rem',
                bgcolor: '#F7F7F7',
                color: '#242424',
                border: '1px solid #E6E6E6',
                maxWidth: { xs: 160, sm: 220 }
              }}
            />
          )}

          {/* Vacancies */}
          {job.vacanciesCount && (
            <Chip
              label={`${job.vacanciesCount.toLocaleString('en-IN')} Posts`}
              size="small"
              sx={{
                height: 24,
                fontSize: '0.75rem',
                bgcolor: '#F7F7F7',
                color: '#242424',
                border: '1px solid #E6E6E6',
                fontWeight: 600
              }}
            />
          )}

          {/* Salary */}
          {job.salaryCustomDisplay && (
            <Chip
              label={job.salaryCustomDisplay}
              size="small"
              sx={{
                height: 24,
                fontSize: '0.75rem',
                bgcolor: '#F7F7F7',
                color: '#242424',
                border: '1px solid #E6E6E6',
                fontWeight: 600
              }}
            />
          )}

          {/* Deadline */}
          <Box sx={{ display: 'inline-flex', alignItems: 'center', color: isUrgent ? '#2563EB' : '#6B6B6B', fontSize: '0.78rem', py: 0.25, px: 0.5 }}>
            <ScheduleIcon sx={{ fontSize: 14, mr: 0.5 }} />
            <Typography variant="caption" sx={{ fontWeight: isUrgent ? 700 : 500, color: isUrgent ? '#2563EB' : '#6B6B6B', fontSize: '0.78rem' }}>
              {deadlineText}
            </Typography>
          </Box>
        </Stack>

        <Button
          component={RouterLink}
          to={`/jobs/${job.slug}`}
          size="small"
          endIcon={<ArrowForwardIcon sx={{ fontSize: '14px !important' }} />}
          sx={{
            color: '#2563EB',
            fontWeight: 600,
            fontSize: '0.8125rem',
            p: 0,
            minWidth: 'auto',
            '&:hover': {
              bgcolor: 'transparent',
              textDecoration: 'underline'
            }
          }}
        >
          View Notice
        </Button>
      </Box>
    </Box>
  );
};
