/**
 * Prospect detail tab bodies — static HTML aligned with Figma Make ProspectDetail.tsx.
 * Invoked from app.js as window.WD_renderDetailPanel(tabId, ctx).
 */
(function () {
  "use strict";

  const STAGE_CHECKLISTS = {
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

  /** Default field values for editable detail tabs (merged with state.detailFormValues in app.js) */
  const DETAIL_FORM_DEFAULTS = {
    details: {
      fullName: "Nurul Huda",
      gender: "Female",
      dob: "12/06/1988",
      email: "nurul.huda@gmail.com",
      contact: "9421 0785",
      nric: "S887782A",
      race: "Malay",
      religion: "Islam",
      preferredLanguages: "English, Malay",
      residentialStatus: "Singapore Citizen",
      chasCardType: "Blue",
      healthierSg: "enrolled",
      firstMammogramScreening: "no",
      lastScreeningYear: "2023",
      riskLevel: "Medium",
      personalCancerHistory: "No",
      cancerScreeningEligibilityCheck: "No",
      preExistingConditions: "None",
      familyHistory: "Mother had breast cancer at age 55",
      screeningEligible: "Mammogram (Mammobus) - Booked\nHPV Screening - Interested",
      followUpNotes:
        "Booked for Mammobus on 15 Nov 2025 at Bedok CC. Follow up on HPV screening interest after mammogram results.",
      sourceType: "Event",
      sourceName: "Community Health Roadshow - Bedok",
      pdpaConsent: "Yes",
      edmSubscription: "Yes",
      consentContact: "Yes",
      block: "45",
      street: "Bedok North Street 1",
      floor: "05",
      unit: "123",
      postal: "460123",
      country: "Singapore",
      /** Maps to screening registration `reg-appointment` / `reg-hpv-appointment` / `reg-fit-appointment` */
      preferredScreeningDate: "28-10-2025",
      preferredTimeSlot: "morning",
      screeningLocationEvent: "Community Health Roadshow - Bedok",
      /** Screening tab — review cadence (values match `fieldSelectValueLabel` options) */
      reviewPeriod: "6months",
      nextReviewDate: "14/05/2026",

      /** Mammogram screening registration questions (yes/no) — surfaced on Prospect v3 Eligibility tab */
      covid19VaccineSoon: "no",
      mammogramPast12or24Months: "no",
      breastfeedingPast6Months: "no",
      breastSymptoms: "no",
      breastImplants: "no",
      everHadBreastCancer: "no",
    },
    medicalHistory: {
      breastCancer: "Yes",
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
      otherMedicalIllness:
        "1) Left breast abscess surgery, drainage done 3x in 2010 @NCC\n2) Depression, OCD (cu IHH, on Fluoxetine)\n3) L5CS x1 (2006)\n4) L3, L4, L5, S1 bone degeneration, spinal stenosis admitted to NUH in 2018",
      currentMedication: "Fluoxetine",
      drugAllergy: "No",
      highRiskImmuno: "No",
      ageFirstSexual: "16",
      multiplePartners: "Yes",
      smoking: "Yes",
      smokingDurationYrs: "30",
      stiHistory: "No",
      ocpYrs: "0",
      hpvVaccination: "No",
      cervicalOtherDetails:
        "Started smoking at age 24 years old, currently smokes about 8 cig/day. Advised to stop smoking.",
      para: "1",
      lastPapTest: "4/2/21",
      lastPapResult: "Negative",
      lastMammo: "6/4/26",
      menarche: "12",
      menopause: "48",
      firstChildbirth: "36",
      hrtYrs: "",
      preMalignantBreast: "No",
      breastConditionsDetail: "Breast abscesses x3 in 2012, drainage op done. Now ok",
    },
  };

  const DETAILS_NAV = [
    ["detail-personal", "Personal Information"],
    ["detail-address", "Residential Address"],
    ["detail-screening", "Healthier SG & Subsidies"],
    ["detail-appointment", "Appointment Preferences"],
    ["detail-risk", "Risk Assessment"],
    ["detail-status", "Screening Status"],
    ["detail-engagement", "Engagement"],
    ["detail-consent", "Consent"],
  ];
  const MEDICAL_NAV = [
    ["mh-family", "Family Cancer Background"],
    ["mh-history", "History of Cancer"],
    ["mh-treatment", "Treatment Done"],
  ];
  const OTHER_NAV = [
    ["od-medical", "Other Medical Details"],
    ["od-cervical", "Cervical Cancer Risk Factors"],
    ["od-info", "Other Details"],
    ["od-breast", "Breast Cancer Risk Factors"],
  ];

  function mergeDetailTab(tabKey, formValues) {
    const def = DETAIL_FORM_DEFAULTS[tabKey];
    if (!def) return {};
    return { ...def, ...(formValues || {}) };
  }

  /** Prospect profile: show NRIC like list view (e.g. S****567D), not full string. */
  function maskNricForProfileDisplay(raw) {
    const s = String(raw || "").trim();
    if (!s) return "—";
    if (s.length <= 5) return `${s.charAt(0)}****`;
    return `${s.charAt(0)}****${s.slice(-4)}`;
  }

  function regNavHtml(e, items, activeId) {
    return items
      .map(
        ([id, label]) =>
          `<button type="button" class="registration__nav-btn ${activeId === id ? "is-active" : ""}" data-detail-section-nav="${e(id)}">${e(label)}</button>`
      )
      .join("");
  }

  /** Text inputs: same `.field` + control chrome as screening registration (app.js `renderRegisterMammobus`). */
  function fieldInput(e, label, key, tabKey, merged, editing, opts) {
    opts = opts || {};
    const required = !!opts.required;
    const placeholder = opts.placeholder != null ? String(opts.placeholder) : "";
    const fullWidth = !!opts.fullWidth;
    const inputType = opts.inputType != null ? String(opts.inputType) : "text";
    const val = merged[key] != null ? String(merged[key]) : "";
    const fid = `df-${tabKey}-${key}`;
    const lid = `${fid}-label`;
    const reqHtml = required ? '<span class="field__req" aria-hidden="true">*</span>' : "";
    const gridClass = fullWidth ? " field--full" : "";
    /** Matches screening form “Full Name (as per NRIC)” — identifier; not editable on profile. */
    if (opts.identifierReadonly) {
      if (editing) {
        return `<div class="field field--identifier-readonly${gridClass}">
        <label id="${e(lid)}">${e(label)}${reqHtml}</label>
        <input type="hidden" data-detail-field="${e(key)}" value="${e(val)}"${required ? " required" : ""} />
        <div class="field__identifier-readonly-display" role="text" aria-labelledby="${e(lid)}" aria-readonly="true">${e(val)}</div>
      </div>`;
      }
      return `<div class="detail-field${fullWidth ? " detail-field--full" : ""}"><span class="detail-field__label">${e(label)}${reqHtml}</span><span class="detail-field__value">${e(val)}</span></div>`;
    }
    if (editing) {
      const phAttr = placeholder ? ` placeholder="${e(placeholder)}"` : "";
      return `<div class="field${gridClass}">
        <label for="${e(fid)}">${e(label)}${reqHtml}</label>
        <input id="${e(fid)}" type="${e(inputType)}" data-detail-field="${e(key)}" value="${e(val)}"${phAttr}${required ? " required" : ""} />
      </div>`;
    }
    return `<div class="detail-field${fullWidth ? " detail-field--full" : ""}"><span class="detail-field__label">${e(label)}${reqHtml}</span><span class="detail-field__value">${e(val)}</span></div>`;
  }

  /** NRIC on profile: always masked in UI; not editable (full value kept in hidden field when editing for save). */
  function fieldNric(e, label, key, tabKey, merged, editing, opts) {
    opts = opts || {};
    const required = !!opts.required;
    const val = merged[key] != null ? String(merged[key]) : "";
    const fid = `df-${tabKey}-${key}`;
    const lid = `${fid}-label`;
    const reqHtml = required ? '<span class="field__req" aria-hidden="true">*</span>' : "";
    const masked = maskNricForProfileDisplay(val);
    if (editing) {
      return `<div class="field field--nric-readonly">
        <label id="${e(lid)}">${e(label)}${reqHtml}</label>
        <input type="hidden" data-detail-field="${e(key)}" value="${e(val)}" />
        <div class="field__nric-readonly-display" role="text" aria-labelledby="${e(lid)}" aria-readonly="true">${e(masked)}</div>
      </div>`;
    }
    return `<div class="detail-field"><span class="detail-field__label">${e(label)}${reqHtml}</span><span class="detail-field__value">${e(masked)}</span></div>`;
  }

  /** +65 | mobile — same shell as registration */
  function fieldPhone(e, label, key, tabKey, merged, editing, opts) {
    opts = opts || {};
    const required = !!opts.required;
    const val = merged[key] != null ? String(merged[key]) : "";
    const fid = `df-${tabKey}-${key}`;
    const reqHtml = required ? '<span class="field__req" aria-hidden="true">*</span>' : "";
    if (editing) {
      return `<div class="field">
        <label for="${e(fid)}">${e(label)}${reqHtml}</label>
        <div class="field__inline">
          <input type="text" class="field__prefix" value="+65" disabled aria-label="Country code" />
          <input id="${e(fid)}" type="tel" data-detail-field="${e(key)}" value="${e(val)}" placeholder="E.g. 8123 4567"${required ? " required" : ""} />
        </div>
      </div>`;
    }
    return `<div class="detail-field"><span class="detail-field__label">${e(label)}${reqHtml}</span><span class="detail-field__value">${e(val)}</span></div>`;
  }

  /** DD-MM-YYYY + calendar — same `.field` + `.field__date` shell as registration (js/date-input.js). */
  function fieldDateInput(e, label, key, tabKey, merged, editing, opts) {
    opts = opts || {};
    const required = !!opts.required;
    const raw = merged[key] != null ? String(merged[key]) : "";
    const fid = `df-${tabKey}-${key}`;
    const displayVal =
      typeof window.WD_normalizeDateDisplay === "function" ? window.WD_normalizeDateDisplay(raw) : raw;
    const reqHtml = required ? '<span class="field__req" aria-hidden="true">*</span>' : "";
    if (editing) {
      return `<div class="field">
        <label for="${e(fid)}">${e(label)}${reqHtml}</label>
        <div class="field__date">
          <input class="field__date-text" id="${e(fid)}" type="text" data-detail-field="${e(
        key
      )}" value="${e(displayVal)}" placeholder="DD-MM-YYYY" inputmode="numeric" autocomplete="off" maxlength="10"${required ? " required" : ""} />
          <button type="button" class="field__date-btn" aria-label="Choose date" title="Choose date"></button>
          <input type="date" class="field__date-native" tabindex="-1" aria-hidden="true" />
        </div>
      </div>`;
    }
    return `<div class="detail-field"><span class="detail-field__label">${e(label)}${reqHtml}</span><span class="detail-field__value">${e(raw)}</span></div>`;
  }

  /** Dropdown — same `.field` + `select` chrome as registration (`app.js`). */
  function fieldSelect(e, label, key, tabKey, merged, editing, optionList, opts) {
    opts = opts || {};
    const required = !!opts.required;
    const placeholderLabel = opts.placeholderLabel != null ? String(opts.placeholderLabel) : "Select";
    const val = merged[key] != null ? String(merged[key]) : "";
    const fid = `df-${tabKey}-${key}`;
    const reqHtml = required ? '<span class="field__req" aria-hidden="true">*</span>' : "";
    const optionsRows = (optionList || [])
      .map((opt) => `<option value="${e(opt)}"${val === opt ? " selected" : ""}>${e(opt)}</option>`)
      .join("");
    if (editing) {
      return `<div class="field">
        <label for="${e(fid)}">${e(label)}${reqHtml}</label>
        <select id="${e(fid)}" data-detail-field="${e(key)}"${required ? " required" : ""}>
          <option value="">${e(placeholderLabel)}</option>
          ${optionsRows}
        </select>
      </div>`;
    }
    return `<div class="detail-field"><span class="detail-field__label">${e(label)}${reqHtml}</span><span class="detail-field__value">${e(val)}</span></div>`;
  }

  /** Normalize legacy Healthier SG values to current canonical keys. */
  function canonicalHealthierSgStored(raw) {
    const s = String(raw || "").trim().toLowerCase();
    const compact = s.replace(/[^a-z0-9]/g, "");
    if (compact === "yes" || compact === "enrolled") return "enrolled";
    if (compact === "no" || compact === "notenrolled") return "not-enrolled";
    if (compact === "unsure" || compact.startsWith("unsure") || compact.includes("prefernottosay")) return "unsure";
    return String(raw || "").trim();
  }

  /** Dropdown with distinct option `value` vs visible label (matches screening registration value attributes). */
  function fieldSelectValueLabel(e, label, key, tabKey, merged, editing, valueLabelPairs, opts) {
    opts = opts || {};
    const required = !!opts.required;
    const placeholderLabel = opts.placeholderLabel != null ? String(opts.placeholderLabel) : "Select";
    const rawVal = merged[key] != null ? String(merged[key]) : "";
    const normalize = typeof opts.valueNormalize === "function" ? opts.valueNormalize : null;
    const val = normalize ? normalize(rawVal) : rawVal;
    const fid = `df-${tabKey}-${key}`;
    const reqHtml = required ? '<span class="field__req" aria-hidden="true">*</span>' : "";
    const pairs = valueLabelPairs || [];
    const optionsRows = pairs
      .map(([v, lbl]) => `<option value="${e(v)}"${val === v ? " selected" : ""}>${e(lbl)}</option>`)
      .join("");
    const displayLabel = pairs.find(([v]) => v === val)?.[1] || val || "—";
    if (editing) {
      return `<div class="field">
        <label for="${e(fid)}">${e(label)}${reqHtml}</label>
        <select id="${e(fid)}" data-detail-field="${e(key)}"${required ? " required" : ""}>
          <option value="">${e(placeholderLabel)}</option>
          ${optionsRows}
        </select>
      </div>`;
    }
    return `<div class="detail-field"><span class="detail-field__label">${e(label)}${reqHtml}</span><span class="detail-field__value">${e(displayLabel)}</span></div>`;
  }

  /** Yes/No radios — values `yes` / `no` (screening registration mammogram question). */
  function fieldRadioYesNo(e, legend, key, tabKey, merged, editing, opts) {
    opts = opts || {};
    const required = !!opts.required;
    const val = merged[key] != null ? String(merged[key]) : "";
    const name = `df-${tabKey}-${key}-radio`;
    const reqHtml = required ? '<span class="field__req" aria-hidden="true">*</span>' : "";
    if (editing) {
      return `<fieldset class="registration__fieldset field field--full">
        <legend class="registration__fieldset-legend registration__fieldset-legend--field">${e(legend)}${reqHtml}</legend>
        <div class="registration__radio-group" role="radiogroup"${required ? ' aria-required="true"' : ""}>
          <label class="registration__radio-label"><input type="radio" name="${e(name)}" data-detail-field="${e(
        key
      )}" value="yes"${val === "yes" ? " checked" : ""} /> Yes</label>
          <label class="registration__radio-label"><input type="radio" name="${e(name)}" data-detail-field="${e(
        key
      )}" value="no"${val === "no" ? " checked" : ""} /> No</label>
        </div>
      </fieldset>`;
    }
    const display = val === "yes" ? "Yes" : val === "no" ? "No" : "—";
    return `<div class="detail-field detail-field--full"><span class="detail-field__label">${e(legend)}${reqHtml}</span><span class="detail-field__value">${e(
      display
    )}</span></div>`;
  }

  /** Multi-select checkboxes — values joined with ", " on save (`data-detail-multi-select` in app.js). */
  function fieldCheckboxMulti(e, label, key, tabKey, merged, editing, optionList) {
    const valsRaw = merged[key] != null ? String(merged[key]) : "";
    const selected = new Set(
      valsRaw
        .split(/[,;]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    );
    const groupId = `df-${tabKey}-${key}-multi`;
    const labelId = `${groupId}-legend`;
    if (editing) {
      const boxes = (optionList || [])
        .map((opt) => {
          const oid = `${groupId}-${String(opt).replace(/[^a-zA-Z0-9_-]/g, "")}`;
          const checked = selected.has(opt) ? " checked" : "";
          return `<label class="registration__check-label" for="${e(oid)}"><input type="checkbox" id="${e(
            oid
          )}" value="${e(opt)}"${checked} /> ${e(opt)}</label>`;
        })
        .join("");
      return `<div class="field field--full">
        <span class="field__static-label" id="${e(labelId)}">${e(label)}</span>
        <div class="registration__checkbox-stack" role="group" aria-labelledby="${e(
          labelId
        )}" data-detail-multi-select="${e(key)}">
          ${boxes}
        </div>
      </div>`;
    }
    const display = valsRaw.trim() || "—";
    return `<div class="detail-field detail-field--full"><span class="detail-field__label">${e(
      label
    )}</span><span class="detail-field__value">${e(display)}</span></div>`;
  }

  function fieldTextarea(e, label, key, tabKey, merged, editing, opts) {
    opts = opts || {};
    const val = merged[key] != null ? String(merged[key]) : "";
    const fid = `df-${tabKey}-${key}`;
    const placeholder =
      opts.placeholder != null ? ` placeholder="${e(String(opts.placeholder))}"` : "";
    const rows = opts.rows != null ? Number(opts.rows) : 4;
    if (editing) {
      return `<div class="field field--full">
        <label for="${e(fid)}">${e(label)}</label>
        <textarea id="${e(fid)}" rows="${rows}" data-detail-field="${e(key)}"${placeholder}>${e(val)}</textarea>
      </div>`;
    }
    return `<div class="detail-field detail-field--full"><span class="detail-field__label">${e(label)}</span><div class="detail-field__value detail-field__value--pre">${e(val)}</div></div>`;
  }

  /** Single checkbox — stores "Yes" / "No" (saved in app.js for `input[type=checkbox]`). */
  function fieldCheckbox(e, label, key, tabKey, merged, editing, opts) {
    opts = opts || {};
    const fullWidth = opts.fullWidth !== false;
    const val = merged[key] != null ? String(merged[key]) : "";
    let checked = val === "Yes" || val === "yes" || val === "true" || val === "1";
    if (!checked && key === "pdpaConsent") checked = val === "Consented";
    if (!checked && key === "edmSubscription") checked = val === "Subscribed";
    if (!checked && key === "consentContact")
      checked = val.length > 0 && val !== "No" && val.toLowerCase() !== "no";
    const fid = `df-${tabKey}-${key}`;
    const fieldGrid = fullWidth ? " field--full" : "";
    const detailGrid = fullWidth ? " detail-field--full" : "";
    if (editing) {
      return `<div class="field${fieldGrid}">
        <label class="registration__check-label" for="${e(fid)}">
          <input type="checkbox" id="${e(fid)}" data-detail-field="${e(key)}" value="Yes"${checked ? " checked" : ""} />
          ${e(label)}
        </label>
      </div>`;
    }
    return `<div class="detail-field${detailGrid}">
      <span class="detail-field__label">${e(label)}</span>
      <span class="detail-field__value">${e(checked ? "Yes" : "No")}</span>
    </div>`;
  }

  function detailFormToolbar(e, panelAttr, editing) {
    if (editing) {
      return `<button type="button" class="btn btn--outline" data-detail-form-action="cancel" data-detail-form-panel="${e(panelAttr)}">Cancel</button>
        <button type="button" class="btn btn--primary" data-detail-form-action="save" data-detail-form-panel="${e(panelAttr)}">Save</button>`;
    }
    return `<button type="button" class="btn btn--outline" data-detail-form-action="edit" data-detail-form-panel="${e(panelAttr)}">Edit</button>`;
  }

  function df(e, label, value) {
    return `<div class="detail-field"><span class="detail-field__label">${e(label)}</span><span class="detail-field__value">${e(value)}</span></div>`;
  }

  /** Read-only next review date — matches screening tab mock (computed field, not editable). */
  function fieldReadonlyReviewDate(e, label, key, tabKey, merged) {
    const val = merged[key] != null ? String(merged[key]) : "";
    const fid = `df-${tabKey}-${key}-readonly`;
    return `<div class="field">
      <label for="${e(fid)}">${e(label)}</label>
      <input id="${e(fid)}" type="text" class="detail-review-next-date-input" value="${e(val)}" readonly tabindex="0" aria-readonly="true" />
    </div>`;
  }

  function dtextarea(e, label, value) {
    return `<div class="detail-field detail-field--full"><span class="detail-field__label">${e(label)}</span><div class="detail-field__value detail-field__value--pre">${e(value)}</div></div>`;
  }

  /** `anchorId` = ToC / scroll target; placed on the card so the visible title stays in view. */
  function section(e, title, inner, anchorId) {
    const idAttr =
      anchorId != null && String(anchorId) !== ""
        ? ` id="${e(String(anchorId))}" tabindex="-1"`
        : "";
    return `<section class="detail-card"${idAttr}><h2 class="detail-card__title">${e(title)}</h2>${inner}</section>`;
  }

  function tocItem(e, href, label) {
    return `<a class="detail-toc__link" href="${href}">${e(label)}</a>`;
  }

  function appointmentCard(e, icons, day, dateNum, monthYear, title, badgeClass, badgeText, timeRange, doctor, location) {
    return `
      <article class="detail-appt-card">
        <div class="detail-appt-card__date">
          <span class="detail-appt-card__dow">${e(day)}</span>
          <span class="detail-appt-card__num">${e(dateNum)}</span>
          <span class="detail-appt-card__mon">${e(monthYear)}</span>
        </div>
        <div class="detail-appt-card__body">
          <div class="detail-appt-card__head">
            <h3 class="detail-appt-card__title">${e(title)}</h3>
            <span class="detail-appt-card__badge ${badgeClass}">${e(badgeText)}</span>
          </div>
          <p class="detail-appt-card__meta">${icons.clock}<span>${e(timeRange)}</span></p>
          <p class="detail-appt-card__meta">${icons.userSm}<span>${e(doctor)}</span></p>
          <p class="detail-appt-card__loc">${e(location)}</p>
        </div>
      </article>`;
  }

  function fmtFileSize(bytes) {
    const n = Number(bytes);
    if (!Number.isFinite(n) || n < 0) return "—";
    if (n < 1024) return `${n} B`;
    if (n < 1048576) return `${(n / 1024).toFixed(n < 10240 ? 1 : 0)} KB`;
    return `${(n / 1048576).toFixed(1)} MB`;
  }

  function formatDocUploaded(iso) {
    try {
      const dt = new Date(iso);
      if (Number.isNaN(dt.getTime())) return "—";
      return dt.toLocaleString("en-SG", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (_) {
      return "—";
    }
  }

  /** Activity timeline card (classic overview); optional `opts.forDrawer` = right sidebar (no id, compact chrome). */
  function renderActivityTimelineSection(e, detailActivityFeed, opts) {
    opts = opts || {};
    const forDrawer = !!opts.forDrawer;
    const activity = Array.isArray(detailActivityFeed) ? detailActivityFeed : [];
    const timelineMetaLine = (ev) => {
      const when = ev.dateDisplay != null ? String(ev.dateDisplay) : "—";
      const st = ev.stage != null && String(ev.stage).trim() !== "" ? String(ev.stage) : "";
      const stagePretty = st ? st.charAt(0).toUpperCase() + st.slice(1) : "";
      return stagePretty ? `${when} · ${stagePretty}` : when;
    };

    const timelineHtml =
      activity.length > 0
        ? activity
            .map(
              (ev) => `
                  <li class="timeline__item">
                    <div class="timeline__track" aria-hidden="true">
                      <span class="timeline__dot"></span>
                    </div>
                    <div class="timeline__body timeline__body--clear">
                      <span class="timeline__meta">${e(timelineMetaLine(ev))}</span>
                      <h4>${e(ev.title)}</h4>
                      <p class="timeline__body-text">${e(ev.body)}</p>
                      <p>By: ${e(ev.by)}</p>
                    </div>
                  </li>`
            )
            .join("")
        : `<li class="timeline__item timeline__item--empty"><p class="timeline__empty-msg">No activity recorded for this prospect yet.</p></li>`;

    if (forDrawer) {
      return `
            <div class="activity-timeline-drawer__log">
              <div class="timeline-scroll">
                <ul class="timeline">
                  ${timelineHtml}
                </ul>
              </div>
            </div>`;
    }

    return `
            <section class="detail-card detail-card--overview-col detail-card--overview-timeline" id="detail-activity-timeline">
              <div class="panel-section__head panel-section__head--timeline-only">
                <h3>Activity Timeline</h3>
              </div>
              <div class="timeline-scroll">
                <ul class="timeline">
                  ${timelineHtml}
                </ul>
              </div>
            </section>`;
  }

  window.WD_renderDetailPanel = function (tab, ctx) {
    const e = ctx.escapeAttr;
    const d = ctx.d;
    const state = ctx.state;
    const icons = ctx.icons;
    const pl = ctx.pipelineLabel;

    if (tab === "details") {
      const editing = ctx.detailFormEdit === "details";
      const merged = mergeDetailTab("details", ctx.formValues?.details);
      const nav = regNavHtml(e, DETAILS_NAV, ctx.detailNavSection || "detail-personal");
      return `
        <div class="detail-panel detail-panel--form" id="panel-details" data-detail-form-root="details">
          <div class="registration__split detail-reg-split">
            <div class="registration__toc detail-reg-toc" aria-label="Form sections">
              <aside class="registration__sidebar">
                <nav class="registration__sidebar-inner">${nav}</nav>
              </aside>
            </div>
            <div class="registration__form-col detail-reg-main">
              <div class="detail-form-sections">
                ${section(
                  e,
                  "PERSONAL INFORMATION",
                  `<div class="detail-fields detail-fields--2">
                    ${fieldInput(e, "Full Name (as per NRIC)", "fullName", "details", merged, editing, {
                      required: true,
                      placeholder: "Enter full name as in NRIC",
                      identifierReadonly: true,
                    })}
                    ${fieldSelect(
                      e,
                      "Residential Status",
                      "residentialStatus",
                      "details",
                      merged,
                      editing,
                      ["Singapore Citizen", "Permanent Resident", "Foreigner"],
                      { required: false, placeholderLabel: "Select Residential Status" }
                    )}
                    ${fieldNric(e, "NRIC / FIN Number", "nric", "details", merged, editing, { required: true })}
                    ${fieldDateInput(e, "Date of Birth", "dob", "details", merged, editing, {
                      required: true,
                    })}
                    ${fieldSelect(
                      e,
                      "Gender",
                      "gender",
                      "details",
                      merged,
                      editing,
                      ["Female", "Male", "Other"],
                      { required: true, placeholderLabel: "Select Gender" }
                    )}
                    ${fieldSelect(
                      e,
                      "Race",
                      "race",
                      "details",
                      merged,
                      editing,
                      ["Chinese", "Malay", "Indian", "Eurasian", "Others"],
                      { required: false, placeholderLabel: "Select Race" }
                    )}
                    ${fieldSelect(
                      e,
                      "Religion",
                      "religion",
                      "details",
                      merged,
                      editing,
                      [
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
                      { required: false, placeholderLabel: "Select Religion" }
                    )}
                    ${fieldPhone(e, "Contact Number", "contact", "details", merged, editing, {
                      required: true,
                    })}
                    ${fieldInput(e, "Email", "email", "details", merged, editing, {
                      inputType: "email",
                      placeholder: "Enter your email",
                    })}
                    ${fieldCheckboxMulti(
                      e,
                      "Preferred Language",
                      "preferredLanguages",
                      "details",
                      merged,
                      editing,
                      [
                        "English",
                        "Mandarin",
                        "Malay",
                        "Tamil",
                        "Hokkien",
                        "Cantonese",
                        "Teochew",
                        "Others",
                      ]
                    )}
                  </div>`,
                  "detail-personal"
                )}
                ${section(
                  e,
                  "Residential Address",
                  `<div class="detail-fields detail-fields--2 detail-fields--address">
                    ${fieldInput(e, "Block", "block", "details", merged, editing, {
                      placeholder: "E.g. 202",
                    })}
                    ${fieldInput(e, "Street Name", "street", "details", merged, editing, {
                      placeholder: "E.g. Pasir Drive",
                    })}
                    ${fieldInput(e, "Floor", "floor", "details", merged, editing, {
                      placeholder: "E.g. 50",
                    })}
                    ${fieldInput(e, "Unit No", "unit", "details", merged, editing, {
                      placeholder: "E.g. 101 or 345",
                    })}
                    ${fieldInput(e, "Postal Code", "postal", "details", merged, editing, {
                      inputType: "text",
                      placeholder: "E.g. 123456",
                    })}
                    ${fieldSelect(
                      e,
                      "Country",
                      "country",
                      "details",
                      merged,
                      editing,
                      ["Singapore", "Malaysia", "Indonesia", "Other"],
                      { required: false, placeholderLabel: "Select Country" }
                    )}
                  </div>`,
                  "detail-address"
                )}
                ${section(
                  e,
                  "Healthier SG & Subsidies",
                  `<div class="detail-fields detail-fields--2">
                    ${fieldSelect(
                      e,
                      "CHAS Card Type",
                      "chasCardType",
                      "details",
                      merged,
                      editing,
                      ["Blue", "Orange", "Green", "Not Applicable"],
                      { required: false, placeholderLabel: "Select CHAS Card Type" }
                    )}
                    ${fieldSelectValueLabel(
                      e,
                      "Are you enrolled under Healthier SG?",
                      "healthierSg",
                      "details",
                      merged,
                      editing,
                      [
                        ["enrolled", "Enrolled"],
                        ["not-enrolled", "Not Enrolled"],
                        ["unsure", "Unsure"],
                      ],
                      { required: false, placeholderLabel: "Select Enrolment Status", valueNormalize: canonicalHealthierSgStored }
                    )}
                    ${fieldRadioYesNo(
                      e,
                      "Is this your first mammogram screening?",
                      "firstMammogramScreening",
                      "details",
                      merged,
                      editing,
                      { required: false }
                    )}
                    ${fieldInput(e, "Year of Last Screening", "lastScreeningYear", "details", merged, editing, {
                      inputType: "text",
                      placeholder: "Enter Year of Last Screening",
                    })}
                  </div>`,
                  "detail-screening"
                )}
                ${section(
                  e,
                  "Appointment Preferences",
                  `<div class="detail-fields detail-fields--2">
                    ${fieldDateInput(e, "Preferred Screening Date", "preferredScreeningDate", "details", merged, editing, {
                      required: false,
                    })}
                    ${fieldSelectValueLabel(
                      e,
                      "Preferred Time Slot",
                      "preferredTimeSlot",
                      "details",
                      merged,
                      editing,
                      [
                        ["morning", "Morning"],
                        ["afternoon", "Afternoon"],
                        ["evening", "Evening"],
                      ],
                      { required: false, placeholderLabel: "Select Preferred Time Slot" }
                    )}
                    ${fieldInput(e, "Screening Location / Event", "screeningLocationEvent", "details", merged, editing, {
                      fullWidth: true,
                      placeholder: "Enter Screening Location / Event",
                    })}
                  </div>`,
                  "detail-appointment"
                )}
                ${section(
                  e,
                  "RISK ASSESSMENT",
                  `<div class="detail-fields">
                    ${fieldSelect(
                      e,
                      "Risk Level",
                      "riskLevel",
                      "details",
                      merged,
                      editing,
                      ["Low", "Medium", "High"],
                      { required: false, placeholderLabel: "Select Risk Level" }
                    )}
                    ${fieldTextarea(e, "Personal History of Cancer", "personalCancerHistory", "details", merged, editing, {
                      placeholder: "Enter Personal History of Cancer",
                      rows: 4,
                    })}
                    ${fieldTextarea(e, "Pre-existing Health Conditions", "preExistingConditions", "details", merged, editing, {
                      placeholder: "Enter Pre-existing Health Conditions",
                      rows: 4,
                    })}
                    ${fieldTextarea(e, "Family History of Cancer", "familyHistory", "details", merged, editing, {
                      placeholder: "Enter Family History of Cancer",
                      rows: 4,
                    })}
                    ${fieldCheckbox(e, "Cancer Screening Eligibility Check", "cancerScreeningEligibilityCheck", "details", merged, editing)}
                  </div>`,
                  "detail-risk"
                )}
                ${section(
                  e,
                  "SCREENING STATUS",
                  `<div class="detail-fields">
                    ${fieldTextarea(e, "Screening Eligible For & Signed Up", "screeningEligible", "details", merged, editing)}
                    ${fieldTextarea(e, "Follow-up Notes for CN", "followUpNotes", "details", merged, editing)}
                  </div>`,
                  "detail-status"
                )}
                ${section(
                  e,
                  "ENGAGEMENT",
                  `<div class="detail-fields detail-fields--2">
                    ${fieldSelect(
                      e,
                      "How did you hear about us?",
                      "sourceType",
                      "details",
                      merged,
                      editing,
                      ["Event", "Campaign", "Referral", "Social Media", "Website", "Walk-in", "Other"],
                      { required: false, placeholderLabel: "Select Source Type" }
                    )}
                    ${fieldInput(e, "Campaign / Event Name", "sourceName", "details", merged, editing, {
                      placeholder: "e.g. Pink for Life 2025",
                    })}
                  </div>`,
                  "detail-engagement"
                )}
                ${section(
                  e,
                  "CONSENT",
                  `<div class="detail-fields detail-fields--2">
                    ${fieldCheckbox(e, "PDPA Consent", "pdpaConsent", "details", merged, editing, { fullWidth: false })}
                    ${fieldCheckbox(e, "eDM Subscription", "edmSubscription", "details", merged, editing, { fullWidth: false })}
                    ${fieldCheckbox(e, "Consent for SCS to Contact", "consentContact", "details", merged, editing, { fullWidth: true })}
                  </div>`,
                  "detail-consent"
                )}
              </div>
            </div>
          </div>
        </div>`;
    }

    if (tab === "medical-history") {
      const editing = ctx.detailFormEdit === "medical-history";
      const merged = mergeDetailTab("medicalHistory", ctx.formValues?.medicalHistory);
      const nav = regNavHtml(e, MEDICAL_NAV, ctx.detailNavSection || "mh-family");
      return `
        <div class="detail-panel detail-panel--form" id="panel-medical-history" data-detail-form-root="medical-history">
          <div class="registration__split detail-reg-split">
            <div class="registration__toc detail-reg-toc" aria-label="Form sections">
              <aside class="registration__sidebar">
                <nav class="registration__sidebar-inner">${nav}</nav>
              </aside>
            </div>
            <div class="registration__form-col detail-reg-main">
              <div class="detail-form-sections">
                ${section(
                  e,
                  "FAMILY CANCER BACKGROUND",
                  `<div class="detail-fields detail-fields--2">
                    ${fieldInput(e, "Breast Cancer", "breastCancer", "medicalHistory", merged, editing)}
                    ${fieldInput(e, "Colorectal Cancer", "colorectalCancer", "medicalHistory", merged, editing)}
                    ${fieldInput(e, "Ovarian Cancer", "ovarianCancer", "medicalHistory", merged, editing)}
                    ${fieldInput(e, "Other Cancer", "otherCancer", "medicalHistory", merged, editing)}
                  </div>`,
                  "mh-family"
                )}
                ${section(
                  e,
                  "HISTORY OF CANCER",
                  `<div class="detail-fields detail-fields--2">
                    ${fieldInput(e, "History of Cancer", "historyOfCancer", "medicalHistory", merged, editing)}
                    ${fieldInput(e, "Diagnosed Year", "diagnosedYear", "medicalHistory", merged, editing)}
                    ${fieldTextarea(e, "Cancer Detail", "cancerDetail", "medicalHistory", merged, editing)}
                    ${fieldDateInput(e, "Follow Up At", "followUpAt", "medicalHistory", merged, editing)}
                  </div>`,
                  "mh-history"
                )}
                ${section(
                  e,
                  "TREATMENT DONE",
                  `<div class="detail-fields detail-fields--2">
                    ${fieldInput(e, "Surgery", "surgery", "medicalHistory", merged, editing)}
                    ${fieldInput(e, "Radiation Therapy", "radiation", "medicalHistory", merged, editing)}
                    ${fieldInput(e, "Chemotherapy", "chemo", "medicalHistory", merged, editing)}
                  </div>`,
                  "mh-treatment"
                )}
              </div>
            </div>
          </div>
        </div>`;
    }

    if (tab === "other-details") {
      const editing = ctx.detailFormEdit === "other-details";
      const merged = mergeDetailTab("otherDetails", ctx.formValues?.otherDetails);
      const nav = regNavHtml(e, OTHER_NAV, ctx.detailNavSection || "od-medical");
      return `
        <div class="detail-panel detail-panel--form" id="panel-other-details" data-detail-form-root="other-details">
          <div class="registration__split detail-reg-split">
            <div class="registration__toc detail-reg-toc" aria-label="Form sections">
              <aside class="registration__sidebar">
                <nav class="registration__sidebar-inner">${nav}</nav>
              </aside>
            </div>
            <div class="registration__form-col detail-reg-main">
              <div class="detail-form-sections">
                ${section(
                  e,
                  "OTHER MEDICAL DETAILS",
                  `<div>
                    ${fieldTextarea(e, "Other Medical/Surgical Illness", "otherMedicalIllness", "otherDetails", merged, editing)}
                    <div class="detail-fields detail-fields--2">
                      ${fieldInput(e, "Current Medication", "currentMedication", "otherDetails", merged, editing)}
                      ${fieldInput(e, "Any Drug Allergy", "drugAllergy", "otherDetails", merged, editing)}
                    </div>
                    ${fieldInput(e, "High Risk Immunosuppressive clinical condition", "highRiskImmuno", "otherDetails", merged, editing)}
                  </div>`,
                  "od-medical"
                )}
                ${section(
                  e,
                  "CERVICAL CANCER RISK FACTORS",
                  `<div class="detail-fields detail-fields--2">
                    ${fieldInput(e, "Age at First Sexual Intercourse", "ageFirstSexual", "otherDetails", merged, editing)}
                    ${fieldInput(e, "Multiple Sexual Partners", "multiplePartners", "otherDetails", merged, editing)}
                    ${fieldInput(e, "Smoking", "smoking", "otherDetails", merged, editing)}
                    ${fieldInput(e, "Duration Smoking (in Yrs)", "smokingDurationYrs", "otherDetails", merged, editing)}
                    ${fieldInput(e, "History of Sexually Transmitted Infections", "stiHistory", "otherDetails", merged, editing)}
                    ${fieldInput(e, "Use of OCP (in Yrs)", "ocpYrs", "otherDetails", merged, editing)}
                    ${fieldInput(e, "HPV Vaccination", "hpvVaccination", "otherDetails", merged, editing)}
                    ${fieldTextarea(e, "Other Details", "cervicalOtherDetails", "otherDetails", merged, editing)}
                  </div>`,
                  "od-cervical"
                )}
                ${section(
                  e,
                  "OTHER DETAILS",
                  `<div class="detail-fields detail-fields--2">
                    ${fieldInput(e, "Para (No. Of Children Delivered)", "para", "otherDetails", merged, editing)}
                    ${fieldDateInput(e, "Last Pap / HPV Test Done On", "lastPapTest", "otherDetails", merged, editing)}
                    ${fieldInput(e, "Last Pap / HPV Test Result", "lastPapResult", "otherDetails", merged, editing)}
                    ${fieldDateInput(e, "Last Mammogram Date", "lastMammo", "otherDetails", merged, editing)}
                  </div>`,
                  "od-info"
                )}
                ${section(
                  e,
                  "BREAST CANCER RISK FACTORS",
                  `<div class="detail-fields detail-fields--2">
                    ${fieldInput(e, "Age at Menarche (FMP)", "menarche", "otherDetails", merged, editing)}
                    ${fieldInput(e, "Age at Menopause", "menopause", "otherDetails", merged, editing)}
                    ${fieldInput(e, "Age at First Childbirth", "firstChildbirth", "otherDetails", merged, editing)}
                    ${fieldInput(e, "Duration of Use of HRT (in Yrs)", "hrtYrs", "otherDetails", merged, editing)}
                    ${fieldInput(e, "Pre-Malignant Breast Conditions", "preMalignantBreast", "otherDetails", merged, editing)}
                    ${fieldTextarea(e, "Breast Conditions (Details)", "breastConditionsDetail", "otherDetails", merged, editing)}
                  </div>`,
                  "od-breast"
                )}
              </div>
            </div>
          </div>
        </div>`;
    }

    if (tab === "screening") {
      const screeningRecordsPanel =
        typeof window.WD_renderClassicScreeningRecordsPanel === "function"
          ? window.WD_renderClassicScreeningRecordsPanel(e)
          : `<p class="placeholder-block">Screening records unavailable.</p>`;
      return `
        <div class="detail-panel detail-panel--stack" id="panel-screening">
          ${screeningRecordsPanel}
        </div>`;
    }

    if (tab === "appointments") {
      return `
        <div class="detail-panel detail-panel--stack" id="panel-appointments">
          <div class="detail-appt-toolbar">
            <input type="search" class="detail-appt-search" placeholder="Search appointments..." aria-label="Search appointments" />
            <button type="button" class="btn btn--primary" data-detail-toast="Create appointment (prototype).">${icons.plus} Create Appointment</button>
          </div>
          <div class="detail-appt-list">
            ${appointmentCard(
              e,
              icons,
              "Thu",
              "20",
              "Aug 2025",
              "Screening",
              "detail-appt-card__badge--blue",
              "Rescheduled",
              "08:30 AM - 09:00 AM",
              "Dr. Sarah Tan",
              "Location: Singapore Cancer Centre, Level 3"
            )}
            ${appointmentCard(
              e,
              icons,
              "Mon",
              "15",
              "Jul 2025",
              "Screening",
              "detail-appt-card__badge--green",
              "Completed",
              "10:00 AM - 10:30 AM",
              "Dr. Michael Wong",
              "Location: Singapore Cancer Centre, Level 2"
            )}
            ${appointmentCard(
              e,
              icons,
              "Fri",
              "10",
              "Jun 2025",
              "Screening",
              "detail-appt-card__badge--green",
              "Completed",
              "02:00 PM - 02:30 PM",
              "Dr. Sarah Tan",
              "Location: Singapore Cancer Centre, Level 3"
            )}
          </div>
        </div>`;
    }

    if (tab === "documents") {
      const docs = Array.isArray(ctx.detailDocuments) ? ctx.detailDocuments : [];
      const rows =
        docs.length === 0
          ? `<tr><td colspan="4" class="detail-documents__empty">No documents uploaded yet.</td></tr>`
          : docs
              .map((doc) => {
                const uploaded = e(formatDocUploaded(doc.uploadedAt));
                return `<tr>
                <td class="detail-documents__name">${e(doc.name)}</td>
                <td>${e(fmtFileSize(doc.size))}</td>
                <td>${uploaded}</td>
                <td>
                  <div class="detail-documents__actions">
                    <button type="button" class="btn btn--icon" data-detail-doc-download="${e(doc.id)}" aria-label="Download file">${icons.download}</button>
                    <button type="button" class="btn btn--icon" data-detail-doc-remove="${e(doc.id)}" aria-label="Remove file">${icons.trash}</button>
                  </div>
                </td>
              </tr>`;
              })
              .join("");
      return `
        <div class="detail-panel detail-panel--stack detail-documents" id="panel-documents">
          <div class="detail-documents__toolbar">
            <button type="button" class="btn btn--primary" data-detail-doc-upload>${icons.upload} Upload</button>
            <input type="file" id="detail-documents-input" class="detail-documents-file-input" multiple aria-label="Choose files to upload" />
          </div>
          <div class="table-card">
            <table class="data-table detail-documents-table">
              <thead>
                <tr>
                  <th scope="col">File name</th>
                  <th scope="col">Size</th>
                  <th scope="col">Uploaded</th>
                  <th scope="col" class="data-table__th--actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>
          <p class="detail-documents__hint">Files are kept in this browser session only (prototype).</p>
        </div>`;
    }

    if (tab === "notes") {
      const notes = Array.isArray(ctx.detailNotes) ? ctx.detailNotes : [];
      const lastUpdatedLine =
        notes.length > 0
          ? `Last updated on ${formatDocUploaded(notes[0].submittedAt)} by ${e(notes[0].authorName)}`
          : "No notes yet.";
      const noteCardsHtml = notes
        .map(
          (note) => `
            <article class="note-card">
              <div class="note-card__head">
                <div>
                  <div class="note-card__author"><strong>${e(note.authorName)}</strong> <span class="note-card__role">• ${e(note.authorRole)}</span></div>
                  <div class="note-card__time">${e(formatDocUploaded(note.submittedAt))}</div>
                </div>
                <div class="note-card__actions">
                  <button type="button" class="btn btn--icon" aria-label="Edit note" data-detail-note-edit="${e(note.id)}">${icons.edit}</button>
                  <button type="button" class="btn btn--icon" aria-label="Delete note" data-detail-note-delete="${e(note.id)}">${icons.trash}</button>
                </div>
              </div>
              <p class="note-card__body note-card__body--multiline">${e(note.body)}</p>
            </article>`
        )
        .join("");
      return `
        <div class="detail-panel detail-panel--stack" id="panel-notes">
          <div class="detail-notes-toolbar">
            <span class="detail-notes-updated"><span class="detail-notes-updated__icon" aria-hidden="true">${icons.refresh}</span><span>${lastUpdatedLine}</span></span>
            <button type="button" class="btn btn--outline detail-notes-add" data-detail-add-note-open>${icons.plus} Add Notes</button>
          </div>
          <div class="detail-note-cards">
            ${noteCardsHtml}
          </div>
          <div class="detail-pagination">
            <button type="button" class="detail-page-btn" aria-label="Previous page">${icons.chevronLeftSm}</button>
            <button type="button" class="detail-page-btn detail-page-btn--active">1</button>
            <button type="button" class="detail-page-btn">2</button>
            <span class="detail-page-ellipsis">…</span>
            <button type="button" class="detail-page-btn" aria-label="Next page">${icons.chevronRightSm}</button>
          </div>
        </div>`;
    }

    return `<div class="detail-panel" id="panel-unknown"><p class="placeholder-block">Unknown tab.</p></div>`;
  };

  window.WD_STAGE_CHECKLISTS = STAGE_CHECKLISTS;
  window.WD_DETAIL_FORM_DEFAULTS = DETAIL_FORM_DEFAULTS;
  window.WD_renderActivityTimelineSection = renderActivityTimelineSection;

  /** Full-width sticky toolbar (last updated + Edit/Save/Cancel) for prospect form tabs — rendered in app.js above .detail-panels */
  window.WD_renderDetailFormStickyToolbar = function (tab, ctx) {
    const formTabs = ["details", "medical-history", "other-details"];
    if (!formTabs.includes(tab)) return "";
    const e = ctx.escapeAttr;
    const panelAttr = tab;
    const editing = ctx.detailFormEdit === panelAttr;
    const actions = detailFormToolbar(e, panelAttr, editing);
    const ic = ctx.icons;
    return `<div class="detail-form-sticky-toolbar" role="region" aria-label="Form toolbar">
      <span class="detail-form-sticky-toolbar__meta">
        <span class="detail-notes-updated__icon" aria-hidden="true">${ic.refresh}</span>
        <span>Last updated on 17 July 2025 by John Smith</span>
      </span>
      <div class="detail-form-sticky-toolbar__actions">${actions}</div>
    </div>`;
  };
})();
