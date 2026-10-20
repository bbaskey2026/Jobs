import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Stack,
  MenuItem,
  Link
} from '@mui/material';
import {
  UploadFile as UploadIcon,
  PictureAsPdf as PdfIcon,
  Save as SaveIcon,
  OpenInNew as OpenInNewIcon,
  CheckCircle as CheckCircleIcon
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
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { data: profileData } = useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const res = await apiClient.get('/profile');
      const p = res.data.data;
      if (p) {
        setPhoneNumber(p.phoneNumber || '');
        setState(p.state || '');
        setCity(p.city || '');
        setCurrentEducation(p.currentEducation || '');
        setExperienceYears(p.experienceYears || 0);
        setBio(p.bio || '');
      }
      return p;
    }
  });

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
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
    } finally {
      setIsSaving(false);
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
      setIsUploading(true);
      setUploadError(null);
      const formData = new FormData();
      formData.append('resume', file);
      await apiClient.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload resume.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', width: '100%', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 5, lg: 6 } }}>
        {/* Editorial Header (Plain in Place, no box) */}
        <Box sx={{ pb: 2.5, mb: 4, borderBottom: '1px solid #E6E6E6' }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2.1rem', md: '2.4rem' },
              color: '#1a1a1a',
              letterSpacing: '-0.02em',
              mb: 0.75
            }}
          >
            Candidate Profile & Resume
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Open Sans', sans-serif",
              color: '#4B5563',
              fontSize: '15px',
              lineHeight: 1.6,
              maxWidth: 820
            }}
          >
            Keep your qualifications, preferred states, and resume up to date for precise job alert matching and direct applications.
          </Typography>
        </Box>

        {/* Feedback Alerts (Plain in place) */}
        {savedSuccess && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              py: 1.25,
              px: 2,
              mb: 3,
              bgcolor: '#ECFDF5',
              borderLeft: '4px solid #10B981',
              color: '#065F46'
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 18, color: '#10B981' }} />
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: '14px', fontWeight: 600 }}>
              Profile details updated successfully!
            </Typography>
          </Box>
        )}

        {uploadError && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              py: 1.25,
              px: 2,
              mb: 3,
              bgcolor: '#FEF2F2',
              borderLeft: '4px solid #EF4444',
              color: '#991B1B'
            }}
          >
            <Typography sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: '14px', fontWeight: 600 }}>
              {uploadError}
            </Typography>
          </Box>
        )}

        {/* Main Content: Split Columns (Plain in Place without boxes or cards) */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* LEFT COLUMN: Personal & Education Details */}
          <Box
            sx={{
              flex: { xs: '1', md: '1.25' },
              pr: { md: 5, lg: 6 },
              borderRight: { md: '1px solid #E6E6E6' },
              borderBottom: { xs: '1px solid #E6E6E6', md: 'none' },
              pb: { xs: 4, md: 0 },
              mb: { xs: 4, md: 0 }
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 700,
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                color: '#0d3b66',
                mb: 2.5
              }}
            >
              Personal & Education Details
            </Typography>

            <Box component="form" onSubmit={handleProfileSave}>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  size="small"
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  InputProps={{
                    sx: { fontFamily: "'Open Sans', sans-serif", fontSize: '14.5px' }
                  }}
                  InputLabelProps={{
                    sx: { fontFamily: "'Open Sans', sans-serif" }
                  }}
                />

                <TextField
                  fullWidth
                  size="small"
                  label="Registered Email Address"
                  disabled
                  value={user?.email || ''}
                  helperText="Primary email cannot be changed directly."
                  InputProps={{
                    sx: { fontFamily: "'Open Sans', sans-serif", fontSize: '14.5px', bgcolor: '#F9FAFB' }
                  }}
                  InputLabelProps={{
                    sx: { fontFamily: "'Open Sans', sans-serif" }
                  }}
                />

                <TextField
                  fullWidth
                  size="small"
                  label="Mobile Contact Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="10-digit Indian mobile number"
                  InputProps={{
                    sx: { fontFamily: "'Open Sans', sans-serif", fontSize: '14.5px' }
                  }}
                  InputLabelProps={{
                    sx: { fontFamily: "'Open Sans', sans-serif" }
                  }}
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Home State / Domicile"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      InputProps={{
                        sx: { fontFamily: "'Open Sans', sans-serif", fontSize: '14.5px' }
                      }}
                      InputLabelProps={{
                        sx: { fontFamily: "'Open Sans', sans-serif" }
                      }}
                    >
                      <MenuItem value="">None / Not Specified</MenuItem>
                      {INDIAN_STATES_AND_UTS.map((st) => (
                        <MenuItem key={st} value={st}>
                          {st}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="City / District"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai, Pune, Lucknow..."
                      InputProps={{
                        sx: { fontFamily: "'Open Sans', sans-serif", fontSize: '14.5px' }
                      }}
                      InputLabelProps={{
                        sx: { fontFamily: "'Open Sans', sans-serif" }
                      }}
                    />
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  size="small"
                  label="Highest Qualification / Degree"
                  value={currentEducation}
                  onChange={(e) => setCurrentEducation(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science, B.Com, MA History, 12th Pass..."
                  InputProps={{
                    sx: { fontFamily: "'Open Sans', sans-serif", fontSize: '14.5px' }
                  }}
                  InputLabelProps={{
                    sx: { fontFamily: "'Open Sans', sans-serif" }
                  }}
                />

                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Years of Experience"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  InputProps={{
                    sx: { fontFamily: "'Open Sans', sans-serif", fontSize: '14.5px' }
                  }}
                  InputLabelProps={{
                    sx: { fontFamily: "'Open Sans', sans-serif" }
                  }}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Candidate Bio / Target Opportunities"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Brief summary of target examinations, cadres, or career domains..."
                  InputProps={{
                    sx: { fontFamily: "'Open Sans', sans-serif", fontSize: '14.5px' }
                  }}
                  InputLabelProps={{
                    sx: { fontFamily: "'Open Sans', sans-serif" }
                  }}
                />

                <Box sx={{ pt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSaving}
                    startIcon={<SaveIcon sx={{ fontSize: '16px !important' }} />}
                    sx={{
                      bgcolor: '#0d3b66',
                      color: '#FFFFFF',
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: '13px',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '4px',
                      px: 3,
                      py: 1,
                      '&:hover': {
                        bgcolor: '#0f2a4a'
                      }
                    }}
                  >
                    {isSaving ? 'Saving Changes...' : 'Save Profile Details'}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Box>

          {/* RIGHT COLUMN: Resume / Curriculum Vitae */}
          <Box
            sx={{
              flex: { xs: '1', md: '0.9' },
              pl: { md: 5, lg: 6 }
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: 700,
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                color: '#0d3b66',
                mb: 1
              }}
            >
              Resume & Documents
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                color: '#64748B',
                fontSize: '13.5px',
                lineHeight: 1.55,
                mb: 3
              }}
            >
              Upload your updated resume or curriculum vitae in PDF or Word format (Maximum 5MB).
            </Typography>

            {/* Active Resume Status (Plain in Place, no box card) */}
            {profileData?.resumeFileName ? (
              <Box sx={{ py: 2, borderBottom: '1px solid #EEEEEE', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1 }}>
                  <PdfIcon sx={{ color: '#0d3b66', fontSize: 32, flexShrink: 0, mt: 0.2 }} />
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle2"
                      noWrap
                      sx={{
                        fontFamily: "'Roboto', sans-serif",
                        fontWeight: 700,
                        fontSize: '15px',
                        color: '#1a1a1a',
                        lineHeight: 1.3
                      }}
                    >
                      {profileData.resumeFileName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10B981' }} />
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "'Open Sans', sans-serif",
                          fontWeight: 600,
                          color: '#059669',
                          fontSize: '12px'
                        }}
                      >
                        Active Candidate Resume
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {profileData.resumeUrl && (
                  <Box sx={{ pl: 5.5, mt: 1 }}>
                    <Link
                      href={profileData.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      sx={{
                        fontFamily: "'Open Sans', sans-serif",
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#0d3b66',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        '&:hover': { color: '#0f2a4a' }
                      }}
                    >
                      View / Download Uploaded Document
                      <OpenInNewIcon sx={{ fontSize: 14 }} />
                    </Link>
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ py: 2, borderBottom: '1px solid #EEEEEE', mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    color: '#64748B',
                    fontSize: '13.5px'
                  }}
                >
                  No resume uploaded yet. Upload a copy to easily attach credentials with your job applications.
                </Typography>
              </Box>
            )}

            {/* Upload Button */}
            <Box>
              <Button
                variant="outlined"
                component="label"
                disabled={isUploading}
                startIcon={<UploadIcon sx={{ fontSize: '16px !important' }} />}
                sx={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: '13px',
                  fontWeight: 600,
                  textTransform: 'none',
                  border: '1px solid #0d3b66',
                  color: '#0d3b66',
                  borderRadius: '4px',
                  px: 2.5,
                  py: 0.8,
                  '&:hover': {
                    border: '1px solid #0d3b66',
                    bgcolor: 'rgba(13, 59, 102, 0.05)',
                    color: '#0d3b66'
                  }
                }}
              >
                {isUploading ? 'Uploading Resume...' : profileData?.resumeFileName ? 'Replace Existing Resume' : 'Upload Resume File'}
                <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
