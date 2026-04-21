/**
 * Accessible toggle — same interaction model as list/kanban `aria-pressed` icon buttons.
 */
export function ToggleSwitch({ pressed, onClick, ariaLabel, children, className = "" }) {
  return (
    <button
      type="button"
      className={className}
      aria-pressed={pressed}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
