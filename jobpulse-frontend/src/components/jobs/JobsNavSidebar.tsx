import React from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import {
  AccountBalance as CentralGovIcon,
  LocationCity as StateGovIcon,
  Assignment as SscIcon,
  AccountBalanceWallet as BankIcon,
  Train as RailwayIcon,
  Security as DefenceIcon,
  Business as PsuIcon,
  School as TeachingIcon,
  Computer as TechIcon,
  WorkOutline as CorporateIcon,
  ConfirmationNumberOutlined as AdmitCardIcon,
  AssignmentTurnedInOutlined as ResultIcon,
  VpnKeyOutlined as KeyIcon,
  MenuBookOutlined as SyllabusIcon,
  HistoryEduOutlined as PaperIcon,
  HowToRegOutlined as OtrIcon,
  LocationOnOutlined as StateIcon,
  RestartAlt as ResetIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { JobSector } from '@jobpulse/shared';

interface JobsNavSidebarProps {
  currentSector?: string;
  currentQualification?: string;
  currentKeyword?: string;
  onSelectSector: (sector: string) => void;
  onSelectQualification: (qualification: string) => void;
  onSelectKeyword: (keyword: string) => void;
  onResetAll: () => void;
}

export const JobsNavSidebar: React.FC<JobsNavSidebarProps> = ({
  currentSector,
  currentQualification,
  currentKeyword,
  onSelectSector,
  onSelectQualification,
  onSelectKeyword,
  onResetAll
}) => {
  const isAnyFilterActive = Boolean(currentSector || currentQualification || currentKeyword);

  const postTypes = [
    { label: 'Central Government', sector: JobSector.CENTRAL_GOVERNMENT, icon: CentralGovIcon },
    { label: 'State Government / PSC', sector: JobSector.STATE_GOVERNMENT, icon: StateGovIcon },
    { label: 'Staff Selection (SSC)', sector: JobSector.SSC, icon: SscIcon },
    { label: 'Banking & Insurance', sector: JobSector.BANKING_INSURANCE, icon: BankIcon },
    { label: 'Railways (RRB)', sector: JobSector.RAILWAYS, icon: RailwayIcon },
    { label: 'Defence & Police', sector: JobSector.DEFENCE_PARAMILITARY, icon: DefenceIcon },
    { label: 'Public Sector (PSU)', sector: JobSector.PSU, icon: PsuIcon },
    { label: 'Teaching & Education', sector: JobSector.TEACHING_EDUCATION, icon: TeachingIcon },
    { label: 'Private IT & Tech', sector: JobSector.PRIVATE_IT, icon: TechIcon },
    { label: 'Private Corporate & Finance', sector: JobSector.PRIVATE_FINANCE, icon: CorporateIcon }
  ];

  const categories = [
    { label: '10th / Matric Pass', value: '10th' },
    { label: '12th / Intermediate', value: '12th' },
    { label: 'Graduate / Any Degree', value: 'Graduate' },
    { label: 'Post Graduate (PG / Master)', value: 'Post Graduate' },
    { label: 'Engineering (B.E / B.Tech)', value: 'B.Tech' },
    { label: 'Diploma & Polytechnic', value: 'Diploma' },
    { label: 'Medical & Healthcare', value: 'MBBS' },
    { label: 'Law & Judicial Services', value: 'LLB' }
  ];

  const quickLinks = [
    { title: 'Admit Cards & Hall Tickets', keyword: 'Admit Card', icon: AdmitCardIcon, path: '/jobs?q=Admit+Card' },
    { title: 'Exam Results & Merit Lists', keyword: 'Result', icon: ResultIcon, path: '/jobs?q=Result' },
    { title: 'Official Answer Keys', keyword: 'Answer Key', icon: KeyIcon, path: '/jobs?q=Answer+Key' },
    { title: 'Syllabus & Exam Pattern', keyword: 'Syllabus', icon: SyllabusIcon, path: '/jobs?q=Syllabus' },
    { title: 'Previous Solved Papers', keyword: 'Previous Paper', icon: PaperIcon, path: '/jobs?q=Previous+Paper' },
    { title: 'One-Time Registration (OTR)', keyword: 'OTR', icon: OtrIcon, path: '/jobs?q=OTR' },
    { title: 'State-Wise Jobs (36 States)', path: '/state-jobs', icon: StateIcon }
  ];

  return (
    <Box
      sx={{
        width: '100%',
        color: '#222222',
        fontFamily: "'Open Sans', sans-serif"
      }}
    >
      {/* Sidebar Header & Clear Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            color: '#0d3b66'
          }}
        >
          Quick Navigation
        </Typography>
        {isAnyFilterActive && (
          <Button
            size="small"
            startIcon={<ResetIcon sx={{ fontSize: 13 }} />}
            onClick={onResetAll}
            sx={{
              p: 0,
              minWidth: 'auto',
              color: '#EF4444',
              fontFamily: "'Open Sans', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
            }}
          >
            Clear Filter
          </Button>
        )}
      </Box>

      {/* SECTION 1: Types of Post / Classification */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            color: '#555555',
            mb: 1
          }}
        >
          Types of Post
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          {postTypes.map((pt) => {
            const Icon = pt.icon;
            const isSelected = currentSector === pt.sector;
            return (
              <Box
                key={pt.label}
                onClick={() => onSelectSector(isSelected ? '' : pt.sector)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  py: 0.7,
                  px: 1,
                  cursor: 'pointer',
                  borderLeft: isSelected ? '3px solid #0d3b66' : '3px solid transparent',
                  bgcolor: isSelected ? 'rgba(13, 59, 102, 0.08)' : 'transparent',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: isSelected ? 'rgba(13, 59, 102, 0.08)' : 'rgba(13, 59, 102, 0.04)',
                    '& .nav-label': { color: '#0d3b66' }
                  }
                }}
              >
                <Icon sx={{ fontSize: 16, color: isSelected ? '#0d3b66' : '#555555', flexShrink: 0 }} />
                <Typography
                  className="nav-label"
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: '13px',
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? '#0d3b66' : '#222222',
                    lineHeight: 1.3
                  }}
                >
                  {pt.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Divider sx={{ my: 2.5, borderColor: '#E6E6E6' }} />

      {/* SECTION 2: Category / Qualifications */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            color: '#555555',
            mb: 1
          }}
        >
          Jobs by Category & Qualification
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          {categories.map((cat) => {
            const isSelected = currentQualification === cat.value;
            return (
              <Box
                key={cat.label}
                onClick={() => onSelectQualification(isSelected ? '' : cat.value)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 0.7,
                  px: 1,
                  cursor: 'pointer',
                  borderLeft: isSelected ? '3px solid #0d3b66' : '3px solid transparent',
                  bgcolor: isSelected ? 'rgba(13, 59, 102, 0.08)' : 'transparent',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: isSelected ? 'rgba(13, 59, 102, 0.08)' : 'rgba(13, 59, 102, 0.04)',
                    '& .cat-label': { color: '#0d3b66' }
                  }
                }}
              >
                <Typography
                  className="cat-label"
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: '13px',
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? '#0d3b66' : '#222222',
                    lineHeight: 1.3
                  }}
                >
                  {cat.label}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '11px',
                    color: isSelected ? '#0d3b66' : '#888888',
                    fontWeight: isSelected ? 700 : 400
                  }}
                >
                  →
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Divider sx={{ my: 2.5, borderColor: '#E6E6E6' }} />

      {/* SECTION 3: Quick Jobs Links & Official Gazettes */}
      <Box sx={{ mb: 2 }}>
        <Typography
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            color: '#555555',
            mb: 1
          }}
        >
          Quick Jobs Links
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          {quickLinks.map((ql) => {
            const Icon = ql.icon;
            const isSelected = ql.keyword && currentKeyword === ql.keyword;

            if (ql.path && !ql.keyword) {
              return (
                <Box
                  key={ql.title}
                  component={RouterLink}
                  to={ql.path}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    py: 0.7,
                    px: 1,
                    textDecoration: 'none',
                    borderLeft: '3px solid transparent',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      bgcolor: 'rgba(13, 59, 102, 0.04)',
                      '& .ql-label': { color: '#0d3b66' }
                    }
                  }}
                >
                  <Icon sx={{ fontSize: 16, color: '#0d3b66', flexShrink: 0 }} />
                  <Typography
                    className="ql-label"
                    sx={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0d3b66',
                      lineHeight: 1.3
                    }}
                  >
                    {ql.title}
                  </Typography>
                </Box>
              );
            }

            return (
              <Box
                key={ql.title}
                onClick={() => ql.keyword && onSelectKeyword(isSelected ? '' : ql.keyword)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  py: 0.7,
                  px: 1,
                  cursor: 'pointer',
                  borderLeft: isSelected ? '3px solid #0d3b66' : '3px solid transparent',
                  bgcolor: isSelected ? 'rgba(13, 59, 102, 0.08)' : 'transparent',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: isSelected ? 'rgba(13, 59, 102, 0.08)' : 'rgba(13, 59, 102, 0.04)',
                    '& .ql-label': { color: '#0d3b66' }
                  }
                }}
              >
                <Icon sx={{ fontSize: 16, color: isSelected ? '#0d3b66' : '#555555', flexShrink: 0 }} />
                <Typography
                  className="ql-label"
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: '13px',
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? '#0d3b66' : '#222222',
                    lineHeight: 1.3
                  }}
                >
                  {ql.title}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
