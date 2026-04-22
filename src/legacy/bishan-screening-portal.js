/**
 * Bishan Cancer Screening Services — worklist + patient chart (from ScreeningPortal_artifact.jsx).
 * Renders inside portal shell only (no local app header bar).
 */
(function (global) {
  "use strict";

  const STAGES = [
    "appointment",
    "no_show",
    "no_test",
    "cancelled",
    "pending_result",
    "doctor_input",
    "pending_print",
    "complete",
  ];
  const SLABELS = {
    appointment: "Booked",
    no_show: "No Show",
    no_test: "No Test",
    cancelled: "Cancelled",
    pending_result: "Pending Result",
    doctor_input: "Doctor Input",
    pending_print: "Pending Print",
    complete: "Complete",
  };
  const TLABELS = {
    mammogram: "Mammogram",
    hpv: "HPV Test",
    pap: "Pap Test",
    hpv_vaccine: "HPV Vaccine",
    breast_exam: "Breast Exam",
  };
  const RESULTS = ["Normal (Negative)", "Changes Detected (Positive)"];
  const PAP_CLASSES = ["Negative", "ASCUS", "LSIL", "HSIL", "Unsatisfactory"];
  const BIRADS = [
    "BI-RADS 0",
    "BI-RADS 1",
    "BI-RADS 2",
    "BI-RADS 3",
    "BI-RADS 4",
    "BI-RADS 5",
    "BI-RADS 6",
  ];
  const HPV_ADVICE_OPTS = ["Routine recall", "Repeat test in 6 months", "Refer for colposcopy", "Other"];
  const PAP_ADVICE_OPTS = ["Routine recall", "Repeat Pap in 6 months", "Refer for colposcopy", "Other"];
  const VAX_SEQ_OPTS = ["Dose 1", "Dose 2", "Dose 3"];
  const VAX_PRODUCT_OPTS = ["Gardasil 4", "Gardasil 9", "Cervarix"];
  const VAX_SITE_OPTS = ["Left Deltoid", "Right Deltoid", "Left Thigh", "Right Thigh"];
  const YESNO = ["Yes", "No"];
  const BREAST_OUTCOME_OPTS = [
    "Normal",
    "Benign finding",
    "Requires further assessment",
    "Refer for ultrasound",
    "Refer for biopsy",
  ];
  const COLLECTION_MODE_OPTS = ["In-clinic", "Home kit", "Outreach"];
  const INTERVALS = ["6 months", "1 year", "2 years", "3 years", "Not Required"];
  const CONTACT_OPTS = ["Call", "SMS", "Email", "WhatsApp"];
  // Referral source (how patient found the clinic) — aligned to handover docs.
  const REFERRAL_OPTS = ["Offsite Event", "Outreach Event", "Phone Call", "Online Request", "Email", "Duelist", "Others"];
  const REFERRAL_REC_OPTS = [
    "None",
    "Refer to Specialist",
    "Repeat Screening in 3 Months",
    "Repeat Screening in 6 Months",
    "Refer for Biopsy",
    "Refer for Colposcopy",
    "Refer for Ultrasound",
    "Refer for Further Imaging",
    "Follow up with GP",
  ];
  const PAP_LAST_OPTS = ["NA", "Less than 1 year ago", "1-3 years ago", "More than 3 years ago", "Never"];
  const DOCTOR_NOTES = [
    "No abnormalities detected.",
    "Routine screening completed.",
    "Mild tenderness noted.",
    "Sample collected without complications.",
    "Patient cooperative throughout.",
    "Examination unremarkable.",
    "Previous benign cyst noted.",
    "Patient in good health.",
  ];
  const RCYCLE = ["Normal (Negative)", "Normal (Negative)", "Normal (Negative)", "Changes Detected (Positive)"];
  const STAGE_CHIP = {
    appointment: { bg: "#E8EFFD", tx: "#2255A4", dot: "#4A7FD4" },
    pending_result: { bg: "#FEF3C7", tx: "#92400E", dot: "#F59E0B" },
    doctor_input: { bg: "#FEF3C7", tx: "#92400E", dot: "#F59E0B" },
    pending_print: { bg: "#FEF3C7", tx: "#92400E", dot: "#F59E0B" },
    complete: { bg: "#F3F4F6", tx: "#6B7280", dot: "#9CA3AF" },
    no_show: { bg: "#FEF2F2", tx: "#991B1B", dot: "#EF4444" },
    no_test: { bg: "#FEF2F2", tx: "#991B1B", dot: "#EF4444" },
    cancelled: { bg: "#F3F4F6", tx: "#6B7280", dot: "#9CA3AF" },
  };
  const TYPE_CHIP = {
    mammogram: { bg: "#E8EFFD", tx: "#2255A4", label: "Mammogram" },
    hpv: { bg: "#FCEAF1", tx: "#9B1550", label: "HPV Test" },
    pap: { bg: "#EDE8F5", tx: "#5B2D8E", label: "Pap Test" },
    hpv_vaccine: { bg: "#F3F4F6", tx: "#374151", label: "HPV Vaccine" },
    breast_exam: { bg: "#F3F4F6", tx: "#374151", label: "Breast Exam" },
  };
  const FN = "Sarah Mei Ling Linda Adeline Josephine Grace Rachel Cynthia Vivian Helen Irene Patricia Angela Doris Betty Christine Esther Frances Gloria Hazel Ivy Janet Karen Laura Margaret Nancy Olivia Pamela Queenie Rose Susan Teresa Uma Valerie Wendy Xiuying Yvonne Zoe Alice Brenda Carol Diana Elena Fiona Gina Hannah Ingrid Joyce Kim Lisa Monica Nora Ophelia Penny Rita Stella Tina Ursula Veronica Winifred Xiulan Yolanda Zara Amy Barbara Cindy Deborah Elaine Florence Georgia Holly Irma June Kelly Lynn Mabel Nadine Opal Pearl Quinn Renee Sandra Tracey Una Victoria Wilma Xin Yu Ting Zi Ling Aisha Bala Champa Deepa Esmeralda Fatimah Geetha Hamidah Indira Jasmine".split(
    " "
  );
  const LN = "Tan Wong Lim Koh Lee Ng Chua Ong Teo Goh Chong Tay Ho Yeo Loh Cheong Phua Soh Wee Seah".split(" ");
  const PTYPES = ["mammogram", "mammogram", "mammogram", "hpv", "hpv", "pap", "pap", "pap", "hpv_vaccine", "breast_exam"];

  function nowSGT() {
    const utc = Date.now() + new Date().getTimezoneOffset() * 60000;
    return new Date(utc + 8 * 3600000);
  }
  function todaySGT() {
    const n = nowSGT();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
  }
  function isSlotPast(ds, sm) {
    const td = todaySGT();
    const n = nowSGT();
    if (ds < td) return true;
    if (ds > td) return false;
    return n.getHours() * 60 + n.getMinutes() >= sm + 15;
  }
  let TODAY = todaySGT();
  function gid() {
    return Math.random().toString(36).slice(2, 9);
  }
  function parseDt(s) {
    const [y, m, d] = String(s).split("-");
    return new Date(Number(y), Number(m) - 1, Number(d));
  }
  function fmtDate(s) {
    if (!s) return "—";
    if (s === "not_required") return "Not Required";
    try {
      return parseDt(s).toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return s;
    }
  }
  /** e.g. 2026-04-16 → "16 Apr 2026" (for Bishan header). */
  function fmtCalHeading(iso) {
    if (!iso) return "—";
    try {
      const [y, m, d] = String(iso).split("-");
      const dt = new Date(Number(y), Number(m) - 1, Number(d));
      return dt.toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return iso;
    }
  }

  /** e.g. 2026-04-20 → "20/04/2026" (for sidebar date field). */
  function fmtDdMmYyyy(iso) {
    if (!iso) return "";
    try {
      const [y, m, d] = String(iso).split("-");
      if (!y || !m || !d) return "";
      return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${String(y)}`;
    } catch {
      return "";
    }
  }
  /** Labels aligned with staging Bishan worklist (werkdone prospect admin). */
  const STAGE_UI_LABEL = {
    appointment: "Booked",
    no_show: "No Show",
    no_test: "No Test",
    cancelled: "Cancelled",
    pending_result: "Pending Result",
    doctor_input: "Doctor Input",
    pending_print: "Pending Print",
    complete: "Complete",
  };
  function stageUiLabel(stage) {
    return STAGE_UI_LABEL[stage] || SLABELS[stage] || stage;
  }
  function slotLbl(m) {
    return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  }
  function allSlots() {
    const s = [];
    for (let m = 480; m < 1020; m += 15) s.push(m);
    return s;
  }
  function dateSlotKey(dateIso, slotMins) {
    return `${String(dateIso || "").trim()}:${String(slotMins || "").trim()}`;
  }
  function slotVisitsForDateSlot(visits, dateIso, slotMins, excludeVisitId) {
    return (visits || []).filter((v) => v && v.date === dateIso && v.slot === slotMins && (!excludeVisitId || v.id !== excludeVisitId));
  }
  function isVisitMammogram(v) {
    const t = v && (v.screeningType || v.type);
    return t === "mammogram";
  }
  // BR-01: slot capacity is 2, only one mammogram + one non-mammogram allowed.
  function isSlotFull(allVisits, dateIso, slotMins, newType, excludeVisitId) {
    const existing = slotVisitsForDateSlot(allVisits, dateIso, slotMins, excludeVisitId);
    if (!existing.length) return false;
    if (existing.length >= 2) return true;
    const existingType = existing[0]?.screeningType || existing[0]?.type;
    const bothMammo = existingType === "mammogram" && newType === "mammogram";
    const bothNonMammo = existingType !== "mammogram" && newType !== "mammogram";
    return bothMammo || bothNonMammo;
  }
  function fd(y, m, d) {
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
  function rnd(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }
  function inits(n) {
    return String(n || "")
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
  function addInt(ds, iv) {
    if (iv === "Not Required") return "not_required";
    const d = parseDt(ds);
    if (iv === "6 months") d.setMonth(d.getMonth() + 6);
    else if (iv === "1 year") d.setFullYear(d.getFullYear() + 1);
    else if (iv === "2 years") d.setFullYear(d.getFullYear() + 2);
    else if (iv === "3 years") d.setFullYear(d.getFullYear() + 3);
    return fd(d.getFullYear(), d.getMonth() + 1, d.getDate());
  }

  function isEmptyFieldValue(v) {
    if (v == null) return true;
    const s = String(v).trim();
    return s === "" || s === "—";
  }
  function getMandatoryFieldsForType(typeKey) {
    const t = String(typeKey || "").trim();
    // Mammogram skips doctor_input.
    if (t === "mammogram") return [];
    const common = [
      { key: "doctorName", label: "Doctor Name", section: "Doctor Details" },
      { key: "referralRec", label: "Referral Recommendation", section: "Referral" },
      { key: "reviewInterval", label: "Next Appointment In", section: "Result Details" },
      { key: "nextApt", label: "Next Appointment Date", section: "Result Details" },
    ];
    if (t === "hpv") return [...common, { key: "hpvAdvice", label: "Advice", section: "HPV Test Result Details" }];
    if (t === "pap")
      return [
        ...common,
        { key: "papResultClass", label: "Pap Result", section: "Pap Test Result Details" },
        { key: "papTestResultText", label: "Pap Test Result", section: "Pap Test Result Details" },
        { key: "hpvAdvice", label: "Advice", section: "Pap Test Result Details" },
      ];
    if (t === "hpv_vaccine")
      return [
        ...common,
        { key: "immunisationSequence", label: "Immunisation Sequence", section: "HPV Vaccination Details" },
        { key: "hpvVaccineProductName", label: "HPV Vaccination Product Name", section: "HPV Vaccination Details" },
        { key: "hpvVaccineBatchNo", label: "HPV Vaccination Batch No", section: "HPV Vaccination Details" },
        { key: "administrationSite", label: "Administration Site", section: "HPV Vaccination Details" },
        { key: "timeOfVaccination", label: "Time of Vaccination", section: "HPV Vaccination Details" },
        { key: "vaccineCompletedAck", label: "Vaccine Completed Acknowledgement", section: "HPV Vaccination Details" },
      ];
    if (t === "breast_exam")
      return [
        ...common,
        { key: "breastExamFindings", label: "Clinical Findings", section: "Breast Examination Chart" },
        { key: "breastExamOutcome", label: "Outcome", section: "Breast Examination Chart" },
      ];
    return common;
  }
  function getMissingMandatoryForVisit(v, typeKey) {
    const fields = getMandatoryFieldsForType(typeKey);
    return fields.filter((f) => isEmptyFieldValue(v && v[f.key]));
  }
  function addDaysIso(iso, n) {
    const d = parseDt(iso);
    d.setDate(d.getDate() + n);
    return fd(d.getFullYear(), d.getMonth() + 1, d.getDate());
  }
  /** Monday (YYYY-MM-DD) of the ISO calendar week containing `iso`, week starts Monday. */
  function mondayOfIso(iso) {
    const d = parseDt(iso);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return fd(d.getFullYear(), d.getMonth() + 1, d.getDate());
  }
  function sundayOfWeekFromMonday(monIso) {
    return addDaysIso(monIso, 6);
  }
  /** e.g. 12 – 18 Apr 2026 */
  function fmtWeekRangeDisplay(monIso, sunIso) {
    try {
      const a = parseDt(monIso);
      const b = parseDt(sunIso);
      const y = a.getFullYear();
      if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()) {
        const mo = a.toLocaleDateString("en-SG", { month: "short" });
        return `${a.getDate()} – ${b.getDate()} ${mo} ${y}`;
      }
      return `${a.toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" })} – ${b.toLocaleDateString(
        "en-SG",
        { day: "numeric", month: "short", year: "numeric" }
      )}`;
    } catch {
      return monIso;
    }
  }
  function weekGridSlotStarts() {
    const s = [];
    for (let m = 480; m <= 810; m += 30) s.push(m);
    return s;
  }
  function getWeekStartIso(bc) {
    if (bc.weekStartISO) return bc.weekStartISO;
    return mondayOfIso(bc.calDate);
  }
  function sgtOff(off) {
    const d = nowSGT();
    d.setDate(d.getDate() + off);
    return fd(d.getFullYear(), d.getMonth() + 1, d.getDate());
  }
  function isClin(t) {
    return t === "hpv" || t === "pap";
  }

  function buildData() {
    const pts = [];
    const vis = [];
    for (let i = 0; i < 100; i++) {
      const type = PTYPES[i % PTYPES.length];
      const clin = isClin(type);
      const by = 1955 + rnd(0, 35);
      pts.push({
        id: "p" + (i + 1),
        bishanCode: "BSH-" + String(i + 1).padStart(3, "0"),
        name: FN[i % FN.length] + " " + LN[i % LN.length],
        dob: fd(by, rnd(1, 12), rnd(1, 28)),
        nric: ["S", "T", "F", "G"][i % 4] + String(7000000 + i * 1234).slice(0, 7) + String.fromCharCode(65 + ((i * 7) % 26)),
        age: String(2026 - by),
        phone: "9" + String(1000000 + i * 9973).slice(0, 7),
        email: FN[i % FN.length].toLowerCase().replace(/\s/, "") + "" + i + "@email.com",
        type,
        contactPref: CONTACT_OPTS[i % 4],
        referral: REFERRAL_OPTS[i % REFERRAL_OPTS.length],
        sexualActivity: i % 5 === 0 ? "No" : "Yes",
        lastPap: clin ? PAP_LAST_OPTS[i % 5] : "",
        lastMenses: clin ? fd(2026, rnd(1, 4), rnd(1, 28)) : "",
      });
    }
    const usedSlots = {};
    function pickSlot(date) {
      const slots = allSlots().slice();
      for (let i = slots.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [slots[i], slots[j]] = [slots[j], slots[i]];
      }
      for (const s of slots) {
        const key = date + ":" + s;
        if (!usedSlots[key]) {
          usedSlots[key] = true;
          return s;
        }
      }
      return null;
    }
    const dates = [];
    for (let i = 0; i < 100; i++) {
      const off = Math.floor(i / 14) - 3;
      dates.push(sgtOff(Math.max(-7, Math.min(7, off))));
    }
    for (let i = 0; i < 100; i++) {
      const p = pts[i];
      const clin = isClin(p.type);
      const aptDate = dates[i];
      const aptSlot = pickSlot(aptDate);
      if (!aptSlot) continue;
      const isPast = isSlotPast(aptDate, aptSlot);
      const stOpts = ["pending_result", "doctor_input", "pending_print", "complete", "complete"];
      const noTest = isPast && i % 9 === 0;
      const stage = noTest ? "no_test" : isPast ? stOpts[i % stOpts.length] : "appointment";
      const hasRes = isPast && !noTest && (stage === "complete" || i % 3 === 0);
      vis.push({
        id: "v" + (i + 1),
        patientId: p.id,
        date: aptDate,
        slot: aptSlot,
        screeningType: p.type,
        stage,
        doctorNotes: isPast && !noTest ? DOCTOR_NOTES[i % DOCTOR_NOTES.length] : "",
        referralRec: isPast && !noTest ? (i % 4 === 0 ? "Refer to Specialist" : "None") : "",
        reviewInterval: hasRes ? INTERVALS[i % INTERVALS.length] : "",
        labFile: null,
        resultLabel: hasRes ? RCYCLE[i % 4] : "",
        nextApt: hasRes ? addInt(aptDate, INTERVALS[i % INTERVALS.length]) : "",
        attended: isPast && !noTest,
      });
      if (i % 2 === 0) {
        const hy = 2024 + Math.floor(i / 50);
        const hm = (i % 11) + 1;
        const hd = rnd(1, 28);
        const hDate = fd(hy, hm, hd);
        const hSlot = pickSlot(hDate);
        if (hSlot)
          vis.push({
            id: "vh" + i,
            patientId: p.id,
            date: hDate,
            slot: hSlot,
            screeningType: p.type,
            stage: ["complete", "complete", "pending_print"][i % 3],
            doctorNotes: clin ? DOCTOR_NOTES[(i + 3) % DOCTOR_NOTES.length] : "",
            referralRec: i % 3 === 0 ? "None" : "Refer to Specialist",
            reviewInterval: INTERVALS[(i + 2) % INTERVALS.length],
            labFile: null,
            resultLabel: RCYCLE[(i + 1) % 4],
            nextApt: fd(hy + 1, hm, hd),
            attended: true,
          });
      }
    }
    return { pts, vis };
  }

  /**
   * Replace the first N generated patients with demo profiles and give each a visit on `todayIso`
   * so the worklist / week views show varied screening types. Populates `detailSeedsOut`
   * keyed by patient id for Medical History / Other Details tabs.
   */
  function applyBishanShowcaseData(pts, vis, todayIso, detailSeedsOut) {
    const next = (interval) => addInt(todayIso, interval);
    const roster = [
      {
        patient: {
          name: "Monica Tay",
          dob: "1985-06-14",
          nric: "G7062934T",
          age: "41",
          phone: "8123 4567",
          email: "monica.tay@email.sg",
          type: "hpv",
          gender: "Female",
          nationality: "Singapore Citizen",
          preferredLanguage: "English",
          addressLine: "Blk 128 Bishan Street 12 #08-441",
          postalCode: "570128",
          emergencyName: "David Tay",
          emergencyPhone: "9123 0001",
          contactPref: "SMS",
          referral: "Friend / Family",
          sexualActivity: "Yes",
          lastPap: "1-3 years ago",
          lastMenses: "2026-04-10",
        },
        visit: {
          slot: 9 * 60 + 28,
          stage: "pending_result",
          attended: true,
          doctorNotes: "HPV self-sampling kit issued; sample collected without complications.",
          referralRec: "None",
          reviewInterval: "",
          resultLabel: "",
          nextApt: "",
        },
        detailSeed: {
          medicalHistory: {
            breastCancer: "No",
            colorectalCancer: "No",
            ovarianCancer: "No",
            otherCancer: "No",
            historyOfCancer: "No",
            diagnosedYear: "—",
            cancerDetail: "—",
            followUpAt: "—",
            surgery: "No",
            radiation: "No",
            chemo: "No",
          },
          otherDetails: {
            otherMedicalIllness: "Nil significant.",
            currentMedication: "Vitamin D 1000 IU once daily",
            drugAllergy: "No",
            highRiskImmuno: "No",
            ageFirstSexual: "18",
            multiplePartners: "No",
            smoking: "No",
            smokingDurationYrs: "0",
            stiHistory: "No",
            ocpYrs: "5",
            hpvVaccination: "Yes",
            cervicalOtherDetails: "Completed HPV vaccination (3 doses) in 2015. Attending routine recall at Bishan.",
            para: "2",
            lastPapTest: "12/08/2024",
            lastPapResult: "Negative",
            lastMammo: "—",
            menarche: "12",
            menopause: "",
            firstChildbirth: "30",
            hrtYrs: "0",
            preMalignantBreast: "No",
            breastConditionsDetail: "—",
          },
        },
      },
      {
        patient: {
          name: "Sarah Mei Lim",
          dob: "1979-03-22",
          nric: "S7903224C",
          age: "47",
          phone: "9234 1100",
          email: "sarah.lim.mammo@email.sg",
          type: "mammogram",
          gender: "Female",
          nationality: "Singapore Citizen",
          preferredLanguage: "English",
          addressLine: "Blk 245 Bishan Street 22 #12-102",
          postalCode: "570245",
          emergencyName: "Daniel Lim",
          emergencyPhone: "9001 2200",
          contactPref: "WhatsApp",
          referral: "Doctor Referral",
          sexualActivity: "Yes",
          lastPap: "",
          lastMenses: "",
        },
        visit: {
          slot: 8 * 60 + 45,
          stage: "appointment",
          attended: false,
          doctorNotes: "",
          referralRec: "None",
          reviewInterval: "",
          resultLabel: "",
          nextApt: "",
        },
        detailSeed: {
          medicalHistory: {
            breastCancer: "No",
            colorectalCancer: "No",
            ovarianCancer: "No",
            otherCancer: "No",
            historyOfCancer: "No",
            diagnosedYear: "—",
            cancerDetail: "—",
            followUpAt: "—",
            surgery: "No",
            radiation: "No",
            chemo: "No",
          },
          otherDetails: {
            otherMedicalIllness: "Mild hypertension — on losartan.",
            currentMedication: "Losartan 50 mg",
            drugAllergy: "No",
            highRiskImmuno: "No",
            ageFirstSexual: "",
            multiplePartners: "",
            smoking: "No",
            smokingDurationYrs: "0",
            stiHistory: "",
            ocpYrs: "",
            hpvVaccination: "",
            cervicalOtherDetails: "",
            para: "",
            lastPapTest: "",
            lastPapResult: "",
            lastMammo: "Never",
            menarche: "13",
            menopause: "",
            firstChildbirth: "29",
            hrtYrs: "0",
            preMalignantBreast: "No",
            breastConditionsDetail: "Benign fibroadenoma excised 2018 — histology benign.",
          },
        },
      },
      {
        patient: {
          name: "Nurul Huda Ahmad",
          dob: "1992-11-08",
          nric: "S9211081B",
          age: "33",
          phone: "8790 3344",
          email: "nurul.huda.pap@email.sg",
          type: "pap",
          gender: "Female",
          nationality: "Singapore Citizen",
          preferredLanguage: "English, Malay",
          addressLine: "Blk 510 Bishan Street 13 #04-88",
          postalCode: "570510",
          emergencyName: "Ahmad Rizal",
          emergencyPhone: "9812 4455",
          contactPref: "SMS",
          referral: "Poster / Flyer",
          sexualActivity: "Yes",
          lastPap: "More than 3 years ago",
          lastMenses: "2026-04-02",
        },
        visit: { slot: 9 * 60, stage: "appointment", attended: false, doctorNotes: "", referralRec: "None" },
        detailSeed: {
          medicalHistory: {
            breastCancer: "No",
            colorectalCancer: "No",
            ovarianCancer: "No",
            otherCancer: "No",
            historyOfCancer: "No",
            diagnosedYear: "—",
            cancerDetail: "—",
            followUpAt: "—",
            surgery: "No",
            radiation: "No",
            chemo: "No",
          },
          otherDetails: {
            otherMedicalIllness: "Nil.",
            currentMedication: "Nil",
            drugAllergy: "No",
            highRiskImmuno: "No",
            ageFirstSexual: "19",
            multiplePartners: "No",
            smoking: "No",
            smokingDurationYrs: "0",
            stiHistory: "No",
            ocpYrs: "3",
            hpvVaccination: "Yes",
            cervicalOtherDetails: "First Pap at SCS mobile unit; anxious but keen to complete screening.",
            para: "0",
            lastPapTest: "2019",
            lastPapResult: "Unknown / elsewhere",
            lastMammo: "—",
            menarche: "11",
            menopause: "",
            firstChildbirth: "",
            hrtYrs: "0",
            preMalignantBreast: "No",
            breastConditionsDetail: "—",
          },
        },
      },
      // Dummy pairing scenario: same 15-min slot shows multiple rows (Pap + Mammogram).
      {
        patient: {
          name: "Tan Mei Ling",
          dob: "1965-03-15",
          nric: "S6512345B",
          age: "61",
          phone: "9123 4567",
          email: "tan.meiling.mammo@email.sg",
          type: "mammogram",
          gender: "Female",
          nationality: "Singapore Citizen",
          preferredLanguage: "English, Mandarin",
          addressLine: "Blk 102 Bishan Street 12 #06-100",
          postalCode: "570102",
          emergencyName: "Tan Wei Ming",
          emergencyPhone: "9000 1122",
          contactPref: "SMS",
          referral: "Offsite Event",
          sexualActivity: "Yes",
          lastPap: "",
          lastMenses: "",
        },
        visit: { slot: 9 * 60, stage: "appointment", attended: false, doctorNotes: "", referralRec: "None" },
      },
      // Dummy pairing scenario: Breast Exam + Mammogram at 09:15.
      {
        patient: {
          name: "Zainab Bte Hassan",
          dob: "1978-12-04",
          nric: "S7812044K",
          age: "48",
          phone: "9012 3456",
          email: "zainab.breast@email.sg",
          type: "breast_exam",
          gender: "Female",
          nationality: "Singapore Citizen",
          preferredLanguage: "English, Malay",
          addressLine: "Blk 355 Bishan Street 31 #10-55",
          postalCode: "570355",
          emergencyName: "Hassan Ali",
          emergencyPhone: "9888 2233",
          contactPref: "Call",
          referral: "Outreach Event",
          sexualActivity: "Yes",
          lastPap: "1-3 years ago",
          lastMenses: "2026-04-06",
        },
        visit: { slot: 9 * 60 + 15, stage: "pending_result", attended: true, doctorNotes: "", referralRec: "None" },
      },
      {
        patient: {
          name: "Goh Swee Kim",
          dob: "1970-08-21",
          nric: "S7008212J",
          age: "56",
          phone: "9123 4560",
          email: "goh.sweekim.mammo@email.sg",
          type: "mammogram",
          gender: "Female",
          nationality: "Singapore Citizen",
          preferredLanguage: "English",
          addressLine: "Blk 19 Bishan Street 10 #03-88",
          postalCode: "570019",
          emergencyName: "Goh Wei Ren",
          emergencyPhone: "8777 3344",
          contactPref: "SMS",
          referral: "Phone Call",
          sexualActivity: "Yes",
          lastPap: "",
          lastMenses: "",
        },
        visit: { slot: 9 * 60 + 15, stage: "appointment", attended: false, doctorNotes: "", referralRec: "None" },
      },
      {
        patient: {
          name: "Priya Devi Krishnan",
          dob: "1988-07-30",
          nric: "T8807302Z",
          age: "37",
          phone: "9100 7788",
          email: "priya.devi@email.sg",
          type: "hpv",
          gender: "Female",
          nationality: "Permanent Resident",
          preferredLanguage: "English, Tamil",
          addressLine: "Blk 288 Bishan Street 24 #15-2201",
          postalCode: "570288",
          emergencyName: "Krishnan Muthu",
          emergencyPhone: "9456 0099",
          contactPref: "Call",
          referral: "Social Media",
          sexualActivity: "Yes",
          lastPap: "Less than 1 year ago",
          lastMenses: "2026-04-08",
        },
        visit: { slot: 10 * 60 + 15, stage: "appointment", attended: false, doctorNotes: "", referralRec: "None" },
      },
      {
        patient: {
          name: "Jennifer Koh",
          dob: "1966-01-19",
          nric: "S6601193D",
          age: "60",
          phone: "9888 2016",
          email: "j.koh.screening@email.sg",
          type: "mammogram",
          gender: "Female",
          nationality: "Singapore Citizen",
          preferredLanguage: "English",
          addressLine: "Blk 151 Bishan Street 11 #07-654",
          postalCode: "570151",
          emergencyName: "Marcus Koh",
          emergencyPhone: "8777 1033",
          contactPref: "Email",
          referral: "Friend / Family",
          sexualActivity: "Yes",
          lastPap: "",
          lastMenses: "",
        },
        visit: {
          slot: 10 * 60 + 45,
          stage: "doctor_input",
          attended: true,
          doctorNotes: "Bilateral mammogram reviewed; routine BIRADS 1–2 pattern. Patient advised on breast awareness.",
          referralRec: "None",
          reviewInterval: "",
          resultLabel: "Normal (Negative)",
          nextApt: "",
        },
      },
      {
        patient: {
          name: "Wei Ling Cheong",
          dob: "1974-05-05",
          nric: "S7405051A",
          age: "51",
          phone: "9366 5400",
          email: "weiling.cheong@email.sg",
          type: "pap",
          gender: "Female",
          nationality: "Singapore Citizen",
          preferredLanguage: "English, Mandarin",
          addressLine: "Blk 419 Shunfu Road #09-120",
          postalCode: "570419",
          emergencyName: "Cheong Wai Keong",
          emergencyPhone: "9221 8877",
          contactPref: "SMS",
          referral: "Doctor Referral",
          sexualActivity: "Yes",
          lastPap: "1-3 years ago",
          lastMenses: "2026-03-28",
        },
        visit: {
          slot: 11 * 60,
          stage: "pending_print",
          attended: true,
          doctorNotes: "Liquid-based cytology taken; counselling on results and recall interval completed.",
          referralRec: "None",
          reviewInterval: "1 year",
          resultLabel: "Normal (Negative)",
          nextApt: next("1 year"),
        },
      },
      {
        patient: {
          name: "Fatimah Noor",
          dob: "1990-09-12",
          nric: "S9009125E",
          age: "35",
          phone: "9012 7712",
          email: "fatimah.noor@email.sg",
          type: "hpv",
          gender: "Female",
          nationality: "Singapore Citizen",
          preferredLanguage: "English, Malay",
          addressLine: "Blk 229 Bishan Street 23 #03-412",
          postalCode: "570229",
          emergencyName: "Noor Aisyah",
          emergencyPhone: "9855 1200",
          contactPref: "WhatsApp",
          referral: "Social Media",
          sexualActivity: "Yes",
          lastPap: "Never",
          lastMenses: "2026-04-12",
        },
        visit: {
          slot: 11 * 60 + 30,
          stage: "complete",
          attended: true,
          doctorNotes: "HPV DNA negative. Routine recall discussed.",
          referralRec: "None",
          reviewInterval: "3 years",
          resultLabel: "Normal (Negative)",
          nextApt: next("3 years"),
        },
      },
      {
        patient: {
          name: "Angela Tan",
          dob: "1959-12-02",
          nric: "S5912021H",
          age: "66",
          phone: "9677 3300",
          email: "angela.tan@email.sg",
          type: "mammogram",
          gender: "Female",
          nationality: "Singapore Citizen",
          preferredLanguage: "English",
          addressLine: "Blk 282 Bishan Street 22 #16-88",
          postalCode: "570282",
          emergencyName: "Tan Wei Jie",
          emergencyPhone: "8123 9900",
          contactPref: "Call",
          referral: "Poster / Flyer",
          sexualActivity: "Yes",
          lastPap: "",
          lastMenses: "",
        },
        visit: {
          slot: 13 * 60,
          stage: "complete",
          attended: true,
          doctorNotes: "Tomosynthesis screening unremarkable. Patient comfortable with technique.",
          referralRec: "None",
          reviewInterval: "2 years",
          resultLabel: "Normal (Negative)",
          nextApt: next("2 years"),
        },
      },
      {
        patient: {
          name: "Lisa Wong",
          dob: "1982-04-18",
          nric: "S8204186G",
          age: "44",
          phone: "9223 6618",
          email: "lisa.wong@email.sg",
          type: "pap",
          gender: "Female",
          nationality: "Singapore Citizen",
          preferredLanguage: "English",
          addressLine: "Blk 131 Bishan Street 12 #10-305",
          postalCode: "570131",
          emergencyName: "Wong Kai Ming",
          emergencyPhone: "9009 4412",
          contactPref: "Email",
          referral: "Friend / Family",
          sexualActivity: "Yes",
          lastPap: "Less than 1 year ago",
          lastMenses: "2026-04-05",
        },
        visit: {
          slot: 13 * 60 + 45,
          stage: "complete",
          attended: true,
          doctorNotes: "Screening Pap completed; patient advised on red-flag symptoms.",
          referralRec: "Repeat Screening in 6 Months",
          reviewInterval: "6 months",
          resultLabel: "Changes Detected (Positive)",
          nextApt: next("6 months"),
        },
      },
      {
        patient: {
          name: "Suresh Kumar",
          dob: "1995-02-28",
          nric: "T9502288F",
          age: "31",
          phone: "8133 2201",
          email: "suresh.k@email.sg",
          type: "hpv",
          gender: "Female",
          nationality: "Permanent Resident",
          preferredLanguage: "English",
          addressLine: "Blk 502 Bishan Street 11 #06-1402",
          postalCode: "570502",
          emergencyName: "Kumar Raj",
          emergencyPhone: "8188 3344",
          contactPref: "SMS",
          referral: "Other",
          sexualActivity: "Yes",
          lastPap: "NA",
          lastMenses: "2026-04-01",
        },
        visit: {
          slot: 14 * 60,
          stage: "no_test",
          attended: false,
          doctorNotes: "Did not attend — called twice, left voicemail.",
          referralRec: "None",
          reviewInterval: "",
          resultLabel: "",
          nextApt: "",
        },
      },
      {
        patient: {
          name: "Hannah Yeo",
          dob: "1971-08-14",
          nric: "S7108142I",
          age: "54",
          phone: "9777 8899",
          email: "hannah.yeo@email.sg",
          type: "mammogram",
          gender: "Female",
          nationality: "Singapore Citizen",
          preferredLanguage: "English",
          addressLine: "Blk 155 Bishan Street 13 #05-771",
          postalCode: "570155",
          emergencyName: "Yeo Han Wei",
          emergencyPhone: "9333 1020",
          contactPref: "WhatsApp",
          referral: "Social Media",
          sexualActivity: "Yes",
          lastPap: "",
          lastMenses: "",
        },
        visit: {
          slot: 14 * 60 + 30,
          stage: "no_test",
          attended: false,
          doctorNotes: "No-show for booked slot; SMS sent for rebooking.",
          referralRec: "None",
          reviewInterval: "",
          resultLabel: "",
          nextApt: "",
        },
      },
      {
        patient: {
          name: "Chloe Ng",
          dob: "1987-10-03",
          nric: "S8710034J",
          age: "38",
          phone: "9444 5566",
          email: "chloe.ng@email.sg",
          type: "pap",
          gender: "Female",
          nationality: "Singapore Citizen",
          preferredLanguage: "English",
          addressLine: "Blk 273 Bishan Street 24 #08-1903",
          postalCode: "570273",
          emergencyName: "Ng Zhi Hao",
          emergencyPhone: "9011 7788",
          contactPref: "SMS",
          referral: "Doctor Referral",
          sexualActivity: "Yes",
          lastPap: "1-3 years ago",
          lastMenses: "2026-04-14",
        },
        visit: {
          slot: 15 * 60,
          stage: "no_test",
          attended: false,
          doctorNotes: "Did not attend — patient message received citing work conflict.",
          referralRec: "None",
          reviewInterval: "",
          resultLabel: "",
          nextApt: "",
        },
      },
      {
        patient: {
          name: "Geraldine Ho",
          dob: "1963-06-25",
          nric: "S6306257K",
          age: "62",
          phone: "9231 4400",
          email: "geraldine.ho@email.sg",
          type: "mammogram",
          gender: "Female",
          nationality: "Singapore Citizen",
          preferredLanguage: "English, Mandarin",
          addressLine: "Blk 190 Bishan Street 13 #11-405",
          postalCode: "570190",
          emergencyName: "Ho Jin An",
          emergencyPhone: "9876 3210",
          contactPref: "Call",
          referral: "Friend / Family",
          sexualActivity: "Yes",
          lastPap: "",
          lastMenses: "",
        },
        visit: {
          slot: 15 * 60 + 30,
          stage: "pending_result",
          attended: true,
          doctorNotes: "Awaiting radiologist report upload.",
          referralRec: "None",
          reviewInterval: "",
          resultLabel: "",
          nextApt: "",
        },
      },
      {
        patient: {
          name: "Mary Ong",
          dob: "1977-02-11",
          nric: "S7702118L",
          age: "49",
          phone: "9112 5560",
          email: "mary.ong@email.sg",
          type: "pap",
          gender: "Female",
          nationality: "Singapore Citizen",
          preferredLanguage: "English",
          addressLine: "Blk 440 Shunfu Road #14-62",
          postalCode: "570440",
          emergencyName: "Ong Li Shan",
          emergencyPhone: "8200 1199",
          contactPref: "Email",
          referral: "Poster / Flyer",
          sexualActivity: "Yes",
          lastPap: "More than 3 years ago",
          lastMenses: "2026-04-06",
        },
        visit: { slot: 16 * 60, stage: "appointment", attended: false, doctorNotes: "", referralRec: "None" },
      },
      {
        patient: {
          name: "Esther Chua",
          dob: "1993-12-20",
          nric: "S9312205M",
          age: "32",
          phone: "8788 9900",
          email: "esther.chua@email.sg",
          type: "hpv",
          gender: "Female",
          nationality: "Singapore Citizen",
          preferredLanguage: "English",
          addressLine: "Blk 257 Bishan Street 22 #07-118",
          postalCode: "570257",
          emergencyName: "Chua Li Ying",
          emergencyPhone: "9344 2211",
          contactPref: "WhatsApp",
          referral: "Social Media",
          sexualActivity: "Yes",
          lastPap: "Less than 1 year ago",
          lastMenses: "2026-04-11",
        },
        visit: {
          slot: 16 * 60 + 30,
          stage: "doctor_input",
          attended: true,
          doctorNotes: "HPV result pending verification; discussed colposcopy pathway if positive.",
          referralRec: "None",
          reviewInterval: "",
          resultLabel: "Changes Detected (Positive)",
          nextApt: "",
        },
      },
    ];

    const showcasePids = new Set();
    roster.forEach((entry, i) => {
      if (i >= pts.length) return;
      showcasePids.add(pts[i].id);
    });
    for (let i = vis.length - 1; i >= 0; i--) {
      const v = vis[i];
      if (v.date === todayIso && showcasePids.has(v.patientId)) vis.splice(i, 1);
    }

    roster.forEach((entry, i) => {
      if (i >= pts.length) return;
      const pid = pts[i].id;
      Object.assign(pts[i], entry.patient);
      pts[i].id = pid;
      pts[i].bishanCode = "BSH-" + String(i + 1).padStart(3, "0");
      const ov = entry.visit || {};
      vis.push({
        id: "v-" + pid + "-roster",
        patientId: pid,
        date: todayIso,
        slot: ov.slot,
        screeningType: (entry.patient && entry.patient.type) || pts[i].type,
        stage: ov.stage,
        doctorNotes: ov.doctorNotes != null ? ov.doctorNotes : "",
        referralRec: ov.referralRec != null ? ov.referralRec : "None",
        reviewInterval: ov.reviewInterval != null ? ov.reviewInterval : "",
        labFile: ov.labFile != null ? ov.labFile : null,
        resultLabel: ov.resultLabel != null ? ov.resultLabel : "",
        nextApt: ov.nextApt != null ? ov.nextApt : "",
        attended: !!ov.attended,
      });
      if (entry.detailSeed && detailSeedsOut) detailSeedsOut[pid] = entry.detailSeed;
    });
  }

  function initBishanDetailFormSeeds(bc) {
    const seeds = bc._bishanDetailSeeds || {};
    const dm = bc._detailDefaults?.medicalHistory || {};
    const dd = bc._detailDefaults?.otherDetails || {};
    Object.keys(seeds).forEach((pid) => {
      const s = seeds[pid];
      const mh = JSON.parse(JSON.stringify(dm));
      const od = JSON.parse(JSON.stringify(dd));
      if (s.medicalHistory) Object.assign(mh, s.medicalHistory);
      if (s.otherDetails) Object.assign(od, s.otherDetails);
      if (!bc.detailFormsByPatientId) bc.detailFormsByPatientId = {};
      bc.detailFormsByPatientId[pid] = { medicalHistory: mh, otherDetails: od };
    });
  }

  function genLetter(v, p) {
    const isPos = v.resultLabel && v.resultLabel.includes("Positive");
    const typeKey = v.screeningType || v.type || p.type || "";
    const st = TLABELS[typeKey] || typeKey || "Screening";
    TODAY = todaySGT();
    const doctorName = String(v.doctorName || "").trim();
    const doctorMcr = String(v.doctorMcr || "").trim();
    const time = slotLbl(v.slot);
    const patientNric = p.nricFull || p.nric || "";
    const nextApptLine =
      v.nextApt && v.nextApt !== "not_required"
        ? "\n\nNext recommended appointment date: " + fmtDate(v.nextApt)
        : v.nextApt === "not_required"
          ? "\n\nNext recommended appointment date: Not Required"
          : "";
    return (
      "Bishan Cancer Screening Services\nSingapore Cancer Society\nBlock 163, Bishan Street 13, #01-01, Singapore 570163\nTel: 6499 9133\n\nDate: " +
      TODAY +
      "\n\nDear " +
      p.name +
      ",\nNRIC: " +
      patientNric +
      "\nScreening Date: " +
      v.date +
      " " +
      time +
      "\n\nRe: " +
      st +
      " Screening Result\n\nRESULT: " +
      (v.resultLabel || "Pending") +
      "\n\n" +
      (isPos
        ? "Your result shows changes requiring further evaluation. Please contact us to schedule a follow-up at your earliest convenience."
        : "Your result is normal (negative). No further action is required.") +
      (v.referralRec && v.referralRec !== "None" ? "\n\nREFERRAL: " + v.referralRec : "") +
      nextApptLine +
      "\n\nContact: 6499 9133\n\nYours sincerely,\n____________________________\nDoctor-in-Charge\nBishan Cancer Screening Services"
      (doctorName ? "\n\nDoctor: " + doctorName : "") +
      (doctorMcr ? "\n" + doctorMcr : "")
    );
  }

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

  /** Icons for `WD_renderDetailFormStickyToolbar` (subset of app.js `icons`). */
  const DETAIL_TOOLBAR_ICONS = {
    refresh:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
  };
  /** Same path as `icons.back` in app.js — prospect detail hero back control. */
  const DETAIL_BACK_ICON =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>';
  /** Same as `icons.search` in app.js — prospect filters/search bar icon. */
  const DETAIL_SEARCH_ICON =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>';

  function typeBadgeHtml(type) {
    const c = TYPE_CHIP[type] || TYPE_CHIP.pap;
    return `<span class="bc-chip bc-chip--type" style="background:${escAttr(c.bg)};color:${escAttr(c.tx)}">${esc(c.label)}</span>`;
  }
  function stageBadgeHtml(stage) {
    const s = STAGE_CHIP[stage] || STAGE_CHIP.appointment;
    return `<span class="bc-chip bc-chip--stage" style="background:${escAttr(s.bg)};color:${escAttr(s.tx)}"><span class="bc-chip__dot" style="background:${escAttr(
      s.dot
    )}"></span>${esc(SLABELS[stage] || stage)}</span>`;
  }
  /** Type / stage pills — match werkdone staging `.bsh-type-badge` / `.bsh-stage-pill`. */
  function typeBadgeStagingHtml(type) {
    const safe = type && TYPE_CHIP[type] ? type : "pap";
    const labels = {
      mammogram: "Mammogram",
      hpv: "HPV Test",
      pap: "Pap Test",
      hpv_vaccine: "HPV Vaccine",
      breast_exam: "Breast Exam",
    };
    return `<span class="bc-type-badge bc-type-badge--${escAttr(safe)}">${esc(labels[safe] || safe)}</span>`;
  }
  function stagePillStagingHtml(stage) {
    const safe = /^[a-z_]+$/.test(String(stage || "")) ? stage : "appointment";
    return `<span class="bc-stage-pill bc-stage-pill--${safe}">${esc(stageUiLabel(stage))}</span>`;
  }
  function avatarHtml(name, size) {
    const cols = [
      ["#E8EFFD", "#2255A4"],
      ["#FCEAF1", "#9B1550"],
      ["#EDE8F5", "#5B2D8E"],
      ["#DCFCE7", "#166534"],
      ["#FEF3C7", "#92400E"],
    ];
    const [bg, fg] = cols[(name.charCodeAt(0) || 0) % cols.length];
    const sz = size || 40;
    return `<div class="bc-avatar" style="width:${sz}px;height:${sz}px;background:${escAttr(bg)};color:${escAttr(fg)};font-size:${sz * 0.33}px">${esc(
      inits(name)
    )}</div>`;
  }

  function getV(modal) {
    return modal.type === "newVisit" ? modal : modal.visit;
  }
  function getPt(modal, patients, bc) {
    if (modal.type === "newVisit") return patients.find((x) => x.id === modal.patientId);
    if (modal.type === "editVisit" && modal.visit) {
      return (
        patients.find((x) => x.id === modal.visit.patientId) ||
        (bc.selPatId ? patients.find((x) => x.id === bc.selPatId) : null)
      );
    }
    return bc.selPatId ? patients.find((x) => x.id === bc.selPatId) : null;
  }

  function visitUpd(modal, field, val) {
    if (modal.type === "newVisit") modal[field] = val;
    else modal.visit[field] = val;
  }
  function getVisitStage(modal) {
    return getV(modal).stage;
  }

  function applyAttended(bc, checked) {
    const m = bc.modal;
    const v = getV(m);
    visitUpd(m, "attended", checked);
    const stage = v.stage;
    if (checked && stage === "appointment") visitUpd(m, "stage", "pending_result");
    if (!checked && stage === "pending_result") visitUpd(m, "stage", "appointment");
  }

  function maybeAutoAdvanceDoctorInput(modal) {
    const v = getV(modal);
    const typeKey = v.screeningType || v.type || "";
    if (v.stage !== "doctor_input") return;
    const missing = getMissingMandatoryForVisit(v, typeKey);
    if (!missing.length) visitUpd(modal, "stage", "pending_print");
  }
  function applyResultLabel(bc, val) {
    const m = bc.modal;
    const v = getV(m);
    visitUpd(m, "resultLabel", val);
    const hasFile = !!(m.fp || (m.visit && m.visit.labFile) || (m.type === "newVisit" && m.labFile));
    let stage = getVisitStage(m);
    const typeKey = v.screeningType || v.type || "";
    if (val && hasFile && stage === "pending_result") {
      visitUpd(m, "stage", typeKey === "mammogram" ? "pending_print" : "doctor_input");
    }
    if (!val && stage === "doctor_input") visitUpd(m, "stage", "pending_result");
  }
  function afterFileUpload(bc) {
    const m = bc.modal;
    const v = getV(m);
    const cr = v.resultLabel;
    const cs = v.stage;
    if (cr && cs === "pending_result") {
      const nextStage = (v.screeningType || v.type) === "mammogram" ? "pending_print" : "doctor_input";
      if (m.visit) m.visit = { ...m.visit, stage: nextStage };
      else m.stage = nextStage;
    }
  }
  function applyDoctorNotes(bc, val) {
    const m = bc.modal;
    const v = getV(m);
    visitUpd(m, "doctorNotes", val);
    // Notes are optional in the handover spec; keep stage changes driven by mandatory matrix.
    if (!val && getVisitStage(m) === "pending_print") visitUpd(m, "stage", "doctor_input");
  }
  function applyReferralRec(bc, val) {
    const m = bc.modal;
    visitUpd(m, "referralRec", val);
    maybeAutoAdvanceDoctorInput(m);
  }
  function applyReviewInterval(bc, val) {
    const m = bc.modal;
    visitUpd(m, "reviewInterval", val);
    visitUpd(m, "nextApt", val ? addInt(TODAY, val) : "");
    maybeAutoAdvanceDoctorInput(m);
  }

  function applyDoctorName(bc, name) {
    const m = bc.modal;
    const v = getV(m);
    const typeKey = v.screeningType || v.type || "";
    // Mammogram never has doctor assigned.
    if (typeKey === "mammogram") {
      visitUpd(m, "doctorName", "");
      visitUpd(m, "doctorMcr", "");
      maybeAutoAdvanceDoctorInput(m);
      return;
    }
    visitUpd(m, "doctorName", name);
    visitUpd(m, "doctorMcr", doctorMcrForName(name));
    maybeAutoAdvanceDoctorInput(m);
  }
  function applyNextApt(bc, iso) {
    const m = bc.modal;
    visitUpd(m, "nextApt", iso);
    maybeAutoAdvanceDoctorInput(m);
  }

  function createInitialState() {
    TODAY = todaySGT();
    const detailSeeds = {};
    const { pts, vis } = buildData();
    applyBishanShowcaseData(pts, vis, TODAY, detailSeeds);
    const defaults = global.WD_DETAIL_FORM_DEFAULTS || {};
    const clone = (obj) => {
      try {
        return JSON.parse(JSON.stringify(obj || {}));
      } catch (_) {
        return {};
      }
    };
    const st = {
      patients: pts,
      visits: vis,
      view: "worklist",
      selPatId: null,
      calDate: TODAY,
      filterType: "all",
      /** Summary KPI quick filter (null = none). */
      kpiActive: null,
      /** Extra stage filter applied by KPI cards. */
      filterStage: "all",
      /** Worklist doctor filter (demo: assigned by patient id hash). */
      filterDoctor: "all",
      search: "",
      modal: null,
      toast: "",
      patTab: "overview",
      detailNavByTab: { "medical-history": "mh-family", "other-details": "od-medical" },
      detailFormsByPatientId: {},
      _detailDefaults: {
        medicalHistory: clone(defaults.medicalHistory),
        otherDetails: clone(defaults.otherDetails),
      },
      /** Per-patient Medical History / Other Details seeds for showcase profiles (merged at init). */
      _bishanDetailSeeds: detailSeeds,
      detailFormEdit: null,
      detailFormDraft: null,
      /** "worklist" | "week" — week grid uses Monday in weekStartISO (set when entering Week). */
      worklistMode: "worklist",
      weekStartISO: null,
      /** Admin-blocked slots keyed by "YYYY-MM-DD:480". */
      blockedSlots: {},
      _toastTimer: null,
    };
    initBishanDetailFormSeeds(st);
    return st;
  }

  function ensurePatientDetailForms(bc, patientId) {
    if (!patientId) return;
    if (bc.detailFormsByPatientId && bc.detailFormsByPatientId[patientId]) return;
    const mh = bc._detailDefaults?.medicalHistory ? JSON.parse(JSON.stringify(bc._detailDefaults.medicalHistory)) : {};
    const od = bc._detailDefaults?.otherDetails ? JSON.parse(JSON.stringify(bc._detailDefaults.otherDetails)) : {};
    if (!bc.detailFormsByPatientId) bc.detailFormsByPatientId = {};
    bc.detailFormsByPatientId[patientId] = { medicalHistory: mh, otherDetails: od };
  }

  function renderProspectLikeDetailTab(bc, tab, p) {
    if (typeof global.WD_renderDetailPanel !== "function") {
      return `<p class="cell-muted">Detail form renderer unavailable.</p>`;
    }
    ensurePatientDetailForms(bc, p?.id);
    const forms =
      (bc.detailFormsByPatientId && bc.detailFormsByPatientId[p.id]) || { medicalHistory: {}, otherDetails: {} };
    const ctx = {
      d: { name: p?.name || "", id: p?.id || "" },
      state: {},
      icons: DETAIL_TOOLBAR_ICONS,
      escapeAttr: escAttr,
      pipelineLabel: "",
      detailFormEdit: bc.detailFormEdit,
      detailNavSection: (bc.detailNavByTab && bc.detailNavByTab[tab]) || null,
      formValues: { medicalHistory: forms.medicalHistory, otherDetails: forms.otherDetails },
    };
    const toolbar =
      typeof global.WD_renderDetailFormStickyToolbar === "function"
        ? global.WD_renderDetailFormStickyToolbar(tab, ctx)
        : "";
    return `<div class="bc-detail-panels">${toolbar}${global.WD_renderDetailPanel(tab, ctx)}</div>`;
  }

  function showToast(bc, msg, commit) {
    if (bc._toastTimer) clearTimeout(bc._toastTimer);
    bc.toast = msg;
    commit();
    bc._toastTimer = setTimeout(() => {
      bc.toast = "";
      commit();
    }, 2800);
  }

  function downloadTextFile(filename, text, mime) {
    try {
      const blob = new Blob([text], { type: mime || "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (_) {}
  }

  function csvEscapeCell(v) {
    const s = v == null ? "" : String(v);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  }

  function exportWorklistCsv(bc) {
    const mode = bc.worklistMode === "week" ? "week" : "worklist";
    const isFiltered =
      String(bc.filterType || "all") !== "all" ||
      String(bc.filterStage || "all") !== "all" ||
      String(bc.filterDoctor || "all") !== "all" ||
      Boolean(String(bc.search || "").trim()) ||
      (bc.kpiActive != null && String(bc.kpiActive) !== "" && String(bc.kpiActive) !== "total");

    let rows = [];
    if (isFiltered) {
      // JSX behavior: when any filter is active, export across all dates.
      const weekStart = getWeekStartIso(bc);
      const weekEnd = sundayOfWeekFromMonday(weekStart);
      rows = bc.worklistMode === "week" ? getFilteredWeekVisits(bc, "0000-01-01", "9999-12-31") : getFilteredWeekVisits(bc, "0000-01-01", "9999-12-31");
      // Ensure deterministic order like JSX: date desc then slot asc.
      rows = [...rows].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || (a.slot || 0) - (b.slot || 0));
    } else if (mode === "week") {
      const weekStart = getWeekStartIso(bc);
      const weekEnd = sundayOfWeekFromMonday(weekStart);
      rows = getFilteredWeekVisits(bc, weekStart, weekEnd);
    } else {
      rows = getFilteredDayRows(bc);
    }

    const header = [
      "Date",
      "Time",
      "Patient",
      "NRIC",
      "Phone",
      "Type",
      "Stage",
      "Attended",
      "Doctor",
      "Result",
      "Referral",
      "Next Recall",
    ];
    const lines = [header.map(csvEscapeCell).join(",")];
    rows.forEach((r) => {
      const p = r.patient || bc.patients.find((x) => x.id === r.patientId) || null;
      const date = r.date || bc.calDate || "";
      const time = slotLbl(r.slot);
      const typeKey = r.screeningType || (p && p.type) || "";
      const typeLabel = typeKey ? TLABELS[typeKey] || typeKey : "";
      const stageLabel = stageUiLabel(r.stage);
      const attended = r.attended ? "Yes" : "No";
      const doctor = doctorNameForVisit(r, p) || "";
      const result = r.resultLabel || "";
      const referral = r.referralRec || "";
      const nextRecall = r.nextApt && r.nextApt !== "not_required" ? r.nextApt : "";
      const row = [
        date,
        time,
        p?.name || "",
        p?.nric || "",
        p?.phone || "",
        typeLabel,
        stageLabel,
        attended,
        doctor,
        result,
        referral,
        nextRecall,
      ];
      lines.push(row.map(csvEscapeCell).join(","));
    });
    const filename = (isFiltered ? "filtered_appointments.csv" : `${bc.calDate || todaySGT()}_appointments.csv`).replace(
      /[^a-zA-Z0-9_.-]/g,
      "_"
    );
    downloadTextFile(filename, "\ufeff" + lines.join("\r\n"), "text/csv;charset=utf-8");
  }

  function getFilteredDayRows(bc) {
    const qRaw = String(bc.search || "").trim().toLowerCase();
    const qPhone = qRaw.replace(/\s+/g, "");
    const matchPatient = (p) => {
      if (!qRaw) return true;
      const name = String(p?.name || "").toLowerCase();
      const nric = String(p?.nric || "").toLowerCase();
      const phone = String(p?.phone || "").replace(/\s+/g, "").toLowerCase();
      return name.includes(qRaw) || nric.includes(qRaw) || (qPhone && phone.includes(qPhone));
    };
    const stageFilter = String(bc.filterStage || "all");
    const stageAllow = stageFilter === "action_needed" ? ["pending_result", "doctor_input", "pending_print"] : null;
    const doctorFilter = String(bc.filterDoctor || "all");
    const isFiltered =
      bc.filterType !== "all" || stageFilter !== "all" || doctorFilter !== "all" || (qRaw && qRaw.length > 0) || bc.kpiActive === "action_needed";
    return bc.visits
      .filter((v) => (isFiltered ? true : v.date === bc.calDate))
      .map((v) => ({ ...v, patient: bc.patients.find((x) => x.id === v.patientId) }))
      .filter((r) => {
        if (bc.filterType === "all") return true;
        const t = r.screeningType || (r.patient && r.patient.type);
        return t === bc.filterType;
      })
      .filter((r) => {
        if (stageAllow) return stageAllow.includes(r.stage);
        if (stageFilter === "all") return true;
        return r.stage === stageFilter;
      })
      .filter((r) => {
        if (doctorFilter === "all") return true;
        const d = doctorNameForVisit(r, r.patient);
        if (doctorFilter === "na") return !d;
        return d === doctorFilter;
      })
      .filter((r) => (r.patient ? matchPatient(r.patient) : !qRaw));
  }

  function getFilteredWeekVisits(bc, weekStart, weekEnd) {
    const qRaw = String(bc.search || "").trim().toLowerCase();
    const qPhone = qRaw.replace(/\s+/g, "");
    const matchPatient = (p) => {
      if (!qRaw) return true;
      const name = String(p?.name || "").toLowerCase();
      const nric = String(p?.nric || "").toLowerCase();
      const phone = String(p?.phone || "").replace(/\s+/g, "").toLowerCase();
      return name.includes(qRaw) || nric.includes(qRaw) || (qPhone && phone.includes(qPhone));
    };
    const stageFilter = String(bc.filterStage || "all");
    const stageAllow = stageFilter === "action_needed" ? ["pending_result", "doctor_input", "pending_print"] : null;
    const doctorFilter = String(bc.filterDoctor || "all");
    return bc.visits
      .filter((v) => v.date >= weekStart && v.date <= weekEnd)
      .map((v) => ({ ...v, patient: bc.patients.find((x) => x.id === v.patientId) }))
      .filter((r) => {
        if (bc.filterType === "all") return true;
        const t = r.screeningType || (r.patient && r.patient.type);
        return t === bc.filterType;
      })
      .filter((r) => {
        if (stageAllow) return stageAllow.includes(r.stage);
        if (stageFilter === "all") return true;
        return r.stage === stageFilter;
      })
      .filter((r) => {
        if (doctorFilter === "all") return true;
        const d = doctorNameForVisit(r, r.patient);
        if (doctorFilter === "na") return !d;
        return d === doctorFilter;
      })
      .filter((r) => (r.patient ? matchPatient(r.patient) : !qRaw));
  }

  function sortRowsBySlot(rows) {
    return [...rows].sort((a, b) => a.slot - b.slot);
  }

  const BISHAN_DAY_DOCTORS = [
    { name: "Hafidza Binte Mohd Said", mcr: "M06007J" },
    { name: "Lai Jieru", mcr: "M64755A" },
    { name: "Lim Ying", mcr: "M06678H" },
    { name: "Rauzanah Afandi", mcr: "M08973G" },
    { name: "Uppai Navjot Kaur", mcr: "M17286C" },
    { name: "Wong Chu Hui", mcr: "M61614A" },
  ];
  function doctorMcrForName(name) {
    const n = String(name || "").trim();
    if (!n) return "";
    const rec = BISHAN_DAY_DOCTORS.find((d) => d.name === n);
    return rec ? `MCR ${rec.mcr}` : "";
  }
  function seededDoctorNameForPatient(p) {
    if (!p || !p.id) return "";
    const seed = String(p.id);
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    return BISHAN_DAY_DOCTORS[h % BISHAN_DAY_DOCTORS.length].name;
  }
  function doctorNameForVisit(v, p) {
    const t = v && (v.screeningType || v.type || (p && p.type));
    if (t === "mammogram") return "";
    return String(v?.doctorName || "").trim() || seededDoctorNameForPatient(p);
  }

  function nricLast4(nric) {
    const s = String(nric || "").trim();
    if (s.length < 4) return s || "—";
    return s.slice(-4);
  }

  function availabilityMessageForSlot(slotMins) {
    return slotMins % 2 === 0
      ? "Available for Mammogram"
      : "Available for HPV / Pap Test / HPV Vaccine / Breast Exam";
  }

  function renderClinicMainTitle() {
    return `<h1 class="bc-clinic-main__title">Bishan Clinic</h1>`;
  }

  function renderViewToggle(bc) {
    return `<div class="bc-view-toggle" role="tablist" aria-label="View mode">
      <button type="button" role="tab" class="bc-view-toggle__btn${bc.worklistMode === "worklist" ? " bc-view-toggle__btn--active" : ""}" data-bc-wl-mode="worklist" aria-selected="${bc.worklistMode === "worklist"}">Day</button>
      <button type="button" role="tab" class="bc-view-toggle__btn${bc.worklistMode === "week" ? " bc-view-toggle__btn--active" : ""}" data-bc-wl-mode="week" aria-selected="${bc.worklistMode === "week"}">Week</button>
    </div>`;
  }

  function renderWorklistTable(bc, rows) {
    const slotRows = allSlots()
      .map((s) => {
        const br = rows.filter((r) => r.slot === s);
        const blocked = !!(bc.blockedSlots && bc.blockedSlots[dateSlotKey(bc.calDate, s)]);
        if (!br.length) {
          const availMain = blocked ? "Blocked" : "Available for Mammogram";
          const availNote = "Available for HPV / Pap Test / HPV Vaccine / Breast Exam";
          const mainRow = `<tr class="bc-wl-tr bc-wl-tr--avail">
          <td class="bc-wl-td-time">${esc(slotLbl(s))}</td>
          <td class="bc-wl-td-patient">
            <span class="bc-wl-avail-msg">${esc(availMain)}</span>
          </td>
          <td class="bc-wl-td-nric"></td>
          <td class="bc-wl-td-type"></td>
          <td class="bc-wl-td-stage"></td>
          <td class="bc-wl-td-doctor"></td>
          <td class="bc-wl-td-block">
            <input type="checkbox" class="bc-wl-block-cb" ${blocked ? "checked" : ""} data-bc-block-slot="${escAttr(
              bc.calDate
            )}:${s}" aria-label="${blocked ? "Unblock slot" : "Block slot"}" title="${blocked ? "Unblock" : "Block"}" />
          </td>
        </tr>`;
          const noteRow = blocked
            ? ""
            : `<tr class="bc-wl-tr bc-wl-tr--avail-note" aria-hidden="true">
                <td class="bc-wl-td-time">${esc(slotLbl(s))}</td>
                <td class="bc-wl-td-patient"><span class="bc-wl-avail-msg">${esc(availNote)}</span></td>
                <td class="bc-wl-td-nric"></td>
                <td class="bc-wl-td-type"></td>
                <td class="bc-wl-td-stage"></td>
                <td class="bc-wl-td-doctor"></td>
                <td class="bc-wl-td-block"></td>
              </tr>`;
          return mainRow + noteRow;
        }

        const bookedRows = br
          .map((r) => {
            const p = r.patient;
            const idLine = p ? esc(p.bishanCode || p.id) : "—";
            const doc = doctorNameForVisit(r, p);
            const t = r.screeningType || (p && p.type) || "";
            return `<tr class="bc-wl-tr bc-wl-tr--booked" data-bc-open-patient="${escAttr(r.patientId)}">
          <td class="bc-wl-td-time">${esc(slotLbl(s))}</td>
          <td class="bc-wl-td-patient">
            <span class="bc-wl-name">${esc(p && p.name)}</span>
            <span class="bc-wl-idline">${idLine}</span>
          </td>
          <td class="bc-wl-td-nric">${esc(nricLast4(p && p.nric))}</td>
          <td class="bc-wl-td-type">${typeBadgeStagingHtml(t)}</td>
          <td class="bc-wl-td-stage">${stagePillStagingHtml(r.stage)}</td>
          <td class="bc-wl-td-doctor">${esc(doc)}</td>
          <td class="bc-wl-td-block">
            <input type="checkbox" class="bc-wl-block-cb" ${blocked ? "checked" : ""} disabled aria-label="Block" title="Blocked slots can’t be toggled while booked" />
          </td>
        </tr>`;
          })
          .join("");

        // Show the "Available for ..." row only when there is exactly one booking and slot is not blocked.
        const noteRow =
          !blocked && br.length === 1
            ? (() => {
                const only = br[0];
                const t = only?.screeningType || only?.type || "";
                const msg =
                  t === "mammogram"
                    ? "Available for HPV / Pap Test / HPV Vaccine / Breast Exam"
                    : "Available for Mammogram";
                return `<tr class="bc-wl-tr bc-wl-tr--avail-note" aria-hidden="true">
                  <td class="bc-wl-td-time">${esc(slotLbl(s))}</td>
                  <td class="bc-wl-td-patient"><span class="bc-wl-avail-msg">${esc(msg)}</span></td>
                  <td class="bc-wl-td-nric"></td>
                  <td class="bc-wl-td-type"></td>
                  <td class="bc-wl-td-stage"></td>
                  <td class="bc-wl-td-doctor"></td>
                  <td class="bc-wl-td-block"></td>
                </tr>`;
              })()
            : "";

        return bookedRows + noteRow;
      })
      .join("");
    return `<div class="bc-bsh-worklist-wrap bc-bsh-worklist-wrap--day">
      <div class="bc-wl-shell">
        <table class="bc-wl-table bc-wl-table--day">
          <thead>
            <tr>
              <th class="bc-wl-th-time" scope="col">Time</th>
              <th scope="col">Patient</th>
              <th class="bc-wl-th-nric" scope="col">NRIC</th>
              <th scope="col">Type</th>
              <th scope="col">Stage</th>
              <th class="bc-wl-th-doctor" scope="col">Doctor</th>
              <th class="bc-wl-th-block" scope="col">Block</th>
            </tr>
          </thead>
          <tbody>${slotRows}</tbody>
        </table>
      </div>
    </div>`;
  }

  function weekApptAbbrev(v, p) {
    const t = (v && (v.screeningType || v.type)) || (p && p.type);
    if (t === "mammogram") return "MMG";
    if (t === "hpv") return "HPV";
    if (t === "pap") return "Pap";
    if (t === "hpv_vaccine") return "Vax";
    if (t === "breast_exam") return "BE";
    return "Appt";
  }

  function renderWeekApptPill(v) {
    const p = v.patient;
    const abbr = weekApptAbbrev(v, p);
    const t = (v && (v.screeningType || v.type)) || (p && p.type);
    const mod = t === "mammogram" ? "mmg" : t === "hpv" ? "hpv" : t === "pap" ? "pap" : "mmg";
    return `<button type="button" class="bc-week-appt bc-week-appt--${mod}" data-bc-open-patient="${escAttr(v.patientId)}">${esc(abbr)}</button>`;
  }

  function renderWeekView(bc) {
    const weekStart = getWeekStartIso(bc);
    const weekEnd = sundayOfWeekFromMonday(weekStart);
    const dayIsos = [];
    for (let i = 0; i < 7; i++) dayIsos.push(addDaysIso(weekStart, i));
    const weekVisits = getFilteredWeekVisits(bc, weekStart, weekEnd);
    const slotStarts = weekGridSlotStarts();
    const today = TODAY;
    const n = nowSGT();
    const nowMinutes = n.getHours() * 60 + n.getMinutes();
    const showNowLine = dayIsos.includes(today) && nowMinutes >= 480 && nowMinutes <= 840;

    const dayHeaders = dayIsos
      .map((iso) => {
        const d = parseDt(iso);
        const dow = d.toLocaleDateString("en-SG", { weekday: "short" }).toUpperCase();
        const isToday = iso === today;
        const cnt = weekVisits.filter((v) => v.date === iso).length;
        const apptLine = cnt
          ? `<span class="bc-week-dayhead__appts">${esc(String(cnt))} appt${cnt === 1 ? "" : "s"}</span>`
          : "";
        return `<div class="bc-week-dayhead${isToday ? " bc-week-dayhead--today" : ""}">
          <span class="bc-week-dayhead__dow">${esc(dow)}</span>
          <span class="bc-week-dayhead__date">${esc(String(d.getDate()))}</span>
          ${apptLine}
        </div>`;
      })
      .join("");

    const bodyRows = slotStarts
      .map((m) => {
        const timeLbl = slotLbl(m);
        const cells = dayIsos
          .map((iso) => {
            const inCell = weekVisits.filter((v) => v.date === iso && v.slot >= m && v.slot < m + 30);
            if (!inCell.length) {
              const isBlocked =
                !!(bc.blockedSlots && bc.blockedSlots[dateSlotKey(iso, m)]) ||
                !!(bc.blockedSlots && bc.blockedSlots[dateSlotKey(iso, m + 15)]);
              return isBlocked
                ? `<div class="bc-week-cell bc-week-cell--blocked"></div>`
                : `<div class="bc-week-cell bc-week-cell--available"></div>`;
            }
            const pills = sortRowsBySlot(inCell)
              .map((v) => renderWeekApptPill(v))
              .join("");
            return `<div class="bc-week-cell bc-week-cell--booked">${pills}</div>`;
          })
          .join("");
        return `<div class="bc-week-row">
        <div class="bc-week-row__time">${esc(timeLbl)}</div>
        ${cells}
      </div>`;
      })
      .join("");

    const nowPct = showNowLine ? Math.min(100, Math.max(0, ((nowMinutes - 480) / (840 - 480)) * 100)) : 0;
    const nowLine = showNowLine
      ? `<div class="bc-week-now-line" style="top:calc(${nowPct}% - 1px)" aria-hidden="true"></div>`
      : "";

    return `<div class="bc-bsh-worklist-wrap bc-bsh-worklist-wrap--week">
      <div class="bc-week-shell">
        <div class="bc-week-banner">
          <div class="bc-week-banner__primary">
            <h2 class="bc-week-title">Weekly availability <span class="bc-week-title__date">${esc(fmtCalHeading(weekStart))}</span></h2>
          </div>
          <div class="bc-week-banner__nav">
            <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-bc-week-prev>&lt; Prev</button>
            <span class="bc-week-nav-range">${esc(fmtWeekRangeDisplay(weekStart, weekEnd))}</span>
            <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-bc-week-next>Next &gt;</button>
          </div>
          <div class="bc-week-legend" role="list">
            <span class="bc-week-legend__item"><span class="bc-week-legend__sw bc-week-legend__sw--booked" aria-hidden="true"></span> Booked</span>
            <span class="bc-week-legend__item"><span class="bc-week-legend__sw bc-week-legend__sw--avail" aria-hidden="true"></span> Available</span>
            <span class="bc-week-legend__item"><span class="bc-week-legend__sw bc-week-legend__sw--blocked" aria-hidden="true"></span> Blocked</span>
          </div>
        </div>
        <div class="bc-week-calendar">
          <div class="bc-week-calendar__head">
            <div class="bc-week-calendar__corner" aria-hidden="true"></div>
            ${dayHeaders}
          </div>
          <div class="bc-week-calendar__body">
            ${nowLine}
            ${bodyRows}
          </div>
        </div>
      </div>
    </div>`;
  }

  function renderWorklist(bc) {
    if (bc.worklistMode === "week") return renderWeekView(bc);
    const rows = getFilteredDayRows(bc);
    const isFiltered =
      String(bc.filterType || "all") !== "all" ||
      String(bc.filterStage || "all") !== "all" ||
      String(bc.filterDoctor || "all") !== "all" ||
      (String(bc.search || "").trim() && String(bc.search || "").trim().length > 0) ||
      String(bc.kpiActive || "") === "action_needed";
    return isFiltered ? renderWorklistFilteredList(bc, rows) : renderWorklistTable(bc, rows);
  }

  function renderWorklistFilteredList(bc, rows) {
    const sorted = [...rows].sort((a, b) => (b.date || "").localeCompare(a.date || "") || a.slot - b.slot);
    const body = sorted
      .map((r) => {
        const p = r.patient;
        const t = r.screeningType || (p && p.type) || "";
        const doc = doctorNameForVisit(r, p);
        return `<tr class="bc-wl-tr bc-wl-tr--booked" data-bc-open-patient="${escAttr(r.patientId)}">
          <td class="bc-wl-td-time">${esc(fmtDdMmYyyy(r.date))}</td>
          <td class="bc-wl-td-time">${esc(slotLbl(r.slot))}</td>
          <td class="bc-wl-td-patient">
            <span class="bc-wl-name">${esc(p && p.name)}</span>
            <span class="bc-wl-idline">${p ? esc(p.bishanCode || p.id) : "—"}</span>
          </td>
          <td class="bc-wl-td-nric">${esc(nricLast4(p && p.nric))}</td>
          <td class="bc-wl-td-type">${typeBadgeStagingHtml(t)}</td>
          <td class="bc-wl-td-stage">${stagePillStagingHtml(r.stage)}</td>
          <td class="bc-wl-td-doctor">${esc(doc)}</td>
        </tr>`;
      })
      .join("");
    const empty = !sorted.length ? `<tr><td colspan="7" class="cell-muted" style="padding:14px">No visits match the current filters.</td></tr>` : "";
    return `<div class="bc-bsh-worklist-wrap bc-bsh-worklist-wrap--filtered">
      <div class="bc-wl-shell">
        <table class="bc-wl-table bc-wl-table--day">
          <thead>
            <tr>
              <th class="bc-wl-th-time" scope="col">Date</th>
              <th class="bc-wl-th-time" scope="col">Time</th>
              <th scope="col">Patient</th>
              <th class="bc-wl-th-nric" scope="col">NRIC</th>
              <th scope="col">Type</th>
              <th scope="col">Stage</th>
              <th class="bc-wl-th-doctor" scope="col">Doctor</th>
            </tr>
          </thead>
          <tbody>${body || empty}</tbody>
        </table>
      </div>
    </div>`;
  }

  function renderPatientLeft(bc, p, nextApt, pVisits) {
    const clin = isClin(p.type);
    const emName = p.emergencyName || "";
    const emPhone = p.emergencyPhone || "";
    const emergencyLine =
      emName || emPhone ? `${emName}${emName && emPhone ? " · " : ""}${emPhone}` : "—";
    const intervalBtns = nextApt
      ? INTERVALS.filter((iv) => iv !== "Not Required")
          .map(
            (iv) =>
              `<button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-bc-next-apt-interval="${escAttr(iv)}" data-bc-visit-id="${escAttr(
                nextApt.id
              )}">+ ${esc(iv)}</button>`
          )
          .join("")
      : "";
    const nextBlock = nextApt
      ? `<div class="bc-next-apt">
          <div class="bc-st">Next appointment</div>
          <div class="bc-next-date">${esc(fmtDate(nextApt.date))}</div>
          <div class="bc-next-slot">${esc(slotLbl(nextApt.slot))}</div>
          <div class="bc-btn-row">
            <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-bc-reschedule="${escAttr(nextApt.id)}">Reschedule</button>
            ${intervalBtns}
            <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" style="color:var(--color-destructive);border-color:var(--color-destructive)" data-bc-clear-apt="${escAttr(
              nextApt.id
            )}">N/A</button>
          </div>
        </div>`
      : `<div class="bc-next-apt">
          <div class="bc-st">Next appointment</div>
          <p class="cell-muted">No upcoming appointment.</p>
          <button type="button" class="ui-btn ui-btn--default ui-btn--sm" data-bc-book-patient>Open calendar</button>
        </div>`;

    return `<div class="bc-patient-left">
      <div class="bc-card">
        <div class="bc-card__hero">
          ${avatarHtml(p.name, 46)}
          <div><div class="bc-card__name">${esc(p.name)}</div><div class="bc-card__badges">${typeBadgeHtml(p.type)}</div></div>
        </div>
        <div class="bc-fr"><span class="bc-fr__l">NRIC / FIN</span><span class="bc-fr__v">${esc(p.nric)}</span></div>
        <div class="bc-fr"><span class="bc-fr__l">Gender</span><span class="bc-fr__v">${esc(p.gender || "—")}</span></div>
        <div class="bc-fr"><span class="bc-fr__l">Nationality / status</span><span class="bc-fr__v">${esc(p.nationality || "—")}</span></div>
        <div class="bc-fr"><span class="bc-fr__l">Preferred language</span><span class="bc-fr__v">${esc(p.preferredLanguage || "—")}</span></div>
        <div class="bc-fr"><span class="bc-fr__l">Date of Birth</span><span class="bc-fr__v">${esc(fmtDate(p.dob))}</span></div>
        <div class="bc-fr"><span class="bc-fr__l">Age</span><span class="bc-fr__v">${esc(p.age)}</span></div>
        <div class="bc-fr"><span class="bc-fr__l">Residential address</span><span class="bc-fr__v">${esc(p.addressLine || "—")}</span></div>
        <div class="bc-fr"><span class="bc-fr__l">Postal code</span><span class="bc-fr__v">${esc(p.postalCode || "—")}</span></div>
        <div class="bc-fr"><span class="bc-fr__l">Mobile</span><span class="bc-fr__v">${esc(p.phone)}</span></div>
        <div class="bc-fr"><span class="bc-fr__l">Email</span><span class="bc-fr__v">${esc(p.email)}</span></div>
        <div class="bc-fr"><span class="bc-fr__l">Emergency contact</span><span class="bc-fr__v">${esc(emergencyLine)}</span></div>
        <div class="bc-fr"><span class="bc-fr__l">Contact via</span><span class="bc-fr__v">${esc(p.contactPref)}</span></div>
        <div class="bc-fr"><span class="bc-fr__l">Referral</span><span class="bc-fr__v">${esc(p.referral)}</span></div>
        ${
          clin
            ? `<div class="bc-fr"><span class="bc-fr__l">Last Pap/HPV</span><span class="bc-fr__v">${esc(p.lastPap)}</span></div>
         <div class="bc-fr"><span class="bc-fr__l">Last menses</span><span class="bc-fr__v">${esc(fmtDate(p.lastMenses) || "Not recorded")}</span></div>`
            : ""
        }
        <div class="bc-fr"><span class="bc-fr__l">Sexual activity</span><span class="bc-fr__v">${esc(p.sexualActivity)}</span></div>
        <button type="button" class="ui-btn ui-btn--outline ui-btn--sm bc-fullwidth" data-bc-edit-patient>Edit patient</button>
      </div>
      ${nextBlock}
      <div class="bc-card">
        <div class="bc-st">Summary</div>
        <div class="bc-summary-grid">
          <div class="bc-sum"><span class="bc-sum__n">${pVisits.length}</span><span class="bc-sum__l">Total</span></div>
          <div class="bc-sum"><span class="bc-sum__n">${pVisits.filter((v) => v.stage === "complete").length}</span><span class="bc-sum__l">Done</span></div>
          <div class="bc-sum"><span class="bc-sum__n bc-sum--teal">${pVisits.filter((v) => v.resultLabel === "Normal (Negative)").length}</span><span class="bc-sum__l">Normal</span></div>
          <div class="bc-sum"><span class="bc-sum__n bc-sum--rose">${pVisits.filter((v) => v.resultLabel && v.resultLabel.includes("Positive")).length}</span><span class="bc-sum__l">Positive</span></div>
        </div>
      </div>
    </div>`;
  }

  function renderOverviewTab(p, pVisits, lastV) {
    if (!lastV) return `<p class="cell-muted">No visits yet.</p>`;
    const timeline = pVisits
      .slice(0, 6)
      .map((v, i) => {
        const sc = STAGE_CHIP[v.stage] || STAGE_CHIP.appointment;
        const bor = i < Math.min(pVisits.length, 6) - 1;
        return `<div class="bc-tl-row"${bor ? "" : ' style="border-bottom:none"'}>
        <span class="bc-tl-dot" style="background:${escAttr(sc.dot)}"></span>
        <span class="bc-tl-date">${esc(fmtDate(v.date))}</span>
        <div class="bc-tl-mid"><div class="bc-tl-title">${esc(TLABELS[p.type])} screening</div>${v.doctorNotes ? `<div class="bc-tl-note">${esc(v.doctorNotes.slice(0, 60))}…</div>` : ""}</div>
        ${stageBadgeHtml(v.stage)}
        ${v.resultLabel ? `<span class="bc-tl-res${v.resultLabel.includes("Normal") ? " bc-tl-res--ok" : " bc-tl-res--warn"}">${v.resultLabel.includes("Normal") ? "✓" : "!"}</span>` : ""}
        <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-bc-edit-visit="${escAttr(v.id)}">Edit</button>
      </div>`;
      })
      .join("");
    return `<div class="bc-tab-overview">
      <div class="bc-st">Current status</div>
      <div class="bc-status-bar">
        <div><div class="bc-meta">Last visit</div><div class="bc-strong">${esc(fmtDate(lastV.date))}</div></div>
        <div class="bc-div"></div>
        <div><div class="bc-meta">Stage</div>${stageBadgeHtml(lastV.stage)}</div>
        <div class="bc-div"></div>
        <div><div class="bc-meta">Last result</div><div class="bc-strong${lastV.resultLabel && lastV.resultLabel.includes("Normal") ? " bc-teal" : lastV.resultLabel && lastV.resultLabel.includes("Positive") ? " bc-rose" : ""}">${esc(lastV.resultLabel || "Pending")}</div></div>
        <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" style="margin-left:auto" data-bc-edit-visit="${escAttr(lastV.id)}">Open visit</button>
      </div>
      <div class="bc-st">Visit timeline</div>
      ${timeline}
    </div>`;
  }

  function renderVisitsTab(p, pVisits) {
    if (!pVisits.length) return `<p class="cell-muted">No visits recorded.</p>`;
    return pVisits
      .map(
        (v) => `<div class="bc-visit-card">
      <div class="bc-visit-card__head">
        <div><div class="bc-strong">${esc(fmtDate(v.date))} <span class="cell-muted">· ${esc(slotLbl(v.slot))}</span></div><div class="bc-meta">Attended: ${v.attended ? "Yes" : "No"}</div></div>
        <div class="bc-visit-card__actions">${stageBadgeHtml(v.stage)}<button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-bc-edit-visit="${escAttr(v.id)}">Edit</button></div>
      </div>
      ${v.doctorNotes ? `<div class="bc-note-box">${esc(v.doctorNotes)}</div>` : ""}
      ${v.referralRec && v.referralRec !== "None" ? `<div class="bc-ref-warn">Referral: ${esc(v.referralRec)}</div>` : ""}
      ${v.referralRec === "None" ? `<div class="bc-ref-ok">No referral</div>` : ""}
      ${v.resultLabel ? `<div class="bc-res-line${v.resultLabel.includes("Normal") ? " bc-teal" : " bc-rose"}">${esc(v.resultLabel)}</div>` : ""}
      ${v.nextApt ? `<div class="bc-meta">Next review: ${esc(fmtDate(v.nextApt))}</div>` : ""}
    </div>`
      )
      .join("");
  }

  function renderResultsTab(p, pVisits) {
    const filtered = pVisits.filter((v) => v.resultLabel || v.labFile);
    if (!filtered.length)
      return `<div class="bc-empty-results"><div class="bc-empty-results__t">No lab results recorded</div></div>`;
    return filtered
      .map((v) => {
        const isN = v.resultLabel && v.resultLabel.includes("Normal");
        const isP = v.resultLabel && v.resultLabel.includes("Positive");
        return `<div class="bc-result-card">
        <div class="bc-result-card__hd" style="background:${isN ? "#ECFDF5" : isP ? "#FFF0F5" : "var(--color-secondary)"}">
          <span class="bc-result-dot" style="background:${isN ? "#10B981" : isP ? "#E24B4A" : "#999"}"></span>
          <div class="bc-flex1"><div class="bc-strong${isN ? " bc-teal" : isP ? " bc-rose" : ""}">${esc(v.resultLabel || "Pending")}</div><div class="bc-meta">${esc(fmtDate(v.date))} · ${esc(TLABELS[p.type])}</div></div>
          <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-bc-edit-visit="${escAttr(v.id)}">Edit</button>
        </div>
        <div class="bc-result-card__bd">
          ${v.nextApt ? `<div class="bc-fr"><span class="bc-fr__l">Next review</span><span class="bc-fr__v bc-primary">${esc(fmtDate(v.nextApt))}</span></div>` : ""}
          <div class="bc-fr"><span class="bc-fr__l">Lab report</span><span class="bc-fr__v">${v.labFile ? "Uploaded" : "Not uploaded"}</span></div>
        </div>
        ${
          v.resultLabel
            ? `<div class="bc-result-card__ft"><span class="bc-meta">Letter ready</span><button type="button" class="ui-btn ui-btn--default ui-btn--sm" data-bc-letter-visit="${escAttr(v.id)}">View / print letter</button></div>`
            : ""
        }
      </div>`;
      })
      .map((x) => x)
      .join("");
  }

  function renderApptTab(p, upcoming, past, nextApt) {
    const up = upcoming
      .map(
        (v) => `<div class="bc-appt-up">
      <div class="bc-appt-up__head"><div><div class="bc-appt-date">${esc(fmtDate(v.date))}</div><div class="bc-meta">${esc(slotLbl(v.slot))}</div></div>${stageBadgeHtml(v.stage)}</div>
      <div class="bc-btn-row">
        <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-bc-reschedule="${escAttr(v.id)}">Reschedule</button>
        ${INTERVALS.filter((iv) => iv !== "Not Required")
          .map(
            (iv) =>
              `<button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-bc-move-apt="${escAttr(v.id)}" data-bc-interval="${escAttr(iv)}">+ ${esc(iv)}</button>`
          )
          .join("")}
        <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" style="color:var(--color-destructive)" data-bc-clear-apt="${escAttr(v.id)}">N/A</button>
      </div>
    </div>`
      )
      .join("");
    const pa = past
      .map(
        (v) => `<div class="bc-appt-past">
      <div><div class="bc-strong">${esc(fmtDate(v.date))} <span class="cell-muted">· ${esc(slotLbl(v.slot))}</span></div><div class="bc-meta">Attended: ${v.attended ? "Yes" : "No"}</div></div>
      ${stageBadgeHtml(v.stage)}
    </div>`
      )
      .join("");
    if (!upcoming.length && !past.length) return `<p class="cell-muted">No appointments recorded.</p>`;
    return `${upcoming.length ? `<div class="bc-st">Upcoming</div>${up}` : ""}${past.length ? `<div class="bc-st${upcoming.length ? " bc-st--spaced" : ""}">Past</div>${pa}` : ""}`;
  }

  function renderPatientRight(bc, p, pVisits) {
    const upcoming = pVisits.filter((v) => !isSlotPast(v.date, v.slot));
    const past = pVisits.filter((v) => isSlotPast(v.date, v.slot));
    const lastV = pVisits[0];
    const tabs = [
      ["overview", "Overview"],
      ["visits", "Visits"],
      ["results", "Lab Results"],
      ["appt", "Appointments"],
      ["medical-history", "Medical History"],
      ["other-details", "Other Details"],
    ];
    const tabBtns = tabs
      .map(
        ([k, l]) =>
          `<button type="button" class="bc-tab${bc.patTab === k ? " bc-tab--on" : ""}" data-bc-pat-tab="${escAttr(k)}">${esc(l)}</button>`
      )
      .join("");
    let body = "";
    if (bc.patTab === "overview") body = renderOverviewTab(p, pVisits, lastV);
    else if (bc.patTab === "visits") body = renderVisitsTab(p, pVisits);
    else if (bc.patTab === "results") body = renderResultsTab(p, pVisits);
    else if (bc.patTab === "medical-history" || bc.patTab === "other-details") body = renderProspectLikeDetailTab(bc, bc.patTab, p);
    else body = renderApptTab(p, upcoming, past);

    return `<div class="bc-patient-right">
      <div class="bc-tabs-bar">
        ${tabBtns}
        <div class="bc-spacer"></div>
        <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-bc-new-visit>New visit</button>
      </div>
      <div class="bc-tabs-body">${body}</div>
    </div>`;
  }

  function renderAptModal(bc) {
    const m = bc.modal;
    const isNew = m.type === "newApt";
    const date = isNew ? m.date : m.visit.date;
    const slot = isNew ? m.slot : m.visit.slot;
    const currentVisitId = isNew ? null : m.visit.id;
    const typeKey = isNew ? String(m.screeningType || "mammogram") : String(m.visit.screeningType || m.visit.type || "mammogram");
    const slotState = (s) => {
      const blocked = !!(bc.blockedSlots && bc.blockedSlots[dateSlotKey(date, s)]);
      const full = isSlotFull(bc.visits, date, s, typeKey, currentVisitId);
      const existing = slotVisitsForDateSlot(bc.visits, date, s, currentVisitId);
      const booked = existing.length > 0;
      return { blocked, full, booked };
    };
    const curState = slotState(slot);
    const isConflict = curState.blocked || curState.full;
    const slotOpts = allSlots()
      .map((s) => {
        const st = slotState(s);
        const sel = s === slot ? " selected" : "";
        const suffix = st.blocked ? " (blocked)" : st.full ? " (full)" : st.booked ? " (booked)" : "";
        const dis = st.blocked || st.full ? " disabled" : "";
        return `<option value="${s}"${dis}${sel}>${esc(slotLbl(s))}${esc(suffix)}</option>`;
      })
      .join("");
    const maskNric = (raw) => {
      const s = String(raw || "").trim();
      if (!s) return "—";
      if (s.length <= 4) return s;
      const keepStart = s.slice(0, 1);
      const keepEnd = s.slice(-2);
      return `${keepStart}${"*".repeat(Math.max(0, s.length - 3))}${keepEnd}`;
    };
    const qRaw = String(m.patientQuery || "").trim().toLowerCase();
    const qPhone = qRaw.replace(/\s+/g, "");
    const matches = qRaw
      ? bc.patients
          .filter((p) => {
            const name = String(p?.name || "").toLowerCase();
            const nric = String(p?.nric || "").toLowerCase();
            const phone = String(p?.phone || "").replace(/\s+/g, "").toLowerCase();
            return name.includes(qRaw) || nric.includes(qRaw) || (qPhone && phone.includes(qPhone));
          })
          .slice(0, 8)
      : [];
    const selected = m.patientId ? bc.patients.find((p) => p.id === m.patientId) : null;
    const hideDrop = !!(selected && qRaw && String(selected.name || "").trim().toLowerCase() === qRaw);
    const searchResults =
      qRaw && !hideDrop && matches.length
        ? `<div class="bc-apt-search__drop" role="listbox" aria-label="Patient search results">
          ${matches
            .map((p) => {
              const isSel = selected && selected.id === p.id;
              return `<button type="button" class="bc-apt-search__item${isSel ? " is-active" : ""}" role="option" aria-selected="${isSel}" data-bc-apt-pick="${escAttr(
                p.id
              )}">${esc(p.name)} — ${esc(maskNric(p.nric))}</button>`;
            })
            .join("")}
        </div>`
        : qRaw && !hideDrop
          ? `<div class="bc-apt-search__drop bc-apt-search__drop--empty" aria-label="No results">No patients found.</div>`
          : "";
    return `<div>
      <h3 class="bc-modal-title">${isNew ? "New appointment" : "Reschedule"}</h3>
      <label class="bc-lbl">Date</label>
      <input type="date" class="bc-input" data-bc-apt-date value="${escAttr(date)}"${isNew ? ` min="${escAttr(TODAY)}"` : ""} />
      <label class="bc-lbl">Screening type</label>
      <select class="bc-input" data-bc-apt-field="screeningType"${isNew ? "" : " disabled"}>
        ${["mammogram", "hpv", "pap", "hpv_vaccine", "breast_exam"]
          .map((t) => `<option value="${escAttr(t)}"${typeKey === t ? " selected" : ""}>${esc(TLABELS[t] || t)}</option>`)
          .join("")}
      </select>
      <label class="bc-lbl">Time slot</label>
      <select class="bc-input${isConflict ? " bc-input--err" : ""}" data-bc-apt-field="slot">${slotOpts.replace(
        `value="${slot}"`,
        `value="${slot}" selected`
      )}</select>
      ${isConflict ? `<div class="bc-err">${curState.blocked ? "This slot is blocked." : "This slot is full for the selected screening type."} Choose another time.</div>` : ""}
      ${
        isNew
          ? `<label class="bc-lbl">Patient Search</label>
        <div class="bc-apt-search">
          <input class="bc-input" autocomplete="off" placeholder="Search by name, NRIC, phone no." data-bc-apt-search value="${escAttr(
            m.patientQuery || ""
          )}" />
          ${searchResults}
        </div>`
          : ""
      }
      <div class="bc-modal-actions">
        <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-bc-modal-close>Cancel</button>
        <button type="button" class="ui-btn ui-btn--default ui-btn--sm" data-bc-apt-save${isConflict ? " disabled" : ""}>Save</button>
      </div>
    </div>`;
  }

  function renderLetterModal(m) {
    const txt = m.letterText || m.text || "";
    return `<div>
      <h3 class="bc-modal-title">Patient result letter</h3>
      <textarea class="bc-textarea bc-textarea--letter" rows="14" data-bc-letter-text>${esc(txt)}</textarea>
      <div class="bc-modal-actions">
        ${m.letterMode ? `<button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-bc-letter-back>← Back</button>` : ""}
        ${m.type === "letter" ? `<button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-bc-modal-close>Close</button>` : ""}
        <button type="button" class="ui-btn ui-btn--default ui-btn--sm" data-bc-letter-copy>Copy letter</button>
      </div>
    </div>`;
  }

  function renderPatientFormModal(m) {
    const isNew = m.type === "newPatient";
    const nc = m.ptype === "hpv" || m.ptype === "pap";
    const typeSel = ["mammogram", "hpv", "pap", "hpv_vaccine", "breast_exam"]
      .map((t) => `<option value="${t}"${m.ptype === t ? " selected" : ""}>${esc(TLABELS[t])}</option>`)
      .join("");
    const papOpts = PAP_LAST_OPTS.map((o) => `<option value="${escAttr(o)}"${m.lastPap === o ? " selected" : ""}>${esc(o)}</option>`).join("");
    const contactOpts = CONTACT_OPTS.map((o) => `<option value="${escAttr(o)}"${m.contactPref === o ? " selected" : ""}>${esc(o)}</option>`).join("");
    const refOpts = REFERRAL_OPTS.map((o) => `<option value="${escAttr(o)}"${m.referral === o ? " selected" : ""}>${esc(o)}</option>`).join("");

    const nricToggleIcons =
      '<span class="field__nric-toggle-icons" aria-hidden="true">' +
      '<i class="fi fi-rr-eye-crossed field__nric-toggle-ico field__nric-toggle-ico--when-masked"></i>' +
      '<i class="fi fi-rr-eye field__nric-toggle-ico field__nric-toggle-ico--when-revealed"></i>' +
      "</span>";
    return `<div class="bc-modal-form">
      <h3 class="bc-modal-title">${isNew ? "Add patient" : "Edit patient"}</h3>
      <div class="field">
        <label for="bc-pat-ptype">Screening type<span class="field__req" aria-hidden="true">*</span></label>
        <select id="bc-pat-ptype" data-bc-pat-form="ptype">${typeSel}</select>
      </div>
      <div class="field">
        <label for="bc-pat-name">Name (as per NRIC)<span class="field__req" aria-hidden="true">*</span></label>
        <input id="bc-pat-name" data-bc-pat-form="name" value="${escAttr(
          m.name
        )}" placeholder="Enter full name as in NRIC" autocomplete="name" required />
      </div>
      <div class="field">
        <label for="bc-pat-nric">NRIC / FIN Number<span class="field__req" aria-hidden="true">*</span></label>
        <div class="field__nric field__nric--revealed">
          <input type="hidden" id="bc-pat-nric" class="field__nric-store" autocomplete="off" value="${escAttr(
            m.nric
          )}" data-bc-pat-form="nric" required />
          <div class="field__nric-face">
            <span class="field__nric-asterisks" aria-hidden="true"></span>
            <input type="text" class="field__nric-edit" autocomplete="off" maxlength="20" placeholder="Enter NRIC No." required />
          </div>
          <button type="button" class="field__nric-toggle" aria-label="Hide NRIC" aria-pressed="true" title="Hide NRIC" data-nric-toggle>
            ${nricToggleIcons}
          </button>
        </div>
      </div>
      <div class="field">
        <label for="bc-pat-dob-text">Date of Birth<span class="field__req" aria-hidden="true">*</span></label>
        <div class="field__date">
          <input class="field__date-text" id="bc-pat-dob-text" type="text" value="${escAttr(
            m.dob
          )}" placeholder="DD-MM-YYYY" inputmode="numeric" autocomplete="bday" maxlength="10" required />
          <button type="button" class="field__date-btn" aria-label="Choose date" title="Choose date"></button>
          <input type="date" class="field__date-native" tabindex="-1" aria-hidden="true" data-bc-pat-form="dob" />
        </div>
      </div>
      <div class="field">
        <label for="bc-pat-age">Age<span class="field__req" aria-hidden="true">*</span></label>
        <input id="bc-pat-age" type="number" data-bc-pat-form="age" value="${escAttr(m.age)}" required />
      </div>
      <div class="field">
        <label for="bc-pat-phone">Contact Number<span class="field__req" aria-hidden="true">*</span></label>
        <div class="field__inline">
          <input type="text" class="field__prefix" value="+65" disabled aria-label="Country code" />
          <input id="bc-pat-phone" data-bc-pat-form="phone" value="${escAttr(m.phone)}" placeholder="E.g. 8123 4567" inputmode="tel" autocomplete="tel" required />
        </div>
      </div>
      <div class="field">
        <label for="bc-pat-email">Email<span class="field__req" aria-hidden="true">*</span></label>
        <input id="bc-pat-email" type="email" data-bc-pat-form="email" value="${escAttr(m.email)}" placeholder="e.g. name@email.com" autocomplete="email" required />
      </div>
      <div class="field">
        <label for="bc-pat-sexual-activity">Sexual activity?</label>
        <select id="bc-pat-sexual-activity" data-bc-pat-form="sexualActivity">
        <option value="">— Select —</option>
        <option value="Yes"${m.sexualActivity === "Yes" ? " selected" : ""}>Yes</option>
        <option value="No"${m.sexualActivity === "No" ? " selected" : ""}>No</option>
      </select>
      </div>
      ${
        nc
          ? `<div class="field">
              <label for="bc-pat-last-menses">First day of last menstruation</label>
              <div class="field__date">
                <input class="field__date-text" id="bc-pat-last-menses" type="text" value="${escAttr(
                  m.lastMenses
                )}" placeholder="DD-MM-YYYY" inputmode="numeric" autocomplete="off" maxlength="10" />
                <button type="button" class="field__date-btn" aria-label="Choose date" title="Choose date"></button>
                <input type="date" class="field__date-native" tabindex="-1" aria-hidden="true" data-bc-pat-form="lastMenses" />
              </div>
            </div>
            <div class="field">
              <label for="bc-pat-last-pap">Last Pap / HPV test</label>
              <select id="bc-pat-last-pap" data-bc-pat-form="lastPap">${papOpts}</select>
            </div>`
          : ""
      }
      <div class="field">
        <label for="bc-pat-contact-pref">Contact method</label>
        <select id="bc-pat-contact-pref" data-bc-pat-form="contactPref">${contactOpts}</select>
      </div>
      <div class="field">
        <label for="bc-pat-referral">Referral source</label>
        <select id="bc-pat-referral" data-bc-pat-form="referral">${refOpts}</select>
      </div>
      <div class="bc-modal-actions">
        <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-bc-modal-close>Cancel</button>
        <button type="button" class="ui-btn ui-btn--default ui-btn--sm" data-bc-pat-save>Save</button>
      </div>
    </div>`;
  }

  function renderVisitFormModal(bc) {
    const m = bc.modal;
    const isNew = m.type === "newVisit";
    const v = getV(m);
    const pt = getPt(m, bc.patients, bc);
    const typeKey = v.screeningType || v.type || (pt && pt.type) || "";
    const stageTrackStages =
      typeKey === "mammogram"
        ? ["appointment", "pending_result", "pending_print", "complete"]
        : ["appointment", "pending_result", "doctor_input", "pending_print", "complete"];
    const stIdx = Math.max(0, stageTrackStages.indexOf(v.stage));
    const isNoTest = v.stage === "no_test";
    const isNoShow = v.stage === "no_show";
    const isCancelled = v.stage === "cancelled";
    const stage = v.stage;
    const showPR = v.attended && stage === "pending_result";
    const showDI = v.attended && (stage === "doctor_input" || stage === "pending_print" || stage === "complete");
    const showPP = v.attended && (stage === "pending_print" || stage === "complete");
    const hasFilePreview = m.fp || v.labFile;
    const mandatory = getMandatoryFieldsForType(typeKey);
    const missing = getMissingMandatoryForVisit(v, typeKey);
    const missingBanner =
      stage === "doctor_input" && mandatory.length
        ? missing.length
          ? `<div class="bc-vf-banner bc-vf-banner--err"><strong>Missing mandatory fields</strong><div class="bc-vf-banner__sub">${esc(
              missing.map((x) => x.label).join(" · ")
            )}</div></div>`
          : `<div class="bc-vf-banner bc-vf-banner--ok"><strong>✓ All mandatory fields complete</strong><div class="bc-vf-banner__sub">This section will advance automatically.</div></div>`
        : "";

    const stageTrack = stageTrackStages.map((s, i) => {
      const done = i < stIdx;
      const act = i === stIdx;
      const conn = i < stageTrackStages.length - 1 ? `<div class="bc-st-conn" style="background:${done ? "#10B981" : "#EEE"}"></div>` : "";
      return `<div class="bc-st-node">
        <div class="bc-st-circle" style="background:${done ? "#10B981" : act ? "var(--color-primary)" : "#EEE"};border-color:${done ? "#10B981" : act ? "var(--color-primary)" : "#DDD"}">${done ? "✓" : i + 1}</div>
        <div class="bc-st-lbl" style="color:${act ? "var(--color-primary)" : done ? "#10B981" : "#BBB"}">${esc(SLABELS[s])}</div>
      </div>${conn}`;
    }).join("");

    const chip = STAGE_CHIP[v.stage] || STAGE_CHIP.appointment;
    const resultOpts = RESULTS.map((r) => `<option value="${escAttr(r)}"${v.resultLabel === r ? " selected" : ""}>${esc(r)}</option>`).join("");
    const papClsOpts = PAP_CLASSES.map((r) => `<option value="${escAttr(r)}"${v.papResultClass === r ? " selected" : ""}>${esc(r)}</option>`).join("");
    const biradsOpts = BIRADS.map((r) => `<option value="${escAttr(r)}"${v.papResultClass === r ? " selected" : ""}>${esc(r)}</option>`).join("");
    const hpvAdviceOpts = HPV_ADVICE_OPTS.map((o) => `<option value="${escAttr(o)}"${v.hpvAdvice === o ? " selected" : ""}>${esc(o)}</option>`).join("");
    const papAdviceOpts = PAP_ADVICE_OPTS.map((o) => `<option value="${escAttr(o)}"${v.hpvAdvice === o ? " selected" : ""}>${esc(o)}</option>`).join("");
    const modeOpts = COLLECTION_MODE_OPTS.map((o) => `<option value="${escAttr(o)}"${v.modeOfCollection === o ? " selected" : ""}>${esc(o)}</option>`).join("");
    const docOpts = BISHAN_DAY_DOCTORS.map((d) => `<option value="${escAttr(d.name)}"${v.doctorName === d.name ? " selected" : ""}>${esc(d.name)}</option>`).join("");
    const refRecOpts = REFERRAL_REC_OPTS.map((o) => `<option value="${escAttr(o)}"${v.referralRec === o ? " selected" : ""}>${esc(o)}</option>`).join("");
    const intOpts = INTERVALS.map((o) => `<option value="${escAttr(o)}"${v.reviewInterval === o ? " selected" : ""}>${esc(o)}</option>`).join("");

    let fileBlock = "";
    if (hasFilePreview && String(hasFilePreview).startsWith("data:image"))
      fileBlock = `<img src="${escAttr(hasFilePreview)}" alt="" class="bc-lab-thumb" />`;
    else if (hasFilePreview) fileBlock = `<div class="bc-lab-fileok">Lab report uploaded</div>`;
    else fileBlock = `<div class="bc-lab-warn">Upload lab report to proceed to Doctor Input</div>`;

    return `<div>
      <h3 class="bc-modal-title">${esc(TLABELS[typeKey] || "")} visit</h3>
      <p class="bc-modal-meta">${esc(pt && pt.name)} · ${esc(fmtDate(v.date))} · ${esc(slotLbl(v.slot))}</p>
      ${
        !isNoTest
          ? `<div class="bc-stage-track">${stageTrack}</div>
         <div class="bc-stage-pill" style="background:${escAttr(chip.bg)};color:${escAttr(chip.tx)}"><span class="bc-chip__dot" style="background:${escAttr(chip.dot)}"></span>${esc(SLABELS[v.stage] || v.stage)}</div>`
          : ""
      }
      ${isNoTest ? `<div class="bc-no-test">Marked as No Test — attended but test not performed</div>` : ""}
      ${isNoShow ? `<div class="bc-no-test bc-no-test--show">Marked as No Show — patient did not attend</div>` : ""}
      ${isCancelled ? `<div class="bc-no-test bc-no-test--cx">Marked as Cancelled</div>` : ""}
      <div class="bc-sect">
        <div class="bc-sect__hd">1 · Attendance</div>
        <div class="bc-sect__bd bc-row">
          <div class="bc-vf-radios" role="radiogroup" aria-label="Attendance status">
            <label class="bc-radio"><input type="radio" name="bc-att" value="attended" data-bc-vf-att="attended"${v.attended ? " checked" : ""}/> Attended the test</label>
            <label class="bc-radio"><input type="radio" name="bc-att" value="no_test" data-bc-vf-att="no_test"${isNoTest ? " checked" : ""}/> No Test</label>
            <label class="bc-radio"><input type="radio" name="bc-att" value="no_show" data-bc-vf-att="no_show"${isNoShow ? " checked" : ""}/> No Show</label>
            <label class="bc-radio"><input type="radio" name="bc-att" value="cancellation" data-bc-vf-att="cancellation"${isCancelled ? " checked" : ""}/> Cancellation</label>
          </div>
          ${
            m.pendingNoStage
              ? `<div class="bc-confirm bc-confirm--amber">
                  <div class="bc-confirm__t">${esc(m.pendingNoStage.stage === "no_show" ? "Confirm No Show" : "Confirm No Test")}</div>
                  <textarea class="bc-textarea" rows="2" placeholder="Remarks (optional)" data-bc-vf-no-remarks>${esc(
                    m.pendingNoStage.remarks || ""
                  )}</textarea>
                  <div class="bc-confirm__actions">
                    <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-bc-vf-no-cancel>Cancel</button>
                    <button type="button" class="ui-btn ui-btn--default ui-btn--sm" data-bc-vf-no-confirm>Confirm</button>
                  </div>
                </div>`
              : ""
          }
          ${
            m.pendingCancel
              ? `<div class="bc-confirm bc-confirm--danger">
                  <div class="bc-confirm__t">This will permanently delete the appointment and free the slot. This action cannot be undone.</div>
                  <div class="bc-confirm__actions">
                    <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-bc-vf-cx-cancel>Cancel</button>
                    <button type="button" class="ui-btn ui-btn--default ui-btn--sm" style="background:var(--color-destructive);border-color:var(--color-destructive)" data-bc-vf-cx-confirm>Confirm Cancellation</button>
                  </div>
                </div>`
              : ""
          }
        </div>
      </div>
      ${
        v.attended
          ? `<div class="bc-sect${showPR ? " bc-sect--warn" : ""}">
        <div class="bc-sect__hd${showPR ? " bc-sect__hd--amber" : ""}">2 · Pending result${showPR ? " — awaiting lab" : ""}</div>
        <div class="bc-sect__bd">
          <label class="bc-lbl">Lab result</label>
          <select class="bc-input" data-bc-vf-result><option value="">— Select —</option>${resultOpts}</select>
          ${v.resultLabel ? `<div class="bc-result-banner${v.resultLabel.includes("Normal") ? " bc-result-banner--ok" : " bc-result-banner--bad"}">${v.resultLabel.includes("Normal") ? "Normal — no further action" : "Changes detected — follow-up"}</div>` : ""}
          ${
            typeKey === "mammogram"
              ? `<label class="bc-lbl req">Mammogram Result (BI-RADS)</label>
                 <select class="bc-input" data-bc-vf-birads><option value="">— Select —</option>${biradsOpts}</select>
                 <label class="bc-lbl">Findings</label>
                 <textarea class="bc-textarea" rows="2" data-bc-vf-findings placeholder="Findings…">${esc(v.otherRelevantFindings || "")}</textarea>
                 <label class="bc-lbl">Advice</label>
                 <select class="bc-input" data-bc-vf-mammo-advice><option value="">— Select —</option>${hpvAdviceOpts}</select>`
              : ""
          }
          <label class="bc-lbl req">Upload lab report</label>
          <input type="file" class="bc-file" accept=".pdf,image/*" data-bc-vf-file />
          ${fileBlock}
        </div>
      </div>`
          : ""
      }
      ${
        showDI
          ? `<div class="bc-sect${stage === "doctor_input" ? " bc-sect--ok" : ""}">
        <div class="bc-sect__hd${stage === "doctor_input" ? " bc-sect__hd--green" : ""}">
          <span>3 · Doctor input</span>
          ${stage === "pending_print" || stage === "complete" ? `<button type="button" class="bc-btn-danger bc-btn-tiny" data-bc-vf-reopen-di>Re-open</button>` : ""}
        </div>
        <div class="bc-sect__bd">
          ${missingBanner}
          <label class="bc-lbl req">Doctor name</label>
          <select class="bc-input${stage === "doctor_input" && missing.some((x) => x.key === "doctorName") ? " bc-input--err" : ""}" data-bc-vf-doctor>
            <option value="">— Select —</option>
            ${docOpts}
          </select>
          <div class="bc-meta">${v.doctorMcr ? esc(v.doctorMcr) : ""}</div>
          <label class="bc-lbl">Doctor notes</label>
          <textarea class="bc-textarea" rows="3" data-bc-vf-notes placeholder="Clinical observations…">${esc(v.doctorNotes || "")}</textarea>
          <label class="bc-lbl req">Referral recommendation</label>
          <select class="bc-input" data-bc-vf-ref><option value="">— Select —</option>${refRecOpts}</select>
          ${v.referralRec && v.referralRec !== "None" ? `<div class="bc-ref-banner">${esc(v.referralRec)}</div>` : ""}
          ${v.referralRec === "None" ? `<div class="bc-ref-banner bc-ref-banner--ok">No referral needed</div>` : ""}
          <label class="bc-lbl req">Next review interval</label>
          <select class="bc-input" data-bc-vf-interval><option value="">— Select —</option>${intOpts}</select>
          <label class="bc-lbl req">Next appointment date</label>
          <input type="date" class="bc-input${stage === "doctor_input" && missing.some((x) => x.key === "nextApt") ? " bc-input--err" : ""}" data-bc-vf-nextapt value="${escAttr(
            v.nextApt && v.nextApt !== "not_required" ? v.nextApt : ""
          )}" />
          ${v.nextApt ? `<div class="bc-next-banner${v.nextApt === "not_required" ? " bc-next-banner--muted" : ""}">${v.nextApt === "not_required" ? "Not Required" : "Next review: " + esc(fmtDate(v.nextApt))}</div>` : ""}
          ${
            typeKey === "hpv"
              ? `<label class="bc-lbl req">Advice</label>
                 <select class="bc-input${stage === "doctor_input" && missing.some((x) => x.key === "hpvAdvice") ? " bc-input--err" : ""}" data-bc-vf-hpv-advice>
                   <option value="">— Select —</option>${hpvAdviceOpts}
                 </select>`
              : ""
          }
          ${
            typeKey === "pap"
              ? `<label class="bc-lbl req">Pap Result</label>
                 <select class="bc-input${stage === "doctor_input" && missing.some((x) => x.key === "papResultClass") ? " bc-input--err" : ""}" data-bc-vf-pap-class>
                   <option value="">— Select —</option>${papClsOpts}
                 </select>
                 <label class="bc-lbl req">Pap Test Result</label>
                 <textarea class="bc-textarea${stage === "doctor_input" && missing.some((x) => x.key === "papTestResultText") ? " bc-input--err" : ""}" rows="2" data-bc-vf-pap-text>${esc(
                   v.papTestResultText || ""
                 )}</textarea>
                 <label class="bc-lbl">Mode of collection</label>
                 <select class="bc-input" data-bc-vf-mode><option value="">— Select —</option>${modeOpts}</select>
                 <label class="bc-lbl req">Advice</label>
                 <select class="bc-input${stage === "doctor_input" && missing.some((x) => x.key === "hpvAdvice") ? " bc-input--err" : ""}" data-bc-vf-hpv-advice>
                   <option value="">— Select —</option>${papAdviceOpts}
                 </select>`
              : ""
          }
          ${
            typeKey === "hpv_vaccine"
              ? `<div class="bc-vf-grid2">
                   <div><label class="bc-lbl req">Immunisation sequence</label><select class="bc-input${stage === "doctor_input" && missing.some((x) => x.key === "immunisationSequence") ? " bc-input--err" : ""}" data-bc-vf-vax-seq><option value="">— Select —</option>${VAX_SEQ_OPTS.map((o)=>`<option value="${escAttr(o)}"${v.immunisationSequence===o?" selected":""}>${esc(o)}</option>`).join("")}</select></div>
                   <div><label class="bc-lbl req">Product</label><select class="bc-input${stage === "doctor_input" && missing.some((x) => x.key === "hpvVaccineProductName") ? " bc-input--err" : ""}" data-bc-vf-vax-prod><option value="">— Select —</option>${VAX_PRODUCT_OPTS.map((o)=>`<option value="${escAttr(o)}"${v.hpvVaccineProductName===o?" selected":""}>${esc(o)}</option>`).join("")}</select></div>
                   <div><label class="bc-lbl req">Batch no</label><input class="bc-input${stage === "doctor_input" && missing.some((x) => x.key === "hpvVaccineBatchNo") ? " bc-input--err" : ""}" data-bc-vf-vax-batch value="${escAttr(v.hpvVaccineBatchNo||"")}" /></div>
                   <div><label class="bc-lbl req">Administration site</label><select class="bc-input${stage === "doctor_input" && missing.some((x) => x.key === "administrationSite") ? " bc-input--err" : ""}" data-bc-vf-vax-site><option value="">— Select —</option>${VAX_SITE_OPTS.map((o)=>`<option value="${escAttr(o)}"${v.administrationSite===o?" selected":""}>${esc(o)}</option>`).join("")}</select></div>
                   <div><label class="bc-lbl req">Time of vaccination</label><input type="datetime-local" class="bc-input${stage === "doctor_input" && missing.some((x) => x.key === "timeOfVaccination") ? " bc-input--err" : ""}" data-bc-vf-vax-time value="${escAttr(v.timeOfVaccination||"")}" /></div>
                   <div><label class="bc-lbl req">Vaccine completed</label><select class="bc-input${stage === "doctor_input" && missing.some((x) => x.key === "vaccineCompletedAck") ? " bc-input--err" : ""}" data-bc-vf-vax-ack><option value="">— Select —</option>${YESNO.map((o)=>`<option value="${escAttr(o)}"${v.vaccineCompletedAck===o?" selected":""}>${esc(o)}</option>`).join("")}</select></div>
                 </div>`
              : ""
          }
          ${
            typeKey === "breast_exam"
              ? `<div class="bc-breast">
                   <div class="bc-breast__chart" data-bc-breast-chart aria-label="Breast chart">
                     ${(v.breastLumps || [])
                       .map((m) => `<span class="bc-breast__mark" style="left:${escAttr(m.x)}%;top:${escAttr(m.y)}%" title="${escAttr(m.side)}"></span>`)
                       .join("")}
                     <div class="bc-breast__grid" aria-hidden="true"></div>
                   </div>
                   <div class="bc-breast__side">
                     <label class="bc-lbl req">Clinical findings</label>
                     <textarea class="bc-textarea${stage === "doctor_input" && missing.some((x) => x.key === "breastExamFindings") ? " bc-input--err" : ""}" rows="3" data-bc-vf-be-findings>${esc(
                       v.breastExamFindings || ""
                     )}</textarea>
                     <label class="bc-lbl req">Outcome</label>
                     <select class="bc-input${stage === "doctor_input" && missing.some((x) => x.key === "breastExamOutcome") ? " bc-input--err" : ""}" data-bc-vf-be-outcome>
                       <option value="">— Select —</option>${BREAST_OUTCOME_OPTS.map((o)=>`<option value="${escAttr(o)}"${v.breastExamOutcome===o?" selected":""}>${esc(o)}</option>`).join("")}
                     </select>
                     <div class="bc-meta">Click the chart to mark lump locations (optional).</div>
                   </div>
                 </div>`
              : ""
          }
        </div>
      </div>`
          : ""
      }
      ${
        showPP
          ? `<div class="bc-sect${stage === "pending_print" ? " bc-sect--pink" : ""}">
        <div class="bc-sect__hd${stage === "pending_print" ? " bc-sect__hd--pink" : ""}">
          <span>4 · Pending print</span>
          ${stage === "complete" ? `<button type="button" class="bc-btn-danger bc-btn-tiny" data-bc-vf-reopen-pp>Re-open</button>` : ""}
        </div>
        <div class="bc-sect__bd">
          <button type="button" class="ui-btn ui-btn--default ui-btn--sm bc-fullwidth" data-bc-vf-complete>Generate & send letter → Mark complete</button>
          ${stage === "complete" ? `<div class="bc-done-msg">Letter sent — visit complete</div>` : ""}
        </div>
      </div>`
          : ""
      }
      <div class="bc-modal-actions">
        <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-bc-modal-close>Cancel</button>
        <button type="button" class="ui-btn ui-btn--default ui-btn--sm" data-bc-vf-save>Save visit</button>
      </div>
    </div>`;
  }

  function renderModal(bc) {
    if (!bc.modal) return "";
    const m = bc.modal;
    let inner = "";
    if (m.type === "newApt" || m.type === "reschedule") inner = renderAptModal(bc);
    else if ((m.type === "editVisit" || m.type === "newVisit") && !m.letterMode) inner = renderVisitFormModal(bc);
    else if (m.type === "letter" || (m.type === "editVisit" && m.letterMode)) inner = renderLetterModal(m);
    else if (m.type === "newPatient" || m.type === "editPatient") inner = renderPatientFormModal(m);
    return `<div class="bc-modal-backdrop" id="bc-modal-backdrop">
      <div class="bc-modal-panel" data-bc-modal-panel>${inner}</div>
    </div>`;
  }

  /** Keep KPI highlight in the sidebar summary in sync with filter dropdowns. */
  function syncKpiActiveFromFilters(bc) {
    const ft = String(bc.filterType || "all");
    const fs = String(bc.filterStage || "all");
    if (fs === "action_needed" && ft === "all") {
      bc.kpiActive = "action_needed";
    } else if (fs === "all" && (ft === "mammogram" || ft === "hpv" || ft === "pap")) {
      bc.kpiActive = ft;
    } else {
      bc.kpiActive = null;
    }
  }

  function renderClinicSidebarSummary(bc, stats) {
    const rowBtn = (key, dotMod, label, n, doneN) => {
      const active = bc.kpiActive === key;
      return `<li>
        <button type="button" class="bc-sidebar-summary__row${active ? " bc-sidebar-summary__row--active" : ""}" data-bc-kpi="${escAttr(
        key
      )}" aria-pressed="${active}">
          <span class="bc-sidebar-summary__dot bc-sidebar-summary__dot--${escAttr(dotMod)}" aria-hidden="true"></span>
          <span class="bc-sidebar-summary__row-line">${esc(label)}: <strong>${esc(String(n))}</strong> <span class="bc-sidebar-summary__row-done">(${esc(
        String(doneN)
      )} done)</span></span>
        </button>
      </li>`;
    };
    const actionOn = bc.kpiActive === "action_needed";
    return `<div class="bc-sidebar-summary" aria-label="Today's summary">
      <div class="bc-sidebar-summary__kicker">Today</div>
      <button type="button" class="bc-sidebar-summary__total" data-bc-kpi="total">
        <span class="bc-sidebar-summary__total-top">
          <span class="bc-sidebar-summary__total-label">Total</span>
          <span class="bc-sidebar-summary__total-value">${esc(String(stats.total))}</span>
        </span>
        <span class="bc-sidebar-summary__done-badge">${esc(String(stats.completedTotal))} done</span>
      </button>
      <ul class="bc-sidebar-summary__list" role="list">
        ${rowBtn("mammogram", "mammo", "Mammogram", stats.mammo, stats.completedMammo)}
        ${rowBtn("hpv", "hpv", "HPV Test", stats.hpv, stats.completedHpv)}
        ${rowBtn("pap", "pap", "Pap Test", stats.pap, stats.completedPap)}
        ${rowBtn("hpv_vaccine", "pap", "HPV Vaccine", stats.hpvVax, stats.completedHpvVax)}
        ${rowBtn("breast_exam", "pap", "Breast Exam", stats.breastExam, stats.completedBreastExam)}
      </ul>
      <button type="button" class="bc-sidebar-summary__action${actionOn ? " bc-sidebar-summary__action--active" : ""}" data-bc-kpi="action_needed" aria-pressed="${actionOn}">
        <span class="bc-sidebar-summary__action-label">Action needed</span>
        <span class="bc-sidebar-summary__action-num">${esc(String(stats.actionNeeded))}</span>
      </button>
    </div>`;
  }

  function renderClinicSidebarFilters(bc, searchFieldHtml) {
    const wkStart = getWeekStartIso(bc);
    const wkEnd = sundayOfWeekFromMonday(wkStart);
    const dateBtnLabel = fmtDdMmYyyy(bc.calDate);
    const dateAria = bc.worklistMode === "week" ? "Choose date (week adjusts to that week)" : "Choose date";
    const ft = String(bc.filterType || "all");
    const fs = String(bc.filterStage || "all");
    const fd = String(bc.filterDoctor || "all");
    const sel = (v, cur) => (v === cur ? " selected" : "");
    return `<div class="bc-clinic-sidebar__filters">
      <label class="bc-sb-field">
        <span class="bc-sb-field__label">Date</span>
        <div class="bc-date-wrap bc-date-wrap--sidebar">
          <div class="bc-date-field" aria-label="${escAttr(dateAria)}">
            <input type="text" class="bc-date-display" placeholder="DD/MM/YYYY" value="${escAttr(dateBtnLabel)}" readonly data-bc-date-display />
            <button type="button" class="bc-date-icon" aria-label="Choose date" title="Choose date" data-bc-date-open>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                <path d="M16 2v4M8 2v4M3 10h18"></path>
              </svg>
            </button>
          </div>
          <input type="date" class="bc-date-input-hidden" data-bc-cal-date value="${escAttr(bc.calDate)}" />
        </div>
      </label>
      <label class="bc-sb-field">
        <span class="bc-sb-field__label">Screening Type</span>
        <select class="bc-sb-select" data-bc-filter="type">
          <option value="all"${sel("all", ft)}>All Types</option>
          <option value="mammogram"${sel("mammogram", ft)}>Mammogram</option>
          <option value="hpv"${sel("hpv", ft)}>HPV Test</option>
          <option value="pap"${sel("pap", ft)}>Pap Test</option>
          <option value="hpv_vaccine"${sel("hpv_vaccine", ft)}>HPV Vaccine</option>
          <option value="breast_exam"${sel("breast_exam", ft)}>Breast Exam</option>
        </select>
      </label>
      <label class="bc-sb-field">
        <span class="bc-sb-field__label">Stage</span>
        <select class="bc-sb-select" data-bc-filter="stage">
          <option value="all"${sel("all", fs)}>All Stages</option>
          <option value="action_needed"${sel("action_needed", fs)}>Action needed</option>
          <option value="appointment"${sel("appointment", fs)}>Booked</option>
          <option value="pending_result"${sel("pending_result", fs)}>Pending Result</option>
          <option value="doctor_input"${sel("doctor_input", fs)}>Doctor Input</option>
          <option value="pending_print"${sel("pending_print", fs)}>Pending Print</option>
          <option value="complete"${sel("complete", fs)}>Complete</option>
          <option value="no_test"${sel("no_test", fs)}>No Test</option>
          <option value="no_show"${sel("no_show", fs)}>No Show</option>
          <option value="cancelled"${sel("cancelled", fs)}>Cancelled</option>
        </select>
      </label>
      <label class="bc-sb-field">
        <span class="bc-sb-field__label">Doctor</span>
        <select class="bc-sb-select" data-bc-filter="doctor">
          <option value="all"${sel("all", fd)}>All Doctors</option>
          <option value="na"${sel("na", fd)}>N/A</option>
          ${BISHAN_DAY_DOCTORS.map((d) => `<option value="${escAttr(d.name)}"${sel(d.name, fd)}>${esc(d.name)}</option>`).join("")}
        </select>
      </label>
      ${searchFieldHtml}
      <button type="button" class="ui-btn ui-btn--outline ui-btn--sm bc-clinic-sidebar__btn-export" data-bc-export-csv>
        Export CSV
      </button>
    </div>`;
  }

  function renderClinicSidebar(bc, stats, searchFieldHtml) {
    return `<aside class="bc-clinic-sidebar" aria-label="Clinic navigation and filters">
      <div class="bc-clinic-sidebar__summary">
        ${renderClinicSidebarSummary(bc, stats)}
      </div>
      <div class="bc-clinic-sidebar__body">
        ${renderClinicSidebarFilters(bc, searchFieldHtml)}
      </div>
      <div class="bc-clinic-sidebar__actions">
        <button type="button" class="ui-btn ui-btn--default ui-btn--sm bc-clinic-sidebar__btn-primary" data-bc-new-apt>+ New Appointment</button>
        <button type="button" class="ui-btn ui-btn--outline ui-btn--sm bc-clinic-sidebar__btn-secondary" data-bc-new-patient>+ Add patient</button>
      </div>
    </aside>`;
  }

  function renderMarkup(bc) {
    TODAY = todaySGT();
    const dayVis = bc.visits.filter((v) => v.date === bc.calDate);
    const pt = (v) => bc.patients.find((x) => x.id === v.patientId);
    const vType = (v) => v.screeningType || (pt(v) && pt(v).type) || "";
    const isComplete = (v) => v.stage === "complete";
    const stats = {
      total: dayVis.length,
      mammo: dayVis.filter((v) => vType(v) === "mammogram").length,
      hpv: dayVis.filter((v) => vType(v) === "hpv").length,
      pap: dayVis.filter((v) => vType(v) === "pap").length,
      hpvVax: dayVis.filter((v) => vType(v) === "hpv_vaccine").length,
      breastExam: dayVis.filter((v) => vType(v) === "breast_exam").length,
      completedTotal: dayVis.filter(isComplete).length,
      completedMammo: dayVis.filter((v) => isComplete(v) && vType(v) === "mammogram").length,
      completedHpv: dayVis.filter((v) => isComplete(v) && vType(v) === "hpv").length,
      completedPap: dayVis.filter((v) => isComplete(v) && vType(v) === "pap").length,
      completedHpvVax: dayVis.filter((v) => isComplete(v) && vType(v) === "hpv_vaccine").length,
      completedBreastExam: dayVis.filter((v) => isComplete(v) && vType(v) === "breast_exam").length,
      actionNeeded: bc.visits.filter((v) => ["pending_result", "doctor_input", "pending_print"].includes(v.stage)).length,
    };
    const sq = bc.search.toLowerCase().trim();
    const searchResults = sq
      ? bc.patients.filter(
          (p) =>
            p.name.toLowerCase().includes(sq) || p.nric.toLowerCase().includes(sq) || (p.phone || "").includes(sq)
        )
      : [];
    const selPat = bc.selPatId ? bc.patients.find((p) => p.id === bc.selPatId) : null;
    const pVisits = selPat
      ? [...bc.visits].filter((v) => v.patientId === selPat.id).sort((a, b) => b.date.localeCompare(a.date))
      : [];
    const nextApt = pVisits.filter((v) => !isSlotPast(v.date, v.slot))[0];

    const searchDrop =
      sq && searchResults.length
        ? `<div class="bc-search-drop">
        <div class="bc-search-drop__hd">${searchResults.length} patient(s) found</div>
        <div class="bc-search-drop__list">
          ${searchResults
            .slice(0, 8)
            .map((p) => {
              const q = sq;
              const mf = p.nric.toLowerCase().includes(q) ? "NRIC" : (p.phone || "").includes(q) ? "Mobile" : "Name";
              return `<div class="bc-search-item" data-bc-open-patient="${escAttr(p.id)}">
              ${avatarHtml(p.name, 30)}
              <div class="bc-search-item__txt">
                <div><span class="bc-strong">${esc(p.name)}</span> ${typeBadgeHtml(p.type)} <span class="bc-via">${esc(mf)}</span></div>
                <div class="bc-meta">${esc(p.nric)} · ${esc(p.phone)} · Age ${esc(p.age)}</div>
              </div>
            </div>`;
            })
            .join("")}
        </div>
      </div>`
        : "";

    const main =
      bc.view === "worklist"
        ? renderWorklist(bc)
        : selPat
          ? `<div class="bc-patient-grid">${renderPatientLeft(bc, selPat, nextApt, pVisits)}${renderPatientRight(bc, selPat, pVisits)}</div>`
          : renderWorklist(bc);

    const toast = bc.toast ? `<div class="bc-toast" role="status">${esc(bc.toast)}</div>` : "";

    const searchField = `<div class="bc-search-wrap bc-search-wrap--sidebar">
            <div class="toolbar-search bc-bsh-toolbar-search bc-bsh-toolbar-search--sidebar" role="search">
              <span class="toolbar-search__icon" aria-hidden="true">${DETAIL_SEARCH_ICON}</span>
              <input type="search" placeholder="Name, NRIC or phone…" value="${escAttr(
                bc.search
              )}" autocomplete="off" data-bc-search />
            </div>
            ${searchDrop}
          </div>`;

    const isPatientRoute = bc.view === "patient" && selPat;
    const clinicChrome = !isPatientRoute
      ? `<div class="bc-clinic-layout">
      <header class="bc-clinic-main__strip bc-clinic-layout__strip" aria-label="Bishan Clinic header">
        <div class="bc-clinic-main__strip-inner">
          ${renderClinicMainTitle()}
          ${renderViewToggle(bc)}
        </div>
      </header>
      ${renderClinicSidebar(bc, stats, searchField)}
      <div class="bc-clinic-main">
        <div class="bc-main">${main}</div>
      </div>
    </div>`
      : "";
    const patientBar = isPatientRoute
      ? `<header class="bc-bsh-patient-bar" aria-label="Patient record">
        <div class="detail-hero bc-bsh-patient-hero">
          <div class="registration__toolbar-row detail-hero__toolbar-row">
            <a href="#/bishan-clinics" class="detail-hero__back" aria-label="Back to Bishan Clinic">${DETAIL_BACK_ICON}</a>
            <div class="registration__toolbar-titles">
              <h1 class="registration__title">${esc(selPat.name)}</h1>
              <p class="registration__subtitle">${esc(selPat.bishanCode || selPat.id)} · ${esc(selPat.nric || "—")}</p>
            </div>
          </div>
          <div class="detail-hero__meta detail-hero__meta--tags">${typeBadgeHtml(selPat.type)}</div>
        </div>
      </header>`
      : "";

    return `<section class="bc-screening${isPatientRoute ? " bc-screening--patient-route" : " bc-screening--clinic-index"}" id="bishan-screening-root" aria-label="Bishan cancer screening clinic">
      ${
        isPatientRoute && typeof global.WD_renderAppBreadcrumb === "function"
          ? global.WD_renderAppBreadcrumb(
              [{ label: "Bishan Clinic", href: "#/bishan-clinics" }, { label: selPat.name }],
              "registration"
            )
          : ""
      }
      ${isPatientRoute ? patientBar : ""}
      ${isPatientRoute ? `<div class="bc-main">${main}</div>` : clinicChrome}
      ${renderModal(bc)}
      ${toast}
    </section>`;
  }

  function bindScreening(root, api) {
    const get = api.getState;
    const commit = api.commit;

    function navigateToBishanPatient(bc, p) {
      const code = encodeURIComponent(p.bishanCode || p.id);
      const next = `#/bishan-clinics/patient/${code}`;
      bc.search = "";
      if (location.hash === next) {
        if (bc.selPatId !== p.id || bc.view !== "patient") {
          bc.selPatId = p.id;
          bc.view = "patient";
          bc.patTab = "overview";
          bc.detailFormEdit = null;
          bc.detailFormDraft = null;
        }
        commit();
      } else {
        location.hash = next;
      }
    }

    function collectDetailFormDom(root) {
      const out = {};
      if (!root) return out;
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
      return out;
    }

    root.addEventListener("input", (e) => {
      const t = e.target;
      const bc = get();
      if (t instanceof HTMLInputElement && t.hasAttribute("data-bc-search")) {
        bc.search = t.value;
        commit();
      }
    });

    root.addEventListener("change", (e) => {
      const t = e.target;
      if (!(t instanceof HTMLSelectElement)) return;
      const f = t.getAttribute("data-bc-filter");
      if (f !== "type" && f !== "stage" && f !== "doctor") return;
      const bc = get();
      if (f === "type") {
        bc.filterType = t.value;
      } else if (f === "doctor") {
        bc.filterDoctor = t.value;
      } else {
        bc.filterStage = t.value;
      }
      syncKpiActiveFromFilters(bc);
      commit();
    });

    root.addEventListener("click", (e) => {
      const raw = e.target;
      const el = raw instanceof Element ? raw : null;
      const bc = get();
      if (!el) return;

      if (el.closest("[data-bc-search-clear]")) {
        e.preventDefault();
        bc.search = "";
        commit();
        return;
      }

      if (el.closest("[data-bc-export-csv]")) {
        e.preventDefault();
        exportWorklistCsv(bc);
        showToast(bc, "Exported CSV.", commit);
        return;
      }

      if (el.closest("[data-bc-kpi]")) {
        e.preventDefault();
        const key = el.closest("[data-bc-kpi]").getAttribute("data-bc-kpi");
        const already = bc.kpiActive === key;
        const clear = already || key === "total";
        if (clear) {
          bc.kpiActive = null;
          bc.filterType = "all";
          bc.filterStage = "all";
          bc.filterDoctor = "all";
          commit();
          return;
        }
        bc.kpiActive = key;
        if (key === "action_needed") {
          bc.filterType = "all";
          bc.filterStage = "action_needed";
          bc.filterDoctor = "all";
        } else if (key === "mammogram" || key === "hpv" || key === "pap" || key === "hpv_vaccine" || key === "breast_exam") {
          bc.filterType = key;
          bc.filterStage = "all";
          bc.filterDoctor = "all";
        } else {
          bc.filterType = "all";
          bc.filterStage = "all";
          bc.filterDoctor = "all";
        }
        commit();
        return;
      }

      if (el.closest("[data-bc-wl-mode]")) {
        e.preventDefault();
        const mode = el.closest("[data-bc-wl-mode]").getAttribute("data-bc-wl-mode");
        if (mode === "worklist" || mode === "week") {
          bc.worklistMode = mode;
          if (mode === "week") {
            bc.weekStartISO = mondayOfIso(bc.calDate);
            bc.calDate = bc.weekStartISO;
          }
          commit();
        }
        return;
      }

      if (el.closest("[data-bc-week-prev]")) {
        e.preventDefault();
        const ws = getWeekStartIso(bc);
        bc.weekStartISO = addDaysIso(ws, -7);
        bc.calDate = bc.weekStartISO;
        commit();
        return;
      }
      if (el.closest("[data-bc-week-next]")) {
        e.preventDefault();
        const ws = getWeekStartIso(bc);
        bc.weekStartISO = addDaysIso(ws, 7);
        bc.calDate = bc.weekStartISO;
        commit();
        return;
      }

      if (el.closest("[data-bc-date-open]") || el.closest("[data-bc-date-display]")) {
        e.preventDefault();
        const wrap = el.closest(".bc-date-wrap");
        const inp = wrap && wrap.querySelector("[data-bc-cal-date]");
        if (inp instanceof HTMLInputElement) {
          if (typeof inp.showPicker === "function") inp.showPicker();
          else inp.click();
        }
        return;
      }

      if (el.closest("[data-bc-new-patient]")) {
        e.preventDefault();
        bc.modal = {
          type: "newPatient",
          name: "",
          dob: "",
          nric: "",
          age: "",
          phone: "",
          email: "",
          ptype: "mammogram",
          sexualActivity: "",
          lastMenses: "",
          lastPap: "NA",
          contactPref: "Call",
          referral: "Social Media",
        };
        commit();
        return;
      }

      if (el.closest("[data-bc-cal-date]")) {
        /* date changed via separate change event */
        return;
      }

      if (el.closest("[data-bc-new-apt]")) {
        e.preventDefault();
        bc.modal = { type: "newApt", date: bc.calDate, slot: 480, screeningType: "mammogram", patientId: "", patientQuery: "" };
        commit();
        return;
      }

      if (el.closest("[data-bc-profile]")) {
        e.preventDefault();
        const id = el.closest("[data-bc-profile]").getAttribute("data-bc-profile");
        const p = bc.patients.find((x) => x.id === id);
        if (p) {
          navigateToBishanPatient(bc, p);
        }
        return;
      }

      if (el.closest("[data-bc-open-patient]")) {
        e.preventDefault();
        const id = el.closest("[data-bc-open-patient]").getAttribute("data-bc-open-patient");
        const p = bc.patients.find((x) => x.id === id);
        if (p) {
          navigateToBishanPatient(bc, p);
        }
        return;
      }

      if (el.closest("[data-bc-pat-tab]")) {
        e.preventDefault();
        const next = el.closest("[data-bc-pat-tab]").getAttribute("data-bc-pat-tab");
        if (!next) return;
        if (next !== bc.patTab) {
          bc.detailFormEdit = null;
          bc.detailFormDraft = null;
        }
        bc.patTab = next;
        const sel = bc.selPatId ? bc.patients.find((x) => x.id === bc.selPatId) : null;
        if (sel && bc.view === "patient" && next) {
          const code = encodeURIComponent(sel.bishanCode || sel.id);
          const base = `#/bishan-clinics/patient/${code}`;
          const want = next !== "overview" ? `${base}/${encodeURIComponent(next)}` : base;
          if (location.hash !== want) location.hash = want;
          else commit();
        } else {
          commit();
        }
        return;
      }

      const bcFormAction = el.closest("[data-detail-form-action]");
      if (
        bcFormAction &&
        bc.view === "patient" &&
        bc.selPatId &&
        (bc.patTab === "medical-history" || bc.patTab === "other-details")
      ) {
        const action = bcFormAction.getAttribute("data-detail-form-action");
        const panelAttr = bcFormAction.getAttribute("data-detail-form-panel");
        const defs = global.WD_DETAIL_FORM_DEFAULTS;
        const stateKey =
          panelAttr === "medical-history" ? "medicalHistory" : panelAttr === "other-details" ? "otherDetails" : null;
        if (
          action &&
          panelAttr &&
          stateKey &&
          defs &&
          panelAttr === bc.patTab &&
          (action === "edit" || action === "cancel" || action === "save")
        ) {
          e.preventDefault();
          e.stopPropagation();
          ensurePatientDetailForms(bc, bc.selPatId);
          const bucket = bc.detailFormsByPatientId[bc.selPatId];
          if (action === "edit") {
            const def = defs[stateKey];
            bc.detailFormDraft = JSON.stringify({ ...def, ...(bucket[stateKey] || {}) });
            bc.detailFormEdit = panelAttr;
            commit();
            return;
          }
          if (action === "cancel") {
            try {
              if (bc.detailFormDraft) {
                bucket[stateKey] = JSON.parse(bc.detailFormDraft);
              }
            } catch (_) {
              /* ignore */
            }
            bc.detailFormEdit = null;
            bc.detailFormDraft = null;
            commit();
            return;
          }
          if (action === "save") {
            const formRoot = root.querySelector(`[data-detail-form-root="${panelAttr}"]`);
            bucket[stateKey] = collectDetailFormDom(formRoot);
            bc.detailFormEdit = null;
            bc.detailFormDraft = null;
            showToast(bc, "Data Updated", commit);
            return;
          }
        }
      }

      if (el.closest("[data-detail-section-nav]")) {
        e.preventDefault();
        const btn = el.closest("[data-detail-section-nav]");
        if (!btn) return;
        const id = btn.getAttribute("data-detail-section-nav");
        if (!id) return;
        if (!bc.detailNavByTab) bc.detailNavByTab = {};
        if (bc.patTab === "medical-history" || bc.patTab === "other-details") {
          bc.detailNavByTab[bc.patTab] = id;
        }
        commit();
        requestAnimationFrame(() => {
          const target = document.getElementById(id);
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        return;
      }

      if (el.closest("[data-bc-book-patient]")) {
        e.preventDefault();
        bc.modal = {
          type: "newApt",
          date: TODAY,
          slot: 480,
          screeningType: "mammogram",
          patientId: bc.selPatId || "",
          patientQuery: "",
        };
        commit();
        return;
      }

      if (el.closest("[data-bc-edit-patient]")) {
        e.preventDefault();
        const p = bc.patients.find((x) => x.id === bc.selPatId);
        if (!p) return;
        bc.modal = {
          type: "editPatient",
          id: p.id,
          name: p.name,
          dob: p.dob,
          nric: p.nric,
          age: p.age,
          phone: p.phone,
          email: p.email,
          ptype: p.type,
          sexualActivity: p.sexualActivity || "",
          lastMenses: p.lastMenses || "",
          lastPap: p.lastPap || "NA",
          contactPref: p.contactPref || "Call",
          referral: p.referral || "Social Media",
        };
        commit();
        return;
      }

      if (el.closest("[data-bc-new-visit]")) {
        e.preventDefault();
        const pt = bc.patients.find((x) => x.id === bc.selPatId);
        const typeKey = (pt && pt.type) || "mammogram";
        bc.modal = {
          type: "newVisit",
          patientId: bc.selPatId,
          date: TODAY,
          slot: 480,
          screeningType: typeKey,
          stage: "appointment",
          doctorNotes: "",
          labFile: null,
          resultLabel: "",
          papResultClass: "",
          papTestResultText: "",
          hpvAdvice: "",
          hpv16: "",
          hpv18: "",
          otherHighRiskHpv: "",
          modeOfCollection: "",
          doctorName: "",
          doctorMcr: "",
          referralRec: "",
          reviewInterval: "",
          nextApt: "",
          noRemarks: "",
          immunisationSequence: "",
          hpvVaccineProductName: "",
          hpvVaccineBatchNo: "",
          administrationSite: "",
          timeOfVaccination: "",
          vaccineCompletedAck: "",
          breastLumps: [],
          breastExamFindings: "",
          breastExamOutcome: "",
          otherRelevantFindings: "",
          attended: false,
          pendingNoStage: null,
          pendingCancel: false,
        };
        commit();
        return;
      }

      if (el.closest("[data-bc-edit-visit]")) {
        e.preventDefault();
        const id = el.closest("[data-bc-edit-visit]").getAttribute("data-bc-edit-visit");
        const v = bc.visits.find((x) => x.id === id);
        if (!v) return;
        bc.modal = {
          type: "editVisit",
          visit: { ...v },
          fp: v.labFile || null,
          letterMode: false,
          pendingNoStage: null,
          pendingCancel: false,
        };
        commit();
        return;
      }

      if (el.closest("[data-bc-letter-visit]")) {
        e.preventDefault();
        const id = el.closest("[data-bc-letter-visit]").getAttribute("data-bc-letter-visit");
        const v = bc.visits.find((x) => x.id === id);
        const p = bc.patients.find((x) => x.id === (v && v.patientId));
        if (v && p) {
          bc.modal = { type: "letter", text: genLetter(v, p) };
          commit();
        }
        return;
      }

      if (el.closest("[data-bc-reschedule]")) {
        e.preventDefault();
        const id = el.closest("[data-bc-reschedule]").getAttribute("data-bc-reschedule");
        const v = bc.visits.find((x) => x.id === id);
        if (v) {
          bc.modal = { type: "reschedule", visit: { ...v } };
          commit();
        }
        return;
      }

      if (el.closest("[data-bc-next-apt-interval]")) {
        e.preventDefault();
        const btn = el.closest("[data-bc-next-apt-interval]");
        if (!btn) return;
        const vid = btn.getAttribute("data-bc-visit-id");
        const iv = btn.getAttribute("data-bc-next-apt-interval");
        const nd = addInt(TODAY, iv);
        bc.visits = bc.visits.map((x) => (x.id === vid ? { ...x, date: nd } : x));
        showToast(bc, "Set: " + fmtDate(nd), commit);
        return;
      }

      if (el.closest("[data-bc-move-apt]")) {
        e.preventDefault();
        const btn = el.closest("[data-bc-move-apt]");
        if (!btn) return;
        const vid = btn.getAttribute("data-bc-move-apt");
        const iv = btn.getAttribute("data-bc-interval");
        const nd = addInt(TODAY, iv);
        bc.visits = bc.visits.map((x) => (x.id === vid ? { ...x, date: nd } : x));
        showToast(bc, "Moved: " + fmtDate(nd), commit);
        return;
      }

      if (el.closest("[data-bc-clear-apt]")) {
        e.preventDefault();
        const id = el.closest("[data-bc-clear-apt]").getAttribute("data-bc-clear-apt");
        bc.visits = bc.visits.map((x) => (x.id === id ? { ...x, date: "" } : x));
        showToast(bc, "Cleared.", commit);
        return;
      }

      /* Modal backdrop */
      if (e.target instanceof HTMLElement && e.target.id === "bc-modal-backdrop") {
        bc.modal = null;
        commit();
        return;
      }
      if (el.closest("[data-bc-modal-close]")) {
        e.preventDefault();
        bc.modal = null;
        commit();
        return;
      }

      if (el.closest("[data-bc-breast-chart]")) {
        e.preventDefault();
        if (!bc.modal) return;
        const m = bc.modal;
        const v = getV(m);
        const typeKey = v.screeningType || v.type || "";
        if (typeKey !== "breast_exam") return;
        const chart = el.closest("[data-bc-breast-chart]");
        const rect = chart.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
        const side = x < 50 ? "Left" : "Right";
        const list = Array.isArray(v.breastLumps) ? [...v.breastLumps] : [];
        list.push({ id: "m" + gid(), side, x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
        visitUpd(m, "breastLumps", list);
        commit();
        return;
      }

      if (el.closest("[data-bc-letter-back]")) {
        e.preventDefault();
        if (bc.modal && bc.modal.type === "editVisit") bc.modal.letterMode = false;
        commit();
        return;
      }

      if (el.closest("[data-bc-letter-copy]")) {
        e.preventDefault();
        const ta = root.querySelector("[data-bc-letter-text]");
        const txt = ta instanceof HTMLTextAreaElement ? ta.value : bc.modal.letterText || bc.modal.text || "";
        if (global.navigator.clipboard) global.navigator.clipboard.writeText(txt);
        showToast(bc, "Letter copied.", commit);
        return;
      }

      if (el.closest("[data-bc-apt-save]")) {
        e.preventDefault();
        const m = bc.modal;
        if (!m || (m.type !== "newApt" && m.type !== "reschedule")) return;
        const isNew = m.type === "newApt";
        const date = isNew ? m.date : m.visit.date;
        const slot = isNew ? m.slot : m.visit.slot;
        const currentVisitId = isNew ? null : m.visit.id;
        const typeKey = isNew
          ? String(m.screeningType || "mammogram")
          : String(m.visit.screeningType || m.visit.type || "mammogram");
        const blocked = !!(bc.blockedSlots && bc.blockedSlots[dateSlotKey(date, slot)]);
        if (blocked) {
          showToast(bc, "Slot is blocked — pick another time.", commit);
          return;
        }
        if (isNew && date < TODAY) {
          showToast(bc, "Appointment date must be today or later.", commit);
          return;
        }
        const full = isSlotFull(bc.visits, date, slot, typeKey, currentVisitId);
        if (full) {
          showToast(bc, "Slot unavailable for the selected screening type — pick another time.", commit);
          return;
        }
        if (isNew) {
          if (!m.patientId) {
            showToast(bc, "Please select a patient.", commit);
            return;
          }
          bc.visits.push({
            id: "v" + gid(),
            patientId: m.patientId,
            date: m.date,
            slot: m.slot,
            screeningType: typeKey,
            stage: "appointment",
            doctorNotes: "",
            labFile: null,
            resultLabel: "",
            referralRec: "",
            reviewInterval: "",
            nextApt: "",
            attended: false,
          });
        } else {
          const upd = { ...m.visit, screeningType: typeKey };
          bc.visits = bc.visits.map((x) => (x.id === m.visit.id ? upd : x));
        }
        bc.modal = null;
        showToast(bc, isNew ? "Visit added." : "Rescheduled.", commit);
        return;
      }

      if (el.closest("[data-bc-apt-pick]")) {
        e.preventDefault();
        const m = bc.modal;
        if (!m || m.type !== "newApt") return;
        const id = el.closest("[data-bc-apt-pick]").getAttribute("data-bc-apt-pick");
        if (!id) return;
        m.patientId = id;
        const p = bc.patients.find((x) => x.id === id);
        m.patientQuery = p ? p.name : m.patientQuery;
        commit();
        return;
      }

      if (el.closest("[data-bc-pat-save]")) {
        e.preventDefault();
        const m = bc.modal;
        if (!m || (m.type !== "newPatient" && m.type !== "editPatient")) return;
        const rootForm = el.closest(".bc-modal-panel");
        const read = (k) => {
          const inp = rootForm && rootForm.querySelector(`[data-bc-pat-form="${k}"]`);
          return inp && "value" in inp ? inp.value : m[k];
        };
        const data = {
          name: read("name"),
          dob: read("dob"),
          nric: read("nric"),
          age: read("age"),
          phone: read("phone"),
          email: read("email"),
          type: read("ptype"),
          lastMenses: read("lastMenses"),
          lastPap: read("lastPap"),
          sexualActivity: read("sexualActivity"),
          contactPref: read("contactPref"),
          referral: read("referral"),
        };
        if (!data.name || !data.nric || !data.phone || !data.email) return;
        bc.modal = null;
        if (m.type === "newPatient") {
          const maxBsh = bc.patients.reduce((n, p) => {
            const mm = /^BSH-(\d+)$/i.exec(String(p.bishanCode || "").trim());
            return mm ? Math.max(n, parseInt(mm[1], 10)) : n;
          }, 0);
          const bishanCode = "BSH-" + String(maxBsh + 1).padStart(3, "0");
          bc.patients.push({ id: "p" + gid(), bishanCode, ...data });
          showToast(bc, "Patient added.", commit);
        } else {
          bc.patients = bc.patients.map((x) => (x.id === m.id ? { ...x, ...data } : x));
          showToast(bc, "Updated.", commit);
        }
        return;
      }

      if (el.closest("[data-bc-vf-attended]")) return;
      if (el.closest("[data-bc-vf-no-test]")) {
        e.preventDefault();
        bc.modal.pendingNoStage = { stage: "no_test", remarks: "" };
        commit();
        return;
      }
      if (el.closest("[data-bc-vf-no-confirm]")) {
        e.preventDefault();
        const m = bc.modal;
        if (!m || !m.pendingNoStage) return;
        const stage = m.pendingNoStage.stage;
        const remarks = String(m.pendingNoStage.remarks || "");
        visitUpd(m, "noRemarks", remarks);
        visitUpd(m, "stage", stage);
        visitUpd(m, "attended", stage === "no_test");
        m.pendingNoStage = null;
        commit();
        return;
      }
      if (el.closest("[data-bc-vf-no-cancel]")) {
        e.preventDefault();
        if (bc.modal) bc.modal.pendingNoStage = null;
        commit();
        return;
      }
      if (el.closest("[data-bc-vf-cx-cancel]")) {
        e.preventDefault();
        if (bc.modal) bc.modal.pendingCancel = false;
        commit();
        return;
      }
      if (el.closest("[data-bc-vf-cx-confirm]")) {
        e.preventDefault();
        const m = bc.modal;
        if (!m || m.type !== "editVisit") return;
        const vid = m.visit && m.visit.id;
        bc.visits = bc.visits.filter((x) => x.id !== vid);
        bc.modal = null;
        showToast(bc, "Appointment cancelled and slot freed.", commit);
        return;
      }
      if (el.closest("[data-bc-vf-undo-no-test]")) {
        e.preventDefault();
        visitUpd(bc.modal, "stage", "appointment");
        commit();
        return;
      }
      if (el.closest("[data-bc-vf-reopen-di]")) {
        e.preventDefault();
        const m = bc.modal;
        visitUpd(m, "doctorName", "");
        visitUpd(m, "doctorMcr", "");
        visitUpd(m, "referralRec", "");
        visitUpd(m, "reviewInterval", "");
        visitUpd(m, "nextApt", "");
        // Keep lab result + file; clear doctor-input-only fields.
        visitUpd(m, "hpvAdvice", "");
        visitUpd(m, "papTestResultText", "");
        visitUpd(m, "papResultClass", "");
        visitUpd(m, "immunisationSequence", "");
        visitUpd(m, "hpvVaccineProductName", "");
        visitUpd(m, "hpvVaccineBatchNo", "");
        visitUpd(m, "administrationSite", "");
        visitUpd(m, "timeOfVaccination", "");
        visitUpd(m, "vaccineCompletedAck", "");
        visitUpd(m, "breastExamFindings", "");
        visitUpd(m, "breastExamOutcome", "");
        visitUpd(m, "stage", "doctor_input");
        commit();
        return;
      }
      if (el.closest("[data-bc-vf-reopen-pp]")) {
        e.preventDefault();
        visitUpd(bc.modal, "stage", "pending_print");
        commit();
        return;
      }
      if (el.closest("[data-bc-vf-complete]")) {
        e.preventDefault();
        const m = bc.modal;
        const v = getV(m);
        const pt = getPt(m, bc.patients, bc);
        if (!pt) return;
        visitUpd(m, "stage", "complete");
        m.letterMode = true;
        m.letterText = genLetter(v, pt);
        commit();
        return;
      }
      if (el.closest("[data-bc-vf-save]")) {
        e.preventDefault();
        const m = bc.modal;
        if (!m || (m.type !== "editVisit" && m.type !== "newVisit")) return;
        const panel = el.closest(".bc-modal-panel");
        const notesEl = panel && panel.querySelector("[data-bc-vf-notes]");
        const resEl = panel && panel.querySelector("[data-bc-vf-result]");
        const refEl = panel && panel.querySelector("[data-bc-vf-ref]");
        const intEl = panel && panel.querySelector("[data-bc-vf-interval]");
        const attEl = panel && panel.querySelector("[data-bc-vf-attended]");
        if (attEl instanceof HTMLInputElement) applyAttended(bc, attEl.checked);
        if (resEl instanceof HTMLSelectElement) applyResultLabel(bc, resEl.value);
        if (refEl instanceof HTMLSelectElement) applyReferralRec(bc, refEl.value);
        if (intEl instanceof HTMLSelectElement) applyReviewInterval(bc, intEl.value);
        if (notesEl instanceof HTMLTextAreaElement) applyDoctorNotes(bc, notesEl.value);

        if (m.type === "newVisit") {
          const v = m;
          const lab = v.labFile || v.fp || null;
          bc.visits.push({
            id: "v" + gid(),
            patientId: v.patientId,
            date: v.date,
            slot: v.slot,
            screeningType: v.screeningType || (bc.patients.find((p) => p.id === v.patientId)?.type || "mammogram"),
            stage: v.stage,
            doctorNotes: v.doctorNotes || "",
            doctorName: v.doctorName || "",
            doctorMcr: v.doctorMcr || "",
            referralRec: v.referralRec || "",
            reviewInterval: v.reviewInterval || "",
            labFile: lab,
            resultLabel: v.resultLabel || "",
            nextApt: v.nextApt || "",
            attended: !!v.attended,
            noRemarks: v.noRemarks || "",
            papResultClass: v.papResultClass || "",
            papTestResultText: v.papTestResultText || "",
            hpvAdvice: v.hpvAdvice || "",
            hpv16: v.hpv16 || "",
            hpv18: v.hpv18 || "",
            otherHighRiskHpv: v.otherHighRiskHpv || "",
            modeOfCollection: v.modeOfCollection || "",
            immunisationSequence: v.immunisationSequence || "",
            hpvVaccineProductName: v.hpvVaccineProductName || "",
            hpvVaccineBatchNo: v.hpvVaccineBatchNo || "",
            administrationSite: v.administrationSite || "",
            timeOfVaccination: v.timeOfVaccination || "",
            vaccineCompletedAck: v.vaccineCompletedAck || "",
            breastLumps: v.breastLumps || [],
            breastExamFindings: v.breastExamFindings || "",
            breastExamOutcome: v.breastExamOutcome || "",
            otherRelevantFindings: v.otherRelevantFindings || "",
          });
        } else {
          const vis = { ...m.visit };
          if (m.fp) vis.labFile = m.fp;
          bc.visits = bc.visits.map((x) => (x.id === vis.id ? vis : x));
        }
        bc.modal = null;
        showToast(bc, "Visit saved.", commit);
        return;
      }
    });

    root.addEventListener("change", (e) => {
      const t = e.target;
      const bc = get();
      if (t instanceof HTMLInputElement && t.hasAttribute("data-bc-cal-date")) {
        bc.calDate = t.value;
        if (bc.worklistMode === "week") {
          bc.weekStartISO = mondayOfIso(bc.calDate);
          bc.calDate = bc.weekStartISO;
        }
        commit();
        return;
      }
      if (t instanceof HTMLInputElement && t.type === "checkbox" && t.hasAttribute("data-bc-block-slot")) {
        const key = String(t.getAttribute("data-bc-block-slot") || "");
        if (!bc.blockedSlots) bc.blockedSlots = {};
        if (t.checked) bc.blockedSlots[key] = true;
        else delete bc.blockedSlots[key];
        commit();
        return;
      }
      if (bc.modal && t instanceof HTMLInputElement && t.hasAttribute("data-bc-vf-file")) {
        const m = bc.modal;
        const f = t.files && t.files[0];
        if (f) {
          const r = new FileReader();
          r.onload = () => {
            const dataUrl = r.result;
            if (m.visit) {
              m.visit = { ...m.visit, labFile: dataUrl };
              m.fp = dataUrl;
            } else {
              m.labFile = dataUrl;
              m.fp = dataUrl;
            }
            afterFileUpload(bc);
            commit();
          };
          r.readAsDataURL(f);
        }
        t.value = "";
        return;
      }
      if (bc.modal && t instanceof HTMLInputElement && t.hasAttribute("data-bc-apt-date") && t.type === "date") {
        const m = bc.modal;
        if (m.type === "newApt") m.date = t.value;
        else if (m.type === "reschedule") m.visit = { ...m.visit, date: t.value };
        commit();
        return;
      }
      if (bc.modal && t instanceof HTMLSelectElement && t.hasAttribute("data-bc-apt-field")) {
        const m = bc.modal;
        const f = t.getAttribute("data-bc-apt-field");
        const val = f === "slot" ? Number(t.value) : t.value;
        if (m.type === "newApt") {
          if (f === "slot") m.slot = val;
          else if (f === "screeningType") m.screeningType = String(val || "mammogram");
        } else if (m.type === "reschedule" && f === "slot") {
          m.visit = { ...m.visit, slot: val };
        }
        commit();
        return;
      }
      if (!bc.modal) return;
      if (t instanceof HTMLInputElement && t.type === "radio" && t.hasAttribute("data-bc-vf-att")) {
        const val = t.getAttribute("data-bc-vf-att");
        const m = bc.modal;
        if (!m) return;
        if (val === "attended") {
          m.pendingNoStage = null;
          m.pendingCancel = false;
          applyAttended(bc, true);
          // reset exception stage if coming back
          if (getV(m).stage === "no_test" || getV(m).stage === "no_show") visitUpd(m, "stage", "appointment");
          commit();
          return;
        }
        if (val === "no_test") {
          m.pendingCancel = false;
          m.pendingNoStage = { stage: "no_test", remarks: getV(m).noRemarks || "" };
          commit();
          return;
        }
        if (val === "no_show") {
          m.pendingCancel = false;
          m.pendingNoStage = { stage: "no_show", remarks: getV(m).noRemarks || "" };
          commit();
          return;
        }
        if (val === "cancellation") {
          m.pendingNoStage = null;
          m.pendingCancel = true;
          commit();
          return;
        }
      }
      if (t instanceof HTMLInputElement && t.hasAttribute("data-bc-vf-attended")) {
        applyAttended(bc, t.checked);
        commit();
        return;
      }
      if (t instanceof HTMLSelectElement && t.hasAttribute("data-bc-vf-result")) {
        applyResultLabel(bc, t.value);
        commit();
        return;
      }
      if (t instanceof HTMLSelectElement && t.hasAttribute("data-bc-vf-birads")) {
        visitUpd(bc.modal, "papResultClass", t.value);
        commit();
        return;
      }
      if (t instanceof HTMLSelectElement && t.hasAttribute("data-bc-vf-mammo-advice")) {
        visitUpd(bc.modal, "hpvAdvice", t.value);
        commit();
        return;
      }
      if (t instanceof HTMLSelectElement && t.hasAttribute("data-bc-vf-doctor")) {
        applyDoctorName(bc, t.value);
        commit();
        return;
      }
      if (t instanceof HTMLSelectElement && t.hasAttribute("data-bc-vf-ref")) {
        applyReferralRec(bc, t.value);
        commit();
        return;
      }
      if (t instanceof HTMLSelectElement && t.hasAttribute("data-bc-vf-interval")) {
        applyReviewInterval(bc, t.value);
        commit();
        return;
      }
      if (t instanceof HTMLInputElement && t.hasAttribute("data-bc-vf-nextapt") && t.type === "date") {
        applyNextApt(bc, t.value);
        commit();
        return;
      }
      if (t instanceof HTMLSelectElement && t.hasAttribute("data-bc-vf-hpv-advice")) {
        visitUpd(bc.modal, "hpvAdvice", t.value);
        maybeAutoAdvanceDoctorInput(bc.modal);
        commit();
        return;
      }
      if (t instanceof HTMLSelectElement && t.hasAttribute("data-bc-vf-pap-class")) {
        visitUpd(bc.modal, "papResultClass", t.value);
        maybeAutoAdvanceDoctorInput(bc.modal);
        commit();
        return;
      }
      if (t instanceof HTMLSelectElement && t.hasAttribute("data-bc-vf-mode")) {
        visitUpd(bc.modal, "modeOfCollection", t.value);
        commit();
        return;
      }
      if (t instanceof HTMLSelectElement && t.hasAttribute("data-bc-vf-vax-seq")) {
        visitUpd(bc.modal, "immunisationSequence", t.value);
        maybeAutoAdvanceDoctorInput(bc.modal);
        commit();
        return;
      }
      if (t instanceof HTMLSelectElement && t.hasAttribute("data-bc-vf-vax-prod")) {
        visitUpd(bc.modal, "hpvVaccineProductName", t.value);
        maybeAutoAdvanceDoctorInput(bc.modal);
        commit();
        return;
      }
      if (t instanceof HTMLSelectElement && t.hasAttribute("data-bc-vf-vax-site")) {
        visitUpd(bc.modal, "administrationSite", t.value);
        maybeAutoAdvanceDoctorInput(bc.modal);
        commit();
        return;
      }
      if (t instanceof HTMLSelectElement && t.hasAttribute("data-bc-vf-vax-ack")) {
        visitUpd(bc.modal, "vaccineCompletedAck", t.value);
        maybeAutoAdvanceDoctorInput(bc.modal);
        commit();
        return;
      }
      if (t instanceof HTMLSelectElement && t.hasAttribute("data-bc-vf-be-outcome")) {
        visitUpd(bc.modal, "breastExamOutcome", t.value);
        maybeAutoAdvanceDoctorInput(bc.modal);
        commit();
        return;
      }
    });

    root.addEventListener("input", (e) => {
      const t = e.target;
      const bc = get();
      if (bc.modal && bc.modal.type === "newApt" && t instanceof HTMLInputElement && t.hasAttribute("data-bc-apt-search")) {
        bc.modal.patientQuery = t.value;
        const pid = bc.modal.patientId;
        if (pid) {
          const p = bc.patients.find((x) => x.id === pid);
          const q = String(t.value || "").trim().toLowerCase();
          const nm = String(p?.name || "").trim().toLowerCase();
          if (q !== nm) bc.modal.patientId = "";
        }
        commit();
        return;
      }
      if (!bc.modal) return;
      if (bc.modal.pendingNoStage && t instanceof HTMLTextAreaElement && t.hasAttribute("data-bc-vf-no-remarks")) {
        bc.modal.pendingNoStage.remarks = t.value;
        commit();
        return;
      }
      if (t instanceof HTMLInputElement && t.hasAttribute("data-bc-vf-vax-batch")) {
        visitUpd(bc.modal, "hpvVaccineBatchNo", t.value);
        maybeAutoAdvanceDoctorInput(bc.modal);
        commit();
        return;
      }
      if (t instanceof HTMLInputElement && t.hasAttribute("data-bc-vf-vax-time")) {
        visitUpd(bc.modal, "timeOfVaccination", t.value);
        maybeAutoAdvanceDoctorInput(bc.modal);
        commit();
        return;
      }
      if (t instanceof HTMLTextAreaElement && t.hasAttribute("data-bc-vf-pap-text")) {
        visitUpd(bc.modal, "papTestResultText", t.value);
        maybeAutoAdvanceDoctorInput(bc.modal);
        commit();
        return;
      }
      if (t instanceof HTMLTextAreaElement && t.hasAttribute("data-bc-vf-be-findings")) {
        visitUpd(bc.modal, "breastExamFindings", t.value);
        maybeAutoAdvanceDoctorInput(bc.modal);
        commit();
        return;
      }
      if (t instanceof HTMLTextAreaElement && t.hasAttribute("data-bc-vf-findings")) {
        visitUpd(bc.modal, "otherRelevantFindings", t.value);
        commit();
        return;
      }
      if (
        (bc.modal.type === "letter" || bc.modal.letterMode) &&
        t instanceof HTMLTextAreaElement &&
        t.hasAttribute("data-bc-letter-text")
      ) {
        bc.modal.letterText = t.value;
        bc.modal.text = t.value;
      }
    });

  }

  /** Hash segment validation — keep in sync with `parseRoute` in app.js. */
  const BISHAN_PAT_TAB_IDS = ["overview", "visits", "results", "medical-history", "other-details"];

  global.WD_bishanScreening = {
    createInitialState,
    renderMarkup,
    bindScreening,
    BISHAN_PAT_TAB_IDS,
  };
})(window);
