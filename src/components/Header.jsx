import { Sidebar } from "./Sidebar";

/**
 * Presentational header matching legacy `renderHeader` structure (brand + primary nav + actions).
 * The live portal still paints the global header via legacy HTML for route shells; this component
 * documents the same DOM for future full-React shells.
 */
export function Header({ prospectContext = false, rowKeyForSwitcher = "", standalone = false }) {
  const rid = rowKeyForSwitcher ? encodeURIComponent(rowKeyForSwitcher) : "";
  const switcher = prospectContext ? (
    <div className="app-header__switcher" role="group" aria-label="Prospect view switcher">
      <a className="ui-btn ui-btn--default ui-btn--sm" href={`#/prospect/${rid}`}>
        classic
      </a>
      <a className="ui-btn ui-btn--outline ui-btn--sm" href={`#/prospectv3/${rid}`}>
        v1
      </a>
    </div>
  ) : null;

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <img
          className="app-header__logo"
          src={`${import.meta.env.BASE_URL}assets/branding/scs-logo.png`}
          alt="Singapore Cancer Society Logo"
          width={200}
          height={64}
        />
      </div>
      <Sidebar activeId="prospects" standalone={standalone} />
      <div className="app-header__actions">
        {switcher}
        <button type="button" className="user-chip" aria-label="User menu">
          <span className="user-chip__avatar">SJ</span>
          <span>
            <span className="user-name">Saphira Jane</span>
            <span className="sep">|</span>
            <span className="user-role">CPC Team</span>
          </span>
        </button>
        <button type="button" className="btn btn--outline btn--sm">
          Need Help?
        </button>
      </div>
    </header>
  );
}
