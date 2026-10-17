import React from 'react';
import { Container, Typography, Grid, Box, Button, CircularProgress, Chip } from '@mui/material';
import { ArrowForward as ArrowForwardIcon, CategoryOutlined as CategoryIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import { apiClient } from '../../services/api/client.js';

export const CategoriesPage: React.FC = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiClient.get('/categories');
      return res.data.data;
    }
  });

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontWeight: 800,
            color: '#000000',
            letterSpacing: '-0.035em',
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            mb: 0.75
          }}
        >
          Recruitment Sectors & Streams
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B6B6B', maxWidth: 800 }}>
          Explore opportunities grouped by government service commissions, educational streams, and professional domains.
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#2563EB' }} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {categories?.map((cat: any) => (
            <Grid item xs={12} sm={6} md={4} key={cat.id}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: '#FFFFFF',
                  border: '1px solid #E6E6E6',
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'border-color 0.15s ease, background-color 0.15s ease',
                  '&:hover': {
                    borderColor: '#2563EB',
                    bgcolor: '#FAFAFA'
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CategoryIcon sx={{ color: '#2563EB', mr: 1, fontSize: 20 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#000000', fontSize: '1.05rem' }}>
                      {cat.name}
                    </Typography>
                  </Box>
                  <Chip
                    label={`${cat.jobCount || 0} Openings`}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      bgcolor: '#EFF6FF',
                      color: '#2563EB',
                      border: '1px solid #DBEAFE'
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ color: '#6B6B6B', mb: 3, flexGrow: 1, lineHeight: 1.6 }}>
                  {cat.description || 'Verified job postings and recruitment notifications in this category.'}
                </Typography>

                <Button
                  component={RouterLink}
                  to={`/jobs?categorySlug=${cat.slug}`}
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: 20,
                    borderColor: '#E6E6E6',
                    color: '#242424',
                    fontWeight: 600,
                    width: 'fit-content',
                    '&:hover': { borderColor: '#2563EB', color: '#2563EB', bgcolor: '#EFF6FF' }
                  }}
                >
                  Explore Stream
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};
