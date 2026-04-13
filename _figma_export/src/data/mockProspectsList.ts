/**
 * Canonical mock prospects for table / kanban / detail.
 * Master rows keyed by `recordId`; public display uses name + NRIC (see `formatProspectIdentifier`).
 */
export interface MockProspectListRow {
  /** Stable key for master profile store and URLs (never changes when name/NRIC are corrected in UI) */
  recordId: string;
  /** Full NRIC/FIN — part of the composite identifier with `name` */
  nric: string;
  name: string;
  maskedNric: string;
  age: string;
  gender: string;
  contact: string;
  email: string;
  status: 'Enquiring' | 'Qualified' | 'Booked' | 'Screened';
  programs: ('mammobus' | 'hpv' | 'fit')[];
  source: string;
  sourceDetail: string;
  nextReview: string;
  assignTo: string[];
  tasksCompleted: number;
  tasksTotal: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  residentialStatus: 'Citizen' | 'PR' | 'Foreigner';
  dateRegistered: string;
}

export const MOCK_PROSPECTS: MockProspectListRow[] = [
  {
    recordId: 'IND-001',
    nric: 'S8701782A',
    name: 'Nurul Huda',
    maskedNric: 'S****782A',
    age: '37 years',
    gender: 'Female',
    contact: '9421 0785',
    email: 'nurul.huda@gmail.com',
    status: 'Booked',
    programs: ['mammobus', 'hpv'],
    source: 'Event',
    sourceDetail: 'Community Health Roadshow - Bedok',
    nextReview: '2026-05-14',
    assignTo: ['Jasmine Lim'],
    tasksCompleted: 3,
    tasksTotal: 8,
    riskLevel: 'Medium',
    residentialStatus: 'Citizen',
    dateRegistered: '2025-10-28',
  },
  {
    recordId: 'IND-002',
    nric: 'S6502345F',
    name: 'Mohammed Ali',
    maskedNric: 'S****345F',
    age: '56 years',
    gender: 'Male',
    contact: '9647 3012',
    email: 'mohammedali@gmail.com',
    status: 'Enquiring',
    programs: ['fit'],
    source: 'Campaign',
    sourceDetail: 'Cancer Awareness 2025',
    nextReview: '2026-04-01',
    assignTo: [],
    tasksCompleted: 5,
    tasksTotal: 10,
    riskLevel: 'Low',
    residentialStatus: 'PR',
    dateRegistered: '2025-10-18',
  },
  {
    recordId: 'IND-003',
    nric: 'S7908901C',
    name: 'Chen Wei Ning',
    maskedNric: 'S****901C',
    age: '45 years',
    gender: 'Female',
    contact: '9781 2345',
    email: 'chenweining@outlook.com',
    status: 'Enquiring',
    programs: ['mammobus'],
    source: 'Manual',
    sourceDetail: 'Walk-in Registration',
    nextReview: '2026-06-15',
    assignTo: ['Jasmine Lim'],
    tasksCompleted: 7,
    tasksTotal: 10,
    riskLevel: 'Medium',
    residentialStatus: 'Citizen',
    dateRegistered: '2025-10-12',
  },
  {
    recordId: 'IND-004',
    nric: 'G9012112B',
    name: 'Olivia Wilson',
    maskedNric: 'S****112B',
    age: '28 years',
    gender: 'Female',
    contact: '9285 7401',
    email: 'olivia.wilson@gmail.com',
    status: 'Qualified',
    programs: ['hpv'],
    source: 'Event',
    sourceDetail: 'Community Health Roadshow - Bedok',
    nextReview: '2026-03-10',
    assignTo: ['Jasmine Lim', 'Fan Wei Zhe'],
    tasksCompleted: 4,
    tasksTotal: 10,
    riskLevel: 'High',
    residentialStatus: 'Foreigner',
    dateRegistered: '2025-10-05',
  },
  {
    recordId: 'IND-005',
    nric: 'S7004556D',
    name: 'John Tan',
    maskedNric: 'S****556D',
    age: '54 years',
    gender: 'Male',
    contact: '8756 3421',
    email: 'jr.hong.ccc@gmail.com',
    status: 'Booked',
    programs: ['fit'],
    source: 'Event',
    sourceDetail: 'Community Health Roadshow - Bedok',
    nextReview: '2026-07-01',
    assignTo: ['Jasmine Lim'],
    tasksCompleted: 6,
    tasksTotal: 8,
    riskLevel: 'Medium',
    residentialStatus: 'Citizen',
    dateRegistered: '2025-09-28',
  },
  {
    recordId: 'IND-006',
    nric: 'S6201223E',
    name: 'Adam Sim Wei Wen',
    maskedNric: 'S****223E',
    age: '62 years',
    gender: 'Male',
    contact: '8246 3791',
    email: 'adamsim@example.net',
    status: 'Screened',
    programs: ['mammobus', 'fit'],
    source: 'Campaign',
    sourceDetail: 'Pink for Life 2025',
    nextReview: '2026-11-09',
    assignTo: ['Fan Wei Zhe'],
    tasksCompleted: 10,
    tasksTotal: 10,
    riskLevel: 'Medium',
    residentialStatus: 'PR',
    dateRegistered: '2025-08-15',
  },
  {
    recordId: 'IND-007',
    nric: 'G8805667G',
    name: 'Eva Rodriguez',
    maskedNric: 'S****667G',
    age: '33 years',
    gender: 'Female',
    contact: '8573 5294',
    email: 'eva.rod@gmail.com',
    status: 'Enquiring',
    programs: ['hpv'],
    source: 'Event',
    sourceDetail: 'Race for Life',
    nextReview: '2026-09-15',
    assignTo: ['Fan Wei Zhe'],
    tasksCompleted: 2,
    tasksTotal: 10,
    riskLevel: 'Low',
    residentialStatus: 'Foreigner',
    dateRegistered: '2026-03-01',
  },
];
