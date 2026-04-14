import { useMemo, useState } from 'react';
import {
  ChevronLeft,
  CalendarDays,
  ClipboardList,
  ShieldAlert,
  UserRound,
  BadgeCheck,
  TestTube2,
  Syringe,
  Microscope,
  Plus,
  MessageSquareText,
  Pencil,
} from 'lucide-react';
import { Page } from '../../App';
import { useIndividualProfiles } from '../../context/IndividualProfileContext';
import { formatProspectIdentifier, resolveProspectByRef } from '../../lib/prospectRef';
import { getStageChecklistLabels } from '../../lib/stageChecklist';
import { buildDetailsFormDataForRow } from '../../data/prospectDetailSeed';
import { labelHealthierSg } from '../../lib/healthierSgProfile';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';

type ScreeningDetailsV2Props = {
  onNavigate: (page: Page) => void;
  prospectRef: string;
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

function programLabel(p: string) {
  const k = (p || '').toLowerCase();
  if (k === 'mammobus') return 'Mammobus';
  if (k === 'hpv') return 'HPV';
  if (k === 'fit') return 'FIT';
  return p;
}

function screeningTypeFromProgram(p: string) {
  const k = (p || '').toLowerCase();
  if (k === 'mammobus') return { key: 'MMG', label: 'Mammogram', icon: Microscope, chip: 'Community Mammobus' };
  if (k === 'fit') return { key: 'FIT', label: 'FIT Kit', icon: TestTube2, chip: 'Polyclinic' };
  if (k === 'hpv') return { key: 'HPV', label: 'HPV Test', icon: Syringe, chip: 'HealthierSG' };
  return { key: 'SCR', label: programLabel(p), icon: CalendarDays, chip: 'Programme' };
}

function stepIndexFromStatus(status: string | undefined) {
  const s = (status || '').toLowerCase();
  if (s === 'qualified') return 0;
  if (s === 'booked') return 1;
  if (s === 'screened') return 2;
  if (s === 'completed') return 3;
  if (s === 'cancelled') return 4;
  return 0;
}

export function ScreeningDetailsV2({ onNavigate, prospectRef }: ScreeningDetailsV2Props) {
  const { profilesByRecordId } = useIndividualProfiles();
  const profile = useMemo(
    () => resolveProspectByRef(prospectRef, profilesByRecordId),
    [prospectRef, profilesByRecordId]
  );

  const [tab, setTab] = useState<'details' | 'tasks' | 'eligibility'>('details');

  if (!profile) {
    return (
      <div className="h-full bg-gray-50 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-gray-900">Screening details</span>
          </div>
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

  const programs = profile.programs || [];
  const primaryProgram = programs[0] || 'mammobus';
  const screeningType = screeningTypeFromProgram(primaryProgram);
  const statusIdx = stepIndexFromStatus(profile.status);
  const isCancelled = (profile.status || '').toLowerCase() === 'cancelled';

  const detailsForm = useMemo(() => buildDetailsFormDataForRow(profile), [profile]);

  const taskLabels = useMemo(() => getStageChecklistLabels(profile.status), [profile.status]);
  const tasksTotal = taskLabels.length || profile.tasksTotal || 0;
  const tasksDone = Math.max(
    0,
    Math.min(tasksTotal, profile.tasksCompleted ?? Math.round((statusIdx / 3) * (tasksTotal || 10)))
  );

  const tasks = useMemo(() => {
    const labels = taskLabels.length ? taskLabels : new Array(tasksTotal).fill(0).map((_, i) => `Task ${i + 1}`);
    return labels.map((label, i) => ({ label, done: i < tasksDone }));
  }, [taskLabels, tasksDone, tasksTotal]);

  const eligibilityItems = useMemo(() => {
    // Derived from existing Details form state (seeded in `prospectDetailSeed.ts`)
    const items: Array<{ label: string; value: string }> = [
      { label: 'Cancer Screening Eligibility Check', value: detailsForm.cancerScreeningEligibilityCheck || '—' },
      { label: 'First-time screener', value: detailsForm.firstMammogramScreening || '—' },
      { label: 'Last screening year', value: detailsForm.lastScreeningYear || '—' },
      { label: 'CHAS Card', value: detailsForm.chasCardType || '—' },
      { label: 'HealthierSG', value: labelHealthierSg(detailsForm.healthierSg) },
      { label: 'Risk factors', value: detailsForm.riskFactors || '—' },
    ];
    return items.filter((it) => String(it.value || '').trim() !== '');
  }, [detailsForm]);
  const eligibilityCount = eligibilityItems.length;

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Sticky breadcrumb / actions */}
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
          <span className="text-gray-900">{formatProspectIdentifier(profile.name, profile.maskedNric)}</span>
          <span className="text-gray-400">›</span>
          <span className="text-gray-700">Screening details</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-12 gap-4">
          {/* Left: patient context */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <Card>
              <CardContent className="pt-5">
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-white flex items-center justify-center font-semibold">
                    {(profile.name || '—')
                      .split(/\s+/)
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-gray-900 truncate">{profile.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {profile.gender} · {profile.age} years old
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={`border ${riskTone(profile.riskLevel)}`}>
                    <ShieldAlert className="w-3 h-3" />
                    {profile.riskLevel} Risk
                  </Badge>
                  <Badge variant="outline" className="border border-destructive/20 bg-destructive/10 text-destructive">
                    High Priority
                  </Badge>
                </div>

              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <UserRound className="w-4 h-4" />
                  Patient details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">ID</span>
                  <span className="font-medium text-gray-900">{profile.recordId}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">NRIC</span>
                  <span className="font-mono text-gray-900">{profile.maskedNric}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Contact</span>
                  <span className="font-medium text-gray-900">{profile.contact}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium text-gray-900 truncate">{profile.email}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  Risk
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <Badge variant="outline" className={`border ${riskTone(profile.riskLevel)}`}>
                  {profile.riskLevel} Risk
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-sm">Quick actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => toast('SMS sent (placeholder).')}
                >
                  <MessageSquareText className="w-4 h-4" />
                  Send SMS
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => toast('Add note (placeholder).')}
                >
                  <Pencil className="w-4 h-4" />
                  Add Note
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Center: screening record */}
          <div className="col-span-12 lg:col-span-6 space-y-4">
            <Card>
              <CardHeader className="border-b pb-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted border flex items-center justify-center">
                    <screeningType.icon className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-base font-semibold text-gray-900">{screeningType.label}</div>
                      <Badge variant="outline" className={`border ${statusTone(profile.status)}`}>
                        {profile.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">· {screeningType.chip}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      Registered {profile.dateRegistered || '—'}
                      <span className="font-mono text-[10px] px-1.5 py-0.5 border rounded bg-muted text-muted-foreground">
                        #MMG-XXXX-XXXX
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    {['Qualified', 'Booked', 'Screened', 'Cancelled']
                      .filter((s) => s.toLowerCase() !== (profile.status || '').toLowerCase())
                      .slice(0, 3)
                      .map((s) => (
                        <Button
                          key={s}
                          size="sm"
                          variant={s === 'Cancelled' ? 'destructive' : 'outline'}
                          onClick={() => toast(`Change status → ${s} (placeholder).`)}
                        >
                          {s}
                        </Button>
                      ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {!isCancelled ? (
                  <div className="rounded-xl border bg-muted/40 p-4 mb-4">
                    <div className="flex items-start gap-3">
                      {[
                        { label: 'Qualified', sub: 'Form submitted' },
                        { label: 'Booked', sub: 'Appt confirmed' },
                        { label: 'Screened', sub: 'Client attended' },
                        { label: 'Completed', sub: 'Result recorded' },
                      ].map((s, idx) => {
                        const done = statusIdx > idx;
                        const cur = statusIdx === idx;
                        return (
                          <div key={s.label} className="flex-1 min-w-0 flex flex-col items-center gap-1">
                            <div
                              className={[
                                'h-8 w-8 rounded-full border-2 flex items-center justify-center transition',
                                done
                                  ? 'bg-indigo-600 border-indigo-600 text-white'
                                  : cur
                                    ? 'bg-card border-indigo-500'
                                    : 'bg-white border-border',
                              ].join(' ')}
                            >
                              {done ? <BadgeCheck className="w-4 h-4" /> : <div className="h-2 w-2 rounded-full bg-border" />}
                            </div>
                            <div className="text-[10px] font-semibold text-gray-700 text-center">{s.label}</div>
                            <div className="text-[9px] text-muted-foreground text-center">{s.sub}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 mb-4 text-sm text-destructive">
                    This screening record has been cancelled.
                  </div>
                )}

                <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
                  <TabsList className="w-full justify-start bg-transparent p-0 h-auto gap-1">
                    <TabsTrigger value="details" className="flex-none rounded-lg border data-[state=active]:border-primary">
                      Details
                    </TabsTrigger>
                    <TabsTrigger value="tasks" className="flex-none rounded-lg border data-[state=active]:border-primary">
                      Tasks
                      <span className="ml-1 inline-flex h-4 items-center rounded-full bg-muted px-2 text-[10px] font-semibold text-muted-foreground">
                        {tasksDone}/{tasksTotal}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="eligibility" className="flex-none rounded-lg border data-[state=active]:border-primary">
                      Eligibility
                      <span className="ml-1 inline-flex h-4 items-center rounded-full bg-muted px-2 text-[10px] font-semibold text-muted-foreground">
                        {eligibilityCount}
                      </span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Card className="shadow-none overflow-hidden">
                        <CardHeader className="pb-2 bg-muted/30 border-b">
                          <CardTitle className="text-sm">Client Preference</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 text-sm space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">Programme</span>
                            <span className="font-medium">{detailsForm.programEnrolled || screeningType.chip}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">Preferred Slot</span>
                            <span className="font-medium italic">{detailsForm.screeningLocationEvent || '—'}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">Time</span>
                            <span className="font-medium italic">{detailsForm.preferredTimeSlot || '—'}</span>
                          </div>
                          <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                            Read-only — locked at form submission (placeholder).
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="shadow-none overflow-hidden">
                        <CardHeader className="pb-2 bg-muted/30 border-b">
                          <div className="flex items-center justify-between gap-2">
                            <CardTitle className="text-sm">Confirmed Appointment</CardTitle>
                            <Badge variant="outline" className="border border-emerald-500/20 bg-emerald-500/10 text-emerald-700">
                              Confirmed
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4 text-sm text-muted-foreground">
                          No appointment data available in the current model — placeholder.
                        </CardContent>
                      </Card>

                      <Card className="shadow-none overflow-hidden md:col-span-1">
                        <CardHeader className="pb-2 bg-muted/30 border-b">
                          <CardTitle className="text-sm">Review Schedule</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 text-sm space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">Next review date</span>
                            <span className="font-medium">{detailsForm.nextReviewDate || profile.nextReview || '—'}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">Review period</span>
                            <span className="font-medium">{detailsForm.reviewPeriod || '—'}</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="shadow-none overflow-hidden md:col-span-1">
                        <CardHeader className="pb-2 bg-muted/30 border-b">
                          <CardTitle className="text-sm">Result</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 text-sm text-muted-foreground">
                          Result will be recorded when screening is completed.
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="tasks" className="mt-4">
                    <Card className="shadow-none">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                          <ClipboardList className="w-4 h-4" />
                          Tasks
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-2 text-sm">
                        {tasks.map((t, i) => (
                          <label key={`${t.label}-${i}`} className="flex items-start gap-2">
                            <input type="checkbox" checked={t.done} readOnly className="mt-0.5" />
                            <span className={t.done ? 'text-muted-foreground line-through' : 'text-gray-900'}>
                              {t.label}
                            </span>
                          </label>
                        ))}
                        {tasks.length === 0 && (
                          <div className="text-sm text-muted-foreground">No tasks available.</div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="eligibility" className="mt-4">
                    <Card className="shadow-none">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
                          Eligibility
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-2 text-sm">
                        {eligibilityItems.map((it) => (
                          <div key={it.label} className="flex items-center justify-between gap-3 border-b pb-2">
                            <span className="text-muted-foreground">{it.label}</span>
                            <span className="font-medium text-gray-900">{it.value}</span>
                          </div>
                        ))}
                        {eligibilityItems.length === 0 && (
                          <div className="text-sm text-muted-foreground">No eligibility data available.</div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right: activity + related */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <Card>
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-sm">Activity</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {[
                  { title: 'Appointment Booked', by: 'Justin Paul', at: '12 Apr 2026', tone: 'bg-emerald-500/10 text-emerald-700' },
                  { title: 'Record Created', by: 'System', at: '12 Apr 2026', tone: 'bg-blue-500/10 text-blue-700' },
                ].map((a, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${a.tone}`}>
                      <BadgeCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900">{a.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {a.at} · {a.by}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-sm">Related screenings</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2 text-sm">
                {(programs.length ? programs : [primaryProgram]).map((p) => (
                  <div key={p} className="rounded-lg border bg-white p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium text-gray-900">{programLabel(p)}</div>
                      <Badge variant="outline" className={`border ${statusTone(profile.status)}`}>
                        {profile.status}
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
                      <span>Review: {profile.nextReview || '—'}</span>
                      <span>
                        {tasksDone}/{tasksTotal} tasks
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-indigo-600"
                        style={{ width: `${Math.round((tasksDone / tasksTotal) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

