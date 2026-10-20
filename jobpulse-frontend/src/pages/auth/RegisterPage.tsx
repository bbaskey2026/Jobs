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
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import {
  HelpOutline as HelpOutlineIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PersonOutline as PersonIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authApi } from '../../services/api/auth.api.js';
import { useAuthStore } from '../../stores/auth.store.js';
import { UserRole } from '@jobpulse/shared';
import { AuthSplitHero } from './AuthSplitHero.js';
import { AuthCardHeader } from './AuthCardHeader.js';
import { AuthSocialButtons } from './AuthSocialButtons.js';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      role: UserRole.JOB_SEEKER,
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .min(2, 'Full name must be at least 2 characters')
        .required('Full name is required'),
      email: Yup.string()
        .email('Please enter a valid email address')
        .required('Business or personal email is required'),
      phoneNumber: Yup.string()
        .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number')
        .nullable()
        .notRequired(),
      role: Yup.string().oneOf([UserRole.JOB_SEEKER, UserRole.RECRUITER]),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setServerError(null);
        const res = await authApi.register({
          fullName: values.fullName,
          email: values.email,
          phoneNumber: values.phoneNumber ? values.phoneNumber : undefined,
          role: values.role as UserRole,
          password: values.password
        });
        setUser(res.user);
        navigate('/dashboard');
      } catch (err: any) {
        setServerError(err.message || 'Registration failed. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 2.5, md: 3.5 },
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
          gap: { xs: 3, md: 7 },
          alignItems: 'center',
          width: '100%'
        }}
      >
        {/* Left Column: Tracxn Hero & Proof */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <AuthSplitHero
            headingTitle="Our Lite Plan awaits you -"
            headingHighlight="It's Free!"
            subtitle="Complete your sign up to unlock full access to curated data"
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
              p: { xs: 2.5, sm: 3.75 },
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              bgcolor: '#FFFFFF',
              boxShadow: '0 12px 36px rgba(15, 42, 74, 0.08)',
              width: '100%',
              maxWidth: 480
            }}
          >
            <AuthCardHeader
              title="Create an Account for Free"
              subtitle="No credit card required"
            />

            {serverError && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: '8px' }}>
                {serverError}
              </Alert>
            )}

            <Box component="form" onSubmit={formik.handleSubmit}>
              {/* Account Type Toggle */}
              <Box sx={{ mb: 2.25 }}>
                <Typography
                  component="label"
                  sx={{
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: '#334155',
                    display: 'block',
                    mb: 0.75
                  }}
                >
                  I am registering as:
                </Typography>
                <ToggleButtonGroup
                  value={formik.values.role}
                  exclusive
                  onChange={(_, val) => {
                    if (val) formik.setFieldValue('role', val);
                  }}
                  fullWidth
                  size="small"
                  sx={{
                    bgcolor: '#F8FAFC',
                    p: 0.5,
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    '& .MuiToggleButton-root': {
                      borderRadius: '6px',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.825rem',
                      border: 'none',
                      py: 0.75,
                      color: '#64748B',
                      gap: 0.75,
                      '&.Mui-selected': {
                        bgcolor: '#FFFFFF',
                        color: '#1D6EE5',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        '&:hover': { bgcolor: '#FFFFFF' }
                      }
                    }
                  }}
                >
                  <ToggleButton value={UserRole.JOB_SEEKER}>
                    <PersonIcon sx={{ fontSize: 17 }} />
                    Job Seeker / Aspirant
                  </ToggleButton>
                  <ToggleButton value={UserRole.RECRUITER}>
                    <BusinessIcon sx={{ fontSize: 17 }} />
                    Recruiter / Organization
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Full Name Field */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
                  <Typography
                    component="label"
                    htmlFor="fullName"
                    sx={{
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: '#334155'
                    }}
                  >
                    Full Name
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  id="fullName"
                  name="fullName"
                  placeholder="e.g. Rahul Sharma"
                  size="medium"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                  helperText={formik.touched.fullName && formik.errors.fullName}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '6px',
                      bgcolor: '#FFFFFF',
                      '& fieldset': { borderColor: '#CBD5E1' },
                      '&:hover fieldset': { borderColor: '#94A3B8' },
                      '&.Mui-focused fieldset': { borderColor: '#1D6EE5' }
                    },
                    '& .MuiInputBase-input': {
                      py: 1.1,
                      fontSize: '0.925rem'
                    }
                  }}
                />
              </Box>

              {/* Business Email Field matching screenshot */}
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
                    title="Enter your business or personal email address to receive activation link & alerts"
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
                      py: 1.1,
                      fontSize: '0.925rem'
                    }
                  }}
                />
              </Box>

              {/* Password Field */}
              <Box sx={{ mb: 2 }}>
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
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>
                    Min 8 chars, 1 uppercase, 1 number
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  placeholder="Create password"
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
                      py: 1.1,
                      fontSize: '0.925rem'
                    }
                  }}
                />
              </Box>

              {/* Confirm Password Field */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.75 }}>
                  <Typography
                    component="label"
                    htmlFor="confirmPassword"
                    sx={{
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: '#334155'
                    }}
                  >
                    Confirm Password
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  size="medium"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          size="small"
                          sx={{ color: '#64748B' }}
                        >
                          {showConfirmPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
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
                      py: 1.1,
                      fontSize: '0.925rem'
                    }
                  }}
                />
              </Box>

              {/* Primary Blue Action Button matching Tracxn "Sign Up" */}
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
                  mt: 0.5
                }}
              >
                {formik.isSubmitting ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Sign Up'}
              </Button>

              {/* Social Login Buttons: Divider + Business Email + Google + Microsoft */}
              <AuthSocialButtons
                mode="signup"
                onBusinessEmailClick={() => {
                  const emailInput = document.getElementById('email');
                  if (emailInput) emailInput.focus();
                }}
              />

              {/* Switch link */}
              <Box sx={{ textAlign: 'center', mt: 3, pt: 2, borderTop: '1px solid #F1F5F9' }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.85rem' }}>
                  Already have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/login"
                    sx={{
                      color: '#1D6EE5',
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Sign In
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
