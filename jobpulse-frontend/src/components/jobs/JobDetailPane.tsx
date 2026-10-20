import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Divider,
  Tooltip,
  CircularProgress,
  Link
} from '@mui/material';
import {
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Verified as VerifiedIcon,
  OpenInNew as OpenInNewIcon,
  PictureAsPdf as PdfIcon,
  Schedule as ScheduleIcon,
  WorkOutline as WorkIcon,
  LocationOnOutlined as LocationIcon,
  SchoolOutlined as SchoolIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  CheckCircleOutline as CheckIcon
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { JobDto } from '@jobpulse/shared';
import { jobsApi } from '../../services/api/jobs.api.js';
import { applicationsApi } from '../../services/api/alerts.api.js';
import { useAuthStore } from '../../stores/auth.store.js';
import { JobCardShare } from '../common/ShareButtons.js';
import { DeadlineCountdown } from '../common/DeadlineCountdown.js';

interface JobDetailPaneProps {
  job: JobDto;
}

const getOrgBadgeStyle = (name: string) => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const palettes = [
    { bg: '#EFF6FF', text: '#2563EB', border: '#DBEAFE' },
    { bg: '#F5F3FF', text: '#7C3AED', border: '#EDE9FE' },
    { bg: '#ECFDF5', text: '#059669', border: '#D1FAE5' },
    { bg: '#FFF7ED', text: '#D97706', border: '#FFEDD5' }
  ];
  return palettes[hash % palettes.length];
};

export const JobDetailPane: React.FC<JobDetailPaneProps> = ({ job }) => {
  const { isAuthenticated } = useAuthStore();
  const [isBookmarked, setIsBookmarked] = useState(job.isBookmarked || false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  // Fetch full details (fullDescription, eligibility, selectionProcess, etc.)
  const { data: detail, isLoading } = useQuery({
    queryKey: ['jobDetailPane', job.slug],
    queryFn: async () => {
      return await jobsApi.getJobDetail(job.slug);
    },
    enabled: Boolean(job.slug)
  });

  const fullJob = detail || job;
  const badge = getOrgBadgeStyle(fullJob.organization.name);
  const orgInitial = fullJob.organization.name.charAt(0).toUpperCase();

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) return;
    try {
      setIsBookmarking(true);
      const res = await jobsApi.toggleBookmark(fullJob.id);
      setIsBookmarked(res.bookmarked);
    } catch {
      // Revert
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleApplyNow = async () => {
    const url = fullJob.applicationUrl || fullJob.officialNotificationUrl;
    if (url) {
      if (isAuthenticated) {
        try {
          await applicationsApi.trackOutboundClick(fullJob.id, 'User clicked Apply Now in Split View');
        } catch {}
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Extract structured responsibilities / criteria bullets
  const getRolesBullets = () => {
    if (fullJob.eligibilityCriteria) {
      return fullJob.eligibilityCriteria
        .split('\n')
        .map((s) => s.replace(/^[•\-\*]\s*/, '').trim())
        .filter(Boolean);
    }

    // Default professional breakdown based on role summary & sector
    const bullets = [
      `Review and fulfill all candidate requirements outlined by ${fullJob.organization.name}.`,
      `Demonstrate qualifications: ${fullJob.qualificationSummary || 'Relevant degree or diploma recognized by statutory bodies'}.`,
      `Work collaboratively within ${fullJob.department || fullJob.organization.name} across designated project / zonal requirements.`,
      `Prepare documentation, application credentials, and participate in scheduled selection stages.`,
      `Ensure full compliance with service regulations, official notification directives, and application deadlines.`
    ];

    if (fullJob.experienceMin && fullJob.experienceMin > 0) {
      bullets.push(`Candidate should possess minimum ${fullJob.experienceMin} years of relevant professional experience.`);
    } else {
      bullets.push('Open to Freshers / Entry-level candidates meeting required educational qualifications.');
    }

    return bullets;
  };

  return (
    <Box
      sx={{
        bgcolor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
        p: { xs: 2.5, sm: 3.5 },
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        position: 'relative'
      }}
    >
      {/* 1. TOP HEADER: Logo + Title/Org + Apply & Save Buttons */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          pb: 3,
          borderBottom: '1px solid #EEEEEE',
          mb: 3
        }}
      >
        {/* Left: Logo & Titles */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flex: 1, minWidth: 260 }}>
          {fullJob.organization.logoUrl ? (
            <Box
              component="img"
              src={fullJob.organization.logoUrl}
              alt={fullJob.organization.name}
              sx={{
                width: 52,
                height: 52,
                borderRadius: '12px',
                objectFit: 'cover',
                border: `1px solid ${badge.border}`,
                flexShrink: 0
              }}
            />
          ) : (
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '12px',
                bgcolor: badge.bg,
                border: `1px solid ${badge.border}`,
                color: badge.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 800,
                fontSize: '22px',
                flexShrink: 0
              }}
            >
              {orgInitial}
            </Box>
          )}

          <Box>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 700,
                fontSize: { xs: '1.25rem', sm: '1.45rem' },
                color: '#111827',
                lineHeight: 1.25,
                mb: 0.5
              }}
            >
              {fullJob.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  color: '#4B5563',
                  fontSize: '14px',
                  fontWeight: 600
                }}
              >
                {fullJob.organization.name}
              </Typography>
              {fullJob.organization.verificationStatus === 'VERIFIED' && (
                <VerifiedIcon sx={{ fontSize: 16, color: '#2563EB' }} />
              )}
            </Box>
          </Box>
        </Box>

        {/* Right: Apply Now, Save, and Share */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexShrink: 0 }}>
          <Button
            variant="contained"
            onClick={handleApplyNow}
            sx={{
              bgcolor: '#2563EB',
              color: '#FFFFFF',
              fontFamily: "'Open Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '8px',
              px: 3,
              py: 1,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#1D4ED8',
                boxShadow: 'none'
              }
            }}
          >
            Apply Now
          </Button>

          <Button
            variant="outlined"
            onClick={handleBookmarkToggle}
            disabled={isBookmarking}
            startIcon={
              isBookmarked ? (
                <BookmarkIcon sx={{ fontSize: '18px !important', color: '#2563EB' }} />
              ) : (
                <BookmarkBorderIcon sx={{ fontSize: '18px !important', color: '#4B5563' }} />
              )
            }
            sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '8px',
              borderColor: '#E5E7EB',
              color: isBookmarked ? '#2563EB' : '#374151',
              px: 2,
              py: 1,
              '&:hover': {
                borderColor: '#CBD5E1',
                bgcolor: '#F9FAFB'
              }
            }}
          >
            {isBookmarked ? 'Saved' : 'Save'}
          </Button>

          <JobCardShare
            title={fullJob.title}
            organization={fullJob.organization?.name}
            slug={fullJob.slug}
            variant="icon"
          />
        </Box>
      </Box>

      {/* 2. JOB DESCRIPTION */}
      <Box sx={{ mb: 3.5 }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 700,
            fontSize: '16.5px',
            color: '#111827',
            mb: 1
          }}
        >
          Job Description
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: '14.5px',
            lineHeight: 1.65,
            color: '#374151'
          }}
        >
          {fullJob.fullDescription || fullJob.summary}
        </Typography>
      </Box>

      {/* 3. ROLES & RESPONSIBILITIES */}
      <Box sx={{ mb: 3.5 }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 700,
            fontSize: '16.5px',
            color: '#111827',
            mb: 1.5
          }}
        >
          Roles & Responsibilities
        </Typography>

        <Box component="ul" sx={{ pl: 2.5, m: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {getRolesBullets().map((bullet, idx) => (
            <Box
              component="li"
              key={idx}
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontSize: '14px',
                lineHeight: 1.6,
                color: '#4B5563'
              }}
            >
              {bullet}
            </Box>
          ))}
        </Box>
      </Box>

      {/* 4. KEY POSITION SNAPSHOT */}
      <Box
        sx={{
          bgcolor: '#F9FAFB',
          borderRadius: '12px',
          p: 2.5,
          border: '1px solid #E5E7EB',
          mb: 3.5
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: '11.5px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            color: '#6B7280',
            mb: 2
          }}
        >
          Position Overview & Eligibility Snapshot
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            rowGap: 2,
            columnGap: 3
          }}
        >
          {/* Qualification */}
          <Box>
            <Typography variant="caption" sx={{ fontFamily: "'Open Sans', sans-serif", color: '#6B7280', display: 'block', mb: 0.25 }}>
              Required Qualification
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: 600, color: '#111827' }}>
              {fullJob.qualificationSummary || 'Any Graduate / Relevant Discipline'}
            </Typography>
          </Box>

          {/* Experience */}
          <Box>
            <Typography variant="caption" sx={{ fontFamily: "'Open Sans', sans-serif", color: '#6B7280', display: 'block', mb: 0.25 }}>
              Experience Level
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: 600, color: '#111827' }}>
              {fullJob.experienceMin === 0 || !fullJob.experienceMin
                ? 'Fresher / 0 to 5 years'
                : `${fullJob.experienceMin}${fullJob.experienceMax ? ` to ${fullJob.experienceMax}` : '+'} years`}
            </Typography>
          </Box>

          {/* Vacancies */}
          {fullJob.vacanciesCount && (
            <Box>
              <Typography variant="caption" sx={{ fontFamily: "'Open Sans', sans-serif", color: '#6B7280', display: 'block', mb: 0.25 }}>
                Total Vacancies
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: 600, color: '#111827' }}>
                {fullJob.vacanciesCount.toLocaleString('en-IN')} Openings
              </Typography>
            </Box>
          )}

          {/* Remuneration / Salary */}
          {fullJob.salaryCustomDisplay && (
            <Box>
              <Typography variant="caption" sx={{ fontFamily: "'Open Sans', sans-serif", color: '#6B7280', display: 'block', mb: 0.25 }}>
                Pay Scale / Remuneration
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: 600, color: '#111827' }}>
                {fullJob.salaryCustomDisplay}
              </Typography>
            </Box>
          )}

          {/* Location */}
          <Box>
            <Typography variant="caption" sx={{ fontFamily: "'Open Sans', sans-serif", color: '#6B7280', display: 'block', mb: 0.25 }}>
              Location & Jurisdiction
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: 600, color: '#111827' }}>
              {fullJob.isAllIndia ? 'All India (National Postings)' : `${fullJob.city ? `${fullJob.city}, ` : ''}${fullJob.state}`}
            </Typography>
          </Box>

          {/* Deadline */}
          {fullJob.applicationDeadline && (
            <Box>
              <Typography variant="caption" sx={{ fontFamily: "'Open Sans', sans-serif", color: '#6B7280', display: 'block', mb: 0.25 }}>
                Application Deadline
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <DeadlineCountdown deadline={fullJob.applicationDeadline} />
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* 5. OFFICIAL NOTIFICATION & PORTAL LINKS */}
      <Box sx={{ pt: 1, borderTop: '1px solid #EEEEEE' }}>
        <Typography
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: '11.5px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            color: '#6B7280',
            mb: 1.5
          }}
        >
          Official Direct Resources
        </Typography>

        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ rowGap: 1 }}>
          {fullJob.officialNotificationUrl && (
            <Link
              href={fullJob.officialNotificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontSize: '13px',
                fontWeight: 600,
                color: '#2563EB',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                '&:hover': { color: '#1D4ED8' }
              }}
            >
              <PdfIcon sx={{ fontSize: 16 }} />
              Download Official Notification PDF
              <OpenInNewIcon sx={{ fontSize: 13 }} />
            </Link>
          )}

          {fullJob.applicationUrl && (
            <Link
              href={fullJob.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontSize: '13px',
                fontWeight: 600,
                color: '#059669',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                '&:hover': { color: '#047857' }
              }}
            >
              <CheckIcon sx={{ fontSize: 16 }} />
              Direct Recruitment Application Portal
              <OpenInNewIcon sx={{ fontSize: 13 }} />
            </Link>
          )}
        </Stack>
      </Box>
    </Box>
  );
};
