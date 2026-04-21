/**
 * Generic panel wrapper matching `.detail-panel` chrome (tab bodies are still rendered by legacy HTML).
 */
export function DetailPanel({ id, children, className = "", ...rest }) {
  return (
    <div className={`detail-panel ${className}`.trim()} id={id} {...rest}>
      {children}
    </div>
  );
}
