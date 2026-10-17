import React from 'react';
import { Grid, Card, CardContent, Skeleton, Box } from '@mui/material';

export const JobListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, idx) => (
        <Grid item xs={12} sm={6} md={4} key={idx}>
          <Card sx={{ height: 320, p: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Skeleton variant="rounded" width={80} height={24} />
                <Skeleton variant="circular" width={24} height={24} />
              </Box>
              <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={48} sx={{ mb: 2, borderRadius: 1 }} />
              <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="70%" height={20} sx={{ mb: 3 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
                <Skeleton variant="text" width={100} height={24} />
                <Skeleton variant="rounded" width={90} height={32} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
