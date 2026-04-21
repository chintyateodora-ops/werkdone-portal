import { useEffect, useRef } from "react";

/** Time text + native picker — mirrors `js/time-input.js`. */
export function TimeInput({
  id,
  value,
  onChange,
  disabled,
  readOnly,
  required,
  placeholder,
  className = "",
}) {
  const wrapRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || typeof window.WD_initTimeInputs !== "function") return;
    wrap.removeAttribute("data-time-bound");
    window.WD_initTimeInputs(wrap);
  }, [id, disabled, readOnly]);

  return (
    <div className={`field__time ${className}`.trim()} ref={wrapRef}>
      <input
        className="field__time-text"
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
      />
      <button type="button" className="field__time-btn" aria-label="Choose time" title="Choose time" />
      <input type="time" className="field__time-native" tabIndex={-1} aria-hidden="true" />
    </div>
  );
}
