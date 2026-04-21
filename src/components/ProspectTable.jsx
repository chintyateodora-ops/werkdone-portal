import { IconHtml } from "../utils/iconHtml";
import { SortTh } from "./SortTh";

export function ProspectTable({ api }) {
  const rows = api.getListTableRows();
  if (rows.length === 0) {
    return (
      <div className="table-card">
        <p className="placeholder-block" style={{ margin: 0 }}>
          No prospects match the current program, search, or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="table-card">
      <table className="data-table">
        <thead>
          <tr>
            <SortTh label="Name" sortKey="name" api={api} />
            <SortTh label="Program" sortKey="program" api={api} />
            <SortTh label="Appointment type" sortKey="appointmentType" api={api} />
            <SortTh label="Date registered" sortKey="dateRegistered" api={api} />
            <th scope="col">Contact</th>
            <SortTh label="Status" sortKey="status" api={api} />
            <SortTh label="Attendance" sortKey="attendance" api={api} />
            <SortTh label="Source" sortKey="source" api={api} />
            <SortTh label="Next review" sortKey="nextReview" api={api} />
            <th scope="col">Review period</th>
            <SortTh label="Risk" sortKey="risk" api={api} />
            <th scope="col" className="data-table__th--actions">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const nr = api.kanbanCardNextReview(r);
            const reviewPeriod = nr?.period ? String(nr.period) : "—";
            const listScrId = api.pickClassicScreeningRecordIdForListProgram(r.program, r.rowKey);
            const listActionsOpen = api.state.prospectListActionsOpenRowKey === r.rowKey;
            const st = api.PIPELINE_KEYS.includes(r.status) ? r.status : "qualified";

            return (
              <tr tabIndex={0} key={r.rowKey} data-nav-prospect={r.rowKey}>
                <td className="data-table__cell--prospect-name">
                  <div className="prospect-name-cell">
                    <a className="prospect-name-cell__link" href={`#/prospect/${encodeURIComponent(r.rowKey)}/screening`}>
                      {r.name}
                    </a>
                    <div className="prospect-name-cell__meta">{api.formatProspectListSubline(r)}</div>
                  </div>
                </td>
                <td>{api.programDisplayLabel(r.program)}</td>
                <td>{api.prospectAppointmentTypeDisplayLabel(r)}</td>
                <td>{api.formatDateRegisteredDisplay(r.dateRegistered)}</td>
                <td>
                  <div className="cell-stack">
                    <span>{r.phone}</span>
                    <span className="cell-muted">{r.email}</span>
                  </div>
                </td>
                <td dangerouslySetInnerHTML={{ __html: api.statusPill(st) }} />
                <td>{api.classicScreeningAttendanceDisplay({ attendance: r.attendance })}</td>
                <td>
                  <div className="cell-stack">
                    <span>{r.sourceType}</span>
                    <span className="cell-muted">{r.sourceDetail}</span>
                  </div>
                </td>
                <td>{api.formatDateRegisteredDisplay(r.nextReview)}</td>
                <td>{reviewPeriod}</td>
                <td dangerouslySetInnerHTML={{ __html: api.riskLevelIndicator(r.risk) }} />
                <td className="data-table__td--actions">
                  {listScrId ? (
                    <div
                      className={`title-dropdown title-dropdown--align-end prospect-list-actions${listActionsOpen ? " is-open" : ""}`}
                      data-prospect-list-actions
                      data-table-row-stop
                    >
                      <button
                        type="button"
                        className="title-dropdown__trigger prospect-list-actions__trigger"
                        data-prospect-list-actions-toggle={r.rowKey}
                        aria-expanded={listActionsOpen}
                        aria-haspopup="true"
                        aria-label={`Actions for ${r.name}`}
                      >
                        <IconHtml html={api.icons.more} />
                      </button>
                      <div className="title-dropdown__panel" role="menu">
                        <button type="button" role="menuitem" className="title-dropdown__option" data-table-row-stop data-classic-screening-tasks={listScrId}>
                          Tasks
                        </button>
                        <button type="button" role="menuitem" className="title-dropdown__option" data-table-row-stop data-classic-screening-update={listScrId}>
                          Update
                        </button>
                      </div>
                    </div>
                  ) : (
                    <span className="cell-muted">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
