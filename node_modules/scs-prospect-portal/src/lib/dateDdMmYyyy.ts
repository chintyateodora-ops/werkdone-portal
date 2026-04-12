/** DD-MM-YYYY helpers — keep in sync with js/date-input.js behaviour */

export function digitsOnly(str: string): string {
  return String(str || '').replace(/\D/g, '').slice(0, 8);
}

export function formatDdMmYyyyFromDigits(d: string): string {
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}-${d.slice(2)}`;
  return `${d.slice(0, 2)}-${d.slice(2, 4)}-${d.slice(4)}`;
}

export function parseDdMmYyyy(str: string): Date | null {
  const m = String(str || '')
    .trim()
    .match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!m) return null;
  const dd = +m[1];
  const mm = +m[2];
  const yyyy = +m[3];
  const dt = new Date(yyyy, mm - 1, dd);
  if (dt.getFullYear() !== yyyy || dt.getMonth() !== mm - 1 || dt.getDate() !== dd) return null;
  return dt;
}

export function dateToIso(dt: Date): string {
  const y = dt.getFullYear();
  const mo = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  return `${y}-${mo}-${d}`;
}

export function isoToDdMmYyyy(iso: string): string {
  if (!iso) return '';
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return '';
  return `${m[3]}-${m[2]}-${m[1]}`;
}

/** Normalize ISO, slash dates, etc. toward DD-MM-YYYY when valid */
export function normalizeDateDisplay(input: string): string {
  const t = String(input || '').trim();
  if (!t || t === '—') return t;
  const direct = parseDdMmYyyy(t);
  if (direct) return isoToDdMmYyyy(dateToIso(direct));
  const slash = t.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2}|\d{4})$/);
  if (slash) {
    let dd = +slash[1];
    let mm = +slash[2];
    let y = +slash[3];
    if (y < 100) y += y >= 50 ? 1900 : 2000;
    const dt = new Date(y, mm - 1, dd);
    if (dt.getFullYear() === y && dt.getMonth() === mm - 1 && dt.getDate() === dd) {
      return isoToDdMmYyyy(dateToIso(dt));
    }
  }
  const iso = t.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    const y = +iso[1];
    const mo = +iso[2];
    const d = +iso[3];
    const dt = new Date(y, mo - 1, d);
    if (dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d) {
      return isoToDdMmYyyy(t);
    }
  }
  return t;
}

/** Combine DD-MM-YYYY with HH:mm (24h) for Date parsing */
export function combineDdMmYyyyAndTime(dateStr: string, timeStr: string): Date | null {
  const d = parseDdMmYyyy(dateStr.trim());
  if (!d) return null;
  if (!timeStr || !timeStr.trim()) return d;
  const parts = timeStr.trim().split(':');
  const hh = parseInt(parts[0] || '0', 10);
  const mm = parseInt(parts[1] || '0', 10);
  d.setHours(Number.isFinite(hh) ? hh : 0, Number.isFinite(mm) ? mm : 0, 0, 0);
  return d;
}
