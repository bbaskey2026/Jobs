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
  CircularProgress
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authApi } from '../../services/api/auth.api.js';
import { useAuthStore } from '../../stores/auth.store.js';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Please enter a valid email address').required('Email is required'),
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

  return (
    <Container maxWidth="xs" sx={{ py: { xs: 6, md: 10 } }}>
      <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2, border: '1px solid #E6E6E6', bgcolor: '#FFFFFF', boxShadow: 'none' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'baseline', mb: 1 }}>
            <Typography variant="h5" sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 800, color: '#000000', letterSpacing: '-0.04em' }}>
              JobPulse
            </Typography>
            <Box component="span" sx={{ width: 6, height: 6, bgcolor: '#2563EB', borderRadius: '50%', ml: 0.5 }} />
          </Box>
          <Typography variant="h4" sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 800, color: '#000000', fontSize: '1.5rem', mb: 0.5 }}>
            Welcome back.
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
            Sign in to access your saved opportunities and customized job alerts.
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
            id="email"
            name="email"
            label="Email Address"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{ mb: 2.5 }}
          />

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

          <Box sx={{ textAlign: 'right', mb: 3 }}>
            <Link component={RouterLink} to="/forgot-password" variant="body2" underline="hover" sx={{ color: '#2563EB', fontWeight: 500 }}>
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={formik.isSubmitting}
            sx={{ bgcolor: '#2563EB', py: 1.25, fontWeight: 600, borderRadius: 20, '&:hover': { bgcolor: '#1D4ED8' } }}
          >
            {formik.isSubmitting ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Sign In'}
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 3, pt: 2, borderTop: '1px solid #E6E6E6' }}>
          <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
            No account yet?{' '}
            <Link component={RouterLink} to="/register" fontWeight={700} underline="hover" sx={{ color: '#2563EB' }}>
              Create one free
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};
