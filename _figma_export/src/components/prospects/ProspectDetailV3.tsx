import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  History,
  Plus,
  ShieldAlert,
  ClipboardList,
  Calendar,
  User,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Page } from '../../App';
import { useIndividualProfiles } from '../../context/IndividualProfileContext';
import { resolveProspectByRef } from '../../lib/prospectRef';
import { buildDetailsFormDataForRow } from '../../data/prospectDetailSeed';
import { healthierSgControlValue, labelHealthierSg } from '../../lib/healthierSgProfile';
import { getStageChecklistLabels } from '../../lib/stageChecklist';
import { buildInitialScreeningRecords, computeScreeningTotals, type ScreeningRecord } from './prospectScreeningRecordsModel';
import { ProspectScreeningRecordsCard, type ProspectScreeningRecordsCardHandle } from './ProspectScreeningRecordsCard';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

type ProspectDetailV3Props = {
  onNavigate: (page: Page) => void;
  prospectRef: string;
};

type TaskStage = 'Qualified' | 'Booked' | 'Screened';
type HistoryCategory = 'All' | 'Biodata' | 'Screening' | 'Appointment' | 'Eligibility' | 'Task';

type HistoryField = {
  name: string;
  from: string;
  to: string;
};

type HistoryEntry = {
  id: string;
  title: string;
  category: Exclude<HistoryCategory, 'All'>;
  by: string;
  byInitials: string;
  isSystem?: boolean;
  timestamp: string;
  desc: string;
  tagColorClass: string;
  tagTextClass: string;
  fields: HistoryField[];
};

function riskTone(riskLevel: string | undefined) {
  switch ((riskLevel || '').toLowerCase()) {
    case 'high':
      return 'border-destructive/20 bg-destructive/10 text-destructive';
    case 'medium':
      return 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400';
    case 'low':
      return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
    default:
      return 'border-border bg-muted text-foreground';
  }
}

/** Canonical list aligned with portal `V3_BIODATA_OPTIONS.preferredLanguages` / registration forms. */
const BIODATA_PREF_LANGUAGE_OPTIONS = [
  'English',
  'Mandarin',
  'Malay',
  'Tamil',
  'Hokkien',
  'Cantonese',
  'Teochew',
  'Others',
] as const;

function statusTone(status: string | undefined) {
  switch ((status || '').toLowerCase()) {
    case 'booked':
      return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
    case 'qualified':
      return 'border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400';
    case 'screened':
      return 'border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-400';
    case 'completed':
      return 'border-border bg-muted text-foreground';
    case 'cancelled':
      return 'border-destructive/20 bg-destructive/10 text-destructive';
    default:
      return 'border-border bg-muted text-foreground';
  }
}

function initials(name: string) {
  const p = name.split(/\s+/).filter(Boolean);
  if (!p.length) return '—';
  return `${p[0][0] ?? ''}${p.at(-1)?.[0] ?? ''}`.toUpperCase();
}

export function ProspectDetailV3({ onNavigate, prospectRef }: ProspectDetailV3Props) {
  const { profilesByRecordId } = useIndividualProfiles();
  const profile = useMemo(() => resolveProspectByRef(prospectRef, profilesByRecordId), [prospectRef, profilesByRecordId]);
  const screeningCardRef = useRef<ProspectScreeningRecordsCardHandle>(null);

  const [tab, setTab] = useState<'overview' | 'screenings' | 'biodata' | 'eligibility' | 'appttype' | 'notes'>('overview');
  const [taskStage, setTaskStage] = useState<TaskStage>('Qualified');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<HistoryCategory>('All');
  const [historyExpanded, setHistoryExpanded] = useState<Record<string, boolean>>({});

  const [addScreeningOpen, setAddScreeningOpen] = useState(false);
  const [editBiodataOpen, setEditBiodataOpen] = useState(false);

  if (!profile) {
    return (
      <div className="h-full bg-gray-50 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="text-sm text-gray-700">Prospect Detail v3</div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile not found</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Please return to the listing and select a prospect again.
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const baseDetails = buildDetailsFormDataForRow(profile) as any;
  const [detailsOverrides, setDetailsOverrides] = useState<Record<string, any>>({});
  const details = useMemo(() => ({ ...baseDetails, ...detailsOverrides }), [baseDetails, detailsOverrides]);

  const displayName = useMemo(() => {
    const fn = (details.firstName || '').toString().trim();
    const ln = (details.lastName || '').toString().trim();
    const composed = [fn, ln].filter(Boolean).join(' ').trim();
    return composed || profile.name || '—';
  }, [details.firstName, details.lastName, profile.name]);

  const taskLabels = getStageChecklistLabels(taskStage);
  const [taskDoneByStage, setTaskDoneByStage] = useState<Record<TaskStage, Record<number, boolean>>>(() => {
    const seedDone = Math.max(0, profile.tasksCompleted ?? 0);
    const qualifiedLabels = getStageChecklistLabels('Qualified');
    const bookedLabels = getStageChecklistLabels('Booked');
    const screenedLabels = getStageChecklistLabels('Screened');
    const mk = (count: number, total: number) => {
      const out: Record<number, boolean> = {};
      for (let i = 0; i < total; i += 1) out[i] = i < count;
      return out;
    };
    return {
      Qualified: mk(Math.min(seedDone, qualifiedLabels.length), qualifiedLabels.length),
      Booked: mk(0, bookedLabels.length),
      Screened: mk(0, screenedLabels.length),
    };
  });

  const tasksTotal = taskLabels.length || 0;
  const tasksDone = useMemo(() => {
    const stageMap = taskDoneByStage[taskStage] || {};
    return Object.values(stageMap).filter(Boolean).length;
  }, [taskDoneByStage, taskStage]);

  const placeholderName = profile.name || '—';
  const placeholderRecordId = profile.recordId || 'CPC-YYYY-XXXXX';

  const screeningSeed = useMemo(() => buildInitialScreeningRecords(details, profile), [profile.recordId]);
  const [screenings, setScreenings] = useState<ScreeningRecord[]>(() => screeningSeed);
  useEffect(() => {
    setScreenings(screeningSeed);
  }, [screeningSeed]);

  const totals = useMemo(() => computeScreeningTotals(screenings), [screenings]);

  const statusHistorySeed = [
    { label: 'Booked', meta: `${screenings[0]?.typeLabel ?? '—'} · ${screenings[0]?.submitted ?? '—'}`, tone: 'bg-emerald-500' },
    { label: 'Qualified', meta: `${screenings[1]?.typeLabel ?? '—'} · ${screenings[1]?.submitted ?? '—'}`, tone: 'bg-blue-500' },
    { label: 'Completed', meta: `FIT Kit · ${screenings[2]?.submitted ?? '—'}`, tone: 'bg-slate-500' },
    { label: 'Completed', meta: `HPV Test · ${screenings[3]?.submitted ?? '—'}`, tone: 'bg-slate-500' },
    { label: 'Completed', meta: `PAP Test · ${screenings[4]?.submitted ?? '—'}`, tone: 'bg-slate-500' },
  ];

  const eligibilityQuestionsSeed = [
    { q: 'Are you currently taking or planning to take the COVID-19 vaccine soon?', a: details.q1CovidVaccine || 'No' },
    {
      q: 'Have you done a mammogram in the past 12 months (if aged 40–49) or 24 months (if aged 50 and above)?',
      a: details.q2RecentMammogram || 'No',
    },
    { q: 'Have you been breastfeeding in the past 6 months?', a: details.q3Breastfeeding || 'No' },
    { q: 'Do you have any symptoms (lumps, pain, or nipple discharge) in your breast?', a: details.q4BreastSymptoms || 'No' },
    { q: 'Do you have any breast implants?', a: details.q5Implants || 'No' },
    { q: 'Have you ever had breast cancer?', a: details.q6BreastCancerHx || 'No' },
  ];

  const notesSeed = [
    {
      tone: 'bg-violet-500',
      text: 'Client confirmed appointment. Confirmation SMS sent.',
      meta: `${details.dateRegistered || profile.dateRegistered || '—'} · ${details.submittedBy || 'System'}`,
    },
    {
      tone: 'bg-blue-500',
      text: 'Screening form submitted. Eligibility questions passed. CHAS card verified.',
      meta: `${details.dateRegistered || profile.dateRegistered || '—'} · System`,
    },
    {
      tone: 'bg-slate-500',
      text: 'Previous screening record reviewed — client eligible for screening.',
      meta: `${details.previousScreeningSubmittedDate || '—'} · ${details.submittedBy || '—'}`,
    },
  ];

  const formatNow = () => {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const hh = now.getHours();
    const mm = now.getMinutes().toString().padStart(2, '0');
    const ampm = hh < 12 ? 'am' : 'pm';
    const hh12 = (hh % 12) || 12;
    return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}, ${hh12}:${mm}${ampm}`;
  };

  const mkInitials = (name: string) => {
    const p = (name || '').split(/\s+/).filter(Boolean);
    if (!p.length) return 'SY';
    return p.map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  };

  const categoryTone = (category: HistoryEntry['category']) => {
    switch (category) {
      case 'Appointment':
        return { tagColorClass: 'bg-emerald-100', tagTextClass: 'text-emerald-700' };
      case 'Screening':
        return { tagColorClass: 'bg-violet-100', tagTextClass: 'text-violet-700' };
      case 'Eligibility':
        return { tagColorClass: 'bg-emerald-100', tagTextClass: 'text-emerald-700' };
      case 'Biodata':
        return { tagColorClass: 'bg-blue-100', tagTextClass: 'text-blue-700' };
      case 'Task':
        return { tagColorClass: 'bg-muted', tagTextClass: 'text-foreground' };
      default:
        return { tagColorClass: 'bg-muted', tagTextClass: 'text-muted-foreground' };
    }
  };

  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>(() => {
    const seed: HistoryEntry[] = [
      {
        id: 'v001',
        title: 'Appointment Booked',
        category: 'Appointment',
        by: details.submittedBy || 'Justin Paul',
        byInitials: mkInitials(details.submittedBy || 'Justin Paul'),
        timestamp: details.dateRegistered || profile.dateRegistered || '—',
        desc: 'Appointment confirmed.',
        ...categoryTone('Appointment'),
        fields: [
          { name: 'Appointment Date', from: '—', to: details.appointmentDate || '—' },
          { name: 'Time Slot', from: '—', to: details.appointmentTime || '—' },
          { name: 'Venue', from: '—', to: details.screeningLocationEvent || '—' },
          { name: 'Status', from: 'Qualified', to: 'Booked' },
        ],
      },
      {
        id: 'v002',
        title: 'Biodata Updated',
        category: 'Biodata',
        by: details.submittedBy || 'System',
        byInitials: mkInitials(details.submittedBy || 'System'),
        isSystem: true,
        timestamp: details.dateRegistered || profile.dateRegistered || '—',
        desc: 'Client biodata retrieved and confirmed.',
        ...categoryTone('Biodata'),
        fields: [
          { name: 'Full Name', from: '—', to: displayName },
          { name: 'NRIC', from: '—', to: details.nric || '—' },
          { name: 'Contact', from: '—', to: details.mobile || details.contactNo || '—' },
          { name: 'Email', from: '—', to: details.email || '—' },
        ],
      },
    ];
    return seed;
  });

  const appendHistory = (entry: Omit<HistoryEntry, 'id'>) => {
    setHistoryEntries((prev) => [{ ...entry, id: `v${Date.now()}` }, ...prev]);
  };

  const visibleHistory = useMemo(() => {
    if (historyFilter === 'All') return historyEntries;
    return historyEntries.filter((e) => e.category === historyFilter);
  }, [historyEntries, historyFilter]);

  const [addForm, setAddForm] = useState({
    type: '' as '' | 'mmg' | 'fit' | 'hpv' | 'pap',
    chas: (details.chasCardType || 'Orange') as string,
    healthierSg: healthierSgControlValue(details.healthierSg) as string,
    screeningHistory: (details.priorCancerScreening || '') as string,
    lastYear: (details.lastScreeningYear || '') as string,
    personalHx: (details.personalHxCancer || '') as string,
    familyHx: (details.familyHxCancer || '') as string,
    conditions: (details.preExistingConditions || '') as string,
    apptType: 'mammobus' as 'mammobus' | 'clinic' | 'healthiersg',
  });

  const [bioForm, setBioForm] = useState({
    firstName: (details.firstName || placeholderName.split(' ').slice(0, -1).join(' ') || '') as string,
    lastName: (details.lastName || placeholderName.split(' ').at(-1) || '') as string,
    gender: (profile.gender || 'Female') as string,
    dob: (details.dateOfBirthIso || '') as string,
    nric: (details.nric || '') as string,
    race: (details.race || 'Chinese') as string,
    residentialStatus: (details.residentialStatus || 'Singapore Citizen') as string,
    religion: (details.religion || '—') as string,
    email: (details.email || '') as string,
    contactNo: (details.mobile || details.contactNo || '') as string,
    languageCsv: (details.preferredLanguage || 'English') as string,
    address: (details.address || '') as string,
    postalCode: (details.postalCode || '') as string,
  });

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Topbar / breadcrumb + switches */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-20">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button
            onClick={() => onNavigate('all-prospects')}
            className="inline-flex items-center gap-1 hover:underline text-gray-900"
            type="button"
          >
            <ChevronLeft className="w-4 h-4" />
            Prospect Management
          </button>
          <span className="text-gray-400">›</span>
          <span className="text-gray-900">{profile.name}</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 pt-5">
        <div className="flex items-start gap-4 pb-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 text-white flex items-center justify-center font-semibold">
            {initials(displayName)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-lg font-semibold text-gray-900">{displayName}</div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border bg-gray-50 px-2 py-0.5 font-mono text-xs text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  navigator.clipboard?.writeText(placeholderRecordId);
                  toast('Client ID copied');
                }}
                title="Copy client ID"
              >
                {placeholderRecordId}
              </button>
              <span className="text-gray-300">•</span>
              <span>{profile.gender || '—'} · {profile.age || '—'} y/o</span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                <span className="text-emerald-700 font-medium">{details.clientStatus || 'Active'}</span>
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={`border ${riskTone(profile.riskLevel)}`}>
                <ShieldAlert className="w-3 h-3" />
                {profile.riskLevel} Risk
              </Badge>
              <Badge variant="outline" className={`border ${statusTone(profile.status)}`}>{profile.status}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setHistoryFilter('All');
                setHistoryOpen(true);
              }}
            >
              <History className="w-4 h-4" />
              History
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setAddScreeningOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              Add Screening
            </Button>
          </div>
        </div>

        {/* Quick facts strip (HTML parity) */}
        <div className="pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 rounded-lg border overflow-hidden">
            <button
              type="button"
              className="text-left px-4 py-3 hover:bg-muted/50 border-b lg:border-b-0 lg:border-r"
              onClick={() => {
                navigator.clipboard?.writeText(details.nric || '');
                toast('NRIC copied');
              }}
            >
              <div className="text-[10px] font-semibold tracking-wide uppercase text-muted-foreground">NRIC</div>
              <div className="mt-1 text-sm font-medium text-gray-900 font-mono">{details.maskedNric || details.nric || '—'}</div>
            </button>
            <button
              type="button"
              className="text-left px-4 py-3 hover:bg-muted/50 border-b sm:border-b-0 sm:border-r lg:border-r"
              onClick={() => {
                navigator.clipboard?.writeText(details.mobile || details.contactNo || '');
                toast('Contact copied');
              }}
            >
              <div className="text-[10px] font-semibold tracking-wide uppercase text-muted-foreground">Contact</div>
              <div className="mt-1 text-sm font-medium text-gray-900">{details.mobile || details.contactNo || '—'}</div>
            </button>
            <div className="px-4 py-3 border-b lg:border-b-0 lg:border-r">
              <div className="text-[10px] font-semibold tracking-wide uppercase text-muted-foreground">CHAS Card</div>
              <div className="mt-1 text-sm font-medium text-gray-900">{details.chasCardType || '—'}</div>
            </div>
            <div className="px-4 py-3 border-b sm:border-b-0 sm:border-r lg:border-r">
              <div className="text-[10px] font-semibold tracking-wide uppercase text-muted-foreground">HealthierSG</div>
              <div className="mt-1 text-sm font-medium text-emerald-700">{labelHealthierSg(details.healthierSg)}</div>
            </div>
            <div className="px-4 py-3">
              <div className="text-[10px] font-semibold tracking-wide uppercase text-muted-foreground">Priority</div>
              <div className="mt-1 text-sm font-semibold text-red-600">{details.priority || profile.riskLevel || '—'}</div>
            </div>
          </div>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="gap-0">
          <TabsList className="w-full justify-start bg-transparent p-0 h-auto gap-1 border-t">
            <TabsTrigger value="overview" className="flex-none rounded-none border-0 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Overview
            </TabsTrigger>
            <TabsTrigger value="screenings" className="flex-none rounded-none border-0 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Screenings
              <span className="ml-1 inline-flex h-4 items-center rounded-full bg-muted px-2 text-[10px] font-semibold text-muted-foreground">
                {screenings.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="biodata" className="flex-none rounded-none border-0 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Biodata
            </TabsTrigger>
            <TabsTrigger value="eligibility" className="flex-none rounded-none border-0 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Eligibility
            </TabsTrigger>
            <TabsTrigger value="appttype" className="flex-none rounded-none border-0 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Appt Type &amp; Details
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex-none rounded-none border-0 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Notes
            </TabsTrigger>
          </TabsList>

          <div className="p-6">
            <div className="flex gap-5">
              <div className="flex-1 min-w-0">
                <TabsContent value="overview" className="mt-0">
                  {/* Stat cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
                    <Card className="shadow-none">
                      <CardContent className="p-4">
                        <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">Total Screenings</div>
                        <div className="text-2xl font-bold leading-none">{totals.total}</div>
                      </CardContent>
                    </Card>
                    <Card className="shadow-none border-t-4 border-t-violet-600">
                      <CardContent className="p-4">
                        <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">Mammogram</div>
                        <div className="text-2xl font-bold leading-none text-violet-700">{totals.mmg}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {Math.max(0, totals.booked)} Booked · {Math.max(0, totals.qualified)} Qualified
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="shadow-none border-t-4 border-t-orange-600">
                      <CardContent className="p-4">
                        <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">FIT Kit</div>
                        <div className="text-2xl font-bold leading-none text-orange-700">{totals.fit}</div>
                        <div className="text-xs text-muted-foreground mt-1">Completed</div>
                      </CardContent>
                    </Card>
                    <Card className="shadow-none border-t-4 border-t-emerald-600">
                      <CardContent className="p-4">
                        <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">HPV / PAP</div>
                        <div className="text-2xl font-bold leading-none text-emerald-700">{totals.pap}</div>
                        <div className="text-xs text-muted-foreground mt-1">Completed</div>
                      </CardContent>
                    </Card>
                    <Card className="shadow-none border-t-4 border-t-blue-600">
                      <CardContent className="p-4">
                        <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">Next Appointment</div>
                        <div className="text-sm font-bold leading-tight text-blue-700 mt-1">{totals.nextAppt?.date || '—'}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {totals.nextAppt?.time && totals.nextAppt?.time !== '—' ? `${totals.nextAppt.time} · ` : ''}
                          {totals.nextAppt?.type || '—'}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 3-column area */}
                  <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr_320px] gap-4">
                    <Card className="shadow-none">
                      <CardHeader className="border-b pb-4">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <History className="w-4 h-4" />
                          Status History
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          {statusHistorySeed.map((it, idx) => (
                            <div key={`${it.label}-${idx}`} className="flex gap-3">
                              <div className={['mt-1 h-2 w-2 rounded-full', it.tone].join(' ')} />
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-gray-900">{it.label}</div>
                                <div className="text-xs text-muted-foreground">{it.meta}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-none">
                      <CardHeader className="border-b pb-4">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Screening Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4 text-sm">
                        {[
                          ['Total Screenings', String(totals.total)],
                          ['Mammogram', String(totals.mmg)],
                          ['FIT Kit', String(totals.fit)],
                          ['HPV / PAP', String(totals.pap)],
                          ['Active Bookings', String(totals.booked)],
                          ['Pending Appt', String(totals.qualified)],
                          ['Last Screening', totals.lastScreening],
                        ].map(([l, v]) => (
                          <div key={l} className="flex items-center justify-between py-2 border-b last:border-b-0">
                            <span className="text-muted-foreground">{l}</span>
                            <span className="font-semibold text-gray-900">{v}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <div className="flex flex-col gap-4">
                      <Card className="shadow-none">
                        <CardHeader className="border-b pb-4 flex flex-row items-center justify-between">
                          <CardTitle className="text-sm">Navigator</CardTitle>
                          <button type="button" className="text-xs font-medium text-primary hover:underline">
                            Reassign
                          </button>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
                              {details.navigatorInitials || 'JP'}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-gray-900">{details.navigatorName || '—'}</div>
                              <div className="text-xs text-muted-foreground">{details.navigatorTeam || 'CPC Navigation Team'}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="shadow-none">
                        <CardHeader className="border-b pb-4">
                          <CardTitle className="text-sm">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="flex flex-col gap-2">
                            <Button className="w-full justify-center" size="sm">
                              <Plus className="w-4 h-4" />
                              Add New Screening
                            </Button>
                            <Button className="w-full justify-center" size="sm" variant="outline">
                              Book Appointment
                            </Button>
                            <Button className="w-full justify-center" size="sm" variant="outline">
                              Send SMS Reminder
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Tasks full width */}
                  <Card className="shadow-none mt-4">
                    <CardHeader className="border-b pb-4 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <ClipboardList className="w-4 h-4" />
                        Tasks
                      </CardTitle>
                      <div className="flex items-center gap-3">
                        <div className="inline-flex rounded-md border overflow-hidden bg-white">
                          {(['Qualified', 'Booked', 'Screened'] as const).map((s) => (
                            <button
                              key={s}
                              type="button"
                              className={[
                                'px-3 py-1.5 text-xs font-semibold',
                                taskStage === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/50',
                              ].join(' ')}
                              onClick={() => setTaskStage(s)}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {tasksDone} / {tasksTotal} completed
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2 text-sm">
                        {(taskLabels.length ? taskLabels : ['No tasks available']).map((lbl, i) => {
                          const done = !!taskDoneByStage[taskStage]?.[i];
                          return (
                            <button
                              key={`${lbl}-${i}`}
                              type="button"
                              className="w-full text-left flex items-start gap-3 py-1 hover:bg-muted/40 rounded-md px-2 -mx-2"
                              onClick={() => {
                                setTaskDoneByStage((prev) => {
                                  const stageMap = { ...(prev[taskStage] || {}) };
                                  stageMap[i] = !stageMap[i];
                                  return { ...prev, [taskStage]: stageMap } as typeof prev;
                                });
                                appendHistory({
                                  title: 'Task Updated',
                                  category: 'Task',
                                  by: details.submittedBy || 'Justin Paul',
                                  byInitials: mkInitials(details.submittedBy || 'Justin Paul'),
                                  timestamp: formatNow(),
                                  desc: `Task ${!done ? 'completed' : 'unchecked'} [${taskStage}]: "${lbl}"`,
                                  ...categoryTone('Task'),
                                  fields: [],
                                });
                                toast(!done ? 'Task completed' : 'Task unchecked');
                              }}
                            >
                              <div
                                className={[
                                  'mt-0.5 h-4 w-4 rounded border flex items-center justify-center',
                                  done ? 'bg-primary border-primary text-white' : 'bg-white border-border',
                                ].join(' ')}
                              >
                                {done ? <CheckCircle2 className="w-3 h-3" /> : null}
                              </div>
                              <div className={done ? 'text-muted-foreground line-through' : 'text-gray-900'}>{lbl}</div>
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="screenings" className="mt-0">
                  <ProspectScreeningRecordsCard
                    ref={screeningCardRef}
                    details={details}
                    profile={profile}
                    recordKey={profile.recordId || prospectRef}
                    screenings={screenings}
                    onScreeningsChange={setScreenings}
                    onDetailsPatch={(p) => setDetailsOverrides((prev) => ({ ...prev, ...p }))}
                    onAppendHistory={appendHistory}
                    afterBookConfirm={() => setTab('screenings')}
                  />
                </TabsContent>

                <TabsContent value="biodata" className="mt-0">
                  <Card className="shadow-none">
                    <CardHeader className="border-b pb-4 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Personal Information
                      </CardTitle>
                      <button
                        type="button"
                        className="text-xs font-medium text-primary hover:underline"
                        onClick={() => setEditBiodataOpen(true)}
                      >
                        Edit
                      </button>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="p-4 border-b lg:border-b-0 lg:border-r">
                          <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-3">Identity</div>
                          {[
                            ['First Name', details.firstName || placeholderName.split(' ').slice(0, -1).join(' ') || '—'],
                            ['Last Name', details.lastName || placeholderName.split(' ').at(-1) || '—'],
                            ['NRIC', details.nric || '—'],
                            ['Date of Birth', details.dateOfBirth || '—'],
                            ['Age', profile.age ? String(profile.age) : '—'],
                            ['Gender', profile.gender || '—'],
                            ['Race', details.race || '—'],
                            ['Religion', details.religion || '—'],
                            ['Residential Status', details.residentialStatus || '—'],
                          ].map(([l, v]) => (
                            <div key={l} className="flex items-start justify-between gap-3 py-2 border-b last:border-b-0">
                              <span className="text-xs text-muted-foreground">{l}</span>
                              <span className={['text-xs font-medium text-gray-900 text-right', l === 'NRIC' ? 'font-mono' : ''].join(' ')}>
                                {v || '—'}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="p-4">
                          <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-3">Contact &amp; Address</div>
                          {[
                            ['Email', details.email || '—'],
                            ['Contact No.', details.mobile || details.contactNo || '—'],
                            ['Preferred Language', details.preferredLanguage || 'English'],
                            ['Address', details.address || '—'],
                            ['Postal Code', details.postalCode || '—'],
                          ].map(([l, v]) => (
                            <div key={l} className="flex items-start justify-between gap-3 py-2 border-b last:border-b-0">
                              <span className="text-xs text-muted-foreground">{l}</span>
                              <span className={['text-xs font-medium text-gray-900 text-right', l.includes('Contact') || l.includes('Postal') ? 'font-mono' : ''].join(' ')}>
                                {v || '—'}
                              </span>
                            </div>
                          ))}

                          <div className="mt-4 pt-3 border-t">
                            <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-3">Screening Eligibility</div>
                            {[
                              ['CHAS Card Type', details.chasCardType || '—'],
                              ['HealthierSG Status', labelHealthierSg(details.healthierSg)],
                              ['Prior Cancer Screening', details.priorCancerScreening || '—'],
                              ['Year of Last Screening', details.lastScreeningYear || '—'],
                            ].map(([l, v]) => (
                              <div key={l} className="flex items-start justify-between gap-3 py-2 border-b last:border-b-0">
                                <span className="text-xs text-muted-foreground">{l}</span>
                                <span className="text-xs font-medium text-gray-900 text-right">{v || '—'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="eligibility" className="mt-0">
                  <Card className="shadow-none">
                    <CardHeader className="border-b pb-4 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm">Section 2 — Screening Eligibility</CardTitle>
                      <span className="text-xs text-muted-foreground">{details.eligibilityMeta || 'Mammogram · Submitted —'}</span>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="px-4 py-3 bg-muted/40 border-b text-sm flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">
                          {eligibilityQuestionsSeed.length} of {eligibilityQuestionsSeed.length} questions answered — Client passed all screening criteria.
                        </span>
                        <Badge variant="outline" className="border border-emerald-500/20 bg-emerald-500/10 text-emerald-700">
                          Eligible
                        </Badge>
                      </div>
                      <div className="divide-y">
                        {eligibilityQuestionsSeed.map((it, idx) => {
                          const answer = (it.a || '—').toString();
                          const isYes = answer.toLowerCase() === 'yes';
                          return (
                            <div key={it.q} className="flex items-start justify-between gap-4 px-4 py-4">
                              <div className="min-w-0">
                                <div className="text-[11px] font-semibold text-muted-foreground">{`Q${idx + 1} OF ${eligibilityQuestionsSeed.length}`}</div>
                                <div className="text-sm text-gray-900 mt-1">{it.q}</div>
                              </div>
                              <span
                                className={[
                                  'shrink-0 rounded-full px-3 py-1 text-xs font-bold',
                                  isYes ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700',
                                ].join(' ')}
                              >
                                {answer}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="px-4 py-3 text-xs text-muted-foreground bg-muted/40 border-t">
                        Eligibility responses are tied to each individual screening submission and are not overwritten.
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="appttype" className="mt-0">
                  <div className="space-y-4">
                    <Card className="shadow-none">
                      <CardHeader className="border-b pb-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm">Section 3 — Appointment Type Selected</CardTitle>
                        <span className="text-xs text-muted-foreground">{details.apptTypeMeta || 'Mammogram · —'}</span>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="px-4 py-4 bg-violet-50 border-b">
                          <div className="text-[11px] font-bold uppercase tracking-wide text-violet-700">✓ Selected</div>
                          <div className="text-sm font-semibold text-gray-900 mt-1">
                            {details.selectedApptTypeName || 'Community Mammobus Programme'}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {details.selectedApptTypeDesc ||
                              'An initiative to bring subsidised mammogram screenings to different neighbourhoods across Singapore.'}
                          </div>
                          <div className="text-xs text-muted-foreground italic mt-2">{details.selectedApptTypeNote || 'Note: Not wheelchair-accessible.'}</div>
                          <Badge variant="outline" className="mt-3 border border-emerald-500/20 bg-emerald-500/10 text-emerald-700">
                            {details.selectedApptTypeEligibilityTag || 'Available to all eligible clients'}
                          </Badge>
                        </div>
                        <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Other Options Presented
                        </div>
                        <div className="divide-y">
                          {[
                            {
                              iconBg: 'bg-violet-100',
                              icon: '🏥',
                              name: details.option1Name || 'SCS Clinic @ Bishan',
                              desc:
                                details.option1Desc ||
                                'Clinic option. No cost for Blue/Orange CHAS, aged 50+.',
                              tag: details.option1Tag || 'Client is eligible for this option',
                              tagTone: 'bg-emerald-100 text-emerald-700',
                            },
                            {
                              iconBg: 'bg-blue-100',
                              icon: '🏛️',
                              name: details.option2Name || 'HealthierSG Programme',
                              desc: details.option2Desc || 'Book via HealthHub for subsidised screenings.',
                              tag: details.option2Tag || 'Available to Singapore Citizens',
                              tagTone: 'bg-blue-100 text-blue-700',
                            },
                          ].map((o) => (
                            <div key={o.name} className="flex gap-3 px-4 py-4">
                              <div className={['h-8 w-8 rounded-md flex items-center justify-center text-base', o.iconBg].join(' ')}>{o.icon}</div>
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-gray-900">{o.name}</div>
                                <div className="text-sm text-muted-foreground mt-0.5">{o.desc}</div>
                                <span className={['mt-2 inline-block rounded-full px-3 py-1 text-[11px] font-semibold', o.tagTone].join(' ')}>
                                  {o.tag}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-none">
                      <CardHeader className="border-b pb-4">
                        <CardTitle className="text-sm">Section 4 — Event &amp; Time Slot</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="px-4 py-4 bg-violet-50 border-b">
                          <div className="text-sm font-semibold text-gray-900">{details.eventName || '—'}</div>
                          <div className="text-sm text-muted-foreground mt-1">{details.eventMeta || '—'}</div>
                          <div className="mt-3 flex items-center gap-3">
                            <Badge variant="outline" className={`border ${statusTone(profile.status)}`}>
                              {profile.status || '—'}
                            </Badge>
                            <span className="font-mono text-sm font-semibold text-violet-700">{details.appointmentTime || '—'}</span>
                          </div>
                        </div>
                        <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Other Events Offered (Not Selected)
                        </div>
                        <div className="divide-y">
                          {[
                            { name: details.otherEvent1Name || '—', meta: details.otherEvent1Meta || '—' },
                            { name: details.otherEvent2Name || '—', meta: details.otherEvent2Meta || '—' },
                          ].map((e) => (
                            <div key={e.name} className="flex items-center justify-between gap-3 px-4 py-3">
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-gray-900">{e.name}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">{e.meta}</div>
                              </div>
                              <Badge variant="outline" className="text-muted-foreground">
                                Not Selected
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="mt-0">
                  <Card className="shadow-none">
                    <CardHeader className="border-b pb-4 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm">Case Notes</CardTitle>
                      <button type="button" className="text-xs font-medium text-primary hover:underline">
                        + Add Note
                      </button>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        {notesSeed.map((n, idx) => (
                          <div key={`${idx}-${n.text}`} className="flex gap-3">
                            <div className={['mt-1 h-2.5 w-2.5 rounded-full', n.tone].join(' ')} />
                            <div className="min-w-0">
                              <div className="text-sm text-gray-900">{n.text}</div>
                              <div className="text-xs text-muted-foreground mt-1">{n.meta}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>

              {/* Right sidebar (v3) */}
              <div className="w-[280px] shrink-0 hidden xl:flex flex-col gap-4">
                <Card>
                  <CardHeader className="border-b pb-4">
                    <CardTitle className="text-sm">Screening summary</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 text-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Screenings</span>
                      <span className="font-semibold text-gray-900">{totals.total}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Active Bookings</span>
                      <span className="font-semibold text-emerald-700">{String(totals.booked)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Last Screening</span>
                      <span className="font-semibold text-gray-900">{totals.lastScreening}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Tabs>
      </div>

      {/* History Drawer */}
      <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
        <SheetContent className="sm:max-w-[420px]">
          <SheetHeader>
            <SheetTitle>Version History</SheetTitle>
            <SheetDescription>All updates to {displayName}&apos;s profile</SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {(['All', 'Biodata', 'Screening', 'Appointment', 'Eligibility', 'Task'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setHistoryFilter(c)}
                className={[
                  'px-3 py-1 rounded-full border text-xs font-medium',
                  historyFilter === c ? 'bg-primary text-primary-foreground border-primary' : 'bg-white text-muted-foreground hover:border-primary hover:text-primary',
                ].join(' ')}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-auto px-4 pb-4">
            {visibleHistory.length ? (
              <div className="divide-y">
                {visibleHistory.map((e) => {
                  const shown = e.fields.slice(0, 3);
                  const hidden = e.fields.slice(3);
                  const isOpen = !!historyExpanded[e.id];
                  return (
                    <div key={e.id} className="py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className={['inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold', e.tagColorClass, e.tagTextClass].join(' ')}>
                            {e.category}
                          </span>
                          <div className="mt-1 text-sm font-semibold text-gray-900">{e.title}</div>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">{e.timestamp}</div>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className={['inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold', e.isSystem ? 'bg-muted text-muted-foreground' : 'bg-violet-100 text-violet-700'].join(' ')}>
                          {e.byInitials}
                        </span>
                        <span className="text-foreground">{e.by}</span>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">{e.desc}</div>
                      {e.fields.length ? (
                        <div className="mt-3 rounded-md bg-muted/50 p-3 text-xs">
                          <div className="space-y-2">
                            {shown.map((f) => (
                              <div key={f.name} className="grid grid-cols-[120px_1fr] gap-2">
                                <div className="text-muted-foreground">{f.name}</div>
                                <div className="min-w-0">
                                  <span className="line-through text-red-600/80">{f.from}</span>{' '}
                                  <span className="text-muted-foreground">→</span>{' '}
                                  <span className="font-semibold text-emerald-700">{f.to}</span>
                                </div>
                              </div>
                            ))}
                            {hidden.length && isOpen ? (
                              <div className="space-y-2 pt-2">
                                {hidden.map((f) => (
                                  <div key={f.name} className="grid grid-cols-[120px_1fr] gap-2">
                                    <div className="text-muted-foreground">{f.name}</div>
                                    <div className="min-w-0">
                                      <span className="line-through text-red-600/80">{f.from}</span>{' '}
                                      <span className="text-muted-foreground">→</span>{' '}
                                      <span className="font-semibold text-emerald-700">{f.to}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                            {hidden.length ? (
                              <button
                                type="button"
                                className="text-primary text-xs font-medium hover:underline pt-1"
                                onClick={() => setHistoryExpanded((prev) => ({ ...prev, [e.id]: !prev[e.id] }))}
                              >
                                {isOpen ? 'Show less' : `+${hidden.length} more fields`}
                              </button>
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground py-10">
                No history entries match this filter.
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Add Screening Modal */}
      <Dialog open={addScreeningOpen} onOpenChange={setAddScreeningOpen}>
        <DialogContent className="sm:max-w-[620px]">
          <DialogHeader>
            <DialogTitle>Add New Screening</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Screening Type</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'mmg' as const, label: 'Mammogram' },
                  { id: 'fit' as const, label: 'FIT Kit' },
                  { id: 'hpv' as const, label: 'HPV Test' },
                  { id: 'pap' as const, label: 'PAP Test' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setAddForm((p) => ({ ...p, type: t.id }))}
                    className={[
                      'rounded-lg border px-3 py-2 text-sm font-semibold text-center',
                      addForm.type === t.id ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary hover:text-primary',
                    ].join(' ')}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b pb-2">
              Section 1 — Biodata (auto-filled from latest)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>First Name</Label>
                <Input value={bioForm.firstName} readOnly className="bg-muted" />
              </div>
              <div className="space-y-1">
                <Label>Last Name</Label>
                <Input value={bioForm.lastName} readOnly className="bg-muted" />
              </div>
              <div className="space-y-1">
                <Label>Gender</Label>
                <Input value={bioForm.gender} readOnly className="bg-muted" />
              </div>
              <div className="space-y-1">
                <Label>Date of Birth</Label>
                <Input value={details.dateOfBirth || '—'} readOnly className="bg-muted" />
              </div>
              <div className="space-y-1">
                <Label>NRIC</Label>
                <Input value={bioForm.nric || '—'} readOnly className="bg-muted font-mono" />
              </div>
              <div className="space-y-1">
                <Label>Contact No.</Label>
                <Input value={bioForm.contactNo || '—'} readOnly className="bg-muted font-mono" />
              </div>
              <div className="space-y-1">
                <Label>CHAS Card Type</Label>
                <Select value={addForm.chas} onValueChange={(v) => setAddForm((p) => ({ ...p, chas: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Orange', 'Blue', 'None'].map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>HealthierSG Status</Label>
                <Select value={addForm.healthierSg} onValueChange={(v) => setAddForm((p) => ({ ...p, healthierSg: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      { value: 'enrolled', label: 'Enrolled' },
                      { value: 'not-enrolled', label: 'Not Enrolled' },
                      { value: 'unsure', label: 'Unsure' },
                    ].map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <Label>Cancer Screening History</Label>
                <Input
                  value={addForm.screeningHistory}
                  onChange={(e) => setAddForm((p) => ({ ...p, screeningHistory: e.target.value }))}
                  placeholder="E.g. Mammogram, Pap smear"
                />
              </div>
              <div className="space-y-1">
                <Label>Year of Last Screening</Label>
                <Input
                  value={addForm.lastYear}
                  onChange={(e) => setAddForm((p) => ({ ...p, lastYear: e.target.value }))}
                  placeholder="E.g. 2022"
                />
              </div>
            </div>

            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b pb-2">
              Section 2 — Eligibility Questions
            </div>
            <div className="rounded-lg border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
              Mammogram eligibility questions will be presented on the next screen after saving.
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-1">
                <Label>Personal History of Cancer</Label>
                <Input value={addForm.personalHx} onChange={(e) => setAddForm((p) => ({ ...p, personalHx: e.target.value }))} placeholder="None / describe if any" />
              </div>
              <div className="space-y-1">
                <Label>Family History of Cancer</Label>
                <Input value={addForm.familyHx} onChange={(e) => setAddForm((p) => ({ ...p, familyHx: e.target.value }))} placeholder="None / describe if any" />
              </div>
              <div className="space-y-1">
                <Label>Pre-existing Health Conditions</Label>
                <Input value={addForm.conditions} onChange={(e) => setAddForm((p) => ({ ...p, conditions: e.target.value }))} placeholder="None / describe if any" />
              </div>
            </div>

            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b pb-2">
              Section 3 — Appointment Type
            </div>
            <div className="space-y-2">
              {[
                { id: 'mammobus' as const, name: 'Community Mammobus Programme', desc: 'Subsidised screenings at different neighbourhoods. Not wheelchair-accessible.', tag: 'Available to all eligible clients' },
                { id: 'clinic' as const, name: 'SCS Clinic @ Bishan', desc: 'Clinic option. No cost for Blue/Orange CHAS, aged 50+.', tag: 'Client is eligible' },
                { id: 'healthiersg' as const, name: 'HealthierSG Programme', desc: 'HPB national screening programme. Book via HealthHub.', tag: 'Available to Singapore Citizens' },
              ].map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setAddForm((p) => ({ ...p, apptType: o.id }))}
                  className={[
                    'w-full text-left rounded-lg border p-3 transition',
                    addForm.apptType === o.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary hover:bg-primary/5',
                  ].join(' ')}
                >
                  <div className="text-sm font-semibold text-gray-900">{o.name}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{o.desc}</div>
                  <span className="mt-2 inline-block rounded-full px-3 py-1 text-[11px] font-semibold bg-emerald-100 text-emerald-700">{o.tag}</span>
                </button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddScreeningOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!addForm.type) {
                  toast('Please select a screening type');
                  return;
                }
                const mapType = (t: typeof addForm.type) => {
                  switch (t) {
                    case 'mmg':
                      return { typeKey: 'MMG' as const, typeLabel: 'Mammogram' };
                    case 'fit':
                      return { typeKey: 'FIT' as const, typeLabel: 'FIT Kit' };
                    case 'hpv':
                      return { typeKey: 'PAP' as const, typeLabel: 'HPV Test' };
                    case 'pap':
                      return { typeKey: 'PAP' as const, typeLabel: 'PAP Test' };
                    default:
                      return { typeKey: 'MMG' as const, typeLabel: 'Mammogram' };
                  }
                };
                const t = mapType(addForm.type);
                const newId = `s${Date.now()}`;
                const newRow: ScreeningRecord = {
                  id: newId,
                  submitted: formatNow().split(',')[0],
                  typeKey: t.typeKey,
                  typeLabel: t.typeLabel,
                  status: 'Qualified',
                  appointmentDate: '—',
                  appointmentTime: '—',
                  venue: '—',
                  apptType: addForm.apptType === 'mammobus' ? 'Mammobus' : addForm.apptType === 'clinic' ? 'SCS Clinic @ Bishan' : 'HealthierSG',
                  actionLabel: 'Book Appt',
                  details: [
                    ['Appt Programme', addForm.apptType === 'clinic' ? 'SCS Clinic @ Bishan' : 'Community Mammobus'],
                    ['Preferred Date', '—'],
                    ['Preferred Time', '—'],
                    ['Submitted By', details.submittedBy || 'System'],
                    ['CHAS Card', addForm.chas || '—'],
                    ['HealthierSG', labelHealthierSg(addForm.healthierSg)],
                    ['Prior Screening', addForm.screeningHistory || '—'],
                    ['Year of Last Screening', addForm.lastYear || '—'],
                  ],
                };
                setScreenings((prev) => [newRow, ...prev]);
                setDetailsOverrides((prev) => ({
                  ...prev,
                  chasCardType: addForm.chas,
                  healthierSg: addForm.healthierSg,
                  priorCancerScreening: addForm.screeningHistory,
                  lastScreeningYear: addForm.lastYear,
                  personalHxCancer: addForm.personalHx,
                  familyHxCancer: addForm.familyHx,
                  preExistingConditions: addForm.conditions,
                }));
                appendHistory({
                  title: 'Screening Added',
                  category: 'Screening',
                  by: 'System',
                  byInitials: 'SY',
                  isSystem: true,
                  timestamp: formatNow(),
                  desc: `${t.typeLabel} screening record created with eligibility placeholders and appointment type selection.`,
                  ...categoryTone('Screening'),
                  fields: [
                    { name: 'Screening Type', from: '—', to: t.typeLabel },
                    { name: 'Appt Type', from: '—', to: newRow.apptType },
                    { name: 'Status', from: '—', to: 'Qualified' },
                    { name: 'CHAS Card', from: '—', to: addForm.chas || '—' },
                    { name: 'HealthierSG', from: '—', to: labelHealthierSg(addForm.healthierSg) },
                  ],
                });
                toast('Screening record saved');
                setAddScreeningOpen(false);
                setTab('screenings');
                queueMicrotask(() => screeningCardRef.current?.openBookAppointment(newId));
              }}
            >
              Save &amp; Proceed to Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Biodata Modal */}
      <Dialog open={editBiodataOpen} onOpenChange={setEditBiodataOpen}>
        <DialogContent className="sm:max-w-[620px]">
          <DialogHeader>
            <DialogTitle>Edit Biodata</DialogTitle>
          </DialogHeader>
          <div className="rounded-lg bg-amber-50 border px-3 py-2 text-sm text-amber-800">
            Saving will overwrite existing biodata (placeholder behavior).
          </div>
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b pb-2">Personal Information</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>First Name</Label>
                <Input value={bioForm.firstName} onChange={(e) => setBioForm((p) => ({ ...p, firstName: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Last Name</Label>
                <Input value={bioForm.lastName} onChange={(e) => setBioForm((p) => ({ ...p, lastName: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Gender</Label>
                <Select value={bioForm.gender} onValueChange={(v) => setBioForm((p) => ({ ...p, gender: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Female', 'Male'].map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Date of Birth</Label>
                <Input type="date" value={bioForm.dob} onChange={(e) => setBioForm((p) => ({ ...p, dob: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>NRIC</Label>
                <Input value={bioForm.nric} onChange={(e) => setBioForm((p) => ({ ...p, nric: e.target.value }))} className="font-mono" />
              </div>
              <div className="space-y-1">
                <Label>Race</Label>
                <Select value={bioForm.race} onValueChange={(v) => setBioForm((p) => ({ ...p, race: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Chinese', 'Malay', 'Indian', 'Others'].map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Residential Status</Label>
                <Select value={bioForm.residentialStatus} onValueChange={(v) => setBioForm((p) => ({ ...p, residentialStatus: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Singapore Citizen', 'PR'].map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Religion</Label>
                <Input value={bioForm.religion} onChange={(e) => setBioForm((p) => ({ ...p, religion: e.target.value }))} />
              </div>
            </div>

            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b pb-2">Contact</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <Label>Email</Label>
                <Input value={bioForm.email} onChange={(e) => setBioForm((p) => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Contact No.</Label>
                <Input value={bioForm.contactNo} onChange={(e) => setBioForm((p) => ({ ...p, contactNo: e.target.value }))} className="font-mono" />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label>Preferred Language</Label>
                <select
                  multiple
                  className="flex min-h-[8.5rem] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={bioForm.languageCsv.split(/[,;]+/).map((s) => s.trim()).filter(Boolean)}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, (o) => o.value);
                    setBioForm((p) => ({ ...p, languageCsv: selected.join(', ') }));
                  }}
                >
                  {BIODATA_PREF_LANGUAGE_OPTIONS.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">Hold Ctrl (Windows) or ⌘ (Mac) to select multiple.</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label>Address</Label>
                <Input value={bioForm.address} onChange={(e) => setBioForm((p) => ({ ...p, address: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Postal Code</Label>
                <Input value={bioForm.postalCode} onChange={(e) => setBioForm((p) => ({ ...p, postalCode: e.target.value }))} className="font-mono" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditBiodataOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setDetailsOverrides((prev) => ({
                  ...prev,
                  firstName: bioForm.firstName,
                  lastName: bioForm.lastName,
                  race: bioForm.race,
                  residentialStatus: bioForm.residentialStatus,
                  religion: bioForm.religion,
                  email: bioForm.email,
                  mobile: bioForm.contactNo,
                  contactNo: bioForm.contactNo,
                  preferredLanguage: bioForm.languageCsv,
                  address: bioForm.address,
                  postalCode: bioForm.postalCode,
                  nric: bioForm.nric,
                  maskedNric: bioForm.nric ? `${bioForm.nric.slice(0, 4)}×××${bioForm.nric.slice(-1)}` : prev.maskedNric,
                  dateOfBirthIso: bioForm.dob,
                }));
                appendHistory({
                  title: 'Biodata Updated',
                  category: 'Biodata',
                  by: details.submittedBy || 'Justin Paul',
                  byInitials: mkInitials(details.submittedBy || 'Justin Paul'),
                  timestamp: formatNow(),
                  desc: 'Personal details edited — name, contact, address and language preferences updated.',
                  ...categoryTone('Biodata'),
                  fields: [
                    { name: 'Full Name', from: displayName, to: `${bioForm.firstName} ${bioForm.lastName}`.trim() || '—' },
                    { name: 'NRIC', from: details.nric || '—', to: bioForm.nric || '—' },
                    { name: 'Contact', from: details.mobile || details.contactNo || '—', to: bioForm.contactNo || '—' },
                    { name: 'Email', from: details.email || '—', to: bioForm.email || '—' },
                    { name: 'Address', from: details.address || '—', to: bioForm.address || '—' },
                  ],
                });
                toast('Biodata updated');
                setEditBiodataOpen(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

