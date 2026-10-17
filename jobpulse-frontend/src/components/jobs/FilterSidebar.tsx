import React from 'react';
import {
  Paper,
  Typography,
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  Stack
} from '@mui/material';
import { FilterList as FilterIcon, RestartAlt as ResetIcon } from '@mui/icons-material';
import { INDIAN_STATES_AND_UTS, QUALIFICATION_LEVELS, JobSector } from '@jobpulse/shared';

interface FilterSidebarProps {
  filters: any;
  onChange: (newFilters: any) => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onChange, onReset }) => {
  const handleChange = (field: string, value: any) => {
    onChange({ ...filters, [field]: value, page: 1 });
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #E6E6E6', bgcolor: '#FFFFFF', boxShadow: 'none' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterIcon sx={{ mr: 1, color: '#2563EB', fontSize: 19 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.9375rem', color: '#000000' }}>
            Filter Opportunities
          </Typography>
        </Box>
        <Button
          size="small"
          startIcon={<ResetIcon sx={{ fontSize: 15 }} />}
          onClick={onReset}
          sx={{ color: '#6B6B6B', fontWeight: 600, fontSize: '0.75rem', px: 1, '&:hover': { color: '#2563EB', bgcolor: '#EFF6FF' } }}
        >
          Reset
        </Button>
      </Box>

      <Divider sx={{ mb: 2.5, borderColor: '#E6E6E6' }} />

      <Stack spacing={2.5}>
        {/* Keyword Search */}
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#242424', mb: 0.75, display: 'block', fontSize: '0.75rem', letterSpacing: '0.02em' }}>
            KEYWORD / ROLE
          </Typography>
          <TextField
            fullWidth
            placeholder="e.g. Officer, Engineer, Clerk..."
            value={filters.q || ''}
            onChange={(e) => handleChange('q', e.target.value)}
          />
        </Box>

        {/* Sector Filter */}
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#242424', mb: 0.75, display: 'block', fontSize: '0.75rem', letterSpacing: '0.02em' }}>
            SECTOR / CLASSIFICATION
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={filters.sector || ''}
              onChange={(e) => handleChange('sector', e.target.value)}
              displayEmpty
            >
              <MenuItem value="">All Sectors (Govt & Private)</MenuItem>
              <MenuItem value={JobSector.CENTRAL_GOVERNMENT}>Central Government</MenuItem>
              <MenuItem value={JobSector.STATE_GOVERNMENT}>State Government</MenuItem>
              <MenuItem value={JobSector.UPSC_STATE_PSC}>UPSC & State PSC</MenuItem>
              <MenuItem value={JobSector.SSC}>Staff Selection (SSC)</MenuItem>
              <MenuItem value={JobSector.BANKING_INSURANCE}>Banking & Insurance</MenuItem>
              <MenuItem value={JobSector.RAILWAYS}>Railways (RRB)</MenuItem>
              <MenuItem value={JobSector.DEFENCE_PARAMILITARY}>Defence & Paramilitary</MenuItem>
              <MenuItem value={JobSector.PSU}>Public Sector (PSU)</MenuItem>
              <MenuItem value={JobSector.TEACHING_EDUCATION}>Teaching & Research</MenuItem>
              <MenuItem value={JobSector.POLICE_SECURITY}>Police & Security</MenuItem>
              <MenuItem value={JobSector.PRIVATE_IT}>Private IT & Tech</MenuItem>
              <MenuItem value={JobSector.PRIVATE_FINANCE}>Private Banking & Finance</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* State / UT */}
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#242424', mb: 0.75, display: 'block', fontSize: '0.75rem', letterSpacing: '0.02em' }}>
            STATE / LOCATION
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={filters.state || ''}
              onChange={(e) => handleChange('state', e.target.value)}
              displayEmpty
            >
              <MenuItem value="">All India (Any Location)</MenuItem>
              {INDIAN_STATES_AND_UTS.map((st) => (
                <MenuItem key={st} value={st}>
                  {st}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Qualification */}
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#242424', mb: 0.75, display: 'block', fontSize: '0.75rem', letterSpacing: '0.02em' }}>
            MINIMUM QUALIFICATION
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={filters.qualification || ''}
              onChange={(e) => handleChange('qualification', e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Any Qualification</MenuItem>
              {QUALIFICATION_LEVELS.map((q) => (
                <MenuItem key={q} value={q}>
                  {q}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Quick Toggles */}
        <Box sx={{ pt: 0.5 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(filters.hasOfficialNotification)}
                onChange={(e) => handleChange('hasOfficialNotification', e.target.checked ? 'true' : undefined)}
                size="small"
                sx={{ color: '#6B6B6B', '&.Mui-checked': { color: '#2563EB' } }}
              />
            }
            label={<Typography variant="body2" sx={{ fontWeight: 500, color: '#242424', fontSize: '0.84rem' }}>Official PDF Available</Typography>}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.deadlineApproachingDays === 7}
                onChange={(e) => handleChange('deadlineApproachingDays', e.target.checked ? 7 : undefined)}
                size="small"
                sx={{ color: '#6B6B6B', '&.Mui-checked': { color: '#2563EB' } }}
              />
            }
            label={<Typography variant="body2" sx={{ fontWeight: 500, color: '#242424', fontSize: '0.84rem' }}>Closing in Next 7 Days</Typography>}
          />
        </Box>
      </Stack>
    </Paper>
  );
};
