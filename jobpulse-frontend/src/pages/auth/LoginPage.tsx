import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Tooltip,
  Chip
} from '@mui/material';
import {
  HelpOutline as HelpOutlineIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Bolt as BoltIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authApi } from '../../services/api/auth.api.js';
import { useAuthStore } from '../../stores/auth.store.js';
import { AuthSplitHero } from './AuthSplitHero.js';
import { AuthCardHeader } from './AuthCardHeader.js';
import { AuthSocialButtons } from './AuthSocialButtons.js';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Please enter a valid email address')
        .required('Business or personal email is required'),
      password: Yup.string().required('Password is required')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setServerError(null);
        const res = await authApi.login(values);
        setUser(res.user);
        navigate('/dashboard');
      } catch (err: any) {
        setServerError(err.message || 'Login failed. Please check your credentials.');
      } finally {
        setSubmitting(false);
      }
    }
  });

  const handleDemoFill = (email: string, pass: string) => {
    formik.setFieldValue('email', email);
    formik.setFieldValue('password', pass);
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
        {/* Left Column: Tracxn Value Hero & Social Proof */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <AuthSplitHero
            headingTitle="Our Lite Plan awaits you -"
            headingHighlight="It's Free!"
            subtitle="Complete your sign in to unlock full access to curated job opportunities, verified recruiter updates, and real-time alerts"
            bulletItems={[
              { highlight1: '8.4M+', text1: 'Companies,', highlight2: '292K+', text2: 'Investors' },
              { highlight1: '2M+', text1: 'Funding Rounds,', highlight2: '229K+', text2: 'Acquisitions' },
              { highlight1: '3K+', text1: 'Sectors,', highlight2: '55.7K+', text2: 'Business Models' }
            ]}
            trustedText="JobPulse is trusted by 1,000+ customers across 30+ countries"
          />
        </Box>

        {/* Right Column: Floating White Form Card */}
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
              title="Sign in to Your Account"
              subtitle="No credit card required"
            />

            {serverError && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: '8px' }}>
                {serverError}
              </Alert>
            )}

            <Box component="form" onSubmit={formik.handleSubmit}>
              {/* Business Email Field with Info Tooltip */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
                  <Typography
                    component="label"
                    htmlFor="email"
                    sx={{
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: '#334155'
                    }}
                  >
                    Business Email Address
                  </Typography>
                  <Tooltip
                    title="Enter your corporate or personal email address to log in"
                    arrow
                    placement="top"
                  >
                    <HelpOutlineIcon sx={{ fontSize: 15, color: '#64748B', cursor: 'pointer' }} />
                  </Tooltip>
                </Box>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  placeholder="yourname@yourbusiness.com"
                  type="email"
                  size="medium"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '6px',
                      bgcolor: '#FFFFFF',
                      '& fieldset': { borderColor: '#CBD5E1' },
                      '&:hover fieldset': { borderColor: '#94A3B8' },
                      '&.Mui-focused fieldset': { borderColor: '#1D6EE5' }
                    },
                    '& .MuiInputBase-input': {
                      py: 1.25,
                      fontSize: '0.925rem'
                    }
                  }}
                />
              </Box>

              {/* Password Field */}
              <Box sx={{ mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
                  <Typography
                    component="label"
                    htmlFor="password"
                    sx={{
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: '#334155'
                    }}
                  >
                    Password
                  </Typography>
                  <Link
                    component={RouterLink}
                    to="/forgot-password"
                    sx={{
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      color: '#1D6EE5',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  size="medium"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          sx={{ color: '#64748B' }}
                        >
                          {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '6px',
                      bgcolor: '#FFFFFF',
                      '& fieldset': { borderColor: '#CBD5E1' },
                      '&:hover fieldset': { borderColor: '#94A3B8' },
                      '&.Mui-focused fieldset': { borderColor: '#1D6EE5' }
                    },
                    '& .MuiInputBase-input': {
                      py: 1.25,
                      fontSize: '0.925rem'
                    }
                  }}
                />
              </Box>

              {/* Primary Blue Action Button matching Tracxn */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={formik.isSubmitting}
                sx={{
                  bgcolor: '#1D6EE5',
                  color: '#FFFFFF',
                  py: 1.3,
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  borderRadius: '6px',
                  textTransform: 'none',
                  boxShadow: '0 2px 8px rgba(29, 110, 229, 0.25)',
                  '&:hover': {
                    bgcolor: '#1558C0'
                  },
                  mt: 1
                }}
              >
                {formik.isSubmitting ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Sign In'}
              </Button>

              {/* Demo Credentials Helper Pill */}
              <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <Chip
                  icon={<BoltIcon sx={{ fontSize: '15px !important', color: '#0284C7' }} />}
                  label="Quick Demo: Candidate"
                  size="small"
                  onClick={() => handleDemoFill('candidate@jobpulse.in', 'Password@123')}
                  sx={{
                    fontSize: '0.75rem',
                    bgcolor: '#F0F9FF',
                    color: '#0369A1',
                    border: '1px solid #BAE6FD',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#E0F2FE' }
                  }}
                />
              </Box>

              {/* Social Login Buttons: Divider + Google + Microsoft */}
              <AuthSocialButtons mode="signin" />

              {/* Switch link */}
              <Box sx={{ textAlign: 'center', mt: 3, pt: 2, borderTop: '1px solid #F1F5F9' }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.85rem' }}>
                  No account yet?{' '}
                  <Link
                    component={RouterLink}
                    to="/register"
                    sx={{
                      color: '#1D6EE5',
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Create an Account for Free
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};
