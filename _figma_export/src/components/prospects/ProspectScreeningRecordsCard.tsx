import {
  forwardRef,
  Fragment,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import {
  buildInitialScreeningRecords,
  computeScreeningTotals,
  type ProspectScreeningProfile,
  type ScreeningRecordsHistoryPayload,
  type ScreeningRecord,
  type ScreeningTypeKey,
} from './prospectScreeningRecordsModel';

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

function typeTone(type: Exclude<ScreeningTypeKey, 'ALL'>) {
  switch (type) {
    case 'MMG':
      return 'bg-violet-100 text-violet-700 border-violet-200';
    case 'FIT':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'PAP':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
}

function formatNow() {
  const now = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const hh = now.getHours();
  const mm = now.getMinutes().toString().padStart(2, '0');
  const ampm = hh < 12 ? 'am' : 'pm';
  const hh12 = hh % 12 || 12;
  return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}, ${hh12}:${mm}${ampm}`;
}

function mkInitials(name: string) {
  const p = (name || '').split(/\s+/).filter(Boolean);
  if (!p.length) return 'SY';
  return p
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function categoryToneAppointment(): Pick<ScreeningRecordsHistoryPayload, 'tagColorClass' | 'tagTextClass'> {
  return { tagColorClass: 'bg-emerald-100', tagTextClass: 'text-emerald-700' };
}

export type ProspectScreeningRecordsCardProps = {
  details: Record<string, any>;
  profile: ProspectScreeningProfile;
  recordKey: string;
  screenings?: ScreeningRecord[];
  onScreeningsChange?: Dispatch<SetStateAction<ScreeningRecord[]>>;
  onDetailsPatch?: (patch: Record<string, any>) => void;
  onAppendHistory?: (entry: ScreeningRecordsHistoryPayload) => void;
  /** e.g. switch parent tab back to screenings */
  afterBookConfirm?: () => void;
};

export type ProspectScreeningRecordsCardHandle = {
  openBookAppointment: (screeningId: string) => void;
};

export const ProspectScreeningRecordsCard = forwardRef<ProspectScreeningRecordsCardHandle, ProspectScreeningRecordsCardProps>(
  function ProspectScreeningRecordsCard(
    { details, profile, recordKey, screenings: screeningsProp, onScreeningsChange, onDetailsPatch, onAppendHistory, afterBookConfirm },
    ref,
  ) {
  const seed = useMemo(() => buildInitialScreeningRecords(details, profile), [recordKey]);

  const controlled = screeningsProp !== undefined && onScreeningsChange !== undefined;

  const [internalScreenings, setInternalScreenings] = useState<ScreeningRecord[]>(() => seed);
  useEffect(() => {
    if (!controlled) {
      setInternalScreenings(seed);
    }
  }, [seed, controlled]);

  const screenings = controlled ? screeningsProp! : internalScreenings;
  const setScreenings = controlled ? onScreeningsChange! : setInternalScreenings;

  const [screeningFilter, setScreeningFilter] = useState<ScreeningTypeKey>('ALL');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const [bookApptOpen, setBookApptOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [bookingTargetId, setBookingTargetId] = useState<string | null>(null);
  const [rescheduleTargetId, setRescheduleTargetId] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    openBookAppointment: (screeningId: string) => {
      setBookingTargetId(screeningId);
      setBookApptOpen(true);
    },
  }));

  const [bookForm, setBookForm] = useState({
    confirmedDate: (details.appointmentDateIso || '') as string,
    confirmedTime: (details.appointmentTime || '10:30am') as string,
    venue: (details.screeningLocationClinic || details.screeningLocationEvent || 'SCS Clinic @ Bishan') as string,
    notes: '' as string,
  });

  const [rescheduleForm, setRescheduleForm] = useState({
    newEvent: (details.screeningLocationEvent || '—') as string,
    newTime: (details.appointmentTime || '10:30am') as string,
    reason: '' as string,
  });

  useEffect(() => {
    setBookForm({
      confirmedDate: (details.appointmentDateIso || '') as string,
      confirmedTime: (details.appointmentTime || '10:30am') as string,
      venue: (details.screeningLocationClinic || details.screeningLocationEvent || 'SCS Clinic @ Bishan') as string,
      notes: '',
    });
    setRescheduleForm({
      newEvent: (details.screeningLocationEvent || '—') as string,
      newTime: (details.appointmentTime || '10:30am') as string,
      reason: '',
    });
  }, [recordKey, details.appointmentDateIso, details.appointmentTime, details.screeningLocationClinic, details.screeningLocationEvent]);

  const screeningRows = screenings.filter((r) => {
    if (screeningFilter === 'ALL') return true;
    return r.typeKey === screeningFilter;
  });

  const totals = useMemo(() => computeScreeningTotals(screenings), [screenings]);

  return (
    <>
      <Card>
        <CardHeader className="border-b pb-4 flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Screening Records</CardTitle>
          <div className="flex items-center gap-2">
            {[
              { key: 'ALL' as const, label: `All (${screenings.length})` },
              { key: 'MMG' as const, label: `Mammogram (${totals.mmg})` },
              { key: 'FIT' as const, label: `FIT Kit (${totals.fit})` },
              { key: 'PAP' as const, label: `HPV/PAP (${totals.pap})` },
            ].map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => {
                  setScreeningFilter(f.key);
                  setExpandedRowId(null);
                }}
                className={[
                  'px-3 py-1.5 text-xs font-medium border-b-2',
                  screeningFilter === f.key ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-foreground',
                ].join(' ')}
              >
                {f.label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-4 overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-muted-foreground bg-muted/50">
                <th className="text-left py-2 px-3 w-8" />
                <th className="text-left py-2 px-3">Submitted</th>
                <th className="text-left py-2 px-3">Screening Type</th>
                <th className="text-left py-2 px-3">Status</th>
                <th className="text-left py-2 px-3">Appointment</th>
                <th className="text-left py-2 px-3">Venue</th>
                <th className="text-left py-2 px-3">Appt Type</th>
                <th className="text-left py-2 px-3 w-28" />
              </tr>
            </thead>
            <tbody>
              {screeningRows.map((r) => {
                const open = expandedRowId === r.id;
                const apptLabel =
                  r.appointmentDate && r.appointmentDate !== '—'
                    ? `${r.appointmentDate}${r.appointmentTime && r.appointmentTime !== '—' ? ` · ${r.appointmentTime}` : ''}`
                    : '— No appointment yet';
                return (
                  <Fragment key={r.id}>
                    <tr
                      className={['border-t cursor-pointer', open ? 'bg-violet-50/40' : 'hover:bg-violet-50/40'].join(' ')}
                      onClick={() => setExpandedRowId(open ? null : r.id)}
                    >
                      <td className="py-3 px-3 text-muted-foreground">
                        <ChevronRight className={['h-4 w-4 transition-transform', open ? 'rotate-90' : 'rotate-0'].join(' ')} aria-hidden />
                      </td>
                      <td className="py-3 px-3">{r.submitted}</td>
                      <td className="py-3 px-3">
                        <span className={['inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold', typeTone(r.typeKey)].join(' ')}>
                          {r.typeLabel}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="outline" className={`border ${statusTone(r.status)}`}>
                          {r.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-sm">{apptLabel}</td>
                      <td className="py-3 px-3">{r.venue}</td>
                      <td className="py-3 px-3 text-xs text-muted-foreground">{r.apptType}</td>
                      <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                        {r.actionLabel ? (
                          <Button
                            size="sm"
                            variant={r.actionLabel === 'Book Appt' ? 'default' : 'outline'}
                            className="h-7 px-2 text-xs"
                            onClick={() => {
                              if (r.actionLabel === 'Book Appt') {
                                setBookingTargetId(r.id);
                                setBookApptOpen(true);
                                return;
                              }
                              if (r.actionLabel === 'Reschedule') {
                                setRescheduleTargetId(r.id);
                                setRescheduleOpen(true);
                              }
                            }}
                          >
                            {r.actionLabel}
                          </Button>
                        ) : null}
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td colSpan={8} className="p-0">
                        {open ? (
                          <div className="bg-violet-50/50 px-9 py-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                              {r.details.map(([l, v]) => (
                                <div key={l} className="min-w-0">
                                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{l}</div>
                                  <div className="text-xs font-medium text-gray-900 mt-0.5 break-words">{v || '—'}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={bookApptOpen} onOpenChange={setBookApptOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg bg-violet-50 border px-3 py-2 text-sm text-violet-900">
              <div className="font-semibold">
                {screenings.find((s) => s.id === bookingTargetId)?.typeLabel || 'Mammogram'} ·{' '}
                {screenings.find((s) => s.id === bookingTargetId)?.apptType || 'SCS Clinic @ Bishan'}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Preferred: {details.preferredDate || '—'} · {details.preferredTime || '—'}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Clinic will call client to confirm actual time slot (placeholder).</div>
            </div>
            <div className="space-y-1">
              <Label>Confirmed Date</Label>
              <Input type="date" value={bookForm.confirmedDate} onChange={(e) => setBookForm((p) => ({ ...p, confirmedDate: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Confirmed Time</Label>
              <Select value={bookForm.confirmedTime} onValueChange={(v) => setBookForm((p) => ({ ...p, confirmedTime: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {['9:00am', '9:30am', '10:00am', '10:30am', '11:00am', '2:00pm', '3:15pm'].map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Venue / Clinic</Label>
              <Input value={bookForm.venue} onChange={(e) => setBookForm((p) => ({ ...p, venue: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Notes</Label>
              <Textarea value={bookForm.notes} onChange={(e) => setBookForm((p) => ({ ...p, notes: e.target.value }))} rows={2} placeholder="Optional notes…" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookApptOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!bookingTargetId) {
                  toast('No screening selected');
                  return;
                }
                const target = screenings.find((s) => s.id === bookingTargetId);
                if (!target) return;
                const prevStatus = target.status;
                const dateStr = bookForm.confirmedDate
                  ? new Date(bookForm.confirmedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                  : '—';
                setScreenings((prev) =>
                  prev.map((s) =>
                    s.id !== bookingTargetId
                      ? s
                      : {
                          ...s,
                          status: 'Booked',
                          appointmentDate: dateStr,
                          appointmentTime: bookForm.confirmedTime || '—',
                          venue: bookForm.venue || s.venue,
                          actionLabel: 'Reschedule',
                          details: s.details.map(([k, v]) => {
                            if (k === 'Time Slot') return [k, bookForm.confirmedTime || v];
                            if (k === 'Event Address') return [k, details.eventAddress || v];
                            return [k, v];
                          }),
                        },
                  ),
                );
                onDetailsPatch?.({
                  appointmentDate: dateStr,
                  appointmentTime: bookForm.confirmedTime,
                  screeningLocationEvent: bookForm.venue,
                });
                onAppendHistory?.({
                  title: 'Appointment Booked',
                  category: 'Appointment',
                  by: details.submittedBy || 'Justin Paul',
                  byInitials: mkInitials(details.submittedBy || 'Justin Paul'),
                  timestamp: formatNow(),
                  desc: `${target.typeLabel} appointment confirmed at ${bookForm.venue || '—'}.`,
                  ...categoryToneAppointment(),
                  fields: [
                    { name: 'Appointment Date', from: target.appointmentDate || '—', to: dateStr },
                    { name: 'Time Slot', from: target.appointmentTime || '—', to: bookForm.confirmedTime || '—' },
                    { name: 'Venue', from: target.venue || '—', to: bookForm.venue || '—' },
                    { name: 'Status', from: prevStatus || '—', to: 'Booked' },
                  ],
                });
                toast('Appointment booked — status updated to Booked');
                setBookApptOpen(false);
                afterBookConfirm?.();
              }}
            >
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted/50 border px-3 py-2 text-sm text-muted-foreground">
              Current:{' '}
              <span className="font-semibold text-foreground">
                {screenings.find((s) => s.id === rescheduleTargetId)?.venue || '—'} ·{' '}
                {screenings.find((s) => s.id === rescheduleTargetId)?.appointmentDate || '—'} ·{' '}
                {screenings.find((s) => s.id === rescheduleTargetId)?.appointmentTime || '—'}
              </span>
            </div>
            <div className="space-y-1">
              <Label>New Event</Label>
              <Input value={rescheduleForm.newEvent} onChange={(e) => setRescheduleForm((p) => ({ ...p, newEvent: e.target.value }))} placeholder="Event name" />
            </div>
            <div className="space-y-1">
              <Label>New Time Slot</Label>
              <Select value={rescheduleForm.newTime} onValueChange={(v) => setRescheduleForm((p) => ({ ...p, newTime: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {['9:00am', '9:45am', '10:15am', '10:30am', '11:00am', '1:15pm', '2:00pm'].map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Reason</Label>
              <Textarea value={rescheduleForm.reason} onChange={(e) => setRescheduleForm((p) => ({ ...p, reason: e.target.value }))} rows={2} placeholder="Optional…" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!rescheduleTargetId) return;
                const target = screenings.find((s) => s.id === rescheduleTargetId);
                if (!target) return;
                setScreenings((prev) =>
                  prev.map((s) =>
                    s.id !== rescheduleTargetId
                      ? s
                      : {
                          ...s,
                          venue: rescheduleForm.newEvent || s.venue,
                          appointmentTime: rescheduleForm.newTime || s.appointmentTime,
                          details: s.details.map(([k, v]) => {
                            if (k === 'Time Slot') return [k, rescheduleForm.newTime || v];
                            return [k, v];
                          }),
                        },
                  ),
                );
                onAppendHistory?.({
                  title: 'Appointment Rescheduled',
                  category: 'Appointment',
                  by: details.submittedBy || 'Justin Paul',
                  byInitials: mkInitials(details.submittedBy || 'Justin Paul'),
                  timestamp: formatNow(),
                  desc: 'Existing appointment moved to a new event and time slot.',
                  ...categoryToneAppointment(),
                  fields: [
                    { name: 'Venue', from: target.venue || '—', to: rescheduleForm.newEvent || target.venue || '—' },
                    { name: 'Time Slot', from: target.appointmentTime || '—', to: rescheduleForm.newTime || target.appointmentTime || '—' },
                    { name: 'Reason', from: '—', to: rescheduleForm.reason || '—' },
                  ],
                });
                toast('Appointment rescheduled');
                setRescheduleOpen(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
},
);
