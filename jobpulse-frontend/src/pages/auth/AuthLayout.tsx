import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Tooltip
} from '@mui/material';
import {
  Chat as ChatIcon,
  PhoneInTalk as PhoneIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  const location = useLocation();
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackName, setCallbackName] = useState('');
  const [submittedSnackbar, setSubmittedSnackbar] = useState(false);

  const isRegister = location.pathname.includes('register');

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCallbackOpen(false);
    setSubmittedSnackbar(true);
    setCallbackPhone('');
    setCallbackName('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#EAF3FB',
        background: 'linear-gradient(135deg, #EAF4FD 0%, #F1F7FE 45%, #E6F1FB 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      {/* Top Minimal Navigation Bar */}
      <Box
        component="header"
        sx={{
          py: 1.75,
          px: { xs: 2, sm: 4, md: 6 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(210, 227, 244, 0.6)',
          backdropFilter: 'blur(8px)',
          bgcolor: 'rgba(255, 255, 255, 0.4)',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}
      >
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.25,
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          {/* Logo Icon matching Tracxn style */}
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: '#0F2A4A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(15, 42, 74, 0.15)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#38BDF8" strokeWidth="2.5" />
              <path d="M7 12H10L12 8L14 16L16 12H17" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            <Typography
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 800,
                color: '#0F2A4A',
                fontSize: '1.35rem',
                letterSpacing: '-0.02em',
                lineHeight: 1
              }}
            >
              JobPulse
            </Typography>
            <Box component="span" sx={{ width: 5, height: 5, bgcolor: '#2563EB', borderRadius: '50%', ml: 0.5 }} />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            component={RouterLink}
            to="/"
            startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
            sx={{
              color: '#475569',
              fontSize: '0.825rem',
              fontWeight: 500,
              textTransform: 'none',
              display: { xs: 'none', sm: 'inline-flex' },
              '&:hover': { color: '#0F2A4A', bgcolor: 'rgba(255,255,255,0.6)' }
            }}
          >
            Back to Jobs
          </Button>

          <Button
            component={RouterLink}
            to={isRegister ? '/login' : '/register'}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 20,
              px: 2,
              py: 0.5,
              borderColor: '#BFDBFE',
              color: '#1D6EE5',
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.825rem',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#1D6EE5',
                bgcolor: '#FFFFFF'
              }
            }}
          >
            {isRegister ? 'Sign In' : 'Create Free Account'}
          </Button>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </Box>

      {/* Floating Bottom Left Security / Privacy Badge */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          zIndex: 30,
          display: { xs: 'none', sm: 'flex' },
          alignItems: 'center',
          gap: 1,
          bgcolor: '#FFFFFF',
          px: 1.5,
          py: 0.75,
          borderRadius: 20,
          border: '1px solid #D1E4F5',
          boxShadow: '0 4px 14px rgba(15, 42, 74, 0.08)'
        }}
      >
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            bgcolor: '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563EB'
          }}
        >
          <SecurityIcon sx={{ fontSize: 15 }} />
        </Box>
        <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, fontSize: '0.75rem' }}>
          256-bit SSL Encrypted • 100% Free
        </Typography>
      </Box>

      {/* Right Docked Vertical "Request Callback" Tab (Identical to Tracxn UI) */}
      <Box
        onClick={() => setCallbackOpen(true)}
        sx={{
          position: 'fixed',
          top: '45%',
          right: 0,
          transform: 'translateY(-50%)',
          zIndex: 50,
          bgcolor: '#FFFFFF',
          border: '1px solid #BFDBFE',
          borderRight: 'none',
          borderRadius: '8px 0 0 8px',
          boxShadow: '-4px 4px 16px rgba(15, 42, 74, 0.1)',
          cursor: 'pointer',
          px: 0.75,
          py: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.75,
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: '#F0F7FF',
            px: 1
          }
        }}
      >
        <PhoneIcon sx={{ fontSize: 16, color: '#1D6EE5' }} />
        <Typography
          sx={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#1D6EE5',
            letterSpacing: '0.5px'
          }}
        >
          Request Callback
        </Typography>
      </Box>

      {/* Floating Bottom Right Chat Bubble (Identical to Tracxn UI) */}
      <Tooltip title="Need help? Talk to our support desk" placement="left">
        <IconButton
          onClick={() => setChatOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 50,
            width: 52,
            height: 52,
            bgcolor: '#1E293B',
            color: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.3)',
            '&:hover': {
              bgcolor: '#0F172A',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          <ChatIcon sx={{ fontSize: 24 }} />
        </IconButton>
      </Tooltip>

      {/* Request Callback Modal */}
      <Dialog
        open={callbackOpen}
        onClose={() => setCallbackOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F2A4A' }}>
            Request Instant Callback
          </Typography>
          <IconButton size="small" onClick={() => setCallbackOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={handleCallbackSubmit}>
          <DialogContent sx={{ pt: 1 }}>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
              Have questions about JobPulse plans, recruiter access, or job notifications? Leave your phone number and our team will call you within 15 minutes.
            </Typography>
            <TextField
              fullWidth
              label="Your Name"
              required
              value={callbackName}
              onChange={(e) => setCallbackName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Mobile Number"
              placeholder="e.g. 9876543210"
              required
              value={callbackPhone}
              onChange={(e) => setCallbackPhone(e.target.value)}
              helperText="Available Monday to Saturday, 9am - 7pm IST"
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setCallbackOpen(false)} sx={{ color: '#64748B' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: '#1D6EE5',
                borderRadius: 20,
                px: 3,
                fontWeight: 600,
                '&:hover': { bgcolor: '#1558C0' }
              }}
            >
              Request Call
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Quick Chat / Help Drawer Modal */}
      <Dialog
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#10B981' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F2A4A' }}>
              JobPulse Live Assistant
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setChatOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ bgcolor: '#F8FAFC', p: 2, borderRadius: 2, mb: 2, border: '1px solid #E2E8F0' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F2A4A', mb: 0.5 }}>
              Frequently Asked Questions:
            </Typography>
            <Typography variant="caption" sx={{ color: '#475569', display: 'block', mb: 0.5 }}>
              • <strong>Is JobPulse Lite really free?</strong> Yes, 100% free with unlimited job searches and email notifications.
            </Typography>
            <Typography variant="caption" sx={{ color: '#475569', display: 'block', mb: 0.5 }}>
              • <strong>Are government jobs authentic?</strong> All notifications are cross-checked with official Gazette and UPSC/SSC portals.
            </Typography>
            <Typography variant="caption" sx={{ color: '#475569', display: 'block' }}>
              • <strong>Recruiter accounts:</strong> Post verified positions and connect with qualified candidates instantly.
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B', textAlign: 'center' }}>
            Need direct help? Email support at <strong>support@jobpulse.in</strong> or request a callback using the side button.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button fullWidth variant="outlined" onClick={() => setChatOpen(false)} sx={{ borderRadius: 20 }}>
            Got it
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Snackbar */}
      <Snackbar
        open={submittedSnackbar}
        autoHideDuration={4000}
        onClose={() => setSubmittedSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSubmittedSnackbar(false)}
          severity="success"
          icon={<CheckCircleIcon />}
          sx={{ width: '100%', borderRadius: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
        >
          Callback request received! A JobPulse specialist will reach out shortly.
        </Alert>
      </Snackbar>
    </Box>
  );
};
