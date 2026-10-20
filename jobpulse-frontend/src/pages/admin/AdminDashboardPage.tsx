import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Tabs,
  Tab,
  InputAdornment,
  Tooltip,
  Autocomplete
} from '@mui/material';
import {
  Sync as SyncIcon,
  Security as AdminIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  OpenInNew as OpenInNewIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  WorkOutline as WorkIcon,
  PostAdd as PostAddIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { adminApi, organizationsApi, categoriesApi } from '../../services/api/alerts.api.js';

// Pre-configured suggestions (User can pick ANY of these OR freely type/add custom ones - NOT predefined only)
export const INDIAN_STATES_AND_UTS = [
  'All India',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

export const COMMON_SECTORS = [
  'CENTRAL_GOVERNMENT',
  'STATE_GOVERNMENT',
  'UPSC_STATE_PSC',
  'SSC',
  'BANKING_INSURANCE',
  'RAILWAYS',
  'DEFENCE_PARAMILITARY',
  'PSU',
  'TEACHING_EDUCATION',
  'POLICE_SECURITY',
  'HEALTHCARE_PUBLIC',
  'JUDICIARY_LEGAL',
  'SPACE_RESEARCH',
  'PRIVATE_IT',
  'PRIVATE_FINANCE',
  'PRIVATE_ENGINEERING',
  'PRIVATE_HEALTHCARE',
  'PRIVATE_OTHER'
];

export const COMMON_EMPLOYMENT_TYPES = [
  'FULL_TIME',
  'REGULAR_GOVT_CADRE',
  'CONTRACTUAL_DEPUTATION',
  'APPRENTICESHIP',
  'INTERNSHIP',
  'PART_TIME',
  'PERMANENT_COMMISSION',
  'TEMPORARY'
];

export const COMMON_WORK_MODES = [
  'ON_SITE',
  'FIELD_DUTY',
  'HYBRID',
  'REMOTE'
];

export const SUGGESTED_QUALIFICATIONS = [
  '+2 Pass (Higher Secondary) in Arts/Science/Commerce',
  'Graduate / Bachelor Degree in Any Discipline',
  'B.E. / B.Tech in Engineering / Computer Science',
  '10th Standard / Matriculation Pass',
  'Diploma / Polytechnic (3 Years)',
  'ITI Certificate in Relevant Trade',
  'Post Graduate / Master Degree (MA / MSc / MCom / MBA)',
  'MBBS / BDS / BAMS / Medical Degree',
  'LLB / LLM (Law Degree)'
];

export const SUGGESTED_PAY_SCALES = [
  'Pay Level-4: ₹19,900 - ₹63,200',
  'Pay Level-7: ₹44,900 - ₹1,42,400',
  'Pay Level-9: ₹53,100 - ₹1,67,800',
  'Pay Level-10: ₹56,100 - ₹1,77,500',
  'PB-2: ₹9,300 - ₹34,800 + Grade Pay ₹4,200',
  'Consolidated Monthly Remuneration of ₹35,000/-',
  'Stipend of ₹12,000/- per month during apprenticeship'
];

export const AdminDashboardPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0); // 0: Overview, 1: Moderation Desk, 2: Registered Companies, 3: Categories
  const [createOpen, setCreateOpen] = useState(false);
  const [modalTab, setModalTab] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Organization Modal State
  const [addOrgOpen, setAddOrgOpen] = useState(false);
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);
  const [orgForm, setOrgForm] = useState({
    name: '',
    sector: 'CENTRAL_GOVERNMENT',
    category: '',
    headquartersState: 'All India',
    websiteUrl: '',
    officialNotificationDomain: '',
    description: '',
    logoUrl: ''
  });

  // New Category Modal State
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    iconName: 'Work'
  });

  // Filter & Search states
  const [orgSearch, setOrgSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [moderationSearch, setModerationSearch] = useState('');
  const [moderationSectorFilter, setModerationSectorFilter] = useState('ALL');
  const [moderationStatusFilter, setModerationStatusFilter] = useState('ALL');

  // Main Job Creation Form State (All fields support custom/addable values)
  const [form, setForm] = useState({
    title: '',
    summary: '',
    fullDescription: '',
    organizationId: '',
    categoryId: '',
    sector: 'CENTRAL_GOVERNMENT',
    employmentType: 'FULL_TIME',
    state: 'All India',
    city: '',
    isAllIndia: true,
    remoteType: 'ON_SITE',
    vacanciesCount: '',
    qualificationSummary: '',
    eligibilityCriteria: '',
    salaryCustomDisplay: '',
    selectionProcess: '',
    howToApply: '',
    applicationFee: '',
    applicationStartDate: '',
    applicationDeadline: '',
    applicationUrl: '',
    officialNotificationUrl: ''
  });

  // Queries
  const { data: orgs } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => organizationsApi.getOrganizations()
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getCategories()
  });

  const { data: metrics } = useQuery({
    queryKey: ['adminMetrics'],
    queryFn: () => adminApi.getDashboardMetrics()
  });

  const { data: adminJobs } = useQuery({
    queryKey: ['adminJobsList'],
    queryFn: () => adminApi.getAdminJobs({ limit: 50 })
  });

  // Trigger Provider Synchronization
  const handleTriggerSync = async () => {
    try {
      setSyncMessage('Initiating provider synchronization...');
      const res = await adminApi.triggerSourceSync('API_NOAUTH');
      setSyncMessage(
        `Synchronization completed: ${res.recordsFound} found, ${res.recordsIngested} ingested, ${res.recordsSkippedDuplicates} duplicate skipped.`
      );
      queryClient.invalidateQueries({ queryKey: ['adminMetrics'] });
      queryClient.invalidateQueries({ queryKey: ['adminJobsList'] });
    } catch (err: any) {
      setSyncMessage(`Sync execution error: ${err.message || 'Operation failed'}`);
    }
  };

  // Job Moderation Status Change
  const handleStatusChange = async (jobId: string, status: string) => {
    try {
      await adminApi.updateJobStatus(jobId, status);
      queryClient.invalidateQueries({ queryKey: ['adminJobsList'] });
      queryClient.invalidateQueries({ queryKey: ['adminMetrics'] });
    } catch (err: any) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  // Create Job Submission
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.organizationId) {
      alert('Please select or register a recruiting organization/company first.');
      return;
    }

    try {
      setIsSubmitting(true);
      await adminApi.createJob({
        ...form,
        vacanciesCount: form.vacanciesCount ? parseInt(form.vacanciesCount, 10) : undefined,
        applicationStartDate: form.applicationStartDate ? new Date(form.applicationStartDate).toISOString() : undefined,
        applicationDeadline: form.applicationDeadline ? new Date(form.applicationDeadline).toISOString() : undefined,
        isDemoData: false
      });

      setSyncMessage(`Successfully posted "${form.title}"! Vacancy is live on the public portal.`);
      setCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ['adminJobsList'] });
      queryClient.invalidateQueries({ queryKey: ['adminMetrics'] });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });

      // Reset form
      setForm({
        title: '',
        summary: '',
        fullDescription: '',
        organizationId: '',
        categoryId: '',
        sector: 'CENTRAL_GOVERNMENT',
        employmentType: 'FULL_TIME',
        state: 'All India',
        city: '',
        isAllIndia: true,
        remoteType: 'ON_SITE',
        vacanciesCount: '',
        qualificationSummary: '',
        eligibilityCriteria: '',
        salaryCustomDisplay: '',
        selectionProcess: '',
        howToApply: '',
        applicationFee: '',
        applicationStartDate: '',
        applicationDeadline: '',
        applicationUrl: '',
        officialNotificationUrl: ''
      });
    } catch (err: any) {
      alert(`Error creating job: ${err.message || 'Please check all required fields'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create New Organization Submission
  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgForm.name.trim()) {
      alert('Organization name is required.');
      return;
    }

    try {
      setIsCreatingOrg(true);
      const newOrg = await organizationsApi.createOrganization({
        name: orgForm.name.trim(),
        sector: orgForm.sector.trim() || 'CENTRAL_GOVERNMENT',
        category: orgForm.category.trim() || undefined,
        headquartersState: orgForm.headquartersState.trim() || 'All India',
        websiteUrl: orgForm.websiteUrl.trim() || undefined,
        officialNotificationDomain: orgForm.officialNotificationDomain.trim() || undefined,
        description: orgForm.description.trim() || undefined,
        logoUrl: orgForm.logoUrl.trim() || undefined
      });

      // Update query cache and automatically select this new organization in the job form!
      await queryClient.invalidateQueries({ queryKey: ['organizations'] });
      setForm((prev) => ({
        ...prev,
        organizationId: newOrg.id,
        sector: newOrg.sector || prev.sector,
        state: newOrg.headquartersState || prev.state
      }));

      setSyncMessage(`Organization "${newOrg.name}" successfully registered and selected!`);
      setAddOrgOpen(false);

      // Reset org form
      setOrgForm({
        name: '',
        sector: 'CENTRAL_GOVERNMENT',
        category: '',
        headquartersState: 'All India',
        websiteUrl: '',
        officialNotificationDomain: '',
        description: '',
        logoUrl: ''
      });
    } catch (err: any) {
      alert(`Failed to register organization: ${err.message}`);
    } finally {
      setIsCreatingOrg(false);
    }
  };

  // Create New Category Submission
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      alert('Category name is required.');
      return;
    }

    try {
      setIsCreatingCategory(true);
      const newCat = await categoriesApi.createCategory({
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim() || undefined,
        iconName: categoryForm.iconName || 'Work'
      });

      await queryClient.invalidateQueries({ queryKey: ['categories'] });
      setForm((prev) => ({ ...prev, categoryId: newCat.id }));
      setSyncMessage(`New category "${newCat.name}" successfully created and selected!`);
      setAddCategoryOpen(false);

      setCategoryForm({ name: '', description: '', iconName: 'Work' });
    } catch (err: any) {
      alert(`Failed to create category: ${err.message}`);
    } finally {
      setIsCreatingCategory(false);
    }
  };

  // Filtered organizations for the management table
  const filteredOrgs = orgs?.filter((o: any) => {
    if (!orgSearch) return true;
    const q = orgSearch.toLowerCase();
    return (
      o.name?.toLowerCase().includes(q) ||
      o.sector?.toLowerCase().includes(q) ||
      o.headquartersState?.toLowerCase().includes(q) ||
      o.websiteUrl?.toLowerCase().includes(q)
    );
  });

  // Filtered categories
  const filteredCategories = categories?.filter((c: any) => {
    if (!categorySearch) return true;
    const q = categorySearch.toLowerCase();
    return c.name?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q);
  });

  // Filtered jobs for moderation desk
  const filteredJobs = adminJobs?.data?.filter((job: any) => {
    if (moderationSectorFilter !== 'ALL' && job.sector !== moderationSectorFilter) {
      return false;
    }
    if (moderationStatusFilter !== 'ALL' && job.status !== moderationStatusFilter) {
      return false;
    }
    if (moderationSearch) {
      const q = moderationSearch.toLowerCase();
      const titleMatch = job.title?.toLowerCase().includes(q);
      const orgMatch = job.organization?.name?.toLowerCase().includes(q);
      return titleMatch || orgMatch;
    }
    return true;
  });

  // Recharts Chart Data
  const chartData = [
    { name: 'Active', count: metrics?.activeJobsCount || 0 },
    { name: 'Upcoming', count: metrics?.upcomingJobsCount || 0 },
    { name: 'Expired', count: metrics?.expiredJobsCount || 0 },
    { name: 'Pending Review', count: metrics?.pendingReviewCount || 0 }
  ];

  const pieColors = ['#1D6EE5', '#059669', '#64748B', '#D97706'];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3, md: 4 } }}>
      {/* Top Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <AdminIcon sx={{ color: '#1D6EE5', fontSize: 32 }} />
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Roboto', 'Inter', sans-serif",
                fontWeight: 800,
                color: '#0F2A4A',
                fontSize: { xs: '1.5rem', sm: '1.85rem' },
                letterSpacing: '-0.02em'
              }}
            >
              Editorial & Administration Console
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Select any registered company or add new ones on the fly. All types (companies, categories, sectors, employment types, locations) are completely dynamic and addable.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<SyncIcon />}
            onClick={handleTriggerSync}
            sx={{
              borderColor: '#CBD5E1',
              color: '#334155',
              borderRadius: 20,
              fontWeight: 600,
              fontSize: '0.84rem',
              textTransform: 'none',
              px: 2,
              '&:hover': { borderColor: '#1D6EE5', color: '#1D6EE5', bgcolor: '#F0F7FF' }
            }}
          >
            Run Source Sync
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setModalTab(0);
              setCreateOpen(true);
            }}
            sx={{
              bgcolor: '#1D6EE5',
              borderRadius: 20,
              fontWeight: 600,
              fontSize: '0.84rem',
              textTransform: 'none',
              px: 2.5,
              boxShadow: '0 2px 8px rgba(29, 110, 229, 0.25)',
              '&:hover': { bgcolor: '#1558C0' }
            }}
          >
            Post New Vacancy
          </Button>
        </Stack>
      </Box>

      {/* Sync Status Banner */}
      {syncMessage && (
        <Alert
          severity="info"
          onClose={() => setSyncMessage(null)}
          sx={{ mb: 3, borderRadius: '8px', border: '1px solid #BFDBFE' }}
        >
          {syncMessage}
        </Alert>
      )}

      {/* Main Console Navigation Tabs */}
      <Paper sx={{ mb: 3, borderRadius: '10px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', boxShadow: 'none' }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          sx={{
            px: 2,
            minHeight: 48,
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '0.875rem',
              textTransform: 'none',
              minHeight: 48,
              py: 1,
              px: 2.5,
              color: '#64748B',
              '&.Mui-selected': {
                color: '#1D6EE5'
              }
            },
            '& .MuiTabs-indicator': {
              bgcolor: '#1D6EE5',
              height: 3,
              borderRadius: '3px 3px 0 0'
            }
          }}
        >
          <Tab label="1. Overview & Analytics" />
          <Tab label={`2. Job Moderation Desk (${adminJobs?.data?.length || 0})`} />
          <Tab label={`3. Registered Companies & Agencies (${orgs?.length || 0})`} />
          <Tab label={`4. Job Categories & Streams (${categories?.length || 0})`} />
        </Tabs>
      </Paper>

      {/* ========================================================================= */}
      {/* TAB 0: OVERVIEW & ANALYTICS                                               */}
      {/* ========================================================================= */}
      {activeTab === 0 && (
        <>
          {/* Metrics Counter Cards */}
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2.5, borderRadius: '10px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', boxShadow: 'none' }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                  Live Active Notices
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mt: 0.5 }}>
                  {metrics?.activeJobsCount ?? '-'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>
                  Published and accepting applications
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2.5, borderRadius: '10px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', boxShadow: 'none' }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                  Upcoming Gazettes
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mt: 0.5 }}>
                  {metrics?.upcomingJobsCount ?? '-'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#1D6EE5', fontWeight: 600 }}>
                  Opening in next 30 days
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2.5, borderRadius: '10px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', boxShadow: 'none' }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                  Registered Organizations
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mt: 0.5 }}>
                  {orgs?.length ?? metrics?.verifiedOrganizationsCount ?? '-'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                  Commissions, PSUs, Govt Bodies & Companies
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2.5, borderRadius: '10px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', boxShadow: 'none' }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                  Active Job Alerts
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mt: 0.5 }}>
                  {metrics?.totalAlertsActive ?? '-'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>
                  Candidate subscriptions
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Charts Row */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={7}>
              <Paper sx={{ p: 3, borderRadius: '10px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', boxShadow: 'none', height: 340 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 2, fontSize: '1rem' }}>
                  Notices Lifecycle Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                    <YAxis stroke="#64748B" fontSize={12} />
                    <RechartsTooltip />
                    <Bar dataKey="count" fill="#1D6EE5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 3, borderRadius: '10px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', boxShadow: 'none', height: 340 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 1, fontSize: '1rem' }}>
                  Status Share
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" outerRadius={80} dataKey="count" label={(e) => `${e.name}: ${e.count}`}>
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: JOB MODERATION DESK                                                */}
      {/* ========================================================================= */}
      {activeTab === 1 && (
        <Paper sx={{ p: 3.5, borderRadius: '10px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', boxShadow: 'none', mb: 4 }}>
          {/* Header & Filters */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F2A4A', fontSize: '1.2rem' }}>
                Job Moderation & Publishing Desk
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                Filter and review active recruitment notices, update publication state, or archive expired examinations.
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => {
                setModalTab(0);
                setCreateOpen(true);
              }}
              sx={{ bgcolor: '#1D6EE5', borderRadius: 20, textTransform: 'none', fontWeight: 600, px: 2 }}
            >
              Post Vacancy
            </Button>
          </Box>

          {/* Quick Filter Bar */}
          <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search notices or organizations..."
              value={moderationSearch}
              onChange={(e) => setModerationSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94A3B8', fontSize: 18 }} />
                  </InputAdornment>
                )
              }}
              sx={{ minWidth: 260, '& .MuiOutlinedInput-root': { borderRadius: '6px' } }}
            />

            <TextField
              select
              size="small"
              label="Filter Sector"
              value={moderationSectorFilter}
              onChange={(e) => setModerationSectorFilter(e.target.value)}
              sx={{ minWidth: 180, '& .MuiOutlinedInput-root': { borderRadius: '6px' } }}
            >
              <MenuItem value="ALL">All Sectors</MenuItem>
              {COMMON_SECTORS.map((s) => (
                <MenuItem key={s} value={s}>
                  {s.replace(/_/g, ' ')}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              label="Filter Status"
              value={moderationStatusFilter}
              onChange={(e) => setModerationStatusFilter(e.target.value)}
              sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { borderRadius: '6px' } }}
            >
              <MenuItem value="ALL">All Statuses</MenuItem>
              <MenuItem value="PUBLISHED">Published</MenuItem>
              <MenuItem value="UPCOMING">Upcoming</MenuItem>
              <MenuItem value="PENDING_REVIEW">Pending Review</MenuItem>
              <MenuItem value="CLOSED">Closed</MenuItem>
              <MenuItem value="ARCHIVED">Archived</MenuItem>
            </TextField>
          </Box>

          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>Job Notice Title</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>Recruiting Organization</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>Sector</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>Current Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B', textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredJobs?.map((job: any) => (
                  <TableRow key={job.id} hover>
                    <TableCell sx={{ fontWeight: 600, color: '#0F172A', maxWidth: 360 }}>
                      {job.title}
                      {job.vacanciesCount && (
                        <Typography variant="caption" sx={{ display: 'block', color: '#64748B' }}>
                          Vacancies: {job.vacanciesCount.toLocaleString()} posts
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ color: '#475569', fontWeight: 500 }}>{job.organization?.name || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={job.sector?.replace(/_/g, ' ')}
                        size="small"
                        sx={{ fontSize: '0.72rem', bgcolor: '#F1F5F9', color: '#334155', fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={job.status}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.72rem',
                          bgcolor: job.status === 'PUBLISHED' ? '#EFF6FF' : '#F1F5F9',
                          color: job.status === 'PUBLISHED' ? '#1D6EE5' : '#475569',
                          border: job.status === 'PUBLISHED' ? '1px solid #BFDBFE' : '1px solid #E2E8F0'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {job.status !== 'PUBLISHED' && (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleStatusChange(job.id, 'PUBLISHED')}
                            sx={{ bgcolor: '#059669', borderRadius: 20, fontSize: '0.75rem', px: 1.75, py: 0.25, '&:hover': { bgcolor: '#047857' } }}
                          >
                            Publish
                          </Button>
                        )}
                        {job.status === 'PUBLISHED' && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleStatusChange(job.id, 'CLOSED')}
                            sx={{ borderColor: '#CBD5E1', color: '#334155', borderRadius: 20, fontSize: '0.75rem', px: 1.5, py: 0.25 }}
                          >
                            Close
                          </Button>
                        )}
                        <Button
                          size="small"
                          onClick={() => handleStatusChange(job.id, 'ARCHIVED')}
                          sx={{ color: '#64748B', fontSize: '0.75rem', borderRadius: 20, '&:hover': { color: '#0F172A', bgcolor: '#F1F5F9' } }}
                        >
                          Archive
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: REGISTERED COMPANIES & AGENCIES (User can select OR add new)       */}
      {/* ========================================================================= */}
      {activeTab === 2 && (
        <Paper sx={{ p: 3.5, borderRadius: '10px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', boxShadow: 'none', mb: 4 }}>
          {/* Header & Search / Add New Company bar */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              mb: 3
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F2A4A', fontSize: '1.25rem' }}>
                Registered Companies & Recruiting Agencies
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                All registered organizations are select-able when posting vacancies. You can dynamically register any new company or government authority.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                size="small"
                placeholder="Search registered companies..."
                value={orgSearch}
                onChange={(e) => setOrgSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#94A3B8', fontSize: 18 }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  width: { xs: '100%', sm: 260 },
                  '& .MuiOutlinedInput-root': { borderRadius: '6px' }
                }}
              />

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddOrgOpen(true)}
                sx={{
                  bgcolor: '#1D6EE5',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  textTransform: 'none',
                  px: 2,
                  whiteSpace: 'nowrap',
                  '&:hover': { bgcolor: '#1558C0' }
                }}
              >
                + Add New Company
              </Button>
            </Stack>
          </Box>

          {/* Companies Table */}
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>Company / Organization Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>Sector / Domain</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>Headquarters / Region</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>Official Website</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B', textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrgs?.map((org: any) => (
                  <TableRow key={org.id} hover>
                    <TableCell sx={{ fontWeight: 700, color: '#0F2A4A' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon sx={{ color: '#1D6EE5', fontSize: 18 }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F2A4A' }}>
                          {org.name}
                        </Typography>
                      </Box>
                      {org.description && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#64748B',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            maxWidth: 380,
                            mt: 0.25
                          }}
                        >
                          {org.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={org.sector?.replace(/_/g, ' ')}
                        size="small"
                        sx={{ fontSize: '0.72rem', bgcolor: '#F1F5F9', color: '#334155', fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#475569', fontSize: '0.875rem' }}>
                      {org.headquartersState || 'All India'}
                    </TableCell>
                    <TableCell>
                      {org.websiteUrl ? (
                        <Button
                          component="a"
                          href={org.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                          endIcon={<OpenInNewIcon sx={{ fontSize: '13px !important' }} />}
                          sx={{
                            fontSize: '0.78rem',
                            color: '#1D6EE5',
                            textTransform: 'none',
                            p: 0,
                            minWidth: 0,
                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                          }}
                        >
                          {org.officialNotificationDomain || 'Visit Portal'}
                        </Button>
                      ) : (
                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                          Not specified
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<CheckCircleIcon sx={{ fontSize: '13px !important', color: '#059669 !important' }} />}
                        label="Verified"
                        size="small"
                        sx={{
                          fontSize: '0.72rem',
                          bgcolor: '#ECFDF5',
                          color: '#059669',
                          border: '1px solid #A7F3D0',
                          fontWeight: 600
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<PostAddIcon sx={{ fontSize: 15 }} />}
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            organizationId: org.id,
                            sector: org.sector || prev.sector,
                            state: org.headquartersState || prev.state
                          }));
                          setModalTab(0);
                          setCreateOpen(true);
                        }}
                        sx={{
                          fontSize: '0.75rem',
                          borderColor: '#BFDBFE',
                          color: '#1D6EE5',
                          borderRadius: '6px',
                          textTransform: 'none',
                          fontWeight: 600,
                          py: 0.4,
                          px: 1.5,
                          '&:hover': { bgcolor: '#F0F7FF', borderColor: '#1D6EE5' }
                        }}
                      >
                        Post Vacancy
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: REGISTERED JOB CATEGORIES & STREAMS                                */}
      {/* ========================================================================= */}
      {activeTab === 3 && (
        <Paper sx={{ p: 3.5, borderRadius: '10px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', boxShadow: 'none', mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              mb: 3
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F2A4A', fontSize: '1.25rem' }}>
                Job Categories & Functional Streams
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                Organize recruitment drives by specialization. All categories can be selected or newly created dynamically.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5}>
              <TextField
                size="small"
                placeholder="Search categories..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#94A3B8', fontSize: 18 }} />
                    </InputAdornment>
                  )
                }}
                sx={{ width: { xs: '100%', sm: 240 }, '& .MuiOutlinedInput-root': { borderRadius: '6px' } }}
              />

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddCategoryOpen(true)}
                sx={{
                  bgcolor: '#1D6EE5',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  textTransform: 'none',
                  px: 2,
                  whiteSpace: 'nowrap',
                  '&:hover': { bgcolor: '#1558C0' }
                }}
              >
                + Add New Category
              </Button>
            </Stack>
          </Box>

          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>Category Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>URL Identifier (Slug)</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B', textAlign: 'right' }}>Quick Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCategories?.map((cat: any) => (
                  <TableRow key={cat.id} hover>
                    <TableCell sx={{ fontWeight: 700, color: '#0F2A4A' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CategoryIcon sx={{ color: '#1D6EE5', fontSize: 18 }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F2A4A' }}>
                          {cat.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#64748B', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                      {cat.slug}
                    </TableCell>
                    <TableCell sx={{ color: '#475569', fontSize: '0.85rem', maxWidth: 400 }}>
                      {cat.description || 'General recruitment stream'}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, categoryId: cat.id }));
                          setModalTab(0);
                          setCreateOpen(true);
                        }}
                        sx={{
                          fontSize: '0.75rem',
                          borderColor: '#BFDBFE',
                          color: '#1D6EE5',
                          borderRadius: '6px',
                          textTransform: 'none',
                          fontWeight: 600,
                          py: 0.4,
                          px: 1.5,
                          '&:hover': { bgcolor: '#F0F7FF', borderColor: '#1D6EE5' }
                        }}
                      >
                        Post in this Category
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ========================================================================= */}
      {/* DIALOG 1: ADD NEW ORGANIZATION / COMPANY MODAL (All fields addable)       */}
      {/* ========================================================================= */}
      <Dialog
        open={addOrgOpen}
        onClose={() => setAddOrgOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '10px', p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessIcon sx={{ color: '#1D6EE5' }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F2A4A', fontSize: '1.2rem' }}>
              Register New Organization or Company
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setAddOrgOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <Box component="form" onSubmit={handleCreateOrganization}>
          <DialogContent sx={{ pt: 1 }}>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 2.5 }}>
              Add any government commission, public sector undertaking, or private enterprise. It will immediately be registered into the database and available for vacancy creation.
            </Typography>

            <Stack spacing={2.5}>
              <TextField
                label="Company / Organization Name"
                required
                fullWidth
                placeholder="e.g. Bharat Electronics Limited (BEL) or Tata Motors"
                value={orgForm.name}
                onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
              />

              <Grid container spacing={2}>
                {/* Sector: Autocomplete with freeSolo so user can pick or type custom sector! */}
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    freeSolo
                    options={COMMON_SECTORS}
                    value={orgForm.sector}
                    onChange={(_, val) => setOrgForm({ ...orgForm, sector: val || 'CENTRAL_GOVERNMENT' })}
                    onInputChange={(_, val) => setOrgForm({ ...orgForm, sector: val || '' })}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Recruitment Sector *"
                        required
                        helperText="Select or type custom sector"
                      />
                    )}
                  />
                </Grid>

                {/* Headquarters State: Autocomplete with freeSolo */}
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    freeSolo
                    options={INDIAN_STATES_AND_UTS}
                    value={orgForm.headquartersState}
                    onChange={(_, val) => setOrgForm({ ...orgForm, headquartersState: val || 'All India' })}
                    onInputChange={(_, val) => setOrgForm({ ...orgForm, headquartersState: val || '' })}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Headquarters State"
                        helperText="Select state or type custom zone"
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Official Website URL"
                    fullWidth
                    placeholder="e.g. https://bel-india.in"
                    value={orgForm.websiteUrl}
                    onChange={(e) => setOrgForm({ ...orgForm, websiteUrl: e.target.value })}
                  />
                </Grid>

                {/* Category / Industry: Autocomplete with freeSolo */}
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    freeSolo
                    options={(categories || []).map((c: any) => c.name)}
                    value={orgForm.category}
                    onChange={(_, val) => setOrgForm({ ...orgForm, category: val || '' })}
                    onInputChange={(_, val) => setOrgForm({ ...orgForm, category: val || '' })}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Industry / Category"
                        placeholder="e.g. Defence & Aerospace, IT, Banking"
                        helperText="Select or type custom industry"
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <TextField
                label="Organization Description / Mandate"
                fullWidth
                multiline
                rows={3}
                placeholder="Brief overview of the organization and recruitment mandate..."
                value={orgForm.description}
                onChange={(e) => setOrgForm({ ...orgForm, description: e.target.value })}
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setAddOrgOpen(false)} sx={{ color: '#64748B' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isCreatingOrg}
              sx={{
                bgcolor: '#1D6EE5',
                borderRadius: '6px',
                fontWeight: 600,
                px: 3,
                '&:hover': { bgcolor: '#1558C0' }
              }}
            >
              {isCreatingOrg ? 'Registering...' : 'Register & Select Company'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG 2: ADD NEW CATEGORY MODAL                                          */}
      {/* ========================================================================= */}
      <Dialog
        open={addCategoryOpen}
        onClose={() => setAddCategoryOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '10px', p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CategoryIcon sx={{ color: '#1D6EE5' }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F2A4A' }}>
              Add New Job Category
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setAddCategoryOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <Box component="form" onSubmit={handleCreateCategory}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                label="Category Name"
                required
                fullWidth
                placeholder="e.g. Judicial & Legal Services or AI & Data Science"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={2}
                placeholder="Brief description of examinations in this category..."
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setAddCategoryOpen(false)} sx={{ color: '#64748B' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isCreatingCategory}
              sx={{ bgcolor: '#1D6EE5', borderRadius: '6px', fontWeight: 600 }}
            >
              {isCreatingCategory ? 'Creating...' : 'Create Category'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG 3: POST NEW VERIFIED VACANCY (All dynamic & addable fields)        */}
      {/* ========================================================================= */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '10px', overflow: 'hidden' }
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: '#0F2A4A',
            color: '#FFFFFF',
            py: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: 700, fontSize: '1.15rem' }}>
              Post New Verified Vacancy
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '11px' }}>
              Select registered company or add new company; all sectors, types, and locations are completely customizable.
            </Typography>
          </Box>
          <IconButton onClick={() => setCreateOpen(false)} sx={{ color: '#FFFFFF' }} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#F8FAFC' }}>
          <Tabs
            value={modalTab}
            onChange={(_, val) => setModalTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 44,
              '& .MuiTab-root': {
                fontFamily: "'Open Sans', sans-serif",
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                minHeight: 44,
                py: 1
              }
            }}
          >
            <Tab label="1. General & Scope" />
            <Tab label="2. Who Can Apply" />
            <Tab label="3. Pay & Tenure" />
            <Tab label="4. Selection & Steps" />
            <Tab label="5. Dates & Links" />
          </Tabs>
        </Box>

        <form onSubmit={handleCreateJob}>
          <DialogContent dividers sx={{ p: 3, maxHeight: '65vh' }}>
            {/* Tab 0: General & Scope */}
            {modalTab === 0 && (
              <Stack spacing={2.5}>
                <TextField
                  label="Job Title / Notice Name"
                  required
                  fullWidth
                  placeholder="e.g. OSSSC Panchayat Executive Officer (PEO) & JA Combined Exam 2026"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />

                {/* Recruiting Organization with searchable Autocomplete & [+ Add New Company] button */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                    <Typography component="label" sx={{ fontSize: '0.84rem', fontWeight: 600, color: '#334155' }}>
                      Recruiting Organization / Company *
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<AddIcon sx={{ fontSize: '14px !important' }} />}
                      onClick={() => setAddOrgOpen(true)}
                      sx={{
                        fontSize: '0.78rem',
                        color: '#1D6EE5',
                        textTransform: 'none',
                        fontWeight: 700,
                        p: 0,
                        '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                      }}
                    >
                      + Add New Company
                    </Button>
                  </Box>

                  <Autocomplete
                    options={orgs || []}
                    getOptionLabel={(option: any) =>
                      typeof option === 'string'
                        ? option
                        : `${option.name} (${(option.sector || '').replace(/_/g, ' ')})${option.headquartersState ? ` — ${option.headquartersState}` : ''}`
                    }
                    value={orgs?.find((o: any) => o.id === form.organizationId) || null}
                    onChange={(_, selected: any) => {
                      if (selected) {
                        setForm({
                          ...form,
                          organizationId: selected.id,
                          sector: selected.sector || form.sector,
                          state: selected.headquartersState || form.state
                        });
                      } else {
                        setForm({ ...form, organizationId: '' });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        placeholder="Type or select registered company / authority..."
                        helperText="Select from registered list above or click '+ Add New Company' to register a new one"
                      />
                    )}
                  />
                </Box>

                {/* Category Selection with [+ Add Category] */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                    <Typography component="label" sx={{ fontSize: '0.84rem', fontWeight: 600, color: '#334155' }}>
                      Job Category / Functional Stream
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<AddIcon sx={{ fontSize: '14px !important' }} />}
                      onClick={() => setAddCategoryOpen(true)}
                      sx={{
                        fontSize: '0.78rem',
                        color: '#1D6EE5',
                        textTransform: 'none',
                        fontWeight: 700,
                        p: 0,
                        '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                      }}
                    >
                      + Add Category
                    </Button>
                  </Box>

                  <Autocomplete
                    options={categories || []}
                    getOptionLabel={(option: any) => (typeof option === 'string' ? option : option.name)}
                    value={categories?.find((c: any) => c.id === form.categoryId) || null}
                    onChange={(_, selected: any) => {
                      setForm({ ...form, categoryId: selected ? selected.id : '' });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Search or select category (optional)..."
                        helperText="Select category or click '+ Add Category' to create one"
                      />
                    )}
                  />
                </Box>

                {/* Sector and Employment Type: BOTH Autocomplete with freeSolo so NOT predefined only! */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      freeSolo
                      options={COMMON_SECTORS}
                      value={form.sector}
                      onChange={(_, val) => setForm({ ...form, sector: val || 'CENTRAL_GOVERNMENT' })}
                      onInputChange={(_, val) => setForm({ ...form, sector: val || '' })}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Sector / Governance *"
                          required
                          helperText="Pick standard sector or type custom sector"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      freeSolo
                      options={COMMON_EMPLOYMENT_TYPES}
                      value={form.employmentType}
                      onChange={(_, val) => setForm({ ...form, employmentType: val || 'FULL_TIME' })}
                      onInputChange={(_, val) => setForm({ ...form, employmentType: val || '' })}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Employment / Appointment Type *"
                          required
                          helperText="Select or type custom appointment type"
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                {/* Location & Remote Type: BOTH with freeSolo */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      freeSolo
                      options={INDIAN_STATES_AND_UTS}
                      value={form.state}
                      onChange={(_, val) => setForm({ ...form, state: val || 'All India' })}
                      onInputChange={(_, val) => setForm({ ...form, state: val || '' })}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="State / Region *"
                          helperText="Select state/UT or type custom zone/region"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      freeSolo
                      options={COMMON_WORK_MODES}
                      value={form.remoteType}
                      onChange={(_, val) => setForm({ ...form, remoteType: val || 'ON_SITE' })}
                      onInputChange={(_, val) => setForm({ ...form, remoteType: val || '' })}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Work Mode / Posting Type"
                          helperText="On-Site, Field Duty, Border Post, Hybrid, Remote"
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="City / Headquarters Location"
                      fullWidth
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="e.g. Bhubaneswar, New Delhi, Bengaluru"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Total Vacancies Count"
                      type="number"
                      fullWidth
                      value={form.vacanciesCount}
                      onChange={(e) => setForm({ ...form, vacanciesCount: e.target.value })}
                      placeholder="e.g. 6862"
                    />
                  </Grid>
                </Grid>

                <TextField
                  label="Short Headline Summary"
                  required
                  fullWidth
                  multiline
                  rows={2}
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="Concise overview of the vacancy for listing cards and search snippets."
                />

                <TextField
                  label="Full Official Gazette Description & Scope"
                  required
                  fullWidth
                  multiline
                  rows={4}
                  value={form.fullDescription}
                  onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
                  placeholder="Detailed notification announcement, scope, responsibilities, and commission instructions."
                />
              </Stack>
            )}

            {/* Tab 1: Who Can Apply */}
            {modalTab === 1 && (
              <Stack spacing={2.5}>
                <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0F2A4A', display: 'block', textTransform: 'uppercase' }}>
                    Section Anchor ID: #who-can-apply
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    Displays educational eligibility, age boundaries, relaxation criteria, and domicile conditions.
                  </Typography>
                </Box>

                {/* Quick Add Qualification Chips */}
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569', display: 'block', mb: 1 }}>
                    Quick Pre-fill Suggestions (Click to apply or type custom):
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {SUGGESTED_QUALIFICATIONS.map((q) => (
                      <Chip
                        key={q}
                        label={q}
                        size="small"
                        clickable
                        onClick={() => setForm({ ...form, qualificationSummary: q })}
                        sx={{ fontSize: '0.75rem', bgcolor: '#F1F5F9', '&:hover': { bgcolor: '#E2E8F0' } }}
                      />
                    ))}
                  </Box>
                </Box>

                <TextField
                  label="Educational Qualification Summary"
                  required
                  fullWidth
                  value={form.qualificationSummary}
                  onChange={(e) => setForm({ ...form, qualificationSummary: e.target.value })}
                  placeholder="e.g. +2 Pass (Higher Secondary) in Arts/Science/Commerce or Graduate Degree"
                />

                <TextField
                  label="Detailed Eligibility Criteria & Age Limits"
                  fullWidth
                  multiline
                  rows={6}
                  value={form.eligibilityCriteria}
                  onChange={(e) => setForm({ ...form, eligibilityCriteria: e.target.value })}
                  placeholder="Age Limit: 21 to 38 years as on 1st January. Upper age relaxation: 5 years for SC/ST/SEBC/Women, 10 years for PwD..."
                />
              </Stack>
            )}

            {/* Tab 2: Pay & Tenure */}
            {modalTab === 2 && (
              <Stack spacing={2.5}>
                <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0F2A4A', display: 'block', textTransform: 'uppercase' }}>
                    Section Anchor ID: #pay-and-tenure
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    Defines pay matrix, scale of pay, grade pay, and appointment tenure.
                  </Typography>
                </Box>

                {/* Quick Add Pay Scale Chips */}
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569', display: 'block', mb: 1 }}>
                    Common Pay Scales (Click to apply or enter custom):
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {SUGGESTED_PAY_SCALES.map((p) => (
                      <Chip
                        key={p}
                        label={p}
                        size="small"
                        clickable
                        onClick={() => setForm({ ...form, salaryCustomDisplay: p })}
                        sx={{ fontSize: '0.75rem', bgcolor: '#F1F5F9', '&:hover': { bgcolor: '#E2E8F0' } }}
                      />
                    ))}
                  </Box>
                </Box>

                <TextField
                  label="Remuneration / Pay Scale Display"
                  fullWidth
                  value={form.salaryCustomDisplay}
                  onChange={(e) => setForm({ ...form, salaryCustomDisplay: e.target.value })}
                  placeholder="e.g. Pay Level-4: ₹19,900 - ₹63,200 (Basic ₹19,900 + DA, HRA, Medical Allowance)"
                />
              </Stack>
            )}

            {/* Tab 3: Selection & Steps */}
            {modalTab === 3 && (
              <Stack spacing={2.5}>
                <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0F2A4A', display: 'block', textTransform: 'uppercase' }}>
                    Section Anchor ID: #selection-process & #how-to-apply
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    Step-by-step examination stages, physical standard tests, and application protocol.
                  </Typography>
                </Box>

                <TextField
                  label="Selection Process Scheme"
                  fullWidth
                  multiline
                  rows={4}
                  value={form.selectionProcess}
                  onChange={(e) => setForm({ ...form, selectionProcess: e.target.value })}
                  placeholder="Single Stage Written Examination (OMR/MCQ - 180 Marks) + Basic Computer Skills Test (50 Marks) + Document Verification."
                />

                <TextField
                  label="How to Apply Protocol (Step-by-Step Instructions)"
                  fullWidth
                  multiline
                  rows={4}
                  value={form.howToApply}
                  onChange={(e) => setForm({ ...form, howToApply: e.target.value })}
                  placeholder="1. Visit official recruitment portal. 2. Complete One Time Registration (OTR). 3. Upload photo and certificates. 4. Submit application."
                />

                <TextField
                  label="Application Fee Structure"
                  fullWidth
                  value={form.applicationFee}
                  onChange={(e) => setForm({ ...form, applicationFee: e.target.value })}
                  placeholder="e.g. ₹0 (Free / No examination fee for any category of candidate) or ₹100 for General/OBC"
                />
              </Stack>
            )}

            {/* Tab 4: Dates & Links */}
            {modalTab === 4 && (
              <Stack spacing={2.5}>
                <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0F2A4A', display: 'block', textTransform: 'uppercase' }}>
                    Section Anchor ID: #important-dates & #important-links
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    Crucial timeline, official application portal, and authorized gazette PDF URLs.
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Application Start Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={form.applicationStartDate}
                      onChange={(e) => setForm({ ...form, applicationStartDate: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Application Deadline (Closing Date)"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={form.applicationDeadline}
                      onChange={(e) => setForm({ ...form, applicationDeadline: e.target.value })}
                    />
                  </Grid>
                </Grid>

                <TextField
                  label="Official Application URL"
                  fullWidth
                  placeholder="e.g. https://www.osssc.gov.in"
                  value={form.applicationUrl}
                  onChange={(e) => setForm({ ...form, applicationUrl: e.target.value })}
                />

                <TextField
                  label="Official Gazette / Detailed PDF URL"
                  fullWidth
                  placeholder="e.g. https://www.osssc.gov.in/Public/Pages/Post_detail_information.aspx"
                  value={form.officialNotificationUrl}
                  onChange={(e) => setForm({ ...form, officialNotificationUrl: e.target.value })}
                />
              </Stack>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2.5, bgcolor: '#F8FAFC', display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              {modalTab > 0 && (
                <Button
                  onClick={() => setModalTab((t) => t - 1)}
                  sx={{ color: '#64748B', fontWeight: 600, textTransform: 'none' }}
                >
                  Back
                </Button>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                onClick={() => setCreateOpen(false)}
                sx={{ color: '#64748B', fontWeight: 600, textTransform: 'none' }}
              >
                Cancel
              </Button>

              {modalTab < 4 ? (
                <Button
                  variant="outlined"
                  onClick={() => setModalTab((t) => t + 1)}
                  sx={{
                    borderColor: '#1D6EE5',
                    color: '#1D6EE5',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '6px'
                  }}
                >
                  Next Section →
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    bgcolor: '#1D6EE5',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: '6px',
                    px: 3,
                    '&:hover': { bgcolor: '#1558C0' }
                  }}
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Verified Notice'}
                </Button>
              )}
            </Box>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};
