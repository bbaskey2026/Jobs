import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Chip,
  Button,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Paper
} from '@mui/material';
import {
  Verified as VerifiedIcon,
  LocationOnOutlined as LocationIcon,
  SchoolOutlined as SchoolIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  Schedule as ScheduleIcon,
  PeopleAltOutlined as PeopleIcon,
  PictureAsPdfOutlined as PdfIcon,
  OpenInNew as OpenInNewIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  FlagOutlined as FlagIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format, differenceInDays } from 'date-fns';
import { jobsApi } from '../../services/api/jobs.api.js';
import { applicationsApi } from '../../services/api/alerts.api.js';
import { useAuthStore } from '../../stores/auth.store.js';

export const JobDetailPage: React.FC = () => {
  const { slugOrId } = useParams<{ slugOrId: string }>();
  const { isAuthenticated } = useAuthStore();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('EXPIRED');
  const [reportDescription, setReportDescription] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['jobDetail', slugOrId],
    queryFn: async () => {
      const data = await jobsApi.getJobDetail(slugOrId!);
      setIsBookmarked(data.isBookmarked || false);
      return data;
    },
    enabled: Boolean(slugOrId)
  });

  const handleApplyClick = async () => {
    if (job) {
      if (isAuthenticated) {
        try {
          await applicationsApi.trackOutboundClick(job.id, 'User clicked official application link');
        } catch {
          // ignore tracking failure
        }
      }
      if (job.applicationUrl) {
        window.open(job.applicationUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleToggleBookmark = async () => {
    if (!job || !isAuthenticated) return;
    try {
      const res = await jobsApi.toggleBookmark(job.id);
      setIsBookmarked(res.bookmarked);
    } catch {
      // ignore
    }
  };

  const handleReportSubmit = async () => {
    if (!job) return;
    try {
      await jobsApi.reportJob(job.id, reportReason, reportDescription);
      setReportSubmitted(true);
      setTimeout(() => {
        setReportModalOpen(false);
        setReportSubmitted(false);
      }, 2000);
    } catch {
      // ignore
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography sx={{ color: '#6B6B6B' }}>Loading opportunity details...</Typography>
      </Container>
    );
  }

  if (error || !job) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#000000', mb: 2 }}>
          Job Opportunity Not Found
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B6B6B', mb: 3 }}>
          This vacancy may have been archived, expired, or the link has changed.
        </Typography>
        <Button component={RouterLink} to="/jobs" variant="contained" sx={{ borderRadius: 20 }}>
          Browse All Vacancies
        </Button>
      </Container>
    );
  }

  const deadlineDate = job.applicationDeadline ? new Date(job.applicationDeadline) : null;
  const daysLeft = deadlineDate ? differenceInDays(deadlineDate, new Date()) : null;
  const isClosingSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3, md: 4 } }}>
      {/* Back button */}
      <Box sx={{ mb: 3 }}>
        <Button
          component={RouterLink}
          to="/jobs"
          size="small"
          startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
          sx={{ color: '#6B6B6B', fontWeight: 500, p: 0, '&:hover': { color: '#2563EB', bgcolor: 'transparent' } }}
        >
          Back to opportunities feed
        </Button>

        {job.isDemoData && (
          <Alert severity="info" sx={{ mt: 2, border: '1px solid #E6E6E6', borderRadius: 2 }}>
            <strong>Demonstration Notice:</strong> This entry is indexed for architectural display. Official links point to official government portals.
          </Alert>
        )}
      </Box>

      <Grid container spacing={5}>
        {/* LEFT COLUMN: Medium Article Column */}
        <Grid item xs={12} md={8}>
          {/* Article Header Meta */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#000000', display: 'flex', alignItems: 'center' }}>
              {job.organization.name}
              {job.organization.verificationStatus === 'VERIFIED' && (
                <VerifiedIcon sx={{ fontSize: 16, color: '#2563EB', ml: 0.5 }} />
              )}
            </Typography>

            <Typography variant="caption" sx={{ color: '#E6E6E6' }}>·</Typography>

            <Chip
              label={job.sector.replace(/_/g, ' ')}
              size="small"
              sx={{
                bgcolor: '#F7F7F7',
                color: '#242424',
                border: '1px solid #E6E6E6',
                fontWeight: 600,
                fontSize: '0.72rem',
                height: 22
              }}
            />

            <Typography variant="caption" sx={{ color: '#E6E6E6' }}>·</Typography>

            <Typography variant="caption" sx={{ color: '#6B6B6B' }}>
              Published {format(new Date(job.publishDate), 'dd MMMM yyyy')}
            </Typography>
          </Box>

          {/* Article Title */}
          <Typography
            variant="h1"
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontWeight: 800,
              color: '#000000',
              letterSpacing: '-0.035em',
              fontSize: { xs: '1.85rem', sm: '2.5rem' },
              lineHeight: 1.25,
              mb: 2.5
            }}
          >
            {job.title}
          </Typography>

          {/* Summary Lead Paragraph */}
          {job.summary && (
            <Typography
              variant="body1"
              sx={{
                color: '#6B6B6B',
                fontSize: '1.1rem',
                lineHeight: 1.65,
                mb: 3.5,
                fontStyle: 'normal'
              }}
            >
              {job.summary}
            </Typography>
          )}

          {/* Quick Metrics Bar */}
          <Box
            sx={{
              p: 2.5,
              bgcolor: '#F7F7F7',
              borderRadius: 2,
              border: '1px solid #E6E6E6',
              mb: 4
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SchoolIcon sx={{ color: '#2563EB', mr: 1.25, fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#6B6B6B', fontWeight: 600, display: 'block', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                      Eligibility & Qualification
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#000000' }}>
                      {job.qualificationSummary}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon sx={{ color: '#2563EB', mr: 1.25, fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#6B6B6B', fontWeight: 600, display: 'block', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                      Posting Location
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#000000' }}>
                      {job.isAllIndia ? 'All India (National Postings)' : `${job.city ? `${job.city}, ` : ''}${job.state}`}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {job.vacanciesCount && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PeopleIcon sx={{ color: '#2563EB', mr: 1.25, fontSize: 20 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: '#6B6B6B', fontWeight: 600, display: 'block', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                        Total Vacancies
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#000000' }}>
                        {job.vacanciesCount.toLocaleString('en-IN')} Posts
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}

              {job.salaryCustomDisplay && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CurrencyRupeeIcon sx={{ color: '#2563EB', mr: 1.25, fontSize: 20 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: '#6B6B6B', fontWeight: 600, display: 'block', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                        Remuneration / Pay Scale
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#000000' }}>
                        {job.salaryCustomDisplay}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>

          <Divider sx={{ my: 3.5, borderColor: '#E6E6E6' }} />

          {/* Article Section: Full Description */}
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#000000', mb: 2, fontSize: '1.25rem' }}>
            Official Notification Summary & Scope
          </Typography>
          <Typography variant="body1" sx={{ color: '#242424', mb: 4, lineHeight: 1.8, whiteSpace: 'pre-line' }}>
            {job.fullDescription}
          </Typography>

          {/* Article Section: Eligibility */}
          {job.eligibilityCriteria && (
            <>
              <Divider sx={{ my: 3.5, borderColor: '#E6E6E6' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#000000', mb: 2, fontSize: '1.25rem' }}>
                Eligibility Criteria & Age Limits
              </Typography>
              <Typography variant="body1" sx={{ color: '#242424', mb: 4, lineHeight: 1.8 }}>
                {job.eligibilityCriteria}
              </Typography>
            </>
          )}

          {/* Article Section: Selection Process */}
          {job.selectionProcess && (
            <>
              <Divider sx={{ my: 3.5, borderColor: '#E6E6E6' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#000000', mb: 2, fontSize: '1.25rem' }}>
                Selection Process & Examination Scheme
              </Typography>
              <Typography variant="body1" sx={{ color: '#242424', mb: 4, lineHeight: 1.8 }}>
                {job.selectionProcess}
              </Typography>
            </>
          )}

          {/* Article Section: How to Apply */}
          {job.howToApply && (
            <>
              <Divider sx={{ my: 3.5, borderColor: '#E6E6E6' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#000000', mb: 2, fontSize: '1.25rem' }}>
                How to Apply on Official Portal
              </Typography>
              <Typography variant="body1" sx={{ color: '#242424', mb: 4, lineHeight: 1.8 }}>
                {job.howToApply}
              </Typography>
            </>
          )}
        </Grid>

        {/* RIGHT COLUMN: Medium-Style Compact Sticky Sidebar */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 80, pl: { md: 2 } }}>
            <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #E6E6E6', bgcolor: '#FFFFFF', boxShadow: 'none' }}>
              {/* Primary Apply Button */}
              {job.applicationUrl && (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
                  onClick={handleApplyClick}
                  sx={{
                    bgcolor: '#2563EB',
                    py: 1.25,
                    fontWeight: 600,
                    fontSize: '0.925rem',
                    borderRadius: 20,
                    mb: 1.5,
                    '&:hover': { bgcolor: '#1D4ED8' }
                  }}
                >
                  Apply on Official Portal
                </Button>
              )}

              {/* Official PDF Button */}
              {job.officialNotificationUrl && (
                <Button
                  component="a"
                  href={job.officialNotificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  fullWidth
                  size="large"
                  startIcon={<PdfIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    mb: 1.5,
                    borderColor: '#E6E6E6',
                    color: '#000000',
                    fontWeight: 600,
                    py: 1.1,
                    borderRadius: 20,
                    '&:hover': { borderColor: '#2563EB', bgcolor: '#EFF6FF', color: '#2563EB' }
                  }}
                >
                  Official Notification PDF
                </Button>
              )}

              {/* Bookmark Link */}
              <Button
                variant="text"
                fullWidth
                startIcon={isBookmarked ? <BookmarkIcon sx={{ color: '#2563EB' }} /> : <BookmarkBorderIcon />}
                onClick={handleToggleBookmark}
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: isBookmarked ? '#2563EB' : '#6B6B6B',
                  borderRadius: 20,
                  '&:hover': { bgcolor: '#EFF6FF', color: '#2563EB' }
                }}
              >
                {isBookmarked ? 'Saved to Bookmarks' : 'Save Opportunity'}
              </Button>

              <Divider sx={{ my: 2, borderColor: '#E6E6E6' }} />

              {/* Key Timeline & Fee Information */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#000000', mb: 1.5, fontSize: '0.875rem' }}>
                Key Timeline & Details
              </Typography>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#6B6B6B' }}>Application Deadline</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: isClosingSoon ? '#2563EB' : '#000000' }}>
                    {deadlineDate ? format(deadlineDate, 'dd MMM yyyy') : 'Refer Notice'}
                  </Typography>
                </Box>
                {daysLeft !== null && daysLeft >= 0 && daysLeft <= 7 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#6B6B6B' }}>Time Remaining</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#2563EB' }}>
                      {daysLeft === 0 ? 'Last day today' : `${daysLeft} days remaining`}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#6B6B6B' }}>Publish Date</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#000000' }}>
                    {format(new Date(job.publishDate), 'dd MMM yyyy')}
                  </Typography>
                </Box>
                {job.applicationFee && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#6B6B6B' }}>Application Fee</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#000000' }}>{job.applicationFee}</Typography>
                  </Box>
                )}
              </Stack>

              <Divider sx={{ my: 2, borderColor: '#E6E6E6' }} />

              {/* Report inaccurate post */}
              <Button
                size="small"
                startIcon={<FlagIcon sx={{ fontSize: 14 }} />}
                onClick={() => setReportModalOpen(true)}
                sx={{ color: '#A8A8A8', fontSize: '0.75rem', p: 0, '&:hover': { color: '#000000', bgcolor: 'transparent' } }}
              >
                Report inaccurate or expired post
              </Button>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Report Modal */}
      <Dialog
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, border: '1px solid #E6E6E6', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#000000' }}>Report Job Opportunity</DialogTitle>
        <DialogContent>
          {reportSubmitted ? (
            <Alert severity="success" sx={{ borderRadius: 2, border: '1px solid #E6E6E6' }}>Thank you! Your report has been submitted to the moderation desk.</Alert>
          ) : (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                select
                label="Reason"
                fullWidth
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              >
                <MenuItem value="EXPIRED">Application Deadline Expired</MenuItem>
                <MenuItem value="INACCURATE">Inaccurate Vacancy Details</MenuItem>
                <MenuItem value="BROKEN_LINK">Broken Official PDF or URL</MenuItem>
                <MenuItem value="SUSPECTED_FRAUD">Suspected Fraud / Unofficial Fee</MenuItem>
                <MenuItem value="OTHER">Other Issue</MenuItem>
              </TextField>
              <TextField
                label="Additional Details"
                multiline
                rows={3}
                fullWidth
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Briefly describe what needs correction..."
              />
            </Stack>
          )}
        </DialogContent>
        {!reportSubmitted && (
          <DialogActions sx={{ p: 2, borderTop: '1px solid #E6E6E6' }}>
            <Button onClick={() => setReportModalOpen(false)} sx={{ color: '#6B6B6B' }}>Cancel</Button>
            <Button variant="contained" onClick={handleReportSubmit} sx={{ bgcolor: '#2563EB', borderRadius: 20 }}>Submit Report</Button>
          </DialogActions>
        )}
      </Dialog>
    </Container>
  );
};
