import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  CircularProgress
} from '@mui/material';
import { Link as RouterLink, useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/api/auth.api.js';
import { AuthSplitHero } from './AuthSplitHero.js';
import { AuthCardHeader } from './AuthCardHeader.js';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      setLoading(true);
      setError(null);
      await authApi.forgotPassword({ email });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 4, md: 7 },
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.05fr 1fr' },
          gap: { xs: 4, md: 8 },
          alignItems: 'center',
          width: '100%'
        }}
      >
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <AuthSplitHero
            headingTitle="Account Recovery -"
            headingHighlight="Fast & Secure"
            subtitle="Get back to accessing verified job alerts, saved applications, and recruiter communications"
            trustedText="JobPulse security protocols ensure safe candidate authentication"
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, width: '100%' }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4.5 },
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              bgcolor: '#FFFFFF',
              boxShadow: '0 12px 36px rgba(15, 42, 74, 0.08)',
              width: '100%',
              maxWidth: 460
            }}
          >
            <AuthCardHeader
              title="Reset Your Password"
              subtitle="Enter your email to receive recovery instructions"
            />

            {error && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: '8px' }}>
                {error}
              </Alert>
            )}

            {submitted ? (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Alert severity="success" sx={{ mb: 3, borderRadius: '8px', textAlign: 'left' }}>
                  If an account exists with <strong>{email}</strong>, a password reset link has been dispatched. Please check your inbox and spam folder.
                </Alert>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: '#1D6EE5',
                    borderRadius: '6px',
                    py: 1.25,
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#1558C0' }
                  }}
                >
                  Return to Sign In
                </Button>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    component="label"
                    htmlFor="email"
                    sx={{ fontSize: '0.84rem', fontWeight: 600, color: '#334155', display: 'block', mb: 0.75 }}
                  >
                    Registered Email Address
                  </Typography>
                  <TextField
                    fullWidth
                    id="email"
                    placeholder="yourname@yourbusiness.com"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                        '& fieldset': { borderColor: '#CBD5E1' },
                        '&:hover fieldset': { borderColor: '#94A3B8' },
                        '&.Mui-focused fieldset': { borderColor: '#1D6EE5' }
                      },
                      '& .MuiInputBase-input': { py: 1.25, fontSize: '0.925rem' }
                    }}
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    bgcolor: '#1D6EE5',
                    py: 1.3,
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    borderRadius: '6px',
                    textTransform: 'none',
                    boxShadow: '0 2px 8px rgba(29, 110, 229, 0.25)',
                    '&:hover': { bgcolor: '#1558C0' }
                  }}
                >
                  {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Send Reset Link'}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 3, pt: 2, borderTop: '1px solid #F1F5F9' }}>
                  <Link
                    component={RouterLink}
                    to="/login"
                    sx={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#1D6EE5',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    ← Back to Sign In
                  </Link>
                </Box>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      await authApi.resetPassword({ token, newPassword });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: { xs: 6, md: 10 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4.5 },
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          bgcolor: '#FFFFFF',
          boxShadow: '0 12px 36px rgba(15, 42, 74, 0.08)'
        }}
      >
        <AuthCardHeader title="Create New Password" subtitle="Choose a strong password with at least 8 characters" />

        {success ? (
          <Alert severity="success" sx={{ borderRadius: '8px' }}>
            Password updated successfully! Redirecting you to sign in...
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                {error}
              </Alert>
            )}
            <Box sx={{ mb: 3 }}>
              <Typography component="label" sx={{ fontSize: '0.84rem', fontWeight: 600, color: '#334155', display: 'block', mb: 0.75 }}>
                New Password (min 8 chars, 1 uppercase, 1 number)
              </Typography>
              <TextField
                fullWidth
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '6px',
                    '& fieldset': { borderColor: '#CBD5E1' },
                    '&.Mui-focused fieldset': { borderColor: '#1D6EE5' }
                  },
                  '& .MuiInputBase-input': { py: 1.25 }
                }}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                bgcolor: '#1D6EE5',
                py: 1.3,
                fontWeight: 600,
                borderRadius: '6px',
                textTransform: 'none',
                '&:hover': { bgcolor: '#1558C0' }
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Update Password'}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  React.useEffect(() => {
    if (token) {
      authApi
        .verifyEmail(token)
        .then(() => setStatus('success'))
        .catch(() => setStatus('error'));
    } else {
      setStatus('error');
    }
  }, [token]);

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          bgcolor: '#FFFFFF',
          boxShadow: '0 12px 36px rgba(15, 42, 74, 0.08)'
        }}
      >
        {status === 'verifying' && (
          <Typography variant="h6" sx={{ color: '#0F2A4A' }}>
            Verifying your email address...
          </Typography>
        )}
        {status === 'success' && (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#10B981', mb: 1.5 }}>
              Email Verified Successfully
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3.5 }}>
              Your JobPulse candidate account is now verified. You can now access all features and set up custom job alerts.
            </Typography>
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              sx={{
                bgcolor: '#1D6EE5',
                fontWeight: 600,
                borderRadius: '6px',
                px: 3,
                py: 1.2,
                textTransform: 'none',
                '&:hover': { bgcolor: '#1558C0' }
              }}
            >
              Proceed to Sign In
            </Button>
          </Box>
        )}
        {status === 'error' && (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#DC2626', mb: 1.5 }}>
              Verification Link Invalid or Expired
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3.5 }}>
              The verification token is invalid or has already expired. Please sign in or request a fresh verification link.
            </Typography>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              sx={{
                borderColor: '#CBD5E1',
                color: '#334155',
                borderRadius: '6px',
                px: 3,
                py: 1.2,
                textTransform: 'none',
                '&:hover': { borderColor: '#1D6EE5', color: '#1D6EE5' }
              }}
            >
              Back to Sign In
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};
