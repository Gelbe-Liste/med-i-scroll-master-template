export default function ContentCard({ children, wide = false, className = "" }) {
  return <article className={`content-card ${wide ? "content-card--wide" : ""} ${className}`}>{children}</article>;
}
