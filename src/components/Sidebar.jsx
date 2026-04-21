/**
 * Primary navigation strip (same roles/classes as `renderHeaderPrimaryNav` in the legacy portal).
 * Rendered inside the global header shell from legacy `renderHeader`.
 */
export function Sidebar({ activeId, standalone }) {
  const link = (id, href, label) => {
    const isOn = activeId === id;
    return (
      <a key={id} href={href} className={`app-header__nav-link${isOn ? " is-active" : ""}`}>
        {label}
      </a>
    );
  };

  return (
    <nav className="app-header__primary-nav" aria-label="Main navigation">
      {link("prospects", "#/list", "Prospect Management")}
      {!standalone && (
        <>
          {link("bishan", "#/bishan-clinics", "Bishan Clinic")}
          {link("fit", "#/fit-kit-tracker", "FIT Kit Tracker")}
        </>
      )}
    </nav>
  );
}
