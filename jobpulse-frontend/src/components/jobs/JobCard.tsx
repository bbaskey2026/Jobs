import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Button,
  Stack,
  Tooltip,
  Paper,
  Grid,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  CheckCircle as VerifiedIcon,
  Schedule as ScheduleIcon,
  LocationOnOutlined as LocationIcon,
  SchoolOutlined as SchoolIcon,
  PeopleAltOutlined as PeopleIcon,
  AccountBalanceOutlined as BankIcon,
  DescriptionOutlined as DocIcon,
  ShareOutlined as ShareIcon,
  CalendarTodayOutlined as CalendarIcon,
  AccountBalance as SealIcon,
  WhatsApp as WhatsAppIcon,
  ContentCopy as CopyIcon,
  OpenInNew as OpenInNewIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import { JobDto } from '@jobpulse/shared';
import { jobsApi } from '../../services/api/jobs.api.js';
import { useAuthStore } from '../../stores/auth.store.js';

interface JobCardProps {
  job: JobDto;
  isFeatured?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, isFeatured = false }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [isBookmarked, setIsBookmarked] = useState(job.isBookmarked || false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [shareAnchorEl, setShareAnchorEl] = useState<null | HTMLElement>(null);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

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

  const handleCopyLink = () => {
    const url = `${window.location.origin}/jobs/${job.slug}`;
    navigator.clipboard.writeText(url);
    setShareAnchorEl(null);
  };

  const isGovt = [
    'CENTRAL_GOVERNMENT',
    'STATE_GOVERNMENT',
    'UPSC_STATE_PSC',
    'SSC',
    'BANKING_INSURANCE',
    'RAILWAYS',
    'DEFENCE_PARAMILITARY',
    'PSU',
    'POLICE_SECURITY',
    'TEACHING_EDUCATION'
  ].includes(job.sector);

  // Posted date
  const postedDate = job.createdAt
    ? format(new Date(job.createdAt), 'dd MMM yyyy')
    : '20 Oct 2026';

  // Deadline calculation
  let deadlineDisplay = 'Closing soon';
  let daysLeftText = '';
  if (job.applicationDeadline) {
    const deadline = new Date(job.applicationDeadline);
    deadlineDisplay = format(deadline, 'dd MMM yyyy');
    const diff = differenceInDays(deadline, new Date());
    if (diff > 0) {
      daysLeftText = `(${diff}d left)`;
    } else if (diff === 0) {
      daysLeftText = '(Today)';
    } else {
      daysLeftText = '(Closed)';
    }
  }

  // Determine location display
  const locationDisplay = job.isAllIndia
    ? 'All India (Central Establishment)'
    : job.city
    ? `${job.city}, ${job.state}`
    : job.state || 'All India';

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3 },
        mb: 2.5,
        borderRadius: '12px',
        bgcolor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderLeft: isFeatured ? '4px solid #FF7A00' : '1px solid #E2E8F0',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 18px rgba(15, 42, 74, 0.07)',
          borderColor: '#CBD5E1'
        }
      }}
    >
      {/* 1. Header: Circular Emblem + Organization Name + Verified Badge + Sector Tag + Date + Save */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1.5,
          flexWrap: 'wrap',
          gap: 1
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
          {/* Circular Organization Emblem */}
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: '#F1F5F9',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <SealIcon sx={{ fontSize: 18, color: '#1D6EE5' }} />
          </Box>

          {/* Organization Name in Bold Dark Navy */}
          <Typography
            sx={{
              fontFamily: "'Roboto', 'Inter', sans-serif",
              fontWeight: 800,
              fontSize: { xs: '0.78rem', sm: '0.84rem' },
              color: '#0F2A4A',
              letterSpacing: '0.3px',
              textTransform: 'uppercase'
            }}
          >
            {job.organization?.name || 'PUBLIC RECRUITMENT AUTHORITY'}
          </Typography>

          {/* Verified Badge */}
          <VerifiedIcon sx={{ fontSize: 16, color: '#1D6EE5' }} />

          {/* Sector Tag */}
          <Chip
            label={isGovt ? 'Government' : 'Private'}
            size="small"
            sx={{
              height: 22,
              fontSize: '0.72rem',
              fontWeight: 600,
              bgcolor: isGovt ? '#EFF6FF' : '#F8FAFC',
              color: isGovt ? '#1D6EE5' : '#475569',
              border: isGovt ? '1px solid #DBEAFE' : '1px solid #E2E8F0',
              borderRadius: '6px'
            }}
          />

          {/* Posted Date */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748B', ml: { xs: 0, sm: 1 } }}>
            <CalendarIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption" sx={{ fontWeight: 500, fontSize: '0.76rem' }}>
              {postedDate}
            </Typography>
          </Box>
        </Box>

        {/* Save Bookmark Action */}
        <Button
          size="small"
          onClick={handleBookmark}
          disabled={isBookmarking}
          startIcon={
            isBookmarked ? (
              <BookmarkIcon sx={{ fontSize: '16px !important', color: '#1D6EE5' }} />
            ) : (
              <BookmarkBorderIcon sx={{ fontSize: '16px !important', color: '#64748B' }} />
            )
          }
          sx={{
            color: isBookmarked ? '#1D6EE5' : '#475569',
            fontSize: '0.82rem',
            fontWeight: 600,
            textTransform: 'none',
            px: 1.25,
            py: 0.25,
            borderRadius: '6px',
            '&:hover': { bgcolor: '#F8FAFC' }
          }}
        >
          {isBookmarked ? 'Saved' : 'Save'}
        </Button>
      </Box>

      {/* 2. Job Title */}
      <Typography
        component={RouterLink}
        to={`/jobs/${job.slug}`}
        variant="h6"
        sx={{
          fontFamily: "'Roboto', 'Inter', sans-serif",
          fontWeight: 800,
          color: '#0F2A4A',
          fontSize: { xs: '1.05rem', sm: '1.2rem' },
          lineHeight: 1.35,
          textDecoration: 'none',
          display: 'block',
          mb: 0.5,
          '&:hover': { color: '#1D6EE5' }
        }}
      >
        {job.title}
      </Typography>

      {/* 3. Sub-link: Full Job Description (Orange text with document icon) */}
      <Box
        component={RouterLink}
        to={`/jobs/${job.slug}#who-can-apply`}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          color: '#EA580C',
          textDecoration: 'none',
          fontSize: '0.82rem',
          fontWeight: 600,
          mb: 2,
          '&:hover': { textDecoration: 'underline' }
        }}
      >
        <DocIcon sx={{ fontSize: 15 }} />
        Full job description
      </Box>

      {/* 4. Structured Two-Column Details Grid */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        {/* Left Column: Location, Total Posts, Application Deadline */}
        <Grid item xs={12} sm={6}>
          <Stack spacing={1.5}>
            {/* Location */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <LocationIcon sx={{ fontSize: 18, color: '#1D6EE5', mt: 0.25, flexShrink: 0 }} />
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '11px', fontWeight: 600 }}>
                  Location
                </Typography>
                <Typography variant="body2" sx={{ color: '#0F2A4A', fontWeight: 600, fontSize: '0.84rem' }}>
                  {locationDisplay}
                </Typography>
              </Box>
            </Box>

            {/* Total Posts */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <PeopleIcon sx={{ fontSize: 18, color: '#1D6EE5', mt: 0.25, flexShrink: 0 }} />
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '11px', fontWeight: 600 }}>
                  Total Posts
                </Typography>
                <Typography variant="body2" sx={{ color: '#0F2A4A', fontWeight: 700, fontSize: '0.86rem' }}>
                  {job.vacanciesCount ? `${job.vacanciesCount.toLocaleString()} Posts` : 'Refer Official Gazette'}
                </Typography>
              </Box>
            </Box>

            {/* Application Deadline */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <ScheduleIcon sx={{ fontSize: 18, color: '#EA580C', mt: 0.25, flexShrink: 0 }} />
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '11px', fontWeight: 600 }}>
                  Application Deadline
                </Typography>
                <Typography variant="body2" sx={{ color: '#EA580C', fontWeight: 700, fontSize: '0.85rem' }}>
                  {deadlineDisplay} {daysLeftText && <span style={{ fontWeight: 600 }}>{daysLeftText}</span>}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Grid>

        {/* Right Column: Qualification, Pay Level */}
        <Grid item xs={12} sm={6}>
          <Stack spacing={1.5}>
            {/* Qualification */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <SchoolIcon sx={{ fontSize: 18, color: '#1D6EE5', mt: 0.25, flexShrink: 0 }} />
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '11px', fontWeight: 600 }}>
                  Qualification
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#0F2A4A',
                    fontWeight: 600,
                    fontSize: '0.83rem',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {job.qualificationSummary || 'Degree / Diploma / 10+2 as per gazette'}
                </Typography>
              </Box>
            </Box>

            {/* Pay Level */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <BankIcon sx={{ fontSize: 18, color: '#1D6EE5', mt: 0.25, flexShrink: 0 }} />
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '11px', fontWeight: 600 }}>
                  Pay Level
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#0F2A4A',
                    fontWeight: 600,
                    fontSize: '0.83rem',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {job.salaryCustomDisplay || 'Pay Scale as per 7th Pay Commission / State norms'}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Grid>
      </Grid>

      {/* 5. Bottom Action Buttons: View Official Notice + Share */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: 1, borderTop: '1px solid #F1F5F9' }}>
        <Button
          component={RouterLink}
          to={`/jobs/${job.slug}`}
          variant="contained"
          startIcon={<DocIcon sx={{ fontSize: '16px !important' }} />}
          endIcon={<ArrowForwardIcon sx={{ fontSize: '16px !important' }} />}
          sx={{
            bgcolor: '#0F2A4A',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.82rem',
            textTransform: 'none',
            borderRadius: '6px',
            px: 2.25,
            py: 0.75,
            boxShadow: 'none',
            '&:hover': { bgcolor: '#0A1E35', boxShadow: 'none' }
          }}
        >
          View official notice
        </Button>

        <Button
          variant="outlined"
          startIcon={<ShareIcon sx={{ fontSize: 16 }} />}
          onClick={(e) => setShareAnchorEl(e.currentTarget)}
          sx={{
            borderColor: '#CBD5E1',
            color: '#334155',
            fontWeight: 600,
            fontSize: '0.82rem',
            textTransform: 'none',
            borderRadius: '6px',
            px: 2,
            py: 0.75,
            '&:hover': { bgcolor: '#F8FAFC', borderColor: '#94A3B8' }
          }}
        >
          Share
        </Button>

        {/* Share popup menu */}
        <Menu
          anchorEl={shareAnchorEl}
          open={Boolean(shareAnchorEl)}
          onClose={() => setShareAnchorEl(null)}
          PaperProps={{ sx: { borderRadius: '8px', minWidth: 180 } }}
        >
          <MenuItem
            component="a"
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              `📢 ${job.title} - ${job.organization?.name}\nApply: ${window.location.origin}/jobs/${job.slug}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setShareAnchorEl(null)}
            sx={{ fontSize: '0.82rem', gap: 1 }}
          >
            <WhatsAppIcon sx={{ fontSize: 18, color: '#16A34A' }} />
            WhatsApp
          </MenuItem>
          <MenuItem onClick={handleCopyLink} sx={{ fontSize: '0.82rem', gap: 1 }}>
            <CopyIcon sx={{ fontSize: 18, color: '#64748B' }} />
            Copy Link
          </MenuItem>
        </Menu>
      </Box>
    </Paper>
  );
};
