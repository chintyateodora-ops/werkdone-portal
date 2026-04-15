/**
 * Bishan Clinics — Mammobus prospect pipeline (from standalone tracker HTML).
 * Rendered under portal shell; no local top bar (uses global `renderHeader`).
 */
(function (global) {
  "use strict";

  const STAGES = [
    { id: "unaware", label: "Unaware", shade: "#9b7cbb" },
    { id: "aware", label: "Aware", shade: "#8a6bad" },
    { id: "enquiring", label: "Enquiring", shade: "#7c51a1" },
    { id: "qualified", label: "Qualified", shade: "#6a4490" },
    { id: "booked", label: "Booked", shade: "#5a3a7c" },
    { id: "screened", label: "Screened", shade: "#4a3168" },
  ];

  const CL = {
    unaware: [
      "Community source or referral channel identified",
      "Initial contact made (event / flyer / GP mention)",
      "Basic demographic noted (approx. age, area)",
      "Language preference identified",
      "Added to awareness campaign list",
    ],
    aware: [
      "Has heard of Mammobus or breast screening",
      "Interest level gauged (curious / considering)",
      "Programme overview shared (benefits, subsidy)",
      "BCF / SCS informational materials sent",
      "Barrier type identified (fear / cost / time / other)",
      "Follow-up date scheduled",
    ],
    enquiring: [
      "Full name and date of birth collected",
      "NRIC / FIN number recorded",
      "Residency status confirmed (SC / PR / Foreigner)",
      "Mobile number and email captured",
      "Age eligibility confirmed (40 years and above)",
      "Not currently pregnant or breastfeeding",
      "No active breast symptoms present",
      "Date of last mammogram established",
      "Healthier SG or CHAS enrolment checked",
      "First-time screener status noted",
    ],
    qualified: [
      "All eligibility criteria met and documented",
      "Subsidy pathway confirmed (Healthier SG / CHAS / self-pay)",
      "Preferred screening date and time captured",
      "Mammobus location / event communicated",
      "Pre-screening instructions shared (no deodorant etc.)",
      "What to bring explained (NRIC, two-piece clothing)",
      "COVID vaccination date noted if within 6 weeks",
      "Family history of breast cancer documented",
      "Any implants or prior surgery flagged for radiographer",
      "Consent to data collection obtained (PDPA)",
    ],
    booked: [
      "Appointment confirmation sent (SMS / email)",
      "Reminder sent 1 week before appointment",
      "Reminder sent 3 days before appointment",
      "No-show deposit process explained",
      "Transport or logistics support offered if needed",
      "Emergency contact details collected",
      "Day-of checklist shared with participant",
      "Coordinator notified of any special requirements",
    ],
    screened: [
      "Attendance confirmed on screening day",
      "Screening completed without issues",
      "Results communication timeline explained",
      "Results sent / received by participant",
      "Abnormal results — referral pathway activated",
      "Normal results — next screening date communicated",
      "Participant satisfaction / feedback collected",
      "Peer referral ask made (refer a friend)",
      "Re-engagement reminder set (12 or 24 months)",
      "Record updated in system",
    ],
  };

  const FILTERS = {
    total: { label: "All prospects", fn: () => true },
    booked: { label: "Appointments booked", fn: (p) => p.stage === "booked" },
    screened: { label: "Screened", fn: (p) => p.stage === "screened" },
    highrisk: { label: "High risk", fn: (p) => p.risk === "High" },
    firsttime: { label: "First-time screeners", fn: (p) => p.first === true },
    conversion: { label: "Conversion rate", fn: (p) => p.stage === "screened" },
  };

  const PERIOD_LABELS = { "6m": "6 months", "1y": "1 year", "2y": "2 years", "3y": "3 years", "5y": "5 years" };

  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escAttr(s) {
    return esc(s).replace(/`/g, "&#96;");
  }

  function getChecks(p, st) {
    if (!p.checks) p.checks = {};
    if (!p.checks[st]) p.checks[st] = CL[st].map(() => false);
    while (p.checks[st].length < CL[st].length) p.checks[st].push(false);
    return p.checks[st];
  }

  function progOf(p, st) {
    const c = getChecks(p, st);
    const d = c.filter(Boolean).length;
    const t = c.length;
    return { d, t, pct: t ? Math.round((d / t) * 100) : 0 };
  }

  function fmtDate(d) {
    if (!d) return "";
    const [y, m, dy] = String(d).split("-");
    if (!y || !m || !dy) return d;
    return `${dy}/${m}/${y}`;
  }

  function isOverdue(d) {
    if (!d) return false;
    return new Date(d) < new Date();
  }

  function csvEscapeCell(raw) {
    const s = String(raw ?? "");
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  }

  function defaultProspects() {
    return [
      { id: 1, name: "Tan Mei Ling", age: 52, nric: "S****567A", status: "SC", risk: "High", stage: "booked", first: true, reviewPeriod: "1y", reviewDate: "2027-04-09", notes: "Family history — mother had breast cancer. Very motivated.", checks: { booked: [true, true, true, false, false, true, false, false] }, files: [] },
      { id: 2, name: "Siti Rahimah Bte Omar", age: 45, nric: "S****234B", status: "SC", risk: "Moderate", stage: "qualified", first: false, reviewPeriod: "1y", reviewDate: "2027-04-09", notes: "Enrolled in Healthier SG. Prefers Malay-speaking coordinator.", checks: { qualified: [true, true, true, true, true, false, false, false, false, false] }, files: [] },
      { id: 3, name: "Lim Ah Kow", age: 48, nric: "S****891C", status: "PR", risk: "Low", stage: "enquiring", first: true, reviewPeriod: "6m", reviewDate: "2026-10-09", notes: "Came from void deck flyer. Needs Mandarin support.", checks: { enquiring: [true, true, true, true, true, false, false, false, false, false] }, files: [] },
      { id: 4, name: "Priya d/o Subramaniam", age: 41, nric: "S****445D", status: "SC", risk: "Low", stage: "aware", first: true, reviewPeriod: "", reviewDate: "", notes: "Afraid of results. Referred to BCF counsellor.", checks: {}, files: [] },
      { id: 5, name: "Wong Li Fang", age: 55, nric: "S****320E", status: "SC", risk: "High", stage: "screened", first: false, reviewPeriod: "2y", reviewDate: "2028-04-09", notes: "Results normal. Re-engagement set for 2027.", checks: { screened: [true, true, true, true, true, true, true, true, true, true] }, files: [] },
      { id: 6, name: "Hamidah Bte Yusof", age: 50, nric: "S****776F", status: "SC", risk: "Moderate", stage: "unaware", first: true, reviewPeriod: "", reviewDate: "", notes: "Met at Bishan CC community event.", checks: {}, files: [] },
      { id: 7, name: "Ng Boon Hwee", age: 60, nric: "S****103G", status: "SC", risk: "High", stage: "screened", first: false, reviewPeriod: "6m", reviewDate: "2026-10-09", notes: "Results showed calcification — referred to NCCS.", checks: { screened: [true, true, true, true, false, false, true, false, true, false] }, files: [] },
      { id: 8, name: "Kavitha Rajendran", age: 43, nric: "S****558H", status: "SC", risk: "Moderate", stage: "booked", first: true, reviewPeriod: "1y", reviewDate: "2027-04-09", notes: "Workplace booking via Changi Airport Group. Confirmed 15 Apr.", checks: { booked: [true, true, false, true, false, false, false, false] }, files: [] },
      { id: 9, name: "Chen Xiao Hui", age: 47, nric: "S****299J", status: "PR", risk: "Low", stage: "enquiring", first: true, reviewPeriod: "6m", reviewDate: "2026-10-09", notes: "Heard from colleague. Unsure about PR subsidy rates.", checks: { enquiring: [true, true, true, false, true, true, true, false, false, false] }, files: [] },
      { id: 10, name: "Nurul Ain Bte Rosli", age: 53, nric: "S****641K", status: "SC", risk: "High", stage: "qualified", first: false, reviewPeriod: "1y", reviewDate: "2027-04-09", notes: "Had a scare 3 years ago — benign cyst. Overdue for screening.", checks: { qualified: [true, true, true, true, true, true, true, true, false, false] }, files: [] },
      { id: 11, name: "Lee Geok Eng", age: 66, nric: "S****088L", status: "SC", risk: "Moderate", stage: "aware", first: false, reviewPeriod: "", reviewDate: "", notes: "Referred by daughter. Last screened 3 years ago.", checks: { aware: [true, true, false, false, false, false] }, files: [] },
      { id: 12, name: "Fatimah Bte Hashim", age: 44, nric: "S****714M", status: "SC", risk: "Low", stage: "unaware", first: true, reviewPeriod: "", reviewDate: "", notes: "Spotted at Geylang Serai Bazaar booth.", checks: {}, files: [] },
    ];
  }

  function createInitialState() {
    return {
      prospects: defaultProspects(),
      nextId: 13,
      filterTerm: "",
      activeFilter: null,
      modal: null,
    };
  }

  function calcReviewDateFromPeriod(period) {
    if (!period) return "";
    const d = new Date();
    if (period === "6m") d.setMonth(d.getMonth() + 6);
    else if (period === "1y") d.setFullYear(d.getFullYear() + 1);
    else if (period === "2y") d.setFullYear(d.getFullYear() + 2);
    else if (period === "3y") d.setFullYear(d.getFullYear() + 3);
    else if (period === "5y") d.setFullYear(d.getFullYear() + 5);
    const pad2 = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }

  function emptyModalDraft(stageId) {
    return {
      stage: stageId,
      name: "",
      age: "",
      nric: "",
      status: "SC",
      risk: "Low",
      first: true,
      reviewPeriod: "",
      reviewDate: "",
      notes: "",
      checks: CL[stageId].map(() => false),
      pendingFiles: [],
    };
  }

  function draftFromProspect(p) {
    const st = p.stage;
    const checks = (p.checks && p.checks[st] ? p.checks[st].slice(0, CL[st].length) : CL[st].map(() => false)).slice();
    while (checks.length < CL[st].length) checks.push(false);
    return {
      stage: st,
      name: p.name || "",
      age: String(p.age ?? ""),
      nric: p.nric || "",
      status: p.status || "SC",
      risk: p.risk || "Low",
      first: Boolean(p.first),
      reviewPeriod: p.reviewPeriod || "",
      reviewDate: p.reviewDate || "",
      notes: p.notes || "",
      checks,
      pendingFiles: [],
    };
  }

  function cardHTML(p, st, term, filterFn) {
    if (p.stage !== st.id) return "";
    const t = term.toLowerCase();
    if (t && !p.name.toLowerCase().includes(t)) return "";
    if (!filterFn(p)) return "";
    const pg = progOf(p, p.stage);
    const rc = p.risk === "High" ? "bp-tag--hi" : p.risk === "Moderate" ? "bp-tag--mo" : "bp-tag--lo";
    const hasReview = p.reviewDate && p.reviewDate !== "";
    const overdue = isOverdue(p.reviewDate);
    const reviewHTML = hasReview
      ? `<div class="bp-review-badge ${overdue ? "bp-review-badge--due" : "bp-review-badge--ok"}">Next: ${esc(PERIOD_LABELS[p.reviewPeriod] || p.reviewPeriod)} · ${esc(fmtDate(p.reviewDate))}</div>`
      : "";
    const fileCount =
      p.files && p.files.length ? `<span class="bp-tag bp-tag--files">${esc(String(p.files.length))} file(s)</span>` : "";
    return `
      <div class="bp-card" data-bp-edit="${escAttr(p.id)}">
        <div class="bp-card__top">
          <div class="bp-card__name">${esc(p.name)}</div>
          <div class="bp-card__meta">Age ${esc(p.age)} · ${esc(p.status)}${p.first ? " · First-time" : ""}</div>
        </div>
        <div class="bp-card__mid">
          <span class="bp-tag">${esc(p.status)}</span>
          <span class="bp-tag ${rc}">${esc(p.risk)} risk</span>
          ${fileCount}
        </div>
        <div class="bp-card__prog">
          <div class="bp-prog-lbl">${pg.d}/${pg.t} tasks · ${pg.pct}%</div>
          <div class="bp-prog-bar"><div class="bp-prog-fill" style="width:${pg.pct}%;background:${escAttr(st.shade)}"></div></div>
          ${reviewHTML}
        </div>
      </div>`;
  }

  function renderStatsBar(bp) {
    const prospects = bp.prospects;
    const t = prospects.length;
    const bk = prospects.filter((p) => p.stage === "booked").length;
    const sc = prospects.filter((p) => p.stage === "screened").length;
    const hi = prospects.filter((p) => p.risk === "High").length;
    const fi = prospects.filter((p) => p.first).length;
    const stats = [
      { key: "total", n: t, l: "Total prospects" },
      { key: "booked", n: bk, l: "Appointments booked" },
      { key: "screened", n: sc, l: "Screened" },
      { key: "highrisk", n: hi, l: "High risk" },
      { key: "firsttime", n: fi, l: "First-time screeners" },
      { key: "conversion", n: `${Math.round((sc / Math.max(t, 1)) * 100)}%`, l: "Conversion rate" },
    ];
    return stats
      .map(
        (s) => `
      <button type="button" class="bp-stat${bp.activeFilter === s.key ? " bp-stat--active" : ""}" data-bp-filter="${escAttr(s.key)}">
        <span class="bp-stat__n">${esc(String(s.n))}</span>
        <span class="bp-stat__l">${esc(s.l)}</span>
      </button>`
      )
      .join("");
  }

  function renderBoard(bp) {
    const term = bp.filterTerm || "";
    const filterFn = bp.activeFilter ? FILTERS[bp.activeFilter].fn : () => true;
    return STAGES.map((st) => {
      const cards = bp.prospects.map((p) => cardHTML(p, st, term, filterFn)).join("");
      const count = bp.prospects.filter((p) => {
        if (p.stage !== st.id) return false;
        const t = term.toLowerCase();
        if (t && !p.name.toLowerCase().includes(t)) return false;
        return filterFn(p);
      }).length;
      return `
        <div class="bp-col">
          <div class="bp-col__hd" style="background:${escAttr(st.shade)}">
            ${esc(st.label)}<span class="bp-col__cnt">${count}</span>
          </div>
          <div class="bp-col__body">
            ${cards}
            <button type="button" class="bp-add-card" data-bp-new-stage="${escAttr(st.id)}">+ Add</button>
          </div>
        </div>`;
    }).join("");
  }

  function renderFilterBar(bp) {
    if (!bp.activeFilter) return `<div class="bp-filter-bar" id="bp-filter-bar" hidden></div>`;
    return `
      <div class="bp-filter-bar" id="bp-filter-bar">
        <span class="bp-filter-label">Filtering by:</span>
        <span class="bp-filter-tag">${esc(FILTERS[bp.activeFilter].label)}
          <button type="button" class="bp-filter-clear" data-bp-filter-clear aria-label="Clear filter">×</button>
        </span>
      </div>`;
  }

  function renderChecklist(draft) {
    const st = draft.stage;
    const labels = CL[st];
    const done = draft.checks.filter(Boolean).length;
    return `
      <div class="bp-cl-wrap" id="bp-cl-wrap">
        <div class="bp-cl-title">
          <span>${esc(STAGES.find((s) => s.id === st).label)} — tasks</span>
          <span class="bp-cl-prog-txt" id="bp-cl-prog">${done} / ${labels.length} completed</span>
        </div>
        ${labels
          .map(
            (t, i) => `
          <div class="bp-chk-item">
            <input type="checkbox" id="bp-ck${i}" data-bp-ck="${i}" ${draft.checks[i] ? "checked" : ""} />
            <label for="bp-ck${i}" class="${draft.checks[i] ? "bp-chk-done" : ""}">${esc(t)}</label>
          </div>`
          )
          .join("")}
      </div>`;
  }

  function renderFileList(draft, editProspect) {
    const saved = (editProspect && editProspect.files) || [];
    const all = [...saved, ...draft.pendingFiles];
    if (!all.length) return `<div class="bp-empty-files">No files attached yet.</div>`;
    return all
      .map((f, i) => {
        const isPend = i >= saved.length;
        const ext = (String(f.name).split(".").pop() || "").toUpperCase().slice(0, 4);
        const thumb =
          f.type && f.type.startsWith("image/")
            ? `<img class="bp-fthumb" src="${escAttr(f.dataUrl)}" alt="${escAttr(f.name)}">`
            : `<div class="bp-ficon">${esc(ext)}</div>`;
        const badge = isPend ? `<span class="bp-ubadge">unsaved</span>` : "";
        const sz = f.size > 1048576 ? `${(f.size / 1048576).toFixed(1)} MB` : `${Math.round(f.size / 1024)} KB`;
        return `
        <div class="bp-fitem">
          ${thumb}
          <div class="bp-finfo">
            <div class="bp-fname">${esc(f.name)}${badge}</div>
            <div class="bp-fmeta">${esc(sz)}</div>
          </div>
          <div class="bp-fbtns">
            <button type="button" class="bp-fbtn" data-bp-file-view="${i}">View</button>
            <button type="button" class="bp-fbtn" data-bp-file-dl="${i}">Download</button>
            <button type="button" class="bp-fbtn bp-fbtn--del" data-bp-file-rm="${i}" aria-label="Remove file">×</button>
          </div>
        </div>`;
      })
      .join("");
  }

  function renderModal(bp) {
    const m = bp.modal;
    if (!m) return "";
    const d = m.draft;
    const isEdit = m.mode === "edit";
    const title = isEdit ? `Edit — ${d.name}` : "Add prospect";
    const stageBtns = STAGES.map(
      (s) =>
        `<button type="button" class="bp-stbtn${d.stage === s.id ? " bp-stbtn--active" : ""}" data-bp-stage="${escAttr(s.id)}">${esc(s.label)}</button>`
    ).join("");

    return `
      <div class="bp-ov bp-ov--open" id="bp-ov" role="dialog" aria-modal="true" aria-labelledby="bp-modal-title">
        <div class="bp-modal" data-bp-modal-inner>
          <div class="bp-modal__hd">
            <h2 id="bp-modal-title">${esc(title)}</h2>
            <button type="button" class="bp-modal__close" data-bp-mclose aria-label="Close">×</button>
          </div>
          <div class="bp-modal__body">
            <div class="bp-modal__col bp-modal__col--main">
              <div class="bp-msec">
                <h4>Personal details</h4>
                <div class="bp-form-row">
                  <div class="bp-fg"><label for="bp-f-name">Full name *</label><input id="bp-f-name" type="text" value="${escAttr(d.name)}" placeholder="e.g. Tan Mei Ling" autocomplete="name" /></div>
                  <div class="bp-fg bp-fg--narrow"><label for="bp-f-age">Age *</label><input id="bp-f-age" type="number" value="${escAttr(d.age)}" placeholder="45" min="18" max="100" /></div>
                </div>
                <div class="bp-form-row">
                  <div class="bp-fg"><label for="bp-f-nric">NRIC / FIN</label><input id="bp-f-nric" type="text" value="${escAttr(d.nric)}" placeholder="S****567A" /></div>
                  <div class="bp-fg"><label for="bp-f-status">Residency *</label>
                    <select id="bp-f-status">
                      <option value="SC" ${d.status === "SC" ? "selected" : ""}>Singapore Citizen</option>
                      <option value="PR" ${d.status === "PR" ? "selected" : ""}>Permanent Resident</option>
                      <option value="FG" ${d.status === "FG" ? "selected" : ""}>Foreigner</option>
                    </select>
                  </div>
                </div>
                <div class="bp-form-row">
                  <div class="bp-fg"><label for="bp-f-risk">Risk level *</label>
                    <select id="bp-f-risk">
                      <option value="Low" ${d.risk === "Low" ? "selected" : ""}>Low</option>
                      <option value="Moderate" ${d.risk === "Moderate" ? "selected" : ""}>Moderate</option>
                      <option value="High" ${d.risk === "High" ? "selected" : ""}>High</option>
                    </select>
                  </div>
                  <div class="bp-fg"><label for="bp-f-first">First-time screener?</label>
                    <select id="bp-f-first">
                      <option value="1" ${d.first ? "selected" : ""}>Yes</option>
                      <option value="0" ${!d.first ? "selected" : ""}>No</option>
                    </select>
                  </div>
                </div>
                <div class="bp-form-row">
                  <div class="bp-fg"><label for="bp-f-period">Review period</label>
                    <select id="bp-f-period" data-bp-period>
                      <option value="" ${!d.reviewPeriod ? "selected" : ""}>— Select —</option>
                      <option value="6m" ${d.reviewPeriod === "6m" ? "selected" : ""}>6 months</option>
                      <option value="1y" ${d.reviewPeriod === "1y" ? "selected" : ""}>1 year</option>
                      <option value="2y" ${d.reviewPeriod === "2y" ? "selected" : ""}>2 years</option>
                      <option value="3y" ${d.reviewPeriod === "3y" ? "selected" : ""}>3 years</option>
                      <option value="5y" ${d.reviewPeriod === "5y" ? "selected" : ""}>5 years</option>
                    </select>
                  </div>
                  <div class="bp-fg"><label for="bp-f-review">Next review date</label>
                    <input id="bp-f-review" type="date" value="${escAttr(d.reviewDate)}" readonly />
                  </div>
                </div>
              </div>
              <div class="bp-msec">
                <h4>Pipeline stage</h4>
                <div class="bp-stage-sel">${stageBtns}</div>
              </div>
              <div class="bp-msec">
                <h4>Stage checklist</h4>
                ${renderChecklist(d)}
              </div>
              <div class="bp-msec">
                <h4>Case notes</h4>
                <div class="bp-fg"><textarea id="bp-f-notes" placeholder="Case notes, barriers, follow-up actions...">${esc(d.notes)}</textarea></div>
              </div>
            </div>
            <div class="bp-modal__col bp-modal__col--side">
              <div class="bp-msec bp-msec--grow">
                <h4>Documents &amp; files</h4>
                <div class="bp-upzone" id="bp-upzone" data-bp-upzone>
                  <input type="file" id="bp-fi" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" hidden />
                  <p class="bp-upzone__title">Click or drag &amp; drop</p>
                  <p class="bp-upzone__hint">Images · PDF · Word · Excel · TXT · max 10 MB each</p>
                </div>
                <div class="bp-flist" id="bp-flist">${renderFileList(d, isEdit ? bp.prospects.find((x) => x.id === m.prospectId) : null)}</div>
              </div>
            </div>
          </div>
          <div class="bp-modal__foot">
            ${isEdit ? `<button type="button" class="ui-btn ui-btn--outline ui-btn--sm" style="color:var(--color-destructive);border-color:var(--color-destructive)" data-bp-delete>Delete</button>` : `<span></span>`}
            <div class="bp-modal__foot-right">
              <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-bp-cancel>Cancel</button>
              <button type="button" class="ui-btn ui-btn--default ui-btn--sm" data-bp-save>Save</button>
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderMarkup(bp) {
    return `
      <section class="bishan-pipeline" id="bishan-pipeline-root" aria-label="Bishan Clinics screening pipeline">
        <div class="bishan-pipeline__top">
          <div>
            <h1 class="bishan-pipeline__title">Bishan Clinics</h1>
            <p class="bishan-pipeline__subtitle">Mammobus prospect pipeline — community engagement tracker</p>
          </div>
          <div class="bishan-pipeline__actions">
            <div class="field bishan-pipeline__search">
              <label class="sr-only" for="bp-search">Search by name</label>
              <input id="bp-search" type="search" placeholder="Search by name…" value="${escAttr(bp.filterTerm || "")}" autocomplete="off" />
            </div>
            <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" id="bp-export">Export CSV</button>
            <button type="button" class="ui-btn ui-btn--default ui-btn--sm" id="bp-add-open">+ Add prospect</button>
          </div>
        </div>
        ${renderFilterBar(bp)}
        <div class="bp-stats" id="bp-stats">${renderStatsBar(bp)}</div>
        <div class="bp-board" id="bp-board">${renderBoard(bp)}</div>
        ${renderModal(bp)}
      </section>`;
  }

  function readDraftFromForm(bp) {
    const m = bp.modal;
    if (!m) return;
    const d = m.draft;
    const nameEl = document.getElementById("bp-f-name");
    const ageEl = document.getElementById("bp-f-age");
    if (nameEl instanceof HTMLInputElement) d.name = nameEl.value.trim();
    if (ageEl instanceof HTMLInputElement) d.age = ageEl.value.trim();
    const nric = document.getElementById("bp-f-nric");
    if (nric instanceof HTMLInputElement) d.nric = nric.value.trim();
    const st = document.getElementById("bp-f-status");
    if (st instanceof HTMLSelectElement) d.status = st.value;
    const risk = document.getElementById("bp-f-risk");
    if (risk instanceof HTMLSelectElement) d.risk = risk.value;
    const first = document.getElementById("bp-f-first");
    if (first instanceof HTMLSelectElement) d.first = first.value === "1";
    const rp = document.getElementById("bp-f-period");
    if (rp instanceof HTMLSelectElement) d.reviewPeriod = rp.value;
    const rd = document.getElementById("bp-f-review");
    if (rd instanceof HTMLInputElement) d.reviewDate = rd.value;
    const notes = document.getElementById("bp-f-notes");
    if (notes instanceof HTMLTextAreaElement) d.notes = notes.value.trim();
    for (let i = 0; i < CL[d.stage].length; i++) {
      const cb = document.getElementById(`bp-ck${i}`);
      if (cb instanceof HTMLInputElement) d.checks[i] = cb.checked;
    }
  }

  function switchDraftStage(bp, stId) {
    const m = bp.modal;
    if (!m) return;
    readDraftFromForm(bp);
    const d = m.draft;
    const p = m.mode === "edit" ? bp.prospects.find((x) => x.id === m.prospectId) : null;
    d.stage = stId;
    if (p && p.checks && p.checks[stId]) {
      d.checks = p.checks[stId].slice(0, CL[stId].length);
    } else {
      d.checks = CL[stId].map(() => false);
    }
    while (d.checks.length < CL[stId].length) d.checks.push(false);
  }

  function exportCsv(bp) {
    const rows = [["Name", "Age", "NRIC", "Status", "Risk", "Stage", "First Screener", "Review Period", "Next Review Date", "Files", "Notes"]];
    bp.prospects.forEach((p) => {
      const st = STAGES.find((s) => s.id === p.stage);
      rows.push([
        p.name,
        p.age,
        p.nric,
        p.status,
        p.risk,
        st ? st.label : "",
        p.first ? "Yes" : "No",
        PERIOD_LABELS[p.reviewPeriod] || p.reviewPeriod || "",
        p.reviewDate || "",
        (p.files || []).length,
        p.notes || "",
      ]);
    });
    const csv = rows.map((r) => r.map(csvEscapeCell).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "bishan_mammobus_pipeline.csv";
    a.click();
  }

  let _pdfDoc = null;
  let _pdfPage = 1;
  let _pdfBytes = null;

  function isImg(t) {
    return t && String(t).startsWith("image/");
  }

  function loadPdfJs(dataUrl, onReady) {
    _pdfPage = 1;
    _pdfDoc = null;
    const base64 = dataUrl.split(",")[1];
    const binary = atob(base64);
    _pdfBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) _pdfBytes[i] = binary.charCodeAt(i);
    if (global.pdfjsLib) {
      onReady();
      return;
    }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload = () => {
      global.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      onReady();
    };
    document.head.appendChild(s);
  }

  async function renderPdfPage() {
    try {
      if (!_pdfDoc) {
        _pdfDoc = await global.pdfjsLib.getDocument({ data: _pdfBytes }).promise;
      }
      const page = await _pdfDoc.getPage(_pdfPage);
      const canvas = document.getElementById("bp-pdf-canvas");
      if (!(canvas instanceof HTMLCanvasElement)) return;
      const ctx = canvas.getContext("2d");
      const viewport = page.getViewport({ scale: 1.4 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: ctx, viewport }).promise;
      const info = document.getElementById("bp-pdf-page-info");
      if (info) info.textContent = `Page ${_pdfPage} of ${_pdfDoc.numPages}`;
    } catch (e) {
      const info = document.getElementById("bp-pdf-page-info");
      if (info) info.textContent = "Could not render PDF";
      console.error(e);
    }
  }

  function viewFile(bp, index) {
    const m = bp.modal;
    if (!m) return;
    const p = m.mode === "edit" ? bp.prospects.find((x) => x.id === m.prospectId) : null;
    const saved = (p && p.files) || [];
    const all = [...saved, ...m.draft.pendingFiles];
    const f = all[index];
    if (!f) return;
    const ov = document.createElement("div");
    ov.className = "bp-imgprev";

    if (isImg(f.type)) {
      ov.innerHTML = `<button type="button" class="bp-imgprev-close" aria-label="Close">×</button>
        <img src="${escAttr(f.dataUrl)}" alt="${escAttr(f.name)}">`;
      ov.addEventListener("click", (e) => {
        if (e.target === ov) ov.remove();
      });
      ov.querySelector(".bp-imgprev-close")?.addEventListener("click", () => ov.remove());
      document.body.appendChild(ov);
    } else if (f.type === "application/pdf") {
      ov.innerHTML = `
        <button type="button" class="bp-imgprev-close" aria-label="Close">×</button>
        <div class="bp-pdf-wrap">
          <div class="bp-pdf-toolbar">
            <span>${esc(f.name)}</span>
            <div class="bp-pdf-nav">
              <button type="button" id="bp-pdf-prev">←</button>
              <span id="bp-pdf-page-info">…</span>
              <button type="button" id="bp-pdf-next">→</button>
            </div>
          </div>
          <div class="bp-pdf-canvas-wrap"><canvas id="bp-pdf-canvas"></canvas></div>
        </div>`;
      ov.addEventListener("click", (e) => {
        if (e.target === ov) ov.remove();
      });
      ov.querySelector(".bp-imgprev-close")?.addEventListener("click", () => ov.remove());
      document.body.appendChild(ov);
      document.getElementById("bp-pdf-prev")?.addEventListener("click", () => {
        if (_pdfDoc && _pdfPage > 1) {
          _pdfPage--;
          renderPdfPage();
        }
      });
      document.getElementById("bp-pdf-next")?.addEventListener("click", () => {
        if (_pdfDoc && _pdfPage < _pdfDoc.numPages) {
          _pdfPage++;
          renderPdfPage();
        }
      });
      loadPdfJs(f.dataUrl, () => {
        renderPdfPage();
      });
    } else {
      ov.innerHTML = `<button type="button" class="bp-imgprev-close">×</button>
        <div class="bp-file-fallback">
          <p>${esc(f.name)}</p>
          <button type="button" class="ui-btn ui-btn--default ui-btn--sm" data-bp-dl-fallback>Download to view</button>
        </div>`;
      ov.querySelector(".bp-imgprev-close")?.addEventListener("click", () => ov.remove());
      ov.querySelector("[data-bp-dl-fallback]")?.addEventListener("click", () => downloadFile(f));
      document.body.appendChild(ov);
    }
  }

  function downloadFile(f) {
    const a = document.createElement("a");
    a.href = f.dataUrl;
    a.download = f.name;
    a.click();
  }

  function removeFile(bp, index) {
    const m = bp.modal;
    if (!m) return;
    const p = m.mode === "edit" ? bp.prospects.find((x) => x.id === m.prospectId) : null;
    const saved = (p && p.files) || [];
    if (index < saved.length) {
      if (!global.confirm(`Remove "${saved[index].name}"?`)) return;
      saved.splice(index, 1);
      if (p) p.files = saved;
    } else {
      m.draft.pendingFiles.splice(index - saved.length, 1);
    }
  }

  function handleFiles(bp, fileList, onDone) {
    const m = bp.modal;
    if (!m) return;
    const files = Array.from(fileList || []).filter(Boolean);
    if (!files.length) {
      if (typeof onDone === "function") onDone();
      return;
    }
    const toRead = files.filter((f) => {
      if (f.size > 10 * 1024 * 1024) {
        global.alert(`${f.name} exceeds 10MB.`);
        return false;
      }
      return true;
    });
    if (!toRead.length) {
      if (typeof onDone === "function") onDone();
      return;
    }
    let finished = 0;
    toRead.forEach((f) => {
      const r = new FileReader();
      r.onload = (e) => {
        m.draft.pendingFiles.push({
          name: f.name,
          size: f.size,
          type: f.type,
          dataUrl: e.target.result,
        });
        finished++;
        if (finished >= toRead.length && typeof onDone === "function") onDone();
      };
      r.readAsDataURL(f);
    });
  }

  function bindBishanPipeline(root, api) {
    const get = api.getState;
    const commit = api.commit;

    const syncCheckProg = () => {
      const bp = get();
      const m = bp.modal;
      if (!m) return;
      const stId = m.draft.stage;
      const total = CL[stId].length;
      let done = 0;
      for (let i = 0; i < total; i++) {
        const cb = document.getElementById(`bp-ck${i}`);
        if (cb instanceof HTMLInputElement && cb.checked) done++;
      }
      const pg = document.getElementById("bp-cl-prog");
      if (pg) pg.textContent = `${done} / ${total} completed`;
    };

    root.addEventListener("input", (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      const bp = get();
      if (t.id === "bp-search" && t instanceof HTMLInputElement) {
        bp.filterTerm = t.value;
        commit();
      }
    });

    root.addEventListener("change", (e) => {
      const t = e.target;
      const bp = get();
      if (t instanceof HTMLSelectElement && t.id === "bp-f-period") {
        const m = bp.modal;
        if (!m) return;
        readDraftFromForm(bp);
        m.draft.reviewDate = calcReviewDateFromPeriod(m.draft.reviewPeriod);
        commit();
        return;
      }
      if (t instanceof HTMLInputElement && t.id === "bp-fi" && t.type === "file") {
        handleFiles(bp, t.files, () => commit());
        t.value = "";
        return;
      }
      if (t instanceof HTMLInputElement && t.type === "checkbox" && t.hasAttribute("data-bp-ck")) {
        syncCheckProg();
        const i = Number(t.getAttribute("data-bp-ck"));
        if (bp.modal && bp.modal.draft.checks) {
          bp.modal.draft.checks[i] = t.checked;
          const lab = t.nextElementSibling;
          if (lab) lab.classList.toggle("bp-chk-done", t.checked);
        }
      }
    });

    root.addEventListener("click", (e) => {
      const raw = e.target;
      const el = raw instanceof Element ? raw : null;
      const bp = get();

      if (el?.closest("[data-bp-filter]")) {
        const btn = el.closest("[data-bp-filter]");
        const key = btn.getAttribute("data-bp-filter");
        bp.activeFilter = bp.activeFilter === key ? null : key;
        commit();
        return;
      }
      if (el?.closest("[data-bp-filter-clear]")) {
        bp.activeFilter = null;
        commit();
        return;
      }

      if (el?.closest("#bp-export")) {
        e.preventDefault();
        exportCsv(bp);
        return;
      }
      if (el?.closest("#bp-add-open")) {
        e.preventDefault();
        bp.modal = { mode: "new", prospectId: null, draft: emptyModalDraft("unaware") };
        commit();
        return;
      }

      if (el?.closest("[data-bp-new-stage]")) {
        const st = el.closest("[data-bp-new-stage]").getAttribute("data-bp-new-stage");
        bp.modal = { mode: "new", prospectId: null, draft: emptyModalDraft(st || "unaware") };
        commit();
        return;
      }

      if (el?.closest("[data-bp-edit]")) {
        const id = Number(el.closest("[data-bp-edit]").getAttribute("data-bp-edit"));
        const p = bp.prospects.find((x) => x.id === id);
        if (!p) return;
        bp.modal = { mode: "edit", prospectId: id, draft: draftFromProspect(p) };
        commit();
        return;
      }

      if (e.target instanceof HTMLElement && e.target.id === "bp-ov") {
        bp.modal = null;
        commit();
        return;
      }
      if (el?.closest("[data-bp-mclose]") || el?.closest("[data-bp-cancel]")) {
        e.preventDefault();
        bp.modal = null;
        commit();
        return;
      }

      if (el?.closest("[data-bp-stage]")) {
        e.preventDefault();
        const stId = el.closest("[data-bp-stage]").getAttribute("data-bp-stage");
        switchDraftStage(bp, stId);
        commit();
        return;
      }

      if (el?.closest("[data-bp-save]")) {
        e.preventDefault();
        const m = bp.modal;
        if (!m) return;
        readDraftFromForm(bp);
        const d = m.draft;
        const name = d.name.trim();
        const age = parseInt(d.age, 10);
        if (!name || !age) {
          global.alert("Please enter at least a name and age.");
          return;
        }
        const stId = d.stage;
        const checks = CL[stId].map((_, i) => {
          const cb = document.getElementById(`bp-ck${i}`);
          return cb instanceof HTMLInputElement ? cb.checked : false;
        });
        const rp = d.reviewPeriod;
        const rd = d.reviewDate;
        if (m.mode === "edit") {
          const p = bp.prospects.find((x) => x.id === m.prospectId);
          if (p) {
            Object.assign(p, {
              name,
              age,
              nric: d.nric,
              status: d.status,
              risk: d.risk,
              first: d.first,
              stage: stId,
              notes: d.notes,
              reviewPeriod: rp,
              reviewDate: rd,
            });
            if (!p.checks) p.checks = {};
            p.checks[stId] = checks;
            if (!p.files) p.files = [];
            p.files = [...p.files, ...d.pendingFiles];
          }
        } else {
          const co = {};
          co[stId] = checks;
          bp.prospects.push({
            id: bp.nextId++,
            name,
            age,
            nric: d.nric,
            status: d.status,
            risk: d.risk,
            first: d.first,
            stage: stId,
            notes: d.notes,
            reviewPeriod: rp,
            reviewDate: rd,
            checks: co,
            files: [...d.pendingFiles],
          });
        }
        bp.modal = null;
        commit();
        return;
      }

      if (el?.closest("[data-bp-delete]")) {
        e.preventDefault();
        const m = bp.modal;
        if (!m || m.mode !== "edit") return;
        if (!global.confirm("Remove this prospect?")) return;
        bp.prospects = bp.prospects.filter((p) => p.id !== m.prospectId);
        bp.modal = null;
        commit();
        return;
      }

      const fileView = el?.closest?.("[data-bp-file-view]");
      if (fileView) {
        e.preventDefault();
        viewFile(bp, Number(fileView.getAttribute("data-bp-file-view")));
        return;
      }
      const fileDl = el?.closest?.("[data-bp-file-dl]");
      if (fileDl) {
        e.preventDefault();
        const m = bp.modal;
        if (!m) return;
        const p = m.mode === "edit" ? bp.prospects.find((x) => x.id === m.prospectId) : null;
        const saved = (p && p.files) || [];
        const all = [...saved, ...m.draft.pendingFiles];
        const f = all[Number(fileDl.getAttribute("data-bp-file-dl"))];
        if (f) downloadFile(f);
        return;
      }
      const fileRm = el?.closest?.("[data-bp-file-rm]");
      if (fileRm) {
        e.preventDefault();
        removeFile(bp, Number(fileRm.getAttribute("data-bp-file-rm")));
        commit();
        return;
      }

      if (el?.closest("#bp-upzone")) {
        const fi = document.getElementById("bp-fi");
        if (fi instanceof HTMLInputElement) fi.click();
      }
    });

    const upzone = root.querySelector("#bp-upzone");
    if (upzone) {
      upzone.addEventListener("dragover", (ev) => {
        ev.preventDefault();
        upzone.classList.add("bp-upzone--drag");
      });
      upzone.addEventListener("dragleave", () => upzone.classList.remove("bp-upzone--drag"));
      upzone.addEventListener("drop", (ev) => {
        ev.preventDefault();
        upzone.classList.remove("bp-upzone--drag");
        const bp = get();
        handleFiles(bp, ev.dataTransfer.files, () => commit());
      });
    }
  }

  global.WD_bishanPipeline = {
    createInitialState,
    renderMarkup,
    bindBishanPipeline,
  };
})(window);
