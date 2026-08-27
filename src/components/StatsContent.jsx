import ContentCard from "./ContentCard";
export default function StatsContent({ page, onOpenGraphic }) {
  return <ContentCard wide={page.wide !== false} className="stats-card">
    <p className="page-kicker">{page.kicker}</p><h2 className="mega-stat">{page.title}</h2>
    {page.subtitle && <p className="page-subtitle">{page.subtitle}</p>}
    {page.stats?.length > 0 && <div className="stat-grid">{page.stats.map((stat,index)=><div className="stat-tile" key={`${stat.value}-${index}`}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div>}
    {page.quote && <blockquote className="editorial-quote">{page.quote}</blockquote>}
    {page.bullets?.length > 0 && <div className="country-grid">{page.bullets.map((item,index)=><span key={index}>{item}</span>)}</div>}
    {page.inlineImage && <img className="inline-figure" src={page.inlineImage} alt={page.inlineImageAlt || page.title} loading="lazy" />}
    {onOpenGraphic && <div className="graphic-open-row"><button className="graphic-open-button" onClick={onOpenGraphic} aria-label="Grafik öffnen"><span className="graphic-open-button__icon" aria-hidden="true">⌕</span><span>Grafik öffnen</span></button></div>}
  </ContentCard>;
}
