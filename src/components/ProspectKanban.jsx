import { ProspectCard } from "./ProspectCard";

export function ProspectKanban({ api }) {
  const rows = api.getFilteredProspects();
  const cols = [
    { key: "qualified", label: "Qualified" },
    { key: "booked", label: "Booked" },
    { key: "screened", label: "Screened" },
  ];
  return (
    <div className="kanban">
      {cols.map((col) => {
        const inCol = rows.filter((r) => (api.PIPELINE_KEYS.includes(r.status) ? r.status : "qualified") === col.key);
        return (
          <div className="kanban-col" data-stage={col.key} key={col.key}>
            <div className="kanban-col__head">
              <div className="kanban-col__title">
                <span className="kanban-col__dot" aria-hidden="true" />
                {col.label}
              </div>
              <span className="kanban-col__count">{inCol.length}</span>
            </div>
            {inCol.map((r) => (
              <ProspectCard key={r.rowKey} row={r} api={api} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
