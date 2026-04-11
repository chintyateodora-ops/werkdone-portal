/**
 * WerkDone Prospect Management Portal — static prototype aligned with Figma Make export
 * (globals.css + AllProspects + ProspectDetail tab bodies in detail-panels.js).
 * rowKey disambiguates duplicate PROS-001234 / PROS-001239 IDs across programs.
 */

(function () {
  "use strict";

  const PROGRAMS = [
    { id: "all", label: "All Prospects", figma: "1:2" },
    { id: "mammobus", label: "Mammobus Prospects", figma: "1:800" },
    { id: "hpv", label: "HPV Prospects", figma: "1:996" },
    { id: "fit", label: "FIT Prospects", figma: "1:1468" },
  ];

  const PROSPECTS = [
    {
      rowKey: "PROS-001234-Mammobus",
      id: "PROS-001234",
      name: "Nurul Huda",
      program: "Mammobus",
      ageGender: "Female, 37 years",
      phone: "9421 0785",
      email: "nurul.huda@gmail.com",
      status: "booked",
      sourceType: "Event",
      sourceDetail: "Community Health Roadshow - Bedok",
      lastContact: "1 Nov 2025",
      risk: "medium",
      activityTimeline: [
        {
          stage: "qualified",
          dateTime: "3 Nov 2025, 10:22 am",
          title: "Eligibility confirmed",
          body: "CHAS subsidy and screening criteria recorded on profile.",
          by: "Jasmine Lim",
        },
        {
          stage: "booked",
          dateTime: "1 Nov 2025, 8:05 am",
          title: "Appointment confirmation sent",
          body: "SMS and email confirmation for Mammobus slot at Bedok CC.",
          by: "System",
        },
        {
          stage: "booked",
          dateTime: "31 Oct 2025, 9:00 am",
          title: "Reminder scheduled",
          body: "7-day and 3-day reminders queued.",
          by: "System",
        },
        {
          stage: "booked",
          dateTime: "30 Oct 2025, 6:15 pm",
          title: "Logistics note added",
          body: "Participant prefers morning slot; noted on profile.",
          by: "Jasmine Lim",
        },
        {
          stage: "booked",
          dateTime: "29 Oct 2025, 11:40 am",
          title: "Outbound call",
          body: "Confirmed attendance and NRIC for day of screening.",
          by: "Jasmine Lim",
        },
      ],
    },
    {
      rowKey: "PROS-001234-HPV",
      id: "PROS-001234",
      name: "Nurul Huda",
      program: "HPV",
      ageGender: "Female, 37 years",
      phone: "9421 0785",
      email: "nurul.huda@gmail.com",
      status: "booked",
      sourceType: "Event",
      sourceDetail: "Community Health Roadshow - Bedok",
      lastContact: "1 Nov 2025",
      risk: "medium",
    },
    {
      rowKey: "PROS-001235",
      id: "PROS-001235",
      name: "Mohammed Ali",
      program: "FIT",
      ageGender: "Male, 56 years",
      phone: "9647 3012",
      email: "mohammedali@gmail.com",
      status: "qualified",
      sourceType: "Campaign",
      sourceDetail: "Cancer Awareness 2025",
      lastContact: "28 Oct 2025",
      risk: "low",
    },
    {
      rowKey: "PROS-001236",
      id: "PROS-001236",
      name: "Chen Wei Ning",
      program: "Mammobus",
      ageGender: "Female, 45 years",
      phone: "9781 2345",
      email: "chenweining@outlook.com",
      status: "qualified",
      sourceType: "Manual",
      sourceDetail: "Walk-in Registration",
      lastContact: "25 Oct 2025",
      risk: "medium",
    },
    {
      rowKey: "PROS-001237",
      id: "PROS-001237",
      name: "Olivia Wilson",
      program: "HPV",
      ageGender: "Female, 28 years",
      phone: "9285 7401",
      email: "olivia.wilson@gmail.com",
      status: "qualified",
      sourceType: "Event",
      sourceDetail: "Community Health Roadshow - Bedok",
      lastContact: "19 Oct 2025",
      risk: "high",
    },
    {
      rowKey: "PROS-001238",
      id: "PROS-001238",
      name: "John Tan",
      program: "FIT",
      ageGender: "Male, 54 years",
      phone: "8756 3421",
      email: "jr.hong.ccc@gmail.com",
      status: "booked",
      sourceType: "Event",
      sourceDetail: "Community Health Roadshow - Bedok",
      lastContact: "10 Oct 2025",
      risk: "medium",
    },
    {
      rowKey: "PROS-001239-Mammobus",
      id: "PROS-001239",
      name: "Adam Sim Wei Wen",
      program: "Mammobus",
      ageGender: "Male, 62 years",
      phone: "8246 3791",
      email: "adamsim@example.net",
      status: "screened",
      sourceType: "Campaign",
      sourceDetail: "Pink for Life 2025",
      lastContact: "22 Aug 2025",
      risk: "medium",
    },
    {
      rowKey: "PROS-001239-FIT",
      id: "PROS-001239",
      name: "Adam Sim Wei Wen",
      program: "FIT",
      ageGender: "Male, 62 years",
      phone: "8246 3791",
      email: "adamsim@example.net",
      status: "screened",
      sourceType: "Campaign",
      sourceDetail: "Pink for Life 2025",
      lastContact: "22 Aug 2025",
      risk: "medium",
    },
    {
      rowKey: "PROS-001240",
      id: "PROS-001240",
      name: "Eva Rodriguez",
      program: "HPV",
      ageGender: "Female, 33 years",
      phone: "8573 5294",
      email: "eva.rod@gmail.com",
      status: "qualified",
      sourceType: "Event",
      sourceDetail: "Race for Life",
      lastContact: "",
      risk: "low",
    },
  ];

  const DETAIL_DEFAULT = {
    rowKey: "PROS-00123",
    id: "PROS-00123",
    name: "Lee Wei Xiong",
    subtitle: "Female • 69 years • Last Contacted: 6 November 2025",
    risk: "high",
    pipeline: "qualified",
    timeline: [
      {
        stage: "qualified",
        dateTime: "7 Apr 2026, 9:15 am",
        title: "Phone Call",
        body: "Contacted prospect regarding screening appointment",
        by: "Jasmine Lim",
      },
      {
        stage: "qualified",
        dateTime: "6 Apr 2026, 4:30 pm",
        title: "Status Updated",
        body: 'Status changed from "New" to "Contacted"',
        by: "System",
      },
      {
        stage: "booked",
        dateTime: "5 Apr 2026, 11:00 am",
        title: "Appointment reminder scheduled",
        body: "SMS reminder queued for mammography appointment",
        by: "System",
      },
      {
        stage: "booked",
        dateTime: "4 Apr 2026, 2:45 pm",
        title: "Confirmation email sent",
        body: "Participant received booking summary and venue map.",
        by: "System",
      },
      {
        stage: "booked",
        dateTime: "3 Apr 2026, 8:00 am",
        title: "1-week reminder",
        body: "Automated reminder SMS dispatched.",
        by: "System",
      },
      {
        stage: "screened",
        dateTime: "28 Mar 2026, 3:20 pm",
        title: "Screening documentation",
        body: "Prior screening notes archived to profile",
        by: "Coordinator",
      },
    ],
    tasks: [
      { id: "t1", label: "All eligibility criteria met and documented", done: true },
      { id: "t2", label: "Subsidy pathway confirmed (Healthier SG / CHAS / self-pay)", done: true },
      { id: "t3", label: "Preferred screening date and time captured", done: true },
      { id: "t4", label: "Mammobus location / event communicated", done: true },
      { id: "t5", label: "Pre-screening instructions shared (no deodorant etc.)", done: false },
      { id: "t6", label: "What to bring explained (NRIC, two-piece clothing)", done: false },
      { id: "t7", label: "COVID vaccination date noted if within 6 weeks", done: false },
      { id: "t8", label: "Family history of breast cancer documented", done: false },
      { id: "t9", label: "Any implants or prior surgery flagged for radiographer", done: false },
      { id: "t10", label: "Consent to data collection obtained (PDPA)", done: false },
    ],
    /** Booked / screened checklist flags (lengths match STAGE_CHECKLISTS in detail-panels.js) */
    stageChecklistDone: {
      booked: [true, true, true, false, false, false, false, false],
      screened: [false, false, false, false, false, false, false, false, false, false],
    },
  };

  const state = {
    route: "list",
    routeId: null,
    view: "list",
    program: "all",
    search: "",
    filterModal: false,
    /** List view: empty array = no restriction for that dimension */
    listFilters: { stages: [], genders: [], risks: [], ageMin: 18, ageMax: 100 },
    /** Table sort */
    listSort: { key: "name", dir: "asc" },
    detailTab: "overview",
    pipeline: DETAIL_DEFAULT.pipeline,
    detail: structuredClone(DETAIL_DEFAULT),
    programMenuOpen: false,
    /** mammobus | hpv | fit — set from #/register/... */
    registerProgram: "mammobus",
    /** Left nav active section id on registration page */
    regNavSection: null,
    addProspectMenuOpen: false,
    /** details | medical-history | other-details when editing */
    detailFormEdit: null,
    detailFormDraft: null,
    detailFormValues: {
      details: {},
      medicalHistory: {},
      otherDetails: {},
    },
    /** Active section in registration-style nav (Details / Medical / Other tabs) */
    detailNavSection: "detail-basic",
    /** True when registration opened with ?sr_token=… (patient self-service link) */
    registerSelfService: false,
    /** Mobile token URL: “Skip to section” drawer open */
    registrationMobileNavOpen: false,
    /** Token URL: landing vs full form */
    registerSelfServiceEntry: "landing",
    /** Token URL: Singpass path — demo prefill + lock listed fields */
    registerSingpassLocked: false,
  };

  /** Query param on self-registration URLs (patient-facing token link). */
  const SELF_REG_TOKEN_PARAM = "sr_token";

  /** Prototype Myinfo values (demo only). */
  const SINGPASS_DEMO = Object.freeze({
    fullName: "Tan Wei Ming",
    nricFull: "S1234567D",
    nricFitRest: "1234567D",
    dob: "15-03-1990",
    gender: "Male",
    residential: "Citizen",
    email: "weiming.tan@example.sg",
    phone: "9123 4567",
    postal: "560123",
    block: "123",
    street: "Ang Mo Kio Avenue 6",
    unit: "#12-345",
    building: "",
    chasCardType: "CHAS Blue",
    fitAddress: "Blk 123 Ang Mo Kio Avenue 6",
  });

  let lastDetailTabForForm = "overview";
  let lastRenderWasRegisterSelfService = false;

  const DETAIL_TAB_IDS = [
    "overview",
    "details",
    "medical-history",
    "other-details",
    "screening",
    "appointments",
    "notes",
    "documents",
  ];

  const DETAIL_FORM_TAB_IDS = ["details", "medical-history", "other-details"];

  const PIPELINE_KEYS = ["qualified", "booked", "screened"];

  let lastDetailId = null;
  let searchDebounce = null;

  function pipelineFromStatus(status) {
    if (status === "screened") return "screened";
    if (status === "qualified") return "qualified";
    if (status === "booked") return "booked";
    return "qualified";
  }

  function padBoolArray(arr, len) {
    const a = Array.isArray(arr) ? arr.slice() : [];
    while (a.length < len) a.push(false);
    return a.slice(0, len);
  }

  function ensureProspectChecklists(p) {
    const L = window.WD_STAGE_CHECKLISTS;
    if (!L) return;
    if (!p.checklistByStage) p.checklistByStage = {};
    const hash = (s) =>
      String(s || "")
        .split("")
        .reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const seed = hash(p.rowKey);
    const bit = (i) => (seed + i * 7) % 5 !== 0;
    if (!Array.isArray(p.checklistByStage.qualified) || p.checklistByStage.qualified.length !== L.qualified.length) {
      p.checklistByStage.qualified = L.qualified.map((_, i) => bit(i));
    }
    if (!Array.isArray(p.checklistByStage.booked) || p.checklistByStage.booked.length !== L.booked.length) {
      p.checklistByStage.booked = L.booked.map((_, i) => bit(i + 3));
    }
    if (!Array.isArray(p.checklistByStage.screened) || p.checklistByStage.screened.length !== L.screened.length) {
      p.checklistByStage.screened = L.screened.map((_, i) => bit(i + 11));
    }
  }

  function mergeDetailFromProspect(p) {
    ensureProspectChecklists(p);
    const L = window.WD_STAGE_CHECKLISTS;
    const base = structuredClone(DETAIL_DEFAULT);
    const lc = p.lastContact ? p.lastContact : "—";
    base.rowKey = p.rowKey;
    base.id = p.id;
    base.name = p.name;
    base.subtitle = `${p.ageGender} • Last Contacted: ${lc}`;
    base.risk = p.risk;
    const pipe = pipelineFromStatus(p.status);
    base.pipeline = pipe;

    if (p.checklistByStage?.qualified && p.checklistByStage.qualified.length === base.tasks.length) {
      base.tasks.forEach((t, i) => {
        t.done = !!p.checklistByStage.qualified[i];
      });
    }

    if (L) {
      base.stageChecklistDone = {
        booked: padBoolArray(p.checklistByStage.booked, L.booked.length),
        screened: padBoolArray(p.checklistByStage.screened, L.screened.length),
      };
    }

    base.timeline = p.activityTimeline ? structuredClone(p.activityTimeline) : structuredClone(DETAIL_DEFAULT.timeline);
    return base;
  }

  function persistProspectChecklistsFromDetail() {
    if (state.route !== "detail") return;
    const p = PROSPECTS.find((x) => x.rowKey === state.detail.rowKey);
    if (!p) return;
    ensureProspectChecklists(p);
    const L = window.WD_STAGE_CHECKLISTS;
    if (!p.checklistByStage) p.checklistByStage = {};
    p.checklistByStage.qualified = state.detail.tasks.map((t) => !!t.done);
    if (L && state.detail.stageChecklistDone) {
      p.checklistByStage.booked = padBoolArray(state.detail.stageChecklistDone.booked, L.booked.length);
      p.checklistByStage.screened = padBoolArray(state.detail.stageChecklistDone.screened, L.screened.length);
    }
  }

  function syncDetailFromRoute() {
    if (state.route !== "detail") return;
    const rawId = state.routeId || DETAIL_DEFAULT.rowKey;
    const id = decodeURIComponent(rawId);
    const p = PROSPECTS.find((x) => x.rowKey === id || x.id === id);

    if (p) {
      const switched = lastDetailId !== id;
      if (switched) {
        state.detail = mergeDetailFromProspect(p);
        state.pipeline = state.detail.pipeline;
      }
      /* Same prospect: keep pipeline + checklist state (do not reset from p.status each render — that broke task counts / stepper). */
      lastDetailId = id;
    } else {
      if (lastDetailId !== id) {
        state.detail = structuredClone(DETAIL_DEFAULT);
        state.pipeline = state.detail.pipeline;
      }
      lastDetailId = id;
    }
  }

  const icons = {
    search:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
    list: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/></svg>',
    grid: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z"/></svg>',
    plus:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
    filter:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M7 12h10M10 18h4"/></svg>',
    x: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    chevronDown:
      '<svg class="user-chip__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>',
    back: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>',
    phone:
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 3.5 3 2.9 3.4 2.5 4 2.5h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.1z"/></svg>',
    more: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>',
    chevronTitle:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>',
    clock:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    userSm:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    refresh:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
    upload:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>',
    download:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
    trash:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    edit:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    columns:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3h7v18h-7M5 3h7v18H5V3z"/></svg>',
    chevronLeftSm:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
    chevronRightSm:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>',
    checkStep:
      '<svg class="pipeline__check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
    sort:
      '<svg class="prospect-docs-sort-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 15l5 5 5-5M7 9l5-5 5 5"/></svg>',
    /** List table: neutral chevrons when column is not the active sort */
    tableSortNeutral:
      '<svg class="data-table__sort-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 15l5 5 5-5M7 9l5-5 5 5"/></svg>',
    menuHamburger:
      '<svg class="registration__nav-hamburger-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
  };

  function programTitle() {
    const p = PROGRAMS.find((x) => x.id === state.program);
    return p ? p.label : "All Prospects";
  }

  function filterByProgram(rows) {
    if (state.program === "all") return rows;
    const key = state.program;
    const map = { mammobus: "Mammobus", hpv: "HPV", fit: "FIT" };
    const label = map[key];
    return rows.filter((r) => r.program === label);
  }

  function filterBySearch(rows) {
    const q = state.search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.rowKey.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q)
    );
  }

  function parseProspectAgeGender(ageGender) {
    const s = String(ageGender || "");
    const ageMatch = s.match(/(\d+)\s*years?/i);
    const age = ageMatch ? parseInt(ageMatch[1], 10) : NaN;
    const lower = s.toLowerCase();
    let gender = null;
    if (lower.includes("female")) gender = "female";
    else if (lower.includes("male")) gender = "male";
    return { age: Number.isFinite(age) ? age : null, gender };
  }

  function listFilterCategoryCount() {
    const f = state.listFilters;
    let n = 0;
    if (f.stages.length) n++;
    if (f.genders.length) n++;
    if (f.risks.length) n++;
    if (f.ageMin > 18 || f.ageMax < 100) n++;
    return n;
  }

  function filterByListFilters(rows) {
    const f = state.listFilters;
    const ageRangeActive = f.ageMin > 18 || f.ageMax < 100;
    return rows.filter((r) => {
      const st = PIPELINE_KEYS.includes(r.status) ? r.status : "qualified";
      if (f.stages.length && !f.stages.includes(st)) return false;
      const { age, gender } = parseProspectAgeGender(r.ageGender);
      if (f.genders.length) {
        if (!gender || !f.genders.includes(gender)) return false;
      }
      if (ageRangeActive) {
        if (age == null || age < f.ageMin || age > f.ageMax) return false;
      }
      if (f.risks.length && !f.risks.includes(r.risk)) return false;
      return true;
    });
  }

  const RISK_SORT_ORDER = { low: 0, medium: 1, high: 2 };

  function sortListRows(rows) {
    const { key, dir } = state.listSort;
    const m = dir === "asc" ? 1 : -1;
    const normStatus = (r) => (PIPELINE_KEYS.includes(r.status) ? r.status : "qualified");
    return [...rows].sort((a, b) => {
      let cmp = 0;
      switch (key) {
        case "id":
          cmp = a.id.localeCompare(b.id);
          break;
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "program":
          cmp = a.program.localeCompare(b.program);
          break;
        case "ageGender": {
          const pa = parseProspectAgeGender(a.ageGender).age;
          const pb = parseProspectAgeGender(b.ageGender).age;
          cmp = (pa ?? -1) - (pb ?? -1);
          break;
        }
        case "contact":
          cmp = a.phone.localeCompare(b.phone);
          break;
        case "status":
          cmp = PIPELINE_KEYS.indexOf(normStatus(a)) - PIPELINE_KEYS.indexOf(normStatus(b));
          break;
        case "source":
          cmp = a.sourceDetail.localeCompare(b.sourceDetail);
          break;
        case "lastContact":
          cmp = (a.lastContact || "").localeCompare(b.lastContact || "");
          break;
        case "risk":
          cmp = (RISK_SORT_ORDER[a.risk] ?? 0) - (RISK_SORT_ORDER[b.risk] ?? 0);
          break;
        default:
          cmp = a.name.localeCompare(b.name);
      }
      if (cmp !== 0) return m * cmp;
      return a.rowKey.localeCompare(b.rowKey);
    });
  }

  function getFilteredProspects() {
    return filterByListFilters(filterBySearch(filterByProgram(PROSPECTS)));
  }

  function getListTableRows() {
    return sortListRows(getFilteredProspects());
  }

  function renderSortableTh(label, sortKey) {
    const active = state.listSort.key === sortKey;
    const dir = state.listSort.dir;
    const indicator = active ? (dir === "asc" ? "↑" : "↓") : icons.tableSortNeutral;
    const ariaSort = active ? (dir === "asc" ? "ascending" : "descending") : "none";
    const sortHint = active ? `, ${dir === "asc" ? "ascending" : "descending"}` : "";
    return `<th scope="col" aria-sort="${ariaSort}"><button type="button" class="data-table__sort${active ? " is-active" : ""}" data-list-sort="${sortKey}" aria-label="Sort by ${escapeAttr(label)}${sortHint}">${escapeAttr(label)}<span class="data-table__sort-arrow" aria-hidden="true">${indicator}</span></button></th>`;
  }

  function statusPill(status) {
    const s = PIPELINE_KEYS.includes(status) ? status : "qualified";
    const map = {
      booked: "pill pill--booked",
      qualified: "pill pill--qualified",
      screened: "pill pill--screened",
    };
    const label = s === "booked" ? "Booked" : s === "qualified" ? "Qualified" : "Screened";
    return `<span class="${map[s] || "pill pill--qualified"}">${label}</span>`;
  }

  function riskPill(risk) {
    const cls =
      risk === "high" ? "pill pill--high" : risk === "medium" ? "pill pill--medium" : "pill pill--low";
    const label = risk === "high" ? "High Risk" : risk === "medium" ? "Medium Risk" : "Low Risk";
    return `<span class="${cls}">${label}</span>`;
  }

  /** Singapore Cancer Society branding — top bar logo (see assets/branding/scs-logo.png). */
  function renderScsLogo() {
    return `<img class="app-header__logo" src="assets/branding/scs-logo.png" alt="Singapore Cancer Society Logo" width="200" height="64" />`;
  }

  function renderHeader(options = {}) {
    const selfService = Boolean(options.selfService);
    if (selfService) {
      return `
      <header class="app-header app-header--self-service">
        <div class="app-header__brand">
          ${renderScsLogo()}
        </div>
      </header>
    `;
    }
    return `
      <header class="app-header">
        <div class="app-header__brand">
          ${renderScsLogo()}
        </div>
        <div class="app-header__actions">
          <button type="button" class="user-chip" aria-label="User menu">
            <span class="user-chip__avatar">TH</span>
            <span><span class="user-name">Thong Han</span><span class="sep">|</span><span class="user-role">Super Admin</span></span>
            ${icons.chevronDown}
          </button>
          <button type="button" class="btn btn--outline btn--sm">Need Help?</button>
        </div>
      </header>
    `;
  }

  function renderProgramTitleDropdown() {
    const open = state.programMenuOpen ? "is-open" : "";
    return `
      <div class="title-dropdown ${open}" id="program-title-dropdown">
        <button type="button" class="title-dropdown__trigger" data-program-menu-toggle aria-expanded="${state.programMenuOpen}" aria-haspopup="true">
          <h1>${escapeAttr(programTitle())}</h1>
          <span class="title-dropdown__chev" aria-hidden="true">${icons.chevronTitle}</span>
        </button>
        <div class="title-dropdown__panel" role="menu">
          ${PROGRAMS.map(
            (p) => `
            <button type="button" role="menuitem" class="title-dropdown__option ${state.program === p.id ? "is-selected" : ""}" data-program-option="${p.id}">${escapeAttr(p.label)}</button>
          `
          ).join("")}
        </div>
      </div>
    `;
  }

  function renderListToolbar() {
    const listPressed = state.view === "list";
    const kanbanPressed = state.view === "kanban";
    return `
      <div class="page-toolbar page-toolbar--split">
        ${renderProgramTitleDropdown()}
        <div class="view-toggle" role="group" aria-label="View mode">
          <button type="button" class="btn btn--icon" aria-pressed="${listPressed}" aria-label="List view" data-view="list">${icons.list}</button>
          <button type="button" class="btn btn--icon" aria-pressed="${kanbanPressed}" aria-label="Kanban view" data-view="kanban">${icons.grid}</button>
        </div>
      </div>
      <div class="page-toolbar page-toolbar--tools">
        <div class="toolbar-search">
          <span class="toolbar-search__icon" aria-hidden="true">${icons.search}</span>
          <input type="search" id="prospect-search" placeholder="Search by Name or NRIC" value="${escapeAttr(state.search)}" autocomplete="off" />
        </div>
        <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" id="btn-list-filters" aria-haspopup="dialog" aria-expanded="${state.filterModal}">
          <span class="ui-btn__icon" aria-hidden="true">${icons.filter}</span>
          Filters
          ${
            listFilterCategoryCount() > 0
              ? `<span class="ui-badge" aria-label="${listFilterCategoryCount()} filter categories active">${listFilterCategoryCount()}</span>`
              : ""
          }
        </button>
        <div class="title-dropdown title-dropdown--align-end ${state.addProspectMenuOpen ? "is-open" : ""}" id="add-prospect-dropdown">
          <button type="button" class="btn btn--primary" data-add-prospect-toggle aria-expanded="${state.addProspectMenuOpen}" aria-haspopup="true">
            ${icons.plus} Add Prospect
          </button>
          <div class="title-dropdown__panel" role="menu">
            <a href="#/register/mammobus" class="title-dropdown__option" role="menuitem">Community Mammobus Programme</a>
            <a href="#/register/hpv" class="title-dropdown__option" role="menuitem">HPV Screening Programme</a>
            <a href="#/register/fit" class="title-dropdown__option" role="menuitem">FIT Screening Programme</a>
          </div>
        </div>
      </div>
    `;
  }

  function escapeAttr(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function renderTable(rows) {
    if (rows.length === 0) {
      return `<div class="table-card"><p class="placeholder-block" style="margin:0">No prospects match the current program, search, or filters.</p></div>`;
    }
    return `
      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              ${renderSortableTh("Prospect ID", "id")}
              ${renderSortableTh("Name", "name")}
              ${renderSortableTh("Program", "program")}
              ${renderSortableTh("Age / Gender", "ageGender")}
              ${renderSortableTh("Contact", "contact")}
              ${renderSortableTh("Status", "status")}
              ${renderSortableTh("Source", "source")}
              ${renderSortableTh("Last Contacted", "lastContact")}
              ${renderSortableTh("Risk", "risk")}
              <th scope="col" class="data-table__th--actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (r) => `
              <tr tabindex="0" data-nav-prospect="${escapeAttr(r.rowKey)}">
                <td>${escapeAttr(r.id)}</td>
                <td>${escapeAttr(r.name)}</td>
                <td>${escapeAttr(r.program)}</td>
                <td>${escapeAttr(r.ageGender)}</td>
                <td>
                  <div class="cell-stack">
                    <span>${escapeAttr(r.phone)}</span>
                    <span class="cell-muted">${escapeAttr(r.email)}</span>
                  </div>
                </td>
                <td>${statusPill(r.status)}</td>
                <td>
                  <div class="cell-stack">
                    <span>${escapeAttr(r.sourceType)}</span>
                    <span class="cell-muted">${escapeAttr(r.sourceDetail)}</span>
                  </div>
                </td>
                <td>${r.lastContact ? escapeAttr(r.lastContact) : "—"}</td>
                <td>${riskPill(r.risk)}</td>
                <td><button type="button" class="btn btn--icon" aria-label="Actions for ${escapeAttr(r.name)}">${icons.more}</button></td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function pipelineStageIndex(key) {
    const i = PIPELINE_KEYS.indexOf(key);
    return i === -1 ? 0 : i;
  }

  function kanbanCardMeta(p) {
    const riskLabel = p.risk === "high" ? "High Risk" : p.risk === "medium" ? "Medium Risk" : "Low Risk";
    const age = p.ageGender.includes("·") ? p.ageGender.split("·")[0].trim() : p.ageGender;
    return `${age} · ${riskLabel}`;
  }

  function kanbanCardProgress(p) {
    const st = PIPELINE_KEYS.includes(p.status) ? p.status : "qualified";
    const L = window.WD_STAGE_CHECKLISTS;
    if (!L) return { tasks: "0/0", pct: 0 };
    ensureProspectChecklists(p);
    const labels = st === "qualified" ? L.qualified : st === "booked" ? L.booked : L.screened;
    const total = labels.length;
    const arr = p.checklistByStage[st];
    const done = Array.isArray(arr) ? arr.filter(Boolean).length : 0;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return { tasks: `${done}/${total}`, pct };
  }

  function renderKanbanFromProspects() {
    const rows = getFilteredProspects();
    const cols = [
      { key: "qualified", label: "Qualified" },
      { key: "booked", label: "Booked" },
      { key: "screened", label: "Screened" },
    ];
    return cols
      .map((col) => {
        const inCol = rows.filter((r) => (PIPELINE_KEYS.includes(r.status) ? r.status : "qualified") === col.key);
        const cards = inCol
          .map((r) => {
            const { tasks, pct } = kanbanCardProgress(r);
            return `
        <article class="kanban-card" tabindex="0" data-kanban-card data-kanban-prospect="${escapeAttr(r.rowKey)}">
          <div><span class="pill">${escapeAttr(r.program)}</span></div>
          <h2 class="kanban-card__name">${escapeAttr(r.name)}</h2>
          <p class="kanban-card__meta">${escapeAttr(kanbanCardMeta(r))}</p>
          <div class="kanban-card__tasks">
            <span>Tasks</span>
            <span>${escapeAttr(tasks)}</span>
          </div>
          <div class="kanban-card__bar"><span style="width:${pct}%"></span></div>
        </article>`;
          })
          .join("");
        return `
        <div class="kanban-col" data-stage="${col.key}">
          <div class="kanban-col__head">
            <div class="kanban-col__title">
              <span class="kanban-col__dot" aria-hidden="true"></span>
              ${col.label}
            </div>
            <span class="kanban-col__count">${inCol.length}</span>
          </div>
          ${cards}
        </div>`;
      })
      .join("");
  }

  function renderListPage() {
    const toolbar = renderListToolbar();
    const body =
      state.view === "kanban"
        ? `<div class="kanban">${renderKanbanFromProspects()}</div>`
        : renderTable(getListTableRows());
    return `${toolbar}${body}`;
  }

  function normalizeDetailTab() {
    const legacy = { medical: "medical-history", other: "other-details", document: "documents" };
    if (typeof state.detailTab === "string") state.detailTab = state.detailTab.trim();
    if (legacy[state.detailTab]) state.detailTab = legacy[state.detailTab];
    if (!DETAIL_TAB_IDS.includes(state.detailTab)) state.detailTab = "overview";
  }

  function pipelineStageLabel() {
    const s = state.pipeline || "qualified";
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function renderDetailFormStickyToolbarHtml() {
    const fn = typeof window.WD_renderDetailFormStickyToolbar === "function" ? window.WD_renderDetailFormStickyToolbar : null;
    if (!fn) return "";
    const ctx = {
      d: state.detail,
      state,
      icons,
      escapeAttr,
      detailFormEdit: state.detailFormEdit,
      detailNavSection: state.detailNavSection,
      formValues: state.detailFormValues,
    };
    return fn(state.detailTab, ctx);
  }

  function renderDetailPage() {
    normalizeDetailTab();
    const d = state.detail;
    const tabs = [
      ["overview", "Overview"],
      ["details", "Details"],
      ["medical-history", "Medical History"],
      ["other-details", "Other Details"],
      ["screening", "Screening"],
      ["appointments", "Appointments"],
      ["notes", "Notes"],
      ["documents", "Document"],
    ];
    return `
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="#/list">Prospect Management</a>
        <span aria-hidden="true">›</span>
        <span>${escapeAttr(d.id)}</span>
      </nav>
      <div class="detail-hero">
        <div class="detail-hero__row">
          <a href="#/list" class="detail-hero__back" aria-label="Back to list">${icons.back}</a>
          <h1>${escapeAttr(d.name)}</h1>
        </div>
        <div class="detail-hero__sub">
          <span>${escapeAttr(d.subtitle)}</span>
          ${riskPill(d.risk)}
        </div>
      </div>
      <div class="pipeline pipeline--stepper">
        <div class="pipeline__stages pipeline__stages--chevron" role="group" aria-label="Pipeline stage">
          ${PIPELINE_KEYS.map((s) => {
            const cur = pipelineStageIndex(state.pipeline);
            const idx = pipelineStageIndex(s);
            const label = s.charAt(0).toUpperCase() + s.slice(1);
            let stateMod = "pipeline__stage--upcoming";
            if (idx < cur) stateMod = "pipeline__stage--complete";
            else if (idx === cur) stateMod = "pipeline__stage--current";
            const showCheck = idx <= cur;
            const inner = showCheck
              ? `<span class="pipeline__stage__inner">${icons.checkStep}<span class="pipeline__stage__label">${label}</span></span>`
              : `<span class="pipeline__stage__inner pipeline__stage__inner--text-only"><span class="pipeline__stage__label">${label}</span></span>`;
            const ariaCur = state.pipeline === s ? ' aria-current="step"' : "";
            return `
            <button type="button" class="pipeline__stage ${stateMod}" data-pipeline="${s}"${ariaCur} aria-pressed="${state.pipeline === s}">${inner}</button>`;
          }).join("")}
        </div>
      </div>
      <div class="detail-sticky-chrome detail-sticky-chrome--primary-bundle">
        <div class="detail-tabs" role="tablist">
          ${tabs
            .map(
              ([id, label]) => `
            <button type="button" role="tab" aria-selected="${state.detailTab === id}" class="${state.detailTab === id ? "is-active" : ""}" data-detail-tab="${id}">${label}</button>
          `
            )
            .join("")}
        </div>
        ${renderDetailFormStickyToolbarHtml()}
      </div>
      <div class="detail-panels">
        ${renderDetailPanel()}
      </div>
    `;
  }

  function renderDetailPanel() {
    normalizeDetailTab();
    const render = typeof window.WD_renderDetailPanel === "function" ? window.WD_renderDetailPanel : null;
    if (!render) {
      return `<div class="detail-panel"><p class="placeholder-block">detail-panels.js failed to load.</p></div>`;
    }
    return render(state.detailTab, {
      d: state.detail,
      state,
      icons,
      escapeAttr,
      pipelineLabel: pipelineStageLabel(),
      detailFormEdit: state.detailFormEdit,
      detailNavSection: state.detailNavSection,
      formValues: state.detailFormValues,
    });
  }

  const REG_NAV_ITEMS = [
    ["reg-personal", "Personal Information"],
    ["reg-programme", "Programme Selection"],
    ["reg-screening", "Screening Questions"],
    ["reg-emergency", "Emergency Contact"],
    ["reg-medical", "Medical History"],
    ["reg-source", "Source Information"],
    ["reg-pdpa", "PDPA Consent"],
  ];

  const REG_NAV_ITEMS_HPV = [
    ["reg-hpv-client", "Client's Information"],
    ["reg-hpv-address", "Client's Address"],
    ["reg-hpv-venue", "Venue of Screening"],
    ["reg-hpv-source", "Source Information"],
    ["reg-hpv-pdpa", "PDPA Consent"],
  ];

  const REG_NAV_ITEMS_FIT = [
    ["reg-fit-personal", "Personal Particulars"],
    ["reg-fit-clinical", "Clinical History & Consent"],
    ["reg-fit-source", "Source Information"],
  ];

  function regNavItemsForProgram() {
    if (state.registerProgram === "hpv") return REG_NAV_ITEMS_HPV;
    if (state.registerProgram === "fit") return REG_NAV_ITEMS_FIT;
    return REG_NAV_ITEMS;
  }

  function regNavBtnClass(sectionId) {
    return state.regNavSection === sectionId ? "registration__nav-btn is-active" : "registration__nav-btn";
  }

  function registrationBodyClass() {
    return `registration registration--body${state.registerSelfService ? " registration--self-service" : ""}`;
  }

  /** FormSG-style: on mobile, primary submit is at end of form (see CSS breakpoint). */
  function renderRegistrationMobileSubmitFooter() {
    if (!state.registerSelfService) return "";
    return `
              <div class="registration__mobile-submit-footer">
                <button type="submit" form="registration-form" class="btn btn--primary registration__mobile-submit">Submit Registration</button>
              </div>`;
  }

  function renderRegistrationNavButtonsHtml() {
    return regNavItemsForProgram()
      .map(
        ([id, label]) =>
          `<button type="button" class="${regNavBtnClass(id)}" data-reg-nav="${escapeAttr(id)}">${escapeAttr(label)}</button>`
      )
      .join("");
  }

  function registerProgramLandingTitle() {
    if (state.registerProgram === "hpv") return "HPV Test / PAP Test Screening";
    if (state.registerProgram === "fit") return "FIT Screening Programme";
    return "Community Mammobus Programme";
  }

  function renderRegisterSelfServiceLandingPage() {
    const title = escapeAttr(registerProgramLandingTitle());
    return `
      <div class="app-shell app-shell--reg-landing">
        <header class="reg-landing__header" role="banner">
          <div class="reg-landing__logos">
            <img src="assets/branding/scs-logo.png" alt="Singapore Cancer Society" class="reg-landing__logo reg-landing__logo--scs" width="160" height="52" />
            <span class="reg-landing__logo-divider" aria-hidden="true"></span>
            <img src="assets/branding/logo-bcf.png" alt="Breast Cancer Foundation" class="reg-landing__logo reg-landing__logo--bcf" width="120" height="160" />
            <span class="reg-landing__logo-divider" aria-hidden="true"></span>
            <img src="assets/branding/logo-nhg-diagnostics.png" alt="NHG Health Diagnostics" class="reg-landing__logo reg-landing__logo--nhg" width="220" height="56" />
          </div>
        </header>
        <main class="reg-landing__main" id="main-content">
          <div class="reg-landing__card">
            <h1 class="reg-landing__title">${title}</h1>
            <p class="reg-landing__subtitle">Select a registration method</p>
            <button type="button" id="reg-landing-singpass" class="reg-landing__singpass">
              Retrieve Myinfo with <span class="reg-landing__singpass-brand" lang="en">singpass</span>
            </button>
            <p class="reg-landing__singpass-note">Singpass enables you to retrieve your personal data from participating Government sources and pre-fill the registration form.</p>
            <div class="reg-landing__or"><span>or</span></div>
            <button type="button" id="reg-landing-manual" class="reg-landing__manual">Complete Registration Manually</button>
            <p class="reg-landing__browser-hint"><em>For the best experience, complete this form using the latest Chrome or Safari browser version.</em></p>
          </div>
        </main>
        <footer class="app-footer reg-landing__footer">Copyright © 2026 WERKDONE PTE LTD.</footer>
      </div>`;
  }

  function renderRegistrationNavDrawer() {
    const open = state.registrationMobileNavOpen;
    return `
      <div class="registration-nav-drawer-backdrop${open ? " is-open" : ""}" id="registration-nav-drawer-backdrop" aria-hidden="${open ? "false" : "true"}">
        <div class="registration-nav-drawer__scrim" data-registration-nav-dismiss tabindex="-1" aria-hidden="true"></div>
        <div class="registration-nav-drawer" id="registration-nav-drawer" role="dialog" aria-modal="true" aria-labelledby="registration-nav-drawer-title">
          <div class="registration-nav-drawer__header">
            <h2 class="registration-nav-drawer__title" id="registration-nav-drawer-title">Skip to section</h2>
            <button type="button" class="registration-nav-drawer__close" id="registration-nav-drawer-close" aria-label="Close menu">${icons.x}</button>
          </div>
          <nav class="registration-nav-drawer__nav" aria-label="Form sections">
            ${renderRegistrationNavButtonsHtml()}
          </nav>
        </div>
      </div>`;
  }

  function renderHpvChrome() {
    if (state.registerSelfService) {
      return `
      <div class="registration__toolbar registration__toolbar--self-service">
        <div class="registration__toolbar-row registration__toolbar-row--self-service-main">
          <div class="registration__toolbar-titles">
            <h1 class="registration__title">HPV Test / PAP Test Screening</h1>
            <p class="registration__subtitle">Screening Registration Form</p>
          </div>
          <button type="button" class="registration__nav-hamburger" id="registration-nav-toggle" aria-label="Skip to section menu" aria-expanded="${state.registrationMobileNavOpen}" aria-controls="registration-nav-drawer">${icons.menuHamburger}</button>
          <div class="registration__toolbar-actions">
            <button type="submit" form="registration-form" class="btn btn--primary">Submit Registration</button>
          </div>
        </div>
      </div>
    `;
    }
    return `
      <nav class="breadcrumb registration__breadcrumb--chrome" aria-label="Breadcrumb">
        <a href="#/list">Prospect Management</a>
        <span aria-hidden="true">›</span>
        <span>HPV Test / PAP Test Screening</span>
      </nav>
      <div class="registration__toolbar">
        <div class="registration__toolbar-row">
          <a href="#/list" class="detail-hero__back" aria-label="Back to list">${icons.back}</a>
          <div class="registration__toolbar-titles">
            <h1 class="registration__title">HPV Test / PAP Test Screening</h1>
            <p class="registration__subtitle">Screening Registration Form</p>
          </div>
          <div class="registration__toolbar-actions">
            <button type="button" class="btn btn--outline" id="copy-link">Copy Registration Link</button>
            <a href="#/list" class="btn btn--outline">Cancel</a>
            <button type="submit" form="registration-form" class="btn btn--primary">Submit Registration</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderFitChrome() {
    if (state.registerSelfService) {
      return `
      <div class="registration__toolbar registration__toolbar--self-service">
        <div class="registration__toolbar-row registration__toolbar-row--self-service-main">
          <div class="registration__toolbar-titles">
            <h1 class="registration__title">FIT Screening Programme</h1>
            <p class="registration__subtitle">Faecal Immunochemical Test — Registration Form</p>
          </div>
          <button type="button" class="registration__nav-hamburger" id="registration-nav-toggle" aria-label="Skip to section menu" aria-expanded="${state.registrationMobileNavOpen}" aria-controls="registration-nav-drawer">${icons.menuHamburger}</button>
          <div class="registration__toolbar-actions">
            <button type="submit" form="registration-form" class="btn btn--primary">Submit Registration</button>
          </div>
        </div>
      </div>
    `;
    }
    return `
      <nav class="breadcrumb registration__breadcrumb--chrome" aria-label="Breadcrumb">
        <a href="#/list">Prospect Management</a>
        <span aria-hidden="true">›</span>
        <span>FIT Screening Programme</span>
      </nav>
      <div class="registration__toolbar">
        <div class="registration__toolbar-row">
          <a href="#/list" class="detail-hero__back" aria-label="Back to list">${icons.back}</a>
          <div class="registration__toolbar-titles">
            <h1 class="registration__title">FIT Screening Programme</h1>
            <p class="registration__subtitle">Faecal Immunochemical Test — Registration Form</p>
          </div>
          <div class="registration__toolbar-actions">
            <button type="button" class="btn btn--outline" id="copy-link">Copy Registration Link</button>
            <a href="#/list" class="btn btn--outline">Cancel</a>
            <button type="submit" form="registration-form" class="btn btn--primary">Submit Registration</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderMammobusChrome() {
    if (state.registerSelfService) {
      return `
      <div class="registration__toolbar registration__toolbar--self-service">
        <div class="registration__toolbar-row registration__toolbar-row--self-service-main">
          <div class="registration__toolbar-titles">
            <h1 class="registration__title">Community Mammobus Programme</h1>
            <p class="registration__subtitle">Screening Registration Form</p>
          </div>
          <button type="button" class="registration__nav-hamburger" id="registration-nav-toggle" aria-label="Skip to section menu" aria-expanded="${state.registrationMobileNavOpen}" aria-controls="registration-nav-drawer">${icons.menuHamburger}</button>
          <div class="registration__toolbar-actions">
            <button type="submit" form="registration-form" class="btn btn--primary">Submit Registration</button>
          </div>
        </div>
      </div>
    `;
    }
    return `
      <nav class="breadcrumb registration__breadcrumb--chrome" aria-label="Breadcrumb">
        <a href="#/list">Prospect Management</a>
        <span aria-hidden="true">›</span>
        <span>Community Mammobus Programme</span>
      </nav>
      <div class="registration__toolbar">
        <div class="registration__toolbar-row">
          <a href="#/list" class="detail-hero__back" aria-label="Back to list">${icons.back}</a>
          <div class="registration__toolbar-titles">
            <h1 class="registration__title">Community Mammobus Programme</h1>
            <p class="registration__subtitle">Screening Registration Form</p>
          </div>
          <div class="registration__toolbar-actions">
            <button type="button" class="btn btn--outline" id="copy-link">Copy Registration Link</button>
            <a href="#/list" class="btn btn--outline">Cancel</a>
            <button type="submit" form="registration-form" class="btn btn--primary">Submit Registration</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderRegisterMammobus() {
    const navHtml = renderRegistrationNavButtonsHtml();

    return `
        <div class="${registrationBodyClass()}">
        <div class="registration__split">
          <div class="registration__toc" aria-label="Form sections">
            <aside class="registration__sidebar">
              <nav class="registration__sidebar-inner">${navHtml}</nav>
            </aside>
          </div>
          <div class="registration__form-col">
            <form id="registration-form" class="registration__form" novalidate>
              <section id="reg-personal" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Personal Information</h2>
                <div class="form-grid form-grid--reg">
                  <div class="field field--full">
                    <label for="fullName">Full Name (as per NRIC)<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="fullName" name="fullName" type="text" required autocomplete="name" placeholder="Enter full name as in NRIC" />
                  </div>
                  <div class="field">
                    <label for="nric">NRIC / FIN Number<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="nric" name="nric" required placeholder="Enter NRIC No." />
                  </div>
                  <div class="field">
                    <label for="dob">Date of Birth<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="dob" name="dob" type="text" required placeholder="DD-MM-YYYY" />
                  </div>
                  <div class="field">
                    <label for="gender">Gender<span class="field__req" aria-hidden="true">*</span></label>
                    <select id="gender" name="gender" required>
                      <option value="">Select</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="residential">Residential Status<span class="field__req" aria-hidden="true">*</span></label>
                    <select id="residential" name="residential" required>
                      <option value="">Select</option>
                      <option value="Citizen">Singapore Citizen</option>
                      <option value="PR">Permanent Resident</option>
                      <option value="Foreigner">Foreigner</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="race">Race<span class="field__req" aria-hidden="true">*</span></label>
                    <select id="race" name="race" required>
                      <option value="">Select</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Malay">Malay</option>
                      <option value="Indian">Indian</option>
                      <option value="Eurasian">Eurasian</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div class="field field--full">
                    <label for="chasCardType">CHAS card type</label>
                    <select id="chasCardType" name="chasCardType">
                      <option value="">Select</option>
                      <option value="CHAS Orange">CHAS Orange</option>
                      <option value="CHAS Blue">CHAS Blue</option>
                      <option value="CHAS Green">CHAS Green</option>
                      <option value="Merdeka Generation">Merdeka Generation</option>
                      <option value="Pioneer Generation">Pioneer Generation</option>
                      <option value="None">None / Not applicable</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="phone">Mobile Number<span class="field__req" aria-hidden="true">*</span></label>
                    <div class="field__inline">
                      <input type="text" class="field__prefix" value="+65" disabled aria-label="Country code" />
                      <input id="phone" name="phone" type="tel" required placeholder="E.g. 8123 4567" />
                    </div>
                  </div>
                  <div class="field">
                    <label for="email">Email Address</label>
                    <input id="email" name="email" type="email" placeholder="Enter your email" />
                  </div>
                  <div class="field field--full">
                    <h3 class="registration__address-title">Residential Address</h3>
                  </div>
                  <div class="field">
                    <label for="postal">Postal Code<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="postal" name="postal" required placeholder="e.g. 123456" />
                  </div>
                  <div class="field">
                    <label for="block">Block Number<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="block" name="block" required placeholder="e.g. 123" />
                  </div>
                  <div class="field field--full">
                    <label for="street">Street Name<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="street" name="street" required placeholder="e.g. Orchard Road" />
                  </div>
                  <div class="field">
                    <label for="unit">Unit Number</label>
                    <input id="unit" name="unit" placeholder="e.g. #12-34" />
                  </div>
                  <div class="field">
                    <label for="building">Building Name</label>
                    <input id="building" name="building" placeholder="e.g. Plaza Singapura" />
                  </div>
                </div>
              </section>

              <section id="reg-programme" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Programme Selection</h2>
                <div class="field field--full">
                  <label for="programme">Which screening programme would you like to sign up for?<span class="field__req" aria-hidden="true">*</span></label>
                  <select id="programme" name="programme" required>
                    <option value="">Select Programme</option>
                    <option value="mammobus">Mammobus (Mammography Screening)</option>
                    <option value="hpv">HPV Screening</option>
                    <option value="fit">FIT (Faecal Immunochemical Test)</option>
                  </select>
                </div>
              </section>

              <section id="reg-screening" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Screening Questions</h2>
                <div class="registration__stack">
                  <div class="field field--full">
                    <label for="lastMammogram">When was your last mammogram?<span class="field__req" aria-hidden="true">*</span></label>
                    <select id="lastMammogram" name="lastMammogram" required>
                      <option value="">Select</option>
                      <option value="never">Never had a mammogram</option>
                      <option value="&lt;1year">Less than 1 year ago</option>
                      <option value="1-2years">1–2 years ago</option>
                      <option value="&gt;2years">More than 2 years ago</option>
                    </select>
                  </div>
                  <fieldset class="registration__fieldset field field--full">
                    <legend class="registration__fieldset-legend">Do you have any of the following breast symptoms?<span class="field__req" aria-hidden="true">*</span></legend>
                    <p class="registration__hint registration__hint--tight">Lump, nipple discharge, skin changes, or pain</p>
                    <div class="registration__radio-group" role="radiogroup">
                      <label class="registration__radio-label"><input type="radio" name="breastSymptoms" value="yes" required /> Yes</label>
                      <label class="registration__radio-label"><input type="radio" name="breastSymptoms" value="no" /> No</label>
                    </div>
                  </fieldset>
                  <fieldset class="registration__fieldset field field--full">
                    <legend class="registration__fieldset-legend">Have you had any breast surgery?<span class="field__req" aria-hidden="true">*</span></legend>
                    <div class="registration__radio-group">
                      <label class="registration__radio-label"><input type="radio" name="breastSurgery" value="yes" required /> Yes</label>
                      <label class="registration__radio-label"><input type="radio" name="breastSurgery" value="no" /> No</label>
                    </div>
                  </fieldset>
                  <fieldset class="registration__fieldset field field--full">
                    <legend class="registration__fieldset-legend">Are you currently pregnant?<span class="field__req" aria-hidden="true">*</span></legend>
                    <div class="registration__radio-group">
                      <label class="registration__radio-label"><input type="radio" name="pregnant" value="yes" required /> Yes</label>
                      <label class="registration__radio-label"><input type="radio" name="pregnant" value="no" /> No</label>
                      <label class="registration__radio-label"><input type="radio" name="pregnant" value="unsure" /> Unsure</label>
                    </div>
                  </fieldset>
                  <fieldset class="registration__fieldset field field--full">
                    <legend class="registration__fieldset-legend">Are you currently breastfeeding?<span class="field__req" aria-hidden="true">*</span></legend>
                    <div class="registration__radio-group">
                      <label class="registration__radio-label"><input type="radio" name="breastfeeding" value="yes" required /> Yes</label>
                      <label class="registration__radio-label"><input type="radio" name="breastfeeding" value="no" /> No</label>
                    </div>
                  </fieldset>
                  <fieldset class="registration__fieldset field field--full">
                    <legend class="registration__fieldset-legend">Do you have breast implants?<span class="field__req" aria-hidden="true">*</span></legend>
                    <div class="registration__radio-group">
                      <label class="registration__radio-label"><input type="radio" name="breastImplants" value="yes" required /> Yes</label>
                      <label class="registration__radio-label"><input type="radio" name="breastImplants" value="no" /> No</label>
                    </div>
                  </fieldset>
                </div>
              </section>

              <section id="reg-emergency" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Emergency Contact</h2>
                <div class="form-grid form-grid--reg">
                  <div class="field field--full">
                    <label for="emergencyName">Emergency Contact Name<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="emergencyName" name="emergencyName" required placeholder="Enter emergency contact name" />
                  </div>
                  <div class="field">
                    <label for="emergencyRel">Relationship<span class="field__req" aria-hidden="true">*</span></label>
                    <select id="emergencyRel" name="emergencyRel" required>
                      <option value="">Select Relationship</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Child">Child</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Friend">Friend</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="emergencyPhone">Emergency Contact Number<span class="field__req" aria-hidden="true">*</span></label>
                    <div class="field__inline">
                      <input type="text" class="field__prefix" value="+65" disabled aria-label="Country code" />
                      <input id="emergencyPhone" name="emergencyPhone" type="tel" required placeholder="E.g. 8123 4567" />
                    </div>
                  </div>
                </div>
              </section>

              <section id="reg-medical" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Medical History</h2>
                <div class="registration__stack">
                  <fieldset class="registration__fieldset field field--full">
                    <legend class="registration__fieldset-legend">Do you have any family history of cancer?<span class="field__req" aria-hidden="true">*</span></legend>
                    <div class="registration__radio-group">
                      <label class="registration__radio-label"><input type="radio" name="familyCancerHistory" value="yes" required /> Yes</label>
                      <label class="registration__radio-label"><input type="radio" name="familyCancerHistory" value="no" /> No</label>
                    </div>
                  </fieldset>
                  <div class="field field--full">
                    <span class="field__static-label" id="family-cancer-types-label">If family history of cancer, which type(s)? (Select all that apply)</span>
                    <div class="registration__checkbox-stack" role="group" aria-labelledby="family-cancer-types-label">
                      <label class="registration__check-label"><input type="checkbox" name="cancerTypes" value="Breast Cancer" /> Breast Cancer</label>
                      <label class="registration__check-label"><input type="checkbox" name="cancerTypes" value="Colorectal Cancer" /> Colorectal Cancer</label>
                      <label class="registration__check-label"><input type="checkbox" name="cancerTypes" value="Lung Cancer" /> Lung Cancer</label>
                      <label class="registration__check-label"><input type="checkbox" name="cancerTypes" value="Ovarian Cancer" /> Ovarian Cancer</label>
                      <label class="registration__check-label"><input type="checkbox" name="cancerTypes" value="Other" /> Other</label>
                    </div>
                  </div>
                  <fieldset class="registration__fieldset field field--full">
                    <legend class="registration__fieldset-legend">Have you been diagnosed with cancer?<span class="field__req" aria-hidden="true">*</span></legend>
                    <div class="registration__radio-group">
                      <label class="registration__radio-label"><input type="radio" name="personalCancerHistory" value="yes" required /> Yes</label>
                      <label class="registration__radio-label"><input type="radio" name="personalCancerHistory" value="no" /> No</label>
                    </div>
                  </fieldset>
                  <div class="field field--full">
                    <label for="personalCancerType">If you answered Yes above, type of cancer</label>
                    <input id="personalCancerType" name="personalCancerType" type="text" placeholder="Specify cancer type" />
                  </div>
                  <div class="field field--full">
                    <span class="field__static-label" id="medical-conditions-label">Do you have any of the following medical conditions? (Select all that apply)</span>
                    <div class="registration__checkbox-stack" role="group" aria-labelledby="medical-conditions-label">
                      <label class="registration__check-label"><input type="checkbox" name="medicalConditions" value="Diabetes" /> Diabetes</label>
                      <label class="registration__check-label"><input type="checkbox" name="medicalConditions" value="Hypertension" /> Hypertension</label>
                      <label class="registration__check-label"><input type="checkbox" name="medicalConditions" value="Heart Disease" /> Heart Disease</label>
                      <label class="registration__check-label"><input type="checkbox" name="medicalConditions" value="Asthma" /> Asthma</label>
                      <label class="registration__check-label"><input type="checkbox" name="medicalConditions" value="Other" /> Other</label>
                    </div>
                  </div>
                  <div class="field field--full">
                    <label for="otherCondition">Please specify other medical condition</label>
                    <input id="otherCondition" name="otherCondition" type="text" placeholder="Specify other condition" />
                  </div>
                </div>
              </section>

              <section id="reg-source" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Source Information</h2>
                <div class="form-grid form-grid--reg">
                  <div class="field">
                    <label for="sourceType">How did you hear about us?<span class="field__req" aria-hidden="true">*</span></label>
                    <select id="sourceType" name="sourceType" required>
                      <option value="">Select Source Type</option>
                      <option value="Event">Event / Roadshow</option>
                      <option value="Campaign">Campaign</option>
                      <option value="Referral">Referral from Friend/Family</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Website">Website</option>
                      <option value="Walk-in">Walk-in</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="sourceName">Campaign / Event Name</label>
                    <input id="sourceName" name="sourceName" placeholder="e.g. Pink for Life 2025" />
                  </div>
                </div>
              </section>

              <section id="reg-pdpa" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">PDPA Consent</h2>
                <div class="registration__consent-panel">
                  <div class="registration__consent">
                    <label class="registration__consent-row">
                      <input type="checkbox" name="consent" id="consent" required />
                      <span>By registering, I consent to <a href="#" class="registration__consent-link">Singapore Cancer Society&apos;s Privacy Policy</a> and them contacting me for screening appointments, health-related communications, and programme updates.<span class="field__req" aria-hidden="true">*</span></span>
                    </label>
                  </div>
                  <p class="registration__consent-intro">
                    I wish to receive communications on SCS&apos; activities, programs and services via the following channels, please <strong>tick</strong> the relevant box(es):
                  </p>
                  <div class="registration__channel-rows" role="group" aria-label="Communication preferences">
                    <div class="registration__channel-row">
                      <span>SMS</span>
                      <div class="registration__channel-opts">
                        <label class="registration__radio-label"><input type="radio" name="smsConsent" value="yes" /> Yes</label>
                        <label class="registration__radio-label"><input type="radio" name="smsConsent" value="no" /> No</label>
                      </div>
                    </div>
                    <div class="registration__channel-row">
                      <span>Phone Call</span>
                      <div class="registration__channel-opts">
                        <label class="registration__radio-label"><input type="radio" name="phoneConsent" value="yes" /> Yes</label>
                        <label class="registration__radio-label"><input type="radio" name="phoneConsent" value="no" /> No</label>
                      </div>
                    </div>
                    <div class="registration__channel-row">
                      <span>WhatsApp</span>
                      <div class="registration__channel-opts">
                        <label class="registration__radio-label"><input type="radio" name="whatsappConsent" value="yes" /> Yes</label>
                        <label class="registration__radio-label"><input type="radio" name="whatsappConsent" value="no" /> No</label>
                      </div>
                    </div>
                    <div class="registration__channel-row">
                      <span>Email</span>
                      <div class="registration__channel-opts">
                        <label class="registration__radio-label"><input type="radio" name="emailConsent" value="yes" /> Yes</label>
                        <label class="registration__radio-label"><input type="radio" name="emailConsent" value="no" /> No</label>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              ${renderRegistrationMobileSubmitFooter()}
            </form>
          </div>
        </div>
      </div>
    `;
  }

  function renderRegisterHpv() {
    const navHtml = renderRegistrationNavButtonsHtml();

    return `
        <div class="${registrationBodyClass()}">
        <div class="registration__split">
          <div class="registration__toc" aria-label="Form sections">
            <aside class="registration__sidebar">
              <nav class="registration__sidebar-inner">${navHtml}</nav>
            </aside>
          </div>
          <div class="registration__form-col">
            <form id="registration-form" class="registration__form" novalidate>
              <section id="reg-hpv-client" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Client&apos;s Information</h2>
                <div class="form-grid form-grid--reg">
                  <div class="field field--full">
                    <label for="hpvFullName">Full Name (as per NRIC)<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="hpvFullName" name="hpvFullName" type="text" required autocomplete="name" placeholder="Enter full name as in NRIC" />
                  </div>
                  <div class="field">
                    <label for="hpvNric">NRIC / FIN Number<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="hpvNric" name="hpvNric" required placeholder="Enter NRIC / FIN" />
                  </div>
                  <div class="field">
                    <label for="hpvDob">Date of Birth<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="hpvDob" name="hpvDob" type="text" required placeholder="DD-MM-YYYY" />
                  </div>
                  <div class="field">
                    <label for="hpvGender">Gender<span class="field__req" aria-hidden="true">*</span></label>
                    <select id="hpvGender" name="hpvGender" required>
                      <option value="">Select</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="hpvResidential">Residential Status</label>
                    <select id="hpvResidential" name="hpvResidential">
                      <option value="">Select</option>
                      <option value="Citizen">Singapore Citizen</option>
                      <option value="PR">Permanent Resident</option>
                      <option value="Foreigner">Foreigner</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="hpvRace">Race</label>
                    <select id="hpvRace" name="hpvRace">
                      <option value="">Select</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Malay">Malay</option>
                      <option value="Indian">Indian</option>
                      <option value="Eurasian">Eurasian</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div class="field field--full">
                    <label for="hpvChasCardType">CHAS card type</label>
                    <select id="hpvChasCardType" name="hpvChasCardType">
                      <option value="">Select</option>
                      <option value="CHAS Orange">CHAS Orange</option>
                      <option value="CHAS Blue">CHAS Blue</option>
                      <option value="CHAS Green">CHAS Green</option>
                      <option value="Merdeka Generation">Merdeka Generation</option>
                      <option value="Pioneer Generation">Pioneer Generation</option>
                      <option value="None">None / Not applicable</option>
                    </select>
                  </div>
                  <div class="field field--full">
                    <label for="hpvEmail">Email Address</label>
                    <input id="hpvEmail" name="hpvEmail" type="email" placeholder="Enter your email" />
                  </div>
                  <div class="field">
                    <label for="hpvHomePhone">Home Phone Number</label>
                    <div class="field__inline">
                      <input type="text" class="field__prefix" value="+65" disabled aria-label="Country code" />
                      <input id="hpvHomePhone" name="hpvHomePhone" type="tel" placeholder="E.g. 6123 4567" />
                    </div>
                  </div>
                  <div class="field">
                    <label for="hpvOfficePhone">Office Phone Number</label>
                    <div class="field__inline">
                      <input type="text" class="field__prefix" value="+65" disabled aria-label="Country code" />
                      <input id="hpvOfficePhone" name="hpvOfficePhone" type="tel" placeholder="E.g. 6123 4567" />
                    </div>
                  </div>
                  <div class="field field--full">
                    <label for="hpvMobile">Mobile Number<span class="field__req" aria-hidden="true">*</span></label>
                    <div class="field__inline">
                      <input type="text" class="field__prefix" value="+65" disabled aria-label="Country code" />
                      <input id="hpvMobile" name="hpvMobile" type="tel" required placeholder="E.g. 8123 4567" />
                    </div>
                  </div>
                </div>
              </section>

              <section id="reg-hpv-address" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Client&apos;s Address</h2>
                <div class="form-grid form-grid--reg">
                  <div class="field">
                    <label for="hpvPostal">Postal Code<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="hpvPostal" name="hpvPostal" required placeholder="6-digit postal code" />
                  </div>
                  <div class="field">
                    <label for="hpvBlock">Block Number</label>
                    <input id="hpvBlock" name="hpvBlock" placeholder="e.g. 123" />
                  </div>
                  <div class="field field--full">
                    <label for="hpvStreet">Street Name</label>
                    <input id="hpvStreet" name="hpvStreet" placeholder="e.g. Orchard Road" />
                  </div>
                  <div class="field">
                    <label for="hpvUnit">Unit Number</label>
                    <input id="hpvUnit" name="hpvUnit" placeholder="e.g. #12-34" />
                  </div>
                  <div class="field">
                    <label for="hpvBuilding">Building Name</label>
                    <input id="hpvBuilding" name="hpvBuilding" placeholder="e.g. Plaza Singapura" />
                  </div>
                </div>
              </section>

              <section id="reg-hpv-venue" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Venue of Screening</h2>
                <div class="form-grid form-grid--reg">
                  <div class="field field--full">
                    <label for="hpvVenue">Venue of Screening<span class="field__req" aria-hidden="true">*</span></label>
                    <select id="hpvVenue" name="hpvVenue" required>
                      <option value="">Select venue</option>
                      <option value="Community Centre">Community Centre</option>
                      <option value="Mobile Screening Unit">Mobile Screening Unit</option>
                      <option value="Clinic Partner">Clinic Partner</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="hpvPreferredDate">Preferred Date<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="hpvPreferredDate" name="hpvPreferredDate" type="text" required placeholder="DD-MM-YYYY" />
                  </div>
                  <div class="field">
                    <label for="hpvPreferredTime">Preferred Time Slot</label>
                    <select id="hpvPreferredTime" name="hpvPreferredTime">
                      <option value="">Select time slot</option>
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                      <option value="evening">Evening</option>
                    </select>
                  </div>
                </div>
              </section>

              <section id="reg-hpv-source" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Source Information</h2>
                <div class="form-grid form-grid--reg">
                  <div class="field">
                    <label for="hpvSourceType">How did you hear about us?</label>
                    <select id="hpvSourceType" name="hpvSourceType">
                      <option value="">Select Source Type</option>
                      <option value="Event">Event / Roadshow</option>
                      <option value="Campaign">Campaign</option>
                      <option value="Referral">Referral</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Website">Website</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="hpvCampaignName">Campaign / Event Name</label>
                    <input id="hpvCampaignName" name="hpvCampaignName" placeholder="e.g. Screening Awareness 2026" />
                  </div>
                </div>
              </section>

              <section id="reg-hpv-pdpa" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">PDPA Consent</h2>
                <div class="registration__consent-panel">
                  <div class="registration__consent">
                    <label class="registration__consent-row">
                      <input type="checkbox" name="hpvConsentPrivacy" id="hpvConsentPrivacy" required />
                      <span>I consent to the <a href="#" class="registration__consent-link">Privacy Policy</a> and to being contacted for screening appointments, results, and programme updates.<span class="field__req" aria-hidden="true">*</span></span>
                    </label>
                  </div>
                  <fieldset class="registration__fieldset field field--full">
                    <legend class="registration__fieldset-legend">Follow-up after screening results</legend>
                    <div class="registration__radio-group" role="radiogroup">
                      <label class="registration__radio-label"><input type="radio" name="hpvFollowUp" value="yes" /> Yes</label>
                      <label class="registration__radio-label"><input type="radio" name="hpvFollowUp" value="no" /> No</label>
                    </div>
                  </fieldset>
                  <fieldset class="registration__fieldset field field--full">
                    <legend class="registration__fieldset-legend">Share data with programme partners</legend>
                    <div class="registration__radio-group" role="radiogroup">
                      <label class="registration__radio-label"><input type="radio" name="hpvDataShare" value="yes" /> Yes</label>
                      <label class="registration__radio-label"><input type="radio" name="hpvDataShare" value="no" /> No</label>
                    </div>
                  </fieldset>
                  <div class="registration__consent">
                    <label class="registration__consent-row">
                      <input type="checkbox" name="hpvConsentAccurate" id="hpvConsentAccurate" required />
                      <span>I declare that the information provided is accurate and complete to the best of my knowledge.<span class="field__req" aria-hidden="true">*</span></span>
                    </label>
                  </div>
                  <p class="registration__consent-intro">
                    Communication preferences — please indicate Yes or No for each channel:
                  </p>
                  <div class="registration__channel-rows" role="group" aria-label="Communication preferences">
                    <div class="registration__channel-row">
                      <span>SMS</span>
                      <div class="registration__channel-opts">
                        <label class="registration__radio-label"><input type="radio" name="hpvSmsConsent" value="yes" /> Yes</label>
                        <label class="registration__radio-label"><input type="radio" name="hpvSmsConsent" value="no" /> No</label>
                      </div>
                    </div>
                    <div class="registration__channel-row">
                      <span>Phone Call</span>
                      <div class="registration__channel-opts">
                        <label class="registration__radio-label"><input type="radio" name="hpvPhoneConsent" value="yes" /> Yes</label>
                        <label class="registration__radio-label"><input type="radio" name="hpvPhoneConsent" value="no" /> No</label>
                      </div>
                    </div>
                    <div class="registration__channel-row">
                      <span>WhatsApp</span>
                      <div class="registration__channel-opts">
                        <label class="registration__radio-label"><input type="radio" name="hpvWhatsappConsent" value="yes" /> Yes</label>
                        <label class="registration__radio-label"><input type="radio" name="hpvWhatsappConsent" value="no" /> No</label>
                      </div>
                    </div>
                    <div class="registration__channel-row">
                      <span>Email</span>
                      <div class="registration__channel-opts">
                        <label class="registration__radio-label"><input type="radio" name="hpvEmailConsent" value="yes" /> Yes</label>
                        <label class="registration__radio-label"><input type="radio" name="hpvEmailConsent" value="no" /> No</label>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              ${renderRegistrationMobileSubmitFooter()}
            </form>
          </div>
        </div>
      </div>
    `;
  }

  function renderRegisterFit() {
    const navHtml = renderRegistrationNavButtonsHtml();

    return `
        <div class="${registrationBodyClass()}">
        <div class="registration__split">
          <div class="registration__toc" aria-label="Form sections">
            <aside class="registration__sidebar">
              <nav class="registration__sidebar-inner">${navHtml}</nav>
            </aside>
          </div>
          <div class="registration__form-col">
            <form id="registration-form" class="registration__form" novalidate>
              <section id="reg-fit-personal" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Distribution Details &amp; Personal Particulars</h2>
                <div class="registration__eligibility" role="note">
                  <p class="registration__eligibility-title">Collection Eligibility</p>
                  <ul>
                    <li>50 years old &amp; above</li>
                    <li>Singaporean or PR</li>
                    <li>Produces IC</li>
                  </ul>
                </div>
                <div class="form-grid form-grid--reg">
                  <div class="field field--full">
                    <label for="fitVenue">Venue</label>
                    <input id="fitVenue" name="fitVenue" type="text" placeholder="Enter venue name" />
                  </div>
                  <div class="field field--full">
                    <label for="fitDistributionDate">Date</label>
                    <input id="fitDistributionDate" name="fitDistributionDate" type="text" placeholder="DD-MM-YYYY" />
                  </div>
                  <div class="field field--full">
                    <label for="fitFullName">Full Name (as per NRIC)<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="fitFullName" name="fitFullName" type="text" required autocomplete="name" placeholder="Enter full name as in NRIC" />
                  </div>
                  <div class="field">
                    <label for="fitNricRest">NRIC No.<span class="field__req" aria-hidden="true">*</span></label>
                    <div class="field__inline">
                      <input type="text" class="field__prefix field__prefix--nric" value="S" disabled aria-label="NRIC prefix" />
                      <input id="fitNricRest" name="fitNricRest" required placeholder="1234567D" autocomplete="off" />
                    </div>
                  </div>
                  <fieldset class="registration__fieldset field field--full">
                    <legend class="registration__fieldset-legend">Gender<span class="field__req" aria-hidden="true">*</span></legend>
                    <div class="registration__radio-group" role="radiogroup">
                      <label class="registration__radio-label"><input type="radio" name="fitGender" value="Male" required /> Male</label>
                      <label class="registration__radio-label"><input type="radio" name="fitGender" value="Female" /> Female</label>
                    </div>
                  </fieldset>
                  <div class="field">
                    <label for="fitDob">Date of Birth<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="fitDob" name="fitDob" type="text" required placeholder="DD-MM-YYYY" />
                  </div>
                  <div class="field">
                    <label for="fitResidential">Residential Status</label>
                    <select id="fitResidential" name="fitResidential">
                      <option value="">Select</option>
                      <option value="Citizen">Singapore Citizen</option>
                      <option value="PR">Permanent Resident</option>
                      <option value="Foreigner">Foreigner</option>
                    </select>
                  </div>
                  <div class="field field--full">
                    <label for="fitChasCardType">CHAS card type</label>
                    <select id="fitChasCardType" name="fitChasCardType">
                      <option value="">Select</option>
                      <option value="CHAS Orange">CHAS Orange</option>
                      <option value="CHAS Blue">CHAS Blue</option>
                      <option value="CHAS Green">CHAS Green</option>
                      <option value="Merdeka Generation">Merdeka Generation</option>
                      <option value="Pioneer Generation">Pioneer Generation</option>
                      <option value="None">None / Not applicable</option>
                    </select>
                  </div>
                  <fieldset class="registration__fieldset field field--full">
                    <legend class="registration__fieldset-legend">Race</legend>
                    <div class="registration__radio-group" role="radiogroup">
                      <label class="registration__radio-label"><input type="radio" name="fitRace" value="Chinese" /> Chinese</label>
                      <label class="registration__radio-label"><input type="radio" name="fitRace" value="Malay" /> Malay</label>
                      <label class="registration__radio-label"><input type="radio" name="fitRace" value="Indian" /> Indian</label>
                      <label class="registration__radio-label"><input type="radio" name="fitRace" value="Others" /> Others</label>
                    </div>
                  </fieldset>
                  <div class="field field--full">
                    <label for="fitAddress">Address</label>
                    <input id="fitAddress" name="fitAddress" type="text" placeholder="Block / Street name" />
                  </div>
                  <div class="field">
                    <label for="fitUnit">Unit No.</label>
                    <div class="field__inline">
                      <input type="text" class="field__prefix field__prefix--hash" value="#" disabled aria-hidden="true" />
                      <input id="fitUnit" name="fitUnit" placeholder="12-34" />
                    </div>
                  </div>
                  <div class="field">
                    <label for="fitPostal">Postal Code<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="fitPostal" name="fitPostal" required placeholder="6-digit postal code" />
                  </div>
                  <div class="field field--full">
                    <label for="fitEmail">Email Address</label>
                    <input id="fitEmail" name="fitEmail" type="email" placeholder="Enter your email" />
                  </div>
                  <div class="field field--full">
                    <label for="fitContact">Contact No.<span class="field__req" aria-hidden="true">*</span></label>
                    <div class="field__inline">
                      <input type="text" class="field__prefix" value="+65" disabled aria-label="Country code" />
                      <input id="fitContact" name="fitContact" type="tel" required placeholder="E.g. 8123 4567" />
                    </div>
                  </div>
                </div>
              </section>

              <section id="reg-fit-clinical" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Clinical History, Declaration and Consent</h2>
                <p class="registration__hint">
                  Singapore Cancer Society (SCS) may contact you regarding your screening, test kit collection, results, and follow-up in line with applicable data protection requirements.
                </p>
                <div class="field field--full">
                  <span class="field__static-label" id="fit-comms-pref-label">Communication preferences</span>
                  <div class="registration__checkbox-stack" role="group" aria-labelledby="fit-comms-pref-label">
                    <label class="registration__check-label"><input type="checkbox" name="fitCommSms" value="1" /> Text Message</label>
                    <label class="registration__check-label"><input type="checkbox" name="fitCommPhone" value="1" /> Phone Call</label>
                  </div>
                </div>
                <div class="registration__legal-block">
                  <p>
                    Your personal data will be processed for programme administration, screening coordination, and related communications. By submitting this form you agree to the terms of participation and data use described in Singapore Cancer Society&apos;s policies.
                  </p>
                </div>
                <div class="registration__consent">
                  <label class="registration__consent-row">
                    <input type="checkbox" name="fitConsentTerms" id="fitConsentTerms" required />
                    <span>I have read and agree to the Terms &amp; Conditions. 本人已阅读并同意条款与条件。<span class="field__req" aria-hidden="true">*</span></span>
                  </label>
                </div>
                <div class="registration__subsection">
                  <h3 class="registration__subsection-label">FIT kit details (staff to complete)</h3>
                  <div class="form-grid form-grid--reg">
                    <div class="field">
                      <label for="fitTube1">FIT Tube Code 1</label>
                      <input id="fitTube1" name="fitTube1" placeholder="Scan or enter code" />
                    </div>
                    <div class="field">
                      <label for="fitTube2">FIT Tube Code 2</label>
                      <input id="fitTube2" name="fitTube2" placeholder="Scan or enter code" />
                    </div>
                    <div class="field field--full">
                      <label for="fitSerial">Form Serial Number</label>
                      <input id="fitSerial" name="fitSerial" placeholder="Enter serial number" />
                    </div>
                  </div>
                </div>
              </section>

              <section id="reg-fit-source" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Source Information</h2>
                <div class="form-grid form-grid--reg">
                  <div class="field">
                    <label for="fitSourceType">How did you hear about us?</label>
                    <select id="fitSourceType" name="fitSourceType">
                      <option value="">Select Source Type</option>
                      <option value="Event">Event / Roadshow</option>
                      <option value="Campaign">Campaign</option>
                      <option value="Referral">Referral</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Website">Website</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="fitCampaignName">Campaign / Event Name</label>
                    <input id="fitCampaignName" name="fitCampaignName" placeholder="e.g. Colorectal Cancer Awareness 2026" />
                  </div>
                </div>
              </section>
              ${renderRegistrationMobileSubmitFooter()}
            </form>
          </div>
        </div>
      </div>
    `;
  }

  function renderModal() {
    if (!state.filterModal) return "";
    const f = state.listFilters;
    const chip = (group, value, label) => {
      const key = group === "stage" ? "stages" : group === "gender" ? "genders" : "risks";
      const sel = f[key].includes(value);
      return `<button type="button" class="ui-chip${sel ? " is-selected" : ""}" data-lf-chip data-lf-group="${group}" data-value="${escapeAttr(value)}" aria-pressed="${sel}">${escapeAttr(label)}</button>`;
    };
    const amin = Number.isFinite(f.ageMin) ? f.ageMin : 18;
    const amax = Number.isFinite(f.ageMax) ? f.ageMax : 100;
    return `
      <div class="ui-dialog-overlay" id="filter-modal" role="presentation">
        <div class="ui-dialog" role="dialog" aria-modal="true" aria-labelledby="filter-title">
          <div class="ui-dialog__close">
            <button type="button" class="ui-btn ui-btn--ghost ui-btn--icon" data-close-modal aria-label="Close">${icons.x}</button>
          </div>
          <div class="ui-dialog__header">
            <h2 class="ui-dialog__title" id="filter-title">Filters</h2>
          </div>
          <form id="list-filter-form" class="ui-dialog__body">
            <div class="ui-filter-section">
              <p class="ui-filter-section__label">Pipeline stage</p>
              <div class="ui-chip-group" role="group" aria-label="Pipeline stage">
                ${chip("stage", "qualified", "Qualified")}
                ${chip("stage", "booked", "Booked")}
                ${chip("stage", "screened", "Screened")}
              </div>
            </div>
            <div class="ui-filter-section">
              <p class="ui-filter-section__label">Gender</p>
              <div class="ui-chip-group" role="group" aria-label="Gender">
                ${chip("gender", "female", "Female")}
                ${chip("gender", "male", "Male")}
              </div>
            </div>
            <div class="ui-filter-section">
              <p class="ui-filter-section__label">Age range</p>
              <div class="form-grid form-grid--reg form-grid--filter-age">
                <div class="field">
                  <label for="lf-age-min">From</label>
                  <input
                    type="number"
                    id="lf-age-min"
                    name="lf-age-min"
                    min="18"
                    max="100"
                    step="1"
                    inputmode="numeric"
                    value="${amin}"
                  />
                </div>
                <div class="field">
                  <label for="lf-age-max">To</label>
                  <input
                    type="number"
                    id="lf-age-max"
                    name="lf-age-max"
                    min="18"
                    max="100"
                    step="1"
                    inputmode="numeric"
                    value="${amax}"
                  />
                </div>
              </div>
            </div>
            <div class="ui-filter-section">
              <p class="ui-filter-section__label">Risk</p>
              <div class="ui-chip-group" role="group" aria-label="Risk">
                ${chip("risk", "low", "Low")}
                ${chip("risk", "medium", "Medium")}
                ${chip("risk", "high", "High")}
              </div>
            </div>
          </form>
          <div class="ui-dialog__footer">
            <button type="button" class="ui-btn ui-btn--ghost ui-btn--sm" id="list-filter-clear">Clear all</button>
            <div class="ui-dialog__footer-actions">
              <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-close-modal>Cancel</button>
              <button type="button" class="ui-btn ui-btn--default ui-btn--sm" id="list-filter-apply">Apply</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /** file:// and some browsers can leave location.hash empty on first paint while href still has #/route */
  function getRouteHash() {
    const h = location.hash;
    if (h && h !== "#") return h;
    const u = window.location.href;
    const i = u.indexOf("#");
    return i >= 0 ? u.slice(i) : "";
  }

  function parseRoute() {
    const raw = getRouteHash().replace(/^#\/?/, "");
    const parts = raw
      .split("/")
      .map((s) => s.replace(/^\ufeff/, "").trim())
      .filter(Boolean);
    const head = (parts[0] || "").toLowerCase();
    if (parts.length === 0) {
      state.route = "list";
      state.routeId = null;
      state.view = "list";
    } else if (head === "list") {
      state.route = "list";
      state.routeId = null;
      state.view = "list";
    } else if (head === "kanban") {
      state.route = "list";
      state.view = "kanban";
      state.routeId = null;
    } else if (head === "prospect") {
      state.route = "detail";
      state.routeId = parts[1] ? decodeURIComponent(parts[1]) : DETAIL_DEFAULT.rowKey;
      if (parts[2]) {
        let tab = decodeURIComponent(parts[2]).trim().toLowerCase();
        if (tab === "document") tab = "documents";
        state.detailTab = DETAIL_TAB_IDS.includes(tab) ? tab : "overview";
      } else {
        state.detailTab = "overview";
      }
    } else if (head === "register") {
      state.route = "register";
      state.routeId = null;
      const sub = (parts[1] || "").toLowerCase();
      if (sub === "hpv") state.registerProgram = "hpv";
      else if (sub === "fit") state.registerProgram = "fit";
      else state.registerProgram = "mammobus";
    } else {
      state.route = "list";
      state.routeId = null;
    }
    if (state.route !== "register") {
      state.regNavSection = null;
      state.registrationMobileNavOpen = false;
    } else {
      const navIds = regNavItemsForProgram().map(([id]) => id);
      if (!state.regNavSection || !navIds.includes(state.regNavSection)) {
        state.regNavSection = navIds[0];
      }
    }

    state.registerSelfService = false;
    if (state.route === "register") {
      try {
        const u = new URL(window.location.href);
        const tok = u.searchParams.get(SELF_REG_TOKEN_PARAM);
        state.registerSelfService = Boolean(tok && String(tok).trim());
      } catch (_) {
        state.registerSelfService = false;
      }
    }

    if (state.route === "detail") {
      if (lastDetailTabForForm !== state.detailTab) {
        state.detailFormEdit = null;
        state.detailFormDraft = null;
        if (state.detailTab === "details") state.detailNavSection = "detail-basic";
        else if (state.detailTab === "medical-history") state.detailNavSection = "mh-family";
        else if (state.detailTab === "other-details") state.detailNavSection = "od-medical";
      }
      lastDetailTabForForm = state.detailTab;
    }
  }

  let registrationScrollCleanup = null;

  function teardownRegistrationScrollSpy() {
    if (typeof registrationScrollCleanup === "function") {
      registrationScrollCleanup();
      registrationScrollCleanup = null;
    }
  }

  function setRegNavActive(sectionId) {
    state.regNavSection = sectionId;
    document.querySelectorAll("[data-reg-nav]").forEach((btn) => {
      const bid = btn.getAttribute("data-reg-nav");
      btn.classList.toggle("is-active", bid === sectionId);
    });
  }

  function syncRegistrationMobileNavDom() {
    const backdrop = document.getElementById("registration-nav-drawer-backdrop");
    const toggle = document.getElementById("registration-nav-toggle");
    if (!backdrop) return;
    const open = state.registrationMobileNavOpen;
    backdrop.classList.toggle("is-open", open);
    backdrop.setAttribute("aria-hidden", open ? "false" : "true");
    if (toggle) toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("registration-nav-drawer-open", Boolean(open && state.registerSelfService));
  }

  function setupRegistrationScrollSpy() {
    teardownRegistrationScrollSpy();
    const root = document.getElementById("registration-scroll-root");
    if (!root) return;

    const progressFill = document.getElementById("registration-scroll-progress-fill");

    const updateScrollProgress = () => {
      if (!progressFill) return;
      const sh = root.scrollHeight;
      const ch = root.clientHeight;
      const maxScroll = Math.max(0, sh - ch);
      const pct = maxScroll <= 0 ? 100 : Math.min(100, (root.scrollTop / maxScroll) * 100);
      progressFill.style.width = `${pct}%`;
    };

    const onScroll = () => {
      if (!window.__regNavProgrammaticScroll) {
        const anchorY = root.getBoundingClientRect().top + root.clientHeight * 0.22;
        const navItems = regNavItemsForProgram();
        let current = navItems[0][0];
        for (const [id] of navItems) {
          const el = document.getElementById(id);
          if (!el) continue;
          const r = el.getBoundingClientRect();
          if (r.top <= anchorY) current = id;
        }
        if (current !== state.regNavSection) setRegNavActive(current);
      }
      updateScrollProgress();
    };

    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScrollProgress, { passive: true });
    onScroll();
    updateScrollProgress();
    registrationScrollCleanup = () => {
      root.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }

  function markSingpassFieldGroup(el) {
    const wrap = el?.closest(".field, .registration__fieldset");
    if (wrap) wrap.classList.add("field--singpass-locked");
  }

  function lockSingpassInput(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = value == null ? "" : String(value);
    el.disabled = true;
    markSingpassFieldGroup(el);
  }

  function lockSingpassSelect(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = String(value);
    el.disabled = true;
    markSingpassFieldGroup(el);
  }

  function lockSingpassRadioGroup(name, value) {
    document.querySelectorAll(`input[name="${name}"]`).forEach((inp) => {
      inp.checked = inp.value === value;
      inp.disabled = true;
      inp.closest(".registration__radio-label")?.classList.add("registration__radio-label--singpass-locked");
    });
    const one = document.querySelector(`input[name="${name}"]`);
    if (one) markSingpassFieldGroup(one);
  }

  function applySingpassDemoAndLocks() {
    if (!state.registerSingpassLocked || !state.registerSelfService) return;
    const d = SINGPASS_DEMO;
    const p = state.registerProgram;
    if (p === "mammobus") {
      lockSingpassInput("fullName", d.fullName);
      lockSingpassInput("nric", d.nricFull);
      lockSingpassInput("dob", d.dob);
      lockSingpassSelect("gender", d.gender);
      lockSingpassSelect("residential", d.residential);
      lockSingpassInput("email", d.email);
      lockSingpassInput("phone", d.phone);
      lockSingpassInput("postal", d.postal);
      lockSingpassInput("block", d.block);
      lockSingpassInput("street", d.street);
      lockSingpassInput("unit", d.unit);
      lockSingpassInput("building", d.building);
      lockSingpassSelect("chasCardType", d.chasCardType);
    } else if (p === "hpv") {
      lockSingpassInput("hpvFullName", d.fullName);
      lockSingpassInput("hpvNric", d.nricFull);
      lockSingpassInput("hpvDob", d.dob);
      lockSingpassSelect("hpvGender", d.gender);
      lockSingpassSelect("hpvResidential", d.residential);
      lockSingpassInput("hpvEmail", d.email);
      lockSingpassInput("hpvMobile", d.phone);
      lockSingpassInput("hpvPostal", d.postal);
      lockSingpassInput("hpvBlock", d.block);
      lockSingpassInput("hpvStreet", d.street);
      lockSingpassInput("hpvUnit", d.unit);
      lockSingpassInput("hpvBuilding", d.building);
      lockSingpassSelect("hpvChasCardType", d.chasCardType);
    } else if (p === "fit") {
      lockSingpassInput("fitFullName", d.fullName);
      lockSingpassInput("fitNricRest", d.nricFitRest);
      lockSingpassInput("fitDob", d.dob);
      lockSingpassRadioGroup("fitGender", d.gender);
      lockSingpassSelect("fitResidential", d.residential);
      lockSingpassSelect("fitChasCardType", d.chasCardType);
      lockSingpassInput("fitAddress", d.fitAddress);
      lockSingpassInput("fitUnit", "12-345");
      lockSingpassInput("fitPostal", d.postal);
      lockSingpassInput("fitEmail", d.email);
      lockSingpassInput("fitContact", d.phone);
    }
  }

  function renderApp() {
    parseRoute();
    const isRegisterSelfService = state.route === "register" && state.registerSelfService;
    if (state.route === "register" && !state.registerSelfService) {
      state.registerSelfServiceEntry = "form";
    }
    if (isRegisterSelfService && !lastRenderWasRegisterSelfService) {
      state.registerSelfServiceEntry = "landing";
      state.registerSingpassLocked = false;
    }
    lastRenderWasRegisterSelfService = isRegisterSelfService;

    syncDetailFromRoute();
    teardownRegistrationScrollSpy();
    if (state.route !== "list") state.programMenuOpen = false;
    if (state.route !== "list") state.addProspectMenuOpen = false;
    const app = document.getElementById("app");
    let main = "";
    if (state.route === "detail") main = renderDetailPage();
    else if (state.route !== "register") main = renderListPage();

    if (state.route === "register" && state.registerSelfService && state.registerSelfServiceEntry === "landing") {
      app.innerHTML = `${renderRegisterSelfServiceLandingPage()}${renderModal()}`;
      bindEvents();
      return;
    }

    if (state.route === "register") {
      let stickyInner;
      let mainInner;
      switch (state.registerProgram) {
        case "hpv":
          stickyInner = renderHpvChrome();
          mainInner = renderRegisterHpv();
          break;
        case "fit":
          stickyInner = renderFitChrome();
          mainInner = renderRegisterFit();
          break;
        default:
          stickyInner = renderMammobusChrome();
          mainInner = renderRegisterMammobus();
      }
      app.innerHTML = `
      <div class="app-shell app-shell--registration-flow${state.registerSelfService ? " app-shell--registration-self-service" : ""}">
        <div class="registration-sticky-chrome">
          ${renderHeader({ selfService: state.registerSelfService })}
          ${stickyInner}
          ${
            state.registerSelfService
              ? `<div class="registration-scroll-progress" id="registration-scroll-progress" aria-hidden="true"><span class="registration-scroll-progress__fill" id="registration-scroll-progress-fill"></span></div>`
              : ""
          }
        </div>
        <div class="app-content app-content--registration-flow${state.registerSelfService ? " app-content--registration-self-service" : ""}">
          <main class="app-main app-main--registration">
            <div class="registration-scroll-top-gap" aria-hidden="true"></div>
            <div id="registration-scroll-root" class="app-main--registration-scroll">${mainInner}</div>
          </main>
          <footer class="app-footer">Copyright © 2026 WERKDONE PTE LTD.</footer>
        </div>
      </div>
      ${state.registerSelfService ? renderRegistrationNavDrawer() : ""}
      ${renderModal()}
    `;
      bindEvents();
      setupRegistrationScrollSpy();
      requestAnimationFrame(() => applySingpassDemoAndLocks());
      return;
    }

    if (state.route === "detail") {
      const detailMainClass =
        DETAIL_FORM_TAB_IDS.includes(state.detailTab) ? "app-main app-main--detail-page detail-page--form-toolbar" : "app-main app-main--detail-page";
      app.innerHTML = `
      <div class="app-shell app-shell--detail-flow">
        <div id="detail-flow-scroll-root" class="detail-flow-scroll-root">
          ${renderHeader()}
          <div class="app-content app-content--detail-flow">
            <main class="${detailMainClass}">${main}</main>
            <footer class="app-footer">Copyright © 2026 WERKDONE PTE LTD.</footer>
          </div>
        </div>
      </div>
      ${renderModal()}
    `;
      bindEvents();
      return;
    }

    app.innerHTML = `
      <div class="app-shell">
        ${renderHeader()}
        <div class="app-content">
          <main class="app-main">${main}</main>
          <footer class="app-footer">Copyright © 2026 WERKDONE PTE LTD.</footer>
        </div>
      </div>
      ${renderModal()}
    `;
    bindEvents();
  }

  function randomSelfRegToken() {
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      const buf = new Uint8Array(16);
      crypto.getRandomValues(buf);
      return Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("");
    }
    return `demo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }

  /** Patient-facing self-service URL (same portal route + token for your demo). */
  function buildSelfRegistrationUrl(token) {
    const program = state.registerProgram || "mammobus";
    const u = new URL(location.href);
    u.searchParams.set(SELF_REG_TOKEN_PARAM, token);
    u.hash = `#/register/${encodeURIComponent(program)}`;
    return u.toString();
  }

  function showToast(msg) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2800);
  }

  function showSelfRegistrationCopiedToast(selfRegUrl) {
    document.querySelectorAll(".toast--success").forEach((n) => n.remove());
    const wrap = document.createElement("div");
    wrap.className = "toast toast--success";
    wrap.setAttribute("role", "status");
    wrap.setAttribute("aria-live", "polite");

    const icon = document.createElement("span");
    icon.className = "toast__icon";
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML =
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.25"/><path d="M8.5 12.5l2.5 2.5 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    const body = document.createElement("div");
    body.className = "toast__body";
    const msg = document.createElement("span");
    msg.className = "toast__msg";
    msg.textContent = "Self Registration link copied.";
    const view = document.createElement("a");
    view.className = "toast__action";
    view.href = selfRegUrl;
    view.target = "_blank";
    view.rel = "noopener noreferrer";
    view.textContent = "View";
    body.appendChild(msg);
    body.appendChild(view);

    const close = document.createElement("button");
    close.type = "button";
    close.className = "toast__dismiss";
    close.setAttribute("aria-label", "Dismiss");
    close.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>';

    wrap.appendChild(icon);
    wrap.appendChild(body);
    wrap.appendChild(close);
    document.body.appendChild(wrap);

    const remove = () => {
      wrap.remove();
    };
    const t = window.setTimeout(remove, 8000);
    close.addEventListener("click", () => {
      window.clearTimeout(t);
      remove();
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function handleProspectDocsFilesAdded(fileNames) {
    if (!fileNames.length) return;
    showToast(
      `${fileNames.length} file(s) added: ${fileNames.join(", ")} (prototype — not saved to server)`
    );
    const tb = document.getElementById("prospect-docs-tbody");
    if (!tb) return;
    const uploadedOn = new Date().toLocaleDateString("en-SG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const dl = icons.download;
    const tr = icons.trash;
    for (const raw of fileNames) {
      const name = escapeHtml(raw);
      tb.insertAdjacentHTML(
        "afterbegin",
        `<tr>
        <td><button type="button" class="prospect-docs__name" data-detail-toast="View document (prototype).">${name}</button></td>
        <td>Prospects</td>
        <td>${escapeHtml(uploadedOn)}</td>
        <td>You</td>
        <td>
          <div class="prospect-docs__actions">
            <button type="button" class="btn btn--icon" data-detail-toast="Download (prototype)." aria-label="Download">${dl}</button>
            <button type="button" class="btn btn--icon" data-detail-toast="Delete (prototype)." aria-label="Delete">${tr}</button>
          </div>
        </td>
      </tr>`
      );
    }
    const count = tb.querySelectorAll("tr").length;
    const el = document.getElementById("prospect-docs-count");
    if (el) el.textContent = `Showing 1 to ${Math.min(10, count)} out of ${count} records`;
    const search = document.getElementById("prospect-docs-search");
    filterProspectDocsTable(search?.value || "");
  }

  function filterProspectDocsTable(query) {
    const tb = document.getElementById("prospect-docs-tbody");
    if (!tb) return;
    const needle = String(query || "")
      .trim()
      .toLowerCase();
    tb.querySelectorAll("tr").forEach((tr) => {
      if (!needle) {
        tr.style.display = "";
        return;
      }
      tr.style.display = tr.textContent.toLowerCase().includes(needle) ? "" : "none";
    });
  }

  /** Clamp list-filter age fields to 18–100 and min ≤ max; writes back to inputs. */
  function normalizeAgeFilterValues(minEl, maxEl) {
    let min = minEl ? parseInt(minEl.value, 10) : NaN;
    let max = maxEl ? parseInt(maxEl.value, 10) : NaN;
    if (!Number.isFinite(min)) min = 18;
    if (!Number.isFinite(max)) max = 100;
    min = Math.min(100, Math.max(18, min));
    max = Math.min(100, Math.max(18, max));
    if (min > max) {
      const lo = Math.min(min, max);
      const hi = Math.max(min, max);
      min = lo;
      max = hi;
    }
    if (minEl) minEl.value = String(min);
    if (maxEl) maxEl.value = String(max);
    return { ageMin: min, ageMax: max };
  }

  function bindEvents() {
    document.getElementById("reg-landing-singpass")?.addEventListener("click", () => {
      state.registerSelfServiceEntry = "form";
      state.registerSingpassLocked = true;
      renderApp();
      showToast("Myinfo retrieved (prototype — demo data applied).");
    });
    document.getElementById("reg-landing-manual")?.addEventListener("click", () => {
      state.registerSelfServiceEntry = "form";
      state.registerSingpassLocked = false;
      renderApp();
    });

    document.querySelector("[data-program-menu-toggle]")?.addEventListener("click", (e) => {
      e.stopPropagation();
      state.programMenuOpen = !state.programMenuOpen;
      renderApp();
    });

    document.querySelectorAll("[data-program-option]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        state.program = btn.getAttribute("data-program-option");
        state.programMenuOpen = false;
        renderApp();
      });
    });

    document.querySelectorAll("[data-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.view = btn.getAttribute("data-view");
        const h = state.view === "kanban" ? "#/kanban" : "#/list";
        if (location.hash !== h) location.hash = h;
        else renderApp();
      });
    });

    const search = document.getElementById("prospect-search");
    if (search) {
      search.addEventListener("input", () => {
        state.search = search.value;
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
          renderApp();
          const again = document.getElementById("prospect-search");
          if (again) {
            again.focus();
            again.setSelectionRange(again.value.length, again.value.length);
          }
        }, 200);
      });
    }

    document.getElementById("btn-list-filters")?.addEventListener("click", () => {
      state.filterModal = true;
      renderApp();
    });

    function readListFiltersFromForm() {
      const chips = (group) =>
        [...document.querySelectorAll(`#list-filter-form [data-lf-group="${group}"].is-selected`)].map((el) =>
          el.getAttribute("data-value")
        );
      const minEl = document.getElementById("lf-age-min");
      const maxEl = document.getElementById("lf-age-max");
      const { ageMin, ageMax } = normalizeAgeFilterValues(minEl, maxEl);
      state.listFilters = {
        stages: chips("stage"),
        genders: chips("gender"),
        risks: chips("risk"),
        ageMin,
        ageMax,
      };
    }

    document.getElementById("list-filter-apply")?.addEventListener("click", () => {
      readListFiltersFromForm();
      state.filterModal = false;
      renderApp();
    });

    document.getElementById("list-filter-clear")?.addEventListener("click", () => {
      state.listFilters = { stages: [], genders: [], risks: [], ageMin: 18, ageMax: 100 };
      state.filterModal = false;
      renderApp();
    });

    document.querySelectorAll("[data-close-modal]").forEach((b) => {
      b.addEventListener("click", () => {
        state.filterModal = false;
        renderApp();
      });
    });

    document.getElementById("filter-modal")?.addEventListener("click", (e) => {
      if (e.target.id === "filter-modal") {
        state.filterModal = false;
        renderApp();
      }
    });

    document.querySelectorAll("[data-list-sort]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const k = btn.getAttribute("data-list-sort");
        if (!k) return;
        if (state.listSort.key === k) {
          state.listSort.dir = state.listSort.dir === "asc" ? "desc" : "asc";
        } else {
          state.listSort.key = k;
          state.listSort.dir = "asc";
        }
        renderApp();
      });
    });

    document.querySelectorAll("[data-kanban-card]").forEach((card) => {
      card.addEventListener("click", () => {
        const rk = card.getAttribute("data-kanban-prospect");
        if (rk) location.hash = `#/prospect/${encodeURIComponent(rk)}`;
      });
    });

    document.querySelectorAll("[data-pipeline]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pipe = btn.getAttribute("data-pipeline");
        if (!PIPELINE_KEYS.includes(pipe)) return;
        persistProspectChecklistsFromDetail();
        state.pipeline = pipe;
        state.detail.pipeline = pipe;
        const p = PROSPECTS.find((x) => x.rowKey === state.detail.rowKey);
        if (p) p.status = pipe;
        renderApp();
      });
    });

    document.getElementById("registration-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Registration captured (prototype only).");
    });

    document.getElementById("copy-link")?.addEventListener("click", async () => {
      const token = randomSelfRegToken();
      const selfRegUrl = buildSelfRegistrationUrl(token);
      try {
        await navigator.clipboard.writeText(selfRegUrl);
      } catch (_) {
        /* Clipboard may be denied outside secure context; toast still shows View link. */
      }
      showSelfRegistrationCopiedToast(selfRegUrl);
      const btn = document.getElementById("copy-link");
      if (btn && btn instanceof HTMLButtonElement) {
        const prev = btn.textContent;
        btn.textContent = "Copied!";
        btn.disabled = true;
        window.setTimeout(() => {
          const again = document.getElementById("copy-link");
          if (again && again instanceof HTMLButtonElement) {
            again.textContent = prev;
            again.disabled = false;
          }
        }, 2800);
      }
    });

    document.querySelector("[data-add-prospect-toggle]")?.addEventListener("click", (e) => {
      e.stopPropagation();
      state.addProspectMenuOpen = !state.addProspectMenuOpen;
      renderApp();
    });

    document.querySelectorAll("[data-reg-nav]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-reg-nav");
        if (!id) return;
        const el = document.getElementById(id);
        if (!el) return;
        if (state.registerSelfService) {
          state.registrationMobileNavOpen = false;
          syncRegistrationMobileNavDom();
        }
        window.__regNavProgrammaticScroll = true;
        setRegNavActive(id);
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.setTimeout(() => {
          window.__regNavProgrammaticScroll = false;
        }, 900);
      });
    });

    document.getElementById("registration-nav-toggle")?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      state.registrationMobileNavOpen = !state.registrationMobileNavOpen;
      syncRegistrationMobileNavDom();
    });
    document.getElementById("registration-nav-drawer-close")?.addEventListener("click", () => {
      state.registrationMobileNavOpen = false;
      syncRegistrationMobileNavDom();
    });
    document.querySelectorAll("[data-registration-nav-dismiss]").forEach((el) => {
      el.addEventListener("click", () => {
        state.registrationMobileNavOpen = false;
        syncRegistrationMobileNavDom();
      });
    });
  }

  document.getElementById("app").addEventListener("click", (e) => {
    const raw = e.target;
    const el = raw instanceof Element ? raw : raw?.parentElement;

    const formAction = el?.closest("[data-detail-form-action]");
    if (formAction && state.route === "detail") {
      const action = formAction.getAttribute("data-detail-form-action");
      const panelAttr = formAction.getAttribute("data-detail-form-panel");
      const defs = window.WD_DETAIL_FORM_DEFAULTS;
      const stateKey =
        panelAttr === "details"
          ? "details"
          : panelAttr === "medical-history"
            ? "medicalHistory"
            : panelAttr === "other-details"
              ? "otherDetails"
              : null;
      if (!action || !panelAttr || !stateKey || !defs) return;
      if (action === "edit") {
        const def = defs[stateKey];
        state.detailFormDraft = JSON.stringify({ ...def, ...(state.detailFormValues[stateKey] || {}) });
        state.detailFormEdit =
          panelAttr === "details" ? "details" : panelAttr === "medical-history" ? "medical-history" : "other-details";
        renderApp();
        return;
      }
      if (action === "cancel") {
        try {
          if (state.detailFormDraft) {
            state.detailFormValues[stateKey] = JSON.parse(state.detailFormDraft);
          }
        } catch (_) {
          /* ignore */
        }
        state.detailFormEdit = null;
        state.detailFormDraft = null;
        renderApp();
        return;
      }
      if (action === "save") {
        const root = document.querySelector(`[data-detail-form-root="${panelAttr}"]`);
        if (root) {
          const out = {};
          root.querySelectorAll("[data-detail-field]").forEach((inp) => {
            const k = inp.getAttribute("data-detail-field");
            if (k) out[k] = inp.value;
          });
          state.detailFormValues[stateKey] = out;
        }
        state.detailFormEdit = null;
        state.detailFormDraft = null;
        showToast("Changes saved.");
        renderApp();
        return;
      }
    }

    const sectNav = el?.closest("[data-detail-section-nav]");
    if (sectNav && state.route === "detail") {
      const sid = sectNav.getAttribute("data-detail-section-nav");
      if (!sid) return;
      state.detailNavSection = sid;
      renderApp();
      requestAnimationFrame(() => {
        document.getElementById(sid)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return;
    }

    const detailTabBtn = el?.closest("[data-detail-tab]");
    if (detailTabBtn) {
      const tid = detailTabBtn.getAttribute("data-detail-tab");
      if (!tid || !DETAIL_TAB_IDS.includes(tid)) return;
      const rid = state.routeId || DETAIL_DEFAULT.rowKey;
      const nextHash =
        tid === "overview"
          ? `#/prospect/${encodeURIComponent(rid)}`
          : `#/prospect/${encodeURIComponent(rid)}/${encodeURIComponent(tid)}`;
      if (location.hash === nextHash) {
        renderApp();
      } else {
        location.hash = nextHash;
      }
      return;
    }
    const toastBtn = el.closest("[data-detail-toast]");
    if (toastBtn) {
      const msg = toastBtn.getAttribute("data-detail-toast") || "Action (prototype).";
      showToast(msg);
      return;
    }
    if (el.closest("[data-prospect-docs-upload]")) {
      if (el.closest("tr[data-nav-prospect]")) return;
      e.preventDefault();
      document.getElementById("prospect-docs-file")?.click();
      return;
    }
    const row = el.closest("tr[data-nav-prospect]");
    if (row && !el.closest("button")) {
      const id = row.getAttribute("data-nav-prospect");
      location.hash = `#/prospect/${encodeURIComponent(id)}`;
    }
  });

  document.getElementById("app").addEventListener("change", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLInputElement)) return;

    if (t.hasAttribute("data-task")) {
      if (state.route !== "detail") return;
      const task = state.detail.tasks.find((x) => x.id === t.id);
      if (task) task.done = t.checked;
      const row = t.closest(".detail-task-row");
      if (row) row.classList.toggle("is-done", t.checked);
      persistProspectChecklistsFromDetail();
      renderApp();
      return;
    }

    if (t.hasAttribute("data-stage-checklist")) {
      if (state.route !== "detail") return;
      const stage = t.getAttribute("data-stage-checklist");
      const idx = parseInt(t.getAttribute("data-task-index") || "0", 10);
      if (!stage || !PIPELINE_KEYS.includes(stage) || !state.detail.stageChecklistDone?.[stage]) return;
      const arr = state.detail.stageChecklistDone[stage];
      if (!Array.isArray(arr) || idx < 0 || idx >= arr.length) return;
      arr[idx] = t.checked;
      const row = t.closest(".detail-task-row");
      if (row) row.classList.toggle("is-done", t.checked);
      persistProspectChecklistsFromDetail();
      renderApp();
      return;
    }

    if (!t.classList.contains("prospect-docs-file-input")) return;
    const files = t.files;
    if (!files?.length) return;
    handleProspectDocsFilesAdded(Array.from(files).map((f) => f.name));
    t.value = "";
  });

  document.getElementById("app").addEventListener("input", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLInputElement) || !t.classList.contains("prospect-docs__search-input")) return;
    filterProspectDocsTable(t.value);
  });

  document.getElementById("app").addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const raw = e.target;
    const el = raw instanceof Element ? raw : raw?.parentElement;
    const row = el?.closest("tr[data-nav-prospect]");
    if (row) {
      const id = row.getAttribute("data-nav-prospect");
      location.hash = `#/prospect/${encodeURIComponent(id)}`;
    }
  });

  document.addEventListener("click", (e) => {
    const prog = document.getElementById("program-title-dropdown");
    if (state.programMenuOpen && prog && !prog.contains(e.target)) {
      state.programMenuOpen = false;
      renderApp();
    }
    const addDd = document.getElementById("add-prospect-dropdown");
    if (state.addProspectMenuOpen && addDd && !addDd.contains(e.target)) {
      state.addProspectMenuOpen = false;
      renderApp();
    }
  });

  (function bootstrapDefaultHash() {
    const hash = getRouteHash();
    const hasRoutableFragment = Boolean(hash && hash !== "#" && !/^#\/?$/.test(hash));
    if (!hasRoutableFragment) {
      history.replaceState(null, "", `${location.pathname}${location.search}#/list`);
    }
  })();

  document.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-lf-chip]");
    if (!chip || !document.getElementById("list-filter-form")?.contains(chip)) return;
    e.preventDefault();
    chip.classList.toggle("is-selected");
    chip.setAttribute("aria-pressed", String(chip.classList.contains("is-selected")));
  });

  document.addEventListener(
    "focusout",
    (e) => {
      const t = e.target;
      if (!(t instanceof HTMLInputElement)) return;
      if (t.id !== "lf-age-min" && t.id !== "lf-age-max") return;
      if (!document.getElementById("list-filter-form")?.contains(t)) return;
      const minEl = document.getElementById("lf-age-min");
      const maxEl = document.getElementById("lf-age-max");
      if (minEl && maxEl) normalizeAgeFilterValues(minEl, maxEl);
    },
    true
  );

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (state.route !== "register" || !state.registerSelfService || !state.registrationMobileNavOpen) return;
    state.registrationMobileNavOpen = false;
    syncRegistrationMobileNavDom();
  });

  renderApp();

  window.addEventListener("hashchange", renderApp);
})();
