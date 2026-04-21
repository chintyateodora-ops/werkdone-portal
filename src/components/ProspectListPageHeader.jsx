import { PROGRAMS } from "../config/programs";
import { IconHtml } from "../utils/iconHtml";

export function ProspectListPageHeader({ api }) {
  const exportOpen = api.state.exportMenuOpen ? "is-open" : "";
  return (
    <header className="bc-bsh-toolbar prospects-page-toolbar" aria-label="Prospect list header">
      <div className="bc-bsh-toolbar__title-group">
        <div className={`title-dropdown ${api.state.programMenuOpen ? "is-open" : ""}`} id="program-title-dropdown">
          <button
            type="button"
            className="title-dropdown__trigger"
            data-program-menu-toggle
            aria-expanded={api.state.programMenuOpen}
            aria-haspopup="true"
          >
            <h1>{api.programTitle()}</h1>
            <span className="title-dropdown__chev" aria-hidden="true">
              <IconHtml html={api.icons.chevronTitle} />
            </span>
          </button>
          <div className="title-dropdown__panel" role="menu">
            {PROGRAMS.map((p) => (
              <button
                key={p.id}
                type="button"
                role="menuitem"
                className={`title-dropdown__option${api.state.program === p.id ? " is-selected" : ""}`}
                data-program-option={p.id}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="bc-bsh-toolbar__actions">
        <div className={`title-dropdown title-dropdown--align-end ${exportOpen}`} id="export-dropdown">
          <button
            type="button"
            className="ui-btn ui-btn--outline ui-btn--sm"
            data-export-menu-toggle
            aria-expanded={api.state.exportMenuOpen}
            aria-haspopup="true"
          >
            Export
          </button>
          <div className="title-dropdown__panel" role="menu">
            <button type="button" className="title-dropdown__option" role="menuitem" data-export-option="csv">
              Export CSV
            </button>
            <button type="button" className="title-dropdown__option" role="menuitem" data-export-option="excel">
              Export Excel
            </button>
          </div>
        </div>
        <div className={`title-dropdown title-dropdown--align-end ${api.state.addProspectMenuOpen ? "is-open" : ""}`} id="add-prospect-dropdown">
          <button
            type="button"
            className="ui-btn ui-btn--default ui-btn--sm"
            data-add-prospect-toggle
            aria-expanded={api.state.addProspectMenuOpen}
            aria-haspopup="true"
          >
            <span className="ui-btn__icon" aria-hidden="true">
              <IconHtml html={api.icons.plus} />
            </span>
            Add Prospect
          </button>
          <div className="title-dropdown__panel" role="menu">
            <a href="#/register/mammobus" className="title-dropdown__option" role="menuitem">
              Mammogram Screening Registration
            </a>
            <a href="#/register/hpv" className="title-dropdown__option" role="menuitem">
              HPV Screening Programme
            </a>
            <a href="#/register/fit" className="title-dropdown__option" role="menuitem">
              FIT Screening Programme
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
