export function ProspectSummarySection({ api }) {
  const summaryRows = api.getProspectsForSummaryCounts();
  const s = api.computeProspectListSummary(summaryRows);
  const active = String(api.state.listKpiActive || "");
  const cardAttrs = (key) => ({
    "data-prospect-kpi": key,
    role: "button",
    tabIndex: 0,
    "aria-pressed": active === key,
  });
  const cardClass = (base, key) => `${base}${active === key ? " is-active" : ""}`;

  return (
    <section className="prospect-summary" aria-label="Prospect summary">
      <div className="prospect-summary__grid" role="group" aria-label="Prospect summary">
        <article className={cardClass("prospect-summary-card prospect-summary-card--total", "total")} {...cardAttrs("total")}>
          <h3 className="prospect-summary-card__label">Total cases</h3>
          <p className="prospect-summary-card__value">{String(s.total)}</p>
        </article>
        <article className={cardClass("prospect-summary-card prospect-summary-card--qualified", "qualified")} {...cardAttrs("qualified")}>
          <h3 className="prospect-summary-card__label">Qualified</h3>
          <p className="prospect-summary-card__value">{String(s.qualified)}</p>
        </article>
        <article className={cardClass("prospect-summary-card prospect-summary-card--booked", "booked")} {...cardAttrs("booked")}>
          <h3 className="prospect-summary-card__label">Booked</h3>
          <p className="prospect-summary-card__value">{String(s.booked)}</p>
        </article>
        <article className={cardClass("prospect-summary-card prospect-summary-card--screened", "screened")} {...cardAttrs("screened")}>
          <h3 className="prospect-summary-card__label">Screened</h3>
          <p className="prospect-summary-card__value">{String(s.screened)}</p>
        </article>
        <article className={cardClass("prospect-summary-card prospect-summary-card--followup", "followup")} {...cardAttrs("followup")}>
          <h3 className="prospect-summary-card__label">Follow-up needed</h3>
          <p className="prospect-summary-card__value">{String(s.followUp)}</p>
        </article>
        <article className={cardClass("prospect-summary-card prospect-summary-card--highrisk", "highrisk")} {...cardAttrs("highrisk")}>
          <h3 className="prospect-summary-card__label">High risk</h3>
          <p className="prospect-summary-card__value">{String(s.highRisk)}</p>
        </article>
        <article className={cardClass("prospect-summary-card prospect-summary-card--firsttime", "firsttime")} {...cardAttrs("firsttime")}>
          <h3 className="prospect-summary-card__label">First-time screener</h3>
          <p className="prospect-summary-card__value">{String(s.firstTime)}</p>
        </article>
        <article
          className="prospect-summary-card prospect-summary-card--conversion"
          aria-label="Conversion rate: screened cases as a share of total cases in view"
        >
          <h3 className="prospect-summary-card__label">Conversion rate</h3>
          <p className="prospect-summary-card__value">{s.total === 0 ? "—" : `${s.conversionRatePct}%`}</p>
        </article>
      </div>
    </section>
  );
}
