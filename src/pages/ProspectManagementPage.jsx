import { usePortalApi } from "../hooks";
import {
  ProspectFilters,
  ProspectKanban,
  ProspectListPageHeader,
  ProspectSummarySection,
  ProspectTable,
} from "../components";

export default function ProspectManagementPage() {
  const api = usePortalApi();
  if (!api) return null;

  return (
    <>
      <ProspectListPageHeader api={api} />
      <div className="prospects-kpi-shell">
        <ProspectSummarySection api={api} />
      </div>
      <div className="bc-main prospects-main">
        <ProspectFilters api={api} />
        {api.state.view === "kanban" ? <ProspectKanban api={api} /> : <ProspectTable api={api} />}
      </div>
    </>
  );
}
