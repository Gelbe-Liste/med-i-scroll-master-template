import ContentCard from "./ContentCard";
function Quote({children}) { return <blockquote className="editorial-quote">{children}</blockquote>; }
export default function StandardContent({ page, onOpenGraphic }) {
  return <ContentCard wide={Boolean(page.wide)}>
    <p className="page-kicker">{page.kicker}</p><h2>{page.title}</h2>
    {page.subtitle && <p className="page-subtitle">{page.subtitle}</p>}
    {page.paragraphs?.map((paragraph,index)=><p key={index}>{paragraph}</p>)}
    {page.heading && <h3>{page.heading}</h3>}
    {page.bullets && <ul className="editorial-list">{page.bullets.map((item,index)=><li key={index}>{item}</li>)}</ul>}
    {page.numbered && <ol className="editorial-list editorial-list--numbered">{page.numbered.map((item,index)=><li key={index}>{item}</li>)}</ol>}
    {page.blocks?.map((block,index)=><div className="text-block" key={index}><h3>{block.heading}</h3><p>{block.text}</p></div>)}
    {page.quote && <Quote>{page.quote}</Quote>}
    {page.note && <div className="important-note">{page.note}</div>}
    {onOpenGraphic && <div className="graphic-open-row"><button className="graphic-open-button" onClick={onOpenGraphic} aria-label="Grafik öffnen"><span className="graphic-open-button__icon" aria-hidden="true">⌕</span><span>Grafik öffnen</span></button></div>}
  </ContentCard>;
}
