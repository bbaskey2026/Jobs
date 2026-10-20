import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Stack,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  InputBase,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  NotificationsOutlined as NotificationsIcon,
  BookmarkBorder as BookmarkIcon,
  AccountCircleOutlined as AccountCircle,
  DashboardOutlined as DashboardIcon,
  AdminPanelSettingsOutlined as AdminIcon,
  LogoutOutlined as LogoutIcon,
  AddAlertOutlined as AlertIcon,
  KeyboardArrowDown as ArrowDownIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store.js';
import { UserRole } from '@jobpulse/shared';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [categoryAnchorEl, setCategoryAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { label: 'Government Jobs', path: '/government-jobs' },
    { label: 'Private Jobs', path: '/private-jobs' },
    { label: 'State Jobs', path: '/state-jobs' },
    { label: 'Latest Jobs', path: '/jobs' }
  ];

  const categoryItems = [
    { label: 'All Categories', path: '/categories' },
    { label: 'Civil & Administrative (UPSC/PSC)', path: '/jobs?sector=UPSC_STATE_PSC' },
    { label: 'Staff Selection (SSC)', path: '/jobs?sector=SSC' },
    { label: 'Banking & Financial Institutions', path: '/jobs?sector=BANKING_INSURANCE' },
    { label: 'Railways Recruitment (RRB)', path: '/jobs?sector=RAILWAYS' },
    { label: 'Defence & Police Services', path: '/jobs?sector=DEFENCE_PARAMILITARY' },
    { label: 'Public Sector Undertakings (PSUs)', path: '/jobs?sector=PSU' },
    { label: 'Teaching & Faculty', path: '/jobs?sector=TEACHING_EDUCATION' },
    { label: 'Healthcare & Public Medical', path: '/jobs?sector=HEALTHCARE_PUBLIC' },
    { label: 'IT & Software Engineering', path: '/private-jobs' }
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: '#FFFFFF',
        color: '#0F2A4A',
        borderBottom: '1px solid #E2E8F0',
        zIndex: 1100
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 64, sm: 70 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          {/* Left section: Hamburger (mobile) + Brand Logo with Two-Petal Emblem */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2.5 }, flexShrink: 0 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: 'none' }, color: '#0F2A4A', p: 0.5 }}
            >
              <MenuIcon />
            </IconButton>

            {/* Brand Logo matching the design */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                textDecoration: 'none',
                color: 'inherit',
                py: 0.5
              }}
            >
              {/* Dual-petal Brand Mark */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 38,
                  height: 38,
                  flexShrink: 0
                }}
              >
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Left vibrant orange droplet */}
                  <path
                    d="M10 24C10 27.3137 12.6863 30 16 30C19.3137 30 22 27.3137 22 24C22 19 14 11 14 11C14 11 10 19 10 24Z"
                    fill="#FF7A00"
                  />
                  {/* Right navy blue droplet overlapping */}
                  <path
                    d="M26 18C26 21.3137 23.3137 24 20 24C16.6863 24 14 21.3137 14 18C14 13 22 6 22 6C22 6 26 13 26 18Z"
                    fill="#0F2A4A"
                  />
                </svg>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                  sx={{
                    fontFamily: "'Roboto', 'Inter', sans-serif",
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    color: '#0F2A4A',
                    fontSize: { xs: '1.25rem', sm: '1.45rem' },
                    lineHeight: 1
                  }}
                >
                  JOBPULSE
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Noto Sans Devanagari', 'Open Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: '11px',
                    color: '#64748B',
                    lineHeight: 1.2,
                    mt: 0.35,
                    letterSpacing: '0.2px'
                  }}
                >
                  रोजगार सूचना पोर्टल
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Center: Global Search Bar in Header */}
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              display: { xs: 'none', lg: 'flex' },
              alignItems: 'center',
              bgcolor: '#F8FAFC',
              borderRadius: '24px',
              px: 2,
              py: 0.6,
              width: { md: 280, lg: 380, xl: 440 },
              border: '1px solid #E2E8F0',
              transition: 'all 0.2s ease',
              '&:focus-within': {
                bgcolor: '#FFFFFF',
                borderColor: '#1D6EE5',
                boxShadow: '0 0 0 3px rgba(29, 110, 229, 0.12)'
              }
            }}
          >
            <SearchIcon sx={{ color: '#94A3B8', fontSize: 18, mr: 1.25 }} />
            <InputBase
              placeholder="Search jobs, exams, departments or qualifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                fontSize: '0.84rem',
                color: '#0F2A4A',
                width: '100%',
                '& input::placeholder': {
                  color: '#94A3B8',
                  opacity: 1
                }
              }}
            />
            <Chip
              label="Ctrl + K"
              size="small"
              sx={{
                height: 20,
                fontSize: '10px',
                fontWeight: 600,
                bgcolor: '#FFFFFF',
                color: '#94A3B8',
                border: '1px solid #E2E8F0',
                borderRadius: '4px',
                px: 0.25,
                cursor: 'default'
              }}
            />
          </Box>

          {/* Right: Nav Links + Categories Dropdown + Auth Profile Avatar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Desktop Navigation Links */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
              {navLinks.map((link) => {
                const isActive =
                  location.pathname === link.path ||
                  (link.path === '/government-jobs' && location.pathname === '/');
                return (
                  <Box
                    key={link.path}
                    component={RouterLink}
                    to={link.path}
                    sx={{
                      fontFamily: "'Roboto', 'Inter', sans-serif",
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#0F2A4A' : '#475569',
                      textDecoration: 'none',
                      px: 1.5,
                      py: 1,
                      position: 'relative',
                      display: 'inline-flex',
                      alignItems: 'center',
                      borderRadius: '6px',
                      transition: 'all 0.15s ease',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -12,
                        left: 12,
                        right: 12,
                        height: 3,
                        bgcolor: isActive ? '#FF7A00' : 'transparent',
                        borderRadius: '3px 3px 0 0',
                        transition: 'background-color 0.2s ease'
                      },
                      '&:hover': {
                        color: '#0F2A4A',
                        bgcolor: '#F8FAFC'
                      }
                    }}
                  >
                    {link.label}
                  </Box>
                );
              })}

              {/* Categories Dropdown button */}
              <Button
                endIcon={<ArrowDownIcon sx={{ fontSize: '16px !important' }} />}
                onClick={(e) => setCategoryAnchorEl(e.currentTarget)}
                sx={{
                  fontFamily: "'Roboto', 'Inter', sans-serif",
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#475569',
                  textTransform: 'none',
                  px: 1.5,
                  py: 1,
                  borderRadius: '6px',
                  '&:hover': { color: '#0F2A4A', bgcolor: '#F8FAFC' }
                }}
              >
                Categories
              </Button>

              <Menu
                anchorEl={categoryAnchorEl}
                open={Boolean(categoryAnchorEl)}
                onClose={() => setCategoryAnchorEl(null)}
                PaperProps={{
                  sx: {
                    borderRadius: '10px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    border: '1px solid #E2E8F0',
                    minWidth: 260,
                    mt: 1
                  }
                }}
              >
                {categoryItems.map((cat) => (
                  <MenuItem
                    key={cat.label}
                    component={RouterLink}
                    to={cat.path}
                    onClick={() => setCategoryAnchorEl(null)}
                    sx={{
                      fontSize: '0.84rem',
                      fontWeight: 500,
                      color: '#1E293B',
                      py: 1,
                      '&:hover': { bgcolor: '#F1F5F9', color: '#1D6EE5' }
                    }}
                  >
                    {cat.label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Profile Avatar / Auth actions */}
            <Box sx={{ ml: { xs: 1, sm: 2 } }}>
              {isAuthenticated ? (
                <>
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{
                      p: 0.5,
                      border: '1.5px solid #CBD5E1',
                      borderRadius: '50%',
                      '&:hover': { borderColor: '#1D6EE5' }
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: '#EFF6FF',
                        color: '#1D6EE5',
                        fontSize: '0.85rem',
                        fontWeight: 700
                      }}
                    >
                      {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      sx: {
                        borderRadius: '10px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                        border: '1px solid #E2E8F0',
                        minWidth: 220,
                        mt: 1
                      }
                    }}
                  >
                    <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #F1F5F9' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F2A4A' }}>
                        {user?.fullName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>
                        {user?.email}
                      </Typography>
                    </Box>

                    {user?.role === UserRole.ADMIN && (
                      <MenuItem component={RouterLink} to="/admin" onClick={handleMenuClose}>
                        <AdminIcon sx={{ fontSize: 18, mr: 1.5, color: '#1D6EE5' }} />
                        Admin Console
                      </MenuItem>
                    )}

                    <MenuItem component={RouterLink} to="/dashboard" onClick={handleMenuClose}>
                      <DashboardIcon sx={{ fontSize: 18, mr: 1.5, color: '#64748B' }} />
                      My Dashboard
                    </MenuItem>

                    <MenuItem component={RouterLink} to="/dashboard/bookmarks" onClick={handleMenuClose}>
                      <BookmarkIcon sx={{ fontSize: 18, mr: 1.5, color: '#64748B' }} />
                      Saved Vacancies
                    </MenuItem>

                    <MenuItem component={RouterLink} to="/dashboard/alerts" onClick={handleMenuClose}>
                      <AlertIcon sx={{ fontSize: 18, mr: 1.5, color: '#64748B' }} />
                      Job Alerts
                    </MenuItem>

                    <Divider sx={{ my: 0.5 }} />

                    <MenuItem onClick={handleLogout} sx={{ color: '#DC2626' }}>
                      <LogoutIcon sx={{ fontSize: 18, mr: 1.5 }} />
                      Sign Out
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Stack direction="row" spacing={1}>
                  <IconButton
                    component={RouterLink}
                    to="/login"
                    sx={{
                      p: 0.75,
                      border: '1.5px solid #CBD5E1',
                      borderRadius: '50%',
                      color: '#475569',
                      '&:hover': { borderColor: '#1D6EE5', color: '#1D6EE5', bgcolor: '#F0F7FF' }
                    }}
                  >
                    <AccountCircle sx={{ fontSize: 24 }} />
                  </IconButton>
                </Stack>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 280, p: 2.5, bgcolor: '#FFFFFF', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
            <Box sx={{ width: 32, height: 32 }}>
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                <path d="M10 24C10 27.3137 12.6863 30 16 30C19.3137 30 22 27.3137 22 24C22 19 14 11 14 11C14 11 10 19 10 24Z" fill="#FF7A00" />
                <path d="M26 18C26 21.3137 23.3137 24 20 24C16.6863 24 14 21.3137 14 18C14 13 22 6 22 6C22 6 26 13 26 18Z" fill="#0F2A4A" />
              </svg>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 900, color: '#0F2A4A', fontSize: '1.2rem', lineHeight: 1 }}>
                JOBPULSE
              </Typography>
              <Typography sx={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>
                रोजगार सूचना पोर्टल
              </Typography>
            </Box>
          </Box>

          <Box component="form" onSubmit={(e) => { handleSearchSubmit(e); setMobileOpen(false); }} sx={{ mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#F8FAFC',
                borderRadius: '20px',
                px: 1.5,
                py: 0.5,
                border: '1px solid #E2E8F0'
              }}
            >
              <SearchIcon sx={{ color: '#94A3B8', fontSize: 18, mr: 1 }} />
              <InputBase
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ fontSize: '0.85rem', width: '100%' }}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <List>
            {navLinks.map((link) => (
              <ListItem key={link.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={RouterLink}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  sx={{ borderRadius: '6px' }}
                >
                  <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: 600, fontSize: '14px' }} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={RouterLink}
                to="/categories"
                onClick={() => setMobileOpen(false)}
                sx={{ borderRadius: '6px' }}
              >
                <ListItemText primary="All Job Categories" primaryTypographyProps={{ fontWeight: 600, fontSize: '14px' }} />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to={isAuthenticated ? '/dashboard/alerts' : '/login'}
                onClick={() => setMobileOpen(false)}
                sx={{ borderRadius: '6px', color: '#1D6EE5', bgcolor: '#EFF6FF' }}
              >
                <ListItemText primary="Get Free Job Alerts" primaryTypographyProps={{ fontWeight: 700, fontSize: '14px' }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};
