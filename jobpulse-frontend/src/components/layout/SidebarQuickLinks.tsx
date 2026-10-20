import React from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemText, Chip } from '@mui/material';
import {
  ConfirmationNumberOutlined as AdmitCardIcon,
  AssignmentTurnedInOutlined as ResultIcon,
  VpnKeyOutlined as KeyIcon,
  MenuBookOutlined as SyllabusIcon,
  HistoryEduOutlined as PaperIcon,
  HowToRegOutlined as OtrIcon,
  LocationOnOutlined as StateIcon,
  ArrowForwardIos as ArrowIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

interface QuickLinkItem {
  title: string;
  subtitle: string;
  badge: string;
  badgeColor?: string;
  path: string;
  icon: React.ElementType;
}

const QUICK_LINKS: QuickLinkItem[] = [
  {
    title: 'Admit Cards & Hall Tickets',
    subtitle: 'Direct examination entry passes',
    badge: 'Admit Card',
    badgeColor: '#EF4444',
    path: '/jobs?q=Admit+Card',
    icon: AdmitCardIcon
  },
  {
    title: 'Exam Results & Merit Lists',
    subtitle: 'Selection lists & final cut-offs',
    badge: 'Results',
    badgeColor: '#10B981',
    path: '/jobs?q=Result',
    icon: ResultIcon
  },
  {
    title: 'Official Answer Keys',
    subtitle: 'Provisional & final answer sheets',
    badge: 'Key',
    badgeColor: '#F59E0B',
    path: '/jobs?q=Answer+Key',
    icon: KeyIcon
  },
  {
    title: 'Syllabus & Exam Pattern',
    subtitle: 'Curriculum & marking scheme',
    badge: 'Syllabus',
    badgeColor: '#6366F1',
    path: '/jobs?q=Syllabus',
    icon: SyllabusIcon
  },
  {
    title: 'Previous Question Papers',
    subtitle: 'Archived tests & solved solutions',
    badge: 'Papers',
    badgeColor: '#8B5CF6',
    path: '/jobs?q=Previous+Paper',
    icon: PaperIcon
  },
  {
    title: 'One Time Registration (OTR)',
    subtitle: 'UPSC, SSC & State commission OTR',
    badge: 'OTR',
    badgeColor: '#06B6D4',
    path: '/jobs?q=OTR',
    icon: OtrIcon
  },
  {
    title: 'State-Wise Jobs Directory',
    subtitle: 'All post types for all 36 States & UTs',
    badge: '36 States',
    badgeColor: '#2563EB',
    path: '/state-jobs',
    icon: StateIcon
  }
];

export const SidebarQuickLinks: React.FC = () => {
  return (
    <Box sx={{ mb: 4.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: '13px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            color: '#0d3b66'
          }}
        >
          Quick Links & Resources
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Open Sans', sans-serif",
            color: '#0d3b66',
            fontWeight: 700,
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          Official Gazettes
        </Typography>
      </Box>

      <Typography variant="caption" sx={{ color: '#6B6B6B', display: 'block', mb: 1.5, lineHeight: 1.4 }}>
        Direct links to download admit cards, check results, verify answer keys, and syllabus.
      </Typography>

      <List disablePadding sx={{ bgcolor: 'transparent' }}>
        {QUICK_LINKS.map((item, index) => {
          const IconComponent = item.icon;
          const isLast = index === QUICK_LINKS.length - 1;

          return (
            <ListItem
              key={item.title}
              disablePadding
              sx={{
                borderBottom: isLast ? 'none' : '1px solid #F0F0F0',
                transition: 'background-color 0.15s ease'
              }}
            >
              <ListItemButton
                component={RouterLink}
                to={item.path}
                sx={{
                  py: 1,
                  px: 0.5,
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: '#F9FAFB',
                    '& .arrow-icon': {
                      transform: 'translateX(3px)',
                      color: '#2563EB'
                    }
                  }
                }}
              >
                <IconComponent sx={{ fontSize: 18, color: '#2563EB', mr: 1.5, flexShrink: 0 }} />
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: '#242424',
                          fontSize: '0.8125rem',
                          lineHeight: 1.3
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: '0.625rem',
                          fontWeight: 700,
                          bgcolor: `${item.badgeColor}15`,
                          color: item.badgeColor,
                          border: `1px solid ${item.badgeColor}30`,
                          px: 0.25
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#6B6B6B',
                        fontSize: '0.7rem',
                        display: 'block',
                        mt: 0.25
                      }}
                    >
                      {item.subtitle}
                    </Typography>
                  }
                />
                <ArrowIcon
                  className="arrow-icon"
                  sx={{
                    fontSize: 10,
                    color: '#9CA3AF',
                    ml: 1,
                    transition: 'transform 0.15s ease, color 0.15s ease'
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};
