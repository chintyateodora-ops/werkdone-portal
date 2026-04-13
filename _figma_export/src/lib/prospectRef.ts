import { MOCK_PROSPECTS, type MockProspectListRow } from '../data/mockProspectsList';

function normalizeName(s: string): string {
  return s.trim().replace(/\s+/g, ' ').toLowerCase();
}

function base64UrlEncodeJson(payload: object): string {
  const json = JSON.stringify(payload);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecodeToJson(ref: string): unknown | null {
  try {
    const padLen = (4 - (ref.length % 4)) % 4;
    const pad = padLen ? '='.repeat(padLen) : '';
    const b64 = ref.replace(/-/g, '+').replace(/_/g, '/') + pad;
    const json = decodeURIComponent(escape(atob(b64)));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Mask NRIC/FIN for list display (first char + **** + last 4). */
export function maskNric(nric: string): string {
  const s = nric.trim().toUpperCase();
  if (s.length < 5) return s;
  return `${s[0]}****${s.slice(-4)}`;
}

export type ProspectRefPayload =
  | { kind: 'record'; recordId: string }
  | { kind: 'legacy'; name: string; nric: string };

/**
 * Stable URL token keyed by `recordId` — survives name/NRIC edits in master data.
 */
export function encodeProspectRecordRef(recordId: string): string {
  return base64UrlEncodeJson({ r: recordId.trim() });
}

/**
 * Legacy token from full name + NRIC (still supported for old links).
 */
export function encodeProspectRef(name: string, nric: string): string {
  return base64UrlEncodeJson({
    n: name.trim(),
    i: nric.trim().toUpperCase(),
  });
}

export function decodeProspectRefPayload(ref: string): ProspectRefPayload | null {
  const o = base64UrlDecodeToJson(ref) as { r?: unknown; n?: unknown; i?: unknown } | null;
  if (!o || typeof o !== 'object') return null;
  if (o.r != null && String(o.r).trim() !== '') {
    return { kind: 'record', recordId: String(o.r).trim() };
  }
  if (o.n != null && o.i != null) {
    return { kind: 'legacy', name: String(o.n), nric: String(o.i).toUpperCase() };
  }
  return null;
}

/** @deprecated Use decodeProspectRefPayload */
export function decodeProspectRef(ref: string): { name: string; nric: string } | null {
  const p = decodeProspectRefPayload(ref);
  if (!p) return null;
  if (p.kind === 'legacy') return { name: p.name, nric: p.nric };
  return null;
}

/**
 * Resolve a row from master profile map (`recordId` or legacy name+NRIC match).
 */
export function resolveProspectByRef(
  ref: string,
  profilesByRecordId: Record<string, MockProspectListRow>
): MockProspectListRow | undefined {
  const payload = decodeProspectRefPayload(ref);
  if (!payload) return undefined;
  if (payload.kind === 'record') {
    return profilesByRecordId[payload.recordId];
  }
  const nn = normalizeName(payload.name);
  const ni = payload.nric.toUpperCase();
  return Object.values(profilesByRecordId).find(
    (p) => normalizeName(p.name) === nn && p.nric.toUpperCase() === ni
  );
}

/** Fallback when context is unavailable (e.g. tests): static seed rows only. */
export function resolveProspectByRefStatic(ref: string): MockProspectListRow | undefined {
  const map = Object.fromEntries(MOCK_PROSPECTS.map((p) => [p.recordId, p]));
  return resolveProspectByRef(ref, map);
}

/** Breadcrumb / subtitle line — no prospect ID. */
export function formatProspectIdentifier(name: string, nric: string): string {
  const n = name.trim();
  const i = nric.trim().toUpperCase();
  return i ? `${n} · ${i}` : n;
}
