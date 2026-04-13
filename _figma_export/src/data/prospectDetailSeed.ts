import { MOCK_PROSPECTS, type MockProspectListRow } from './mockProspectsList';

const PIPELINE: Array<'Enquiring' | 'Qualified' | 'Booked' | 'Screened'> = [
  'Enquiring',
  'Qualified',
  'Booked',
  'Screened',
];

export type ProspectDetailHeader = {
  /** Full NRIC/FIN — with `name`, forms the public identifier */
  nric: string;
  name: string;
  gender: string;
  /** Numeric age for `{age} years` in header */
  age: number;
  mobile: string;
  email: string;
  programs: string[];
  currentStage: (typeof PIPELINE)[number];
  stages: { name: string; completed: boolean; current: boolean }[];
  assignTo: string;
};

function mapResidential(s: MockProspectListRow['residentialStatus']): string {
  if (s === 'Citizen') return 'Singapore Citizen';
  if (s === 'PR') return 'Permanent Resident';
  return 'Foreigner';
}

function parseAgeYears(ageStr: string): number {
  const m = /^(\d+)/.exec(String(ageStr).trim());
  return m ? Math.max(0, parseInt(m[1], 10)) : 0;
}

/** DD-MM-YYYY — deterministic per NRIC so the same prospect always matches age from the list */
function dobDdMmYyyyFromNricAndAge(nric: string, ageYears: number): string {
  const y = 2026 - ageYears;
  const h = nric.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const dd = String((h % 27) + 1).padStart(2, '0');
  const mm = String((h % 12) + 1).padStart(2, '0');
  return `${dd}-${mm}-${y}`;
}

function formatNextReviewLong(iso: string): string {
  if (!iso?.trim()) return '—';
  const t = new Date(`${iso.trim()}T12:00:00`).getTime();
  if (Number.isNaN(t)) return '—';
  return new Date(t).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function programLabel(p: string): string {
  if (p === 'mammobus') return 'Mammobus';
  if (p === 'hpv') return 'HPV';
  if (p === 'fit') return 'FIT';
  return p;
}

function buildPipelineStages(current: (typeof PIPELINE)[number]) {
  const idx = PIPELINE.indexOf(current);
  return PIPELINE.map((name, i) => ({
    name,
    completed: i < idx,
    current: i === idx,
  }));
}

/** Extra profile fields keyed by full NRIC/FIN (uppercase) */
const PROFILE_EXTRAS: Record<
  string,
  {
    race: string;
    religion: string;
    preferredLanguages: string[];
    address: string;
    postalCode: string;
    referredBy: string;
    chasCardType: string;
    healthierSg: string;
    firstMammogramScreening: string;
    lastScreeningYear: string;
    personalCancerHistory: string;
    familyHistory: string;
    preferredScreeningDate: string;
    preferredTimeSlot: string;
    screeningLocationEvent: string;
    reviewPeriod: string;
  }
> = {
  S8701782A: {
    race: 'Malay',
    religion: 'Islam',
    preferredLanguages: ['English', 'Malay'],
    address: 'Blk 412 Bedok North Ave 2, #08-112, Singapore 460412',
    postalCode: '460412',
    referredBy: 'Jasmine Lim',
    chasCardType: 'Orange',
    healthierSg: 'yes',
    firstMammogramScreening: 'no',
    lastScreeningYear: '2024',
    personalCancerHistory: 'No',
    familyHistory: 'No known family history',
    preferredScreeningDate: '22-05-2026',
    preferredTimeSlot: 'morning',
    screeningLocationEvent: 'Bedok Community Centre — Mammobus',
    reviewPeriod: '6months',
  },
  S6502345F: {
    race: 'Malay',
    religion: 'Islam',
    preferredLanguages: ['English'],
    address: '10 Tampines Central 1, #12-03, Singapore 529536',
    postalCode: '529536',
    referredBy: 'Self-referral',
    chasCardType: 'Green',
    healthierSg: 'unsure',
    firstMammogramScreening: 'yes',
    lastScreeningYear: '—',
    personalCancerHistory: 'No',
    familyHistory: 'Father — colorectal (age 72)',
    preferredScreeningDate: '—',
    preferredTimeSlot: 'afternoon',
    screeningLocationEvent: 'Toa Payoh Hub — FIT kiosk',
    reviewPeriod: '12months',
  },
  S7908901C: {
    race: 'Chinese',
    religion: 'Buddhism',
    preferredLanguages: ['English', 'Mandarin'],
    address: '245 Hougang Ave 3, #05-882, Singapore 530245',
    postalCode: '530245',
    referredBy: 'Walk-in counter',
    chasCardType: 'Blue',
    healthierSg: 'yes',
    firstMammogramScreening: 'no',
    lastScreeningYear: '2022',
    personalCancerHistory: 'No',
    familyHistory: 'Mother — breast cancer (age 61)',
    preferredScreeningDate: '10-06-2026',
    preferredTimeSlot: 'evening',
    screeningLocationEvent: 'Hougang CC — Mammobus',
    reviewPeriod: '6months',
  },
  G9012112B: {
    race: 'Eurasian',
    religion: 'Christianity',
    preferredLanguages: ['English'],
    address: '8 River Valley Close, #22-01, Singapore 238432',
    postalCode: '238432',
    referredBy: 'Dr. Karen Lee',
    chasCardType: 'Not Applicable',
    healthierSg: 'no',
    firstMammogramScreening: 'yes',
    lastScreeningYear: '—',
    personalCancerHistory: 'No',
    familyHistory: 'No first-degree relatives',
    preferredScreeningDate: '05-03-2026',
    preferredTimeSlot: 'morning',
    screeningLocationEvent: 'Orchard screening suite — HPV',
    reviewPeriod: '6months',
  },
  S7004556D: {
    race: 'Chinese',
    religion: 'Free Thinker',
    preferredLanguages: ['English', 'Hokkien'],
    address: '88 Marine Parade Road, #15-10, Singapore 440088',
    postalCode: '440088',
    referredBy: 'Jasmine Lim',
    chasCardType: 'Blue',
    healthierSg: 'yes',
    firstMammogramScreening: 'no',
    lastScreeningYear: '2021',
    personalCancerHistory: 'No',
    familyHistory: 'Nil reported',
    preferredScreeningDate: '18-07-2026',
    preferredTimeSlot: 'morning',
    screeningLocationEvent: 'Marine Parade CC — FIT',
    reviewPeriod: '12months',
  },
  S6201223E: {
    race: 'Chinese',
    religion: 'Buddhism',
    preferredLanguages: ['English', 'Mandarin'],
    address: '350 Ang Mo Kio Ave 1, #09-221, Singapore 560350',
    postalCode: '560350',
    referredBy: 'Pink for Life booth',
    chasCardType: 'Blue',
    healthierSg: 'yes',
    firstMammogramScreening: 'no',
    lastScreeningYear: '2024',
    personalCancerHistory: 'No',
    familyHistory: 'Sister — breast cancer (age 58)',
    preferredScreeningDate: '20-08-2026',
    preferredTimeSlot: 'morning',
    screeningLocationEvent: 'Ang Mo Kio CC — Mammobus',
    reviewPeriod: '6months',
  },
  G8805667G: {
    race: 'Others',
    religion: 'Catholicism',
    preferredLanguages: ['English', 'Others'],
    address: '1 Bukit Batok Central, #04-55, Singapore 658081',
    postalCode: '658081',
    referredBy: 'Event volunteer',
    chasCardType: 'Not Applicable',
    healthierSg: 'unsure',
    firstMammogramScreening: 'yes',
    lastScreeningYear: '—',
    personalCancerHistory: 'No',
    familyHistory: 'Nil',
    preferredScreeningDate: '—',
    preferredTimeSlot: 'afternoon',
    screeningLocationEvent: 'Jurong East — HPV screening',
    reviewPeriod: '12months',
  },
};

export type DetailsFormDataState = {
  name: string;
  nric: string;
  gender: string;
  dateOfBirth: string;
  age: string;
  mobile: string;
  email: string;
  residentialStatus: string;
  religion: string;
  preferredLanguages: string[];
  race: string;
  address: string;
  postalCode: string;
  sourceType: string;
  sourceName: string;
  referredBy: string;
  programEnrolled: string;
  chasCardType: string;
  healthierSg: string;
  firstMammogramScreening: string;
  lastScreeningYear: string;
  subsidyType: string;
  hasChronicConditions: string;
  chronicConditions: string;
  currentMedications: string;
  allergies: string;
  smokingStatus: string;
  alcoholConsumption: string;
  riskLevel: string;
  personalCancerHistory: string;
  preExistingConditions: string;
  familyHistory: string;
  cancerScreeningEligibilityCheck: string;
  riskFactors: string;
  pdpaConsent: string;
  edmSubscription: string;
  consentContact: string;
  consentDate: string;
  marketingConsent: string;
  preferredScreeningDate: string;
  preferredTimeSlot: string;
  screeningLocationEvent: string;
  reviewPeriod: string;
  nextReviewDate: string;
};

function listResidentialStatusFromForm(s: string): MockProspectListRow['residentialStatus'] {
  const t = s.toLowerCase();
  if (t.includes('citizen')) return 'Citizen';
  if (t.includes('permanent')) return 'PR';
  return 'Foreigner';
}

/** Maps personal-details form fields back onto the shared list / header row (master data). */
export function detailsFormToProfilePatch(form: DetailsFormDataState): Partial<MockProspectListRow> {
  const rl = form.riskLevel;
  const riskLevel: MockProspectListRow['riskLevel'] =
    rl === 'High' || rl === 'Medium' || rl === 'Low' ? rl : 'Medium';
  return {
    name: form.name.trim(),
    nric: form.nric.trim().toUpperCase(),
    contact: form.mobile.replace(/\s+/g, ' ').trim(),
    email: form.email.trim(),
    age: `${form.age.trim()} years`,
    gender: form.gender,
    residentialStatus: listResidentialStatusFromForm(form.residentialStatus),
    riskLevel,
  };
}

function extrasFor(nric: string) {
  return (
    PROFILE_EXTRAS[nric.toUpperCase()] ?? {
      race: 'Chinese',
      religion: 'Buddhism',
      preferredLanguages: ['English'],
      address: '—',
      postalCode: '—',
      referredBy: '—',
      chasCardType: 'Blue',
      healthierSg: 'unsure',
      firstMammogramScreening: 'no',
      lastScreeningYear: '—',
      personalCancerHistory: 'No',
      familyHistory: '—',
      preferredScreeningDate: '—',
      preferredTimeSlot: 'morning',
      screeningLocationEvent: '—',
      reviewPeriod: '6months',
    }
  );
}

export function buildDetailsFormDataForRow(row: MockProspectListRow): DetailsFormDataState {
  const x = extrasFor(row.nric);
  const ageNum = parseAgeYears(row.age);
  const dateOfBirth = dobDdMmYyyyFromNricAndAge(row.nric, ageNum);
  const primaryProgram = row.programs[0] ?? 'mammobus';

  return {
    name: row.name,
    nric: row.nric,
    gender: row.gender,
    dateOfBirth,
    age: String(ageNum),
    mobile: row.contact.replace(/\s+/g, ' ').trim(),
    email: row.email,
    residentialStatus: mapResidential(row.residentialStatus),
    religion: x.religion,
    preferredLanguages: [...x.preferredLanguages],
    race: x.race,
    address: x.address,
    postalCode: x.postalCode,
    sourceType: row.source,
    sourceName: row.sourceDetail,
    referredBy: x.referredBy,
    programEnrolled: programLabel(primaryProgram),
    chasCardType: x.chasCardType,
    healthierSg: x.healthierSg,
    firstMammogramScreening: x.firstMammogramScreening,
    lastScreeningYear: x.lastScreeningYear,
    subsidyType: 'Healthier SG',
    hasChronicConditions: row.riskLevel === 'High' ? 'Yes' : 'No',
    chronicConditions: row.riskLevel === 'High' ? 'See case notes' : 'None',
    currentMedications: '—',
    allergies: '—',
    smokingStatus: 'Non-smoker',
    alcoholConsumption: 'Occasional',
    riskLevel: row.riskLevel,
    personalCancerHistory: x.personalCancerHistory,
    preExistingConditions: 'None',
    familyHistory: x.familyHistory,
    cancerScreeningEligibilityCheck: row.riskLevel === 'High' ? 'Yes' : 'No',
    riskFactors:
      row.riskLevel === 'High'
        ? 'Documented family history / risk factors'
        : 'Routine screening cohort',
    pdpaConsent: 'Consented',
    edmSubscription: 'Subscribed',
    consentContact: 'Consented to be contacted for screening appointment booking',
    consentDate: row.dateRegistered,
    marketingConsent: 'No',
    preferredScreeningDate: x.preferredScreeningDate,
    preferredTimeSlot: x.preferredTimeSlot,
    screeningLocationEvent: x.screeningLocationEvent,
    reviewPeriod: x.reviewPeriod,
    nextReviewDate: formatNextReviewLong(row.nextReview),
  };
}

export function buildProspectHeaderFromRow(row: MockProspectListRow): ProspectDetailHeader {
  const ageNum = parseAgeYears(row.age);
  return {
    nric: row.nric,
    name: row.name,
    gender: row.gender,
    age: ageNum,
    mobile: row.contact.replace(/\s+/g, ' ').trim(),
    email: row.email,
    programs: row.programs.map(programLabel),
    currentStage: row.status,
    stages: buildPipelineStages(row.status),
    assignTo: row.assignTo.length ? row.assignTo.join(', ') : '—',
  };
}

export type MedicalHistoryFormState = {
  familyCancerHistory: string;
  relativesWithCancer: string;
  personalCancerHistory: string;
  previousScreenings: string;
  abnormalResults: string;
  treatmentHistory: string;
  breastSurgery: string;
  breastSymptoms: string;
  lastMammogramDate: string;
  pregnancyStatus: string;
  breastfeeding: string;
  hormonalTherapy: string;
  implants: string;
  historyOfCancer: string;
  diagnosedYear: string;
  cancerDetail: string;
  followUpAt: string;
  surgery: string;
  radiationTherapy: string;
  chemotherapy: string;
};

export function buildMedicalHistoryFormDataForRow(row: MockProspectListRow): MedicalHistoryFormState {
  const x = extrasFor(row.nric);
  return {
    familyCancerHistory: x.familyHistory.includes('Mother') || x.familyHistory.includes('breast') ? 'Yes' : 'No',
    relativesWithCancer: x.familyHistory,
    personalCancerHistory: x.personalCancerHistory,
    previousScreenings: row.programs.includes('mammobus') ? 'Mammogram (within programme)' : 'As per GP records',
    abnormalResults: 'No',
    treatmentHistory: 'None',
    breastSurgery: 'No',
    breastSymptoms: 'No',
    lastMammogramDate: row.programs.includes('mammobus') ? '2024-03-10' : '—',
    pregnancyStatus: row.gender === 'Female' ? 'Not applicable' : 'Not applicable',
    breastfeeding: 'No',
    hormonalTherapy: 'No',
    implants: 'No',
    historyOfCancer: 'No',
    diagnosedYear: '-',
    cancerDetail: '-',
    followUpAt: '-',
    surgery: 'No',
    radiationTherapy: 'No',
    chemotherapy: 'No',
  };
}

export type OtherDetailsFormState = {
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  preferredContactTime: string;
  transportNeeded: string;
  languageSupport: string;
  accessibilityNeeds: string;
  dietaryRestrictions: string;
  religiousConsiderations: string;
  insurance: string;
  insuranceProvider: string;
  policyNumber: string;
  employmentStatus: string;
  education: string;
  householdIncome: string;
  otherMedicalIllness: string;
  currentMedication: string;
  drugAllergy: string;
  immunosuppressiveCondition: string;
  ageFirstIntercourse: string;
  multipleSexualPartners: string;
  smoking: string;
  smokingDuration: string;
  sexuallyTransmittedInfections: string;
  ocpUse: string;
  childrenCount: string;
  hpvVaccinated: string;
  cervicalOtherDetails: string;
  lastPapTestDate: string;
  lastPapTestResult: string;
  lastMammogramDate: string;
  chasCardHolder: string;
  ageAtMenarche: string;
  ageAtMenopause: string;
  ageAtFirstChildbirth: string;
  hrtDuration: string;
  preMalignantConditions: string;
  breastConditionsDetails: string;
};

export function buildOtherDetailsFormDataForRow(row: MockProspectListRow): OtherDetailsFormState {
  const firstName = row.name.split(/\s+/)[0] ?? 'Contact';
  return {
    emergencyContactName: `${firstName} — spouse`,
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '9123 4567',
    preferredContactTime: 'Morning (9am - 12pm)',
    transportNeeded: row.age.startsWith('6') ? 'Sometimes' : 'No',
    languageSupport: 'No',
    accessibilityNeeds: 'None',
    dietaryRestrictions: 'None',
    religiousConsiderations: 'None',
    insurance: 'Yes',
    insuranceProvider: '—',
    policyNumber: '—',
    employmentStatus: parseAgeYears(row.age) >= 62 ? 'Retired' : 'Employed',
    education: 'Secondary',
    householdIncome: '$2,000 - $4,000',
    otherMedicalIllness: 'As per screening notes',
    currentMedication: '—',
    drugAllergy: 'No',
    immunosuppressiveCondition: 'No',
    ageFirstIntercourse: '—',
    multipleSexualPartners: '—',
    smoking: 'No',
    smokingDuration: '—',
    sexuallyTransmittedInfections: 'No',
    ocpUse: '—',
    childrenCount: '—',
    hpvVaccinated: row.programs.includes('hpv') ? 'No' : '—',
    cervicalOtherDetails: '—',
    lastPapTestDate: '—',
    lastPapTestResult: '—',
    lastMammogramDate: '—',
    chasCardHolder: row.residentialStatus === 'Citizen' ? 'Yes' : 'No',
    ageAtMenarche: row.gender === 'Female' ? '12' : '',
    ageAtMenopause: row.gender === 'Female' ? '50' : '',
    ageAtFirstChildbirth: row.gender === 'Female' ? '30' : '',
    hrtDuration: '',
    preMalignantConditions: 'No',
    breastConditionsDetails: 'None',
  };
}
