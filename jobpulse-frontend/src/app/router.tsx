import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Navbar } from '../components/layout/Navbar.js';
import { Footer } from '../components/layout/Footer.js';
import { ProtectedRoute } from '../components/common/ProtectedRoute.js';
import { UserRole } from '@jobpulse/shared';

// Public pages
import { HomePage } from '../pages/public/HomePage.js';
import { JobsListingPage } from '../pages/public/JobsListingPage.js';
import { GovernmentJobsPage, PrivateJobsPage } from '../pages/public/GovernmentJobsPage.js';
import { JobDetailPage } from '../pages/public/JobDetailPage.js';
import { CategoriesPage } from '../pages/public/CategoriesPage.js';
import { OrganizationsPage } from '../pages/public/OrganizationsPage.js';
import {
  AboutPage,
  ContactPage,
  PrivacyPolicyPage,
  TermsPage,
  DataDeletionPage,
  NotFoundPage
} from '../pages/public/StaticPages.js';

// Auth pages
import { LoginPage } from '../pages/auth/LoginPage.js';
import { RegisterPage } from '../pages/auth/RegisterPage.js';
import { ForgotPasswordPage, ResetPasswordPage, VerifyEmailPage } from '../pages/auth/ForgotPasswordPage.js';

// Dashboard pages
import { UserDashboardPage } from '../pages/dashboard/UserDashboardPage.js';
import { ProfilePage } from '../pages/dashboard/ProfilePage.js';
import { JobAlertsPage } from '../pages/dashboard/JobAlertsPage.js';
import { BookmarksPage } from '../pages/dashboard/BookmarksPage.js';
import { ApplicationsPage } from '../pages/dashboard/ApplicationsPage.js';
import { NotificationsPage } from '../pages/dashboard/NotificationsPage.js';

// Admin pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage.js';

const MainLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsListingPage />} />
        <Route path="/government-jobs" element={<GovernmentJobsPage />} />
        <Route path="/private-jobs" element={<PrivateJobsPage />} />
        <Route path="/jobs/:slugOrId" element={<JobDetailPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/organizations" element={<OrganizationsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/data-deletion" element={<DataDeletionPage />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Protected Candidate Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<UserDashboardPage />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
          <Route path="/dashboard/alerts" element={<JobAlertsPage />} />
          <Route path="/dashboard/bookmarks" element={<BookmarksPage />} />
          <Route path="/dashboard/applications" element={<ApplicationsPage />} />
          <Route path="/dashboard/notifications" element={<NotificationsPage />} />
        </Route>

        {/* Protected Administration Routes */}
        <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR]} />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
