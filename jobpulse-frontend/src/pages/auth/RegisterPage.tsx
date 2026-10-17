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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authApi } from '../../services/api/auth.api.js';
import { useAuthStore } from '../../stores/auth.store.js';
import { UserRole } from '@jobpulse/shared';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);

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
      fullName: Yup.string().min(2, 'Name must be at least 2 characters').required('Full name is required'),
      email: Yup.string().email('Please enter a valid email address').required('Email is required'),
      phoneNumber: Yup.string().matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
      role: Yup.string().oneOf([UserRole.JOB_SEEKER, UserRole.RECRUITER]),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Must contain at least one number')
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
          phoneNumber: values.phoneNumber || undefined,
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
    <Container maxWidth="sm" sx={{ py: { xs: 5, md: 8 } }}>
      <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2, border: '1px solid #E6E6E6', bgcolor: '#FFFFFF', boxShadow: 'none' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'baseline', mb: 1 }}>
            <Typography variant="h5" sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 800, color: '#000000', letterSpacing: '-0.04em' }}>
              JobPulse
            </Typography>
            <Box component="span" sx={{ width: 6, height: 6, bgcolor: '#2563EB', borderRadius: '50%', ml: 0.5 }} />
          </Box>
          <Typography variant="h4" sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 800, color: '#000000', fontSize: '1.5rem', mb: 0.5 }}>
            Join JobPulse.
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
            Get verified employment digests and track applications across India.
          </Typography>
        </Box>

        {serverError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2, border: '1px solid #E6E6E6' }}>
            {serverError}
          </Alert>
        )}

        <Box component="form" onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="fullName"
            name="fullName"
            label="Full Name"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
            helperText={formik.touched.fullName && formik.errors.fullName}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            id="phoneNumber"
            name="phoneNumber"
            label="Mobile Number (Optional)"
            placeholder="10-digit mobile number"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel id="role-label">I am a</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={formik.values.role}
              label="I am a"
              onChange={formik.handleChange}
            >
              <MenuItem value={UserRole.JOB_SEEKER}>Job Seeker / Aspirant</MenuItem>
              <MenuItem value={UserRole.RECRUITER}>Recruiter / Organization Representative</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={formik.isSubmitting}
            sx={{ bgcolor: '#2563EB', py: 1.25, fontWeight: 600, borderRadius: 20, '&:hover': { bgcolor: '#1D4ED8' } }}
          >
            {formik.isSubmitting ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Create Account'}
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 3, pt: 2, borderTop: '1px solid #E6E6E6' }}>
          <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
            Already registered?{' '}
            <Link component={RouterLink} to="/login" fontWeight={700} underline="hover" sx={{ color: '#2563EB' }}>
              Sign In
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};
