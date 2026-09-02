export default function InlineGraphic({
  src,
  alt,
  onOpenGraphic,
  className = "",
  loading = "lazy"
}) {
  const image = (
    <img
      className={`inline-figure ${className}`.trim()}
      src={src}
      alt={alt}
      loading={loading}
    />
  );

  if (!onOpenGraphic) return image;

  return (
    <div className="inline-graphic-block">
      <button
        type="button"
        className="inline-graphic-trigger"
        onClick={onOpenGraphic}
        aria-label={`Grafik öffnen: ${alt}`}
        title="Grafik öffnen"
      >
        {image}
      </button>

      <div className="graphic-open-row graphic-open-row--inline">
        <button type="button" className="graphic-open-button" onClick={onOpenGraphic} aria-label="Grafik öffnen">
          <span className="graphic-open-button__icon" aria-hidden="true">⌕</span>
          <span>Grafik öffnen</span>
        </button>
      </div>
    </div>
  );
}
