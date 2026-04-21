/** Renders legacy SVG icon strings (from `icons` in portal) safely. */
export function IconHtml({ html, className, ariaHidden = true }) {
  return (
    <span
      className={className}
      aria-hidden={ariaHidden ? "true" : undefined}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
