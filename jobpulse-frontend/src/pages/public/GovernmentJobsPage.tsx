import React from 'react';
import { JobsListingPage } from './JobsListingPage.js';

export const GovernmentJobsPage: React.FC = () => {
  return (
    <JobsListingPage
      initialIsGovernment={true}
      pageTitle="Verified Government Jobs in India (Sarkari Naukri)"
      pageSubtitle="Browse central ministries, state public service commissions, SSC, banking exams, defence recruitment, and railway vacancies."
    />
  );
};

export const PrivateJobsPage: React.FC = () => {
  return (
    <JobsListingPage
      initialIsGovernment={false}
      pageTitle="Private Sector Careers & Openings"
      pageSubtitle="Explore leading corporate careers in Information Technology, Banking, Healthcare, Engineering, and Management across India."
    />
  );
};
