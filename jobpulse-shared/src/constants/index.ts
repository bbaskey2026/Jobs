export const INDIAN_STATES_AND_UTS = [
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
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
  'All India'
] as const;

export type IndianStateOrUT = typeof INDIAN_STATES_AND_UTS[number];

export const POPULAR_EXAM_BOARDS = [
  { code: 'UPSC', name: 'Union Public Service Commission' },
  { code: 'SSC', name: 'Staff Selection Commission' },
  { code: 'IBPS', name: 'Institute of Banking Personnel Selection' },
  { code: 'RRB', name: 'Railway Recruitment Boards' },
  { code: 'SBI', name: 'State Bank of India' },
  { code: 'RBI', name: 'Reserve Bank of India' },
  { code: 'DRDO', name: 'Defence Research & Development Organisation' },
  { code: 'ISRO', name: 'Indian Space Research Organisation' },
  { code: 'INDIAN_ARMY', name: 'Indian Army' },
  { code: 'INDIAN_NAVY', name: 'Indian Navy' },
  { code: 'INDIAN_AIR_FORCE', name: 'Indian Air Force' },
  { code: 'STATE_PSC', name: 'State Public Service Commissions' }
] as const;

export const QUALIFICATION_LEVELS = [
  '10th Pass (Matriculation)',
  '12th Pass (Higher Secondary)',
  'ITI Certificate',
  'Diploma / Polytechnic',
  'Graduation / Bachelor\'s Degree (Any)',
  'B.E. / B.Tech (Engineering)',
  'B.Sc / BCA / B.Com / BBA',
  'Post Graduation / Master\'s Degree',
  'M.Tech / M.E / MCA',
  'MBBS / BDS / Medical',
  'LLB / LLM (Law)',
  'CA / CMA / CS (Finance)',
  'Ph.D / Doctorate'
] as const;

export const SEVENTH_PAY_COMMISSION_LEVELS = [
  { level: 'Level 1', range: '₹18,000 - ₹56,900' },
  { level: 'Level 2', range: '₹19,900 - ₹63,200' },
  { level: 'Level 3', range: '₹21,700 - ₹69,100' },
  { level: 'Level 4', range: '₹25,500 - ₹81,100' },
  { level: 'Level 5', range: '₹29,200 - ₹92,300' },
  { level: 'Level 6', range: '₹35,400 - ₹1,12,400' },
  { level: 'Level 7', range: '₹44,900 - ₹1,42,400' },
  { level: 'Level 8', range: '₹47,600 - ₹1,51,100' },
  { level: 'Level 9', range: '₹53,100 - ₹1,67,800' },
  { level: 'Level 10', range: '₹56,100 - ₹1,77,500' },
  { level: 'Level 11', range: '₹67,700 - ₹2,08,700' },
  { level: 'Level 12', range: '₹78,800 - ₹2,09,200' },
  { level: 'Level 13', range: '₹1,23,100 - ₹2,15,900' },
  { level: 'Level 14', range: '₹1,44,200 - ₹2,18,200' }
] as const;

export const SYSTEM_DEFAULTS = {
  PAGE_SIZE_DEFAULT: 12,
  PAGE_SIZE_MAX: 100,
  PASSWORD_MIN_LENGTH: 8,
  RESUME_MAX_BYTES: 5 * 1024 * 1024, // 5 MB
  ALLOWED_RESUME_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
};
