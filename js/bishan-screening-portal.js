/**
 * Bishan Cancer Screening Services — worklist + patient chart (from ScreeningPortal_artifact.jsx).
 * Renders inside portal shell only (no local app header bar).
 */
(function (global) {
  "use strict";

  const STAGES = ["appointment", "pending_result", "doctor_input", "pending_print", "complete"];
  const SLABELS = {
    appointment: "Appointment",
    no_test: "No Test",
    pending_result: "Pending Result",
    doctor_input: "Doctor Input",
    pending_print: "Pending Print",
    complete: "Complete",
  };
  const TLABELS = { mammogram: "Mammogram", hpv: "HPV Test", pap: "Pap Test" };
  const RESULTS = ["Normal (Negative)", "Changes Detected (Positive)"];
  const INTERVALS = ["6 months", "1 year", "2 years", "3 years", "Not Required"];
  const CONTACT_OPTS = ["Call", "SMS", "Email", "WhatsApp"];
  const REFERRAL_OPTS = ["Social Media", "Friend / Family", "Doctor Referral", "Poster / Flyer", "Other"];
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
    no_test: { bg: "#F3F3F3", tx: "#666", dot: "#999" },
    pending_result: { bg: "#FEF3C7", tx: "#92400E", dot: "#F59E0B" },
    doctor_input: { bg: "#DCFCE7", tx: "#166534", dot: "#22C55E" },
    pending_print: { bg: "#FCEAF1", tx: "#9B1550", dot: "#D4547E" },
    complete: { bg: "#D1FAE5", tx: "#065F46", dot: "#10B981" },
  };
  const TYPE_CHIP = {
    mammogram: { bg: "#E8EFFD", tx: "#2255A4", label: "Mammogram" },
    hpv: { bg: "#FCEAF1", tx: "#9B1550", label: "HPV Test" },
    pap: { bg: "#EDE8F5", tx: "#5B2D8E", label: "Pap Test" },
  };
  const FN = "Sarah Mei Ling Linda Adeline Josephine Grace Rachel Cynthia Vivian Helen Irene Patricia Angela Doris Betty Christine Esther Frances Gloria Hazel Ivy Janet Karen Laura Margaret Nancy Olivia Pamela Queenie Rose Susan Teresa Uma Valerie Wendy Xiuying Yvonne Zoe Alice Brenda Carol Diana Elena Fiona Gina Hannah Ingrid Joyce Kim Lisa Monica Nora Ophelia Penny Rita Stella Tina Ursula Veronica Winifred Xiulan Yolanda Zara Amy Barbara Cindy Deborah Elaine Florence Georgia Holly Irma June Kelly Lynn Mabel Nadine Opal Pearl Quinn Renee Sandra Tracey Una Victoria Wilma Xin Yu Ting Zi Ling Aisha Bala Champa Deepa Esmeralda Fatimah Geetha Hamidah Indira Jasmine".split(
    " "
  );
  const LN = "Tan Wong Lim Koh Lee Ng Chua Ong Teo Goh Chong Tay Ho Yeo Loh Cheong Phua Soh Wee Seah".split(" ");
  const PTYPES = ["mammogram", "mammogram", "mammogram", "hpv", "hpv", "pap", "pap", "pap"];

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
  /** Live line: "16 Apr 2026 · 12:08:57 SGT" */
  function formatNowSGTClock() {
    const utc = Date.now() + new Date().getTimezoneOffset() * 60000;
    const sgt = new Date(utc + 8 * 3600000);
    const a = sgt.toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" });
    const t = `${String(sgt.getHours()).padStart(2, "0")}:${String(sgt.getMinutes()).padStart(2, "0")}:${String(sgt.getSeconds()).padStart(2, "0")}`;
    return `${a} · ${t} SGT`;
  }
  /** Labels aligned with staging Bishan worklist (werkdone prospect admin). */
  const STAGE_UI_LABEL = {
    appointment: "Booked",
    no_test: "No Test",
    pending_result: "Pending Result",
    doctor_input: "Doctor Review",
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
        referral: REFERRAL_OPTS[i % 5],
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
   * so the queue board / worklist show every screening type × Kanban column. Populates `detailSeedsOut`
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
    const st = p.type === "mammogram" ? "Mammogram" : p.type === "pap" ? "Pap Test" : "HPV Test";
    TODAY = todaySGT();
    return (
      "Bishan Cancer Screening Services\nSingapore Cancer Society\nBlock 163, Bishan Street 13, #01-01, Singapore 570163\nTel: 6499 9133\n\nDate: " +
      TODAY +
      "\n\nDear " +
      p.name +
      ",\nNRIC: " +
      p.nric +
      "\nScreening Date: " +
      v.date +
      "\n\nRe: " +
      st +
      " Screening Result\n\nRESULT: " +
      (v.resultLabel || "Pending") +
      "\n\n" +
      (isPos
        ? "Your result shows changes requiring further evaluation. Please contact us to schedule a follow-up at your earliest convenience."
        : "Your result is normal (negative). No further action is required.") +
      (v.referralRec && v.referralRec !== "None" ? "\n\nREFERRAL: " + v.referralRec : "") +
      (v.nextApt && v.nextApt !== "not_required"
        ? "\n\nNext recommended screening: " + fmtDate(v.nextApt)
        : v.nextApt === "not_required"
          ? "\n\nNo further screening required at this time."
          : "") +
      "\n\nContact: 6499 9133\n\nYours sincerely,\n____________________________\nDoctor-in-Charge\nBishan Cancer Screening Services"
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
    const t = type === "mammogram" || type === "hpv" || type === "pap" ? type : "pap";
    const labels = { mammogram: "Mammogram", hpv: "HPV Test", pap: "Pap Test" };
    return `<span class="bc-type-badge bc-type-badge--${t}">${esc(labels[t])}</span>`;
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
  function applyResultLabel(bc, val) {
    const m = bc.modal;
    const v = getV(m);
    visitUpd(m, "resultLabel", val);
    const hasFile = !!(m.fp || (m.visit && m.visit.labFile) || (m.type === "newVisit" && m.labFile));
    let stage = getVisitStage(m);
    if (val && hasFile && stage === "pending_result") visitUpd(m, "stage", "doctor_input");
    if (!val && stage === "doctor_input") visitUpd(m, "stage", "pending_result");
  }
  function afterFileUpload(bc) {
    const m = bc.modal;
    const cr = m.visit ? m.visit.resultLabel : m.resultLabel;
    const cs = m.visit ? m.visit.stage : m.stage;
    if (cr && cs === "pending_result") {
      if (m.visit) m.visit = { ...m.visit, stage: "doctor_input" };
      else m.stage = "doctor_input";
    }
  }
  function applyDoctorNotes(bc, val) {
    const m = bc.modal;
    const v = getV(m);
    visitUpd(m, "doctorNotes", val);
    const stage = getVisitStage(m);
    const af = val && v.resultLabel && v.referralRec && v.nextApt;
    if (af && stage === "doctor_input") visitUpd(m, "stage", "pending_print");
    if (!val && stage === "pending_print") visitUpd(m, "stage", "doctor_input");
  }
  function applyReferralRec(bc, val) {
    const m = bc.modal;
    const v = getV(m);
    visitUpd(m, "referralRec", val);
    const stage = getVisitStage(m);
    const af = v.doctorNotes && v.resultLabel && val && v.nextApt;
    if (af && stage === "doctor_input") visitUpd(m, "stage", "pending_print");
  }
  function applyReviewInterval(bc, val) {
    const m = bc.modal;
    const v = getV(m);
    visitUpd(m, "reviewInterval", val);
    visitUpd(m, "nextApt", val ? addInt(TODAY, val) : "");
    const stage = getVisitStage(m);
    const af = v.doctorNotes && v.resultLabel && v.referralRec && val;
    if (af && stage === "doctor_input") visitUpd(m, "stage", "pending_print");
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
      /** "queue" = card queue board, "worklist" = table (staging Bishan). */
      worklistMode: "queue",
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
    const stageAllow =
      stageFilter === "action"
        ? ["pending_result", "doctor_input", "pending_print"]
        : stageFilter === "done"
          ? ["complete"]
          : stageFilter === "dna"
            ? ["no_test"]
            : null;
    return bc.visits
      .filter((v) => v.date === bc.calDate)
      .map((v) => ({ ...v, patient: bc.patients.find((x) => x.id === v.patientId) }))
      .filter((r) => bc.filterType === "all" || (r.patient && r.patient.type === bc.filterType))
      .filter((r) => !stageAllow || stageAllow.includes(r.stage))
      .filter((r) => (r.patient ? matchPatient(r.patient) : !qRaw));
  }

  /** Kanban column key for staging-style queue board. */
  function visitKanbanColumn(stage) {
    if (stage === "no_test") return "dna";
    if (stage === "complete") return "done";
    if (stage === "appointment") return "waiting";
    if (stage === "pending_result" || stage === "doctor_input" || stage === "pending_print") return "ongoing";
    return "waiting";
  }

  /** Minutes since slot start (SGT) for wait label on cards. */
  function waitLabelSinceSlot(v) {
    try {
      const [y, m, d] = String(v.date).split("-").map(Number);
      const hh = Math.floor(v.slot / 60);
      const mm = v.slot % 60;
      const start = new Date(y, m - 1, d, hh, mm, 0);
      const now = nowSGT();
      const diffMin = Math.floor((now.getTime() - start.getTime()) / 60000);
      if (diffMin < 1) return "< 1m";
      const h = Math.floor(diffMin / 60);
      const mi = diffMin % 60;
      if (h > 0) return `${h}h ${mi}m`;
      return `${mi}m`;
    } catch {
      return "—";
    }
  }

  function sortRowsBySlot(rows) {
    return [...rows].sort((a, b) => a.slot - b.slot);
  }

  function renderViewToggle(bc) {
    return `<div class="bc-view-toggle" role="tablist" aria-label="View mode">
      <button type="button" role="tab" class="bc-view-toggle__btn${bc.worklistMode === "queue" ? " bc-view-toggle__btn--active" : ""}" data-bc-wl-mode="queue" aria-selected="${bc.worklistMode === "queue"}">Queue Board</button>
      <button type="button" role="tab" class="bc-view-toggle__btn${bc.worklistMode === "worklist" ? " bc-view-toggle__btn--active" : ""}" data-bc-wl-mode="worklist" aria-selected="${bc.worklistMode === "worklist"}">Worklist</button>
    </div>`;
  }

  function renderWorklistFiltersBar(bc) {
    return `<div class="bc-bsh-filters">
      <div class="toolbar-search bc-bsh-filters__search" role="search">
        <span class="toolbar-search__icon" aria-hidden="true">${DETAIL_SEARCH_ICON}</span>
        <input type="search" placeholder="Search by Name, NRIC, or Phone Number" value="${escAttr(
          bc.search
        )}" autocomplete="off" data-bc-search />
      </div>
      <div class="bc-date-wrap">
        <button type="button" class="bc-date-btn" aria-label="Choose date">${esc(fmtCalHeading(bc.calDate))}</button>
        <input type="date" class="bc-date-input-hidden" data-bc-cal-date value="${escAttr(bc.calDate)}" />
      </div>
      ${renderViewToggle(bc)}
    </div>`;
  }

  function renderKanbanCard(r) {
    const p = r.patient;
    const idLine = p ? esc(p.nric || p.phone || "—") : "—";
    const wait = esc(waitLabelSinceSlot(r));
    const startBtn =
      r.stage === "appointment"
        ? `<button type="button" class="bc-kanban__btn-start" data-bc-queue-start="${escAttr(r.id)}">→ Start</button>`
        : "";
    const doneBtn =
      r.stage === "pending_result" || r.stage === "doctor_input" || r.stage === "pending_print"
        ? `<button type="button" class="bc-kanban__btn-done" data-bc-queue-done="${escAttr(r.id)}">✓ Done</button>`
        : "";
    const actions = startBtn || doneBtn ? `<div class="bc-kanban__card-actions">${startBtn}${doneBtn}</div>` : "";
    return `<div class="bc-kanban__card">
      <div class="bc-kanban__card-top">
        <span class="bc-kanban__drag" aria-hidden="true" title="Reorder"></span>
        <button type="button" class="bc-kanban__menu" data-bc-profile="${escAttr(r.patientId)}" aria-label="More options" title="Open profile">⋮</button>
      </div>
      <div class="bc-kanban__card-body">
        <div class="bc-kanban__card-hit" role="button" tabindex="0" data-bc-open-patient="${escAttr(r.patientId)}" aria-label="Open patient ${escAttr(
          (p && p.name) || "record"
        )}">
          <div class="bc-kanban__patient-name">${esc(p && p.name)}</div>
          <div class="bc-kanban__patient-id">${idLine}</div>
          <div class="bc-kanban__card-meta">
            ${typeBadgeStagingHtml(p && p.type)}
            <span class="bc-kanban__appt-pill">Appt</span>
          </div>
          <div class="bc-kanban__wait">${wait}</div>
        </div>
        ${actions}
      </div>
    </div>`;
  }

  function renderQueueBoard(bc, rows) {
    const buckets = { waiting: [], ongoing: [], done: [], dna: [] };
    rows.forEach((r) => {
      const col = visitKanbanColumn(r.stage);
      buckets[col].push(r);
    });
    const cols = [
      ["waiting", "Waiting", buckets.waiting],
      ["ongoing", "Ongoing / Screening", buckets.ongoing],
      ["done", "Done", buckets.done],
      ["dna", "Do Not Attend", buckets.dna],
    ];
    const board = cols
      .map(([key, label, list]) => {
        const sorted = sortRowsBySlot(list);
        const count = sorted.length;
        const inner =
          count === 0
            ? `<div class="bc-kanban__empty">No patients</div>`
            : sorted.map((r) => renderKanbanCard(r)).join("");
        const dnaNote = key === "dna" ? ` title="${esc("Did not attend")}"` : "";
        return `<div class="bc-kanban__col bc-kanban__col--${key}" data-bc-kanban-col="${escAttr(key)}"${dnaNote}>
          <div class="bc-kanban__col-head">
            <span class="bc-kanban__col-label">${esc(label)}</span>
            <span class="bc-kanban__count" aria-label="${esc(String(count))} in column">${esc(String(count))}</span>
          </div>
          <div class="bc-kanban__col-body">${inner}</div>
        </div>`;
      })
      .join("");
    return `<div class="bc-bsh-worklist-wrap bc-bsh-worklist-wrap--queue">
      ${renderWorklistFiltersBar(bc)}
      <div class="bc-kanban">${board}</div>
    </div>`;
  }

  function renderWorklistTable(bc, rows) {
    const slotRows = allSlots()
      .map((s) => {
        const br = rows.filter((r) => r.slot === s);
        const isL = s >= 720 && s < 780;
        if (!br.length) {
          if (isL) {
            return `<tr class="bc-wl-tr bc-wl-tr--lunch"><td class="bc-wl-lunch-label" colspan="6">Lunch break</td></tr>`;
          }
          return `<tr class="bc-wl-tr bc-wl-tr--empty">
          <td class="bc-wl-td-time">${esc(slotLbl(s))}</td>
          <td class="bc-wl-td-patient"><span class="bc-available-text">Available</span></td>
          <td></td><td></td>
          <td class="bc-wl-td-attend">—</td>
          <td class="bc-wl-td-action"><button type="button" class="bc-walkin-btn" data-bc-new-apt-slot="${s}">+ Walk-in</button></td>
        </tr>`;
        }
        return br
          .map(
            (r) => `<tr class="bc-wl-tr bc-wl-tr--booked" data-bc-open-patient="${escAttr(r.patientId)}">
          <td class="bc-wl-td-time">${esc(slotLbl(s))}</td>
          <td class="bc-wl-td-patient"><span class="bc-wl-name">${esc(r.patient && r.patient.name)}</span><span class="bc-wl-phone">${esc(
            r.patient && r.patient.phone
          )}</span></td>
          <td>${typeBadgeStagingHtml(r.patient && r.patient.type)}</td>
          <td>${stagePillStagingHtml(r.stage)}</td>
          <td class="bc-wl-td-attend"><input type="checkbox" class="bc-wl-attend-cb" ${r.attended ? "checked" : ""} disabled aria-label="Attended" /></td>
          <td class="bc-wl-td-action"><button type="button" class="bc-btn-profile" data-bc-profile="${escAttr(r.patientId)}">Open profile</button></td>
        </tr>`
          )
          .join("");
      })
      .join("");
    return `<div class="bc-bsh-worklist-wrap">
      ${renderWorklistFiltersBar(bc)}
      <div class="bc-wl-shell">
        <table class="bc-wl-table">
          <thead>
            <tr>
              <th class="bc-wl-th-time" scope="col">Time</th>
              <th scope="col">Patient</th>
              <th scope="col">Type</th>
              <th scope="col">Stage</th>
              <th scope="col">Attended</th>
              <th class="bc-wl-th-action" scope="col">Action</th>
            </tr>
          </thead>
          <tbody>${slotRows}</tbody>
        </table>
      </div>
    </div>`;
  }

  function renderWorklist(bc) {
    const rows = getFilteredDayRows(bc);
    if (bc.worklistMode === "queue") return renderQueueBoard(bc, rows);
    return renderWorklistTable(bc, rows);
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
    const takenSlots = new Set(bc.visits.filter((v) => v.date === date && v.id !== currentVisitId).map((v) => v.slot));
    const isConflict = takenSlots.has(slot);
    const slotOpts = allSlots()
      .map((s) => {
        const taken = takenSlots.has(s) && s !== slot;
        const sel = s === slot ? " selected" : "";
        return `<option value="${s}"${taken ? " disabled" : ""}${sel}>${esc(slotLbl(s))}${taken ? " (booked)" : ""}</option>`;
      })
      .join("");
    const patOpts =
      `<option value="">— Select —</option>` +
      bc.patients.map((p) => `<option value="${escAttr(p.id)}"${m.patientId === p.id ? " selected" : ""}>${esc(p.name)} (${esc(TLABELS[p.type])})</option>`).join("");
    return `<div>
      <h3 class="bc-modal-title">${isNew ? "New appointment" : "Reschedule"}</h3>
      <label class="bc-lbl">Date</label>
      <input type="date" class="bc-input" data-bc-apt-date value="${escAttr(date)}" />
      <label class="bc-lbl">Time slot</label>
      <select class="bc-input${isConflict ? " bc-input--err" : ""}" data-bc-apt-field="slot">${slotOpts.replace(
        `value="${slot}"`,
        `value="${slot}" selected`
      )}</select>
      ${isConflict ? `<div class="bc-err">This slot is already booked. Choose another time.</div>` : ""}
      ${isNew ? `<label class="bc-lbl">Patient</label><select class="bc-input" data-bc-apt-field="patientId">${patOpts}</select>` : ""}
      <div class="bc-modal-actions">
        <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-bc-modal-close>Cancel</button>
        <button type="button" class="ui-btn ui-btn--default ui-btn--sm" data-bc-apt-save>Save</button>
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
    const typeSel = ["mammogram", "hpv", "pap"]
      .map((t) => `<option value="${t}"${m.ptype === t ? " selected" : ""}>${esc(TLABELS[t])}</option>`)
      .join("");
    const papOpts = PAP_LAST_OPTS.map((o) => `<option value="${escAttr(o)}"${m.lastPap === o ? " selected" : ""}>${esc(o)}</option>`).join("");
    const contactOpts = CONTACT_OPTS.map((o) => `<option value="${escAttr(o)}"${m.contactPref === o ? " selected" : ""}>${esc(o)}</option>`).join("");
    const refOpts = REFERRAL_OPTS.map((o) => `<option value="${escAttr(o)}"${m.referral === o ? " selected" : ""}>${esc(o)}</option>`).join("");
    return `<div>
      <h3 class="bc-modal-title">${isNew ? "Add patient" : "Edit patient"}</h3>
      <label class="bc-lbl req">Screening type</label>
      <select class="bc-input" data-bc-pat-form="ptype">${typeSel}</select>
      <label class="bc-lbl req">Name (as per NRIC)</label>
      <input class="bc-input" data-bc-pat-form="name" value="${escAttr(m.name)}" />
      <label class="bc-lbl req">NRIC / FIN</label>
      <input class="bc-input" data-bc-pat-form="nric" value="${escAttr(m.nric)}" />
      <label class="bc-lbl">Date of birth</label>
      <input type="date" class="bc-input" data-bc-pat-form="dob" value="${escAttr(m.dob)}" />
      <label class="bc-lbl req">Age</label>
      <input type="number" class="bc-input" data-bc-pat-form="age" value="${escAttr(m.age)}" />
      <label class="bc-lbl req">Mobile</label>
      <input class="bc-input" data-bc-pat-form="phone" value="${escAttr(m.phone)}" />
      <label class="bc-lbl req">Email</label>
      <input type="email" class="bc-input" data-bc-pat-form="email" value="${escAttr(m.email)}" />
      <label class="bc-lbl">Sexual activity?</label>
      <select class="bc-input" data-bc-pat-form="sexualActivity">
        <option value="">— Select —</option>
        <option value="Yes"${m.sexualActivity === "Yes" ? " selected" : ""}>Yes</option>
        <option value="No"${m.sexualActivity === "No" ? " selected" : ""}>No</option>
      </select>
      ${
        nc
          ? `<label class="bc-lbl">First day of last menstruation</label><input type="date" class="bc-input" data-bc-pat-form="lastMenses" value="${escAttr(m.lastMenses)}" />
         <label class="bc-lbl">Last Pap / HPV test</label><select class="bc-input" data-bc-pat-form="lastPap">${papOpts}</select>`
          : ""
      }
      <label class="bc-lbl">Contact method</label>
      <select class="bc-input" data-bc-pat-form="contactPref">${contactOpts}</select>
      <label class="bc-lbl">Referral source</label>
      <select class="bc-input" data-bc-pat-form="referral">${refOpts}</select>
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
    const stIdx = STAGES.indexOf(v.stage);
    const isNoTest = v.stage === "no_test";
    const stage = v.stage;
    const showPR = v.attended && stage === "pending_result";
    const showDI = v.attended && (stage === "doctor_input" || stage === "pending_print" || stage === "complete");
    const showPP = v.attended && (stage === "pending_print" || stage === "complete");
    const hasFilePreview = m.fp || v.labFile;

    const stageTrack = STAGES.map((s, i) => {
      const done = i < stIdx;
      const act = i === stIdx;
      const conn = i < STAGES.length - 1 ? `<div class="bc-st-conn" style="background:${done ? "#10B981" : "#EEE"}"></div>` : "";
      return `<div class="bc-st-node">
        <div class="bc-st-circle" style="background:${done ? "#10B981" : act ? "var(--color-primary)" : "#EEE"};border-color:${done ? "#10B981" : act ? "var(--color-primary)" : "#DDD"}">${done ? "✓" : i + 1}</div>
        <div class="bc-st-lbl" style="color:${act ? "var(--color-primary)" : done ? "#10B981" : "#BBB"}">${esc(SLABELS[s])}</div>
      </div>${conn}`;
    }).join("");

    const chip = STAGE_CHIP[v.stage] || STAGE_CHIP.appointment;
    const resultOpts = RESULTS.map((r) => `<option value="${escAttr(r)}"${v.resultLabel === r ? " selected" : ""}>${esc(r)}</option>`).join("");
    const refRecOpts = REFERRAL_REC_OPTS.map((o) => `<option value="${escAttr(o)}"${v.referralRec === o ? " selected" : ""}>${esc(o)}</option>`).join("");
    const intOpts = INTERVALS.map((o) => `<option value="${escAttr(o)}"${v.reviewInterval === o ? " selected" : ""}>${esc(o)}</option>`).join("");

    let fileBlock = "";
    if (hasFilePreview && String(hasFilePreview).startsWith("data:image"))
      fileBlock = `<img src="${escAttr(hasFilePreview)}" alt="" class="bc-lab-thumb" />`;
    else if (hasFilePreview) fileBlock = `<div class="bc-lab-fileok">Lab report uploaded</div>`;
    else fileBlock = `<div class="bc-lab-warn">Upload lab report to proceed to Doctor Input</div>`;

    return `<div>
      <h3 class="bc-modal-title">${esc(TLABELS[pt && pt.type] || "")} visit</h3>
      <p class="bc-modal-meta">${esc(pt && pt.name)} · ${esc(fmtDate(v.date))} · ${esc(slotLbl(v.slot))}</p>
      ${
        !isNoTest
          ? `<div class="bc-stage-track">${stageTrack}</div>
         <div class="bc-stage-pill" style="background:${escAttr(chip.bg)};color:${escAttr(chip.tx)}"><span class="bc-chip__dot" style="background:${escAttr(chip.dot)}"></span>${esc(SLABELS[v.stage] || v.stage)}</div>`
          : ""
      }
      ${isNoTest ? `<div class="bc-no-test">Marked as No Test — patient did not attend</div>` : ""}
      <div class="bc-sect">
        <div class="bc-sect__hd">1 · Attendance</div>
        <div class="bc-sect__bd bc-row">
          <label class="bc-check"><input type="checkbox" data-bc-vf-attended ${v.attended ? " checked" : ""}/> Patient attended this visit</label>
          ${stage === "appointment" && !v.attended ? `<button type="button" class="bc-btn-danger" data-bc-vf-no-test>Mark No Test</button>` : ""}
          ${isNoTest ? `<button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-bc-vf-undo-no-test>Undo No Test</button>` : ""}
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
          <label class="bc-lbl req">Doctor notes</label>
          <textarea class="bc-textarea" rows="3" data-bc-vf-notes placeholder="Clinical observations…">${esc(v.doctorNotes || "")}</textarea>
          <label class="bc-lbl req">Referral recommendation</label>
          <select class="bc-input" data-bc-vf-ref><option value="">— Select —</option>${refRecOpts}</select>
          ${v.referralRec && v.referralRec !== "None" ? `<div class="bc-ref-banner">${esc(v.referralRec)}</div>` : ""}
          ${v.referralRec === "None" ? `<div class="bc-ref-banner bc-ref-banner--ok">No referral needed</div>` : ""}
          <label class="bc-lbl req">Next review interval</label>
          <select class="bc-input" data-bc-vf-interval><option value="">— Select —</option>${intOpts}</select>
          ${
            v.nextApt
              ? `<div class="bc-next-banner${v.nextApt === "not_required" ? " bc-next-banner--muted" : ""}">${v.nextApt === "not_required" ? "No review required" : "Next review: " + esc(fmtDate(v.nextApt))}</div>`
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

  function renderMarkup(bc) {
    TODAY = todaySGT();
    const dayVis = bc.visits.filter((v) => v.date === bc.calDate);
    const pt = (v) => bc.patients.find((x) => x.id === v.patientId);
    const isComplete = (v) => v.stage === "complete";
    const stats = {
      total: dayVis.length,
      mammo: dayVis.filter((v) => pt(v) && pt(v).type === "mammogram").length,
      hpv: dayVis.filter((v) => pt(v) && pt(v).type === "hpv").length,
      pap: dayVis.filter((v) => pt(v) && pt(v).type === "pap").length,
      completedTotal: dayVis.filter(isComplete).length,
      completedMammo: dayVis.filter((v) => isComplete(v) && pt(v) && pt(v).type === "mammogram").length,
      completedHpv: dayVis.filter((v) => isComplete(v) && pt(v) && pt(v).type === "hpv").length,
      completedPap: dayVis.filter((v) => isComplete(v) && pt(v) && pt(v).type === "pap").length,
      actionNeeded: dayVis.filter((v) =>
        ["pending_result", "doctor_input", "pending_print"].includes(v.stage)
      ).length,
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

    const statCard = (mod, key, label, value, sub) => {
      const active = bc.kpiActive === key && key !== "total";
      const pressed = active ? ' aria-pressed="true"' : ' aria-pressed="false"';
      return `<button type="button" class="bc-stat-card ${mod}${active ? " bc-stat-card--active" : ""}" data-bc-kpi="${escAttr(
        key
      )}"${pressed}>
        <div class="bc-stat-card__label">${esc(label)}</div>
        <div class="bc-stat-card__value">${esc(String(value))}</div>
        <div class="bc-stat-card__sub">${esc(sub)}</div>
      </button>`;
    };
    const statsRow = `
      <div class="bc-bsh-stats-row" aria-label="Today's summary">
        ${statCard("bc-stat-card--total", "total", "Today's Total", stats.total, `${stats.completedTotal} completed`)}
        ${statCard("bc-stat-card--mammo", "mammogram", "Mammogram", stats.mammo, `${stats.completedMammo} completed`)}
        ${statCard("bc-stat-card--hpv", "hpv", "HPV Test", stats.hpv, `${stats.completedHpv} completed`)}
        ${statCard("bc-stat-card--pap", "pap", "Pap Test", stats.pap, `${stats.completedPap} completed`)}
        ${statCard("bc-stat-card--action", "action", "Action Needed", stats.actionNeeded, "pending lab · review")}
      </div>`;

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

    const searchField = `<div class="bc-search-wrap">
            <div class="toolbar-search bc-bsh-toolbar-search" role="search">
              <span class="toolbar-search__icon" aria-hidden="true">${DETAIL_SEARCH_ICON}</span>
              <input type="search" placeholder="Search by Name, NRIC, or Phone Number" value="${escAttr(
                bc.search
              )}" autocomplete="off" data-bc-search />
            </div>
            ${searchDrop}
          </div>`;

    const isPatientRoute = bc.view === "patient" && selPat;
    const clinicToolbar = `<header class="bc-bsh-toolbar">
        <div class="bc-bsh-toolbar__title-group">
          <h1 class="bc-bsh-toolbar__title">Bishan Clinic</h1>
          <p class="bc-bsh-toolbar__clock"><span data-bc-live-clock>${esc(formatNowSGTClock())}</span></p>
        </div>
        <div class="bc-bsh-toolbar__actions">
          <button type="button" class="ui-btn ui-btn--default ui-btn--sm" data-bc-new-apt>+ New Appointment</button>
          <button type="button" class="ui-btn ui-btn--outline ui-btn--sm" data-bc-new-patient>+ Add patient</button>
        </div>
      </header>`;
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

    return `<section class="bc-screening${isPatientRoute ? " bc-screening--patient-route" : ""}" id="bishan-screening-root" aria-label="Bishan cancer screening clinic">
      ${
        isPatientRoute && typeof global.WD_renderAppBreadcrumb === "function"
          ? global.WD_renderAppBreadcrumb(
              [{ label: "Bishan Clinic", href: "#/bishan-clinics" }, { label: selPat.name }],
              "registration"
            )
          : ""
      }
      ${isPatientRoute ? patientBar : clinicToolbar}
      ${isPatientRoute ? "" : statsRow}
      <div class="bc-main">${main}</div>
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

    root.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const raw = e.target;
      const hit = raw instanceof Element ? raw.closest(".bc-kanban__card-hit") : null;
      if (!hit || !hit.hasAttribute("data-bc-open-patient")) return;
      e.preventDefault();
      const bc = get();
      const id = hit.getAttribute("data-bc-open-patient");
      const p = bc.patients.find((x) => x.id === id);
      if (p) {
        navigateToBishanPatient(bc, p);
      }
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

      if (el.closest("[data-bc-kpi]")) {
        e.preventDefault();
        const key = el.closest("[data-bc-kpi]").getAttribute("data-bc-kpi");
        const already = bc.kpiActive === key;
        const clear = already || key === "total";
        if (clear) {
          bc.kpiActive = null;
          bc.filterType = "all";
          bc.filterStage = "all";
          commit();
          return;
        }
        bc.kpiActive = key;
        if (key === "action") {
          bc.filterType = "all";
          bc.filterStage = "action";
        } else if (key === "mammogram" || key === "hpv" || key === "pap") {
          bc.filterType = key;
          bc.filterStage = "all";
        } else {
          bc.filterType = "all";
          bc.filterStage = "all";
        }
        commit();
        return;
      }

      if (el.closest("[data-bc-wl-mode]")) {
        e.preventDefault();
        const mode = el.closest("[data-bc-wl-mode]").getAttribute("data-bc-wl-mode");
        if (mode === "queue" || mode === "worklist") {
          bc.worklistMode = mode;
          commit();
        }
        return;
      }

      if (el.closest(".bc-date-btn")) {
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
        bc.modal = { type: "newApt", date: bc.calDate, slot: 480, patientId: "" };
        commit();
        return;
      }

      if (el.closest("[data-bc-new-apt-slot]")) {
        e.preventDefault();
        const s = Number(el.closest("[data-bc-new-apt-slot]").getAttribute("data-bc-new-apt-slot"));
        bc.modal = { type: "newApt", date: bc.calDate, slot: s, patientId: "" };
        commit();
        return;
      }

      if (el.closest("[data-bc-queue-start]")) {
        e.preventDefault();
        e.stopPropagation();
        const id = el.closest("[data-bc-queue-start]").getAttribute("data-bc-queue-start");
        const v = bc.visits.find((x) => x.id === id);
        if (v && v.stage === "appointment") {
          bc.visits = bc.visits.map((x) =>
            x.id === id ? { ...x, attended: true, stage: "pending_result" } : x
          );
          showToast(bc, "Screening started.", commit);
        }
        return;
      }

      if (el.closest("[data-bc-queue-done]")) {
        e.preventDefault();
        e.stopPropagation();
        const id = el.closest("[data-bc-queue-done]").getAttribute("data-bc-queue-done");
        const v = bc.visits.find((x) => x.id === id);
        if (v) {
          bc.modal = { type: "editVisit", visit: { ...v }, fp: v.labFile || null, letterMode: false };
          commit();
        }
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
        bc.modal = { type: "newApt", date: TODAY, slot: 480, patientId: bc.selPatId || "" };
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
        bc.modal = {
          type: "newVisit",
          patientId: bc.selPatId,
          date: TODAY,
          slot: 480,
          stage: "appointment",
          doctorNotes: "",
          labFile: null,
          resultLabel: "",
          referralRec: "",
          reviewInterval: "",
          nextApt: "",
          attended: false,
        };
        commit();
        return;
      }

      if (el.closest("[data-bc-edit-visit]")) {
        e.preventDefault();
        const id = el.closest("[data-bc-edit-visit]").getAttribute("data-bc-edit-visit");
        const v = bc.visits.find((x) => x.id === id);
        if (!v) return;
        bc.modal = { type: "editVisit", visit: { ...v }, fp: v.labFile || null, letterMode: false };
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
        const taken = bc.visits.some((v) => v.date === date && v.slot === slot && v.id !== currentVisitId);
        if (taken) {
          showToast(bc, "Slot already booked — pick another time.", commit);
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
          bc.visits = bc.visits.map((x) => (x.id === m.visit.id ? m.visit : x));
        }
        bc.modal = null;
        showToast(bc, isNew ? "Visit added." : "Rescheduled.", commit);
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
        visitUpd(bc.modal, "stage", "no_test");
        commit();
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
        const v = getV(m);
        visitUpd(m, "doctorNotes", "");
        visitUpd(m, "referralRec", "");
        visitUpd(m, "reviewInterval", "");
        visitUpd(m, "nextApt", "");
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
            stage: v.stage,
            doctorNotes: v.doctorNotes || "",
            referralRec: v.referralRec || "",
            reviewInterval: v.reviewInterval || "",
            labFile: lab,
            resultLabel: v.resultLabel || "",
            nextApt: v.nextApt || "",
            attended: !!v.attended,
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
          else if (f === "patientId") m.patientId = val;
        } else if (m.type === "reschedule" && f === "slot") {
          m.visit = { ...m.visit, slot: val };
        }
        commit();
        return;
      }
      if (!bc.modal) return;
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
      if (t instanceof HTMLSelectElement && t.hasAttribute("data-bc-vf-ref")) {
        applyReferralRec(bc, t.value);
        commit();
        return;
      }
      if (t instanceof HTMLSelectElement && t.hasAttribute("data-bc-vf-interval")) {
        applyReviewInterval(bc, t.value);
        commit();
      }
    });

    root.addEventListener("input", (e) => {
      const t = e.target;
      const bc = get();
      if (!bc.modal) return;
      if (
        (bc.modal.type === "letter" || bc.modal.letterMode) &&
        t instanceof HTMLTextAreaElement &&
        t.hasAttribute("data-bc-letter-text")
      ) {
        bc.modal.letterText = t.value;
        bc.modal.text = t.value;
      }
    });

    if (root._bcLiveClockId) {
      clearInterval(root._bcLiveClockId);
      root._bcLiveClockId = null;
    }
    const tickClock = () => {
      const el = root.querySelector("[data-bc-live-clock]");
      if (!el) {
        if (root._bcLiveClockId) {
          clearInterval(root._bcLiveClockId);
          root._bcLiveClockId = null;
        }
        return;
      }
      el.textContent = formatNowSGTClock();
    };
    tickClock();
    root._bcLiveClockId = setInterval(tickClock, 1000);
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
