import { useEffect, useRef } from "react";

/**
 * DD-MM-YYYY field wired like `js/date-input.js` (native picker + formatting).
 */
export function DateInput({
  id,
  value,
  onChange,
  disabled,
  readOnly,
  required,
  placeholder = "DD-MM-YYYY",
  className = "",
}) {
  const wrapRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || typeof window.WD_initDateInputs !== "function") return;
    wrap.removeAttribute("data-date-bound");
    window.WD_initDateInputs(wrap);
  }, [id, disabled, readOnly]);

  return (
    <div className={`field__date ${className}`.trim()} ref={wrapRef}>
      <input
        className="field__date-text"
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        inputMode="numeric"
        autoComplete="off"
        maxLength={10}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
      />
      <button type="button" className="field__date-btn" aria-label="Choose date" title="Choose date" />
      <input type="date" className="field__date-native" tabIndex={-1} aria-hidden="true" />
    </div>
  );
}
