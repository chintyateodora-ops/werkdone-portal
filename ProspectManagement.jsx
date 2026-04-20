/**
 * ProspectManagement.jsx — Standalone React module (v2)
 * Includes: prospect list, kanban, detail drawer, AND full screening
 * registration form for both Token URL (self-service) and Portal flows.
 *
 * No external dependencies beyond React.
 * Drop into any React app: <ProspectManagement />
 * Or paste into stackblitz.com / codesandbox.io
 */

import { useState, useMemo, useCallback, useRef } from "react";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const PROGRAMS = ["All", "Mammobus", "HPV", "FIT"];
const STATUSES = [
  { key: "qualified", label: "Qualified" },
  { key: "booked",    label: "Booked"    },
  { key: "screened",  label: "Screened"  },
];
const RISK_LEVELS       = ["low", "medium", "high"];
const SOURCE_TYPES      = ["Event", "Campaign", "Manual"];
const ATTENDANCE_OPT    = ["Attended", "Rescheduled", "No Show", "Cancelled"];
const APPT_TYPES        = [
  { key: "mammobus",    label: "Mammobus"    },
  { key: "scs-clinic",  label: "SCS Clinic"  },
  { key: "healthier-sg",label: "Healthier SG"},
];
const CHAS_OPTIONS      = ["Blue", "Orange", "Green", "Not Applicable"];
const HEALTHIER_SG_OPT  = ["Enrolled", "Not Enrolled", "Unsure"];
const RESIDENTIAL_OPT   = ["Singapore Citizen", "Permanent Resident", "Foreigner"];
const COUNTRY_OPT       = ["Singapore", "Malaysia", "Indonesia", "Other"];
const GENDER_OPT        = ["Female", "Male"];
const RACE_OPT          = ["Chinese", "Malay", "Indian", "Eurasian", "Others"];
const TIME_SLOT_OPT     = ["Morning", "Afternoon", "Evening"];
const LANGUAGE_OPT      = ["English", "Mandarin", "Malay", "Tamil", "Others"];
const SELF_REG_TOKEN_PARAM = "sr_token";

const REFERRAL_SOURCE_OPT = {
  mammobus: ["Event / Roadshow", "Campaign", "Referral from Friend/Family", "Social Media", "Website", "Walk-in", "Other"],
  hpv:      ["Event / Roadshow", "Campaign", "Referral", "Social Media", "Website", "Other"],
  fit:      ["Event / Roadshow", "Campaign", "Referral", "Social Media", "Website", "Other"],
};

const REG_NAV_ITEMS = {
  mammobus: [
    { id: "personal",        label: "Personal Information"     },
    { id: "address",         label: "Residential Address"      },
    { id: "subsidies",       label: "Healthier SG & Subsidies" },
    { id: "appointment-type",label: "Appointment Type"         },
    { id: "healthier-sg",    label: "Healthier SG Programme"   },
    { id: "appointment",     label: "Appointment Preferences"  },
    { id: "screening-qs",    label: "Screening Questions"      },
    { id: "engagement",      label: "Engagement"               },
    { id: "consent",         label: "Consent"                  },
  ],
  hpv: [
    { id: "eligibility",     label: "Screening Eligibility"    },
    { id: "personal",        label: "Personal Information"     },
    { id: "address",         label: "Residential Address"      },
    { id: "subsidies",       label: "Healthier SG & Subsidies" },
    { id: "appointment-type",label: "Appointment Type"         },
    { id: "healthier-sg",    label: "Healthier SG Programme"   },
    { id: "appointment",     label: "Appointment Preferences"  },
    { id: "engagement",      label: "Engagement"               },
    { id: "consent",         label: "Consent"                  },
  ],
  fit: [
    { id: "eligibility",     label: "Screening Eligibility"    },
    { id: "personal",        label: "Personal Information"     },
    { id: "address",         label: "Residential Address"      },
    { id: "subsidies",       label: "Healthier SG & Subsidies" },
    { id: "appointment-type",label: "Appointment Type"         },
    { id: "healthier-sg",    label: "Healthier SG Programme"   },
    { id: "appointment",     label: "Appointment Preferences"  },
    { id: "engagement",      label: "Engagement"               },
    { id: "consent",         label: "Consent"                  },
  ],
};

// ─────────────────────────────────────────────
// SEED DATA
// ─────────────────────────────────────────────
const SEED_PROSPECTS = [
  { rowKey:"PROS-001234-Mammobus", id:"PROS-001234", name:"Tan Mei Ling",       maskedNric:"S****782A", program:"Mammobus", appointmentType:"mammobus",     ageGender:"Female, 52 years", phone:"91234567", email:"meilingtan@email.com",  status:"booked",    sourceType:"Event",    sourceDetail:"Community Carnival @ Bishan",    risk:"medium", dateRegistered:"2026-03-10", nextReview:"2026-04-20", attendance:"Attended",    firstMammogramScreening:"no"  },
  { rowKey:"PROS-001235-HPV",      id:"PROS-001235", name:"Lim Hui Fen",        maskedNric:"T****391B", program:"HPV",      appointmentType:"scs-clinic",   ageGender:"Female, 34 years", phone:"82345678", email:"huifen@email.com",       status:"qualified", sourceType:"Campaign", sourceDetail:"Pink October Social Media",       risk:"low",    dateRegistered:"2026-03-15", nextReview:"2026-05-01", attendance:null,           firstMammogramScreening:"yes" },
  { rowKey:"PROS-001236-FIT",      id:"PROS-001236", name:"Siti Norzahra",      maskedNric:"S****114C", program:"FIT",      appointmentType:"healthier-sg", ageGender:"Female, 61 years", phone:"93456789", email:"snorzahra@email.com",    status:"screened",  sourceType:"Manual",   sourceDetail:"Walk-in referral",               risk:"high",   dateRegistered:"2026-02-28", nextReview:"2026-04-15", attendance:"Attended",    firstMammogramScreening:"no"  },
  { rowKey:"PROS-001237-Mammobus", id:"PROS-001237", name:"Priya Ramasamy",     maskedNric:"T****556D", program:"Mammobus", appointmentType:"mammobus",     ageGender:"Female, 47 years", phone:"84567890", email:"priyar@email.com",       status:"qualified", sourceType:"Event",    sourceDetail:"Screening Fair @ Toa Payoh",     risk:"medium", dateRegistered:"2026-04-01", nextReview:"2026-05-15", attendance:null,           firstMammogramScreening:"yes" },
  { rowKey:"PROS-001238-HPV",      id:"PROS-001238", name:"Chen Xiao Ling",     maskedNric:"S****203E", program:"HPV",      appointmentType:"scs-clinic",   ageGender:"Female, 29 years", phone:"95678901", email:"xiaolingc@email.com",    status:"booked",    sourceType:"Campaign", sourceDetail:"HPV Awareness Drive",             risk:"low",    dateRegistered:"2026-04-05", nextReview:"2026-05-10", attendance:"Rescheduled", firstMammogramScreening:"yes" },
  { rowKey:"PROS-001239-FIT",      id:"PROS-001239", name:"Nadia Binte Hassan", maskedNric:"T****777F", program:"FIT",      appointmentType:"healthier-sg", ageGender:"Female, 58 years", phone:"96789012", email:"nadiahasan@email.com",   status:"booked",    sourceType:"Manual",   sourceDetail:"GP Referral",                    risk:"high",   dateRegistered:"2026-03-22", nextReview:"2026-04-22", attendance:"No Show",     firstMammogramScreening:"no"  },
  { rowKey:"PROS-001240-Mammobus", id:"PROS-001240", name:"Wong Siew Kwan",     maskedNric:"S****098G", program:"Mammobus", appointmentType:"mammobus",     ageGender:"Female, 55 years", phone:"87890123", email:"siewkwanw@email.com",    status:"screened",  sourceType:"Event",    sourceDetail:"Healthy SG @ Ang Mo Kio",        risk:"medium", dateRegistered:"2026-03-05", nextReview:"2027-03-05", attendance:"Attended",    firstMammogramScreening:"no"  },
  { rowKey:"PROS-001241-FIT",      id:"PROS-001241", name:"Rajeshwari D/O Kumar",maskedNric:"T****321H",program:"FIT",      appointmentType:"healthier-sg", ageGender:"Female, 63 years", phone:"98901234", email:"rajeshwari@email.com",   status:"qualified", sourceType:"Campaign", sourceDetail:"Colorectal Awareness Month",      risk:"high",   dateRegistered:"2026-04-10", nextReview:"2026-05-01", attendance:null,           firstMammogramScreening:"no"  },
];

const SEED_CLIENTS = [
  { nric:"S1234782A", name:"Tan Mei Ling",        dob:"1974-03-12", residential:"Singapore Citizen", gender:"Female", phone:"91234567", email:"meilingtan@email.com",  block:"202", street:"Bishan Street 22", floor:"05", unit:"101", postal:"570202", country:"Singapore" },
  { nric:"T1239391B", name:"Lim Hui Fen",          dob:"1992-07-08", residential:"Singapore Citizen", gender:"Female", phone:"82345678", email:"huifen@email.com",       block:"88",  street:"Pasir Drive",       floor:"12", unit:"203", postal:"510088", country:"Singapore" },
];

// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────
const T = {
  primary500: "#7c51a1", primary400: "#926eb1", primary100: "#f2eef6", primary600: "#6b4394",
  neutral9: "#272b30", neutral7: "#6a7178", neutral6: "#868e96",
  gray50: "#f9fafb", gray100: "#f3f4f6", gray200: "#e5e7eb",
  white: "#ffffff", red500: "#ef4444", amber600: "#d97706", green600: "#059669",
  blue700: "#1d4ed8", blue100: "#dbeafe",
};

const RISK_BADGE   = { low: { bg:"#d1fae5",color:"#065f46" }, medium:{ bg:"#fef3c7",color:"#92400e" }, high:{ bg:"#fee2e2",color:"#991b1b" } };
const STATUS_BADGE = { qualified:{ bg:"#e8effd",color:"#2255a4" }, booked:{ bg:"#fbeaf0",color:"#72243e" }, screened:{ bg:"#d1fae5",color:"#065f46" } };
const PROGRAM_BADGE= { Mammobus:{ bg:"#e6f1fb",color:"#0c447c" }, HPV:{ bg:"#fbeaf0",color:"#72243e" }, FIT:{ bg:"#ede8f5",color:"#5b2d8e" } };
const ATTEND_BADGE = { Attended:{ bg:"#d1fae5",color:"#065f46" }, Rescheduled:{ bg:"#fef3c7",color:"#92400e" }, "No Show":{ bg:"#fee2e2",color:"#991b1b" }, Cancelled:{ bg:"#f3f4f6",color:"#6a7178" } };

// ─────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────
function randomToken() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint8Array(16);
    crypto.getRandomValues(buf);
    return Array.from(buf, b => b.toString(16).padStart(2,"0")).join("");
  }
  return `demo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`;
}

function buildTokenUrl(program, token) {
  const base = typeof location !== "undefined" ? location.href.split("?")[0].split("#")[0] : "https://portal.example.com/";
  return `${base}?${SELF_REG_TOKEN_PARAM}=${token}#/register/${program.toLowerCase()}`;
}

function maskNric(raw) {
  if (!raw || raw.length < 4) return raw;
  return raw[0] + "****" + raw.slice(-3);
}

function calcAge(dob) {
  if (!dob) return null;
  const d = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--;
  return age;
}

// ─────────────────────────────────────────────
// SMALL UI HELPERS
// ─────────────────────────────────────────────
function Badge({ label, style }) {
  return (
    <span style={{ display:"inline-flex",alignItems:"center",padding:"2px 10px",borderRadius:999,fontSize:"0.6875rem",fontWeight:600,letterSpacing:"0.02em",whiteSpace:"nowrap",...style }}>
      {label}
    </span>
  );
}

function RiskDot({ risk }) {
  const colors = { low: T.green600, medium: T.amber600, high: T.red500 };
  return <span title={risk} style={{ display:"inline-block",width:8,height:8,borderRadius:"50%",background:colors[risk]??T.neutral6,flexShrink:0 }} />;
}

function IconBtn({ title, onClick, children }) {
  const [h,setH] = useState(false);
  return (
    <button title={title} onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:h?T.primary100:"transparent",border:"none",borderRadius:6,padding:"4px 6px",cursor:"pointer",color:h?T.primary500:T.neutral7,display:"flex",alignItems:"center",transition:"background 0.15s" }}>
      {children}
    </button>
  );
}

function Btn({ children, onClick, variant="primary", disabled=false, style={} }) {
  const [h,setH]=useState(false);
  const base = {
    primary:   { bg: T.primary500, bgH: T.primary600, color: T.white,    border:"none" },
    secondary: { bg: T.white,      bgH: T.gray50,      color: T.neutral7, border:`1px solid ${T.gray200}` },
    ghost:     { bg: "transparent",bgH: T.primary100,  color: T.primary500,border:"none" },
    danger:    { bg: "#fee2e2",    bgH: "#fecaca",     color: "#991b1b",   border:"none" },
  }[variant];
  return (
    <button onClick={disabled?undefined:onClick} disabled={disabled} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background: disabled?T.gray100:(h?base.bgH:base.bg), color: disabled?T.neutral6:base.color,
               border: base.border, borderRadius:8, padding:"7px 16px", fontWeight:600, fontSize:"0.875rem",
               cursor:disabled?"not-allowed":"pointer", transition:"background 0.15s", display:"flex",
               alignItems:"center", gap:6, ...style }}>
      {children}
    </button>
  );
}

function Field({ label, required, hint, children, style={} }) {
  return (
    <label style={{ display:"flex",flexDirection:"column",gap:5,flex:1,...style }}>
      <span style={{ fontSize:"0.8125rem",fontWeight:500,color:T.neutral7 }}>
        {label}{required && <span style={{ color:T.red500,marginLeft:2 }}>*</span>}
      </span>
      {children}
      {hint && <span style={{ fontSize:"0.75rem",color:T.neutral6 }}>{hint}</span>}
    </label>
  );
}

function TextIn({ value, onChange, placeholder="", required=false, disabled=false, type="text", maxLength, style={} }) {
  return (
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      required={required} disabled={disabled} maxLength={maxLength}
      style={{ border:`1px solid ${T.gray200}`,borderRadius:8,padding:"7px 12px",fontSize:"0.875rem",
               color:T.neutral9,background:disabled?T.gray50:T.white,width:"100%",boxSizing:"border-box",...style }} />
  );
}

function SelIn({ value, onChange, options, disabled=false, required=false, style={} }) {
  return (
    <select value={value} onChange={e=>onChange(e.target.value)} disabled={disabled} required={required}
      style={{ border:`1px solid ${T.gray200}`,borderRadius:8,padding:"7px 12px",fontSize:"0.875rem",
               color:value?"":T.neutral6,background:disabled?T.gray50:T.white,cursor:disabled?"default":"pointer",...style }}>
      <option value="">— select —</option>
      {options.map(o=>(
        <option key={o.value??o} value={o.value??o}>{o.label??o}</option>
      ))}
    </select>
  );
}

function RadioGroup({ options, value, onChange, disabled=false }) {
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
      {options.map(o=>(
        <label key={o.value} style={{ display:"flex",alignItems:"flex-start",gap:10,cursor:disabled?"default":"pointer",opacity:disabled?0.6:1 }}>
          <input type="radio" value={o.value} checked={value===o.value} onChange={()=>!disabled&&onChange(o.value)} disabled={disabled}
            style={{ marginTop:2,accentColor:T.primary500 }} />
          <div>
            <div style={{ fontSize:"0.875rem",fontWeight:500,color:T.neutral9 }}>{o.label}</div>
            {o.hint && <div style={{ fontSize:"0.75rem",color:T.neutral6,marginTop:2 }}>{o.hint}</div>}
          </div>
        </label>
      ))}
    </div>
  );
}

function AppointmentCard({ label, subtitle, description, selected, onClick }) {
  return (
    <div onClick={onClick} style={{ border:`2px solid ${selected?T.primary500:T.gray200}`,borderRadius:10,padding:"14px 16px",
      cursor:"pointer",background:selected?T.primary100:T.white,transition:"border-color 0.15s",display:"flex",gap:12,alignItems:"flex-start" }}>
      <div style={{ width:18,height:18,borderRadius:"50%",border:`2px solid ${selected?T.primary500:T.gray200}`,
        background:selected?T.primary500:T.white,flexShrink:0,marginTop:2,
        display:"flex",alignItems:"center",justifyContent:"center" }}>
        {selected && <div style={{ width:8,height:8,borderRadius:"50%",background:T.white }} />}
      </div>
      <div>
        <div style={{ fontWeight:600,fontSize:"0.9375rem",color:T.neutral9 }}>{label}</div>
        {subtitle && <div style={{ fontSize:"0.8125rem",color:T.primary500,fontWeight:500,marginTop:1 }}>{subtitle}</div>}
        {description && <div style={{ fontSize:"0.8125rem",color:T.neutral6,marginTop:4 }}>{description}</div>}
      </div>
    </div>
  );
}

function CheckboxMulti({ options, value=[], onChange }) {
  function toggle(v) {
    onChange(value.includes(v) ? value.filter(x=>x!==v) : [...value, v]);
  }
  return (
    <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
      {options.map(o=>{
        const active = value.includes(o);
        return (
          <label key={o} style={{ display:"flex",alignItems:"center",gap:6,cursor:"pointer",
            border:`1px solid ${active?T.primary500:T.gray200}`,borderRadius:999,padding:"4px 14px",
            background:active?T.primary100:T.white,fontSize:"0.875rem",color:active?T.primary600:T.neutral7,fontWeight:active?600:400 }}>
            <input type="checkbox" checked={active} onChange={()=>toggle(o)} style={{ display:"none" }} />
            {o}
          </label>
        );
      })}
    </div>
  );
}

function SectionCard({ id, title, children }) {
  return (
    <div id={`reg-${id}`} style={{ background:T.white,border:`1px solid ${T.gray200}`,borderRadius:12,padding:"24px 28px",marginBottom:16,scrollMarginTop:72 }}>
      <h3 style={{ margin:"0 0 20px",fontSize:"1rem",fontWeight:700,color:T.neutral9,paddingBottom:12,borderBottom:`1px solid ${T.gray200}` }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoBox({ children, type="info" }) {
  const colors = { info:{ bg:"#eff6ff",border:"#bfdbfe",color:"#1e40af" }, warn:{ bg:"#fffbeb",border:"#fde68a",color:"#92400e" } }[type];
  return (
    <div style={{ background:colors.bg,border:`1px solid ${colors.border}`,borderRadius:8,padding:"12px 16px",fontSize:"0.875rem",color:colors.color,lineHeight:1.5 }}>
      {children}
    </div>
  );
}

function RowGrid({ cols=2, children }) {
  return <div style={{ display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap:16 }}>{children}</div>;
}

// ─────────────────────────────────────────────
// NRIC INPUT (masked toggle)
// ─────────────────────────────────────────────
function NricInput({ value, onChange, disabled=false, required=false }) {
  const [revealed, setRevealed] = useState(false);
  const display = revealed ? value : (value ? maskNric(value) : "");
  return (
    <div style={{ display:"flex",gap:6 }}>
      <input
        type={revealed?"text":"password"} value={revealed?value:display}
        onChange={e=>onChange(e.target.value)} disabled={disabled} required={required}
        placeholder="e.g. S1234567A"
        style={{ border:`1px solid ${T.gray200}`,borderRadius:8,padding:"7px 12px",fontSize:"0.875rem",color:T.neutral9,
          background:disabled?T.gray50:T.white,flex:1 }} />
      <button type="button" onClick={()=>setRevealed(v=>!v)} tabIndex={-1}
        style={{ border:`1px solid ${T.gray200}`,borderRadius:8,padding:"7px 12px",background:T.gray50,cursor:"pointer",
          fontSize:"0.8125rem",color:T.neutral6,flexShrink:0 }}>
        {revealed?"Hide":"Show"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// CLIENT LOOKUP (portal only)
// ─────────────────────────────────────────────
function ClientLookup({ clients, onSelect }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    if (!q.trim()) return [];
    const lower = q.toLowerCase();
    return clients.filter(c => c.name.toLowerCase().includes(lower) || c.nric.toLowerCase().includes(lower));
  }, [q, clients]);

  return (
    <div style={{ background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:"16px 18px",marginBottom:16 }}>
      <div style={{ fontWeight:600,fontSize:"0.875rem",color:"#1e40af",marginBottom:10 }}>
        🔍 Look up existing client
      </div>
      <TextIn value={q} onChange={setQ} placeholder="Search by NRIC or name…" />
      {results.length > 0 && (
        <div style={{ marginTop:10,display:"flex",flexDirection:"column",gap:6 }}>
          {results.map(c=>(
            <div key={c.nric} onClick={()=>{ onSelect(c); setQ(""); }}
              style={{ display:"flex",justifyContent:"space-between",alignItems:"center",
                background:T.white,border:`1px solid ${T.gray200}`,borderRadius:8,padding:"10px 14px",cursor:"pointer" }}>
              <div>
                <div style={{ fontWeight:600,fontSize:"0.875rem",color:T.neutral9 }}>{c.name}</div>
                <div style={{ fontSize:"0.75rem",color:T.neutral6 }}>{maskNric(c.nric)} · {c.phone}</div>
              </div>
              <span style={{ fontSize:"0.8125rem",color:T.primary500,fontWeight:600 }}>Auto-fill →</span>
            </div>
          ))}
        </div>
      )}
      {q.trim() && results.length === 0 && (
        <div style={{ marginTop:8,fontSize:"0.8125rem",color:T.neutral6 }}>No matching clients found.</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SELF-SERVICE LANDING PAGE
// ─────────────────────────────────────────────
function SelfServiceLanding({ program, tokenUrl, onSingpass, onManual }) {
  const PROGRAM_TITLE = {
    mammobus: "Mammogram Screening Registration",
    hpv:      "HPV Test / PAP Test Screening",
    fit:      "FIT Screening Programme",
  };
  return (
    <div style={{ minHeight:"100vh",background:T.gray50,display:"flex",flexDirection:"column",alignItems:"center" }}>
      {/* logos bar */}
      <div style={{ width:"100%",background:T.white,borderBottom:`1px solid ${T.gray200}`,padding:"14px 24px",
        display:"flex",gap:12,alignItems:"center",justifyContent:"center" }}>
        <div style={{ fontWeight:800,fontSize:"1rem",color:T.primary500 }}>SCS</div>
        <div style={{ color:T.gray200 }}>|</div>
        <div style={{ fontWeight:700,fontSize:"0.875rem",color:T.neutral7 }}>BCF</div>
        <div style={{ color:T.gray200 }}>|</div>
        <div style={{ fontWeight:700,fontSize:"0.875rem",color:T.neutral7 }}>NHG Diagnostics</div>
      </div>

      <div style={{ maxWidth:480,width:"100%",padding:"48px 24px" }}>
        {/* token url preview */}
        {tokenUrl && (
          <div style={{ background:"#fffbeb",border:"1px solid #fde68a",borderRadius:8,padding:"10px 14px",marginBottom:24,fontSize:"0.75rem",color:"#92400e",wordBreak:"break-all" }}>
            <strong>Token URL (demo):</strong><br />{tokenUrl}
          </div>
        )}

        <div style={{ background:T.white,border:`1px solid ${T.gray200}`,borderRadius:14,padding:"36px 32px",textAlign:"center",boxShadow:"0 4px 20px rgba(124,81,161,0.08)" }}>
          <div style={{ width:52,height:52,borderRadius:14,background:T.primary100,display:"flex",alignItems:"center",
            justifyContent:"center",margin:"0 auto 20px",fontSize:"1.5rem" }}>
            📋
          </div>
          <h2 style={{ margin:"0 0 6px",fontSize:"1.25rem",color:T.neutral9,fontWeight:700 }}>
            {PROGRAM_TITLE[program] ?? "Screening Registration"}
          </h2>
          <p style={{ margin:"0 0 28px",fontSize:"0.875rem",color:T.neutral6 }}>
            Select a registration method
          </p>

          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            <button onClick={onSingpass}
              style={{ background:"#d62027",color:T.white,border:"none",borderRadius:10,padding:"13px 20px",
                fontWeight:700,fontSize:"0.9375rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
              <span style={{ fontSize:"1.1rem" }}>🔑</span>
              Retrieve Myinfo with Singpass
            </button>
            <button onClick={onManual}
              style={{ background:T.white,color:T.primary500,border:`2px solid ${T.primary500}`,borderRadius:10,
                padding:"12px 20px",fontWeight:600,fontSize:"0.9375rem",cursor:"pointer" }}>
              Complete Registration Manually
            </button>
          </div>

          <p style={{ margin:"16px 0 0",fontSize:"0.75rem",color:T.neutral6 }}>
            Singpass enables you to retrieve your personal data automatically.
            <br />For best experience, use latest Chrome or Safari.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SCREENING REGISTRATION FORM
// ─────────────────────────────────────────────
const EMPTY_REG = {
  // personal
  fullName:"", residential:"", nric:"", dob:"", gender:"", race:"", religion:"",
  phone:"", email:"", languages:[],
  // address
  block:"", street:"", floor:"", unit:"", postal:"", country:"Singapore",
  // subsidies
  chasCardType:"", healthierSgEnrolled:"", firstScreening:"", lastScreeningYear:"",
  // appointment
  appointmentType:"", healthierSgBooked:"", healthierSgScreeningDate:"",
  preferredDate:"", preferredTimeSlot:"", screeningLocation:"",
  // screening questions (mammobus)
  covid19VaccineSoon:"", mammogramPast12or24Months:"", breastfeedingPast6Months:"",
  breastSymptoms:"", breastImplants:"", everHadBreastCancer:"",
  // engagement
  sourceType:"", sourceDetail:"",
  // consent
  consent: false,
};

function ScreeningRegistrationForm({ program, mode, existingClients=[], singpassLocked=false, onSubmit, onCancel, onCopyLink }) {
  const [form, setForm] = useState({
    ...EMPTY_REG,
    appointmentType: program === "mammobus" ? "mammobus" : program === "fit" ? "healthier-sg" : "scs-clinic",
    gender: "Female",
  });
  const [activeSection, setActiveSection] = useState(REG_NAV_ITEMS[program]?.[0]?.id ?? "personal");
  const [navOpen, setNavOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  const prog = program.toLowerCase();
  const navItems = REG_NAV_ITEMS[prog] ?? [];

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: undefined }));
  }

  function fillFromClient(client) {
    setForm(f => ({
      ...f,
      fullName:    client.name ?? "",
      nric:        client.nric ?? "",
      dob:         client.dob ?? "",
      residential: client.residential ?? "",
      gender:      client.gender ?? "",
      phone:       client.phone ?? "",
      email:       client.email ?? "",
      block:       client.block ?? "",
      street:      client.street ?? "",
      floor:       client.floor ?? "",
      unit:        client.unit ?? "",
      postal:      client.postal ?? "",
      country:     client.country ?? "Singapore",
    }));
  }

  function scrollToSection(id) {
    const el = document.getElementById(`reg-${id}`);
    if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
    setActiveSection(id);
    setNavOpen(false);
  }

  function validate() {
    const e = {};
    if (!form.fullName.trim())    e.fullName = "Required";
    if (!form.nric.trim())        e.nric = "Required";
    if (!form.dob.trim())         e.dob = "Required";
    if (!form.residential)        e.residential = "Required";
    if (!form.chasCardType)       e.chasCardType = "Required";
    if (!form.appointmentType)    e.appointmentType = "Required";
    if (prog === "mammobus") {
      if (!form.covid19VaccineSoon)         e.covid19VaccineSoon = "Required";
      if (!form.mammogramPast12or24Months)  e.mammogramPast12or24Months = "Required";
      if (!form.breastfeedingPast6Months)   e.breastfeedingPast6Months = "Required";
      if (!form.breastSymptoms)             e.breastSymptoms = "Required";
      if (!form.breastImplants)             e.breastImplants = "Required";
      if (!form.everHadBreastCancer)        e.everHadBreastCancer = "Required";
    }
    if (!form.consent) e.consent = "You must agree to proceed";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      const firstErr = Object.keys(errors)[0];
      const el = document.getElementById(`reg-field-${firstErr}`);
      if (el) el.scrollIntoView({ behavior:"smooth", block:"center" });
      return;
    }
    const id = `PROS-${String(Date.now()).slice(-6)}`;
    const age = calcAge(form.dob);
    const masked = maskNric(form.nric);
    const programLabel = prog.charAt(0).toUpperCase() + prog.slice(1);

    onSubmit({
      rowKey:       `${id}-${programLabel}`,
      id,
      name:          form.fullName,
      maskedNric:    masked,
      program:       programLabel,
      appointmentType: form.appointmentType,
      ageGender:     `${form.gender}, ${age ?? "?"} years`,
      phone:         form.phone,
      email:         form.email,
      status:        "qualified",
      sourceType:    form.sourceType || "Manual",
      sourceDetail:  form.sourceDetail,
      risk:          "low",
      dateRegistered: new Date().toISOString().slice(0,10),
      nextReview:     form.preferredDate || null,
      attendance:     null,
      firstMammogramScreening: form.firstScreening || "no",
      _activityBy:   mode === "self-service" ? "Self-service" : "Registration portal",
    });
  }

  const showHealthierSgSection = form.appointmentType === "healthier-sg";
  const showApptPrefSection    = !showHealthierSgSection;
  const isLocked = singpassLocked; // in real Singpass flow these fields are read-only

  // ── Section renderers ──
  function renderEligibility() {
    if (prog === "hpv") return (
      <SectionCard id="eligibility" title="Screening Eligibility">
        <InfoBox>
          <strong>PAP Test</strong> — Screening for cervical cancer. Recommended if not done in last 3 years (once every 3 years).<br /><br />
          <strong>HPV Test</strong> — Screening for cervical cancer. Recommended if not done in last 5 years (once every 5 years).
        </InfoBox>
      </SectionCard>
    );
    if (prog === "fit") return (
      <SectionCard id="eligibility" title="Screening Eligibility">
        <InfoBox>
          Eligible if you are:<br />
          • 50 years old &amp; above<br />
          • A Singapore Citizen or Permanent Resident<br />
          • Able to produce your IC
        </InfoBox>
      </SectionCard>
    );
    return null;
  }

  function renderPersonal() {
    return (
      <SectionCard id="personal" title="Personal Information">
        {mode === "portal" && <ClientLookup clients={existingClients} onSelect={fillFromClient} />}
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          <Field label="Full Name (as per NRIC)" required>
            <TextIn id="reg-field-fullName" value={form.fullName} onChange={v=>set("fullName",v)} required disabled={isLocked}
              placeholder="As shown on NRIC / passport" />
            {errors.fullName && <span style={{ fontSize:"0.75rem",color:T.red500 }}>{errors.fullName}</span>}
          </Field>
          <RowGrid>
            <Field label="Residential Status" required>
              <SelIn value={form.residential} onChange={v=>set("residential",v)} options={RESIDENTIAL_OPT} required disabled={isLocked} />
              {errors.residential && <span style={{ fontSize:"0.75rem",color:T.red500 }}>{errors.residential}</span>}
            </Field>
            <Field label="NRIC / FIN Number" required>
              <NricInput value={form.nric} onChange={v=>set("nric",v)} required disabled={isLocked} />
              {errors.nric && <span style={{ fontSize:"0.75rem",color:T.red500 }}>{errors.nric}</span>}
            </Field>
          </RowGrid>
          <RowGrid>
            <Field label="Date of Birth" required hint="DD-MM-YYYY">
              <TextIn value={form.dob} onChange={v=>set("dob",v)} placeholder="DD-MM-YYYY" required maxLength={10} disabled={isLocked} />
              {errors.dob && <span style={{ fontSize:"0.75rem",color:T.red500 }}>{errors.dob}</span>}
            </Field>
            <Field label="Gender" required>
              <SelIn value={form.gender} onChange={v=>set("gender",v)} options={GENDER_OPT} required disabled={isLocked} />
            </Field>
          </RowGrid>
          <RowGrid>
            <Field label="Race">
              <SelIn value={form.race} onChange={v=>set("race",v)} options={RACE_OPT} />
            </Field>
            <Field label="Contact Number" required>
              <div style={{ display:"flex",gap:0 }}>
                <span style={{ border:`1px solid ${T.gray200}`,borderRight:"none",borderRadius:"8px 0 0 8px",
                  padding:"7px 10px",fontSize:"0.875rem",background:T.gray50,color:T.neutral6,flexShrink:0,lineHeight:"1.25rem" }}>
                  +65
                </span>
                <TextIn value={form.phone} onChange={v=>set("phone",v)} placeholder="9XXXXXXX" type="tel"
                  style={{ borderRadius:"0 8px 8px 0" }} disabled={isLocked} />
              </div>
            </Field>
          </RowGrid>
          <Field label="Email Address">
            <TextIn value={form.email} onChange={v=>set("email",v)} placeholder="email@example.com" type="email" disabled={isLocked} />
          </Field>
          <Field label="Preferred Language(s)">
            <CheckboxMulti options={LANGUAGE_OPT} value={form.languages} onChange={v=>set("languages",v)} />
          </Field>
        </div>
      </SectionCard>
    );
  }

  function renderAddress() {
    return (
      <SectionCard id="address" title="Residential Address">
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          <RowGrid>
            <Field label="Block" required={prog==="mammobus"}>
              <TextIn value={form.block} onChange={v=>set("block",v)} placeholder="e.g. 202" disabled={isLocked} />
            </Field>
            <Field label="Street Name" required={prog==="mammobus"}>
              <TextIn value={form.street} onChange={v=>set("street",v)} placeholder="e.g. Bishan Street 22" disabled={isLocked} />
            </Field>
          </RowGrid>
          <RowGrid>
            <Field label="Floor" required>
              <TextIn value={form.floor} onChange={v=>set("floor",v)} placeholder="e.g. 05" disabled={isLocked} />
            </Field>
            <Field label="Unit No." required>
              <TextIn value={form.unit} onChange={v=>set("unit",v)} placeholder="e.g. 101" disabled={isLocked} />
            </Field>
          </RowGrid>
          <RowGrid>
            <Field label="Postal Code" required>
              <TextIn value={form.postal} onChange={v=>set("postal",v)} placeholder="6 digits" maxLength={6} type="text"
                inputMode="numeric" disabled={isLocked} />
            </Field>
            <Field label="Country">
              <SelIn value={form.country} onChange={v=>set("country",v)} options={COUNTRY_OPT} disabled={isLocked} />
            </Field>
          </RowGrid>
        </div>
      </SectionCard>
    );
  }

  function renderSubsidies() {
    return (
      <SectionCard id="subsidies" title="Healthier SG &amp; Subsidies">
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          <Field label="CHAS Card Type" required>
            <SelIn value={form.chasCardType} onChange={v=>set("chasCardType",v)} options={CHAS_OPTIONS} required disabled={isLocked} />
            {errors.chasCardType && <span style={{ fontSize:"0.75rem",color:T.red500 }}>{errors.chasCardType}</span>}
          </Field>
          <Field label="Are you enrolled under Healthier SG?">
            <SelIn value={form.healthierSgEnrolled} onChange={v=>set("healthierSgEnrolled",v)} options={HEALTHIER_SG_OPT} />
          </Field>
          {prog === "mammobus" && (
            <Field label="Is this your first mammogram screening?" required>
              <RadioGroup value={form.firstScreening} onChange={v=>set("firstScreening",v)}
                options={[{ value:"yes",label:"Yes" },{ value:"no",label:"No" }]} />
            </Field>
          )}
          {form.firstScreening === "no" && (
            <Field label="Year of last screening">
              <TextIn value={form.lastScreeningYear} onChange={v=>set("lastScreeningYear",v)} placeholder="e.g. 2023" maxLength={4} type="text" inputMode="numeric" />
            </Field>
          )}
        </div>
      </SectionCard>
    );
  }

  function renderAppointmentType() {
    const options = prog === "mammobus"
      ? [
          { key:"mammobus",    label:"Mammobus",     subtitle:"Mobile screening bus", description:"Attend a scheduled Mammobus session at a community venue near you." },
          { key:"scs-clinic",  label:"SCS Clinic",   subtitle:"Singapore Cancer Society", description:"Book a screening appointment at our clinic in Bishan." },
          { key:"healthier-sg",label:"Healthier SG", subtitle:"Community health programme", description:"Access subsidised screenings through your Healthier SG enrolment." },
        ]
      : prog === "hpv"
      ? [
          { key:"scs-clinic",  label:"SCS Clinic",   subtitle:"Singapore Cancer Society", description:"Book at our clinic in Bishan." },
          { key:"healthier-sg",label:"Healthier SG", subtitle:"Community health programme", description:"Access through Healthier SG enrolment." },
        ]
      : [
          { key:"healthier-sg",label:"Healthier SG", subtitle:"Community health programme", description:"FIT screening is available through Healthier SG." },
        ];
    return (
      <SectionCard id="appointment-type" title="Appointment Type">
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {options.map(o=>(
            <AppointmentCard key={o.key} {...o} apptKey={o.key} selected={form.appointmentType===o.key}
              onClick={()=>set("appointmentType",o.key)} />
          ))}
        </div>
        {errors.appointmentType && <div style={{ fontSize:"0.75rem",color:T.red500,marginTop:8 }}>{errors.appointmentType}</div>}
      </SectionCard>
    );
  }

  function renderHealthierSgProgramme() {
    if (!showHealthierSgSection) return (
      <SectionCard id="healthier-sg" title="Healthier SG Programme">
        <InfoBox type="warn">Select "Healthier SG" as your appointment type above to enable this section.</InfoBox>
      </SectionCard>
    );
    return (
      <SectionCard id="healthier-sg" title="Healthier SG Programme">
        <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
          <Field label="Have you booked your Healthier SG screening yet?" required>
            <RadioGroup value={form.healthierSgBooked} onChange={v=>set("healthierSgBooked",v)}
              options={[
                { value:"no",  label:"No",  hint:"We will help you register and coordinate." },
                { value:"yes", label:"Yes", hint:"Great — please provide the date below."    },
              ]} />
          </Field>
          {form.healthierSgBooked === "yes" && (
            <Field label="Date of your screening" hint="DD-MM-YYYY">
              <TextIn value={form.healthierSgScreeningDate} onChange={v=>set("healthierSgScreeningDate",v)} placeholder="DD-MM-YYYY" maxLength={10} />
            </Field>
          )}
        </div>
      </SectionCard>
    );
  }

  function renderAppointmentPrefs() {
    if (!showApptPrefSection) return (
      <SectionCard id="appointment" title="Appointment Preferences">
        <InfoBox type="warn">Appointment preferences are managed via Healthier SG when that option is selected.</InfoBox>
      </SectionCard>
    );
    return (
      <SectionCard id="appointment" title="Appointment Preferences">
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          <Field label="Preferred Screening Date" required hint="DD-MM-YYYY">
            <TextIn value={form.preferredDate} onChange={v=>set("preferredDate",v)} placeholder="DD-MM-YYYY" maxLength={10} required />
          </Field>
          <Field label="Preferred Time Slot">
            <SelIn value={form.preferredTimeSlot} onChange={v=>set("preferredTimeSlot",v)} options={TIME_SLOT_OPT} />
          </Field>
          <Field label="Screening Location / Event">
            <TextIn value={form.screeningLocation} onChange={v=>set("screeningLocation",v)} placeholder="e.g. Bishan Community Centre" />
          </Field>
        </div>
      </SectionCard>
    );
  }

  function renderScreeningQuestions() {
    if (prog !== "mammobus") return null;
    const YN = [{ value:"no",label:"No" },{ value:"yes",label:"Yes" }];
    const qs = [
      { key:"covid19VaccineSoon",         label:"Are you currently taking or will be taking a COVID-19 vaccine soon?",           hint:"It is advised to wait 6 weeks before/after vaccination." },
      { key:"mammogramPast12or24Months",  label:"Have you done a mammogram in the past 12 months (age 40–49) or 24 months (50+)?", hint:"If yes, screening may be deferred." },
      { key:"breastfeedingPast6Months",   label:"Have you been breastfeeding in the past 6 months?",                               hint:"Wait 6 months after stopping before screening." },
      { key:"breastSymptoms",             label:"Do you have any symptoms (e.g. lumps or pain) in your breast?",                   hint:"Please consult a doctor before screening." },
      { key:"breastImplants",             label:"Do you have any breast implants?",                                                hint:"Requires special techniques; you may be referred to a BAC." },
      { key:"everHadBreastCancer",        label:"Have you ever had breast cancer?",                                                hint:"Consult your doctor if not yet discharged." },
    ];
    return (
      <SectionCard id="screening-qs" title="Screening Questions">
        <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
          {qs.map(q=>(
            <div key={q.key}>
              <div style={{ fontSize:"0.875rem",fontWeight:500,color:T.neutral9,marginBottom:6 }}>{q.label}<span style={{ color:T.red500,marginLeft:2 }}>*</span></div>
              <RadioGroup value={form[q.key]} onChange={v=>set(q.key,v)} options={YN} />
              {form[q.key] === "yes" && q.hint && <div style={{ marginTop:6,padding:"8px 12px",background:"#fffbeb",borderRadius:6,fontSize:"0.8125rem",color:"#92400e" }}>{q.hint}</div>}
              {errors[q.key] && <div style={{ fontSize:"0.75rem",color:T.red500,marginTop:4 }}>{errors[q.key]}</div>}
            </div>
          ))}
        </div>
      </SectionCard>
    );
  }

  function renderEngagement() {
    return (
      <SectionCard id="engagement" title="Engagement">
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          <Field label="How did you hear about this programme?" required={prog==="mammobus"}>
            <SelIn value={form.sourceType} onChange={v=>set("sourceType",v)}
              options={(REFERRAL_SOURCE_OPT[prog]??[]).map(o=>({ value:o,label:o }))}
              required={prog==="mammobus"} />
          </Field>
          <Field label="Campaign / Event Name">
            <TextIn value={form.sourceDetail} onChange={v=>set("sourceDetail",v)} placeholder="e.g. Pink for Life 2025" />
          </Field>
        </div>
      </SectionCard>
    );
  }

  function renderConsent() {
    return (
      <SectionCard id="consent" title="Consent">
        <label style={{ display:"flex",gap:12,cursor:"pointer",alignItems:"flex-start" }}>
          <input type="checkbox" checked={form.consent} onChange={e=>set("consent",e.target.checked)}
            style={{ marginTop:4,width:16,height:16,accentColor:T.primary500,flexShrink:0 }} />
          <span style={{ fontSize:"0.8125rem",color:T.neutral7,lineHeight:1.6 }}>
            I consent to Singapore Cancer Society (SCS) collecting, using, and storing my personal data
            for the purposes of delivering cancer screening services, and to support my cancer screening
            journey at other healthcare institutions. I understand that SCS may use my contact information
            to follow up with me regarding my screening results and any related health matters. Where
            applicable, I consent to SCS sharing my personal data with relevant healthcare institutions
            and/or appointed partners (including NHG Diagnostics, for Mammobus screening) for the
            purposes of care coordination and the facilitation of follow-up appointments related to my
            cancer screening. I confirm that my personal data as provided in this form is accurate and
            complete. I understand and accept the terms and conditions under the SCS Personal Data
            Protection Policy. I may withdraw my consent at any time by contacting SCS.
          </span>
        </label>
        {errors.consent && <div style={{ fontSize:"0.75rem",color:T.red500,marginTop:8 }}>{errors.consent}</div>}
      </SectionCard>
    );
  }

  const sectionRenderers = {
    eligibility:       renderEligibility,
    personal:          renderPersonal,
    address:           renderAddress,
    subsidies:         renderSubsidies,
    "appointment-type":renderAppointmentType,
    "healthier-sg":    renderHealthierSgProgramme,
    appointment:       renderAppointmentPrefs,
    "screening-qs":    renderScreeningQuestions,
    engagement:        renderEngagement,
    consent:           renderConsent,
  };

  const progLabel  = prog.charAt(0).toUpperCase() + prog.slice(1);
  const formTitle  = { mammobus:"Mammogram Screening Registration", hpv:"HPV Test / PAP Test Screening", fit:"FIT Screening Programme" }[prog] ?? "Screening Registration";
  const isSelfServ = mode === "self-service";

  return (
    <div style={{ position:"fixed",inset:0,background:T.gray50,zIndex:300,display:"flex",flexDirection:"column",overflowY:"hidden" }}>
      {/* ── Chrome / Header ── */}
      <div style={{ background:T.white,borderBottom:`1px solid ${T.gray200}`,padding:"0 20px",height:56,display:"flex",
        alignItems:"center",justifyContent:"space-between",flexShrink:0,position:"sticky",top:0,zIndex:10 }}>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          {!isSelfServ && (
            <button onClick={onCancel} style={{ background:"none",border:"none",cursor:"pointer",color:T.neutral6,fontSize:"1.1rem",padding:"4px 6px" }}>
              ←
            </button>
          )}
          <div>
            {!isSelfServ && (
              <div style={{ fontSize:"0.75rem",color:T.neutral6,marginBottom:1 }}>
                <span onClick={onCancel} style={{ cursor:"pointer",color:T.primary500 }}>Prospect Management</span>
                {" / "}<span style={{ color:T.neutral6 }}>{progLabel}</span>
                {" / "}Register
              </div>
            )}
            <div style={{ fontWeight:700,fontSize:"0.9375rem",color:T.neutral9 }}>{formTitle}</div>
          </div>
        </div>
        <div style={{ display:"flex",gap:8,alignItems:"center" }}>
          {/* mobile nav toggle */}
          <button onClick={()=>setNavOpen(v=>!v)} style={{ background:navOpen?T.primary100:"none",border:`1px solid ${T.gray200}`,borderRadius:8,
            padding:"6px 10px",cursor:"pointer",fontSize:"1rem",color:navOpen?T.primary600:T.neutral7 }}>
            ☰
          </button>
          {!isSelfServ && onCopyLink && (
            <Btn variant="secondary" onClick={onCopyLink}>
              🔗 Copy Registration Link
            </Btn>
          )}
          {!isSelfServ && <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>}
          <Btn variant="primary" onClick={handleSubmit}>
            {isSelfServ ? "Submit Registration" : "Submit Registration"}
          </Btn>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ display:"flex",flex:1,overflow:"hidden" }}>
        {/* Sidebar nav */}
        <div style={{ width:220,flexShrink:0,background:T.white,borderRight:`1px solid ${T.gray200}`,padding:"20px 0",overflowY:"auto" }}>
          <div style={{ fontSize:"0.6875rem",fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",
            color:T.neutral6,padding:"0 18px 10px" }}>
            Skip to section
          </div>
          {navItems.map(item=>{
            const active = activeSection === item.id;
            return (
              <button key={item.id} onClick={()=>scrollToSection(item.id)}
                style={{ display:"block",width:"100%",textAlign:"left",background:active?T.primary100:"none",border:"none",
                  padding:"9px 18px",fontSize:"0.8125rem",color:active?T.primary600:T.neutral7,fontWeight:active?600:400,
                  cursor:"pointer",borderLeft:`3px solid ${active?T.primary500:"transparent"}`,transition:"background 0.1s" }}>
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Form content */}
        <form ref={formRef} onSubmit={handleSubmit} noValidate
          style={{ flex:1,overflowY:"auto",padding:"20px 24px",maxWidth:780 }}
          onScroll={e=>{
            const sections = navItems.map(i=>document.getElementById(`reg-${i.id}`));
            const scrollTop = e.currentTarget.scrollTop + 80;
            for (let i=sections.length-1; i>=0; i--) {
              if (sections[i] && sections[i].offsetTop <= scrollTop) {
                setActiveSection(navItems[i].id);
                break;
              }
            }
          }}>
          {navItems.map(item => {
            const renderer = sectionRenderers[item.id];
            return renderer ? <div key={item.id}>{renderer()}</div> : null;
          })}
          {/* mobile submit button */}
          <div style={{ padding:"16px 0 32px" }}>
            <Btn variant="primary" onClick={handleSubmit} style={{ width:"100%",justifyContent:"center" }}>
              Submit Registration
            </Btn>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// REGISTRATION FLOW ORCHESTRATOR
// ─────────────────────────────────────────────
function RegistrationFlow({ program, mode, existingClients, onSubmit, onCancel }) {
  // mode: "portal" | "self-service"
  // self-service has an extra landing step
  const [step, setStep] = useState(mode === "self-service" ? "landing" : "form");
  const [singpassLocked, setSingpassLocked] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState("");
  const token = useRef(randomToken());

  function handleCopyLink() {
    const url = buildTokenUrl(program, randomToken());
    setCopiedUrl(url);
    if (navigator.clipboard) navigator.clipboard.writeText(url);
  }

  if (step === "landing") {
    return (
      <SelfServiceLanding
        program={program}
        tokenUrl={buildTokenUrl(program, token.current)}
        onSingpass={()=>{ setSingpassLocked(true); setStep("form"); }}
        onManual={()=>{ setSingpassLocked(false); setStep("form"); }}
      />
    );
  }

  return (
    <>
      {copiedUrl && (
        <div style={{ position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",
          background:T.neutral9,color:T.white,borderRadius:8,padding:"10px 20px",fontSize:"0.875rem",
          zIndex:400,display:"flex",gap:12,alignItems:"center",boxShadow:"0 4px 16px rgba(0,0,0,0.2)" }}>
          ✓ Registration link copied!
          <a href={copiedUrl} target="_blank" rel="noreferrer"
            style={{ color:"#93c5fd",fontWeight:600 }}>View →</a>
          <button onClick={()=>setCopiedUrl("")} style={{ background:"none",border:"none",color:"#9ca3af",cursor:"pointer",fontSize:"0.875rem" }}>✕</button>
        </div>
      )}
      <ScreeningRegistrationForm
        program={program}
        mode={mode}
        existingClients={existingClients}
        singpassLocked={singpassLocked}
        onSubmit={p=>{ onSubmit(p); }}
        onCancel={onCancel}
        onCopyLink={mode==="portal" ? handleCopyLink : undefined}
      />
    </>
  );
}

// ─────────────────────────────────────────────
// PROSPECT DETAIL DRAWER
// ─────────────────────────────────────────────
function ProspectDrawer({ prospect, onClose, onUpdate, onRegisterNew }) {
  const [editStatus,     setEditStatus]     = useState(prospect.status);
  const [editAttendance, setEditAttendance] = useState(prospect.attendance ?? "");
  const [editNextReview, setEditNextReview] = useState(prospect.nextReview ?? "");
  const [saved, setSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  function handleSave() {
    onUpdate(prospect.rowKey, { status:editStatus, attendance:editAttendance||null, nextReview:editNextReview });
    setSaved(true);
    setTimeout(()=>setSaved(false), 1800);
  }

  function handleCopyLink() {
    const token = randomToken();
    const url   = buildTokenUrl(prospect.program, token);
    if (navigator.clipboard) navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(()=>setCopiedLink(false), 2000);
  }

  const progBadge = PROGRAM_BADGE[prospect.program] ?? {};
  const statBadge = STATUS_BADGE[prospect.status]   ?? {};

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(15,10,30,0.45)",zIndex:200 }} />
      <div style={{ position:"fixed",top:0,right:0,bottom:0,width:420,maxWidth:"95vw",background:T.white,
        boxShadow:"0 16px 48px rgba(30,10,70,0.18)",zIndex:201,display:"flex",flexDirection:"column",overflowY:"auto" }}>

        {/* header */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 20px 14px",
          borderBottom:`1px solid ${T.gray200}`,position:"sticky",top:0,background:T.white,zIndex:1 }}>
          <div>
            <div style={{ fontWeight:700,fontSize:"1rem",color:T.neutral9 }}>{prospect.name}</div>
            <div style={{ fontSize:"0.75rem",color:T.neutral6,marginTop:2 }}>{prospect.id} · {prospect.maskedNric}</div>
          </div>
          <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",fontSize:"1.2rem",color:T.neutral7,padding:"4px 8px" }}>✕</button>
        </div>

        <div style={{ padding:"20px",flex:1 }}>
          {/* badges */}
          <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:20 }}>
            <Badge label={prospect.program} style={{ background:progBadge.bg,color:progBadge.color }} />
            <Badge label={prospect.status.charAt(0).toUpperCase()+prospect.status.slice(1)} style={{ background:statBadge.bg,color:statBadge.color }} />
            <Badge label={prospect.risk} style={{ background:RISK_BADGE[prospect.risk]?.bg,color:RISK_BADGE[prospect.risk]?.color }} />
          </div>

          <DrawerSection title="Contact">
            <InfoRow label="Gender / Age"  value={prospect.ageGender}       />
            <InfoRow label="Phone"         value={prospect.phone}            />
            <InfoRow label="Email"         value={prospect.email}            />
          </DrawerSection>

          <DrawerSection title="Registration">
            <InfoRow label="Date Registered" value={prospect.dateRegistered} />
            <InfoRow label="Source"          value={`${prospect.sourceType}${prospect.sourceDetail?" — "+prospect.sourceDetail:""}`} />
            <InfoRow label="Appointment"     value={APPT_TYPES.find(a=>a.key===prospect.appointmentType)?.label??prospect.appointmentType} />
            <InfoRow label="First Mammogram" value={prospect.firstMammogramScreening==="yes"?"Yes":"No"} />
          </DrawerSection>

          <DrawerSection title="Update Record">
            <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
              {[
                { label:"Status",     el: <SelIn value={editStatus}     onChange={setEditStatus}     options={STATUSES.map(s=>({ value:s.key,label:s.label }))} /> },
                { label:"Attendance", el: <SelIn value={editAttendance} onChange={setEditAttendance} options={[{ value:"",label:"— not set —" },...ATTENDANCE_OPT.map(a=>({ value:a,label:a }))]} /> },
                { label:"Next Review Date", el: <input type="date" value={editNextReview} onChange={e=>setEditNextReview(e.target.value)}
                  style={{ border:`1px solid ${T.gray200}`,borderRadius:8,padding:"7px 12px",fontSize:"0.875rem",color:T.neutral9,background:T.white,width:"100%",boxSizing:"border-box" }} /> },
              ].map(r=>(
                <label key={r.label} style={{ display:"flex",flexDirection:"column",gap:5,fontSize:"0.8125rem",fontWeight:500,color:T.neutral7 }}>
                  {r.label}{r.el}
                </label>
              ))}
            </div>
            <button onClick={handleSave} style={{ marginTop:14,background:saved?T.green600:T.primary500,color:T.white,
              border:"none",borderRadius:8,padding:"9px 20px",fontWeight:600,fontSize:"0.875rem",cursor:"pointer",width:"100%",transition:"background 0.2s" }}>
              {saved ? "✓ Saved" : "Save Changes"}
            </button>
          </DrawerSection>

          {/* portal actions */}
          <DrawerSection title="Actions">
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              <button onClick={handleCopyLink}
                style={{ background:copiedLink?T.green600:T.white,color:copiedLink?T.white:T.primary500,
                  border:`1px solid ${copiedLink?T.green600:T.primary500}`,borderRadius:8,padding:"8px 14px",
                  fontWeight:600,fontSize:"0.875rem",cursor:"pointer",transition:"background 0.2s" }}>
                {copiedLink ? "✓ Link Copied!" : "🔗 Copy Registration Link (Token URL)"}
              </button>
              {onRegisterNew && (
                <button onClick={()=>onRegisterNew(prospect.program)}
                  style={{ background:T.gray50,color:T.neutral7,border:`1px solid ${T.gray200}`,borderRadius:8,
                    padding:"8px 14px",fontWeight:500,fontSize:"0.875rem",cursor:"pointer" }}>
                  + Register New Prospect ({prospect.program})
                </button>
              )}
            </div>
          </DrawerSection>
        </div>
      </div>
    </>
  );
}

function DrawerSection({ title, children }) {
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontSize:"0.6875rem",fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",
        color:T.neutral6,marginBottom:10,paddingBottom:6,borderBottom:`1px solid ${T.gray200}` }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display:"flex",justifyContent:"space-between",gap:12,padding:"5px 0",fontSize:"0.875rem" }}>
      <span style={{ color:T.neutral6,flexShrink:0 }}>{label}</span>
      <span style={{ color:T.neutral9,fontWeight:500,textAlign:"right" }}>{value??"—"}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// KANBAN
// ─────────────────────────────────────────────
function KanbanColumn({ status, prospects, onSelect }) {
  const badge = STATUS_BADGE[status.key] ?? {};
  return (
    <div style={{ flex:"1 1 0",minWidth:260,background:T.gray50,borderRadius:10,padding:"0 0 12px",border:`1px solid ${T.gray200}` }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",
        borderBottom:`1px solid ${T.gray200}`,background:T.gray50,borderRadius:"10px 10px 0 0" }}>
        <span style={{ fontWeight:600,fontSize:"0.875rem",color:T.neutral9 }}>{status.label}</span>
        <span style={{ background:badge.bg,color:badge.color,borderRadius:999,padding:"1px 9px",fontSize:"0.75rem",fontWeight:700 }}>
          {prospects.length}
        </span>
      </div>
      <div style={{ padding:"10px 10px 0",display:"flex",flexDirection:"column",gap:8 }}>
        {prospects.length === 0 && (
          <div style={{ textAlign:"center",padding:"24px 0",color:T.neutral6,fontSize:"0.8125rem" }}>No prospects</div>
        )}
        {prospects.map(p=><KanbanCard key={p.rowKey} prospect={p} onClick={()=>onSelect(p)} />)}
      </div>
    </div>
  );
}

function KanbanCard({ prospect:p, onClick }) {
  const [h,setH]=useState(false);
  const pb = PROGRAM_BADGE[p.program] ?? {};
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:T.white,border:`1px solid ${h?T.primary400:T.gray200}`,borderRadius:8,padding:"12px 14px",
        cursor:"pointer",transition:"border-color 0.15s",boxShadow:h?"0 2px 10px rgba(124,81,161,0.10)":"none" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6 }}>
        <span style={{ fontWeight:600,fontSize:"0.875rem",color:T.neutral9 }}>{p.name}</span>
        <RiskDot risk={p.risk} />
      </div>
      <div style={{ fontSize:"0.75rem",color:T.neutral6,marginBottom:8 }}>{p.maskedNric} · {p.ageGender}</div>
      <div style={{ display:"flex",gap:6,flexWrap:"wrap",alignItems:"center" }}>
        <Badge label={p.program} style={{ background:pb.bg,color:pb.color }} />
        {p.attendance && <Badge label={p.attendance} style={{ background:ATTEND_BADGE[p.attendance]?.bg??T.gray100,color:ATTEND_BADGE[p.attendance]?.color??T.neutral7 }} />}
      </div>
      <div style={{ marginTop:8,fontSize:"0.75rem",color:T.neutral6 }}>Next review: {p.nextReview||"—"}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LIST TABLE
// ─────────────────────────────────────────────
const LIST_COLS = [
  { key:"name",           label:"Name"         },
  { key:"program",        label:"Program"      },
  { key:"status",         label:"Status"       },
  { key:"risk",           label:"Risk"         },
  { key:"attendance",     label:"Attendance"   },
  { key:"sourceType",     label:"Source"       },
  { key:"dateRegistered", label:"Registered"   },
  { key:"nextReview",     label:"Next Review"  },
];

function ListTable({ prospects, onSelect, sort, onSort }) {
  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%",borderCollapse:"collapse",fontSize:"0.875rem" }}>
        <thead>
          <tr style={{ borderBottom:`2px solid ${T.gray200}` }}>
            {LIST_COLS.map(col=>(
              <th key={col.key} onClick={()=>onSort(col.key)}
                style={{ padding:"10px 14px",textAlign:"left",fontSize:"0.6875rem",fontWeight:700,
                  letterSpacing:"0.05em",textTransform:"uppercase",color:T.neutral7,cursor:"pointer",
                  userSelect:"none",whiteSpace:"nowrap",background:T.gray50 }}>
                {col.label}
                <span style={{ marginLeft:4,opacity:sort.key===col.key?1:0.3,color:sort.key===col.key?T.primary500:undefined }}>
                  {sort.key===col.key?(sort.dir==="asc"?"↑":"↓"):"↕"}
                </span>
              </th>
            ))}
            <th style={{ padding:"10px 14px",background:T.gray50 }} />
          </tr>
        </thead>
        <tbody>
          {prospects.length === 0 && (
            <tr><td colSpan={LIST_COLS.length+1} style={{ textAlign:"center",padding:32,color:T.neutral6 }}>
              No prospects match the current filters.
            </td></tr>
          )}
          {prospects.map((p,i)=><ListRow key={p.rowKey} prospect={p} onSelect={onSelect} even={i%2===0} />)}
        </tbody>
      </table>
    </div>
  );
}

function ListRow({ prospect:p, onSelect, even }) {
  const [h,setH]=useState(false);
  const pb = PROGRAM_BADGE[p.program] ?? {};
  const sb = STATUS_BADGE[p.status]   ?? {};
  return (
    <tr onClick={()=>onSelect(p)} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:h?T.primary100:even?T.white:T.gray50,cursor:"pointer",borderBottom:`1px solid ${T.gray200}`,transition:"background 0.1s" }}>
      <td style={{ padding:"10px 14px" }}>
        <div style={{ fontWeight:600,color:T.neutral9 }}>{p.name}</div>
        <div style={{ fontSize:"0.75rem",color:T.neutral6 }}>{p.maskedNric}</div>
      </td>
      <td style={{ padding:"10px 14px" }}><Badge label={p.program} style={{ background:pb.bg,color:pb.color }} /></td>
      <td style={{ padding:"10px 14px" }}><Badge label={p.status.charAt(0).toUpperCase()+p.status.slice(1)} style={{ background:sb.bg,color:sb.color }} /></td>
      <td style={{ padding:"10px 14px" }}>
        <div style={{ display:"flex",alignItems:"center",gap:6 }}>
          <RiskDot risk={p.risk} />
          <span style={{ fontSize:"0.8125rem",color:T.neutral7,textTransform:"capitalize" }}>{p.risk}</span>
        </div>
      </td>
      <td style={{ padding:"10px 14px" }}>
        {p.attendance
          ? <Badge label={p.attendance} style={{ background:ATTEND_BADGE[p.attendance]?.bg??T.gray100,color:ATTEND_BADGE[p.attendance]?.color??T.neutral7 }} />
          : <span style={{ color:T.neutral6,fontSize:"0.8125rem" }}>—</span>}
      </td>
      <td style={{ padding:"10px 14px",color:T.neutral7 }}>{p.sourceType}</td>
      <td style={{ padding:"10px 14px",color:T.neutral7 }}>{p.dateRegistered}</td>
      <td style={{ padding:"10px 14px",color:p.nextReview?T.neutral7:T.neutral6 }}>{p.nextReview||"—"}</td>
      <td style={{ padding:"10px 14px" }}><IconBtn title="View" onClick={()=>onSelect(p)}>→</IconBtn></td>
    </tr>
  );
}

// ─────────────────────────────────────────────
// FILTER PANEL
// ─────────────────────────────────────────────
function FilterPanel({ filters, onChange }) {
  function toggle(key, val) {
    const arr = filters[key];
    onChange({ ...filters, [key]: arr.includes(val)?arr.filter(x=>x!==val):[...arr,val] });
  }
  function ChipGroup({ title, items, filterKey, labelMap={} }) {
    return (
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:"0.75rem",fontWeight:700,color:T.neutral6,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6 }}>{title}</div>
        <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
          {items.map(item=>{
            const active = filters[filterKey].includes(item);
            return (
              <button key={item} onClick={()=>toggle(filterKey,item)}
                style={{ border:`1px solid ${active?T.primary500:T.gray200}`,background:active?T.primary100:T.white,
                  color:active?T.primary600:T.neutral7,borderRadius:999,padding:"3px 12px",fontSize:"0.8125rem",
                  cursor:"pointer",fontWeight:active?600:400 }}>
                {labelMap[item]??item}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  return (
    <div style={{ background:T.white,border:`1px solid ${T.gray200}`,borderRadius:10,padding:"16px 18px",marginBottom:16 }}>
      <div style={{ display:"flex",flexWrap:"wrap",gap:"0 40px" }}>
        <ChipGroup title="Status"     items={["qualified","booked","screened"]} filterKey="statuses"    labelMap={{ qualified:"Qualified",booked:"Booked",screened:"Screened" }} />
        <ChipGroup title="Risk"       items={RISK_LEVELS}                       filterKey="risks"       labelMap={{ low:"Low",medium:"Medium",high:"High" }} />
        <ChipGroup title="Source"     items={SOURCE_TYPES}                      filterKey="sourceTypes" />
        <ChipGroup title="Attendance" items={ATTENDANCE_OPT}                   filterKey="attendances" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STATS BAR
// ─────────────────────────────────────────────
function StatsBar({ prospects }) {
  const total    = prospects.length;
  const byStatus = Object.fromEntries(STATUSES.map(s=>[s.key,0]));
  prospects.forEach(p=>{ if (byStatus[p.status]!==undefined) byStatus[p.status]++; });
  return (
    <div style={{ display:"flex",gap:12,flexWrap:"wrap",marginBottom:16 }}>
      <StatCard label="Total"     value={total}             color={T.primary500}               bg={T.primary100} />
      <StatCard label="Qualified" value={byStatus.qualified} color={STATUS_BADGE.qualified.color} bg={STATUS_BADGE.qualified.bg} />
      <StatCard label="Booked"    value={byStatus.booked}    color={STATUS_BADGE.booked.color}    bg={STATUS_BADGE.booked.bg} />
      <StatCard label="Screened"  value={byStatus.screened}  color={STATUS_BADGE.screened.color}  bg={STATUS_BADGE.screened.bg} />
    </div>
  );
}

function StatCard({ label, value, color, bg }) {
  return (
    <div style={{ background:bg??T.primary100,borderRadius:8,padding:"10px 18px",display:"flex",flexDirection:"column",alignItems:"flex-start",minWidth:90 }}>
      <span style={{ fontSize:"1.4rem",fontWeight:700,color:color??T.neutral9,lineHeight:1 }}>{value}</span>
      <span style={{ fontSize:"0.75rem",color:T.neutral6,marginTop:3 }}>{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN MODULE
// ─────────────────────────────────────────────
export default function ProspectManagement() {
  const [prospects,       setProspects]      = useState(SEED_PROSPECTS);
  const [clients]                            = useState(SEED_CLIENTS);
  const [activeProgram,   setActiveProgram]  = useState("All");
  const [viewMode,        setViewMode]       = useState("list");
  const [search,          setSearch]         = useState("");
  const [showFilters,     setShowFilters]    = useState(false);
  const [filters, setFilters] = useState({ statuses:[], risks:[], sourceTypes:[], attendances:[] });
  const [sort,            setSort]           = useState({ key:"dateRegistered", dir:"desc" });
  const [selected,        setSelected]       = useState(null);

  // Registration flow state
  // regFlow: null | { mode: "portal"|"self-service", program: string }
  const [regFlow, setRegFlow] = useState(null);
  const [toast,   setToast]   = useState(null);

  const activeFilterCount = Object.values(filters).reduce((n,arr)=>n+arr.length, 0);

  const filtered = useMemo(()=>{
    let rows = prospects;
    if (activeProgram !== "All") rows = rows.filter(p=>p.program===activeProgram);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(p=>
        p.name.toLowerCase().includes(q) || p.maskedNric.toLowerCase().includes(q) ||
        p.phone.includes(q) || p.email.toLowerCase().includes(q)
      );
    }
    if (filters.statuses.length)    rows = rows.filter(p=>filters.statuses.includes(p.status));
    if (filters.risks.length)       rows = rows.filter(p=>filters.risks.includes(p.risk));
    if (filters.sourceTypes.length) rows = rows.filter(p=>filters.sourceTypes.includes(p.sourceType));
    if (filters.attendances.length) rows = rows.filter(p=>filters.attendances.includes(p.attendance));
    return rows;
  }, [prospects, activeProgram, search, filters]);

  const sorted = useMemo(()=>{
    const { key, dir } = sort;
    return [...filtered].sort((a,b)=>{
      const cmp = String(a[key]??"").localeCompare(String(b[key]??""));
      return dir==="asc"?cmp:-cmp;
    });
  }, [filtered, sort]);

  function handleSort(key) {
    setSort(s=>({ key, dir:s.key===key&&s.dir==="asc"?"desc":"asc" }));
  }

  const handleUpdate = useCallback((rowKey, changes)=>{
    setProspects(prev=>prev.map(p=>p.rowKey===rowKey?{...p,...changes}:p));
    setSelected(cur=>cur?.rowKey===rowKey?{...cur,...changes}:cur);
  }, []);

  function handleRegistrationSubmit(newProspect) {
    setProspects(prev=>[newProspect,...prev]);
    setRegFlow(null);
    showToast(`✓ ${newProspect.name} added as a prospect (${newProspect.program}).`);
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(()=>setToast(null), 3500);
  }

  // If registration flow is open, render it full-screen
  if (regFlow) {
    return (
      <RegistrationFlow
        program={regFlow.program.toLowerCase()}
        mode={regFlow.mode}
        existingClients={clients}
        onSubmit={handleRegistrationSubmit}
        onCancel={()=>setRegFlow(null)}
      />
    );
  }

  const defaultProgram = (activeProgram !== "All" ? activeProgram : "Mammobus");

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif",background:T.gray50,minHeight:"100vh" }}>

      {/* ── Toast ── */}
      {toast && (
        <div style={{ position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:T.neutral9,
          color:T.white,borderRadius:8,padding:"10px 20px",fontSize:"0.875rem",zIndex:500,
          boxShadow:"0 4px 16px rgba(0,0,0,0.2)",whiteSpace:"nowrap" }}>
          {toast}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ background:T.white,borderBottom:`1px solid ${T.gray200}`,padding:"0 24px",
        display:"flex",alignItems:"center",justifyContent:"space-between",height:56,position:"sticky",top:0,zIndex:100 }}>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ width:28,height:28,borderRadius:8,background:T.primary500,display:"flex",alignItems:"center",
            justifyContent:"center",color:T.white,fontWeight:800,fontSize:"0.875rem" }}>W</div>
          <span style={{ fontWeight:700,fontSize:"1rem",color:T.neutral9 }}>Prospect Management</span>
        </div>
        <div style={{ display:"flex",gap:8 }}>
          {/* Demo: simulate token URL (self-service) */}
          <button onClick={()=>setRegFlow({ mode:"self-service", program:defaultProgram })}
            style={{ background:T.white,color:T.neutral7,border:`1px solid ${T.gray200}`,borderRadius:8,
              padding:"7px 14px",fontSize:"0.875rem",cursor:"pointer",fontWeight:500,display:"flex",alignItems:"center",gap:6 }}>
            🔗 Demo Token URL
          </button>
          {/* Portal registration */}
          <button onClick={()=>setRegFlow({ mode:"portal", program:defaultProgram })}
            style={{ background:T.primary500,color:T.white,border:"none",borderRadius:8,padding:"7px 16px",
              fontWeight:600,fontSize:"0.875rem",cursor:"pointer",display:"flex",alignItems:"center",gap:6 }}>
            + Register Prospect
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding:24,maxWidth:1300,margin:"0 auto" }}>

        {/* program tabs */}
        <div style={{ display:"flex",gap:4,marginBottom:20,background:T.white,border:`1px solid ${T.gray200}`,
          borderRadius:10,padding:4,width:"fit-content" }}>
          {PROGRAMS.map(prog=>{
            const active = activeProgram===prog;
            return (
              <button key={prog} onClick={()=>setActiveProgram(prog)}
                style={{ background:active?T.primary500:"transparent",color:active?T.white:T.neutral7,
                  border:"none",borderRadius:7,padding:"6px 18px",fontWeight:active?600:400,
                  fontSize:"0.875rem",cursor:"pointer",transition:"background 0.15s" }}>
                {prog}
              </button>
            );
          })}
        </div>

        {/* registration program switcher (visible when a program tab is active) */}
        {activeProgram !== "All" && (
          <div style={{ display:"flex",gap:8,alignItems:"center",marginBottom:16,
            background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:8,padding:"10px 16px",fontSize:"0.875rem" }}>
            <span style={{ color:"#1e40af",fontWeight:500 }}>Register a new {activeProgram} prospect:</span>
            <button onClick={()=>setRegFlow({ mode:"portal", program:activeProgram })}
              style={{ background:"#1d4ed8",color:T.white,border:"none",borderRadius:6,padding:"5px 14px",
                fontSize:"0.8125rem",fontWeight:600,cursor:"pointer" }}>
              Portal Form
            </button>
            <button onClick={()=>setRegFlow({ mode:"self-service", program:activeProgram })}
              style={{ background:T.white,color:"#1d4ed8",border:"1px solid #bfdbfe",borderRadius:6,
                padding:"5px 14px",fontSize:"0.8125rem",fontWeight:500,cursor:"pointer" }}>
              Token URL (self-service demo)
            </button>
          </div>
        )}

        <StatsBar prospects={filtered} />

        {/* toolbar */}
        <div style={{ display:"flex",gap:10,marginBottom:14,alignItems:"center",flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 220px",maxWidth:340 }}>
            <TextIn placeholder="Search name, NRIC, phone, email…" value={search} onChange={setSearch} />
          </div>
          <button onClick={()=>setShowFilters(v=>!v)}
            style={{ border:`1px solid ${activeFilterCount>0?T.primary500:T.gray200}`,background:activeFilterCount>0?T.primary100:T.white,
              color:activeFilterCount>0?T.primary600:T.neutral7,borderRadius:8,padding:"7px 14px",fontSize:"0.875rem",cursor:"pointer",
              fontWeight:activeFilterCount>0?600:400,display:"flex",alignItems:"center",gap:6 }}>
            ⚙ Filters{activeFilterCount>0?` (${activeFilterCount})`:""}
          </button>
          {activeFilterCount>0 && (
            <button onClick={()=>setFilters({ statuses:[],risks:[],sourceTypes:[],attendances:[] })}
              style={{ border:"none",background:"none",color:T.neutral6,fontSize:"0.8125rem",cursor:"pointer",textDecoration:"underline" }}>
              Clear
            </button>
          )}
          <div style={{ marginLeft:"auto",display:"flex",gap:4 }}>
            {["list","kanban"].map(mode=>(
              <button key={mode} onClick={()=>setViewMode(mode)}
                style={{ border:`1px solid ${viewMode===mode?T.primary500:T.gray200}`,background:viewMode===mode?T.primary100:T.white,
                  color:viewMode===mode?T.primary600:T.neutral7,borderRadius:7,padding:"6px 12px",fontSize:"0.875rem",cursor:"pointer" }}>
                {mode==="list"?"≡ List":"⊞ Kanban"}
              </button>
            ))}
          </div>
        </div>

        {showFilters && <FilterPanel filters={filters} onChange={setFilters} />}

        {viewMode==="list" ? (
          <div style={{ background:T.white,border:`1px solid ${T.gray200}`,borderRadius:10,overflow:"hidden" }}>
            <ListTable prospects={sorted} onSelect={setSelected} sort={sort} onSort={handleSort} />
          </div>
        ) : (
          <div style={{ display:"flex",gap:14,alignItems:"flex-start",overflowX:"auto" }}>
            {STATUSES.map(status=>(
              <KanbanColumn key={status.key} status={status}
                prospects={sorted.filter(p=>p.status===status.key)} onSelect={setSelected} />
            ))}
          </div>
        )}
      </div>

      {/* detail drawer */}
      {selected && (
        <ProspectDrawer
          prospect={selected}
          onClose={()=>setSelected(null)}
          onUpdate={handleUpdate}
          onRegisterNew={prog=>setRegFlow({ mode:"portal", program:prog })}
        />
      )}
    </div>
  );
}
