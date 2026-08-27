export default function ProgressRail({ pages, activeIndex }) {
  const progress = pages.length > 1 ? activeIndex / (pages.length - 1) : 0;
  return (
    <div className="progress-rail" aria-hidden="true">
      <div className="progress-rail__line">
        <span style={{ transform: `scaleY(${progress})` }} />
      </div>
      <span className="progress-rail__count">
        {String(activeIndex + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}
      </span>
    </div>
  );
}
