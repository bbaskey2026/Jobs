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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Link
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
import { GoogleAdSlot } from '../../components/ads/GoogleAdSlot.js';
import { SidebarQuickLinks } from '../../components/layout/SidebarQuickLinks.js';
import { ShareButtons } from '../../components/common/ShareButtons.js';
import { DeadlineCountdown } from '../../components/common/DeadlineCountdown.js';

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
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, width: '100%', minHeight: '100vh' }}>
        {/* LEFT COLUMN: Medium Article Column */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            pl: { xs: 2, sm: 3, md: 5, lg: 8, xl: 12 },
            pr: { xs: 2, sm: 3, md: 4, lg: 6 },
            py: { xs: 2.5, md: 4 }
          }}
        >
          <Box sx={{ maxWidth: 860, width: '100%', mx: { xs: 'auto', md: '0' } }}>
            {/* Back button */}

            {/* Article Header Meta: Open Sans 13px bold uppercase subheading */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: '13px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  color: '#0d3b66',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {job.organization.name}
                {job.organization.verificationStatus === 'VERIFIED' && (
                  <VerifiedIcon sx={{ fontSize: 16, color: '#0d3b66', ml: 0.5 }} />
                )}
              </Typography>

              <Typography variant="caption" sx={{ color: '#E6E6E6' }}>·</Typography>

              <Chip
                label={job.sector.replace(/_/g, ' ')}
                size="small"
                sx={{
                  bgcolor: '#F7F7F7',
                  color: '#0d3b66',
                  border: '1px solid #E6E6E6',
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  height: 22
                }}
              />

              <Typography variant="caption" sx={{ color: '#E6E6E6' }}>·</Typography>

              <Typography variant="caption" sx={{ color: '#6B6B6B', fontFamily: "'Open Sans', sans-serif" }}>
                Published {format(new Date(job.publishDate), 'dd MMMM yyyy')}
              </Typography>
            </Box>

            {/* Article Title: Roboto bold */}
            <Typography
              variant="h1"
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 700,
                color: '#1a1a1a',
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.75rem', sm: '2.25rem' },
                lineHeight: 1.25,
                mb: 2.5
              }}
            >
              {job.title}
            </Typography>

            {/* Summary Lead Paragraph: Open Sans 16px, line-height 1.6 */}
            {job.summary && (
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "'Open Sans', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
                  color: '#222222',
                  fontSize: '16px',
                  lineHeight: 1.6,
                  mb: 3.5,
                  fontWeight: 400
                }}
              >
                {job.summary}
              </Typography>
            )}

            {/* Quick Metrics Bar - Plain in-place without box container */}
            <Box sx={{ my: 3 }}>
              <Grid container spacing={{ xs: 2.5, sm: 3.5 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <SchoolIcon sx={{ color: '#0d3b66', mr: 1.5, fontSize: 22, mt: 0.25 }} />
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "'Open Sans', sans-serif",
                          color: '#555555',
                          fontWeight: 700,
                          display: 'block',
                          textTransform: 'uppercase',
                          fontSize: '11px',
                          letterSpacing: '0.6px',
                          mb: 0.25
                        }}
                      >
                        Eligibility & Qualification
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "'Open Sans', sans-serif",
                          fontWeight: 600,
                          color: '#1a1a1a',
                          fontSize: '14px',
                          lineHeight: 1.45
                        }}
                      >
                        {job.qualificationSummary}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <LocationIcon sx={{ color: '#0d3b66', mr: 1.5, fontSize: 22, mt: 0.25 }} />
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "'Open Sans', sans-serif",
                          color: '#555555',
                          fontWeight: 700,
                          display: 'block',
                          textTransform: 'uppercase',
                          fontSize: '11px',
                          letterSpacing: '0.6px',
                          mb: 0.25
                        }}
                      >
                        Posting Location
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "'Open Sans', sans-serif",
                          fontWeight: 600,
                          color: '#1a1a1a',
                          fontSize: '14px',
                          lineHeight: 1.45
                        }}
                      >
                        {job.isAllIndia ? 'All India (National Postings)' : `${job.city ? `${job.city}, ` : ''}${job.state}`}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {job.vacanciesCount && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <PeopleIcon sx={{ color: '#0d3b66', mr: 1.5, fontSize: 22, mt: 0.25 }} />
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: "'Open Sans', sans-serif",
                            color: '#555555',
                            fontWeight: 700,
                            display: 'block',
                            textTransform: 'uppercase',
                            fontSize: '11px',
                            letterSpacing: '0.6px',
                            mb: 0.25
                          }}
                        >
                          Total Vacancies
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "'Roboto', sans-serif",
                            fontWeight: 700,
                            color: '#1a1a1a',
                            fontSize: '15px'
                          }}
                        >
                          {job.vacanciesCount.toLocaleString('en-IN')} Posts
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}

                {job.salaryCustomDisplay && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <CurrencyRupeeIcon sx={{ color: '#0d3b66', mr: 1.5, fontSize: 22, mt: 0.25 }} />
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: "'Open Sans', sans-serif",
                            color: '#555555',
                            fontWeight: 700,
                            display: 'block',
                            textTransform: 'uppercase',
                            fontSize: '11px',
                            letterSpacing: '0.6px',
                            mb: 0.25
                          }}
                        >
                          Remuneration / Pay Scale
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "'Roboto', sans-serif",
                            fontWeight: 700,
                            color: '#1a1a1a',
                            fontSize: '15px'
                          }}
                        >
                          {job.salaryCustomDisplay}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>

            <Divider sx={{ my: 3, borderColor: '#E6E6E6' }} />

            {/* Quick Jump Table of Contents - Plain links */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: { xs: 1.5, sm: 2 },
                mb: 3.5,
                py: 0.5
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: 700,
                  color: '#0d3b66',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px'
                }}
              >
                Jump to:
              </Typography>
              {[
                { id: 'who-can-apply', label: 'Who Can Apply' },
                { id: 'pay-and-tenure', label: 'Pay & Tenure' },
                { id: 'selection-and-interview', label: 'Selection & Interview' },
                { id: 'how-to-apply', label: 'How to Apply' },
                { id: 'important-dates', label: 'Important Dates' },
                { id: 'important-links', label: 'Important Links' }
              ].map((sec, idx, arr) => (
                <Box key={sec.id} sx={{ display: 'inline-flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                  <Link
                    href={`#${sec.id}`}
                    underline="hover"
                    sx={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0d3b66',
                      cursor: 'pointer',
                      '&:hover': { color: '#0f2a4a', textDecoration: 'underline' }
                    }}
                  >
                    {sec.label}
                  </Link>
                  {idx < arr.length - 1 && (
                    <Typography component="span" sx={{ color: '#CBD5E1', fontSize: '13px', userSelect: 'none' }}>
                      ·
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>

            {/* Official Notification Summary & Scope */}
            <Typography
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                color: '#0d3b66',
                mb: 1.5
              }}
            >
              Official Notification Summary & Scope
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "'Open Sans', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
                color: '#222222',
                fontSize: '15px',
                lineHeight: 1.65,
                mb: 4,
                whiteSpace: 'pre-line'
              }}
            >
              {job.fullDescription}
            </Typography>

            {/* SECTION 1: Who Can Apply (id="who-can-apply") */}
            <Box id="who-can-apply" sx={{ scrollMarginTop: '90px', pt: 1, mb: 4 }}>
              <Divider sx={{ mb: 3, borderColor: '#E6E6E6' }} />
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: '14px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  color: '#0d3b66',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <SchoolIcon sx={{ fontSize: 18 }} />
                Who Can Apply / Eligibility Criteria
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  color: '#222222',
                  fontSize: '15px',
                  lineHeight: 1.65,
                  mb: 1.5
                }}
              >
                <strong>Educational Qualification:</strong> {job.qualificationSummary}
              </Typography>

              {job.eligibilityCriteria && (
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    color: '#222222',
                    fontSize: '15px',
                    lineHeight: 1.65,
                    mb: 1.5,
                    whiteSpace: 'pre-line'
                  }}
                >
                  <strong>Detailed Eligibility & Age Limit:</strong>
                  <br />
                  {job.eligibilityCriteria}
                </Typography>
              )}

              <Typography
                variant="body1"
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  color: '#222222',
                  fontSize: '15px',
                  lineHeight: 1.65,
                  mb: 1.5
                }}
              >
                <strong>Nationality & Domicile:</strong>{' '}
                {job.isAllIndia ? 'Citizen of India (All States / UTs Eligible)' : `Resident of ${job.state} & Eligible Indian Citizens`}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  color: '#222222',
                  fontSize: '15px',
                  lineHeight: 1.65
                }}
              >
                <strong>Experience:</strong>{' '}
                {job.experienceMin === 0 || !job.experienceMin
                  ? 'Freshers / No Prior Experience Required'
                  : `${job.experienceMin}${job.experienceMax ? ` - ${job.experienceMax}` : '+'} Years Relevant Experience`}
              </Typography>
            </Box>

            {/* SECTION 2: Pay and Tenure (id="pay-and-tenure") */}
            <Box id="pay-and-tenure" sx={{ scrollMarginTop: '90px', pt: 1, mb: 4 }}>
              <Divider sx={{ mb: 3, borderColor: '#E6E6E6' }} />
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: '14px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  color: '#0d3b66',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <CurrencyRupeeIcon sx={{ fontSize: 18 }} />
                Pay Scale, Remuneration & Tenure
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  color: '#222222',
                  fontSize: '15px',
                  lineHeight: 1.65,
                  mb: 1.5
                }}
              >
                <strong>Pay Scale / Remuneration:</strong>{' '}
                <Typography
                  component="span"
                  sx={{
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: 700,
                    color: '#1a1a1a',
                    fontSize: '15px'
                  }}
                >
                  {job.salaryCustomDisplay || (job.salaryMin ? `₹${job.salaryMin.toLocaleString('en-IN')} - ₹${job.salaryMax ? job.salaryMax.toLocaleString('en-IN') : 'Above'}` : 'As per 7th Pay Commission / Standard Rules')}
                </Typography>
                <Typography component="span" sx={{ color: '#555555', display: 'block', mt: 0.5, fontSize: '14px' }}>
                  Includes Dearness Allowance (DA), House Rent Allowance (HRA), Transport Allowance (TA), and medical allowances where applicable.
                </Typography>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  color: '#222222',
                  fontSize: '15px',
                  lineHeight: 1.65
                }}
              >
                <strong>Nature of Employment & Tenure:</strong>{' '}
                {job.employmentType === 'FULL_TIME' ? 'Regular / Permanent Employment' : job.employmentType === 'CONTRACT' ? 'Contractual / Fixed Term Tenure' : job.employmentType}
                <Typography component="span" sx={{ color: '#555555', display: 'block', mt: 0.5, fontSize: '14px' }}>
                  Subject to standard probation period (typically 1 to 2 years) and performance appraisal as per statutory rules.
                </Typography>
              </Typography>
            </Box>

            {/* SECTION 3: Selection and Interview (id="selection-and-interview") */}
            <Box id="selection-and-interview" sx={{ scrollMarginTop: '90px', pt: 1, mb: 4 }}>
              <Divider sx={{ mb: 3, borderColor: '#E6E6E6' }} />
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: '14px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  color: '#0d3b66',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <VerifiedIcon sx={{ fontSize: 18 }} />
                Selection Process & Interview Scheme
              </Typography>

              {job.selectionProcess ? (
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    color: '#222222',
                    fontSize: '15px',
                    lineHeight: 1.65,
                    mb: 2,
                    whiteSpace: 'pre-line'
                  }}
                >
                  {job.selectionProcess}
                </Typography>
              ) : (
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    color: '#222222',
                    fontSize: '15px',
                    lineHeight: 1.65,
                    mb: 2
                  }}
                >
                  Selection will be carried out strictly through competitive merit evaluation based on official service selection rules.
                </Typography>
              )}

              <Box
                component="ol"
                sx={{
                  pl: 2.5,
                  m: 0,
                  '& li': {
                    mb: 1.25,
                    color: '#222222',
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: '15px',
                    lineHeight: 1.6
                  }
                }}
              >
                <li>
                  <strong>Stage 1: Written Exam / Computer Based Test (CBT)</strong> — Objective or computer-based screening assessing domain knowledge, aptitude & general studies.
                </li>
                <li>
                  <strong>Stage 2: Main / Subject Paper</strong> — Comprehensive examination evaluating specialized technical competence.
                </li>
                <li>
                  <strong>Stage 3: Skill / Physical Test</strong> — Typing test, trade test, or Physical Efficiency / Measurement Standards (PET/PST) where applicable.
                </li>
                <li>
                  <strong>Stage 4: Document Verification & Personality Interview</strong> — Scrutiny of original credentials and certificates followed by personal interview.
                </li>
              </Box>
            </Box>

            {/* SECTION 4: How to Apply with Steps (id="how-to-apply") */}
            <Box id="how-to-apply" sx={{ scrollMarginTop: '90px', pt: 1, mb: 4 }}>
              <Divider sx={{ mb: 3, borderColor: '#E6E6E6' }} />
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: '14px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  color: '#0d3b66',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <PeopleIcon sx={{ fontSize: 18 }} />
                How to Apply (Step-by-Step Procedure)
              </Typography>

              {job.howToApply && (
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    color: '#222222',
                    fontSize: '15px',
                    lineHeight: 1.65,
                    mb: 2,
                    whiteSpace: 'pre-line'
                  }}
                >
                  {job.howToApply}
                </Typography>
              )}

              <Box
                component="ol"
                sx={{
                  pl: 2.5,
                  m: 0,
                  '& li': {
                    mb: 1.5,
                    color: '#222222',
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: '15px',
                    lineHeight: 1.6
                  }
                }}
              >
                <li>
                  <strong>Check Official Notification & Eligibility:</strong> Carefully verify qualification requirements, age limits, and category-wise reservation guidelines from the official gazette notice.
                </li>
                <li>
                  <strong>Complete One-Time Registration (OTR):</strong> Navigate to the authorized recruiting portal ({job.applicationUrl ? 'direct link available in Important Links below' : 'official portal'}) and create your candidate profile.
                </li>
                <li>
                  <strong>Fill Application Form & Upload Certificates:</strong> Input academic credentials, personal details, and upload scanned copies of passport photograph, signature, and educational/caste certificates in prescribed dimensions.
                </li>
                <li>
                  <strong>Remit Application Fee:</strong> {job.applicationFee ? `Pay prescribed fee (${job.applicationFee}) via Debit Card, Credit Card, Net Banking, or UPI gateway.` : 'Pay the applicable examination fee through the integrated online payment gateway.'}
                </li>
                <li>
                  <strong>Final Submission & Save Printout:</strong> Submit the application form, verify all details, and download a PDF copy along with the fee acknowledgement receipt for examination hall admission.
                </li>
              </Box>
            </Box>

            {/* SECTION 5: Important Dates (id="important-dates") */}
            <Box id="important-dates" sx={{ scrollMarginTop: '90px', pt: 1, mb: 4 }}>
              <Divider sx={{ mb: 3, borderColor: '#E6E6E6' }} />
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: '14px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  color: '#0d3b66',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <ScheduleIcon sx={{ fontSize: 18 }} />
                Important Dates & Recruitment Schedule
              </Typography>

              <Table size="small" sx={{ mb: 2 }}>
                <TableHead>
                  <TableRow sx={{ borderBottom: '2px solid #0d3b66' }}>
                    <TableCell sx={{ color: '#0d3b66', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', px: 1, py: 1 }}>Event / Stage</TableCell>
                    <TableCell sx={{ color: '#0d3b66', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', px: 1, py: 1 }}>Date / Timeline</TableCell>
                    <TableCell sx={{ color: '#0d3b66', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', px: 1, py: 1 }}>Status / Countdown</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow sx={{ '& td': { borderBottom: '1px solid #EEEEEE', px: 1, py: 1.25 } }}>
                    <TableCell sx={{ fontWeight: 600, color: '#1a1a1a', fontSize: '14px' }}>Official Notification Release</TableCell>
                    <TableCell sx={{ color: '#334155', fontSize: '14px' }}>{format(new Date(job.publishDate), 'dd MMM yyyy')}</TableCell>
                    <TableCell sx={{ color: '#059669', fontWeight: 600, fontSize: '13px' }}>Released</TableCell>
                  </TableRow>
                  <TableRow sx={{ '& td': { borderBottom: '1px solid #EEEEEE', px: 1, py: 1.25 } }}>
                    <TableCell sx={{ fontWeight: 600, color: '#1a1a1a', fontSize: '14px' }}>Online Application Start Date</TableCell>
                    <TableCell sx={{ color: '#334155', fontSize: '14px' }}>{job.applicationStartDate ? format(new Date(job.applicationStartDate), 'dd MMM yyyy') : format(new Date(job.publishDate), 'dd MMM yyyy')}</TableCell>
                    <TableCell sx={{ color: '#2563EB', fontWeight: 600, fontSize: '13px' }}>Active</TableCell>
                  </TableRow>
                  <TableRow sx={{ '& td': { borderBottom: '1px solid #EEEEEE', px: 1, py: 1.25 } }}>
                    <TableCell sx={{ fontWeight: 700, color: '#92400E', fontSize: '14px' }}>Last Date to Apply (Deadline)</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#92400E', fontSize: '14px' }}>
                      {job.applicationDeadline ? format(new Date(job.applicationDeadline), 'dd MMM yyyy') : 'Open until filled'}
                    </TableCell>
                    <TableCell>
                      <DeadlineCountdown deadline={job.applicationDeadline} showDate={false} />
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ '& td': { borderBottom: '1px solid #EEEEEE', px: 1, py: 1.25 } }}>
                    <TableCell sx={{ fontWeight: 600, color: '#1a1a1a', fontSize: '14px' }}>Last Date for Fee Payment</TableCell>
                    <TableCell sx={{ color: '#334155', fontSize: '14px' }}>{job.applicationDeadline ? format(new Date(job.applicationDeadline), 'dd MMM yyyy') : 'As per notice'}</TableCell>
                    <TableCell sx={{ color: '#475569', fontWeight: 600, fontSize: '13px' }}>Mandatory</TableCell>
                  </TableRow>
                  <TableRow sx={{ '& td': { borderBottom: '1px solid #EEEEEE', px: 1, py: 1.25 } }}>
                    <TableCell sx={{ fontWeight: 600, color: '#1a1a1a', fontSize: '14px' }}>Admit Card Download</TableCell>
                    <TableCell sx={{ color: '#334155', fontSize: '14px' }}>7 - 10 Days Before Written Examination</TableCell>
                    <TableCell sx={{ color: '#64748B', fontSize: '13px' }}>Upcoming</TableCell>
                  </TableRow>
                  <TableRow sx={{ '& td': { borderBottom: '1px solid #EEEEEE', px: 1, py: 1.25 } }}>
                    <TableCell sx={{ fontWeight: 600, color: '#1a1a1a', fontSize: '14px' }}>Written Examination Date</TableCell>
                    <TableCell sx={{ color: '#334155', fontSize: '14px' }}>To be announced by recruiting body</TableCell>
                    <TableCell sx={{ color: '#64748B', fontSize: '13px' }}>To Be Notified</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>

            {/* SECTION 6: Important Links (id="important-links") */}
            <Box id="important-links" sx={{ scrollMarginTop: '90px', pt: 1, mb: 4 }}>
              <Divider sx={{ mb: 3, borderColor: '#E6E6E6' }} />
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: '14px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  color: '#0d3b66',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <OpenInNewIcon sx={{ fontSize: 18 }} />
                Important Links & Official Portals
              </Typography>

              <Table size="small" sx={{ mb: 2 }}>
                <TableHead>
                  <TableRow sx={{ borderBottom: '2px solid #0d3b66' }}>
                    <TableCell sx={{ color: '#0d3b66', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', px: 1, py: 1 }}>Description / Portal</TableCell>
                    <TableCell sx={{ color: '#0d3b66', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', px: 1, py: 1 }}>Status / Category</TableCell>
                    <TableCell align="right" sx={{ color: '#0d3b66', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', px: 1, py: 1 }}>Direct Link</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {job.applicationUrl && (
                    <TableRow sx={{ '& td': { borderBottom: '1px solid #EEEEEE', px: 1, py: 1.25 } }}>
                      <TableCell sx={{ fontWeight: 700, color: '#1a1a1a', fontSize: '14px' }}>
                        Apply Online (Official Application Portal)
                      </TableCell>
                      <TableCell sx={{ color: '#059669', fontSize: '13px', fontWeight: 600 }}>
                        Verified Direct Portal
                      </TableCell>
                      <TableCell align="right">
                        <Link
                          href={job.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                          sx={{
                            fontFamily: "'Open Sans', sans-serif",
                            color: '#0d3b66',
                            fontWeight: 700,
                            fontSize: '13px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            '&:hover': { color: '#0f2a4a' }
                          }}
                        >
                          Apply Online <OpenInNewIcon sx={{ fontSize: 14 }} />
                        </Link>
                      </TableCell>
                    </TableRow>
                  )}

                  {job.officialNotificationUrl && (
                    <TableRow sx={{ '& td': { borderBottom: '1px solid #EEEEEE', px: 1, py: 1.25 } }}>
                      <TableCell sx={{ fontWeight: 700, color: '#1a1a1a', fontSize: '14px' }}>
                        Download Official Notification PDF
                      </TableCell>
                      <TableCell sx={{ color: '#059669', fontSize: '13px', fontWeight: 600 }}>
                        Authorized Gazette Notice
                      </TableCell>
                      <TableCell align="right">
                        <Link
                          href={job.officialNotificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                          sx={{
                            fontFamily: "'Open Sans', sans-serif",
                            color: '#0d3b66',
                            fontWeight: 700,
                            fontSize: '13px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            '&:hover': { color: '#0f2a4a' }
                          }}
                        >
                          <PdfIcon sx={{ fontSize: 16 }} /> Download PDF
                        </Link>
                      </TableCell>
                    </TableRow>
                  )}

                  {(job.organization as any)?.websiteUrl && (
                    <TableRow sx={{ '& td': { borderBottom: '1px solid #EEEEEE', px: 1, py: 1.25 } }}>
                      <TableCell sx={{ fontWeight: 700, color: '#1a1a1a', fontSize: '14px' }}>
                        Official Authority Website ({job.organization.name})
                      </TableCell>
                      <TableCell sx={{ color: '#059669', fontSize: '13px', fontWeight: 600 }}>
                        Authorized Organization Portal
                      </TableCell>
                      <TableCell align="right">
                        <Link
                          href={(job.organization as any).websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                          sx={{
                            fontFamily: "'Open Sans', sans-serif",
                            color: '#0d3b66',
                            fontWeight: 700,
                            fontSize: '13px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            '&:hover': { color: '#0f2a4a' }
                          }}
                        >
                          Visit Portal <OpenInNewIcon sx={{ fontSize: 14 }} />
                        </Link>
                      </TableCell>
                    </TableRow>
                  )}

                  {job.attachments && job.attachments.map((att) => (
                    <TableRow sx={{ '& td': { borderBottom: '1px solid #EEEEEE', px: 1, py: 1.25 } }} key={att.id}>
                      <TableCell sx={{ fontWeight: 600, color: '#1a1a1a', fontSize: '14px' }}>
                        {att.title}
                      </TableCell>
                      <TableCell sx={{ color: '#6B6B6B', fontSize: '13px' }}>
                        {(att.fileSizeBytes / 1024 / 1024).toFixed(2)} MB · {att.fileType.toUpperCase()}
                      </TableCell>
                      <TableCell align="right">
                        <Link
                          href={att.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                          sx={{
                            fontFamily: "'Open Sans', sans-serif",
                            color: '#0d3b66',
                            fontWeight: 700,
                            fontSize: '13px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            '&:hover': { color: '#0f2a4a' }
                          }}
                        >
                          Download <PdfIcon sx={{ fontSize: 16 }} />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            {/* Article Bottom: Social Sharing Hub - Plain in place */}
            <Divider sx={{ my: 3.5, borderColor: '#E6E6E6' }} />
            <Box sx={{ mb: 4 }}>
              <ShareButtons
                title={job.title}
                organization={job.organization?.name}
              />
            </Box>
          </Box>
        </Box>

        {/* RIGHT COLUMN: Flushed to the right edge in direct contact with screen */}
        <Box
          sx={{
            width: { md: 340, lg: 380, xl: 420 },
            flexShrink: 0,
            pl: { md: 3.5, lg: 4 },
            pr: { md: 3.5, lg: 4, xl: 5 },
            py: { xs: 3, md: 4 },
            borderLeft: { md: '1px solid #E6E6E6' },
            borderTop: { xs: '1px solid #E6E6E6', md: 'none' },
            bgcolor: '#FFFFFF'
          }}
        >
          <Box sx={{ position: 'sticky', top: 80 }}>
            {/* Action & Timeline Section (Natural flow in place, not inside a box) */}
            <Box sx={{ mb: 3 }}>
              {/* Primary Apply Button */}
              {job.applicationUrl && (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
                  onClick={handleApplyClick}
                  sx={{
                    bgcolor: '#0d3b66',
                    py: 1.25,
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderRadius: '4px',
                    mb: 1.5,
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#0f2a4a', boxShadow: 'none' }
                  }}
                >
                  Apply on Official Portal
                </Button>
              )}

              {/* Official PDF Button: Outline Action Button */}
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
                    border: '1px solid #0d3b66',
                    color: '#0d3b66',
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    py: 1.1,
                    borderRadius: '4px',
                    '&:hover': {
                      border: '1px solid #0d3b66',
                      bgcolor: 'rgba(13, 59, 102, 0.06)',
                      color: '#0d3b66'
                    }
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
                  mb: 1.5,
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

              {/* Social Media Share Buttons with Direct Links */}
              <Box sx={{ my: 1.5 }}>
                <ShareButtons
                  title={job.title}
                  organization={job.organization?.name}
                />
              </Box>

              <Divider sx={{ my: 2.5, borderColor: '#E6E6E6' }} />

              {/* Key Timeline & Fee Information */}
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: '13px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  color: '#0d3b66',
                  mb: 1.5
                }}
              >
                Key Timeline & Details
              </Typography>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#6B6B6B' }}>Application Deadline</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: isClosingSoon ? '#2563EB' : '#000000' }}>
                    {deadlineDate ? format(deadlineDate, 'dd MMM yyyy') : 'Refer Notice'}
                  </Typography>
                </Box>
                {job.applicationDeadline && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#6B6B6B' }}>Live Countdown</Typography>
                    <DeadlineCountdown deadline={job.applicationDeadline} showDate={false} />
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

              <Divider sx={{ my: 2.5, borderColor: '#E6E6E6' }} />

              {/* Report inaccurate post */}
              <Button
                size="small"
                startIcon={<FlagIcon sx={{ fontSize: 14 }} />}
                onClick={() => setReportModalOpen(true)}
                sx={{ color: '#A8A8A8', fontSize: '0.75rem', p: 0, '&:hover': { color: '#000000', bgcolor: 'transparent' } }}
              >
                Report inaccurate or expired post
              </Button>
            </Box>

            <Divider sx={{ mb: 3.5, borderColor: '#E6E6E6' }} />

            {/* Google Ads Sidebar Unit */}
            <Box sx={{ mb: 3.5 }}>
              <GoogleAdSlot minHeight={240} />
            </Box>

            <Divider sx={{ mb: 3.5, borderColor: '#E6E6E6' }} />

            {/* Quick Links & Resources */}
            <Box sx={{ mb: 2 }}>
              <SidebarQuickLinks />
            </Box>
          </Box>
        </Box>
      </Box>

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
    </Box>
  );
};
