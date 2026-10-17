import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { SearchOff as SearchOffIcon } from '@mui/icons-material';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Jobs Found',
  description = 'Try adjusting your filters, location, or search keywords to find opportunities.',
  actionText,
  onAction
}) => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
        px: 3,
        bgcolor: '#FFFFFF',
        borderRadius: 2,
        border: '1px dashed #E5E7EB'
      }}
    >
      <SearchOffIcon sx={{ fontSize: 44, color: '#4B5563', mb: 2 }} />
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#111111', mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: '#4B5563', maxWidth: 450, mx: 'auto', mb: 3 }}>
        {description}
      </Typography>
      {actionText && onAction && (
        <Button variant="outlined" onClick={onAction} sx={{ fontWeight: 600, borderColor: '#E5E7EB', color: '#2563EB' }}>
          {actionText}
        </Button>
      )}
    </Box>
  );
};
