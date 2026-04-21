/**
 * WerkDone Prospect Management Portal — static prototype aligned with Figma Make export
 * (globals.css + AllProspects + ProspectDetail tab bodies in detail-panels.js).
 * rowKey disambiguates duplicate PROS-001234 / PROS-001239 IDs across programs.
 */

"use strict";

import * as XLSX from "xlsx";
import { mountProspectListReact, unmountProspectListReact } from "../modules/prospect/mount.jsx";
import { PROGRAMS } from "../config/programs.js";
import "./detail-panels.js";
import "./bishan-screening-portal.js";
import "./date-input.js";
import "./time-input.js";
import "./nric-toggle.js";

if (typeof window !== "undefined") {
  window.XLSX = window.XLSX || XLSX;
}

  const STORAGE_KEYS = Object.freeze({
    listView: "wd.listView",
  });

  function getStoredListView() {
    try {
      const v = String(localStorage.getItem(STORAGE_KEYS.listView) || "").trim().toLowerCase();
      return v === "list" || v === "kanban" ? v : null;
    } catch (_) {
      return null;
    }
  }

  function setStoredListView(v) {
    const next = v === "list" || v === "kanban" ? v : null;
    if (!next) return;
    try {
      localStorage.setItem(STORAGE_KEYS.listView, next);
    } catch (_) {}
  }

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
      /** Mammogram venue: `mammobus` | `scs-clinic` | `healthier-sg` (matches screening form). */
      appointmentType: "mammobus",
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
      firstMammogramScreening: "no",
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
      firstMammogramScreening: "no",
    },
    {
      rowKey: "PROS-001236",
      id: "PROS-001236",
      name: "Chen Wei Ning",
      maskedNric: "S****901C",
      program: "Mammobus",
      appointmentType: "scs-clinic",
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
      firstMammogramScreening: "yes",
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
      appointmentType: "healthier-sg",
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

  function createDefaultListFilters() {
    return {
      stages: [],
      genders: [],
      risks: [],
      ageMin: 18,
      ageMax: 100,
      dateRegisteredFrom: "",
      dateRegisteredTo: "",
      nextReviewFrom: "",
      nextReviewTo: "",
      appointmentTypes: [],
      attendances: [],
      sourceTypes: [],
    };
  }

  const state = {
    route: "list",
    routeId: null,
    view: "kanban",
    program: "all",
    search: "",
    filterModal: false,
    exportMenuOpen: false,
    /** List view: empty array = no restriction for that dimension; date fields are YYYY-MM-DD or "". */
    listFilters: createDefaultListFilters(),
    /** Table sort */
    listSort: { key: "name", dir: "asc" },
    /** Listing KPI strip: active quick filter key (null = none). */
    listKpiActive: null,
    /** Preserve previous sort when KPI card forces a sort (optional UX). */
    listKpiPrevSort: null,
    detailTab: "details",
    /** Classic collapsible screening records table (Prospect V1 + classic detail): filter + expanded row */
    classicScreeningFilter: "all",
    classicScreeningExpandedId: null,
    /** When true, all visible screening rows show expanded details (toolbar). */
    classicScreeningExpandAll: false,
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
    /** Prospect list table: which row's Actions menu is open (rowKey). */
    prospectListActionsOpenRowKey: null,
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
    /** Prospect detail Notes tab: rowKey → search query (filters note body). */
    detailNotesSearchByProspect: {},
    /** Prospect detail Notes tab: rowKey → current page (1-indexed). */
    detailNotesPageByProspect: {},
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
    /** True when registration opened with ?sr_token=… (patient self-service link) */
    registerSelfService: false,
    /** Mobile token URL: “Skip to section” drawer open */
    registrationMobileNavOpen: false,
    /** Registration flow: Singpass vs manual landing vs full form */
    registerSelfServiceEntry: "landing",
    /** Singpass path — demo prefill + lock listed fields (self-service or staff) */
    registerSingpassLocked: false,
    /** FIT Kit Tracker (prototype) — in-memory session state */
    fitKit: {
      activeStage: 0,
      search: "",
      /** Active KPI card filter (stage / result / awaiting). */
      kpiActive: null,
      /** Selected patient row ids (for bulk actions). */
      selectedIds: [],
      nextId: 31,
      patients: [
        {
          id: 1,
          name: "Tan Ah Kow",
          nric: "S****234A",
          dob: "1965-03-12",
          age: 59,
          gender: "M",
          mobile: "91234567",
          address: "Blk 123 Ang Mo Kio Ave 6 #05-12 S560123",
          stage: 1,
          ncssRef: "NCSS-2024-001",
          dispatchDate: "",
          labRef: "",
          receivedDate: "",
          result: "",
          resultDate: "",
          notes: "",
        },
        {
          id: 2,
          name: "Wong Mei Fong",
          nric: "S****789F",
          dob: "1968-01-14",
          age: 56,
          gender: "F",
          mobile: "96789012",
          address: "Blk 89 Clementi Ave 3 #06-45 S120089",
          stage: 1,
          ncssRef: "NCSS-2024-002",
          dispatchDate: "",
          labRef: "",
          receivedDate: "",
          result: "",
          resultDate: "",
          notes: "",
        },
        {
          id: 3,
          name: "Suresh Pillai",
          nric: "S****321K",
          dob: "1961-08-19",
          age: 62,
          gender: "M",
          mobile: "83456789",
          address: "Blk 22 Hougang Ave 3 #07-11 S530022",
          stage: 1,
          ncssRef: "NCSS-2024-003",
          dispatchDate: "",
          labRef: "",
          receivedDate: "",
          result: "",
          resultDate: "",
          notes: "Prefers morning calls",
        },
        {
          id: 4,
          name: "Mdm Lee Geok Eng",
          nric: "S****654B",
          dob: "1956-04-02",
          age: 68,
          gender: "F",
          mobile: "97654321",
          address: "Blk 5 Queenstown Rd #03-08 S140005",
          stage: 1,
          ncssRef: "NCSS-2024-004",
          dispatchDate: "",
          labRef: "",
          receivedDate: "",
          result: "",
          resultDate: "",
          notes: "",
        },
        {
          id: 5,
          name: "Hamid Bin Osman",
          nric: "S****112C",
          dob: "1963-11-30",
          age: 60,
          gender: "M",
          mobile: "91122334",
          address: "Blk 301 Bukit Batok St 31 #10-05 S650301",
          stage: 1,
          ncssRef: "NCSS-2024-005",
          dispatchDate: "",
          labRef: "",
          receivedDate: "",
          result: "",
          resultDate: "",
          notes: "",
        },
        {
          id: 6,
          name: "Chua Boon Huat",
          nric: "S****445D",
          dob: "1958-06-15",
          age: 65,
          gender: "M",
          mobile: "94455667",
          address: "Blk 88 Pasir Ris Dr 6 #12-22 S510088",
          stage: 1,
          ncssRef: "NCSS-2024-006",
          dispatchDate: "",
          labRef: "",
          receivedDate: "",
          result: "",
          resultDate: "",
          notes: "Family history of CRC",
        },
        {
          id: 7,
          name: "Noor Aini Bte Kassim",
          nric: "S****778E",
          dob: "1966-09-07",
          age: 57,
          gender: "F",
          mobile: "98778899",
          address: "Blk 47 Woodlands Ave 6 #05-33 S730047",
          stage: 1,
          ncssRef: "NCSS-2024-007",
          dispatchDate: "",
          labRef: "",
          receivedDate: "",
          result: "",
          resultDate: "",
          notes: "",
        },
        {
          id: 8,
          name: "Siti Binte Rahmat",
          nric: "S****567B",
          dob: "1958-07-22",
          age: 65,
          gender: "F",
          mobile: "92345678",
          address: "Blk 45 Bedok North Rd #08-23 S460045",
          stage: 2,
          ncssRef: "NCSS-2024-008",
          dispatchDate: "2026-03-13",
          labRef: "",
          receivedDate: "",
          result: "",
          resultDate: "",
          notes: "",
        },
        {
          id: 9,
          name: "Muthu Selvam",
          nric: "S****012G",
          dob: "1957-06-08",
          age: 67,
          gender: "M",
          mobile: "97890123",
          address: "Blk 34 Serangoon Ave 2 #14-02 S550034",
          stage: 2,
          ncssRef: "NCSS-2024-009",
          dispatchDate: "2026-03-13",
          labRef: "",
          receivedDate: "",
          result: "",
          resultDate: "",
          notes: "",
        },
        {
          id: 10,
          name: "Goh Siew Leng",
          nric: "S****233F",
          dob: "1960-02-28",
          age: 64,
          gender: "F",
          mobile: "93322110",
          address: "Blk 115 Bishan St 12 #09-14 S570115",
          stage: 2,
          ncssRef: "NCSS-2024-010",
          dispatchDate: "2026-03-07",
          labRef: "",
          receivedDate: "",
          result: "",
          resultDate: "",
          notes: "Kit returned once — resent",
        },
        {
          id: 11,
          name: "Rajan s/o Pillai",
          nric: "S****509H",
          dob: "1962-05-12",
          age: 61,
          gender: "M",
          mobile: "96509876",
          address: "Blk 19 Jurong East Ave 1 #04-09 S609019",
          stage: 2,
          ncssRef: "NCSS-2024-011",
          dispatchDate: "2026-03-20",
          labRef: "",
          receivedDate: "",
          result: "",
          resultDate: "",
          notes: "",
        },
        {
          id: 12,
          name: "Tan Swee Huat",
          nric: "S****381J",
          dob: "1955-12-03",
          age: 68,
          gender: "M",
          mobile: "91238765",
          address: "Blk 72 Toa Payoh Lor 4 #06-18 S310072",
          stage: 2,
          ncssRef: "NCSS-2024-012",
          dispatchDate: "2026-03-06",
          labRef: "",
          receivedDate: "",
          result: "",
          resultDate: "",
          notes: "",
        },
        {
          id: 13,
          name: "Fatimah Bte Yusuf",
          nric: "S****620L",
          dob: "1967-03-19",
          age: 56,
          gender: "F",
          mobile: "94620831",
          address: "Blk 203 Tampines St 21 #11-04 S520203",
          stage: 2,
          ncssRef: "NCSS-2024-013",
          dispatchDate: "2026-03-08",
          labRef: "",
          receivedDate: "",
          result: "",
          resultDate: "",
          notes: "Reminder SMS sent",
        },
        {
          id: 14,
          name: "Rajesh Kumar",
          nric: "S****890C",
          dob: "1962-11-05",
          age: 61,
          gender: "M",
          mobile: "93456789",
          address: "Blk 78 Jurong West St 42 #12-34 S640078",
          stage: 3,
          ncssRef: "NCSS-2024-014",
          dispatchDate: "2026-03-08",
          labRef: "LAB-10023",
          receivedDate: "2026-03-15",
          result: "",
          resultDate: "",
          notes: "",
        },
        {
          id: 15,
          name: "Chan Soo Lin",
          nric: "S****345H",
          dob: "1963-12-25",
          age: 60,
          gender: "F",
          mobile: "98901234",
          address: "Blk 67 Punggol Rd #09-12 S820067",
          stage: 3,
          ncssRef: "NCSS-2024-015",
          dispatchDate: "2026-03-25",
          labRef: "LAB-10024",
          receivedDate: "2026-03-31",
          result: "",
          resultDate: "",
          notes: "",
        },
        {
          id: 16,
          name: "Ong Beng Kiat",
          nric: "S****177M",
          dob: "1959-07-14",
          age: 65,
          gender: "M",
          mobile: "90177234",
          address: "Blk 33 Marine Parade Rd #02-05 S440033",
          stage: 3,
          ncssRef: "NCSS-2024-016",
          dispatchDate: "2026-03-09",
          labRef: "LAB-10025",
          receivedDate: "2026-03-25",
          result: "",
          resultDate: "",
          notes: "",
        },
        {
          id: 17,
          name: "Madam Zainab Hussain",
          nric: "S****293N",
          dob: "1961-01-22",
          age: 63,
          gender: "F",
          mobile: "92293041",
          address: "Blk 410 Yishun Ave 6 #08-31 S760410",
          stage: 3,
          ncssRef: "NCSS-2024-017",
          dispatchDate: "2026-03-13",
          labRef: "LAB-10026",
          receivedDate: "2026-03-26",
          result: "",
          resultDate: "",
          notes: "Diabetic — flag for doctor",
        },
        {
          id: 18,
          name: "Loh Chin Wah",
          nric: "S****854P",
          dob: "1964-09-09",
          age: 59,
          gender: "M",
          mobile: "98854321",
          address: "Blk 55 Clementi Ave 2 #15-03 S120055",
          stage: 3,
          ncssRef: "NCSS-2024-018",
          dispatchDate: "2026-03-22",
          labRef: "LAB-10027",
          receivedDate: "2026-04-07",
          result: "",
          resultDate: "",
          notes: "",
        },
        {
          id: 19,
          name: "Selvamary d/o Rajan",
          nric: "S****716Q",
          dob: "1966-04-30",
          age: 57,
          gender: "F",
          mobile: "91716082",
          address: "Blk 9 Geylang Bahru #06-22 S330009",
          stage: 3,
          ncssRef: "NCSS-2024-019",
          dispatchDate: "2026-03-18",
          labRef: "LAB-10028",
          receivedDate: "2026-03-24",
          result: "",
          resultDate: "",
          notes: "",
        },
        {
          id: 20,
          name: "Koh Teck Soon",
          nric: "S****428R",
          dob: "1957-10-11",
          age: 67,
          gender: "M",
          mobile: "84428765",
          address: "Blk 141 Bukit Timah Rd #04-07 S590141",
          stage: 3,
          ncssRef: "NCSS-2024-020",
          dispatchDate: "2026-03-20",
          labRef: "LAB-10029",
          receivedDate: "2026-04-01",
          result: "",
          resultDate: "",
          notes: "",
        },
        {
          id: 21,
          name: "Ang Poh Choo",
          nric: "S****562S",
          dob: "1960-06-18",
          age: 63,
          gender: "F",
          mobile: "96562034",
          address: "Blk 88 Sengkang East Way #10-18 S540088",
          stage: 3,
          ncssRef: "NCSS-2024-021",
          dispatchDate: "2026-03-07",
          labRef: "LAB-10030",
          receivedDate: "2026-03-18",
          result: "",
          resultDate: "",
          notes: "",
        },
        {
          id: 22,
          name: "Lim Bee Choo",
          nric: "S****123D",
          dob: "1955-05-18",
          age: 68,
          gender: "F",
          mobile: "94567890",
          address: "Blk 12 Toa Payoh Lorong 2 #03-05 S310012",
          stage: 4,
          ncssRef: "NCSS-2024-022",
          dispatchDate: "2026-03-24",
          labRef: "LAB-10010",
          receivedDate: "2026-04-07",
          result: "Negative",
          resultDate: "2026-04-13",
          notes: "Normal. Re-screen in 1 year.",
        },
        {
          id: 23,
          name: "Ahmad Bin Yusof",
          nric: "S****456E",
          dob: "1960-09-30",
          age: 63,
          gender: "M",
          mobile: "95678901",
          address: "Blk 56 Tampines St 21 #10-11 S520056",
          stage: 4,
          ncssRef: "NCSS-2024-023",
          dispatchDate: "2026-03-12",
          labRef: "LAB-10008",
          receivedDate: "2026-03-23",
          result: "Positive",
          resultDate: "2026-03-29",
          notes: "Referred to polyclinic for colonoscopy.",
        },
        {
          id: 24,
          name: "Mdm Phua Geok Tin",
          nric: "S****039T",
          dob: "1956-03-25",
          age: 68,
          gender: "F",
          mobile: "93039182",
          address: "Blk 6 Redhill Cl #07-12 S150006",
          stage: 4,
          ncssRef: "NCSS-2024-024",
          dispatchDate: "2026-03-05",
          labRef: "LAB-10005",
          receivedDate: "2026-03-17",
          result: "Negative",
          resultDate: "2026-03-22",
          notes: "Normal. Re-screen in 1 year.",
        },
        {
          id: 25,
          name: "David Pereira",
          nric: "S****281U",
          dob: "1963-07-04",
          age: 61,
          gender: "M",
          mobile: "91281047",
          address: "Blk 20 Serangoon Garden Way #01-05 S556020",
          stage: 4,
          ncssRef: "NCSS-2024-025",
          dispatchDate: "2026-03-19",
          labRef: "LAB-10011",
          receivedDate: "2026-03-29",
          result: "Positive",
          resultDate: "2026-04-02",
          notes: "Referred for follow-up.",
        },
        {
          id: 26,
          name: "Madam Ho Siew Khim",
          nric: "S****374V",
          dob: "1958-11-13",
          age: 65,
          gender: "F",
          mobile: "94374920",
          address: "Blk 303 Choa Chu Kang Ave 4 #08-09 S680303",
          stage: 4,
          ncssRef: "NCSS-2024-026",
          dispatchDate: "2026-03-23",
          labRef: "LAB-10013",
          receivedDate: "2026-04-05",
          result: "Negative",
          resultDate: "2026-04-09",
          notes: "Normal.",
        },
        {
          id: 27,
          name: "Govindasamy s/o Nair",
          nric: "S****815W",
          dob: "1961-02-07",
          age: 63,
          gender: "M",
          mobile: "98815034",
          address: "Blk 77 Little India Arc #03-11 S210077",
          stage: 4,
          ncssRef: "NCSS-2024-027",
          dispatchDate: "2026-03-16",
          labRef: "LAB-10007",
          receivedDate: "2026-03-26",
          result: "Positive",
          resultDate: "2026-04-04",
          notes: "Urgent referral — colonoscopy booked.",
        },
        {
          id: 28,
          name: "Teo Lay Hoon",
          nric: "S****647X",
          dob: "1964-08-20",
          age: 59,
          gender: "F",
          mobile: "92647813",
          address: "Blk 55 Ang Mo Kio St 44 #11-22 S560055",
          stage: 4,
          ncssRef: "NCSS-2024-028",
          dispatchDate: "2026-03-02",
          labRef: "LAB-10015",
          receivedDate: "2026-03-11",
          result: "Negative",
          resultDate: "2026-03-14",
          notes: "Normal. Re-screen in 1 year.",
        },
        {
          id: 29,
          name: "Ismail Bin Hashim",
          nric: "S****903Y",
          dob: "1957-05-29",
          age: 67,
          gender: "M",
          mobile: "97903456",
          address: "Blk 112 Yishun Ring Rd #06-05 S760112",
          stage: 4,
          ncssRef: "NCSS-2024-029",
          dispatchDate: "2026-03-14",
          labRef: "LAB-10003",
          receivedDate: "2026-03-22",
          result: "Negative",
          resultDate: "2026-03-30",
          notes: "",
        },
        {
          id: 30,
          name: "Lily Tan Bee Lian",
          nric: "S****258Z",
          dob: "1959-12-01",
          age: 64,
          gender: "F",
          mobile: "93258741",
          address: "Blk 18 Dover Rd #09-04 S130018",
          stage: 4,
          ncssRef: "NCSS-2024-030",
          dispatchDate: "2026-03-18",
          labRef: "LAB-10017",
          receivedDate: "2026-03-24",
          result: "Positive",
          resultDate: "2026-04-03",
          notes: "Referred to SGH colorectal specialist.",
        },
      ],
      editModal: null,
      advanceModal: null,
      uploadModalStage: null,
      uploadState: { preview: null, errors: null, parsedRows: null },
    },
    /** Bishan Clinic — screening worklist + patient chart (see `js/bishan-screening-portal.js`). */
    bishanScreening: null,
  };

  if (typeof window !== "undefined") {
    window.__WD_PORTAL_STATE__ = state;
  }

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
   * - Multi-select dropdown (saved comma-separated): preferredLanguages — same options as detail `fieldCheckboxMulti`
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
  /** Tracks last rendered top-level route so entering `#/register/…` can reset Singpass vs manual landing. */
  let lastAppRenderedRoute = null;

  const DETAIL_TAB_IDS = [
    "details",
    "screening",
    "documents",
    "notes",
  ];

  const SCREENING_TAB_IDS = ["details", "tasks", "eligibility"];

  const DETAIL_FORM_TAB_IDS = ["details"];

  /** Section ids for detail ToC scroll-spy (mirror detail-panels.js DETAILS_NAV / MEDICAL_NAV / OTHER_NAV). */
  const DETAIL_TAB_SECTION_IDS = {
    details: [
      "detail-personal",
      "detail-address",
      "detail-screening",
      "detail-risk",
      "detail-status",
      "detail-engagement",
      "detail-consent",
    ],
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
    if (p.profileLastUpdatedAt) base.lastUpdated = p.profileLastUpdatedAt;
    if (p.profileLastUpdatedBy) base.lastUpdatedBy = p.profileLastUpdatedBy;
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
    calendar:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
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
    const qPhone = q.replace(/\s+/g, "");
    return rows.filter((r) => {
      const name = String(r.name || "").toLowerCase();
      const id = String(r.id || "").toLowerCase();
      const rowKey = String(r.rowKey || "").toLowerCase();
      const email = String(r.email || "").toLowerCase();
      const nric = String(r.maskedNric || "").toLowerCase();
      const phone = String(r.phone || "").replace(/\s+/g, "").toLowerCase();
      const apptLabel = String(prospectAppointmentTypeDisplayLabel(r) || "").toLowerCase();
      return (
        name.includes(q) ||
        id.includes(q) ||
        rowKey.includes(q) ||
        email.includes(q) ||
        nric.includes(q) ||
        (qPhone.length > 0 && phone.includes(qPhone)) ||
        (apptLabel && apptLabel !== "—" && apptLabel.includes(q))
      );
    });
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

  /** Expanded screening row: includes preference fields synced with profile / screening form. */
  function normalizeClassicScreeningExpandedDetails(r, detailsFallback) {
    const dash = "—";
    const val = (x) => (x != null && String(x).trim() !== "" ? String(x).trim() : dash);
    const resultLabel = (raw) => {
      const s = String(raw || "")
        .trim()
        .toLowerCase();
      if (!s) return dash;
      if (s === "normal") return "Normal";
      if (s === "abnormal") return "Abnormal";
      return val(raw);
    };
    const reviewPeriodLabel = (raw) => {
      const s = String(raw || "").trim();
      if (!s || s === dash) return dash;
      const compact = s.toLowerCase().replace(/\s+/g, "");
      if (compact === "12months" || compact === "1year" || compact === "1yr") return "1 year";
      if (compact === "6months" || compact === "6month" || compact === "0.5year") return "6 months";
      if (compact === "3years" || compact === "3year" || compact === "3yrs") return "3 years";
      if (compact === "5years" || compact === "5year" || compact === "5yrs") return "5 years";
      return val(raw);
    };
    const timeSlotLabel = (raw) => {
      const s = String(raw || "")
        .trim()
        .toLowerCase();
      if (!s) return dash;
      if (s === "morning") return "Morning";
      if (s === "afternoon") return "Afternoon";
      if (s === "evening") return "Evening";
      return val(raw);
    };
    const preferredDate = (() => {
      const direct = val(r?.preferredScreeningDate);
      if (direct !== dash) return direct;
      const fb = detailsFallback?.preferredScreeningDate;
      return val(fb);
    })();
    const preferredSlot = (() => {
      const direct = timeSlotLabel(r?.preferredTimeSlot);
      if (direct !== dash) return direct;
      const fb = detailsFallback?.preferredTimeSlot;
      return timeSlotLabel(fb);
    })();
    const engagementSource = (() => {
      const direct = val(r?.sourceType);
      if (direct !== dash) return direct;
      return val(detailsFallback?.sourceType);
    })();
    const engagementCampaign = (() => {
      const direct = val(r?.sourceName);
      if (direct !== dash) return direct;
      return val(detailsFallback?.sourceName);
    })();
    return [
      ["Preferred screening date", preferredDate],
      ["Preferred time slot", preferredSlot],
      ["Source", engagementSource],
      ["Campaign / Event Name", engagementCampaign],
      ["Result", resultLabel(r.result)],
      ["Review period", reviewPeriodLabel(r.nextReviewPeriod)],
      ["Next review date", val(r.nextReviewDate)],
      ["Last updated by", val(r.lastUpdatedBy)],
    ];
  }

  /** Registration `name="appointmentType"` values → labels (shared across MMG / HPV / FIT forms). */
  const SCREENING_APPOINTMENT_TYPE_LABELS = Object.freeze({
    mammobus: "Mammobus",
    "scs-clinic": "SCS Clinic @ Bishan",
    "healthier-sg": "Healthier SG",
  });

  /** MMG rows in the screening update modal — same value/label map as `SCREENING_APPOINTMENT_TYPE_LABELS`. */
  const CLASSIC_MAMMOGRAM_APPOINTMENT_TYPE_LABELS = SCREENING_APPOINTMENT_TYPE_LABELS;

  /** Options shown in screening update modal per record type (FIT form only offers Healthier SG). */
  function screeningAppointmentTypeSelectOptions(typeKey) {
    const L = SCREENING_APPOINTMENT_TYPE_LABELS;
    if (typeKey === "MMG") {
      return [
        ["mammobus", L.mammobus],
        ["scs-clinic", L["scs-clinic"]],
        ["healthier-sg", L["healthier-sg"]],
      ];
    }
    if (typeKey === "PAP") {
      return [
        ["scs-clinic", L["scs-clinic"]],
        ["healthier-sg", L["healthier-sg"]],
      ];
    }
    if (typeKey === "FIT") {
      return [["healthier-sg", L["healthier-sg"]]];
    }
    return [];
  }

  /** When `appointmentType` is absent on a prospect row, match registration form defaults. */
  function defaultAppointmentTypeKeyForListProgram(programRaw) {
    const p = String(programRaw || "");
    if (p === "Mammobus") return "mammobus";
    if (p === "HPV") return "scs-clinic";
    if (p === "FIT") return "healthier-sg";
    return "";
  }

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
    const detailsFb = state?.detailFormValues?.details || null;
    return {
      id,
      /** Link back to prospect enrolment row (used to keep listing ↔ screening table 1:1). */
      prospectRowKey: r.prospectRowKey != null ? String(r.prospectRowKey) : "",
      submitted: String(r.submitted || "—"),
      type: r.type || { key: "MMG", label: "—", tone: "sr-type--mmg" },
      status: r.status || { key: "qualified", label: "—", tone: "sr-status--qualified" },
      appointment: r.appointment == null ? null : r.appointment,
      venue: r.venue != null ? String(r.venue) : "—",
      attendance: r.attendance != null ? String(r.attendance).trim() : "",
      /** Form value: `mammobus` | `scs-clinic` | `healthier-sg` (subset per screening type). */
      appointmentType: r.appointmentType != null ? String(r.appointmentType).trim() : "",
      /** Legacy demo seed only; used as fallback when `appointmentType` is missing (MMG). */
      apptType: r.apptType != null ? String(r.apptType) : "",
      action: r.action && typeof r.action === "object" ? r.action : null,
      expandedDetails: normalizeClassicScreeningExpandedDetails(r, detailsFb),
    };
  }

  function classicScreeningAttendanceDisplay(r) {
    const raw = r?.attendance != null ? String(r.attendance).trim() : "";
    if (!raw) return "—";
    const hit = CLASSIC_SCREENING_ATTENDANCE_OPTIONS.find((x) => x.toLowerCase() === raw.toLowerCase());
    return hit || raw;
  }

  /** "Appointment Type" column — labels from screening forms for MMG, HPV/PAP, and FIT. */
  function classicScreeningAppointmentTypeDisplay(r) {
    if (!r?.type?.key) return "—";
    const typeKey = r.type.key;
    if (typeKey !== "MMG" && typeKey !== "PAP" && typeKey !== "FIT") return "—";
    const at = String(r.appointmentType || "").trim().toLowerCase();
    if (at && SCREENING_APPOINTMENT_TYPE_LABELS[at]) {
      return SCREENING_APPOINTMENT_TYPE_LABELS[at];
    }
    if (typeKey === "MMG") {
      const legacy = String(r.apptType || "").trim().toLowerCase();
      if (legacy === "mammobus" || legacy.includes("community mammobus")) {
        return SCREENING_APPOINTMENT_TYPE_LABELS.mammobus;
      }
      if (legacy.includes("bishan") || legacy.includes("scs clinic")) {
        return SCREENING_APPOINTMENT_TYPE_LABELS["scs-clinic"];
      }
      if (legacy.includes("healthiersg") || legacy.includes("healthier sg")) {
        return SCREENING_APPOINTMENT_TYPE_LABELS["healthier-sg"];
      }
      return SCREENING_APPOINTMENT_TYPE_LABELS.mammobus;
    }
    if (typeKey === "FIT") return SCREENING_APPOINTMENT_TYPE_LABELS["healthier-sg"];
    if (typeKey === "PAP") return SCREENING_APPOINTMENT_TYPE_LABELS["scs-clinic"];
    return "—";
  }

  /** Prospect list / Kanban / export — human-readable appointment type for any screening programme row. */
  function prospectAppointmentTypeDisplayLabel(p) {
    if (!p) return "—";
    const prog = String(p.program || "");
    const at = String(p.appointmentType || "").trim().toLowerCase();
    if (at && SCREENING_APPOINTMENT_TYPE_LABELS[at]) {
      return SCREENING_APPOINTMENT_TYPE_LABELS[at];
    }
    const def = defaultAppointmentTypeKeyForListProgram(prog);
    if (def && SCREENING_APPOINTMENT_TYPE_LABELS[def]) {
      return SCREENING_APPOINTMENT_TYPE_LABELS[def];
    }
    return "—";
  }

  /** Kanban program strip: `[Program] • [Appointment Type]` for all screening types. */
  function kanbanProgramPillText(p) {
    const prog = programDisplayLabel(p.program);
    const appt = prospectAppointmentTypeDisplayLabel(p);
    if (appt && appt !== "—") return `${prog} • ${appt}`;
    return prog;
  }

  /**
   * Demo screening records are generated PER prospect enrolment row.
   * This keeps listing ↔ kanban ↔ screening table 1:1 consistent (no global shared seed).
   */
  function getClassicScreeningRecordsRawArray() {
    const dash = "—";
    const statusToKey = (raw) => {
      const s = String(raw || "").trim().toLowerCase();
      return s === "booked" ? "booked" : s === "screened" ? "screened" : "qualified";
    };
    const typeFromProgram = (p) => screeningTypeKeyFromListProgram(p) || "MMG";
    const toTypeObj = (k) =>
      k === "FIT"
        ? { key: "FIT", label: "FIT Kit", tone: "sr-type--fit" }
        : k === "PAP"
          ? { key: "PAP", label: "HPV Test", tone: "sr-type--hpv" }
          : { key: "MMG", label: "Mammogram", tone: "sr-type--mmg" };
    const toStatusObj = (k) => CLASSIC_SCREENING_STATUS_BY_KEY[k] || CLASSIC_SCREENING_STATUS_BY_KEY.qualified;

    const parseIso = (iso) => {
      const s = String(iso || "").trim();
      const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (!m) return null;
      const y = parseInt(m[1], 10);
      const mo = parseInt(m[2], 10) - 1;
      const d = parseInt(m[3], 10);
      const dt = new Date(y, mo, d);
      return Number.isFinite(dt.getTime()) ? dt : null;
    };
    const monthsBetween = (a, b) => {
      if (!a || !b) return null;
      return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
    };
    const periodFromIsoDates = (startIso, endIso) => {
      const a = parseIso(startIso);
      const b = parseIso(endIso);
      const m = monthsBetween(a, b);
      if (m == null) return "";
      if (m <= 7) return "6 months";
      if (m <= 18) return "1 year";
      if (m <= 48) return "3 years";
      return "5 years";
    };

    return (PROSPECTS || []).map((p) => {
      const typeKey = typeFromProgram(p.program);
      const statusKey = statusToKey(p.status);
      const submitted = p.dateRegistered ? formatDateRegisteredDisplay(p.dateRegistered) : dash;
      const nextReviewDate = p.nextReview ? formatDateRegisteredDisplay(p.nextReview) : dash;
      const nextReviewPeriod = periodFromIsoDates(p.dateRegistered, p.nextReview) || dash;
      return {
        id: `scr-${String(p.rowKey || "").replace(/[^a-zA-Z0-9_-]/g, "_")}`,
        prospectRowKey: p.rowKey,
        submitted,
        type: toTypeObj(typeKey),
        status: toStatusObj(statusKey),
        appointment: null,
        venue: dash,
        appointmentType: (() => {
          const raw = String(p.appointmentType || "").trim();
          if (raw) return raw;
          if (typeKey === "MMG") return "mammobus";
          if (typeKey === "PAP") return "scs-clinic";
          if (typeKey === "FIT") return "healthier-sg";
          return "";
        })(),
        action: null,
        attendance: p.attendance || "",
        result: dash,
        nextReviewPeriod,
        nextReviewDate,
        lastUpdatedBy: "System",
      };
    });
  }

  function getClassicScreeningRecordsRawMerged() {
    return getClassicScreeningRecordsRawArray().map((item) => {
      const id = item.id != null ? String(item.id) : "";
      const patch = id ? state.classicScreeningEditById[id] : null;
      return patch ? { ...item, ...patch } : { ...item };
    });
  }

  function getClassicScreeningRecordsCatalog(opts) {
    const rowKeys = Array.isArray(opts?.rowKeys) ? opts.rowKeys.filter(Boolean).map(String) : null;
    const all = getClassicScreeningRecordsRawMerged().map(normalizeClassicScreeningRecord).filter(Boolean);
    if (!rowKeys || rowKeys.length === 0) return all;
    const set = new Set(rowKeys);
    return all.filter((r) => r && r.prospectRowKey && set.has(String(r.prospectRowKey)));
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

  function pickClassicScreeningRecordIdForListProgram(programRaw, rowKey) {
    const typeKey = screeningTypeKeyFromListProgram(programRaw);
    if (!typeKey) return null;
    const records = getClassicScreeningRecordsCatalog({ rowKeys: rowKey ? [rowKey] : null });
    const fk = classicScreeningFilterKey();
    const visible = fk === "all" ? records : records.filter((r) => r.type?.key === fk);
    const hit = visible.find((r) => r.type?.key === typeKey);
    return hit ? hit.id : null;
  }

  /**
   * Screening record id for the programme chosen on the prospect listing row, using every enrolment `rowKey`
   * for this person (so Collapse / default expand match the table that lists all programmes).
   */
  function pickClassicScreeningRecordIdForDetailProspect(programRaw, detail) {
    if (!detail) return null;
    const typeKey = screeningTypeKeyFromListProgram(programRaw);
    if (!typeKey) return null;
    const rowKeys = prospectEnrolmentRowsForDetail(detail).map((r) => r.rowKey).filter(Boolean);
    if (!rowKeys.length) return null;
    const records = getClassicScreeningRecordsCatalog({ rowKeys });
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
    state.classicScreeningExpandAll = false;
    const prog = state.detail?.activeListProgram;
    const fk = classicScreeningFilterKeyFromListProgram(prog);
    if (fk) state.classicScreeningFilter = fk;
    const id = pickClassicScreeningRecordIdForDetailProspect(prog, state.detail);
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
    const screeningTypeKey = merged.type?.key;
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
    const result = String(document.getElementById("csu-result")?.value || "").trim();
    const nextReviewPeriod = String(document.getElementById("csu-next-review-period")?.value || "").trim();
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
    if (screeningTypeKey === "MMG" || screeningTypeKey === "PAP" || screeningTypeKey === "FIT") {
      patch.appointmentType = String(document.getElementById("csu-appointment-type")?.value || "").trim();
    }
    state.classicScreeningEditById[id] = { ...(state.classicScreeningEditById[id] || {}), ...patch };
    const rk =
      (merged.prospectRowKey != null && String(merged.prospectRowKey).trim()) ||
      (state.detail?.rowKey != null && String(state.detail.rowKey).trim()) ||
      "";
    if (rk) {
      const typeLabel = merged.type?.label || "Screening record";
      pushProspectActivityTimeline(rk, {
        title: "Screening record updated",
        body: `${typeLabel}: status ${status.label}. Appointment, venue, attendance, and review fields were saved.`,
        by: PORTAL_CURRENT_USER.name,
        stage: statusKey,
      });
    }
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
    // In detail / v1 screening tabs, show only this prospect's enrolment rows.
    let rowKeys = null;
    const onScr =
      (state.route === "detail" && state.detailTab === "screening") ||
      (state.route === "prospectv3" && state.prospectV3Tab === "screenings");
    if (onScr && state.detail) {
      rowKeys = prospectEnrolmentRowsForDetail(state.detail).map((r) => r.rowKey).filter(Boolean);
    }
    const records = getClassicScreeningRecordsCatalog({ rowKeys });
    const counts = classicScreeningTypeCounts(records);
    const filterKey = classicScreeningFilterKey();
    const visible = filterKey === "all" ? records : records.filter((r) => r.type?.key === filterKey);
    const exp = state.classicScreeningExpandedId;
    const expandAll = !!state.classicScreeningExpandAll;

    const tbody =
      visible.length === 0
        ? `<tr><td colspan="10"><p class="placeholder-block" style="margin:0">No screening records found.</p></td></tr>`
        : visible
            .map((r) => {
              const open = expandAll || exp === r.id;
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
            <div class="screening-records-toolbar__actions" role="group" aria-label="Row expansion">
              <button type="button" class="ui-btn ui-btn--ghost ui-btn--sm screening-records-expand-toggle" data-classic-screening-expand-toggle aria-pressed="${expandAll}">
                ${expandAll ? "Collapse All" : "Expand All"}
              </button>
            </div>
          </div>
          <table class="data-table data-table--screening-records" aria-label="Screening records">
            <thead>
              <tr>
                <th scope="col" class="data-table__th--narrow" aria-hidden="true"></th>
                <th scope="col">Submitted</th>
                <th scope="col">Screening Type</th>
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
    if (f.dateRegisteredFrom || f.dateRegisteredTo) n++;
    if (f.nextReviewFrom || f.nextReviewTo) n++;
    if (f.appointmentTypes.length) n++;
    if (f.attendances.length) n++;
    if (f.sourceTypes.length) n++;
    return n;
  }

  /** Prospect row → appointment type key for filtering (`appointmentType` or programme default). */
  function prospectAppointmentTypeFilterKey(r) {
    const at = String(r?.appointmentType || "").trim().toLowerCase();
    if (at && SCREENING_APPOINTMENT_TYPE_LABELS[at]) return at;
    return defaultAppointmentTypeKeyForListProgram(String(r?.program || ""));
  }

  /** `fieldIso` within optional inclusive bounds (YYYY-MM-DD); empty bounds = open. */
  function isoDateInFilterRange(fieldIso, fromStr, toStr) {
    const fromS = String(fromStr || "").trim();
    const toS = String(toStr || "").trim();
    if (!fromS && !toS) return true;
    const t = dateRegisteredSortValue(fieldIso);
    if (!t) return false;
    if (fromS) {
      const fromT = dateRegisteredSortValue(fromS);
      if (t < fromT) return false;
    }
    if (toS) {
      const toT = dateRegisteredSortValue(toS);
      if (t > toT) return false;
    }
    return true;
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
      if (f.dateRegisteredFrom || f.dateRegisteredTo) {
        if (!isoDateInFilterRange(r.dateRegistered, f.dateRegisteredFrom, f.dateRegisteredTo)) return false;
      }
      if (f.nextReviewFrom || f.nextReviewTo) {
        if (!isoDateInFilterRange(r.nextReview, f.nextReviewFrom, f.nextReviewTo)) return false;
      }
      if (f.appointmentTypes.length) {
        const apk = prospectAppointmentTypeFilterKey(r);
        if (!f.appointmentTypes.includes(apk)) return false;
      }
      if (f.attendances.length) {
        const ad = classicScreeningAttendanceDisplay({ attendance: r.attendance });
        if (!f.attendances.includes(ad)) return false;
      }
      if (f.sourceTypes.length && !f.sourceTypes.includes(String(r.sourceType || ""))) return false;
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
        case "appointmentType":
          cmp = prospectAppointmentTypeDisplayLabel(a).localeCompare(prospectAppointmentTypeDisplayLabel(b));
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
        // contact sort removed (column is no longer sortable)
        case "status":
          cmp = PIPELINE_KEYS.indexOf(normStatus(a)) - PIPELINE_KEYS.indexOf(normStatus(b));
          break;
        case "attendance":
          cmp = classicScreeningAttendanceDisplay({ attendance: a.attendance }).localeCompare(
            classicScreeningAttendanceDisplay({ attendance: b.attendance })
          );
          break;
        case "source":
          cmp = String(a.sourceType || "").localeCompare(String(b.sourceType || ""));
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
    const base = filterByListFilters(filterBySearch(filterByProgram(PROSPECTS)));
    return applyListKpiFilter(base);
  }

  /** Listing KPI counts should ignore KPI click-filter; they respect program/search/Filters modal only. */
  function getProspectsForSummaryCounts() {
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
    const base = typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : "/";
    const prefix = String(base).endsWith("/") ? String(base) : `${String(base)}/`;
    const src = `${prefix}assets/branding/scs-logo.png`;
    return `<img class="app-header__logo" src="${escapeAttr(src)}" alt="Singapore Cancer Society Logo" width="200" height="64" />`;
  }

  const WD_PORTAL_VARIANT = String(window.WD_PORTAL_VARIANT || "").trim().toLowerCase();
  function isStandaloneProspectVariant() {
    return WD_PORTAL_VARIANT === "standalone-prospect" || WD_PORTAL_VARIANT === "standaloneprospect";
  }

  /** Which item is highlighted in the global top nav (logo + Prospect Management | Bishan | FIT). */
  function headerPrimaryNavActiveId() {
    if (!isStandaloneProspectVariant()) {
      if (state.route === "bishanClinics") return "bishan";
      if (state.route === "fitKitTracker") return "fit";
    }
    return "prospects";
  }

  function renderHeaderPrimaryNav() {
    const active = headerPrimaryNavActiveId();
    const link = (id, href, label) => {
      const isOn = active === id;
      return `<a href="${href}" class="app-header__nav-link${isOn ? " is-active" : ""}">${escapeAttr(label)}</a>`;
    };
    const extras = isStandaloneProspectVariant()
      ? ""
      : `
        ${link("bishan", "#/bishan-clinics", "Bishan Clinic")}
        ${link("fit", "#/fit-kit-tracker", "FIT Kit Tracker")}`;
    return `
      <nav class="app-header__primary-nav" aria-label="Main navigation">
        ${link("prospects", "#/list", "Prospect Management")}
        ${extras}
      </nav>`;
  }

  /** Placeholder content for top-nav sections not yet built out in this prototype. */
  function renderPortalPlaceholderPage(title, description) {
    return `
      <div class="portal-placeholder">
        <h1 class="registration__title">${escapeAttr(title)}</h1>
        <p class="cell-muted portal-placeholder__lead">${escapeAttr(description)}</p>
      </div>`;
  }

  function ensureBishanScreeningState() {
    if (state.bishanScreening) return;
    if (typeof window.WD_bishanScreening === "undefined") return;
    state.bishanScreening = window.WD_bishanScreening.createInitialState();
  }

  function renderBishanClinicsPage() {
    ensureBishanScreeningState();
    if (typeof window.WD_bishanScreening !== "undefined" && state.bishanScreening) {
      return window.WD_bishanScreening.renderMarkup(state.bishanScreening);
    }
    return renderPortalPlaceholderPage(
      "Bishan Clinic",
      "Screening portal could not load. Ensure js/bishan-screening-portal.js is included before app.js."
    );
  }

  // —— FIT Kit Tracker (static prototype page) — based on provided JSX, adapted to portal shell —— //

  const FIT_STAGES = Object.freeze([
    { id: 1, label: "NCSS patient list", sub: "Received from NCSS" },
    { id: 2, label: "Dispatched to packing", sub: "Sent to drop-ship company" },
    { id: 3, label: "Kit returned to lab", sub: "Patient returned sample" },
    { id: 4, label: "Lab result", sub: "Test result received" },
  ]);

  const FIT_STAGE_CSV_HEADERS = Object.freeze({
    1: "NCSS Ref *,Full Name *,NRIC (masked),Date of Birth,Age *,Gender *,Mobile *,Home Address,Notes\ne.g. NCSS-2024-031,e.g. Tan Ah Kow,e.g. S****234A,YYYY-MM-DD,50-100,M or F,e.g. 91234567,Blk/Street/Unit,Any remarks",
    2: "NCSS Ref *,Dispatch Date *,Notes\ne.g. NCSS-2024-001,YYYY-MM-DD,Any remarks",
    3: "NCSS Ref *,Lab Reference *,Date Kit Received *,Notes\ne.g. NCSS-2024-001,e.g. LAB-10025,YYYY-MM-DD,Any remarks",
    4: "NCSS Ref *,Result *,Result Date *,Notes\ne.g. NCSS-2024-001,Negative or Positive,YYYY-MM-DD,Any remarks",
  });

  const FIT_STAGE_CSV_NAMES = Object.freeze({
    1: "FIT_Stage1_NCSS.csv",
    2: "FIT_Stage2_Dispatch.csv",
    3: "FIT_Stage3_Lab.csv",
    4: "FIT_Stage4_Result.csv",
  });

  function fitNormalizeHeader(h) {
    return String(h || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  }

  const FIT_HEADER_MAP = Object.freeze({
    ncssref: "ncssRef",
    referid: "ncssRef",
    refid: "ncssRef",
    fullname: "name",
    patientname: "name",
    nricmasked: "nric",
    nric: "nric",
    dateofbirth: "dob",
    dob: "dob",
    age: "age",
    gender: "gender",
    sex: "gender",
    mobile: "mobile",
    homeaddress: "address",
    address: "address",
    dispatchdate: "dispatchDate",
    labreference: "labRef",
    labref: "labRef",
    datekitreceived: "receivedDate",
    datereceived: "receivedDate",
    receiveddate: "receivedDate",
    result: "result",
    resultdate: "resultDate",
    notes: "notes",
  });

  const FIT_STAGE_REQUIRED = Object.freeze({
    1: ["ncssref", "fullname", "age", "gender", "mobile"],
    2: ["ncssref", "dispatchdate"],
    3: ["ncssref", "labreference", "datekitreceived"],
    4: ["ncssref", "result", "resultdate"],
  });

  function fitTodayIso() {
    const d = new Date();
    const pad2 = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }

  function fitStageCount(stageId) {
    const ps = state.fitKit?.patients || [];
    return ps.filter((p) => Number(p.stage) === Number(stageId)).length;
  }

  function fitFilteredPatients() {
    const ps = state.fitKit?.patients || [];
    const t = String(state.fitKit?.search || "")
      .trim()
      .toLowerCase();
    const kpi = String(state.fitKit?.kpiActive || "").trim();
    const applyKpi = (p) => {
      if (!kpi || kpi === "total") return true;
      if (kpi === "awaiting") return Number(p.stage) < 4;
      if (kpi === "positive") return String(p.result) === "Positive";
      if (kpi === "negative") return String(p.result) === "Negative";
      if (/^stage[1-4]$/.test(kpi)) return Number(p.stage) === Number(kpi.replace("stage", ""));
      return true;
    };

    const base = t
      ? ps.filter((p) => {
      const name = String(p.name || "").toLowerCase();
      const ref = String(p.ncssRef || "").toLowerCase();
      const mobile = String(p.mobile || "");
      return name.includes(t) || ref.includes(t) || mobile.includes(t);
        })
      : ps;
    return base.filter(applyKpi);
  }

  function fitDaysPending(p) {
    if (!p) return null;
    const stage = Number(p.stage);
    if (stage === 4 && String(p.result || "").trim()) return null;
    const entry =
      stage === 2 ? p.dispatchDate : stage === 3 ? p.dispatchDate : stage === 4 ? p.receivedDate : null;
    if (!entry) return null;
    const ts = new Date(entry).getTime();
    if (!Number.isFinite(ts)) return null;
    const diff = Math.floor((Date.now() - ts) / 86400000);
    if (!Number.isFinite(diff) || diff < 0) return null;
    return diff;
  }

  function fitDownloadBlob(filename, blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", filename);
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    window.setTimeout(() => {
      try {
        URL.revokeObjectURL(url);
      } catch (_) {
        /* ignore */
      }
      try {
        document.body.removeChild(a);
      } catch (_) {
        /* ignore */
      }
    }, 200);
  }

  function fitExportCsv() {
    const hdr = [
      "NCSS Ref",
      "Patient Name",
      "Mobile",
      "Stage",
      "Dispatch Date",
      "Lab Ref",
      "Date Received",
      "Result",
      "Result Date",
      "Notes",
    ];
    const rows = (state.fitKit?.patients || []).map((p) => [
      p.ncssRef,
      p.name,
      p.mobile,
      p.stage,
      p.dispatchDate || "",
      p.labRef || "",
      p.receivedDate || "",
      p.result || "",
      p.resultDate || "",
      `"${String(p.notes || "").replace(/"/g, '""')}"`,
    ]);
    const csv = [hdr, ...rows]
      .map((r) => r.map((x) => (x == null ? "" : String(x))).join(","))
      .join("\n");
    fitDownloadBlob("fit_kit_tracker.csv", new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  }

  function fitExportCsvSelected(ids) {
    const sel = new Set((Array.isArray(ids) ? ids : []).map((x) => Number(x)).filter((n) => Number.isFinite(n)));
    if (!sel.size) {
      showToast("No records selected.");
      return;
    }
    const patients = (state.fitKit?.patients || []).filter((p) => sel.has(Number(p.id)));
    const hdr = [
      "NCSS Ref",
      "Patient Name",
      "Mobile",
      "Stage",
      "Dispatch Date",
      "Lab Ref",
      "Date Received",
      "Result",
      "Result Date",
      "Notes",
    ];
    const rows = patients.map((p) => [
      p.ncssRef,
      p.name,
      p.mobile,
      p.stage,
      p.dispatchDate || "",
      p.labRef || "",
      p.receivedDate || "",
      p.result || "",
      p.resultDate || "",
      `"${String(p.notes || "").replace(/"/g, '""')}"`,
    ]);
    const csv = [hdr, ...rows]
      .map((r) => r.map((x) => (x == null ? "" : String(x))).join(","))
      .join("\n");
    fitDownloadBlob("fit_kit_tracker_selected.csv", new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  }

  function fitDownloadTemplate(stageId) {
    const id = Number(stageId);
    const csv = FIT_STAGE_CSV_HEADERS[id] || FIT_STAGE_CSV_HEADERS[1];
    const name = FIT_STAGE_CSV_NAMES[id] || `FIT_Stage${id}.csv`;
    fitDownloadBlob(name, new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  }

  function fitParseCsv(text) {
    const lines = String(text || "").split(/\r?\n/);
    const out = [];
    for (const line of lines) {
      const cells = [];
      let cur = "";
      let inQ = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line.charAt(i);
        if (ch === '"') {
          inQ = !inQ;
        } else if (ch === "," && !inQ) {
          cells.push(cur.trim());
          cur = "";
        } else {
          cur += ch;
        }
      }
      cells.push(cur.trim());
      if (cells.some((c) => String(c).trim() !== "")) out.push(cells);
    }
    return out;
  }

  function fitHandleCsvFile(file, stageId) {
    const sid = Number(stageId);
    if (!file) return;
    const name = String(file.name || "").toLowerCase();
    if (!name.endsWith(".csv")) {
      state.fitKit.uploadState = {
        preview: null,
        parsedRows: null,
        errors: [
          {
            type: "format",
            msg: "Please upload a .csv file. Download the template, fill it in Excel, then File → Save As → CSV.",
          },
        ],
      };
      renderApp();
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e?.target?.result;
      const rows = fitParseCsv(text);
      const reqCols = FIT_STAGE_REQUIRED[sid] || FIT_STAGE_REQUIRED[1];
      let headerIdx = -1;
      for (let i = 0; i < Math.min(rows.length, 10); i++) {
        const norm = rows[i].map(fitNormalizeHeader);
        if (reqCols.every((req) => norm.some((n) => n.includes(req)))) {
          headerIdx = i;
          break;
        }
      }
      if (headerIdx < 0) {
        state.fitKit.uploadState = {
          preview: null,
          parsedRows: null,
          errors: [{ type: "format", msg: `Wrong template for Stage ${sid}. Please download the correct Stage ${sid} template.` }],
        };
        renderApp();
        return;
      }

      const normHeaders = rows[headerIdx].map(fitNormalizeHeader);
      const colIdx = {};
      normHeaders.forEach((nh, i) => {
        for (const [k, v] of Object.entries(FIT_HEADER_MAP)) {
          if (nh.includes(k) && colIdx[v] == null) colIdx[v] = i;
        }
      });

      let dataStart = headerIdx + 1;
      if (dataStart < rows.length) {
        const probe = rows[dataStart].join(" ").toLowerCase();
        if (probe.includes("e.g") || probe.includes("yyyy")) dataStart++;
      }
      const dataRows = rows.slice(dataStart).filter((r) => r.some((c) => String(c).trim() !== ""));
      if (!dataRows.length) {
        state.fitKit.uploadState = {
          preview: null,
          parsedRows: null,
          errors: [{ type: "format", msg: "No patient data found. Fill in at least one row below the header." }],
        };
        renderApp();
        return;
      }

      const get = (r, field) => (colIdx[field] != null ? String(r[colIdx[field]] ?? "").trim() : "");
      const parsed = [];
      const errors = [];
      const patients = state.fitKit.patients || [];

      dataRows.forEach((r, idx) => {
        const rowNum = dataStart + idx + 1;
        const ncssRef = get(r, "ncssRef");
        if (!ncssRef) {
          errors.push({ type: "field", msg: `Row ${rowNum}: NCSS Ref required` });
          return;
        }
        if (sid === 1) {
          const name = get(r, "name");
          const ageRaw = get(r, "age");
          const gender = get(r, "gender").toUpperCase();
          const mobile = get(r, "mobile").replace(/\s/g, "");
          const errs = [];
          if (!name) errs.push("Full Name required");
          const age = parseInt(ageRaw, 10);
          if (!ageRaw) errs.push("Age required");
          else if (Number.isNaN(age)) errs.push("Age must be a number");
          else if (age < 50 || age > 100) errs.push("Age must be 50–100");
          if (!gender) errs.push("Gender required");
          else if (!["M", "F"].includes(gender)) errs.push("Gender must be M or F");
          if (!mobile) errs.push("Mobile required");
          else if (!/^[689]\d{7}$/.test(mobile)) errs.push("Invalid SG mobile number");
          if (patients.some((p) => String(p.ncssRef) === ncssRef)) errs.push(`NCSS Ref "${ncssRef}" already exists in portal`);
          if (parsed.some((p) => String(p.ncssRef) === ncssRef)) errs.push(`NCSS Ref "${ncssRef}" duplicated in file`);
          if (errs.length) {
            errors.push({ type: "field", msg: `Row ${rowNum} (${name || ncssRef}): ${errs.join("; ")}` });
            return;
          }
          parsed.push({
            id: 0,
            name,
            ncssRef,
            nric: get(r, "nric"),
            dob: get(r, "dob"),
            age,
            gender,
            mobile,
            address: get(r, "address"),
            stage: 1,
            dispatchDate: "",
            labRef: "",
            receivedDate: "",
            result: "",
            resultDate: "",
            notes: get(r, "notes"),
          });
          return;
        }

        const existing = patients.find((p) => String(p.ncssRef) === ncssRef);
        const errs = [];
        if (!existing) errs.push(`NCSS Ref "${ncssRef}" not found in portal`);
        else if (Number(existing.stage) !== sid) errs.push(`NCSS Ref "${ncssRef}" belongs to Stage ${existing.stage}, not Stage ${sid}`);
        if (sid === 2) {
          const dispatchDate = get(r, "dispatchDate");
          if (!dispatchDate) errs.push("Dispatch Date required");
          if (errs.length) {
            errors.push({ type: existing ? "field" : "ncss", msg: `Row ${rowNum} (${ncssRef}): ${errs.join("; ")}` });
            return;
          }
          parsed.push({ _patch: true, ncssRef, dispatchDate, notes: get(r, "notes") });
        } else if (sid === 3) {
          const labRef = get(r, "labRef");
          const receivedDate = get(r, "receivedDate");
          if (!labRef) errs.push("Lab Reference required");
          if (!receivedDate) errs.push("Date Kit Received required");
          if (errs.length) {
            errors.push({ type: existing ? "field" : "ncss", msg: `Row ${rowNum} (${ncssRef}): ${errs.join("; ")}` });
            return;
          }
          parsed.push({ _patch: true, ncssRef, labRef, receivedDate, notes: get(r, "notes") });
        } else if (sid === 4) {
          const result = get(r, "result");
          const resultDate = get(r, "resultDate");
          if (!result) errs.push("Result required");
          else if (!["Negative", "Positive"].includes(result)) errs.push("Result must be Negative or Positive");
          if (!resultDate) errs.push("Result Date required");
          if (errs.length) {
            errors.push({ type: existing ? "field" : "ncss", msg: `Row ${rowNum} (${ncssRef}): ${errs.join("; ")}` });
            return;
          }
          parsed.push({ _patch: true, ncssRef, result, resultDate, notes: get(r, "notes") });
        }
      });

      if (errors.length) {
        state.fitKit.uploadState = { preview: null, parsedRows: null, errors };
        renderApp();
        return;
      }
      state.fitKit.uploadState = { preview: parsed, parsedRows: parsed, errors: null };
      renderApp();
    };
    reader.readAsText(file);
  }

  function fitConfirmUpload() {
    const sid = Number(state.fitKit.uploadModalStage);
    const parsed = state.fitKit?.uploadState?.parsedRows || [];
    if (!sid || !Array.isArray(parsed) || !parsed.length) return;
    let nid = Number(state.fitKit.nextId) || 1;
    const nextPatients = [...(state.fitKit.patients || [])];
    parsed.forEach((row) => {
      if (row && row._patch) {
        const i = nextPatients.findIndex((p) => String(p.ncssRef) === String(row.ncssRef));
        if (i >= 0) nextPatients[i] = { ...nextPatients[i], ...row };
      } else if (row) {
        nextPatients.push({ ...row, id: nid++ });
      }
    });
    state.fitKit.patients = nextPatients;
    state.fitKit.nextId = nid;
    state.fitKit.uploadModalStage = null;
    state.fitKit.uploadState = { preview: null, errors: null, parsedRows: null };
    showToast("CSV imported (prototype only).");
    renderApp();
  }

  function fitResultBadgeHtml(resultRaw) {
    const r = String(resultRaw || "").trim();
    if (!r) return `<span class="fit-badge fit-badge--pending">Pending</span>`;
    const pos = r === "Positive";
    return `<span class="fit-badge ${pos ? "fit-badge--pos" : "fit-badge--neg"}">${escapeAttr(r)}</span>`;
  }

  function renderFitKitTrackerModals() {
    const e = escapeAttr;
    const fit = state.fitKit;
    if (!fit) return "";

    const closeBtn = `<button type="button" class="ui-btn ui-btn--ghost ui-btn--icon" data-fit-modal-close aria-label="Close">${icons.x}</button>`;

    const edit = fit.editModal;
    const adv = fit.advanceModal;
    const uploadStage = fit.uploadModalStage;

    const modalShell = (id, title, bodyHtml, footerHtml) => `
      <div class="ui-dialog-overlay" id="${e(id)}" role="presentation">
        <div class="ui-dialog" role="dialog" aria-modal="true" aria-labelledby="${e(id)}-title">
          <div class="ui-dialog__close">${closeBtn}</div>
          <div class="ui-dialog__header"><h2 class="ui-dialog__title" id="${e(id)}-title">${e(title)}</h2></div>
          <div class="ui-dialog__body">${bodyHtml}</div>
          <div class="ui-dialog__footer"><div class="ui-dialog__footer-actions">${footerHtml}</div></div>
        </div>
      </div>
    `;

    const modals = [];

    if (edit) {
      const isNew = !!edit.isNew;
      const p = isNew ? null : fit.patients.find((x) => Number(x.id) === Number(edit.patientId));
      const stage = Number(isNew ? edit.stage : p?.stage);
      if (stage >= 1 && stage <= 4 && (isNew || p)) {
        const title = isNew ? `Add patient — Stage ${stage}` : `Edit — ${p.name} (Stage ${stage})`;
        const info =
          stage === 1
            ? `<p class="fit-modal__lede">${isNew ? "Enter patient details to add into Stage 1." : "All fields are editable for Stage 1."}</p>`
            : stage === 2
              ? `<p class="fit-modal__lede">${isNew ? "Add by NCSS Reference. Dispatch Date is required." : "Only <b>Dispatch Date</b> and <b>Notes</b> are editable at Stage 2."}</p>`
              : stage === 3
                ? `<p class="fit-modal__lede">${isNew ? "Add by NCSS Reference. Lab Reference and Date Received are required." : "Only <b>Lab Reference</b>, <b>Date Kit Received</b> and <b>Notes</b> are editable at Stage 3."}</p>`
                : `<p class="fit-modal__lede">${isNew ? "Add by NCSS Reference. Result and Result Date are required." : "Only <b>Result</b>, <b>Result Date</b> and <b>Notes</b> are editable at Stage 4."}</p>`;

        const roField = (label, value) => `
          <div class="field field--full">
            <label>${e(label)}</label>
            <input type="text" value="${e(value || "")}" disabled />
          </div>`;

        const txt = (k) => e(edit.form?.[k] != null ? String(edit.form[k]) : "");
        const body = `
          <div class="fit-modal__stack">
            ${info}
            ${
              isNew
                ? `<div class="field field--full"><label for="fit-edit-ncssRef">NCSS Reference *</label><input id="fit-edit-ncssRef" type="text" value="${txt(
                    "ncssRef"
                  )}" data-fit-edit-field="ncssRef" /></div>`
                : roField("NCSS Reference", p.ncssRef)
            }
            ${!isNew && stage !== 1 ? roField("Patient Name", p.name) : ""}
            ${
              stage === 1
                ? `
              <div class="form-grid">
                <div class="field">
                  <label for="fit-edit-name">Full Name *</label>
                  <input id="fit-edit-name" type="text" value="${txt("name")}" data-fit-edit-field="name" />
                </div>
                <div class="field">
                  <label for="fit-edit-age">Age</label>
                  <input id="fit-edit-age" type="number" value="${txt("age")}" data-fit-edit-field="age" />
                </div>
                <div class="field">
                  <label for="fit-edit-nric">NRIC (masked)</label>
                  <input id="fit-edit-nric" type="text" value="${txt("nric")}" data-fit-edit-field="nric" />
                </div>
                <div class="field">
                  <label for="fit-edit-gender">Gender</label>
                  <select id="fit-edit-gender" data-fit-edit-field="gender">
                    <option value="M"${txt("gender") === "M" ? " selected" : ""}>M</option>
                    <option value="F"${txt("gender") === "F" ? " selected" : ""}>F</option>
                  </select>
                </div>
                <div class="field">
                  <label for="fit-edit-mobile">Mobile</label>
                  <input id="fit-edit-mobile" type="text" value="${txt("mobile")}" data-fit-edit-field="mobile" />
                </div>
                <div class="field">
                  <label for="fit-edit-dob">Date of Birth</label>
                  <input id="fit-edit-dob" type="date" value="${txt("dob")}" data-fit-edit-field="dob" />
                </div>
                <div class="field field--full">
                  <label for="fit-edit-address">Home Address</label>
                  <input id="fit-edit-address" type="text" value="${txt("address")}" data-fit-edit-field="address" />
                </div>
              </div>`
                : stage === 2
                  ? `
              <div class="form-grid">
                <div class="field field--full">
                  <label for="fit-edit-dispatchDate">Dispatch Date</label>
                  <input id="fit-edit-dispatchDate" type="date" value="${txt("dispatchDate")}" data-fit-edit-field="dispatchDate" />
                </div>
              </div>`
                  : stage === 3
                    ? `
              <div class="form-grid">
                <div class="field">
                  <label for="fit-edit-labRef">Lab Reference</label>
                  <input id="fit-edit-labRef" type="text" value="${txt("labRef")}" data-fit-edit-field="labRef" />
                </div>
                <div class="field">
                  <label for="fit-edit-receivedDate">Date Kit Received</label>
                  <input id="fit-edit-receivedDate" type="date" value="${txt("receivedDate")}" data-fit-edit-field="receivedDate" />
                </div>
              </div>`
                    : `
              <div class="form-grid">
                <div class="field">
                  <label for="fit-edit-result">Result</label>
                  <select id="fit-edit-result" data-fit-edit-field="result">
                    <option value=""${txt("result") === "" ? " selected" : ""}>Pending</option>
                    <option value="Negative"${txt("result") === "Negative" ? " selected" : ""}>Negative</option>
                    <option value="Positive"${txt("result") === "Positive" ? " selected" : ""}>Positive</option>
                  </select>
                </div>
                <div class="field">
                  <label for="fit-edit-resultDate">Result Date</label>
                  <input id="fit-edit-resultDate" type="date" value="${txt("resultDate")}" data-fit-edit-field="resultDate" />
                </div>
              </div>`
            }
            <div class="field field--full">
              <label for="fit-edit-notes">Notes</label>
              <textarea id="fit-edit-notes" rows="4" data-fit-edit-field="notes">${e(edit.form?.notes || "")}</textarea>
            </div>
          </div>
        `;
        const footer = `
          <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-fit-modal-close>Cancel</button>
          <button type="button" class="ui-btn ui-btn--default ui-btn--sm" data-fit-edit-save>Save</button>
        `;
        modals.push(modalShell("fit-edit-modal", title, body, footer));
      }
    }

    if (adv && adv.patientId != null && adv.toStage) {
      const p = fit.patients.find((x) => Number(x.id) === Number(adv.patientId));
      if (p) {
        const toStage = Number(adv.toStage);
        const stageLabel = FIT_STAGES.find((s) => s.id === toStage)?.label || `Stage ${toStage}`;
        const title = `Advance to Stage ${toStage} — ${stageLabel}`;
        const f = adv.form || {};
        const body = `
          <div class="fit-modal__stack">
            <p class="fit-modal__lede">Patient: <b>${e(p.name)}</b></p>
            ${
              toStage === 2
                ? `<div class="field field--full"><label for="fit-adv-dispatchDate">Dispatch Date *</label><input id="fit-adv-dispatchDate" type="date" value="${e(
                    f.dispatchDate || fitTodayIso()
                  )}" data-fit-adv-field="dispatchDate" /></div>`
                : ""
            }
            ${
              toStage === 3
                ? `
              <div class="form-grid">
                <div class="field">
                  <label for="fit-adv-labRef">Lab Reference *</label>
                  <input id="fit-adv-labRef" type="text" value="${e(f.labRef || "")}" data-fit-adv-field="labRef" />
                </div>
                <div class="field">
                  <label for="fit-adv-receivedDate">Date Received *</label>
                  <input id="fit-adv-receivedDate" type="date" value="${e(f.receivedDate || fitTodayIso())}" data-fit-adv-field="receivedDate" />
                </div>
              </div>`
                : ""
            }
            ${
              toStage === 4
                ? `
              <div class="form-grid">
                <div class="field">
                  <label for="fit-adv-result">Result *</label>
                  <select id="fit-adv-result" data-fit-adv-field="result">
                    <option value="">-- Select --</option>
                    <option value="Negative"${String(f.result) === "Negative" ? " selected" : ""}>Negative</option>
                    <option value="Positive"${String(f.result) === "Positive" ? " selected" : ""}>Positive</option>
                  </select>
                </div>
                <div class="field">
                  <label for="fit-adv-resultDate">Result Date *</label>
                  <input id="fit-adv-resultDate" type="date" value="${e(f.resultDate || fitTodayIso())}" data-fit-adv-field="resultDate" />
                </div>
              </div>
              <div class="field field--full">
                <label for="fit-adv-labRef2">Lab Reference</label>
                <input id="fit-adv-labRef2" type="text" value="${e(f.labRef || p.labRef || "")}" data-fit-adv-field="labRef" />
              </div>`
                : ""
            }
            <div class="field field--full">
              <label for="fit-adv-notes">Notes</label>
              <textarea id="fit-adv-notes" rows="4" data-fit-adv-field="notes">${e(f.notes || "")}</textarea>
            </div>
          </div>
        `;
        const footer = `
          <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-fit-modal-close>Cancel</button>
          <button type="button" class="ui-btn ui-btn--default ui-btn--sm" data-fit-adv-save>Advance</button>
        `;
        modals.push(modalShell("fit-advance-modal", title, body, footer));
      }
    }

    if (uploadStage) {
      const sid = Number(uploadStage);
      const us = fit.uploadState || {};
      const errs = Array.isArray(us.errors) ? us.errors : null;
      const preview = Array.isArray(us.preview) ? us.preview : null;
      const ready = Array.isArray(us.parsedRows) ? us.parsedRows : null;

      const errsHtml = (() => {
        if (!errs || !errs.length) return "";
        const ncss = errs.filter((x) => x.type === "ncss" || String(x.msg || "").includes("not found") || String(x.msg || "").includes("Stage"));
        const field = errs.filter((x) => !ncss.includes(x));
        const section = (title, items, tone) =>
          items && items.length
            ? `<div class="fit-upload__err-block fit-upload__err-block--${tone}"><div class="fit-upload__err-title">${e(
                title
              )}</div><div class="fit-upload__err-items">${items.map((it) => `<div>• ${e(it.msg)}</div>`).join("")}</div></div>`
            : "";
        return `
          <div class="fit-upload__errs">
            ${section(`⚠ ${ncss.length} NCSS Reference ID${ncss.length === 1 ? "" : "s"} rejected — upload cancelled`, ncss, "danger")}
            ${section(`${field.length} field validation error${field.length === 1 ? "" : "s"}`, field, "warn")}
            <div class="fit-upload__err-foot">Please correct the errors and upload again. No records were updated.</div>
          </div>
        `;
      })();

      const previewHtml = (() => {
        if (!preview || !preview.length) return "";
        const cfg = {
          1: { cols: ["ncssRef", "name", "age", "gender", "mobile"], labels: ["NCSS Ref", "Name", "Age", "Sex", "Mobile"] },
          2: { cols: ["ncssRef", "dispatchDate", "notes"], labels: ["NCSS Ref", "Dispatch Date", "Notes"] },
          3: { cols: ["ncssRef", "receivedDate", "notes"], labels: ["NCSS Ref", "Date Received", "Notes"] },
          4: { cols: ["ncssRef", "result", "resultDate", "notes"], labels: ["NCSS Ref", "Result", "Result Date", "Notes"] },
        }[sid] || { cols: ["ncssRef"], labels: ["NCSS Ref"] };
        const head = cfg.labels.map((l) => `<th scope="col">${e(l)}</th>`).join("");
        const rows = preview
          .map((r) => `<tr>${cfg.cols.map((c) => `<td>${e(r?.[c] || "—")}</td>`).join("")}</tr>`)
          .join("");
        return `
          <div class="fit-upload__preview">
            <div class="fit-upload__preview-title">Preview — ${preview.length} record${preview.length === 1 ? "" : "s"} ready to import</div>
            <div class="fit-upload__preview-table">
              <table class="data-table data-table--compact">
                <thead><tr>${head}</tr></thead>
                <tbody>${rows}</tbody>
              </table>
            </div>
          </div>
        `;
      })();

      const body = `
        <div class="fit-modal__stack">
          <div class="fit-upload__howto">
            <b>How to use:</b><br/>
            1. Download the CSV template below<br/>
            2. Fill in patient details (one row per patient)<br/>
            3. Save as <b>.csv</b> and upload here
          </div>
          <button type="button" class="ui-btn ui-btn--default ui-btn--sm" data-fit-download-template="${e(sid)}">Download CSV Template (Stage ${e(
        sid
      )})</button>
          <div class="fit-upload__divider"><span>then upload your filled file</span></div>
          <div class="fit-upload__dropzone" data-fit-upload-dropzone>
            <div class="fit-upload__drop-ico">Upload</div>
            <div class="fit-upload__drop-title">Click to select or drag &amp; drop</div>
            <div class="fit-upload__drop-sub">.csv files only</div>
            <input id="fit-upload-input" type="file" accept=".csv" style="display:none" />
          </div>
          ${errsHtml}
          ${previewHtml}
        </div>
      `;
      const footer = `
        <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-fit-modal-close>Cancel</button>
        ${
          ready && ready.length
            ? `<button type="button" class="ui-btn ui-btn--default ui-btn--sm" data-fit-upload-confirm>Import ${ready.length} record${
                ready.length === 1 ? "" : "s"
              }</button>`
            : ""
        }
      `;
      modals.push(modalShell("fit-upload-modal", `Upload CSV — Stage ${sid}`, body, footer));
    }

    return modals.join("");
  }

  /** KPI strip — same structure/classes as Prospect Management listing (`renderProspectSummarySection`). */
  function renderFitKitSummarySection() {
    const e = escapeAttr;
    const active = String(state.fitKit?.kpiActive || "");
    const patients = state.fitKit?.patients || [];
    const total = patients.length;
    const pos = patients.filter((p) => String(p.result) === "Positive").length;
    const neg = patients.filter((p) => String(p.result) === "Negative").length;
    const awaiting = patients.filter((p) => Number(p.stage) < 4).length;
    const card = (key, classNames, label, value) => `
          <article class="prospect-summary-card ${classNames}${active === key ? " is-active" : ""}" data-fit-kpi="${e(
            key
          )}" role="button" tabindex="0" aria-pressed="${active === key}">
            <h3 class="prospect-summary-card__label">${e(label)}</h3>
            <p class="prospect-summary-card__value">${e(String(value))}</p>
          </article>`;
    return `
      <section class="prospect-summary fit-kit-summary" aria-label="FIT kit summary">
        <div class="prospect-summary__grid" role="group" aria-label="FIT pipeline summary">
          ${card("total", "", "Total patients", total)}
          ${card("stage1", "prospect-summary-card--qualified", "Stage 1 — NCSS list", fitStageCount(1))}
          ${card("stage2", "prospect-summary-card--booked", "Stage 2 — dispatched", fitStageCount(2))}
          ${card("stage3", "prospect-summary-card--screened", "Stage 3 — kit returned", fitStageCount(3))}
          ${card("stage4", "prospect-summary-card--conversion", "Stage 4 — results in", fitStageCount(4))}
          ${card("positive", "prospect-summary-card--highrisk", "Positive results", pos)}
          ${card("negative", "prospect-summary-card--screened", "Negative results", neg)}
          ${card("awaiting", "prospect-summary-card--firsttime", "Awaiting result", awaiting)}
        </div>
      </section>`;
  }

  function renderFitKitTrackerPage() {
    const e = escapeAttr;
    const fit = state.fitKit;
    const patients = fit?.patients || [];
    const filtered = fitFilteredPatients();
    const selectedSet = new Set((fit?.selectedIds || []).map((x) => Number(x)).filter((n) => Number.isFinite(n)));
    const activeStage = Number(fit?.activeStage || 0);
    const stagesToShow = activeStage ? FIT_STAGES.filter((s) => s.id === activeStage) : FIT_STAGES;

    const stageNav = FIT_STAGES.map((s) => {
      const on = activeStage === s.id;
      return `
        <button type="button" class="fit-stage-tab${on ? " is-active" : ""}" data-fit-stage="${e(s.id)}">
          <span class="fit-stage-tab__dot">${e(s.id)}</span>
          <span class="fit-stage-tab__txt">
            <span class="fit-stage-tab__label">${e(s.label)}</span>
            <span class="fit-stage-tab__sub">${e(s.sub)}</span>
          </span>
          <span class="fit-stage-tab__count">${e(fitStageCount(s.id))}</span>
        </button>
      `;
    }).join("");

    const stageSections = stagesToShow
      .map((s) => {
        const sid = Number(s.id);
        const rows = filtered.filter((p) => Number(p.stage) === sid);

        const cols =
          sid === 1
            ? [
                ["ncssRef", "NCSS ref"],
                ["name", "Patient name"],
                ["nric", "NRIC"],
                ["age", "Age"],
                ["gender", "Sex"],
                ["mobile", "Mobile"],
                ["notes", "Notes"],
              ]
            : sid === 2
              ? [
                  ["ncssRef", "NCSS ref"],
                  ["name", "Patient name"],
                  ["nric", "NRIC"],
                  ["age", "Age"],
                  ["gender", "Sex"],
                  ["mobile", "Mobile"],
                  ["dispatchDate", "Dispatch date"],
                  ["notes", "Notes"],
                ]
              : sid === 3
                ? [
                    ["ncssRef", "NCSS ref"],
                    ["name", "Patient name"],
                    ["nric", "NRIC"],
                    ["age", "Age"],
                    ["gender", "Sex"],
                    ["mobile", "Mobile"],
                    ["labRef", "Lab ref"],
                    ["receivedDate", "Date received"],
                    ["notes", "Notes"],
                  ]
                : [
                    ["ncssRef", "NCSS ref"],
                    ["name", "Patient name"],
                    ["nric", "NRIC"],
                    ["age", "Age"],
                    ["gender", "Sex"],
                    ["mobile", "Mobile"],
                    ["result", "Result"],
                    ["resultDate", "Result date"],
                    ["notes", "Notes"],
                  ];

        const thead = `
          <thead>
            <tr>
              <th scope="col" class="fit-th-check">
                <input type="checkbox" class="fit-check" data-fit-select-all-stage="${e(sid)}" aria-label="Select all Stage ${e(
          sid
        )} records" />
              </th>
              ${cols.map(([, label]) => `<th scope="col">${e(label)}</th>`).join("")}
              <th scope="col" class="fit-th-actions">Actions</th>
            </tr>
          </thead>
        `;

        const tbody = rows.length
          ? rows
              .map((p) => {
                const checked = selectedSet.has(Number(p.id));
                const canAdvanceRow = Number(p.stage) < 4;
                const cell = (k) => {
                  const v = p?.[k];
                  if (k === "notes") return `<td class="fit-notes" title="${e(v || "")}">${e(v || "—")}</td>`;
                  if (k === "result") return `<td>${fitResultBadgeHtml(v)}</td>`;
                  return `<td class="${k.endsWith("Date") ? "mono" : ""}">${e(v || "—")}</td>`;
                };
                return `
                  <tr class="fit-row" data-fit-row-stage="${e(sid)}">
                    <td class="fit-td-check">
                      <input type="checkbox" class="fit-check" data-fit-select-row="${e(p.id)}" data-fit-row-stage="${e(
          sid
        )}" aria-label="Select ${e(p.ncssRef || p.name || "record")}" ${checked ? "checked" : ""}/>
                    </td>
                    ${cols.map(([k]) => cell(k)).join("")}
                    <td class="fit-actions">
                      <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-fit-edit="${e(p.id)}">Edit</button>
                      ${
                        canAdvanceRow
                          ? `<button type="button" class="ui-btn ui-btn--default ui-btn--sm" data-fit-advance="${e(
                              p.id
                            )}" aria-label="Advance">→</button>`
                          : ""
                      }
                    </td>
                  </tr>
                `;
              })
              .join("")
          : `<tr><td colspan="${cols.length + 2}" class="fit-empty">No patients in this stage.</td></tr>`;

        return `
          <section class="fit-stage" aria-label="Stage ${e(sid)}">
            <div class="fit-stage__head">
              <div class="fit-stage__left">
                <span class="fit-stage__title"><span class="fit-stage__dot" aria-hidden="true"></span>Stage ${e(sid)} — ${e(
          s.label
        )}</span>
                <span class="fit-stage__meta">${e(rows.length)} patient${rows.length === 1 ? "" : "s"}</span>
              </div>
              <div class="fit-stage__actions">
                <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-fit-upload="${e(sid)}">Upload CSV</button>
              </div>
            </div>
            <section class="table-card fit-kit__table-card">
              <div class="table-card__body">
                <div class="data-table-wrap">
                  <table class="data-table fit-table">
                    ${thead}
                    <tbody>${tbody}</tbody>
                  </table>
                </div>
              </div>
            </section>
          </section>
        `;
      })
      .join("");

    return `
      <section class="bc-screening fit-kit-page-module" id="fit-kit-module-root" aria-label="FIT kit tracker">
        <header class="bc-bsh-toolbar fit-kit-page-toolbar" aria-label="FIT Kit Tracker header">
          <div class="bc-bsh-toolbar__title-group">
            <h1 class="bc-bsh-toolbar__title">FIT Kit Tracker</h1>
            <p class="fit-kit__toolbar-lead">Faecal Immunochemical Test — Colorectal Cancer Screening</p>
          </div>
          <div class="bc-bsh-toolbar__actions">
            <div class="toolbar-search fit-kit-toolbar__search">
              <label class="sr-only" for="fit-search">Search patient</label>
              <span class="toolbar-search__icon" aria-hidden="true">${icons.search}</span>
              <input id="fit-search" type="search" placeholder="Search by name, ref no., NRIC, mobile no." value="${e(
                fit?.search || ""
              )}" autocomplete="off" />
            </div>
            <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" id="fit-export">Export CSV</button>
          </div>
        </header>
        <div class="prospects-kpi-shell fit-kit-kpi-shell">
          ${renderFitKitSummarySection()}
        </div>
        <div class="bc-main fit-kit-main">
          <div class="fit-kit__stagebar" role="tablist" aria-label="FIT pipeline">
            ${stageNav}
          </div>
          ${stageSections}
        </div>
      </section>
      ${renderFitKitTrackerModals()}
    `;
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
        ${renderHeaderPrimaryNav()}
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

  function isHighRiskProspect(r) {
    return String(r?.risk || "")
      .trim()
      .toLowerCase() === "high";
  }

  function isFirstTimeScreenerProspect(r) {
    const raw = r?.firstMammogramScreening;
    const s = String(raw || "")
      .trim()
      .toLowerCase();
    if (s === "yes" || s === "y" || s === "true" || s === "1") return true;
    if (s === "no" || s === "n" || s === "false" || s === "0") return false;
    return false;
  }

  function applyListKpiFilter(rows) {
    const k = state.listKpiActive;
    if (!k) return rows;
    if (k === "total") return rows;
    return rows.filter((r) => {
      if (k === "qualified" || k === "booked" || k === "screened") return normListPipelineStatus(r) === k;
      if (k === "followup") return String(r.attendance || "").trim().toLowerCase() === "no show";
      if (k === "highrisk") return isHighRiskProspect(r);
      if (k === "firsttime") return isFirstTimeScreenerProspect(r);
      return true;
    });
  }

  /** KPI row on prospect listing — counts respect program, search, and list filters. */
  function computeProspectListSummary(rows) {
    let qualified = 0;
    let booked = 0;
    let screened = 0;
    let followUp = 0;
    let highRisk = 0;
    let firstTime = 0;
    for (const r of rows) {
      const st = normListPipelineStatus(r);
      if (st === "qualified") qualified++;
      else if (st === "booked") booked++;
      else if (st === "screened") screened++;
      const a = String(r.attendance || "").trim().toLowerCase();
      if (a === "no show") followUp++;
      if (isHighRiskProspect(r)) highRisk++;
      if (isFirstTimeScreenerProspect(r)) firstTime++;
    }
    const total = rows.length;
    /** Conversion = share of cases that reached screened (prototype: same as `status === "screened"`). */
    const conversionRatePct = total === 0 ? 0 : Math.round((screened / total) * 1000) / 10;
    return { total, qualified, booked, screened, followUp, highRisk, firstTime, conversionRatePct };
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

  /**
   * KPI cards (listing + V1 overview): same markup and logic as the main prospect list strip.
   * @param {object[]} rows Enrolment rows with `status` + `attendance` (e.g. `PROSPECTS` slice).
   * @param {{ ariaLabel?: string, sectionClass?: string, gridOnly?: boolean }} [options] `gridOnly` = no outer `<section>`, only the `<article>` cards in a grid.
   */
  function renderProspectSummarySection(rows, options) {
    options = options || {};
    const gridOnly = !!options.gridOnly;
    const ariaLabel = options.ariaLabel != null ? String(options.ariaLabel) : "Prospect summary";
    const sectionExtra = options.sectionClass != null ? String(options.sectionClass).trim() : "";
    const s = computeProspectListSummary(rows);
    const esc = escapeAttr;
    const gridAttrs = gridOnly
      ? ` class="prospect-summary__grid v1-overview-kpi-grid" role="group" aria-label="${esc(ariaLabel)}"`
      : ` class="prospect-summary__grid"`;
    const active = String(state.listKpiActive || "");
    const cardAttrs = (key) => ` data-prospect-kpi="${esc(key)}" role="button" tabindex="0" aria-pressed="${active === key}"`;
    const cardClass = (base, key) => `${base}${active === key ? " is-active" : ""}`;
    const gridHtml = `
        <div${gridAttrs}>
          <article class="${cardClass("prospect-summary-card prospect-summary-card--total", "total")}"${cardAttrs("total")}>
            <h3 class="prospect-summary-card__label">Total cases</h3>
            <p class="prospect-summary-card__value">${esc(String(s.total))}</p>
          </article>
          <article class="${cardClass("prospect-summary-card prospect-summary-card--qualified", "qualified")}"${cardAttrs("qualified")}>
            <h3 class="prospect-summary-card__label">Qualified</h3>
            <p class="prospect-summary-card__value">${esc(String(s.qualified))}</p>
          </article>
          <article class="${cardClass("prospect-summary-card prospect-summary-card--booked", "booked")}"${cardAttrs("booked")}>
            <h3 class="prospect-summary-card__label">Booked</h3>
            <p class="prospect-summary-card__value">${esc(String(s.booked))}</p>
          </article>
          <article class="${cardClass("prospect-summary-card prospect-summary-card--screened", "screened")}"${cardAttrs("screened")}>
            <h3 class="prospect-summary-card__label">Screened</h3>
            <p class="prospect-summary-card__value">${esc(String(s.screened))}</p>
          </article>
          <article class="${cardClass("prospect-summary-card prospect-summary-card--followup", "followup")}"${cardAttrs("followup")}>
            <h3 class="prospect-summary-card__label">Follow-up needed</h3>
            <p class="prospect-summary-card__value">${esc(String(s.followUp))}</p>
          </article>
          <article class="${cardClass("prospect-summary-card prospect-summary-card--highrisk", "highrisk")}"${cardAttrs("highrisk")}>
            <h3 class="prospect-summary-card__label">High risk</h3>
            <p class="prospect-summary-card__value">${esc(String(s.highRisk))}</p>
          </article>
          <article class="${cardClass("prospect-summary-card prospect-summary-card--firsttime", "firsttime")}"${cardAttrs("firsttime")}>
            <h3 class="prospect-summary-card__label">First-time screener</h3>
            <p class="prospect-summary-card__value">${esc(String(s.firstTime))}</p>
          </article>
          <article class="prospect-summary-card prospect-summary-card--conversion" aria-label="Conversion rate: screened cases as a share of total cases in view">
            <h3 class="prospect-summary-card__label">Conversion rate</h3>
            <p class="prospect-summary-card__value">${esc(s.total === 0 ? "—" : `${s.conversionRatePct}%`)}</p>
          </article>
        </div>`;
    if (gridOnly) return gridHtml;
    const sectionClasses = ["prospect-summary", sectionExtra].filter(Boolean).join(" ");
    return `
      <section class="${esc(sectionClasses)}" aria-label="${esc(ariaLabel)}">${gridHtml}
      </section>`;
  }

  /** Bishan-style toolbar: title + Export / Add only (search row is below KPI strip). */
  function renderProspectListPageHeader() {
    const exportOpen = state.exportMenuOpen ? "is-open" : "";
    return `
      <header class="bc-bsh-toolbar prospects-page-toolbar" aria-label="Prospect list header">
        <div class="bc-bsh-toolbar__title-group">
          ${renderProgramTitleDropdown()}
        </div>
        <div class="bc-bsh-toolbar__actions">
          <div class="title-dropdown title-dropdown--align-end ${exportOpen}" id="export-dropdown">
            <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-export-menu-toggle aria-expanded="${state.exportMenuOpen}" aria-haspopup="true">
              Export
            </button>
            <div class="title-dropdown__panel" role="menu">
              <button type="button" class="title-dropdown__option" role="menuitem" data-export-option="csv">Export CSV</button>
              <button type="button" class="title-dropdown__option" role="menuitem" data-export-option="excel">Export Excel</button>
            </div>
          </div>
          <div class="title-dropdown title-dropdown--align-end ${state.addProspectMenuOpen ? "is-open" : ""}" id="add-prospect-dropdown">
            <button type="button" class="ui-btn ui-btn--default ui-btn--sm" data-add-prospect-toggle aria-expanded="${state.addProspectMenuOpen}" aria-haspopup="true">
              <span class="ui-btn__icon" aria-hidden="true">${icons.plus}</span>
              Add Prospect
            </button>
            <div class="title-dropdown__panel" role="menu">
              <a href="#/register/mammobus" class="title-dropdown__option" role="menuitem">Mammogram Screening Registration</a>
              <a href="#/register/hpv" class="title-dropdown__option" role="menuitem">HPV Screening Programme</a>
              <a href="#/register/fit" class="title-dropdown__option" role="menuitem">FIT Screening Programme</a>
            </div>
          </div>
        </div>
      </header>`;
  }

  /** Same visual treatment as Bishan `bc-bsh-filters` (rounded bar below KPI strip). */
  function renderProspectListFiltersBar() {
    const listPressed = state.view === "list";
    const kanbanPressed = state.view === "kanban";
    return `
      <div class="bc-bsh-filters prospects-filters-bar" role="toolbar" aria-label="Search and filters">
        <div class="toolbar-search prospects-filters-bar__search">
          <span class="toolbar-search__icon" aria-hidden="true">${icons.search}</span>
          <input type="search" id="prospect-search" placeholder="Search by name, NRIC, phone no." value="${escapeAttr(state.search)}" autocomplete="off" />
        </div>
        <div class="prospects-filters-bar__end">
          <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" id="btn-list-filters" aria-haspopup="dialog" aria-expanded="${state.filterModal}">
            <span class="ui-btn__icon" aria-hidden="true">${icons.filter}</span>
            Filters
            ${
              listFilterCategoryCount() > 0
                ? `<span class="ui-badge" aria-label="${listFilterCategoryCount()} filter categories active">${listFilterCategoryCount()}</span>`
                : ""
            }
          </button>
          <div class="view-toggle" role="group" aria-label="View mode">
            <button type="button" class="btn btn--icon" aria-pressed="${kanbanPressed}" aria-label="Kanban view" data-view="kanban">${icons.grid}</button>
            <button type="button" class="btn btn--icon" aria-pressed="${listPressed}" aria-label="List view" data-view="list">${icons.list}</button>
          </div>
        </div>
      </div>`;
  }

  function exportProspectsDatasetForSheet() {
    const rows = sortListRows(getFilteredProspects());
    const statusLabel = (s) => (s === "booked" ? "Booked" : s === "screened" ? "Screened" : "Qualified");
    const riskLabel = (r) => (r === "high" ? "High" : r === "medium" ? "Medium" : "Low");
    const data = rows.map((r) => {
      const masked = r.maskedNric != null && String(r.maskedNric).trim() ? String(r.maskedNric).trim() : "—";
      return {
        Name: r.name,
        "Prospect Ref": r.id || r.rowKey,
        "NRIC (masked)": masked,
        Program: programDisplayLabel(r.program),
        "Appointment type": prospectAppointmentTypeDisplayLabel(r),
        "Date registered": formatDateRegisteredDisplay(r.dateRegistered),
        Phone: r.phone,
        Email: r.email,
        Status: statusLabel(PIPELINE_KEYS.includes(r.status) ? r.status : "qualified"),
        Attendance: classicScreeningAttendanceDisplay({ attendance: r.attendance }),
        "Source type": r.sourceType,
        "Source detail": r.sourceDetail,
        "Next review": formatDateRegisteredDisplay(r.nextReview),
        Risk: riskLabel(r.risk),
      };
    });
    return { rows, data };
  }

  function exportProspectsXlsx() {
    const XLSX = window.XLSX;
    if (!XLSX || !XLSX.utils || !XLSX.writeFile) {
      showToast("Export unavailable — XLSX library not loaded.");
      return;
    }
    const { rows, data } = exportProspectsDatasetForSheet();
    if (!rows.length) {
      showToast("No prospects to export.");
      return;
    }
    const header = [
      "Name",
      "Prospect Ref",
      "NRIC (masked)",
      "Program",
      "Appointment type",
      "Date registered",
      "Phone",
      "Email",
      "Status",
      "Attendance",
      "Source type",
      "Source detail",
      "Next review",
      "Risk",
    ];
    const ws = XLSX.utils.json_to_sheet(data, { header, skipHeader: false });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Prospects");
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    const prog = state.program && state.program !== "all" ? state.program : "all";
    XLSX.writeFile(wb, `prospects-${prog}-${y}${m}${da}.xlsx`);
    showToast(`Exported ${rows.length} prospects.`);
  }

  function exportProspectsCsvSheetJs() {
    const XLSX = window.XLSX;
    if (!XLSX || !XLSX.utils || !XLSX.writeFile) {
      showToast("Export unavailable — XLSX library not loaded.");
      return;
    }
    const { rows, data } = exportProspectsDatasetForSheet();
    if (!rows.length) {
      showToast("No prospects to export.");
      return;
    }
    const header = [
      "Name",
      "Prospect Ref",
      "NRIC (masked)",
      "Program",
      "Appointment type",
      "Date registered",
      "Phone",
      "Email",
      "Status",
      "Attendance",
      "Source type",
      "Source detail",
      "Next review",
      "Risk",
    ];
    const ws = XLSX.utils.json_to_sheet(data, { header, skipHeader: false });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Prospects");
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    const prog = state.program && state.program !== "all" ? state.program : "all";
    XLSX.writeFile(wb, `prospects-${prog}-${y}${m}${da}.csv`, { bookType: "csv" });
    showToast(`Exported ${rows.length} prospects.`);
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
              ${renderSortableTh("Appointment type", "appointmentType")}
              ${renderSortableTh("Date registered", "dateRegistered")}
              <th scope="col">Contact</th>
              ${renderSortableTh("Status", "status")}
              ${renderSortableTh("Attendance", "attendance")}
              ${renderSortableTh("Source", "source")}
              ${renderSortableTh("Next review", "nextReview")}
              <th scope="col">Review period</th>
              ${renderSortableTh("Risk", "risk")}
              <th scope="col" class="data-table__th--actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map((r) => {
                const nr = kanbanCardNextReview(r);
                const reviewPeriod = nr?.period ? String(nr.period) : "—";
                const listScrId = pickClassicScreeningRecordIdForListProgram(r.program, r.rowKey);
                const listActionsOpen = state.prospectListActionsOpenRowKey === r.rowKey;
                const listActionsCell = listScrId
                  ? `<div class="title-dropdown title-dropdown--align-end prospect-list-actions${
                      listActionsOpen ? " is-open" : ""
                    }" data-prospect-list-actions data-table-row-stop>
                    <button type="button" class="title-dropdown__trigger prospect-list-actions__trigger" data-prospect-list-actions-toggle="${escapeAttr(
                      r.rowKey
                    )}" aria-expanded="${listActionsOpen}" aria-haspopup="true" aria-label="Actions for ${escapeAttr(r.name)}">${icons.more}</button>
                    <div class="title-dropdown__panel" role="menu">
                      <button type="button" role="menuitem" class="title-dropdown__option" data-table-row-stop data-classic-screening-tasks="${escapeAttr(
                        listScrId
                      )}">Tasks</button>
                      <button type="button" role="menuitem" class="title-dropdown__option" data-table-row-stop data-classic-screening-update="${escapeAttr(
                        listScrId
                      )}">Update</button>
                    </div>
                  </div>`
                  : `<span class="cell-muted">—</span>`;
                return `
              <tr tabindex="0" data-nav-prospect="${escapeAttr(r.rowKey)}">
                ${renderProspectNameCell(r)}
                <td>${escapeAttr(programDisplayLabel(r.program))}</td>
                <td>${escapeAttr(prospectAppointmentTypeDisplayLabel(r))}</td>
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
                <td>${escapeAttr(reviewPeriod)}</td>
                <td>${riskPill(r.risk)}</td>
                <td class="data-table__td--actions">${listActionsCell}</td>
              </tr>
            `
              })
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

  function kanbanCardResidentialStatus(p) {
    const reg = findRegExistingClientByName(p?.name);
    if (reg && reg.residential) return regResidentialToFormStatus(reg.residential);
    return "—";
  }

  function kanbanCardMetaLine(p) {
    const parts = [kanbanCardDemographics(p), kanbanCardResidentialStatus(p)]
      .map((s) => String(s || "").trim())
      .filter((s) => s && s !== "—");
    return parts.length ? parts.join(" · ") : "—";
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

  function kanbanCardNextReview(p) {
    const dash = "—";
    const typeKey = screeningTypeKeyFromListProgram(p?.program);
    const monthsBetween = (fromIso, toIso) => {
      const a = String(fromIso || "").trim();
      const b = String(toIso || "").trim();
      if (!a || !b) return null;
      const d1 = new Date(`${a}T12:00:00`);
      const d2 = new Date(`${b}T12:00:00`);
      if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) return null;
      const y = d2.getFullYear() - d1.getFullYear();
      const m = d2.getMonth() - d1.getMonth();
      const total = y * 12 + m;
      return Number.isFinite(total) ? total : null;
    };
    const periodFromMonths = (m) => {
      if (m == null) return "";
      if (m <= 7) return "6 months";
      if (m <= 18) return "1 year";
      if (m <= 48) return "3 years";
      return "5 years";
    };

    let rec = null;
    if (typeKey) {
      rec = getClassicScreeningRecordsCatalog({ rowKeys: [p?.rowKey] }).find((r) => r.type?.key === typeKey) || null;
    }

    const periodRaw =
      rec && rec.nextReviewPeriod != null && String(rec.nextReviewPeriod).trim() ? String(rec.nextReviewPeriod).trim() : "";
    const periodCompact = periodRaw.toLowerCase().replace(/\s+/g, "");
    const period =
      periodCompact === "12months" || periodCompact === "1year" || periodCompact === "1yr"
        ? "1 year"
        : periodCompact === "6months" || periodCompact === "6month"
          ? "6 months"
          : periodCompact === "3years" || periodCompact === "3year" || periodCompact === "3yrs"
            ? "3 years"
            : periodCompact === "5years" || periodCompact === "5year" || periodCompact === "5yrs"
              ? "5 years"
              : periodRaw;

    const dateRaw =
      rec && rec.nextReviewDate != null && String(rec.nextReviewDate).trim() ? String(rec.nextReviewDate).trim() : "";
    const dateFromProspect = (() => {
      const iso = String(p?.nextReview || "").trim();
      if (!iso) return "";
      return formatDateRegisteredDisplay(iso);
    })();
    const date = dateRaw || dateFromProspect || "";

    const prettyPeriodDirect = period && period !== dash ? period : "";
    const prettyPeriodDerived = periodFromMonths(monthsBetween(p?.dateRegistered, p?.nextReview));
    const prettyPeriod = prettyPeriodDirect || prettyPeriodDerived || "";

    const prettyDate = date && date !== dash ? date : "";
    if (!prettyPeriod && !prettyDate) return null;
    const label = prettyPeriod && prettyDate ? `${prettyPeriod} · ${prettyDate}` : prettyPeriod || prettyDate || dash;
    return { period: prettyPeriod, date: prettyDate, label };
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
            const nextReview = kanbanCardNextReview(r);
            const nextReviewHtml = nextReview
              ? `<div class="kanban-card__review" aria-label="Review period and next review">
                  <span class="kanban-card__review-icon" aria-hidden="true">${icons.calendar}</span>
                  <span class="kanban-card__review-text">${escapeAttr(nextReview.label)}</span>
                </div>`
              : "";
            const firstTimeTag = isFirstTimeScreenerProspect(r)
              ? `<span class="pill pill--firsttime" title="First-time screener">First-time</span>`
              : "";
            const attendanceSlug = String(attendance || "")
              .trim()
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "");
            const attendanceTag =
              attendance && attendance !== "—"
                ? `<span class="pill pill--attendance pill--attendance-${escapeAttr(attendanceSlug)}" title="Attendance">${escapeAttr(
                    attendance
                  )}</span>`
                : "";
            const riskHtml = `<div class="kanban-card__risk">${riskLevelIndicator(r.risk)}${firstTimeTag}${attendanceTag}</div>`;
            return `
        <article class="kanban-card" tabindex="0" data-kanban-card data-kanban-prospect="${escapeAttr(r.rowKey)}">
          <div class="kanban-card__program"><span class="pill">${escapeAttr(kanbanProgramPillText(r))}</span></div>
          <h2 class="kanban-card__name">${escapeAttr(r.name)}</h2>
          <p class="kanban-card__meta">${escapeAttr(kanbanCardMetaLine(r))}</p>
          ${riskHtml}
          <div class="kanban-card__tasks">
            <span>Tasks</span>
            <span>${escapeAttr(tasks)}</span>
          </div>
          <div class="kanban-card__bar"><span style="width:${pct}%"></span></div>
          ${nextReviewHtml}
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
    return `<section class="bc-screening prospects-page-module" id="prospects-module-root" aria-label="Prospect management">
      <div id="react-prospect-list-mount"></div>
    </section>`;
  }

  /** Update KPI strip + filters bar + table/kanban without rebuilding the whole app (keeps filter modal stable). */
  function refreshProspectsListingDomFromState() {
    if (state.route !== "list") return;
    renderApp();
  }

  function normalizeDetailTab() {
    const legacy = { medical: "medical-history", other: "other-details" };
    if (typeof state.detailTab === "string") state.detailTab = state.detailTab.trim();
    if (legacy[state.detailTab]) state.detailTab = legacy[state.detailTab];
    if (state.detailTab === "overview") state.detailTab = "details";
    if (state.detailTab === "medical-history" || state.detailTab === "other-details") state.detailTab = "details";
    if (!DETAIL_TAB_IDS.includes(state.detailTab)) state.detailTab = "details";
  }

  function pipelineStageLabel() {
    const s = state.pipeline || "qualified";
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function renderDetailFormStickyToolbarHtml() {
    const fn = typeof window.WD_renderDetailFormStickyToolbar === "function" ? window.WD_renderDetailFormStickyToolbar : null;
    if (!fn) return "";
    const d = state.detail;
    const tab = state.detailTab;
    const detailLastUpdatedLine = detailLastUpdatedLineForTab(tab, d);
    const ctx = {
      d: state.detail,
      state,
      icons,
      escapeAttr,
      detailFormEdit: state.detailFormEdit,
      detailNavSection: state.detailNavSection,
      formValues: state.detailFormValues,
      detailLastUpdatedLine,
    };
    return fn(state.detailTab, ctx);
  }

  function formatDetailMetaDateTime(iso) {
    try {
      const dt = new Date(iso);
      if (Number.isNaN(dt.getTime())) return "";
      return dt.toLocaleString("en-SG", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (_) {
      return "";
    }
  }

  function detailLastUpdatedLineForTab(tab, d) {
    if (tab === "notes") {
      const notes = detailNotesForRender(d.rowKey);
      if (Array.isArray(notes) && notes.length > 0) {
        const when = formatDetailMetaDateTime(notes[0].submittedAt) || "—";
        return `Last updated on ${when} by ${notes[0].authorName || "—"}`;
      }
      return "No notes yet.";
    }

    const when = formatDetailMetaDateTime(d.lastUpdated || d.updatedAt) || (d.lastUpdated || d.updatedAt || "");
    const by = d.lastUpdatedBy || d.updatedBy || "";
    if (when && by) return `Last updated on ${when} by ${by}`;
    if (when) return `Last updated on ${when}`;
    if (by) return `Last updated by ${by}`;
    return "Last updated —";
  }

  function renderDetailNotesStickyToolbarHtml() {
    if (state.detailTab !== "notes") return "";
    const d = state.detail;
    const metaLine = detailLastUpdatedLineForTab("notes", d);
    return `<div class="detail-form-sticky-toolbar" role="region" aria-label="Notes toolbar">
      <span class="detail-form-sticky-toolbar__meta">
        <span class="detail-notes-updated__icon" aria-hidden="true">${icons.refresh}</span>
        <span>${escapeAttr(metaLine)}</span>
      </span>
      <div class="detail-form-sticky-toolbar__actions">
        <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-detail-add-note-open>${icons.plus} Add Notes</button>
      </div>
    </div>`;
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
    const details = state.detailFormValues?.details || {};
    const programTagsHtml = detailProgramTagsHtml(d.programTags);
    const tabs = [
      ["details", "Personal Details"],
      ["screening", "Screening"],
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
      <section class="detail-hero-bar" aria-label="Prospect header">
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
          </div>
          ${renderProspectV1KeyInfoStripHtml(d, details, { extraClass: "detail-hero__key-strip" })}
        </div>
      </section>
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
        ${renderDetailNotesStickyToolbarHtml()}
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
    const hintId = "v3bio-inline-pref-lang-hint";
    return `<span class="bio-v bio-v--control bio-v--control--pref-lang">${buildPreferredLanguagesMultiHtml({
      escapeFn: e,
      idPrefix: "v3bio-inline-pref",
      selected,
      formFieldName: null,
      hintId,
      v3MultiAttr: true,
    })}</span>`;
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

  /** Multi-select for modal (same canonical options as registration / detail panels). */
  function v3BiodataLangSelectModal(e, details) {
    const selected = new Set(
      v3BiodataPreferredLangString(details)
        .split(/[,;]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    );
    const hintId = "v3bio-mod-pref-lang-hint";
    return buildPreferredLanguagesMultiHtml({
      escapeFn: e,
      idPrefix: "v3bio-pref-lang",
      selected,
      formFieldName: null,
      triggerId: "v3bio-pref-lang",
      hintId,
      v3MultiAttr: true,
    });
  }

  /** Same masking as `detail-panels.js` `maskNricForProfileDisplay` (classic prospect profile). */
  function v3MaskNricForProfileDisplay(raw) {
    const s = String(raw || "").trim();
    if (!s) return "—";
    if (s.length <= 5) return `${s.charAt(0)}****`;
    return `${s.charAt(0)}****${s.slice(-4)}`;
  }

  /**
   * v1 key-info strip: merge Personal Details form state with `PROSPECTS` row + `REG_EXISTING_CLIENTS` (name match).
   */
  function prospectKeyInfoStripFields(d, details) {
    const det = details && typeof details === "object" ? details : {};
    const pickStr = (v) => (v != null && String(v).trim() !== "" ? String(v).trim() : "");
    const listRow =
      PROSPECTS.find((x) => x.rowKey === d.rowKey) || PROSPECTS.find((x) => x.id === d.id) || null;
    const reg = findRegExistingClientByName(d.name || listRow?.name);
    const nricRaw = pickStr(det.nric) || pickStr(reg?.nric);
    let nricDisplay = "—";
    if (nricRaw) nricDisplay = v3MaskNricForProfileDisplay(nricRaw);
    else {
      const masked = pickStr(listRow?.maskedNric);
      if (masked) nricDisplay = masked;
    }
    const contact =
      pickStr(det.contact) || pickStr(det.mobile) || pickStr(listRow?.phone) || pickStr(reg?.phone) || "—";
    const chas = pickStr(det.chasCardType) || "—";
    const healthierSgLabel = v3BiodataHealthierSgLabel(det.healthierSg);
    return {
      nricDisplay,
      contact,
      chas,
      healthierSgLabel,
      risk: d.risk,
    };
  }

  function renderProspectV1KeyInfoStripHtml(d, details, opts) {
    opts = opts || {};
    const f = prospectKeyInfoStripFields(d, details);
    const extraClass = opts.extraClass ? String(opts.extraClass).trim() : "";
    return `<div class="v1-strip${extraClass ? ` ${escapeAttr(extraClass)}` : ""}" role="list" aria-label="Key info">
          <div class="v1-strip__item" role="listitem">
            <div class="v1-strip__label">NRIC</div>
            <div class="v1-strip__value">${escapeAttr(f.nricDisplay)}</div>
          </div>
          <div class="v1-strip__item" role="listitem">
            <div class="v1-strip__label">Contact</div>
            <div class="v1-strip__value">${escapeAttr(f.contact)}</div>
          </div>
          <div class="v1-strip__item" role="listitem">
            <div class="v1-strip__label">CHAS Card</div>
            <div class="v1-strip__value">${escapeAttr(f.chas)}</div>
          </div>
          <div class="v1-strip__item" role="listitem">
            <div class="v1-strip__label">HealthierSG</div>
            <div class="v1-strip__value">${escapeAttr(f.healthierSgLabel)}</div>
          </div>
          <div class="v1-strip__item" role="listitem">
            <div class="v1-strip__label">Risk level</div>
            <div class="v1-strip__value v1-strip__value--stack">${riskLevelIndicator(f.risk)}</div>
          </div>
        </div>`;
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
          <label for="v3bio-pref-lang">Preferred language</label>
          ${v3BiodataLangSelectModal(e, details)}
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
          <label for="v3bio-source-type">How did you hear about this programme?</label>
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
    root.querySelectorAll("[data-v3-biodata-multi]").forEach((host) => {
      const k = host.getAttribute("data-v3-biodata-multi");
      if (!k) return;
      const parts = [];
      const multi =
        host instanceof HTMLSelectElement && host.multiple
          ? host
          : host.querySelector && host.querySelector("select[multiple]");
      if (multi instanceof HTMLSelectElement) {
        Array.from(multi.selectedOptions).forEach((o) => {
          const v = String(o.value || "").trim();
          if (v) parts.push(v);
        });
      } else {
        host.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
          if (cb.checked) parts.push(cb.value);
        });
      }
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
    const recordTypeKey = record.type?.key;
    const isMmg = recordTypeKey === "MMG";
    const st = record.status?.key && CLASSIC_SCREENING_STATUS_BY_KEY[record.status.key] ? record.status.key : "qualified";
    const appt = record.appointment;
    const apptDate = normalizeClassicApptDateForPicker(appt && appt.date != null ? String(appt.date) : "");
    const apptTime = appt && appt.time != null ? String(appt.time) : "";
    const venueVal = record.venue != null ? String(record.venue) : "";
    const attVal = record.attendance != null ? String(record.attendance).trim() : "";
    const atVal = String(record.appointmentType || "").trim().toLowerCase();
    const resultValRaw = record.result != null ? String(record.result).trim() : "";
    const resultVal = resultValRaw.toLowerCase() === "normal" ? "Normal" : resultValRaw.toLowerCase() === "abnormal" ? "Abnormal" : "";
    const nrpValRaw = record.nextReviewPeriod != null ? String(record.nextReviewPeriod).trim() : "";
    const nrpCompact = nrpValRaw.toLowerCase().replace(/\s+/g, "");
    const nrpVal =
      nrpCompact === "6months" || nrpCompact === "6month"
        ? "6 months"
        : nrpCompact === "12months" || nrpCompact === "1year" || nrpCompact === "1yr"
          ? "1 year"
          : nrpCompact === "3years" || nrpCompact === "3year" || nrpCompact === "3yrs"
            ? "3 years"
            : nrpCompact === "5years" || nrpCompact === "5year" || nrpCompact === "5yrs"
              ? "5 years"
              : "";
    const nrdValRaw = record.nextReviewDate != null ? String(record.nextReviewDate).trim() : "";
    const nrdVal = nrdValRaw && nrdValRaw !== "—" ? nrdValRaw : "";
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
            <div class="field__date">
              <input class="field__date-text" id="csu-appt-date" type="text" value="${e(apptDate)}" placeholder="DD-MM-YYYY" inputmode="numeric" autocomplete="off" maxlength="10" />
              <button type="button" class="field__date-btn" aria-label="Choose date" title="Choose date"></button>
              <input type="date" class="field__date-native" tabindex="-1" aria-hidden="true" />
            </div>
          </div>
          <div class="field">
            <label for="csu-appt-time">Appointment time</label>
            <div class="field__time">
              <input class="field__time-text" id="csu-appt-time" type="text" value="${e(apptTime)}" placeholder="HH:MM" autocomplete="off" />
              <button type="button" class="field__time-btn" aria-label="Choose time" title="Choose time"></button>
              <input type="time" class="field__time-native" tabindex="-1" aria-hidden="true" />
            </div>
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
            <select id="csu-result">
              <option value=""${resultVal ? "" : " selected"}>—</option>
              <option value="Normal"${resultVal === "Normal" ? " selected" : ""}>Normal</option>
              <option value="Abnormal"${resultVal === "Abnormal" ? " selected" : ""}>Abnormal</option>
            </select>
          </div>
          <div class="field">
            <label for="csu-next-review-period">Review period</label>
            <select id="csu-next-review-period">
              <option value=""${nrpVal ? "" : " selected"}>-- Select --</option>
              <option value="6 months"${nrpVal === "6 months" ? " selected" : ""}>6 months</option>
              <option value="1 year"${nrpVal === "1 year" ? " selected" : ""}>1 year</option>
              <option value="3 years"${nrpVal === "3 years" ? " selected" : ""}>3 years</option>
              <option value="5 years"${nrpVal === "5 years" ? " selected" : ""}>5 years</option>
            </select>
          </div>
          <div class="field">
            <label for="csu-next-review-date">Next review date</label>
            <div class="field__date" data-next-review-date-wrap>
              <input class="field__date-text" id="csu-next-review-date" type="text" value="${e(nrdVal)}" placeholder="DD-MM-YYYY" inputmode="numeric" autocomplete="off" maxlength="10" data-auto-next-review="1" />
              <button type="button" class="field__date-btn" aria-label="Choose date" title="Choose date"></button>
              <input type="date" class="field__date-native" tabindex="-1" aria-hidden="true" />
            </div>
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

    const classicScreeningRecords = getClassicScreeningRecordsCatalog({
      rowKeys: state.detail ? prospectEnrolmentRowsForDetail(state.detail).map((r) => r.rowKey).filter(Boolean) : null,
    });
    const notesForV1Tab = detailNotesForRender(d.rowKey);
    const documentsForV1Tab = detailDocumentsForRender(d.rowKey);

    const listRow =
      PROSPECTS.find((x) => x.rowKey === d.rowKey) || PROSPECTS.find((x) => x.id === d.id) || null;
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

        ${renderProspectV1KeyInfoStripHtml(d, details)}

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
      const maskedNric = prospectKeyInfoStripFields(d, details).nricDisplay;
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
              <div class="bio-row"><span class="bio-l">How did you hear about this programme?</span>${txtRo(details.sourceType)}</div>
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
            <div class="client360-left__kv-row"><span>Prior Screening</span><strong>${escapeAttr(
              (typeof window.WD_composeScreeningEligibleForDisplay === "function"
                ? window.WD_composeScreeningEligibleForDisplay(details)
                : details.screeningEligible) || "—"
            )}</strong></div>
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
    if (files.length) {
      const body = files.map((f) => `${f.name} (${activityFileSizeLabel(f.size)})`).join(files.length > 1 ? " · " : "");
      pushProspectActivityTimeline(rowKey, {
        title: files.length > 1 ? "Documents uploaded" : "Document uploaded",
        body,
        by: PORTAL_CURRENT_USER.name,
        stage: state.pipeline,
      });
    }
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
    const preview = text.length > 140 ? `${text.slice(0, 137)}…` : text;
    pushProspectActivityTimeline(rowKey, {
      title: "Note added",
      body: preview,
      by: PORTAL_CURRENT_USER.name,
      stage: state.pipeline,
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
      const preview = text.length > 140 ? `${text.slice(0, 137)}…` : text;
      pushProspectActivityTimeline(rowKey, {
        title: "Note updated",
        body: preview,
        by: PORTAL_CURRENT_USER.name,
        stage: state.pipeline,
      });
      return true;
    }
    if (DETAIL_NOTES_SEED.some((s) => s.id === id)) {
      if (!state.detailNoteEdits[rowKey]) state.detailNoteEdits[rowKey] = Object.create(null);
      state.detailNoteEdits[rowKey][id] = { body: text, submittedAt: iso };
      const preview = text.length > 140 ? `${text.slice(0, 137)}…` : text;
      pushProspectActivityTimeline(rowKey, {
        title: "Note updated",
        body: preview,
        by: PORTAL_CURRENT_USER.name,
        stage: state.pipeline,
      });
      return true;
    }
    return false;
  }

  function deleteDetailNote(rowKey, id) {
    const list = ensureDetailNotesList(rowKey);
    const idx = list.findIndex((n) => n.id === id);
    if (idx >= 0) {
      list.splice(idx, 1);
      pushProspectActivityTimeline(rowKey, {
        title: "Note deleted",
        body: "A note was removed from this prospect.",
        by: PORTAL_CURRENT_USER.name,
        stage: state.pipeline,
      });
    } else if (DETAIL_NOTES_SEED.some((s) => s.id === id)) {
      if (!state.detailNoteDeletedIds[rowKey]) state.detailNoteDeletedIds[rowKey] = [];
      if (state.detailNoteDeletedIds[rowKey].indexOf(id) === -1) state.detailNoteDeletedIds[rowKey].push(id);
      pushProspectActivityTimeline(rowKey, {
        title: "Note deleted",
        body: "A seeded note was removed from this prospect.",
        by: PORTAL_CURRENT_USER.name,
        stage: state.pipeline,
      });
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

  /** Persist one Activity timeline row on the prospect enrolment (`PROSPECTS[].activityTimeline`) and sync `state.detail.timeline` when open. */
  function pushProspectActivityTimeline(rowKey, opts) {
    const p = opts != null && typeof opts === "object" ? opts : {};
    const title = p.title;
    const body = p.body;
    const by = p.by;
    const stage = p.stage;
    const rk = rowKey != null ? String(rowKey).trim() : "";
    if (!rk || title == null || String(title).trim() === "") return;
    const prow = PROSPECTS.find((x) => x.rowKey === rk);
    if (!prow) return;
    if (!Array.isArray(prow.activityTimeline)) prow.activityTimeline = [];
    const byName = by != null ? String(by) : PORTAL_CURRENT_USER.name;
    const st =
      stage != null && typeof stage === "string" && PIPELINE_KEYS.includes(stage)
        ? stage
        : state.pipeline && PIPELINE_KEYS.includes(state.pipeline)
          ? state.pipeline
          : "qualified";
    prow.activityTimeline.unshift({
      stage: st,
      dateTime: formatActivityDisplayTime(new Date()),
      title: String(title).trim(),
      body: body != null ? String(body) : "",
      by: byName,
    });
    if (state.detail?.rowKey === rk) {
      try {
        state.detail.timeline =
          typeof structuredClone === "function"
            ? structuredClone(prow.activityTimeline)
            : prow.activityTimeline.map((ev) => (ev && typeof ev === "object" ? { ...ev } : {}));
      } catch (_) {
        state.detail.timeline = prow.activityTimeline.map((ev) => (ev && typeof ev === "object" ? { ...ev } : {}));
      }
    }
  }

  function appendDetailActivity(rowKey, payload) {
    if (payload == null || typeof payload !== "object") return;
    pushProspectActivityTimeline(rowKey, payload);
  }

  /**
   * Full activity feed: registration plus `d.timeline` (profile, screening, documents, notes, tasks, etc.). Newest first.
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
      if (!ev || typeof ev !== "object") return;
      let sortKey = parseDisplayDateTimeToMs(ev.dateTime);
      if (!sortKey) sortKey = legacyFallback + idx * 60000;
      items.push({
        sortKey,
        id: `feed-tl-${rowKey}-${idx}`,
        dateDisplay: String(ev.dateTime != null ? ev.dateTime : ev.time || "—"),
        title: ev.title != null ? ev.title : "",
        body: ev.body != null ? ev.body : "",
        by: ev.by != null ? ev.by : "—",
        stage: ev.stage != null ? ev.stage : null,
      });
    });

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
    ["reg-hpv-appointment-type", "Appointment Type"],
    ["reg-hpv-healthier-sg", "Healthier SG Programme"],
    ["reg-hpv-appointment", "Appointment Preferences"],
    ["reg-hpv-engagement", "Engagement"],
    ["reg-hpv-consent", "Consent"],
  ];

  const REG_NAV_ITEMS_FIT = [
    ["reg-fit-eligibility", "Screening Eligibility"],
    ["reg-fit-personal", "Personal Information"],
    ["reg-fit-address", "Residential Address"],
    ["reg-fit-subsidies", "Healthier SG & Subsidies"],
    ["reg-fit-appointment-type", "Appointment Type"],
    ["reg-fit-healthier-sg", "Healthier SG Programme"],
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

  function renderStandardConsentClauseHtml() {
    return (
      "I consent to Singapore Cancer Society (SCS) collecting, using, and storing my personal data for the purposes of delivering cancer screening services, and to support my cancer screening journey at other healthcare institutions. I understand that SCS may use my contact information to follow up with me regarding my screening results and any related health matters." +
      "<br /><br />" +
      "Where applicable, I consent to SCS sharing my personal data with relevant healthcare institutions and/or appointed partners (including NHG Diagnostics, for Mammobus screening) for the purposes of care coordination and the facilitation of follow-up appointments related to my cancer screening." +
      "<br /><br />" +
      "I confirm that my personal data as provided in this form is accurate and complete. I understand and accept the terms and conditions under the SCS Personal Data Protection Policy. I may withdraw my consent at any time by contacting SCS."
    );
  }

  function renderStandardConsentRowHtml(opts) {
    const id = String(opts?.id || "consent");
    const name = String(opts?.name || id);
    const required = opts?.required !== false;
    return `
      <div class="registration__consent">
        <label class="registration__consent-row">
          <input type="checkbox" name="${escapeAttr(name)}" id="${escapeAttr(id)}"${required ? " required" : ""} />
          <span>${renderStandardConsentClauseHtml()}${required ? '<span class="field__req" aria-hidden="true">*</span>' : ""}</span>
        </label>
      </div>
    `;
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

  function registrationSelectOptions(list, placeholderLabel) {
    const items = Array.isArray(list) ? list : [];
    const ph = placeholderLabel != null ? String(placeholderLabel) : "Select";
    return [`<option value="">${escapeAttr(ph)}</option>`]
      .concat(items.map((v) => `<option value="${escapeAttr(v)}">${escapeAttr(v)}</option>`))
      .join("");
  }

  function registrationPrefLangOrderedValues(wrap) {
    const out = [];
    if (!wrap) return out;
    wrap.querySelectorAll("[data-registration-preflang-opt]").forEach((row) => {
      const cb = row.querySelector('input[type="checkbox"]');
      if (cb instanceof HTMLInputElement && cb.checked) out.push(cb.value);
    });
    return out;
  }

  function registrationPrefLangSync(wrap) {
    if (!wrap) return;
    const store = wrap.querySelector("[data-registration-preflang-store]");
    const display = wrap.querySelector("[data-registration-preflang-display]");
    const vals = registrationPrefLangOrderedValues(wrap);
    const str = vals.join(", ");
    if (store instanceof HTMLInputElement) store.value = str;
    if (display) {
      const ph = display.getAttribute("data-placeholder") || "Select languages";
      display.textContent = str || ph;
      display.classList.toggle("registration__preflang-display--placeholder", !str);
    }
  }

  function registrationPrefLangApplyCsv(wrap, csv) {
    if (!wrap) return;
    const set = new Set(
      String(csv || "")
        .split(/[,;]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    );
    wrap.querySelectorAll('[data-registration-preflang-opt] input[type="checkbox"]').forEach((inp) => {
      if (inp instanceof HTMLInputElement) inp.checked = set.has(inp.value);
    });
    registrationPrefLangSync(wrap);
  }

  function registrationPrefLangCloseAll() {
    document.querySelectorAll("[data-registration-preflang].is-open").forEach((w) => {
      w.classList.remove("is-open");
      const panel = w.querySelector("[data-registration-preflang-panel]");
      const trig = w.querySelector("[data-registration-preflang-trigger]");
      if (panel instanceof HTMLElement) panel.hidden = true;
      if (trig instanceof HTMLElement) trig.setAttribute("aria-expanded", "false");
    });
  }

  function initRegistrationPrefLangWidgets(root) {
    if (!root) return;
    root.querySelectorAll("[data-registration-preflang]").forEach((wrap) => {
      const store = wrap.querySelector("[data-registration-preflang-store]");
      if (store instanceof HTMLInputElement && String(store.value || "").trim() !== "") {
        registrationPrefLangApplyCsv(wrap, store.value);
      } else {
        registrationPrefLangSync(wrap);
      }
    });
  }

  /**
   * Comma-separated multi-select for preferred languages (registration + V3 biodata).
   * @param {object} cfg
   * @param {function(string): string} cfg.escapeFn
   * @param {string} cfg.idPrefix
   * @param {Set<string>|string} cfg.selected
   * @param {string|null|undefined} cfg.formFieldName — if set, hidden input is included for form submit
   * @param {string|null|undefined} cfg.triggerId
   * @param {string|null|undefined} cfg.hintId
   * @param {string|undefined} cfg.hintText
   * @param {boolean|undefined} cfg.v3MultiAttr
   * @param {string|undefined} cfg.detailMultiSelectKey — `data-detail-multi-select` (classic prospect edit save)
   * @param {string[]|undefined} cfg.optionList — override option labels (defaults to V3 preferredLanguages)
   * @param {string|undefined} cfg.rootClass
   */
  function buildPreferredLanguagesMultiHtml(cfg) {
    const eFn = cfg.escapeFn || escapeAttr;
    const idPrefix = cfg.idPrefix;
    const hintId = cfg.hintId;
    const hintAttr = hintId ? ` aria-describedby="${eFn(hintId)}"` : "";
    const listboxId = `${idPrefix}-listbox`;
    const trigIdAttr = cfg.triggerId ? ` id="${eFn(cfg.triggerId)}"` : "";

    let selected = cfg.selected;
    if (!(selected instanceof Set)) {
      selected = new Set(
        String(selected || "")
          .split(/[,;]+/)
          .map((s) => s.trim())
          .filter(Boolean)
      );
    }

    const langOpts = (
      Array.isArray(cfg.optionList) && cfg.optionList.length
        ? cfg.optionList
        : V3_BIODATA_OPTIONS && Array.isArray(V3_BIODATA_OPTIONS.preferredLanguages)
          ? V3_BIODATA_OPTIONS.preferredLanguages
          : []
    )
      .map((x) => String(x || "").trim())
      .filter(Boolean);

    const hidden =
      cfg.formFieldName != null && String(cfg.formFieldName).trim() !== ""
        ? `<input type="hidden" name="${eFn(cfg.formFieldName)}" value="" data-registration-preflang-store autocomplete="off" />`
        : "";

    const rows = langOpts
      .map((lbl, idx) => {
        const oid = `${idPrefix}-opt-${idx}`;
        const checked = selected.has(lbl) ? " checked" : "";
        return `<label class="registration__preflang-row" data-registration-preflang-opt><input type="checkbox" id="${eFn(oid)}" value="${eFn(
          lbl
        )}"${checked} /><span class="registration__preflang-row-text">${eFn(lbl)}</span></label>`;
      })
      .join("");

    const rootClass = ["registration__preflang", cfg.rootClass].filter(Boolean).join(" ");
    let rootExtras = "";
    if (cfg.v3MultiAttr) rootExtras = ' data-v3-biodata-multi="preferredLanguages"';
    else if (cfg.detailMultiSelectKey != null && String(cfg.detailMultiSelectKey).trim() !== "")
      rootExtras = ` data-detail-multi-select="${eFn(String(cfg.detailMultiSelectKey).trim())}"`;
    const hintHtml = hintId
      ? `<p class="field__hint" id="${eFn(hintId)}">${eFn(cfg.hintText != null ? cfg.hintText : "Select one or more languages.")}</p>`
      : "";

    return (
      `<div class="${eFn(rootClass)}" data-registration-preflang${rootExtras}>` +
      hidden +
      `<button type="button" class="registration__preflang-trigger" data-registration-preflang-trigger${trigIdAttr}${hintAttr} aria-haspopup="listbox" aria-expanded="false" aria-controls="${eFn(
        listboxId
      )}"><span class="registration__preflang-display registration__preflang-display--placeholder" data-registration-preflang-display data-placeholder="Select languages"></span><span class="registration__preflang-chevron" aria-hidden="true"></span></button>` +
      `<div class="registration__preflang-panel" id="${eFn(listboxId)}" data-registration-preflang-panel hidden role="group" aria-label="Preferred languages">${rows}</div></div>` +
      hintHtml
    );
  }

  let registrationPrefLangDocBound = false;

  function ensureRegistrationPrefLangGlobalUi() {
    if (registrationPrefLangDocBound) return;
    registrationPrefLangDocBound = true;
    document.addEventListener("click", (ev) => {
      const t = ev.target;
      if (!(t instanceof Element)) return;
      const trig = t.closest("[data-registration-preflang-trigger]");
      const wrapFromTrig = trig?.closest?.("[data-registration-preflang]") ?? null;
      if (trig && wrapFromTrig) {
        ev.preventDefault();
        const willOpen = !wrapFromTrig.classList.contains("is-open");
        registrationPrefLangCloseAll();
        if (willOpen) {
          wrapFromTrig.classList.add("is-open");
          const panel = wrapFromTrig.querySelector("[data-registration-preflang-panel]");
          if (panel instanceof HTMLElement) panel.hidden = false;
          trig.setAttribute("aria-expanded", "true");
        }
        return;
      }
      if (t.closest("[data-registration-preflang-panel]")) return;
      registrationPrefLangCloseAll();
    });
    document.addEventListener("change", (ev) => {
      const el = ev.target;
      if (!(el instanceof HTMLInputElement) || el.type !== "checkbox") return;
      const wrap = el.closest("[data-registration-preflang]");
      if (!wrap) return;
      registrationPrefLangSync(wrap);
    });
    document.addEventListener("keydown", (ev) => {
      if (ev.key !== "Escape") return;
      registrationPrefLangCloseAll();
    });
  }

  function registrationPreferredLanguagesField(idPrefix, name) {
    const hintId = `${idPrefix}-hint`;
    const triggerId = `${idPrefix}-trigger`;
    return `
      <div class="field">
        <label for="${escapeAttr(triggerId)}">Preferred Language</label>
        ${buildPreferredLanguagesMultiHtml({
          escapeFn: escapeAttr,
          idPrefix,
          selected: new Set(),
          formFieldName: name,
          triggerId,
          hintId,
          v3MultiAttr: false,
        })}
      </div>
    `;
  }

  /** When true, MyInfo/Singpass demo NRIC is embedded in the hidden store at first paint (self-service or staff after Singpass). */
  function registrationSingpassNricSeed() {
    return state.registerSingpassLocked ? SINGPASS_DEMO.nricFull : "";
  }

  /** NRIC: hidden store + optional bullet mask; `js/nric-toggle.js` defaults to visible value */
  function registrationNricField(id, name, required, initialStoreValue) {
    const reqStore = required ? " required" : "";
    const reqEdit = required ? " required" : "";
    const seedRaw = initialStoreValue != null && String(initialStoreValue).trim() !== "" ? String(initialStoreValue) : "";
    const seedAttr = seedRaw ? escapeAttr(seedRaw) : "";
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
      '" class="field__nric-store" autocomplete="off" value="' +
      seedAttr +
      '"' +
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
                  <div class="registration__client-search-wrap">
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
                          aria-controls="reg-client-dropdown-list"
                          aria-expanded="false"
                        />
                      </div>
                      <button type="button" class="btn registration__client-search-reset" data-reg-client-search-reset>Reset</button>
                    </div>
                    <div class="registration__client-dropdown" data-reg-client-dropdown hidden>
                      <ul id="reg-client-dropdown-list" class="registration__client-dropdown-list" role="listbox" aria-label="Matching existing clients" data-reg-client-dropdown-list></ul>
                    </div>
                  </div>
                  <p id="reg-client-search-hint" class="registration__client-search-status" data-reg-client-search-status role="status" aria-live="polite"></p>
                </div>`;
  }

  function normalizeRegistrationNricQuery(s) {
    return String(s || "")
      .replace(/\s/g, "")
      .toUpperCase();
  }

  /** All demo clients matching NRIC or name (for registration search dropdown). */
  function filterExistingClientsByRegistrationQuery(raw) {
    const q = String(raw || "").trim();
    if (!q) return [];
    const nq = normalizeRegistrationNricQuery(q);
    const lq = q.toLowerCase();
    const out = [];
    const seen = new Set();
    const add = (c) => {
      const k = `${c.nric}\u0000${c.name}`;
      if (seen.has(k)) return;
      seen.add(k);
      out.push(c);
    };

    if (nq.length >= 2) {
      REG_EXISTING_CLIENTS.forEach((c) => {
        const cn = normalizeRegistrationNricQuery(c.nric);
        if (cn.includes(nq) || nq.includes(cn)) add(c);
      });
    }
    if (out.length === 0 && lq) {
      REG_EXISTING_CLIENTS.forEach((c) => {
        if (c.name.toLowerCase().includes(lq)) add(c);
      });
    }
    return out;
  }

  function registrationPersonalSectionSelector(program) {
    if (program === "hpv") return "#reg-hpv-personal";
    if (program === "fit") return "#reg-fit-personal";
    return "#reg-personal";
  }

  function registrationExistingClientFieldIds(program) {
    if (program === "hpv") {
      return {
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
      };
    }
    if (program === "fit") {
      return {
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
      };
    }
    return {
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
  }

  function setRegistrationPersonalSectionLocked(form, program, locked) {
    if (!form) return;
    const section = form.querySelector(registrationPersonalSectionSelector(program));
    if (!section) return;
    const grid = section.querySelector(".form-grid");
    if (!grid) return;
    section.classList.toggle("registration__personal--client-locked", locked);
    grid.querySelectorAll("input, select, textarea, button").forEach((el) => {
      if (el.classList.contains("field__prefix")) return;
      if (el.classList.contains("field__nric-store")) return;
      if (el instanceof HTMLInputElement && el.name === "clientLookup") return;
      if (el.classList.contains("field__nric-edit")) {
        el.disabled = locked;
        el.readOnly = locked;
        return;
      }
      el.disabled = locked;
    });
    const dobPhDefault = "DD-MM-YYYY";
    grid.querySelectorAll(".field__date-text").forEach((text) => {
      if (!(text instanceof HTMLInputElement)) return;
      if (locked) {
        if (String(text.value || "").trim()) {
          if (!text.hasAttribute("data-reg-dob-ph-stash")) {
            text.setAttribute("data-reg-dob-ph-stash", text.getAttribute("placeholder") || dobPhDefault);
          }
          text.removeAttribute("placeholder");
          text.placeholder = "";
        }
      } else if (text.hasAttribute("data-reg-dob-ph-stash")) {
        text.setAttribute("placeholder", text.getAttribute("data-reg-dob-ph-stash") || dobPhDefault);
        text.removeAttribute("data-reg-dob-ph-stash");
      }
    });
    /* Native type="date" can still paint a locale hint over the text field; use hidden while locked (text input holds submit value). */
    grid.querySelectorAll(".field__date").forEach((wrap) => {
      const nat = wrap.querySelector(".field__date-native");
      if (!(nat instanceof HTMLInputElement)) return;
      if (locked) {
        if (!nat.hasAttribute("data-reg-native-type")) {
          nat.setAttribute("data-reg-native-type", nat.type || "date");
        }
        nat.type = "hidden";
        nat.value = "";
      } else {
        const prev = nat.getAttribute("data-reg-native-type");
        nat.type = prev && prev !== "hidden" ? prev : "date";
        nat.removeAttribute("data-reg-native-type");
      }
    });
    if (typeof window.WD_syncNricMasks === "function") window.WD_syncNricMasks(form);
    if (typeof window.WD_syncDatePickersFromFields === "function") window.WD_syncDatePickersFromFields(form);
  }

  function clearRegistrationLookupAutofill(form, program) {
    if (!form) return;
    const ids = registrationExistingClientFieldIds(program);
    const setVal = (fieldId, val) => {
      const el = form.querySelector(`#${CSS.escape(fieldId)}`);
      if (el && "value" in el) el.value = val != null ? String(val) : "";
    };
    setVal(ids.fullName, "");
    setVal(ids.residential, "");
    setRegistrationNricValue(form, ids.nricStore, "");
    setVal(ids.dob, "");
    setVal(ids.gender, "");
    setVal(ids.race, "");
    setVal(ids.phone, "");
    setVal(ids.email, "");
    setVal(ids.block, "");
    setVal(ids.street, "");
    setVal(ids.floor, "");
    setVal(ids.unit, "");
    setVal(ids.postal, "");
    setVal(ids.country, "");
    if (typeof window.WD_syncNricMasks === "function") window.WD_syncNricMasks(form);
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
    const ids = registrationExistingClientFieldIds(program);

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
    if (form.getAttribute("data-reg-client-bound") === "1") return;
    form.setAttribute("data-reg-client-bound", "1");

    const searchInput = form.querySelector("[data-reg-client-search]");
    const resetBtn = form.querySelector("[data-reg-client-search-reset]");
    const statusEl = form.querySelector("[data-reg-client-search-status]");
    const dropdown = form.querySelector("[data-reg-client-dropdown]");
    const listEl = form.querySelector("[data-reg-client-dropdown-list]");
    const wrap = form.querySelector(".registration__client-search-wrap");
    if (!(searchInput instanceof HTMLInputElement) || !(listEl instanceof HTMLElement)) return;

    let lastMatchList = [];
    let docDownHandler = null;

    const setStatus = (msg, isError) => {
      if (!(statusEl instanceof HTMLElement)) return;
      statusEl.textContent = msg || "";
      statusEl.classList.toggle("registration__client-search-status--error", Boolean(isError));
    };

    const setDropdownOpen = (open) => {
      if (!(dropdown instanceof HTMLElement)) return;
      dropdown.hidden = !open;
      searchInput.setAttribute("aria-expanded", open ? "true" : "false");
    };

    const closeDropdown = () => {
      lastMatchList = [];
      listEl.innerHTML = "";
      setDropdownOpen(false);
      if (docDownHandler) {
        document.removeEventListener("mousedown", docDownHandler, true);
        docDownHandler = null;
      }
    };

    const openDropdown = (matches) => {
      lastMatchList = matches;
      listEl.innerHTML = matches
        .map((c, i) => {
          const mask = v3MaskNricForProfileDisplay(c.nric);
          return `<li class="registration__client-dropdown-item" role="option" tabindex="-1" data-reg-client-pick="${i}"><span class="registration__client-dropdown-name">${escapeAttr(
            c.name
          )}</span><span class="registration__client-dropdown-sep"> - </span><span class="registration__client-dropdown-nric">${escapeAttr(mask)}</span></li>`;
        })
        .join("");
      setDropdownOpen(true);
      if (!docDownHandler) {
        docDownHandler = (e) => {
          const t = e.target;
          if (!(t instanceof Element)) return;
          if (wrap && wrap.contains(t)) return;
          closeDropdown();
        };
        document.addEventListener("mousedown", docDownHandler, true);
      }
    };

    const selectClient = (client) => {
      if (!client) return;
      setRegistrationPersonalSectionLocked(form, state.registerProgram, false);
      applyRegistrationExistingClientAutofill(form, state.registerProgram, client);
      setRegistrationPersonalSectionLocked(form, state.registerProgram, true);
      closeDropdown();
      setStatus("Existing client selected — personal details and residential address were filled in. Fields are locked; use Reset to search again.", false);
      showToast("Existing client selected");
    };

    const runSearchEnter = () => {
      const q = searchInput.value.trim();
      if (!q) {
        setStatus("Enter an NRIC or client name, then press Enter to search.", false);
        closeDropdown();
        return;
      }
      const matches = filterExistingClientsByRegistrationQuery(q);
      if (!matches.length) {
        setStatus("No matching client found. You can continue as a new registration.", true);
        showToast("No existing client match");
        closeDropdown();
        return;
      }
      setStatus("Select a client from the list below.", false);
      openDropdown(matches);
    };

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        runSearchEnter();
      } else if (e.key === "Escape") {
        closeDropdown();
      }
    });

    listEl.addEventListener("mousedown", (e) => {
      const t = e.target instanceof Element ? e.target : null;
      const row = t?.closest?.("[data-reg-client-pick]");
      if (!(row instanceof HTMLElement)) return;
      e.preventDefault();
      const i = Number(row.getAttribute("data-reg-client-pick"));
      const client = lastMatchList[i];
      if (client) selectClient(client);
    });

    resetBtn?.addEventListener("click", () => {
      closeDropdown();
      searchInput.value = "";
      setStatus("");
      clearRegistrationLookupAutofill(form, state.registerProgram);
      setRegistrationPersonalSectionLocked(form, state.registerProgram, false);
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
                  <ul class="registration__eligibility-ul">
                    <li>Are a female Singapore Citizen or Permanent Resident aged 40 and above;</li>
                    <li>Have not gone for mammogram screening for the past 1 year (aged 40 to 49) or 2 years (aged 50 and above);</li>
                    <li>Do not have breast symptoms such as breast lumps or nipple discharge; and</li>
                    <li>Have not been breastfeeding for the past 6 months.</li>
                    <li>Not pregnant</li>
                  </ul>
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
                    <label for="residential">Residential Status<span class="field__req" aria-hidden="true">*</span></label>
                    <select id="residential" name="residential" required>
                      <option value="">Select Residential Status</option>
                      <option value="Citizen">Singapore Citizen</option>
                      <option value="PR">Permanent Resident</option>
                      <option value="Foreigner">Foreigner</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="nric">NRIC / FIN Number<span class="field__req" aria-hidden="true">*</span></label>
                    ${registrationNricField("nric", "nric", true, registrationSingpassNricSeed())}
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
                    <label for="religion">Religion</label>
                    <select id="religion" name="religion">
                      ${registrationSelectOptions(V3_BIODATA_OPTIONS?.religion, "Select Religion")}
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
                  ${registrationPreferredLanguagesField("pref-lang", "preferredLanguages")}
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
                    <label for="floor">Floor<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="floor" name="floor" required placeholder="E.g. 50" />
                  </div>
                  <div class="field">
                    <label for="unit">Unit No<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="unit" name="unit" required placeholder="E.g. 101 or 345" />
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
                    <label for="chasCardType">CHAS Card Type<span class="field__req" aria-hidden="true">*</span></label>
                    <select id="chasCardType" name="chasCardType" required>${REG_SUBSIDIES_CHAS_OPTIONS}
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
                        <div class="registration__option-card-title">Mammobus</div>
                        <span class="registration__option-card-ring" aria-hidden="true"></span>
                      </div>
                      <div class="registration__option-card-desc">
                        <div class="registration__option-card-subtitle">I would like to book a mammogram appointment on the Mammobus</div>
                        SCS, BCF &amp; NHGD initiative bringing subsidised mammogram screenings to neighbourhoods across Singapore. Note: not wheelchair-accessible.
                      </div>
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
                        <div class="registration__option-card-subtitle">Yes, I would like to book a mammogram appointment at SCS Clinic @ Bishan</div>
                        Free mammograms for individuals with a Blue or Orange CHAS card aged 50 and above.
                      </div>
                    </div>
                  </label>

                  <label class="registration__option-card" data-option-card>
                    <input class="registration__option-card-input" type="radio" name="appointmentType" value="healthier-sg" />
                    <div class="registration__option-card-body">
                      <div class="registration__option-card-title-row">
                        <div class="registration__option-card-title">Healthier SG</div>
                        <span class="registration__option-card-ring" aria-hidden="true"></span>
                      </div>
                      <div class="registration__option-card-desc">
                        <div class="registration__option-card-subtitle">I will / have already booked my screening through Healthier SG</div>
                        HPB's national health screening programme for Singapore Citizens. Book any recommended subsidised screening on HealthHub.
                      </div>
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

                <div class="registration__question-card" data-hsg-q2>
                  <div class="registration__question-kicker">QUESTION 2 OF 2</div>
                  <div class="registration__question-title">When is the date of your screening? (Choose date)</div>
                  <div class="field field--full">
                    ${registrationDateInput("healthierSgScreeningDate", "healthierSgScreeningDate", false)}
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
                    <label for="sourceType">How did you hear about this programme?<span class="field__req" aria-hidden="true">*</span></label>
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
                  ${renderStandardConsentRowHtml({ id: "consent", name: "consent", required: true })}
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
                    <label for="hpvResidential">Residential Status<span class="field__req" aria-hidden="true">*</span></label>
                    <select id="hpvResidential" name="hpvResidential" required>
                      <option value="">Select Residential Status</option>
                      <option value="Citizen">Singapore Citizen</option>
                      <option value="PR">Permanent Resident</option>
                      <option value="Foreigner">Foreigner</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="hpvNric">NRIC / FIN Number<span class="field__req" aria-hidden="true">*</span></label>
                    ${registrationNricField("hpvNric", "hpvNric", true, registrationSingpassNricSeed())}
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
                    <label for="hpvReligion">Religion</label>
                    <select id="hpvReligion" name="hpvReligion">
                      ${registrationSelectOptions(V3_BIODATA_OPTIONS?.religion, "Select Religion")}
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
                  ${registrationPreferredLanguagesField("hpv-pref-lang", "hpvPreferredLanguages")}
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
                    <label for="hpvFloor">Floor<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="hpvFloor" name="hpvFloor" required placeholder="E.g. 50" />
                  </div>
                  <div class="field">
                    <label for="hpvUnit">Unit No<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="hpvUnit" name="hpvUnit" required placeholder="E.g. 101 or 345" />
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
                    <label for="hpvChasCardType">CHAS Card Type<span class="field__req" aria-hidden="true">*</span></label>
                    <select id="hpvChasCardType" name="hpvChasCardType" required>${REG_SUBSIDIES_CHAS_OPTIONS}
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

              <section id="reg-hpv-appointment-type" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Appointment Type</h2>
                <p class="registration__appointment-type-lead">
                  There are several avenues where you can sign up for an HPV screening. Please select one of the options below.
                </p>
                <div class="registration__appointment-type" role="radiogroup" aria-label="Appointment Type">
                  <label class="registration__option-card registration__option-card--selected" data-option-card>
                    <input class="registration__option-card-input" type="radio" name="appointmentType" value="scs-clinic" checked />
                    <div class="registration__option-card-body">
                      <div class="registration__option-card-title-row">
                        <div class="registration__option-card-title">SCS Clinic @ Bishan</div>
                        <span class="registration__option-card-ring" aria-hidden="true"></span>
                      </div>
                      <div class="registration__option-card-desc">
                        <div class="registration__option-card-subtitle">Yes, I would like to book an HPV screening appointment at SCS Clinic @ Bishan</div>
                      </div>
                    </div>
                  </label>

                  <label class="registration__option-card" data-option-card>
                    <input class="registration__option-card-input" type="radio" name="appointmentType" value="healthier-sg" />
                    <div class="registration__option-card-body">
                      <div class="registration__option-card-title-row">
                        <div class="registration__option-card-title">Healthier SG</div>
                        <span class="registration__option-card-ring" aria-hidden="true"></span>
                      </div>
                      <div class="registration__option-card-desc">
                        <div class="registration__option-card-subtitle">I will / have already booked my screening through Healthier SG</div>
                        HPB's national health screening programme for Singapore Citizens. Book any recommended subsidised screening on HealthHub.
                      </div>
                    </div>
                  </label>
                </div>
              </section>

              <section id="reg-hpv-healthier-sg" class="registration-card registration__healthier-sg-extra" tabindex="-1" hidden>
                <h2 class="registration__section-label">Healthier SG Programme</h2>

                <div class="registration__question-card">
                  <div class="registration__question-kicker">QUESTION 1 OF 2</div>
                  <div class="registration__question-title">Have you booked your Healthier SG HPV screening yet?</div>
                  <div class="registration__yesno" role="radiogroup" aria-label="Healthier SG booking status">
                    <label class="registration__yesno-btn" data-yesno>
                      <input class="registration__yesno-input" type="radio" name="hpvHealthierSgBooked" value="no" />
                      <span>No</span>
                    </label>
                    <label class="registration__yesno-btn" data-yesno>
                      <input class="registration__yesno-input" type="radio" name="hpvHealthierSgBooked" value="yes" />
                      <span>Yes</span>
                    </label>
                  </div>
                </div>

                <div class="registration__question-card" data-hsg-q2>
                  <div class="registration__question-kicker">QUESTION 2 OF 2</div>
                  <div class="registration__question-title">When is the date of your screening?</div>
                  <div class="field field--full">
                    ${registrationDateInput("hpvHealthierSgScreeningDate", "hpvHealthierSgScreeningDate", false)}
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
                    <label for="hpvSourceType">How did you hear about this programme?</label>
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

              <section id="reg-hpv-consent" class="registration-card registration-card--fit-consent" tabindex="-1">
                <h2 class="registration__section-label">Consent</h2>
                <div class="registration__fit-consent-body">
                  ${renderStandardConsentRowHtml({ id: "hpvConsentPrivacy", name: "hpvConsentPrivacy", required: true })}
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
                    <label for="fitResidential">Residential Status<span class="field__req" aria-hidden="true">*</span></label>
                    <select id="fitResidential" name="fitResidential" required>
                      <option value="">Select Residential Status</option>
                      <option value="Citizen">Singapore Citizen</option>
                      <option value="PR">Permanent Resident</option>
                      <option value="Foreigner">Foreigner</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="fitNric">NRIC / FIN Number<span class="field__req" aria-hidden="true">*</span></label>
                    ${registrationNricField("fitNric", "fitNric", true, registrationSingpassNricSeed())}
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
                    <label for="fitReligion">Religion</label>
                    <select id="fitReligion" name="fitReligion">
                      ${registrationSelectOptions(V3_BIODATA_OPTIONS?.religion, "Select Religion")}
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
                  ${registrationPreferredLanguagesField("fit-pref-lang", "fitPreferredLanguages")}
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
                    <label for="fitFloor">Floor<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="fitFloor" name="fitFloor" required placeholder="E.g. 50" />
                  </div>
                  <div class="field">
                    <label for="fitUnit">Unit No<span class="field__req" aria-hidden="true">*</span></label>
                    <input id="fitUnit" name="fitUnit" required placeholder="E.g. 101 or 345" />
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
                    <label for="fitChasCardType">CHAS Card Type<span class="field__req" aria-hidden="true">*</span></label>
                    <select id="fitChasCardType" name="fitChasCardType" required>${REG_SUBSIDIES_CHAS_OPTIONS}
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

              <section id="reg-fit-appointment-type" class="registration-card" tabindex="-1">
                <h2 class="registration__section-label">Appointment Type</h2>
                <p class="registration__appointment-type-lead">
                  Please select one of the options below.
                </p>
                <div class="registration__appointment-type" role="radiogroup" aria-label="Appointment Type">
                  <label class="registration__option-card registration__option-card--selected" data-option-card>
                    <input class="registration__option-card-input" type="radio" name="appointmentType" value="healthier-sg" checked />
                    <div class="registration__option-card-body">
                      <div class="registration__option-card-title-row">
                        <div class="registration__option-card-title">Healthier SG</div>
                        <span class="registration__option-card-ring" aria-hidden="true"></span>
                      </div>
                      <div class="registration__option-card-desc">
                        <div class="registration__option-card-subtitle">I will / have already booked my screening through Healthier SG</div>
                        HPB's national health screening programme for Singapore Citizens. Book any recommended subsidised screening on HealthHub.
                      </div>
                    </div>
                  </label>
                </div>
              </section>

              <section id="reg-fit-healthier-sg" class="registration-card registration__healthier-sg-extra" tabindex="-1">
                <h2 class="registration__section-label">Healthier SG Programme</h2>

                <div class="registration__question-card">
                  <div class="registration__question-kicker">QUESTION 1 OF 2</div>
                  <div class="registration__question-title">Have you booked your Healthier SG screening yet?</div>
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

                <div class="registration__question-card" data-hsg-q2>
                  <div class="registration__question-kicker">QUESTION 2 OF 2</div>
                  <div class="registration__question-title">When is the date of your screening? (Choose date)</div>
                  <div class="field field--full">
                    ${registrationDateInput("healthierSgScreeningDate", "healthierSgScreeningDate", false)}
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
                    <label for="fitSourceType">How did you hear about this programme?</label>
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
                  ${renderStandardConsentRowHtml({ id: "fitConsent", name: "fitConsent", required: true })}
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
      const map = {
        stage: "stages",
        gender: "genders",
        risk: "risks",
        appointmentType: "appointmentTypes",
        attendance: "attendances",
        sourceType: "sourceTypes",
      };
      const arrKey = map[group];
      const arr = f[arrKey] || [];
      const sel = arr.includes(value);
      return `<button type="button" class="ui-chip${sel ? " is-selected" : ""}" data-lf-chip data-lf-group="${group}" data-value="${escapeAttr(value)}" aria-pressed="${sel}">${escapeAttr(label)}</button>`;
    };
    const ageWideOpen = Number(f.ageMin) === 18 && Number(f.ageMax) === 100;
    const amin = ageWideOpen ? "" : String(Math.round(Number.isFinite(f.ageMin) ? f.ageMin : 18));
    const amax = ageWideOpen ? "" : String(Math.round(Number.isFinite(f.ageMax) ? f.ageMax : 100));
    const drFrom = escapeAttr(f.dateRegisteredFrom || "");
    const drTo = escapeAttr(f.dateRegisteredTo || "");
    const nrFrom = escapeAttr(f.nextReviewFrom || "");
    const nrTo = escapeAttr(f.nextReviewTo || "");
    const apptTypeChips = Object.entries(SCREENING_APPOINTMENT_TYPE_LABELS)
      .map(([val, lbl]) => chip("appointmentType", val, lbl))
      .join("");
    const attendanceChips = CLASSIC_SCREENING_ATTENDANCE_OPTIONS.map((opt) => chip("attendance", opt, opt)).join("");
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
              <p class="ui-filter-section__label">Date registered</p>
              <div class="form-grid form-grid--reg form-grid--filter-age">
                <div class="field">
                  <label for="lf-dr-from">From</label>
                  <input type="date" id="lf-dr-from" name="lf-dr-from" value="${drFrom}" autocomplete="off" />
                </div>
                <div class="field">
                  <label for="lf-dr-to">To</label>
                  <input type="date" id="lf-dr-to" name="lf-dr-to" value="${drTo}" autocomplete="off" />
                </div>
              </div>
            </div>
            <div class="ui-filter-section">
              <p class="ui-filter-section__label">Next review</p>
              <div class="form-grid form-grid--reg form-grid--filter-age">
                <div class="field">
                  <label for="lf-nr-from">From</label>
                  <input type="date" id="lf-nr-from" name="lf-nr-from" value="${nrFrom}" autocomplete="off" />
                </div>
                <div class="field">
                  <label for="lf-nr-to">To</label>
                  <input type="date" id="lf-nr-to" name="lf-nr-to" value="${nrTo}" autocomplete="off" />
                </div>
              </div>
            </div>
            <div class="ui-filter-section">
              <p class="ui-filter-section__label">Appointment type</p>
              <div class="ui-chip-group" role="group" aria-label="Appointment type">
                ${apptTypeChips}
              </div>
            </div>
            <div class="ui-filter-section">
              <p class="ui-filter-section__label">Attendance</p>
              <div class="ui-chip-group" role="group" aria-label="Attendance">
                ${attendanceChips}
              </div>
            </div>
            <div class="ui-filter-section">
              <p class="ui-filter-section__label">Source type</p>
              <div class="ui-chip-group" role="group" aria-label="Source type">
                ${chip("sourceType", "Event", "Event")}
                ${chip("sourceType", "Campaign", "Campaign")}
                ${chip("sourceType", "Manual", "Manual")}
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
                    value="${escapeAttr(amin)}"
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
                    value="${escapeAttr(amax)}"
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
    const classicModalsOkOnListOrScreeningFlow = state.route === "list" || state.route === "screening";
    if (!onClassicScreenings && !classicModalsOkOnListOrScreeningFlow) {
      state.classicScreeningUpdateModalId = null;
    }

    if (state.route !== "list") {
      state.prospectListActionsOpenRowKey = null;
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
      state.view = getStoredListView() || "kanban";
    } else if (head === "list") {
      state.route = "list";
      state.routeId = null;
      // `#/list` is the canonical listing route; view is restored from the user's last choice.
      state.view = getStoredListView() || "kanban";
    } else if (head === "kanban") {
      state.route = "list";
      state.view = "kanban";
      state.routeId = null;
      setStoredListView("kanban");
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
    } else if (head === "bishan-clinics") {
      if (isStandaloneProspectVariant()) {
        state.route = "list";
        state.routeId = null;
        // Use hash assignment (not replace) so browser Back works.
        location.hash = "#/list";
        applyDerivedRouteState();
        return;
      }
      state.route = "bishanClinics";
      state.routeId = null;
      ensureBishanScreeningState();
      const bc = state.bishanScreening;
      const patTabs =
        typeof window.WD_bishanScreening !== "undefined" && Array.isArray(window.WD_bishanScreening.BISHAN_PAT_TAB_IDS)
          ? window.WD_bishanScreening.BISHAN_PAT_TAB_IDS
          : ["overview", "visits", "results", "medical-history", "other-details"];
      if (bc) {
        const seg1 = parts[1] ? String(parts[1]).toLowerCase() : "";
        if (seg1 === "patient" && parts[2]) {
          const slug = decodeURIComponent(parts[2]).trim();
          const p =
            bc.patients.find((x) => String(x.bishanCode || "").toUpperCase() === slug.toUpperCase()) ||
            bc.patients.find((x) => x.id === slug);
          if (!p) {
            location.replace("#/bishan-clinics");
            applyDerivedRouteState();
            return;
          } else {
            const prevSel = bc.selPatId;
            bc.selPatId = p.id;
            bc.view = "patient";
            bc.search = "";
            if (parts[3]) {
              const tab = decodeURIComponent(parts[3]).trim().toLowerCase();
              bc.patTab = patTabs.includes(tab) ? tab : "overview";
            } else {
              bc.patTab = "overview";
            }
            if (prevSel !== p.id) {
              bc.detailFormEdit = null;
              bc.detailFormDraft = null;
            }
          }
        } else {
          bc.view = "worklist";
          bc.selPatId = null;
          bc.detailFormEdit = null;
          bc.detailFormDraft = null;
        }
      }
    } else if (head === "fit-kit-tracker") {
      if (isStandaloneProspectVariant()) {
        state.route = "list";
        state.routeId = null;
        // Use hash assignment (not replace) so browser Back works.
        location.hash = "#/list";
        applyDerivedRouteState();
        return;
      }
      state.route = "fitKitTracker";
      state.routeId = null;
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
    const val = value == null ? "" : String(value);
    const shell = el.closest(".field__nric");
    if (shell) {
      const store = shell.querySelector(".field__nric-store");
      const edit = shell.querySelector(".field__nric-edit");
      const toggle = shell.querySelector("[data-nric-toggle]");
      if (store instanceof HTMLInputElement) {
        store.value = val;
        store.disabled = false;
      }
      if (edit instanceof HTMLInputElement) {
        edit.value = val;
        edit.disabled = true;
        edit.readOnly = true;
      }
      if (toggle instanceof HTMLButtonElement) {
        toggle.disabled = true;
        toggle.toggleAttribute("disabled", true);
      }
      markSingpassFieldGroup(store instanceof HTMLInputElement ? store : el);
    } else {
      el.value = val;
      el.disabled = true;
      markSingpassFieldGroup(el);
    }

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
    if (!state.registerSingpassLocked) return;
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
      lockSingpassInput("floor", d.floor);
      lockSingpassInput("unit", d.unit);
      lockSingpassSelect("country", d.country);
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
      lockSingpassInput("hpvFloor", d.floor);
      lockSingpassInput("hpvUnit", d.unit);
      lockSingpassSelect("hpvCountry", d.country);
      lockSingpassSelect("hpvChasCardType", d.chasCardType);
    } else if (p === "fit") {
      lockSingpassInput("fitFullName", d.fullName);
      lockSingpassInput("fitNric", d.nricFull);
      lockSingpassInput("fitDob", d.dob);
      lockSingpassSelect("fitGender", d.gender);
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
    unmountProspectListReact();
    if (state.route !== "detail") state.activityTimelineDrawerOpen = false;

    const prevRoute = lastAppRenderedRoute;
    lastAppRenderedRoute = state.route;
    /* Internal staff `#/register/…` opens the form directly; patient `?sr_token=…#/register/…` (Copy link → View) starts on Singpass vs manual. */
    if (state.route === "register" && prevRoute !== "register") {
      if (state.registerSelfService) {
        state.registerSelfServiceEntry = "landing";
        state.registerSingpassLocked = false;
      } else {
        state.registerSelfServiceEntry = "form";
        state.registerSingpassLocked = false;
      }
    }

    const isRegisterSelfService = state.route === "register" && state.registerSelfService;

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
    else if (state.route === "bishanClinics") {
      main = renderBishanClinicsPage();
    } else if (state.route === "fitKitTracker") {
      main = renderFitKitTrackerPage();
    } else if (state.route !== "register") main = renderListPage();

    if (state.route === "register" && state.registerSelfServiceEntry === "landing") {
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
      /* Apply MyInfo locks before NRIC/date bindings so init sees disabled fields + store values (avoids empty mask). */
      applySingpassDemoAndLocks();
      bindEvents();
      setupRegistrationScrollSpy();
      if (typeof window.WD_syncNricMasks === "function") {
        window.WD_syncNricMasks(document.getElementById("registration-scroll-root") || document.getElementById("app"));
      }
      if (typeof window.WD_syncDatePickersFromFields === "function") {
        window.WD_syncDatePickersFromFields(document.getElementById("app"));
      }
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

    if (state.route === "bishanClinics") {
      app.innerHTML = `
      <div class="app-shell app-shell--bishan-flow">
        <div class="bishan-sticky-chrome">
          ${renderHeader()}
        </div>
        <div class="app-content app-content--bishan-flow">
          <main class="app-main app-main--bishan-fullbleed">
            <div id="bishan-scroll-root" class="app-main--bishan-scroll">
              ${main}
              ${renderAppFooter()}
            </div>
          </main>
        </div>
      </div>
      ${renderModal()}
    `;
      bindEvents();
      return;
    }

    const mainCls =
      state.route === "list" || state.route === "fitKitTracker"
          ? "app-main app-main--prospects-fullbleed"
          : "app-main";
    app.innerHTML = `
      <div class="app-shell">
        ${renderHeader()}
        <div class="app-content">
          <main class="${mainCls}">${main}</main>
          ${renderAppFooter()}
        </div>
      </div>
      ${renderModal()}
    `;
    if (state.route === "list") {
      mountProspectListReact();
    }
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

  function normalizeClassicApptDateForPicker(input) {
    const t = String(input || "").trim();
    if (!t || t === "—") return "";
    // Prefer the shared normalizer if it can handle it (ISO / DD-MM-YYYY / slash).
    if (typeof window.WD_normalizeDateDisplay === "function") {
      const n = window.WD_normalizeDateDisplay(t);
      if (/^\d{2}-\d{2}-\d{4}$/.test(n)) return n;
    }
    // Support legacy displays like "19 Aug 2026".
    const m = t.match(/^(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})$/);
    if (m) {
      const dd = parseInt(m[1], 10);
      const monRaw = String(m[2] || "").slice(0, 3).toLowerCase();
      const yyyy = parseInt(m[3], 10);
      const months = {
        jan: 1,
        feb: 2,
        mar: 3,
        apr: 4,
        may: 5,
        jun: 6,
        jul: 7,
        aug: 8,
        sep: 9,
        oct: 10,
        nov: 11,
        dec: 12,
      };
      const mm = months[monRaw] || 0;
      if (dd >= 1 && dd <= 31 && mm >= 1 && mm <= 12 && yyyy >= 1900) {
        return `${String(dd).padStart(2, "0")}-${String(mm).padStart(2, "0")}-${String(yyyy)}`;
      }
    }
    return t;
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

  /** Swap date inputs if from &gt; to (YYYY-MM-DD). */
  function normalizeListFilterDateRangeEl(fromEl, toEl) {
    let a = fromEl && "value" in fromEl ? String(fromEl.value || "").trim() : "";
    let b = toEl && "value" in toEl ? String(toEl.value || "").trim() : "";
    if (a && b && a > b) {
      const t = a;
      a = b;
      b = t;
      if (fromEl) fromEl.value = a;
      if (toEl) toEl.value = b;
    }
    return { from: a, to: b };
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
    if (minEl && maxEl) {
      if (min === 18 && max === 100) {
        minEl.value = "";
        maxEl.value = "";
      } else {
        minEl.value = String(min);
        maxEl.value = String(max);
      }
    }
    return { ageMin: min, ageMax: max };
  }

  function readListFiltersFromForm() {
    const chips = (group) =>
      [...document.querySelectorAll(`#list-filter-form [data-lf-group="${group}"].is-selected`)].map((el) =>
        el.getAttribute("data-value")
      );
    const minEl = document.getElementById("lf-age-min");
    const maxEl = document.getElementById("lf-age-max");
    const { ageMin, ageMax } = normalizeAgeFilterValues(minEl, maxEl);
    const dr = normalizeListFilterDateRangeEl(document.getElementById("lf-dr-from"), document.getElementById("lf-dr-to"));
    const nr = normalizeListFilterDateRangeEl(document.getElementById("lf-nr-from"), document.getElementById("lf-nr-to"));
    state.listFilters = {
      stages: chips("stage"),
      genders: chips("gender"),
      risks: chips("risk"),
      ageMin,
      ageMax,
      dateRegisteredFrom: dr.from,
      dateRegisteredTo: dr.to,
      nextReviewFrom: nr.from,
      nextReviewTo: nr.to,
      appointmentTypes: chips("appointmentType"),
      attendances: chips("attendance"),
      sourceTypes: chips("sourceType"),
    };
  }

  /** Sync open filter modal controls to `state.listFilters` without re-rendering the dialog. */
  function syncListFilterFormFromState() {
    const form = document.getElementById("list-filter-form");
    if (!form) return;
    const f = state.listFilters;
    const map = {
      stage: "stages",
      gender: "genders",
      risk: "risks",
      appointmentType: "appointmentTypes",
      attendance: "attendances",
      sourceType: "sourceTypes",
    };
    form.querySelectorAll("[data-lf-chip]").forEach((btn) => {
      const g = btn.getAttribute("data-lf-group");
      const v = btn.getAttribute("data-value");
      const arrKey = map[g];
      if (!arrKey || v == null) return;
      const arr = f[arrKey] || [];
      const on = arr.includes(v);
      btn.classList.toggle("is-selected", on);
      btn.setAttribute("aria-pressed", String(on));
    });
    const drFrom = document.getElementById("lf-dr-from");
    const drTo = document.getElementById("lf-dr-to");
    const nrFrom = document.getElementById("lf-nr-from");
    const nrTo = document.getElementById("lf-nr-to");
    if (drFrom) drFrom.value = f.dateRegisteredFrom || "";
    if (drTo) drTo.value = f.dateRegisteredTo || "";
    if (nrFrom) nrFrom.value = f.nextReviewFrom || "";
    if (nrTo) nrTo.value = f.nextReviewTo || "";
    const minEl = document.getElementById("lf-age-min");
    const maxEl = document.getElementById("lf-age-max");
    const amin = Number.isFinite(f.ageMin) ? f.ageMin : 18;
    const amax = Number.isFinite(f.ageMax) ? f.ageMax : 100;
    if (minEl) minEl.value = String(amin);
    if (maxEl) maxEl.value = String(amax);
  }

  function applyProspectListKpiFromEl(kpiEl) {
    const key = kpiEl.getAttribute("data-prospect-kpi");
    if (!key) return;
    const already = state.listKpiActive === key;
    const clear = already || key === "total";
    if (clear) {
      state.listKpiActive = null;
      if (state.listKpiPrevSort) {
        state.listSort = state.listKpiPrevSort;
        state.listKpiPrevSort = null;
      }
      renderApp();
      return;
    }

    if (!state.listKpiActive && !state.listKpiPrevSort) {
      state.listKpiPrevSort = { ...state.listSort };
    }
    state.listKpiActive = key;
    if (key === "highrisk") state.listSort = { key: "risk", dir: "desc" };
    else if (key === "firsttime") state.listSort = { key: "dateRegistered", dir: "desc" };
    else if (key === "followup") state.listSort = { key: "nextReview", dir: "asc" };
    else if (key === "qualified" || key === "booked" || key === "screened") state.listSort = { key: "nextReview", dir: "asc" };
    renderApp();
  }

  /** Prospect list page: search + filter modal (clicks for KPI/kanban/toolbar use document delegation in installDelegatedAppListeners). */
  function bindProspectListPageInteractionsOnly() {
    const search = document.getElementById("prospect-search");
    if (search && search.dataset.wdReactList !== "1") {
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

    document.getElementById("list-filter-apply")?.addEventListener("click", () => {
      readListFiltersFromForm();
      state.filterModal = false;
      renderApp();
    });

    document.getElementById("list-filter-clear")?.addEventListener("click", () => {
      state.listFilters = createDefaultListFilters();
      syncListFilterFormFromState();
      if (state.route === "list") {
        refreshProspectsListingDomFromState();
      } else {
        renderApp();
      }
      requestAnimationFrame(() => {
        document.getElementById("list-filter-clear")?.focus();
      });
    });
  }

  function ageFromRegistrationDob(dobDdMmYyyyHyphen) {
    const s = String(dobDdMmYyyyHyphen || "")
      .trim()
      .replace(/^(\d{2})-(\d{2})-(\d{4})$/, "$1/$2/$3");
    return ageFromDobDdMmYyyy(s);
  }

  function readRegistrationNricFromForm(form, storeInputName) {
    const el = form?.elements?.namedItem(storeInputName);
    if (el instanceof HTMLInputElement) return String(el.value || "").trim();
    return "";
  }

  function nextProspectListId() {
    let max = 0;
    for (const p of PROSPECTS) {
      const m = String(p.id || "").match(/^PROS-(\d+)$/i);
      if (m) max = Math.max(max, parseInt(m[1], 10));
    }
    const next = max + 1;
    return `PROS-${String(next).padStart(6, "0")}`;
  }

  function registrationProgrammeLabel() {
    const p = String(state.registerProgram || "mammobus").toLowerCase();
    if (p === "hpv") return "HPV";
    if (p === "fit") return "FIT";
    return "Mammobus";
  }

  function registrationTimelineNowString() {
    return new Date().toLocaleString("en-SG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  function pushRegClientFromRegistrationIfNew(entry) {
    const name = String(entry.name || "").trim();
    if (!name || findRegExistingClientByName(name)) return;
    const nric = String(entry.nric || "").trim();
    if (!nric) return;
    REG_EXISTING_CLIENTS.push({
      name,
      nric,
      residential: String(entry.residential || "Citizen").trim() || "Citizen",
      dob: String(entry.dob || "").trim(),
      gender: String(entry.gender || "").trim(),
      race: String(entry.race || "").trim(),
      phone: String(entry.phone || "").trim(),
      email: String(entry.email || "").trim(),
      block: String(entry.block || "").trim(),
      street: String(entry.street || "").trim(),
      floor: String(entry.floor || "").trim(),
      unit: String(entry.unit || "").trim(),
      postal: String(entry.postal || "").trim(),
      country: String(entry.country || "Singapore").trim() || "Singapore",
    });
  }

  function buildProspectRowFromRegistrationForm(form) {
    const prog = String(state.registerProgram || "mammobus").toLowerCase();
    const programLabel = registrationProgrammeLabel();

    let fullName = "";
    let nricFieldName = "nric";
    let dob = "";
    let gender = "";
    let phone = "";
    let email = "";
    let residential = "";
    let race = "";
    let block = "";
    let street = "";
    let floor = "";
    let unit = "";
    let postal = "";
    let country = "Singapore";
    let sourceType = "";
    let sourceDetail = "";

    if (prog === "hpv") {
      fullName = String(form.elements.namedItem("hpvFullName")?.value || "").trim();
      nricFieldName = "hpvNric";
      dob = String(form.elements.namedItem("hpvDob")?.value || "").trim();
      gender = String(form.elements.namedItem("hpvGender")?.value || "").trim();
      phone = String(form.elements.namedItem("hpvMobile")?.value || "").trim();
      email = String(form.elements.namedItem("hpvEmail")?.value || "").trim();
      residential = String(form.elements.namedItem("hpvResidential")?.value || "").trim();
      race = String(form.elements.namedItem("hpvRace")?.value || "").trim();
      block = String(form.elements.namedItem("hpvBlock")?.value || "").trim();
      street = String(form.elements.namedItem("hpvStreet")?.value || "").trim();
      floor = String(form.elements.namedItem("hpvFloor")?.value || "").trim();
      unit = String(form.elements.namedItem("hpvUnit")?.value || "").trim();
      postal = String(form.elements.namedItem("hpvPostal")?.value || "").trim();
      country = String(form.elements.namedItem("hpvCountry")?.value || "").trim() || "Singapore";
      sourceType = String(form.elements.namedItem("hpvSourceType")?.value || "").trim();
      sourceDetail = String(form.elements.namedItem("hpvCampaignName")?.value || "").trim();
    } else if (prog === "fit") {
      fullName = String(form.elements.namedItem("fitFullName")?.value || "").trim();
      nricFieldName = "fitNric";
      dob = String(form.elements.namedItem("fitDob")?.value || "").trim();
      gender = String(form.elements.namedItem("fitGender")?.value || "").trim();
      phone = String(form.elements.namedItem("fitContact")?.value || "").trim();
      email = String(form.elements.namedItem("fitEmail")?.value || "").trim();
      residential = String(form.elements.namedItem("fitResidential")?.value || "").trim();
      race = String(form.elements.namedItem("fitRace")?.value || "").trim();
      block = String(form.elements.namedItem("fitBlock")?.value || "").trim();
      street = String(form.elements.namedItem("fitStreet")?.value || "").trim();
      floor = String(form.elements.namedItem("fitFloor")?.value || "").trim();
      unit = String(form.elements.namedItem("fitUnit")?.value || "").trim();
      postal = String(form.elements.namedItem("fitPostal")?.value || "").trim();
      country = String(form.elements.namedItem("fitCountry")?.value || "").trim() || "Singapore";
      sourceType = String(form.elements.namedItem("fitSourceType")?.value || "").trim();
      sourceDetail = String(form.elements.namedItem("fitCampaignName")?.value || "").trim();
    } else {
      fullName = String(form.elements.namedItem("fullName")?.value || "").trim();
      nricFieldName = "nric";
      dob = String(form.elements.namedItem("dob")?.value || "").trim();
      gender = String(form.elements.namedItem("gender")?.value || "").trim();
      phone = String(form.elements.namedItem("phone")?.value || "").trim();
      email = String(form.elements.namedItem("email")?.value || "").trim();
      residential = String(form.elements.namedItem("residential")?.value || "").trim();
      race = String(form.elements.namedItem("race")?.value || "").trim();
      block = String(form.elements.namedItem("block")?.value || "").trim();
      street = String(form.elements.namedItem("street")?.value || "").trim();
      floor = String(form.elements.namedItem("floor")?.value || "").trim();
      unit = String(form.elements.namedItem("unit")?.value || "").trim();
      postal = String(form.elements.namedItem("postal")?.value || "").trim();
      country = String(form.elements.namedItem("country")?.value || "").trim() || "Singapore";
      sourceType = String(form.elements.namedItem("sourceType")?.value || "").trim();
      sourceDetail = String(form.elements.namedItem("sourceName")?.value || "").trim();
    }

    const nric = readRegistrationNricFromForm(form, nricFieldName);
    const age = ageFromRegistrationDob(dob);
    const g =
      gender.toLowerCase() === "male" ? "Male" : gender.toLowerCase() === "female" ? "Female" : "—";
    const ageLabel = age != null ? `${age} years` : "—";
    const ageGender = `${g}, ${ageLabel}`;

    const id = nextProspectListId();
    const rowKey = `${id}-${programLabel}`;
    const todayIso = new Date().toISOString().slice(0, 10);

    const atEl = form.querySelector('input[type="radio"][name="appointmentType"]:checked');
    const appointmentTypeRaw =
      atEl instanceof HTMLInputElement ? String(atEl.value || "").trim().toLowerCase() : "";

    const row = {
      rowKey,
      id,
      name: fullName,
      maskedNric: v3MaskNricForProfileDisplay(nric),
      program: programLabel,
      ageGender,
      phone: phone || "—",
      email: email || "",
      status: "qualified",
      sourceType: sourceType || "—",
      sourceDetail: sourceDetail || "",
      risk: "low",
      dateRegistered: todayIso,
      nextReview: "",
      attendance: "",
      activityTimeline: [
        {
          stage: "qualified",
          dateTime: registrationTimelineNowString(),
          title: "Registration submitted",
          body: state.registerSelfService
            ? "Screening registration received via self-service link."
            : "Screening registration submitted from staff portal.",
          by: state.registerSelfService ? "Self-service" : "Registration portal",
        },
      ],
    };

    if (appointmentTypeRaw) row.appointmentType = appointmentTypeRaw;

    const regClient = {
      name: fullName,
      nric,
      residential,
      dob,
      gender,
      race,
      phone,
      email,
      block,
      street,
      floor,
      unit,
      postal,
      country,
    };

    return { row, regClient };
  }

  function bindEvents() {
    // Classic screening update modal: auto-calc next review date from review period (user can override).
    (function bindClassicScreeningReviewAutoCalc() {
      const periodSel = document.getElementById("csu-next-review-period");
      const dateText = document.getElementById("csu-next-review-date");
      const dateNative = document.querySelector("#classic-screening-update-modal .field__date-native");
      if (!(periodSel instanceof HTMLSelectElement)) return;
      if (!(dateText instanceof HTMLInputElement)) return;
      if (periodSel.getAttribute("data-next-review-bound") === "1") return;
      periodSel.setAttribute("data-next-review-bound", "1");

      const pad2 = (n) => String(n).padStart(2, "0");
      const toDdMmYyyy = (d) => `${pad2(d.getDate())}-${pad2(d.getMonth() + 1)}-${d.getFullYear()}`;
      const addMonths = (d, months) => {
        const out = new Date(d.getTime());
        const day = out.getDate();
        out.setDate(1);
        out.setMonth(out.getMonth() + months);
        const last = new Date(out.getFullYear(), out.getMonth() + 1, 0).getDate();
        out.setDate(Math.min(day, last));
        return out;
      };
      const addYears = (d, years) => addMonths(d, years * 12);

      const calcFromPeriod = (p) => {
        const raw = String(p || "").trim().toLowerCase();
        const today = new Date();
        const base = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (raw === "6 months") return addMonths(base, 6);
        if (raw === "1 year") return addYears(base, 1);
        if (raw === "3 years") return addYears(base, 3);
        if (raw === "5 years") return addYears(base, 5);
        return null;
      };

      const markManual = () => dateText.setAttribute("data-auto-next-review", "0");
      const isAuto = () => String(dateText.getAttribute("data-auto-next-review") || "1") !== "0";

      // If the field already has a value, treat it as manual.
      const existing = String(dateText.value || "").trim();
      if (existing && existing !== "—") dateText.setAttribute("data-auto-next-review", "0");

      const applyAuto = () => {
        const dt = calcFromPeriod(periodSel.value);
        if (!dt) return;
        const cur = String(dateText.value || "").trim();
        const emptyish = !cur || cur === "—";
        if (emptyish || isAuto()) {
          dateText.value = toDdMmYyyy(dt);
          dateText.setAttribute("data-auto-next-review", "1");
          // Keep native date in sync if present (date-input.js will also sync on init).
          if (dateNative instanceof HTMLInputElement) {
            const iso = `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
            dateNative.value = iso;
          }
        }
      };

      periodSel.addEventListener("change", applyAuto);
      periodSel.addEventListener("input", applyAuto);
      dateText.addEventListener("input", markManual);
      dateText.addEventListener("change", markManual);
      dateNative?.addEventListener?.("change", markManual);

      // Initial auto-fill on open if period is selected and date empty.
      applyAuto();
    })();

    // Prospect detail Notes tab: in-panel search (filters note body text)
    const onNotesTab =
      (state.route === "detail" && state.detailTab === "notes") ||
      (state.route === "prospectv3" && state.prospectV3Tab === "notes");
    if (onNotesTab) {
      const rowKey = state.detail?.rowKey || state.detail?.id || "";
      const inp = document.querySelector("[data-detail-notes-search]");
      if (rowKey && inp instanceof HTMLInputElement) {
        inp.addEventListener("input", () => {
          const val = inp.value;
          const wasActive = document.activeElement === inp;
          const selStart = inp.selectionStart;
          const selEnd = inp.selectionEnd;
          state.detailNotesSearchByProspect[rowKey] = val;
          state.detailNotesPageByProspect[rowKey] = 1;
          renderApp();
          if (!wasActive) return;
          requestAnimationFrame(() => {
            const nextInp = document.querySelector("[data-detail-notes-search]");
            if (!(nextInp instanceof HTMLInputElement)) return;
            nextInp.focus();
            if (selStart != null && selEnd != null) {
              try {
                nextInp.setSelectionRange(selStart, selEnd);
              } catch (_) {}
            }
          });
        });
      }
      document.querySelector("[data-detail-notes-search-clear]")?.addEventListener("click", (e) => {
        e.preventDefault();
        if (!rowKey) return;
        state.detailNotesSearchByProspect[rowKey] = "";
        state.detailNotesPageByProspect[rowKey] = 1;
        renderApp();
        requestAnimationFrame(() => {
          const nextInp = document.querySelector("[data-detail-notes-search]");
          if (nextInp instanceof HTMLInputElement) nextInp.focus();
        });
      });
    }

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

    // Classic screening records table: type filter + row expand (Client 360 + Prospect V3)
    document.querySelectorAll("[data-classic-screening-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.classicScreeningFilter = btn.getAttribute("data-classic-screening-filter") || "all";
        state.classicScreeningExpandedId = null;
        state.classicScreeningExpandAll = false;
        renderApp();
      });
    });

    document.querySelectorAll("[data-classic-screening-expand-toggle]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (state.classicScreeningExpandAll) {
          state.classicScreeningExpandAll = false;
          state.classicScreeningExpandedId =
            pickClassicScreeningRecordIdForDetailProspect(state.detail?.activeListProgram, state.detail) || null;
        } else {
          state.classicScreeningExpandAll = true;
        }
        renderApp();
      });
    });

    document.querySelectorAll("[data-classic-screening-row]").forEach((row) => {
      const toggle = () => {
        const id = row.getAttribute("data-classic-screening-row");
        if (!id) return;
        if (state.classicScreeningExpandAll) {
          state.classicScreeningExpandAll = false;
          state.classicScreeningExpandedId = id;
        } else {
          state.classicScreeningExpandedId = state.classicScreeningExpandedId === id ? null : id;
        }
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

    document.querySelectorAll("[data-export-option]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const fmt = btn.getAttribute("data-export-option");
        state.exportMenuOpen = false;
        renderApp();
        if (fmt === "excel") exportProspectsXlsx();
        else exportProspectsCsvSheetJs();
      });
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

    bindProspectListPageInteractionsOnly();

    document.getElementById("registration-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target;
      if (!(form instanceof HTMLFormElement)) return;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const { row, regClient } = buildProspectRowFromRegistrationForm(form);
      pushRegClientFromRegistrationIfNew(regClient);
      ensureProspectChecklists(row);
      PROSPECTS.unshift(row);
      const rp = String(state.registerProgram || "mammobus").toLowerCase();
      if (rp === "hpv") state.program = "hpv";
      else if (rp === "fit") state.program = "fit";
      else state.program = "mammobus";
      showToast("Registration submitted. Prospect added to listing.");
      location.hash = "#/list";
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
        const selected = regRoot.querySelector('input[type="radio"][name="appointmentType"][value="healthier-sg"]');
        const show = selected instanceof HTMLInputElement && selected.checked;

        const pairs = [
          { extraId: "#reg-healthier-sg", extraTocId: null, bookedName: "healthierSgBooked", dateId: "healthierSgScreeningDate", apptId: "#reg-appointment", tocId: "reg-appointment" },
          { extraId: "#reg-fit-healthier-sg", extraTocId: "reg-fit-healthier-sg", bookedName: "healthierSgBooked", dateId: "healthierSgScreeningDate", apptId: "#reg-fit-appointment", tocId: "reg-fit-appointment" },
          { extraId: "#reg-hpv-healthier-sg", extraTocId: "reg-hpv-healthier-sg", bookedName: "hpvHealthierSgBooked", dateId: "hpvHealthierSgScreeningDate", apptId: "#reg-hpv-appointment", tocId: "reg-hpv-appointment" },
        ];
        pairs.forEach(({ extraId, extraTocId, bookedName, dateId, apptId, tocId }) => {
          const extra = regRoot.querySelector(extraId);
          if (extra instanceof HTMLElement) {
            extra.hidden = !show;
            extra.querySelectorAll("input, select, textarea, button").forEach((el) => {
              if (
                el instanceof HTMLInputElement ||
                el instanceof HTMLSelectElement ||
                el instanceof HTMLTextAreaElement ||
                el instanceof HTMLButtonElement
              ) {
                el.disabled = !show;
              }
            });
          }

          // Hide Appointment Preferences when Healthier SG is selected.
          const apptPref = regRoot.querySelector(apptId);
          if (apptPref instanceof HTMLElement) {
            apptPref.hidden = show;
            apptPref.querySelectorAll("input, select, textarea, button").forEach((el) => {
              if (
                el instanceof HTMLInputElement ||
                el instanceof HTMLSelectElement ||
                el instanceof HTMLTextAreaElement ||
                el instanceof HTMLButtonElement
              ) {
                el.disabled = show;
              }
            });
          }

          // Hide TOC entry too, so user can't navigate to a hidden section.
          document.querySelectorAll(`[data-reg-nav="${tocId}"]`).forEach((btn) => {
            if (btn instanceof HTMLElement) btn.style.display = show ? "none" : "";
          });

          if (extraTocId) {
            document.querySelectorAll(`[data-reg-nav="${extraTocId}"]`).forEach((btn) => {
              if (btn instanceof HTMLElement) btn.style.display = show ? "" : "none";
            });
          }

          // Question 2: disable date unless Question 1 = "yes" (per-form radio names + date ids)
          const bookedYes = regRoot.querySelector(`input[type="radio"][name="${bookedName}"][value="yes"]`);
          const bookedNo = regRoot.querySelector(`input[type="radio"][name="${bookedName}"][value="no"]`);
          const isYes = bookedYes instanceof HTMLInputElement && bookedYes.checked;
          const isNo = bookedNo instanceof HTMLInputElement && bookedNo.checked;
          const q2 = extra instanceof HTMLElement ? extra.querySelector('[data-hsg-q2]') : null;
          if (q2 instanceof HTMLElement) q2.hidden = !show || !isYes;

          const dateInput = regRoot.querySelector(`#${dateId}`);
          if (dateInput instanceof HTMLInputElement) {
            dateInput.disabled = !show || isNo || !isYes;
            if (show && isNo) dateInput.value = "";
            const shell = dateInput.closest(".field__date");
            if (shell) {
              const btn = shell.querySelector(".field__date-btn");
              const native = shell.querySelector(".field__date-native");
              if (btn instanceof HTMLButtonElement) btn.disabled = dateInput.disabled;
              if (native instanceof HTMLInputElement) native.disabled = dateInput.disabled;
            }
          }
        });
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
        if (t.type === "radio" && (t.name === "healthierSgBooked" || t.name === "hpvHealthierSgBooked")) {
          syncYesNoButtons();
          syncHealthierSgExtra();
        }
      });

      // Click yes/no button → ensure selected styling updates immediately
      regRoot.addEventListener("click", (e) => {
        const raw = e.target;
        const el = raw instanceof Element ? raw : raw?.parentElement;
        const btn = el?.closest?.("[data-yesno]");
        if (!(btn instanceof HTMLElement)) return;
        const input = btn.querySelector('input[type="radio"][name="healthierSgBooked"], input[type="radio"][name="hpvHealthierSgBooked"]');
        if (!(input instanceof HTMLInputElement)) return;
        if (!input.checked) {
          input.checked = true;
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }
        syncYesNoButtons();
        syncHealthierSgExtra();
        e.preventDefault();
        e.stopPropagation();
      });
    }

    // FIT Kit Tracker (route-local bindings)
    if (state.route === "fitKitTracker") {
      const fit = state.fitKit;
      const byId = (id) => document.getElementById(id);
        const toNumId = (raw) => {
          const n = Number(raw);
          return Number.isFinite(n) ? n : null;
        };

      const searchInp = byId("fit-search");
      if (searchInp && searchInp instanceof HTMLInputElement) {
        searchInp.addEventListener("input", () => {
          const val = searchInp.value;
          const wasActive = document.activeElement === searchInp;
          const selStart = searchInp.selectionStart;
          const selEnd = searchInp.selectionEnd;
          fit.search = val;
          renderApp();
          if (!wasActive) return;
          requestAnimationFrame(() => {
            const nextInp = byId("fit-search");
            if (!(nextInp instanceof HTMLInputElement)) return;
            nextInp.focus();
            if (selStart != null && selEnd != null) {
              try {
                nextInp.setSelectionRange(selStart, selEnd);
              } catch (_) {
                /* ignore */
              }
            }
          });
        });
      }

      byId("fit-export")?.addEventListener("click", (e) => {
        e.preventDefault();
        fitExportCsv();
      });

      document.querySelectorAll("[data-fit-kpi]").forEach((el) => {
        const onActivate = () => {
          const key = el.getAttribute("data-fit-kpi");
          if (!key) return;
          const already = String(fit.kpiActive || "") === key;
          fit.kpiActive = already || key === "total" ? null : key;
          if (fit.kpiActive === "stage1") fit.activeStage = 1;
          else if (fit.kpiActive === "stage2") fit.activeStage = 2;
          else if (fit.kpiActive === "stage3") fit.activeStage = 3;
          else if (fit.kpiActive === "stage4") fit.activeStage = 4;
          else if (fit.kpiActive === "positive" || fit.kpiActive === "negative") fit.activeStage = 4;
          else if (fit.kpiActive === "awaiting") fit.activeStage = 0;
          renderApp();
        };
        el.addEventListener("click", (e) => {
          e.preventDefault();
          onActivate();
        });
        el.addEventListener("keydown", (e) => {
          if (e.key !== "Enter" && e.key !== " ") return;
          e.preventDefault();
          onActivate();
        });
      });

      // Select-all + row selection (bulk actions)
      const selected = new Set((fit.selectedIds || []).map((x) => Number(x)).filter((n) => Number.isFinite(n)));
      const filtered = fitFilteredPatients();
      const activeStage = Number(fit.activeStage || 0);
      const stagesToShow = activeStage ? FIT_STAGES.filter((s) => s.id === activeStage) : FIT_STAGES;

      const stageVisibleIds = new Map();
      stagesToShow.forEach((s) => {
        const sid = Number(s.id);
        const ids = filtered
          .filter((p) => Number(p.stage) === sid)
          .map((p) => toNumId(p.id))
          .filter((id) => id != null);
        stageVisibleIds.set(sid, ids);
      });

      document.querySelectorAll("[data-fit-select-all-stage]").forEach((cb) => {
        if (!(cb instanceof HTMLInputElement)) return;
        const sid = Number(cb.getAttribute("data-fit-select-all-stage") || 0);
        const ids = stageVisibleIds.get(sid) || [];
        const selectedVisible = ids.filter((id) => selected.has(id)).length;
        cb.checked = ids.length > 0 && selectedVisible === ids.length;
        cb.indeterminate = selectedVisible > 0 && selectedVisible < ids.length;
        cb.addEventListener("change", () => {
          const want = cb.checked;
          const next = new Set((fit.selectedIds || []).map((x) => Number(x)).filter((n) => Number.isFinite(n)));
          if (want) ids.forEach((id) => next.add(id));
          else ids.forEach((id) => next.delete(id));
          fit.selectedIds = Array.from(next);
          renderApp();
        });
      });

      document.querySelectorAll("[data-fit-select-row]").forEach((cb) => {
        if (!(cb instanceof HTMLInputElement)) return;
        cb.addEventListener("change", () => {
          const id = toNumId(cb.getAttribute("data-fit-select-row"));
          if (id == null) return;
          const next = new Set((fit.selectedIds || []).map((x) => Number(x)).filter((n) => Number.isFinite(n)));
          if (cb.checked) next.add(id);
          else next.delete(id);
          fit.selectedIds = Array.from(next);
          renderApp();
        });
      });

      document.querySelectorAll("[data-fit-stage]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const raw = btn.getAttribute("data-fit-stage");
          const sid = Number(raw || 0);
          fit.activeStage = fit.activeStage === sid ? 0 : sid;
          renderApp();
        });
      });

      document.querySelectorAll("[data-fit-upload]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const raw = btn.getAttribute("data-fit-upload");
          fit.uploadModalStage = Number(raw || 0) || null;
          fit.uploadState = { preview: null, errors: null, parsedRows: null };
          renderApp();
        });
      });

      document.querySelectorAll("[data-fit-edit]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const pid = Number(btn.getAttribute("data-fit-edit") || 0);
          const p = fit.patients.find((x) => Number(x.id) === pid);
          if (!p) return;
          fit.editModal = { patientId: pid, form: { ...p } };
          renderApp();
        });
      });

      document.querySelectorAll("[data-fit-advance]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const pid = Number(btn.getAttribute("data-fit-advance") || 0);
          const p = fit.patients.find((x) => Number(x.id) === pid);
          if (!p) return;
          const toStage = Math.min(4, Number(p.stage) + 1);
          fit.advanceModal = {
            patientId: pid,
            toStage,
            form: {
              dispatchDate: fitTodayIso(),
              labRef: "",
              receivedDate: fitTodayIso(),
              result: "",
              resultDate: fitTodayIso(),
              notes: p.notes || "",
            },
          };
          renderApp();
        });
      });

      // Modal close (X + Cancel)
      document.querySelectorAll("[data-fit-modal-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          fit.editModal = null;
          fit.advanceModal = null;
          fit.uploadModalStage = null;
          fit.uploadState = { preview: null, errors: null, parsedRows: null };
          renderApp();
        });
      });

      // Edit modal: field updates
      document.querySelectorAll("[data-fit-edit-field]").forEach((el) => {
        el.addEventListener("input", () => {
          if (!fit.editModal) return;
          const k = el.getAttribute("data-fit-edit-field");
          if (!k) return;
          fit.editModal.form[k] = el.value;
        });
        el.addEventListener("change", () => {
          if (!fit.editModal) return;
          const k = el.getAttribute("data-fit-edit-field");
          if (!k) return;
          fit.editModal.form[k] = el.value;
        });
      });

      document.querySelectorAll("[data-fit-edit-save]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const em = fit.editModal;
          if (!em) return;
          const f = em.form || {};
          const isNew = !!em.isNew;
          const stage = Number(isNew ? em.stage : (fit.patients.find((x) => Number(x.id) === Number(em.patientId))?.stage || 1));

          if (isNew) {
            const ncssRef = String(f.ncssRef || "").trim();
            if (!ncssRef) {
              alert("NCSS Reference is required.");
              return;
            }
            if (stage === 2 && !String(f.dispatchDate || "").trim()) {
              alert("Dispatch date required.");
              return;
            }
            if (stage === 3 && !String(f.labRef || "").trim()) {
              alert("Lab reference required.");
              return;
            }
            if (stage === 4 && !String(f.result || "").trim()) {
              alert("Result required.");
              return;
            }
            const id = Number(fit.nextId || 1);
            fit.nextId = id + 1;
            fit.patients = [
              ...fit.patients,
              {
                id,
                stage,
                ncssRef,
                name: String(f.name || "").trim(),
                nric: String(f.nric || "").trim(),
                dob: String(f.dob || "").trim(),
                age: Number.parseInt(f.age, 10) || 0,
                gender: String(f.gender || "").trim(),
                mobile: String(f.mobile || "").trim(),
                address: String(f.address || "").trim(),
                dispatchDate: String(f.dispatchDate || "").trim(),
                labRef: String(f.labRef || "").trim(),
                receivedDate: String(f.receivedDate || "").trim(),
                result: String(f.result || "").trim(),
                resultDate: String(f.resultDate || "").trim(),
                notes: String(f.notes || "").trim(),
              },
            ];
          } else {
            const pid = Number(em.patientId);
            fit.patients = fit.patients.map((p) => {
              if (Number(p.id) !== pid) return p;
              const st = Number(p.stage);
              if (st === 1) {
                return {
                  ...p,
                  name: f.name || p.name,
                  age: Number.parseInt(f.age, 10) || p.age,
                  nric: f.nric,
                  gender: f.gender,
                  dob: f.dob,
                  mobile: f.mobile,
                  address: f.address,
                  notes: f.notes,
                };
              }
              if (st === 2) return { ...p, dispatchDate: f.dispatchDate, notes: f.notes };
              if (st === 3) return { ...p, labRef: f.labRef, receivedDate: f.receivedDate, notes: f.notes };
              if (st === 4) return { ...p, result: f.result, resultDate: f.resultDate, notes: f.notes };
              return p;
            });
          }
          fit.editModal = null;
          showToast("Data Updated");
          renderApp();
        });
      });

      // Advance modal fields
      document.querySelectorAll("[data-fit-adv-field]").forEach((el) => {
        el.addEventListener("input", () => {
          if (!fit.advanceModal) return;
          const k = el.getAttribute("data-fit-adv-field");
          if (!k) return;
          fit.advanceModal.form[k] = el.value;
        });
        el.addEventListener("change", () => {
          if (!fit.advanceModal) return;
          const k = el.getAttribute("data-fit-adv-field");
          if (!k) return;
          fit.advanceModal.form[k] = el.value;
        });
      });

      document.querySelectorAll("[data-fit-adv-save]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const am = fit.advanceModal;
          if (!am) return;
          const pid = Number(am.patientId);
          const toStage = Number(am.toStage);
          const f = am.form || {};
          if (toStage === 2 && !String(f.dispatchDate || "").trim()) {
            alert("Dispatch date required.");
            return;
          }
          if (toStage === 3 && !String(f.labRef || "").trim()) {
            alert("Lab reference required.");
            return;
          }
          if (toStage === 4 && !String(f.result || "").trim()) {
            alert("Result required.");
            return;
          }
          fit.patients = fit.patients.map((p) => {
            if (Number(p.id) !== pid) return p;
            const patch =
              toStage === 2
                ? { dispatchDate: f.dispatchDate }
                : toStage === 3
                  ? { labRef: f.labRef, receivedDate: f.receivedDate }
                  : { result: f.result, resultDate: f.resultDate, labRef: f.labRef || p.labRef };
            return { ...p, ...patch, notes: f.notes, stage: toStage };
          });
          fit.advanceModal = null;
          showToast("Data Updated");
          renderApp();
        });
      });

      // Upload modal: template + file selection + drop + confirm
      document.querySelectorAll("[data-fit-download-template]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const sid = Number(btn.getAttribute("data-fit-download-template") || 0);
          if (sid) fitDownloadTemplate(sid);
        });
      });

      const upInput = byId("fit-upload-input");
      if (upInput && upInput instanceof HTMLInputElement) {
        upInput.addEventListener("change", () => {
          const f = upInput.files && upInput.files[0];
          if (f) fitHandleCsvFile(f, fit.uploadModalStage);
        });
      }

      const dz = document.querySelector("[data-fit-upload-dropzone]");
      if (dz && dz instanceof HTMLElement) {
        dz.addEventListener("click", () => {
          byId("fit-upload-input")?.click();
        });
        dz.addEventListener("dragover", (e) => {
          e.preventDefault();
          dz.classList.add("is-drag");
        });
        dz.addEventListener("dragleave", () => {
          dz.classList.remove("is-drag");
        });
        dz.addEventListener("drop", (e) => {
          e.preventDefault();
          dz.classList.remove("is-drag");
          const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
          if (f) fitHandleCsvFile(f, fit.uploadModalStage);
        });
      }

      document.querySelectorAll("[data-fit-upload-confirm]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          fitConfirmUpload();
        });
      });
    }

    if (state.route === "bishanClinics" && typeof window.WD_bishanScreening !== "undefined" && state.bishanScreening) {
      const bcRoot = document.getElementById("bishan-screening-root");
      if (bcRoot) {
        const commitBishan = () => {
          const ae = document.activeElement;
          const wasTypingInSearch = ae instanceof HTMLInputElement && ae.hasAttribute("data-bc-search");
          const selStart = wasTypingInSearch ? ae.selectionStart : null;
          const selEnd = wasTypingInSearch ? ae.selectionEnd : null;

          renderApp();

          if (wasTypingInSearch) {
            requestAnimationFrame(() => {
              const root = document.getElementById("bishan-screening-root");
              const next = root?.querySelector?.("[data-bc-search]");
              if (!(next instanceof HTMLInputElement)) return;
              next.focus();
              if (selStart != null && selEnd != null) {
                try {
                  next.setSelectionRange(selStart, selEnd);
                } catch {}
              }
            });
          }
        };
        window.WD_bishanScreening.bindScreening(bcRoot, {
          getState: () => state.bishanScreening,
          commit: commitBishan,
        });

        // Defensive: ensure the toolbar search always updates state even if delegated handlers miss the event.
        const bcSearch = bcRoot.querySelector("[data-bc-search]");
        if (bcSearch instanceof HTMLInputElement && bcSearch.dataset.wdBound !== "1") {
          bcSearch.dataset.wdBound = "1";
          bcSearch.addEventListener("input", () => {
            state.bishanScreening.search = bcSearch.value;
            commitBishan();
          });
        }
      }
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
    if (typeof window.WD_initTimeInputs === "function") {
      window.WD_initTimeInputs(document.getElementById("app"));
    }
    if (typeof window.WD_initNricFields === "function") {
      window.WD_initNricFields(document.getElementById("app"));
    }
    ensureRegistrationPrefLangGlobalUi();
    initRegistrationPrefLangWidgets(document.getElementById("app"));
    const regForm = document.getElementById("registration-form");
    bindRegistrationClientLookup(regForm instanceof HTMLFormElement ? regForm : null);

    window.__WD_PORTAL_TICK__ = (window.__WD_PORTAL_TICK__ || 0) + 1;
    window.dispatchEvent(new CustomEvent("wd-portal-update"));
  }

  function installDelegatedAppListeners() {
    if (window.__WD_PORTAL_DELEGATION_BOUND) return;
    window.__WD_PORTAL_DELEGATION_BOUND = true;

    const rootEl = document.getElementById("app");
    document.addEventListener("click", (e) => {
    const raw = e.target;
    const el = raw instanceof Element ? raw : raw?.parentElement;

    const programOpt = el?.closest("[data-program-option]");
    if (programOpt) {
      e.stopPropagation();
      state.program = programOpt.getAttribute("data-program-option");
      state.programMenuOpen = false;
      renderApp();
      return;
    }

    if (state.route === "list") {
      const exportToggle = el?.closest("[data-export-menu-toggle]");
      if (exportToggle) {
        e.stopPropagation();
        state.exportMenuOpen = !state.exportMenuOpen;
        renderApp();
        return;
      }
      const addProspectT = el?.closest("[data-add-prospect-toggle]");
      if (addProspectT) {
        e.stopPropagation();
        state.addProspectMenuOpen = !state.addProspectMenuOpen;
        renderApp();
        return;
      }
      const actToggle = el?.closest("[data-prospect-list-actions-toggle]");
      if (actToggle) {
        e.stopPropagation();
        const rk = actToggle.getAttribute("data-prospect-list-actions-toggle");
        if (!rk) return;
        state.prospectListActionsOpenRowKey = state.prospectListActionsOpenRowKey === rk ? null : rk;
        renderApp();
        return;
      }
      if (el?.closest("#btn-list-filters")) {
        state.filterModal = true;
        renderApp();
        return;
      }
      const viewBtn = el?.closest("[data-view]");
      if (viewBtn) {
        const v = viewBtn.getAttribute("data-view");
        if (v) {
          state.view = v;
          setStoredListView(state.view);
          const h = state.view === "kanban" ? "#/kanban" : "#/list";
          if (location.hash !== h) location.hash = h;
          else renderApp();
        }
        return;
      }
      const sortBtn = el?.closest("[data-list-sort]");
      if (sortBtn) {
        const k = sortBtn.getAttribute("data-list-sort");
        if (!k) return;
        if (state.listSort.key === k) {
          state.listSort.dir = state.listSort.dir === "asc" ? "desc" : "asc";
        } else {
          state.listSort.key = k;
          state.listSort.dir = "asc";
        }
        renderApp();
        return;
      }
      const kpiHit = el?.closest("[data-prospect-kpi]");
      if (kpiHit) {
        e.preventDefault();
        applyProspectListKpiFromEl(kpiHit);
        return;
      }
      const kanbanCard = el?.closest("[data-kanban-card]");
      if (kanbanCard) {
        const rk = kanbanCard.getAttribute("data-kanban-prospect");
        if (rk) location.hash = `#/prospect/${encodeURIComponent(rk)}/screening`;
        return;
      }
    }

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
          root.querySelectorAll("[data-detail-multi-select]").forEach((host) => {
            const k = host.getAttribute("data-detail-multi-select");
            if (!k) return;
            const parts = [];
            const multi =
              host instanceof HTMLSelectElement && host.multiple
                ? host
                : host.querySelector && host.querySelector("select[multiple]");
            if (multi instanceof HTMLSelectElement) {
              Array.from(multi.selectedOptions).forEach((o) => {
                const v = String(o.value || "").trim();
                if (v) parts.push(v);
              });
            } else {
              host.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
                if (cb.checked) parts.push(cb.value);
              });
            }
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
          if (stateKey === "details") {
            const nowIso = new Date().toISOString();
            const by = PORTAL_CURRENT_USER.name;
            state.detail.lastUpdated = nowIso;
            state.detail.lastUpdatedBy = by;
            const prow = PROSPECTS.find((x) => x.rowKey === state.detail.rowKey);
            if (prow) {
              prow.profileLastUpdatedAt = nowIso;
              prow.profileLastUpdatedBy = by;
            }
          }
          pushProspectActivityTimeline(state.detail.rowKey, {
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
      const notesPageBtn = el?.closest?.("[data-detail-notes-page]");
      const onNotesTab =
        (state.route === "detail" && state.detailTab === "notes") ||
        (state.route === "prospectv3" && state.prospectV3Tab === "notes");
      if (notesPageBtn && onNotesTab) {
        e.preventDefault();
        const rowKey = state.detail?.rowKey || state.detail?.id || "";
        if (!rowKey) return;
        const raw = notesPageBtn.getAttribute("data-detail-notes-page");
        const p = Number(raw || 1);
        if (!Number.isFinite(p) || p < 1) return;
        state.detailNotesPageByProspect[rowKey] = p;
        renderApp();
        return;
      }

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
        if (nid) {
          const rk = state.detail.rowKey;
          deleteDetailNote(rk, nid);
          state.detailNotesPageByProspect[rk] = 1;
        }
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
        state.detailNotesPageByProspect[rk] = 1;
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
      (state.route === "prospectv3" && state.prospectV3Tab === "screenings") ||
      state.route === "list" ||
      state.route === "screening";
    const classicUpdBtn = el?.closest("[data-classic-screening-update]");
    if (classicUpdBtn && classicScrTable) {
      e.preventDefault();
      const sid = classicUpdBtn.getAttribute("data-classic-screening-update");
      if (!sid) return;
      state.prospectListActionsOpenRowKey = null;
      state.classicScreeningTasksModalId = null;
      state.classicScreeningUpdateModalId = sid;
      renderApp();
      requestAnimationFrame(() => {
        const modal = document.getElementById("classic-screening-update-modal");
        if (typeof window.WD_initDateInputs === "function") {
          window.WD_initDateInputs(modal || document.getElementById("app"));
        }
        document.getElementById("csu-submitted")?.focus();
      });
      return;
    }

    const classicTasksBtn = el?.closest("[data-classic-screening-tasks]");
    if (classicTasksBtn && classicScrTable) {
      e.preventDefault();
      const sid = classicTasksBtn.getAttribute("data-classic-screening-tasks");
      if (!sid) return;
      state.prospectListActionsOpenRowKey = null;
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

  if (rootEl) {
  rootEl.addEventListener("change", (e) => {
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

    rootEl.addEventListener("input", (e) => {
      const t = e.target;
      if (!(t instanceof HTMLInputElement) || !t.classList.contains("prospect-docs__search-input")) return;
      filterProspectDocsTable(t.value);
    });
  }

    document.addEventListener("keydown", (e) => {
      const raw = e.target;
      const el = raw instanceof Element ? raw : raw?.parentElement;
      if (state.route === "list") {
        const kpiHit = el?.closest("[data-prospect-kpi]");
        if (kpiHit && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          applyProspectListKpiFromEl(kpiHit);
          return;
        }
      }
      if (e.key !== "Enter") return;
      const row = el?.closest("tr[data-nav-prospect]");
      if (row) {
        const id = row.getAttribute("data-nav-prospect");
        if (id) location.hash = `#/prospect/${encodeURIComponent(id)}/screening`;
      }
    });

    document.addEventListener("click", (e) => {
      const prog = document.getElementById("program-title-dropdown");
      if (state.programMenuOpen && prog && !prog.contains(e.target)) {
        state.programMenuOpen = false;
        renderApp();
      }
      const exportDd = document.getElementById("export-dropdown");
      if (state.exportMenuOpen && exportDd && !exportDd.contains(e.target)) {
        state.exportMenuOpen = false;
        renderApp();
      }
      const addDd = document.getElementById("add-prospect-dropdown");
      if (state.addProspectMenuOpen && addDd && !addDd.contains(e.target)) {
        state.addProspectMenuOpen = false;
        renderApp();
      }
      if (state.prospectListActionsOpenRowKey) {
        const t = e.target;
        const inside = t instanceof Element && t.closest("[data-prospect-list-actions]");
        if (!inside) {
          state.prospectListActionsOpenRowKey = null;
          renderApp();
        }
      }
    });

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
      if (state.prospectListActionsOpenRowKey) {
        state.prospectListActionsOpenRowKey = null;
        renderApp();
        return;
      }
      if (state.exportMenuOpen) {
        state.exportMenuOpen = false;
        renderApp();
        return;
      }
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
  }

  function bootstrapDefaultHash() {
    const hash = getRouteHash();
    const hasRoutableFragment = Boolean(hash && hash !== "#" && !/^#\/?$/.test(hash));
    if (!hasRoutableFragment) {
      history.replaceState(null, "", `${location.pathname}${location.search}#/list`);
    }
  }

  function installPortalApi() {
    window.__WD_PORTAL_API__ = {
      state,
      renderApp,
      PROGRAMS,
      PIPELINE_KEYS,
      getFilteredProspects,
      getListTableRows,
      getProspectsForSummaryCounts,
      listFilterCategoryCount,
      computeProspectListSummary,
      programTitle,
      programDisplayLabel,
      prospectAppointmentTypeDisplayLabel,
      formatDateRegisteredDisplay,
      classicScreeningAttendanceDisplay,
      formatProspectListSubline,
      kanbanCardNextReview,
      kanbanCardProgress,
      kanbanCardMetaLine,
      kanbanProgramPillText,
      isFirstTimeScreenerProspect,
      riskLevelIndicator,
      pickClassicScreeningRecordIdForListProgram,
      escapeAttr,
      icons,
      statusPill,
      renderSortableTh,
    };
  }

  export function initPortal() {
    if (window.__WD_PORTAL_INIT) return;
    window.__WD_PORTAL_INIT = true;
    window.WD_buildPreferredLanguagesMultiHtml = buildPreferredLanguagesMultiHtml;
    window.WD_renderAppBreadcrumb = renderAppBreadcrumb;
    bootstrapDefaultHash();
    installPortalApi();
    installDelegatedAppListeners();
    renderApp();
    window.addEventListener("hashchange", renderApp);
  }
