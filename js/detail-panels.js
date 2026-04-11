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
      firstName: "Lee",
      lastName: "Wei Xiong",
      gender: "Female",
      dob: "15/03/1988",
      email: "email@email.com",
      contact: "9876 5432",
      address: "123 Bedok North Street 1, #05-123, Singapore 460123",
      nric: "S1234567D",
      race: "Chinese",
      religion: "Islam",
      preferredLang: "English",
      residentialStatus: "Singapore Citizen",
      chasType: "CHAS Blue",
      healthierSg: "Enrolled",
      cancerScreeningHistory: "Mammogram: 2023, HPV: Never",
      riskLevel: "High",
      personalCancerHistory: "No",
      cancerEligibilityCheck: "Eligible for Mammogram, HPV",
      preExistingConditions: "None",
      familyHistory: "Mother had breast cancer at age 55",
      screeningEligible: "Mammogram (Mammobus) - Booked\nHPV Screening - Interested",
      followUpNotes:
        "Booked for Mammobus on 15 Nov 2025 at Bedok CC. Follow up on HPV screening interest after mammogram results.",
      heardAbout: "Community Health Roadshow - Bedok",
      pdpaConsent: "Consented",
      edmSubscription: "Subscribed",
      consentContact: "Consented to be contacted for screening appointment booking",
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
      chasHolder: "Yes",
      menarche: "12",
      menopause: "48",
      firstChildbirth: "36",
      hrtYrs: "",
      preMalignantBreast: "No",
      breastConditionsDetail: "Breast abscesses x3 in 2012, drainage op done. Now ok",
    },
  };

  const DETAILS_NAV = [
    ["detail-basic", "Basic Information"],
    ["detail-screening", "Screening & Subsidy"],
    ["detail-risk", "Risk Assessment"],
    ["detail-status", "Screening Status"],
    ["detail-engagement", "Engagement"],
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

  function regNavHtml(e, items, activeId) {
    return items
      .map(
        ([id, label]) =>
          `<button type="button" class="registration__nav-btn ${activeId === id ? "is-active" : ""}" data-detail-section-nav="${e(id)}">${e(label)}</button>`
      )
      .join("");
  }

  function fieldInput(e, label, key, tabKey, merged, editing) {
    const val = merged[key] != null ? String(merged[key]) : "";
    const fid = `df-${tabKey}-${key}`;
    if (editing) {
      return `<div class="detail-field">
        <label class="detail-field__label" for="${e(fid)}">${e(label)}</label>
        <input class="detail-field__input" id="${e(fid)}" type="text" data-detail-field="${e(key)}" value="${e(val)}" />
      </div>`;
    }
    return `<div class="detail-field"><span class="detail-field__label">${e(label)}</span><span class="detail-field__value">${e(val)}</span></div>`;
  }

  function fieldTextarea(e, label, key, tabKey, merged, editing) {
    const val = merged[key] != null ? String(merged[key]) : "";
    const fid = `df-${tabKey}-${key}`;
    if (editing) {
      return `<div class="detail-field detail-field--full">
        <label class="detail-field__label" for="${e(fid)}">${e(label)}</label>
        <textarea class="detail-field__textarea" id="${e(fid)}" rows="4" data-detail-field="${e(key)}">${e(val)}</textarea>
      </div>`;
    }
    return `<div class="detail-field detail-field--full"><span class="detail-field__label">${e(label)}</span><div class="detail-field__value detail-field__value--pre">${e(val)}</div></div>`;
  }

  function detailFormToolbar(e, panelAttr, editing) {
    if (editing) {
      return `<button type="button" class="btn btn--outline" data-detail-form-action="cancel" data-detail-form-panel="${e(panelAttr)}">Cancel</button>
        <button type="button" class="btn btn--primary" data-detail-form-action="save" data-detail-form-panel="${e(panelAttr)}">Save</button>`;
    }
    return `<button type="button" class="btn btn--outline" data-detail-form-action="edit" data-detail-form-panel="${e(panelAttr)}">Edit</button>`;
  }

  function splitName(name) {
    const parts = String(name || "").trim().split(/\s+/);
    return { first: parts[0] || "—", last: parts.slice(1).join(" ") || "—" };
  }

  function df(e, label, value) {
    return `<div class="detail-field"><span class="detail-field__label">${e(label)}</span><span class="detail-field__value">${e(value)}</span></div>`;
  }

  function dtextarea(e, label, value) {
    return `<div class="detail-field detail-field--full"><span class="detail-field__label">${e(label)}</span><div class="detail-field__value detail-field__value--pre">${e(value)}</div></div>`;
  }

  function section(e, title, inner) {
    return `<section class="detail-card"><h2 class="detail-card__title">${e(title)}</h2>${inner}</section>`;
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

  function prospectDocsTableRow(e, name, source, uploadedOn, uploadedBy) {
    return `<tr>
      <td><button type="button" class="prospect-docs__name" data-detail-toast="View document (prototype).">${e(name)}</button></td>
      <td>${e(source)}</td>
      <td>${e(uploadedOn)}</td>
      <td>${e(uploadedBy)}</td>
      <td>
        <div class="prospect-docs__actions">
          <button type="button" class="btn btn--icon" data-detail-toast="Download (prototype)." aria-label="Download">${icons.download}</button>
          <button type="button" class="btn btn--icon" data-detail-toast="Delete (prototype)." aria-label="Delete">${icons.trash}</button>
        </div>
      </td>
    </tr>`;
  }

  function screeningDataRow(e, cells, statusHtml) {
    return `<tr>${cells.map((c) => `<td>${e(c)}</td>`).join("")}<td>${statusHtml}</td></tr>`;
  }

  function padBoolArray(arr, len) {
    const a = Array.isArray(arr) ? arr.slice() : [];
    while (a.length < len) a.push(false);
    return a.slice(0, len);
  }

  function countStageTasks(d, pipeline) {
    const labels = STAGE_CHECKLISTS[pipeline] || STAGE_CHECKLISTS.qualified;
    if (pipeline === "qualified") {
      const done = d.tasks.filter((t) => t.done).length;
      return { done, total: d.tasks.length };
    }
    const flags = padBoolArray(d.stageChecklistDone?.[pipeline], labels.length);
    const done = flags.filter(Boolean).length;
    return { done, total: labels.length };
  }

  window.WD_renderDetailPanel = function (tab, ctx) {
    const e = ctx.escapeAttr;
    const d = ctx.d;
    const state = ctx.state;
    const icons = ctx.icons;
    const pl = ctx.pipelineLabel;

    if (tab === "overview") {
      const pipe = state.pipeline;
      const labels = STAGE_CHECKLISTS[pipe] || STAGE_CHECKLISTS.qualified;
      const { done: doneCount, total: totalCount } = countStageTasks(d, pipe);

      let checklistHtml;
      if (pipe === "qualified") {
        checklistHtml = d.tasks
          .map(
            (t) => `
          <li class="detail-task-row detail-task-row--checklist ${t.done ? "is-done" : ""}">
            <input type="checkbox" class="detail-task-check" id="${e(t.id)}" data-task ${t.done ? "checked" : ""} />
            <label class="detail-task-text" for="${e(t.id)}">${e(t.label)}</label>
          </li>`
          )
          .join("");
      } else {
        const flags = padBoolArray(d.stageChecklistDone?.[pipe], labels.length);
        checklistHtml = labels
          .map((label, i) => {
            const done = !!flags[i];
            const tid = `st-${pipe}-${i}`;
            return `
          <li class="detail-task-row detail-task-row--checklist ${done ? "is-done" : ""}">
            <input type="checkbox" class="detail-task-check" id="${e(tid)}" data-stage-checklist="${e(pipe)}" data-task-index="${i}" ${done ? "checked" : ""} />
            <label class="detail-task-text" for="${e(tid)}">${e(label)}</label>
          </li>`;
          })
          .join("");
      }

      const timelineSrc = Array.isArray(d.timeline) ? d.timeline : [];
      const timelineFiltered = timelineSrc.filter((ev) => !ev.stage || ev.stage === pipe);
      const timelineStamp = (ev) => e(String(ev.dateTime != null ? ev.dateTime : ev.time || "—"));

      const timelineHtml =
        timelineFiltered.length > 0
          ? timelineFiltered
              .map(
                (ev) => `
                  <li class="timeline__item">
                    <div>
                      <div class="timeline__icon">${icons.phone}</div>
                      <div class="timeline__line"></div>
                    </div>
                    <div class="timeline__body timeline__body--clear">
                      <span class="timeline__meta">${timelineStamp(ev)}</span>
                      <h4>${e(ev.title)}</h4>
                      <p>${e(ev.body)}</p>
                      <p>By: ${e(ev.by)}</p>
                    </div>
                  </li>`
              )
              .join("")
          : `<li class="timeline__item timeline__item--empty"><p class="timeline__empty-msg">No activity logged for this stage yet.</p></li>`;

      return `
        <div class="detail-panel detail-panel--overview" id="panel-overview">
          <div class="detail-overview-columns">
            <section class="detail-card detail-card--overview-col detail-card--overview-timeline">
              <div class="panel-section__head panel-section__head--timeline-only">
                <h3>Activity Timeline</h3>
              </div>
              <div class="timeline-scroll">
                <ul class="timeline">
                  ${timelineHtml}
                </ul>
              </div>
            </section>
            <section class="detail-card detail-card--overview-col detail-card--tasks">
              <div class="panel-section__head">
                <h3 class="detail-card__heading-primary">${e(pl)} — tasks</h3>
                <span class="detail-overview-task-count">${doneCount} / ${totalCount} completed</span>
              </div>
              <ul class="detail-task-list">${checklistHtml}</ul>
            </section>
          </div>
        </div>`;
    }

    if (tab === "details") {
      const editing = ctx.detailFormEdit === "details";
      const merged = mergeDetailTab("details", ctx.formValues?.details);
      const nav = regNavHtml(e, DETAILS_NAV, ctx.detailNavSection || "detail-basic");
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
                  "BASIC INFORMATION",
                  `<div class="detail-fields detail-fields--2" id="detail-basic">
                    ${fieldInput(e, "First Name", "firstName", "details", merged, editing)}
                    ${fieldInput(e, "Last Name", "lastName", "details", merged, editing)}
                    ${fieldInput(e, "Gender", "gender", "details", merged, editing)}
                    ${fieldInput(e, "Date of Birth (Age: 37 years)", "dob", "details", merged, editing)}
                    ${fieldInput(e, "Email", "email", "details", merged, editing)}
                    ${fieldInput(e, "Contact No.", "contact", "details", merged, editing)}
                    ${fieldTextarea(e, "Address", "address", "details", merged, editing)}
                    ${fieldInput(e, "NRIC", "nric", "details", merged, editing)}
                    ${fieldInput(e, "Race", "race", "details", merged, editing)}
                    ${fieldInput(e, "Religion", "religion", "details", merged, editing)}
                    ${fieldInput(e, "Preferred Language", "preferredLang", "details", merged, editing)}
                  </div>`
                )}
                ${section(
                  e,
                  "SCREENING & SUBSIDY ELIGIBILITY",
                  `<div class="detail-fields detail-fields--2" id="detail-screening">
                    ${fieldInput(e, "Residential Status", "residentialStatus", "details", merged, editing)}
                    ${fieldInput(e, "CHAS Card Type", "chasType", "details", merged, editing)}
                    ${fieldInput(e, "HealthierSG Enrolment Status", "healthierSg", "details", merged, editing)}
                    ${fieldInput(e, "Cancer Screening History", "cancerScreeningHistory", "details", merged, editing)}
                  </div>`
                )}
                ${section(
                  e,
                  "RISK ASSESSMENT",
                  `<div class="detail-fields detail-fields--2" id="detail-risk">
                    ${fieldInput(e, "Risk Level", "riskLevel", "details", merged, editing)}
                    ${fieldInput(e, "Personal History of Cancer", "personalCancerHistory", "details", merged, editing)}
                    ${fieldTextarea(e, "Cancer Screening Eligibility Check", "cancerEligibilityCheck", "details", merged, editing)}
                    ${fieldInput(e, "Pre-existing Health Conditions", "preExistingConditions", "details", merged, editing)}
                    ${fieldInput(e, "Family History of Cancer", "familyHistory", "details", merged, editing)}
                  </div>`
                )}
                ${section(
                  e,
                  "SCREENING STATUS",
                  `<div class="detail-fields" id="detail-status">
                    ${fieldTextarea(e, "Screening Eligible For & Signed Up", "screeningEligible", "details", merged, editing)}
                    ${fieldTextarea(e, "Follow-up Notes for CN", "followUpNotes", "details", merged, editing)}
                  </div>`
                )}
                ${section(
                  e,
                  "ENGAGEMENT",
                  `<div class="detail-fields detail-fields--2" id="detail-engagement">
                    ${fieldTextarea(e, "How They Heard About the Programme", "heardAbout", "details", merged, editing)}
                    ${fieldInput(e, "PDPA Consent", "pdpaConsent", "details", merged, editing)}
                    ${fieldInput(e, "eDM Subscription", "edmSubscription", "details", merged, editing)}
                    ${fieldTextarea(e, "Consent for SCS to Contact", "consentContact", "details", merged, editing)}
                  </div>`
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
                  `<div class="detail-fields detail-fields--2" id="mh-family">
                    ${fieldInput(e, "Breast Cancer", "breastCancer", "medicalHistory", merged, editing)}
                    ${fieldInput(e, "Colorectal Cancer", "colorectalCancer", "medicalHistory", merged, editing)}
                    ${fieldInput(e, "Ovarian Cancer", "ovarianCancer", "medicalHistory", merged, editing)}
                    ${fieldInput(e, "Other Cancer", "otherCancer", "medicalHistory", merged, editing)}
                  </div>`
                )}
                ${section(
                  e,
                  "HISTORY OF CANCER",
                  `<div class="detail-fields detail-fields--2" id="mh-history">
                    ${fieldInput(e, "History of Cancer", "historyOfCancer", "medicalHistory", merged, editing)}
                    ${fieldInput(e, "Diagnosed Year", "diagnosedYear", "medicalHistory", merged, editing)}
                    ${fieldTextarea(e, "Cancer Detail", "cancerDetail", "medicalHistory", merged, editing)}
                    ${fieldInput(e, "Follow Up At", "followUpAt", "medicalHistory", merged, editing)}
                  </div>`
                )}
                ${section(
                  e,
                  "TREATMENT DONE",
                  `<div class="detail-fields detail-fields--2" id="mh-treatment">
                    ${fieldInput(e, "Surgery", "surgery", "medicalHistory", merged, editing)}
                    ${fieldInput(e, "Radiation Therapy", "radiation", "medicalHistory", merged, editing)}
                    ${fieldInput(e, "Chemotherapy", "chemo", "medicalHistory", merged, editing)}
                  </div>`
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
                  `<div id="od-medical">
                    ${fieldTextarea(e, "Other Medical/Surgical Illness", "otherMedicalIllness", "otherDetails", merged, editing)}
                    <div class="detail-fields detail-fields--2">
                      ${fieldInput(e, "Current Medication", "currentMedication", "otherDetails", merged, editing)}
                      ${fieldInput(e, "Any Drug Allergy", "drugAllergy", "otherDetails", merged, editing)}
                    </div>
                    ${fieldInput(e, "High Risk Immunosuppressive clinical condition", "highRiskImmuno", "otherDetails", merged, editing)}
                  </div>`
                )}
                ${section(
                  e,
                  "CERVICAL CANCER RISK FACTORS",
                  `<div class="detail-fields detail-fields--2" id="od-cervical">
                    ${fieldInput(e, "Age at First Sexual Intercourse", "ageFirstSexual", "otherDetails", merged, editing)}
                    ${fieldInput(e, "Multiple Sexual Partners", "multiplePartners", "otherDetails", merged, editing)}
                    ${fieldInput(e, "Smoking", "smoking", "otherDetails", merged, editing)}
                    ${fieldInput(e, "Duration Smoking (in Yrs)", "smokingDurationYrs", "otherDetails", merged, editing)}
                    ${fieldInput(e, "History of Sexually Transmitted Infections", "stiHistory", "otherDetails", merged, editing)}
                    ${fieldInput(e, "Use of OCP (in Yrs)", "ocpYrs", "otherDetails", merged, editing)}
                    ${fieldInput(e, "HPV Vaccination", "hpvVaccination", "otherDetails", merged, editing)}
                    ${fieldTextarea(e, "Other Details", "cervicalOtherDetails", "otherDetails", merged, editing)}
                  </div>`
                )}
                ${section(
                  e,
                  "OTHER DETAILS",
                  `<div class="detail-fields detail-fields--2" id="od-info">
                    ${fieldInput(e, "Para (No. Of Children Delivered)", "para", "otherDetails", merged, editing)}
                    ${fieldInput(e, "Last Pap / HPV Test Done On", "lastPapTest", "otherDetails", merged, editing)}
                    ${fieldInput(e, "Last Pap / HPV Test Result", "lastPapResult", "otherDetails", merged, editing)}
                    ${fieldInput(e, "Last Mammogram Date", "lastMammo", "otherDetails", merged, editing)}
                    ${fieldInput(e, "CHAS Card Holder", "chasHolder", "otherDetails", merged, editing)}
                  </div>`
                )}
                ${section(
                  e,
                  "BREAST CANCER RISK FACTORS",
                  `<div class="detail-fields detail-fields--2" id="od-breast">
                    ${fieldInput(e, "Age at Menarche (FMP)", "menarche", "otherDetails", merged, editing)}
                    ${fieldInput(e, "Age at Menopause", "menopause", "otherDetails", merged, editing)}
                    ${fieldInput(e, "Age at First Childbirth", "firstChildbirth", "otherDetails", merged, editing)}
                    ${fieldInput(e, "Duration of Use of HRT (in Yrs)", "hrtYrs", "otherDetails", merged, editing)}
                    ${fieldInput(e, "Pre-Malignant Breast Conditions", "preMalignantBreast", "otherDetails", merged, editing)}
                    ${fieldTextarea(e, "Breast Conditions (Details)", "breastConditionsDetail", "otherDetails", merged, editing)}
                  </div>`
                )}
              </div>
            </div>
          </div>
        </div>`;
    }

    if (tab === "screening") {
      const statusOk =
        '<span class="detail-screening-pill detail-screening-pill--ok">Completed</span>';
      const statusFu =
        '<span class="detail-screening-pill detail-screening-pill--warn">Follow-up Required</span>';
      return `
        <div class="detail-panel" id="panel-screening">
          <div class="detail-card detail-card--flush">
            <h2 class="detail-card__title">SCREENING HISTORY</h2>
            <div class="table-card detail-screening-table-wrap">
              <table class="data-table detail-screening-table">
                <thead>
                  <tr>
                    <th>Visit No.</th>
                    <th>Date of Visit</th>
                    <th>Doctor Name</th>
                    <th>Test Type</th>
                    <th>Result Date PAP</th>
                    <th>Pap Result Class</th>
                    <th>HPV 16</th>
                    <th>HPV 18</th>
                    <th>Other High Risk</th>
                    <th>Next Appointment In</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${screeningDataRow(
                    e,
                    ["V001", "15/11/2025", "Dr. Sarah Chen", "Pap Smear", "20/11/2025", "Negative", "Negative", "Negative", "Negative", "3 years"],
                    statusOk
                  )}
                  ${screeningDataRow(
                    e,
                    ["V002", "20/05/2024", "Dr. Michael Tan", "Pap Smear + HPV Test", "28/05/2024", "Normal", "Negative", "Negative", "Negative", "1 year"],
                    statusOk
                  )}
                  ${screeningDataRow(
                    e,
                    ["V003", "18/11/2023", "Dr. Sarah Chen", "Pap Smear", "25/11/2023", "Normal", "—", "—", "—", "6 months"],
                    statusOk
                  )}
                  ${screeningDataRow(
                    e,
                    ["V004", "15/02/2023", "Dr. Linda Wong", "HPV Test", "22/02/2023", "—", "Negative", "Negative", "Positive", "3 months"],
                    statusFu
                  )}
                </tbody>
              </table>
            </div>
          </div>
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

    if (tab === "notes") {
      return `
        <div class="detail-panel detail-panel--stack" id="panel-notes">
          <div class="detail-notes-toolbar">
            <span class="detail-notes-updated"><span class="detail-notes-updated__icon" aria-hidden="true">${icons.refresh}</span><span>Last updated on 17 July 2025 by John Smith</span></span>
            <button type="button" class="btn btn--outline detail-notes-add" data-detail-toast="Add note (prototype).">${icons.plus} Add Notes</button>
          </div>
          <div class="detail-note-cards">
            <article class="note-card">
              <div class="note-card__head">
                <div>
                  <div class="note-card__author"><strong>Jasmine Lim</strong> <span class="note-card__role">• Care Coordinator</span></div>
                  <div class="note-card__time">Nov 15, 2025 at 3:45 PM</div>
                </div>
                <div class="note-card__actions">
                  <button type="button" class="btn btn--icon" aria-label="Edit note" data-detail-toast="Edit note (prototype).">${icons.edit}</button>
                  <button type="button" class="btn btn--icon" aria-label="Delete note" data-detail-toast="Delete note (prototype).">${icons.trash}</button>
                </div>
              </div>
              <p class="note-card__body">Client expressed strong interest in attending screening workshops. Recommend enrolling in upcoming December session at Bedok Community Center.</p>
            </article>
            <article class="note-card">
              <div class="note-card__head">
                <div>
                  <div class="note-card__author"><strong>Sarah Tan</strong> <span class="note-card__role">• Outreach Specialist</span></div>
                  <div class="note-card__time">Nov 10, 2025 at 10:30 AM</div>
                </div>
                <div class="note-card__actions">
                  <button type="button" class="btn btn--icon" aria-label="Edit note" data-detail-toast="Edit note (prototype).">${icons.edit}</button>
                  <button type="button" class="btn btn--icon" aria-label="Delete note" data-detail-toast="Delete note (prototype).">${icons.trash}</button>
                </div>
              </div>
              <p class="note-card__body">Follow-up needed regarding insurance coverage questions. Client mentioned family history of breast cancer - flagging for priority screening.</p>
            </article>
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

    if (tab === "documents") {
      const rows = [
        ["Medical_History_Report.pdf", "Prospects", "15 Nov 2025", "System"],
        ["Screening_Results_2025.pdf", "Clinical Records", "12 Nov 2025", "Zara Khan"],
        ["Consent_Form_Signed.pdf", "Prospects", "10 Nov 2025", "Siti Nurul"],
        ["Lab_Test_Results.pdf", "Clinical Records", "08 Nov 2025", "Gary Johnson"],
        ["Insurance_Documents.pdf", "Prospects", "05 Nov 2025", "System"],
        ["Referral_Letter.pdf", "Referrals", "03 Nov 2025", "Zara Khan"],
        ["Treatment_Plan.pdf", "Clinical Records", "01 Nov 2025", "Siti Nurul"],
        ["Follow_Up_Notes.pdf", "Clinical Records", "28 Oct 2025", "Gary Johnson"],
        ["Patient_Registration.pdf", "Prospects", "25 Oct 2025", "System"],
        ["Appointment_Confirmation.pdf", "Prospects", "20 Oct 2025", "Zara Khan"],
      ];
      return `
        <div class="detail-panel detail-panel--stack" id="panel-documents">
          <input type="file" id="prospect-docs-file" class="prospect-docs-file-input" multiple tabindex="-1" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,application/pdf,image/*" title="Choose files to upload" />
          <section class="detail-card prospect-docs__toolbar-card" aria-label="Document tools">
            <div class="prospect-docs__search-row">
              <div class="prospect-docs__search-wrap">
                <span class="prospect-docs__search-icon" aria-hidden="true">${icons.search}</span>
                <input type="search" id="prospect-docs-search" class="prospect-docs__search-input" placeholder="Search documents..." autocomplete="off" aria-label="Search documents" />
              </div>
              <button type="button" class="btn btn--outline btn--prospect-docs-upload" data-prospect-docs-upload aria-label="Upload documents">${icons.upload} Upload Document</button>
            </div>
            <div class="prospect-docs__filter-row">
              <div class="prospect-docs__filter-left">
                <button type="button" class="btn btn--outline btn--sm" data-detail-toast="Filter (prototype).">${icons.filter} Filter</button>
                <button type="button" class="btn btn--outline btn--sm" data-detail-toast="Columns (prototype).">${icons.columns} Columns</button>
              </div>
              <div class="prospect-docs__filter-right">
                <span class="cell-muted">Show</span>
                <select class="prospect-docs__page-size" aria-label="Rows per page"><option>10</option><option>25</option><option>50</option></select>
                <span class="cell-muted">entries</span>
              </div>
            </div>
          </section>
          <section class="detail-card detail-card--flush prospect-docs__table-card">
            <div class="prospect-docs__table-scroll">
              <table class="data-table prospect-docs-table">
                <thead>
                  <tr>
                    <th>Document Name</th>
                    <th>Document Source</th>
                    <th class="prospect-docs-th-sort"><span class="prospect-docs-th-sort__inner">Uploaded on ${icons.sort}</span></th>
                    <th>Uploaded by</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody id="prospect-docs-tbody">${rows.map((r) => prospectDocsTableRow(e, r[0], r[1], r[2], r[3])).join("")}</tbody>
              </table>
            </div>
          </section>
          <footer class="prospect-docs__footer">
            <span class="cell-muted" id="prospect-docs-count">Showing 1 to 10 out of 10 records</span>
            <div class="detail-pagination">
              <button type="button" class="detail-page-btn" aria-label="Previous">${icons.chevronLeftSm}</button>
              <button type="button" class="detail-page-btn detail-page-btn--active">1</button>
              <button type="button" class="detail-page-btn" aria-label="Next">${icons.chevronRightSm}</button>
            </div>
          </footer>
        </div>`;
    }

    return `<div class="detail-panel" id="panel-unknown"><p class="placeholder-block">Unknown tab.</p></div>`;
  };

  window.WD_STAGE_CHECKLISTS = STAGE_CHECKLISTS;
  window.WD_DETAIL_FORM_DEFAULTS = DETAIL_FORM_DEFAULTS;

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
