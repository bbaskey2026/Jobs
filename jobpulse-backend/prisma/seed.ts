import { PrismaClient } from '@prisma/client';
import { UserRole, JobSector, JobStatus, EmploymentType, VerificationStatus } from '@jobpulse/shared';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding JobPulse Database with Verified Organizations & Labeled Demo Records...');

  // 1. Password hash for demo accounts
  const adminHash = await argon2.hash('Admin@12345', { type: argon2.argon2id });
  const recruiterHash = await argon2.hash('Recruiter@12345', { type: argon2.argon2id });
  const seekerHash = await argon2.hash('Seeker@12345', { type: argon2.argon2id });

  // 2. Seed Users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@jobpulse.in' },
    update: {},
    create: {
      email: 'admin@jobpulse.in',
      passwordHash: adminHash,
      fullName: 'System Administrator',
      role: UserRole.ADMIN,
      isEmailVerified: true,
      profile: {
        create: {
          bio: 'JobPulse Platform Administrator and Job Moderation Lead',
          state: 'Delhi',
          city: 'New Delhi'
        }
      }
    }
  });

  const recruiterUser = await prisma.user.upsert({
    where: { email: 'recruiter@jobpulse.in' },
    update: {},
    create: {
      email: 'recruiter@jobpulse.in',
      passwordHash: recruiterHash,
      fullName: 'Vikram Sharma (Talent Acquisition)',
      role: UserRole.RECRUITER,
      isEmailVerified: true,
      profile: {
        create: {
          bio: 'Recruitment Specialist for Central & State PSUs',
          state: 'Maharashtra',
          city: 'Mumbai',
          phoneNumber: '9876543210'
        }
      }
    }
  });

  const seekerUser = await prisma.user.upsert({
    where: { email: 'candidate@jobpulse.in' },
    update: {},
    create: {
      email: 'candidate@jobpulse.in',
      passwordHash: seekerHash,
      fullName: 'Rahul Verma',
      role: UserRole.JOB_SEEKER,
      isEmailVerified: true,
      profile: {
        create: {
          bio: 'B.Tech Graduate preparing for UPSC Civil Services and Banking PO examinations',
          state: 'Uttar Pradesh',
          city: 'Lucknow',
          phoneNumber: '9823456789',
          currentEducation: 'B.Tech in Computer Science',
          experienceYears: 1,
          preferredSectors: JSON.stringify(['CENTRAL_GOVERNMENT', 'BANKING_INSURANCE', 'PRIVATE_IT']),
          preferredLocations: JSON.stringify(['Delhi', 'Uttar Pradesh', 'Maharashtra', 'Karnataka']),
          skills: JSON.stringify(['Aptitude', 'Data Structures', 'General Knowledge', 'Banking Awareness'])
        }
      }
    }
  });

  console.log(`Created default users: ${adminUser.email}, ${recruiterUser.email}, ${seekerUser.email}`);

  // 3. Seed Job Categories
  const categoriesData = [
    { name: 'Civil Services & Administration', slug: 'civil-services', iconName: 'AccountBalance', description: 'UPSC IAS/IPS/IFS and State Public Service Commissions' },
    { name: 'Banking, Financial Services & Insurance', slug: 'banking-finance', iconName: 'AccountBalanceWallet', description: 'IBPS, SBI, RBI, NABARD, LIC, and private bank careers' },
    { name: 'Engineering & Technology', slug: 'engineering-tech', iconName: 'Computer', description: 'Software engineering, civil, mechanical, and electrical roles' },
    { name: 'Railways Recruitment', slug: 'railways', iconName: 'DirectionsTransit', description: 'RRB NTPC, ALP, Group D, and Senior Section Engineer openings' },
    { name: 'Defence & Paramilitary Forces', slug: 'defence-paramilitary', iconName: 'Shield', description: 'Indian Army, Navy, Air Force, NDA, CDS, CAPF, and Coast Guard' },
    { name: 'Teaching & Research', slug: 'teaching-research', iconName: 'School', description: 'UGC NET, CTET, KVS, NVS, Assistant Professor, and PGT/TGT positions' },
    { name: 'Police & Public Safety', slug: 'police-security', iconName: 'LocalPolice', description: 'State Police Sub-Inspectors, Constables, and Security agencies' },
    { name: 'Public Sector Undertakings (PSUs)', slug: 'psu-vacancies', iconName: 'Business', description: 'Maharatna & Navratna PSUs including ONGC, NTPC, IOCL, BHEL' },
    { name: 'Healthcare & Nursing', slug: 'healthcare-nursing', iconName: 'LocalHospital', description: 'AIIMS, State Medical Officers, Staff Nurses, and pharmacists' }
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.jobCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    });
    categoryMap[cat.slug] = created.id;
  }
  console.log('Seeded job categories');

  // 4. Seed Verified Organizations
  const orgsData = [
    {
      name: 'Union Public Service Commission (UPSC)',
      slug: 'upsc-india',
      sector: JobSector.UPSC_STATE_PSC,
      websiteUrl: 'https://upsc.gov.in',
      officialNotificationDomain: 'upsc.gov.in',
      description: "India's premier central recruiting agency for appointments to and examinations for all India services and higher central services.",
      headquartersState: 'Delhi',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'Staff Selection Commission (SSC)',
      slug: 'ssc-india',
      sector: JobSector.SSC,
      websiteUrl: 'https://ssc.gov.in',
      officialNotificationDomain: 'ssc.gov.in',
      description: 'Central government recruitment commission responsible for recruiting staff for various posts in ministries and departments.',
      headquartersState: 'Delhi',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'Institute of Banking Personnel Selection (IBPS)',
      slug: 'ibps-recruitment',
      sector: JobSector.BANKING_INSURANCE,
      websiteUrl: 'https://www.ibps.in',
      officialNotificationDomain: 'ibps.in',
      description: 'Autonomous central recruitment body conducting examinations for public sector banks in India.',
      headquartersState: 'Maharashtra',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'State Bank of India (SBI)',
      slug: 'state-bank-of-india',
      sector: JobSector.BANKING_INSURANCE,
      websiteUrl: 'https://sbi.co.in/careers',
      officialNotificationDomain: 'sbi.co.in',
      description: 'Fortune 500 Indian multinational public sector bank and financial services statutory body.',
      headquartersState: 'Maharashtra',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'Railway Recruitment Control Board (RRB)',
      slug: 'railway-recruitment-board',
      sector: JobSector.RAILWAYS,
      websiteUrl: 'https://indianrailways.gov.in',
      officialNotificationDomain: 'indianrailways.gov.in',
      description: 'Government recruitment board for Indian Railways, one of the world\'s largest civilian employers.',
      headquartersState: 'Delhi',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'National Thermal Power Corporation (NTPC)',
      slug: 'ntpc-limited',
      sector: JobSector.PSU,
      websiteUrl: 'https://www.ntpc.co.in',
      officialNotificationDomain: 'ntpc.co.in',
      description: 'India\'s largest energy conglomerate and Maharatna Public Sector Undertaking.',
      headquartersState: 'Delhi',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'Defence Research and Development Organisation (DRDO)',
      slug: 'drdo-india',
      sector: JobSector.DEFENCE_PARAMILITARY,
      websiteUrl: 'https://www.drdo.gov.in',
      officialNotificationDomain: 'drdo.gov.in',
      description: 'Premier agency under the Department of Defence Research and Development in Ministry of Defence.',
      headquartersState: 'Delhi',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'Tata Consultancy Services (TCS)',
      slug: 'tcs-careers',
      sector: JobSector.PRIVATE_IT,
      websiteUrl: 'https://www.tcs.com/careers',
      description: 'Global leader in IT services, consulting, and business solutions.',
      headquartersState: 'Maharashtra',
      verificationStatus: VerificationStatus.VERIFIED
    },
    {
      name: 'HDFC Bank Ltd',
      slug: 'hdfc-bank-careers',
      sector: JobSector.PRIVATE_FINANCE,
      websiteUrl: 'https://www.hdfcbank.com/careers',
      description: 'India\'s leading private sector banking and financial services institution.',
      headquartersState: 'Maharashtra',
      verificationStatus: VerificationStatus.VERIFIED
    }
  ];

  const orgMap: Record<string, string> = {};
  for (const org of orgsData) {
    const created = await prisma.organization.upsert({
      where: { slug: org.slug },
      update: {},
      create: org
    });
    orgMap[org.slug] = created.id;
  }
  console.log('Seeded verified organizations');

  // 5. Seed Jobs (Explicitly labeled isDemoData: true)
  const today = new Date();
  const deadline30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const deadline15Days = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000);
  const deadline5Days = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
  const pastDeadline = new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000);

  const jobsData = [
    {
      title: 'UPSC Civil Services Examination (CSE) 2026',
      slug: 'upsc-civil-services-examination-cse-2026',
      summary: 'Recruitment for Indian Administrative Service (IAS), Indian Police Service (IPS), and Group A/B Central Services.',
      fullDescription: 'The Union Public Service Commission (UPSC) announces the Civil Services Examination (CSE) 2026 for recruitment to prestigious Indian Administrative Service, Indian Foreign Service, Indian Police Service, and various Central Group A & B services. Candidates must possess a Bachelor\'s Degree in any discipline from a recognized University.',
      organizationId: orgMap['upsc-india'],
      department: 'Department of Personnel and Training (DoPT)',
      sector: JobSector.UPSC_STATE_PSC,
      categoryId: categoryMap['civil-services'],
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 1056,
      state: 'All India',
      isAllIndia: true,
      qualificationSummary: 'Bachelor\'s Degree in Any Discipline from a recognized university',
      experienceMin: 0,
      salaryCustomDisplay: '₹56,100 - ₹2,50,000 (Pay Level 10 to Level 17)',
      publishDate: today,
      applicationStartDate: today,
      applicationDeadline: deadline30Days,
      status: JobStatus.PUBLISHED,
      officialNotificationUrl: 'https://upsc.gov.in/examinations/active-exams',
      applicationUrl: 'https://upsconline.nic.in',
      eligibilityCriteria: 'Age 21-32 years as on 1st August. Relaxation for SC/ST/OBC as per rules.',
      selectionProcess: 'Preliminary Examination (Objective), Main Examination (Written), Personality Test (Interview)',
      applicationFee: '₹100 (Exempted for Female/SC/ST/PwBD candidates)',
      howToApply: 'Apply online via UPSC One Time Registration (OTR) portal at upsconline.nic.in before the closing date.',
      isDemoData: true
    },
    {
      title: 'SSC Combined Graduate Level (CGL) Examination 2026',
      slug: 'ssc-cgl-examination-2026',
      summary: 'Recruitment for Assistant Section Officer, Inspector of Income Tax, Sub-Inspector in CBI, and Auditor posts.',
      fullDescription: 'Staff Selection Commission invites online applications from eligible candidates for Combined Graduate Level Examination 2026 for filling up Group B and Group C posts in various Ministries/Departments/Organizations of Government of India.',
      organizationId: orgMap['ssc-india'],
      department: 'Central Ministries & Departments',
      sector: JobSector.SSC,
      categoryId: categoryMap['civil-services'],
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 17727,
      state: 'All India',
      isAllIndia: true,
      qualificationSummary: 'Graduation / Bachelor\'s Degree in any discipline',
      experienceMin: 0,
      salaryCustomDisplay: 'Pay Level 4 (₹25,500) to Pay Level 8 (₹1,51,100)',
      publishDate: today,
      applicationStartDate: today,
      applicationDeadline: deadline15Days,
      status: JobStatus.PUBLISHED,
      officialNotificationUrl: 'https://ssc.gov.in/notice-board',
      applicationUrl: 'https://ssc.gov.in',
      eligibilityCriteria: 'Age 18-30/32 years depending on specific post. Citizenship of India.',
      selectionProcess: 'Computer Based Examination (Tier-I and Tier-II)',
      applicationFee: '₹100 (Exempted for Women/SC/ST/ESM/PwD)',
      howToApply: 'Applications must be submitted in only online mode at the official website ssc.gov.in.',
      isDemoData: true
    },
    {
      title: 'SBI Probationary Officer (PO) Recruitment 2026',
      slug: 'sbi-probationary-officer-po-2026',
      summary: 'Recruitment of 2,000 Probationary Officers across branches in India.',
      fullDescription: 'State Bank of India welcomes applications from Indian citizens for appointment as Probationary Officers (POs). Selected candidates may be posted anywhere in India and undergo a rigorous 2-year probation with fast-track promotion paths.',
      organizationId: orgMap['state-bank-of-india'],
      department: 'Human Resources Department',
      sector: JobSector.BANKING_INSURANCE,
      categoryId: categoryMap['banking-finance'],
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 2000,
      state: 'All India',
      isAllIndia: true,
      qualificationSummary: 'Graduation in any discipline from a recognized University',
      experienceMin: 0,
      salaryCustomDisplay: 'Starting Basic Pay ₹41,960 + 4 advance increments (Total CTC approx ₹15-18 LPA)',
      publishDate: today,
      applicationStartDate: today,
      applicationDeadline: deadline5Days,
      status: JobStatus.PUBLISHED,
      officialNotificationUrl: 'https://sbi.co.in/careers',
      applicationUrl: 'https://ibpsonline.ibps.in/sbipos2026',
      eligibilityCriteria: 'Age between 21 and 30 years.',
      selectionProcess: 'Phase-I: Online Preliminary Exam, Phase-II: Main Exam, Phase-III: Psychometric Test, Interview & Group Discussion',
      applicationFee: '₹750 for General/EWS/OBC; Nil for SC/ST/PwBD',
      howToApply: 'Candidates can apply online only from the Careers link on sbi.co.in.',
      isDemoData: true
    },
    {
      title: 'RRB Assistant Loco Pilot (ALP) & Technicians 2026',
      slug: 'rrb-assistant-loco-pilot-alp-technicians-2026',
      summary: 'Indian Railways Centralized Employment Notice (CEN) for Assistant Loco Pilots and Railway Technicians.',
      fullDescription: 'Railway Recruitment Boards (RRBs) invite online applications from eligible Indian citizens for the post of Assistant Loco Pilot (ALP) across Indian Railways zones and production units.',
      organizationId: orgMap['railway-recruitment-board'],
      department: 'Ministry of Railways',
      sector: JobSector.RAILWAYS,
      categoryId: categoryMap['railways'],
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 18799,
      state: 'All India',
      isAllIndia: true,
      qualificationSummary: 'Matriculation / 10th Pass + ITI / Diploma in Engineering',
      experienceMin: 0,
      salaryCustomDisplay: 'Level 2 in 7th CPC (₹19,900 Initial Pay + Allowances)',
      publishDate: today,
      applicationStartDate: today,
      applicationDeadline: deadline30Days,
      status: JobStatus.PUBLISHED,
      officialNotificationUrl: 'https://indianrailways.gov.in',
      applicationUrl: 'https://www.rrbapply.gov.in',
      eligibilityCriteria: 'Age 18-30 years. Medical fitness in A-1 category.',
      selectionProcess: 'First Stage CBT (CBT-1), Second Stage CBT (CBT-2), Computer Based Aptitude Test (CBAT), Document Verification',
      applicationFee: '₹500 (₹400 refundable on appearing in CBT-1)',
      howToApply: 'Submit online form at official portal www.rrbapply.gov.in.',
      isDemoData: true
    },
    {
      title: 'DRDO Scientist \'B\' Recruitment through RAC 2026',
      slug: 'drdo-scientist-b-recruitment-2026',
      summary: 'Recruitment of Scientists \'B\' in DRDO in disciplines of Electronics, Mechanical, and Computer Science.',
      fullDescription: 'Recruitment and Assessment Centre (RAC) of DRDO invites online applications for Scientist \'B\' posts in DRDO. Selection is primarily based on valid GATE score followed by a personal interview.',
      organizationId: orgMap['drdo-india'],
      department: 'Recruitment and Assessment Centre (RAC)',
      sector: JobSector.DEFENCE_PARAMILITARY,
      categoryId: categoryMap['defence-paramilitary'],
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 220,
      state: 'All India',
      isAllIndia: true,
      qualificationSummary: 'First Class Bachelor\'s Degree in Engineering (B.E/B.Tech) + Valid GATE Score',
      experienceMin: 0,
      salaryCustomDisplay: 'Level 10 (₹56,100 - ₹1,77,500) + DA, HRA, Transport Allowance',
      publishDate: today,
      applicationStartDate: today,
      applicationDeadline: deadline15Days,
      status: JobStatus.PUBLISHED,
      officialNotificationUrl: 'https://rac.gov.in',
      applicationUrl: 'https://rac.gov.in',
      isDemoData: true
    },
    {
      title: 'NTPC Engineering Executive Trainees (EET) 2026',
      slug: 'ntpc-engineering-executive-trainees-2026',
      summary: 'Recruitment of Executive Trainees in Electrical, Mechanical, Electronics, and Instrumentation.',
      fullDescription: 'NTPC Limited, India\'s largest power utility company, is looking for promising, energetic young Graduate Engineers with brilliant academic records in engineering disciplines to join as Engineering Executive Trainees.',
      organizationId: orgMap['ntpc-limited'],
      department: 'Power Generation Division',
      sector: JobSector.PSU,
      categoryId: categoryMap['psu-vacancies'],
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 280,
      state: 'All India',
      isAllIndia: true,
      qualificationSummary: 'Full-time B.E / B.Tech in relevant branch with minimum 65% marks',
      experienceMin: 0,
      salaryCustomDisplay: 'E1 Grade (₹40,000 - ₹1,40,000) CTC approx ₹15.5 Lakhs per annum',
      publishDate: today,
      applicationStartDate: today,
      applicationDeadline: deadline30Days,
      status: JobStatus.PUBLISHED,
      officialNotificationUrl: 'https://careers.ntpc.co.in',
      applicationUrl: 'https://careers.ntpc.co.in',
      isDemoData: true
    },
    {
      title: 'TCS Digital / Prime Software Engineer 2026',
      slug: 'tcs-software-engineer-digital-2026',
      summary: 'Off-campus recruitment for fresh graduates in Cloud, AI/ML, and Full-Stack Engineering.',
      fullDescription: 'Tata Consultancy Services is hiring fresh engineering and MCA graduates for TCS Digital and Prime developer roles. Work with cutting-edge cloud architectures, scalable distributed backends, and AI engineering teams.',
      organizationId: orgMap['tcs-careers'],
      department: 'Digital Enterprise Solutions',
      sector: JobSector.PRIVATE_IT,
      categoryId: categoryMap['engineering-tech'],
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 500,
      state: 'Maharashtra',
      city: 'Pune',
      remoteType: 'HYBRID',
      qualificationSummary: 'B.Tech / B.E / M.Tech / MCA in CS, IT, ECE, or related disciplines',
      experienceMin: 0,
      experienceMax: 2,
      salaryMin: 700000,
      salaryMax: 1100000,
      salaryCustomDisplay: '₹7.0 - ₹11.0 LPA (Based on NQT performance)',
      publishDate: today,
      applicationDeadline: deadline30Days,
      status: JobStatus.PUBLISHED,
      applicationUrl: 'https://www.tcs.com/careers/india/entry-level',
      isDemoData: true
    },
    {
      title: 'HDFC Bank Deputy Branch Manager / Assistant Manager',
      slug: 'hdfc-bank-deputy-branch-manager-2026',
      summary: 'Branch banking operations, customer relationship, and wealth management roles.',
      fullDescription: 'HDFC Bank is expanding its branch banking footprint across Tier-1 and Tier-2 cities in India and seeking dynamic professionals for Branch Management and Retail Banking operations.',
      organizationId: orgMap['hdfc-bank-careers'],
      department: 'Retail Branch Banking',
      sector: JobSector.PRIVATE_FINANCE,
      categoryId: categoryMap['banking-finance'],
      employmentType: EmploymentType.FULL_TIME,
      vacanciesCount: 150,
      state: 'Karnataka',
      city: 'Bengaluru',
      qualificationSummary: 'Graduate / Post Graduate in any stream; MBA in Finance preferred',
      experienceMin: 1,
      experienceMax: 4,
      salaryMin: 550000,
      salaryMax: 850000,
      salaryCustomDisplay: '₹5.5 - ₹8.5 LPA + Performance Incentives',
      publishDate: today,
      applicationDeadline: deadline15Days,
      status: JobStatus.PUBLISHED,
      applicationUrl: 'https://www.hdfcbank.com/careers',
      isDemoData: true
    },
    {
      title: 'UPSC Combined Defence Services Examination (CDSE-I) [Expired Example]',
      slug: 'upsc-cdse-i-2025-expired',
      summary: 'Recruitment for Indian Military Academy, Naval Academy, Air Force Academy, and Officers Training Academy.',
      fullDescription: 'Archived notification for CDS Examination. Application deadline has concluded.',
      organizationId: orgMap['upsc-india'],
      sector: JobSector.DEFENCE_PARAMILITARY,
      categoryId: categoryMap['defence-paramilitary'],
      employmentType: EmploymentType.FULL_TIME,
      state: 'All India',
      isAllIndia: true,
      qualificationSummary: 'Degree of a recognized University (or equivalent)',
      publishDate: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000),
      applicationDeadline: pastDeadline,
      status: JobStatus.EXPIRED,
      officialNotificationUrl: 'https://upsc.gov.in',
      isDemoData: true
    }
  ];

  for (const j of jobsData) {
    await prisma.job.upsert({
      where: { slug: j.slug },
      update: {},
      create: j
    });
  }
  console.log(`Seeded ${jobsData.length} verified and clearly labeled demo job listings`);

  // 6. Seed Job Sources
  await prisma.jobSource.upsert({
    where: { code: 'API_NOAUTH' },
    update: {},
    create: {
      name: 'NoAuth Job Data Feed',
      code: 'API_NOAUTH',
      sourceType: 'API_NOAUTH',
      baseUrl: 'https://api.noauth.example.com/v1',
      isEnabled: false,
      syncIntervalMinutes: 60,
      lastRunStatus: 'IDLE'
    }
  });

  await prisma.jobSource.upsert({
    where: { code: 'OFFICIAL_UPSC' },
    update: {},
    create: {
      name: 'UPSC Recruitment Portal Feed',
      code: 'OFFICIAL_UPSC',
      sourceType: 'OFFICIAL_CRAWLER',
      baseUrl: 'https://upsc.gov.in',
      isEnabled: true,
      syncIntervalMinutes: 120,
      lastRunStatus: 'IDLE'
    }
  });

  console.log('Seeded external job sources');
  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
