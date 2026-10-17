import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Stack,
  MenuItem
} from '@mui/material';
import {
  UploadFile as UploadIcon,
  PictureAsPdf as PdfIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api/client.js';
import { useAuthStore } from '../../stores/auth.store.js';
import { INDIAN_STATES_AND_UTS } from '@jobpulse/shared';

export const ProfilePage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.profile?.phoneNumber || '');
  const [state, setState] = useState(user?.profile?.state || '');
  const [city, setCity] = useState(user?.profile?.city || '');
  const [currentEducation, setCurrentEducation] = useState(user?.profile?.currentEducation || '');
  const [experienceYears, setExperienceYears] = useState(user?.profile?.experienceYears || 0);
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { data: profileData } = useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const res = await apiClient.get('/profile');
      const p = res.data.data;
      setPhoneNumber(p.phoneNumber || '');
      setState(p.state || '');
      setCity(p.city || '');
      setCurrentEducation(p.currentEducation || '');
      setExperienceYears(p.experienceYears || 0);
      setBio(p.bio || '');
      return p;
    }
  });

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.put('/profile', {
        fullName,
        phoneNumber,
        state,
        city,
        currentEducation,
        experienceYears: Number(experienceYears),
        bio
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    } catch {
      // ignore
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File exceeds 5MB size limit.');
      return;
    }

    try {
      setUploadError(null);
      const formData = new FormData();
      formData.append('resume', file);
      await apiClient.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload resume.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h3" sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 800, color: '#000000', mb: 0.5, fontSize: { xs: '1.6rem', md: '2rem' } }}>
        Candidate Profile & Resume
      </Typography>
      <Typography variant="body1" sx={{ color: '#6B6B6B', mb: 4 }}>
        Keep your qualifications, preferred states, and resume up to date for precise job alert matching.
      </Typography>

      {savedSuccess && <Alert severity="success" sx={{ mb: 3, border: '1px solid #E6E6E6', borderRadius: 2 }}>Profile details saved successfully!</Alert>}
      {uploadError && <Alert severity="error" sx={{ mb: 3, border: '1px solid #E6E6E6', borderRadius: 2 }}>{uploadError}</Alert>}

      <Grid container spacing={4}>
        {/* Profile Details Form */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2, border: '1px solid #E6E6E6', boxShadow: 'none', bgcolor: '#FFFFFF' }}>
            <Typography variant="h5" sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 700, color: '#000000', mb: 3, fontSize: '1.15rem' }}>
              Personal & Education Details
            </Typography>

            <Box component="form" onSubmit={handleProfileSave}>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />

                <TextField
                  fullWidth
                  label="Registered Email"
                  disabled
                  value={user?.email || ''}
                  helperText="Email cannot be changed directly."
                />

                <TextField
                  fullWidth
                  label="Mobile Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="10-digit Indian phone number"
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    >
                      <MenuItem value="">None</MenuItem>
                      {INDIAN_STATES_AND_UTS.map((st) => (
                        <MenuItem key={st} value={st}>{st}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City / District"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  label="Highest Qualification / Degree"
                  value={currentEducation}
                  onChange={(e) => setCurrentEducation(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science, B.Com, MA History..."
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Years of Experience"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Candidate Bio / Aspirations"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Brief summary of target examinations and careers..."
                />

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{ bgcolor: '#2563EB', py: 1, px: 3, fontWeight: 600, borderRadius: 20, alignSelf: 'flex-start', '&:hover': { bgcolor: '#1D4ED8' } }}
                >
                  Save Profile
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Grid>

        {/* Resume & Documents */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2, border: '1px solid #E6E6E6', boxShadow: 'none', bgcolor: '#FFFFFF', mb: 4 }}>
            <Typography variant="h5" sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 700, color: '#000000', mb: 1, fontSize: '1.15rem' }}>
              Resume / CV
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B6B6B', mb: 3 }}>
              Upload your updated resume in PDF or Word format (Maximum 5MB).
            </Typography>

            {profileData?.resumeFileName ? (
              <Box sx={{ p: 2, bgcolor: '#F7F7F7', borderRadius: 1.5, border: '1px solid #E6E6E6', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PdfIcon sx={{ color: '#2563EB', mr: 1.5, fontSize: 28 }} />
                  <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                    <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700, color: '#000000' }}>
                      {profileData.resumeFileName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6B6B6B' }}>
                      Active Candidate Resume
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#F7F7F7', borderRadius: 1.5, border: '1px dashed #E6E6E6', mb: 3 }}>
                <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                  No resume uploaded yet.
                </Typography>
              </Box>
            )}

            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<UploadIcon />}
              sx={{ fontWeight: 600, borderRadius: 20, borderColor: '#E6E6E6', color: '#2563EB', '&:hover': { borderColor: '#2563EB', bgcolor: '#EFF6FF' } }}
            >
              Upload New Resume
              <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
