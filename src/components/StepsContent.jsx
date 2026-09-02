import ContentCard from "./ContentCard";
import InlineGraphic from "./InlineGraphic";

export default function StepsContent({ page, onOpenGraphic }) {
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
      <div className="steps">
        {page.steps.map((step, index) => (
          <section className="step" key={step.title}>
            <div className="step__number">{index + 1}</div>
            <div>
              <h3>{step.title}</h3>
              {step.items && (
                <ul className="editorial-list">
                  {step.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
              {step.quote && <blockquote className="editorial-quote">{step.quote}</blockquote>}
            </div>
          </section>
        ))}
      </div>
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
