/**
 * Canonical Healthier SG enrolment values stored on profile / forms.
 * Legacy `yes` | `no` | `unsure` and label-like strings are normalized for display and controls.
 */
const LABELS: Record<string, string> = {
  enrolled: 'Enrolled',
  'not-enrolled': 'Not Enrolled',
  unsure: 'Unsure',
};

export const HEALTHIER_SG_FORM_OPTIONS = [
  { value: 'enrolled', label: 'Enrolled' },
  { value: 'not-enrolled', label: 'Not Enrolled' },
  { value: 'unsure', label: 'Unsure' },
] as const;

export function canonicalHealthierSgStored(raw: string | null | undefined): string {
  const s = String(raw ?? '').trim().toLowerCase();
  const compact = s.replace(/[^a-z0-9]/g, '');
  if (compact === 'yes' || compact === 'enrolled') return 'enrolled';
  if (compact === 'no' || compact === 'notenrolled') return 'not-enrolled';
  if (compact === 'unsure' || compact.startsWith('unsure') || compact.includes('prefernottosay')) return 'unsure';
  return String(raw ?? '').trim();
}

/** Value for `<select>` / Radix Select — only known keys, else empty (placeholder). */
export function healthierSgControlValue(raw: string | null | undefined): string {
  const c = canonicalHealthierSgStored(raw);
  return c === 'enrolled' || c === 'not-enrolled' || c === 'unsure' ? c : '';
}

export function labelHealthierSg(stored: string | null | undefined): string {
  const c = canonicalHealthierSgStored(stored);
  if (LABELS[c]) return LABELS[c];
  const t = String(stored ?? '').trim();
  return t || '—';
}
