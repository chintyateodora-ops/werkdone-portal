/**
 * WerkDone Prospect Management Portal — static prototype aligned with Figma Make export
 * (globals.css + AllProspects + ProspectDetail tab bodies in detail-panels.js).
 * rowKey disambiguates duplicate PROS-001234 / PROS-001239 IDs across programs.
 */

(function () {
  "use strict";

  const PROGRAMS = [
    { id: "all", label: "All Prospects", figma: "1:2" },
    { id: "mammobus", label: "Mammogram Prospects", figma: "1:800" },
    { id: "hpv", label: "HPV Prospects", figma: "1:996" },
    { id: "fit", label: "FIT Prospects", figma: "1:1468" },
  ];

  /** Country dropdown options for residential address (screening registration forms). */
  const REG_ADDRESS_COUNTRY_OPTIONS = `
                      <option value="Singapore" selected>Singapore</option>
                      <option value="Malaysia">Malaysia</option>
                      <option value="Indonesia">Indonesia</option>
                      <option value="Other">Other</option>`;

  /** CHAS + Healthier SG selects — shared options for all screening registration forms. */
  const REG_SUBSIDIES_CHAS_OPTIONS = `
                      <option value="">Select CHAS Card Type</option>
                      <option value="Blue">Blue</option>
                      <option value="Orange">Orange</option>
                      <option value="Green">Green</option>
                      <option value="Not Applicable">Not Applicable</option>`;

  const REG_SUBSIDIES_HEALTHIER_SG_OPTIONS = `
                      <option value="">Select Enrolment Status</option>
                      <option value="enrolled">Enrolled</option>
                      <option value="not-enrolled">Not Enrolled</option>
                      <option value="unsure">Unsure</option>`;

  /** Normalize stored Healthier SG enrolment to canonical keys (enrolled | not-enrolled | unsure). */
  function healthierSgCanonicalStored(stored) {
    const s = String(stored || "").trim().toLowerCase();
    const compact = s.replace(/[^a-z0-9]/g, "");
    if (compact === "yes" || compact === "enrolled") return "enrolled";
    if (compact === "no" || compact === "notenrolled") return "not-enrolled";
    if (compact === "unsure" || compact.startsWith("unsure") || compact.includes("prefernottosay")) return "unsure";
    return String(stored || "").trim();
  }

  /**
   * Demo clients for registration “existing client” lookup (NRIC or name).
   * In production this would call an API; values align with list/detail prototype where possible.
   */
  const REG_EXISTING_CLIENTS = [
    {
      name: "Lee Wei Xiong",
      nric: "S1234567D",
      residential: "Citizen",
      dob: "15-03-1956",
      gender: "Male",
      race: "Chinese",
      phone: "9876 5432",
      email: "email@email.com",
      block: "123",
      street: "Ang Mo Kio Avenue 6",
      floor: "12",
      unit: "12-345",
      postal: "560123",
      country: "Singapore",
    },
    {
      name: "Nurul Huda",
      nric: "S887782A",
      residential: "Citizen",
      dob: "12-06-1988",
      gender: "Female",
      race: "Malay",
      phone: "9421 0785",
      email: "nurul.huda@gmail.com",
      block: "45",
      street: "Bedok North Street 1",
      floor: "05",
      unit: "123",
      postal: "460123",
      country: "Singapore",
    },
    {
      name: "Mohammed Ali",
      nric: "S123345F",
      residential: "PR",
      dob: "03-11-1969",
      gender: "Male",
      race: "Malay",
      phone: "9647 3012",
      email: "mohammedali@gmail.com",
      block: "202",
      street: "Pasir Ris Drive 4",
      floor: "08",
      unit: "881",
      postal: "510202",
      country: "Singapore",
    },
    {
      name: "Olivia Wilson",
      nric: "S991112B",
      residential: "Citizen",
      dob: "22-01-1997",
      gender: "Female",
      race: "Eurasian",
      phone: "9285 7401",
      email: "olivia.wilson@gmail.com",
      block: "10",
      street: "Tampines Central 7",
      floor: "03",
      unit: "456",
      postal: "520710",
      country: "Singapore",
    },
    {
      name: "Adam Sim Wei Wen",
      nric: "S772223E",
      residential: "Citizen",
      dob: "30-07-1963",
      gender: "Male",
      race: "Chinese",
      phone: "8246 3791",
      email: "adamsim@example.net",
      block: "88",
      street: "Bishan Street 13",
      floor: "14",
      unit: "1402",
      postal: "570088",
      country: "Singapore",
    },
    /** Matches prospect list PROS-001238 (masked NRIC S****556D on list). */
    {
      name: "John Tan",
      nric: "S1234556D",
      residential: "Citizen",
      dob: "20-03-1972",
      gender: "Male",
      race: "Chinese",
      phone: "8756 3421",
      email: "jr.hong.ccc@gmail.com",
      block: "56",
      street: "Hougang Avenue 9",
      floor: "12",
      unit: "128",
      postal: "530056",
      country: "Singapore",
    },
    {
      name: "Chen Wei Ning",
      nric: "S889901C",
      residential: "Citizen",
      dob: "18-04-1981",
      gender: "Female",
      race: "Chinese",
      phone: "9781 2345",
      email: "chenweining@outlook.com",
      block: "301",
      street: "Clementi Avenue 4",
      floor: "09",
      unit: "902",
      postal: "120301",
      country: "Singapore",
    },
    {
      name: "Eva Rodriguez",
      nric: "S334667G",
      residential: "Citizen",
      dob: "15-09-1993",
      gender: "Female",
      race: "Indian",
      phone: "8573 5294",
      email: "eva.rod@gmail.com",
      block: "12",
      street: "Kent Ridge Drive",
      floor: "04",
      unit: "08",
      postal: "119082",
      country: "Singapore",
    },
  ];

  const PROSPECTS = [
    {
      rowKey: "PROS-001234-Mammobus",
      id: "PROS-001234",
      name: "Nurul Huda",
      maskedNric: "S****782A",
      program: "Mammobus",
      ageGender: "Female, 37 years",
      phone: "9421 0785",
      email: "nurul.huda@gmail.com",
      status: "booked",
      sourceType: "Event",
      sourceDetail: "Community Health Roadshow - Bedok",
      risk: "medium",
      /** Date screening registration form was submitted (ISO YYYY-MM-DD). */
      dateRegistered: "2025-10-28",
      /** Next review date — ISO YYYY-MM-DD; list column + Screening tab + hero subtitle. */
      nextReview: "2026-05-14",
      /** Latest attendance for this programme row (list column); aligns with screening attendance options. */
      attendance: "Rescheduled",
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
      maskedNric: "S****782A",
      program: "HPV",
      ageGender: "Female, 37 years",
      phone: "9421 0785",
      email: "nurul.huda@gmail.com",
      status: "booked",
      sourceType: "Event",
      sourceDetail: "Community Health Roadshow - Bedok",
      risk: "medium",
      dateRegistered: "2025-10-22",
      nextReview: "2026-08-20",
      attendance: "Attended",
    },
    {
      rowKey: "PROS-001235",
      id: "PROS-001235",
      name: "Mohammed Ali",
      maskedNric: "S****345F",
      program: "FIT",
      ageGender: "Male, 56 years",
      phone: "9647 3012",
      email: "mohammedali@gmail.com",
      status: "qualified",
      sourceType: "Campaign",
      sourceDetail: "Cancer Awareness 2025",
      risk: "low",
      dateRegistered: "2025-10-18",
      nextReview: "2026-04-01",
      attendance: "Cancelled",
    },
    {
      rowKey: "PROS-001236",
      id: "PROS-001236",
      name: "Chen Wei Ning",
      maskedNric: "S****901C",
      program: "Mammobus",
      ageGender: "Female, 45 years",
      phone: "9781 2345",
      email: "chenweining@outlook.com",
      status: "qualified",
      sourceType: "Manual",
      sourceDetail: "Walk-in Registration",
      risk: "medium",
      dateRegistered: "2025-10-12",
      nextReview: "2026-06-15",
      attendance: "No Show",
    },
    {
      rowKey: "PROS-001237",
      id: "PROS-001237",
      name: "Olivia Wilson",
      maskedNric: "S****112B",
      program: "HPV",
      ageGender: "Female, 28 years",
      phone: "9285 7401",
      email: "olivia.wilson@gmail.com",
      status: "qualified",
      sourceType: "Event",
      sourceDetail: "Community Health Roadshow - Bedok",
      risk: "high",
      dateRegistered: "2025-10-05",
      nextReview: "2026-03-10",
      attendance: "Rescheduled",
    },
    {
      rowKey: "PROS-001238",
      id: "PROS-001238",
      name: "John Tan",
      maskedNric: "S****556D",
      program: "FIT",
      ageGender: "Male, 54 years",
      phone: "8756 3421",
      email: "jr.hong.ccc@gmail.com",
      status: "booked",
      sourceType: "Event",
      sourceDetail: "Community Health Roadshow - Bedok",
      risk: "medium",
      dateRegistered: "2025-09-28",
      nextReview: "2026-07-01",
      attendance: "Attended",
    },
    {
      rowKey: "PROS-001239-Mammobus",
      id: "PROS-001239",
      name: "Adam Sim Wei Wen",
      maskedNric: "S****223E",
      program: "Mammobus",
      ageGender: "Male, 62 years",
      phone: "8246 3791",
      email: "adamsim@example.net",
      status: "screened",
      sourceType: "Campaign",
      sourceDetail: "Pink for Life 2025",
      risk: "medium",
      dateRegistered: "2025-08-12",
      nextReview: "2026-11-09",
      attendance: "Attended",
    },
    {
      rowKey: "PROS-001239-FIT",
      id: "PROS-001239",
      name: "Adam Sim Wei Wen",
      maskedNric: "S****223E",
      program: "FIT",
      ageGender: "Male, 62 years",
      phone: "8246 3791",
      email: "adamsim@example.net",
      status: "screened",
      sourceType: "Campaign",
      sourceDetail: "Pink for Life 2025",
      risk: "medium",
      dateRegistered: "2026-04-12",
      nextReview: "2026-12-01",
      attendance: "No Show",
    },
    {
      rowKey: "PROS-001240",
      id: "PROS-001240",
      name: "Eva Rodriguez",
      maskedNric: "S****667G",
      program: "HPV",
      ageGender: "Female, 33 years",
      phone: "8573 5294",
      email: "eva.rod@gmail.com",
      status: "qualified",
      sourceType: "Event",
      sourceDetail: "Race for Life",
      risk: "low",
      dateRegistered: "2026-03-01",
      nextReview: "2026-09-15",
      attendance: "Cancelled",
    },
  ];

  /** Fallback detail shell when no list row matches — aligned with first grid prospect (Nurul / Mammobus). */
  const DETAIL_DEFAULT = {
    rowKey: "PROS-001234-Mammobus",
    id: "PROS-001234",
    name: "Nurul Huda",
    subtitle: "Female • 37 years • Next Review: 14 May 2026",
    programTags: ["Mammobus", "HPV / PAP"],
    risk: "medium",
    pipeline: "booked",
    timeline: structuredClone(PROSPECTS[0].activityTimeline || []),
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
    /** List column programme for this row (Mammobus | HPV | FIT) — V1 header “active screening”. */
    activeListProgram: "Mammobus",
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
    detailTab: "details",
    /** Classic collapsible screening records table (Prospect V1 + classic detail): filter + expanded row */
    classicScreeningFilter: "all",
    classicScreeningExpandedId: null,
    /** id → partial raw record fields merged onto `#wd-classic-screening-records` seed (prototype session). */
    classicScreeningEditById: {},
    classicScreeningUpdateModalId: null,
    /** Screening table: open task checklist modal for this record id */
    classicScreeningTasksModalId: null,
    /** Screening record id → { qualified: boolean[], booked: boolean[], screened: boolean[] } (lengths match WD_STAGE_CHECKLISTS) */
    classicScreeningTaskDoneByRecordId: {},
    screeningTab: "details",
    prospectV3Tab: "overview",
    /** Prospect v3 Biodata tab: inline edit (Data Source stays read-only). */
    prospectV3BiodataModalOpen: false,
    prospectV3BiodataDraft: null,
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
    /** After Edit/Save/Cancel on detail form tabs, restore #detail-flow-scroll-root scroll (full re-render resets it). */
    detailScrollPreservePending: false,
    /** Classic prospect: Activity timeline right sidebar drawer. */
    activityTimelineDrawerOpen: false,
    detailFormValues: {
      details: {},
      medicalHistory: {},
      otherDetails: {},
    },
    /** Active section in registration-style nav (Personal Details / Medical / Other tabs) */
    detailNavSection: "detail-personal",
    /** Prospect detail Documents tab: rowKey → { id, name, size, mime, uploadedAt, objectUrl }[] (in-memory prototype) */
    detailDocumentsByProspect: {},
    /** Prospect detail Notes tab: rowKey → user-added { id, body, submittedAt, authorName, authorRole }[] (session prototype) */
    detailNotesByProspect: {},
    /** Add-note / edit-note dialog on prospect Notes tab */
    detailAddNoteModalOpen: false,
    /** When set, note dialog is editing this note id (seed or user-added). */
    detailNoteEditId: null,
    /** Delete confirmation: note id pending confirm, or null. */
    detailDeleteNoteId: null,
    /** rowKey → { [noteId]: { body, submittedAt } } — edits to seeded notes (immutable seed). */
    detailNoteEdits: {},
    /** rowKey → note ids removed from merged list (seed ids or soft-delete bookkeeping). */
    detailNoteDeletedIds: {},
    /** Prospect overview Activity Timeline: rowKey → { id, atIso, title, body, by, stage }[] (session log) */
    detailActivityFeedByProspect: {},
    /** True when registration opened with ?sr_token=… (patient self-service link) */
    registerSelfService: false,
    /** Mobile token URL: “Skip to section” drawer open */
    registrationMobileNavOpen: false,
    /** Token URL: landing vs full form */
    registerSelfServiceEntry: "landing",
    /** Token URL: Singpass path — demo prefill + lock listed fields */
    registerSingpassLocked: false,
  };

  const PROSPECT_V3_TAB_IDS = ["overview", "screenings", "biodata", "eligibility", "documents", "notes"];

  /**
   * V3 Biodata edit: control types + option lists match classic prospect form (`detail-panels.js`
   * — Personal Information, Address, Healthier SG & Subsidies, Risk Assessment).
   *
   * Edit control mapping:
   * - Text: firstName, lastName, nric, age, email, postal, lastScreeningYear
   * - Date (DD-MM-YYYY + calendar widget): dob — same shell as `fieldDateInput`
   * - Phone (+65 prefix | tel): contact — same pattern as `fieldPhone`
   * - Select: gender, race, religion, residentialStatus, chasCardType
   * - Select (value ≠ label): healthierSg — same pairs as `fieldSelectValueLabel` for Healthier SG
   * - Multi-checkbox (saved comma-separated): preferredLanguages — same options as `fieldCheckboxMulti`
   * - Residential address: block, street, floor, unit, postal, country — same fields as screening registration (`reg-address`)
   * - Textarea: priorCancerScreening (3); personalCancerHistory, preExistingConditions,
   *   familyHistory (4 rows) — same as risk section `fieldTextarea`s
   * - Engagement & consent: sourceType, sourceName (text); pdpaConsent, edmSubscription, consentContact (yes/no)
    */
   const V3_BIODATA_OPTIONS = Object.freeze({
    residentialStatus: ["Singapore Citizen", "Permanent Resident", "Foreigner"],
    gender: ["Female", "Male", "Other"],
    race: ["Chinese", "Malay", "Indian", "Eurasian", "Others"],
    religion: [
      "Buddhism",
      "Catholicism",
      "Christianity",
      "Free Thinker",
      "Hinduism",
      "Islam",
      "Sikhism",
      "Taoism",
      "Others",
    ],
    chasCardType: ["Blue", "Orange", "Green", "Not Applicable"],
    /** value → label (same as `fieldSelectValueLabel` for Healthier SG). */
    healthierSg: Object.freeze([
      ["enrolled", "Enrolled"],
      ["not-enrolled", "Not Enrolled"],
      ["unsure", "Unsure"],
    ]),
    preferredLanguages: Object.freeze([
      "English",
      "Mandarin",
      "Malay",
      "Tamil",
      "Hokkien",
      "Cantonese",
      "Teochew",
      "Others",
    ]),
    /** Same country list as screening registration + classic detail address (`detail-panels.js`). */
    addressCountry: Object.freeze(["Singapore", "Malaysia", "Indonesia", "Other"]),
  });

  /** Query param on self-registration URLs (patient-facing token link). */
  const SELF_REG_TOKEN_PARAM = "sr_token";

  /** Logged-in portal user (aligned with header chip; prototype). */
  const PORTAL_CURRENT_USER = Object.freeze({
    name: "Saphira Jane",
    role: "CPC Team",
  });

  function portalCurrentUserInitials() {
    const n = String(PORTAL_CURRENT_USER.name || "").trim();
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
    return "—";
  }

  /** Demo notes merged with user-added notes on the Notes tab (sorted newest first in UI). */
  const DETAIL_NOTES_SEED = Object.freeze([
    {
      id: "seed-note-jasmine",
      authorName: "Jasmine Lim",
      authorRole: "Care Coordinator",
      submittedAt: "2025-11-15T15:45:00+08:00",
      body: "Client expressed strong interest in attending screening workshops. Recommend enrolling in upcoming December session at Bedok Community Center.",
    },
    {
      id: "seed-note-sarah",
      authorName: "Sarah Tan",
      authorRole: "Outreach Specialist",
      submittedAt: "2025-11-10T10:30:00+08:00",
      body: "Follow-up needed regarding insurance coverage questions. Client mentioned family history of breast cancer - flagging for priority screening.",
    },
  ]);

  /** Prototype Myinfo values (demo only). */
  const SINGPASS_DEMO = Object.freeze({
    fullName: "Tan Wei Ming",
    nricFull: "S1234567D",
    nricFitRest: "1234567D",
    dob: "15-03-1990",
    gender: "Male",
    race: "Chinese",
    residential: "Citizen",
    email: "weiming.tan@example.sg",
    phone: "9123 4567",
    postal: "560123",
    block: "123",
    street: "Ang Mo Kio Avenue 6",
    floor: "12",
    unit: "12-345",
    country: "Singapore",
    chasCardType: "Blue",
  });

  let lastDetailTabForForm = "details";
  let lastRenderWasRegisterSelfService = false;

  const DETAIL_TAB_IDS = [
    "details",
    "medical-history",
    "other-details",
    "screening",
    "appointments",
    "documents",
    "notes",
  ];

  const SCREENING_TAB_IDS = ["details", "tasks", "eligibility"];

  const DETAIL_FORM_TAB_IDS = ["details", "medical-history", "other-details"];

  /** Section ids for detail ToC scroll-spy (mirror detail-panels.js DETAILS_NAV / MEDICAL_NAV / OTHER_NAV). */
  const DETAIL_TAB_SECTION_IDS = {
    details: [
      "detail-personal",
      "detail-address",
      "detail-screening",
      "detail-appointment",
      "detail-risk",
      "detail-status",
      "detail-engagement",
      "detail-consent",
    ],
    "medical-history": ["mh-family", "mh-history", "mh-treatment"],
    "other-details": ["od-medical", "od-cervical", "od-info", "od-breast"],
  };

  const PIPELINE_KEYS = ["qualified", "booked", "screened"];

  let lastDetailId = null;
  /** When set, skip re-applying default screening row expand (same prospect + screening tab until user leaves). */
  let lastScreeningExpandSig = null;
  let searchDebounce = null;

  function pipelineFromStatus(status) {
    if (status === "screened") return "screened";
    if (status === "qualified") return "qualified";
    if (status === "booked") return "booked";
    return "qualified";
  }

  /** Personal Details → Risk Assessment `riskLevel` select ↔ `PROSPECTS[].risk` + `state.detail.risk`. */
  function normalizeRiskSlugFromAssessment(formVal) {
    const s = String(formVal || "")
      .trim()
      .toLowerCase();
    if (s === "high") return "high";
    if (s === "medium") return "medium";
    if (s === "low") return "low";
    return "";
  }

  function riskLevelFormLabelFromSlug(slug) {
    const s = String(slug || "")
      .trim()
      .toLowerCase();
    if (s === "high") return "High";
    if (s === "medium") return "Medium";
    if (s === "low") return "Low";
    return "";
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
    base.rowKey = p.rowKey;
    base.id = p.id;
    base.name = p.name;
    base.subtitle = buildProspectSubtitle(p);
    base.programTags = collectProgramTags(p);
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
    base.activeListProgram = p.program;
    return base;
  }

  function persistProspectChecklistsFromDetail() {
    if (state.route !== "detail" && state.route !== "screening") return;
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
    if (state.route !== "detail" && state.route !== "screening" && state.route !== "prospectv3") return;
    const rawId = state.routeId || DETAIL_DEFAULT.rowKey;
    const id = decodeURIComponent(rawId);
    const p = PROSPECTS.find((x) => x.rowKey === id || x.id === id);

    if (p) {
      const switched = lastDetailId !== id;
      if (switched) {
        state.detail = mergeDetailFromProspect(p);
        state.pipeline = state.detail.pipeline;
        state.detailFormValues = buildProspectDetailFormValuesBundle(p);
        state.prospectV3BiodataModalOpen = false;
        state.prospectV3BiodataDraft = null;
        state.classicScreeningUpdateModalId = null;
        state.activityTimelineDrawerOpen = false;
      }
      /* Same prospect: keep pipeline + checklist state (do not reset from p.status each render — that broke task counts / stepper). */
      lastDetailId = id;
    } else {
      if (lastDetailId !== id) {
        state.detail = structuredClone(DETAIL_DEFAULT);
        state.pipeline = state.detail.pipeline;
        const D = window.WD_DETAIL_FORM_DEFAULTS;
        state.detailFormValues = {
          details: D && D.details ? structuredClone(D.details) : {},
          medicalHistory: D && D.medicalHistory ? structuredClone(D.medicalHistory) : {},
          otherDetails: D && D.otherDetails ? structuredClone(D.otherDetails) : {},
        };
        state.prospectV3BiodataModalOpen = false;
        state.prospectV3BiodataDraft = null;
        state.classicScreeningUpdateModalId = null;
        state.activityTimelineDrawerOpen = false;
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
    /** Collapsible table rows (screening records): same stroke weight as chevronRightSm, fixed14px */
    rowExpandClosed:
      '<svg class="data-table__expand-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>',
    rowExpandOpen:
      '<svg class="data-table__expand-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
    checkStep:
      '<svg class="pipeline__check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
    sort:
      '<svg class="prospect-docs-sort-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 15l5 5 5-5M7 9l5-5 5 5"/></svg>',
    /** List table: neutral chevrons when column is not the active sort */
    tableSortNeutral:
      '<svg class="data-table__sort-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 15l5 5 5-5M7 9l5-5 5 5"/></svg>',
    trendUp:
      '<svg class="prospect-summary-card__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
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

  function programDisplayLabel(program) {
    const map = { Mammobus: "Mammogram", FIT: "FIT", HPV: "HPV / PAP" };
    return map[program] || program || "";
  }

  /** Prospect V1 subtitle chip: active screening from list programme (not prospect id). */
  function v1ClientActiveScreeningLabel(listProgram) {
    const key = String(listProgram || "").trim();
    if (!key) return "—";
    const lower = key.toLowerCase();
    if (lower === "mammobus") return "Mammogram";
    if (lower === "hpv") return "HPV";
    if (lower === "fit") return "FIT";
    return programDisplayLabel(listProgram) || key;
  }

  /** Unique programme tags for a prospect id (multiple enrolments / rowKeys). */
  function collectProgramTags(p) {
    if (Array.isArray(p.programTags) && p.programTags.length) return p.programTags.slice();
    const same = PROSPECTS.filter((x) => x.id === p.id);
    const set = new Set();
    for (const row of same) {
      const lab = programDisplayLabel(row.program);
      if (lab) set.add(lab);
    }
    if (set.size) return [...set];
    const one = programDisplayLabel(p.program);
    return one ? [one] : [];
  }

  /** Hero subtitle line — long month (e.g. 6 November 2025). */
  function formatNextReviewSubtitle(iso) {
    if (iso == null || String(iso).trim() === "") return "—";
    const d = new Date(String(iso).trim() + "T12:00:00");
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }

  /** One line under the name: gender • age • Next Review: date */
  function buildProspectSubtitle(p) {
    const ag = String(p.ageGender || "").replace(", ", " • ");
    return `${ag} • Next Review: ${formatNextReviewSubtitle(p.nextReview)}`;
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

  /** Age in years from Personal Details DOB `DD/MM/YYYY` (biodata / screening-aligned). */
  function ageFromDobDdMmYyyy(dobStr) {
    const s = String(dobStr || "").trim();
    const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!m) return null;
    const dd = parseInt(m[1], 10);
    const mo = parseInt(m[2], 10);
    const yyyy = parseInt(m[3], 10);
    if (mo < 1 || mo > 12 || dd < 1 || dd > 31) return null;
    const birth = new Date(yyyy, mo - 1, dd);
    if (Number.isNaN(birth.getTime())) return null;
    const ref = new Date();
    let age = ref.getFullYear() - birth.getFullYear();
    const dm = ref.getMonth() - birth.getMonth();
    if (dm < 0 || (dm === 0 && ref.getDate() < birth.getDate())) age--;
    if (age < 0 || age > 130) return null;
    return age;
  }

  /**
   * Prospect V1 hero line: gender from biodata/personal details, then listing `ageGender`.
   */
  function v1ProspectDisplayGender(details, listRow) {
    const g = String(details?.gender || "").trim();
    if (g) return g;
    const { gender } = parseProspectAgeGender(listRow?.ageGender || "");
    if (gender === "female") return "Female";
    if (gender === "male") return "Male";
    return "—";
  }

  /**
   * Prospect V1 hero line: numeric age from biodata, else derived from DOB, else listing.
   */
  function v1ProspectDisplayAge(details, listRow) {
    const raw = details?.age;
    if (raw != null && String(raw).trim() !== "") {
      const n = parseInt(String(raw).replace(/[^\d]/g, ""), 10);
      if (Number.isFinite(n) && n >= 0 && n <= 130) return String(n);
    }
    const fromDob = ageFromDobDdMmYyyy(details?.dob);
    if (fromDob != null) return String(fromDob);
    const { age } = parseProspectAgeGender(listRow?.ageGender || "");
    if (age != null) return String(age);
    return "—";
  }

  /** Screening registration form submitted date — `PROSPECTS[].dateRegistered` as ISO YYYY-MM-DD. */
  function formatDateRegisteredDisplay(iso) {
    if (iso == null || String(iso).trim() === "") return "—";
    const t = new Date(String(iso).trim() + "T12:00:00").getTime();
    if (Number.isNaN(t)) return "—";
    return new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  function dateRegisteredSortValue(iso) {
    if (iso == null || String(iso).trim() === "") return 0;
    const t = new Date(String(iso).trim() + "T12:00:00").getTime();
    return Number.isNaN(t) ? 0 : t;
  }

  /** DD/MM/YYYY for detail Screening `nextReviewDate` (matches `detail-panels` field). */
  function isoToDdMmYyyy(iso) {
    if (iso == null || String(iso).trim() === "") return "";
    const d = new Date(String(iso).trim() + "T12:00:00");
    if (Number.isNaN(d.getTime())) return "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  function regResidentialToFormStatus(abbr) {
    const a = String(abbr || "").trim().toLowerCase();
    if (a === "pr") return "Permanent Resident";
    if (a === "foreigner") return "Foreigner";
    return "Singapore Citizen";
  }

  /** Match `REG_EXISTING_CLIENTS[].name` to prospect list row for shared NRIC / address master data. */
  function findRegExistingClientByName(name) {
    const n = String(name || "").trim();
    if (!n) return null;
    return REG_EXISTING_CLIENTS.find((c) => c.name === n) || null;
  }

  /** Registration-style DOB in detail tabs uses `DD/MM/YYYY` (slashes). */
  function regDobToDetailDob(isoLike) {
    return String(isoLike || "")
      .trim()
      .replace(/^(\d{2})-(\d{2})-(\d{4})$/, "$1/$2/$3");
  }

  /** Preferred screening date fields use `DD-MM-YYYY` (hyphens), aligned with screening forms. */
  function isoDateToPreferredScreening(iso) {
    if (iso == null || String(iso).trim() === "") return "";
    const d = new Date(String(iso).trim() + "T12:00:00");
    if (Number.isNaN(d.getTime())) return "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }

  /**
   * Single source of truth for Personal Details + aligned list fields when opening a prospect.
   * Merges `WD_DETAIL_FORM_DEFAULTS.details` with list row + `REG_EXISTING_CLIENTS` (name match).
   */
  function buildProspectDetailsMaster(p) {
    const D = window.WD_DETAIL_FORM_DEFAULTS;
    const base = D && D.details ? structuredClone(D.details) : {};
    const reg = findRegExistingClientByName(p.name);
    const nextReviewDate = isoToDdMmYyyy(p.nextReview) || base.nextReviewDate || "";
    const riskLevel = riskLevelFormLabelFromSlug(p.risk) || base.riskLevel || "Medium";

    const out = {
      ...base,
      fullName: p.name,
      contact: p.phone,
      email: p.email,
      sourceType: p.sourceType,
      sourceName: p.sourceDetail,
      nextReviewDate,
      riskLevel,
      screeningLocationEvent:
        p.sourceDetail && String(p.sourceDetail).trim() ? String(p.sourceDetail).trim() : base.screeningLocationEvent,
      preferredScreeningDate: isoDateToPreferredScreening(p.dateRegistered) || base.preferredScreeningDate,
    };

    if (reg) {
      out.nric = reg.nric;
      if (reg.gender === "Male" || reg.gender === "Female") out.gender = reg.gender;
      out.dob = regDobToDetailDob(reg.dob);
      const aReg = ageFromDobDdMmYyyy(out.dob);
      if (aReg != null) out.age = String(aReg);
      out.race = reg.race;
      out.residentialStatus = regResidentialToFormStatus(reg.residential);
      out.block = reg.block;
      out.street = reg.street;
      out.floor = reg.floor;
      out.unit = reg.unit;
      out.postal = reg.postal;
      out.country = reg.country;
    } else {
      const { age, gender } = parseProspectAgeGender(p.ageGender);
      if (gender === "female") out.gender = "Female";
      else if (gender === "male") out.gender = "Male";
      if (age != null) {
        out.age = String(age);
        out.dob = `01/06/${2026 - age}`;
      }
    }

    return out;
  }

  /** Replace all detail tab drafts when switching prospects — avoids stale “Lee Wei Xiong” merges. */
  function buildProspectDetailFormValuesBundle(p) {
    const D = window.WD_DETAIL_FORM_DEFAULTS;
    if (!D) {
      return { details: {}, medicalHistory: {}, otherDetails: {} };
    }
    return {
      details: buildProspectDetailsMaster(p),
      medicalHistory: structuredClone(D.medicalHistory),
      otherDetails: structuredClone(D.otherDetails),
    };
  }

  /** Listing Name column second line, e.g. `S****345F , Female, 56 years`. */
  function formatProspectListSubline(r) {
    const masked =
      r.maskedNric != null && String(r.maskedNric).trim() !== ""
        ? String(r.maskedNric).trim()
        : "—";
    const { age, gender } = parseProspectAgeGender(r.ageGender);
    const genderLabel =
      gender === "female" ? "Female" : gender === "male" ? "Male" : "—";
    const ageLabel = age != null ? `${age} years` : "—";
    return `${masked} , ${genderLabel}, ${ageLabel}`;
  }

  function renderProspectNameCell(r) {
    const href = `#/prospect/${encodeURIComponent(r.rowKey)}/screening`;
    return `<td class="data-table__cell--prospect-name">
      <div class="prospect-name-cell">
        <a class="prospect-name-cell__link" href="${escapeAttr(href)}">${escapeAttr(r.name)}</a>
        <div class="prospect-name-cell__meta">${escapeAttr(formatProspectListSubline(r))}</div>
      </div>
    </td>`;
  }

  /** Expanded screening row: Result, Next review period, Next review date, Last updated by (— if empty). */
  function normalizeClassicScreeningExpandedDetails(r) {
    const dash = "—";
    const val = (x) => (x != null && String(x).trim() !== "" ? String(x).trim() : dash);
    return [
      ["Result", val(r.result)],
      ["Next review period", val(r.nextReviewPeriod)],
      ["Next review date", val(r.nextReviewDate)],
      ["Last updated by", val(r.lastUpdatedBy)],
    ];
  }

  /** Mammogram registration `name="appointmentType"` values → card titles (Screening Form). */
  const CLASSIC_MAMMOGRAM_APPOINTMENT_TYPE_LABELS = Object.freeze({
    mammobus: "Community Mammobus Programme",
    "scs-clinic": "SCS Clinic @ Bishan",
    "healthier-sg": "Healthier SG Programme",
  });

  const CLASSIC_SCREENING_STATUS_BY_KEY = Object.freeze({
    booked: { key: "booked", label: "Booked", tone: "sr-status--booked" },
    qualified: { key: "qualified", label: "Qualified", tone: "sr-status--qualified" },
    screened: { key: "screened", label: "Screened", tone: "sr-status--screened" },
  });

  const CLASSIC_SCREENING_ATTENDANCE_OPTIONS = Object.freeze(["Attended", "No Show", "Cancelled", "Rescheduled"]);

  function normalizeClassicScreeningRecord(r) {
    if (!r || typeof r !== "object") return null;
    const id = r.id != null ? String(r.id) : "";
    if (!id) return null;
    return {
      id,
      submitted: String(r.submitted || "—"),
      type: r.type || { key: "MMG", label: "—", tone: "sr-type--mmg" },
      status: r.status || { key: "qualified", label: "—", tone: "sr-status--qualified" },
      appointment: r.appointment == null ? null : r.appointment,
      venue: r.venue != null ? String(r.venue) : "—",
      attendance: r.attendance != null ? String(r.attendance).trim() : "",
      /** Form field value: `mammobus` | `scs-clinic` | `healthier-sg` (mammogram only). */
      appointmentType: r.appointmentType != null ? String(r.appointmentType).trim() : "",
      /** Legacy demo seed only; used as fallback when `appointmentType` is missing (MMG). */
      apptType: r.apptType != null ? String(r.apptType) : "",
      action: r.action && typeof r.action === "object" ? r.action : null,
      expandedDetails: normalizeClassicScreeningExpandedDetails(r),
    };
  }

  function classicScreeningAttendanceDisplay(r) {
    const raw = r?.attendance != null ? String(r.attendance).trim() : "";
    if (!raw) return "—";
    const hit = CLASSIC_SCREENING_ATTENDANCE_OPTIONS.find((x) => x.toLowerCase() === raw.toLowerCase());
    return hit || raw;
  }

  /** "Appointment Type" column: mammogram labels from screening form; other types show —. */
  function classicScreeningAppointmentTypeDisplay(r) {
    if (!r || r.type?.key !== "MMG") return "—";
    const at = String(r.appointmentType || "").trim().toLowerCase();
    if (at && CLASSIC_MAMMOGRAM_APPOINTMENT_TYPE_LABELS[at]) {
      return CLASSIC_MAMMOGRAM_APPOINTMENT_TYPE_LABELS[at];
    }
    const legacy = String(r.apptType || "").trim().toLowerCase();
    if (!legacy) return "—";
    if (legacy === "mammobus" || legacy.includes("community mammobus")) {
      return CLASSIC_MAMMOGRAM_APPOINTMENT_TYPE_LABELS.mammobus;
    }
    if (legacy.includes("bishan") || legacy.includes("scs clinic")) {
      return CLASSIC_MAMMOGRAM_APPOINTMENT_TYPE_LABELS["scs-clinic"];
    }
    if (legacy.includes("healthiersg") || legacy.includes("healthier sg")) {
      return CLASSIC_MAMMOGRAM_APPOINTMENT_TYPE_LABELS["healthier-sg"];
    }
    return "—";
  }

  /** Rows from `#wd-classic-screening-records` in `index.html` (client-profile_2 demo). */
  function getClassicScreeningRecordsRawArray() {
    const el = document.getElementById("wd-classic-screening-records");
    if (!el || !el.textContent || !el.textContent.trim()) return [];
    try {
      const raw = JSON.parse(el.textContent);
      return Array.isArray(raw) ? raw : [];
    } catch (_) {
      return [];
    }
  }

  function getClassicScreeningRecordsRawMerged() {
    return getClassicScreeningRecordsRawArray().map((item) => {
      const id = item.id != null ? String(item.id) : "";
      const patch = id ? state.classicScreeningEditById[id] : null;
      return patch ? { ...item, ...patch } : { ...item };
    });
  }

  function getClassicScreeningRecordsCatalog() {
    return getClassicScreeningRecordsRawMerged().map(normalizeClassicScreeningRecord).filter(Boolean);
  }

  /** List `program` / enrolment label → screening table `type.key` (MMG | FIT | PAP). */
  function screeningTypeKeyFromListProgram(programRaw) {
    const p = String(programRaw || "").trim().toLowerCase();
    if (!p) return null;
    if (p.includes("mammobus") || p.includes("mammogram")) return "MMG";
    if (p === "fit" || p.includes("fit")) return "FIT";
    if (p.includes("hpv") || p.includes("pap")) return "PAP";
    return null;
  }

  function classicScreeningFilterKeyFromListProgram(programRaw) {
    return screeningTypeKeyFromListProgram(programRaw);
  }

  function pickClassicScreeningRecordIdForListProgram(programRaw) {
    const typeKey = screeningTypeKeyFromListProgram(programRaw);
    if (!typeKey) return null;
    const records = getClassicScreeningRecordsCatalog();
    const fk = classicScreeningFilterKey();
    const visible = fk === "all" ? records : records.filter((r) => r.type?.key === fk);
    const hit = visible.find((r) => r.type?.key === typeKey);
    return hit ? hit.id : null;
  }

  /**
   * After navigation to classic / v1 screening table: align chip filter with list programme (new prospect)
   * and expand the matching record. Re-renders on the same view preserve manual expand/collapse.
   */
  function applyClassicScreeningRowExpandFromNavigation() {
    const onScr =
      (state.route === "detail" && state.detailTab === "screening") ||
      (state.route === "prospectv3" && state.prospectV3Tab === "screenings");
    if (!onScr) {
      lastScreeningExpandSig = null;
      return;
    }
    const rid = state.routeId || state.detail?.rowKey || "";
    const sig = `${state.route}|${rid}`;
    if (lastScreeningExpandSig === sig) return;
    lastScreeningExpandSig = sig;
    const prog = state.detail?.activeListProgram;
    const fk = classicScreeningFilterKeyFromListProgram(prog);
    if (fk) state.classicScreeningFilter = fk;
    const id = pickClassicScreeningRecordIdForListProgram(prog);
    state.classicScreeningExpandedId = id || null;
  }

  function getClassicScreeningMergedRawById(id) {
    const sid = id != null ? String(id) : "";
    if (!sid) return null;
    return getClassicScreeningRecordsRawMerged().find((x) => String(x.id) === sid) || null;
  }

  function persistClassicScreeningUpdateFromForm() {
    const id = state.classicScreeningUpdateModalId;
    if (!id) return false;
    const merged = getClassicScreeningMergedRawById(id);
    if (!merged) return false;
    const isMmg = merged.type?.key === "MMG";
    const submitted = document.getElementById("csu-submitted")?.value?.trim() || "—";
    const statusKey =
      document.getElementById("csu-status-value")?.value?.trim() ||
      document.querySelector("#classic-screening-update-modal [data-csu-status].is-selected")?.getAttribute("data-csu-status") ||
      "qualified";
    const status =
      CLASSIC_SCREENING_STATUS_BY_KEY[statusKey] || CLASSIC_SCREENING_STATUS_BY_KEY.qualified;
    const d = document.getElementById("csu-appt-date")?.value?.trim() || "";
    const t = document.getElementById("csu-appt-time")?.value?.trim() || "";
    const appointment = d && t ? { date: d, time: t } : null;
    const venue = document.getElementById("csu-venue")?.value?.trim() || "—";
    const attendance = document.getElementById("csu-attendance")?.value?.trim() || "";
    const result = document.getElementById("csu-result")?.value?.trim() || "";
    const nextReviewPeriod = document.getElementById("csu-next-review-period")?.value?.trim() || "";
    const nextReviewDate = document.getElementById("csu-next-review-date")?.value?.trim() || "";
    const patch = {
      submitted,
      status,
      appointment,
      venue,
      attendance,
      result,
      nextReviewPeriod,
      nextReviewDate,
      lastUpdatedBy: PORTAL_CURRENT_USER.name,
    };
    if (isMmg) {
      patch.appointmentType = String(document.getElementById("csu-appointment-type")?.value || "").trim();
    }
    state.classicScreeningEditById[id] = { ...(state.classicScreeningEditById[id] || {}), ...patch };
    return true;
  }

  function classicScreeningTypeCounts(records) {
    const out = { all: 0, MMG: 0, FIT: 0, PAP: 0 };
    (records || []).forEach((r) => {
      out.all += 1;
      const k = r?.type?.key;
      if (k === "MMG") out.MMG += 1;
      else if (k === "FIT") out.FIT += 1;
      else if (k === "PAP") out.PAP += 1;
    });
    return out;
  }

  function classicScreeningFilterKey() {
    const raw = String(state.classicScreeningFilter || "all").toUpperCase();
    if (raw === "MMG" || raw === "FIT" || raw === "PAP") return raw;
    return "all";
  }

  /** Status badge with leading dot (collapsible screening table reference). */
  function screeningRecordStatusPill(esc, statusKey, label) {
    const k = String(statusKey || "").toLowerCase();
    const mod =
      k === "booked"
        ? "screening-records-status--booked"
        : k === "completed" || k === "screened"
          ? "screening-records-status--screened"
          : "screening-records-status--qualified";
    return `<span class="screening-records-status ${mod}">${esc(label)}</span>`;
  }

  function screeningRecordTypeClass(tone) {
    const raw = String(tone || "sr-type--mmg");
    const mod = raw.startsWith("sr-type--") ? raw.slice("sr-type--".length) : "mmg";
    return `screening-records-type--${mod}`;
  }

  const SCREENING_TABLE_TASK_STAGES = ["qualified", "booked", "screened"];

  function stageChecklistLabelCount(stage) {
    const L = window.WD_STAGE_CHECKLISTS;
    const arr = L && L[stage] && Array.isArray(L[stage]) ? L[stage] : [];
    return arr.length;
  }

  function stageChecklistLabelsForRecord(stage) {
    const L = window.WD_STAGE_CHECKLISTS;
    return L && L[stage] && Array.isArray(L[stage]) ? L[stage] : [];
  }

  function classicScreeningRecordTaskStage(record) {
    const k = String(record?.status?.key || "").toLowerCase();
    if (k === "booked") return "booked";
    if (k === "screened" || k === "completed") return "screened";
    return "qualified";
  }

  function ensureClassicScreeningTaskBucket(recordId) {
    const id = recordId != null ? String(recordId) : "";
    if (!id) return null;
    if (!state.classicScreeningTaskDoneByRecordId[id]) {
      state.classicScreeningTaskDoneByRecordId[id] = { qualified: [], booked: [], screened: [] };
    }
    const b = state.classicScreeningTaskDoneByRecordId[id];
    for (const st of SCREENING_TABLE_TASK_STAGES) {
      const n = stageChecklistLabelCount(st);
      if (!Array.isArray(b[st])) b[st] = [];
      while (b[st].length < n) b[st].push(false);
      if (b[st].length > n) b[st] = b[st].slice(0, n);
    }
    return b;
  }

  function classicScreeningTaskProgressForRecord(record) {
    const id = record?.id != null ? String(record.id) : "";
    if (!id) return { done: 0, total: 0, stage: "qualified" };
    const stage = classicScreeningRecordTaskStage(record);
    ensureClassicScreeningTaskBucket(id);
    const labels = stageChecklistLabelsForRecord(stage);
    const arr = state.classicScreeningTaskDoneByRecordId[id][stage];
    const total = labels.length;
    const done = total ? arr.filter(Boolean).length : 0;
    return { done, total, stage };
  }

  /** Update modal + table checklist UI without full renderApp (avoids flicker on each checkbox toggle). */
  function patchClassicScreeningTaskChecklistDom(recordId, checkboxInput) {
    const rid = recordId != null ? String(recordId) : "";
    if (!rid || !(checkboxInput instanceof HTMLInputElement)) return;
    const row = checkboxInput.closest(".detail-task-row");
    if (row) row.classList.toggle("is-done", checkboxInput.checked);
    const raw = getClassicScreeningMergedRawById(rid);
    const norm = raw ? normalizeClassicScreeningRecord(raw) : null;
    if (!norm) return;
    const prog = classicScreeningTaskProgressForRecord(norm);
    const modal = document.getElementById("classic-screening-tasks-modal");
    if (modal) {
      const cnt = modal.querySelector(".detail-overview-task-count");
      if (cnt) cnt.textContent = `${prog.done} / ${prog.total} completed`;
    }
    const tr = Array.from(document.querySelectorAll("tr[data-classic-screening-row]")).find(
      (r) => r.getAttribute("data-classic-screening-row") === rid
    );
    if (tr) {
      const wrap = tr.querySelector(".screening-records-checklist");
      const meter = tr.querySelector(".screening-records-checklist__meter");
      if (meter) {
        meter.textContent = prog.total ? `${prog.done}/${prog.total}` : "—";
        const stagePretty = prog.stage.charAt(0).toUpperCase() + prog.stage.slice(1);
        meter.setAttribute("title", `Tasks completed for current status (${stagePretty})`);
      }
      if (wrap) {
        const complete = prog.total > 0 && prog.done === prog.total;
        wrap.classList.toggle("screening-records-checklist--complete", complete);
      }
    }
  }

  function renderClassicScreeningTasksModal() {
    const sid = state.classicScreeningTasksModalId;
    if (!sid) return "";
    const record = getClassicScreeningMergedRawById(sid);
    if (!record) return "";
    const norm = normalizeClassicScreeningRecord(record);
    if (!norm) return "";
    const e = escapeAttr;
    const stage = classicScreeningRecordTaskStage(norm);
    ensureClassicScreeningTaskBucket(sid);
    const labels = stageChecklistLabelsForRecord(stage);
    const doneArr = state.classicScreeningTaskDoneByRecordId[sid][stage];
    const stagePretty = stage.charAt(0).toUpperCase() + stage.slice(1);
    const doneCount = labels.length ? doneArr.filter(Boolean).length : 0;
    const totalCount = labels.length;
    const listHtml =
      labels.length === 0
        ? `<p class="placeholder-block" style="margin:0">Task checklist is unavailable (load detail-panels.js for stage labels).</p>`
        : `<ul class="detail-task-list">${labels
            .map((lbl, i) => {
              const done = !!doneArr[i];
              const ck = done ? " checked" : "";
              const tid = `cst-${String(sid).replace(/[^a-zA-Z0-9_-]/g, "_")}-${stage}-${i}`;
              return `<li class="detail-task-row detail-task-row--checklist${done ? " is-done" : ""}">
            <input type="checkbox" class="detail-task-check" id="${e(tid)}" data-classic-screening-task="" data-cst-record="${e(
                sid
              )}" data-cst-stage="${e(stage)}" data-cst-index="${e(String(i))}"${ck} />
            <label class="detail-task-text" for="${e(tid)}">${e(lbl)}</label>
          </li>`;
            })
            .join("")}</ul>`;
    return `
      <div class="ui-dialog-overlay" id="classic-screening-tasks-modal" role="presentation">
        <div class="ui-dialog ui-dialog--screening-tasks" role="dialog" aria-modal="true" aria-labelledby="classic-screening-tasks-title">
          <div class="ui-dialog__close">
            <button type="button" class="ui-btn ui-btn--ghost ui-btn--icon" data-classic-screening-tasks-dismiss aria-label="Close">${icons.x}</button>
          </div>
          <div class="ui-dialog__body screening-tasks-modal__body">
            <section class="detail-card detail-card--tasks screening-tasks-modal__checklist">
              <div class="panel-section__head">
                <h3 class="detail-card__heading-primary" id="classic-screening-tasks-title">${e(stagePretty)} — tasks</h3>
                <span class="detail-overview-task-count">${e(String(doneCount))} / ${e(String(totalCount))} completed</span>
              </div>
              ${listHtml}
            </section>
          </div>
          <div class="ui-dialog__footer">
            <div class="ui-dialog__footer-actions">
              <button type="button" class="ui-btn ui-btn--default ui-btn--sm" data-classic-screening-tasks-dismiss>Done</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /** Listing-style `table-card` + `data-table`, with toolbar filters and collapsible detail rows (no extra detail-card shell). */
  function renderClassicScreeningRecordsPanel(esc) {
    const records = getClassicScreeningRecordsCatalog();
    const counts = classicScreeningTypeCounts(records);
    const filterKey = classicScreeningFilterKey();
    const visible = filterKey === "all" ? records : records.filter((r) => r.type?.key === filterKey);
    const exp = state.classicScreeningExpandedId;

    const tbody =
      visible.length === 0
        ? `<tr><td colspan="10"><p class="placeholder-block" style="margin:0">No screening records found.</p></td></tr>`
        : visible
            .map((r) => {
              const open = exp === r.id;
              const appt = r.appointment
                ? `<div class="cell-stack"><span>${esc(r.appointment.date)}</span><span class="cell-muted">${esc(
                    r.appointment.time
                  )}</span></div>`
                : `<span class="screening-records-appt__empty">— No appointment yet</span>`;
              const venue = r.venue && r.venue !== "—" ? esc(r.venue) : `<span class="screening-records-appt__empty">—</span>`;
              const attendance = esc(classicScreeningAttendanceDisplay(r));
              const prog = classicScreeningTaskProgressForRecord(r);
              const progText = prog.total ? `${prog.done}/${prog.total}` : "—";
              const progComplete = prog.total > 0 && prog.done === prog.total;
              const checklistCell = `<div class="screening-records-checklist${progComplete ? " screening-records-checklist--complete" : ""}"><span class="screening-records-checklist__meter" title="Tasks completed for current status (${esc(
                prog.stage
              )})">${esc(progText)}</span></div>`;
              const tasksBtn = `<button type="button" class="screening-records-btn screening-records-btn--outline" data-table-row-stop data-classic-screening-tasks="${esc(
                r.id
              )}">Tasks</button>`;
              const updateBtn = `<button type="button" class="screening-records-btn screening-records-btn--outline" data-table-row-stop data-classic-screening-update="${esc(
                r.id
              )}">Update</button>`;
              const actionCell = `<div class="screening-records-actions">${tasksBtn}${updateBtn}</div>`;
              const typeClass = screeningRecordTypeClass(r.type?.tone);
              const detailGrid = (r.expandedDetails || [])
                .map(
                  ([k, v]) =>
                    `<div class="data-table__detail-kv"><div class="data-table__detail-k">${esc(String(k))}</div><div class="data-table__detail-v">${esc(
                      String(v)
                    )}</div></div>`
                )
                .join("");
              return `
              <tr class="data-table__row--expandable ${open ? "is-open" : ""}" data-classic-screening-row="${esc(r.id)}" tabindex="0">
                <td class="data-table__td--narrow" aria-hidden="true"><span class="data-table__expand-chevron-wrap" aria-hidden="true">${open ? icons.rowExpandOpen : icons.rowExpandClosed}</span></td>
                <td>${esc(r.submitted)}</td>
                <td><span class="screening-records-type ${typeClass}">${esc(r.type.label)}</span></td>
                <td>${screeningRecordStatusPill(esc, r.status?.key, r.status?.label || "—")}</td>
                <td>${appt}</td>
                <td>${venue}</td>
                <td>${esc(classicScreeningAppointmentTypeDisplay(r))}</td>
                <td>${attendance}</td>
                <td class="data-table__td--checklist">${checklistCell}</td>
                <td class="data-table__td--actions" data-table-row-stop>${actionCell}</td>
              </tr>
              <tr class="data-table__row--detail ${open ? "is-open" : ""}" aria-hidden="${open ? "false" : "true"}">
                <td colspan="10">
                  <div class="data-table__detail-inner">
                    <div class="data-table__detail-grid">${detailGrid}</div>
                  </div>
                </td>
              </tr>`;
            })
            .join("");

    return `<div class="table-card table-card--screening-records">
          <div class="screening-records-toolbar">
            <div class="ui-chip-group" role="group" aria-label="Screening type filters">
              <button type="button" class="ui-chip ${filterKey === "all" ? "is-selected" : ""}" data-classic-screening-filter="all" aria-pressed="${filterKey === "all"}">All (${counts.all})</button>
              <button type="button" class="ui-chip ${filterKey === "MMG" ? "is-selected" : ""}" data-classic-screening-filter="MMG" aria-pressed="${filterKey === "MMG"}">Mammogram (${counts.MMG})</button>
              <button type="button" class="ui-chip ${filterKey === "FIT" ? "is-selected" : ""}" data-classic-screening-filter="FIT" aria-pressed="${filterKey === "FIT"}">FIT Kit (${counts.FIT})</button>
              <button type="button" class="ui-chip ${filterKey === "PAP" ? "is-selected" : ""}" data-classic-screening-filter="PAP" aria-pressed="${filterKey === "PAP"}">HPV/PAP (${counts.PAP})</button>
            </div>
          </div>
          <table class="data-table data-table--screening-records" aria-label="Screening records">
            <thead>
              <tr>
                <th scope="col" class="data-table__th--narrow" aria-hidden="true"></th>
                <th scope="col">Submitted</th>
                <th scope="col">Type</th>
                <th scope="col">Status</th>
                <th scope="col">Appointment</th>
                <th scope="col">Venue</th>
                <th scope="col">Appointment Type</th>
                <th scope="col">Attendance</th>
                <th scope="col" class="data-table__th--checklist">Checklist</th>
                <th scope="col" class="data-table__th--actions">Actions</th>
              </tr>
            </thead>
            <tbody>${tbody}</tbody>
          </table>
        </div>`;
  }

  window.WD_renderClassicScreeningRecordsPanel = renderClassicScreeningRecordsPanel;

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
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "program":
          cmp = a.program.localeCompare(b.program);
          break;
        case "dateRegistered":
          cmp = dateRegisteredSortValue(a.dateRegistered) - dateRegisteredSortValue(b.dateRegistered);
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
        case "attendance":
          cmp = classicScreeningAttendanceDisplay({ attendance: a.attendance }).localeCompare(
            classicScreeningAttendanceDisplay({ attendance: b.attendance })
          );
          break;
        case "source":
          cmp = a.sourceDetail.localeCompare(b.sourceDetail);
          break;
        case "nextReview":
          cmp = dateRegisteredSortValue(a.nextReview) - dateRegisteredSortValue(b.nextReview);
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

  /** Risk badge: same pill as list table + severity dot (table, Kanban, prospect detail). */
  function riskLevelIndicator(risk) {
    const mod = risk === "high" ? "pill--high" : risk === "medium" ? "pill--medium" : "pill--low";
    const label = risk === "high" ? "High Risk" : risk === "medium" ? "Medium Risk" : "Low Risk";
    return `<span class="risk-level pill ${mod}" role="status"><span class="risk-level__dot" aria-hidden="true"></span><span class="risk-level__label">${escapeAttr(
      label
    )}</span></span>`;
  }

  function riskPill(risk) {
    return riskLevelIndicator(risk);
  }

  function detailProgramTagsHtml(tags) {
    const list = Array.isArray(tags) ? tags.filter(Boolean) : [];
    if (!list.length) return "";
    return `
      <ul class="detail-hero__tags" aria-label="Screening programmes">
        ${list.map((t) => `<li><span class="detail-hero__tag">${escapeAttr(t)}</span></li>`).join("")}
      </ul>`;
  }

  /** Singapore Cancer Society branding — top bar logo (see assets/branding/scs-logo.png). */
  function renderScsLogo() {
    return `<img class="app-header__logo" src="assets/branding/scs-logo.png" alt="Singapore Cancer Society Logo" width="200" height="64" />`;
  }

  /** Legal entity line — keep in sync with `_figma_export/src/components/Footer.tsx` (`FOOTER_LEGAL_NAME`). */
  const APP_FOOTER_LEGAL_NAME = "WERKDONE PTE LTD.";

  /**
   * Global shell footer (list, detail, registration, landing).
   * @param {Object} [options]
   * @param {"default"|"registration-end"|"landing"} [options.variant] registration-end = scrolls with form; landing = self-reg chooser
   */
  function renderAppFooter(options) {
    options = options || {};
    const year = new Date().getFullYear();
    const v = options.variant || "default";
    let cls = "app-footer";
    if (v === "registration-end") cls += " app-footer--registration-end";
    else if (v === "landing") cls += " reg-landing__footer";
    return `<footer class="${cls}" role="contentinfo">Copyright © ${year} ${APP_FOOTER_LEGAL_NAME}</footer>`;
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
    const prospectContext =
      state.route === "detail" || state.route === "screening" || state.route === "prospectv3";
    const rid = state.detail?.rowKey ? encodeURIComponent(state.detail.rowKey) : encodeURIComponent(DETAIL_DEFAULT.rowKey);
    const switcher = prospectContext
      ? `
        <div class="app-header__switcher" role="group" aria-label="Prospect view switcher">
          <a class="ui-btn ui-btn--${state.route === "detail" ? "default" : "outline"} ui-btn--sm" href="#/prospect/${escapeAttr(
            rid
          )}">classic</a>
          <a class="ui-btn ui-btn--${state.route === "prospectv3" ? "default" : "outline"} ui-btn--sm" href="#/prospectv3/${escapeAttr(
            rid
          )}">v1</a>
        </div>
      `
      : "";
    return `
      <header class="app-header">
        <div class="app-header__brand">
          ${renderScsLogo()}
        </div>
        <div class="app-header__actions">
          ${switcher}
          <button type="button" class="user-chip" aria-label="User menu">
            <span class="user-chip__avatar">${escapeAttr(portalCurrentUserInitials())}</span>
            <span><span class="user-name">${escapeAttr(PORTAL_CURRENT_USER.name)}</span><span class="sep">|</span><span class="user-role">${escapeAttr(
              PORTAL_CURRENT_USER.role
            )}</span></span>
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

  function normListPipelineStatus(r) {
    return PIPELINE_KEYS.includes(r.status) ? r.status : "qualified";
  }

  /** KPI row on prospect listing — counts respect program, search, and list filters. */
  function computeProspectListSummary(rows) {
    let qualified = 0;
    let booked = 0;
    let screened = 0;
    let followUp = 0;
    for (const r of rows) {
      const st = normListPipelineStatus(r);
      if (st === "qualified") qualified++;
      else if (st === "booked") booked++;
      else if (st === "screened") screened++;
      const a = String(r.attendance || "").trim().toLowerCase();
      if (a === "no show") followUp++;
    }
    return { total: rows.length, qualified, booked, screened, followUp };
  }

  /** All `PROSPECTS` enrolment rows for the current prospect (same person, multiple programmes). */
  function prospectEnrolmentRowsForDetail(d) {
    if (!d) return [];
    if (d.id != null) {
      const id = String(d.id);
      const rows = PROSPECTS.filter((x) => String(x.id) === id);
      if (rows.length) return rows;
    }
    if (d.rowKey) {
      const hit = PROSPECTS.find((x) => x.rowKey === d.rowKey);
      return hit ? [hit] : [];
    }
    return [];
  }

  /** Decorative trend deltas (no historical API in prototype); scales loosely with totals. */
  function prospectListSummaryTrendDeltas(s) {
    return {
      total: s.total === 0 ? 0 : Math.max(1, Math.round(s.total * 0.081)),
      qualified: s.qualified === 0 ? 0 : Math.max(1, Math.round(s.qualified * 0.11)),
      booked: s.booked === 0 ? 0 : Math.max(1, Math.round(s.booked * 0.148)),
      screened: s.screened === 0 ? 0 : Math.max(1, Math.round(s.screened * 0.066)),
      followUp: s.followUp,
    };
  }

  /**
   * KPI cards (listing + V1 overview): same markup and logic as the main prospect list strip.
   * @param {object[]} rows Enrolment rows with `status` + `attendance` (e.g. `PROSPECTS` slice).
   * @param {{ ariaLabel?: string, sectionClass?: string, gridOnly?: boolean }} [options] `gridOnly` = no outer `<section>`, only the five `<article>` cards in a grid.
   */
  function renderProspectSummarySection(rows, options) {
    options = options || {};
    const gridOnly = !!options.gridOnly;
    const ariaLabel = options.ariaLabel != null ? String(options.ariaLabel) : "Prospect summary";
    const sectionExtra = options.sectionClass != null ? String(options.sectionClass).trim() : "";
    const s = computeProspectListSummary(rows);
    const d = prospectListSummaryTrendDeltas(s);
    const esc = escapeAttr;
    const trendPositive = (delta, hint) => {
      if (delta <= 0) {
        return `<div class="prospect-summary-card__trend prospect-summary-card__trend--muted"><span class="prospect-summary-card__hint">${esc(hint)}</span></div>`;
      }
      return `<div class="prospect-summary-card__trend prospect-summary-card__trend--positive">
        <span class="prospect-summary-card__trend-icon">${icons.trendUp}</span>
        <span class="prospect-summary-card__delta">${esc(String(delta))}</span>
        <span class="prospect-summary-card__hint">${esc(hint)}</span>
      </div>`;
    };
    const trendFollowUp = () => {
      if (s.followUp === 0) {
        return `<div class="prospect-summary-card__trend prospect-summary-card__trend--muted"><span class="prospect-summary-card__hint">${esc(
          "No new no-shows"
        )}</span></div>`;
      }
      return `<div class="prospect-summary-card__trend prospect-summary-card__trend--alert">
        <span class="prospect-summary-card__trend-icon">${icons.trendUp}</span>
        <span class="prospect-summary-card__delta">${esc(String(d.followUp))}</span>
        <span class="prospect-summary-card__hint">${esc("new no-shows")}</span>
      </div>`;
    };
    const gridAttrs = gridOnly
      ? ` class="prospect-summary__grid v1-overview-kpi-grid" role="group" aria-label="${esc(ariaLabel)}"`
      : ` class="prospect-summary__grid"`;
    const gridHtml = `
        <div${gridAttrs}>
          <article class="prospect-summary-card prospect-summary-card--total">
            <h3 class="prospect-summary-card__label">Total cases</h3>
            <p class="prospect-summary-card__value">${esc(String(s.total))}</p>
            ${trendPositive(d.total, "from last month")}
          </article>
          <article class="prospect-summary-card prospect-summary-card--qualified">
            <h3 class="prospect-summary-card__label">Qualified</h3>
            <p class="prospect-summary-card__value">${esc(String(s.qualified))}</p>
            ${trendPositive(d.qualified, "new intakes")}
          </article>
          <article class="prospect-summary-card prospect-summary-card--booked">
            <h3 class="prospect-summary-card__label">Booked</h3>
            <p class="prospect-summary-card__value">${esc(String(s.booked))}</p>
            ${trendPositive(d.booked, "new appointments")}
          </article>
          <article class="prospect-summary-card prospect-summary-card--screened">
            <h3 class="prospect-summary-card__label">Screened</h3>
            <p class="prospect-summary-card__value">${esc(String(s.screened))}</p>
            ${trendPositive(d.screened, "this week")}
          </article>
          <article class="prospect-summary-card prospect-summary-card--followup">
            <h3 class="prospect-summary-card__label">Follow-up needed</h3>
            <p class="prospect-summary-card__value">${esc(String(s.followUp))}</p>
            ${trendFollowUp()}
          </article>
        </div>`;
    if (gridOnly) return gridHtml;
    const sectionClasses = ["prospect-summary", sectionExtra].filter(Boolean).join(" ");
    return `
      <section class="${esc(sectionClasses)}" aria-label="${esc(ariaLabel)}">${gridHtml}
      </section>`;
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
            <a href="#/register/mammobus" class="title-dropdown__option" role="menuitem">Mammogram Screening Registration</a>
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

  /**
   * Shared breadcrumb: prospect detail + screening registration (consistent markup + styles).
   * @param {{ label: string, href?: string }[]} items Last segment is current page (omit href on last item).
   * @param {"page"|"registration"} variant page = default spacing; registration = 14px strip (screening + prospect detail).
   */
  function renderAppBreadcrumb(items, variant) {
    const mod = variant === "registration" ? "registration" : "page";
    const chunks = [];
    (items || []).forEach((it, i) => {
      const last = i === (items || []).length - 1;
      const label = escapeAttr(it.label);
      const hasHref = it.href != null && String(it.href) !== "";
      if (hasHref && !last) {
        chunks.push(`<a class="app-breadcrumb__link" href="${escapeAttr(it.href)}">${label}</a>`);
      } else {
        chunks.push(`<span class="app-breadcrumb__current">${label}</span>`);
      }
      if (!last) {
        chunks.push(`<span class="app-breadcrumb__sep" aria-hidden="true">›</span>`);
      }
    });
    return `<nav class="app-breadcrumb app-breadcrumb--${mod}" aria-label="Breadcrumb">${chunks.join("")}</nav>`;
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
              ${renderSortableTh("Name", "name")}
              ${renderSortableTh("Program", "program")}
              ${renderSortableTh("Date registered", "dateRegistered")}
              ${renderSortableTh("Contact", "contact")}
              ${renderSortableTh("Status", "status")}
              ${renderSortableTh("Attendance", "attendance")}
              ${renderSortableTh("Source", "source")}
              ${renderSortableTh("Next review", "nextReview")}
              ${renderSortableTh("Risk", "risk")}
              <th scope="col" class="data-table__th--actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (r) => `
              <tr tabindex="0" data-nav-prospect="${escapeAttr(r.rowKey)}">
                ${renderProspectNameCell(r)}
                <td>${escapeAttr(programDisplayLabel(r.program))}</td>
                <td>${escapeAttr(formatDateRegisteredDisplay(r.dateRegistered))}</td>
                <td>
                  <div class="cell-stack">
                    <span>${escapeAttr(r.phone)}</span>
                    <span class="cell-muted">${escapeAttr(r.email)}</span>
                  </div>
                </td>
                <td>${statusPill(r.status)}</td>
                <td>${escapeAttr(classicScreeningAttendanceDisplay({ attendance: r.attendance }))}</td>
                <td>
                  <div class="cell-stack">
                    <span>${escapeAttr(r.sourceType)}</span>
                    <span class="cell-muted">${escapeAttr(r.sourceDetail)}</span>
                  </div>
                </td>
                <td>${escapeAttr(formatDateRegisteredDisplay(r.nextReview))}</td>
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

  function kanbanCardDemographics(p) {
    const g = (p.ageGender || "").trim();
    return g || "—";
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
            const attendance = classicScreeningAttendanceDisplay({ attendance: r.attendance });
            return `
        <article class="kanban-card" tabindex="0" data-kanban-card data-kanban-prospect="${escapeAttr(r.rowKey)}">
          <div class="kanban-card__program"><span class="pill">${escapeAttr(programDisplayLabel(r.program))}</span></div>
          <h2 class="kanban-card__name">${escapeAttr(r.name)}</h2>
          <div class="kanban-card__risk">${riskLevelIndicator(r.risk)}</div>
          <p class="kanban-card__meta">${escapeAttr(kanbanCardDemographics(r))}</p>
          <div class="kanban-card__attendance">
            <span>Attendance</span>
            <span class="kanban-card__attendance-value">${escapeAttr(attendance)}</span>
          </div>
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
    const filtered = getFilteredProspects();
    const summary = renderProspectSummarySection(filtered, { ariaLabel: "Prospect summary" });
    const toolbar = renderListToolbar();
    const body =
      state.view === "kanban"
        ? `<div class="kanban">${renderKanbanFromProspects()}</div>`
        : renderTable(getListTableRows());
    return `${summary}${toolbar}${body}`;
  }

  function normalizeDetailTab() {
    const legacy = { medical: "medical-history", other: "other-details" };
    if (typeof state.detailTab === "string") state.detailTab = state.detailTab.trim();
    if (legacy[state.detailTab]) state.detailTab = legacy[state.detailTab];
    if (state.detailTab === "overview") state.detailTab = "details";
    if (!DETAIL_TAB_IDS.includes(state.detailTab)) state.detailTab = "details";
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

  function renderActivityTimelineDrawer() {
    if (state.route !== "detail") return "";
    const d = state.detail;
    const feed = buildDetailActivityFeed(d.rowKey, d);
    const inner =
      typeof window.WD_renderActivityTimelineSection === "function"
        ? window.WD_renderActivityTimelineSection(escapeAttr, feed, { forDrawer: true })
        : `<p class="placeholder-block" style="margin:0">Activity timeline unavailable.</p>`;
    const open = state.activityTimelineDrawerOpen;
    return `
    <div class="activity-timeline-drawer${open ? " activity-timeline-drawer--open" : ""}" id="activity-timeline-drawer" aria-hidden="${open ? "false" : "true"}">
      <div class="activity-timeline-drawer__backdrop" data-activity-timeline-drawer-dismiss role="presentation"></div>
      <aside class="activity-timeline-drawer__panel" role="dialog" aria-modal="true" aria-labelledby="activity-timeline-drawer-title">
        <div class="activity-timeline-drawer__head">
          <h2 class="activity-timeline-drawer__title" id="activity-timeline-drawer-title">Activity timeline</h2>
          <button type="button" class="ui-btn ui-btn--ghost ui-btn--icon activity-timeline-drawer__close" data-activity-timeline-drawer-dismiss aria-label="Close">${icons.x}</button>
        </div>
        <div class="activity-timeline-drawer__body">
          ${inner}
        </div>
      </aside>
    </div>`;
  }

  function renderDetailPage() {
    normalizeDetailTab();
    const d = state.detail;
    const programTagsHtml = detailProgramTagsHtml(d.programTags);
    const tabs = [
      ["details", "Personal Details"],
      ["medical-history", "Medical History"],
      ["other-details", "Other Details"],
      ["screening", "Screening"],
      ["appointments", "Appointments"],
      ["documents", "Documents"],
      ["notes", "Notes"],
    ];
    return `
      ${renderAppBreadcrumb(
        [
          { label: "Prospect Management", href: "#/list" },
          { label: (d.name && String(d.name).trim()) || d.id },
        ],
        "registration"
      )}
      <div class="detail-hero">
        <div class="registration__toolbar-row detail-hero__toolbar-row">
          <a href="#/list" class="detail-hero__back" aria-label="Back to list">${icons.back}</a>
          <div class="registration__toolbar-titles">
            <h1 class="registration__title">${escapeAttr(d.name)}</h1>
            <p class="registration__subtitle">${escapeAttr(d.subtitle)}</p>
          </div>
          <div class="registration__toolbar-actions">
            <button type="button" class="btn btn--outline" data-detail-activity-timeline>Activity timeline</button>
          </div>
        </div>
        <div class="detail-hero__meta detail-hero__meta--tags">
          ${programTagsHtml.trim() ? programTagsHtml : ""}
          <span class="detail-hero__risk-inline">${riskLevelIndicator(d.risk)}</span>
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
      ${renderActivityTimelineDrawer()}
    `;
  }

  function v3BiodataChasDotHex(raw) {
    const t = String(raw || "").toLowerCase();
    if (t.includes("orange")) return "#F97316";
    if (t.includes("blue")) return "#3B82F6";
    if (t.includes("green")) return "#10B981";
    return "#CBD5E1";
  }

  /** First / last name for v3 biodata: prefer stored keys, else split list `d.name`. */
  function v3BiodataNameParts(d, details) {
    const parts = String(d.name || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    const fbLast = parts.length ? parts[parts.length - 1] : "";
    const fbFirst = parts.length > 1 ? parts.slice(0, -1).join(" ") : parts[0] || "";
    const first =
      details.firstName != null && String(details.firstName).trim() !== "" ? String(details.firstName).trim() : fbFirst;
    const last =
      details.lastName != null && String(details.lastName).trim() !== "" ? String(details.lastName).trim() : fbLast;
    return { firstName: first, lastName: last };
  }

  function v3BiodataPreferredLangString(details) {
    if (Array.isArray(details.preferredLanguages)) return details.preferredLanguages.filter(Boolean).join(", ");
    if (details.preferredLanguages != null && String(details.preferredLanguages).trim())
      return String(details.preferredLanguages).trim();
    return String(details.preferredLanguage || "").trim();
  }

  function v3BiodataAddressLine(details) {
    if (details.address != null && String(details.address).trim()) return String(details.address).trim();
    const bits = [details.block, details.street, details.floor, details.unit].filter(
      (x) => x != null && String(x).trim() !== ""
    );
    return bits.length ? bits.join(", ") : "";
  }

  function v3BiodataHealthierSgLabel(stored) {
    const c = healthierSgCanonicalStored(stored);
    const pair = V3_BIODATA_OPTIONS.healthierSg.find(([k]) => k === c);
    return pair ? pair[1] : stored != null && String(stored).trim() ? String(stored).trim() : "—";
  }

  function v3BiodataControlWrap(innerHtml) {
    return `<span class="bio-v bio-v--control">${innerHtml}</span>`;
  }

  function v3BiodataSelectSimple(e, field, current, optionStrings, placeholderLabel) {
    const val = current != null ? String(current) : "";
    const opts = (optionStrings || [])
      .map((opt) => `<option value="${e(opt)}"${val === opt ? " selected" : ""}>${e(opt)}</option>`)
      .join("");
    return v3BiodataControlWrap(
      `<select class="bio-select" data-v3-biodata-field="${e(field)}"><option value="">${e(
        placeholderLabel
      )}</option>${opts}</select>`
    );
  }

  function v3BiodataSelectValueLabel(e, field, current, pairs, placeholderLabel) {
    const val = String(current || "").trim().toLowerCase();
    const opts = (pairs || [])
      .map(([v, lbl]) => `<option value="${e(v)}"${val === String(v).toLowerCase() ? " selected" : ""}>${e(lbl)}</option>`)
      .join("");
    return v3BiodataControlWrap(
      `<select class="bio-select" data-v3-biodata-field="${e(field)}"><option value="">${e(
        placeholderLabel
      )}</option>${opts}</select>`
    );
  }

  function v3BiodataTextInput(e, field, raw, opts) {
    opts = opts || {};
    const type = opts.type || "text";
    const ph = opts.placeholder != null ? ` placeholder="${e(String(opts.placeholder))}"` : "";
    const extra = opts.extra || "";
    const cls = opts.mono ? " bio-input--mono" : "";
    const val = raw != null ? String(raw) : "";
    return v3BiodataControlWrap(
      `<input type="${e(type)}" class="bio-input${cls}" data-v3-biodata-field="${e(field)}" value="${e(val)}"${ph}${extra} />`
    );
  }

  function v3BiodataTextarea(e, field, raw, rows) {
    const r = rows != null ? Number(rows) : 4;
    const val = raw != null ? String(raw) : "";
    return v3BiodataControlWrap(`<textarea class="bio-textarea" data-v3-biodata-field="${e(field)}" rows="${r}">${e(val)}</textarea>`);
  }

  function v3BiodataPhoneRow(e, raw) {
    const val = raw != null ? String(raw) : "";
    return v3BiodataControlWrap(`<div class="bio-phone-inline">
      <input type="text" class="bio-input bio-input--prefix" value="+65" disabled aria-label="Country code" />
      <input type="tel" class="bio-input bio-input--phone" data-v3-biodata-field="contact" value="${e(
        val
      )}" placeholder="E.g. 8123 4567" />
    </div>`);
  }

  function v3BiodataPreferredLangMulti(e, details) {
    const selected = new Set(
      v3BiodataPreferredLangString(details)
        .split(/[,;]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    );
    const boxes = V3_BIODATA_OPTIONS.preferredLanguages.map((opt) => {
      const sid = `v3bio-lang-${String(opt).replace(/[^a-zA-Z0-9_-]/g, "")}`;
      const ck = selected.has(opt) ? " checked" : "";
      return `<label class="v1-bio2__check-label" for="${e(sid)}"><input type="checkbox" id="${e(sid)}" value="${e(
        opt
      )}"${ck} /> ${e(opt)}</label>`;
    }).join("");
    return v3BiodataControlWrap(
      `<div class="v1-bio2__lang-multi" role="group" aria-label="Preferred languages" data-v3-biodata-multi="preferredLanguages">${boxes}</div>`
    );
  }

  function v3BiodataDobEdit(e, details) {
    const raw = details.dob || details.dateOfBirth || "";
    const displayVal =
      typeof window.WD_normalizeDateDisplay === "function" ? window.WD_normalizeDateDisplay(String(raw)) : String(raw);
    return v3BiodataControlWrap(`<div class="bio-field-date field__date">
      <input class="field__date-text bio-input bio-input--in-date" type="text" data-v3-biodata-field="dob" value="${e(
        displayVal
      )}" placeholder="DD-MM-YYYY" inputmode="numeric" autocomplete="off" maxlength="10" />
      <button type="button" class="field__date-btn" aria-label="Choose date" title="Choose date"></button>
      <input type="date" class="field__date-native" tabindex="-1" aria-hidden="true" />
    </div>`);
  }

  function v3BiodataChasEditBlock(e, details) {
    const cur = details.chasCardType != null ? String(details.chasCardType) : "";
    const chasDot = v3BiodataChasDotHex(cur);
    const opts = V3_BIODATA_OPTIONS.chasCardType.map(
      (opt) => `<option value="${e(opt)}"${cur === opt ? " selected" : ""}>${e(opt)}</option>`
    ).join("");
    return `<span class="bio-v bio-v--chas bio-v--control"><span class="bio-chas-dot" style="background:${e(
      chasDot
    )}" aria-hidden="true"></span><select class="bio-select bio-select--chas" data-v3-biodata-field="chasCardType"><option value="">${e(
      "Select CHAS Card Type"
    )}</option>${opts}</select></span>`;
  }

  /** Checkbox stack for modal (classic `fieldCheckboxMulti` options). */
  function v3BiodataLangCheckboxesModal(e, details) {
    const selected = new Set(
      v3BiodataPreferredLangString(details)
        .split(/[,;]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    );
    const boxes = V3_BIODATA_OPTIONS.preferredLanguages.map((opt) => {
      const sid = `v3bio-mod-lang-${String(opt).replace(/[^a-zA-Z0-9_-]/g, "")}`;
      const ck = selected.has(opt) ? " checked" : "";
      return `<label class="registration__check-label" for="${e(sid)}"><input type="checkbox" id="${e(
        sid
      )}" value="${e(opt)}"${ck} /> ${e(opt)}</label>`;
    }).join("");
    return `<div class="registration__checkbox-stack" data-v3-biodata-multi="preferredLanguages">${boxes}</div>`;
  }

  /** Same masking as `detail-panels.js` `maskNricForProfileDisplay` (classic prospect profile). */
  function v3MaskNricForProfileDisplay(raw) {
    const s = String(raw || "").trim();
    if (!s) return "—";
    if (s.length <= 5) return `${s.charAt(0)}****`;
    return `${s.charAt(0)}****${s.slice(-4)}`;
  }

  function v3BiodataModalFormHtml(e, d, details) {
    const { firstName, lastName } = v3BiodataNameParts(d, details);
    const postalRaw =
      details.postalCode != null && String(details.postalCode).trim() !== ""
        ? String(details.postalCode).trim()
        : String(details.postal || "").trim();
    const dobRaw = details.dob || details.dateOfBirth || "";
    const dobDisplay =
      typeof window.WD_normalizeDateDisplay === "function" ? window.WD_normalizeDateDisplay(String(dobRaw)) : String(dobRaw);
    const hsgVal = healthierSgCanonicalStored(details.healthierSg);
    const optSel = (opts, cur) =>
      (opts || []).map((opt) => `<option value="${e(opt)}"${String(cur) === opt ? " selected" : ""}>${e(opt)}</option>`).join("");
    const optPairs = (pairs, cur) =>
      (pairs || [])
        .map(([v, lbl]) => `<option value="${e(v)}"${cur === String(v).toLowerCase() ? " selected" : ""}>${e(lbl)}</option>`)
        .join("");
    const chasCur = details.chasCardType != null ? String(details.chasCardType) : "";
    const nricRaw = details.nric != null ? String(details.nric) : "";
    const yesNo = (raw) => {
      const v = v3NormalizeYesNo(raw);
      return v;
    };
    const ynOpts = (raw) => {
      const cur = yesNo(raw);
      return `
        <option value="">—</option>
        <option value="yes"${cur === "yes" ? " selected" : ""}>Yes</option>
        <option value="no"${cur === "no" ? " selected" : ""}>No</option>
      `;
    };

    return `
      <div class="v3-biodata-modal__locked-fields" aria-hidden="true">
        <input type="hidden" data-v3-biodata-field="firstName" value="${e(firstName)}" />
        <input type="hidden" data-v3-biodata-field="lastName" value="${e(lastName)}" />
        <input type="hidden" data-v3-biodata-field="nric" value="${e(nricRaw)}" />
      </div>
      <h3 class="v3-biodata-modal__heading">Identity</h3>
      <div class="v3-biodata-modal__grid">
        <div class="field">
          <label for="v3bio-dob">Date of birth</label>
          <div class="field__date">
            <input class="field__date-text" id="v3bio-dob" type="text" data-v3-biodata-field="dob" value="${e(
              dobDisplay
            )}" placeholder="DD-MM-YYYY" inputmode="numeric" autocomplete="bday" maxlength="10" />
            <button type="button" class="field__date-btn" aria-label="Choose date" title="Choose date"></button>
            <input type="date" class="field__date-native" tabindex="-1" aria-hidden="true" />
          </div>
        </div>
        <div class="field">
          <label for="v3bio-age">Age</label>
          <input id="v3bio-age" type="text" data-v3-biodata-field="age" value="${e(details.age != null ? String(details.age) : "")}" placeholder="Years" inputmode="numeric" />
        </div>
        <div class="field">
          <label for="v3bio-gender">Gender</label>
          <select id="v3bio-gender" data-v3-biodata-field="gender">
            <option value="">Select Gender</option>
            ${optSel(V3_BIODATA_OPTIONS.gender, String(details.gender || ""))}
          </select>
        </div>
        <div class="field">
          <label for="v3bio-race">Race</label>
          <select id="v3bio-race" data-v3-biodata-field="race">
            <option value="">Select Race</option>
            ${optSel(V3_BIODATA_OPTIONS.race, String(details.race || ""))}
          </select>
        </div>
        <div class="field">
          <label for="v3bio-religion">Religion</label>
          <select id="v3bio-religion" data-v3-biodata-field="religion">
            <option value="">Select Religion</option>
            ${optSel(V3_BIODATA_OPTIONS.religion, String(details.religion || ""))}
          </select>
        </div>
        <div class="field field--full">
          <label for="v3bio-res">Residential status</label>
          <select id="v3bio-res" data-v3-biodata-field="residentialStatus">
            <option value="">Select Residential Status</option>
            ${optSel(V3_BIODATA_OPTIONS.residentialStatus, String(details.residentialStatus || ""))}
          </select>
        </div>
      </div>

      <h3 class="v3-biodata-modal__heading">Contact &amp; address</h3>
      <div class="v3-biodata-modal__grid">
        <div class="field field--full">
          <label for="v3bio-email">Email</label>
          <input id="v3bio-email" type="email" data-v3-biodata-field="email" value="${e(
            details.email != null ? String(details.email) : ""
          )}" placeholder="Enter your email" autocomplete="email" />
        </div>
        <div class="field field--full">
          <label for="v3bio-contact">Contact number</label>
          <div class="field__inline">
            <input type="text" class="field__prefix" value="+65" disabled aria-label="Country code" />
            <input id="v3bio-contact" type="tel" data-v3-biodata-field="contact" value="${e(
              details.contact || details.mobile || ""
            )}" placeholder="E.g. 8123 4567" autocomplete="tel-national" />
          </div>
        </div>
        <div class="field field--full">
          <span class="field__static-label">Preferred language</span>
          ${v3BiodataLangCheckboxesModal(e, details)}
        </div>
        <div class="field field--full">
          <span class="field__static-label">Residential address</span>
        </div>
        <div class="field">
          <label for="v3bio-block">Block</label>
          <input id="v3bio-block" type="text" data-v3-biodata-field="block" value="${e(
            details.block != null ? String(details.block) : ""
          )}" placeholder="E.g. 202" autocomplete="address-line1" />
        </div>
        <div class="field">
          <label for="v3bio-street">Street Name</label>
          <input id="v3bio-street" type="text" data-v3-biodata-field="street" value="${e(
            details.street != null ? String(details.street) : ""
          )}" placeholder="E.g. Pasir Drive" autocomplete="address-line2" />
        </div>
        <div class="field">
          <label for="v3bio-floor">Floor</label>
          <input id="v3bio-floor" type="text" data-v3-biodata-field="floor" value="${e(
            details.floor != null ? String(details.floor) : ""
          )}" placeholder="E.g. 50" />
        </div>
        <div class="field">
          <label for="v3bio-unit">Unit No</label>
          <input id="v3bio-unit" type="text" data-v3-biodata-field="unit" value="${e(
            details.unit != null ? String(details.unit) : ""
          )}" placeholder="E.g. 101 or 345" />
        </div>
        <div class="field">
          <label for="v3bio-postal">Postal Code</label>
          <input id="v3bio-postal" type="text" data-v3-biodata-field="postal" value="${e(postalRaw)}" placeholder="E.g. 123456" inputmode="numeric" maxlength="6" autocomplete="postal-code" />
        </div>
        <div class="field">
          <label for="v3bio-country">Country</label>
          <select id="v3bio-country" data-v3-biodata-field="country" aria-label="Country">
            <option value="">Select Country</option>
            ${optSel(V3_BIODATA_OPTIONS.addressCountry, String(details.country || ""))}
          </select>
        </div>
      </div>

      <h3 class="v3-biodata-modal__heading">Healthier SG &amp; subsidies</h3>
      <div class="v3-biodata-modal__grid">
        <div class="field field--full">
          <label for="v3bio-chas">CHAS card type</label>
          <select id="v3bio-chas" data-v3-biodata-field="chasCardType">
            <option value="">Select CHAS Card Type</option>
            ${optSel(V3_BIODATA_OPTIONS.chasCardType, chasCur)}
          </select>
        </div>
        <div class="field field--full">
          <label for="v3bio-hsg">Healthier SG enrolment</label>
          <select id="v3bio-hsg" data-v3-biodata-field="healthierSg">
            <option value="">Select Enrolment Status</option>
            ${optPairs(V3_BIODATA_OPTIONS.healthierSg, hsgVal)}
          </select>
        </div>
        <div class="field field--full">
          <label for="v3bio-firstmm">First-time mammogram screening</label>
          <select id="v3bio-firstmm" data-v3-biodata-field="firstMammogramScreening">
            <option value="">—</option>
            <option value="yes"${String(details.firstMammogramScreening || "").toLowerCase() === "yes" ? " selected" : ""}>Yes</option>
            <option value="no"${String(details.firstMammogramScreening || "").toLowerCase() === "no" ? " selected" : ""}>No</option>
          </select>
        </div>
        <div class="field">
          <label for="v3bio-yr">Year of last screening</label>
          <input id="v3bio-yr" type="text" data-v3-biodata-field="lastScreeningYear" value="${e(
            details.lastScreeningYear != null ? String(details.lastScreeningYear) : ""
          )}" placeholder="Enter year" />
        </div>
      </div>

      <h3 class="v3-biodata-modal__heading">Risk assessment</h3>
      <div class="v3-biodata-modal__grid">
        <div class="field field--full">
          <label for="v3bio-phx">Personal history of cancer</label>
          <textarea id="v3bio-phx" data-v3-biodata-field="personalCancerHistory" rows="4" placeholder="Enter details">${e(
            details.personalCancerHistory != null ? String(details.personalCancerHistory) : ""
          )}</textarea>
        </div>
        <div class="field field--full">
          <label for="v3bio-pre">Pre-existing conditions</label>
          <textarea id="v3bio-pre" data-v3-biodata-field="preExistingConditions" rows="4" placeholder="Enter details">${e(
            details.preExistingConditions != null ? String(details.preExistingConditions) : ""
          )}</textarea>
        </div>
        <div class="field field--full">
          <label for="v3bio-fam">Family history of cancer</label>
          <textarea id="v3bio-fam" data-v3-biodata-field="familyHistory" rows="4" placeholder="Enter details">${e(
            details.familyHistory != null ? String(details.familyHistory) : ""
          )}</textarea>
        </div>
      </div>

      <h3 class="v3-biodata-modal__heading">Engagement &amp; consent</h3>
      <div class="v3-biodata-modal__grid">
        <div class="field field--full">
          <label for="v3bio-source-type">How did you hear about us?</label>
          <input id="v3bio-source-type" type="text" data-v3-biodata-field="sourceType" value="${e(
            details.sourceType != null ? String(details.sourceType) : ""
          )}" placeholder="E.g. Walk-in registration" autocomplete="off" />
        </div>
        <div class="field field--full">
          <label for="v3bio-source-name">Campaign / event name</label>
          <input id="v3bio-source-name" type="text" data-v3-biodata-field="sourceName" value="${e(
            details.sourceName != null ? String(details.sourceName) : ""
          )}" placeholder="E.g. Community outreach 2026" autocomplete="off" />
        </div>
        <div class="field field--full">
          <label for="v3bio-pdpa">PDPA consent</label>
          <select id="v3bio-pdpa" data-v3-biodata-field="pdpaConsent">
            ${ynOpts(details.pdpaConsent)}
          </select>
        </div>
        <div class="field field--full">
          <label for="v3bio-edm">eDM subscription</label>
          <select id="v3bio-edm" data-v3-biodata-field="edmSubscription">
            ${ynOpts(details.edmSubscription)}
          </select>
        </div>
        <div class="field field--full">
          <label for="v3bio-consent-contact">Consent for SCS to contact</label>
          <select id="v3bio-consent-contact" data-v3-biodata-field="consentContact">
            ${ynOpts(details.consentContact)}
          </select>
        </div>
      </div>
    `;
  }

  function persistV3BiodataFormFromRoot(root) {
    const det = state.detailFormValues?.details;
    if (!root || !det) return false;
    root.querySelectorAll("[data-v3-biodata-field]").forEach((inp) => {
      const k = inp.getAttribute("data-v3-biodata-field");
      if (!k) return;
      det[k] = inp.value.trim();
    });
    root.querySelectorAll("[data-v3-biodata-multi]").forEach((group) => {
      const k = group.getAttribute("data-v3-biodata-multi");
      if (!k) return;
      const parts = [];
      group.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
        if (cb.checked) parts.push(cb.value);
      });
      det[k] = parts.join(", ");
    });
    if (det.preferredLanguages != null) {
      det.preferredLanguage = String(det.preferredLanguages).trim();
    }
    const fullName = `${det.firstName || ""} ${det.lastName || ""}`.trim();
    if (fullName) {
      det.fullName = fullName;
      state.detail.name = fullName;
      const prow = PROSPECTS.find((x) => x.rowKey === state.detail.rowKey);
      if (prow) prow.name = fullName;
    }
    const pc = det.postal;
    if (pc != null && String(pc).trim() !== "") {
      const pz = String(pc).trim();
      det.postal = pz;
      det.postalCode = pz;
    }
    /** Structured address is authoritative; drop legacy freeform `address` to match screening form + biodata display. */
    det.address = "";
    const prow2 = PROSPECTS.find((x) => x.rowKey === state.detail.rowKey);
    if (prow2) {
      if (det.contact) prow2.phone = det.contact;
      if (det.email) prow2.email = det.email;
    }
    return true;
  }

  function renderProspectV3BiodataModal() {
    if (!state.prospectV3BiodataModalOpen || state.route !== "prospectv3" || state.prospectV3Tab !== "biodata") return "";
    const d = state.detail;
    const details = state.detailFormValues?.details || {};
    const e = escapeAttr;
    const body = v3BiodataModalFormHtml(e, d, details);
    return `
      <div class="ui-dialog-overlay" id="prospect-v3-biodata-modal" role="presentation">
        <div class="ui-dialog ui-dialog--v3-biodata" role="dialog" aria-modal="true" aria-labelledby="v3-biodata-modal-title">
          <div class="ui-dialog__close">
            <button type="button" class="ui-btn ui-btn--ghost ui-btn--icon" data-v3-biodata-modal-dismiss aria-label="Close">${icons.x}</button>
          </div>
          <div class="ui-dialog__header">
            <h2 class="ui-dialog__title" id="v3-biodata-modal-title">Edit personal information</h2>
          </div>
          <div class="ui-dialog__body" data-v3-biodata-modal-root>${body}</div>
          <div class="ui-dialog__footer">
            <div class="ui-dialog__footer-actions">
              <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-v3-biodata-modal-dismiss>Cancel</button>
              <button type="button" class="ui-btn ui-btn--default ui-btn--sm" data-v3-biodata-modal-save>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderClassicScreeningUpdateModal() {
    if (!state.classicScreeningUpdateModalId) return "";
    const record = getClassicScreeningMergedRawById(state.classicScreeningUpdateModalId);
    if (!record) return "";
    const e = escapeAttr;
    const isMmg = record.type?.key === "MMG";
    const st = record.status?.key && CLASSIC_SCREENING_STATUS_BY_KEY[record.status.key] ? record.status.key : "qualified";
    const appt = record.appointment;
    const apptDate = appt && appt.date != null ? String(appt.date) : "";
    const apptTime = appt && appt.time != null ? String(appt.time) : "";
    const venueVal = record.venue != null ? String(record.venue) : "";
    const attVal = record.attendance != null ? String(record.attendance).trim() : "";
    const atVal = String(record.appointmentType || "").trim().toLowerCase();
    const resultVal = record.result != null ? String(record.result) : "";
    const nrpVal = record.nextReviewPeriod != null ? String(record.nextReviewPeriod) : "";
    const nrdVal = record.nextReviewDate != null ? String(record.nextReviewDate) : "";
    const statusChips = Object.keys(CLASSIC_SCREENING_STATUS_BY_KEY)
      .map((k) => {
        const L = CLASSIC_SCREENING_STATUS_BY_KEY[k];
        const sel = st === k;
        return `<button type="button" class="ui-chip${sel ? " is-selected" : ""}" data-csu-status="${e(
          k
        )}" aria-pressed="${sel}">${e(L.label)}</button>`;
      })
      .join("");

    const atOpts = Object.entries(CLASSIC_MAMMOGRAM_APPOINTMENT_TYPE_LABELS)
      .map(([val, lbl]) => `<option value="${e(val)}"${atVal === val ? " selected" : ""}>${e(lbl)}</option>`)
      .join("");

    const apptTypeBlock = isMmg
      ? `<div class="field field--full">
          <label for="csu-appointment-type">Appointment type</label>
          <select id="csu-appointment-type">
            ${atOpts}
          </select>
        </div>`
      : "";

    const attOpts = [`<option value=""${attVal ? "" : " selected"}>—</option>`]
      .concat(
        CLASSIC_SCREENING_ATTENDANCE_OPTIONS.map(
          (v) => `<option value="${e(v)}"${attVal && attVal.toLowerCase() === v.toLowerCase() ? " selected" : ""}>${e(v)}</option>`
        )
      )
      .join("");

    const body = `
      <div data-classic-screening-update-root>
        <div class="v3-biodata-modal__grid">
          <div class="field field--full">
            <label for="csu-submitted">Submitted</label>
            <input id="csu-submitted" type="text" value="${e(record.submitted != null ? String(record.submitted) : "")}" placeholder="e.g. 12 Apr 2026" autocomplete="off" />
          </div>
          <div class="field field--full">
            <span class="field__static-label" id="csu-status-label">Status</span>
            <input type="hidden" id="csu-status-value" value="${e(st)}" autocomplete="off" />
            <div class="ui-chip-group" role="group" aria-labelledby="csu-status-label">
              ${statusChips}
            </div>
          </div>
          <div class="field">
            <label for="csu-appt-date">Appointment date</label>
            <input id="csu-appt-date" type="text" value="${e(apptDate)}" placeholder="e.g. 19 Aug 2026" autocomplete="off" />
          </div>
          <div class="field">
            <label for="csu-appt-time">Appointment time</label>
            <input id="csu-appt-time" type="text" value="${e(apptTime)}" placeholder="e.g. 10:30am" autocomplete="off" />
          </div>
          <div class="field field--full">
            <label for="csu-venue">Venue</label>
            <input id="csu-venue" type="text" value="${e(venueVal)}" placeholder="Venue" autocomplete="off" />
          </div>
          <div class="field field--full">
            <label for="csu-attendance">Attendance</label>
            <select id="csu-attendance">
              ${attOpts}
            </select>
          </div>
          ${apptTypeBlock}
        </div>
        <h3 class="v3-biodata-modal__heading">Review &amp; outcome</h3>
        <div class="v3-biodata-modal__grid">
          <div class="field field--full">
            <label for="csu-result">Result</label>
            <input id="csu-result" type="text" value="${e(resultVal)}" placeholder="—" autocomplete="off" />
          </div>
          <div class="field">
            <label for="csu-next-review-period">Next review period</label>
            <input id="csu-next-review-period" type="text" value="${e(nrpVal)}" placeholder="e.g. 12 months" autocomplete="off" />
          </div>
          <div class="field">
            <label for="csu-next-review-date">Next review date</label>
            <input id="csu-next-review-date" type="text" value="${e(nrdVal)}" placeholder="e.g. Jan 2025" autocomplete="off" />
          </div>
        </div>
      </div>
    `;

    return `
      <div class="ui-dialog-overlay" id="classic-screening-update-modal" role="presentation">
        <div class="ui-dialog ui-dialog--classic-screening-update" role="dialog" aria-modal="true" aria-labelledby="classic-screening-update-title">
          <div class="ui-dialog__close">
            <button type="button" class="ui-btn ui-btn--ghost ui-btn--icon" data-classic-screening-update-dismiss aria-label="Close">${icons.x}</button>
          </div>
          <div class="ui-dialog__header">
            <h2 class="ui-dialog__title" id="classic-screening-update-title">Update screening record</h2>
            <p class="ui-dialog__meta">${e(record.type?.label || "—")}</p>
          </div>
          <div class="ui-dialog__body">${body}</div>
          <div class="ui-dialog__footer">
            <div class="ui-dialog__footer-actions">
              <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-classic-screening-update-dismiss>Cancel</button>
              <button type="button" class="ui-btn ui-btn--default ui-btn--sm" data-classic-screening-update-save>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function v3NormalizeYesNo(raw) {
    const s = String(raw || "").trim().toLowerCase();
    if (s === "yes" || s === "y" || s === "true" || s === "1") return "yes";
    if (s === "no" || s === "n" || s === "false" || s === "0") return "no";
    return "";
  }

  function v3EligibilityAnswerPill(e, yn) {
    const v = v3NormalizeYesNo(yn);
    const label = v === "yes" ? "Yes" : v === "no" ? "No" : "—";
    const mod = v === "yes" ? "v3-elig-ans--yes" : v === "no" ? "v3-elig-ans--no" : "v3-elig-ans--empty";
    return `<span class="v3-elig-ans ${mod}">${e(label)}</span>`;
  }

  function v3MammogramEligibilityModel(details) {
    const qs = [
      {
        key: "covid19VaccineSoon",
        kicker: "Q1 OF 6",
        text: "Are you currently taking or planning to take the COVID-19 vaccine soon?",
      },
      {
        key: "mammogramPast12or24Months",
        kicker: "Q2 OF 6",
        text: "Have you done a mammogram in the past 12 months (if aged 40–49) or 24 months (if aged 50 and above)?",
      },
      {
        key: "breastfeedingPast6Months",
        kicker: "Q3 OF 6",
        text: "Have you been breastfeeding in the past 6 months?",
      },
      {
        key: "breastSymptoms",
        kicker: "Q4 OF 6",
        text: "Do you have any symptoms (lumps, pain, or nipple discharge) in your breast?",
      },
      {
        key: "breastImplants",
        kicker: "Q5 OF 6",
        text: "Do you have any breast implants?",
      },
      {
        key: "everHadBreastCancer",
        kicker: "Q6 OF 6",
        text: "Have you ever had breast cancer?",
      },
    ];

    const answers = qs.map((q) => v3NormalizeYesNo(details?.[q.key]));
    const answered = answers.filter((a) => a === "yes" || a === "no").length;
    const anyYes = answers.some((a) => a === "yes");
    const allNo = answered === qs.length && answers.every((a) => a === "no");

    let statusKey = "incomplete";
    let statusLabel = "Incomplete";
    if (answered === qs.length) {
      if (allNo) {
        statusKey = "eligible";
        statusLabel = "Eligible";
      } else if (anyYes) {
        statusKey = "not-eligible";
        statusLabel = "Not eligible";
      }
    }

    return { qs, answered, total: qs.length, statusKey, statusLabel, allNo, anyYes };
  }

  function renderProspectV3MammogramEligibilityPanel(e, details, listRow) {
    const m = v3MammogramEligibilityModel(details);
    const submitted = formatDateRegisteredDisplay(listRow?.dateRegistered);

    const statusPill =
      m.statusKey === "eligible"
        ? `<span class="v3-elig-pill v3-elig-pill--eligible"><span class="v3-elig-pill__dot" aria-hidden="true"></span>${e(m.statusLabel)}</span>`
        : m.statusKey === "not-eligible"
          ? `<span class="v3-elig-pill v3-elig-pill--ineligible"><span class="v3-elig-pill__dot" aria-hidden="true"></span>${e(m.statusLabel)}</span>`
          : `<span class="v3-elig-pill v3-elig-pill--incomplete"><span class="v3-elig-pill__dot" aria-hidden="true"></span>${e(
              m.statusLabel
            )}</span>`;

    const summaryText =
      m.statusKey === "eligible"
        ? `${m.answered} of ${m.total} questions answered — Client passed all screening criteria.`
        : m.statusKey === "not-eligible"
          ? `${m.answered} of ${m.total} questions answered — Client did not meet all screening criteria.`
          : `${m.answered} of ${m.total} questions answered — Complete all questions to determine eligibility.`;

    const rows = m.qs
      .map(
        (q) => `<div class="v3-elig-q">
          <div class="v3-elig-q__main">
            <div class="v3-elig-q__kicker">${e(q.kicker)}</div>
            <div class="v3-elig-q__text">${e(q.text)}</div>
          </div>
          <div class="v3-elig-q__ans">${v3EligibilityAnswerPill(e, details?.[q.key])}</div>
        </div>`
      )
      .join("");

    return `
      <div class="v3-elig">
        <div class="v3-elig__head">
          <div class="v3-elig__title">
            <div class="v3-elig__title-text">Screening Eligibility</div>
          </div>
          <div class="v3-elig__meta">${e("Mammogram")} <span aria-hidden="true">•</span> Submitted ${e(submitted)}</div>
        </div>

        <div class="v3-elig__summary">
          <div class="v3-elig__summary-text">${e(summaryText)}</div>
          ${statusPill}
        </div>

        <div class="v3-elig__list" role="list" aria-label="Mammogram screening eligibility questions">
          ${rows}
        </div>

        <div class="v3-elig__foot" role="note">
          <span class="v3-elig__info" aria-hidden="true">i</span>
          <div>Eligibility responses are tied to each individual screening submission and are not overwritten.</div>
        </div>
      </div>
    `;
  }

  function renderProspectDetailV3Page() {
    const d = state.detail;
    const details = state.detailFormValues?.details || {};
    const rid = encodeURIComponent(d.rowKey);
    const tab = PROSPECT_V3_TAB_IDS.includes(state.prospectV3Tab) ? state.prospectV3Tab : "overview";

    const mkTabHref = (t) => (t === "overview" ? `#/prospectv3/${rid}` : `#/prospectv3/${rid}/${encodeURIComponent(t)}`);

    const classicScreeningRecords = getClassicScreeningRecordsCatalog();
    const notesForV1Tab = detailNotesForRender(d.rowKey);
    const documentsForV1Tab = detailDocumentsForRender(d.rowKey);

    const listRow =
      PROSPECTS.find((x) => x.rowKey === d.rowKey) || PROSPECTS.find((x) => x.id === d.id) || null;
    const maskedNric = v3MaskNricForProfileDisplay(details.nric);
    const v1ActiveScreeningLabel = v1ClientActiveScreeningLabel(d.activeListProgram);
    const v1DemoGender = v1ProspectDisplayGender(details, listRow);
    const v1DemoAge = v1ProspectDisplayAge(details, listRow);
    const v1DemoLine = `${escapeAttr(v1DemoGender)} · ${v1DemoAge !== "—" ? `${escapeAttr(v1DemoAge)} y/o` : escapeAttr("—")}`;

    const v1Header = `
      <div class="v1-profile-header">
        <div class="detail-hero v1-profile-header__hero">
          <div class="registration__toolbar-row detail-hero__toolbar-row">
            <a href="#/list" class="detail-hero__back" aria-label="Back to list">${icons.back}</a>
            <div class="registration__toolbar-titles">
              <h1 class="registration__title">${escapeAttr(d.name || "—")}</h1>
              <p class="registration__subtitle v1-profile-header__sub">
                <span class="v1-profile-header__sub-demographics">${v1DemoLine}</span>
                <span class="v1-profile-header__sub-sep" aria-hidden="true">·</span>
                <span class="v1-profile-header__active-screening">${escapeAttr(v1ActiveScreeningLabel)}</span>
              </p>
            </div>
          </div>
        </div>

        <div class="v1-strip" role="list" aria-label="Key info">
          <div class="v1-strip__item" role="listitem">
            <div class="v1-strip__label">NRIC</div>
            <div class="v1-strip__value v1-mono">${escapeAttr(maskedNric)}</div>
          </div>
          <div class="v1-strip__item" role="listitem">
            <div class="v1-strip__label">Contact</div>
            <div class="v1-strip__value">${escapeAttr(details.contact || details.mobile || "—")}</div>
          </div>
          <div class="v1-strip__item" role="listitem">
            <div class="v1-strip__label">CHAS Card</div>
            <div class="v1-strip__value">${escapeAttr(details.chasCardType || "—")}</div>
          </div>
          <div class="v1-strip__item" role="listitem">
            <div class="v1-strip__label">HealthierSG</div>
            <div class="v1-strip__value">${escapeAttr(v3BiodataHealthierSgLabel(details.healthierSg))}</div>
          </div>
          <div class="v1-strip__item" role="listitem">
            <div class="v1-strip__label">Risk level</div>
            <div class="v1-strip__value v1-strip__value--stack">
              ${riskLevelIndicator(d.risk)}
            </div>
          </div>
        </div>

        <div class="detail-tabs v1-profile-header__tabs" role="tablist" aria-label="Prospect v1 tabs">
          ${[
            ["overview", `Overview`],
            ["screenings", `Screenings <span class="tab-badge">${escapeAttr(String(classicScreeningRecords.length))}</span>`],
            ["biodata", "Biodata"],
            ["eligibility", "Eligibility"],
            ["documents", `Documents <span class="tab-badge">${escapeAttr(String(documentsForV1Tab.length))}</span>`],
            ["notes", `Notes <span class="tab-badge">${escapeAttr(String(notesForV1Tab.length))}</span>`],
          ]
            .map(([id, labelHtml]) => {
              const active = tab === id;
              return `<button type="button" class="${active ? "is-active" : ""}" data-prospectv3-tab="${escapeAttr(
                id
              )}" data-prospectv3-tab-href="${escapeAttr(mkTabHref(id))}" role="tab" aria-selected="${active}">${labelHtml}</button>`;
            })
            .join("")}
        </div>
      </div>
    `;

    let panel = "";
    if (tab === "overview") {
      const detailActivityFeed = buildDetailActivityFeed(d.rowKey, d);
      const activityTimelineSection =
        typeof window.WD_renderActivityTimelineSection === "function"
          ? window.WD_renderActivityTimelineSection(escapeAttr, detailActivityFeed)
          : `<section class="detail-card detail-card--overview-col"><div class="detail-card__body"><p class="placeholder-block">Activity timeline unavailable.</p></div></section>`;
      const enrolmentRows = prospectEnrolmentRowsForDetail(d);
      const overviewKpiGrid = renderProspectSummarySection(enrolmentRows, {
        ariaLabel: "Enrolment summary",
        gridOnly: true,
      });
      panel = `
        <div class="v1-overview-stack">
          ${overviewKpiGrid}
          ${activityTimelineSection}
        </div>
      `;
    } else if (tab === "screenings") {
      panel = renderClassicScreeningRecordsPanel(escapeAttr);
    } else if (tab === "biodata") {
      const val = (v) => (v != null && String(v).trim() ? String(v) : "—");
      const { firstName, lastName } = v3BiodataNameParts(d, details);
      const postalRaw =
        details.postalCode != null && String(details.postalCode).trim() !== ""
          ? String(details.postalCode).trim()
          : String(details.postal || "").trim();
      const chasDot = v3BiodataChasDotHex(details.chasCardType);
      const langs = Array.isArray(details.preferredLanguages)
        ? details.preferredLanguages.map((x) => String(x).trim()).filter(Boolean)
        : details.preferredLanguages != null && String(details.preferredLanguages).trim()
          ? String(details.preferredLanguages)
              .split(/[,;]+/)
              .map((s) => s.trim())
              .filter(Boolean)
          : typeof details.preferredLanguage === "string" && details.preferredLanguage.trim()
            ? details.preferredLanguage.split(",").map((s) => s.trim()).filter(Boolean)
            : [];
      const languagesHtml = langs.length
        ? `<div class="lp-wrap">${langs.map((l) => `<span class="lp">${escapeAttr(l)}</span>`).join("")}</div>`
        : escapeAttr(val(details.preferredLanguage));

      const txtRo = (raw) => `<span class="bio-v">${escapeAttr(val(raw))}</span>`;
      const monoRo = (raw) => `<span class="bio-v mono">${escapeAttr(val(raw))}</span>`;

      const chasRo = `<span class="bio-v bio-v--chas"><span class="bio-chas-dot" style="background:${escapeAttr(
        chasDot
      )}" aria-hidden="true"></span>${escapeAttr(val(details.chasCardType))}</span>`;

      const hsgRo = `<span class="bio-v bio-v--success">${escapeAttr(v3BiodataHealthierSgLabel(details.healthierSg))}</span>`;

      const ynLabel = (raw) => {
        const s = String(raw || "").trim().toLowerCase();
        if (s === "yes" || s === "true" || s === "on" || s === "1") return "Yes";
        if (s === "no" || s === "false" || s === "off" || s === "0") return "No";
        return val(raw);
      };
      const fullNameRo = (() => {
        const fn =
          (details.fullName != null && String(details.fullName).trim()) ||
          `${firstName} ${lastName}`.trim() ||
          (d.name != null && String(d.name).trim()) ||
          "";
        return txtRo(fn);
      })();
      const riskLevelRo = (() => {
        const fromForm = details.riskLevel != null && String(details.riskLevel).trim();
        const lbl = fromForm ? String(details.riskLevel).trim() : riskLevelFormLabelFromSlug(d.risk);
        return txtRo(lbl || "—");
      })();

      panel = `
        <div class="detail-card detail-card--flush v1-bio2">
          <div class="ph">
            <div class="pt">Personal Information</div>
            <button type="button" class="pa" data-v3-biodata-edit="">Edit</button>
          </div>

          <div class="bio-wrap">
            <div class="bio-sec">
              <div class="bio-sec-t">Identity</div>
              <div class="bio-row"><span class="bio-l">Full Name (as per NRIC)</span>${fullNameRo}</div>
              <div class="bio-row"><span class="bio-l">First Name</span><span class="bio-v">${escapeAttr(val(firstName))}</span></div>
              <div class="bio-row"><span class="bio-l">Last Name</span><span class="bio-v">${escapeAttr(val(lastName))}</span></div>
              <div class="bio-row"><span class="bio-l">NRIC</span><span class="bio-v mono">${escapeAttr(maskedNric)}</span></div>
              <div class="bio-row"><span class="bio-l">Date of Birth</span>${txtRo(details.dob || details.dateOfBirth)}</div>
              <div class="bio-row"><span class="bio-l">Age</span>${txtRo(details.age)}</div>
              <div class="bio-row"><span class="bio-l">Gender</span>${txtRo(details.gender)}</div>
              <div class="bio-row"><span class="bio-l">Race</span>${txtRo(details.race)}</div>
              <div class="bio-row"><span class="bio-l">Religion</span>${txtRo(details.religion)}</div>
              <div class="bio-row"><span class="bio-l">Residential Status</span>${txtRo(details.residentialStatus)}</div>
            </div>

            <div class="bio-sec">
              <div class="bio-sec-t">Contact &amp; Address</div>
              <div class="bio-row"><span class="bio-l">Email</span>${txtRo(details.email)}</div>
              <div class="bio-row"><span class="bio-l">Contact No.</span>${monoRo(details.contact || details.mobile)}</div>
              <div class="bio-row"><span class="bio-l">Preferred Language</span><span class="bio-v">${languagesHtml}</span></div>
              <div class="bio-row"><span class="bio-l">Block</span>${txtRo(details.block)}</div>
              <div class="bio-row"><span class="bio-l">Street Name</span>${txtRo(details.street)}</div>
              <div class="bio-row"><span class="bio-l">Floor</span>${txtRo(details.floor)}</div>
              <div class="bio-row"><span class="bio-l">Unit No</span>${txtRo(details.unit)}</div>
              <div class="bio-row"><span class="bio-l">Postal Code</span>${monoRo(postalRaw)}</div>
              <div class="bio-row"><span class="bio-l">Country</span>${txtRo(details.country)}</div>
              ${
                details.address != null && String(details.address).trim()
                  ? `<div class="bio-row"><span class="bio-l">Address (full)</span>${txtRo(details.address)}</div>`
                  : ""
              }
            </div>

            <div class="bio-sec">
              <div class="bio-sec-t">Healthier SG &amp; Subsidies</div>
              <div class="bio-row"><span class="bio-l">CHAS Card Type</span>${chasRo}</div>
              <div class="bio-row"><span class="bio-l">HealthierSG Status</span>${hsgRo}</div>
              <div class="bio-row"><span class="bio-l">First-time mammogram screening</span>${txtRo(ynLabel(details.firstMammogramScreening))}</div>
              <div class="bio-row"><span class="bio-l">Year of Last Screening</span>${txtRo(details.lastScreeningYear)}</div>
            </div>

            <div class="bio-sec">
              <div class="bio-sec-t">Risk Assessment</div>
              <div class="bio-row"><span class="bio-l">Risk Level</span>${riskLevelRo}</div>
              <div class="bio-row"><span class="bio-l">Cancer Screening Eligibility Check</span>${txtRo(ynLabel(details.cancerScreeningEligibilityCheck))}</div>
              <div class="bio-row"><span class="bio-l">Personal Hx of Cancer</span>${txtRo(details.personalCancerHistory)}</div>
              <div class="bio-row"><span class="bio-l">Pre-existing Conditions</span>${txtRo(details.preExistingConditions)}</div>
              <div class="bio-row"><span class="bio-l">Family Hx of Cancer</span>${txtRo(details.familyHistory)}</div>
            </div>

            <div class="bio-sec">
              <div class="bio-sec-t">Engagement &amp; Consent</div>
              <div class="bio-row"><span class="bio-l">How did you hear about us?</span>${txtRo(details.sourceType)}</div>
              <div class="bio-row"><span class="bio-l">Campaign / Event Name</span>${txtRo(details.sourceName)}</div>
              <div class="bio-row"><span class="bio-l">PDPA Consent</span>${txtRo(ynLabel(details.pdpaConsent))}</div>
              <div class="bio-row"><span class="bio-l">eDM Subscription</span>${txtRo(ynLabel(details.edmSubscription))}</div>
              <div class="bio-row"><span class="bio-l">Consent for SCS to Contact</span>${txtRo(ynLabel(details.consentContact))}</div>
            </div>

            <div class="bio-sec v1-bio2__data-source" aria-readonly="true">
              <div class="bio-sec-t">Data Source</div>
              <div class="bio-row"><span class="bio-l">Retrieved via</span>
                <span class="bio-v bio-v--myinfo-source">
                  <span class="v1-bio2__singpass">Singpass</span><span>MyInfo</span>
                </span>
              </div>
              <div class="bio-row"><span class="bio-l">Last Updated</span><span class="bio-v">${escapeAttr(val(details.lastUpdated || details.updatedAt))}</span></div>
              <div class="bio-row"><span class="bio-l">Updated By</span><span class="bio-v">${escapeAttr(val(details.updatedBy))}</span></div>
            </div>
          </div>
        </div>
      `;
    } else if (tab === "eligibility") {
      const listRow = PROSPECTS.find((x) => x.rowKey === d.rowKey || x.id === d.rowKey) || null;
      panel = `
        <div class="detail-card detail-card--flush v3-elig-card">
          <div class="detail-card__body" style="padding:0">
            ${renderProspectV3MammogramEligibilityPanel(escapeAttr, details, listRow)}
          </div>
        </div>
      `;
    } else if (tab === "documents" || tab === "notes") {
      const renderPanel = typeof window.WD_renderDetailPanel === "function" ? window.WD_renderDetailPanel : null;
      const v1DetailCtx = {
        d: state.detail,
        state,
        icons,
        escapeAttr,
        pipelineLabel: pipelineStageLabel(),
        detailFormEdit: state.detailFormEdit,
        detailNavSection: state.detailNavSection,
        formValues: state.detailFormValues,
        detailDocuments: detailDocumentsForRender(state.detail.rowKey),
        detailNotes: detailNotesForRender(state.detail.rowKey),
        detailActivityFeed: buildDetailActivityFeed(state.detail.rowKey, state.detail),
      };
      panel = renderPanel
        ? renderPanel(tab, v1DetailCtx)
        : `<div class="detail-panel"><p class="placeholder-block">detail-panels.js failed to load.</p></div>`;
    }

    return `
      ${v1Header}
      <div class="detail-panels">
        <section class="detail-panel detail-panel--stack client360-panel" role="tabpanel">
          ${panel}
        </section>
      </div>
    `;
  }

  function renderScreeningDetailsPage() {
    const d = state.detail;
    const details = state.detailFormValues?.details || {};
    const tab = state.screeningTab || "details";
    const rid = encodeURIComponent(d.rowKey);
    const mkTabHref = (t) => (t === "details" ? `#/screening/${rid}` : `#/screening/${rid}/${encodeURIComponent(t)}`);

    const tasks = Array.isArray(d.tasks) ? d.tasks : [];
    const done = tasks.filter((t) => t && t.done).length;
    const eligibilityItems = [
      ["Cancer Screening Eligibility Check", details.cancerScreeningEligibilityCheck],
      ["First-time screener", details.firstMammogramScreening],
      ["Last screening year", details.lastScreeningYear],
      ["CHAS Card", details.chasCardType],
      ["HealthierSG", v3BiodataHealthierSgLabel(details.healthierSg)],
      ["Risk factors", details.riskFactors],
    ].filter(([, v]) => v != null && String(v).trim() !== "");
    const eligibilityCount = eligibilityItems.length;
    const program = (d.programTags && d.programTags[0]) || "Screening";
    const registered = "—";
    const bookingRef = "—";

    const left = `
      <div class="client360-left">
        <div class="client360-left__head">
          <div class="client360-left__avatar">${escapeAttr((d.name || "—").split(" ").slice(0,2).map(x=>x[0]||"").join("").toUpperCase() || "—")}</div>
          <div class="client360-left__who">
            <div class="client360-left__name">${escapeAttr(d.name || "—")}</div>
            <div class="client360-left__sub">${escapeAttr(d.subtitle || "—")}</div>
          </div>
        </div>
        <div class="client360-left__badges">
          ${riskLevelIndicator(d.risk)}
          <span class="pill pill--high">High Priority</span>
        </div>
        <div class="client360-left__section">
          <div class="client360-left__section-title">Patient Details</div>
          <div class="client360-left__kv">
            <div class="client360-left__kv-row"><span>ID</span><strong>${escapeAttr(d.id || "—")}</strong></div>
            <div class="client360-left__kv-row"><span>NRIC</span><strong>${escapeAttr(details.nric || "—")}</strong></div>
            <div class="client360-left__kv-row"><span>Contact</span><strong>${escapeAttr(details.contact || "—")}</strong></div>
            <div class="client360-left__kv-row"><span>CHAS</span><strong>${escapeAttr(details.chasCardType || "—")}</strong></div>
            <div class="client360-left__kv-row"><span>HealthierSG</span><strong>${escapeAttr(
              v3BiodataHealthierSgLabel(details.healthierSg)
            )}</strong></div>
          </div>
        </div>

        <div class="client360-left__section">
          <div class="client360-left__section-title">Risk Profile</div>
          <div class="client360-left__kv">
            <div class="client360-left__kv-row"><span>Personal Cancer Hx</span><strong>${escapeAttr(details.personalCancerHistory || "—")}</strong></div>
            <div class="client360-left__kv-row"><span>Family Cancer Hx</span><strong>${escapeAttr(details.familyHistory || "—")}</strong></div>
            <div class="client360-left__kv-row"><span>Pre-existing</span><strong>${escapeAttr(details.preExistingConditions || "—")}</strong></div>
            <div class="client360-left__kv-row"><span>Prior Screening</span><strong>${escapeAttr(details.screeningEligible || "—")}</strong></div>
            <div class="client360-left__kv-row"><span>Last Screened</span><strong>${escapeAttr(details.lastScreeningYear || "—")}</strong></div>
          </div>
        </div>

        <div class="client360-left__section">
          <div class="client360-left__section-title">Quick Actions</div>
          <div class="client360-left__actions">
            <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-detail-toast="SMS sent (prototype).">Send SMS</button>
            <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-detail-toast="Add note (prototype).">Add Note</button>
          </div>
        </div>
      </div>
    `;

    const centerHeader = `
      <div class="screening-card">
        <div class="screening-card__head">
          <div class="screening-card__icon" aria-hidden="true">🩻</div>
          <div class="screening-card__titles">
            <div class="screening-card__title-row">
              <div class="screening-card__title">${escapeAttr(program)}</div>
              <span class="pill">${escapeAttr(pipelineStageLabel())}</span>
              <span class="screening-card__meta">· ${escapeAttr(program)}</span>
            </div>
            <div class="screening-card__sub">Registered ${escapeAttr(registered)} <span class="screening-card__code">#${escapeAttr(bookingRef)}</span></div>
          </div>
        </div>

        <div class="screening-card__pipeline" aria-hidden="true">
          <div class="screening-pipe">
            <div class="screening-pipe__step is-done"><span class="screening-pipe__dot"></span><span class="screening-pipe__lbl">Qualified</span><span class="screening-pipe__sub">Form submitted</span></div>
            <div class="screening-pipe__bar"></div>
            <div class="screening-pipe__step is-current"><span class="screening-pipe__dot"></span><span class="screening-pipe__lbl">Booked</span><span class="screening-pipe__sub">Appt confirmed</span></div>
            <div class="screening-pipe__bar"></div>
            <div class="screening-pipe__step"><span class="screening-pipe__dot"></span><span class="screening-pipe__lbl">Screened</span><span class="screening-pipe__sub">Client attended</span></div>
          </div>
        </div>

        <div class="screening-card__tabs" role="tablist" aria-label="Screening record tabs">
          ${[
            { key: "details", label: "Details" },
            { key: "tasks", label: "Tasks", badge: `${done}/${tasks.length}` },
            { key: "eligibility", label: "Eligibility", badge: String(eligibilityCount) },
          ]
            .map(
              (t) =>
                `<button type="button" class="${tab === t.key ? "is-active" : ""}" data-screening-tab="${escapeAttr(
                  t.key
                )}" role="tab" aria-selected="${tab === t.key}" data-screening-tab-href="${escapeAttr(mkTabHref(t.key))}">${escapeAttr(
                  t.label
                )}${t.badge != null ? `<span class="screening-card__tab-badge">${escapeAttr(t.badge)}</span>` : ""}</button>`
            )
            .join("")}
        </div>
      </div>
    `;

    let centerBody = "";
    if (tab === "tasks") {
      centerBody = `
        <div class="detail-card">
          <div class="detail-card__title">Tasks</div>
          <div class="detail-task-list">
            ${tasks
              .map(
                (t) => `
              <label class="detail-task-row ${t.done ? "is-done" : ""}">
                <input type="checkbox" data-task id="${escapeAttr(t.id)}" ${t.done ? "checked" : ""}/>
                <span>${escapeAttr(t.label)}</span>
              </label>`
              )
              .join("")}
          </div>
        </div>
      `;
    } else if (tab === "eligibility") {
      centerBody = `
        <div class="detail-card">
          <div class="detail-card__title">Eligibility</div>
          <div class="detail-card__body">
            <div class="client360-kv">
              ${eligibilityItems
                .map(
                  ([k, v]) =>
                    `<div class="client360-kv__row"><span>${escapeAttr(k)}</span><strong>${escapeAttr(
                      v || "—"
                    )}</strong></div>`
                )
                .join("")}
            </div>
            ${eligibilityItems.length ? "" : `<p class="placeholder-block" style="margin:0">No eligibility data available.</p>`}
          </div>
        </div>
      `;
    } else {
      centerBody = `
        <div class="screening-two-col">
          <div class="detail-card">
            <div class="detail-card__title">Client Preference</div>
            <div class="client360-kv">
              <div class="client360-kv__row"><span>Programme</span><strong>${escapeAttr(details.preferredScreeningDate ? program : "—")}</strong></div>
              <div class="client360-kv__row"><span>Preferred Slot</span><strong>${escapeAttr(details.screeningLocationEvent || details.preferredScreeningDate || "—")}</strong></div>
              <div class="client360-kv__row"><span>Time</span><strong>${escapeAttr(details.preferredTimeSlot || "—")}</strong></div>
              <div class="client360-kv__row"><span>Notes</span><strong>${escapeAttr(details.followUpNotes || "—")}</strong></div>
            </div>
            <div class="screening-note">Read-only — locked at form submission</div>
          </div>

          <div class="detail-card">
            <div class="detail-card__title">Confirmed Appointment</div>
            <div class="detail-card__body">
              <div class="placeholder-block" style="margin:0">No appointment confirmed yet — placeholder.</div>
            </div>
          </div>

          <div class="detail-card">
            <div class="detail-card__title">Review Schedule</div>
            <div class="client360-kv">
              <div class="client360-kv__row"><span>Next Review Date</span><strong>${escapeAttr(details.nextReviewDate || d.subtitle || "—")}</strong></div>
              <div class="client360-kv__row"><span>Review Period</span><strong>${escapeAttr(details.reviewPeriod || "—")}</strong></div>
            </div>
          </div>

          <div class="detail-card">
            <div class="detail-card__title">Result</div>
            <div class="detail-card__body">
              <div class="placeholder-block" style="margin:0">Result will be recorded when screening is completed.</div>
            </div>
          </div>
        </div>
      `;
    }

    const right = `
      <div class="detail-card">
        <div class="detail-card__title">Activity</div>
        <div class="timeline-scroll">
          ${(d.timeline || [])
            .map(
              (it) => `
            <div class="timeline-item">
              <div class="timeline-item__title">${escapeAttr(it.title || "Update")}</div>
              <div class="timeline-item__meta">${escapeAttr(it.dateTime || "—")} · ${escapeAttr(it.by || "—")}</div>
              <div class="timeline-item__body">${escapeAttr(it.body || "")}</div>
            </div>`
            )
            .join("")}
          ${(d.timeline || []).length ? "" : `<div class="placeholder-block">No activity yet.</div>`}
        </div>
      </div>
      <div class="detail-card">
        <div class="detail-card__title">Related Screenings</div>
        <div class="client360-list">
          ${(d.programTags || [])
            .map(
              (t) =>
                `<div class="client360-list__item"><span class="client360-dot" aria-hidden="true"></span><div class="client360-list__body"><div class="client360-list__title">${escapeAttr(
                  t
                )}</div><div class="client360-list__sub">Review: ${escapeAttr(details.nextReviewDate || "—")}</div></div></div>`
            )
            .join("")}
        </div>
      </div>
    `;

    return `
      ${renderAppBreadcrumb(
        [
          { label: "Prospect Management", href: "#/list" },
          { label: (d.name && String(d.name).trim()) || d.id },
          { label: "Screening details" },
        ],
        "registration"
      )}
      <div class="screening-layout-v2">
        <aside class="screening-layout-v2__left">${left}</aside>
        <section class="screening-layout-v2__main">
          ${centerHeader}
          <div class="detail-panel detail-panel--stack">${centerBody}</div>
        </section>
        <aside class="screening-layout-v2__right">${right}</aside>
      </div>
    `;
  }

  function detailDocumentsForRender(rowKey) {
    const list = state.detailDocumentsByProspect[rowKey];
    if (!Array.isArray(list)) return [];
    return list.map(({ id, name, size, mime, uploadedAt }) => ({ id, name, size, mime, uploadedAt }));
  }

  function ensureDetailDocumentsList(rowKey) {
    if (!state.detailDocumentsByProspect[rowKey]) {
      state.detailDocumentsByProspect[rowKey] = [];
    }
    return state.detailDocumentsByProspect[rowKey];
  }

  function addDetailDocumentsFromFiles(rowKey, files) {
    const list = ensureDetailDocumentsList(rowKey);
    const base = Date.now();
    files.forEach((file, i) => {
      const id = `doc-${base}-${i}-${Math.random().toString(36).slice(2, 9)}`;
      list.push({
        id,
        name: file.name,
        size: file.size,
        mime: file.type || "application/octet-stream",
        uploadedAt: new Date().toISOString(),
        objectUrl: URL.createObjectURL(file),
      });
    });
  }

  function removeDetailDocument(rowKey, docId) {
    const list = state.detailDocumentsByProspect[rowKey];
    if (!Array.isArray(list)) return;
    const idx = list.findIndex((d) => d.id === docId);
    if (idx === -1) return;
    const url = list[idx].objectUrl;
    if (url) URL.revokeObjectURL(url);
    list.splice(idx, 1);
  }

  function triggerDetailDocumentDownload(rowKey, docId) {
    const list = state.detailDocumentsByProspect[rowKey];
    if (!Array.isArray(list)) return;
    const doc = list.find((d) => d.id === docId);
    if (!doc?.objectUrl) return;
    const a = document.createElement("a");
    a.href = doc.objectUrl;
    a.download = doc.name || "download";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    window.setTimeout(() => a.remove(), 250);
  }

  function ensureDetailNotesList(rowKey) {
    if (!state.detailNotesByProspect[rowKey]) {
      state.detailNotesByProspect[rowKey] = [];
    }
    return state.detailNotesByProspect[rowKey];
  }

  function addDetailNote(rowKey, body) {
    const text = String(body || "").trim();
    if (!text) return false;
    const list = ensureDetailNotesList(rowKey);
    list.push({
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      body: text,
      submittedAt: new Date().toISOString(),
      authorName: PORTAL_CURRENT_USER.name,
      authorRole: PORTAL_CURRENT_USER.role,
    });
    return true;
  }

  function updateDetailNote(rowKey, id, body) {
    const text = String(body || "").trim();
    if (!text) return false;
    const iso = new Date().toISOString();
    const list = ensureDetailNotesList(rowKey);
    const existing = list.find((x) => x.id === id);
    if (existing) {
      existing.body = text;
      existing.submittedAt = iso;
      return true;
    }
    if (DETAIL_NOTES_SEED.some((s) => s.id === id)) {
      if (!state.detailNoteEdits[rowKey]) state.detailNoteEdits[rowKey] = Object.create(null);
      state.detailNoteEdits[rowKey][id] = { body: text, submittedAt: iso };
      return true;
    }
    return false;
  }

  function deleteDetailNote(rowKey, id) {
    const list = ensureDetailNotesList(rowKey);
    const idx = list.findIndex((n) => n.id === id);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else if (DETAIL_NOTES_SEED.some((s) => s.id === id)) {
      if (!state.detailNoteDeletedIds[rowKey]) state.detailNoteDeletedIds[rowKey] = [];
      if (state.detailNoteDeletedIds[rowKey].indexOf(id) === -1) state.detailNoteDeletedIds[rowKey].push(id);
    }
    if (state.detailNoteEdits[rowKey]) delete state.detailNoteEdits[rowKey][id];
  }

  function detailNotesForRender(rowKey) {
    const added = Array.isArray(state.detailNotesByProspect[rowKey]) ? state.detailNotesByProspect[rowKey] : [];
    const deleted = new Set(state.detailNoteDeletedIds[rowKey] || []);
    const edits = state.detailNoteEdits[rowKey] || {};
    const seeds = DETAIL_NOTES_SEED.filter((n) => !deleted.has(n.id)).map((n) => {
      const ed = edits[n.id];
      return ed ? { ...n, body: ed.body, submittedAt: ed.submittedAt } : n;
    });
    const addedFiltered = added.filter((n) => !deleted.has(n.id));
    const merged = [...seeds, ...addedFiltered];
    merged.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    return merged;
  }

  function formatActivityDisplayTime(d) {
    if (!(d instanceof Date) || Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString("en-SG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function activityFileSizeLabel(bytes) {
    const n = Number(bytes);
    if (!Number.isFinite(n) || n < 0) return "—";
    if (n < 1024) return `${n} B`;
    if (n < 1048576) return `${(n / 1024).toFixed(n < 10240 ? 1 : 0)} KB`;
    return `${(n / 1048576).toFixed(1)} MB`;
  }

  function parseDisplayDateTimeToMs(s) {
    if (s == null || s === "") return 0;
    const t = Date.parse(String(s).trim());
    return Number.isNaN(t) ? 0 : t;
  }

  function pipelineStagePretty(s) {
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function ensureDetailActivityList(rowKey) {
    if (!state.detailActivityFeedByProspect[rowKey]) {
      state.detailActivityFeedByProspect[rowKey] = [];
    }
    return state.detailActivityFeedByProspect[rowKey];
  }

  function appendDetailActivity(rowKey, { title, body, by, stage }) {
    ensureDetailActivityList(rowKey).push({
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      atIso: new Date().toISOString(),
      title,
      body,
      by: by != null ? by : PORTAL_CURRENT_USER.name,
      stage: stage != null ? stage : state.pipeline,
    });
  }

  /**
   * Full activity feed for overview: registration, seeded/historical timeline rows, uploads, notes, and session log
   * (profile saves, pipeline moves, completed tasks). Newest first.
   */
  function buildDetailActivityFeed(rowKey, d) {
    const items = [];
    const p = PROSPECTS.find((x) => x.rowKey === rowKey);

    if (p?.dateRegistered) {
      const raw = Date.parse(`${p.dateRegistered}T12:00:00`);
      const ms = Number.isNaN(raw) ? 0 : raw;
      if (ms) {
        items.push({
          sortKey: ms,
          id: `feed-reg-${rowKey}`,
          dateDisplay: formatActivityDisplayTime(new Date(ms)),
          title: "Prospect registered",
          body: `Profile created — ${p.program} programme. Source: ${p.sourceType} (${p.sourceDetail}).`,
          by: "System",
          stage: "qualified",
        });
      }
    }

    const timelineSrc = Array.isArray(d?.timeline) ? d.timeline : [];
    const legacyFallback = Date.UTC(2019, 0, 1);
    timelineSrc.forEach((ev, idx) => {
      let sortKey = parseDisplayDateTimeToMs(ev.dateTime);
      if (!sortKey) sortKey = legacyFallback + idx * 60000;
      items.push({
        sortKey,
        id: `feed-tl-${rowKey}-${idx}`,
        dateDisplay: String(ev.dateTime != null ? ev.dateTime : ev.time || "—"),
        title: ev.title,
        body: ev.body,
        by: ev.by,
        stage: ev.stage,
      });
    });

    const docs = state.detailDocumentsByProspect[rowKey];
    if (Array.isArray(docs)) {
      docs.forEach((doc) => {
        const uploaded = doc.uploadedAt ? new Date(doc.uploadedAt) : new Date();
        const ms = uploaded.getTime();
        items.push({
          sortKey: ms,
          id: `feed-doc-${doc.id}`,
          dateDisplay: formatActivityDisplayTime(uploaded),
          title: "Document uploaded",
          body: `${doc.name} (${activityFileSizeLabel(doc.size)})`,
          by: PORTAL_CURRENT_USER.name,
          stage: null,
        });
      });
    }

    const userNotes = state.detailNotesByProspect[rowKey];
    if (Array.isArray(userNotes)) {
      userNotes.forEach((note) => {
        const at = new Date(note.submittedAt);
        const ms = at.getTime();
        const preview = note.body.length > 140 ? `${note.body.slice(0, 137)}…` : note.body;
        items.push({
          sortKey: ms,
          id: `feed-note-${note.id}`,
          dateDisplay: formatActivityDisplayTime(at),
          title: "Note added",
          body: preview,
          by: note.authorName,
          stage: null,
        });
      });
    }

    const feed = state.detailActivityFeedByProspect[rowKey];
    if (Array.isArray(feed)) {
      feed.forEach((ev) => {
        const at = new Date(ev.atIso);
        const ms = at.getTime();
        items.push({
          sortKey: Number.isNaN(ms) ? 0 : ms,
          id: ev.id,
          dateDisplay: formatActivityDisplayTime(at),
          title: ev.title,
          body: ev.body,
          by: ev.by,
          stage: ev.stage,
        });
      });
    }

    items.sort((a, b) => b.sortKey - a.sortKey || String(b.id).localeCompare(String(a.id)));
    return items.map((item) => {
      const { sortKey, ...rest } = item;
      return rest;
    });
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
      detailDocuments: detailDocumentsForRender(state.detail.rowKey),
      detailNotes: detailNotesForRender(state.detail.rowKey),
      detailActivityFeed: buildDetailActivityFeed(state.detail.rowKey, state.detail),
    });
  }

  const REG_NAV_ITEMS = [
    ["reg-eligibility", "Screening Eligibility"],
    ["reg-personal", "Personal Information"],
    ["reg-address", "Residential Address"],
    ["reg-subsidies", "Healthier SG & Subsidies"],
    ["reg-appointment-type", "Appointment Type"],
    ["reg-appointment", "Appointment Preferences"],
    ["reg-screening", "Screening Questions"],
    ["reg-engagement", "Engagement"],
    ["reg-consent", "Consent"],
  ];

  const REG_NAV_ITEMS_HPV = [
    ["reg-hpv-eligibility", "Screening Eligibility"],
    ["reg-hpv-personal", "Personal Information"],
    ["reg-hpv-address", "Residential Address"],
    ["reg-hpv-subsidies", "Healthier SG & Subsidies"],
    ["reg-hpv-appointment", "Appointment Preferences"],
    ["reg-hpv-engagement", "Engagement"],
    ["reg-hpv-consent", "Consent"],
  ];

  const REG_NAV_ITEMS_FIT = [
    ["reg-fit-eligibility", "Screening Eligibility"],
    ["reg-fit-personal", "Personal Information"],
    ["reg-fit-address", "Residential Address"],
    ["reg-fit-subsidies", "Healthier SG & Subsidies"],
    ["reg-fit-appointment", "Appointment Preferences"],
    ["reg-fit-engagement", "Engagement"],
    ["reg-fit-consent", "Consent"],
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
    return "Mammogram Screening Registration";
  }

  function renderRegisterSelfServiceLandingPage() {
    const title = escapeAttr(registerProgramLandingTitle());
    return `
      <div class="app-shell app-shell--reg-landing">
        <header class="reg-landing__header" role="banner">
          <div class="reg-landing__logos">
            <img src="assets/branding/scs-logo.png" alt="Singapore Cancer Society" class="reg-landing__logo reg-landing__logo--scs" width="160" height="52" />
            <span class="reg-landing__logo-divider" aria-hidden="true"></span>
            <img src="assets/branding/logo-bcf.png" alt="Breast Cancer Foundation" class="reg-landing__logo reg-landing__logo--bcf" width="200" height="120" />
            <span class="reg-landing__logo-divider" aria-hidden="true"></span>
            <img src="assets/branding/logo-nhg-diagnostics.png" alt="NHG Health Diagnostics" class="reg-landing__logo reg-landing__logo--nhg" width="220" height="56" />
          </div>
        </header>
        <main class="reg-landing__main" id="main-content">
          <div class="reg-landing__card">
            <h1 class="reg-landing__title">${title}</h1>
            <p class="reg-landing__subtitle">Select a registration method</p>
            <button type="button" id="reg-landing-singpass" class="reg-landing__singpass" aria-label="Retrieve Myinfo with Singpass">
              <span class="reg-landing__singpass-label">Retrieve Myinfo with</span>
              <img src="assets/branding/singpass-white.svg" alt="Singpass" class="reg-landing__singpass-logo" width="93" height="32" />
            </button>
            <p class="reg-landing__singpass-note">Singpass enables you to retrieve your personal data from participating Government sources and pre-fill the registration form.</p>
            <div class="reg-landing__or"><span>or</span></div>
            <button type="button" id="reg-landing-manual" class="reg-landing__manual">Complete Registration Manually</button>
            <p class="reg-landing__browser-hint"><em>For the best experience, complete this form using the latest Chrome or Safari browser version.</em></p>
          </div>
        </main>
        ${renderAppFooter({ variant: "landing" })}
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
      ${renderAppBreadcrumb(
        [{ label: "Prospect Management", href: "#/list" }, { label: "HPV Test / PAP Test Screening" }],
        "registration"
      )}
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
            <p class="registration__subtitle">Faecal Immunochemical Test — Issuing Record Form (IRF)</p>
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
      ${renderAppBreadcrumb(
        [{ label: "Prospect Management", href: "#/list" }, { label: "FIT Screening Programme" }],
        "registration"
      )}
      <div class="registration__toolbar">
        <div class="registration__toolbar-row">
          <a href="#/list" class="detail-hero__back" aria-label="Back to list">${icons.back}</a>
          <div class="registration__toolbar-titles">
            <h1 class="registration__title">FIT Screening Programme</h1>
            <p class="registration__subtitle">Faecal Immunochemical Test — Issuing Record Form (IRF)</p>
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
            <h1 class="registration__title">Mammogram Screening Registration</h1>
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
      ${renderAppBreadcrumb(
        [{ label: "Prospect Management", href: "#/list" }, { label: "Mammogram Screening Registration" }],
        "registration"
      )}
      <div class="registration__toolbar">
        <div class="registration__toolbar-row">
          <a href="#/list" class="detail-hero__back" aria-label="Back to list">${icons.back}</a>
          <div class="registration__toolbar-titles">
            <h1 class="registration__title">Mammogram Screening Registration</h1>
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

  /** DD-MM-YYYY + calendar (wired by js/date-input.js) */
  function registrationDateInput(id, name, required) {
    const req = required ? " required" : "";
    return (
      '<div class="field__date">' +
      '<input class="field__date-text" id="' +
      id +
      '" name="' +
      name +
      '" type="text"' +
      req +
      ' placeholder="DD-MM-YYYY" inputmode="numeric" autocomplete="off" maxlength="10" />' +
      '<button type="button" class="field__date-btn" aria-label="Choose date" title="Choose date"></button>' +
      '<input type="date" class="field__date-native" tabindex="-1" aria-hidden="true" />' +
      "</div>"
    );
  }

  /** NRIC: hidden store + optional bullet mask; `js/nric-toggle.js` defaults to visible value */
  function registrationNricField(id, name, required) {
    const reqStore = required ? " required" : "";
    const reqEdit = required ? " required" : "";
    const toggleIcons =
      '<span class="field__nric-toggle-icons" aria-hidden="true">' +
      '<i class="fi fi-rr-eye-crossed field__nric-toggle-ico field__nric-toggle-ico--when-masked"></i>' +
      '<i class="fi fi-rr-eye field__nric-toggle-ico field__nric-toggle-ico--when-revealed"></i>' +
      "</span>";
    return (
      '<div class="field__nric field__nric--revealed">' +
      '<input type="hidden" id="' +
      id +
      '" name="' +
      name +
      '" class="field__nric-store" autocomplete="off" value=""' +
      reqStore +
      " />" +
      '<div class="field__nric-face">' +
      '<span class="field__nric-asterisks" aria-hidden="true"></span>' +
      '<input type="text" class="field__nric-edit" autocomplete="off" maxlength="20" placeholder="Enter NRIC No."' +
      reqEdit +
      ' />' +
      "</div>" +
      '<button type="button" class="field__nric-toggle" aria-label="Hide NRIC" aria-pressed="true" title="Hide NRIC" data-nric-toggle>' +
      toggleIcons +
      "</button>" +
      "</div>"
    );
  }

  function renderRegistrationClientLookupSection() {
    if (state.registerSelfService) return "";
    return `
                <div class="registration__basic-info">
                  <div class="registration__client-search-row">
                    <div class="registration__client-search-field">
                      <i class="fi fi-rr-search registration__client-search-icon" aria-hidden="true"></i>
                      <input
                        type="search"
                        class="registration__client-search-input"
                        data-reg-client-search
                        name="clientLookup"
                        autocomplete="off"
                        placeholder="Search existing Client information by input NRIC or Client Name"
                        aria-describedby="reg-client-search-hint"
                      />
                    </div>
                    <button type="button" class="btn registration__client-search-reset" data-reg-client-search-reset>Reset</button>
                  </div>
                  <p id="reg-client-search-hint" class="registration__client-search-status" data-reg-client-search-status role="status" aria-live="polite"></p>
                </div>`;
  }

  function normalizeRegistrationNricQuery(s) {
    return String(s || "")
      .replace(/\s/g, "")
      .toUpperCase();
  }

  function findExistingClientByRegistrationQuery(raw) {
    const q = String(raw || "").trim();
    if (!q) return null;
    const nq = normalizeRegistrationNricQuery(q);
    const lq = q.toLowerCase();

    if (nq.length >= 4) {
      const exact = REG_EXISTING_CLIENTS.find((c) => normalizeRegistrationNricQuery(c.nric) === nq);
      if (exact) return exact;
      const byNric = REG_EXISTING_CLIENTS.find((c) => {
        const cn = normalizeRegistrationNricQuery(c.nric);
        return cn.includes(nq) || nq.includes(cn);
      });
      if (byNric) return byNric;
    }

    const words = lq.split(/\s+/).filter(Boolean);
    if (words.length) {
      const byWords = REG_EXISTING_CLIENTS.find((c) => {
        const name = c.name.toLowerCase();
        return words.every((w) => name.includes(w));
      });
      if (byWords) return byWords;
    }

    return REG_EXISTING_CLIENTS.find((c) => c.name.toLowerCase().includes(lq)) || null;
  }

  function setRegistrationNricValue(form, storeInputId, value) {
    const store = form.querySelector(`#${CSS.escape(storeInputId)}`);
    if (!(store instanceof HTMLInputElement) || !store.classList.contains("field__nric-store")) return;
    const shell = store.closest(".field__nric");
    if (!shell) return;
    const edit = shell.querySelector(".field__nric-edit");
    store.value = value || "";
    if (edit instanceof HTMLInputElement) edit.value = value || "";
    if (typeof window.WD_syncNricMasks === "function") {
      window.WD_syncNricMasks(form);
    }
  }

  function applyRegistrationExistingClientAutofill(form, program, client) {
    if (!form || !client) return;
    const ids =
      program === "hpv"
        ? {
            nricStore: "hpvNric",
            fullName: "hpvFullName",
            residential: "hpvResidential",
            dob: "hpvDob",
            gender: "hpvGender",
            race: "hpvRace",
            phone: "hpvMobile",
            email: "hpvEmail",
            block: "hpvBlock",
            street: "hpvStreet",
            floor: "hpvFloor",
            unit: "hpvUnit",
            postal: "hpvPostal",
            country: "hpvCountry",
          }
        : program === "fit"
          ? {
              nricStore: "fitNric",
              fullName: "fitFullName",
              residential: "fitResidential",
              dob: "fitDob",
              gender: "fitGender",
              race: "fitRace",
              phone: "fitContact",
              email: "fitEmail",
              block: "fitBlock",
              street: "fitStreet",
              floor: "fitFloor",
              unit: "fitUnit",
              postal: "fitPostal",
              country: "fitCountry",
            }
          : {
              nricStore: "nric",
              fullName: "fullName",
              residential: "residential",
              dob: "dob",
              gender: "gender",
              race: "race",
              phone: "phone",
              email: "email",
              block: "block",
              street: "street",
              floor: "floor",
              unit: "unit",
              postal: "postal",
              country: "country",
            };

    const setVal = (fieldId, val) => {
      const el = form.querySelector(`#${CSS.escape(fieldId)}`);
      if (el && "value" in el) el.value = val != null ? String(val) : "";
    };

    setVal(ids.fullName, client.name);
    setVal(ids.residential, client.residential);
    setRegistrationNricValue(form, ids.nricStore, client.nric);
    setVal(ids.dob, client.dob);
    setVal(ids.gender, client.gender);
    setVal(ids.race, client.race);
    setVal(ids.phone, client.phone);
    setVal(ids.email, client.email);
    setVal(ids.block, client.block);
    setVal(ids.street, client.street);
    setVal(ids.floor, client.floor);
    setVal(ids.unit, client.unit);
    setVal(ids.postal, client.postal);
    setVal(ids.country, client.country);
  }

  function bindRegistrationClientLookup(form) {
    if (!form || state.registerSelfService) return;
    const searchInput = form.querySelector("[data-reg-client-search]");
    const resetBtn = form.querySelector("[data-reg-client-search-reset]");
    const statusEl = form.querySelector("[data-reg-client-search-status]");
    if (!(searchInput instanceof HTMLInputElement)) return;

    const setStatus = (msg, isError) => {
      if (!(statusEl instanceof HTMLElement)) return;
      statusEl.textContent = msg || "";
      statusEl.classList.toggle("registration__client-search-status--error", Boolean(isError));
    };

    const runLookup = () => {
      const q = searchInput.value.trim();
      if (!q) {
        setStatus("Enter an NRIC or client name, then press Enter to search.", false);
        return;
      }
      const client = findExistingClientByRegistrationQuery(q);
      if (!client) {
        setStatus("No matching client found. You can continue as a new registration.", true);
        showToast("No existing client match");
        return;
      }
      applyRegistrationExistingClientAutofill(form, state.registerProgram, client);
      setStatus("Existing client found — personal details and residential address were filled in. Please verify before submitting.", false);
      showToast("Existing client found — details filled in");
    };

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        runLookup();
      }
    });

    resetBtn?.addEventListener("click", () => {
      searchInput.value = "";
      setStatus("");
      searchInput.focus();
    });
  }

  function renderRegisterMammobus() {
    const navHtml = renderRegistrationNavButtonsHtml();
    const clientLookupHtml = renderRegistrationClientLookupSection();

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
              <section id="reg-eligibility" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Screening Eligibility</h2>
                <div class="registration__eligibility" role="note">
                  <ol class="registration__eligibility-ol" type="a">
                    <li>Are a female Singapore Citizen or Permanent Resident aged 40 and above;</li>
                    <li>Have not gone for mammogram screening for the past 1 year (aged 40 to 49) or 2 years (aged 50 and above);</li>
                    <li>Do not have breast symptoms such as breast lumps or nipple discharge; and</li>
                    <li>Have not been breastfeeding for the past 6 months.</li>
                    <li>Not pregnant</li>
                  </ol>
                </div>
              </section>

              <section id="reg-personal" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Personal Information</h2>
                ${clientLookupHtml}
                <div class="form-grid form-grid--reg">
                  <div class="field">
                    <label for="fullName">Full Name (as per NRIC)<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="fullName" name="fullName" type="text" required autocomplete="name" placeholder="Enter full name as in NRIC" />
                  </div>
                  <div class="field">
                    <label for="residential">Residential Status</label>
                    <select id="residential" name="residential">
                      <option value="">Select Residential Status</option>
                      <option value="Citizen">Singapore Citizen</option>
                      <option value="PR">Permanent Resident</option>
                      <option value="Foreigner">Foreigner</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="nric">NRIC / FIN Number<span class="field__req" aria-hidden="true">*</span></label>
                    ${registrationNricField("nric", "nric", true)}
                  </div>
                  <div class="field">
                    <label for="dob">Date of Birth<span class="field__req" aria-hidden="true">*</span></label>
                    ${registrationDateInput("dob", "dob", true)}
                  </div>
                  <div class="field">
                    <label for="gender">Gender<span class="field__req" aria-hidden="true">*</span></label>
                    <select id="gender" name="gender" required>
                      <option value="">Select Gender</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="race">Race</label>
                    <select id="race" name="race">
                      <option value="">Select Race</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Malay">Malay</option>
                      <option value="Indian">Indian</option>
                      <option value="Eurasian">Eurasian</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="phone">Contact Number<span class="field__req" aria-hidden="true">*</span></label>
                    <div class="field__inline">
                      <input type="text" class="field__prefix" value="+65" disabled aria-label="Country code" />
                      <input id="phone" name="phone" type="tel" required placeholder="E.g. 8123 4567" />
                    </div>
                  </div>
                  <div class="field">
                    <label for="email">Email</label>
                    <input id="email" name="email" type="email" placeholder="Enter your email" />
                  </div>
                </div>
              </section>

              <section id="reg-address" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Residential Address</h2>
                <div class="form-grid form-grid--reg form-grid--address">
                  <div class="field">
                    <label for="block">Block<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="block" name="block" required placeholder="E.g. 202" />
                  </div>
                  <div class="field">
                    <label for="street">Street Name<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="street" name="street" required placeholder="E.g. Pasir Drive" />
                  </div>
                  <div class="field">
                    <label for="floor">Floor</label>
                    <input id="floor" name="floor" placeholder="E.g. 50" />
                  </div>
                  <div class="field">
                    <label for="unit">Unit No</label>
                    <input id="unit" name="unit" placeholder="E.g. 101 or 345" />
                  </div>
                  <div class="field">
                    <label for="postal">Postal Code<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="postal" name="postal" required placeholder="E.g. 123456" inputmode="numeric" maxlength="6" autocomplete="postal-code" />
                  </div>
                  <div class="field">
                    <label for="country">Country</label>
                    <select id="country" name="country" aria-label="Country">${REG_ADDRESS_COUNTRY_OPTIONS}
                    </select>
                  </div>
                </div>
              </section>

              <section id="reg-subsidies" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Healthier SG &amp; Subsidies</h2>
                <div class="form-grid form-grid--reg form-grid--subsidies">
                  <div class="field">
                    <label for="chasCardType">CHAS Card Type</label>
                    <select id="chasCardType" name="chasCardType">${REG_SUBSIDIES_CHAS_OPTIONS}
                    </select>
                  </div>
                  <div class="field">
                    <label for="healthierSg">Are you enrolled under Healthier SG?</label>
                    <select id="healthierSg" name="healthierSg">${REG_SUBSIDIES_HEALTHIER_SG_OPTIONS}
                    </select>
                  </div>
                  <fieldset class="registration__fieldset field">
                    <legend class="registration__fieldset-legend registration__fieldset-legend--field">Is this your first mammogram screening?<span class="field__req" aria-hidden="true">*</span></legend>
                    <div class="registration__radio-group" role="radiogroup" aria-required="true">
                      <label class="registration__radio-label"><input type="radio" name="firstMammogramScreening" value="yes" required /> Yes</label>
                      <label class="registration__radio-label"><input type="radio" name="firstMammogramScreening" value="no" /> No</label>
                    </div>
                  </fieldset>
                  <div class="field">
                    <label for="lastScreeningYear">Year of Last Screening</label>
                    <input id="lastScreeningYear" name="lastScreeningYear" type="text" inputmode="numeric" maxlength="4" placeholder="Enter Year of Last Screening" autocomplete="off" />
                  </div>
                </div>
              </section>

              <section id="reg-appointment-type" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Appointment Type</h2>
                <p class="registration__appointment-type-lead">
                  There are several avenues where you can sign up for a mammogram. Please select one of the options below.
                </p>
                <div class="registration__appointment-type" role="radiogroup" aria-label="Appointment Type">
                  <label class="registration__option-card registration__option-card--selected" data-option-card>
                    <input class="registration__option-card-input" type="radio" name="appointmentType" value="mammobus" checked />
                    <div class="registration__option-card-body">
                      <div class="registration__option-card-title-row">
                        <div class="registration__option-card-title">Community Mammobus Programme</div>
                        <span class="registration__option-card-ring" aria-hidden="true"></span>
                      </div>
                      <div class="registration__option-card-desc">
                        An initiative by SCS, BCF, and NHGD to bring subsidised mammogram screenings to different neighbourhoods across Singapore.
                      </div>
                      <div class="registration__option-card-note"><em>Note: The Mammobus is not wheelchair-accessible.</em></div>
                      <div class="registration__option-card-tag">Available to all eligible clients</div>
                    </div>
                  </label>

                  <label class="registration__option-card" data-option-card>
                    <input class="registration__option-card-input" type="radio" name="appointmentType" value="scs-clinic" />
                    <div class="registration__option-card-body">
                      <div class="registration__option-card-title-row">
                        <div class="registration__option-card-title">SCS Clinic @ Bishan</div>
                        <span class="registration__option-card-ring" aria-hidden="true"></span>
                      </div>
                      <div class="registration__option-card-desc">
                        Located at 9 Bishan Place, Junction 8 Office Tower, #06-05. Offers mammograms at no cost for eligible individuals with a Blue or Orange CHAS card, aged 50 and above.
                      </div>
                      <div class="registration__option-card-tag">You are eligible for this option</div>
                    </div>
                  </label>

                  <label class="registration__option-card" data-option-card>
                    <input class="registration__option-card-input" type="radio" name="appointmentType" value="healthier-sg" />
                    <div class="registration__option-card-body">
                      <div class="registration__option-card-title-row">
                        <div class="registration__option-card-title">Healthier SG Programme</div>
                        <span class="registration__option-card-ring" aria-hidden="true"></span>
                      </div>
                      <div class="registration__option-card-desc">
                        The national health screening programme under Health Promotion Board. Book an appointment for any recommended subsidised screening test on HealthHub.
                      </div>
                      <div class="registration__option-card-tag">Available to Singapore Citizens</div>
                    </div>
                  </label>
                </div>
              </section>

              <section id="reg-healthier-sg" class="registration-card registration__healthier-sg-extra" tabindex="-1" hidden>
                <h2 class="registration__section-label">Healthier SG Programme</h2>

                <div class="registration__question-card">
                  <div class="registration__question-kicker">QUESTION 1 OF 2</div>
                  <div class="registration__question-title">Have you booked your Healthier SG mammogram screening yet?</div>
                  <div class="registration__yesno" role="radiogroup" aria-label="Healthier SG booking status">
                    <label class="registration__yesno-btn" data-yesno>
                      <input class="registration__yesno-input" type="radio" name="healthierSgBooked" value="no" />
                      <span>No</span>
                    </label>
                    <label class="registration__yesno-btn" data-yesno>
                      <input class="registration__yesno-input" type="radio" name="healthierSgBooked" value="yes" />
                      <span>Yes</span>
                    </label>
                  </div>
                </div>

                <div class="registration__question-card">
                  <div class="registration__question-kicker">QUESTION 2 OF 2</div>
                  <div class="registration__question-title">When is the date of your screening?</div>
                  <div class="field field--full">
                    <input id="healthierSgScreeningDate" name="healthierSgScreeningDate" type="text" placeholder="DD/MM/YYYY" autocomplete="off" />
                  </div>
                </div>
              </section>

              <section id="reg-appointment" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Appointment Preferences</h2>
                <div class="form-grid form-grid--reg">
                  <div class="field">
                    <label for="preferredScreeningDate">Preferred Screening Date<span class="field__req" aria-hidden="true">*</span></label>
                    ${registrationDateInput("preferredScreeningDate", "preferredScreeningDate", true)}
                  </div>
                  <div class="field">
                    <label for="preferredTimeSlot">Preferred Time Slot</label>
                    <select id="preferredTimeSlot" name="preferredTimeSlot">
                      <option value="">Select Preferred Time Slot</option>
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                      <option value="evening">Evening</option>
                    </select>
                  </div>
                  <div class="field field--full">
                    <label for="screeningLocationEvent">Screening Location / Event</label>
                    <input id="screeningLocationEvent" name="screeningLocationEvent" type="text" placeholder="Enter Screening Location / Event" />
                  </div>
                </div>
              </section>

              <section id="reg-screening" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Screening Questions</h2>
                <div class="registration__stack">
                  <fieldset class="registration__fieldset field field--full">
                    <legend class="registration__fieldset-legend">Are you currently taking or will be taking COVID-19 vaccine soon? (If you are taking COVID-19 vaccine, it is advisable to go for your mammogram screening either before the vaccination, OR 6 weeks after the vaccination)<span class="field__req" aria-hidden="true">*</span></legend>
                    <div class="registration__radio-group registration__radio-group--stack" role="radiogroup" aria-required="true">
                      <label class="registration__radio-label"><input type="radio" name="covid19VaccineSoon" value="no" required /> No</label>
                      <label class="registration__radio-label"><input type="radio" name="covid19VaccineSoon" value="yes" /> Yes</label>
                    </div>
                  </fieldset>
                  <fieldset class="registration__fieldset field field--full">
                    <legend class="registration__fieldset-legend">Have you done a mammogram in the past 12months (Only for those 40 to 49 years old) or 24months (Only for those 50 years &amp; above)?<span class="field__req" aria-hidden="true">*</span></legend>
                    <div class="registration__radio-group registration__radio-group--stack" role="radiogroup" aria-required="true">
                      <label class="registration__radio-label"><input type="radio" name="mammogramPast12or24Months" value="no" required /> No</label>
                      <label class="registration__radio-label registration__radio-label--block"><input type="radio" name="mammogramPast12or24Months" value="yes" /><span>Yes (If you have done a mammogram test in the past 12 months (Only for those 40 to 49 years old) or 24months (Only for those 50 years &amp; above), please arrange your appointment after 12 or 24 months have passed from your last test.)</span></label>
                    </div>
                  </fieldset>
                  <fieldset class="registration__fieldset field field--full">
                    <legend class="registration__fieldset-legend">Have you been breastfeeding in the past 6 months?<span class="field__req" aria-hidden="true">*</span></legend>
                    <div class="registration__radio-group registration__radio-group--stack" role="radiogroup" aria-required="true">
                      <label class="registration__radio-label"><input type="radio" name="breastfeedingPast6Months" value="no" required /> No</label>
                      <label class="registration__radio-label registration__radio-label--block"><input type="radio" name="breastfeedingPast6Months" value="yes" /><span>Yes (A screening mammogram is not recommended for you if you have been breastfeeding in the past 6 months. Please make an appointment 6 months after you have stopped breastfeeding.)</span></label>
                    </div>
                  </fieldset>
                  <fieldset class="registration__fieldset field field--full">
                    <legend class="registration__fieldset-legend">Do you have any symptoms (e.g. lumps or pain) in your breast?<span class="field__req" aria-hidden="true">*</span></legend>
                    <div class="registration__radio-group registration__radio-group--stack" role="radiogroup" aria-required="true">
                      <label class="registration__radio-label"><input type="radio" name="breastSymptoms" value="no" required /> No</label>
                      <label class="registration__radio-label registration__radio-label--block"><input type="radio" name="breastSymptoms" value="yes" /><span>Yes (A screening mammogram is not recommended for you if you display symptoms in your breast(s). Please consult your doctor for further advice.)</span></label>
                    </div>
                  </fieldset>
                  <fieldset class="registration__fieldset field field--full">
                    <legend class="registration__fieldset-legend">Do you have any breast implants?<span class="field__req" aria-hidden="true">*</span></legend>
                    <div class="registration__radio-group registration__radio-group--stack" role="radiogroup" aria-required="true">
                      <label class="registration__radio-label"><input type="radio" name="breastImplants" value="no" required /> No</label>
                      <label class="registration__radio-label registration__radio-label--block"><input type="radio" name="breastImplants" value="yes" /><span>Yes (Special screening techniques are required for women with implants. This service is not available at NHG Diagnostics mammogram screening centres. Pls call any of the following Breast Assessment Centres to make an appointment at National University Hospital (6772 2263) or Tan Tock Seng Hospital (6357 8177).)</span></label>
                    </div>
                  </fieldset>
                  <fieldset class="registration__fieldset field field--full">
                    <legend class="registration__fieldset-legend">Have you ever had breast cancer?<span class="field__req" aria-hidden="true">*</span></legend>
                    <div class="registration__radio-group registration__radio-group--stack" role="radiogroup" aria-required="true">
                      <label class="registration__radio-label"><input type="radio" name="everHadBreastCancer" value="no" required /> No</label>
                      <label class="registration__radio-label registration__radio-label--block"><input type="radio" name="everHadBreastCancer" value="yes" /><span>Yes (A screening mammogram is not recommended for you if you have a history of breast cancer and have not been discharged. You are advised to consult your doctor for follow up sessions on your condition.)</span></label>
                    </div>
                  </fieldset>
                </div>
              </section>

              <section id="reg-engagement" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Engagement</h2>
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

              <section id="reg-consent" class="registration-card registration-card--fit-consent" tabindex="-1">
                <h2 class="registration__section-label">Consent</h2>
                <div class="registration__fit-consent-body">
                  <div class="registration__consent">
                    <label class="registration__consent-row">
                      <input type="checkbox" name="consent" id="consent" required />
                      <span>I confirm that my personal data is accurate and complete and I fully understand and accept the terms and conditions under the NHG Personal Data Protection Policy <a href="https://www.nhgd.com.sg/Pages/Personal-Data-Protection-Notification.aspx" class="registration__consent-link" target="_blank" rel="noopener noreferrer">https://www.nhgd.com.sg/Pages/Personal-Data-Protection-Notification.aspx</a>. I may withdraw my consent anytime through <a href="mailto:askNHGD@diagnostics.nhg.com.sg" class="registration__consent-link">askNHGD@diagnostics.nhg.com.sg</a>.<span class="field__req" aria-hidden="true">*</span></span>
                    </label>
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
    const clientLookupHtml = renderRegistrationClientLookupSection();

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
              <section id="reg-hpv-eligibility" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Screening Eligibility</h2>
                <div class="registration__eligibility" role="note">
                  <div class="registration__eligibility-block">
                    <p class="registration__eligibility-subtitle">Pap Test</p>
                    <ul>
                      <li>Screening for cervical cancer</li>
                      <li>For females who have not done Pap test in the last 3 years</li>
                      <li>Recommended frequency: Once every 3 years</li>
                    </ul>
                  </div>
                  <div class="registration__eligibility-block">
                    <p class="registration__eligibility-subtitle">HPV Test</p>
                    <ul>
                      <li>Screening for cervical cancer</li>
                      <li>For females who have not done HPV test in the last 5 years</li>
                      <li>Recommended frequency: Once every 5 years</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="reg-hpv-personal" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Personal Information</h2>
                ${clientLookupHtml}
                <div class="form-grid form-grid--reg">
                  <div class="field">
                    <label for="hpvFullName">Full Name (as per NRIC)<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="hpvFullName" name="hpvFullName" type="text" required autocomplete="name" placeholder="Enter full name as in NRIC" />
                  </div>
                  <div class="field">
                    <label for="hpvResidential">Residential Status</label>
                    <select id="hpvResidential" name="hpvResidential">
                      <option value="">Select Residential Status</option>
                      <option value="Citizen">Singapore Citizen</option>
                      <option value="PR">Permanent Resident</option>
                      <option value="Foreigner">Foreigner</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="hpvNric">NRIC / FIN Number<span class="field__req" aria-hidden="true">*</span></label>
                    ${registrationNricField("hpvNric", "hpvNric", true)}
                  </div>
                  <div class="field">
                    <label for="hpvDob">Date of Birth<span class="field__req" aria-hidden="true">*</span></label>
                    ${registrationDateInput("hpvDob", "hpvDob", true)}
                  </div>
                  <div class="field">
                    <label for="hpvGender">Gender<span class="field__req" aria-hidden="true">*</span></label>
                    <select id="hpvGender" name="hpvGender" required>
                      <option value="">Select Gender</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="hpvRace">Race</label>
                    <select id="hpvRace" name="hpvRace">
                      <option value="">Select Race</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Malay">Malay</option>
                      <option value="Indian">Indian</option>
                      <option value="Eurasian">Eurasian</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="hpvMobile">Contact Number<span class="field__req" aria-hidden="true">*</span></label>
                    <div class="field__inline">
                      <input type="text" class="field__prefix" value="+65" disabled aria-label="Country code" />
                      <input id="hpvMobile" name="hpvMobile" type="tel" required placeholder="E.g. 8123 4567" />
                    </div>
                  </div>
                  <div class="field">
                    <label for="hpvEmail">Email</label>
                    <input id="hpvEmail" name="hpvEmail" type="email" placeholder="Enter your email" />
                  </div>
                </div>
              </section>

              <section id="reg-hpv-address" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Residential Address</h2>
                <div class="form-grid form-grid--reg form-grid--address">
                  <div class="field">
                    <label for="hpvBlock">Block</label>
                    <input id="hpvBlock" name="hpvBlock" placeholder="E.g. 202" />
                  </div>
                  <div class="field">
                    <label for="hpvStreet">Street Name</label>
                    <input id="hpvStreet" name="hpvStreet" placeholder="E.g. Pasir Drive" />
                  </div>
                  <div class="field">
                    <label for="hpvFloor">Floor</label>
                    <input id="hpvFloor" name="hpvFloor" placeholder="E.g. 50" />
                  </div>
                  <div class="field">
                    <label for="hpvUnit">Unit No</label>
                    <input id="hpvUnit" name="hpvUnit" placeholder="E.g. 101 or 345" />
                  </div>
                  <div class="field">
                    <label for="hpvPostal">Postal Code<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="hpvPostal" name="hpvPostal" required placeholder="E.g. 123456" inputmode="numeric" maxlength="6" autocomplete="postal-code" />
                  </div>
                  <div class="field">
                    <label for="hpvCountry">Country</label>
                    <select id="hpvCountry" name="hpvCountry" aria-label="Country">${REG_ADDRESS_COUNTRY_OPTIONS}
                    </select>
                  </div>
                </div>
              </section>

              <section id="reg-hpv-subsidies" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Healthier SG &amp; Subsidies</h2>
                <div class="form-grid form-grid--reg form-grid--subsidies">
                  <div class="field">
                    <label for="hpvChasCardType">CHAS Card Type</label>
                    <select id="hpvChasCardType" name="hpvChasCardType">${REG_SUBSIDIES_CHAS_OPTIONS}
                    </select>
                  </div>
                  <div class="field">
                    <label for="hpvHealthierSg">Are you enrolled under Healthier SG?</label>
                    <select id="hpvHealthierSg" name="hpvHealthierSg">${REG_SUBSIDIES_HEALTHIER_SG_OPTIONS}
                    </select>
                  </div>
                  <fieldset class="registration__fieldset field">
                    <legend class="registration__fieldset-legend registration__fieldset-legend--field">Is this your first HPV screening?</legend>
                    <div class="registration__radio-group" role="radiogroup">
                      <label class="registration__radio-label"><input type="radio" name="firstHpvScreening" value="yes" /> Yes</label>
                      <label class="registration__radio-label"><input type="radio" name="firstHpvScreening" value="no" /> No</label>
                    </div>
                  </fieldset>
                  <div class="field">
                    <label for="hpvLastScreeningYear">Year of Last Screening</label>
                    <input id="hpvLastScreeningYear" name="hpvLastScreeningYear" type="text" inputmode="numeric" maxlength="4" placeholder="Enter Year of Last Screening" autocomplete="off" />
                  </div>
                </div>
              </section>

              <section id="reg-hpv-appointment" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Appointment Preferences</h2>
                <div class="form-grid form-grid--reg">
                  <div class="field">
                    <label for="hpvPreferredDate">Preferred Screening Date<span class="field__req" aria-hidden="true">*</span></label>
                    ${registrationDateInput("hpvPreferredDate", "hpvPreferredDate", true)}
                  </div>
                  <div class="field">
                    <label for="hpvPreferredTime">Preferred Time Slot</label>
                    <select id="hpvPreferredTime" name="hpvPreferredTime">
                      <option value="">Select Preferred Time Slot</option>
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                      <option value="evening">Evening</option>
                    </select>
                  </div>
                  <div class="field field--full">
                    <label for="hpvScreeningLocation">Screening Location / Event</label>
                    <input id="hpvScreeningLocation" name="hpvScreeningLocation" type="text" placeholder="Enter Screening Location / Event" />
                  </div>
                </div>
              </section>

              <section id="reg-hpv-engagement" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Engagement</h2>
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

              <section id="reg-hpv-consent" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Consent</h2>
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
    const clientLookupHtml = renderRegistrationClientLookupSection();

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
              <section id="reg-fit-eligibility" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Screening Eligibility</h2>
                <div class="registration__eligibility" role="note">
                  <p class="registration__eligibility-title">Collection Eligibility</p>
                  <ul>
                    <li>50 years old &amp; above</li>
                    <li>Singaporean or PR</li>
                    <li>Produces IC</li>
                  </ul>
                </div>
              </section>

              <section id="reg-fit-personal" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Personal Information</h2>
                ${clientLookupHtml}
                <div class="form-grid form-grid--reg">
                  <div class="field">
                    <label for="fitFullName">Full Name (as per NRIC)<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="fitFullName" name="fitFullName" type="text" required autocomplete="name" placeholder="Enter full name as in NRIC" />
                  </div>
                  <div class="field">
                    <label for="fitResidential">Residential Status</label>
                    <select id="fitResidential" name="fitResidential">
                      <option value="">Select Residential Status</option>
                      <option value="Citizen">Singapore Citizen</option>
                      <option value="PR">Permanent Resident</option>
                      <option value="Foreigner">Foreigner</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="fitNric">NRIC / FIN Number<span class="field__req" aria-hidden="true">*</span></label>
                    ${registrationNricField("fitNric", "fitNric", true)}
                  </div>
                  <div class="field">
                    <label for="fitDob">Date of Birth<span class="field__req" aria-hidden="true">*</span></label>
                    ${registrationDateInput("fitDob", "fitDob", true)}
                  </div>
                  <div class="field">
                    <label for="fitGender">Gender<span class="field__req" aria-hidden="true">*</span></label>
                    <select id="fitGender" name="fitGender" required>
                      <option value="">Select Gender</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="fitRace">Race</label>
                    <select id="fitRace" name="fitRace">
                      <option value="">Select Race</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Malay">Malay</option>
                      <option value="Indian">Indian</option>
                      <option value="Eurasian">Eurasian</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="fitContact">Contact Number<span class="field__req" aria-hidden="true">*</span></label>
                    <div class="field__inline">
                      <input type="text" class="field__prefix" value="+65" disabled aria-label="Country code" />
                      <input id="fitContact" name="fitContact" type="tel" required placeholder="E.g. 8123 4567" />
                    </div>
                  </div>
                  <div class="field">
                    <label for="fitEmail">Email</label>
                    <input id="fitEmail" name="fitEmail" type="email" placeholder="Enter your email" />
                  </div>
                </div>
              </section>

              <section id="reg-fit-address" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Residential Address</h2>
                <div class="form-grid form-grid--reg form-grid--address">
                  <div class="field">
                    <label for="fitBlock">Block</label>
                    <input id="fitBlock" name="fitBlock" placeholder="E.g. 202" />
                  </div>
                  <div class="field">
                    <label for="fitStreet">Street Name</label>
                    <input id="fitStreet" name="fitStreet" placeholder="E.g. Pasir Drive" />
                  </div>
                  <div class="field">
                    <label for="fitFloor">Floor</label>
                    <input id="fitFloor" name="fitFloor" placeholder="E.g. 50" />
                  </div>
                  <div class="field">
                    <label for="fitUnit">Unit No</label>
                    <input id="fitUnit" name="fitUnit" placeholder="E.g. 101 or 345" />
                  </div>
                  <div class="field">
                    <label for="fitPostal">Postal Code<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="fitPostal" name="fitPostal" required placeholder="E.g. 123456" inputmode="numeric" maxlength="6" autocomplete="postal-code" />
                  </div>
                  <div class="field">
                    <label for="fitCountry">Country</label>
                    <select id="fitCountry" name="fitCountry" aria-label="Country">${REG_ADDRESS_COUNTRY_OPTIONS}
                    </select>
                  </div>
                </div>
              </section>

              <section id="reg-fit-subsidies" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Healthier SG &amp; Subsidies</h2>
                <div class="form-grid form-grid--reg form-grid--subsidies">
                  <div class="field">
                    <label for="fitChasCardType">CHAS Card Type</label>
                    <select id="fitChasCardType" name="fitChasCardType">${REG_SUBSIDIES_CHAS_OPTIONS}
                    </select>
                  </div>
                  <div class="field">
                    <label for="fitHealthierSg">Are you enrolled under Healthier SG?</label>
                    <select id="fitHealthierSg" name="fitHealthierSg">${REG_SUBSIDIES_HEALTHIER_SG_OPTIONS}
                    </select>
                  </div>
                  <fieldset class="registration__fieldset field">
                    <legend class="registration__fieldset-legend registration__fieldset-legend--field">Is this your first FIT screening?</legend>
                    <div class="registration__radio-group" role="radiogroup">
                      <label class="registration__radio-label"><input type="radio" name="firstFitScreening" value="yes" /> Yes</label>
                      <label class="registration__radio-label"><input type="radio" name="firstFitScreening" value="no" /> No</label>
                    </div>
                  </fieldset>
                  <div class="field">
                    <label for="fitLastScreeningYear">Year of Last Screening</label>
                    <input id="fitLastScreeningYear" name="fitLastScreeningYear" type="text" inputmode="numeric" maxlength="4" placeholder="Enter Year of Last Screening" autocomplete="off" />
                  </div>
                </div>
              </section>

              <section id="reg-fit-appointment" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Appointment Preferences</h2>
                <div class="form-grid form-grid--reg">
                  <div class="field">
                    <label for="fitPreferredScreeningDate">Preferred Screening Date<span class="field__req" aria-hidden="true">*</span></label>
                    ${registrationDateInput("fitPreferredScreeningDate", "fitPreferredScreeningDate", true)}
                  </div>
                  <div class="field">
                    <label for="fitPreferredTimeSlot">Preferred Time Slot</label>
                    <select id="fitPreferredTimeSlot" name="fitPreferredTimeSlot">
                      <option value="">Select Preferred Time Slot</option>
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                      <option value="evening">Evening</option>
                    </select>
                  </div>
                  <div class="field field--full">
                    <label for="fitScreeningLocation">Screening Location / Event</label>
                    <input id="fitScreeningLocation" name="fitScreeningLocation" type="text" placeholder="Enter Screening Location / Event" />
                  </div>
                </div>
              </section>

              <section id="reg-fit-engagement" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Engagement</h2>
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

              <section id="reg-fit-consent" class="registration-card registration-card--fit-consent" tabindex="-1">
                <h2 class="registration__section-label">Consent</h2>
                <div class="registration__fit-consent-body">
                  <p class="registration__fit-consent-lead" id="fit-comms-pref-intro">
                    If you wish to receive communications on Singapore Cancer Society (SCS) activities, programmes and services via phone call and/or text message to a phone number or numbers that you have provided to SCS, please tick the relevant box(es):
                  </p>
                  <div class="registration__checkbox-stack registration__fit-consent-checks" role="group" aria-labelledby="fit-comms-pref-intro">
                    <label class="registration__check-label"><input type="checkbox" name="fitCommSms" value="1" /> Text Message</label>
                    <label class="registration__check-label"><input type="checkbox" name="fitCommPhone" value="1" /> Phone Call</label>
                  </div>
                  <div class="registration__fit-consent-legal">
                    <p>
                      In any event, you agree that SCS may contact you via email and/or post on the follow-up to the screening completed on this form, its activities, programmes and services; including (but not limiting to) reminders for rescreen appointment, invitation to cancer awareness public forums, follow-up general cancer management communication to you, etc.
                    </p>
                    <p>
                      If you do not wish to receive such communications as aforesaid, or if you wish to make changes to consent previously given, you may email to <a href="mailto:dataprotection@singaporecancersociety.org.sg" class="registration__consent-link">dataprotection@singaporecancersociety.org.sg</a>.
                    </p>
                    <p>
                      If you opt out of communications or make changes to consent previously given, please understand that it may affect SCS&apos; ability to provide relevant services to you.
                    </p>
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

  function renderFilterModal() {
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

  function renderDetailAddNoteModal() {
    if (!state.detailAddNoteModalOpen || (state.route !== "detail" && state.route !== "prospectv3")) return "";
    const rowKey = state.detail.rowKey;
    const editId = state.detailNoteEditId;
    let initial = "";
    if (editId) {
      const n = detailNotesForRender(rowKey).find((x) => x.id === editId);
      if (n) initial = n.body || "";
    }
    const isEdit = Boolean(editId);
    const title = isEdit ? "Edit note" : "Add note";
    const submitLabel = isEdit ? "Save" : "Add";
    return `
      <div class="ui-dialog-overlay" id="detail-add-note-modal" role="presentation">
        <div class="ui-dialog ui-dialog--add-note" role="dialog" aria-modal="true" aria-labelledby="detail-add-note-title">
          <div class="ui-dialog__close">
            <button type="button" class="ui-btn ui-btn--ghost ui-btn--icon" data-detail-add-note-dismiss aria-label="Close">${icons.x}</button>
          </div>
          <div class="ui-dialog__header">
            <h2 class="ui-dialog__title" id="detail-add-note-title">${escapeAttr(title)}</h2>
          </div>
          <div class="ui-dialog__body">
            <div class="field field--full">
              <label for="detail-add-note-text">Note</label>
              <textarea id="detail-add-note-text" class="detail-add-note-textarea" rows="10" placeholder="Enter your note..." autocomplete="off">${escapeAttr(initial)}</textarea>
            </div>
          </div>
          <div class="ui-dialog__footer">
            <div class="ui-dialog__footer-actions">
              <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-detail-add-note-dismiss>Cancel</button>
              <button type="button" class="ui-btn ui-btn--default ui-btn--sm" data-detail-add-note-submit>${escapeAttr(submitLabel)}</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderDetailDeleteNoteModal() {
    if (!state.detailDeleteNoteId || (state.route !== "detail" && state.route !== "prospectv3")) return "";
    return `
      <div class="ui-dialog-overlay" id="detail-delete-note-modal" role="presentation">
        <div class="ui-dialog ui-dialog--delete-note" role="alertdialog" aria-modal="true" aria-labelledby="detail-delete-note-title">
          <div class="ui-dialog__header">
            <h2 class="ui-dialog__title" id="detail-delete-note-title">Delete note?</h2>
          </div>
          <div class="ui-dialog__body">
            <p class="ui-dialog__lede">This will permanently remove this note. This action cannot be undone.</p>
          </div>
          <div class="ui-dialog__footer">
            <div class="ui-dialog__footer-actions">
              <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-detail-delete-note-cancel>Cancel</button>
              <button type="button" class="ui-btn ui-btn--danger ui-btn--sm" data-detail-delete-note-confirm>Delete</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderModal() {
    return (
      renderFilterModal() +
      renderDetailAddNoteModal() +
      renderDetailDeleteNoteModal() +
      renderProspectV3BiodataModal() +
      renderClassicScreeningUpdateModal() +
      renderClassicScreeningTasksModal()
    );
  }

  /** file:// and some browsers can leave location.hash empty on first paint while href still has #/route */
  function getRouteHash() {
    const h = location.hash;
    if (h && h !== "#") return h;
    const u = window.location.href;
    const i = u.indexOf("#");
    return i >= 0 ? u.slice(i) : "";
  }

  function applyDerivedRouteState() {
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
        if (state.detailTab === "details") state.detailNavSection = "detail-personal";
        else if (state.detailTab === "medical-history") state.detailNavSection = "mh-family";
        else if (state.detailTab === "other-details") state.detailNavSection = "od-medical";
      }
      lastDetailTabForForm = state.detailTab;
    }

    const onClassicNotes = state.route === "detail" && state.detailTab === "notes";
    const onV1Notes = state.route === "prospectv3" && state.prospectV3Tab === "notes";
    if (!onClassicNotes && !onV1Notes) {
      state.detailAddNoteModalOpen = false;
      state.detailNoteEditId = null;
      state.detailDeleteNoteId = null;
    }

    const onClassicScreenings =
      (state.route === "detail" && state.detailTab === "screening") ||
      (state.route === "prospectv3" && state.prospectV3Tab === "screenings");
    if (!onClassicScreenings) {
      state.classicScreeningUpdateModalId = null;
    }
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
    } else if (head === "screening") {
      state.route = "screening";
      state.routeId = parts[1] ? decodeURIComponent(parts[1]) : DETAIL_DEFAULT.rowKey;
      if (parts[2]) {
        const tab = decodeURIComponent(parts[2]).trim().toLowerCase();
        state.screeningTab = SCREENING_TAB_IDS.includes(tab) ? tab : "details";
      } else {
        state.screeningTab = "details";
      }
    } else if (head === "screeningv4") {
      const ridDecoded = parts[1] ? decodeURIComponent(parts[1]) : DETAIL_DEFAULT.rowKey;
      let tab = "details";
      if (parts[2]) {
        const t = decodeURIComponent(parts[2]).trim().toLowerCase();
        if (SCREENING_TAB_IDS.includes(t)) tab = t;
        else if (t === "timeline") tab = "details";
      }
      state.route = "screening";
      state.routeId = ridDecoded;
      state.screeningTab = tab;
      const tabPath = tab === "details" ? "" : `/${encodeURIComponent(tab)}`;
      const nextHash = `#/screening/${encodeURIComponent(ridDecoded)}${tabPath}`;
      if (getRouteHash() !== nextHash) location.replace(nextHash);
      applyDerivedRouteState();
      return;
    } else if (head === "client360") {
      const ridRaw = parts[1] ? parts[1] : DETAIL_DEFAULT.rowKey;
      const ridDecoded = decodeURIComponent(ridRaw);
      let tab = "overview";
      if (parts[2]) {
        const t = decodeURIComponent(parts[2]).trim().toLowerCase();
        if (t === "screenings" || t === "biodata" || t === "notes") tab = t;
      }
      state.route = "prospectv3";
      state.routeId = ridDecoded;
      state.prospectV3Tab = tab;
      if (state.prospectV3Tab !== "biodata") {
        state.prospectV3BiodataModalOpen = false;
        state.prospectV3BiodataDraft = null;
      }
      const tabPath = tab === "overview" ? "" : `/${encodeURIComponent(tab)}`;
      const nextHash = `#/prospectv3/${encodeURIComponent(ridDecoded)}${tabPath}`;
      if (getRouteHash() !== nextHash) location.replace(nextHash);
      applyDerivedRouteState();
      return;
    } else if (head === "prospect") {
      state.route = "detail";
      state.routeId = parts[1] ? decodeURIComponent(parts[1]) : DETAIL_DEFAULT.rowKey;
      if (parts[2]) {
        let tab = decodeURIComponent(parts[2]).trim().toLowerCase();
        if (tab === "overview") tab = "details";
        state.detailTab = DETAIL_TAB_IDS.includes(tab) ? tab : "details";
      } else {
        state.detailTab = "details";
      }
    } else if (head === "prospectv3") {
      state.route = "prospectv3";
      state.routeId = parts[1] ? decodeURIComponent(parts[1]) : DETAIL_DEFAULT.rowKey;
      if (parts[2]) {
        const tab = decodeURIComponent(parts[2]).trim().toLowerCase();
        state.prospectV3Tab = PROSPECT_V3_TAB_IDS.includes(tab) ? tab : "overview";
      } else {
        state.prospectV3Tab = "overview";
      }
      if (state.prospectV3Tab !== "biodata") {
        state.prospectV3BiodataModalOpen = false;
        state.prospectV3BiodataDraft = null;
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
    applyDerivedRouteState();
  }

  let registrationScrollCleanup = null;
  let detailSectionScrollCleanup = null;

  function teardownRegistrationScrollSpy() {
    if (typeof registrationScrollCleanup === "function") {
      registrationScrollCleanup();
      registrationScrollCleanup = null;
    }
  }

  function teardownDetailSectionScrollSpy() {
    if (typeof detailSectionScrollCleanup === "function") {
      detailSectionScrollCleanup();
      detailSectionScrollCleanup = null;
    }
  }

  function setDetailNavActive(sectionId) {
    state.detailNavSection = sectionId;
    document.querySelectorAll("[data-detail-section-nav]").forEach((btn) => {
      const bid = btn.getAttribute("data-detail-section-nav");
      btn.classList.toggle("is-active", bid === sectionId);
    });
  }

  /** Pixels to leave clear below sticky header + tab row inside #detail-flow-scroll-root. */
  function getDetailStickyScrollInset() {
    const root = document.getElementById("detail-flow-scroll-root");
    if (!root) return 0;
    const header = root.querySelector(":scope > .app-header");
    const bundle = root.querySelector(".detail-sticky-chrome--primary-bundle");
    let h = 0;
    if (header instanceof HTMLElement) h += header.offsetHeight;
    if (bundle instanceof HTMLElement) h += bundle.offsetHeight;
    return Math.round(h + 12);
  }

  /** Prefer the visible section title for scroll / spy alignment. */
  function detailSectionScrollMarker(sectionEl) {
    if (!(sectionEl instanceof HTMLElement)) return sectionEl;
    const title = sectionEl.querySelector(":scope > .detail-card__title");
    return title instanceof HTMLElement ? title : sectionEl;
  }

  /** Scroll the detail scroll root so the section title sits just below sticky chrome. */
  function scrollDetailSectionIntoView(sectionId) {
    const root = document.getElementById("detail-flow-scroll-root");
    const target = document.getElementById(sectionId);
    if (!root || !target) return;
    const marker = detailSectionScrollMarker(target);
    const inset = getDetailStickyScrollInset();
    const rootRect = root.getBoundingClientRect();
    const tRect = marker.getBoundingClientRect();
    const y = tRect.top - rootRect.top + root.scrollTop;
    const nextTop = Math.max(0, y - inset);
    root.scrollTo({ top: nextTop, behavior: "smooth" });
  }

  function detailSectionIdsForActiveTab() {
    return DETAIL_TAB_SECTION_IDS[state.detailTab] || [];
  }

  function setupDetailSectionScrollSpy() {
    teardownDetailSectionScrollSpy();
    if (state.route !== "detail") return;
    const ids = detailSectionIdsForActiveTab();
    if (!ids.length) return;
    const root = document.getElementById("detail-flow-scroll-root");
    if (!root) return;

    const pickActive = () => {
      if (window.__detailNavProgrammaticScroll) return;
      const inset = getDetailStickyScrollInset();
      const anchorY = root.getBoundingClientRect().top + inset + 16;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const marker = detailSectionScrollMarker(el);
        const r = marker.getBoundingClientRect();
        if (r.top <= anchorY) current = id;
      }
      if (current !== state.detailNavSection) setDetailNavActive(current);
    };

    const onScroll = () => {
      pickActive();
    };

    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
    detailSectionScrollCleanup = () => {
      root.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
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
    const shell = el.closest(".field__nric");
    const edit = shell?.querySelector?.(".field__nric-edit");
    if (edit instanceof HTMLInputElement) edit.disabled = true;
    const toggle = shell?.querySelector?.("[data-nric-toggle]");
    if (toggle instanceof HTMLButtonElement) toggle.disabled = true;

    // Date text input: disable calendar button too so it picks up disabled styling.
    if (el.classList?.contains?.("field__date-text")) {
      const wrap = el.closest(".field__date");
      const btn = wrap?.querySelector?.(".field__date-btn");
      if (btn instanceof HTMLButtonElement) btn.disabled = true;
    }
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
      lockSingpassSelect("race", d.race);
      lockSingpassSelect("residential", d.residential);
      lockSingpassInput("email", d.email);
      lockSingpassInput("phone", d.phone);
      lockSingpassInput("postal", d.postal);
      lockSingpassInput("block", d.block);
      lockSingpassInput("street", d.street);
      lockSingpassInput("floor", d.floor);
      lockSingpassInput("unit", d.unit);
      lockSingpassSelect("country", d.country);
      lockSingpassSelect("chasCardType", d.chasCardType);
    } else if (p === "hpv") {
      lockSingpassInput("hpvFullName", d.fullName);
      lockSingpassInput("hpvNric", d.nricFull);
      lockSingpassInput("hpvDob", d.dob);
      lockSingpassSelect("hpvGender", d.gender);
      lockSingpassSelect("hpvRace", d.race);
      lockSingpassSelect("hpvResidential", d.residential);
      lockSingpassInput("hpvEmail", d.email);
      lockSingpassInput("hpvMobile", d.phone);
      lockSingpassInput("hpvPostal", d.postal);
      lockSingpassInput("hpvBlock", d.block);
      lockSingpassInput("hpvStreet", d.street);
      lockSingpassInput("hpvFloor", d.floor);
      lockSingpassInput("hpvUnit", d.unit);
      lockSingpassSelect("hpvCountry", d.country);
      lockSingpassSelect("hpvChasCardType", d.chasCardType);
    } else if (p === "fit") {
      lockSingpassInput("fitFullName", d.fullName);
      lockSingpassInput("fitNric", d.nricFull);
      lockSingpassInput("fitDob", d.dob);
      lockSingpassSelect("fitGender", d.gender);
      lockSingpassSelect("fitRace", d.race);
      lockSingpassSelect("fitResidential", d.residential);
      lockSingpassSelect("fitChasCardType", d.chasCardType);
      lockSingpassInput("fitBlock", d.block);
      lockSingpassInput("fitStreet", d.street);
      lockSingpassInput("fitFloor", d.floor);
      lockSingpassInput("fitUnit", d.unit);
      lockSingpassInput("fitPostal", d.postal);
      lockSingpassSelect("fitCountry", d.country);
      lockSingpassInput("fitEmail", d.email);
      lockSingpassInput("fitContact", d.phone);
    }
  }

  function renderApp() {
    parseRoute();
    if (state.route !== "detail") state.activityTimelineDrawerOpen = false;
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
    applyClassicScreeningRowExpandFromNavigation();
    teardownRegistrationScrollSpy();
    teardownDetailSectionScrollSpy();
    if (state.route !== "list") state.programMenuOpen = false;
    if (state.route !== "list") state.addProspectMenuOpen = false;
    const app = document.getElementById("app");
    let main = "";
    if (state.route === "detail") main = renderDetailPage();
    else if (state.route === "screening") main = renderScreeningDetailsPage();
    else if (state.route === "prospectv3") main = renderProspectDetailV3Page();
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
            <div id="registration-scroll-root" class="app-main--registration-scroll">
              ${mainInner}
              ${renderAppFooter({ variant: "registration-end" })}
            </div>
          </main>
        </div>
      </div>
      ${state.registerSelfService ? renderRegistrationNavDrawer() : ""}
      ${renderModal()}
    `;
      bindEvents();
      setupRegistrationScrollSpy();
      requestAnimationFrame(() => {
        applySingpassDemoAndLocks();
        if (typeof window.WD_syncNricMasks === "function") {
          window.WD_syncNricMasks(document.getElementById("registration-scroll-root") || document.getElementById("app"));
        }
        if (typeof window.WD_syncDatePickersFromFields === "function") {
          window.WD_syncDatePickersFromFields(document.getElementById("app"));
        }
      });
      return;
    }

    if (state.route === "detail") {
      const preserveDetailScroll = state.detailScrollPreservePending;
      state.detailScrollPreservePending = false;
      const prevScrollRoot = preserveDetailScroll ? document.getElementById("detail-flow-scroll-root") : null;
      const prevDetailScrollTop = prevScrollRoot ? prevScrollRoot.scrollTop : null;

      const detailMainClass =
        DETAIL_FORM_TAB_IDS.includes(state.detailTab) ? "app-main app-main--detail-page detail-page--form-toolbar" : "app-main app-main--detail-page";
      app.innerHTML = `
      <div class="app-shell app-shell--detail-flow">
        <div id="detail-flow-scroll-root" class="detail-flow-scroll-root">
          ${renderHeader()}
          <div class="app-content app-content--detail-flow">
            <main class="${detailMainClass}">${main}</main>
            ${renderAppFooter()}
          </div>
        </div>
      </div>
      ${renderModal()}
    `;
      bindEvents();
      if (prevDetailScrollTop != null) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const sr = document.getElementById("detail-flow-scroll-root");
            if (!sr) return;
            const maxTop = Math.max(0, sr.scrollHeight - sr.clientHeight);
            sr.scrollTop = Math.min(prevDetailScrollTop, maxTop);
            setupDetailSectionScrollSpy();
          });
        });
      } else {
        requestAnimationFrame(() => {
          setupDetailSectionScrollSpy();
        });
      }
      return;
    }

    if (state.route === "screening" || state.route === "prospectv3") {
      const mainCls = state.route === "prospectv3" ? "app-main app-main--detail-page app-main--v1" : "app-main app-main--detail-page";
      app.innerHTML = `
      <div class="app-shell app-shell--detail-flow">
        <div id="detail-flow-scroll-root" class="detail-flow-scroll-root">
          ${renderHeader()}
          <div class="app-content app-content--detail-flow">
            <main class="${mainCls}">${main}</main>
            ${renderAppFooter()}
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
          ${renderAppFooter()}
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

    // Classic screening records table: type filter + row expand (Client 360 + Prospect V3)
    document.querySelectorAll("[data-classic-screening-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.classicScreeningFilter = btn.getAttribute("data-classic-screening-filter") || "all";
        state.classicScreeningExpandedId = null;
        renderApp();
      });
    });

    document.querySelectorAll("[data-classic-screening-row]").forEach((row) => {
      const toggle = () => {
        const id = row.getAttribute("data-classic-screening-row");
        if (!id) return;
        state.classicScreeningExpandedId = state.classicScreeningExpandedId === id ? null : id;
        renderApp();
      };
      row.addEventListener("click", (e) => {
        const stop = e.target?.closest?.("[data-table-row-stop]");
        if (stop) return;
        toggle();
      });
      row.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
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
        if (rk) location.hash = `#/prospect/${encodeURIComponent(rk)}/screening`;
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
        const root = document.getElementById("registration-scroll-root");
        if (root) {
          const rootRect = root.getBoundingClientRect();
          const elRect = el.getBoundingClientRect();
          const delta = elRect.top - rootRect.top;
          const targetTop = Math.max(0, root.scrollTop + delta - 12);
          root.scrollTo({ top: targetTop, behavior: "smooth" });
        } else {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        window.setTimeout(() => {
          window.__regNavProgrammaticScroll = false;
        }, 900);
      });
    });

    // Appointment type: keep single-select + sync card highlight (avoid relying on :has()).
    // Use delegated click handling so selecting a card is always safe and cannot crash the page.
    const regRoot = document.getElementById("registration-scroll-root");
    if (regRoot) {
      const syncAppointmentTypeCards = () => {
        try {
          const cards = Array.from(regRoot.querySelectorAll("[data-option-card]"));
          cards.forEach((card) => {
            const input = card.querySelector('input[type="radio"][name="appointmentType"]');
            const selected = input instanceof HTMLInputElement && input.checked;
            card.classList.toggle("registration__option-card--selected", Boolean(selected));
          });
        } catch (_) {
          // Prototype-only: never let UI interaction blank the page.
        }
      };

      const syncHealthierSgExtra = () => {
        const extra = regRoot.querySelector("#reg-healthier-sg");
        if (!(extra instanceof HTMLElement)) return;
        const selected = regRoot.querySelector('input[type="radio"][name="appointmentType"][value="healthier-sg"]');
        const show = selected instanceof HTMLInputElement && selected.checked;
        extra.hidden = !show;
        // Disable inputs when hidden so they don't participate in form submission/validation.
        extra.querySelectorAll("input, select, textarea").forEach((el) => {
          if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
            el.disabled = !show;
          }
        });

        // Hide Appointment Preferences when Healthier SG is selected.
        const apptPref = regRoot.querySelector("#reg-appointment");
        if (apptPref instanceof HTMLElement) {
          apptPref.hidden = show;
          apptPref.querySelectorAll("input, select, textarea").forEach((el) => {
            if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
              el.disabled = show;
            }
          });
        }
        // Hide TOC entry too, so user can't navigate to a hidden section.
        document.querySelectorAll('[data-reg-nav="reg-appointment"]').forEach((btn) => {
          if (btn instanceof HTMLElement) btn.style.display = show ? "none" : "";
        });

        // Question 2: disable date unless Question 1 = "yes"
        const bookedYes = regRoot.querySelector('input[type="radio"][name="healthierSgBooked"][value="yes"]');
        const bookedNo = regRoot.querySelector('input[type="radio"][name="healthierSgBooked"][value="no"]');
        const isYes = bookedYes instanceof HTMLInputElement && bookedYes.checked;
        const isNo = bookedNo instanceof HTMLInputElement && bookedNo.checked;
        const dateInput = regRoot.querySelector("#healthierSgScreeningDate");
        if (dateInput instanceof HTMLInputElement) {
          dateInput.disabled = !show || isNo || !isYes;
          if (show && isNo) dateInput.value = "";
        }
      };

      const syncYesNoButtons = () => {
        const btns = Array.from(regRoot.querySelectorAll("[data-yesno]"));
        btns.forEach((btn) => {
          const input = btn.querySelector('input[type="radio"]');
          const selected = input instanceof HTMLInputElement && input.checked;
          btn.classList.toggle("is-selected", Boolean(selected));
        });
      };

      // Run once after render (ensures initial checked state is reflected)
      syncAppointmentTypeCards();
      syncHealthierSgExtra();
      syncYesNoButtons();

      // Click on card → check radio + sync highlight.
      regRoot.addEventListener("click", (e) => {
        const raw = e.target;
        const el = raw instanceof Element ? raw : raw?.parentElement;
        const card = el?.closest?.("[data-option-card]");
        if (!(card instanceof HTMLElement)) return;
        const input = card.querySelector('input[type="radio"][name="appointmentType"]');
        if (!(input instanceof HTMLInputElement)) return;
        if (!input.checked) {
          input.checked = true;
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }
        syncAppointmentTypeCards();
        syncHealthierSgExtra();
        e.preventDefault();
        e.stopPropagation();
      });

      // Also sync on direct radio changes (keyboard navigation / accessibility)
      regRoot.addEventListener("change", (e) => {
        const t = e.target;
        if (!(t instanceof HTMLInputElement)) return;
        if (t.type === "radio" && t.name === "appointmentType") {
          syncAppointmentTypeCards();
          syncHealthierSgExtra();
          return;
        }
        if (t.type === "radio" && t.name === "healthierSgBooked") {
          syncYesNoButtons();
        }
      });

      // Click yes/no button → ensure selected styling updates immediately
      regRoot.addEventListener("click", (e) => {
        const raw = e.target;
        const el = raw instanceof Element ? raw : raw?.parentElement;
        const btn = el?.closest?.("[data-yesno]");
        if (!(btn instanceof HTMLElement)) return;
        const input = btn.querySelector('input[type="radio"][name="healthierSgBooked"]');
        if (!(input instanceof HTMLInputElement)) return;
        if (!input.checked) {
          input.checked = true;
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }
        syncYesNoButtons();
        e.preventDefault();
        e.stopPropagation();
      });
    }

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

    if (typeof window.WD_initDateInputs === "function") {
      window.WD_initDateInputs(document.getElementById("app"));
    }
    if (typeof window.WD_initNricFields === "function") {
      window.WD_initNricFields(document.getElementById("app"));
    }
    const regForm = document.getElementById("registration-form");
    bindRegistrationClientLookup(regForm instanceof HTMLFormElement ? regForm : null);
  }

  document.getElementById("app").addEventListener("click", (e) => {
    const raw = e.target;
    const el = raw instanceof Element ? raw : raw?.parentElement;

    const atDrawerDismiss = el?.closest("[data-activity-timeline-drawer-dismiss]");
    if (atDrawerDismiss && state.route === "detail" && state.activityTimelineDrawerOpen) {
      e.preventDefault();
      state.activityTimelineDrawerOpen = false;
      renderApp();
      return;
    }

    const formAction = el?.closest("[data-detail-form-action]");
    if (formAction && state.route === "detail") {
      e.preventDefault();
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
        state.detailScrollPreservePending = true;
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
        state.detailScrollPreservePending = true;
        renderApp();
        return;
      }
      if (action === "save") {
        const root = document.querySelector(`[data-detail-form-root="${panelAttr}"]`);
        if (root) {
          const out = {};
          root.querySelectorAll("[data-detail-field]").forEach((inp) => {
            const k = inp.getAttribute("data-detail-field");
            if (!k) return;
            if (inp.type === "checkbox") {
              out[k] = inp.checked ? inp.value || "Yes" : "No";
            } else if (inp.type === "radio") {
              if (inp.checked) out[k] = inp.value;
            } else {
              out[k] = inp.value;
            }
          });
          root.querySelectorAll("[data-detail-multi-select]").forEach((group) => {
            const k = group.getAttribute("data-detail-multi-select");
            if (!k) return;
            const parts = [];
            group.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
              if (cb.checked) parts.push(cb.value);
            });
            out[k] = parts.join(", ");
          });
          state.detailFormValues[stateKey] = out;
          if (stateKey === "details") {
            const slug = normalizeRiskSlugFromAssessment(out.riskLevel);
            if (slug) {
              state.detail.risk = slug;
              const pid = state.detail.id;
              PROSPECTS.forEach((row) => {
                if (row.id === pid) row.risk = slug;
              });
            }
          }
          const panelLabel =
            panelAttr === "details"
              ? "Personal Details"
              : panelAttr === "medical-history"
                ? "Medical History"
                : "Other Details";
          appendDetailActivity(state.detail.rowKey, {
            title: "Profile updated",
            body: `${panelLabel} information was saved.`,
            by: PORTAL_CURRENT_USER.name,
            stage: state.pipeline,
          });
        }
        state.detailFormEdit = null;
        state.detailFormDraft = null;
        state.detailScrollPreservePending = true;
        showToast("Data Updated");
        renderApp();
        return;
      }
    }

    if (state.route === "detail" || state.route === "prospectv3") {
      const dlBtn = el?.closest("[data-detail-doc-download]");
      if (dlBtn) {
        e.preventDefault();
        const docId = dlBtn.getAttribute("data-detail-doc-download");
        if (docId) triggerDetailDocumentDownload(state.detail.rowKey, docId);
        return;
      }
      const rmBtn = el?.closest("[data-detail-doc-remove]");
      if (rmBtn) {
        e.preventDefault();
        const docId = rmBtn.getAttribute("data-detail-doc-remove");
        if (docId) {
          removeDetailDocument(state.detail.rowKey, docId);
          state.detailScrollPreservePending = true;
          renderApp();
          showToast("Document removed.");
        }
        return;
      }
      if (el?.closest("[data-detail-doc-upload]")) {
        e.preventDefault();
        document.getElementById("detail-documents-input")?.click();
        return;
      }
    }

    if (state.route === "detail" || state.route === "prospectv3") {
      if (el?.closest("[data-detail-add-note-open]")) {
        e.preventDefault();
        state.detailNoteEditId = null;
        state.detailAddNoteModalOpen = true;
        renderApp();
        requestAnimationFrame(() => {
          const ta = document.getElementById("detail-add-note-text");
          ta?.focus();
        });
        return;
      }
      const noteEditBtn = el?.closest("[data-detail-note-edit]");
      if (noteEditBtn) {
        e.preventDefault();
        const nid = noteEditBtn.getAttribute("data-detail-note-edit");
        if (!nid) return;
        state.detailNoteEditId = nid;
        state.detailAddNoteModalOpen = true;
        renderApp();
        requestAnimationFrame(() => {
          const ta = document.getElementById("detail-add-note-text");
          if (ta instanceof HTMLTextAreaElement) {
            ta.focus();
            ta.setSelectionRange(ta.value.length, ta.value.length);
          }
        });
        return;
      }
      const noteDelBtn = el?.closest("[data-detail-note-delete]");
      if (noteDelBtn) {
        e.preventDefault();
        const nid = noteDelBtn.getAttribute("data-detail-note-delete");
        if (!nid) return;
        state.detailDeleteNoteId = nid;
        renderApp();
        return;
      }
    }

    if (state.detailDeleteNoteId && (state.route === "detail" || state.route === "prospectv3")) {
      if (el?.id === "detail-delete-note-modal") {
        state.detailDeleteNoteId = null;
        renderApp();
        return;
      }
      if (el?.closest("[data-detail-delete-note-cancel]")) {
        e.preventDefault();
        state.detailDeleteNoteId = null;
        renderApp();
        return;
      }
      if (el?.closest("[data-detail-delete-note-confirm]")) {
        e.preventDefault();
        const nid = state.detailDeleteNoteId;
        if (nid) deleteDetailNote(state.detail.rowKey, nid);
        state.detailDeleteNoteId = null;
        state.detailScrollPreservePending = true;
        renderApp();
        showToast("Note deleted.");
        return;
      }
    }

    if (state.detailAddNoteModalOpen) {
      if (el?.id === "detail-add-note-modal") {
        state.detailAddNoteModalOpen = false;
        state.detailNoteEditId = null;
        renderApp();
        return;
      }
      if (el?.closest("[data-detail-add-note-dismiss]")) {
        e.preventDefault();
        state.detailAddNoteModalOpen = false;
        state.detailNoteEditId = null;
        renderApp();
        return;
      }
      if (el?.closest("[data-detail-add-note-submit]")) {
        e.preventDefault();
        const ta = document.getElementById("detail-add-note-text");
        const text = (ta?.value || "").trim();
        if (!text) {
          showToast("Please enter a note.");
          return;
        }
        const rk = state.detail.rowKey;
        const eid = state.detailNoteEditId;
        if (eid) {
          updateDetailNote(rk, eid, text);
          showToast("Note updated.");
        } else {
          addDetailNote(rk, text);
          showToast("Note added.");
        }
        state.detailAddNoteModalOpen = false;
        state.detailNoteEditId = null;
        state.detailScrollPreservePending = true;
        renderApp();
        return;
      }
    }

    const sectNav = el?.closest("[data-detail-section-nav]");
    if (sectNav && state.route === "detail") {
      const sid = sectNav.getAttribute("data-detail-section-nav");
      if (!sid) return;
      window.__detailNavProgrammaticScroll = true;
      setDetailNavActive(sid);
      requestAnimationFrame(() => {
        scrollDetailSectionIntoView(sid);
        window.setTimeout(() => {
          window.__detailNavProgrammaticScroll = false;
        }, 900);
      });
      return;
    }

    const prospectV3TabBtn = el?.closest("[data-prospectv3-tab]");
    if (prospectV3TabBtn && state.route === "prospectv3") {
      const href = prospectV3TabBtn.getAttribute("data-prospectv3-tab-href");
      if (href) {
        if (location.hash === href) renderApp();
        else location.hash = href;
      }
      return;
    }

    if (el?.closest("[data-v3-biodata-edit]") && state.route === "prospectv3" && state.prospectV3Tab === "biodata") {
      e.preventDefault();
      state.prospectV3BiodataDraft = JSON.stringify(state.detailFormValues?.details || {});
      state.prospectV3BiodataModalOpen = true;
      renderApp();
      requestAnimationFrame(() => {
        const modalBody = document.querySelector("[data-v3-biodata-modal-root]");
        if (typeof window.WD_initDateInputs === "function") {
          window.WD_initDateInputs(modalBody || document.getElementById("app"));
        }
        document.getElementById("v3bio-dob")?.focus();
      });
      return;
    }

    if (state.prospectV3BiodataModalOpen && state.route === "prospectv3" && state.prospectV3Tab === "biodata") {
      const restoreV3BiodataDraft = () => {
        if (state.prospectV3BiodataDraft != null) {
          try {
            state.detailFormValues.details = JSON.parse(state.prospectV3BiodataDraft);
          } catch (_) {
            /* keep current */
          }
        }
        state.prospectV3BiodataDraft = null;
        state.prospectV3BiodataModalOpen = false;
      };
      if (el?.id === "prospect-v3-biodata-modal") {
        restoreV3BiodataDraft();
        renderApp();
        return;
      }
      if (el?.closest("[data-v3-biodata-modal-dismiss]")) {
        e.preventDefault();
        restoreV3BiodataDraft();
        renderApp();
        return;
      }
      if (el?.closest("[data-v3-biodata-modal-save]")) {
        e.preventDefault();
        const root = document.querySelector("[data-v3-biodata-modal-root]");
        if (!persistV3BiodataFormFromRoot(root)) return;
        state.prospectV3BiodataDraft = null;
        state.prospectV3BiodataModalOpen = false;
        showToast("Biodata saved.");
        renderApp();
        return;
      }
    }

    const classicScrTable =
      (state.route === "detail" && state.detailTab === "screening") ||
      (state.route === "prospectv3" && state.prospectV3Tab === "screenings");
    const classicUpdBtn = el?.closest("[data-classic-screening-update]");
    if (classicUpdBtn && classicScrTable && (state.route === "detail" || state.route === "prospectv3")) {
      e.preventDefault();
      const sid = classicUpdBtn.getAttribute("data-classic-screening-update");
      if (!sid) return;
      state.classicScreeningTasksModalId = null;
      state.classicScreeningUpdateModalId = sid;
      renderApp();
      requestAnimationFrame(() => document.getElementById("csu-submitted")?.focus());
      return;
    }

    const classicTasksBtn = el?.closest("[data-classic-screening-tasks]");
    if (classicTasksBtn && classicScrTable && (state.route === "detail" || state.route === "prospectv3")) {
      e.preventDefault();
      const sid = classicTasksBtn.getAttribute("data-classic-screening-tasks");
      if (!sid) return;
      state.classicScreeningUpdateModalId = null;
      state.classicScreeningTasksModalId = sid;
      ensureClassicScreeningTaskBucket(sid);
      renderApp();
      return;
    }

    if (state.classicScreeningTasksModalId) {
      if (el?.id === "classic-screening-tasks-modal") {
        state.classicScreeningTasksModalId = null;
        renderApp();
        return;
      }
      if (el?.closest("[data-classic-screening-tasks-dismiss]")) {
        e.preventDefault();
        state.classicScreeningTasksModalId = null;
        renderApp();
        return;
      }
    }

    if (state.classicScreeningUpdateModalId) {
      const csuStatusChip = el?.closest("[data-csu-status]");
      if (csuStatusChip) {
        e.preventDefault();
        const v = csuStatusChip.getAttribute("data-csu-status");
        if (!v || !CLASSIC_SCREENING_STATUS_BY_KEY[v]) return;
        const hidden = document.getElementById("csu-status-value");
        if (hidden) hidden.value = v;
        const group = csuStatusChip.closest(".ui-chip-group");
        group?.querySelectorAll("[data-csu-status]").forEach((btn) => {
          const on = btn.getAttribute("data-csu-status") === v;
          btn.classList.toggle("is-selected", on);
          btn.setAttribute("aria-pressed", on ? "true" : "false");
        });
        return;
      }
      if (el?.id === "classic-screening-update-modal") {
        state.classicScreeningUpdateModalId = null;
        renderApp();
        return;
      }
      if (el?.closest("[data-classic-screening-update-dismiss]")) {
        e.preventDefault();
        state.classicScreeningUpdateModalId = null;
        renderApp();
        return;
      }
      if (el?.closest("[data-classic-screening-update-save]")) {
        e.preventDefault();
        if (persistClassicScreeningUpdateFromForm()) {
          state.classicScreeningUpdateModalId = null;
          showToast("Screening record updated.");
          renderApp();
        }
        return;
      }
    }

    const detailActivityTimelineBtn = el?.closest("[data-detail-activity-timeline]");
    if (detailActivityTimelineBtn && state.route === "detail") {
      e.preventDefault();
      state.activityTimelineDrawerOpen = !state.activityTimelineDrawerOpen;
      renderApp();
      return;
    }

    const detailTabBtn = el?.closest("[data-detail-tab]");
    if (detailTabBtn) {
      const tid = detailTabBtn.getAttribute("data-detail-tab");
      if (!tid || !DETAIL_TAB_IDS.includes(tid)) return;
      const rid = state.routeId || DETAIL_DEFAULT.rowKey;
      const nextHash =
        tid === "details"
          ? `#/prospect/${encodeURIComponent(rid)}`
          : `#/prospect/${encodeURIComponent(rid)}/${encodeURIComponent(tid)}`;
      if (location.hash === nextHash) {
        renderApp();
      } else {
        location.hash = nextHash;
      }
      return;
    }
    const screeningTabBtn = el?.closest("[data-screening-tab]");
    if (screeningTabBtn && state.route === "screening") {
      const href = screeningTabBtn.getAttribute("data-screening-tab-href");
      if (href) {
        if (location.hash === href) renderApp();
        else location.hash = href;
      }
      return;
    }
    const toastBtn = el?.closest("[data-detail-toast]");
    if (toastBtn) {
      const msg = toastBtn.getAttribute("data-detail-toast") || "Action (prototype).";
      showToast(msg);
      return;
    }
    if (el?.closest("[data-prospect-docs-upload]")) {
      if (el.closest("tr[data-nav-prospect]")) return;
      e.preventDefault();
      document.getElementById("prospect-docs-file")?.click();
      return;
    }
    const row = el?.closest("tr[data-nav-prospect]");
    if (row && !el.closest("button") && !el.closest("a")) {
      const id = row.getAttribute("data-nav-prospect");
      location.hash = `#/prospect/${encodeURIComponent(id)}/screening`;
    }
  });

  document.getElementById("app").addEventListener("change", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLInputElement)) return;

    if (t.hasAttribute("data-classic-screening-task")) {
      const rid = t.getAttribute("data-cst-record");
      const stage = t.getAttribute("data-cst-stage");
      const idx = parseInt(t.getAttribute("data-cst-index") || "0", 10);
      if (!rid || !stage || !SCREENING_TABLE_TASK_STAGES.includes(stage)) return;
      ensureClassicScreeningTaskBucket(rid);
      const arr = state.classicScreeningTaskDoneByRecordId[rid][stage];
      if (!Array.isArray(arr) || idx < 0 || idx >= arr.length) return;
      arr[idx] = t.checked;
      patchClassicScreeningTaskChecklistDom(rid, t);
      return;
    }

    if (t.hasAttribute("data-task")) {
      if (state.route !== "detail" && state.route !== "screening") return;
      const task = state.detail.tasks.find((x) => x.id === t.id);
      if (!task) return;
      const wasDone = task.done;
      task.done = t.checked;
      if (t.checked && !wasDone) {
        appendDetailActivity(state.detail.rowKey, {
          title: "Task completed",
          body: task.label,
          by: PORTAL_CURRENT_USER.name,
          stage: state.pipeline,
        });
      }
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
      const wasDone = !!arr[idx];
      arr[idx] = t.checked;
      if (t.checked && !wasDone) {
        const L = window.WD_STAGE_CHECKLISTS;
        const lbls = (L && L[stage]) || [];
        const taskLabel = lbls[idx] || `Checklist item ${idx + 1}`;
        appendDetailActivity(state.detail.rowKey, {
          title: "Task completed",
          body: `${pipelineStagePretty(stage)} — ${taskLabel}`,
          by: PORTAL_CURRENT_USER.name,
          stage,
        });
      }
      const row = t.closest(".detail-task-row");
      if (row) row.classList.toggle("is-done", t.checked);
      persistProspectChecklistsFromDetail();
      renderApp();
      return;
    }

    if (t.classList.contains("detail-documents-file-input")) {
      if (state.route !== "detail" && state.route !== "prospectv3") return;
      const files = t.files;
      if (!files?.length) {
        t.value = "";
        return;
      }
      addDetailDocumentsFromFiles(state.detail.rowKey, Array.from(files));
      t.value = "";
      state.detailScrollPreservePending = true;
      renderApp();
      showToast(`${files.length} file(s) uploaded.`);
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
      location.hash = `#/prospect/${encodeURIComponent(id)}/screening`;
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
    if (state.detailDeleteNoteId) {
      state.detailDeleteNoteId = null;
      renderApp();
      return;
    }
    if (state.detailAddNoteModalOpen) {
      state.detailAddNoteModalOpen = false;
      state.detailNoteEditId = null;
      renderApp();
      return;
    }
    if (state.classicScreeningTasksModalId) {
      state.classicScreeningTasksModalId = null;
      renderApp();
      return;
    }
    if (state.route === "detail" && state.activityTimelineDrawerOpen) {
      state.activityTimelineDrawerOpen = false;
      renderApp();
      return;
    }
    if (state.route !== "register" || !state.registerSelfService || !state.registrationMobileNavOpen) return;
    state.registrationMobileNavOpen = false;
    syncRegistrationMobileNavDom();
  });

  renderApp();

  window.addEventListener("hashchange", renderApp);
})();
