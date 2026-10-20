import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api/client.js';
import { JobCard } from '../../components/jobs/JobCard.js';
import { EmptyState } from '../../components/feedback/EmptyState.js';
import { JobListSkeleton } from '../../components/feedback/LoadingSkeleton.js';
import { useNavigate } from 'react-router-dom';

export const BookmarksPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: bookmarks, isLoading } = useQuery({
    queryKey: ['myBookmarks'],
    queryFn: async () => {
      const res = await apiClient.get('/bookmarks');
      return res.data.data;
    }
  });

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 800,
            color: '#000000',
            letterSpacing: '-0.03em',
            fontSize: { xs: '1.6rem', md: '2rem' },
            mb: 0.5
          }}
        >
          Saved Opportunities
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B6B6B' }}>
          Vacancies you have bookmarked for subsequent review or upcoming application deadlines.
        </Typography>
      </Box>

      {isLoading ? (
        <JobListSkeleton count={3} />
      ) : bookmarks && bookmarks.length > 0 ? (
        <Box sx={{ borderTop: '1px solid #E6E6E6' }}>
          {bookmarks.map((b: any) => (
            <JobCard key={b.id} job={b.job} />
          ))}
        </Box>
      ) : (
        <EmptyState
          title="No Saved Vacancies Yet"
          description="Click the bookmark icon on any opportunity in the feed to save it for quick reference."
          actionText="Browse Vacancies Feed"
          onAction={() => navigate('/jobs')}
        />
      )}
    </Container>
  );
};
