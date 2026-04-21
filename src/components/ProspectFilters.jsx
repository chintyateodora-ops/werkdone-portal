import { IconHtml } from "../utils/iconHtml";

let prospectSearchDebounce = null;

export function ProspectFilters({ api }) {
  const n = api.listFilterCategoryCount();
  const listPressed = api.state.view === "list";
  const kanbanPressed = api.state.view === "kanban";
  return (
    <div className="bc-bsh-filters prospects-filters-bar" role="toolbar" aria-label="Search and filters">
      <div className="toolbar-search prospects-filters-bar__search">
        <span className="toolbar-search__icon" aria-hidden="true">
          <IconHtml html={api.icons.search} />
        </span>
        <input
          type="search"
          id="prospect-search"
          data-wd-react-list="1"
          placeholder="Search by name, NRIC, phone no."
          value={api.state.search}
          autoComplete="off"
          onChange={(e) => {
            api.state.search = e.target.value;
            clearTimeout(prospectSearchDebounce);
            prospectSearchDebounce = setTimeout(() => {
              api.renderApp();
              const again = document.getElementById("prospect-search");
              if (again) {
                again.focus();
                again.setSelectionRange(again.value.length, again.value.length);
              }
            }, 200);
          }}
        />
      </div>
      <div className="prospects-filters-bar__end">
        <button
          type="button"
          className="ui-btn ui-btn--outline ui-btn--sm"
          id="btn-list-filters"
          aria-haspopup="dialog"
          aria-expanded={api.state.filterModal}
        >
          <span className="ui-btn__icon" aria-hidden="true">
            <IconHtml html={api.icons.filter} />
          </span>
          Filters
          {n > 0 ? (
            <span className="ui-badge" aria-label={`${n} filter categories active`}>
              {n}
            </span>
          ) : null}
        </button>
        <div className="view-toggle" role="group" aria-label="View mode">
          <button type="button" className="btn btn--icon" aria-pressed={kanbanPressed} aria-label="Kanban view" data-view="kanban">
            <IconHtml html={api.icons.grid} />
          </button>
          <button type="button" className="btn btn--icon" aria-pressed={listPressed} aria-label="List view" data-view="list">
            <IconHtml html={api.icons.list} />
          </button>
        </div>
      </div>
    </div>
  );
}
