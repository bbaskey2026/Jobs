import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
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
  InputBase
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
  AddAlertOutlined as AlertIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store.js';
import { UserRole } from '@jobpulse/shared';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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
    { label: 'Latest Jobs', path: '/jobs' },
    { label: 'Categories', path: '/categories' }
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: '#FFFFFF',
        color: '#242424',
        borderBottom: '1px solid #E6E6E6',
        zIndex: 1100
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Toolbar disableGutters sx={{ minHeight: { xs: 56, sm: 60 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Left section: Hamburger (mobile) + Brand Logo + Header Search */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2.5 } }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: 'none' }, color: '#242424', p: 0.5 }}
            >
              <MenuIcon />
            </IconButton>

            {/* Medium-style JobPulse Wordmark */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'baseline',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Manrope", sans-serif',
                  fontWeight: 800,
                  color: '#000000',
                  letterSpacing: '-0.04em',
                  fontSize: { xs: '1.25rem', sm: '1.4rem' },
                  lineHeight: 1
                }}
              >
                JobPulse
              </Typography>
              <Box
                component="span"
                sx={{
                  width: 6,
                  height: 6,
                  bgcolor: '#2563EB',
                  borderRadius: '50%',
                  display: 'inline-block',
                  ml: 0.5
                }}
              />
            </Box>

            {/* Medium-style Search Input in Header */}
            <Box
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                bgcolor: '#F7F7F7',
                borderRadius: 20,
                px: 1.75,
                py: 0.5,
                width: { sm: 200, md: 260 },
                border: '1px solid transparent',
                transition: 'all 0.2s ease',
                '&:focus-within': {
                  bgcolor: '#FFFFFF',
                  borderColor: '#2563EB',
                  width: { sm: 240, md: 300 }
                }
              }}
            >
              <SearchIcon sx={{ color: '#6B6B6B', fontSize: 18, mr: 1 }} />
              <InputBase
                placeholder="Search jobs, agencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  fontSize: '0.84rem',
                  color: '#242424',
                  width: '100%',
                  '& input::placeholder': {
                    color: '#6B6B6B',
                    opacity: 1
                  }
                }}
              />
            </Box>
          </Box>

          {/* Middle/Right Nav Links (Desktop) */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {navLinks.map((link) => (
              <Button
                key={link.path}
                component={RouterLink}
                to={link.path}
                sx={{
                  color: '#6B6B6B',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 20,
                  '&:hover': {
                    color: '#242424',
                    bgcolor: '#F7F7F7'
                  }
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          {/* Right Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
            {/* Quick alert action */}
            <Button
              component={RouterLink}
              to={isAuthenticated ? '/dashboard/alerts' : '/login'}
              startIcon={<AlertIcon sx={{ fontSize: 17 }} />}
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                color: '#2563EB',
                bgcolor: '#EFF6FF',
                fontSize: '0.8125rem',
                fontWeight: 600,
                px: 1.75,
                py: 0.6,
                borderRadius: 20,
                border: '1px solid transparent',
                '&:hover': {
                  bgcolor: '#DBEAFE',
                  borderColor: '#BFDBFE'
                }
              }}
            >
              Get Alerts
            </Button>

            {isAuthenticated ? (
              <>
                <IconButton
                  component={RouterLink}
                  to="/dashboard/bookmarks"
                  title="Saved Jobs"
                  size="small"
                  sx={{ color: '#6B6B6B', '&:hover': { color: '#242424', bgcolor: '#F7F7F7' } }}
                >
                  <BookmarkIcon fontSize="small" />
                </IconButton>

                <IconButton
                  component={RouterLink}
                  to="/dashboard/notifications"
                  title="Notifications"
                  size="small"
                  sx={{ color: '#6B6B6B', '&:hover': { color: '#242424', bgcolor: '#F7F7F7' } }}
                >
                  <Badge sx={{ '& .MuiBadge-badge': { bgcolor: '#2563EB', color: '#fff' } }} variant="dot">
                    <NotificationsIcon fontSize="small" />
                  </Badge>
                </IconButton>

                <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0.25, ml: 0.5 }}>
                  <Avatar sx={{ bgcolor: '#242424', width: 32, height: 32, fontSize: '0.8125rem', fontWeight: 600 }}>
                    {user?.fullName?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 210,
                      borderRadius: 2,
                      border: '1px solid #E6E6E6',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                    }
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#000000' }}>
                      {user?.fullName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6B6B6B', display: 'block' }}>
                      {user?.email}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: '#E6E6E6' }} />
                  <MenuItem component={RouterLink} to="/dashboard" onClick={handleMenuClose} sx={{ py: 1, color: '#242424', fontSize: '0.875rem' }}>
                    <DashboardIcon sx={{ mr: 1.5, fontSize: 18, color: '#6B6B6B' }} /> Candidate Dashboard
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/dashboard/profile" onClick={handleMenuClose} sx={{ py: 1, color: '#242424', fontSize: '0.875rem' }}>
                    <AccountCircle sx={{ mr: 1.5, fontSize: 18, color: '#6B6B6B' }} /> Profile & Resume
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/dashboard/alerts" onClick={handleMenuClose} sx={{ py: 1, color: '#242424', fontSize: '0.875rem' }}>
                    <AlertIcon sx={{ mr: 1.5, fontSize: 18, color: '#6B6B6B' }} /> Job Alert Settings
                  </MenuItem>

                  {(user?.role === UserRole.ADMIN || user?.role === UserRole.MODERATOR) && (
                    <MenuItem component={RouterLink} to="/admin" onClick={handleMenuClose} sx={{ py: 1, color: '#2563EB', fontWeight: 600, fontSize: '0.875rem' }}>
                      <AdminIcon sx={{ mr: 1.5, fontSize: 18, color: '#2563EB' }} /> Admin Dashboard
                    </MenuItem>
                  )}

                  <Divider sx={{ borderColor: '#E6E6E6' }} />
                  <MenuItem onClick={handleLogout} sx={{ py: 1, color: '#242424', fontSize: '0.875rem' }}>
                    <LogoutIcon sx={{ mr: 1.5, fontSize: 18, color: '#6B6B6B' }} /> Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: '#242424',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    px: 1.5,
                    py: 0.6,
                    borderRadius: 20,
                    '&:hover': { bgcolor: '#F7F7F7', color: '#2563EB' }
                  }}
                >
                  Sign In
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  sx={{
                    bgcolor: '#2563EB',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.84rem',
                    px: 2,
                    py: 0.6,
                    borderRadius: 20,
                    '&:hover': { bgcolor: '#1D4ED8' }
                  }}
                >
                  Get Started
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 280, p: 2.5, bgcolor: '#FFFFFF', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#000000', letterSpacing: '-0.03em' }}>
              JobPulse
            </Typography>
            <Box sx={{ width: 6, height: 6, bgcolor: '#2563EB', borderRadius: '50%', ml: 0.5 }} />
          </Box>
          <Box component="form" onSubmit={(e) => { handleSearchSubmit(e); setMobileOpen(false); }} sx={{ mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#F7F7F7',
                borderRadius: 20,
                px: 1.5,
                py: 0.5,
                border: '1px solid #E6E6E6'
              }}
            >
              <SearchIcon sx={{ color: '#6B6B6B', fontSize: 18, mr: 1 }} />
              <InputBase
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ fontSize: '0.85rem', width: '100%' }}
              />
            </Box>
          </Box>
          <Divider sx={{ mb: 2, borderColor: '#E6E6E6' }} />
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={RouterLink}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    borderRadius: 2,
                    color: '#242424',
                    '&:hover': { bgcolor: '#F7F7F7', color: '#2563EB' }
                  }}
                >
                  <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding sx={{ mt: 1 }}>
              <ListItemButton
                component={RouterLink}
                to="/dashboard/alerts"
                onClick={() => setMobileOpen(false)}
                sx={{ borderRadius: 2, color: '#2563EB', bgcolor: '#EFF6FF' }}
              >
                <ListItemText primary="Get Job Alerts" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};
