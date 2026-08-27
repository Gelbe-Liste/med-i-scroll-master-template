import ContentCard from "./ContentCard";
import { trackEvent } from "../tracking/piano";
export default function SourcesContent({ page, project, onPdf, pdfGenerating = false }) {
  const outbound=(label,url)=>trackEvent("outbound_click",{link_label:label,destination_url:url,chapter_id:page.id,module_id:project.meta.moduleId});
  return <ContentCard wide>
    <p className="page-kicker">{page.kicker}</p><h2>{page.title}</h2>
    <div className="cta-row">
      {page.primaryCta?.url && <a className="primary-cta" href={page.primaryCta.url} target="_blank" rel="noreferrer" onClick={()=>outbound(page.primaryCta.label,page.primaryCta.url)}>{page.primaryCta.label}</a>}
      <button type="button" className="secondary-cta" onClick={onPdf} disabled={pdfGenerating} aria-busy={pdfGenerating}>{pdfGenerating?"PDF wird erstellt ...":(page.pdfCtaLabel||"Inhalte als PDF erstellen")}</button>
    </div>
    <ol className="sources-list">{project.sources.map((source,index)=><li key={`${source.text}-${index}`}>{source.url?<a href={source.url} target="_blank" rel="noreferrer" onClick={()=>outbound(`Quelle ${index+1}`,source.url)}>{source.text}</a>:source.text}</li>)}</ol>
  </ContentCard>;
}
