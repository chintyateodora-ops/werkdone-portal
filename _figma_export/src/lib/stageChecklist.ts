export type PipelineStage = 'Enquiring' | 'Qualified' | 'Booked' | 'Screened';

export function getStageChecklistLabels(stage: PipelineStage | string): string[] {
  const labels: Record<string, string[]> = {
    Enquiring: [
      'Full name and date of birth collected',
      'NRIC / FIN number recorded',
      'Residency status confirmed (SC / PR / Foreigner)',
      'Mobile number and email captured',
      'Age eligibility confirmed (40 years and above)',
      'Not currently pregnant or breastfeeding',
      'No active breast symptoms present',
      'Date of last mammogram established',
      'Healthier SG or CHAS enrolment checked',
      'First-time screener status noted',
    ],
    Qualified: [
      'All eligibility criteria met and documented',
      'Subsidy pathway confirmed (Healthier SG / CHAS / self-pay)',
      'Preferred screening date and time captured',
      'Mammobus location / event communicated',
      'Pre-screening instructions shared (no deodorant etc.)',
      'What to bring explained (NRIC, two-piece clothing)',
      'COVID vaccination date noted if within 6 weeks',
      'Family history of breast cancer documented',
      'Any implants or prior surgery flagged for radiographer',
      'Consent to data collection obtained (PDPA)',
    ],
    Booked: [
      'Appointment confirmation sent (SMS / email)',
      'Reminder sent 1 week before appointment',
      'Reminder sent 3 days before appointment',
      'No-show deposit process explained',
      'Transport or logistics support offered if needed',
      'Day-of checklist shared with participant',
      'Coordinator notified of any special requirements',
    ],
    Screened: [
      'Attendance confirmed on screening day',
      'Screening completed without issues',
      'Results communication timeline explained',
      'Results sent / received by participant',
      'Abnormal results — referral pathway activated',
      'Normal results — next screening date communicated',
      'Participant satisfaction / feedback collected',
      'Peer referral ask made (refer a friend)',
      'Re-engagement reminder set (12 or 24 months)',
      'Record updated in system',
    ],
  };

  return labels[String(stage)] || [];
}

