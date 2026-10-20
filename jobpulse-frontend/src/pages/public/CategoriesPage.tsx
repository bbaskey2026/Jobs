import React, { useState } from 'react';
import { Container, Typography, Box, Button, CircularProgress, Link } from '@mui/material';
import {
  AccountBalance as CivilServicesIcon,
  AccountBalanceWallet as BankIcon,
  Security as DefenceIcon,
  Memory as TechIcon,
  Train as RailwayIcon,
  LocalPolice as PoliceIcon,
  Business as PsuIcon,
  School as TeachingIcon,
  LocalHospital as HealthIcon,
  ChevronRight as ChevronRightIcon,
  OpenInNew as OpenInNewIcon,
  Schedule as ScheduleIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import { apiClient } from '../../services/api/client.js';

interface CategoryPost {
  title: string;
  status: string;
  query: string;
  highlight?: boolean;
}

interface CategoryDetailMeta {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  endingSoonCount: number;
  posts: CategoryPost[];
}

const CATEGORY_DETAILS: Record<string, CategoryDetailMeta> = {
  'civil-services': {
    icon: CivilServicesIcon,
    iconBg: '#FEF3C7',
    iconColor: '#B45309',
    endingSoonCount: 4,
    posts: [
      { title: 'UPSC Civil Services (IAS/IPS)', status: 'Preliminary Exam Notice Active', query: 'UPSC CSE' },
      { title: 'MPSC State Services Gazetted', status: 'Closes in 3 days', query: 'MPSC', highlight: true },
      { title: 'SSC CGL Tier-2 Schedule', status: 'Admit Card Released', query: 'SSC CGL' },
      { title: 'State DySP & Tehsildar Cadre', status: 'Official Notification Live', query: 'Tehsildar' }
    ]
  },
  'staff-selection': {
    icon: CivilServicesIcon,
    iconBg: '#FEF3C7',
    iconColor: '#B45309',
    endingSoonCount: 3,
    posts: [
      { title: 'OSSSC Panchayat Executive Officer (PEO) & JA', status: 'Online Applications Live', query: 'OSSSC', highlight: true },
      { title: 'OSSC Combined Graduate Level (CGL)', status: 'Official Notice Active', query: 'OSSC' },
      { title: 'SSC Combined Graduate Level (CGL)', status: '17,727 Vacancies Live', query: 'SSC CGL', highlight: true },
      { title: 'OSSSC RI, ARI, Amin & Forest Guard', status: 'Combined Recruitment Active', query: 'OSSSC' }
    ]
  },
  'it-software': {
    icon: TechIcon,
    iconBg: '#EEF2FF',
    iconColor: '#4338CA',
    endingSoonCount: 2,
    posts: [
      { title: 'TCS National Qualifier Test (NQT)', status: 'Registration Window Open', query: 'TCS NQT', highlight: true },
      { title: 'Infosys Specialist Programmer (SP)', status: 'Off-Campus Drive Active', query: 'Infosys' },
      { title: 'Wipro Elite National Talent Hunt', status: 'Assessments Scheduled', query: 'Wipro' },
      { title: 'HDFC Bank Future Bankers Program', status: 'Apply Online', query: 'HDFC Bank' }
    ]
  },
  'banking-finance': {
    icon: BankIcon,
    iconBg: '#DCFCE7',
    iconColor: '#15803D',
    endingSoonCount: 1,
    posts: [
      { title: 'SBI Probationary Officer (PO)', status: 'Preliminary Results Out', query: 'SBI PO' },
      { title: 'IBPS Clerk 14th Recruitment', status: 'Closes next week', query: 'IBPS Clerk', highlight: true },
      { title: 'RBI Grade B Officers Exam', status: 'Interview Call Letters Issued', query: 'RBI Grade B' },
      { title: 'NABARD Assistant Manager', status: 'Phase 1 Exam Declared', query: 'NABARD' }
    ]
  },
  'defence-paramilitary': {
    icon: DefenceIcon,
    iconBg: '#EFF6FF',
    iconColor: '#1D4ED8',
    endingSoonCount: 1,
    posts: [
      { title: 'Indian Army Agniveer Rally', status: 'Physical Test Schedule Out', query: 'Army Agniveer' },
      { title: 'Air Force AFCAT Examination', status: 'Online Applications Invited', query: 'AFCAT' },
      { title: 'CAPF Assistant Commandants', status: 'Written Results Announced', query: 'CAPF' },
      { title: 'UPSC NDA & NA Examination', status: 'Final Merit List Out', query: 'NDA' }
    ]
  },
  'engineering-tech': {
    icon: TechIcon,
    iconBg: '#EEF2FF',
    iconColor: '#4338CA',
    endingSoonCount: 2,
    posts: [
      { title: 'ISRO Scientist / Engineer', status: 'Closes tomorrow', query: 'ISRO', highlight: true },
      { title: 'SSC JE (Civil/Mech/Elec)', status: 'Paper 1 Marks Normalized', query: 'SSC JE' },
      { title: 'DRDO CEPTAM Senior Tech', status: 'Interview Calls Issued', query: 'DRDO' },
      { title: 'BARC Scientific Officer', status: 'Online Application Open', query: 'BARC' }
    ]
  },
  'railways': {
    icon: RailwayIcon,
    iconBg: '#FEF9C3',
    iconColor: '#A16207',
    endingSoonCount: 1,
    posts: [
      { title: 'RRB NTPC Graduate Posts', status: 'Exam Dates Announced', query: 'RRB NTPC' },
      { title: 'RRB Assistant Loco Pilot (ALP)', status: 'CBT 1 Cut-off Published', query: 'RRB ALP' },
      { title: 'Railway Group D Level-1', status: 'Document Scrutiny List Live', query: 'Group D' },
      { title: 'Senior Section Engineer (SSE)', status: 'Technical Paper Pattern', query: 'Section Engineer' }
    ]
  },
  'police-security': {
    icon: PoliceIcon,
    iconBg: '#F3E8FF',
    iconColor: '#7E22CE',
    endingSoonCount: 2,
    posts: [
      { title: 'Police Sub-Inspector (PSI / SI)', status: 'Closes in 5 days', query: 'Sub-Inspector', highlight: true },
      { title: 'State Police Constable Drive', status: 'Physical Measurement Standard', query: 'Police Constable' },
      { title: 'Home Guard & Civil Defence', status: 'Direct Recruitment Active', query: 'Home Guard' },
      { title: 'Forensic & CID Cyber Analyst', status: 'Document Verification', query: 'Cyber' }
    ]
  },
  'psu-vacancies': {
    icon: PsuIcon,
    iconBg: '#F1F5F9',
    iconColor: '#334155',
    endingSoonCount: 1,
    posts: [
      { title: 'ONGC Graduate Trainee (GATE)', status: 'Closes this Friday', query: 'ONGC', highlight: true },
      { title: 'IOCL Junior Engineering Assistant', status: 'Written Test Marks Published', query: 'IOCL' },
      { title: 'NTPC Executive Trainee', status: 'Interview Shortlist Published', query: 'NTPC' },
      { title: 'BHEL Management Trainee', status: 'Interview Calls Issued', query: 'BHEL' }
    ]
  },
  'teaching-research': {
    icon: TeachingIcon,
    iconBg: '#FCE7F3',
    iconColor: '#BE185D',
    endingSoonCount: 1,
    posts: [
      { title: 'UGC NET & JRF Examination', status: 'Admit Card Link Active', query: 'UGC NET' },
      { title: 'CTET Central Teacher Eligibility', status: 'Answer Keys Available', query: 'CTET' },
      { title: 'KVS / NVS PGT & TGT Teachers', status: 'Interview Schedule Out', query: 'KVS' },
      { title: 'University Assistant Professor', status: 'Faculty Positions Active', query: 'Assistant Professor' }
    ]
  },
  'healthcare-nursing': {
    icon: HealthIcon,
    iconBg: '#E0F2FE',
    iconColor: '#0369A1',
    endingSoonCount: 1,
    posts: [
      { title: 'AIIMS Nursing Officer (NORCET)', status: 'Stage 2 Merit List Live', query: 'AIIMS' },
      { title: 'Medical Officer (General Duty)', status: 'Walk-In Interview Active', query: 'Medical Officer' },
      { title: 'Govt Hospital Staff Nurse Gr-II', status: 'Application Deadline Active', query: 'Staff Nurse' },
      { title: 'Registered Pharmacist & Lab Tech', status: 'Document Verification', query: 'Pharmacist' }
    ]
  }
};

const getCategoryMeta = (slug: string): CategoryDetailMeta => {
  if (CATEGORY_DETAILS[slug]) return CATEGORY_DETAILS[slug];

  for (const [key, val] of Object.entries(CATEGORY_DETAILS)) {
    if (slug.includes(key) || key.includes(slug)) return val;
  }

  return {
    icon: TechIcon,
    iconBg: '#F1F5F9',
    iconColor: '#0d3b66',
    endingSoonCount: 1,
    posts: [
      { title: 'Central Gazetted Officer Drive', status: 'Applications Open', query: 'Officer' },
      { title: 'State Technical Cadre Exam', status: 'Detailed Notice Released', query: 'State' },
      { title: 'Departmental Recruitment Board', status: 'Verification Stage', query: 'Recruitment' }
    ]
  };
};

export const CategoriesPage: React.FC = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiClient.get('/categories');
      return res.data.data;
    }
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeCategory =
    (categories && (categories.find((c: any) => c.id === selectedId) || categories[0])) || null;

  const activeMeta = activeCategory ? getCategoryMeta(activeCategory.slug) : null;
  const ActiveIcon = activeMeta ? activeMeta.icon : TechIcon;

  return (
    <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto', py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3, md: 4 } }}>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 700,
            color: '#1a1a1a',
            letterSpacing: '-0.02em',
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            mb: 0.75
          }}
        >
          Recruitment Sectors & Streams
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: "'Open Sans', 'Roboto', sans-serif",
            color: '#222222',
            fontSize: '15px',
            lineHeight: 1.6,
            maxWidth: 820
          }}
        >
          Explore opportunities grouped by government service commissions, educational streams, and professional domains.
        </Typography>
      </Box>

      {/* Top Quick Links Flex Container: All in one clean horizontal ribbon */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: { xs: 1, sm: 1.5 },
          py: 1.5,
          mb: 4,
          borderTop: '1px solid #E6E6E6',
          borderBottom: '1px solid #E6E6E6'
        }}
      >
        <Typography
          component="span"
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 700,
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            color: '#0d3b66',
            mr: 0.5,
            flexShrink: 0
          }}
        >
          Quick Links:
        </Typography>

        {[
          { label: 'Admit Cards & Hall Tickets', path: '/jobs?q=Admit+Card' },
          { label: 'Exam Results & Cut-Offs', path: '/jobs?q=Result' },
          { label: 'Official Answer Keys', path: '/jobs?q=Answer+Key' },
          { label: 'Syllabus & Pattern', path: '/jobs?q=Syllabus' },
          { label: 'Previous Solved Papers', path: '/jobs?q=Previous+Paper' },
          { label: '10th Pass Jobs', path: '/jobs?qualification=10th' },
          { label: '12th Pass Jobs', path: '/jobs?qualification=12th' },
          { label: 'Graduate Jobs', path: '/jobs?qualification=Graduate' },
          { label: 'B.Tech / Engineering', path: '/jobs?qualification=B.Tech' },
          { label: 'State-Wise Directory (36 States)', path: '/state-jobs' },
          { label: 'Central Govt Jobs', path: '/government-jobs' },
          { label: 'Private Jobs', path: '/private-jobs' }
        ].map((item, idx, arr) => (
          <Box key={item.label} sx={{ display: 'inline-flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
            <Link
              component={RouterLink}
              to={item.path}
              underline="hover"
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontSize: '13px',
                fontWeight: 600,
                color: '#0d3b66',
                cursor: 'pointer',
                '&:hover': { color: '#0f2a4a' }
              }}
            >
              {item.label}
            </Link>
            {idx < arr.length - 1 && (
              <Typography component="span" sx={{ color: '#CBD5E1', fontSize: '13px', userSelect: 'none' }}>
                ·
              </Typography>
            )}
          </Box>
        ))}
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#0d3b66' }} />
        </Box>
      ) : (
        /* Master-Detail Split Layout - Plain in place without any card/div boxes */
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* LEFT PANEL: Plain Streams Selector List */}
          <Box
            sx={{
              width: { xs: '100%', md: 320, lg: 360 },
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
                top: 80,
                maxHeight: { md: 'calc(100vh - 100px)' },
                overflowY: { md: 'auto' },
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' }
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  color: '#64748B',
                  mb: 1.5
                }}
              >
                Cadres & Recruitment Streams
              </Typography>

              {categories?.map((cat: any) => {
                const isSelected = activeCategory?.id === cat.id;
                const meta = getCategoryMeta(cat.slug);
                const ItemIcon = meta.icon;

                return (
                  <Box
                    key={cat.id}
                    onClick={() => setSelectedId(cat.id)}
                    sx={{
                      py: 1.5,
                      px: 1.25,
                      cursor: 'pointer',
                      borderLeft: isSelected ? '3px solid #0d3b66' : '3px solid transparent',
                      bgcolor: isSelected ? 'rgba(13, 59, 102, 0.05)' : 'transparent',
                      borderBottom: '1px solid #EEEEEE',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        bgcolor: isSelected ? 'rgba(13, 59, 102, 0.05)' : 'rgba(13, 59, 102, 0.02)',
                        '& .stream-title': { color: '#0d3b66' }
                      }
                    }}
                  >
                    {/* Top Row: Icon + Title & Description + Chevron */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.25, mb: 0.75 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                        <ItemIcon sx={{ fontSize: 20, color: isSelected ? '#0d3b66' : meta.iconColor, mt: 0.2, flexShrink: 0 }} />
                        <Box>
                          <Typography
                            className="stream-title"
                            variant="body2"
                            sx={{
                              fontFamily: "'Roboto', sans-serif",
                              fontWeight: isSelected ? 700 : 600,
                              fontSize: '14.5px',
                              color: isSelected ? '#0d3b66' : '#1a1a1a',
                              lineHeight: 1.3,
                              mb: 0.25
                            }}
                          >
                            {cat.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "'Open Sans', sans-serif",
                              color: '#64748B',
                              fontSize: '12px',
                              lineHeight: 1.4,
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {cat.description}
                          </Typography>
                        </Box>
                      </Box>

                      <ChevronRightIcon
                        sx={{
                          fontSize: 18,
                          color: isSelected ? '#0d3b66' : '#94A3B8',
                          mt: 0.25,
                          flexShrink: 0
                        }}
                      />
                    </Box>

                    {/* Bottom Status: Active Openings + Ending Soon */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pl: 3.75 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "'Open Sans', sans-serif",
                          fontWeight: 600,
                          color: '#475569',
                          fontSize: '11.5px'
                        }}
                      >
                        {cat.jobCount || 0} Active Openings
                      </Typography>

                      {meta.endingSoonCount > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ScheduleIcon sx={{ fontSize: 12, color: '#D97706' }} />
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "'Open Sans', sans-serif",
                              fontWeight: 600,
                              color: '#D97706',
                              fontSize: '11.5px'
                            }}
                          >
                            {meta.endingSoonCount} ending soon
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* RIGHT PANEL: Selected Category Detail View (Completely Plain in Place) */}
          <Box sx={{ flex: 1, minWidth: 0, pl: { md: 4, lg: 5 } }}>
            {activeCategory && activeMeta && (
              <Box>
                {/* Header: Icon, Stream Title, Description, and Live Updates Badge */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 2,
                    pb: 2.5,
                    borderBottom: '1px solid #E6E6E6',
                    mb: 3
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.75 }}>
                    <ActiveIcon sx={{ fontSize: 32, color: '#0d3b66', mt: 0.25, flexShrink: 0 }} />
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontFamily: "'Roboto', sans-serif",
                          fontWeight: 700,
                          fontSize: { xs: '1.35rem', sm: '1.6rem' },
                          color: '#1a1a1a',
                          lineHeight: 1.25,
                          mb: 0.5
                        }}
                      >
                        {activeCategory.name}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: "'Open Sans', sans-serif",
                          color: '#4B5563',
                          fontSize: '14.5px',
                          lineHeight: 1.55
                        }}
                      >
                        {activeCategory.description}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Live Updates badge */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      bgcolor: '#ECFDF5',
                      color: '#059669',
                      border: '1px solid #A7F3D0',
                      px: 1.5,
                      py: 0.4,
                      borderRadius: '20px',
                      flexShrink: 0
                    }}
                  >
                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#10B981' }} />
                    <Typography
                      sx={{
                        fontFamily: "'Open Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: '11.5px',
                        lineHeight: 1
                      }}
                    >
                      Live Updates
                    </Typography>
                  </Box>
                </Box>

                {/* SECTION 1: KEY POSTS & ACTIVE NOTIFICATIONS (2-Column Grid Layout matching reference layout, plain in place) */}
                <Typography
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    color: '#0d3b66',
                    mb: 1.5
                  }}
                >
                  Key Posts & Active Notifications
                </Typography>

                {/* 2-Column Grid matching reference image layout, but strictly plain without box cards */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    columnGap: 4,
                    rowGap: 2,
                    mb: 4
                  }}
                >
                  {activeMeta.posts.map((post, idx) => (
                    <Box
                      key={idx}
                      component={RouterLink}
                      to={`/jobs?q=${encodeURIComponent(post.query || post.title)}`}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        py: 1.5,
                        px: 1,
                        borderBottom: '1px solid #EEEEEE',
                        textDecoration: 'none',
                        transition: 'background-color 0.15s ease',
                        '&:hover': {
                          bgcolor: 'rgba(13, 59, 102, 0.03)',
                          '& .post-title': { color: '#0d3b66', textDecoration: 'underline' }
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 0.75 }}>
                        <Typography
                          className="post-title"
                          sx={{
                            fontFamily: "'Roboto', sans-serif",
                            fontWeight: 700,
                            fontSize: '14.5px',
                            color: '#1a1a1a',
                            lineHeight: 1.35
                          }}
                        >
                          {post.title}
                        </Typography>
                        <OpenInNewIcon sx={{ fontSize: 16, color: '#0d3b66', mt: 0.2, flexShrink: 0 }} />
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "'Open Sans', sans-serif",
                          color: post.highlight ? '#DC2626' : '#64748B',
                          fontWeight: post.highlight ? 600 : 500,
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        {post.highlight && (
                          <Box
                            component="span"
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: '#DC2626',
                              display: 'inline-block'
                            }}
                          />
                        )}
                        {post.status}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* SECTION 2: DIRECT STREAM RESOURCES (Plain inline text links) */}
                <Typography
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    color: '#0d3b66',
                    mb: 1.5
                  }}
                >
                  Direct Stream Resources
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, mb: 4 }}>
                  {[
                    { label: 'Official Syllabus & Pattern', path: `/jobs?categorySlug=${activeCategory.slug}&q=Syllabus` },
                    { label: 'Eligibility Calculator', path: `/jobs?categorySlug=${activeCategory.slug}&q=Eligibility` },
                    { label: 'Previous Cut-off PDFs', path: `/jobs?categorySlug=${activeCategory.slug}&q=Previous+Paper` },
                    { label: 'State-Wise Directory', path: '/state-jobs' },
                    { label: 'Admit Cards & Hall Tickets', path: `/jobs?categorySlug=${activeCategory.slug}&q=Admit+Card` }
                  ].map((res, idx, arr) => (
                    <Box key={res.label} sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5 }}>
                      <Link
                        component={RouterLink}
                        to={res.path}
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
                        {res.label}
                      </Link>
                      {idx < arr.length - 1 && (
                        <Typography component="span" sx={{ color: '#CBD5E1', fontSize: '13px', userSelect: 'none' }}>
                          ·
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>

                {/* Footer Row: Count Indicator & Action Button */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2,
                    pt: 2.5,
                    borderTop: '1px solid #EEEEEE'
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Open Sans', sans-serif",
                      color: '#64748B',
                      fontSize: '13px'
                    }}
                  >
                    Showing {Math.min(activeMeta.posts.length, 4)} prioritized exams out of{' '}
                    {activeCategory.jobCount || activeMeta.posts.length} total drives
                  </Typography>

                  <Button
                    component={RouterLink}
                    to={`/jobs?categorySlug=${activeCategory.slug}`}
                    variant="contained"
                    endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      bgcolor: '#0d3b66',
                      color: '#FFFFFF',
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: '13px',
                      borderRadius: '4px',
                      px: 2.5,
                      py: 0.9,
                      textTransform: 'none',
                      boxShadow: 'none',
                      '&:hover': {
                        bgcolor: '#0f2a4a',
                        boxShadow: 'none'
                      }
                    }}
                  >
                    Explore All Drives
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Container>
  );
};
