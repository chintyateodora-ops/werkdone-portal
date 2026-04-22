/**
 * Pure helpers mirroring legacy list filter shape (`createDefaultListFilters` in app.js).
 * The live portal mutates `state.listFilters` in the legacy module; these factories
 * stay available for React-controlled filter UIs.
 */
export function createDefaultListFilters() {
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

export function listFilterCategoryCount(filters) {
  const f = filters || createDefaultListFilters();
  let n = 0;
  if (f.stages?.length) n++;
  if (f.genders?.length) n++;
  if (f.risks?.length) n++;
  if (f.ageMin > 18 || f.ageMax < 100) n++;
  if (f.dateRegisteredFrom || f.dateRegisteredTo) n++;
  if (f.nextReviewFrom || f.nextReviewTo) n++;
  if (f.appointmentTypes?.length) n++;
  if (f.attendances?.length) n++;
  if (f.sourceTypes?.length) n++;
  return n;
}
