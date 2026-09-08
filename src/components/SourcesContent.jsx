import ContentCard from "./ContentCard";
import { sanitizeDestinationPath, trackEvent } from "../tracking/piano";

export default function SourcesContent({ page, project, onPdf, pdfGenerating = false }) {
  const pageName = project.meta.analytics.page;
  const outbound = (label, url, elementId, triggerSource) => trackEvent("click.action", {
    pop_in_type: "CTA",
    pop_in_name: label,
    click: "Open external link",
    page: pageName,
    chapter_id: page.id,
    element_id: elementId,
    destination_path: sanitizeDestinationPath(url),
    trigger_source: triggerSource
  });

  return <ContentCard wide>
    <p className="page-kicker">{page.kicker}</p><h2>{page.title}</h2>
    <div className="cta-row">
      {page.primaryCta?.url && <a className="primary-cta" href={page.primaryCta.url} target="_blank" rel="noreferrer" onClick={() => outbound(page.primaryCta.label, page.primaryCta.url, page.primaryCta.analyticsId || `${page.id}-primary-cta`, "sources")}>{page.primaryCta.label}</a>}
      <button type="button" className="secondary-cta" onClick={() => onPdf("sources")} disabled={pdfGenerating} aria-busy={pdfGenerating}>{pdfGenerating ? "PDF wird erstellt ..." : (page.pdfCtaLabel || "Inhalte als PDF erstellen")}</button>
    </div>
    <ol className="sources-list">{project.sources.map((source, index) => <li key={`${source.text}-${index}`}>{source.url ? <a href={source.url} target="_blank" rel="noreferrer" onClick={() => outbound(`Quelle ${index + 1}`, source.url, source.analyticsId || `source-${index + 1}`, "source_link")}>{source.text}</a> : source.text}</li>)}</ol>
  </ContentCard>;
}
