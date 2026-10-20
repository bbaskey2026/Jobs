import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Switch,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  NotificationsActiveOutlined as AlertIcon
} from '@mui/icons-material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { alertsApi } from '../../services/api/alerts.api.js';
import { AlertFrequency, INDIAN_STATES_AND_UTS, JobSector } from '@jobpulse/shared';
import { EmptyState } from '../../components/feedback/EmptyState.js';

export const JobAlertsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [sector, setSector] = useState('');
  const [state, setState] = useState('');
  const [frequency, setFrequency] = useState(AlertFrequency.DAILY_DIGEST);

  const { data: alerts } = useQuery({
    queryKey: ['myAlerts'],
    queryFn: () => alertsApi.getAlerts()
  });

  const handleToggleActive = async (id: string, current: boolean) => {
    await alertsApi.toggleAlertActive(id, !current);
    queryClient.invalidateQueries({ queryKey: ['myAlerts'] });
  };

  const handleDelete = async (id: string) => {
    await alertsApi.deleteAlert(id);
    queryClient.invalidateQueries({ queryKey: ['myAlerts'] });
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    await alertsApi.createAlert({
      title,
      keywords: keywords || undefined,
      sector: (sector as JobSector) || undefined,
      state: state || undefined,
      frequency,
      channels: ['EMAIL', 'IN_APP'] as any
    });

    setModalOpen(false);
    setTitle('');
    setKeywords('');
    setSector('');
    setState('');
    queryClient.invalidateQueries({ queryKey: ['myAlerts'] });
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h3" sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: 800, color: '#000000', mb: 0.5, fontSize: { xs: '1.6rem', md: '2rem' } }}>
            Job Alert Subscriptions
          </Typography>
          <Typography variant="body1" sx={{ color: '#6B6B6B' }}>
            Receive personalized vacancy updates directly via email and in-app notifications.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
          sx={{ bgcolor: '#2563EB', fontWeight: 600, borderRadius: 20, px: 2.5, '&:hover': { bgcolor: '#1D4ED8' } }}
        >
          Create Job Alert
        </Button>
      </Box>

      {alerts && alerts.length > 0 ? (
        <Grid container spacing={3}>
          {alerts.map((alert) => (
            <Grid item xs={12} sm={6} md={4} key={alert.id}>
              <Card sx={{ height: '100%', p: 1, border: '1px solid #E6E6E6', borderRadius: 2, boxShadow: 'none', bgcolor: '#FFFFFF' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AlertIcon sx={{ color: alert.isActive ? '#2563EB' : '#6B6B6B', mr: 1, fontSize: 22 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#000000', fontSize: '1rem' }}>
                        {alert.title}
                      </Typography>
                    </Box>
                    <IconButton size="small" onClick={() => handleDelete(alert.id)} sx={{ color: '#6B6B6B', '&:hover': { color: '#000000', bgcolor: '#F7F7F7' } }} title="Delete alert">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Stack spacing={1} sx={{ mb: 3 }}>
                    {alert.keywords && (
                      <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                        <strong style={{ color: '#242424' }}>Keywords:</strong> {alert.keywords}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                      <strong style={{ color: '#242424' }}>Sector:</strong> {alert.sector?.replace(/_/g, ' ') || 'All Sectors'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                      <strong style={{ color: '#242424' }}>Location:</strong> {alert.state || 'All India'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                      <strong style={{ color: '#242424' }}>Frequency:</strong> {alert.frequency}
                    </Typography>
                  </Stack>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1.5, borderTop: '1px solid #E6E6E6' }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: alert.isActive ? '#2563EB' : '#6B6B6B', letterSpacing: 0.5 }}>
                      {alert.isActive ? 'ACTIVE ALERTS' : 'PAUSED'}
                    </Typography>
                    <Switch
                      checked={alert.isActive}
                      onChange={() => handleToggleActive(alert.id, alert.isActive)}
                      color="primary"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <EmptyState
          title="No Job Alerts Configured"
          description="Create custom alert filters to receive instant email digests whenever official recruitment notices match your preferences."
          actionText="Create Your First Alert"
          onAction={() => setModalOpen(true)}
        />
      )}

      {/* Create Alert Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2, border: '1px solid #E6E6E6', boxShadow: 'none' } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#000000', borderBottom: '1px solid #E6E6E6' }}>Configure New Job Alert</DialogTitle>
        <Box component="form" onSubmit={handleCreateAlert}>
          <DialogContent sx={{ pt: 3 }}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                required
                label="Alert Name"
                placeholder="e.g. UPSC CSE, Banking PO, Delhi Software Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <TextField
                fullWidth
                label="Keywords (Optional)"
                placeholder="e.g. Inspector, Officer, Developer, Teacher"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />

              <FormControl fullWidth size="small">
                <InputLabel id="sector-select-label">Sector</InputLabel>
                <Select
                  labelId="sector-select-label"
                  value={sector}
                  label="Sector"
                  onChange={(e) => setSector(e.target.value)}
                >
                  <MenuItem value="">All Sectors</MenuItem>
                  <MenuItem value={JobSector.CENTRAL_GOVERNMENT}>Central Government</MenuItem>
                  <MenuItem value={JobSector.STATE_GOVERNMENT}>State Government</MenuItem>
                  <MenuItem value={JobSector.UPSC_STATE_PSC}>UPSC & State PSC</MenuItem>
                  <MenuItem value={JobSector.SSC}>Staff Selection (SSC)</MenuItem>
                  <MenuItem value={JobSector.BANKING_INSURANCE}>Banking & Insurance</MenuItem>
                  <MenuItem value={JobSector.RAILWAYS}>Railways (RRB)</MenuItem>
                  <MenuItem value={JobSector.DEFENCE_PARAMILITARY}>Defence & Forces</MenuItem>
                  <MenuItem value={JobSector.PRIVATE_IT}>Private IT & Tech</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel id="state-select-label">Target State</InputLabel>
                <Select
                  labelId="state-select-label"
                  value={state}
                  label="Target State"
                  onChange={(e) => setState(e.target.value)}
                >
                  <MenuItem value="">All India</MenuItem>
                  {INDIAN_STATES_AND_UTS.map((st) => (
                    <MenuItem key={st} value={st}>{st}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel id="freq-select-label">Digest Frequency</InputLabel>
                <Select
                  labelId="freq-select-label"
                  value={frequency}
                  label="Digest Frequency"
                  onChange={(e) => setFrequency(e.target.value as any)}
                >
                  <MenuItem value={AlertFrequency.IMMEDIATE}>Immediate Notification</MenuItem>
                  <MenuItem value={AlertFrequency.DAILY_DIGEST}>Daily Morning Digest (09:00 AM)</MenuItem>
                  <MenuItem value={AlertFrequency.WEEKLY_DIGEST}>Weekly Digest (Every Monday)</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, borderTop: '1px solid #E6E6E6' }}>
            <Button onClick={() => setModalOpen(false)} sx={{ color: '#6B6B6B', fontWeight: 600 }}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#2563EB', fontWeight: 600, borderRadius: 20, '&:hover': { bgcolor: '#1D4ED8' } }}>
              Save Alert Preference
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  );
};
