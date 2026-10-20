import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton
} from '@mui/material';
import {
  NotificationsNoneOutlined as NotificationIcon,
  CheckCircleOutline as CheckIcon
} from '@mui/icons-material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { notificationsApi } from '../../services/api/alerts.api.js';
import { EmptyState } from '../../components/feedback/EmptyState.js';

export const NotificationsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getNotifications()
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const handleMarkAsRead = async (id: string) => {
    await notificationsApi.markAsRead(id);
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  const handleMarkAllAsRead = async () => {
    await notificationsApi.markAllAsRead();
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5 }}>
        <Box>
          <Typography variant="h3" sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: 800, color: '#000000', mb: 0.5, fontSize: { xs: '1.5rem', md: '1.875rem' } }}>
            Notification Center
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
            {unreadCount > 0 ? `${unreadCount} unread notices and digests` : 'All caught up!'}
          </Typography>
        </Box>
        {unreadCount > 0 && (
          <Button
            variant="outlined"
            size="small"
            onClick={handleMarkAllAsRead}
            sx={{ borderRadius: 20, borderColor: '#E6E6E6', color: '#242424', fontSize: '0.8rem', fontWeight: 600, '&:hover': { borderColor: '#2563EB', color: '#2563EB' } }}
          >
            Mark All as Read
          </Button>
        )}
      </Box>

      {notifications.length > 0 ? (
        <Box sx={{ borderRadius: 2, border: '1px solid #E6E6E6', bgcolor: '#FFFFFF', overflow: 'hidden' }}>
          <List disablePadding>
            {notifications.map((n, idx) => (
              <React.Fragment key={n.id}>
                {idx > 0 && <Divider sx={{ borderColor: '#E6E6E6' }} />}
                <ListItem
                  sx={{
                    bgcolor: n.isRead ? '#FFFFFF' : '#F7F7F7',
                    py: 2,
                    px: 2.5,
                    borderLeft: n.isRead ? 'none' : '3px solid #2563EB'
                  }}
                  secondaryAction={
                    !n.isRead && (
                      <IconButton size="small" onClick={() => handleMarkAsRead(n.id)} title="Mark as Read" sx={{ color: '#2563EB' }}>
                        <CheckIcon fontSize="small" />
                      </IconButton>
                    )
                  }
                >
                  <NotificationIcon sx={{ color: n.isRead ? '#6B6B6B' : '#2563EB', mr: 2, fontSize: 22 }} />
                  <ListItemText
                    primary={<Typography variant="subtitle2" sx={{ fontWeight: n.isRead ? 600 : 700, color: '#000000' }}>{n.title}</Typography>}
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="body2" sx={{ color: '#6B6B6B', fontSize: '0.875rem' }}>{n.message}</Typography>
                        <Typography variant="caption" sx={{ color: '#A8A8A8', mt: 0.5, display: 'block', fontSize: '0.75rem' }}>
                          {format(new Date(n.createdAt), 'dd MMM yyyy, hh:mm a')}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Box>
      ) : (
        <EmptyState
          title="No Notifications"
          description="You will see immediate updates here when new jobs matching your alerts are published."
        />
      )}
    </Container>
  );
};
