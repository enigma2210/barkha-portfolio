export function Eyebrow({ children, className = '' }) {
  return <div className={`section-eyebrow eyebrow ${className}`.trim()}>{children}</div>;
}
