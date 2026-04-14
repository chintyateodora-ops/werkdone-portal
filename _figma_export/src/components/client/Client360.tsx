
import { useMemo, useState } from 'react';
import { ChevronLeft, Copy, Phone, Mail, ShieldAlert } from 'lucide-react';
import { Page } from '../../App';
import { useIndividualProfiles } from '../../context/IndividualProfileContext';
import { formatProspectIdentifier, resolveProspectByRef } from '../../lib/prospectRef';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

type Client360Props = {
  onNavigate: (page: Page) => void;
  /**
   * When empty, renders a non-detail placeholder (legacy `client-360` page entry).
   * When provided, renders the v2 client profile detail layout.
   */
  prospectRef: string;
};

type NoteItem = { id: string; text: string; date: string; by: string };

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

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '—';
  const a = parts[0]?.[0] || '';
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] || '' : '';
  return (a + b).toUpperCase();
}

function formatTodayEnSG() {
  const d = new Date();
  return d.toLocaleDateString('en-SG', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function Client360({ onNavigate, prospectRef }: Client360Props) {
  const { profilesByRecordId } = useIndividualProfiles();
  const profile = useMemo(
    () => (prospectRef ? resolveProspectByRef(prospectRef, profilesByRecordId) : undefined),
    [prospectRef, profilesByRecordId]
  );

  const [tab, setTab] = useState<'overview' | 'screenings' | 'biodata' | 'notes'>('overview');
  const [notes, setNotes] = useState<NoteItem[]>(() =>
    profile
      ? [
          {
            id: 'n1',
            text: `Client record viewed in Client 360.`,
            date: formatTodayEnSG(),
            by: 'System',
          },
        ]
      : []
  );
  const [noteText, setNoteText] = useState('');

  const screenings = useMemo(() => {
    if (!profile) return [];
    // We don’t have a dedicated screening-record model wired here yet; start with
    // a pragmatic summary derived from the profile row.
    return (profile.programs || []).map((p) => ({
      id: `${profile.recordId}-${p}`,
      program: p,
      status: profile.status,
      nextReview: profile.nextReview,
      dateRegistered: profile.dateRegistered,
      source: profile.source,
      sourceDetail: profile.sourceDetail,
      tasksCompleted: profile.tasksCompleted,
      tasksTotal: profile.tasksTotal,
    }));
  }, [profile]);

  const activeCount = useMemo(
    () => screenings.filter((s) => !['completed', 'cancelled'].includes((s.status || '').toLowerCase())).length,
    [screenings]
  );

  if (!profile) {
    return (
      <div className="h-full bg-gray-50 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-gray-900">Client 360</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <h1 className="text-gray-900 mb-6">Client 360</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-600">Select a client from the listing to view their profile.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const identityLine = `${profile.gender} · ${profile.age}y · ${profile.residentialStatus}`;
  const headerSubtitle = formatProspectIdentifier(profile.name, profile.maskedNric);
  const assigned = profile.assignTo?.[0];

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
          <span className="text-gray-900">{headerSubtitle}</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Profile header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 pt-5 pb-3">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-semibold">
                {initialsFromName(profile.name)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-lg font-semibold text-gray-900 truncate">{profile.name}</div>
                  <Badge variant="outline" className={`border ${riskTone(profile.riskLevel)}`}>
                    <ShieldAlert className="w-3 h-3" />
                    {profile.riskLevel} Risk
                  </Badge>
                  <Badge variant="outline" className={`border ${statusTone(profile.status)}`}>
                    {profile.status}
                  </Badge>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-md border bg-gray-50 px-2 py-0.5 font-mono text-xs text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      navigator.clipboard?.writeText(profile.recordId);
                      toast('Copied client record ID');
                    }}
                    title="Copy client record ID"
                  >
                    {profile.recordId}
                    <Copy className="w-3 h-3" />
                  </button>
                  <span className="text-gray-300">•</span>
                  <span className="truncate">{identityLine}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard?.writeText(profile.contact);
                    toast('Copied contact number');
                  }}
                >
                  <Phone className="w-4 h-4" />
                  SMS
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard?.writeText(profile.email);
                    toast('Copied email');
                  }}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </Button>
              </div>
            </div>

            {/* Quick facts strip */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 rounded-lg border overflow-hidden">
              <button
                type="button"
                className="text-left px-4 py-3 hover:bg-muted/50 border-b lg:border-b-0 lg:border-r"
                onClick={() => {
                  navigator.clipboard?.writeText(profile.nric);
                  toast('Copied NRIC');
                }}
              >
                <div className="text-[10px] font-semibold tracking-wide uppercase text-muted-foreground">
                  NRIC
                </div>
                <div className="mt-1 text-sm font-medium text-gray-900 font-mono">{profile.maskedNric}</div>
              </button>

              <button
                type="button"
                className="text-left px-4 py-3 hover:bg-muted/50 border-b sm:border-b-0 sm:border-r lg:border-r"
                onClick={() => {
                  navigator.clipboard?.writeText(profile.contact);
                  toast('Copied contact');
                }}
              >
                <div className="text-[10px] font-semibold tracking-wide uppercase text-muted-foreground">
                  Contact
                </div>
                <div className="mt-1 text-sm font-medium text-gray-900">{profile.contact}</div>
              </button>

              <div className="px-4 py-3 border-b lg:border-b-0 lg:border-r">
                <div className="text-[10px] font-semibold tracking-wide uppercase text-muted-foreground">
                  Source
                </div>
                <div className="mt-1 text-sm font-medium text-gray-900 truncate">
                  {profile.source}
                </div>
                <div className="text-xs text-muted-foreground truncate">{profile.sourceDetail}</div>
              </div>

              <div className="px-4 py-3 border-b sm:border-b-0 sm:border-r lg:border-r">
                <div className="text-[10px] font-semibold tracking-wide uppercase text-muted-foreground">
                  Next review
                </div>
                <div className="mt-1 text-sm font-medium text-gray-900">{profile.nextReview || '—'}</div>
              </div>

              <div className="px-4 py-3">
                <div className="text-[10px] font-semibold tracking-wide uppercase text-muted-foreground">
                  Navigator
                </div>
                <div className="mt-1 text-sm font-medium text-gray-900">{assigned || 'Unassigned'}</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 pb-4">
            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="gap-3">
              <TabsList className="w-full justify-start bg-transparent p-0 h-auto gap-1">
                <TabsTrigger value="overview" className="flex-none rounded-lg border data-[state=active]:border-primary">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="screenings" className="flex-none rounded-lg border data-[state=active]:border-primary">
                  Screenings
                  <span className="ml-1 inline-flex h-4 items-center rounded-full bg-muted px-2 text-[10px] font-semibold text-muted-foreground">
                    {screenings.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="biodata" className="flex-none rounded-lg border data-[state=active]:border-primary">
                  Biodata
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex-none rounded-lg border data-[state=active]:border-primary">
                  Notes
                  <span className="ml-1 inline-flex h-4 items-center rounded-full bg-muted px-2 text-[10px] font-semibold text-muted-foreground">
                    {notes.length}
                  </span>
                </TabsTrigger>
              </TabsList>

              {/* Overview */}
              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                  <Card className="border-t-4 border-t-primary">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs text-muted-foreground tracking-wide uppercase">Total Screenings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold text-primary">{screenings.length}</div>
                    </CardContent>
                  </Card>

                  <Card className="border-t-4 border-t-blue-500">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs text-muted-foreground tracking-wide uppercase">Active</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold text-blue-600">{activeCount}</div>
                    </CardContent>
                  </Card>

                  <Card className="border-t-4 border-t-muted-foreground">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs text-muted-foreground tracking-wide uppercase">Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold text-gray-900">{Math.max(0, screenings.length - activeCount)}</div>
                    </CardContent>
                  </Card>

                  <Card className="border-t-4 border-t-emerald-500">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs text-muted-foreground tracking-wide uppercase">Next Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-base font-semibold text-gray-900">{profile.nextReview || '—'}</div>
                      <div className="text-xs text-muted-foreground mt-1">{profile.status}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
                  <Card>
                    <CardHeader className="border-b pb-4">
                      <CardTitle className="text-sm">Status History</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        {screenings.map((s) => (
                          <div key={s.id} className="flex items-start gap-3">
                            <div className="mt-1 h-2 w-2 rounded-full bg-primary/70" />
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-900">{s.status}</div>
                              <div className="text-xs text-muted-foreground">
                                {String(s.program).toUpperCase()} · {s.dateRegistered}
                              </div>
                            </div>
                          </div>
                        ))}
                        {screenings.length === 0 && (
                          <div className="text-sm text-muted-foreground">No screening records yet.</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="border-b pb-4">
                      <CardTitle className="text-sm">Screening Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Total Screenings</span>
                          <span className="font-semibold">{screenings.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Programs</span>
                          <span className="font-semibold">{(profile.programs || []).map((p) => String(p).toUpperCase()).join(', ') || '—'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Next Review</span>
                          <span className="font-semibold">{profile.nextReview || '—'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Screenings */}
              <TabsContent value="screenings">
                <Card>
                  <CardHeader className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">All Screening Records</CardTitle>
                      <div className="text-xs text-muted-foreground">{screenings.length} records</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="overflow-auto">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                            <th className="text-left py-2 pr-4">Program</th>
                            <th className="text-left py-2 pr-4">Status</th>
                            <th className="text-left py-2 pr-4">Registered</th>
                            <th className="text-left py-2 pr-4">Source</th>
                            <th className="text-left py-2">Next review</th>
                            <th className="text-left py-2 pl-4">Tasks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {screenings.map((s) => (
                            <tr key={s.id} className="border-t">
                              <td className="py-3 pr-4 font-medium text-gray-900">{String(s.program).toUpperCase()}</td>
                              <td className="py-3 pr-4">
                                <Badge variant="outline" className={`border ${statusTone(s.status)}`}>{s.status}</Badge>
                              </td>
                              <td className="py-3 pr-4">{s.dateRegistered}</td>
                              <td className="py-3 pr-4">
                                <div className="font-medium text-gray-900">{s.source}</div>
                                <div className="text-xs text-muted-foreground">{s.sourceDetail}</div>
                              </td>
                              <td className="py-3">{s.nextReview || '—'}</td>
                              <td className="py-3 pl-4 text-xs text-muted-foreground">
                                {s.tasksTotal ? `${s.tasksCompleted ?? 0}/${s.tasksTotal}` : '—'}
                              </td>
                            </tr>
                          ))}
                          {screenings.length === 0 && (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-muted-foreground">
                                No screening records found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Biodata */}
              <TabsContent value="biodata">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <Card>
                    <CardHeader className="border-b pb-4">
                      <CardTitle className="text-sm">Identity</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Name</span>
                        <span className="font-medium text-gray-900">{profile.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">NRIC</span>
                        <span className="font-mono text-gray-900">{profile.maskedNric}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Gender</span>
                        <span className="font-medium text-gray-900">{profile.gender}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Age</span>
                        <span className="font-medium text-gray-900">{profile.age}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Residential Status</span>
                        <span className="font-medium text-gray-900">{profile.residentialStatus}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="border-b pb-4">
                      <CardTitle className="text-sm">Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Phone</span>
                        <span className="font-medium text-gray-900">{profile.contact}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium text-gray-900">{profile.email}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Assigned to</span>
                        <span className="font-medium text-gray-900">{assigned || 'Unassigned'}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Notes */}
              <TabsContent value="notes">
                <Card>
                  <CardHeader className="border-b pb-4">
                    <CardTitle className="text-sm">Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div className="space-y-2">
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Add note
                      </div>
                      <Textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Write a note…"
                      />
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          onClick={() => {
                            const t = noteText.trim();
                            if (!t) return;
                            setNotes((prev) => [
                              {
                                id: `n-${Date.now()}`,
                                text: t,
                                date: formatTodayEnSG(),
                                by: 'Justin Paul',
                              },
                              ...prev,
                            ]);
                            setNoteText('');
                            toast('Note added');
                          }}
                        >
                          Add note
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {notes.map((n) => (
                        <div key={n.id} className="rounded-lg border bg-white p-4">
                          <div className="text-sm text-gray-900 whitespace-pre-wrap">{n.text}</div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            {n.date} · {n.by}
                          </div>
                        </div>
                      ))}
                      {notes.length === 0 && (
                        <div className="text-sm text-muted-foreground">No notes yet.</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}