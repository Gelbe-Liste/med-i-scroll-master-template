import ContentCard from "./ContentCard";
import InlineGraphic from "./InlineGraphic";
import { sanitizeDestinationPath, trackEvent } from "../tracking/piano";

export default function CtaContent({ page, project, onOpenGraphic }) {
  const cta = page.primaryCta;
  const hasInlineGraphic = Boolean(page.inlineImage);
  const pageName = project.meta.analytics.page;

  const onCta = () => {
    if (!cta?.url) return;
    trackEvent("click.action", {
      pop_in_type: "CTA",
      pop_in_name: cta.label,
      click: "Open external link",
      page: pageName,
      chapter_id: page.id,
      element_id: cta.analyticsId || cta.destinationId || `${page.id}-primary-cta`,
      destination_path: sanitizeDestinationPath(cta.url),
      trigger_source: "chapter"
    });
  };

  return (
    <ContentCard wide>
      <p className="page-kicker">{page.kicker}</p>
      <h2>{page.title}</h2>
      {page.subtitle && <p className="page-subtitle">{page.subtitle}</p>}
      {page.inlineImage && <InlineGraphic src={page.inlineImage} alt={page.inlineImageAlt || page.title} className="inline-figure--chapter chapter-cta-visual" onOpenGraphic={onOpenGraphic} />}
      {page.paragraphs?.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      {page.badges?.length > 0 && <div className="chapter-cta-badges" aria-label="Merkmale">{page.badges.map((badge) => <span key={badge}>{badge}</span>)}</div>}
      {page.bullets?.length > 0 && <ul className="editorial-list">{page.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
      {cta?.url && <div className="cta-row cta-row--final"><a className="primary-cta primary-cta--chapter" href={cta.url} target="_blank" rel="noreferrer" onClick={onCta}>{cta.label}</a></div>}
      {page.note && <div className="important-note">{page.note}</div>}
      {onOpenGraphic && !hasInlineGraphic && <div className="graphic-open-row"><button type="button" className="graphic-open-button" onClick={onOpenGraphic} aria-label="Grafik öffnen"><span className="graphic-open-button__icon" aria-hidden="true">⌕</span><span>Grafik öffnen</span></button></div>}
    </ContentCard>
  );
}
