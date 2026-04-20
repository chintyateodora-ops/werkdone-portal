/**
 * ProspectManagement — standalone self-contained module.
 *
 * No external context, router, or provider required.
 * Drop it anywhere; pass optional callbacks to wire navigation.
 *
 * Usage:
 *   <ProspectManagement />
 *   <ProspectManagement
 *     onSelectProspect={(recordId) => navigate(`/prospects/${recordId}`)}
 *     onAddProspect={(program) => navigate(`/register/${program}`)}
 *   />
 */

import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  Filter,
  List,
  LayoutGrid,
  ChevronDown,
  MoreHorizontal,
  Calendar,
  Download,
  X,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  TrendingUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

// ─── Design tokens (mirror tokens.css) ───────────────────────────────────────

const T = {
  primary: '#7c51a1',
  primaryLight: '#f2eef6',
  primaryMid: '#d3c5e0',
  white: '#ffffff',
  pageBg: '#f9fafb',
  border: '#e5e7eb',
  borderInput: '#ced4da',
  neutral2: '#f1f3f5',
  neutral3: '#e9ecef',
  neutral6: '#868e96',
  neutral7: '#6a7178',
  neutral8: '#4f575e',
  neutral9: '#272b30',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray700: '#374151',
  gray900: '#111827',
  statusEnquiring: '#f97316',
  statusQualified: '#8b5cf6',
  statusBooked: '#10b981',
  statusScreened: '#7c51a1',
  riskHigh: '#dc2626',
  riskMedium: '#d97706',
  riskLow: '#059669',
  errorRed: '#bb2915',
  radius: '8px',
  radiusSm: '4px',
  radiusBtn: '5px',
  radiusPill: '999px',
  shadowCard: '0 0 10px 0 rgba(188,201,192,0.5)',
  fontBody: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProgramKey = 'mammobus' | 'hpv' | 'fit';
export type ProgramFilter = 'all' | ProgramKey;
export type StatusKey = 'Enquiring' | 'Qualified' | 'Booked' | 'Screened';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type ViewMode = 'table' | 'kanban';
export type SortDir = 'asc' | 'desc';

export interface Prospect {
  recordId: string;
  nric: string;
  maskedNric: string;
  name: string;
  age: string;
  gender: string;
  contact: string;
  email: string;
  status: StatusKey;
  programs: ProgramKey[];
  source: string;
  sourceDetail: string;
  nextReview: string;
  assignTo: string[];
  tasksCompleted: number;
  tasksTotal: number;
  riskLevel: RiskLevel;
  residentialStatus: 'Citizen' | 'PR' | 'Foreigner';
  dateRegistered: string;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_PROSPECTS: Prospect[] = [
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
  {
    recordId: 'IND-008',
    nric: 'S5512890H',
    name: 'Lee Wei Xiong',
    maskedNric: 'S****890H',
    age: '70 years',
    gender: 'Male',
    contact: '9876 5432',
    email: 'leewx@email.com',
    status: 'Screened',
    programs: ['mammobus'],
    source: 'Campaign',
    sourceDetail: 'Silver Generation Outreach',
    nextReview: '2026-12-01',
    assignTo: ['Jasmine Lim'],
    tasksCompleted: 10,
    tasksTotal: 10,
    riskLevel: 'High',
    residentialStatus: 'Citizen',
    dateRegistered: '2025-07-10',
  },
  {
    recordId: 'IND-009',
    nric: 'S9003774K',
    name: 'Priya Sundaram',
    maskedNric: 'S****774K',
    age: '35 years',
    gender: 'Female',
    contact: '8123 4567',
    email: 'priya.sun@gmail.com',
    status: 'Qualified',
    programs: ['hpv', 'mammobus'],
    source: 'Referral',
    sourceDetail: 'GP Referral - Bishan Clinic',
    nextReview: '2026-08-20',
    assignTo: [],
    tasksCompleted: 2,
    tasksTotal: 8,
    riskLevel: 'High',
    residentialStatus: 'Citizen',
    dateRegistered: '2026-02-14',
  },
  {
    recordId: 'IND-010',
    nric: 'S6807321J',
    name: 'Tan Ah Kow',
    maskedNric: 'S****321J',
    age: '57 years',
    gender: 'Male',
    contact: '9234 5678',
    email: 'tahkow@hotmail.com',
    status: 'Qualified',
    programs: ['fit'],
    source: 'Campaign',
    sourceDetail: 'Colon Health Awareness Month',
    nextReview: '2026-10-05',
    assignTo: ['Fan Wei Zhe'],
    tasksCompleted: 3,
    tasksTotal: 8,
    riskLevel: 'Low',
    residentialStatus: 'Citizen',
    dateRegistered: '2026-01-20',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string | undefined): string {
  if (!iso || String(iso).trim() === '') return '—';
  const t = new Date(`${String(iso).trim()}T12:00:00`).getTime();
  if (Number.isNaN(t)) return '—';
  return new Date(t).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function statusColor(status: StatusKey): string {
  switch (status) {
    case 'Enquiring': return T.statusEnquiring;
    case 'Qualified': return T.statusQualified;
    case 'Booked':    return T.statusBooked;
    case 'Screened':  return T.statusScreened;
    default:          return T.gray500;
  }
}

function riskColor(risk: RiskLevel): string {
  switch (risk) {
    case 'High':   return T.riskHigh;
    case 'Medium': return T.riskMedium;
    case 'Low':    return T.riskLow;
  }
}

function programColor(program: ProgramKey): { bg: string; text: string } {
  switch (program) {
    case 'mammobus': return { bg: '#fee2e2', text: '#dc2626' };
    case 'hpv':      return { bg: '#dbeafe', text: '#1e40af' };
    case 'fit':      return { bg: '#d1fae5', text: '#059669' };
  }
}

function programLabel(program: ProgramKey): string {
  switch (program) {
    case 'mammobus': return 'Mammogram';
    case 'hpv':      return 'HPV';
    case 'fit':      return 'FIT';
  }
}

function programFilterLabel(pf: ProgramFilter): string {
  switch (pf) {
    case 'all':      return 'All Prospects';
    case 'mammobus': return 'Mammogram Prospects';
    case 'hpv':      return 'HPV Prospects';
    case 'fit':      return 'FIT Prospects';
  }
}

const VIEW_MODE_KEY = 'wd-pm-view-mode';

function readStoredViewMode(): ViewMode {
  try {
    const v = localStorage.getItem(VIEW_MODE_KEY);
    if (v === 'table' || v === 'kanban') return v;
  } catch { /* private mode */ }
  return 'kanban';
}

function saveViewMode(v: ViewMode) {
  try { localStorage.setItem(VIEW_MODE_KEY, v); } catch { /* ignore */ }
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

// KPI Summary Strip
interface KpiStripProps {
  rows: Prospect[];
  activeKpi: string | null;
  onKpiClick: (key: string) => void;
}

function KpiStrip({ rows, activeKpi, onKpiClick }: KpiStripProps) {
  const total      = rows.length;
  const enquiring  = rows.filter(r => r.status === 'Enquiring').length;
  const qualified  = rows.filter(r => r.status === 'Qualified').length;
  const booked     = rows.filter(r => r.status === 'Booked').length;
  const screened   = rows.filter(r => r.status === 'Screened').length;
  const highRisk   = rows.filter(r => r.riskLevel === 'High').length;
  const convRate   = total > 0 ? Math.round((screened / total) * 100) : 0;

  const cards: { key: string; label: string; value: string | number; accent: string; icon: React.ReactNode }[] = [
    { key: 'total',     label: 'Total cases',      value: total,             accent: T.primary,          icon: <Users size={16} /> },
    { key: 'enquiring', label: 'Enquiring',         value: enquiring,         accent: T.statusEnquiring,  icon: <Clock size={16} /> },
    { key: 'qualified', label: 'Qualified',         value: qualified,         accent: T.statusQualified,  icon: <AlertCircle size={16} /> },
    { key: 'booked',    label: 'Booked',            value: booked,            accent: T.statusBooked,     icon: <Calendar size={16} /> },
    { key: 'screened',  label: 'Screened',          value: screened,          accent: T.statusScreened,   icon: <CheckCircle2 size={16} /> },
    { key: 'highrisk',  label: 'High risk',         value: highRisk,          accent: T.riskHigh,         icon: <AlertCircle size={16} /> },
    { key: 'conv',      label: 'Conversion rate',   value: `${convRate}%`,    accent: T.primary,          icon: <TrendingUp size={16} /> },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '0.75rem',
        padding: '1rem 1.5rem',
        background: T.white,
        borderBottom: `1px solid ${T.border}`,
      }}
      role="group"
      aria-label="Prospect summary"
    >
      {cards.map(c => {
        const active = activeKpi === c.key;
        return (
          <article
            key={c.key}
            role="button"
            tabIndex={0}
            aria-pressed={active}
            onClick={() => onKpiClick(c.key)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onKpiClick(c.key); }}
            style={{
              background: active ? c.accent + '12' : T.white,
              border: `1px solid ${active ? c.accent : T.border}`,
              borderRadius: T.radius,
              padding: '0.875rem 1rem',
              cursor: 'pointer',
              transition: 'border-color 0.15s, background 0.15s',
              outline: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: c.accent, marginBottom: '0.375rem' }}>
              {c.icon}
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: T.neutral7 }}>
                {c.label}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: T.neutral9, lineHeight: 1.1 }}>
              {c.value}
            </p>
          </article>
        );
      })}
    </div>
  );
}

// Program Tabs
interface ProgramTabsProps {
  value: ProgramFilter;
  onChange: (p: ProgramFilter) => void;
}

const PROGRAM_TABS: { key: ProgramFilter; label: string }[] = [
  { key: 'all',      label: 'All Prospects' },
  { key: 'mammobus', label: 'Mammogram' },
  { key: 'hpv',      label: 'HPV' },
  { key: 'fit',      label: 'FIT' },
];

function ProgramTabs({ value, onChange }: ProgramTabsProps) {
  return (
    <div
      style={{ display: 'flex', gap: '0.25rem', padding: '0 1.5rem' }}
      role="tablist"
      aria-label="Program filter"
    >
      {PROGRAM_TABS.map(t => {
        const active = value === t.key;
        return (
          <button
            key={t.key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.key)}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderBottom: active ? `2px solid ${T.primary}` : '2px solid transparent',
              background: 'transparent',
              color: active ? T.primary : T.neutral7,
              fontWeight: active ? 600 : 400,
              fontSize: '0.875rem',
              cursor: 'pointer',
              fontFamily: T.fontBody,
              transition: 'color 0.15s, border-color 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// Status pill
function StatusPill({ status }: { status: StatusKey }) {
  const c = statusColor(status);
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.2rem 0.6rem',
      borderRadius: T.radiusPill,
      background: c + '1a',
      color: c,
      fontSize: '0.75rem',
      fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  );
}

// Risk badge
function RiskBadge({ risk }: { risk: RiskLevel }) {
  const c = riskColor(risk);
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.15rem 0.5rem',
      borderRadius: T.radiusPill,
      background: c + '15',
      color: c,
      fontSize: '0.6875rem',
      fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>
      {risk} Risk
    </span>
  );
}

// Program chip
function ProgramChip({ program }: { program: ProgramKey }) {
  const { bg, text } = programColor(program);
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.15rem 0.5rem',
      borderRadius: T.radiusSm,
      background: bg,
      color: text,
      fontSize: '0.75rem',
      fontWeight: 500,
    }}>
      {programLabel(program)}
    </span>
  );
}

// Progress bar
function ProgressBar({ completed, total, accent }: { completed: number; total: number; accent: string }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '0.6875rem', color: T.gray500 }}>Tasks</span>
        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: T.neutral9 }}>{completed}/{total}</span>
      </div>
      <div style={{ height: '0.375rem', borderRadius: T.radiusPill, background: T.gray200, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: T.radiusPill,
          background: pct === 100 ? T.statusBooked : accent,
          transition: 'width 0.3s',
        }} />
      </div>
    </div>
  );
}

// Actions dropdown (row-level)
interface RowActionsProps {
  prospect: Prospect & { currentProgram: ProgramKey };
  onView?: () => void;
}

function RowActions({ prospect, onView }: RowActionsProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
        style={{
          padding: '0.25rem',
          border: 'none',
          background: 'transparent',
          borderRadius: T.radiusSm,
          cursor: 'pointer',
          color: T.gray500,
          display: 'flex',
          alignItems: 'center',
        }}
        aria-label="Row actions"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            right: 0,
            top: '100%',
            marginTop: '0.25rem',
            background: T.white,
            border: `1px solid ${T.border}`,
            borderRadius: T.radius,
            boxShadow: T.shadowCard,
            zIndex: 20,
            minWidth: '160px',
            overflow: 'hidden',
          }}
        >
          {[
            { label: 'View details', action: onView },
            { label: 'Edit',         action: () => {} },
            { label: 'Add tag',      action: () => {} },
            { label: 'Log contact',  action: () => {} },
          ].map(item => (
            <button
              key={item.label}
              role="menuitem"
              onClick={e => { e.stopPropagation(); setOpen(false); item.action?.(); }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '0.625rem 1rem',
                border: 'none',
                background: 'transparent',
                fontSize: '0.875rem',
                color: T.neutral9,
                cursor: 'pointer',
                fontFamily: T.fontBody,
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = T.gray100)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Table view
type SortKey = 'name' | 'status' | 'dateRegistered' | 'nextReview' | 'riskLevel';

interface TableViewProps {
  rows: (Prospect & { currentProgram: ProgramKey })[];
  programFilter: ProgramFilter;
  onSelectProspect?: (recordId: string) => void;
}

function TableView({ rows, programFilter, onSelectProspect }: TableViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      let av = '';
      let bv = '';
      switch (sortKey) {
        case 'name':           av = a.name; bv = b.name; break;
        case 'status':         av = a.status; bv = b.status; break;
        case 'dateRegistered': av = a.dateRegistered; bv = b.dateRegistered; break;
        case 'nextReview':     av = a.nextReview; bv = b.nextReview; break;
        case 'riskLevel': {
          const order = { High: 0, Medium: 1, Low: 2 };
          const diff = order[a.riskLevel] - order[b.riskLevel];
          return sortDir === 'asc' ? diff : -diff;
        }
      }
      const cmp = av.localeCompare(bv);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [rows, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ArrowUpDown size={12} style={{ opacity: 0.4 }} />;
    return sortDir === 'asc'
      ? <ArrowUp size={12} style={{ color: T.primary }} />
      : <ArrowDown size={12} style={{ color: T.primary }} />;
  }

  const thStyle: React.CSSProperties = {
    padding: '0.625rem 1rem',
    fontSize: '0.6875rem',
    fontWeight: 600,
    color: T.gray500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    background: T.gray100,
    borderBottom: `1px solid ${T.border}`,
  };

  const sortableTh = (label: string, key: SortKey): React.CSSProperties => ({ ...thStyle, cursor: 'pointer' });

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: T.fontBody }}>
        <thead>
          <tr>
            <th style={thStyle}>Ref / Name</th>
            {programFilter === 'all' && <th style={thStyle}>Program</th>}
            <th
              style={sortableTh('Date registered', 'dateRegistered')}
              onClick={() => toggleSort('dateRegistered')}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                Date registered <SortIcon k="dateRegistered" />
              </span>
            </th>
            <th style={thStyle}>Contact</th>
            <th
              style={sortableTh('Status', 'status')}
              onClick={() => toggleSort('status')}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                Status <SortIcon k="status" />
              </span>
            </th>
            <th style={thStyle}>Source</th>
            <th
              style={sortableTh('Next review', 'nextReview')}
              onClick={() => toggleSort('nextReview')}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                Next review <SortIcon k="nextReview" />
              </span>
            </th>
            <th style={thStyle}>Assigned to</th>
            <th
              style={sortableTh('Risk', 'riskLevel')}
              onClick={() => toggleSort('riskLevel')}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                Risk <SortIcon k="riskLevel" />
              </span>
            </th>
            <th style={{ ...thStyle, textAlign: 'right' }}></th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 && (
            <tr>
              <td colSpan={10} style={{ padding: '3rem', textAlign: 'center', color: T.gray400, fontSize: '0.875rem' }}>
                No prospects match the current filters.
              </td>
            </tr>
          )}
          {sorted.map(r => (
            <tr
              key={`${r.recordId}-${r.currentProgram}`}
              onClick={() => onSelectProspect?.(r.recordId)}
              style={{ borderBottom: `1px solid ${T.border}`, cursor: onSelectProspect ? 'pointer' : 'default', transition: 'background 0.1s' }}
              onMouseEnter={e => (e.currentTarget.style.background = T.pageBg)}
              onMouseLeave={e => (e.currentTarget.style.background = T.white)}
            >
              {/* Ref / Name */}
              <td style={{ padding: '0.875rem 1rem', minWidth: '180px' }}>
                <span
                  style={{ fontSize: '0.6875rem', color: T.primary, fontWeight: 500, display: 'block' }}
                  onClick={e => { e.stopPropagation(); onSelectProspect?.(r.recordId); }}
                >
                  {r.recordId} · {r.maskedNric}
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: T.neutral9 }}>{r.name}</span>
                <span style={{ display: 'block', fontSize: '0.8125rem', color: T.gray500 }}>
                  {r.gender} · {r.age}
                </span>
              </td>
              {/* Program */}
              {programFilter === 'all' && (
                <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                  <ProgramChip program={r.currentProgram} />
                </td>
              )}
              {/* Date registered */}
              <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: T.neutral9, whiteSpace: 'nowrap' }}>
                {formatDate(r.dateRegistered)}
              </td>
              {/* Contact */}
              <td style={{ padding: '0.875rem 1rem' }}>
                <span style={{ display: 'block', fontSize: '0.875rem', color: T.neutral9 }}>{r.contact}</span>
                <span style={{ display: 'block', fontSize: '0.8125rem', color: T.gray500 }}>{r.email}</span>
              </td>
              {/* Status */}
              <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                <StatusPill status={r.status} />
              </td>
              {/* Source */}
              <td style={{ padding: '0.875rem 1rem' }}>
                <span style={{ display: 'block', fontSize: '0.875rem', color: T.neutral9 }}>{r.source}</span>
                <span style={{ display: 'block', fontSize: '0.8125rem', color: T.gray500, maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.sourceDetail}
                </span>
              </td>
              {/* Next review */}
              <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: T.neutral9, whiteSpace: 'nowrap' }}>
                {formatDate(r.nextReview)}
              </td>
              {/* Assigned to */}
              <td style={{ padding: '0.875rem 1rem' }}>
                {r.assignTo.length > 0
                  ? r.assignTo.map(s => (
                      <span
                        key={s}
                        style={{
                          display: 'inline-block',
                          padding: '0.125rem 0.5rem',
                          borderRadius: T.radiusPill,
                          background: T.neutral2,
                          color: T.neutral8,
                          fontSize: '0.75rem',
                          marginRight: '0.25rem',
                          marginBottom: '0.25rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {s}
                      </span>
                    ))
                  : <span style={{ fontSize: '0.875rem', color: T.gray400 }}>Unassigned</span>}
              </td>
              {/* Risk */}
              <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                <RiskBadge risk={r.riskLevel} />
              </td>
              {/* Actions */}
              <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                <RowActions
                  prospect={r}
                  onView={() => onSelectProspect?.(r.recordId)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Kanban card
interface KanbanCardProps {
  prospect: Prospect & { currentProgram: ProgramKey };
  stageAccent: string;
  programFilter: ProgramFilter;
  onSelect?: () => void;
}

function KanbanCard({ prospect: r, stageAccent, programFilter, onSelect }: KanbanCardProps) {
  return (
    <article
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onSelect?.(); }}
      style={{
        background: T.white,
        border: `1px solid ${T.border}`,
        borderRadius: T.radius,
        padding: '0.875rem',
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'box-shadow 0.15s, transform 0.15s',
        outline: 'none',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = T.shadowCard;
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLElement).style.transform = 'none';
      }}
    >
      {/* Program / identifier chip */}
      <div style={{ marginBottom: '0.625rem' }}>
        <ProgramChip program={r.currentProgram} />
      </div>

      {/* Name */}
      <h3 style={{ margin: '0 0 0.25rem', fontSize: '0.9375rem', fontWeight: 600, color: T.neutral9 }}>
        {r.name}
      </h3>
      <p style={{ margin: '0 0 0.75rem', fontSize: '0.8125rem', color: T.gray500 }}>
        {r.maskedNric} · {r.gender} · {r.age}
      </p>

      {/* Risk + residential */}
      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
        <RiskBadge risk={r.riskLevel} />
        <span style={{
          display: 'inline-block',
          padding: '0.15rem 0.5rem',
          borderRadius: T.radiusPill,
          background: T.neutral2,
          color: T.neutral7,
          fontSize: '0.6875rem',
          fontWeight: 500,
        }}>
          {r.residentialStatus}
        </span>
      </div>

      {/* Task progress */}
      <ProgressBar completed={r.tasksCompleted} total={r.tasksTotal} accent={stageAccent} />

      {/* Next review */}
      {r.nextReview && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.75rem', color: T.gray500 }}>
          <Calendar size={12} />
          <span style={{ fontSize: '0.75rem' }}>Next review: {formatDate(r.nextReview)}</span>
        </div>
      )}
    </article>
  );
}

// Kanban view
interface KanbanViewProps {
  rows: (Prospect & { currentProgram: ProgramKey })[];
  programFilter: ProgramFilter;
  onSelectProspect?: (recordId: string) => void;
}

const KANBAN_STAGES: { key: StatusKey; label: string }[] = [
  { key: 'Enquiring', label: 'Enquiring' },
  { key: 'Qualified', label: 'Qualified' },
  { key: 'Booked',    label: 'Booked' },
  { key: 'Screened',  label: 'Screened' },
];

function KanbanView({ rows, programFilter, onSelectProspect }: KanbanViewProps) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', alignItems: 'flex-start', paddingBottom: '1rem' }}>
      {KANBAN_STAGES.map(stage => {
        const accent = statusColor(stage.key);
        const inCol = rows.filter(r => r.status === stage.key);
        return (
          <div
            key={stage.key}
            style={{
              flexShrink: 0,
              width: '288px',
              background: accent + '0d',
              borderRadius: T.radius,
              padding: '0.75rem',
            }}
          >
            {/* Column header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.375rem 0.75rem',
                  borderRadius: T.radiusPill,
                  background: accent + '20',
                  border: `1px solid ${accent}30`,
                }}
              >
                <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: accent, flexShrink: 0 }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: T.neutral9, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {stage.label}
                </span>
                <span style={{
                  padding: '0.125rem 0.5rem',
                  borderRadius: T.radiusPill,
                  background: T.white,
                  color: accent,
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  minWidth: '1.25rem',
                  textAlign: 'center',
                }}>
                  {inCol.length}
                </span>
              </div>
            </div>

            {/* Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {inCol.length === 0 && (
                <p style={{ fontSize: '0.8125rem', color: T.gray400, textAlign: 'center', padding: '1rem 0', margin: 0 }}>
                  No prospects
                </p>
              )}
              {inCol.map(r => (
                <KanbanCard
                  key={`${r.recordId}-${r.currentProgram}`}
                  prospect={r}
                  stageAccent={accent}
                  programFilter={programFilter}
                  onSelect={() => onSelectProspect?.(r.recordId)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Filter modal
interface FilterModalProps {
  filters: ListFilters;
  onChange: (f: ListFilters) => void;
  onClose: () => void;
}

export interface ListFilters {
  statuses: StatusKey[];
  risks: RiskLevel[];
  programs: ProgramKey[];
  sources: string[];
}

function FilterModal({ filters, onChange, onClose }: FilterModalProps) {
  const [draft, setDraft] = useState<ListFilters>({ ...filters });

  function toggleItem<T extends string>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Filter prospects"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }}
        aria-hidden="true"
      />
      {/* Panel */}
      <div
        style={{
          position: 'relative',
          width: '340px',
          maxHeight: '100vh',
          overflowY: 'auto',
          background: T.white,
          boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: T.neutral9 }}>Filters</h2>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: T.gray500, padding: '0.25rem' }}
            aria-label="Close filters"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status */}
        <FilterSection label="Status">
          {(['Enquiring', 'Qualified', 'Booked', 'Screened'] as StatusKey[]).map(s => (
            <FilterChip
              key={s}
              label={s}
              checked={draft.statuses.includes(s)}
              accent={statusColor(s)}
              onChange={() => setDraft(d => ({ ...d, statuses: toggleItem(d.statuses, s) }))}
            />
          ))}
        </FilterSection>

        {/* Risk */}
        <FilterSection label="Risk level">
          {(['High', 'Medium', 'Low'] as RiskLevel[]).map(r => (
            <FilterChip
              key={r}
              label={`${r} Risk`}
              checked={draft.risks.includes(r)}
              accent={riskColor(r)}
              onChange={() => setDraft(d => ({ ...d, risks: toggleItem(d.risks, r) }))}
            />
          ))}
        </FilterSection>

        {/* Programs */}
        <FilterSection label="Program">
          {(['mammobus', 'hpv', 'fit'] as ProgramKey[]).map(p => {
            const { text } = programColor(p);
            return (
              <FilterChip
                key={p}
                label={programLabel(p)}
                checked={draft.programs.includes(p)}
                accent={text}
                onChange={() => setDraft(d => ({ ...d, programs: toggleItem(d.programs, p) }))}
              />
            );
          })}
        </FilterSection>

        {/* Source */}
        <FilterSection label="Source type">
          {(['Event', 'Campaign', 'Manual', 'Referral'] as string[]).map(s => (
            <FilterChip
              key={s}
              label={s}
              checked={draft.sources.includes(s)}
              accent={T.primary}
              onChange={() => setDraft(d => ({ ...d, sources: toggleItem(d.sources as string[], s) as string[] }) as ListFilters)}
            />
          ))}
        </FilterSection>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
          <button
            onClick={() => { setDraft({ statuses: [], risks: [], programs: [], sources: [] }); }}
            style={{
              flex: 1, padding: '0.625rem', border: `1px solid ${T.border}`, borderRadius: T.radiusBtn,
              background: T.white, color: T.neutral9, fontSize: '0.875rem', fontWeight: 500,
              cursor: 'pointer', fontFamily: T.fontBody,
            }}
          >
            Clear all
          </button>
          <button
            onClick={() => { onChange(draft); onClose(); }}
            style={{
              flex: 1, padding: '0.625rem', border: 'none', borderRadius: T.radiusBtn,
              background: T.primary, color: T.white, fontSize: '0.875rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: T.fontBody,
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: T.neutral7, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>{children}</div>
    </div>
  );
}

function FilterChip({ label, checked, accent, onChange }: { label: string; checked: boolean; accent: string; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      aria-pressed={checked}
      style={{
        padding: '0.3rem 0.75rem',
        borderRadius: T.radiusPill,
        border: `1px solid ${checked ? accent : T.border}`,
        background: checked ? accent + '18' : T.white,
        color: checked ? accent : T.neutral8,
        fontSize: '0.8125rem',
        fontWeight: checked ? 600 : 400,
        cursor: 'pointer',
        fontFamily: T.fontBody,
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export interface ProspectManagementProps {
  /** Override the seed data. Defaults to built-in mock prospects. */
  prospects?: Prospect[];
  /** Called when the user clicks a prospect row or card. */
  onSelectProspect?: (recordId: string) => void;
  /** Called when the user picks a registration program from "Add Prospect". */
  onAddProspect?: (program: ProgramKey) => void;
}

export function ProspectManagement({
  prospects = SEED_PROSPECTS,
  onSelectProspect,
  onAddProspect,
}: ProspectManagementProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(readStoredViewMode);
  const [programFilter, setProgramFilter] = useState<ProgramFilter>('all');
  const [search, setSearch] = useState('');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<ListFilters>({ statuses: [], risks: [], programs: [], sources: [] });
  const [activeKpi, setActiveKpi] = useState<string | null>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const addRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportMenuOpen(false);
      if (addRef.current && !addRef.current.contains(e.target as Node)) setAddMenuOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Persist view mode
  useEffect(() => { saveViewMode(viewMode); }, [viewMode]);

  // Expand rows per-program for "all" view
  const expandedRows = useMemo((): (Prospect & { currentProgram: ProgramKey })[] => {
    if (programFilter === 'all') {
      const out: (Prospect & { currentProgram: ProgramKey })[] = [];
      for (const p of prospects) {
        for (const prog of p.programs) {
          out.push({ ...p, currentProgram: prog });
        }
      }
      return out;
    }
    return prospects
      .filter(p => p.programs.includes(programFilter))
      .map(p => ({ ...p, currentProgram: programFilter }));
  }, [prospects, programFilter]);

  // Apply search + filters
  const filteredRows = useMemo(() => {
    let rows = expandedRows;

    // KPI quick filter
    if (activeKpi) {
      switch (activeKpi) {
        case 'enquiring': rows = rows.filter(r => r.status === 'Enquiring'); break;
        case 'qualified': rows = rows.filter(r => r.status === 'Qualified'); break;
        case 'booked':    rows = rows.filter(r => r.status === 'Booked'); break;
        case 'screened':  rows = rows.filter(r => r.status === 'Screened'); break;
        case 'highrisk':  rows = rows.filter(r => r.riskLevel === 'High'); break;
      }
    }

    // Panel filters
    if (filters.statuses.length)  rows = rows.filter(r => filters.statuses.includes(r.status));
    if (filters.risks.length)     rows = rows.filter(r => filters.risks.includes(r.riskLevel));
    if (filters.programs.length)  rows = rows.filter(r => filters.programs.includes(r.currentProgram));
    if (filters.sources.length)   rows = rows.filter(r => filters.sources.includes(r.source));

    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.contact.includes(q) ||
        r.maskedNric.toLowerCase().includes(q) ||
        r.recordId.toLowerCase().includes(q)
      );
    }

    return rows;
  }, [expandedRows, activeKpi, filters, search]);

  function handleKpiClick(key: string) {
    setActiveKpi(prev => prev === key ? null : key);
  }

  // Filter badge count
  const filterCount =
    filters.statuses.length +
    filters.risks.length +
    filters.programs.length +
    filters.sources.length;

  const btnBase: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
    padding: '0.5rem 0.875rem', border: `1px solid ${T.border}`,
    borderRadius: T.radiusBtn, fontSize: '0.875rem', fontWeight: 500,
    cursor: 'pointer', fontFamily: T.fontBody, transition: 'background 0.15s, border-color 0.15s',
    background: T.white, color: T.neutral9,
  };
  const btnPrimary: React.CSSProperties = { ...btnBase, background: T.primary, color: T.white, border: `1px solid ${T.primary}` };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        background: T.pageBg,
        fontFamily: T.fontBody,
        color: T.neutral9,
      }}
    >
      {/* ── KPI Strip ── */}
      <KpiStrip rows={expandedRows} activeKpi={activeKpi} onKpiClick={handleKpiClick} />

      {/* ── Program Tabs ── */}
      <div style={{ background: T.white, borderBottom: `1px solid ${T.border}`, paddingTop: '0.5rem' }}>
        <ProgramTabs value={programFilter} onChange={p => { setProgramFilter(p); setActiveKpi(null); }} />
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: T.neutral9 }}>
            {programFilterLabel(programFilter)}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Export */}
            <div ref={exportRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setExportMenuOpen(v => !v)}
                style={btnBase}
                aria-haspopup="menu"
                aria-expanded={exportMenuOpen}
              >
                <Download size={14} />
                Export
                <ChevronDown size={12} style={{ opacity: 0.6 }} />
              </button>
              {exportMenuOpen && (
                <div
                  role="menu"
                  style={{
                    position: 'absolute', right: 0, top: '100%', marginTop: '0.25rem',
                    background: T.white, border: `1px solid ${T.border}`, borderRadius: T.radius,
                    boxShadow: T.shadowCard, zIndex: 10, minWidth: '160px', overflow: 'hidden',
                  }}
                >
                  {['Export CSV', 'Export Excel'].map(opt => (
                    <button
                      key={opt}
                      role="menuitem"
                      onClick={() => setExportMenuOpen(false)}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '0.625rem 1rem', border: 'none', background: 'transparent',
                        fontSize: '0.875rem', color: T.neutral9, cursor: 'pointer', fontFamily: T.fontBody,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = T.gray100)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Add Prospect */}
            <div ref={addRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setAddMenuOpen(v => !v)}
                style={btnPrimary}
                aria-haspopup="menu"
                aria-expanded={addMenuOpen}
              >
                <Plus size={14} />
                Add Prospect
                <ChevronDown size={12} style={{ opacity: 0.8 }} />
              </button>
              {addMenuOpen && (
                <div
                  role="menu"
                  style={{
                    position: 'absolute', right: 0, top: '100%', marginTop: '0.25rem',
                    background: T.white, border: `1px solid ${T.border}`, borderRadius: T.radius,
                    boxShadow: T.shadowCard, zIndex: 10, minWidth: '240px', overflow: 'hidden',
                  }}
                >
                  {[
                    { key: 'mammobus' as ProgramKey, label: 'Mammogram Screening Registration' },
                    { key: 'hpv' as ProgramKey,      label: 'HPV Screening Programme' },
                    { key: 'fit' as ProgramKey,      label: 'FIT Screening Programme' },
                  ].map(item => (
                    <button
                      key={item.key}
                      role="menuitem"
                      onClick={() => { setAddMenuOpen(false); onAddProspect?.(item.key); }}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '0.625rem 1rem', border: 'none', background: 'transparent',
                        fontSize: '0.875rem', color: T.neutral9, cursor: 'pointer', fontFamily: T.fontBody,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = T.gray100)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search / Filter / View toggle bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 260px', minWidth: '200px' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: T.gray400, pointerEvents: 'none' }} />
            <input
              type="search"
              placeholder="Search by name, NRIC, phone…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                border: `1px solid ${T.borderInput}`, borderRadius: T.radiusBtn,
                fontSize: '0.875rem', color: T.neutral9, background: T.white,
                fontFamily: T.fontBody, outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = T.primary)}
              onBlur={e => (e.currentTarget.style.borderColor = T.borderInput)}
            />
          </div>

          {/* Filter button */}
          <button
            onClick={() => setFilterModalOpen(true)}
            style={{
              ...btnBase,
              borderColor: filterCount > 0 ? T.primary : T.border,
              background: filterCount > 0 ? T.primaryLight : T.white,
              color: filterCount > 0 ? T.primary : T.neutral9,
            }}
            aria-haspopup="dialog"
            aria-expanded={filterModalOpen}
          >
            <Filter size={14} />
            Filters
            {filterCount > 0 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '1.125rem', height: '1.125rem', borderRadius: '50%',
                background: T.primary, color: T.white, fontSize: '0.6875rem', fontWeight: 700,
              }}>
                {filterCount}
              </span>
            )}
          </button>

          {/* View toggle */}
          <div
            style={{
              display: 'inline-flex', border: `1px solid ${T.border}`,
              borderRadius: T.radiusBtn, overflow: 'hidden', background: T.white,
            }}
            role="group"
            aria-label="View mode"
          >
            {([
              { mode: 'kanban' as ViewMode, Icon: LayoutGrid, label: 'Kanban view' },
              { mode: 'table'  as ViewMode, Icon: List,       label: 'List view' },
            ] as const).map(({ mode, Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                aria-pressed={viewMode === mode}
                aria-label={label}
                style={{
                  padding: '0.5rem 0.625rem', border: 'none', cursor: 'pointer',
                  background: viewMode === mode ? T.primaryLight : 'transparent',
                  color: viewMode === mode ? T.primary : T.gray500,
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>

          {/* Results count */}
          <span style={{ fontSize: '0.8125rem', color: T.gray500, whiteSpace: 'nowrap' }}>
            {filteredRows.length} {filteredRows.length === 1 ? 'result' : 'results'}
          </span>
        </div>

        {/* Content: kanban or table */}
        <div
          style={{
            background: viewMode === 'table' ? T.white : 'transparent',
            borderRadius: viewMode === 'table' ? T.radius : 0,
            border: viewMode === 'table' ? `1px solid ${T.border}` : 'none',
            overflow: viewMode === 'table' ? 'hidden' : 'visible',
          }}
        >
          {viewMode === 'kanban' ? (
            <KanbanView
              rows={filteredRows}
              programFilter={programFilter}
              onSelectProspect={onSelectProspect}
            />
          ) : (
            <TableView
              rows={filteredRows}
              programFilter={programFilter}
              onSelectProspect={onSelectProspect}
            />
          )}
        </div>
      </div>

      {/* Filter modal */}
      {filterModalOpen && (
        <FilterModal
          filters={filters}
          onChange={setFilters}
          onClose={() => setFilterModalOpen(false)}
        />
      )}
    </div>
  );
}

export default ProspectManagement;
