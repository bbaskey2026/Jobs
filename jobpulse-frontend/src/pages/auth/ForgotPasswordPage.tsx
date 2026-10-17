import React, { useState } from 'react';
import { Container, Paper, Box, Typography, TextField, Button, Alert, Link } from '@mui/material';
import { Link as RouterLink, useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/api/auth.api.js';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      setLoading(true);
      await authApi.forgotPassword({ email });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: { xs: 6, md: 10 } }}>
      <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2, border: '1px solid #E6E6E6', bgcolor: '#FFFFFF', boxShadow: 'none' }}>
        <Typography variant="h4" sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 800, color: '#000000', mb: 1, textAlign: 'center', fontSize: '1.5rem' }}>
          Reset Password
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B6B6B', mb: 3, textAlign: 'center' }}>
          Enter your registered email address and we'll send you a password reset link.
        </Typography>

        {submitted ? (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2, border: '1px solid #E6E6E6' }}>
            If an account is associated with this email, password reset instructions have been dispatched.
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ py: 1.25, fontWeight: 600, bgcolor: '#2563EB', borderRadius: 20, '&:hover': { bgcolor: '#1D4ED8' } }}
            >
              Send Reset Link
            </Button>
          </Box>
        )}

        <Box sx={{ textAlign: 'center', mt: 3, pt: 2, borderTop: '1px solid #E6E6E6' }}>
          <Link component={RouterLink} to="/login" variant="body2" underline="hover" sx={{ color: '#2563EB', fontWeight: 500 }}>
            ← Back to Sign In
          </Link>
        </Box>
      </Paper>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await authApi.resetPassword({ token, newPassword });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: { xs: 6, md: 10 } }}>
      <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2, border: '1px solid #E6E6E6', bgcolor: '#FFFFFF', boxShadow: 'none' }}>
        <Typography variant="h4" sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 800, color: '#000000', mb: 2, textAlign: 'center', fontSize: '1.5rem' }}>
          Create New Password
        </Typography>
        {success ? (
          <Alert severity="info" sx={{ borderRadius: 2, border: '1px solid #E6E6E6' }}>Password updated successfully! Redirecting to login...</Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2, border: '1px solid #E6E6E6' }}>{error}</Alert>}
            <TextField
              fullWidth
              label="New Password (min 8 chars, 1 uppercase, 1 number)"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ py: 1.25, fontWeight: 600, bgcolor: '#2563EB', borderRadius: 20, '&:hover': { bgcolor: '#1D4ED8' } }}
            >
              Update Password
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
      authApi.verifyEmail(token)
        .then(() => setStatus('success'))
        .catch(() => setStatus('error'));
    } else {
      setStatus('error');
    }
  }, [token]);

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
      <Paper sx={{ p: { xs: 3, sm: 5 }, borderRadius: 2, border: '1px solid #E6E6E6', bgcolor: '#FFFFFF', boxShadow: 'none' }}>
        {status === 'verifying' && <Typography variant="h6" sx={{ color: '#000000' }}>Verifying your email address...</Typography>}
        {status === 'success' && (
          <Box>
            <Typography variant="h4" sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 800, color: '#2563EB', mb: 2, fontSize: '1.5rem' }}>
              Email Verified Successfully
            </Typography>
            <Typography variant="body1" sx={{ color: '#6B6B6B', mb: 4 }}>
              Your JobPulse candidate account is now verified. You can now access full features and configure alerts.
            </Typography>
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              size="large"
              sx={{ fontWeight: 600, bgcolor: '#2563EB', borderRadius: 20, '&:hover': { bgcolor: '#1D4ED8' } }}
            >
              Proceed to Sign In
            </Button>
          </Box>
        )}
        {status === 'error' && (
          <Box>
            <Typography variant="h4" sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 800, color: '#000000', mb: 2, fontSize: '1.5rem' }}>
              Verification Link Invalid or Expired
            </Typography>
            <Typography variant="body1" sx={{ color: '#6B6B6B', mb: 4 }}>
              The verification token is invalid or has already been used. Please log in or request a new verification link.
            </Typography>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              sx={{ borderColor: '#E6E6E6', color: '#242424', borderRadius: 20, fontWeight: 600, '&:hover': { borderColor: '#2563EB', bgcolor: '#EFF6FF', color: '#2563EB' } }}
            >
              Back to Login
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};
