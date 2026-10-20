import { PrismaClient } from '@prisma/client';
import { JobSector, JobStatus, EmploymentType, VerificationStatus } from '@jobpulse/shared';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding rich state-wise jobs across all post types...');

  const today = new Date();
  const deadline30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const deadline20Days = new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000);
  const deadline15Days = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000);
  const deadline45Days = new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000);

  // 1. Ensure categories exist or fetch
  const allCats = await prisma.jobCategory.findMany();
  const catMap = new Map<string, string>();
  for (const c of allCats) {
    catMap.set(c.slug, c.id);
  }
  const defaultCatId = allCats[0]?.id;

  // 2. State Recruitment Bodies & Organizations
  const stateOrgs = [
    {
      name: 'Maharashtra Public Service Commission (MPSC)',
      slug: 'mpsc-maharashtra',
      sector: JobSector.UPSC_STATE_PSC,
      websiteUrl: 'https://mpsc.gov.in',
      officialNotificationDomain: 'mpsc.gov.in',
      description: 'Constitutional body established by Constitution of India to select candidates for civil services in Maharashtra.',
      headquartersState: 'Maharashtra',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'Maharashtra State Police (MahaPolice)',
      slug: 'mahapolice-recruitment',
      sector: JobSector.POLICE_SECURITY,
      websiteUrl: 'https://mahapolice.gov.in',
      officialNotificationDomain: 'mahapolice.gov.in',
      description: 'Law enforcement agency responsible for maintaining peace and security throughout Maharashtra.',
      headquartersState: 'Maharashtra',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'MAHATRANSCO (Maharashtra State Electricity Transmission)',
      slug: 'mahatransco-careers',
      sector: JobSector.PSU,
      websiteUrl: 'https://www.mahatransco.in',
      officialNotificationDomain: 'mahatransco.in',
      description: 'Wholly owned corporate entity of Govt of Maharashtra handling statewide power transmission.',
      headquartersState: 'Maharashtra',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'Uttar Pradesh Public Service Commission (UPPSC)',
      slug: 'uppsc-uttar-pradesh',
      sector: JobSector.UPSC_STATE_PSC,
      websiteUrl: 'https://uppsc.up.nic.in',
      officialNotificationDomain: 'uppsc.up.nic.in',
      description: 'State agency authorized to conduct the Civil Services Examination for entry-level appointments to Group A and Group B civil services of UP.',
      headquartersState: 'Uttar Pradesh',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'Uttar Pradesh Police Recruitment & Promotion Board (UPPRPB)',
      slug: 'upprpb-police',
      sector: JobSector.POLICE_SECURITY,
      websiteUrl: 'https://uppbpb.gov.in',
      officialNotificationDomain: 'uppbpb.gov.in',
      description: 'Statutory board for direct recruitment of Sub-Inspectors, Constables, and Firemen in UP Police.',
      headquartersState: 'Uttar Pradesh',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'UP Basic Education Board (UPBEB)',
      slug: 'upbeb-teachers',
      sector: JobSector.TEACHING_EDUCATION,
      websiteUrl: 'https://updeled.gov.in',
      officialNotificationDomain: 'updeled.gov.in',
      description: 'State educational authority managing primary, upper primary, and assistant teacher recruitments.',
      headquartersState: 'Uttar Pradesh',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'Delhi Subordinate Services Selection Board (DSSSB)',
      slug: 'dsssb-delhi',
      sector: JobSector.STATE_GOVERNMENT,
      websiteUrl: 'https://dsssb.delhi.gov.in',
      officialNotificationDomain: 'dsssb.delhi.gov.in',
      description: 'Recruits staff for NCT Delhi Government departments, Municipal Corporation, and Directorate of Education.',
      headquartersState: 'Delhi',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'Delhi Police Recruitment Cell',
      slug: 'delhi-police-cell',
      sector: JobSector.POLICE_SECURITY,
      websiteUrl: 'https://delhipolice.gov.in',
      officialNotificationDomain: 'delhipolice.gov.in',
      description: 'Premier law enforcement agency for National Capital Territory of Delhi under Ministry of Home Affairs.',
      headquartersState: 'Delhi',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'Karnataka Public Service Commission (KPSC)',
      slug: 'kpsc-karnataka',
      sector: JobSector.UPSC_STATE_PSC,
      websiteUrl: 'https://kpsc.kar.nic.in',
      officialNotificationDomain: 'kpsc.kar.nic.in',
      description: 'State recruitment commission conducting Gazetted Probationers and state department examinations in Karnataka.',
      headquartersState: 'Karnataka',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'Karnataka State Police (KSP)',
      slug: 'ksp-police',
      sector: JobSector.POLICE_SECURITY,
      websiteUrl: 'https://ksp.karnataka.gov.in',
      officialNotificationDomain: 'ksp.karnataka.gov.in',
      description: 'Law enforcement authority for the state of Karnataka managing Civil and Armed Police units.',
      headquartersState: 'Karnataka',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'Bangalore Metro Rail Corporation Limited (BMRCL)',
      slug: 'bmrcl-namma-metro',
      sector: JobSector.PSU,
      websiteUrl: 'https://english.bmrc.co.in',
      officialNotificationDomain: 'bmrc.co.in',
      description: 'Joint venture of Government of India and Government of Karnataka operating Namma Metro.',
      headquartersState: 'Karnataka',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'Bihar Public Service Commission (BPSC)',
      slug: 'bpsc-bihar',
      sector: JobSector.UPSC_STATE_PSC,
      websiteUrl: 'https://bpsc.bih.nic.in',
      officialNotificationDomain: 'bpsc.bih.nic.in',
      description: 'Selects applicants for administrative and civil service positions in the State of Bihar.',
      headquartersState: 'Bihar',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'Bihar State Power Holding Company (BSPHCL)',
      slug: 'bsphcl-bihar',
      sector: JobSector.PSU,
      websiteUrl: 'https://bsphcl.co.in',
      officialNotificationDomain: 'bsphcl.co.in',
      description: 'State-owned electricity generation, transmission and distribution holding company in Bihar.',
      headquartersState: 'Bihar',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'Tamil Nadu Public Service Commission (TNPSC)',
      slug: 'tnpsc-tamil-nadu',
      sector: JobSector.UPSC_STATE_PSC,
      websiteUrl: 'https://tnpsc.gov.in',
      officialNotificationDomain: 'tnpsc.gov.in',
      description: 'Conducts examinations for recruitment to Group I, II, III, and IV services of Tamil Nadu.',
      headquartersState: 'Tamil Nadu',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'Tamil Nadu Uniformed Services Recruitment Board (TNUSRB)',
      slug: 'tnusrb-recruitment',
      sector: JobSector.POLICE_SECURITY,
      websiteUrl: 'https://tnusrb.tn.gov.in',
      officialNotificationDomain: 'tnusrb.tn.gov.in',
      description: 'Recruits Sub-Inspectors, Police Constables, Jail Warders, and Firemen across Tamil Nadu.',
      headquartersState: 'Tamil Nadu',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'West Bengal Public Service Commission (WBPSC)',
      slug: 'wbpsc-west-bengal',
      sector: JobSector.UPSC_STATE_PSC,
      websiteUrl: 'https://psc.wb.gov.in',
      officialNotificationDomain: 'psc.wb.gov.in',
      description: 'Conducts West Bengal Civil Service (WBCS Executive) and Judicial Examinations.',
      headquartersState: 'West Bengal',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'Rajasthan Public Service Commission (RPSC)',
      slug: 'rpsc-rajasthan',
      sector: JobSector.UPSC_STATE_PSC,
      websiteUrl: 'https://rpsc.rajasthan.gov.in',
      officialNotificationDomain: 'rpsc.rajasthan.gov.in',
      description: 'Selects officers for Rajasthan Administrative Service (RAS), RPS, and School Lecturers.',
      headquartersState: 'Rajasthan',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'Gujarat Public Service Commission (GPSC)',
      slug: 'gpsc-gujarat',
      sector: JobSector.UPSC_STATE_PSC,
      websiteUrl: 'https://gpsc.gujarat.gov.in',
      officialNotificationDomain: 'gpsc.gujarat.gov.in',
      description: 'Conducts civil services and administrative examinations for the Government of Gujarat.',
      headquartersState: 'Gujarat',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'Kerala Public Service Commission (Kerala PSC)',
      slug: 'kerala-psc-thiruvananthapuram',
      sector: JobSector.UPSC_STATE_PSC,
      websiteUrl: 'https://keralapsc.gov.in',
      officialNotificationDomain: 'keralapsc.gov.in',
      description: 'Constitutional recruitment body for selecting candidates for civil service jobs in Kerala.',
      headquartersState: 'Kerala',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'National Health Mission (NHM State Units)',
      slug: 'nhm-health-mission',
      sector: JobSector.HEALTHCARE_PUBLIC,
      websiteUrl: 'https://nhm.gov.in',
      officialNotificationDomain: 'nhm.gov.in',
      description: 'Government healthcare initiative recruiting Community Health Officers (CHOs), Medical Officers, and Staff Nurses.',
      headquartersState: 'All India',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'Infosys Limited (Careers)',
      slug: 'infosys-technologies',
      sector: JobSector.PRIVATE_IT,
      websiteUrl: 'https://www.infosys.com/careers',
      description: 'Global leader in next-generation digital services and consulting.',
      headquartersState: 'Karnataka',
      verificationStatus: VerificationStatus.VERIFIED
    }
  ];

  const orgMap = new Map<string, string>();
  for (const org of stateOrgs) {
    const created = await prisma.organization.upsert({
      where: { slug: org.slug },
      update: {},
      create: org
    });
    orgMap.set(org.slug, created.id);
  }
  console.log('Seeded state recruitment organizations');

  // 3. State-Specific Post Data across All Post Types
  const stateJobs = [
    // ----------------- MAHARASHTRA -----------------
    {
      title: 'MPSC Maharashtra State Services Gazetted Exam 2026',
      slug: 'mpsc-state-services-exam-2026',
      summary: 'Recruitment for Deputy Collector, DySP, Tehsildar, and Group A/B Administrative posts.',
      fullDescription: 'Maharashtra Public Service Commission invites applications for Civil Services Gazetted Examination for recruitment to Class 1 & 2 posts in General Administration, Revenue, and Police.',
      organizationId: orgMap.get('mpsc-maharashtra')!,
      department: 'General Administration Department',
      sector: JobSector.UPSC_STATE_PSC,
      categoryId: catMap.get('civil-services') || defaultCatId,
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 524,
      state: 'Maharashtra',
      city: 'Mumbai',
      isAllIndia: false,
      qualificationSummary: 'Degree of a Statutory University in Any Discipline; Knowledge of Marathi essential',
      experienceMin: 0,
      salaryCustomDisplay: 'Pay Matrix Level S-15 to S-20 (₹56,100 to ₹1,77,500)',
      publishDate: today,
      applicationDeadline: deadline30Days,
      status: JobStatus.PUBLISHED,
      officialNotificationUrl: 'https://mpsc.gov.in/notices',
      applicationUrl: 'https://mpsconline.gov.in',
      isDemoData: true
    },
    {
      title: 'Maharashtra Police Sub-Inspector (PSI) & Constable Recruitment 2026',
      slug: 'maharashtra-police-psi-constable-2026',
      summary: 'Recruitment of 17,471 Police Constables, Drivers, and Sub-Inspectors across Maharashtra Commissionerates.',
      fullDescription: 'Maharashtra State Police announces mega recruitment drive for Police Constable, SRPF Armed Constable, and Police Sub-Inspectors. Physical fitness test and written exam.',
      organizationId: orgMap.get('mahapolice-recruitment')!,
      department: 'Home Department (Police)',
      sector: JobSector.POLICE_SECURITY,
      categoryId: catMap.get('police-security') || defaultCatId,
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 17471,
      state: 'Maharashtra',
      city: 'Mumbai / Pune / Nagpur',
      isAllIndia: false,
      qualificationSummary: '12th Pass (Higher Secondary) for Constables; Degree for Sub-Inspector',
      experienceMin: 0,
      salaryCustomDisplay: 'Pay Level S-7 (₹21,700 - ₹69,100) + Allowances',
      publishDate: today,
      applicationDeadline: deadline20Days,
      status: JobStatus.PUBLISHED,
      officialNotificationUrl: 'https://mahapolice.gov.in/recruitment',
      applicationUrl: 'https://policerecruitment2026.mahait.org',
      isDemoData: true
    },
    {
      title: 'MAHATRANSCO Assistant Engineer (Transmission & Civil) 2026',
      slug: 'mahatransco-assistant-engineer-2026',
      summary: 'Recruitment of 350 Assistant Engineers (Electrical, Telecommunication, and Civil).',
      fullDescription: 'Maharashtra State Electricity Transmission Company Ltd seeks qualified graduate engineers for substation transmission engineering and project commissioning.',
      organizationId: orgMap.get('mahatransco-careers')!,
      department: 'Transmission Projects & Substation Operations',
      sector: JobSector.PSU,
      categoryId: catMap.get('engineering-tech') || defaultCatId,
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 350,
      state: 'Maharashtra',
      city: 'Nagpur / Pune',
      isAllIndia: false,
      qualificationSummary: 'B.E. / B.Tech in Electrical / Electronics & Telecomm / Civil Engineering',
      experienceMin: 0,
      salaryCustomDisplay: '₹49,210 - ₹1,19,315 per month (Gross approx ₹85,000/mo)',
      publishDate: today,
      applicationDeadline: deadline30Days,
      status: JobStatus.PUBLISHED,
      officialNotificationUrl: 'https://www.mahatransco.in/careers',
      applicationUrl: 'https://ibpsonline.ibps.in/msetcl2026',
      isDemoData: true
    },
    {
      title: 'Maharashtra NHM Community Health Officers (CHO) 2026',
      slug: 'maharashtra-nhm-community-health-officers-2026',
      summary: 'Recruitment of 1,200 CHOs at Health & Wellness Centers across rural districts.',
      fullDescription: 'National Health Mission Maharashtra invites BAMS / B.Sc Nursing graduates for appointment as Community Health Officers at Sub-Center Health & Wellness Centers.',
      organizationId: orgMap.get('nhm-health-mission')!,
      department: 'Public Health Department',
      sector: JobSector.HEALTHCARE_PUBLIC,
      categoryId: catMap.get('healthcare-nursing') || defaultCatId,
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 1200,
      state: 'Maharashtra',
      city: 'District Hospitals & PHCs',
      isAllIndia: false,
      qualificationSummary: 'B.Sc in Nursing / Post Basic B.Sc Nursing or BAMS from a recognized institution',
      experienceMin: 0,
      salaryCustomDisplay: '₹25,000 Base Salary + ₹15,000 Performance Based Incentive (₹40,000/mo)',
      publishDate: today,
      applicationDeadline: deadline15Days,
      status: JobStatus.PUBLISHED,
      officialNotificationUrl: 'https://arogya.maharashtra.gov.in',
      applicationUrl: 'https://nhm.maharashtra.gov.in',
      isDemoData: true
    },

    // ----------------- UTTAR PRADESH -----------------
    {
      title: 'UPPSC Combined State / Upper Subordinate Services (PCS) 2026',
      slug: 'uppsc-combined-state-pcs-exam-2026',
      summary: 'Recruitment for Sub Divisional Magistrate (SDM), DSP, BDO, and ARTO posts in UP.',
      fullDescription: 'Uttar Pradesh Public Service Commission releases PCS 2026 notification for recruitment to executive and administrative posts in UP state government.',
      organizationId: orgMap.get('uppsc-uttar-pradesh')!,
      department: 'Appointments & Personnel',
      sector: JobSector.UPSC_STATE_PSC,
      categoryId: catMap.get('civil-services') || defaultCatId,
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 220,
      state: 'Uttar Pradesh',
      city: 'Prayagraj / Lucknow',
      isAllIndia: false,
      qualificationSummary: 'Bachelor\'s Degree in any discipline from a recognized university',
      experienceMin: 0,
      salaryCustomDisplay: 'Pay Matrix Level 10 (₹56,100) to Level 7 (₹44,900)',
      publishDate: today,
      applicationDeadline: deadline30Days,
      status: JobStatus.PUBLISHED,
      officialNotificationUrl: 'https://uppsc.up.nic.in/notices',
      applicationUrl: 'https://uppsc.up.nic.in',
      isDemoData: true
    },
    {
      title: 'UP Police Constable & Sub-Inspector Mega Recruitment 2026',
      slug: 'up-police-constable-si-recruitment-2026',
      summary: 'Selection of 60,244 Civil Police Constables, PAC Constables, and Fire Service personnel.',
      fullDescription: 'UPPRPB conducts direct recruitment for 60,244 posts of Constable Civil Police. Written exam (OMR based) followed by Document Verification and Physical Standard Test (PST).',
      organizationId: orgMap.get('upprpb-police')!,
      department: 'Uttar Pradesh Police Headquarters',
      sector: JobSector.POLICE_SECURITY,
      categoryId: catMap.get('police-security') || defaultCatId,
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 60244,
      state: 'Uttar Pradesh',
      city: 'All 75 Districts',
      isAllIndia: false,
      qualificationSummary: 'Intermediate (10+2) Pass or equivalent examination recognized by UP Board',
      experienceMin: 0,
      salaryCustomDisplay: 'Pay Band 5200-20200, Grade Pay 2000 (Pay Matrix Level-3: ₹21,700 - ₹69,100)',
      publishDate: today,
      applicationDeadline: deadline15Days,
      status: JobStatus.PUBLISHED,
      officialNotificationUrl: 'https://uppbpb.gov.in/notice',
      applicationUrl: 'https://ccp123.onlinereg.co.in',
      isDemoData: true
    },
    {
      title: 'UP Assistant Teacher / Primary Teacher Recruitment (Super TET) 2026',
      slug: 'up-assistant-teacher-super-tet-2026',
      summary: 'Recruitment of 17,000 Assistant Teachers in Parishadiya Primary Schools across UP.',
      fullDescription: 'Uttar Pradesh Basic Education Board invites eligible UPTET / CTET qualified candidates for Assistant Teacher recruitment in government primary schools.',
      organizationId: orgMap.get('upbeb-teachers')!,
      department: 'Department of Basic Education',
      sector: JobSector.TEACHING_EDUCATION,
      categoryId: catMap.get('teaching-research') || defaultCatId,
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 17000,
      state: 'Uttar Pradesh',
      city: 'Statewide',
      isAllIndia: false,
      qualificationSummary: 'Graduation + 2-Yr D.El.Ed / B.Ed + Qualified UPTET / CTET Paper-I',
      experienceMin: 0,
      salaryCustomDisplay: 'Grade Pay ₹4200 (Gross Salary approx ₹42,000 - ₹46,000/mo)',
      publishDate: today,
      applicationDeadline: deadline45Days,
      status: JobStatus.PUBLISHED,
      officialNotificationUrl: 'https://updeled.gov.in',
      applicationUrl: 'https://updeled.gov.in',
      isDemoData: true
    },

    // ----------------- DELHI -----------------
    {
      title: 'DSSSB Assistant Teacher (Nursery & Primary) & PGT Special Educator 2026',
      slug: 'dsssb-teachers-special-educator-2026',
      summary: 'Recruitment of 1,455 Assistant Teachers and PGT lecturers in Delhi Directorate of Education.',
      fullDescription: 'Delhi Subordinate Services Selection Board announces online recruitment for Assistant Teacher (Nursery), Special Education Teacher, and PGT subject specialists in MCD & GNCTD schools.',
      organizationId: orgMap.get('dsssb-delhi')!,
      department: 'Directorate of Education, GNCTD',
      sector: JobSector.TEACHING_EDUCATION,
      categoryId: catMap.get('teaching-research') || defaultCatId,
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 1455,
      state: 'Delhi',
      city: 'New Delhi',
      isAllIndia: false,
      qualificationSummary: 'Senior Secondary (Class 12) + Diploma in Nursery Teacher Education / D.El.Ed + CTET',
      experienceMin: 0,
      salaryCustomDisplay: 'Pay Level 6 (₹35,400 - ₹1,12,400) + HRA & DA',
      publishDate: today,
      applicationDeadline: deadline20Days,
      status: JobStatus.PUBLISHED,
      officialNotificationUrl: 'https://dsssb.delhi.gov.in/notifications',
      applicationUrl: 'https://dsssbonline.nic.in',
      isDemoData: true
    },
    {
      title: 'Delhi Police Constable (Executive) Recruitment 2026',
      slug: 'delhi-police-constable-executive-2026',
      summary: 'Direct recruitment of 7,547 Male & Female Constables (Executive) in Delhi Police.',
      fullDescription: 'Recruitment examination conducted jointly by SSC & Delhi Police for Constables (Executive). Computer-based examination followed by Physical Endurance and Measurement Test (PE&MT).',
      organizationId: orgMap.get('delhi-police-cell')!,
      department: 'Ministry of Home Affairs / Delhi Police',
      sector: JobSector.POLICE_SECURITY,
      categoryId: catMap.get('police-security') || defaultCatId,
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 7547,
      state: 'Delhi',
      city: 'New Delhi',
      isAllIndia: true,
      qualificationSummary: '10+2 (Senior Secondary) passed from a recognized board; Valid LMV Driving License for male candidates',
      experienceMin: 0,
      salaryCustomDisplay: 'Pay Level 3 (₹21,700 - ₹69,100) + Central Govt allowances',
      publishDate: today,
      applicationDeadline: deadline30Days,
      status: JobStatus.PUBLISHED,
      officialNotificationUrl: 'https://delhipolice.gov.in',
      applicationUrl: 'https://ssc.gov.in',
      isDemoData: true
    },

    // ----------------- KARNATAKA -----------------
    {
      title: 'KPSC Gazetted Probationers (KAS) Preliminary Examination 2026',
      slug: 'kpsc-gazetted-probationers-kas-2026',
      summary: 'Recruitment for Assistant Commissioner, DySP, Commercial Tax Officer, and Tahsildar.',
      fullDescription: 'Karnataka Public Service Commission invites online applications from eligible candidates for Group A and Group B Gazetted Probationers recruitment.',
      organizationId: orgMap.get('kpsc-karnataka')!,
      department: 'Department of Personnel & Administrative Reforms (DPAR)',
      sector: JobSector.UPSC_STATE_PSC,
      categoryId: catMap.get('civil-services') || defaultCatId,
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 384,
      state: 'Karnataka',
      city: 'Bengaluru / Mysuru / Hubballi',
      isAllIndia: false,
      qualificationSummary: 'Bachelor\'s Degree or Master\'s Degree in Any Discipline; Kannada language proficiency',
      experienceMin: 0,
      salaryCustomDisplay: 'Pay Scale ₹52,650 - ₹97,100 (Class 1) & ₹43,100 - ₹83,900 (Class 2)',
      publishDate: today,
      applicationDeadline: deadline30Days,
      status: JobStatus.PUBLISHED,
      officialNotificationUrl: 'https://kpsc.kar.nic.in/notification',
      applicationUrl: 'https://kpsconline.karnataka.gov.in',
      isDemoData: true
    },
    {
      title: 'BMRCL Bangalore Metro Station Controller & Maintainers 2026',
      slug: 'bmrcl-metro-station-controller-maintainers-2026',
      summary: 'Recruitment for 240 Train Operators, Station Controllers, and Section Engineers.',
      fullDescription: 'Bangalore Metro Rail Corporation Limited invites applications from energetic diploma and engineering graduates for operation of Phase-2 metro corridors.',
      organizationId: orgMap.get('bmrcl-namma-metro')!,
      department: 'Operations & Maintenance',
      sector: JobSector.PSU,
      categoryId: catMap.get('engineering-tech') || defaultCatId,
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 240,
      state: 'Karnataka',
      city: 'Bengaluru',
      isAllIndia: false,
      qualificationSummary: '3-Year Diploma in Electrical / Mechanical / Electronics or B.E / B.Tech',
      experienceMin: 0,
      salaryCustomDisplay: '₹35,000 - ₹82,660 per month + Shift allowances',
      publishDate: today,
      applicationDeadline: deadline20Days,
      status: JobStatus.PUBLISHED,
      officialNotificationUrl: 'https://english.bmrc.co.in/Career',
      applicationUrl: 'https://bmrc.co.in/apply',
      isDemoData: true
    },
    {
      title: 'Infosys Associate Software Engineer & Specialist Programmer 2026',
      slug: 'infosys-specialist-programmer-2026',
      summary: 'Off-campus recruitment for fresh graduates in Java, Python, React, and AWS Cloud.',
      fullDescription: 'Infosys is hiring passionate software engineers for development centers in Bangalore, Mysore, and Pune. Competitive compensation with fast-track technical roles.',
      organizationId: orgMap.get('infosys-technologies')!,
      department: 'Digital Cloud & Enterprise Engineering',
      sector: JobSector.PRIVATE_IT,
      categoryId: catMap.get('engineering-tech') || defaultCatId,
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 750,
      state: 'Karnataka',
      city: 'Bengaluru / Mysuru',
      isAllIndia: false,
      qualificationSummary: 'B.E. / B.Tech / M.E. / M.Tech / MCA in CS, IT, ECE with minimum 60% aggregate',
      experienceMin: 0,
      salaryCustomDisplay: '₹6.5 - ₹9.5 LPA based on coding round proficiency',
      publishDate: today,
      applicationDeadline: deadline30Days,
      status: JobStatus.PUBLISHED,
      applicationUrl: 'https://career.infosys.com',
      isDemoData: true
    },

    // ----------------- BIHAR -----------------
    {
      title: 'BPSC 71st Combined Competitive Examination (CCE) 2026',
      slug: 'bpsc-71st-cce-examination-2026',
      summary: 'Recruitment for Sub Divisional Officer (SDO), DySP, District Commandant, and Revenue Officers.',
      fullDescription: 'Bihar Public Service Commission invites applications for 71st Integrated Combined Competitive Preliminary Examination for administrative positions in Government of Bihar.',
      organizationId: orgMap.get('bpsc-bihar')!,
      department: 'General Administration Department',
      sector: JobSector.UPSC_STATE_PSC,
      categoryId: catMap.get('civil-services') || defaultCatId,
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 1950,
      state: 'Bihar',
      city: 'Patna',
      isAllIndia: false,
      qualificationSummary: 'Graduation Degree in any stream from a recognized University',
      experienceMin: 0,
      salaryCustomDisplay: 'Level 9 (₹53,100 - ₹1,67,800) & Level 7 (₹44,900 - ₹1,42,400)',
      publishDate: today,
      applicationDeadline: deadline30Days,
      status: JobStatus.PUBLISHED,
      officialNotificationUrl: 'https://bpsc.bih.nic.in',
      applicationUrl: 'https://onlinebpsc.bihar.gov.in',
      isDemoData: true
    },
    {
      title: 'BSPHCL Junior Electrical Engineer & Assistant IT Manager 2026',
      slug: 'bsphcl-junior-engineer-it-manager-2026',
      summary: 'Recruitment of 2,610 Assistant Engineers, JEEs, and Correspondence Clerks in Bihar Discoms.',
      fullDescription: 'Bihar State Power Holding Company Limited invites online applications for technical and non-technical staff in BSPHCL, SBPDCL, NBPDCL, and BSPTCL.',
      organizationId: orgMap.get('bsphcl-bihar')!,
      department: 'Human Resource Management',
      sector: JobSector.PSU,
      categoryId: catMap.get('engineering-tech') || defaultCatId,
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 2610,
      state: 'Bihar',
      city: 'Patna / Muzaffarpur',
      isAllIndia: false,
      qualificationSummary: 'Diploma / Degree in Electrical Engineering / Computer Science / IT',
      experienceMin: 0,
      salaryCustomDisplay: 'Level 4 to Level 8 (₹25,500 - ₹92,300)',
      publishDate: today,
      applicationDeadline: deadline20Days,
      status: JobStatus.PUBLISHED,
      officialNotificationUrl: 'https://bsphcl.co.in/careers',
      applicationUrl: 'https://bsphcl.co.in',
      isDemoData: true
    },

    // ----------------- TAMIL NADU -----------------
    {
      title: 'TNPSC Combined Civil Services Examination - Group I (2026)',
      slug: 'tnpsc-group-1-services-2026',
      summary: 'Recruitment for Deputy Collector, DySP (Category I), and Assistant Commissioner (Commercial Taxes).',
      fullDescription: 'Tamil Nadu Public Service Commission invites online applications for direct recruitment to executive posts included in Combined Civil Services Examination-I (Group-I Services).',
      organizationId: orgMap.get('tnpsc-tamil-nadu')!,
      department: 'Personnel & Administrative Reforms',
      sector: JobSector.UPSC_STATE_PSC,
      categoryId: catMap.get('civil-services') || defaultCatId,
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 90,
      state: 'Tamil Nadu',
      city: 'Chennai',
      isAllIndia: false,
      qualificationSummary: 'Degree of any of the Universities incorporated by an Act of the Central or State Legislature; Tamil language proficiency',
      experienceMin: 0,
      salaryCustomDisplay: 'Level 22 in Pay Matrix (₹56,100 - ₹2,05,700)',
      publishDate: today,
      applicationDeadline: deadline30Days,
      status: JobStatus.PUBLISHED,
      officialNotificationUrl: 'https://tnpsc.gov.in/notifications',
      applicationUrl: 'https://tnpscexams.in',
      isDemoData: true
    },
    {
      title: 'TNUSRB Police Constable, Jail Warder & Fireman 2026',
      slug: 'tnusrb-police-constable-fireman-2026',
      summary: 'Direct recruitment of 3,359 Grade II Police Constables and Firemen across Tamil Nadu.',
      fullDescription: 'Tamil Nadu Uniformed Services Recruitment Board announces common recruitment for Grade II Police Constable (Armed Reserve & Special Police), Jail Warder, and Fireman.',
      organizationId: orgMap.get('tnusrb-recruitment')!,
      department: 'Home, Prohibition and Excise Department',
      sector: JobSector.POLICE_SECURITY,
      categoryId: catMap.get('police-security') || defaultCatId,
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 3359,
      state: 'Tamil Nadu',
      city: 'Statewide',
      isAllIndia: false,
      qualificationSummary: '10th Standard (SSLC) Pass with Tamil language as one of the subjects',
      experienceMin: 0,
      salaryCustomDisplay: 'Pay Scale ₹18,200 - ₹57,900 (Pay Matrix Level 5) + Special allowances',
      publishDate: today,
      applicationDeadline: deadline15Days,
      status: JobStatus.PUBLISHED,
      officialNotificationUrl: 'https://tnusrb.tn.gov.in',
      applicationUrl: 'https://tnusrb.tn.gov.in',
      isDemoData: true
    },

    // ----------------- WEST BENGAL -----------------
    {
      title: 'WBPSC West Bengal Civil Service (Exe.) Examination (WBCS) 2026',
      slug: 'wbpsc-wbcs-executive-2026',
      summary: 'Recruitment for WBCS (Executive), West Bengal Police Service, and Commercial Tax Officers.',
      fullDescription: 'Public Service Commission West Bengal invites applications for the WBCS (Executive) Examination for entry into Group A, B, C, and D administrative cadres.',
      organizationId: orgMap.get('wbpsc-west-bengal')!,
      department: 'Personnel & Administrative Reforms',
      sector: JobSector.UPSC_STATE_PSC,
      categoryId: catMap.get('civil-services') || defaultCatId,
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 280,
      state: 'West Bengal',
      city: 'Kolkata',
      isAllIndia: false,
      qualificationSummary: 'Degree of a recognized University; Ability to read, write and speak in Bengali / Nepali',
      experienceMin: 0,
      salaryCustomDisplay: 'Pay Level 16 (₹56,100 - ₹1,44,300) for Group A Officers',
      publishDate: today,
      applicationDeadline: deadline30Days,
      status: JobStatus.PUBLISHED,
      officialNotificationUrl: 'https://psc.wb.gov.in',
      applicationUrl: 'https://wbpsc.gov.in',
      isDemoData: true
    },

    // ----------------- RAJASTHAN -----------------
    {
      title: 'RPSC Rajasthan State and Subordinate Services (RAS/RTS) 2026',
      slug: 'rpsc-ras-rts-exam-2026',
      summary: 'Recruitment for Rajasthan Administrative Service, RPS, Commercial Taxes, and Tehsildar posts.',
      fullDescription: 'Rajasthan Public Service Commission invites online applications for Combined Competitive Examination for Rajasthan State & Subordinate Services.',
      organizationId: orgMap.get('rpsc-rajasthan')!,
      department: 'Department of Personnel (Karmik)',
      sector: JobSector.UPSC_STATE_PSC,
      categoryId: catMap.get('civil-services') || defaultCatId,
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 905,
      state: 'Rajasthan',
      city: 'Ajmer / Jaipur',
      isAllIndia: false,
      qualificationSummary: 'Degree of any recognized University in India; Knowledge of Hindi in Devnagari Script',
      experienceMin: 0,
      salaryCustomDisplay: 'Pay Matrix Level L-14 (Grade Pay 5400) to Level L-11 (Grade Pay 4200)',
      publishDate: today,
      applicationDeadline: deadline30Days,
      status: JobStatus.PUBLISHED,
      officialNotificationUrl: 'https://rpsc.rajasthan.gov.in/notices',
      applicationUrl: 'https://sso.rajasthan.gov.in',
      isDemoData: true
    },

    // ----------------- GUJARAT -----------------
    {
      title: 'GPSC Gujarat Administrative Service (Class 1 & 2) 2026',
      slug: 'gpsc-administrative-service-class-1-2-2026',
      summary: 'Recruitment for Gujarat Administrative Service (GAS), Gujarat Police Service (GPS), and TDO.',
      fullDescription: 'Gujarat Public Service Commission releases advertisement for recruitment to Class 1 & Class 2 executive cadres of Gujarat State Administration.',
      organizationId: orgMap.get('gpsc-gujarat')!,
      department: 'General Administration Department',
      sector: JobSector.UPSC_STATE_PSC,
      categoryId: catMap.get('civil-services') || defaultCatId,
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 160,
      state: 'Gujarat',
      city: 'Gandhinagar / Ahmedabad',
      isAllIndia: false,
      qualificationSummary: 'Bachelor\'s Degree in Any Discipline; Knowledge of Gujarati language essential',
      experienceMin: 0,
      salaryCustomDisplay: 'Pay Matrix Level 10 (₹56,100 - ₹1,77,500) for Class 1 Posts',
      publishDate: today,
      applicationDeadline: deadline30Days,
      status: JobStatus.PUBLISHED,
      officialNotificationUrl: 'https://gpsc.gujarat.gov.in',
      applicationUrl: 'https://gpsc-ojas.gujarat.gov.in',
      isDemoData: true
    },

    // ----------------- KERALA -----------------
    {
      title: 'Kerala PSC Kerala Administrative Service (KAS) & Sub-Inspector 2026',
      slug: 'kerala-psc-kas-executive-2026',
      summary: 'Direct recruitment for Kerala Administrative Service (Junior Time Scale) Trainees and Police Sub-Inspectors.',
      fullDescription: 'Kerala Public Service Commission invites online applications from eligible candidates via One Time Registration for KAS Junior Time Scale.',
      organizationId: orgMap.get('kerala-psc-thiruvananthapuram')!,
      department: 'Personnel and Administrative Reforms Department (P&ARD)',
      sector: JobSector.UPSC_STATE_PSC,
      categoryId: catMap.get('civil-services') || defaultCatId,
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 105,
      state: 'Kerala',
      city: 'Thiruvananthapuram',
      isAllIndia: false,
      qualificationSummary: 'Graduation in Any Discipline; Must be able to read and write in Malayalam',
      experienceMin: 0,
      salaryCustomDisplay: 'Scale of Pay ₹57,000 - ₹1,15,300 + DA and House Rent Allowance',
      publishDate: today,
      applicationDeadline: deadline30Days,
      status: JobStatus.PUBLISHED,
      officialNotificationUrl: 'https://www.keralapsc.gov.in',
      applicationUrl: 'https://thulasi.psc.kerala.gov.in',
      isDemoData: true
    }
  ];

  for (const job of stateJobs) {
    await prisma.job.upsert({
      where: { slug: job.slug },
      update: {
        title: job.title,
        vacanciesCount: job.vacanciesCount,
        state: job.state,
        city: job.city,
        sector: job.sector,
        status: job.status
      },
      create: job
    });
  }

  console.log(`Successfully seeded ${stateJobs.length} state-wise vacancies across all post types!`);
}

main()
  .catch((e) => {
    console.error('Error seeding state data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
