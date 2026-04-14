/**
 * Shared screening-records row model for Prospect Detail v1 (V3 UI) and Classic.
 */

import { labelHealthierSg } from '../../lib/healthierSgProfile';

export type ScreeningTypeKey = 'ALL' | 'MMG' | 'FIT' | 'PAP';

export type ScreeningRecord = {
  id: string;
  submitted: string;
  typeKey: Exclude<ScreeningTypeKey, 'ALL'>;
  typeLabel: string;
  status: string;
  appointmentDate: string;
  appointmentTime: string;
  venue: string;
  apptType: string;
  actionLabel: '' | 'Reschedule' | 'Book Appt';
  details: Array<[string, string]>;
};

export type ScreeningRecordsHistoryField = { name: string; from: string; to: string };

export type ScreeningRecordsHistoryPayload = {
  title: string;
  category: 'Appointment' | 'Screening' | 'Biodata' | 'Eligibility' | 'Task';
  by: string;
  byInitials: string;
  isSystem?: boolean;
  timestamp: string;
  desc: string;
  tagColorClass: string;
  tagTextClass: string;
  fields: ScreeningRecordsHistoryField[];
};

export type ProspectScreeningProfile = {
  status?: string;
  programs?: string[];
  dateRegistered?: string;
  recordId?: string;
  name?: string;
  age?: number;
  gender?: string;
};

/** `details` shape matches `buildDetailsFormDataForRow` output. */
export function buildInitialScreeningRecords(details: Record<string, any>, profile: ProspectScreeningProfile): ScreeningRecord[] {
  return [
    {
      id: 's1',
      submitted: details.dateRegistered || profile.dateRegistered || '—',
      typeKey: 'MMG',
      typeLabel: 'Mammogram',
      status: profile.status || 'Booked',
      appointmentDate: details.appointmentDate || '—',
      appointmentTime: details.appointmentTime || '—',
      venue: details.screeningLocationEvent || details.screeningLocationClinic || '—',
      apptType: details.apptType || (profile.programs?.[0] ? profile.programs[0] : '—'),
      actionLabel: (profile.status || '').toLowerCase() === 'booked' ? 'Reschedule' : 'Book Appt',
      details: [
        ['Appt Programme', details.apptProgramme || '—'],
        ['Event Address', details.eventAddress || '—'],
        ['Time Slot', details.appointmentTime || '—'],
        ['Submitted By', details.submittedBy || '—'],
        ['CHAS Card', details.chasCardType || '—'],
        ['HealthierSG', labelHealthierSg(details.healthierSg)],
        ['Prior Screening', details.priorCancerScreening || '—'],
        ['Risk Assessment', details.riskAssessmentSummary || '—'],
      ],
    },
    {
      id: 's2',
      submitted: details.previousScreeningSubmittedDate || '—',
      typeKey: 'MMG',
      typeLabel: 'Mammogram',
      status: 'Qualified',
      appointmentDate: '—',
      appointmentTime: '—',
      venue: '—',
      apptType: details.screeningLocationClinic || 'SCS Clinic @ Bishan',
      actionLabel: 'Book Appt',
      details: [
        ['Appt Programme', details.screeningLocationClinic || '—'],
        ['Preferred Date', details.preferredDate || '—'],
        ['Preferred Time', details.preferredTime || '—'],
        ['Submitted By', details.submittedBy || '—'],
        ['Personal Hx Cancer', details.personalHxCancer || '—'],
        ['Family Hx Cancer', details.familyHxCancer || '—'],
        ['Pre-existing Conditions', details.preExistingConditions || '—'],
        ['Status Note', details.statusNote || '—'],
      ],
    },
    {
      id: 's3',
      submitted: details.fitSubmittedDate || '—',
      typeKey: 'FIT',
      typeLabel: 'FIT Kit',
      status: 'Completed',
      appointmentDate: details.fitAppointmentDate || '—',
      appointmentTime: details.fitAppointmentTime || '—',
      venue: details.fitVenue || '—',
      apptType: details.fitApptType || 'Polyclinic',
      actionLabel: '',
      details: [
        ['FIT Result', details.fitResult || '—'],
        ['CHAS Card', details.chasCardType || '—'],
        ['Next FIT Due', details.nextFitDue || '—'],
        ['Visit No.', details.fitVisitNo || '—'],
      ],
    },
    {
      id: 's4',
      submitted: details.hpvSubmittedDate || '—',
      typeKey: 'PAP',
      typeLabel: 'HPV Test',
      status: 'Completed',
      appointmentDate: details.hpvAppointmentDate || '—',
      appointmentTime: details.hpvAppointmentTime || '—',
      venue: details.hpvVenue || '—',
      apptType: details.hpvApptType || 'HealthierSG',
      actionLabel: '',
      details: [
        ['Pap Result Class', details.papResultClass || '—'],
        ['HPV 16', details.hpv16 || '—'],
        ['HPV 18', details.hpv18 || '—'],
        ['Other High Risk HPV', details.otherHighRiskHpv || '—'],
        ['Next Appt In', details.nextApptIn || '—'],
        ['Visit No.', details.hpvVisitNo || '—'],
      ],
    },
    {
      id: 's5',
      submitted: details.papSubmittedDate || '—',
      typeKey: 'PAP',
      typeLabel: 'PAP Test',
      status: 'Completed',
      appointmentDate: details.papAppointmentDate || '—',
      appointmentTime: details.papAppointmentTime || '—',
      venue: details.papVenue || '—',
      apptType: details.papApptType || 'Clinic',
      actionLabel: '',
      details: [
        ['Result', details.papResult || '—'],
        ['HPV Vaccination', details.hpvVaccination || '—'],
        ['Visit No.', details.papVisitNo || '—'],
      ],
    },
  ];
}

export function computeScreeningTotals(screenings: ScreeningRecord[]) {
  const all = screenings;
  const mmg = all.filter((r) => r.typeKey === 'MMG').length;
  const fit = all.filter((r) => r.typeKey === 'FIT').length;
  const pap = all.filter((r) => r.typeKey === 'PAP').length;
  const booked = all.filter((r) => (r.status || '').toLowerCase() === 'booked').length;
  const qualified = all.filter((r) => (r.status || '').toLowerCase() === 'qualified').length;
  const nextApptRow =
    all.find((r) => (r.status || '').toLowerCase() === 'booked' && r.appointmentDate !== '—') || all.find((r) => r.appointmentDate !== '—');
  return {
    total: all.length,
    mmg,
    fit,
    pap,
    booked,
    qualified,
    nextAppt: nextApptRow
      ? {
          date: nextApptRow.appointmentDate,
          time: nextApptRow.appointmentTime,
          type: nextApptRow.typeLabel,
        }
      : null,
    lastScreening: all[0]?.submitted || '—',
  };
}
