import { IconHtml } from "../utils/iconHtml";

export function ProspectCard({ row, api }) {
  const { tasks, pct } = api.kanbanCardProgress(row);
  const attendance = api.classicScreeningAttendanceDisplay({ attendance: row.attendance });
  const nextReview = api.kanbanCardNextReview(row);
  const attendanceSlug = String(attendance || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return (
    <article className="kanban-card" tabIndex={0} data-kanban-card data-kanban-prospect={row.rowKey}>
      <div className="kanban-card__program">
        <span className="pill">{api.kanbanProgramPillText(row)}</span>
      </div>
      <h2 className="kanban-card__name">{row.name}</h2>
      <p className="kanban-card__meta">{api.kanbanCardMetaLine(row)}</p>
      <div
        className="kanban-card__risk"
        dangerouslySetInnerHTML={{
          __html: `${api.riskLevelIndicator(row.risk)}${
            api.isFirstTimeScreenerProspect(row) ? '<span class="pill pill--firsttime" title="First-time screener">First-time</span>' : ""
          }${
            attendance && attendance !== "—"
              ? `<span class="pill pill--attendance pill--attendance-${api.escapeAttr(
                  attendanceSlug
                )}" title="Attendance">${api.escapeAttr(attendance)}</span>`
              : ""
          }`,
        }}
      />
      <div className="kanban-card__tasks">
        <span>Tasks</span>
        <span>{tasks}</span>
      </div>
      <div className="kanban-card__bar">
        <span style={{ width: `${pct}%` }} />
      </div>
      {nextReview ? (
        <div className="kanban-card__review" aria-label="Review period and next review">
          <span className="kanban-card__review-icon" aria-hidden="true">
            <IconHtml html={api.icons.calendar} />
          </span>
          <span className="kanban-card__review-text">{nextReview.label}</span>
        </div>
      ) : null}
    </article>
  );
}
