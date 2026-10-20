import React, { useState, useEffect } from 'react';
import { Box, Typography, SxProps, Theme } from '@mui/material';
import { Schedule as ScheduleIcon } from '@mui/icons-material';
import { format } from 'date-fns';

export interface DeadlineCountdownProps {
  deadline: string | Date | null | undefined;
  showDate?: boolean;
  compact?: boolean;
  sx?: SxProps<Theme>;
}

export const DeadlineCountdown: React.FC<DeadlineCountdownProps> = ({
  deadline,
  showDate = true,
  compact = false,
  sx
}) => {
  if (!deadline) {
    return (
      <Box sx={{ display: 'inline-flex', alignItems: 'center', color: '#6B6B6B', fontSize: '0.78rem', py: 0.25, px: 0.5, ...sx }}>
        <ScheduleIcon sx={{ fontSize: 14, mr: 0.5 }} />
        <Typography variant="caption" sx={{ fontWeight: 500, color: '#6B6B6B', fontSize: '0.78rem' }}>
          Open until filled
        </Typography>
      </Box>
    );
  }

  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline;

  // Compute remaining time
  const calculateRemaining = () => {
    const diff = deadlineDate.getTime() - Date.now();
    if (isNaN(diff) || diff <= 0) {
      return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { total: diff, days, hours, minutes, seconds, isExpired: false };
  };

  const [timeLeft, setTimeLeft] = useState(calculateRemaining);

  useEffect(() => {
    setTimeLeft(calculateRemaining());

    const timer = setInterval(() => {
      const remaining = calculateRemaining();
      setTimeLeft(remaining);
      if (remaining.isExpired) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  let formattedDate = '';
  try {
    formattedDate = format(deadlineDate, 'dd MMM yyyy');
  } catch {
    formattedDate = 'Invalid date';
  }

  // Handle expired deadlines
  if (timeLeft.isExpired) {
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.6,
          py: 0.2,
          px: 0.75,
          borderRadius: '4px',
          bgcolor: '#F3F4F6',
          border: '1px solid #E5E7EB',
          color: '#6B7280',
          fontSize: '0.78rem',
          ...sx
        }}
      >
        <ScheduleIcon sx={{ fontSize: 14, color: '#9CA3AF' }} />
        {showDate && (
          <Typography component="span" sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#6B7280' }}>
            Deadline: {formattedDate}
          </Typography>
        )}
        <Typography
          component="span"
          sx={{
            fontSize: '0.72rem',
            fontWeight: 700,
            bgcolor: '#E5E7EB',
            color: '#4B5563',
            px: 0.6,
            py: 0.1,
            borderRadius: '3px',
            textTransform: 'uppercase'
          }}
        >
          Closed
        </Typography>
      </Box>
    );
  }

  const isCritical = timeLeft.days <= 1;
  const isUrgent = timeLeft.days <= 7;

  const pad = (n: number) => String(n).padStart(2, '0');
  const countdownText = timeLeft.days > 0
    ? `${timeLeft.days}d ${pad(timeLeft.hours)}h ${pad(timeLeft.minutes)}m ${pad(timeLeft.seconds)}s`
    : `${pad(timeLeft.hours)}h ${pad(timeLeft.minutes)}m ${pad(timeLeft.seconds)}s`;

  if (compact) {
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          fontSize: '0.75rem',
          color: isCritical ? '#DC2626' : isUrgent ? '#D97706' : '#0d3b66',
          ...sx
        }}
      >
        <ScheduleIcon sx={{ fontSize: 13 }} />
        <Typography
          component="span"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 700,
            fontFamily: "'Open Sans', monospace",
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '0.2px'
          }}
        >
          {countdownText} left
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.6,
        py: 0.2,
        px: 0.75,
        borderRadius: '4px',
        bgcolor: isCritical ? '#FEF2F2' : isUrgent ? '#FFFBEB' : '#F8FAFC',
        border: `1px solid ${isCritical ? '#FCA5A5' : isUrgent ? '#FDE68A' : '#E2E8F0'}`,
        color: isCritical ? '#DC2626' : isUrgent ? '#B45309' : '#0d3b66',
        transition: 'all 0.2s ease',
        ...sx
      }}
    >
      <ScheduleIcon
        sx={{
          fontSize: 14,
          color: isCritical ? '#DC2626' : isUrgent ? '#D97706' : '#0d3b66',
          animation: isCritical ? 'pulse 1.5s infinite' : 'none',
          '@keyframes pulse': {
            '0%': { opacity: 1 },
            '50%': { opacity: 0.4 },
            '100%': { opacity: 1 }
          }
        }}
      />

      {showDate && (
        <Typography
          component="span"
          sx={{
            fontSize: '0.78rem',
            fontWeight: 600,
            color: isCritical ? '#991B1B' : isUrgent ? '#92400E' : '#334155',
            fontFamily: "'Open Sans', sans-serif"
          }}
        >
          Deadline: {formattedDate}
        </Typography>
      )}

      <Typography
        component="span"
        sx={{
          fontSize: '0.75rem',
          fontWeight: 700,
          fontFamily: "'Open Sans', monospace",
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '0.3px',
          bgcolor: isCritical ? '#FEE2E2' : isUrgent ? '#FEF3C7' : '#EBF1F7',
          color: isCritical ? '#B91C1C' : isUrgent ? '#92400E' : '#0f2a4a',
          px: 0.6,
          py: 0.1,
          borderRadius: '3px',
          whiteSpace: 'nowrap'
        }}
      >
        {countdownText} left
      </Typography>
    </Box>
  );
};
