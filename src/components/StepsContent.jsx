import ContentCard from "./ContentCard";
import InlineGraphic from "./InlineGraphic";
import WorkflowCarousel from "./WorkflowCarousel";

export default function StepsContent({ page, onOpenGraphic, pageName }) {
  const hasInlineGraphic = Boolean(page.inlineImage);

  return (
    <ContentCard wide>
      <p className="page-kicker">{page.kicker}</p>
      <h2>{page.title}</h2>
      {page.subtitle && <p className="page-subtitle">{page.subtitle}</p>}

      {page.inlineImage && (
        <InlineGraphic
          src={page.inlineImage}
          alt={page.inlineImageAlt || page.title}
          className="inline-figure--chapter"
          onOpenGraphic={onOpenGraphic}
        />
      )}

      {page.intro && <p className="page-subtitle">{page.intro}</p>}
      <WorkflowCarousel page={page} pageName={pageName} />
      {page.quote && <blockquote className="editorial-quote">{page.quote}</blockquote>}

      {onOpenGraphic && !hasInlineGraphic && (
        <div className="graphic-open-row">
          <button type="button" className="graphic-open-button" onClick={onOpenGraphic} aria-label="Grafik öffnen">
            <span className="graphic-open-button__icon" aria-hidden="true">⌕</span>
            <span>Grafik öffnen</span>
          </button>
        </div>
      )}
    </ContentCard>
  );
}
